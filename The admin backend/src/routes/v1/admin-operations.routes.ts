import bcrypt from "bcryptjs";
import { Router } from "express";
import { z } from "zod";
import { randomCode } from "../../lib/crypto";
import { ApiError, asyncHandler, ok, pageInput, pageMeta, reference } from "../../lib/http";
import { prisma } from "../../lib/prisma";
import { requireAdmin, requireAdminRoles, requireCsrf } from "../../middleware/auth";
import { writeAudit } from "../../services/audit.service";
import { DEPOSIT_METHODS_SETTING_KEY, getDepositMethodsSetting, upsertDepositMethodsSetting } from "../../services/deposit-method.service";
import { WITHDRAWAL_METHODS_SETTING_KEY, getWithdrawalMethodsSetting, upsertWithdrawalMethodsSetting } from "../../services/withdrawal-method.service";
import { ADMIN_NOTIFICATION_RECIPIENT_ID, markAllNotificationsRead, markNotificationRead, notificationInbox, notifyClient } from "../../services/notification.service";

export const v1AdminOperationsRouter = Router();
v1AdminOperationsRouter.use(requireAdmin);
v1AdminOperationsRouter.use(requireCsrf);

const supportRoles = requireAdminRoles("SUPER_ADMIN", "SUPPORT", "COMPLIANCE", "FINANCE");
const reportRoles = requireAdminRoles("SUPER_ADMIN", "AUDITOR", "FINANCE", "COMPLIANCE", "PORTFOLIO_MANAGER");
const superAdmin = requireAdminRoles("SUPER_ADMIN");
const readRoles = requireAdminRoles("SUPER_ADMIN", "COMPLIANCE", "FINANCE", "PORTFOLIO_MANAGER", "SUPPORT", "AUDITOR");
const APPROVAL_SETTINGS_KEY = "operations.approvals";
const DEFAULT_APPROVAL_POLICY = {
  makerChecker: true,
  withdrawals: true,
  depositCredits: true,
  autoApproveDeposits: false,
  distributions: true,
  productPublishing: true,
  ledgerAdjustments: true
};

async function ensureApprovalPolicySetting(adminId?: string) {
  const setting = await prisma.systemSetting.findUnique({ where: { key: APPROVAL_SETTINGS_KEY } });
  const current = setting?.value && typeof setting.value === "object" && !Array.isArray(setting.value)
    ? setting.value as Record<string, unknown>
    : {};
  const value = { ...DEFAULT_APPROVAL_POLICY, ...current };
  if (setting && Object.keys(DEFAULT_APPROVAL_POLICY).every((key) => key in current)) return setting;
  return prisma.systemSetting.upsert({
    where: { key: APPROVAL_SETTINGS_KEY },
    update: { value: value as never, updatedBy: adminId },
    create: {
      key: APPROVAL_SETTINGS_KEY,
      value: value as never,
      description: "Sensitive operation approval policy, including deposit auto-approval.",
      updatedBy: adminId
    }
  });
}

v1AdminOperationsRouter.get("/support/tickets", supportRoles, asyncHandler(async (req, res) => {
  const { page, limit, skip } = pageInput(req.query);
  const status = typeof req.query.status === "string" ? req.query.status : undefined;
  const where = status ? { status: status as never } : {};
  const [rows, total] = await Promise.all([
    prisma.supportTicket.findMany({ where, include: { client: true, messages: { orderBy: { createdAt: "asc" } } }, orderBy: { updatedAt: "desc" }, skip, take: limit }),
    prisma.supportTicket.count({ where })
  ]);
  return ok(res, rows, 200, pageMeta(page, limit, total));
}));

v1AdminOperationsRouter.get("/support/tickets/:id", supportRoles, asyncHandler(async (req, res) => {
  const row = await prisma.supportTicket.findUnique({ where: { id: String(req.params.id) }, include: { client: true, messages: { orderBy: { createdAt: "asc" } } } });
  if (!row) throw new ApiError(404, "Support ticket was not found", "TICKET_NOT_FOUND");
  return ok(res, row);
}));

