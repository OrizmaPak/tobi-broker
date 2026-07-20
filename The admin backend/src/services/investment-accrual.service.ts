import { Prisma } from "@prisma/client";
import { ApiError, reference } from "../lib/http";
import { prisma } from "../lib/prisma";
import { creditClientCashTx } from "./ledger.service";
import { notifyClientTx } from "./notification.service";

type Db = Prisma.TransactionClient;
type InvestmentWithProduct = Prisma.ClientInvestmentGetPayload<{ include: { product: true } }>;

function addHours(date: Date, hours: number) {
  const next = new Date(date);
  next.setHours(next.getHours() + hours);
  return next;
}

function projectedReturnPercent(product: InvestmentWithProduct["product"]) {
  const min = product.projectedReturnMin == null ? null : new Prisma.Decimal(product.projectedReturnMin);
  const max = product.projectedReturnMax == null ? null : new Prisma.Decimal(product.projectedReturnMax);
  if (product.projectedReturnMode === "FIXED" || product.projectedReturnType === "FIXED") return min || max || new Prisma.Decimal(0);
  if (min && max) return min.plus(max).div(2);
  return min || max || new Prisma.Decimal(0);
}

function accrualBaseDate(investment: InvestmentWithProduct) {
  return investment.profitAccruedAt || investment.startDate || investment.createdAt;
}

export function investmentProjectionSnapshot(investment: InvestmentWithProduct, now = new Date()) {
  const returnPercent = projectedReturnPercent(investment.product);
  const durationDays = Number(investment.product.durationDays || 0);
  const projectedProfit = durationDays > 0
    ? new Prisma.Decimal(investment.investedAmount).mul(returnPercent).div(100).toDecimalPlaces(2)
    : new Prisma.Decimal(0);
  const accrued = new Prisma.Decimal(investment.profitAccrued || 0);
  const actualizedPercent = projectedProfit.isPositive() ? accrued.div(projectedProfit).mul(100).toDecimalPlaces(2) : new Prisma.Decimal(0);
  return {
    projectedProfit,
    profitAccrued: accrued,
    actualizedPercent,
    lastAccruedAt: accrualBaseDate(investment),
    paused: investment.status !== "ACTIVE",
    asOf: now
  };
}

export async function accrueInvestmentProfitTx(tx: Db, investment: InvestmentWithProduct, now = new Date()) {
  if (investment.status !== "ACTIVE") return investment;
  const durationDays = Number(investment.product.durationDays || 0);
  if (!Number.isFinite(durationDays) || durationDays <= 0) return investment;
  const returnPercent = projectedReturnPercent(investment.product);
  if (!returnPercent.isPositive()) return investment;

  const lastAccruedAt = accrualBaseDate(investment);
  const elapsedHours = Math.floor((now.getTime() - lastAccruedAt.getTime()) / 3_600_000);
  if (elapsedHours < 1) return investment;

  const accruedAt = addHours(lastAccruedAt, elapsedHours);
  const hourlyRate = returnPercent.div(100).div(durationDays * 24);
  const increment = new Prisma.Decimal(investment.investedAmount).mul(hourlyRate).mul(elapsedHours).toDecimalPlaces(2);
  if (!increment.isPositive()) {
    return tx.clientInvestment.update({
      where: { id: investment.id },
      data: { profitAccruedAt: accruedAt },
      include: { product: true }
    });
  }

  const profitAccrued = new Prisma.Decimal(investment.profitAccrued || 0).plus(increment).toDecimalPlaces(2);
  const currentValue = new Prisma.Decimal(investment.investedAmount).plus(profitAccrued).toDecimalPlaces(2);
  const unitPrice = investment.units.isPositive() ? currentValue.div(investment.units) : new Prisma.Decimal(1);
  const updated = await tx.clientInvestment.update({
    where: { id: investment.id },
    data: {
      currentValue,
      profitAccrued,
      profitAccruedAt: accruedAt,
      nextAction: `Running profit accrued through ${accruedAt.toISOString().slice(0, 13)}:00 UTC`
    },
    include: { product: true }
  });
  await tx.investmentValuation.upsert({
    where: { investmentId_asOf: { investmentId: investment.id, asOf: accruedAt } },
    update: { value: currentValue, unitPrice, source: "Hourly projected return accrual" },
    create: { investmentId: investment.id, value: currentValue, unitPrice, source: "Hourly projected return accrual", asOf: accruedAt }
  });
  return updated;
}

