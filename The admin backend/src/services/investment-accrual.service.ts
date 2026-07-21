import { Prisma } from "@prisma/client";
import { ApiError, reference } from "../lib/http";
import { prisma } from "../lib/prisma";
import { creditClientCashTx } from "./ledger.service";
import { notifyClientTx } from "./notification.service";

type Db = Prisma.TransactionClient;
type InvestmentWithProduct = Prisma.ClientInvestmentGetPayload<{ include: { product: true } }>;
type InvestmentForProfit = Prisma.ClientInvestmentGetPayload<{
  include: { product: { include: { allocations: { include: { instrument: true } } } } }
}>;
type ProfitScheduleWithInstrument = Prisma.InvestmentProfitScheduleGetPayload<{ include: { instrument: true } }>;

const HOUR_MS = 3_600_000;
const MAX_SCHEDULE_HOURS = 8_760;
const DUE_POST_LIMIT = 240;
const PAYOUT_INTERVAL_HOURS: Record<string, number> = {
  HOURLY: 1,
  DAILY: 24,
  WEEKLY: 168,
  MONTHLY: 720
};

function addHours(date: Date, hours: number) {
  return new Date(date.getTime() + (hours * HOUR_MS));
}

function hoursBetween(start: Date, end: Date) {
  return Math.floor((end.getTime() - start.getTime()) / HOUR_MS);
}

function payoutIntervalHours(value?: string | null) {
  return PAYOUT_INTERVAL_HOURS[String(value || "HOURLY").toUpperCase()] || 1;
}

function projectedReturnPercent(product: InvestmentWithProduct["product"]) {
  const min = product.projectedReturnMin == null ? null : new Prisma.Decimal(product.projectedReturnMin);
  const max = product.projectedReturnMax == null ? null : new Prisma.Decimal(product.projectedReturnMax);
  if (product.projectedReturnMode === "FIXED" || product.projectedReturnType === "FIXED") return min || max || new Prisma.Decimal(0);
  if (min && max) return min.plus(max).div(2);
  return min || max || new Prisma.Decimal(0);
}

function accrualBaseDate(investment: Pick<InvestmentWithProduct, "profitAccruedAt" | "startDate" | "createdAt">) {
  return investment.profitAccruedAt || investment.startDate || investment.createdAt;
}

function scheduleEndDate(investment: InvestmentForProfit) {
  const durationDays = Number(investment.product.durationDays || 0);
  if (!Number.isFinite(durationDays) || durationDays <= 0) return null;
  const windows = Math.max(0, Number(investment.product.payoutCycleCount || 0)) + 1;
  const totalHours = Math.min(durationDays * windows * 24, MAX_SCHEDULE_HOURS);
  return addHours(investment.startDate || investment.createdAt, totalHours);
}

function allocationPool(investment: InvestmentForProfit) {
  const allocations = (investment.product.allocations || [])
    .filter((allocation) => !allocation.effectiveTo && allocation.instrument?.status === "ACTIVE")
    .sort((a, b) => Number(b.targetWeight) - Number(a.targetWeight));
  const pool: typeof allocations = [];
  for (const allocation of allocations) {
    const repeats = Math.max(1, Math.round(Number(allocation.targetWeight || 0) / 10));
    for (let index = 0; index < repeats; index += 1) pool.push(allocation);
  }
  return pool.length ? pool : allocations;
}