v1AdminOperationsRouter.post("/support/tickets/:id/assign", supportRoles, asyncHandler(async (req, res) => {
  const input = z.object({ owner: z.string().trim().min(2).max(100), priority: z.enum(["Low", "Normal", "High", "Urgent"]).default("Normal") }).parse(req.body);
  const row = await prisma.supportTicket.update({ where: { id: String(req.params.id) }, data: { owner: input.owner, priority: input.priority, status: "AWAITING_BROKER" } });
  await writeAudit("assignSupportTicket", "SupportTicket", row.id, { owner: input.owner, priority: input.priority }, { req });
  return ok(res, row);
}));

v1AdminOperationsRouter.post("/support/tickets/:id/messages", supportRoles, asyncHandler(async (req, res) => {
  const input = z.object({ body: z.string().trim().min(1).max(5000) }).parse(req.body);
  const ticket = await prisma.supportTicket.findUnique({ where: { id: String(req.params.id) }, include: { client: true } });
  if (!ticket) throw new ApiError(404, "Support ticket was not found", "TICKET_NOT_FOUND");
  const message = await prisma.$transaction(async (tx) => {
    await tx.supportTicket.update({ where: { id: ticket.id }, data: { status: "AWAITING_CLIENT", owner: req.user!.name } });
    return tx.supportMessage.create({ data: { ticketId: ticket.id, authorType: "ADMIN", authorId: req.user!.id, body: input.body } });
  });
  await notifyClient({ clientId: ticket.clientId, email: ticket.client.email, category: "Support", title: `Update on ${ticket.ticketNo}`, body: input.body, actionUrl: "support.html" });
  return ok(res, message, 201);
}));

v1AdminOperationsRouter.post("/support/tickets/:id/resolve", supportRoles, asyncHandler(async (req, res) => {
  const input = z.object({ resolution: z.string().trim().min(5).max(2000) }).parse(req.body);
  const ticket = await prisma.supportTicket.findUnique({ where: { id: String(req.params.id) }, include: { client: true } });
  if (!ticket) throw new ApiError(404, "Support ticket was not found", "TICKET_NOT_FOUND");
  const row = await prisma.$transaction(async (tx) => {
    await tx.supportMessage.create({ data: { ticketId: ticket.id, authorType: "ADMIN", authorId: req.user!.id, body: input.resolution } });
    return tx.supportTicket.update({ where: { id: ticket.id }, data: { status: "RESOLVED", closedAt: new Date(), owner: req.user!.name } });
  });
  await notifyClient({ clientId: ticket.clientId, email: ticket.client.email, category: "Support", title: `${ticket.ticketNo} resolved`, body: input.resolution, actionUrl: "support.html" });
  return ok(res, row);
}));

v1AdminOperationsRouter.get("/reports", reportRoles, asyncHandler(async (_req, res) => {
  return ok(res, await prisma.reportExport.findMany({ include: { client: { select: { accountNumber: true, name: true } } }, orderBy: { createdAt: "desc" } }));
}));

v1AdminOperationsRouter.post("/reports", reportRoles, asyncHandler(async (req, res) => {
  const input = z.object({ name: z.string().trim().min(3).max(160), type: z.enum(["CLIENTS", "KYC", "WALLET", "DEPOSITS", "WITHDRAWALS", "INVESTMENTS", "TRADES", "DISTRIBUTIONS", "RISK", "AUDIT"]), format: z.enum(["CSV", "PDF"]).default("CSV"), period: z.string().trim().min(3).max(80), filters: z.record(z.string(), z.unknown()).optional() }).parse(req.body);
  const row = await prisma.reportExport.create({ data: { name: input.name, type: input.type, format: input.format, period: input.period, filters: input.filters as never, status: input.format === "CSV" ? "READY" : "PENDING", requestedBy: req.user!.id, completedAt: input.format === "CSV" ? new Date() : null } });
  if (input.format === "PDF") await prisma.outboxEvent.create({ data: { type: "GENERATE_REPORT", payload: { reportId: row.id } } });
  return ok(res, row, 201);
}));

