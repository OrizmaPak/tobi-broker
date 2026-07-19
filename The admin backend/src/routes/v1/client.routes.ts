import { Prisma } from "@prisma/client";
import { Router } from "express";
import { z } from "zod";
import { encryptSecret } from "../../lib/crypto";
import { ApiError, asyncHandler, ok, pageInput, pageMeta, reference } from "../../lib/http";
import { prisma } from "../../lib/prisma";
import { requireClient, requireCsrf } from "../../middleware/auth";
import { approvedKyc, clientDashboard, clientSnapshot } from "../../services/client.service";
import { storePrivateFile } from "../../services/file.service";
import { collectDepositProofData, findDepositMethod, getDepositMethodsSetting } from "../../services/deposit-method.service";
import { collectWithdrawalVerificationData, findWithdrawalMethod, getWithdrawalMethodsSetting } from "../../services/withdrawal-method.service";
import { idempotentMutation } from "../../services/idempotency.service";
import { buildKycChecklist, KYC_DOCUMENT_SIDES, summarizeKycChecklist } from "../../services/kyc.service";
import { debitClientCashTx, placeWalletHoldTx, releaseWalletHoldTx } from "../../services/ledger.service";
import { markAllNotificationsRead, markNotificationRead, notificationInbox, notifyAdminTx, notifyClient, notifyClientTx, notifyKycReviewReadyTx } from "../../services/notification.service";

export const v1ClientRouter = Router();
v1ClientRouter.use(requireClient);

function clientId(req: { user?: { id: string } }) {
  if (!req.user?.id) throw new ApiError(401, "Client session is missing", "AUTH_REQUIRED");
  return req.user.id;
}

async function verifiedClient(id: string) {
  const client = await prisma.client.findUnique({ where: { id } });
  if (!client) throw new ApiError(404, "Client was not found", "CLIENT_NOT_FOUND");
  return client;
}

async function kycRequired(id: string) {
  if (!await approvedKyc(id)) throw new ApiError(403, "Approved KYC is required for this action", "KYC_REQUIRED");
}

const moneySchema = z.coerce.number().positive().max(100_000_000);

function suitabilityScore(questionnaire: Record<string, unknown>) {
  const value = (key: string) => String(questionnaire[key] || "").toLowerCase();
  const objective = value("objective");
  const experience = value("experience");
  const lossTolerance = value("lossTolerance");
  const horizon = value("horizon");
  const objectiveScore = objective.includes("speculat") ? 30 : objective.includes("growth") ? 25 : objective.includes("income") ? 15 : 10;
  const experienceScore = experience.includes("advanced") || experience.includes("five") ? 30 : experience.includes("intermediate") || experience.includes("two") ? 20 : 10;
  const toleranceScore = lossTolerance.includes("high") ? 25 : lossTolerance.includes("moderate") || lossTolerance.includes("medium") ? 18 : 8;
  const horizonScore = horizon.includes("long") || horizon.includes("10") ? 15 : horizon.includes("medium") || horizon.includes("5") ? 10 : horizon ? 5 : 10;
  return Math.min(100, objectiveScore + experienceScore + toleranceScore + horizonScore);
}

v1ClientRouter.get("/dashboard", asyncHandler(async (req, res) => ok(res, await clientDashboard(clientId(req)))));

v1ClientRouter.get("/profile", asyncHandler(async (req, res) => {
  const client = await prisma.client.findUnique({
    where: { id: clientId(req) },
    select: {
      id: true, accountNumber: true, name: true, email: true, phone: true, country: true,
      addressLine1: true, addressLine2: true, city: true, state: true, postalCode: true,
      taxResidence: true, taxId: true, baseCurrency: true, status: true, riskLevel: true,
      tier: true, emailVerifiedAt: true, phoneVerifiedAt: true, preferences: true, lastLoginAt: true
    }
  });
  return ok(res, client);
}));

v1ClientRouter.put("/profile", requireCsrf, asyncHandler(async (req, res) => {
  const input = z.object({
    name: z.string().trim().min(2).max(120).optional(),
    phone: z.string().trim().min(7).max(30).optional(),
    country: z.string().trim().min(2).max(80).optional(),
    addressLine1: z.string().trim().min(3).max(160).optional(),
    addressLine2: z.string().trim().max(160).optional().nullable(),
    city: z.string().trim().min(2).max(80).optional(),
    state: z.string().trim().max(80).optional().nullable(),
    postalCode: z.string().trim().max(30).optional().nullable(),
    taxResidence: z.string().trim().max(80).optional().nullable(),
    taxId: z.string().trim().max(60).optional().nullable()
  }).parse(req.body);
  const client = await prisma.client.update({ where: { id: clientId(req) }, data: input });
  return ok(res, client);
}));

v1ClientRouter.put("/settings", requireCsrf, asyncHandler(async (req, res) => {
  const input = z.object({
    emailNotifications: z.boolean().default(true),
    inAppNotifications: z.boolean().default(true),
    marketAlerts: z.boolean().default(true),
    distributionPreference: z.enum(["WALLET", "REINVEST"]).default("WALLET")
  }).parse(req.body);
  const client = await prisma.client.update({ where: { id: clientId(req) }, data: { preferences: input } });
  await prisma.clientInvestment.updateMany({ where: { clientId: client.id }, data: { reinvestPreference: input.distributionPreference } });
  return ok(res, input);
}));

v1ClientRouter.get("/kyc", asyncHandler(async (req, res) => {
  const id = clientId(req);
  const cases = await prisma.kycCase.findMany({
    where: { clientId: id },
    include: { documents: { include: { requirement: true }, orderBy: { uploadedAt: "desc" } }, checks: true, decisions: { orderBy: { createdAt: "desc" } } },
    orderBy: { updatedAt: "desc" }
  });
  return ok(res, cases);
}));

