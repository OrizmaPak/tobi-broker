import { KycDocumentRequirement, Prisma } from "@prisma/client";
import { Router } from "express";
import { z } from "zod";
import { ApiError, asyncHandler, hashValue, ok, pageInput, pageMeta, reference } from "../../lib/http";
import { prisma } from "../../lib/prisma";
import { requireAdmin, requireAdminRoles, requireCsrf } from "../../middleware/auth";
import { writeAudit } from "../../services/audit.service";
import { buildKycChecklist, KYC_UPLOAD_MODES, summarizeKycChecklist } from "../../services/kyc.service";
import { captureWalletHoldTx, creditClientCashTx, debitClientCashTx, releaseWalletHoldTx } from "../../services/ledger.service";
import { notifyClientTx, notifyClientsMissingKycRequirementTx } from "../../services/notification.service";

export const v1AdminCoreRouter = Router();
v1AdminCoreRouter.use(requireAdmin);
v1AdminCoreRouter.use(requireCsrf);

const complianceRoles = requireAdminRoles("SUPER_ADMIN", "COMPLIANCE");
const financeRoles = requireAdminRoles("SUPER_ADMIN", "FINANCE");
const operationalRoles = requireAdminRoles("SUPER_ADMIN", "COMPLIANCE", "FINANCE", "PORTFOLIO_MANAGER", "SUPPORT", "AUDITOR");
const moneySchema = z.coerce.number().positive().max(100_000_000);

type KycCaseWithReview = Prisma.KycCaseGetPayload<{
  include: {
    client: true;
    documents: { include: { requirement: true } };
    checks: true;
    decisions: true;
  };
}>;

function kycCaseView(row: KycCaseWithReview, requirements: KycDocumentRequirement[], storedFiles: Map<string, string>) {
  const checklist = buildKycChecklist(requirements, row.documents);
  return {
    ...row,
    documents: row.documents.map((document) => ({ ...document, storedFileId: storedFiles.get(document.storageKey) || null })),
    checklist,
    summary: summarizeKycChecklist(checklist)
  };
}

const approvalRoles: Record<string, string[]> = {
  CREDIT_DEPOSIT: ["SUPER_ADMIN", "FINANCE"],
  APPROVE_WITHDRAWAL: ["SUPER_ADMIN", "FINANCE"],
  PUBLISH_PRODUCT: ["SUPER_ADMIN", "PORTFOLIO_MANAGER"],
  POST_DISTRIBUTION: ["SUPER_ADMIN", "FINANCE", "PORTFOLIO_MANAGER"]
};

const APPROVAL_SETTINGS_KEY = "operations.approvals";

type ApprovalPolicy = {
  makerChecker?: boolean;
  depositCredits?: boolean;
  autoApproveDeposits?: boolean;
};

function approvalPolicyValue(value: Prisma.JsonValue | null | undefined): ApprovalPolicy {
  return value && typeof value === "object" && !Array.isArray(value) ? value as ApprovalPolicy : {};
}

function jsonObjectValue(value: Prisma.JsonValue | null | undefined): Record<string, Prisma.JsonValue> {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, Prisma.JsonValue> : {};
}

async function depositAutoApprovalEnabled() {
  const setting = await prisma.systemSetting.findUnique({ where: { key: APPROVAL_SETTINGS_KEY } });
  const policy = approvalPolicyValue(setting?.value);
  return policy.autoApproveDeposits === true || policy.depositCredits === false || policy.makerChecker === false;
}

async function createApproval(input: { actionType: string; entityType: string; entityId: string; payload?: Prisma.InputJsonObject; adminId: string }) {
  const existing = await prisma.approvalRequest.findFirst({ where: { actionType: input.actionType, entityType: input.entityType, entityId: input.entityId, status: "PENDING" } });
  if (existing) return existing;
  return prisma.approvalRequest.create({
    data: {
      actionType: input.actionType,
      entityType: input.entityType,
      entityId: input.entityId,
      payload: input.payload,
      payloadHash: hashValue(JSON.stringify(input.payload || {})),
      initiatedByAdminId: input.adminId,
      expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000)
    }
  });
}

type DepositForCredit = Prisma.DepositGetPayload<{ include: { client: true } }>;

async function creditDepositTx(tx: Prisma.TransactionClient, deposit: DepositForCredit, input: {
  note: string;
  received?: Prisma.Decimal.Value;
  externalReference?: string | null;
  initiatedBy: string;
  approvedBy: string;
}) {
  const [kycCase, legacy] = await Promise.all([
    tx.kycCase.findFirst({ where: { clientId: deposit.clientId, status: "APPROVED", OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }] } }),
    tx.kycReview.findFirst({ where: { clientId: deposit.clientId, status: "APPROVED" } })
  ]);
  if (!kycCase && !legacy) throw new ApiError(403, "KYC must be approved before a deposit can be credited", "KYC_REQUIRED");

  const received = input.received || deposit.received || deposit.amount;
  const externalReference = input.externalReference || deposit.externalReference || deposit.transactionHash || undefined;
  const ledger = await creditClientCashTx(tx, {
    clientId: deposit.clientId,
    amount: received,
    type: "DEPOSIT",
    description: `Deposit ${deposit.reference}`,
    currency: deposit.currency,
    idempotencyKey: `credit:${deposit.id}`,
    externalReference,
    initiatedBy: input.initiatedBy,
    approvedBy: input.approvedBy
  });
  const entity = await tx.deposit.update({
    where: { id: deposit.id },
    data: {
      status: "CREDITED",
      reviewNote: input.note,
      received,
      externalReference,
      approvedAt: new Date(),
      creditedAt: new Date(),
      ledgerTransactionId: ledger.id
    }
  });
  await notifyClientTx(tx, { clientId: deposit.clientId, category: "Wallet", title: "Deposit credited", body: `${deposit.reference} has been credited to your wallet.`, actionUrl: "transactions.html", entity: { type: "Deposit", id: deposit.id } });
  return entity;
}