v1AdminOperationsRouter.get("/reports/:id/download", reportRoles, asyncHandler(async (req, res) => {
  const report = await prisma.reportExport.findUnique({ where: { id: String(req.params.id) } });
  if (!report) throw new ApiError(404, "Report was not found", "REPORT_NOT_FOUND");
  if (report.status !== "READY") throw new ApiError(409, "Report is not ready", "REPORT_NOT_READY");
  let header: string[] = [];
  let data: unknown[][] = [];
  if (report.type === "CLIENTS") {
    const rows = await prisma.client.findMany({ orderBy: { createdAt: "desc" } });
    header = ["Account", "Name", "Email", "Status", "Risk", "Tier", "Created"];
    data = rows.map((row) => [row.accountNumber, row.name, row.email, row.status, row.riskLevel, row.tier, row.createdAt.toISOString()]);
  } else if (report.type === "AUDIT") {
    const rows = await prisma.auditLog.findMany({ orderBy: { createdAt: "desc" }, take: 10_000 });
    header = ["Date", "Actor", "Action", "Entity", "Entity ID", "Request ID", "Reason"];
    data = rows.map((row) => [row.createdAt.toISOString(), row.actorName, row.action, row.entityType, row.entityId || "", row.requestId || "", row.reason || ""]);
  } else {
    const rows = await prisma.ledgerTransaction.findMany({ orderBy: { createdAt: "desc" }, take: 10_000 });
    header = ["Date", "Reference", "Client ID", "Type", "Status", "Currency", "Description"];
    data = rows.map((row) => [row.createdAt.toISOString(), row.reference, row.clientId || "", row.type, row.status, row.currency, row.description]);
  }
  const escape = (value: unknown) => `"${String(value ?? "").replace(/"/g, '""')}"`;
  const csv = [header.map(escape).join(","), ...data.map((row) => row.map(escape).join(","))].join("\n");
  res.setHeader("content-type", "text/csv; charset=utf-8");
  res.setHeader("content-disposition", `attachment; filename="bullport-${report.type.toLowerCase()}-${report.id}.csv"`);
  return res.status(200).send(csv);
}));

v1AdminOperationsRouter.get("/notifications", readRoles, asyncHandler(async (_req, res) => {
  return ok(res, await prisma.notification.findMany({ include: { client: { select: { accountNumber: true, name: true, email: true } }, deliveries: true }, orderBy: { createdAt: "desc" }, take: 500 }));
}));

v1AdminOperationsRouter.get("/notifications/inbox", readRoles, asyncHandler(async (req, res) => {
  return ok(res, await notificationInbox({ recipientType: "ADMIN", recipientId: ADMIN_NOTIFICATION_RECIPIENT_ID, limit: Number(req.query.limit) || 20 }));
}));

v1AdminOperationsRouter.post("/notifications/read-all", readRoles, asyncHandler(async (_req, res) => {
  return ok(res, await markAllNotificationsRead({ recipientType: "ADMIN", recipientId: ADMIN_NOTIFICATION_RECIPIENT_ID }));
}));

v1AdminOperationsRouter.post("/notifications/:id/read", readRoles, asyncHandler(async (req, res) => {
  const row = await markNotificationRead({ recipientType: "ADMIN", recipientId: ADMIN_NOTIFICATION_RECIPIENT_ID, id: String(req.params.id) });
  if (!row) throw new ApiError(404, "Notification was not found", "NOTIFICATION_NOT_FOUND");
  return ok(res, row);
}));