v1ClientRouter.get("/kyc/requirements", asyncHandler(async (req, res) => {
  const id = clientId(req);
  const [requirements, kycCase] = await Promise.all([
    prisma.kycDocumentRequirement.findMany({ where: { isActive: true }, orderBy: [{ sortOrder: "asc" }, { documentType: "asc" }] }),
    prisma.kycCase.findFirst({
      where: { clientId: id },
      include: { documents: { include: { requirement: true }, orderBy: { uploadedAt: "desc" } }, decisions: { orderBy: { createdAt: "desc" } } },
      orderBy: { updatedAt: "desc" }
    })
  ]);
  const checklist = buildKycChecklist(requirements, kycCase?.documents || []);
  return ok(res, { case: kycCase, requirements: checklist, summary: summarizeKycChecklist(checklist) });
}));

v1ClientRouter.post("/kyc/start", requireCsrf, asyncHandler(async (req, res) => {
  const id = clientId(req);
  await verifiedClient(id);
  const latest = await prisma.kycCase.findFirst({ where: { clientId: id }, orderBy: { updatedAt: "desc" } });
  if (latest?.status === "APPROVED") return ok(res, latest);
  if (latest && latest.status !== "REJECTED") return ok(res, latest);
  const kycCase = await prisma.kycCase.create({ data: { clientId: id, status: "DRAFT", level: "Standard" } });
  return ok(res, kycCase, 201);
}));

v1ClientRouter.post("/kyc/submit", requireCsrf, asyncHandler(async (req, res) => {
  const id = clientId(req);
  const client = await verifiedClient(id);
  const input = z.object({
    level: z.string().trim().min(2).max(40).default("Standard"),
    questionnaire: z.record(z.string(), z.unknown()).default({})
  }).parse(req.body);
  const score = suitabilityScore(input.questionnaire);
  const riskLevel = score >= 75 ? "HIGH" : score >= 45 ? "MODERATE" : "LOW";
  const [latest, requirements] = await Promise.all([
    prisma.kycCase.findFirst({ where: { clientId: id }, include: { documents: true }, orderBy: { updatedAt: "desc" } }),
    prisma.kycDocumentRequirement.findMany({ where: { isActive: true, isRequired: true }, orderBy: { sortOrder: "asc" } })
  ]);
  if (latest?.status === "APPROVED") throw new ApiError(409, "KYC is already approved", "KYC_ALREADY_APPROVED");
  if (!latest) throw new ApiError(409, "Start KYC verification before submitting documents", "KYC_NOT_STARTED");
  const checklist = buildKycChecklist(requirements, latest.documents);
  const summary = summarizeKycChecklist(checklist);
  if (!summary.uploadComplete) {
    const fields = Object.fromEntries(checklist
      .filter((requirement) => requirement.isRequired)
      .flatMap((requirement) => requirement.uploads
        .filter((upload) => !upload.document)
        .map((upload) => [`${requirement.code}.${upload.side}`, [`${requirement.documentType} ${upload.side.toLowerCase()} is required`]])));
    throw new ApiError(422, "Upload every required KYC document before submitting", "KYC_DOCUMENTS_INCOMPLETE", fields);
  }
  const requiredDocumentIds = checklist
    .filter((requirement) => requirement.isRequired)
    .flatMap((requirement) => requirement.uploads.map((upload) => upload.document!.id));
  const kycCase = await prisma.$transaction(async (tx) => {
    const row = await tx.kycCase.update({
      where: { id: latest.id },
      data: { status: "SUBMITTED", level: input.level, submittedAt: new Date(), riskQuestionnaire: input.questionnaire as Prisma.InputJsonObject, suitabilityScore: score }
    });
    await tx.client.update({ where: { id }, data: { riskQuestionnaire: input.questionnaire as Prisma.InputJsonObject, suitabilityScore: score, riskLevel } });
    const existingReview = await tx.kycReview.findFirst({ where: { clientId: id }, orderBy: { updatedAt: "desc" } });
    if (existingReview) {
      await tx.kycReview.update({ where: { id: existingReview.id }, data: { status: "IN_REVIEW", decisionNote: "Submitted through the client portal" } });
    } else {
      await tx.kycReview.create({ data: { clientId: id, requirement: "Identity and address verification", status: "IN_REVIEW", decisionNote: "Submitted through the client portal" } });
    }
    await notifyKycReviewReadyTx(tx, {
      caseId: row.id,
      clientId: id,
      clientName: client.name,
      accountNumber: client.accountNumber,
      level: input.level,
      requiredDocumentIds,
      summary: summary as Prisma.InputJsonObject
    });
    return row;
  });
  return ok(res, kycCase, 201);
}));

v1ClientRouter.post("/kyc/documents", requireCsrf, asyncHandler(async (req, res) => {
  const id = clientId(req);
  const input = z.object({
    caseId: z.string().min(1),
    requirementId: z.string().min(1),
    side: z.enum(KYC_DOCUMENT_SIDES).default("FRONT"),
    fileName: z.string().trim().min(1).max(160),
    mimeType: z.enum(["application/pdf", "image/jpeg", "image/png"]),
    base64: z.string().min(4)
  }).parse(req.body);
  const [kycCase, requirement] = await Promise.all([
    prisma.kycCase.findFirst({ where: { id: input.caseId, clientId: id } }),
    prisma.kycDocumentRequirement.findFirst({ where: { id: input.requirementId, isActive: true } })
  ]);
  if (!kycCase) throw new ApiError(404, "KYC case was not found", "KYC_CASE_NOT_FOUND");
  if (!requirement) throw new ApiError(404, "KYC document requirement was not found", "KYC_REQUIREMENT_NOT_FOUND");
  if (["APPROVED", "REJECTED"].includes(kycCase.status)) throw new ApiError(409, "Documents cannot be changed after a final decision", "KYC_CASE_CLOSED");
  if (requirement.uploadMode === "FRONT_ONLY" && input.side !== "FRONT") throw new ApiError(422, "This document requires one front upload only", "INVALID_DOCUMENT_SIDE");
  const stored = await storePrivateFile({ ownerType: "CLIENT", ownerId: id, category: "KYC", fileName: input.fileName, mimeType: input.mimeType, base64: input.base64 });
  const document = await prisma.kycDocument.create({
    data: { caseId: kycCase.id, requirementId: requirement.id, type: requirement.documentType, side: input.side, storageKey: stored.storageKey, fileName: stored.fileName, mimeType: stored.mimeType, size: stored.size, checksum: stored.checksum },
    include: { requirement: true }
  });
  if (kycCase.status === "RESUBMISSION_REQUIRED") await prisma.kycCase.update({ where: { id: kycCase.id }, data: { status: "DRAFT" } });
  return ok(res, document, 201);
}));

