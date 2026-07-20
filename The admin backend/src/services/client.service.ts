import { Prisma } from "@prisma/client";
import { ApiError } from "../lib/http";
import { prisma } from "../lib/prisma";
import { clientVisibleDepositMethods, getDepositMethodsSetting } from "./deposit-method.service";
import { clientVisibleWithdrawalMethods, getWithdrawalMethodsSetting } from "./withdrawal-method.service";

export function money(value: unknown) {
  return Number(value ?? 0);
}

export function displayStatus(value?: string | null) {
  if (!value) return "Not started";
  return value.toLowerCase().split("_").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
}

function portfolioMetricInvestment(status: string) {
  return !["CANCELLED", "CLOSED"].includes(status);
}

export async function approvedKyc(clientId: string) {
  const now = new Date();
  const [kycCase, legacy] = await Promise.all([
    prisma.kycCase.findFirst({ where: { clientId, status: "APPROVED", OR: [{ expiresAt: null }, { expiresAt: { gt: now } }] } }),
    prisma.kycReview.findFirst({ where: { clientId, status: "APPROVED" } })
  ]);
  return Boolean(kycCase || legacy);
}

export async function clientDashboard(clientId: string) {
  const client = await prisma.client.findUnique({
    where: { id: clientId },
    include: {
      wallet: {
        include: {
          ledgerAccounts: {
            where: { kind: "CLIENT_CASH" },
            include: { entries: { include: { transaction: true }, orderBy: { createdAt: "desc" }, take: 12 } }
          },
          holds: { where: { status: "ACTIVE" }, orderBy: { createdAt: "desc" }, take: 10 }
        }
      },
      kycCases: { orderBy: { updatedAt: "desc" }, take: 3 },
      kycReviews: { orderBy: { updatedAt: "desc" }, take: 3 },
      deposits: { orderBy: { createdAt: "desc" }, take: 10 },
      withdrawals: { orderBy: { createdAt: "desc" }, take: 10 },
      beneficiaries: { orderBy: { createdAt: "desc" } },
      investments: { include: { product: true }, orderBy: { updatedAt: "desc" } },
      payouts: { orderBy: { payoutDate: "desc" }, take: 12 },
      distributionItems: { include: { batch: true }, orderBy: { createdAt: "desc" }, take: 20 },
      notifications: { where: { recipientType: "CLIENT" }, orderBy: { createdAt: "desc" }, take: 12 },
      riskAlerts: { where: { status: { in: ["OPEN", "IN_REVIEW"] } }, orderBy: [{ severity: "desc" }, { createdAt: "desc" }], take: 10 }
    }
  });
  if (!client) throw new ApiError(404, "Client was not found", "CLIENT_NOT_FOUND");

  const cashAccount = client.wallet?.ledgerAccounts[0];
  const transactions = (cashAccount?.entries || []).map((entry) => ({
    id: entry.transaction.id,
    date: entry.transaction.postedAt || entry.transaction.createdAt,
    type: displayStatus(entry.transaction.type),
    reference: entry.transaction.reference,
    amount: entry.side === "DEBIT" ? money(entry.amount) : -money(entry.amount),
    currency: entry.currency,
    status: displayStatus(entry.transaction.status),
    source: entry.transaction.description
  }));
  const pendingDepositStates = ["PENDING", "IN_REVIEW", "UNDER_REVIEW", "AWAITING_APPROVAL"];
  const pendingWithdrawalStates = ["PENDING", "REQUESTED", "IN_REVIEW", "UNDER_REVIEW", "AWAITING_APPROVAL", "APPROVED", "PROCESSING", "HELD"];
  const metricInvestments = client.investments.filter((item) => portfolioMetricInvestment(item.status));
  const totalPortfolioValue = metricInvestments.reduce((sum, item) => sum + money(item.currentValue), 0);
  const totalInvested = metricInvestments.reduce((sum, item) => sum + money(item.investedAmount), 0);
  const totalDividends = client.distributionItems.filter((item) => item.batch.type === "DIVIDEND" && item.status === "POSTED").reduce((sum, item) => sum + money(item.netAmount), 0);
  const totalProfits = client.distributionItems.filter((item) => item.batch.type === "PROFIT" && item.status === "POSTED").reduce((sum, item) => sum + money(item.netAmount), 0);
  const nextPayout = client.payouts.filter((item) => item.payoutDate >= new Date()).sort((a, b) => a.payoutDate.getTime() - b.payoutDate.getTime())[0];
  const approvedCase = client.kycCases.find((item) => item.status === "APPROVED" && (!item.expiresAt || item.expiresAt > new Date()));
  const approvedLegacy = client.kycReviews.find((item) => item.status === "APPROVED");
  const kycStatus = approvedCase?.status || approvedLegacy?.status || client.kycCases[0]?.status || client.kycReviews[0]?.status || "NOT_STARTED";
  const [depositMethods, withdrawalMethods] = await Promise.all([
    getDepositMethodsSetting(),
    getWithdrawalMethodsSetting()
  ]);

  return {
    client: {
      id: client.id,
      accountNumber: client.accountNumber,
      name: client.name,
      email: client.email,
      phone: client.phone,
      status: client.status,
      riskLevel: displayStatus(client.riskLevel),
      tier: client.tier,
      country: client.country,
      baseCurrency: client.baseCurrency,
      emailVerified: true,
      kycStatus: displayStatus(kycStatus),
      suitabilityScore: client.suitabilityScore,
      preferences: client.preferences,
      lastLoginAt: client.lastLoginAt
    },
    metrics: {
      walletBalance: money(cashAccount?.available ?? client.wallet?.available),
      walletTotal: money(cashAccount?.balance ?? client.wallet?.balance),
      walletReserved: money(client.wallet?.held),
      totalPortfolioValue,
      totalInvested,
      activeInvestments: client.investments.filter((item) => item.status === "ACTIVE").length,
      totalDividends,
      totalProfits,
      profitLoss: totalPortfolioValue - totalInvested,
      pendingDeposits: client.deposits.filter((item) => pendingDepositStates.includes(item.status)).reduce((sum, item) => sum + money(item.amount), 0),
      pendingWithdrawals: client.withdrawals.filter((item) => pendingWithdrawalStates.includes(item.status)).reduce((sum, item) => sum + money(item.amount), 0),
      nextPayoutDate: nextPayout?.payoutDate || null,
      profileCompletion: kycStatus === "APPROVED" ? 100 : 65,
      openRiskAlerts: client.riskAlerts.length
    },
    wallet: client.wallet,
    transactions,
    deposits: client.deposits,
    withdrawals: client.withdrawals,
    beneficiaries: client.beneficiaries,
    kycCases: client.kycCases,
    kycReviews: client.kycReviews,
    investments: client.investments,
    payouts: client.payouts,
    distributions: client.distributionItems,
    notifications: client.notifications,
    riskAlerts: client.riskAlerts,
    depositMethods: clientVisibleDepositMethods(depositMethods),
    withdrawalMethods: clientVisibleWithdrawalMethods(withdrawalMethods)
  };
}