v1AdminOperationsRouter.post("/notifications", requireAdminRoles("SUPER_ADMIN", "SUPPORT", "COMPLIANCE", "FINANCE"), asyncHandler(async (req, res) => {
  const input = z.object({ clientId: z.string().optional(), audience: z.enum(["ONE", "ALL", "PENDING_KYC", "ACTIVE_INVESTORS"]).default("ONE"), title: z.string().trim().min(3).max(160), body: z.string().trim().min(5).max(4000), category: z.string().trim().min(2).max(80), actionUrl: z.string().max(240).optional(), email: z.boolean().default(true) }).parse(req.body);
  let clients;
  if (input.audience === "ONE") {
    if (!input.clientId) throw new ApiError(422, "Client is required for a single-recipient notification", "CLIENT_REQUIRED");
    clients = await prisma.client.findMany({ where: { id: input.clientId } });
  } else if (input.audience === "PENDING_KYC") {
    clients = await prisma.client.findMany({ where: { kycCases: { some: { status: { in: ["SUBMITTED", "IN_REVIEW", "RESUBMISSION_REQUIRED"] } } } } });
  } else if (input.audience === "ACTIVE_INVESTORS") {
    clients = await prisma.client.findMany({ where: { investments: { some: { status: "ACTIVE" } } } });
  } else {
    clients = await prisma.client.findMany({ where: { status: { not: "SUSPENDED" } } });
  }
  for (const client of clients) {
    await notifyClient({ clientId: client.id, email: input.email ? client.email : undefined, title: input.title, body: input.body, category: input.category, actionUrl: input.actionUrl });
  }
  await writeAudit("sendNotification", "Notification", undefined, { audience: input.audience, recipients: clients.length }, { req });
  return ok(res, { recipients: clients.length }, 201);
}));

v1AdminOperationsRouter.get("/admin-users", superAdmin, asyncHandler(async (_req, res) => {
  return ok(res, await prisma.adminUser.findMany({ select: { id: true, name: true, email: true, role: true, isActive: true, lastLoginAt: true, createdAt: true, mfa: { select: { enabledAt: true } } }, orderBy: { createdAt: "asc" } }));
}));

v1AdminOperationsRouter.post("/admin-users", superAdmin, asyncHandler(async (req, res) => {
  const input = z.object({ name: z.string().trim().min(2).max(120), email: z.string().email().transform((value) => value.toLowerCase()), role: z.enum(["SUPER_ADMIN", "COMPLIANCE", "FINANCE", "PORTFOLIO_MANAGER", "SUPPORT", "AUDITOR"]) }).parse(req.body);
  const temporaryPassword = `${randomCode(10)}!aA1`;
  const row = await prisma.adminUser.create({ data: { ...input, passwordHash: await bcrypt.hash(temporaryPassword, 12) } });
  await writeAudit("createAdminUser", "AdminUser", row.id, { role: row.role }, { req });
  return ok(res, { id: row.id, name: row.name, email: row.email, role: row.role, temporaryPassword }, 201);
}));

v1AdminOperationsRouter.patch("/admin-users/:id", superAdmin, asyncHandler(async (req, res) => {
  const input = z.object({ role: z.enum(["SUPER_ADMIN", "COMPLIANCE", "FINANCE", "PORTFOLIO_MANAGER", "SUPPORT", "AUDITOR"]).optional(), isActive: z.boolean().optional() }).parse(req.body);
  if (String(req.params.id) === req.user!.id && input.isActive === false) throw new ApiError(409, "You cannot deactivate your current admin account", "SELF_DEACTIVATION");
  const row = await prisma.adminUser.update({ where: { id: String(req.params.id) }, data: input });
  if (input.isActive === false) await prisma.authSession.updateMany({ where: { adminId: row.id }, data: { revokedAt: new Date() } });
  await writeAudit("updateAdminUser", "AdminUser", row.id, input, { req });
  return ok(res, { id: row.id, name: row.name, email: row.email, role: row.role, isActive: row.isActive });
}));

v1AdminOperationsRouter.get("/settings", superAdmin, asyncHandler(async (_req, res) => {
  await getDepositMethodsSetting();
  await getWithdrawalMethodsSetting();
  await ensureApprovalPolicySetting(_req.user!.id);
  const rows = await prisma.systemSetting.findMany({ where: { isSecret: false }, orderBy: { key: "asc" } });
  return ok(res, rows);
}));