v1ClientRouter.get("/wallet", asyncHandler(async (req, res) => {
  const snapshot = await clientDashboard(clientId(req));
  return ok(res, { wallet: snapshot.wallet, metrics: snapshot.metrics, transactions: snapshot.transactions, deposits: snapshot.deposits, withdrawals: snapshot.withdrawals, beneficiaries: snapshot.beneficiaries });
}));

v1ClientRouter.get("/transactions", asyncHandler(async (req, res) => {
  const id = clientId(req);
  const { page, limit, skip } = pageInput(req.query);
  const account = await prisma.ledgerAccount.findFirst({ where: { wallet: { clientId: id }, kind: "CLIENT_CASH" } });
  if (!account) return ok(res, [], 200, pageMeta(page, limit, 0));
  const [entries, total] = await Promise.all([
    prisma.ledgerEntry.findMany({ where: { accountId: account.id }, include: { transaction: true }, orderBy: { createdAt: "desc" }, skip, take: limit }),
    prisma.ledgerEntry.count({ where: { accountId: account.id } })
  ]);
  return ok(res, entries.map((entry) => ({ ...entry.transaction, amount: entry.side === "DEBIT" ? entry.amount : entry.amount.negated(), side: entry.side })), 200, pageMeta(page, limit, total));
}));

v1ClientRouter.get("/beneficiaries", asyncHandler(async (req, res) => {
  const rows = await prisma.beneficiary.findMany({ where: { clientId: clientId(req) }, orderBy: { createdAt: "desc" } });
  return ok(res, rows);
}));

v1ClientRouter.post("/beneficiaries", requireCsrf, asyncHandler(async (req, res) => {
  const id = clientId(req);
  await verifiedClient(id);
  const input = z.discriminatedUnion("type", [
    z.object({
      type: z.literal("BANK"),
      methodId: z.string().trim().max(80).optional(),
      label: z.string().trim().min(2).max(80),
      currency: z.string().length(3).default("USD"),
      bankName: z.string().trim().min(2).max(100).optional(),
      accountName: z.string().trim().min(2).max(120).optional(),
      accountNumber: z.string().trim().min(4).max(80).optional(),
      verificationData: z.record(z.string(), z.unknown()).default({})
    }),
    z.object({
      type: z.literal("CRYPTO"),
      methodId: z.string().trim().max(80).optional(),
      label: z.string().trim().min(2).max(80),
      currency: z.string().min(2).max(10).default("USDT"),
      cryptoNetwork: z.string().trim().min(2).max(40).optional(),
      walletAddress: z.string().trim().min(8).max(200).optional(),
      verificationData: z.record(z.string(), z.unknown()).default({})
    })
  ]).parse(req.body);
  const withdrawalMethods = await getWithdrawalMethodsSetting();
  const method = findWithdrawalMethod(withdrawalMethods, input.type, input.methodId);
  if (!method) throw new ApiError(422, "This withdrawal destination type is not currently available", "WITHDRAWAL_METHOD_UNAVAILABLE");
  const mergedVerificationData = {
    ...input.verificationData,
    ...(input.type === "BANK" ? {
      bankName: input.bankName || input.verificationData.bankName,
      accountName: input.accountName || input.verificationData.accountName,
      accountNumber: input.accountNumber || input.verificationData.accountNumber
    } : {
      currency: input.currency || input.verificationData.currency,
      cryptoNetwork: input.cryptoNetwork || input.verificationData.cryptoNetwork,
      walletAddress: input.walletAddress || input.verificationData.walletAddress
    })
  };
  const collected = collectWithdrawalVerificationData(method, mergedVerificationData);
  if (Object.keys(collected.fields).length) throw new ApiError(422, "Complete the required withdrawal verification fields", "WITHDRAWAL_VERIFICATION_INCOMPLETE", collected.fields);
  const row = input.type === "BANK"
    ? await prisma.beneficiary.create({ data: { clientId: id, type: "BANK", label: input.label, currency: input.currency, bankName: collected.values.bankName || input.bankName, accountName: collected.values.accountName || input.accountName, accountNumberMasked: `****${String(collected.values.accountNumber || input.accountNumber).slice(-4)}`, accountToken: encryptSecret(String(collected.values.accountNumber || input.accountNumber)), verificationMethodId: method.id, verificationData: collected.values as Prisma.InputJsonObject, cooldownUntil: new Date(Date.now() + method.cooldownHours * 60 * 60 * 1000) } })
    : await prisma.beneficiary.create({ data: { clientId: id, type: "CRYPTO", label: input.label, currency: collected.values.currency || input.currency, cryptoNetwork: collected.values.cryptoNetwork || input.cryptoNetwork, walletAddressMasked: `${String(collected.values.walletAddress || input.walletAddress).slice(0, 6)}...${String(collected.values.walletAddress || input.walletAddress).slice(-6)}`, walletAddressToken: encryptSecret(String(collected.values.walletAddress || input.walletAddress)), verificationMethodId: method.id, verificationData: collected.values as Prisma.InputJsonObject, cooldownUntil: new Date(Date.now() + method.cooldownHours * 60 * 60 * 1000) } });
  return ok(res, row, 201);
}));