v1AdminCoreRouter.get("/overview", operationalRoles, asyncHandler(async (_req, res) => {
  const [totalClients, verifiedClients, activeInvestors, pendingKyc, depositsToReview, withdrawalsToReview, openTickets, openRiskAlerts, openOrders, pendingApprovals, wallets, investments, distributions, recentAudit] = await Promise.all([
    prisma.client.count(),
    prisma.kycCase.count({ where: { status: "APPROVED" } }),
    prisma.clientInvestment.groupBy({ by: ["clientId"], where: { status: "ACTIVE" } }),
    prisma.kycCase.count({ where: { status: { in: ["SUBMITTED", "PENDING", "IN_REVIEW", "RESUBMISSION_REQUIRED"] } } }),
    prisma.deposit.count({ where: { status: { in: ["PENDING", "IN_REVIEW", "UNDER_REVIEW", "AWAITING_APPROVAL", "FLAGGED"] } } }),
    prisma.withdrawal.count({ where: { status: { in: ["PENDING", "REQUESTED", "IN_REVIEW", "UNDER_REVIEW", "AWAITING_APPROVAL", "APPROVED", "HELD"] } } }),
    prisma.supportTicket.count({ where: { status: { in: ["OPEN", "AWAITING_BROKER", "ESCALATED"] } } }),
    prisma.riskAlert.count({ where: { status: { in: ["OPEN", "IN_REVIEW"] } } }),
    prisma.order.count({ where: { status: { in: ["PENDING_REVIEW", "APPROVED", "PARTIALLY_FILLED"] } } }),
    prisma.approvalRequest.count({ where: { status: "PENDING" } }),
    prisma.walletAccount.aggregate({ _sum: { balance: true, held: true } }),
    prisma.clientInvestment.aggregate({ where: { status: { in: ["ACTIVE", "REVIEW", "EXIT_REQUESTED"] } }, _sum: { currentValue: true }, _count: true }),
    prisma.distributionItem.aggregate({ where: { status: "POSTED" }, _sum: { netAmount: true } }),
    prisma.auditLog.findMany({ orderBy: { createdAt: "desc" }, take: 12 })
  ]);
  return ok(res, {
    metrics: {
      totalClients,
      verifiedClients,
      activeInvestors: activeInvestors.length,
      pendingKyc,
      depositsToReview,
      withdrawalsToReview,
      openTickets,
      openRiskAlerts,
      openOrders,
      pendingApprovals,
      totalWalletBalance: wallets._sum.balance || 0,
      heldWalletBalance: wallets._sum.held || 0,
      assetsUnderManagement: investments._sum.currentValue || 0,
      activeInvestments: investments._count,
      distributionsPosted: distributions._sum.netAmount || 0
    },
    recentAudit
  });
}));

v1AdminCoreRouter.get("/queues", operationalRoles, asyncHandler(async (_req, res) => {
  const [kyc, deposits, withdrawals, approvals, orders, risk, tickets, tasks] = await Promise.all([
    prisma.kycCase.findMany({ where: { status: { in: ["SUBMITTED", "PENDING", "IN_REVIEW", "RESUBMISSION_REQUIRED"] } }, include: { client: true }, orderBy: { updatedAt: "asc" }, take: 25 }),
    prisma.deposit.findMany({ where: { status: { in: ["PENDING", "IN_REVIEW", "UNDER_REVIEW", "AWAITING_APPROVAL", "FLAGGED"] } }, include: { client: true }, orderBy: { createdAt: "asc" }, take: 25 }),
    prisma.withdrawal.findMany({ where: { status: { in: ["PENDING", "REQUESTED", "IN_REVIEW", "UNDER_REVIEW", "AWAITING_APPROVAL", "APPROVED", "HELD"] } }, include: { client: true }, orderBy: { createdAt: "asc" }, take: 25 }),
    prisma.approvalRequest.findMany({ where: { status: "PENDING" }, include: { initiatedBy: { select: { name: true, role: true } } }, orderBy: { createdAt: "asc" }, take: 25 }),
    prisma.order.findMany({ where: { status: { in: ["PENDING_REVIEW", "APPROVED", "PARTIALLY_FILLED"] } }, include: { client: true, instrument: true }, orderBy: { submittedAt: "asc" }, take: 25 }),
    prisma.riskAlert.findMany({ where: { status: { in: ["OPEN", "IN_REVIEW"] } }, include: { client: true }, orderBy: [{ severity: "desc" }, { createdAt: "asc" }], take: 25 }),
    prisma.supportTicket.findMany({ where: { status: { in: ["OPEN", "AWAITING_BROKER", "ESCALATED"] } }, include: { client: true }, orderBy: { updatedAt: "asc" }, take: 25 }),
    prisma.adminTask.findMany({ where: { status: { not: "COMPLETED" } }, orderBy: [{ priority: "desc" }, { dueAt: "asc" }], take: 25 })
  ]);
  return ok(res, { kyc, deposits, withdrawals, approvals, orders, risk, tickets, tasks });
}));

v1AdminCoreRouter.get("/clients", operationalRoles, asyncHandler(async (req, res) => {
  const { page, limit, skip } = pageInput(req.query);
  const q = typeof req.query.q === "string" ? req.query.q.trim() : undefined;
  const status = typeof req.query.status === "string" ? req.query.status : undefined;
  const where: Prisma.ClientWhereInput = {
    ...(q ? { OR: [{ name: { contains: q, mode: "insensitive" } }, { email: { contains: q, mode: "insensitive" } }, { accountNumber: { contains: q, mode: "insensitive" } }] } : {}),
    ...(status && ["ACTIVE", "PENDING", "RESTRICTED", "SUSPENDED"].includes(status) ? { status: status as never } : {})
  };
  const [rows, total] = await Promise.all([
    prisma.client.findMany({ where, include: { wallet: true, kycCases: { orderBy: { updatedAt: "desc" }, take: 1 }, investments: true, riskAlerts: { where: { status: { in: ["OPEN", "IN_REVIEW"] } } } }, orderBy: { createdAt: "desc" }, skip, take: limit }),
    prisma.client.count({ where })
  ]);
  return ok(res, rows, 200, pageMeta(page, limit, total));
}));