export async function accrueClientInvestmentProfits(clientId: string) {
  const rows = await prisma.clientInvestment.findMany({ where: { clientId, status: "ACTIVE" }, include: { product: true } });
  let updated = 0;
  for (const row of rows) {
    const before = String(row.profitAccrued || "0");
    const after = await prisma.$transaction((tx) => accrueInvestmentProfitTx(tx, row));
    if (String(after.profitAccrued || "0") !== before) updated += 1;
  }
  return { scanned: rows.length, updated };
}

export async function accrueAllInvestmentProfits() {
  const rows = await prisma.clientInvestment.findMany({ where: { status: "ACTIVE" }, include: { product: true } });
  let updated = 0;
  for (const row of rows) {
    const before = String(row.profitAccrued || "0");
    const after = await prisma.$transaction((tx) => accrueInvestmentProfitTx(tx, row));
    if (String(after.profitAccrued || "0") !== before) updated += 1;
  }
  return { scanned: rows.length, updated };
}

export async function cancelInvestmentTx(tx: Db, input: { investmentId: string; actorId: string; actorLabel: string; note: string }) {
  const investment = await tx.clientInvestment.findUnique({ where: { id: input.investmentId }, include: { product: true, client: true } });
  if (!investment) throw new ApiError(404, "Investment was not found", "INVESTMENT_NOT_FOUND");
  if (["CANCELLED", "CLOSED"].includes(investment.status)) throw new ApiError(409, "Investment is already closed", "INVESTMENT_ALREADY_CLOSED");
  const accrued = await accrueInvestmentProfitTx(tx, investment);
  const refund = new Prisma.Decimal(accrued.currentValue).isPositive() ? new Prisma.Decimal(accrued.currentValue) : new Prisma.Decimal(accrued.investedAmount);
  const ledger = await creditClientCashTx(tx, {
    clientId: accrued.clientId,
    amount: refund,
    type: "ADJUSTMENT",
    description: `Investment cancellation refund for ${accrued.product.name}`,
    currency: accrued.currency,
    idempotencyKey: `investment-cancel:${accrued.id}`,
    initiatedBy: input.actorId,
    metadata: { investmentId: accrued.id, productId: accrued.productId, note: input.note }
  });
  const cancelled = await tx.clientInvestment.update({
    where: { id: accrued.id },
    data: {
      status: "CANCELLED",
      currentValue: 0,
      closedAt: new Date(),
      nextAction: `Cancelled and refunded ${accrued.currency} ${refund.toFixed(2)}`
    },
    include: { product: true, client: true }
  });
  await tx.investmentTransaction.create({
    data: {
      investmentId: accrued.id,
      reference: reference("INVREF"),
      type: "CANCELLATION_REFUND",
      amount: refund,
      units: 0,
      unitPrice: 1,
      ledgerTransactionId: ledger.id
    }
  });
  await notifyClientTx(tx, {
    clientId: accrued.clientId,
    category: "Investment",
    title: "Investment cancelled and refunded",
    body: `${accrued.product.name} was cancelled. ${accrued.currency} ${refund.toFixed(2)} has been returned to your wallet.`,
    actionUrl: "active-investments.html",
    entity: { type: "ClientInvestment", id: accrued.id },
    metadata: { investmentId: accrued.id, refund: refund.toFixed(2), actor: input.actorLabel }
  });
  return cancelled;
}