v1ClientRouter.post("/deposits", requireCsrf, asyncHandler(async (req, res) => {
  const id = clientId(req);
  const client = await verifiedClient(id);
  const input = z.object({
    amount: moneySchema,
    currency: z.string().length(3).default("USD"),
    method: z.enum(["BANK", "CRYPTO", "CARD"]),
    rail: z.string().trim().min(2).max(80),
    evidenceFileId: z.string().optional(),
    transactionHash: z.string().trim().min(8).max(200).optional(),
    externalReference: z.string().trim().max(120).optional(),
    proofData: z.record(z.string(), z.unknown()).default({})
  }).parse(req.body);
  if (input.method === "CARD") throw new ApiError(503, "Card funding is not currently enabled", "CARD_FUNDING_UNAVAILABLE");
  const depositMethods = await getDepositMethodsSetting();
  const configuredMethod = findDepositMethod(depositMethods, input.method, input.rail);
  if (!configuredMethod) throw new ApiError(422, "This deposit route is not currently available", "DEPOSIT_METHOD_UNAVAILABLE");
  const proofFields: Record<string, string[]> = {};
  if (configuredMethod.requireReference && !input.externalReference) proofFields.externalReference = ["Transfer reference is required for this deposit route"];
  if (configuredMethod.requireTransactionHash && !input.transactionHash) proofFields.transactionHash = ["Transaction hash is required for this deposit route"];
  if (configuredMethod.requireReceiptUpload && !input.evidenceFileId) proofFields.evidenceFileId = ["Receipt or transfer proof upload is required for this deposit route"];
  const collectedProof = collectDepositProofData(configuredMethod, input.proofData);
  Object.assign(proofFields, collectedProof.fields);
  if (Object.keys(proofFields).length) throw new ApiError(422, "Complete the required deposit proof fields", "DEPOSIT_PROOF_INCOMPLETE", proofFields);
  const result = await idempotentMutation(req, id, "POST:/client/deposits", async (tx) => {
    const deposit = await tx.deposit.create({
      data: {
        reference: reference("DEP"), clientId: id, method: input.method, rail: configuredMethod.name,
        amount: input.amount, currency: input.currency, evidenceFileId: input.evidenceFileId,
        proofData: collectedProof.values as Prisma.InputJsonObject,
        transactionHash: input.transactionHash, externalReference: input.externalReference,
        status: "IN_REVIEW", reviewNote: "Submitted through the client portal"
      }
    });
    await notifyClientTx(tx, { clientId: id, email: client.email, category: "Wallet", title: "Deposit submitted", body: `Deposit ${deposit.reference} is awaiting operations review.`, actionUrl: "transactions.html", entity: { type: "Deposit", id: deposit.id } });
    await notifyAdminTx(tx, {
      clientId: id,
      category: "Wallet",
      eventKey: "deposit.created",
      severity: "INFO",
      title: "Deposit submitted",
      body: `${client.name} (${client.accountNumber}) submitted ${deposit.currency} ${deposit.amount} via ${deposit.rail || deposit.method}.`,
      actionUrl: `deposit-review.html?id=${deposit.id}`,
      entity: { type: "Deposit", id: deposit.id },
      metadata: { clientId: id, accountNumber: client.accountNumber, reference: deposit.reference, amount: String(deposit.amount), currency: deposit.currency, method: deposit.method, rail: deposit.rail },
      dedupeKey: `deposit.created:${deposit.id}`
    });
    return deposit;
  });
  return ok(res, result.data, result.cached ? 200 : 201, { cached: result.cached, kycApproved: await approvedKyc(id) });
}));

v1ClientRouter.post("/deposits/:id/proof", requireCsrf, asyncHandler(async (req, res) => {
  const id = clientId(req);
  const client = await verifiedClient(id);
  const deposit = await prisma.deposit.findFirst({ where: { id: String(req.params.id), clientId: id } });
  if (!deposit) throw new ApiError(404, "Deposit was not found", "DEPOSIT_NOT_FOUND");
  if (!["UNDER_REVIEW", "IN_REVIEW", "PENDING", "FLAGGED"].includes(deposit.status)) {
    throw new ApiError(409, "This deposit is not open for proof resubmission", "DEPOSIT_PROOF_NOT_OPEN");
  }
  const input = z.object({
    evidenceFileId: z.string().optional(),
    transactionHash: z.string().trim().min(8).max(200).optional(),
    externalReference: z.string().trim().max(120).optional(),
    proofData: z.record(z.string(), z.unknown()).default({})
  }).parse(req.body);
  const depositMethods = await getDepositMethodsSetting();
  const configuredMethod = findDepositMethod(depositMethods, deposit.method, deposit.rail);
  if (!configuredMethod) throw new ApiError(422, "The original deposit route is no longer available. Contact support.", "DEPOSIT_METHOD_UNAVAILABLE");
  const proofFields: Record<string, string[]> = {};
  const nextReference = input.externalReference || deposit.externalReference || undefined;
  const nextHash = input.transactionHash || deposit.transactionHash || undefined;
  const nextEvidence = input.evidenceFileId || deposit.evidenceFileId || undefined;
  if (configuredMethod.requireReference && !nextReference) proofFields.externalReference = ["Transfer reference is required for this deposit route"];
  if (configuredMethod.requireTransactionHash && !nextHash) proofFields.transactionHash = ["Transaction hash is required for this deposit route"];
  if (configuredMethod.requireReceiptUpload && !nextEvidence) proofFields.evidenceFileId = ["Receipt or transfer proof upload is required for this deposit route"];
  const collectedProof = collectDepositProofData(configuredMethod, input.proofData);
  Object.assign(proofFields, collectedProof.fields);
  if (Object.keys(proofFields).length) throw new ApiError(422, "Complete the required deposit proof fields", "DEPOSIT_PROOF_INCOMPLETE", proofFields);
  const updated = await prisma.$transaction(async (tx) => {
    const row = await tx.deposit.update({
      where: { id: deposit.id },
      data: {
        evidenceFileId: nextEvidence,
        transactionHash: nextHash,
        externalReference: nextReference,
        proofData: collectedProof.values as Prisma.InputJsonObject,
        status: "IN_REVIEW",
        reviewNote: "Proof resubmitted through the client portal",
        submittedAt: new Date()
      }
    });
    await notifyClientTx(tx, { clientId: id, email: client.email, category: "Wallet", title: "Deposit proof resubmitted", body: `Deposit ${row.reference} is back in operations review.`, actionUrl: `deposit.html?deposit=${row.id}`, entity: { type: "Deposit", id: row.id } });
    await notifyAdminTx(tx, {
      clientId: id,
      category: "Wallet",
      eventKey: "deposit.proof_resubmitted",
      severity: "INFO",
      title: "Deposit proof resubmitted",
      body: `${client.name} (${client.accountNumber}) resubmitted proof for ${row.reference}.`,
      actionUrl: `deposit-review.html?id=${row.id}`,
      entity: { type: "Deposit", id: row.id },
      metadata: { clientId: id, accountNumber: client.accountNumber, reference: row.reference, depositId: row.id },
      dedupeKey: `deposit.proof_resubmitted:${row.id}:${Date.now()}`
    });
    return row;
  });
  return ok(res, updated);
}));

