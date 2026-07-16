import { Prisma, type LedgerEntrySide, type LedgerTransactionType } from "@prisma/client";
import { ApiError, reference } from "../lib/http";
import { prisma } from "../lib/prisma";

type Db = Prisma.TransactionClient;
type EntryInput = { accountId: string; side: LedgerEntrySide; amount: Prisma.Decimal.Value; currency: string; memo?: string };

function amount(value: Prisma.Decimal.Value) {
  const parsed = new Prisma.Decimal(value);
  if (!parsed.isPositive()) throw new ApiError(422, "Amount must be greater than zero", "INVALID_AMOUNT");
  return parsed;
}

async function ensureCashAccount(tx: Db, clientId: string, currency = "USD") {
  const wallet = await tx.walletAccount.findUnique({ where: { clientId }, include: { client: true } });
  if (!wallet) throw new ApiError(404, "Wallet was not found", "WALLET_NOT_FOUND");
  const account = await tx.ledgerAccount.upsert({
    where: { code: `CLIENT-${wallet.client.accountNumber}-${currency}-CASH` },
    update: {},
    create: {
      walletId: wallet.id,
      code: `CLIENT-${wallet.client.accountNumber}-${currency}-CASH`,
      name: `${wallet.client.name} ${currency} cash`,
      kind: "CLIENT_CASH",
      currency,
      balance: currency === wallet.currency ? wallet.balance : 0,
      available: currency === wallet.currency ? wallet.available : 0
    }
  });
  return { wallet, account };
}

async function ensurePlatformAccount(tx: Db, kind: "PLATFORM_CLEARING" | "PLATFORM_FEES" | "PLATFORM_REVENUE", currency = "USD") {
  const suffix = kind.replace("PLATFORM_", "");
  return tx.ledgerAccount.upsert({
    where: { code: `PLATFORM-${suffix}-${currency}` },
    update: {},
    create: {
      code: `PLATFORM-${suffix}-${currency}`,
      name: `Platform ${currency} ${suffix.toLowerCase()}`,
      kind,
      currency,
      balance: 0,
      available: 0
    }
  });
}

async function postEntries(tx: Db, input: {
  clientId?: string;
  type: LedgerTransactionType;
  currency: string;
  description: string;
  entries: EntryInput[];
  idempotencyKey?: string;
  externalReference?: string;
  initiatedBy?: string;
  approvedBy?: string;
  metadata?: Prisma.InputJsonObject;
  reference?: string;
}) {
  if (input.idempotencyKey) {
    const existing = await tx.ledgerTransaction.findUnique({ where: { idempotencyKey: input.idempotencyKey } });
    if (existing) return existing;
  }
  const debit = input.entries.filter((entry) => entry.side === "DEBIT").reduce((sum, entry) => sum.plus(amount(entry.amount)), new Prisma.Decimal(0));
  const credit = input.entries.filter((entry) => entry.side === "CREDIT").reduce((sum, entry) => sum.plus(amount(entry.amount)), new Prisma.Decimal(0));
  if (!debit.equals(credit)) throw new ApiError(500, "Ledger transaction is not balanced", "LEDGER_UNBALANCED");
  if (input.entries.some((entry) => entry.currency !== input.currency)) {
    throw new ApiError(422, "All ledger entries must use the transaction currency", "LEDGER_CURRENCY_MISMATCH");
  }
  const record = await tx.ledgerTransaction.create({
    data: {
      reference: input.reference || reference("LED"),
      clientId: input.clientId,
      type: input.type,
      status: "POSTED",
      currency: input.currency,
      description: input.description,
      idempotencyKey: input.idempotencyKey,
      externalReference: input.externalReference,
      initiatedBy: input.initiatedBy,
      approvedBy: input.approvedBy,
      metadata: input.metadata,
      postedAt: new Date(),
      entries: {
        create: input.entries.map((entry) => ({ ...entry, amount: amount(entry.amount) }))
      }
    }
  });
  for (const entry of input.entries) {
    const value = amount(entry.amount);
    await tx.ledgerAccount.update({
      where: { id: entry.accountId },
      data: { balance: entry.side === "DEBIT" ? { increment: value } : { decrement: value } }
    });
  }
  return record;
}