export async function clientSnapshot(clientId: string) {
  const client = await prisma.client.findUnique({
    where: { id: clientId },
    include: {
      wallet: {
        include: {
          ledgerAccounts: {
            where: { kind: "CLIENT_CASH" },
            include: { entries: { include: { transaction: true }, orderBy: { createdAt: "desc" }, take: 50 } }
          },
          holds: { orderBy: { createdAt: "desc" }, take: 20 }
        }
      },
      kycCases: { include: { documents: true, checks: true, decisions: { orderBy: { createdAt: "desc" } } }, orderBy: { updatedAt: "desc" }, take: 3 },
      kycReviews: { orderBy: { updatedAt: "desc" }, take: 3 },
      deposits: { orderBy: { createdAt: "desc" }, take: 50 },
      withdrawals: { orderBy: { createdAt: "desc" }, take: 50 },
      beneficiaries: { orderBy: { createdAt: "desc" } },
      investments: {
        include: {
          product: true,
          valuations: { orderBy: { asOf: "desc" }, take: 12 },
          holdings: { include: { instrument: true } },
          transactions: { orderBy: { createdAt: "desc" }, take: 20 }
        },
        orderBy: { updatedAt: "desc" }
      },
      payouts: { orderBy: { payoutDate: "desc" }, take: 50 },
      distributionItems: { include: { batch: true }, orderBy: { createdAt: "desc" }, take: 50 },
      watchlist: { include: { instrument: true }, orderBy: { createdAt: "desc" } },
      orders: { include: { instrument: true, fills: true }, orderBy: { submittedAt: "desc" }, take: 50 },
      positions: { include: { instrument: true }, orderBy: { marketValue: "desc" } },
      optionsApplications: { orderBy: { updatedAt: "desc" }, take: 1 },
      riskAlerts: { where: { status: { in: ["OPEN", "IN_REVIEW"] } }, orderBy: [{ severity: "desc" }, { createdAt: "desc" }] },
      tickets: { include: { messages: { orderBy: { createdAt: "asc" } } }, orderBy: { updatedAt: "desc" }, take: 30 },
      notifications: { where: { recipientType: "CLIENT" }, orderBy: { createdAt: "desc" }, take: 50 },
      reports: { orderBy: { createdAt: "desc" }, take: 50 }
    }
  });
  if (!client) throw new ApiError(404, "Client was not found", "CLIENT_NOT_FOUND");

  const [products, instruments, optionContracts, globalReports, capabilities, depositMethods, withdrawalMethods] = await Promise.all([
    prisma.portfolioProduct.findMany({
      where: { status: "PUBLISHED" },
      include: { allocations: { where: { effectiveTo: null }, include: { instrument: true } }, feeRules: { where: { active: true } } },
      orderBy: { minimum: "asc" }
    }),
    prisma.instrument.findMany({ where: { status: { notIn: ["INACTIVE", "SUSPENDED", "HIDDEN"] } }, orderBy: { symbol: "asc" } }),
    prisma.optionContract.findMany({ where: { status: "ACTIVE", expiry: { gt: new Date() } }, include: { underlying: true }, orderBy: { expiry: "asc" }, take: 50 }),
    prisma.reportExport.findMany({ where: { clientId: null }, orderBy: { createdAt: "desc" }, take: 20 }),
    prisma.systemSetting.findUnique({ where: { key: "platform.capabilities" } }),
    getDepositMethodsSetting(),
    getWithdrawalMethodsSetting()
  ]);

  const cashAccount = client.wallet?.ledgerAccounts[0];
  const ledgerTransactions = (cashAccount?.entries || []).map((entry) => ({
    id: entry.transaction.id,
    date: entry.transaction.postedAt || entry.transaction.createdAt,
    type: displayStatus(entry.transaction.type),
    reference: entry.transaction.reference,
    amount: entry.side === "DEBIT" ? money(entry.amount) : -money(entry.amount),
    currency: entry.currency,
    status: displayStatus(entry.transaction.status),
    source: entry.transaction.description
  }));

  const pendingDeposits = client.deposits.filter((item) => ["PENDING", "IN_REVIEW", "UNDER_REVIEW", "AWAITING_APPROVAL"].includes(item.status)).reduce((sum, item) => sum + money(item.amount), 0);
  const pendingWithdrawals = client.withdrawals.filter((item) => ["PENDING", "REQUESTED", "IN_REVIEW", "UNDER_REVIEW", "AWAITING_APPROVAL", "APPROVED", "PROCESSING", "HELD"].includes(item.status)).reduce((sum, item) => sum + money(item.amount), 0);
  const metricInvestments = client.investments.filter((item) => portfolioMetricInvestment(item.status));
  const totalPortfolioValue = metricInvestments.reduce((sum, item) => sum + money(item.currentValue), 0);
  const totalInvested = metricInvestments.reduce((sum, item) => sum + money(item.investedAmount), 0);
  const totalDividends = client.distributionItems.filter((item) => item.batch.type === "DIVIDEND" && item.status === "POSTED").reduce((sum, item) => sum + money(item.netAmount), 0);
  const totalProfits = client.distributionItems.filter((item) => item.batch.type === "PROFIT" && item.status === "POSTED").reduce((sum, item) => sum + money(item.netAmount), 0);
  const nextPayout = client.payouts.filter((item) => item.payoutDate >= new Date()).sort((a, b) => a.payoutDate.getTime() - b.payoutDate.getTime())[0];
  const approvedCase = client.kycCases.find((item) => item.status === "APPROVED" && (!item.expiresAt || item.expiresAt > new Date()));
  const approvedLegacy = client.kycReviews.find((item) => item.status === "APPROVED");
  const kycStatus = approvedCase?.status || approvedLegacy?.status || client.kycCases[0]?.status || client.kycReviews[0]?.status || "NOT_STARTED";

  return {
    client: {
      id: client.id,
      accountNumber: client.accountNumber,
      name: client.name,
      email: client.email,
      phone: client.phone,
      status: client.status,
      riskLevel: displayStatus(client.riskLevel),
      tier: client.tier,
      country: client.country,
      city: client.city,
      baseCurrency: client.baseCurrency,
      emailVerified: true,
      kycStatus: displayStatus(kycStatus),
      suitabilityScore: client.suitabilityScore,
      preferences: client.preferences,
      lastLoginAt: client.lastLoginAt
    },
    metrics: {
      walletBalance: money(cashAccount?.available ?? client.wallet?.available),
      walletTotal: money(cashAccount?.balance ?? client.wallet?.balance),
      walletReserved: money(client.wallet?.held),
      totalPortfolioValue,
      totalInvested,
      activeInvestments: client.investments.filter((item) => item.status === "ACTIVE").length,
      totalDividends,
      totalProfits,
      profitLoss: totalPortfolioValue - totalInvested,
      pendingDeposits,
      pendingWithdrawals,
      nextPayoutDate: nextPayout?.payoutDate || null,
      profileCompletion: kycStatus === "APPROVED" ? 100 : 65,
      openRiskAlerts: client.riskAlerts.length
    },
    wallet: client.wallet,
    transactions: ledgerTransactions,
    deposits: client.deposits,
    withdrawals: client.withdrawals,
    beneficiaries: client.beneficiaries,
    kycCases: client.kycCases,
    products,
    investments: client.investments,
    instruments,
    watchlist: client.watchlist,
    orders: client.orders,
    positions: client.positions,
    options: {
      status: client.optionsApplications[0]?.status || "NOT_APPLIED",
      application: client.optionsApplications[0] || null,
      contracts: optionContracts
    },
    payouts: client.payouts,
    distributions: client.distributionItems,
    riskAlerts: client.riskAlerts,
    notifications: client.notifications,
    reports: [...client.reports, ...globalReports],
    supportTickets: client.tickets,
    capabilities: capabilities?.value || null,
    depositMethods: clientVisibleDepositMethods(depositMethods),
    withdrawalMethods: clientVisibleWithdrawalMethods(withdrawalMethods)
  };
}
