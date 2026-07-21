import { InvestmentStatus, Prisma } from "@prisma/client";
import { Router } from "express";
import { z } from "zod";
import { ApiError, asyncHandler, hashValue, ok, pageInput, pageMeta, reference } from "../../lib/http";
import { prisma } from "../../lib/prisma";
import { requireAdmin, requireAdminRoles, requireCsrf } from "../../middleware/auth";
import { writeAudit } from "../../services/audit.service";
import { storePublicImage } from "../../services/file.service";
import { accrueAllInvestmentProfits, accrueInvestmentProfitTx, applyProfitScheduleNowTx, cancelInvestmentTx } from "../../services/investment-accrual.service";
import { captureWalletHoldTx, creditClientCashTx, releaseWalletHoldTx } from "../../services/ledger.service";
import { notifyClientTx } from "../../services/notification.service";

export const v1AdminBrokerRouter = Router();
v1AdminBrokerRouter.use(requireAdmin);
v1AdminBrokerRouter.use(requireCsrf);

const portfolioRoles = requireAdminRoles("SUPER_ADMIN", "PORTFOLIO_MANAGER");
const tradingRoles = requireAdminRoles("SUPER_ADMIN", "PORTFOLIO_MANAGER");
const complianceRoles = requireAdminRoles("SUPER_ADMIN", "COMPLIANCE");
const readRoles = requireAdminRoles("SUPER_ADMIN", "COMPLIANCE", "FINANCE", "PORTFOLIO_MANAGER", "SUPPORT", "AUDITOR");

const money = z.coerce.number().nonnegative().max(1_000_000_000);
const productSubscriptionTypes = ["FIXED", "FLEXIBLE"] as const;
const productReturnTypes = ["FIXED", "FLEXIBLE"] as const;
const productReturnModes = ["FIXED", "RANGE"] as const;
const productPayoutIntervals = ["HOURLY", "DAILY", "WEEKLY", "MONTHLY"] as const;

function slug(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

const defaultMarkets = [
  { name: "US Stocks", category: "Equities", description: "United States listed stocks and equity securities.", logoUrl: "https://api.iconify.design/lucide:chart-candlestick.svg", sortOrder: 10 },
  { name: "STOCKS", category: "Equities", description: "Major listed stocks from leading global exchanges.", logoUrl: "https://api.iconify.design/lucide:landmark.svg", sortOrder: 20 },
  { name: "Global ETFs", category: "Funds", description: "Exchange-traded funds used for diversified portfolio exposure.", logoUrl: "https://api.iconify.design/lucide:globe-2.svg", sortOrder: 30 },
  { name: "Crypto", category: "Digital Assets", description: "Major crypto assets and tokenized digital asset exposure.", logoUrl: "https://api.iconify.design/lucide:bitcoin.svg", sortOrder: 40 },
  { name: "Forex", category: "Currencies", description: "Foreign exchange pairs and currency exposure.", logoUrl: "https://api.iconify.design/lucide:circle-dollar-sign.svg", sortOrder: 50 },
  { name: "Commodities", category: "Commodities", description: "Gold, energy, agriculture, and other commodity-linked assets.", logoUrl: "https://api.iconify.design/lucide:gem.svg", sortOrder: 60 },
  { name: "Bonds", category: "Fixed Income", description: "Government, treasury, and corporate fixed-income instruments.", logoUrl: "https://api.iconify.design/lucide:landmark.svg", sortOrder: 70 },
  { name: "Mutual Funds", category: "Funds", description: "Managed fund instruments for portfolio construction.", logoUrl: "https://api.iconify.design/lucide:hand-coins.svg", sortOrder: 80 },
  { name: "Money Market", category: "Cash Management", description: "Treasury bills, cash equivalents, and short-duration income assets.", logoUrl: "https://api.iconify.design/lucide:banknote.svg", sortOrder: 90 },
  { name: "Private Credit", category: "Alternatives", description: "Private debt and structured income opportunities.", logoUrl: "https://api.iconify.design/lucide:badge-dollar-sign.svg", sortOrder: 100 }
];

async function ensureDefaultMarkets() {
  for (const market of defaultMarkets) {
    await prisma.market.upsert({
      where: { slug: slug(market.name) },
      update: { logoUrl: market.logoUrl },
      create: { ...market, slug: slug(market.name), status: "ACTIVE" }
    });
  }
}

async function activeMarketByName(name: string) {
  await ensureDefaultMarkets();
  return prisma.market.findFirst({ where: { name: { equals: name, mode: "insensitive" }, status: "ACTIVE" } });
}

async function activeMarketById(id: string) {
  await ensureDefaultMarkets();
  return prisma.market.findFirst({ where: { id, status: "ACTIVE" } });
}

async function pendingApproval(tx: Prisma.TransactionClient, actionType: string, entityType: string, entityId: string, adminId: string, payload: Prisma.InputJsonObject) {
  const existing = await tx.approvalRequest.findFirst({ where: { actionType, entityType, entityId, status: "PENDING" } });
  if (existing) return existing;
  return tx.approvalRequest.create({
    data: { actionType, entityType, entityId, initiatedByAdminId: adminId, payload, payloadHash: hashValue(JSON.stringify(payload)), expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000) }
  });
}

async function cancelPendingProductPublication(tx: Prisma.TransactionClient, productId: string, reason: string) {
  await tx.approvalRequest.updateMany({
    where: { actionType: "PUBLISH_PRODUCT", entityType: "PortfolioProduct", entityId: productId, status: "PENDING" },
    data: { status: "REJECTED", decisionNote: reason, decidedAt: new Date() }
  });
  await tx.portfolioProductVersion.updateMany({
    where: { productId, status: "PENDING_APPROVAL" },
    data: { status: "DRAFT" }
  });
}

v1AdminBrokerRouter.get("/portfolio-products", readRoles, asyncHandler(async (req, res) => {
  const status = typeof req.query.status === "string" ? req.query.status : undefined;
  const rows = await prisma.portfolioProduct.findMany({ where: status ? { status: status as never } : {}, include: { allocations: { where: { effectiveTo: null }, include: { instrument: true } }, feeRules: true, versions: { orderBy: { version: "desc" }, take: 3 }, _count: { select: { investments: true } } }, orderBy: { updatedAt: "desc" } });
  return ok(res, rows);
}));

v1AdminBrokerRouter.get("/portfolio-products/:id", readRoles, asyncHandler(async (req, res) => {
  const row = await prisma.portfolioProduct.findUnique({ where: { id: String(req.params.id) }, include: { allocations: { include: { instrument: true }, orderBy: { targetWeight: "desc" } }, feeRules: true, versions: { orderBy: { version: "desc" } }, investments: { include: { client: true }, orderBy: { updatedAt: "desc" } } } });
  if (!row) throw new ApiError(404, "Portfolio product was not found", "PORTFOLIO_NOT_FOUND");
  return ok(res, row);
}));