export async function creditClientCashTx(tx: Db, input: {
  clientId: string;
  amount: Prisma.Decimal.Value;
  type: "DEPOSIT" | "DIVIDEND" | "PROFIT" | "TRADE" | "ADJUSTMENT";
  description: string;
  currency?: string;
  idempotencyKey?: string;
  externalReference?: string;
  initiatedBy?: string;
  approvedBy?: string;
  metadata?: Prisma.InputJsonObject;
}) {
  const currency = input.currency || "USD";
  const value = amount(input.amount);
  const { wallet, account } = await ensureCashAccount(tx, input.clientId, currency);
  const clearing = await ensurePlatformAccount(tx, "PLATFORM_CLEARING", currency);
  const record = await postEntries(tx, {
    ...input,
    currency,
    entries: [
      { accountId: account.id, side: "DEBIT", amount: value, currency, memo: input.description },
      { accountId: clearing.id, side: "CREDIT", amount: value, currency, memo: input.description }
    ]
  });
  await tx.ledgerAccount.update({ where: { id: account.id }, data: { available: { increment: value } } });
  if (currency === wallet.currency) {
    await tx.walletAccount.update({
      where: { id: wallet.id },
      data: { balance: { increment: value }, available: { increment: value } }
    });
  }
  return record;
}

export async function debitClientCashTx(tx: Db, input: {
  clientId: string;
  amount: Prisma.Decimal.Value;
  type: "WITHDRAWAL" | "INVESTMENT_SUBSCRIPTION" | "TRADE" | "FEE" | "ADJUSTMENT";
  description: string;
  currency?: string;
  idempotencyKey?: string;
  externalReference?: string;
  initiatedBy?: string;
  approvedBy?: string;
  metadata?: Prisma.InputJsonObject;
}) {
  const currency = input.currency || "USD";
  const value = amount(input.amount);
  const { wallet, account } = await ensureCashAccount(tx, input.clientId, currency);
  if (new Prisma.Decimal(account.available).lessThan(value)) throw new ApiError(409, "Insufficient available wallet balance", "INSUFFICIENT_FUNDS");
  const clearing = await ensurePlatformAccount(tx, "PLATFORM_CLEARING", currency);
  const record = await postEntries(tx, {
    ...input,
    currency,
    entries: [
      { accountId: clearing.id, side: "DEBIT", amount: value, currency, memo: input.description },
      { accountId: account.id, side: "CREDIT", amount: value, currency, memo: input.description }
    ]
  });
  await tx.ledgerAccount.update({ where: { id: account.id }, data: { available: { decrement: value } } });
  if (currency === wallet.currency) {
    const updated = await tx.walletAccount.updateMany({
      where: { id: wallet.id, available: { gte: value }, balance: { gte: value } },
      data: { balance: { decrement: value }, available: { decrement: value } }
    });
    if (updated.count !== 1) throw new ApiError(409, "Insufficient available wallet balance", "INSUFFICIENT_FUNDS");
  }
  return record;
}

