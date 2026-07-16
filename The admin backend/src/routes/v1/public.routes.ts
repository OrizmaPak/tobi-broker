import { Router } from "express";
import { z } from "zod";
import { env } from "../../config/env";
import { asyncHandler, ok } from "../../lib/http";
import { prisma } from "../../lib/prisma";

export const v1PublicRouter = Router();

v1PublicRouter.post("/contact", asyncHandler(async (req, res) => {
  const input = z.object({
    name: z.string().trim().min(2).max(120),
    email: z.string().trim().email().max(200),
    phone: z.string().trim().max(40).optional(),
    subject: z.string().trim().min(3).max(160),
    message: z.string().trim().min(10).max(5000)
  }).parse(req.body);
  const reference = `INQ-${Date.now().toString(36).toUpperCase()}`;
  await prisma.outboxEvent.create({
    data: {
      type: "SEND_EMAIL",
      payload: {
        to: env.SUPPORT_EMAIL,
        replyTo: input.email,
        subject: `[${reference}] ${input.subject}`,
        text: `Public website inquiry\n\nName: ${input.name}\nEmail: ${input.email}\nPhone: ${input.phone || "Not provided"}\nReference: ${reference}\n\n${input.message}`
      }
    }
  });
  return ok(res, { reference, status: "RECEIVED" }, 202);
}));

v1PublicRouter.get("/capabilities", asyncHandler(async (_req, res) => {
  const setting = await prisma.systemSetting.findUnique({ where: { key: "platform.capabilities" } });
  return ok(res, setting?.value || {
    cardFunding: false,
    bankFunding: true,
    cryptoFunding: true,
    internalOrderDesk: true,
    liveExchangeExecution: false,
    marketPriceMode: "admin-managed"
  });
}));

v1PublicRouter.get("/portfolios", asyncHandler(async (_req, res) => {
  const products = await prisma.portfolioProduct.findMany({
    where: { status: "PUBLISHED" },
    include: {
      allocations: {
        where: { effectiveTo: null },
        include: { instrument: { select: { symbol: true, name: true, category: true, riskLevel: true } } },
        orderBy: { targetWeight: "desc" }
      },
      feeRules: { where: { active: true } }
    },
    orderBy: [{ riskLevel: "asc" }, { minimum: "asc" }]
  });
  return ok(res, products);
}));

v1PublicRouter.get("/portfolios/:slug", asyncHandler(async (req, res) => {
  const product = await prisma.portfolioProduct.findFirst({
    where: { OR: [{ slug: String(req.params.slug) }, { id: String(req.params.slug) }], status: "PUBLISHED" },
    include: {
      allocations: { where: { effectiveTo: null }, include: { instrument: true }, orderBy: { targetWeight: "desc" } },
      feeRules: { where: { active: true } },
      versions: { where: { status: "PUBLISHED" }, orderBy: { version: "desc" }, take: 1 }
    }
  });
  return ok(res, product);
}));

v1PublicRouter.get("/instruments", asyncHandler(async (req, res) => {
  const category = typeof req.query.category === "string" ? req.query.category : undefined;
  const instruments = await prisma.instrument.findMany({
    where: {
      investable: true,
      status: { notIn: ["INACTIVE", "SUSPENDED", "HIDDEN"] },
      ...(category ? { category: { equals: category, mode: "insensitive" } } : {})
    },
    select: {
      id: true,
      symbol: true,
      name: true,
      category: true,
      market: true,
      currency: true,
      currentPrice: true,
      priceAsOf: true,
      priceSource: true,
      riskLevel: true,
      dividendEligible: true,
      tradable: true,
      investable: true,
      status: true
    },
    orderBy: { symbol: "asc" }
  });
  return ok(res, instruments);
}));

v1PublicRouter.get("/fees", asyncHandler(async (_req, res) => {
  const fees = await prisma.feeRule.findMany({ where: { active: true }, orderBy: { name: "asc" } });
  return ok(res, fees);
}));

v1PublicRouter.get("/disclosures", asyncHandler(async (_req, res) => {
  return ok(res, {
    returns: "All portfolio returns and market values are projected, estimated, simulated, or market-based and are not guaranteed.",
    capital: "Investment capital can rise or fall and clients may receive less than they invested.",
    options: "Options involve significant risk and require a separate suitability approval before access.",
    execution: "BullPort beta uses an internal order desk. The platform does not represent orders as live exchange executions."
  });
}));