v1AdminCoreRouter.get("/clients/:id", operationalRoles, asyncHandler(async (req, res) => {
  const row = await prisma.client.findUnique({
    where: { id: String(req.params.id) },
    include: {
      wallet: { include: { ledgerAccounts: true, holds: { orderBy: { createdAt: "desc" } } } },
      kycCases: { include: { documents: true, checks: true, decisions: true }, orderBy: { updatedAt: "desc" } },
      deposits: { orderBy: { createdAt: "desc" } }, withdrawals: { orderBy: { createdAt: "desc" } },
      beneficiaries: true, investments: { include: { product: true, valuations: { orderBy: { asOf: "desc" }, take: 12 } } },
      orders: { include: { instrument: true, fills: true }, orderBy: { submittedAt: "desc" } }, positions: { include: { instrument: true } },
      payouts: { orderBy: { payoutDate: "desc" } }, riskAlerts: { orderBy: { createdAt: "desc" } },
      tickets: { include: { messages: true }, orderBy: { updatedAt: "desc" } }, notes: { orderBy: { createdAt: "desc" } },
      notifications: { where: { recipientType: "CLIENT" }, orderBy: { createdAt: "desc" }, take: 30 }, reports: { orderBy: { createdAt: "desc" } }
    }
  });
  if (!row) throw new ApiError(404, "Client was not found", "CLIENT_NOT_FOUND");
  return ok(res, row);
}));

v1AdminCoreRouter.patch("/clients/:id/status", requireAdminRoles("SUPER_ADMIN", "COMPLIANCE"), asyncHandler(async (req, res) => {
  const input = z.object({ status: z.enum(["ACTIVE", "PENDING", "RESTRICTED", "SUSPENDED"]), reason: z.string().trim().min(5).max(500) }).parse(req.body);
  const before = await prisma.client.findUniqueOrThrow({ where: { id: String(req.params.id) } });
  const row = await prisma.client.update({ where: { id: before.id }, data: { status: input.status } });
  if (input.status === "SUSPENDED") await prisma.authSession.updateMany({ where: { clientId: row.id }, data: { revokedAt: new Date() } });
  await writeAudit("updateClientStatus", "Client", row.id, { status: input.status }, { req, reason: input.reason, before, after: row });
  return ok(res, row);
}));

v1AdminCoreRouter.post("/clients/:id/notes", operationalRoles, asyncHandler(async (req, res) => {
  const input = z.object({ category: z.string().min(2).max(60), body: z.string().min(2).max(5000) }).parse(req.body);
  const note = await prisma.clientNote.create({ data: { clientId: String(req.params.id), category: input.category, body: input.body, createdBy: req.user!.name } });
  await writeAudit("createClientNote", "Client", String(req.params.id), { category: input.category }, { req });
  return ok(res, note, 201);
}));

v1AdminCoreRouter.get("/kyc", complianceRoles, asyncHandler(async (req, res) => {
  const { page, limit, skip } = pageInput(req.query);
  const status = typeof req.query.status === "string" ? req.query.status : undefined;
  const clientId = typeof req.query.clientId === "string" ? req.query.clientId : undefined;
  const statusWhere: Prisma.KycCaseWhereInput = status === "all"
    ? {}
    : status === "reviewable" || !status
      ? { status: { in: ["SUBMITTED", "PENDING", "IN_REVIEW", "RESUBMISSION_REQUIRED"] } }
      : { status: status as never };
  const where: Prisma.KycCaseWhereInput = { ...statusWhere, ...(clientId ? { clientId } : {}) };
  const [rows, total, requirements] = await Promise.all([
    prisma.kycCase.findMany({ where, include: { client: true, documents: { include: { requirement: true }, orderBy: { uploadedAt: "desc" } }, checks: true, decisions: { orderBy: { createdAt: "desc" } } }, orderBy: { updatedAt: "asc" }, skip, take: limit }),
    prisma.kycCase.count({ where }),
    prisma.kycDocumentRequirement.findMany({ where: { isActive: true }, orderBy: [{ sortOrder: "asc" }, { documentType: "asc" }] })
  ]);
  const keys = rows.flatMap((row) => row.documents.map((document) => document.storageKey));
  const files = keys.length ? await prisma.storedFile.findMany({ where: { storageKey: { in: keys } }, select: { id: true, storageKey: true } }) : [];
  const storedFiles = new Map(files.map((file) => [file.storageKey, file.id]));
  return ok(res, rows.map((row) => kycCaseView(row, requirements, storedFiles)), 200, pageMeta(page, limit, total));
}));

v1AdminCoreRouter.get("/kyc/requirements", complianceRoles, asyncHandler(async (_req, res) => {
  const rows = await prisma.kycDocumentRequirement.findMany({ orderBy: [{ sortOrder: "asc" }, { documentType: "asc" }] });
  return ok(res, rows);
}));

v1AdminCoreRouter.post("/kyc/requirements", complianceRoles, asyncHandler(async (req, res) => {
  const input = z.object({
    documentType: z.string().trim().min(2).max(120),
    description: z.string().trim().min(5).max(1000),
    uploadMode: z.enum(KYC_UPLOAD_MODES).default("FRONT_ONLY"),
    isRequired: z.boolean().default(true),
    isActive: z.boolean().default(true),
    sortOrder: z.coerce.number().int().min(0).max(10_000).default(0)
  }).parse(req.body);
  const baseCode = input.documentType.toUpperCase().replace(/[^A-Z0-9]+/g, "_").replace(/^_|_$/g, "").slice(0, 60) || "DOCUMENT";
  const existing = await prisma.kycDocumentRequirement.findUnique({ where: { code: baseCode } });
  let notifiedClients = 0;
  const row = await prisma.$transaction(async (tx) => {
    const created = await tx.kycDocumentRequirement.create({
      data: { ...input, code: existing ? `${baseCode}_${Date.now().toString(36).toUpperCase()}` : baseCode, createdByAdminId: req.user!.id }
    });
    if (created.isActive && created.isRequired) notifiedClients = await notifyClientsMissingKycRequirementTx(tx, created);
    return created;
  });
  await writeAudit("createKycRequirement", "KycDocumentRequirement", row.id, { code: row.code, uploadMode: row.uploadMode, notifiedClients }, { req, after: row });
  return ok(res, row, 201);
}));