v1AdminOperationsRouter.put("/settings/:key", superAdmin, asyncHandler(async (req, res) => {
  const input = z.object({ value: z.unknown(), description: z.string().max(500).optional() }).parse(req.body);
  const key = String(req.params.key);
  const row = key === DEPOSIT_METHODS_SETTING_KEY
    ? await upsertDepositMethodsSetting(input.value, req.user!.id, input.description || "Accepted client wallet funding routes including bank, crypto and card availability.")
    : key === WITHDRAWAL_METHODS_SETTING_KEY
      ? await upsertWithdrawalMethodsSetting(input.value, req.user!.id, input.description || "Accepted client withdrawal routes and beneficiary verification field requirements.")
    : key === APPROVAL_SETTINGS_KEY
      ? await prisma.systemSetting.upsert({ where: { key }, update: { value: { ...DEFAULT_APPROVAL_POLICY, ...(typeof input.value === "object" && input.value !== null && !Array.isArray(input.value) ? input.value : {}) } as never, description: input.description, updatedBy: req.user!.id }, create: { key, value: { ...DEFAULT_APPROVAL_POLICY, ...(typeof input.value === "object" && input.value !== null && !Array.isArray(input.value) ? input.value : {}) } as never, description: input.description || "Sensitive operation approval policy, including deposit auto-approval.", updatedBy: req.user!.id } })
    : await prisma.systemSetting.upsert({ where: { key }, update: { value: input.value as never, description: input.description, updatedBy: req.user!.id }, create: { key, value: input.value as never, description: input.description, updatedBy: req.user!.id } });
  await writeAudit("updateSystemSetting", "SystemSetting", row.id, { key: row.key }, { req });
  return ok(res, row);
}));

v1AdminOperationsRouter.get("/audit-logs", readRoles, asyncHandler(async (req, res) => {
  const { page, limit, skip } = pageInput(req.query);
  const entityType = typeof req.query.entityType === "string" ? req.query.entityType : undefined;
  const actorId = typeof req.query.actorId === "string" ? req.query.actorId : undefined;
  const where = { ...(entityType ? { entityType } : {}), ...(actorId ? { actorId } : {}) };
  const [rows, total] = await Promise.all([prisma.auditLog.findMany({ where, orderBy: { createdAt: "desc" }, skip, take: limit }), prisma.auditLog.count({ where })]);
  return ok(res, rows, 200, pageMeta(page, limit, total));
}));

v1AdminOperationsRouter.get("/tasks", readRoles, asyncHandler(async (req, res) => {
  const rows = await prisma.adminTask.findMany({ where: req.user!.role === "SUPER_ADMIN" ? {} : { OR: [{ assignedToId: req.user!.id }, { assignedToId: null }] }, include: { assignedTo: { select: { id: true, name: true, role: true } } }, orderBy: [{ status: "asc" }, { dueAt: "asc" }] });
  return ok(res, rows);
}));

v1AdminOperationsRouter.post("/tasks", readRoles, asyncHandler(async (req, res) => {
  const input = z.object({ title: z.string().trim().min(3).max(160), description: z.string().max(2000).optional(), category: z.string().min(2).max(80), priority: z.enum(["Low", "Normal", "High", "Urgent"]).default("Normal"), assignedToId: z.string().optional(), entityType: z.string().max(80).optional(), entityId: z.string().max(120).optional(), dueAt: z.coerce.date().optional() }).parse(req.body);
  const row = await prisma.adminTask.create({ data: input });
  return ok(res, row, 201);
}));

v1AdminOperationsRouter.patch("/tasks/:id", readRoles, asyncHandler(async (req, res) => {
  const input = z.object({ status: z.enum(["OPEN", "IN_PROGRESS", "COMPLETED"]), note: z.string().max(500).optional() }).parse(req.body);
  const row = await prisma.adminTask.update({ where: { id: String(req.params.id) }, data: { status: input.status, completedAt: input.status === "COMPLETED" ? new Date() : null } });
  await writeAudit("updateAdminTask", "AdminTask", row.id, { status: input.status }, { req, reason: input.note });
  return ok(res, row);
}));