v1ClientRouter.post("/withdrawals", requireCsrf, asyncHandler(async (req, res) => {
  const id = clientId(req);
  const client = await verifiedClient(id);
  await kycRequired(id);
  const input = z.object({ amount: moneySchema, currency: z.string().length(3).default("USD"), beneficiaryId: z.string().min(1) }).parse(req.body);
  const beneficiary = await prisma.beneficiary.findFirst({ where: { id: input.beneficiaryId, clientId: id } });
  if (!beneficiary || beneficiary.status !== "VERIFIED") throw new ApiError(403, "A verified beneficiary is required", "BENEFICIARY_NOT_VERIFIED");
  if (beneficiary.cooldownUntil && beneficiary.cooldownUntil > new Date()) throw new ApiError(409, "The beneficiary security cooling-off period is still active", "BENEFICIARY_COOLDOWN");
  if (beneficiary.currency !== input.currency) throw new ApiError(422, "Beneficiary currency does not match the withdrawal", "CURRENCY_MISMATCH");
  const result = await idempotentMutation(req, id, "POST:/client/withdrawals", async (tx) => {
    const hold = await placeWalletHoldTx(tx, id, input.amount, `Withdrawal to ${beneficiary.label}`, input.currency);
    return tx.withdrawal.create({
      data: {
        reference: reference("WDR"), clientId: id, beneficiaryId: beneficiary.id,
        destination: beneficiary.label, currency: input.currency, amount: input.amount,
        netAmount: input.amount, status: "IN_REVIEW", holdReference: hold.reference,
        reviewNote: "Submitted through the client portal"
      }
    });
  });
  if (!result.cached) await notifyClient({ clientId: id, email: client.email, category: "Wallet", title: "Withdrawal submitted", body: `Withdrawal ${String((result.data as { reference: string }).reference)} is awaiting finance and risk review.`, actionUrl: "withdraw.html" });
  return ok(res, result.data, result.cached ? 200 : 201, { cached: result.cached });
}));

v1ClientRouter.post("/withdrawals/:id/cancel", requireCsrf, asyncHandler(async (req, res) => {
  const id = clientId(req);
  const row = await prisma.withdrawal.findFirst({ where: { id: String(req.params.id), clientId: id } });
  if (!row) throw new ApiError(404, "Withdrawal was not found", "WITHDRAWAL_NOT_FOUND");
  if (!["PENDING", "REQUESTED", "IN_REVIEW", "UNDER_REVIEW", "HELD"].includes(row.status)) throw new ApiError(409, "This withdrawal can no longer be cancelled", "WITHDRAWAL_NOT_CANCELLABLE");
  const updated = await prisma.$transaction(async (tx) => {
    if (row.holdReference) await releaseWalletHoldTx(tx, row.holdReference);
    return tx.withdrawal.update({ where: { id: row.id }, data: { status: "CANCELLED", reviewNote: "Cancelled by client" } });
  });
  return ok(res, updated);
}));

v1ClientRouter.get("/portfolios", asyncHandler(async (_req, res) => {
  const products = await prisma.portfolioProduct.findMany({ where: { status: "PUBLISHED" }, include: { allocations: { where: { effectiveTo: null }, include: { instrument: true } }, feeRules: { where: { active: true } } }, orderBy: { minimum: "asc" } });
  return ok(res, products);
}));

v1ClientRouter.get("/portfolios/:id", asyncHandler(async (req, res) => {
  const product = await prisma.portfolioProduct.findFirst({ where: { id: String(req.params.id), status: "PUBLISHED" }, include: { allocations: { where: { effectiveTo: null }, include: { instrument: true } }, feeRules: { where: { active: true } }, versions: { orderBy: { version: "desc" }, take: 1 } } });
  if (!product) throw new ApiError(404, "Portfolio was not found", "PORTFOLIO_NOT_FOUND");
  return ok(res, product);
}));

v1ClientRouter.get("/investments", asyncHandler(async (req, res) => {
  const rows = await prisma.clientInvestment.findMany({ where: { clientId: clientId(req) }, include: { product: true, holdings: { include: { instrument: true } }, valuations: { orderBy: { asOf: "desc" }, take: 24 }, transactions: { orderBy: { createdAt: "desc" } } }, orderBy: { updatedAt: "desc" } });
  return ok(res, rows);
}));