v1AdminCoreRouter.patch("/kyc/requirements/:id", complianceRoles, asyncHandler(async (req, res) => {
  const input = z.object({
    documentType: z.string().trim().min(2).max(120).optional(),
    description: z.string().trim().min(5).max(1000).optional(),
    uploadMode: z.enum(KYC_UPLOAD_MODES).optional(),
    isRequired: z.boolean().optional(),
    isActive: z.boolean().optional(),
    sortOrder: z.coerce.number().int().min(0).max(10_000).optional()
  }).refine((value) => Object.keys(value).length > 0, "At least one requirement field must be supplied").parse(req.body);
  const before = await prisma.kycDocumentRequirement.findUnique({ where: { id: String(req.params.id) } });
  if (!before) throw new ApiError(404, "KYC document requirement was not found", "KYC_REQUIREMENT_NOT_FOUND");
  let notifiedClients = 0;
  const row = await prisma.$transaction(async (tx) => {
    const updated = await tx.kycDocumentRequirement.update({ where: { id: before.id }, data: input });
    const becameRequired = before.isRequired === false && updated.isRequired === true;
    const becameActive = before.isActive === false && updated.isActive === true;
    const uploadModeExpanded = Boolean(input.uploadMode && input.uploadMode !== before.uploadMode);
    if (updated.isActive && updated.isRequired && (becameRequired || becameActive || uploadModeExpanded)) {
      notifiedClients = await notifyClientsMissingKycRequirementTx(tx, updated);
    }
    return updated;
  });
  await writeAudit("updateKycRequirement", "KycDocumentRequirement", row.id, { ...(input as Prisma.InputJsonObject), notifiedClients }, { req, before, after: row });
  return ok(res, row);
}));

v1AdminCoreRouter.get("/kyc/:id", complianceRoles, asyncHandler(async (req, res) => {
  const [row, requirements] = await Promise.all([
    prisma.kycCase.findUnique({ where: { id: String(req.params.id) }, include: { client: true, documents: { include: { requirement: true }, orderBy: { uploadedAt: "desc" } }, checks: true, decisions: { orderBy: { createdAt: "desc" } } } }),
    prisma.kycDocumentRequirement.findMany({ where: { isActive: true }, orderBy: [{ sortOrder: "asc" }, { documentType: "asc" }] })
  ]);
  if (!row) throw new ApiError(404, "KYC case was not found", "KYC_CASE_NOT_FOUND");
  const files = row.documents.length ? await prisma.storedFile.findMany({ where: { storageKey: { in: row.documents.map((document) => document.storageKey) } }, select: { id: true, storageKey: true } }) : [];
  return ok(res, kycCaseView(row, requirements, new Map(files.map((file) => [file.storageKey, file.id]))));
}));

v1AdminCoreRouter.post("/kyc/:id/documents/:documentId/decision", complianceRoles, asyncHandler(async (req, res) => {
  const input = z.object({ status: z.enum(["VERIFIED", "REJECTED"]), note: z.string().trim().max(2000).default("") })
    .refine((value) => value.status !== "REJECTED" || value.note.length >= 5, { message: "A rejection reason of at least five characters is required", path: ["note"] })
    .parse(req.body);
  const before = await prisma.kycDocument.findFirst({
    where: { id: String(req.params.documentId), caseId: String(req.params.id) },
    include: { kycCase: { include: { client: true } }, requirement: true }
  });
  if (!before) throw new ApiError(404, "KYC document was not found", "KYC_DOCUMENT_NOT_FOUND");
  const document = await prisma.$transaction(async (tx) => {
    const updated = await tx.kycDocument.update({
      where: { id: before.id },
      data: { status: input.status, rejectionNote: input.status === "REJECTED" ? input.note : null, reviewedAt: new Date() },
      include: { requirement: true }
    });
    await tx.kycCase.update({ where: { id: before.caseId }, data: { status: "IN_REVIEW", assignedReviewer: req.user!.name } });
    if (input.status === "REJECTED") {
      await notifyClientTx(tx, {
        clientId: before.kycCase.clientId,
        email: before.kycCase.client.email,
        eventKey: "kyc.document.rejected",
        category: "KYC",
        severity: "WARNING",
        title: "KYC document needs attention",
        body: `${before.requirement?.documentType || before.type} ${before.side.toLowerCase()} was rejected: ${input.note}`,
        actionUrl: "kyc.html",
        entity: { type: "KycDocument", id: before.id },
        metadata: { caseId: before.caseId, documentType: before.requirement?.documentType || before.type, side: before.side },
        dedupeKey: `kyc.document.rejected:${before.id}`
      });
    }
    return updated;
  });
  await writeAudit("reviewKycDocument", "KycDocument", document.id, { status: input.status, note: input.note }, { req, reason: input.note || "Document accepted", before, after: document });
  return ok(res, document);
}));

