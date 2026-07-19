import { Router } from "express";
import { z } from "zod";
import { requireClient } from "../middleware/auth";
import { ApiError, asyncHandler, ok } from "../lib/http";
import { prisma } from "../lib/prisma";
import { notifyClient } from "../services/notification.service";

export const clientPortalRouter = Router();

clientPortalRouter.use(requireClient);

const moneyActionSchema = z.object({
  amount: z.coerce.number().positive().default(3500),
  method: z.string().optional(),
  rail: z.string().optional(),
  destination: z.string().optional()
});

const kycSubmitSchema = z.object({
  documentRef: z.string().optional(),
  requirement: z.string().default("Identity and address verification")
});

const investmentSchema = z.object({
  productId: z.string().optional(),
  productName: z.string().optional(),
  amount: z.coerce.number().positive().optional()
});

const ticketSchema = z.object({
  subject: z.string().min(3),
  priority: z.string().default("Normal")
});

function activeClientId(req: { user?: { id: string } }) {
  if (!req.user?.id) throw new ApiError(401, "Missing client session");
  return req.user.id;
}

function money(value: unknown) {
  return Number(value ?? 0);
}

function statusText(value?: string) {
  if (!value) return "Not started";
  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function reference(prefix: string) {
  return `${prefix}-${Date.now().toString().slice(-7)}`;
}

async function latestKycStatus(clientId: string) {
  const latest = await prisma.kycReview.findFirst({
    where: { clientId },
    orderBy: { updatedAt: "desc" }
  });
  return latest?.status ?? "NOT_STARTED";
}

async function snapshot(clientId: string) {
  const client = await prisma.client.findUnique({
    where: { id: clientId },
    include: {
      wallet: { include: { ledger: { orderBy: { createdAt: "desc" }, take: 20 } } },
      kycReviews: { orderBy: { updatedAt: "desc" }, take: 10 },
      deposits: { orderBy: { createdAt: "desc" }, take: 20 },
      withdrawals: { orderBy: { createdAt: "desc" }, take: 20 },
      investments: { include: { product: true }, orderBy: { updatedAt: "desc" } },
      payouts: { orderBy: { payoutDate: "desc" }, take: 20 },
      tickets: { orderBy: { updatedAt: "desc" }, take: 20 },
      notifications: { where: { recipientType: "CLIENT" }, orderBy: { createdAt: "desc" }, take: 20 }
    }
  });

  if (!client) throw new ApiError(404, "Client not found");

  const products = await prisma.portfolioProduct.findMany({
    where: { status: { not: "HIDDEN" } },
    orderBy: { name: "asc" }
  });
  const instruments = await prisma.instrument.findMany({ orderBy: { symbol: "asc" } });
  const reports = await prisma.reportExport.findMany({ orderBy: { createdAt: "desc" }, take: 20 });

  const transactions = [
    ...(client.wallet?.ledger ?? []).map((row) => ({
      id: row.id,
      date: row.createdAt,
      type: statusText(row.type),
      reference: row.reference,
      amount: money(row.amount),
      status: statusText(row.status),
      source: "Wallet"
    })),
    ...client.deposits.map((row) => ({
      id: row.id,
      date: row.createdAt,
      type: "Deposit",
      reference: row.reference,
      amount: money(row.amount),
      status: statusText(row.status),
      source: row.method
    })),
    ...client.withdrawals.map((row) => ({
      id: row.id,
      date: row.createdAt,
      type: "Withdrawal",
      reference: row.reference,
      amount: -money(row.amount),
      status: statusText(row.status),
      source: row.destination
    })),
    ...client.payouts.map((row) => ({
      id: row.id,
      date: row.payoutDate,
      type: row.mode,
      reference: row.reference,
      amount: money(row.amount),
      status: statusText(row.status),
      source: row.source
    }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const activeInvestments = client.investments.filter((row) => row.status === "ACTIVE");
  const totalPortfolioValue = client.investments.reduce((sum, row) => sum + money(row.currentValue), 0);
  const totalInvested = client.investments.reduce((sum, row) => sum + money(row.investedAmount), 0);
  const pendingDeposits = client.deposits
    .filter((row) => ["PENDING", "IN_REVIEW"].includes(row.status))
    .reduce((sum, row) => sum + money(row.amount), 0);
  const pendingWithdrawals = client.withdrawals
    .filter((row) => ["PENDING", "IN_REVIEW", "HELD"].includes(row.status))
    .reduce((sum, row) => sum + money(row.amount), 0);
  const totalPayouts = client.payouts
    .filter((row) => ["APPROVED", "CONFIRMED", "CREDITED"].includes(row.status))
    .reduce((sum, row) => sum + money(row.amount), 0);
  const nextPayout = client.payouts
    .filter((row) => row.payoutDate >= new Date())
    .sort((a, b) => a.payoutDate.getTime() - b.payoutDate.getTime())[0];

  return {
    client: {
      id: client.id,
      accountNumber: client.accountNumber,
      name: client.name,
      email: client.email,
      phone: client.phone,
      status: client.status,
      riskLevel: statusText(client.riskLevel),
      tier: client.tier,
      kycStatus: statusText(client.kycReviews[0]?.status ?? "NOT_STARTED")
    },
    wallet: client.wallet,
    kycReviews: client.kycReviews,
    metrics: {
      walletBalance: money(client.wallet?.available),
      walletReserved: Math.max(money(client.wallet?.balance) - money(client.wallet?.available), 0),
      totalPortfolioValue,
      totalInvested,
      activeInvestments: activeInvestments.length,
      totalDividends: totalPayouts,
      totalProfits: Math.max(totalPortfolioValue - totalInvested, 0),
      profitLoss: totalPortfolioValue - totalInvested,
      pendingDeposits,
      pendingWithdrawals,
      nextPayoutDate: nextPayout?.payoutDate ?? null,
      profileCompletion: client.kycReviews[0]?.status === "APPROVED" ? 100 : 86
    },
    products,
    investments: client.investments,
    instruments,
    deposits: client.deposits,
    withdrawals: client.withdrawals,
    transactions,
    payouts: client.payouts,
    notifications: client.notifications,
    reports,
    supportTickets: client.tickets
  };
}

clientPortalRouter.get("/dashboard", asyncHandler(async (req, res) => {
  return ok(res, await snapshot(activeClientId(req)));
}));

clientPortalRouter.get("/me", asyncHandler(async (req, res) => {
  const data = await snapshot(activeClientId(req));
  return ok(res, data.client);
}));

clientPortalRouter.get("/wallet", asyncHandler(async (req, res) => {
  const data = await snapshot(activeClientId(req));
  return ok(res, {
    wallet: data.wallet,
    transactions: data.transactions,
    deposits: data.deposits,
    withdrawals: data.withdrawals
  });
}));

clientPortalRouter.get("/portfolio-products", asyncHandler(async (_req, res) => {
  const products = await prisma.portfolioProduct.findMany({
    where: { status: { not: "HIDDEN" } },
    orderBy: { name: "asc" }
  });
  return ok(res, products);
}));

clientPortalRouter.get("/instruments", asyncHandler(async (_req, res) => {
  const instruments = await prisma.instrument.findMany({ orderBy: { symbol: "asc" } });
  return ok(res, instruments);
}));

clientPortalRouter.post("/deposits", asyncHandler(async (req, res) => {
  const input = moneyActionSchema.parse(req.body);
  const clientId = activeClientId(req);
  const deposit = await prisma.deposit.create({
    data: {
      reference: reference("DEP"),
      clientId,
      method: input.method ?? "Bank transfer",
      rail: input.rail ?? "Manual transfer",
      amount: input.amount,
      status: "PENDING",
      reviewNote: "Client submitted funding request from dashboard."
    }
  });

  await notifyClient({
    clientId,
    category: "Wallet",
    title: "Deposit request submitted",
    body: `${deposit.method} funding request ${deposit.reference} is pending operations review.`
  });

  return ok(res, deposit, 201);
}));

clientPortalRouter.post("/withdrawals", asyncHandler(async (req, res) => {
  const input = moneyActionSchema.parse(req.body);
  const clientId = activeClientId(req);
  const status = await latestKycStatus(clientId);
  if (status !== "APPROVED") {
    throw new ApiError(403, "KYC approval is required before withdrawal");
  }

  const wallet = await prisma.walletAccount.findUnique({ where: { clientId } });
  if (!wallet || money(wallet.available) < input.amount) {
    throw new ApiError(400, "Insufficient available wallet balance");
  }

  const withdrawal = await prisma.$transaction(async (tx) => {
    const created = await tx.withdrawal.create({
      data: {
        reference: reference("WDR"),
        clientId,
        destination: input.destination ?? "Verified bank account",
        amount: input.amount,
        status: "IN_REVIEW",
        reviewNote: "Client submitted withdrawal request from dashboard."
      }
    });

    await tx.walletAccount.update({
      where: { id: wallet.id },
      data: { available: { decrement: input.amount } }
    });

    await tx.walletTransaction.create({
      data: {
        walletId: wallet.id,
        type: "WITHDRAWAL_REQUEST",
        amount: input.amount,
        reference: created.reference,
        status: "IN_REVIEW",
        memo: created.destination
      }
    });

    return created;
  });

  await notifyClient({
    clientId,
    category: "Wallet",
    title: "Withdrawal submitted for review",
    body: `${withdrawal.reference} is now waiting for finance approval.`
  });

  return ok(res, withdrawal, 201);
}));

clientPortalRouter.post("/kyc/submit", asyncHandler(async (req, res) => {
  const input = kycSubmitSchema.parse(req.body);
  const clientId = activeClientId(req);
  const existing = await prisma.kycReview.findFirst({
    where: { clientId, requirement: input.requirement },
    orderBy: { updatedAt: "desc" }
  });

  const review = existing
    ? await prisma.kycReview.update({
        where: { id: existing.id },
        data: {
          status: existing.status === "APPROVED" ? "APPROVED" : "IN_REVIEW",
          documentRef: input.documentRef ?? existing.documentRef,
          decisionNote: "Client submitted documents from dashboard."
        }
      })
    : await prisma.kycReview.create({
        data: {
          clientId,
          requirement: input.requirement,
          documentRef: input.documentRef ?? "dashboard-upload.pdf",
          status: "IN_REVIEW",
          decisionNote: "Client submitted documents from dashboard."
        }
      });

  await notifyClient({
    clientId,
    category: "KYC",
    title: "KYC submitted",
    body: "Compliance has received your verification documents for review."
  });

  return ok(res, review);
}));

clientPortalRouter.post("/investments", asyncHandler(async (req, res) => {
  const input = investmentSchema.parse(req.body);
  const clientId = activeClientId(req);
  const product = await prisma.portfolioProduct.findFirst({
    where: input.productId ? { id: input.productId } : { name: input.productName ?? "Balanced Growth" }
  });
  if (!product || product.status === "HIDDEN") throw new ApiError(404, "Portfolio product not found");

  const amount = input.amount ?? money(product.minimum);
  const wallet = await prisma.walletAccount.findUnique({ where: { clientId } });
  if (!wallet || money(wallet.available) < amount) {
    throw new ApiError(400, "Insufficient available wallet balance for this subscription");
  }

  const investment = await prisma.$transaction(async (tx) => {
    const created = await tx.clientInvestment.create({
      data: {
        clientId,
        productId: product.id,
        investedAmount: amount,
        currentValue: amount,
        status: "ACTIVE",
        nextAction: "Monitor performance and next payout window"
      },
      include: { product: true }
    });

    await tx.walletAccount.update({
      where: { id: wallet.id },
      data: {
        balance: { decrement: amount },
        available: { decrement: amount }
      }
    });

    await tx.walletTransaction.create({
      data: {
        walletId: wallet.id,
        type: "PORTFOLIO_SUBSCRIPTION",
        amount,
        reference: product.name,
        status: "APPROVED",
        memo: "Portfolio subscription"
      }
    });

    return created;
  });

  await notifyClient({
    clientId,
    category: "Investment",
    title: "Portfolio subscription active",
    body: `${product.name} has been added to your active investments.`
  });

  return ok(res, investment, 201);
}));

clientPortalRouter.post("/support/tickets", asyncHandler(async (req, res) => {
  const input = ticketSchema.parse(req.body);
  const clientId = activeClientId(req);
  const ticket = await prisma.supportTicket.create({
    data: {
      ticketNo: reference("BP"),
      clientId,
      subject: input.subject,
      priority: input.priority,
      status: "OPEN"
    }
  });
  return ok(res, ticket, 201);
}));
