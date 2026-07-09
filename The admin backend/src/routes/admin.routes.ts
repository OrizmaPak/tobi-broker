import { Router } from "express";
import { asyncHandler, ok } from "../lib/http";
import { prisma } from "../lib/prisma";

export const adminRouter = Router();

adminRouter.get("/overview", asyncHandler(async (_req, res) => {
  const [
    pendingKyc,
    depositsToReview,
    withdrawalsToReview,
    openTickets,
    recentAudit
  ] = await Promise.all([
    prisma.kycReview.count({ where: { status: { in: ["PENDING", "IN_REVIEW", "RESUBMISSION_REQUIRED"] } } }),
    prisma.deposit.count({ where: { status: { in: ["PENDING", "IN_REVIEW", "FLAGGED"] } } }),
    prisma.withdrawal.count({ where: { status: { in: ["PENDING", "IN_REVIEW", "HELD", "BLOCKED"] } } }),
    prisma.supportTicket.count({ where: { status: { in: ["OPEN", "AWAITING_BROKER", "ESCALATED"] } } }),
    prisma.auditLog.findMany({ orderBy: { createdAt: "desc" }, take: 8 })
  ]);

  return ok(res, {
    metrics: { pendingKyc, depositsToReview, withdrawalsToReview, openTickets },
    recentAudit
  });
}));
