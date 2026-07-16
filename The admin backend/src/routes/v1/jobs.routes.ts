import { Prisma } from "@prisma/client";
import { Router } from "express";
import { env } from "../../config/env";
import { ApiError, asyncHandler, ok } from "../../lib/http";
import { prisma } from "../../lib/prisma";
import { reconcileLedger } from "../../services/ledger.service";
import { processNotificationOutbox } from "../../services/notification.service";

export const v1JobsRouter = Router();

v1JobsRouter.use((req, _res, next) => {
  const secret = req.get("x-job-secret") || req.headers.authorization?.replace(/^Bearer\s+/i, "");
  if (!secret || secret !== (env.JOB_SECRET || env.JWT_SECRET)) return next(new ApiError(401, "Job authorization failed", "JOB_UNAUTHORIZED"));
  next();
});

v1JobsRouter.post("/notifications", asyncHandler(async (_req, res) => ok(res, await processNotificationOutbox())));

v1JobsRouter.post("/valuation", asyncHandler(async (_req, res) => {
  const positions = await prisma.position.findMany({ include: { instrument: true } });
  let positionsUpdated = 0;
  for (const position of positions) {
    if (!position.instrument.currentPrice) continue;
    const marketValue = new Prisma.Decimal(position.quantity).mul(position.instrument.currentPrice);
    const unrealizedPnl = marketValue.minus(new Prisma.Decimal(position.quantity).mul(position.averageCost));
    await prisma.position.update({ where: { id: position.id }, data: { marketValue, unrealizedPnl } });
    positionsUpdated += 1;
  }
  const investments = await prisma.clientInvestment.findMany({ where: { status: "ACTIVE" }, include: { holdings: true } });
  let investmentsUpdated = 0;
  for (const investment of investments) {
    if (!investment.holdings.length) continue;
    const value = investment.holdings.reduce((sum, holding) => sum.plus(holding.marketValue), new Prisma.Decimal(0));
    const unitPrice = investment.units.isPositive() ? value.div(investment.units) : new Prisma.Decimal(1);
    await prisma.$transaction([
      prisma.clientInvestment.update({ where: { id: investment.id }, data: { currentValue: value } }),
      prisma.investmentValuation.create({ data: { investmentId: investment.id, value, unitPrice, source: "Scheduled admin-managed valuation", asOf: new Date() } })
    ]);
    investmentsUpdated += 1;
  }
  return ok(res, { positionsUpdated, investmentsUpdated });
}));

v1JobsRouter.post("/risk-scan", asyncHandler(async (_req, res) => {
  const largeWithdrawals = await prisma.withdrawal.findMany({ where: { amount: { gte: 10_000 }, status: { in: ["IN_REVIEW", "UNDER_REVIEW", "AWAITING_APPROVAL", "APPROVED"] } } });
  let created = 0;
  for (const withdrawal of largeWithdrawals) {
    const existing = await prisma.riskAlert.findFirst({ where: { clientId: withdrawal.clientId, category: "Large withdrawal", details: { path: ["withdrawalId"], equals: withdrawal.id }, status: { in: ["OPEN", "IN_REVIEW"] } } });
    if (!existing) {
      await prisma.riskAlert.create({ data: { clientId: withdrawal.clientId, category: "Large withdrawal", severity: "HIGH", title: `Enhanced review for ${withdrawal.reference}`, details: { withdrawalId: withdrawal.id, amount: Number(withdrawal.amount), currency: withdrawal.currency } } });
      created += 1;
    }
  }
  const expiringOptions = await prisma.optionContract.findMany({ where: { status: "ACTIVE", expiry: { gte: new Date(), lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) } } });
  return ok(res, { alertsCreated: created, largeWithdrawals: largeWithdrawals.length, optionsExpiringWithinSevenDays: expiringOptions.length });
}));

v1JobsRouter.get("/reconcile", asyncHandler(async (_req, res) => {
  const rows = await reconcileLedger();
  return ok(res, { balanced: rows.every((row) => row.balanced), mismatches: rows.filter((row) => !row.balanced), accounts: rows.length });
}));