v1ClientRouter.post("/investments", requireCsrf, asyncHandler(async (req, res) => {
  const id = clientId(req);
  const client = await verifiedClient(id);
  await kycRequired(id);
  const input = z.object({ productId: z.string().min(1), amount: moneySchema, reinvestPreference: z.enum(["WALLET", "REINVEST"]).default("WALLET") }).parse(req.body);
  const product = await prisma.portfolioProduct.findFirst({ where: { id: input.productId, status: "PUBLISHED" } });
  if (!product) throw new ApiError(404, "Portfolio was not found or is not open", "PORTFOLIO_UNAVAILABLE");
  if (new Prisma.Decimal(input.amount).lessThan(product.minimum)) throw new ApiError(422, `Minimum subscription is ${product.currency} ${product.minimum}`, "BELOW_MINIMUM");
  const levels = { LOW: 1, MODERATE: 2, HIGH: 3, CUSTOM: 4 };
  if (levels[product.riskLevel] > levels[client.riskLevel] + 1) throw new ApiError(403, "This portfolio is outside your approved risk profile", "RISK_PROFILE_MISMATCH");
  const productVersion = await prisma.portfolioProductVersion.findFirst({ where: { productId: product.id, status: "PUBLISHED" }, orderBy: { version: "desc" } });
  if (!productVersion) throw new ApiError(409, "This portfolio does not have published terms", "PRODUCT_VERSION_REQUIRED");
  const result = await idempotentMutation(req, id, "POST:/client/investments", async (tx) => {
    const ledger = await debitClientCashTx(tx, { clientId: id, amount: input.amount, type: "INVESTMENT_SUBSCRIPTION", description: `Subscription to ${product.name}`, currency: product.currency, idempotencyKey: req.get("idempotency-key")!, initiatedBy: id, metadata: { productId: product.id } });
    const investment = await tx.clientInvestment.create({
      data: {
        clientId: id, productId: product.id, productVersionId: productVersion.id,
        investedAmount: input.amount, currentValue: input.amount, units: input.amount,
        currency: product.currency, status: "ACTIVE", reinvestPreference: input.reinvestPreference,
        projectedReturnLabel: "Projected, market-based performance", nextAction: "Monitor valuation and the next distribution window",
        transactions: { create: { reference: reference("INV"), type: "SUBSCRIPTION", amount: input.amount, units: input.amount, unitPrice: 1, ledgerTransactionId: ledger.id } },
        valuations: { create: { value: input.amount, unitPrice: 1, source: "Subscription value", asOf: new Date() } }
      },
      include: { product: true }
    });
    return investment;
  });
  if (!result.cached) await notifyClient({ clientId: id, email: client.email, category: "Investment", title: "Portfolio subscription active", body: `${product.name} has been added to your investments.`, actionUrl: "active-investments.html" });
  return ok(res, result.data, result.cached ? 200 : 201, { cached: result.cached });
}));

v1ClientRouter.post("/investments/:id/exit", requireCsrf, asyncHandler(async (req, res) => {
  const id = clientId(req);
  const investment = await prisma.clientInvestment.findFirst({ where: { id: String(req.params.id), clientId: id } });
  if (!investment) throw new ApiError(404, "Investment was not found", "INVESTMENT_NOT_FOUND");
  if (investment.status !== "ACTIVE") throw new ApiError(409, "Only active investments can request an exit", "INVESTMENT_NOT_ACTIVE");
  const updated = await prisma.clientInvestment.update({ where: { id: investment.id }, data: { status: "EXIT_REQUESTED", nextAction: "Portfolio desk exit review" } });
  return ok(res, updated);
}));

v1ClientRouter.get("/instruments", asyncHandler(async (req, res) => {
  const category = typeof req.query.category === "string" ? req.query.category : undefined;
  const rows = await prisma.instrument.findMany({ where: { status: { notIn: ["INACTIVE", "SUSPENDED", "HIDDEN"] }, ...(category ? { category: { equals: category, mode: "insensitive" } } : {}) }, orderBy: { symbol: "asc" } });
  return ok(res, rows);
}));

v1ClientRouter.get("/watchlist", asyncHandler(async (req, res) => {
  const rows = await prisma.watchlistItem.findMany({ where: { clientId: clientId(req) }, include: { instrument: true }, orderBy: { createdAt: "desc" } });
  return ok(res, rows);
}));

v1ClientRouter.post("/watchlist", requireCsrf, asyncHandler(async (req, res) => {
  const id = clientId(req);
  const input = z.object({ instrumentId: z.string().min(1), notes: z.string().max(240).optional() }).parse(req.body);
  const row = await prisma.watchlistItem.upsert({ where: { clientId_instrumentId: { clientId: id, instrumentId: input.instrumentId } }, update: { notes: input.notes }, create: { clientId: id, instrumentId: input.instrumentId, notes: input.notes }, include: { instrument: true } });
  return ok(res, row, 201);
}));

v1ClientRouter.delete("/watchlist/:instrumentId", requireCsrf, asyncHandler(async (req, res) => {
  await prisma.watchlistItem.deleteMany({ where: { clientId: clientId(req), instrumentId: String(req.params.instrumentId) } });
  return ok(res, { removed: true });
}));

v1ClientRouter.get("/orders", asyncHandler(async (req, res) => {
  const rows = await prisma.order.findMany({ where: { clientId: clientId(req) }, include: { instrument: true, fills: true }, orderBy: { submittedAt: "desc" } });
  return ok(res, rows);
}));