async function loadInvestmentForProfitTx(tx: Db, investmentId: string) {
  return tx.clientInvestment.findUnique({
    where: { id: investmentId },
    include: {
      product: {
        include: {
          allocations: {
            where: { effectiveTo: null },
            include: { instrument: true },
            orderBy: { targetWeight: "desc" }
          }
        }
      }
    }
  });
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

export async function ensureInvestmentProfitScheduleForInvestmentTx(tx: Db, investmentId: string, now = new Date()) {
  const investment = await loadInvestmentForProfitTx(tx, investmentId);
  if (!investment || investment.status !== "ACTIVE") return { created: 0 };
  const durationDays = Number(investment.product.durationDays || 0);
  if (!Number.isFinite(durationDays) || durationDays <= 0) return { created: 0 };
  const returnPercent = projectedReturnPercent(investment.product);
  if (!returnPercent.isPositive()) return { created: 0 };

  const endAt = scheduleEndDate(investment);
  if (!endAt) return { created: 0 };

  const lastSchedule = await tx.investmentProfitSchedule.findFirst({
    where: { investmentId: investment.id },
    orderBy: { scheduledAt: "desc" },
    select: { scheduledAt: true }
  });
  const intervalHours = payoutIntervalHours(investment.payoutInterval || investment.product.payoutInterval);
  const firstAt = lastSchedule ? addHours(lastSchedule.scheduledAt, intervalHours) : addHours(accrualBaseDate(investment), intervalHours);
  if (firstAt > endAt) return { created: 0 };

  const hourlyRate = returnPercent.div(100).div(durationDays * 24);
  const intervalAmount = new Prisma.Decimal(investment.investedAmount).mul(hourlyRate).mul(intervalHours).toDecimalPlaces(2);
  if (intervalAmount.equals(0)) return { created: 0 };

  const pool = allocationPool(investment);
  const rows: Prisma.InvestmentProfitScheduleCreateManyInput[] = [];
  for (let scheduledAt = firstAt; scheduledAt <= endAt; scheduledAt = addHours(scheduledAt, intervalHours)) {
    const hourIndex = Math.max(0, Math.floor(hoursBetween(investment.startDate || investment.createdAt, scheduledAt) / intervalHours) - 1);
    const allocation = pool.length ? pool[hourIndex % pool.length] : null;
    rows.push({
      investmentId: investment.id,
      clientId: investment.clientId,
      productId: investment.productId,
      instrumentId: allocation?.instrumentId || null,
      scheduledAt,
      type: "BOT_PROFIT",
      expectedAmount: intervalAmount,
      strategyName: "BullPort HFT Bot",
      note: allocation?.instrument
        ? `Scheduled ${investment.payoutInterval || investment.product.payoutInterval || "HOURLY"} bot P/L receipt using ${allocation.instrument.symbol}.`
        : `Scheduled ${investment.payoutInterval || investment.product.payoutInterval || "HOURLY"} bot P/L receipt using portfolio-level model.`
    });
  }
  if (!rows.length) return { created: 0 };
  const created = await tx.investmentProfitSchedule.createMany({ data: rows, skipDuplicates: true });
  return { created: created.count };
}

function allocationWeight(investment: InvestmentForProfit, instrumentId?: string | null) {
  if (!instrumentId) return new Prisma.Decimal(10);
  const allocation = investment.product.allocations.find((row) => row.instrumentId === instrumentId);
  return allocation ? new Prisma.Decimal(allocation.targetWeight) : new Prisma.Decimal(10);
}

async function priceSnapshotTx(tx: Db, instrumentId: string, asOf: Date) {
  return tx.priceSnapshot.findFirst({
    where: { instrumentId, asOf: { lte: asOf } },
    orderBy: { asOf: "desc" }
  });
}

async function createTradeReceiptTx(tx: Db, investment: InvestmentForProfit, schedule: ProfitScheduleWithInstrument, netPnl: Prisma.Decimal) {
  const intervalHours = payoutIntervalHours(investment.payoutInterval || investment.product.payoutInterval);
  const entryAt = addHours(schedule.scheduledAt, -intervalHours);
  const exitAt = schedule.scheduledAt;
  const weight = allocationWeight(investment, schedule.instrumentId);
  const baseNotional = new Prisma.Decimal(investment.investedAmount).mul(weight).div(100).toDecimalPlaces(2);
  let entryPrice = new Prisma.Decimal(1);
  let exitPrice = new Prisma.Decimal(1);
  let quantity = baseNotional;
  let notional = baseNotional;
  let source = "BullPort scheduled portfolio model";
  let sourceSnapshot: Prisma.InputJsonObject = {
    generatedFrom: "projection",
      allocationWeight: weight.toFixed(4),
      payoutIntervalHours: intervalHours,
      narrative: "No external market snapshot was available; receipt uses the approved product return schedule."
  };

  if (schedule.instrumentId) {
    const [entrySnapshot, exitSnapshot] = await Promise.all([
      priceSnapshotTx(tx, schedule.instrumentId, entryAt),
      priceSnapshotTx(tx, schedule.instrumentId, exitAt)
    ]);
    entryPrice = new Prisma.Decimal(entrySnapshot?.price || schedule.instrument?.currentPrice || 1);
    exitPrice = new Prisma.Decimal(exitSnapshot?.price || schedule.instrument?.currentPrice || entryPrice);
    source = exitSnapshot?.source || entrySnapshot?.source || schedule.instrument?.priceSource || "Admin managed market snapshot";
    const priceMove = exitPrice.minus(entryPrice);
    if (!priceMove.equals(0) && !netPnl.equals(0)) {
      quantity = netPnl.div(priceMove).abs().toDecimalPlaces(8);
      notional = quantity.mul(entryPrice).toDecimalPlaces(2);
    } else {
      quantity = entryPrice.isPositive() ? baseNotional.div(entryPrice).toDecimalPlaces(8) : new Prisma.Decimal(0);
      const modelMove = quantity.equals(0) ? new Prisma.Decimal(0) : netPnl.div(quantity).toDecimalPlaces(8);
      exitPrice = entryPrice.plus(modelMove).toDecimalPlaces(8);
    }
    sourceSnapshot = {
      generatedFrom: entrySnapshot || exitSnapshot ? "market_snapshot" : "admin_projection",
      instrument: schedule.instrument?.symbol || schedule.instrumentId,
      allocationWeight: weight.toFixed(4),
      payoutIntervalHours: intervalHours,
      entrySnapshotId: entrySnapshot?.id || null,
      exitSnapshotId: exitSnapshot?.id || null,
      entrySource: entrySnapshot?.source || schedule.instrument?.priceSource || null,
      exitSource: exitSnapshot?.source || schedule.instrument?.priceSource || null,
      narrative: entrySnapshot || exitSnapshot
        ? "Receipt lot size was derived from stored market snapshots and scheduled net P/L."
        : "Receipt used the instrument's admin-managed price because no external snapshot was available."
    };
  }

  const fees = netPnl.abs().mul(0.01).toDecimalPlaces(2);
  const grossPnl = netPnl.plus(fees).toDecimalPlaces(2);
  const side = netPnl.greaterThanOrEqualTo(0) ? "BUY" : "SELL";
  return tx.investmentTradeReceipt.create({
    data: {
      scheduleId: schedule.id,
      investmentId: investment.id,
      clientId: investment.clientId,
      productId: investment.productId,
      instrumentId: schedule.instrumentId,
      reference: reference("BOT"),
      strategyName: schedule.strategyName || "BullPort HFT Bot",
      side,
      entryAt,
      exitAt,
      entryPrice,
      exitPrice,
      quantity,
      notional,
      grossPnl,
      fees,
      netPnl,
      source,
      sourceSnapshot
    }
  });
}

async function postProfitScheduleTx(tx: Db, investment: InvestmentForProfit, schedule: ProfitScheduleWithInstrument, now = new Date()) {
  const claimed = await tx.investmentProfitSchedule.updateMany({
    where: { id: schedule.id, status: "PENDING" },
    data: { status: "PROCESSING" }
  });
  if (claimed.count !== 1) return null;

  const actualAmount: Prisma.Decimal = new Prisma.Decimal(schedule.expectedAmount).toDecimalPlaces(2);
  const current: InvestmentWithProduct = await tx.clientInvestment.findUniqueOrThrow({ where: { id: investment.id }, include: { product: true } });
  const profitAccrued: Prisma.Decimal = new Prisma.Decimal(current.profitAccrued || 0).plus(actualAmount).toDecimalPlaces(2);
  const currentValue: Prisma.Decimal = new Prisma.Decimal(current.investedAmount).plus(profitAccrued).toDecimalPlaces(2);
  const unitPrice: Prisma.Decimal = current.units.isPositive() ? currentValue.div(current.units) : new Prisma.Decimal(1);
  const receipt = await createTradeReceiptTx(tx, investment, schedule, actualAmount);
  const updated = await tx.clientInvestment.update({
    where: { id: investment.id },
    data: {
      currentValue,
      profitAccrued,
      profitAccruedAt: schedule.scheduledAt,
      nextAction: `Bot receipt ${receipt.reference} posted ${actualAmount.toFixed(2)} through ${schedule.scheduledAt.toISOString().slice(0, 13)}:00 UTC`
    },
    include: { product: true }
  });
  await tx.investmentValuation.upsert({
    where: { investmentId_asOf: { investmentId: investment.id, asOf: schedule.scheduledAt } },
    update: { value: currentValue, unitPrice, source: `Bot P/L receipt ${receipt.reference}` },
    create: { investmentId: investment.id, value: currentValue, unitPrice, source: `Bot P/L receipt ${receipt.reference}`, asOf: schedule.scheduledAt }
  });
  await tx.investmentTransaction.create({
    data: {
      investmentId: investment.id,
      reference: reference("INVPL"),
      type: "BOT_TRADE_PNL",
      amount: actualAmount,
      units: 0,
      unitPrice: 1
    }
  });
  await tx.investmentProfitSchedule.update({
    where: { id: schedule.id },
    data: { status: "POSTED", actualAmount, postedAt: now }
  });
  const amountLabel = actualAmount.abs().toFixed(2);
  const currency = updated.product.currency || "USD";
  const isProfit = actualAmount.greaterThanOrEqualTo(0);
  await notifyClientTx(tx, {
    clientId: investment.clientId,
    category: "Distribution",
    eventKey: "investment.profit.posted",
    severity: isProfit ? "SUCCESS" : "WARNING",
    title: isProfit ? "Profit receipt posted" : "Trading adjustment posted",
    body: isProfit
      ? `${currency} ${amountLabel} profit from ${updated.product.name} is now available in your dividends and profits history.`
      : `${currency} ${amountLabel} trading adjustment from ${updated.product.name} was posted to your dividends and profits history.`,
    actionUrl: "dividends.html",
    entity: { type: "InvestmentTradeReceipt", id: receipt.id },
    metadata: {
      investmentId: investment.id,
      scheduleId: schedule.id,
      receiptId: receipt.id,
      receiptReference: receipt.reference,
      productId: updated.productId,
      productName: updated.product.name,
      amount: actualAmount.toFixed(2),
      currency,
      scheduledAt: schedule.scheduledAt.toISOString()
    },
    dedupeKey: `investment.profit.posted:${schedule.id}`
  });
  return updated;
}

async function postDueProfitSchedulesTx(tx: Db, investment: InvestmentForProfit, now = new Date()) {
  const due = await tx.investmentProfitSchedule.findMany({
    where: { investmentId: investment.id, status: "PENDING", scheduledAt: { lte: now } },
    include: { instrument: true },
    orderBy: { scheduledAt: "asc" },
    take: DUE_POST_LIMIT
  });
  let latest: InvestmentWithProduct | null = null;
  let posted = 0;
  for (const schedule of due) {
    const updated = await postProfitScheduleTx(tx, investment, schedule, now);
    if (!updated) continue;
    latest = updated;
    posted += 1;
  }
  return { posted, investment: latest };
}

export async function applyProfitScheduleNowTx(tx: Db, scheduleId: string, adminId: string) {
  const existing = await tx.investmentProfitSchedule.findUnique({
    where: { id: scheduleId },
    include: { instrument: true, investment: true }
  });
  if (!existing) throw new ApiError(404, "Profit schedule row was not found", "SCHEDULE_NOT_FOUND");
  if (existing.status !== "PENDING") throw new ApiError(409, "Only pending schedule rows can be applied", "SCHEDULE_NOT_PENDING");
  const investment = await loadInvestmentForProfitTx(tx, existing.investmentId);
  if (!investment || investment.status !== "ACTIVE") throw new ApiError(409, "Only active investments can post bot P/L", "INVESTMENT_NOT_ACTIVE");
  const now = new Date();
  const schedule = existing.scheduledAt > now
    ? await tx.investmentProfitSchedule.update({
      where: { id: existing.id },
      data: { scheduledAt: now, note: `${existing.note || ""}\nApplied immediately by admin.`.trim(), createdByAdminId: adminId },
      include: { instrument: true }
    })
    : existing;
  const updated = await postProfitScheduleTx(tx, investment, schedule, now);
  if (!updated) throw new ApiError(409, "Schedule row could not be applied", "SCHEDULE_APPLY_FAILED");
  return tx.investmentProfitSchedule.findUniqueOrThrow({
    where: { id: schedule.id },
    include: { client: true, product: true, instrument: true, investment: true, receipt: true }
  });
}

export async function accrueInvestmentProfitTx(tx: Db, investment: InvestmentWithProduct, now = new Date()) {
  const full = await loadInvestmentForProfitTx(tx, investment.id);
  if (!full || full.status !== "ACTIVE") return investment;
  await ensureInvestmentProfitScheduleForInvestmentTx(tx, full.id, now);
  const result = await postDueProfitSchedulesTx(tx, full, now);
  if (result.investment) return result.investment;
  return tx.clientInvestment.findUniqueOrThrow({ where: { id: investment.id }, include: { product: true } });
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

export async function transferInvestmentProfitToWalletTx(tx: Db, input: { investmentId: string; clientId: string; amount?: number; actorId: string; note: string }) {
  const investment = await tx.clientInvestment.findFirst({ where: { id: input.investmentId, clientId: input.clientId }, include: { product: true } });
  if (!investment) throw new ApiError(404, "Investment was not found", "INVESTMENT_NOT_FOUND");
  if (["CANCELLED", "CLOSED"].includes(investment.status)) throw new ApiError(409, "Closed investments cannot transfer profit", "INVESTMENT_CLOSED");
  const accrued = await accrueInvestmentProfitTx(tx, investment);
  const availableProfit = new Prisma.Decimal(accrued.profitAccrued || 0).toDecimalPlaces(2);
  if (!availableProfit.isPositive()) throw new ApiError(409, "There is no positive portfolio profit available to transfer", "NO_PROFIT_AVAILABLE");
  const amount = input.amount == null ? availableProfit : new Prisma.Decimal(input.amount).toDecimalPlaces(2);
  if (!amount.isPositive()) throw new ApiError(422, "Transfer amount must be positive", "INVALID_TRANSFER_AMOUNT");
  if (amount.greaterThan(availableProfit)) throw new ApiError(409, "Only accrued profit can be transferred to wallet", "PROFIT_TRANSFER_EXCEEDS_AVAILABLE");

  const remainingProfit = availableProfit.minus(amount).toDecimalPlaces(2);
  const currentValue = new Prisma.Decimal(accrued.currentValue).minus(amount).toDecimalPlaces(2);
  const ledger = await creditClientCashTx(tx, {
    clientId: accrued.clientId,
    amount,
    type: "PROFIT",
    description: `Portfolio profit transfer from ${accrued.product.name}`,
    currency: accrued.currency,
    idempotencyKey: `investment-profit-transfer:${accrued.id}:${Date.now()}`,
    initiatedBy: input.actorId,
    metadata: { investmentId: accrued.id, productId: accrued.productId, note: input.note }
  });
  const updated = await tx.clientInvestment.update({
    where: { id: accrued.id },
    data: {
      profitAccrued: remainingProfit,
      currentValue,
      nextAction: `Transferred ${accrued.currency} ${amount.toFixed(2)} accrued profit to wallet`
    },
    include: { product: true, client: true }
  });
  await tx.investmentTransaction.create({
    data: {
      investmentId: accrued.id,
      reference: reference("INVPT"),
      type: "PROFIT_TRANSFER_TO_WALLET",
      amount,
      units: 0,
      unitPrice: 1,
      ledgerTransactionId: ledger.id
    }
  });
  await notifyClientTx(tx, {
    clientId: accrued.clientId,
    category: "Investment",
    title: "Portfolio profit transferred",
    body: `${accrued.currency} ${amount.toFixed(2)} profit from ${accrued.product.name} has been credited to your wallet.`,
    actionUrl: "wallet.html",
    entity: { type: "ClientInvestment", id: accrued.id },
    metadata: { investmentId: accrued.id, amount: amount.toFixed(2) }
  });
  return { investment: updated, transferred: amount, availableProfit: remainingProfit, ledgerTransactionId: ledger.id };
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
  await tx.investmentProfitSchedule.updateMany({
    where: { investmentId: accrued.id, status: "PENDING" },
    data: { status: "CANCELLED", note: input.note }
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