v1AdminCoreRouter.post("/kyc/:id/decision", complianceRoles, asyncHandler(async (req, res) => {
  const input = z.object({ status: z.enum(["APPROVED", "REJECTED", "RESUBMISSION_REQUIRED"]), note: z.string().trim().min(5).max(2000), expiresAt: z.coerce.date().optional(), overrideIncomplete: z.boolean().default(false) }).parse(req.body);
  const [kycCase, requirements] = await Promise.all([
    prisma.kycCase.findUnique({ where: { id: String(req.params.id) }, include: { client: true, documents: true } }),
    prisma.kycDocumentRequirement.findMany({ where: { isActive: true, isRequired: true }, orderBy: { sortOrder: "asc" } })
  ]);
  if (!kycCase) throw new ApiError(404, "KYC case was not found", "KYC_CASE_NOT_FOUND");
  const summary = summarizeKycChecklist(buildKycChecklist(requirements, kycCase.documents));
  if (input.status === "APPROVED" && !summary.reviewComplete && !input.overrideIncomplete) {
    throw new ApiError(409, "Every required document must be accepted before KYC can pass, or use the audited override", "KYC_REVIEW_INCOMPLETE");
  }
  const updated = await prisma.$transaction(async (tx) => {
    const row = await tx.kycCase.update({ where: { id: kycCase.id }, data: { status: input.status, assignedReviewer: req.user!.name, approvedAt: input.status === "APPROVED" ? new Date() : null, expiresAt: input.status === "APPROVED" ? input.expiresAt || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) : null, decisions: { create: { status: input.status, reviewerId: req.user!.id, note: input.note } } } });
    await tx.kycReview.updateMany({ where: { clientId: kycCase.clientId }, data: { status: input.status, reviewer: req.user!.name, decisionNote: input.note } });
    await tx.client.update({ where: { id: kycCase.clientId }, data: { status: input.status === "APPROVED" ? "ACTIVE" : input.status === "REJECTED" ? "RESTRICTED" : "PENDING" } });
    const decisionNotification = {
      APPROVED: {
        eventKey: "kyc.final_approved",
        severity: "SUCCESS" as const,
        title: "KYC approved",
        body: "Your account verification has been approved.",
        actionUrl: "dashboard.html"
      },
      REJECTED: {
        eventKey: "kyc.final_rejected",
        severity: "CRITICAL" as const,
        title: "KYC rejected",
        body: input.note,
        actionUrl: "kyc.html"
      },
      RESUBMISSION_REQUIRED: {
        eventKey: "kyc.resubmission_required",
        severity: "WARNING" as const,
        title: "KYC resubmission required",
        body: input.note,
        actionUrl: "kyc.html"
      }
    }[input.status];
    await notifyClientTx(tx, {
      clientId: kycCase.clientId,
      email: kycCase.client.email,
      category: "KYC",
      entity: { type: "KycCase", id: kycCase.id },
      metadata: { status: input.status, overrideIncomplete: input.overrideIncomplete, summary },
      dedupeKey: `kyc.final:${input.status}:${kycCase.id}:${hashValue(input.note)}`,
      ...decisionNotification
    });
    return row;
  });
  await writeAudit("kycDecision", "KycCase", updated.id, { status: input.status, overrideIncomplete: input.overrideIncomplete, summary }, { req, reason: input.note, before: kycCase, after: updated });
  return ok(res, updated);
}));

v1AdminCoreRouter.get("/beneficiaries", complianceRoles, asyncHandler(async (_req, res) => {
  return ok(res, await prisma.beneficiary.findMany({ include: { client: true }, orderBy: { createdAt: "desc" } }));
}));

v1AdminCoreRouter.post("/beneficiaries/:id/verify", complianceRoles, asyncHandler(async (req, res) => {
  const input = z.object({ note: z.string().trim().min(5).max(500) }).parse(req.body);
  const row = await prisma.beneficiary.update({ where: { id: String(req.params.id) }, data: { status: "VERIFIED", verifiedAt: new Date() } });
  await writeAudit("verifyBeneficiary", "Beneficiary", row.id, undefined, { req, reason: input.note });
  return ok(res, row);
}));

v1AdminCoreRouter.post("/beneficiaries/:id/decision", complianceRoles, asyncHandler(async (req, res) => {
  const input = z.object({
    status: z.enum(["VERIFIED", "REJECTED", "PENDING", "SUSPENDED"]),
    note: z.string().trim().min(5).max(1000)
  }).parse(req.body);
  const before = await prisma.beneficiary.findUnique({ where: { id: String(req.params.id) }, include: { client: true } });
  if (!before) throw new ApiError(404, "Beneficiary not found", "BENEFICIARY_NOT_FOUND");
  const row = await prisma.$transaction(async (tx) => {
    const updated = await tx.beneficiary.update({
      where: { id: before.id },
      data: {
        status: input.status,
        verifiedAt: input.status === "VERIFIED" ? new Date() : null
      }
    });
    const copy = {
      VERIFIED: {
        title: "Payout destination verified",
        body: `${before.label} is approved and can be used after any cooling-off period.`
      },
      REJECTED: {
        title: "Payout destination denied",
        body: input.note
      },
      PENDING: {
        title: "Payout destination correction required",
        body: input.note
      },
      SUSPENDED: {
        title: "Payout destination suspended",
        body: input.note
      }
    }[input.status];
    await notifyClientTx(tx, {
      clientId: before.clientId,
      email: before.client.email,
      category: "Wallet",
      eventKey: "beneficiary.decision",
      severity: input.status === "VERIFIED" ? "SUCCESS" : input.status === "REJECTED" || input.status === "SUSPENDED" ? "WARNING" : "INFO",
      title: copy.title,
      body: copy.body,
      actionUrl: "withdraw.html",
      entity: { type: "Beneficiary", id: before.id },
      metadata: { status: input.status, beneficiaryId: before.id },
      dedupeKey: `beneficiary.decision:${input.status}:${before.id}:${hashValue(input.note)}`
    });
    return updated;
  });
  await writeAudit(input.status === "VERIFIED" ? "verifyBeneficiary" : input.status === "REJECTED" ? "rejectBeneficiary" : input.status === "SUSPENDED" ? "suspendBeneficiary" : "requestBeneficiaryCorrection", "Beneficiary", row.id, { status: input.status }, { req, reason: input.note, before, after: row });
  return ok(res, row);
}));

v1AdminCoreRouter.get("/money/deposits", financeRoles, asyncHandler(async (req, res) => {
  const { page, limit, skip } = pageInput(req.query);
  const status = typeof req.query.status === "string" ? req.query.status : undefined;
  const where: Prisma.DepositWhereInput = status ? { status: status as never } : {};
  const [rows, total] = await Promise.all([prisma.deposit.findMany({ where, include: { client: { include: { kycCases: { orderBy: { updatedAt: "desc" }, take: 1 } } } }, orderBy: { createdAt: "desc" }, skip, take: limit }), prisma.deposit.count({ where })]);
  const evidenceIds = rows.map((row) => row.evidenceFileId).filter(Boolean) as string[];
  const evidenceFiles = evidenceIds.length ? await prisma.storedFile.findMany({ where: { id: { in: evidenceIds } } }) : [];
  const evidenceById = new Map(evidenceFiles.map((file) => [file.id, file]));
  return ok(res, rows.map((row) => ({ ...row, evidenceFile: row.evidenceFileId ? evidenceById.get(row.evidenceFileId) || null : null })), 200, pageMeta(page, limit, total));
}));