v1ClientRouter.post("/orders", requireCsrf, asyncHandler(async (req, res) => {
  const id = clientId(req);
  const client = await verifiedClient(id);
  await kycRequired(id);
  const input = z.object({ instrumentId: z.string().min(1), side: z.enum(["BUY", "SELL"]), type: z.enum(["MARKET", "LIMIT", "STOP", "STOP_LIMIT"]), quantity: moneySchema, limitPrice: moneySchema.optional(), stopPrice: moneySchema.optional() }).parse(req.body);
  const instrument = await prisma.instrument.findUnique({ where: { id: input.instrumentId } });
  if (!instrument || !instrument.tradable || instrument.status === "SUSPENDED") throw new ApiError(403, "Instrument is not available for order requests", "INSTRUMENT_NOT_TRADABLE");
  if (input.type.includes("LIMIT") && !input.limitPrice) throw new ApiError(422, "A limit price is required", "LIMIT_PRICE_REQUIRED");
  const optionsAccess = await prisma.optionsApplication.findFirst({ where: { clientId: id }, orderBy: { updatedAt: "desc" } });
  if (instrument.category.toLowerCase().includes("option") && optionsAccess?.status !== "APPROVED") throw new ApiError(403, "Approved options access is required", "OPTIONS_ACCESS_REQUIRED");
  const executionPrice = input.limitPrice || Number(instrument.currentPrice || 0);
  if (!executionPrice) throw new ApiError(409, "The instrument has no current admin-managed price", "PRICE_UNAVAILABLE");
  const estimatedAmount = new Prisma.Decimal(executionPrice).mul(input.quantity);
  const result = await idempotentMutation(req, id, "POST:/client/orders", async (tx) => {
    let holdReference: string | undefined;
    if (input.side === "BUY") {
      const hold = await placeWalletHoldTx(tx, id, estimatedAmount, `Order request for ${instrument.symbol}`, instrument.currency);
      holdReference = hold.reference;
    } else {
      const position = await tx.position.findUnique({ where: { clientId_instrumentId: { clientId: id, instrumentId: instrument.id } } });
      if (!position || new Prisma.Decimal(position.quantity).lessThan(input.quantity)) throw new ApiError(409, "Position quantity is insufficient", "INSUFFICIENT_POSITION");
    }
    return tx.order.create({ data: { reference: reference("ORD"), clientId: id, instrumentId: instrument.id, side: input.side, type: input.type, quantity: input.quantity, limitPrice: input.limitPrice, stopPrice: input.stopPrice, currency: instrument.currency, estimatedAmount, holdReference, status: "PENDING_REVIEW" }, include: { instrument: true } });
  });
  if (!result.cached) await notifyClient({ clientId: id, email: client.email, category: "Trading", title: "Order request submitted", body: `${instrument.symbol} order request is awaiting the internal order desk.`, actionUrl: "orders.html" });
  return ok(res, result.data, result.cached ? 200 : 201, { cached: result.cached, executionMode: "INTERNAL_ORDER_DESK" });
}));

v1ClientRouter.post("/orders/:id/cancel", requireCsrf, asyncHandler(async (req, res) => {
  const id = clientId(req);
  const order = await prisma.order.findFirst({ where: { id: String(req.params.id), clientId: id } });
  if (!order) throw new ApiError(404, "Order was not found", "ORDER_NOT_FOUND");
  if (!["PENDING_REVIEW", "APPROVED"].includes(order.status)) throw new ApiError(409, "Order can no longer be cancelled", "ORDER_NOT_CANCELLABLE");
  const updated = await prisma.$transaction(async (tx) => {
    if (order.holdReference) await releaseWalletHoldTx(tx, order.holdReference);
    return tx.order.update({ where: { id: order.id }, data: { status: "CANCELLED" } });
  });
  return ok(res, updated);
}));

v1ClientRouter.get("/options", asyncHandler(async (req, res) => {
  const id = clientId(req);
  const [application, contracts] = await Promise.all([
    prisma.optionsApplication.findFirst({ where: { clientId: id }, orderBy: { updatedAt: "desc" } }),
    prisma.optionContract.findMany({ where: { status: "ACTIVE", expiry: { gt: new Date() } }, include: { underlying: true }, orderBy: { expiry: "asc" } })
  ]);
  return ok(res, { status: application?.status || "NOT_APPLIED", application, contracts: application?.status === "APPROVED" ? contracts : [] });
}));

v1ClientRouter.post("/options/apply", requireCsrf, asyncHandler(async (req, res) => {
  const id = clientId(req);
  await verifiedClient(id);
  await kycRequired(id);
  const input = z.object({
    questionnaire: z.object({
      experience: z.enum(["NONE", "UNDER_2", "TWO_TO_FIVE", "OVER_FIVE"]),
      knowledge: z.enum(["BASIC", "INTERMEDIATE", "ADVANCED"]),
      lossTolerance: z.enum(["LOW", "MEDIUM", "HIGH"]),
      objective: z.enum(["INCOME", "GROWTH", "HEDGING", "SPECULATION"])
    }),
    disclosureAccepted: z.literal(true)
  }).parse(req.body);
  const score = {
    experience: { NONE: 0, UNDER_2: 10, TWO_TO_FIVE: 20, OVER_FIVE: 30 },
    knowledge: { BASIC: 5, INTERMEDIATE: 15, ADVANCED: 25 },
    lossTolerance: { LOW: 5, MEDIUM: 15, HIGH: 25 },
    objective: { INCOME: 5, GROWTH: 15, HEDGING: 20, SPECULATION: 20 }
  } as const;
  const suitabilityScore = score.experience[input.questionnaire.experience]
    + score.knowledge[input.questionnaire.knowledge]
    + score.lossTolerance[input.questionnaire.lossTolerance]
    + score.objective[input.questionnaire.objective];
  const row = await prisma.optionsApplication.create({ data: { clientId: id, status: "PENDING", questionnaire: input.questionnaire as Prisma.InputJsonObject, score: suitabilityScore, disclosureAcceptedAt: new Date() } });
  return ok(res, row, 201);
}));

v1ClientRouter.get("/distributions", asyncHandler(async (req, res) => {
  const rows = await prisma.distributionItem.findMany({ where: { clientId: clientId(req) }, include: { batch: true, investment: { include: { product: true } } }, orderBy: { createdAt: "desc" } });
  return ok(res, rows);
}));

v1ClientRouter.put("/investments/:id/distribution-preference", requireCsrf, asyncHandler(async (req, res) => {
  const id = clientId(req);
  const input = z.object({ mode: z.enum(["WALLET", "REINVEST"]) }).parse(req.body);
  const row = await prisma.clientInvestment.findFirst({ where: { id: String(req.params.id), clientId: id } });
  if (!row) throw new ApiError(404, "Investment was not found", "INVESTMENT_NOT_FOUND");
  return ok(res, await prisma.clientInvestment.update({ where: { id: row.id }, data: { reinvestPreference: input.mode } }));
}));