export async function placeWalletHoldTx(tx: Db, clientId: string, value: Prisma.Decimal.Value, reason: string, currency = "USD") {
    const holdAmount = amount(value);
    const { wallet, account } = await ensureCashAccount(tx, clientId, currency);
    const walletUpdate = await tx.walletAccount.updateMany({
      where: { id: wallet.id, available: { gte: holdAmount } },
      data: { available: { decrement: holdAmount }, held: { increment: holdAmount } }
    });
    if (walletUpdate.count !== 1) throw new ApiError(409, "Insufficient available wallet balance", "INSUFFICIENT_FUNDS");
    await tx.ledgerAccount.update({ where: { id: account.id }, data: { available: { decrement: holdAmount } } });
    return tx.walletHold.create({
      data: {
        walletId: wallet.id,
        ledgerAccountId: account.id,
        reference: reference("HOLD"),
        amount: holdAmount,
        currency,
        reason,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    });
}

export async function placeWalletHold(clientId: string, value: Prisma.Decimal.Value, reason: string, currency = "USD") {
  return prisma.$transaction(async (tx) => {
    return placeWalletHoldTx(tx, clientId, value, reason, currency);
  }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
}

export async function releaseWalletHold(referenceValue: string) {
  return prisma.$transaction(async (tx) => {
    return releaseWalletHoldTx(tx, referenceValue);
  });
}

export async function releaseWalletHoldTx(tx: Db, referenceValue: string) {
    const hold = await tx.walletHold.findUnique({ where: { reference: referenceValue } });
    if (!hold) throw new ApiError(404, "Wallet hold was not found", "HOLD_NOT_FOUND");
    if (hold.status !== "ACTIVE") return hold;
    await tx.walletAccount.update({
      where: { id: hold.walletId },
      data: { available: { increment: hold.amount }, held: { decrement: hold.amount } }
    });
    await tx.ledgerAccount.update({ where: { id: hold.ledgerAccountId }, data: { available: { increment: hold.amount } } });
    return tx.walletHold.update({ where: { id: hold.id }, data: { status: "RELEASED", releasedAt: new Date() } });
}

export async function captureWalletHoldTx(tx: Db, referenceValue: string, input: {
  clientId: string;
  description: string;
  type?: "WITHDRAWAL" | "TRADE";
  captureAmount?: Prisma.Decimal.Value;
  idempotencyKey?: string;
  externalReference?: string;
  initiatedBy?: string;
  approvedBy?: string;
}) {
  const hold = await tx.walletHold.findUnique({ where: { reference: referenceValue } });
  if (!hold) throw new ApiError(404, "Wallet hold was not found", "HOLD_NOT_FOUND");
  if (hold.status === "CAPTURED") {
    const existing = input.idempotencyKey ? await tx.ledgerTransaction.findUnique({ where: { idempotencyKey: input.idempotencyKey } }) : null;
    if (existing) return existing;
    throw new ApiError(409, "Wallet hold has already been captured", "HOLD_ALREADY_CAPTURED");
  }
  if (hold.status !== "ACTIVE") throw new ApiError(409, "Wallet hold is no longer active", "HOLD_INACTIVE");
  const capturedAmount = input.captureAmount ? amount(input.captureAmount) : new Prisma.Decimal(hold.amount);
  if (capturedAmount.greaterThan(hold.amount)) throw new ApiError(409, "Settlement exceeds the reserved amount", "HOLD_AMOUNT_EXCEEDED");
  const remainder = new Prisma.Decimal(hold.amount).minus(capturedAmount);
  const clearing = await ensurePlatformAccount(tx, "PLATFORM_CLEARING", hold.currency);
  const record = await postEntries(tx, {
    ...input,
    type: input.type || "WITHDRAWAL",
    currency: hold.currency,
    entries: [
      { accountId: clearing.id, side: "DEBIT", amount: capturedAmount, currency: hold.currency, memo: input.description },
      { accountId: hold.ledgerAccountId, side: "CREDIT", amount: capturedAmount, currency: hold.currency, memo: input.description }
    ]
  });
  await tx.walletAccount.update({
    where: { id: hold.walletId },
    data: {
      balance: { decrement: capturedAmount },
      held: { decrement: hold.amount },
      ...(remainder.isPositive() ? { available: { increment: remainder } } : {})
    }
  });
  if (remainder.isPositive()) await tx.ledgerAccount.update({ where: { id: hold.ledgerAccountId }, data: { available: { increment: remainder } } });
  await tx.walletHold.update({ where: { id: hold.id }, data: { status: "CAPTURED", releasedAt: new Date() } });
  return record;
}

export async function reconcileLedger() {
  const accounts = await prisma.ledgerAccount.findMany({ include: { entries: true } });
  return accounts.map((account) => {
    const calculated = account.entries.reduce((sum, entry) => {
      const value = new Prisma.Decimal(entry.amount);
      return entry.side === "DEBIT" ? sum.plus(value) : sum.minus(value);
    }, new Prisma.Decimal(0));
    return { accountId: account.id, code: account.code, stored: account.balance.toString(), calculated: calculated.toString(), balanced: calculated.equals(account.balance) };
  });
}