v1AdminCoreRouter.get("/money/withdrawals", financeRoles, asyncHandler(async (req, res) => {
  const { page, limit, skip } = pageInput(req.query);
  const status = typeof req.query.status === "string" ? req.query.status : undefined;
  const where: Prisma.WithdrawalWhereInput = status ? { status: status as never } : {};
  const [rows, total] = await Promise.all([prisma.withdrawal.findMany({ where, include: { client: { include: { kycCases: { orderBy: { updatedAt: "desc" }, take: 1 } } } }, orderBy: { createdAt: "desc" }, skip, take: limit }), prisma.withdrawal.count({ where })]);
  return ok(res, rows, 200, pageMeta(page, limit, total));
}));

v1AdminCoreRouter.post("/money/deposits/:id/request-approval", financeRoles, asyncHandler(async (req, res) => {
  const input = z.object({ note: z.string().trim().min(5).max(1000), received: moneySchema.optional(), externalReference: z.string().trim().max(120).optional() }).parse(req.body);
  const row = await prisma.deposit.findUnique({ where: { id: String(req.params.id) }, include: { client: true } });
  if (!row) throw new ApiError(404, "Deposit was not found", "DEPOSIT_NOT_FOUND");
  if (!["PENDING", "IN_REVIEW", "UNDER_REVIEW", "FLAGGED"].includes(row.status)) throw new ApiError(409, "Deposit cannot enter approval from its current state", "INVALID_DEPOSIT_STATE");
  if (await depositAutoApprovalEnabled()) {
    const entity = await prisma.$transaction(async (tx) => creditDepositTx(tx, row, {
      note: input.note,
      received: input.received,
      externalReference: input.externalReference || null,
      initiatedBy: req.user!.id,
      approvedBy: "AUTO_APPROVAL"
    }), { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
    await writeAudit("autoApproveDeposit", "Deposit", row.id, { setting: APPROVAL_SETTINGS_KEY }, { req, reason: input.note, before: row, after: entity });
    return ok(res, { autoApproved: true, entity }, 201);
  }
  const approval = await createApproval({ actionType: "CREDIT_DEPOSIT", entityType: "Deposit", entityId: row.id, payload: { note: input.note, received: input.received || Number(row.amount), externalReference: input.externalReference || null }, adminId: req.user!.id });
  await prisma.deposit.update({ where: { id: row.id }, data: { status: "AWAITING_APPROVAL", reviewNote: input.note, received: input.received, externalReference: input.externalReference, approvalRequestId: approval.id } });
  return ok(res, approval, 201);
}));

v1AdminCoreRouter.post("/money/deposits/:id/flag", financeRoles, asyncHandler(async (req, res) => {
  const input = z.object({ note: z.string().trim().min(5).max(1000) }).parse(req.body);
  const row = await prisma.deposit.update({ where: { id: String(req.params.id) }, data: { status: "FLAGGED", reviewNote: input.note } });
  await writeAudit("flagDeposit", "Deposit", row.id, undefined, { req, reason: input.note });
  return ok(res, row);
}));

v1AdminCoreRouter.post("/money/deposits/:id/request-proof", financeRoles, asyncHandler(async (req, res) => {
  const input = z.object({ note: z.string().trim().min(5).max(1000) }).parse(req.body);
  const deposit = await prisma.deposit.findUnique({ where: { id: String(req.params.id) } });
  if (!deposit) throw new ApiError(404, "Deposit was not found", "DEPOSIT_NOT_FOUND");
  const row = await prisma.$transaction(async (tx) => {
    await notifyClientTx(tx, { clientId: deposit.clientId, category: "Wallet", title: "Deposit evidence required", body: input.note, actionUrl: `deposit.html?deposit=${deposit.id}`, entity: { type: "Deposit", id: deposit.id } });
    return tx.deposit.update({ where: { id: deposit.id }, data: { status: "UNDER_REVIEW", reviewNote: input.note } });
  });
  await writeAudit("requestDepositProof", "Deposit", row.id, undefined, { req, reason: input.note });
  return ok(res, row);
}));

v1AdminCoreRouter.post("/money/withdrawals/:id/request-approval", financeRoles, asyncHandler(async (req, res) => {
  const input = z.object({ note: z.string().trim().min(5).max(1000), fee: moneySchema.optional() }).parse(req.body);
  const row = await prisma.withdrawal.findUnique({ where: { id: String(req.params.id) } });
  if (!row) throw new ApiError(404, "Withdrawal was not found", "WITHDRAWAL_NOT_FOUND");
  if (!["PENDING", "REQUESTED", "IN_REVIEW", "UNDER_REVIEW", "HELD"].includes(row.status)) throw new ApiError(409, "Withdrawal cannot enter approval from its current state", "INVALID_WITHDRAWAL_STATE");
  const approval = await createApproval({ actionType: "APPROVE_WITHDRAWAL", entityType: "Withdrawal", entityId: row.id, payload: { note: input.note, fee: input.fee || 0 }, adminId: req.user!.id });
  await prisma.withdrawal.update({ where: { id: row.id }, data: { status: "AWAITING_APPROVAL", reviewNote: input.note, fee: input.fee || 0, netAmount: new Prisma.Decimal(row.amount).minus(input.fee || 0), approvalRequestId: approval.id } });
  return ok(res, approval, 201);
}));

v1AdminCoreRouter.post("/money/withdrawals/:id/reject", financeRoles, asyncHandler(async (req, res) => {
  const input = z.object({ note: z.string().trim().min(5).max(1000) }).parse(req.body);
  const row = await prisma.withdrawal.findUnique({ where: { id: String(req.params.id) } });
  if (!row) throw new ApiError(404, "Withdrawal was not found", "WITHDRAWAL_NOT_FOUND");
  const updated = await prisma.$transaction(async (tx) => {
    if (row.holdReference) await releaseWalletHoldTx(tx, row.holdReference);
    return tx.withdrawal.update({ where: { id: row.id }, data: { status: "REJECTED", reviewNote: input.note } });
  });
  await writeAudit("rejectWithdrawal", "Withdrawal", row.id, undefined, { req, reason: input.note });
  return ok(res, updated);
}));

v1AdminCoreRouter.post("/money/withdrawals/:id/hold", financeRoles, asyncHandler(async (req, res) => {
  const input = z.object({ note: z.string().trim().min(5).max(1000) }).parse(req.body);
  const withdrawal = await prisma.withdrawal.findUnique({ where: { id: String(req.params.id) } });
  if (!withdrawal) throw new ApiError(404, "Withdrawal was not found", "WITHDRAWAL_NOT_FOUND");
  if (["PAID", "REJECTED", "CANCELLED", "FAILED"].includes(withdrawal.status)) throw new ApiError(409, "This withdrawal can no longer be held", "INVALID_WITHDRAWAL_STATE");
  const row = await prisma.$transaction(async (tx) => {
    await notifyClientTx(tx, { clientId: withdrawal.clientId, category: "Wallet", title: "Withdrawal review extended", body: input.note, actionUrl: "withdraw.html", entity: { type: "Withdrawal", id: withdrawal.id } });
    return tx.withdrawal.update({ where: { id: withdrawal.id }, data: { status: "HELD", reviewNote: input.note } });
  });
  await writeAudit("holdWithdrawal", "Withdrawal", row.id, undefined, { req, reason: input.note });
  return ok(res, row);
}));

v1AdminCoreRouter.post("/money/withdrawals/:id/request-information", financeRoles, asyncHandler(async (req, res) => {
  const input = z.object({ note: z.string().trim().min(5).max(1000) }).parse(req.body);
  const withdrawal = await prisma.withdrawal.findUnique({ where: { id: String(req.params.id) } });
  if (!withdrawal) throw new ApiError(404, "Withdrawal was not found", "WITHDRAWAL_NOT_FOUND");
  const row = await prisma.$transaction(async (tx) => {
    await notifyClientTx(tx, { clientId: withdrawal.clientId, category: "Wallet", title: "Withdrawal information required", body: input.note, actionUrl: "withdraw.html", entity: { type: "Withdrawal", id: withdrawal.id } });
    return tx.withdrawal.update({ where: { id: withdrawal.id }, data: { status: "UNDER_REVIEW", reviewNote: input.note } });
  });
  await writeAudit("requestWithdrawalInformation", "Withdrawal", row.id, undefined, { req, reason: input.note });
  return ok(res, row);
}));

v1AdminCoreRouter.post("/money/withdrawals/:id/settle", financeRoles, asyncHandler(async (req, res) => {
  const input = z.object({ externalReference: z.string().trim().min(4).max(160), note: z.string().trim().min(5).max(1000) }).parse(req.body);
  const row = await prisma.withdrawal.findUnique({ where: { id: String(req.params.id) } });
  if (!row) throw new ApiError(404, "Withdrawal was not found", "WITHDRAWAL_NOT_FOUND");
  if (row.status === "PAID") return ok(res, row);
  if (row.status !== "APPROVED" || !row.holdReference) throw new ApiError(409, "Withdrawal must complete maker-checker approval before settlement", "WITHDRAWAL_NOT_APPROVED");
  const updated = await prisma.$transaction(async (tx) => {
    const ledger = await captureWalletHoldTx(tx, row.holdReference!, { clientId: row.clientId, description: `Withdrawal ${row.reference}`, externalReference: input.externalReference, idempotencyKey: `settle:${row.id}`, initiatedBy: req.user!.id, approvedBy: req.user!.id });
    await notifyClientTx(tx, { clientId: row.clientId, category: "Wallet", title: "Withdrawal paid", body: `${row.reference} has been settled.`, actionUrl: "transactions.html", entity: { type: "Withdrawal", id: row.id } });
    return tx.withdrawal.update({ where: { id: row.id }, data: { status: "PAID", externalReference: input.externalReference, ledgerTransactionId: ledger.id, paidAt: new Date(), reviewNote: input.note } });
  });
  await writeAudit("settleWithdrawal", "Withdrawal", row.id, { externalReference: input.externalReference }, { req, reason: input.note });
  return ok(res, updated);
}));

v1AdminCoreRouter.get("/approvals", operationalRoles, asyncHandler(async (req, res) => {
  const status = typeof req.query.status === "string" ? req.query.status : "PENDING";
  const rows = await prisma.approvalRequest.findMany({ where: { status: status as never }, include: { initiatedBy: { select: { id: true, name: true, role: true } }, approvedBy: { select: { id: true, name: true, role: true } } }, orderBy: { createdAt: "asc" } });
  return ok(res, rows);
}));

v1AdminCoreRouter.post("/approvals/:id/approve", requireAdminRoles("SUPER_ADMIN", "FINANCE", "PORTFOLIO_MANAGER"), asyncHandler(async (req, res) => {
  const input = z.object({ note: z.string().trim().min(5).max(1000) }).parse(req.body);
  const approval = await prisma.approvalRequest.findUnique({ where: { id: String(req.params.id) } });
  if (!approval || approval.status !== "PENDING") throw new ApiError(404, "Pending approval was not found", "APPROVAL_NOT_FOUND");
  if (approval.expiresAt && approval.expiresAt <= new Date()) throw new ApiError(409, "Approval request has expired", "APPROVAL_EXPIRED");
  if (!(approvalRoles[approval.actionType] || ["SUPER_ADMIN"]).includes(req.user!.role)) {
    throw new ApiError(403, "Your role cannot approve this action", "APPROVAL_ROLE_FORBIDDEN");
  }

  const result = await prisma.$transaction(async (tx) => {
    let entity: unknown;
    if (approval.actionType === "CREDIT_DEPOSIT") {
      const deposit = await tx.deposit.findUnique({ where: { id: approval.entityId }, include: { client: true } });
      if (!deposit || deposit.status !== "AWAITING_APPROVAL") throw new ApiError(409, "Deposit is not awaiting approval", "INVALID_DEPOSIT_STATE");
      const payload = jsonObjectValue(approval.payload);
      entity = await creditDepositTx(tx, deposit, {
        note: input.note,
        received: typeof payload.received === "number" || typeof payload.received === "string" ? payload.received : undefined,
        externalReference: typeof payload.externalReference === "string" ? payload.externalReference : null,
        initiatedBy: approval.initiatedByAdminId,
        approvedBy: req.user!.id
      });
    } else if (approval.actionType === "APPROVE_WITHDRAWAL") {
      const withdrawal = await tx.withdrawal.findUnique({ where: { id: approval.entityId } });
      if (!withdrawal || withdrawal.status !== "AWAITING_APPROVAL") throw new ApiError(409, "Withdrawal is not awaiting approval", "INVALID_WITHDRAWAL_STATE");
      entity = await tx.withdrawal.update({ where: { id: withdrawal.id }, data: { status: "APPROVED", approvedAt: new Date() } });
      await notifyClientTx(tx, { clientId: withdrawal.clientId, category: "Wallet", title: "Withdrawal approved", body: `${withdrawal.reference} is approved and awaiting external settlement.`, actionUrl: "withdraw.html", entity: { type: "Withdrawal", id: withdrawal.id } });
    } else if (approval.actionType === "PUBLISH_PRODUCT") {
      entity = await tx.portfolioProduct.update({ where: { id: approval.entityId }, data: { status: "PUBLISHED", publishedAt: new Date(), version: { increment: 1 } } });
      await tx.portfolioProductVersion.updateMany({ where: { productId: approval.entityId, status: { in: ["REVIEW", "PENDING_APPROVAL"] } }, data: { status: "PUBLISHED", approvedBy: req.user!.id, publishedAt: new Date() } });
    } else if (approval.actionType === "POST_DISTRIBUTION") {
      const batch = await tx.distributionBatch.findUnique({ where: { id: approval.entityId }, include: { items: true, product: true } });
      if (!batch || batch.status !== "PENDING_APPROVAL") throw new ApiError(409, "Distribution is not awaiting approval", "INVALID_DISTRIBUTION_STATE");
      for (const item of batch.items) {
        if (item.status === "POSTED") continue;
        let ledgerId: string;
        if (item.mode === "WALLET" || !item.investmentId) {
          const ledger = await creditClientCashTx(tx, { clientId: item.clientId, amount: item.netAmount, type: batch.type === "DIVIDEND" ? "DIVIDEND" : "PROFIT", description: `${batch.type} distribution ${batch.reference}`, currency: batch.currency, idempotencyKey: `distribution:${item.id}`, initiatedBy: approval.initiatedByAdminId, approvedBy: req.user!.id });
          ledgerId = ledger.id;
        } else {
          const credit = await creditClientCashTx(tx, { clientId: item.clientId, amount: item.netAmount, type: batch.type === "DIVIDEND" ? "DIVIDEND" : "PROFIT", description: `${batch.type} reinvestment credit ${batch.reference}`, currency: batch.currency, idempotencyKey: `distribution-credit:${item.id}`, initiatedBy: approval.initiatedByAdminId, approvedBy: req.user!.id });
          await debitClientCashTx(tx, { clientId: item.clientId, amount: item.netAmount, type: "INVESTMENT_SUBSCRIPTION", description: `${batch.type} reinvestment ${batch.reference}`, currency: batch.currency, idempotencyKey: `distribution-reinvest:${item.id}`, initiatedBy: approval.initiatedByAdminId, approvedBy: req.user!.id });
          await tx.clientInvestment.update({ where: { id: item.investmentId }, data: { investedAmount: { increment: item.netAmount }, currentValue: { increment: item.netAmount }, units: { increment: item.netAmount } } });
          ledgerId = credit.id;
        }
        await tx.distributionItem.update({ where: { id: item.id }, data: { status: "POSTED", ledgerTransactionId: ledgerId } });
        await tx.payout.create({ data: { reference: reference("PAY"), clientId: item.clientId, distributionItemId: item.id, source: batch.product?.name || batch.reference, amount: item.netAmount, mode: item.mode, status: "CREDITED", payoutDate: new Date() } });
        await notifyClientTx(tx, { clientId: item.clientId, category: "Distribution", title: `${batch.type.toLowerCase()} posted`, body: `${batch.currency} ${item.netAmount} was ${item.mode === "REINVEST" ? "reinvested" : "credited to your wallet"}.`, actionUrl: "dividends.html", entity: { type: "DistributionItem", id: item.id } });
      }
      entity = await tx.distributionBatch.update({ where: { id: batch.id }, data: { status: "POSTED", approvedBy: req.user!.id, approvedAt: new Date(), postedAt: new Date() } });
    } else {
      throw new ApiError(422, "Approval action is not supported", "APPROVAL_ACTION_UNSUPPORTED");
    }
    await tx.approvalRequest.update({ where: { id: approval.id }, data: { status: "APPROVED", approvedByAdminId: req.user!.id, decisionNote: input.note, decidedAt: new Date() } });
    return entity;
  }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
  await writeAudit("approveAction", approval.entityType, approval.entityId, { approvalId: approval.id, actionType: approval.actionType }, { req, reason: input.note });
  return ok(res, { approvalId: approval.id, entity: result });
}));

v1AdminCoreRouter.post("/approvals/:id/reject", requireAdminRoles("SUPER_ADMIN", "FINANCE", "PORTFOLIO_MANAGER"), asyncHandler(async (req, res) => {
  const input = z.object({ note: z.string().trim().min(5).max(1000) }).parse(req.body);
  const approval = await prisma.approvalRequest.findUnique({ where: { id: String(req.params.id) } });
  if (!approval || approval.status !== "PENDING") throw new ApiError(404, "Pending approval was not found", "APPROVAL_NOT_FOUND");
  await prisma.$transaction(async (tx) => {
    await tx.approvalRequest.update({ where: { id: approval.id }, data: { status: "REJECTED", approvedByAdminId: req.user!.id, decisionNote: input.note, decidedAt: new Date() } });
    if (approval.actionType === "CREDIT_DEPOSIT") await tx.deposit.update({ where: { id: approval.entityId }, data: { status: "IN_REVIEW", reviewNote: input.note } });
    if (approval.actionType === "APPROVE_WITHDRAWAL") await tx.withdrawal.update({ where: { id: approval.entityId }, data: { status: "IN_REVIEW", reviewNote: input.note } });
    if (approval.actionType === "PUBLISH_PRODUCT") await tx.portfolioProduct.update({ where: { id: approval.entityId }, data: { status: "REVIEW" } });
    if (approval.actionType === "POST_DISTRIBUTION") await tx.distributionBatch.update({ where: { id: approval.entityId }, data: { status: "CALCULATED" } });
  });
  await writeAudit("rejectApproval", approval.entityType, approval.entityId, { approvalId: approval.id }, { req, reason: input.note });
  return ok(res, { rejected: true });
}));