const productSchema = z.object({
  name: z.string().trim().min(3).max(120),
  description: z.string().trim().min(10).max(4000),
  riskLevel: z.enum(["LOW", "MODERATE", "HIGH", "CUSTOM"]),
  minimum: z.coerce.number().positive(),
  subscriptionType: z.enum(productSubscriptionTypes).default("FLEXIBLE"),
  currency: z.string().length(3).default("USD"),
  payoutRule: z.string().trim().min(3).max(200),
  payoutInterval: z.enum(productPayoutIntervals).default("HOURLY"),
  durationDays: z.coerce.number().int().positive().optional(),
  payoutCycleCount: z.coerce.number().int().nonnegative().max(120).default(0),
  projectedReturnMin: z.coerce.number().nonnegative().max(100).optional(),
  projectedReturnMax: z.coerce.number().nonnegative().max(100).optional(),
  projectedReturnType: z.enum(productReturnTypes).default("FLEXIBLE"),
  projectedReturnMode: z.enum(productReturnModes).default("RANGE"),
  bannerUrl: z.string().trim().max(1000).optional().transform((value) => value || undefined),
  disclosure: z.string().trim().min(20).max(4000).default("Returns are projected and market-based. Capital and income are not guaranteed."),
  eligibility: z.record(z.string(), z.unknown()).default({})
}).superRefine((value, ctx) => {
  if (value.projectedReturnType === "FIXED" && value.projectedReturnMode !== "FIXED") {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["projectedReturnMode"], message: "Fixed projected returns must use fixed return mode" });
  }
  if (value.projectedReturnType === "FLEXIBLE" && value.projectedReturnMode !== "RANGE") {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["projectedReturnMode"], message: "Flexible projected returns must use range mode" });
  }
  if (value.projectedReturnMode === "FIXED") {
    if (value.projectedReturnMin === undefined) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["projectedReturnMin"], message: "Enter the fixed projected return" });
    }
    if (value.projectedReturnMax !== undefined && value.projectedReturnMin !== undefined && value.projectedReturnMax !== value.projectedReturnMin) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["projectedReturnMax"], message: "Fixed projected return must use one value" });
    }
  }
  if (value.projectedReturnMode === "RANGE") {
    if (value.projectedReturnMin === undefined) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["projectedReturnMin"], message: "Enter projected return minimum" });
    if (value.projectedReturnMax === undefined) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["projectedReturnMax"], message: "Enter projected return maximum" });
    if (value.projectedReturnMin !== undefined && value.projectedReturnMax !== undefined && value.projectedReturnMin > value.projectedReturnMax) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["projectedReturnMin"], message: "Projected return minimum cannot exceed maximum" });
    }
  }
}).transform((value) => ({
  ...value,
  projectedReturnMax: value.projectedReturnMode === "FIXED" ? value.projectedReturnMin : value.projectedReturnMax
}));

v1AdminBrokerRouter.post("/portfolio-products/banner-upload", portfolioRoles, asyncHandler(async (req, res) => {
  const input = z.object({
    fileName: z.string().trim().min(1).max(160),
    mimeType: z.enum(["image/jpeg", "image/png", "image/webp"]),
    base64: z.string().min(4)
  }).parse(req.body);
  const file = await storePublicImage({ ownerType: "ADMIN", ownerId: req.user!.id, category: "PRODUCT_BANNER", ...input });
  await writeAudit("uploadPortfolioProductBanner", "StoredFile", file.id, undefined, { req, after: { fileName: file.fileName, url: file.url } });
  return ok(res, { id: file.id, url: file.url }, 201);
}));

v1AdminBrokerRouter.patch("/portfolio-products/:id/banner", portfolioRoles, asyncHandler(async (req, res) => {
  const input = z.object({
    bannerUrl: z.string().trim().max(1000).optional(),
    clear: z.boolean().optional()
  }).parse(req.body);
  const before = await prisma.portfolioProduct.findUnique({ where: { id: String(req.params.id) } });
  if (!before) throw new ApiError(404, "Portfolio product was not found", "PORTFOLIO_NOT_FOUND");
  if (!input.clear && !input.bannerUrl) throw new ApiError(422, "Upload or paste a banner image URL before saving", "BANNER_URL_REQUIRED");
  const row = await prisma.portfolioProduct.update({ where: { id: before.id }, data: { bannerUrl: input.clear ? null : input.bannerUrl } });
  await writeAudit("updatePortfolioProductBanner", "PortfolioProduct", row.id, undefined, { req, before: { bannerUrl: before.bannerUrl }, after: { bannerUrl: row.bannerUrl } });
  return ok(res, row);
}));

v1AdminBrokerRouter.post("/portfolio-products", portfolioRoles, asyncHandler(async (req, res) => {
  const input = productSchema.parse(req.body);
  const data = { ...input, eligibility: input.eligibility as Prisma.InputJsonObject };
  const row = await prisma.portfolioProduct.create({
    data: {
      ...data,
      slug: slug(input.name),
      status: "DRAFT",
      versions: { create: { version: 1, terms: data as Prisma.InputJsonObject, status: "DRAFT", createdBy: req.user!.id } }
    },
    include: { versions: true }
  });
  await writeAudit("createPortfolioProduct", "PortfolioProduct", row.id, undefined, { req });
  return ok(res, row, 201);
}));

v1AdminBrokerRouter.put("/portfolio-products/:id", portfolioRoles, asyncHandler(async (req, res) => {
  const input = productSchema.parse(req.body);
  const data = { ...input, eligibility: input.eligibility as Prisma.InputJsonObject };
  const before = await prisma.portfolioProduct.findUnique({ where: { id: String(req.params.id) } });
  if (!before) throw new ApiError(404, "Portfolio product was not found", "PORTFOLIO_NOT_FOUND");
  const nextVersion = before.version + 1;
  const row = await prisma.$transaction(async (tx) => {
    await cancelPendingProductPublication(tx, before.id, "Superseded by a product terms update");
    const updated = await tx.portfolioProduct.update({ where: { id: before.id }, data: { ...data, slug: slug(input.name), status: "DRAFT", version: nextVersion, publishedAt: null } });
    await tx.portfolioProductVersion.create({ data: { productId: before.id, version: nextVersion, terms: data as Prisma.InputJsonObject, status: "DRAFT", createdBy: req.user!.id } });
    return updated;
  });
  await writeAudit("updatePortfolioProduct", "PortfolioProduct", row.id, undefined, { req, before, after: row });
  return ok(res, row);
}));

const allocationItemSchema = z.object({
  instrumentId: z.string().min(1),
  targetWeight: z.coerce.number().positive().max(100),
  minimumWeight: z.coerce.number().nonnegative().max(100).optional(),
  maximumWeight: z.coerce.number().positive().max(100).optional()
}).superRefine((value, ctx) => {
  if (value.minimumWeight !== undefined && value.minimumWeight > value.targetWeight) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["minimumWeight"], message: "Minimum weight cannot exceed target weight" });
  }
  if (value.maximumWeight !== undefined && value.maximumWeight < value.targetWeight) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["maximumWeight"], message: "Maximum weight cannot be below target weight" });
  }
});

const allocationSchema = z.object({ allocations: z.array(allocationItemSchema).min(1) }).superRefine((value, ctx) => {
  const instrumentIds = value.allocations.map((item) => item.instrumentId);
  if (new Set(instrumentIds).size !== instrumentIds.length) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["allocations"], message: "Each instrument can appear only once" });
  }
});