v1ClientRouter.get("/risk", asyncHandler(async (req, res) => {
  const id = clientId(req);
  const [client, alerts] = await Promise.all([
    prisma.client.findUnique({ where: { id }, select: { riskLevel: true, suitabilityScore: true, riskQuestionnaire: true } }),
    prisma.riskAlert.findMany({ where: { clientId: id }, orderBy: [{ status: "asc" }, { severity: "desc" }, { createdAt: "desc" }] })
  ]);
  return ok(res, { profile: client, alerts });
}));

v1ClientRouter.get("/notifications", asyncHandler(async (req, res) => {
  const id = clientId(req);
  const rows = await prisma.notification.findMany({ where: { recipientType: "CLIENT", recipientId: id, clientId: id }, orderBy: { createdAt: "desc" }, take: 100 });
  return ok(res, rows);
}));

v1ClientRouter.get("/notifications/inbox", asyncHandler(async (req, res) => {
  return ok(res, await notificationInbox({ recipientType: "CLIENT", recipientId: clientId(req), limit: Number(req.query.limit) || 20 }));
}));

v1ClientRouter.post("/notifications/read-all", requireCsrf, asyncHandler(async (req, res) => {
  return ok(res, await markAllNotificationsRead({ recipientType: "CLIENT", recipientId: clientId(req) }));
}));

v1ClientRouter.post("/notifications/:id/read", requireCsrf, asyncHandler(async (req, res) => {
  const row = await markNotificationRead({ recipientType: "CLIENT", recipientId: clientId(req), id: String(req.params.id) });
  if (!row) throw new ApiError(404, "Notification was not found", "NOTIFICATION_NOT_FOUND");
  return ok(res, row);
}));

v1ClientRouter.get("/reports", asyncHandler(async (req, res) => {
  const rows = await prisma.reportExport.findMany({ where: { OR: [{ clientId: clientId(req) }, { clientId: null }] }, orderBy: { createdAt: "desc" } });
  return ok(res, rows);
}));

v1ClientRouter.post("/reports", requireCsrf, asyncHandler(async (req, res) => {
  const id = clientId(req);
  const input = z.object({ type: z.enum(["ACCOUNT_STATEMENT", "WALLET_ACTIVITY", "INVESTMENT_PERFORMANCE", "DISTRIBUTIONS", "TRADES"]), format: z.enum(["CSV", "PDF"]).default("CSV"), period: z.string().min(3).max(80) }).parse(req.body);
  const report = await prisma.reportExport.create({ data: { clientId: id, name: input.type.toLowerCase().split("_").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" "), type: input.type, format: input.format, period: input.period, status: input.format === "CSV" ? "READY" : "PENDING", requestedBy: id, completedAt: input.format === "CSV" ? new Date() : null } });
  if (input.format === "PDF") await prisma.outboxEvent.create({ data: { type: "GENERATE_REPORT", payload: { reportId: report.id } } });
  return ok(res, report, 201);
}));

v1ClientRouter.get("/reports/:id/download", asyncHandler(async (req, res) => {
  const id = clientId(req);
  const report = await prisma.reportExport.findFirst({ where: { id: String(req.params.id), OR: [{ clientId: id }, { clientId: null }] } });
  if (!report) throw new ApiError(404, "Report was not found", "REPORT_NOT_FOUND");
  if (report.status !== "READY") throw new ApiError(409, "Report is not ready for download", "REPORT_NOT_READY");
  const transactions = await prisma.ledgerTransaction.findMany({ where: { clientId: id }, orderBy: { createdAt: "desc" } });
  const csv = ["Date,Reference,Type,Status,Currency,Description", ...transactions.map((row) => [row.createdAt.toISOString(), row.reference, row.type, row.status, row.currency, `"${row.description.replace(/"/g, '""')}"`].join(","))].join("\n");
  res.setHeader("content-type", "text/csv; charset=utf-8");
  res.setHeader("content-disposition", `attachment; filename="bullport-${report.type.toLowerCase()}-${report.id}.csv"`);
  return res.status(200).send(csv);
}));

v1ClientRouter.get("/support/tickets", asyncHandler(async (req, res) => {
  const rows = await prisma.supportTicket.findMany({ where: { clientId: clientId(req) }, include: { messages: { orderBy: { createdAt: "asc" } } }, orderBy: { updatedAt: "desc" } });
  return ok(res, rows);
}));

v1ClientRouter.post("/support/tickets", requireCsrf, asyncHandler(async (req, res) => {
  const id = clientId(req);
  const input = z.object({ subject: z.string().trim().min(3).max(160), category: z.string().trim().min(2).max(60).default("General"), description: z.string().trim().min(5).max(5000), priority: z.enum(["Low", "Normal", "High"]).default("Normal") }).parse(req.body);
  const ticket = await prisma.supportTicket.create({ data: { ticketNo: reference("BP"), clientId: id, subject: input.subject, category: input.category, description: input.description, priority: input.priority, messages: { create: { authorType: "CLIENT", authorId: id, body: input.description } } }, include: { messages: true } });
  return ok(res, ticket, 201);
}));

v1ClientRouter.post("/support/tickets/:id/messages", requireCsrf, asyncHandler(async (req, res) => {
  const id = clientId(req);
  const input = z.object({ body: z.string().trim().min(1).max(5000) }).parse(req.body);
  const ticket = await prisma.supportTicket.findFirst({ where: { id: String(req.params.id), clientId: id } });
  if (!ticket) throw new ApiError(404, "Support ticket was not found", "TICKET_NOT_FOUND");
  if (["RESOLVED", "CLOSED"].includes(ticket.status)) throw new ApiError(409, "This ticket is closed", "TICKET_CLOSED");
  const message = await prisma.$transaction(async (tx) => {
    await tx.supportTicket.update({ where: { id: ticket.id }, data: { status: "AWAITING_BROKER" } });
    return tx.supportMessage.create({ data: { ticketId: ticket.id, authorType: "CLIENT", authorId: id, body: input.body } });
  });
  return ok(res, message, 201);
}));
