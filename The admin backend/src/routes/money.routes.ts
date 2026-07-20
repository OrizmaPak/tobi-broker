import { Router } from "express";
import { z } from "zod";
import { asyncHandler, ok } from "../lib/http";
import { prisma } from "../lib/prisma";
import { writeAudit } from "../services/audit.service";
import { notifyClientTx } from "../services/notification.service";

export const moneyRouter = Router();

const noteSchema = z.object({
  note: z.string().optional()
});

moneyRouter.get("/deposits", asyncHandler(async (_req, res) => {
  const deposits = await prisma.deposit.findMany({
    include: { client: true },
    orderBy: { createdAt: "desc" }
  });
  return ok(res, deposits);
}));

moneyRouter.post("/deposits/:id/credit", asyncHandler(async (req, res) => {
  const input = noteSchema.parse(req.body);
  const depositId = String(req.params.id);
  const result = await prisma.$transaction(async (tx) => {
    const deposit = await tx.deposit.update({
      where: { id: depositId },
      data: { status: "CREDITED", reviewNote: input.note }
    });
    const wallet = await tx.walletAccount.findUnique({ where: { clientId: deposit.clientId } });

    if (wallet) {
      await tx.walletTransaction.create({
        data: {
          walletId: wallet.id,
          type: "DEPOSIT",
          amount: deposit.amount,
          reference: deposit.reference,
          status: "CREDITED",
          memo: input.note
        }
      });
      await tx.walletAccount.update({
        where: { id: wallet.id },
        data: {
          balance: { increment: deposit.amount },
          available: { increment: deposit.amount }
        }
      });
    }

    return deposit;
  });

  await writeAudit("creditDeposit", "Deposit", result.id, { reference: result.reference });
  return ok(res, result);
}));

moneyRouter.post("/deposits/:id/flag", asyncHandler(async (req, res) => {
  const input = noteSchema.parse(req.body);
  const depositId = String(req.params.id);
  const deposit = await prisma.deposit.update({
    where: { id: depositId },
    data: { status: "FLAGGED", reviewNote: input.note }
  });
  await writeAudit("flagDeposit", "Deposit", deposit.id, { note: input.note });
  return ok(res, deposit);
}));

moneyRouter.get("/withdrawals", asyncHandler(async (_req, res) => {
  const withdrawals = await prisma.withdrawal.findMany({
    include: { client: true },
    orderBy: { createdAt: "desc" }
  });
  return ok(res, withdrawals);
}));

moneyRouter.post("/withdrawals/:id/approve", asyncHandler(async (req, res) => {
  const input = noteSchema.parse(req.body);
  const withdrawalId = String(req.params.id);
  const withdrawal = await prisma.$transaction(async (tx) => {
    const row = await tx.withdrawal.update({
      where: { id: withdrawalId },
      data: { status: "APPROVED", reviewNote: input.note }
    });
    await notifyClientTx(tx, {
      clientId: row.clientId,
      category: "Wallet",
      eventKey: "withdrawal.approved",
      severity: "SUCCESS",
      title: "Withdrawal approved",
      body: `${row.reference} has been approved.`,
      actionUrl: "withdraw.html",
      entity: { type: "Withdrawal", id: row.id },
      metadata: { reference: row.reference },
      dedupeKey: `withdrawal.approved:${row.id}:legacy`
    });
    return row;
  });
  await writeAudit("approveWithdrawal", "Withdrawal", withdrawal.id, { reference: withdrawal.reference });
  return ok(res, withdrawal);
}));

moneyRouter.post("/withdrawals/:id/hold", asyncHandler(async (req, res) => {
  const input = noteSchema.parse(req.body);
  const withdrawalId = String(req.params.id);
  const note = input.note || "Withdrawal review is taking longer than expected.";
  const withdrawal = await prisma.$transaction(async (tx) => {
    const row = await tx.withdrawal.update({
      where: { id: withdrawalId },
      data: { status: "HELD", reviewNote: input.note }
    });
    await notifyClientTx(tx, {
      clientId: row.clientId,
      category: "Wallet",
      eventKey: "withdrawal.held",
      severity: "WARNING",
      title: "Withdrawal review extended",
      body: note,
      actionUrl: "withdraw.html",
      entity: { type: "Withdrawal", id: row.id },
      metadata: { reference: row.reference },
      dedupeKey: `withdrawal.held:${row.id}:legacy`
    });
    return row;
  });
  await writeAudit("holdWithdrawal", "Withdrawal", withdrawal.id, { note: input.note });
  return ok(res, withdrawal);
}));