v1AdminBrokerRouter.put("/portfolio-products/:id/allocations", portfolioRoles, asyncHandler(async (req, res) => {
  const input = allocationSchema.parse(req.body);
  const total = input.allocations.reduce((sum, item) => sum + item.targetWeight, 0);
  if (Math.abs(total - 100) > 0.001) throw new ApiError(422, "Target allocations must total 100%", "ALLOCATION_TOTAL_INVALID");
  const productId = String(req.params.id);
  const rows = await prisma.$transaction(async (tx) => {
    const product = await tx.portfolioProduct.findUnique({ where: { id: productId } });
    if (!product) throw new ApiError(404, "Portfolio product was not found", "PORTFOLIO_NOT_FOUND");
    const instruments = await tx.instrument.findMany({ where: { id: { in: input.allocations.map((item) => item.instrumentId) } } });
    if (instruments.length !== input.allocations.length) throw new ApiError(422, "One or more allocation instruments were not found", "ALLOCATION_INSTRUMENT_NOT_FOUND");
    if (instruments.some((instrument) => instrument.status !== "ACTIVE" || !instrument.investable)) {
      throw new ApiError(422, "Every allocation instrument must be active and investable", "ALLOCATION_INSTRUMENT_UNAVAILABLE");
    }
    await cancelPendingProductPublication(tx, productId, "Superseded by a portfolio allocation update");
    await tx.portfolioAllocation.updateMany({ where: { productId, effectiveTo: null }, data: { effectiveTo: new Date() } });
    await tx.portfolioProduct.update({ where: { id: productId }, data: { status: "DRAFT", publishedAt: null } });
    await tx.portfolioAllocation.createMany({ data: input.allocations.map((item) => ({ productId, instrumentId: item.instrumentId, targetWeight: item.targetWeight, minimumWeight: item.minimumWeight, maximumWeight: item.maximumWeight })) });
    return tx.portfolioAllocation.findMany({ where: { productId, effectiveTo: null }, include: { instrument: true } });
  });
  await writeAudit("updatePortfolioAllocation", "PortfolioProduct", productId, { totalWeight: total, instruments: rows.length }, { req });
  return ok(res, rows);
}));

v1AdminBrokerRouter.put("/portfolio-products/:id/fees", portfolioRoles, asyncHandler(async (req, res) => {
  const input = z.object({ fees: z.array(z.object({ name: z.string().min(2).max(100), type: z.enum(["MANAGEMENT", "PERFORMANCE", "BROKERAGE", "WITHDRAWAL"]), rate: z.coerce.number().nonnegative().max(1).optional(), flatAmount: z.coerce.number().nonnegative().optional(), currency: z.string().length(3).default("USD"), appliesTo: z.string().min(2).max(80) })) }).parse(req.body);
  const productId = String(req.params.id);
  const rows = await prisma.$transaction(async (tx) => {
    await tx.feeRule.updateMany({ where: { productId }, data: { active: false } });
    await tx.feeRule.createMany({ data: input.fees.map((fee) => ({ ...fee, productId })) });
    return tx.feeRule.findMany({ where: { productId, active: true } });
  });
  return ok(res, rows);
}));

v1AdminBrokerRouter.post("/portfolio-products/:id/request-publication", portfolioRoles, asyncHandler(async (req, res) => {
  const input = z.object({ note: z.string().trim().min(5).max(1000) }).parse(req.body);
  const productId = String(req.params.id);
  const approval = await prisma.$transaction(async (tx) => {
    const product = await tx.portfolioProduct.findUnique({
      where: { id: productId },
      include: { allocations: { where: { effectiveTo: null }, include: { instrument: true } } }
    });
    if (!product) throw new ApiError(404, "Portfolio product was not found", "PORTFOLIO_NOT_FOUND");
    if (product.status === "PUBLISHED") throw new ApiError(409, "This product is already published", "PRODUCT_ALREADY_PUBLISHED");
    if (product.status === "ARCHIVED") throw new ApiError(409, "An archived product cannot be published", "INVALID_PRODUCT_STATE");
    if (!product.allocations.length) throw new ApiError(422, "Portfolio allocation is required before publication", "ALLOCATION_REQUIRED");
    const total = product.allocations.reduce((sum, item) => sum + Number(item.targetWeight), 0);
    if (Math.abs(total - 100) > 0.001) throw new ApiError(422, "Portfolio allocations must total 100%", "ALLOCATION_TOTAL_INVALID");
    if (product.allocations.some((allocation) => allocation.instrument.status !== "ACTIVE" || !allocation.instrument.investable)) {
      throw new ApiError(422, "Every allocation instrument must be active and investable", "ALLOCATION_INSTRUMENT_UNAVAILABLE");
    }
    const version = await tx.portfolioProductVersion.findUnique({ where: { productId_version: { productId: product.id, version: product.version } } });
    if (!version) throw new ApiError(409, "The current product terms version is missing", "PRODUCT_VERSION_REQUIRED");
    const request = await pendingApproval(tx, "PUBLISH_PRODUCT", "PortfolioProduct", product.id, req.user!.id, { note: input.note, version: product.version, productName: product.name });
    await tx.portfolioProduct.update({ where: { id: product.id }, data: { status: "PENDING_APPROVAL" } });
    await tx.portfolioProductVersion.update({ where: { productId_version: { productId: product.id, version: product.version } }, data: { status: "PENDING_APPROVAL" } });
    return request;
  }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
  await writeAudit("requestProductPublication", "PortfolioProduct", productId, { approvalId: approval.id }, { req, reason: input.note });
  return ok(res, approval, 201);
}));

v1AdminBrokerRouter.patch("/portfolio-products/:id/status", portfolioRoles, asyncHandler(async (req, res) => {
  const input = z.object({ status: z.enum(["DRAFT", "REVIEW", "HIDDEN", "ARCHIVED"]), note: z.string().trim().min(5).max(1000) }).parse(req.body);
  const before = await prisma.portfolioProduct.findUnique({ where: { id: String(req.params.id) } });
  if (!before) throw new ApiError(404, "Portfolio product was not found", "PORTFOLIO_NOT_FOUND");
  const row = await prisma.$transaction(async (tx) => {
    if (before.status === "PENDING_APPROVAL") await cancelPendingProductPublication(tx, before.id, `Publication cancelled when product moved to ${input.status}`);
    return tx.portfolioProduct.update({ where: { id: before.id }, data: { status: input.status, ...(input.status === "DRAFT" ? { publishedAt: null } : {}) } });
  });
  await writeAudit("changePortfolioProductStatus", "PortfolioProduct", row.id, { from: before.status, to: input.status }, { req, reason: input.note });
  return ok(res, row);
}));

const marketSchema = z.object({
  name: z.string().trim().min(2).max(80),
  category: z.string().trim().min(2).max(80),
  description: z.string().trim().max(500).optional(),
  logoUrl: z.string().trim().url().max(500).optional(),
  status: z.enum(["ACTIVE", "DISABLED"]).default("ACTIVE"),
  sortOrder: z.coerce.number().int().min(0).max(10_000).default(100)
});

v1AdminBrokerRouter.get("/markets", readRoles, asyncHandler(async (_req, res) => {
  await ensureDefaultMarkets();
  const rows = await prisma.market.findMany({ orderBy: [{ sortOrder: "asc" }, { name: "asc" }] });
  return ok(res, rows);
}));

v1AdminBrokerRouter.post("/markets", portfolioRoles, asyncHandler(async (req, res) => {
  const input = marketSchema.parse(req.body);
  const row = await prisma.market.create({ data: { ...input, slug: slug(input.name) } });
  await writeAudit("createMarket", "Market", row.id, { name: row.name, status: row.status }, { req });
  return ok(res, row, 201);
}));

v1AdminBrokerRouter.patch("/markets/:id", portfolioRoles, asyncHandler(async (req, res) => {
  const input = marketSchema.partial().parse(req.body);
  const data = input.name ? { ...input, slug: slug(input.name) } : input;
  const row = await prisma.market.update({ where: { id: String(req.params.id) }, data });
  await writeAudit("updateMarket", "Market", row.id, { name: row.name, status: row.status }, { req });
  return ok(res, row);
}));

v1AdminBrokerRouter.get("/instruments", readRoles, asyncHandler(async (req, res) => {
  const category = typeof req.query.category === "string" ? req.query.category : undefined;
  const marketId = typeof req.query.marketId === "string" ? req.query.marketId : undefined;
  const q = typeof req.query.q === "string" ? req.query.q.trim() : "";
  const { page, limit, skip } = pageInput(req.query);
  const where: Prisma.InstrumentWhereInput = {
    ...(category ? { category: { equals: category, mode: "insensitive" } } : {}),
    ...(marketId ? { marketId } : {}),
    ...(q ? {
      OR: [
        { symbol: { contains: q, mode: "insensitive" } },
        { name: { contains: q, mode: "insensitive" } },
        { category: { contains: q, mode: "insensitive" } },
        { market: { contains: q, mode: "insensitive" } },
        { marketRecord: { name: { contains: q, mode: "insensitive" } } }
      ]
    } : {})
  };
  const include = { marketRecord: true, prices: { orderBy: { asOf: "desc" as const }, take: 10 }, _count: { select: { orders: true, positions: true, allocations: true } } };
  const orderBy = [{ marketRecord: { sortOrder: "asc" as const } }, { symbol: "asc" as const }];
  const paginated = "page" in req.query || "limit" in req.query || Boolean(q) || Boolean(marketId);
  if (paginated) {
    const [rows, total] = await Promise.all([
      prisma.instrument.findMany({ where, include, orderBy, skip, take: limit }),
      prisma.instrument.count({ where })
    ]);
    return ok(res, rows, 200, pageMeta(page, limit, total));
  }
  const rows = await prisma.instrument.findMany({ where, include, orderBy });
  return ok(res, rows);
}));

v1AdminBrokerRouter.get("/exchange-rates", readRoles, asyncHandler(async (req, res) => {
  const baseCurrency = typeof req.query.baseCurrency === "string" ? req.query.baseCurrency.toUpperCase() : undefined;
  const quoteCurrency = typeof req.query.quoteCurrency === "string" ? req.query.quoteCurrency.toUpperCase() : undefined;
  const rows = await prisma.exchangeRateSnapshot.findMany({
    where: { ...(baseCurrency ? { baseCurrency } : {}), ...(quoteCurrency ? { quoteCurrency } : {}) },
    orderBy: { asOf: "desc" },
    take: 250
  });
  return ok(res, rows);
}));

v1AdminBrokerRouter.post("/exchange-rates", portfolioRoles, asyncHandler(async (req, res) => {
  const input = z.object({
    baseCurrency: z.string().trim().min(2).max(10).transform((value) => value.toUpperCase()),
    quoteCurrency: z.string().trim().min(2).max(10).transform((value) => value.toUpperCase()),
    rate: z.coerce.number().positive(),
    source: z.string().trim().min(2).max(100).default("Admin managed"),
    asOf: z.coerce.date().default(() => new Date()),
    metadata: z.record(z.string(), z.unknown()).optional()
  }).refine((value) => value.baseCurrency !== value.quoteCurrency, { message: "Currency pair must contain two different currencies", path: ["quoteCurrency"] }).parse(req.body);
  const row = await prisma.exchangeRateSnapshot.create({
    data: { ...input, metadata: input.metadata as Prisma.InputJsonObject | undefined, createdBy: req.user!.id }
  });
  await writeAudit("postExchangeRate", "ExchangeRateSnapshot", row.id, { pair: `${row.baseCurrency}/${row.quoteCurrency}`, rate: input.rate, source: input.source }, { req });
  return ok(res, row, 201);
}));

const instrumentSchema = z.object({
  symbol: z.string().trim().min(1).max(30).transform((value) => value.toUpperCase()),
  name: z.string().trim().min(2).max(160),
  category: z.string().trim().min(2).max(60),
  marketId: z.string().trim().min(1).optional(),
  market: z.string().trim().min(2).max(60).optional(),
  logoUrl: z.string().trim().url().max(500).optional(),
  currency: z.string().length(3).default("USD"),
  riskLevel: z.enum(["LOW", "MODERATE", "HIGH", "CUSTOM"]),
  dividendEligible: z.boolean().default(false),
  tradable: z.boolean().default(false),
  investable: z.boolean().default(true),
  status: z.enum(["ACTIVE", "INACTIVE", "SUSPENDED", "RESTRICTED"]).default("ACTIVE")
}).refine((value) => value.marketId || value.market, { message: "Select a market before saving an instrument", path: ["marketId"] });

async function resolveInstrumentMarket(input: z.infer<typeof instrumentSchema>) {
  const market = input.marketId ? await activeMarketById(input.marketId) : input.market ? await activeMarketByName(input.market) : null;
  if (!market) throw new ApiError(422, "Select an enabled market before saving an instrument", "MARKET_UNAVAILABLE");
  return market;
}

v1AdminBrokerRouter.post("/instruments", portfolioRoles, asyncHandler(async (req, res) => {
  const input = instrumentSchema.parse(req.body);
  const market = await resolveInstrumentMarket(input);
  const row = await prisma.instrument.create({ data: { ...input, marketId: market.id, market: market.name } });
  await writeAudit("createInstrument", "Instrument", row.id, undefined, { req });
  return ok(res, row, 201);
}));

v1AdminBrokerRouter.put("/instruments/:id", portfolioRoles, asyncHandler(async (req, res) => {
  const input = instrumentSchema.parse(req.body);
  const market = await resolveInstrumentMarket(input);
  const row = await prisma.instrument.update({ where: { id: String(req.params.id) }, data: { ...input, marketId: market.id, market: market.name } });
  await writeAudit("updateInstrument", "Instrument", row.id, undefined, { req });
  return ok(res, row);
}));

v1AdminBrokerRouter.post("/instruments/:id/prices", portfolioRoles, asyncHandler(async (req, res) => {
  const input = z.object({ price: z.coerce.number().positive(), bid: z.coerce.number().positive().optional(), ask: z.coerce.number().positive().optional(), asOf: z.coerce.date().default(() => new Date()), source: z.string().trim().min(2).max(100).default("Admin managed") }).parse(req.body);
  const instrument = await prisma.instrument.findUnique({ where: { id: String(req.params.id) } });
  if (!instrument) throw new ApiError(404, "Instrument was not found", "INSTRUMENT_NOT_FOUND");
  const snapshot = await prisma.$transaction(async (tx) => {
    const price = await tx.priceSnapshot.create({ data: { instrumentId: instrument.id, price: input.price, bid: input.bid, ask: input.ask, currency: instrument.currency, source: input.source, asOf: input.asOf } });
    await tx.instrument.update({ where: { id: instrument.id }, data: { currentPrice: input.price, priceAsOf: input.asOf, priceSource: input.source } });
    return price;
  });
  await writeAudit("postInstrumentPrice", "Instrument", instrument.id, { price: input.price, source: input.source }, { req });
  return ok(res, snapshot, 201);
}));

v1AdminBrokerRouter.get("/investments", readRoles, asyncHandler(async (req, res) => {
  await accrueAllInvestmentProfits();
  const { page, limit, skip } = pageInput(req.query);
  const status = typeof req.query.status === "string" ? req.query.status : undefined;
  const where: Prisma.ClientInvestmentWhereInput = status ? { status: status as never } : {};
  const [rows, total] = await Promise.all([prisma.clientInvestment.findMany({ where, include: { client: true, product: true, valuations: { orderBy: { asOf: "desc" }, take: 3 } }, orderBy: { updatedAt: "desc" }, skip, take: limit }), prisma.clientInvestment.count({ where })]);
  return ok(res, rows, 200, pageMeta(page, limit, total));
}));

v1AdminBrokerRouter.post("/investments/:id/hold", portfolioRoles, asyncHandler(async (req, res) => {
  const input = z.object({ note: z.string().trim().min(5).max(1000) }).parse(req.body);
  const row = await prisma.$transaction(async (tx) => {
    const investment = await tx.clientInvestment.findUnique({ where: { id: String(req.params.id) }, include: { product: true, client: true } });
    if (!investment) throw new ApiError(404, "Investment was not found", "INVESTMENT_NOT_FOUND");
    if (["CANCELLED", "CLOSED"].includes(investment.status)) throw new ApiError(409, "Closed investments cannot be placed on hold", "INVESTMENT_CLOSED");
    const accrued = await accrueInvestmentProfitTx(tx, investment);
    const updated = await tx.clientInvestment.update({
      where: { id: accrued.id },
      data: { status: "HELD", nextAction: `Payouts paused by admin: ${input.note}`, profitAccruedAt: new Date() },
      include: { client: true, product: true }
    });
    await notifyClientTx(tx, { clientId: updated.clientId, category: "Investment", title: "Investment placed on hold", body: `${updated.product.name} payouts are paused while BullPort reviews the mandate.`, actionUrl: "active-investments.html", entity: { type: "ClientInvestment", id: updated.id }, metadata: { note: input.note } });
    return updated;
  });
  await writeAudit("holdInvestment", "ClientInvestment", row.id, undefined, { req, reason: input.note });
  return ok(res, row);
}));

v1AdminBrokerRouter.post("/investments/:id/resume", portfolioRoles, asyncHandler(async (req, res) => {
  const input = z.object({ note: z.string().trim().min(5).max(1000) }).parse(req.body);
  const row = await prisma.$transaction(async (tx) => {
    const investment = await tx.clientInvestment.findUnique({ where: { id: String(req.params.id) }, include: { product: true, client: true } });
    if (!investment) throw new ApiError(404, "Investment was not found", "INVESTMENT_NOT_FOUND");
    if (investment.status !== "HELD") throw new ApiError(409, "Only held investments can be resumed", "INVESTMENT_NOT_HELD");
    const updated = await tx.clientInvestment.update({
      where: { id: investment.id },
      data: { status: "ACTIVE", nextAction: `Payouts resumed by admin: ${input.note}`, profitAccruedAt: new Date() },
      include: { client: true, product: true }
    });
    await notifyClientTx(tx, { clientId: updated.clientId, category: "Investment", title: "Investment resumed", body: `${updated.product.name} is active again and payout accrual has resumed.`, actionUrl: "active-investments.html", entity: { type: "ClientInvestment", id: updated.id }, metadata: { note: input.note } });
    return updated;
  });
  await writeAudit("resumeInvestment", "ClientInvestment", row.id, undefined, { req, reason: input.note });
  return ok(res, row);
}));

v1AdminBrokerRouter.post("/investments/:id/cancel", portfolioRoles, asyncHandler(async (req, res) => {
  const input = z.object({ note: z.string().trim().min(5).max(1000) }).parse(req.body);
  const row = await prisma.$transaction((tx) => cancelInvestmentTx(tx, {
    investmentId: String(req.params.id),
    actorId: req.user!.id,
    actorLabel: "Admin",
    note: input.note
  }));
  await writeAudit("cancelInvestment", "ClientInvestment", row.id, undefined, { req, reason: input.note });
  return ok(res, row);
}));

v1AdminBrokerRouter.post("/investments/:id/valuation", portfolioRoles, asyncHandler(async (req, res) => {
  const input = z.object({ value: z.coerce.number().nonnegative(), asOf: z.coerce.date().default(() => new Date()), source: z.string().trim().min(2).max(100).default("Admin managed valuation") }).parse(req.body);
  const investment = await prisma.clientInvestment.findUnique({ where: { id: String(req.params.id) } });
  if (!investment) throw new ApiError(404, "Investment was not found", "INVESTMENT_NOT_FOUND");
  const unitPrice = investment.units.isPositive() ? new Prisma.Decimal(input.value).div(investment.units) : new Prisma.Decimal(1);
  const row = await prisma.$transaction(async (tx) => {
    const valuation = await tx.investmentValuation.create({ data: { investmentId: investment.id, value: input.value, unitPrice, source: input.source, asOf: input.asOf } });
    await tx.clientInvestment.update({ where: { id: investment.id }, data: { currentValue: input.value } });
    return valuation;
  });
  return ok(res, row, 201);
}));

v1AdminBrokerRouter.get("/orders", readRoles, asyncHandler(async (req, res) => {
  const status = typeof req.query.status === "string" ? req.query.status : undefined;
  const rows = await prisma.order.findMany({ where: status ? { status: status as never } : {}, include: { client: true, instrument: true, fills: true }, orderBy: { submittedAt: "desc" } });
  return ok(res, rows);
}));

v1AdminBrokerRouter.post("/orders/:id/approve", tradingRoles, asyncHandler(async (req, res) => {
  const input = z.object({ note: z.string().trim().min(5).max(1000) }).parse(req.body);
  const order = await prisma.order.findUnique({ where: { id: String(req.params.id) } });
  if (!order || order.status !== "PENDING_REVIEW") throw new ApiError(409, "Order is not awaiting review", "INVALID_ORDER_STATE");
  const row = await prisma.order.update({ where: { id: order.id }, data: { status: "APPROVED", approvedBy: req.user!.id, approvedAt: new Date() } });
  await writeAudit("approveOrder", "Order", row.id, undefined, { req, reason: input.note });
  return ok(res, row);
}));

v1AdminBrokerRouter.post("/orders/:id/reject", tradingRoles, asyncHandler(async (req, res) => {
  const input = z.object({ reason: z.string().trim().min(5).max(1000) }).parse(req.body);
  const order = await prisma.order.findUnique({ where: { id: String(req.params.id) } });
  if (!order || !["PENDING_REVIEW", "APPROVED"].includes(order.status)) throw new ApiError(409, "Order cannot be rejected from its current state", "INVALID_ORDER_STATE");
  const row = await prisma.$transaction(async (tx) => {
    if (order.holdReference) await releaseWalletHoldTx(tx, order.holdReference);
    await notifyClientTx(tx, { clientId: order.clientId, category: "Trading", title: "Order request rejected", body: input.reason, actionUrl: "orders.html", entity: { type: "Order", id: order.id } });
    return tx.order.update({ where: { id: order.id }, data: { status: "REJECTED", rejectionReason: input.reason } });
  });
  await writeAudit("rejectOrder", "Order", row.id, undefined, { req, reason: input.reason });
  return ok(res, row);
}));

v1AdminBrokerRouter.post("/orders/:id/fill", tradingRoles, asyncHandler(async (req, res) => {
  const input = z.object({ price: z.coerce.number().positive(), quantity: z.coerce.number().positive(), fee: z.coerce.number().nonnegative().default(0), executedAt: z.coerce.date().default(() => new Date()), externalReference: z.string().trim().max(120).optional(), note: z.string().trim().min(5).max(1000) }).parse(req.body);
  const order = await prisma.order.findUnique({ where: { id: String(req.params.id) }, include: { instrument: true, fills: true } });
  if (!order || order.status !== "APPROVED") throw new ApiError(409, "Order must be approved before a fill can be recorded", "ORDER_NOT_APPROVED");
  if (order.fills.length) throw new ApiError(409, "This beta currently records one complete fill per order", "ORDER_ALREADY_FILLED");
  if (!new Prisma.Decimal(input.quantity).equals(order.quantity)) throw new ApiError(422, "Fill quantity must equal the approved order quantity", "PARTIAL_FILL_UNSUPPORTED");
  const gross = new Prisma.Decimal(input.price).mul(input.quantity);
  const fee = new Prisma.Decimal(input.fee);
  const settlement = order.side === "BUY" ? gross.plus(fee) : gross.minus(fee);
  if (!settlement.isPositive()) throw new ApiError(422, "Settlement amount must be positive", "INVALID_SETTLEMENT");

  const result = await prisma.$transaction(async (tx) => {
    let ledgerId: string;
    const position = await tx.position.findUnique({ where: { clientId_instrumentId: { clientId: order.clientId, instrumentId: order.instrumentId } } });
    if (order.side === "BUY") {
      if (!order.holdReference) throw new ApiError(409, "Buy order has no reserved wallet funds", "ORDER_HOLD_MISSING");
      const ledger = await captureWalletHoldTx(tx, order.holdReference, { clientId: order.clientId, description: `Trade settlement ${order.reference}`, type: "TRADE", captureAmount: settlement, idempotencyKey: `trade:${order.id}`, externalReference: input.externalReference, initiatedBy: order.clientId, approvedBy: req.user!.id });
      ledgerId = ledger.id;
      const previousQuantity = position ? new Prisma.Decimal(position.quantity) : new Prisma.Decimal(0);
      const previousCost = position ? previousQuantity.mul(position.averageCost) : new Prisma.Decimal(0);
      const nextQuantity = previousQuantity.plus(input.quantity);
      const averageCost = previousCost.plus(gross).div(nextQuantity);
      await tx.position.upsert({
        where: { clientId_instrumentId: { clientId: order.clientId, instrumentId: order.instrumentId } },
        update: { quantity: nextQuantity, averageCost, marketValue: nextQuantity.mul(input.price), unrealizedPnl: 0 },
        create: { clientId: order.clientId, instrumentId: order.instrumentId, quantity: nextQuantity, averageCost, marketValue: nextQuantity.mul(input.price) }
      });
    } else {
      if (!position || new Prisma.Decimal(position.quantity).lessThan(input.quantity)) throw new ApiError(409, "Position quantity is insufficient", "INSUFFICIENT_POSITION");
      const ledger = await creditClientCashTx(tx, { clientId: order.clientId, amount: settlement, type: "TRADE", description: `Trade sale settlement ${order.reference}`, currency: order.currency, idempotencyKey: `trade:${order.id}`, externalReference: input.externalReference, initiatedBy: order.clientId, approvedBy: req.user!.id });
      ledgerId = ledger.id;
      const nextQuantity = new Prisma.Decimal(position.quantity).minus(input.quantity);
      const realized = gross.minus(new Prisma.Decimal(position.averageCost).mul(input.quantity)).minus(fee);
      await tx.position.update({ where: { id: position.id }, data: { quantity: nextQuantity, marketValue: nextQuantity.mul(input.price), realizedPnl: { increment: realized }, unrealizedPnl: 0 } });
    }
    const fill = await tx.tradeFill.create({ data: { orderId: order.id, quantity: input.quantity, price: input.price, fee, executedAt: input.executedAt, externalReference: input.externalReference } });
    const updated = await tx.order.update({ where: { id: order.id }, data: { status: "SETTLED", settledAt: new Date() }, include: { client: true, instrument: true, fills: true } });
    await notifyClientTx(tx, { clientId: order.clientId, category: "Trading", title: "Order settled", body: `${order.instrument.symbol} order ${order.reference} was recorded by the internal order desk.`, actionUrl: "orders.html", entity: { type: "Order", id: order.id } });
    return { order: updated, fill, ledgerId };
  }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
  await writeAudit("settleOrder", "Order", order.id, { price: input.price, quantity: input.quantity, fee: input.fee }, { req, reason: input.note });
  return ok(res, result);
}));

v1AdminBrokerRouter.get("/positions", readRoles, asyncHandler(async (_req, res) => {
  return ok(res, await prisma.position.findMany({ include: { client: true, instrument: true }, orderBy: { marketValue: "desc" } }));
}));

v1AdminBrokerRouter.get("/options/applications", complianceRoles, asyncHandler(async (_req, res) => {
  return ok(res, await prisma.optionsApplication.findMany({ include: { client: true }, orderBy: { updatedAt: "desc" } }));
}));

v1AdminBrokerRouter.post("/options/applications/:id/decision", complianceRoles, asyncHandler(async (req, res) => {
  const input = z.object({ status: z.enum(["APPROVED", "RESTRICTED", "SUSPENDED", "REJECTED"]), note: z.string().trim().min(5).max(1000) }).parse(req.body);
  const application = await prisma.optionsApplication.findUnique({ where: { id: String(req.params.id) } });
  if (!application) throw new ApiError(404, "Options application was not found", "OPTIONS_APPLICATION_NOT_FOUND");
  const row = await prisma.$transaction(async (tx) => {
    const updated = await tx.optionsApplication.update({ where: { id: application.id }, data: { status: input.status, reviewerId: req.user!.id, decisionNote: input.note, decidedAt: new Date() } });
    await notifyClientTx(tx, { clientId: application.clientId, category: "Options", title: `Options access ${input.status.toLowerCase()}`, body: input.note, actionUrl: "options-access.html", entity: { type: "OptionsApplication", id: application.id } });
    return updated;
  });
  await writeAudit("optionsAccessDecision", "OptionsApplication", row.id, { status: input.status }, { req, reason: input.note });
  return ok(res, row);
}));

v1AdminBrokerRouter.get("/distributions", readRoles, asyncHandler(async (_req, res) => {
  return ok(res, await prisma.distributionBatch.findMany({ include: { product: true, instrument: true, items: { include: { client: true, investment: true } } }, orderBy: { createdAt: "desc" } }));
}));

v1AdminBrokerRouter.post("/distributions", portfolioRoles, asyncHandler(async (req, res) => {
  const input = z.object({ productId: z.string().min(1), type: z.enum(["DIVIDEND", "PROFIT", "INTEREST"]), periodStart: z.coerce.date(), periodEnd: z.coerce.date(), currency: z.string().length(3).default("USD"), grossAmount: z.coerce.number().positive(), feeRate: z.coerce.number().min(0).max(1).default(0), note: z.string().trim().min(5).max(1000) }).parse(req.body);
  if (input.periodStart >= input.periodEnd) throw new ApiError(422, "Distribution period start must precede its end", "INVALID_PERIOD");
  const investments = await prisma.clientInvestment.findMany({ where: { productId: input.productId, status: "ACTIVE", investedAmount: { gt: 0 } }, include: { client: true, product: true } });
  if (!investments.length) throw new ApiError(422, "No active investments are eligible", "NO_ELIGIBLE_INVESTMENTS");
  const total = investments.reduce((sum, item) => sum.plus(item.investedAmount), new Prisma.Decimal(0));
  const gross = new Prisma.Decimal(input.grossAmount);
  const feeRate = new Prisma.Decimal(input.feeRate);
  const items = investments.map((investment, index) => {
    const itemGross = index === investments.length - 1
      ? gross.minus(investments.slice(0, -1).reduce((sum, row) => sum.plus(gross.mul(row.investedAmount).div(total).toDecimalPlaces(2)), new Prisma.Decimal(0)))
      : gross.mul(investment.investedAmount).div(total).toDecimalPlaces(2);
    const itemFee = itemGross.mul(feeRate).toDecimalPlaces(2);
    return { clientId: investment.clientId, investmentId: investment.id, grossAmount: itemGross, feeAmount: itemFee, netAmount: itemGross.minus(itemFee), mode: investment.reinvestPreference };
  });
  const feeAmount = items.reduce((sum, item) => sum.plus(item.feeAmount), new Prisma.Decimal(0));
  const row = await prisma.distributionBatch.create({ data: { reference: reference("DIST"), productId: input.productId, type: input.type, periodStart: input.periodStart, periodEnd: input.periodEnd, currency: input.currency, grossAmount: gross, feeAmount, netAmount: gross.minus(feeAmount), status: "CALCULATED", calculationSnapshot: { method: "pro-rata invested amount", feeRate: input.feeRate, eligibleInvestments: investments.length, note: input.note }, createdBy: req.user!.id, items: { create: items } }, include: { product: true, items: true } });
  await writeAudit("calculateDistribution", "DistributionBatch", row.id, { grossAmount: input.grossAmount, eligible: investments.length }, { req, reason: input.note });
  return ok(res, row, 201);
}));

v1AdminBrokerRouter.post("/distributions/:id/request-approval", portfolioRoles, asyncHandler(async (req, res) => {
  const input = z.object({ note: z.string().trim().min(5).max(1000) }).parse(req.body);
  const batch = await prisma.distributionBatch.findUnique({ where: { id: String(req.params.id) }, include: { items: true } });
  if (!batch || batch.status !== "CALCULATED") throw new ApiError(409, "Distribution must be calculated before approval", "INVALID_DISTRIBUTION_STATE");
  if (!batch.items.length || batch.items.some((item) => !new Prisma.Decimal(item.netAmount).isPositive())) throw new ApiError(422, "Distribution contains invalid entitlements", "INVALID_DISTRIBUTION_ITEMS");
  const approval = await prisma.$transaction(async (tx) => {
    const request = await pendingApproval(tx, "POST_DISTRIBUTION", "DistributionBatch", batch.id, req.user!.id, { note: input.note, grossAmount: Number(batch.grossAmount), netAmount: Number(batch.netAmount), itemCount: batch.items.length });
    await tx.distributionBatch.update({ where: { id: batch.id }, data: { status: "PENDING_APPROVAL" } });
    return request;
  }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
  return ok(res, approval, 201);
}));

v1AdminBrokerRouter.get("/profit-schedules", readRoles, asyncHandler(async (req, res) => {
  await accrueAllInvestmentProfits();
  const { page, limit, skip } = pageInput(req.query);
  const status = typeof req.query.status === "string" ? req.query.status : undefined;
  const investmentStatusInput = typeof req.query.investmentStatus === "string" ? req.query.investmentStatus.toUpperCase() : undefined;
  const investmentStatus = investmentStatusInput && Object.values(InvestmentStatus).includes(investmentStatusInput as InvestmentStatus) ? investmentStatusInput as InvestmentStatus : undefined;
  const clientId = typeof req.query.clientId === "string" ? req.query.clientId : undefined;
  const productId = typeof req.query.productId === "string" ? req.query.productId : undefined;
  const investmentId = typeof req.query.investmentId === "string" ? req.query.investmentId : undefined;
  const filterWhere: Prisma.InvestmentProfitScheduleWhereInput = {
    ...(investmentStatus ? { investment: { status: investmentStatus } } : {}),
    ...(clientId ? { clientId } : {}),
    ...(productId ? { productId } : {}),
    ...(investmentId ? { investmentId } : {})
  };
  const where: Prisma.InvestmentProfitScheduleWhereInput = { ...filterWhere, ...(status ? { status: status.toUpperCase() } : {}) };
  const include = { client: true, product: true, instrument: true, investment: true, receipt: true } as const;
  if (status) {
    const normalizedStatus = status.toUpperCase();
    const [rows, total] = await Promise.all([
      prisma.investmentProfitSchedule.findMany({ where, include, orderBy: { scheduledAt: normalizedStatus === "PENDING" ? "asc" : "desc" }, skip, take: limit }),
      prisma.investmentProfitSchedule.count({ where })
    ]);
    return ok(res, rows, 200, pageMeta(page, limit, total));
  }

  const pendingWhere: Prisma.InvestmentProfitScheduleWhereInput = { ...filterWhere, status: "PENDING" };
  const nonPendingWhere: Prisma.InvestmentProfitScheduleWhereInput = { ...filterWhere, status: { not: "PENDING" } };
  const [pendingTotal, nonPendingTotal] = await Promise.all([
    prisma.investmentProfitSchedule.count({ where: pendingWhere }),
    prisma.investmentProfitSchedule.count({ where: nonPendingWhere })
  ]);
  const pendingTake = skip < pendingTotal ? Math.min(limit, pendingTotal - skip) : 0;
  const pendingRows = pendingTake
    ? await prisma.investmentProfitSchedule.findMany({ where: pendingWhere, include, orderBy: { scheduledAt: "asc" }, skip, take: pendingTake })
    : [];
  const remaining = limit - pendingRows.length;
  const nonPendingSkip = Math.max(0, skip - pendingTotal);
  const nonPendingRows = remaining
    ? await prisma.investmentProfitSchedule.findMany({ where: nonPendingWhere, include, orderBy: { scheduledAt: "desc" }, skip: nonPendingSkip, take: remaining })
    : [];
  const rows = [...pendingRows, ...nonPendingRows];
  const total = pendingTotal + nonPendingTotal;
  return ok(res, rows, 200, pageMeta(page, limit, total));
}));

const profitScheduleInput = z.object({
  scheduledAt: z.coerce.date().optional(),
  expectedAmount: z.coerce.number().min(-1_000_000).max(1_000_000).optional(),
  type: z.enum(["BOT_PROFIT", "BOT_LOSS", "DIVIDEND", "PROFIT"]).optional(),
  instrumentId: z.string().trim().min(1).optional().nullable(),
  note: z.string().trim().max(1000).optional()
});

v1AdminBrokerRouter.post("/profit-schedules", portfolioRoles, asyncHandler(async (req, res) => {
  const input = profitScheduleInput.extend({ investmentId: z.string().min(1), scheduledAt: z.coerce.date(), expectedAmount: z.coerce.number().min(-1_000_000).max(1_000_000) }).parse(req.body);
  if (input.scheduledAt <= new Date()) throw new ApiError(422, "Only future schedule rows can be created", "SCHEDULE_NOT_FUTURE");
  const investment = await prisma.clientInvestment.findUnique({ where: { id: input.investmentId }, include: { product: true, client: true } });
  if (!investment || investment.status !== "ACTIVE") throw new ApiError(404, "Active investment was not found", "INVESTMENT_NOT_FOUND");
  const row = await prisma.investmentProfitSchedule.create({
    data: {
      investmentId: investment.id,
      clientId: investment.clientId,
      productId: investment.productId,
      instrumentId: input.instrumentId || null,
      scheduledAt: input.scheduledAt,
      expectedAmount: input.expectedAmount,
      type: input.type || (input.expectedAmount < 0 ? "BOT_LOSS" : "BOT_PROFIT"),
      note: input.note || "Admin-added bot P/L schedule row.",
      createdByAdminId: req.user!.id
    },
    include: { client: true, product: true, instrument: true, investment: true, receipt: true }
  });
  await writeAudit("createProfitSchedule", "InvestmentProfitSchedule", row.id, undefined, { req, after: { expectedAmount: input.expectedAmount, scheduledAt: input.scheduledAt } });
  return ok(res, row, 201);
}));

v1AdminBrokerRouter.patch("/profit-schedules/:id", portfolioRoles, asyncHandler(async (req, res) => {
  const input = profitScheduleInput.parse(req.body);
  const before = await prisma.investmentProfitSchedule.findUnique({ where: { id: String(req.params.id) } });
  if (!before) throw new ApiError(404, "Profit schedule row was not found", "SCHEDULE_NOT_FOUND");
  if (before.status !== "PENDING") throw new ApiError(409, "Only pending schedule rows can be changed", "SCHEDULE_LOCKED");
  const row = await prisma.investmentProfitSchedule.update({
    where: { id: before.id },
    data: {
      ...(input.scheduledAt ? { scheduledAt: input.scheduledAt } : {}),
      ...(input.expectedAmount !== undefined ? { expectedAmount: input.expectedAmount, type: input.type || (input.expectedAmount < 0 ? "BOT_LOSS" : "BOT_PROFIT") } : input.type ? { type: input.type } : {}),
      ...(input.instrumentId !== undefined ? { instrumentId: input.instrumentId || null } : {}),
      ...(input.note !== undefined ? { note: input.note } : {})
    },
    include: { client: true, product: true, instrument: true, investment: true, receipt: true }
  });
  await writeAudit("updateProfitSchedule", "InvestmentProfitSchedule", row.id, undefined, { req, before, after: row });
  return ok(res, row);
}));

v1AdminBrokerRouter.post("/profit-schedules/:id/apply", portfolioRoles, asyncHandler(async (req, res) => {
  const input = z.object({ note: z.string().trim().min(5).max(1000).default("Applied pending bot P/L schedule immediately.") }).parse(req.body || {});
  const row = await prisma.$transaction((tx) => applyProfitScheduleNowTx(tx, String(req.params.id), req.user!.id));
  await writeAudit("applyProfitSchedule", "InvestmentProfitSchedule", row.id, undefined, { req, after: row, reason: input.note });
  return ok(res, row);
}));

v1AdminBrokerRouter.delete("/profit-schedules/:id", portfolioRoles, asyncHandler(async (req, res) => {
  const input = z.object({ note: z.string().trim().min(5).max(1000).default("Cancelled by admin before scheduled posting.") }).parse(req.body || {});
  const before = await prisma.investmentProfitSchedule.findUnique({ where: { id: String(req.params.id) } });
  if (!before) throw new ApiError(404, "Profit schedule row was not found", "SCHEDULE_NOT_FOUND");
  if (before.status !== "PENDING") throw new ApiError(409, "Only pending schedule rows can be cancelled", "SCHEDULE_LOCKED");
  const row = await prisma.investmentProfitSchedule.update({ where: { id: before.id }, data: { status: "CANCELLED", note: input.note } });
  await writeAudit("cancelProfitSchedule", "InvestmentProfitSchedule", row.id, undefined, { req, before, after: row });
  return ok(res, row);
}));

v1AdminBrokerRouter.get("/risk/alerts", readRoles, asyncHandler(async (req, res) => {
  const status = typeof req.query.status === "string" ? req.query.status : undefined;
  const rows = await prisma.riskAlert.findMany({ where: status ? { status: status as never } : {}, include: { client: true, product: true, instrument: true }, orderBy: [{ severity: "desc" }, { createdAt: "desc" }] });
  return ok(res, rows);
}));

v1AdminBrokerRouter.post("/risk/alerts", complianceRoles, asyncHandler(async (req, res) => {
  const input = z.object({ clientId: z.string().optional(), productId: z.string().optional(), instrumentId: z.string().optional(), category: z.string().min(2).max(80), severity: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]), title: z.string().min(3).max(160), details: z.record(z.string(), z.unknown()).optional() }).parse(req.body);
  const row = await prisma.riskAlert.create({ data: { ...input, details: input.details as Prisma.InputJsonObject | undefined } });
  return ok(res, row, 201);
}));

v1AdminBrokerRouter.post("/risk/alerts/:id/resolve", complianceRoles, asyncHandler(async (req, res) => {
  const input = z.object({ resolution: z.string().trim().min(5).max(2000), status: z.enum(["RESOLVED", "DISMISSED"]).default("RESOLVED") }).parse(req.body);
  const row = await prisma.riskAlert.update({ where: { id: String(req.params.id) }, data: { status: input.status, resolution: input.resolution, resolvedBy: req.user!.id, resolvedAt: new Date() } });
  await writeAudit("resolveRiskAlert", "RiskAlert", row.id, { status: input.status }, { req, reason: input.resolution });
  return ok(res, row);
}));
