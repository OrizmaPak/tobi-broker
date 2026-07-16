import bcrypt from "bcryptjs";
import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seedAdminUsers(passwordHash: string) {
  const admins = [
    ["Operations Admin", "admin@bullport.local", "SUPER_ADMIN"],
    ["Finance Checker", "finance@bullport.local", "FINANCE"],
    ["Portfolio Manager", "portfolio@bullport.local", "PORTFOLIO_MANAGER"],
    ["Compliance Officer", "compliance@bullport.local", "COMPLIANCE"]
  ] as const;
  for (const [name, email, role] of admins) {
    await prisma.adminUser.upsert({ where: { email }, update: { name, role, isActive: true }, create: { name, email, passwordHash, role } });
  }
}

async function seedClients(passwordHash: string) {
  const clients = [
    ["BP-447215", "Tobi Adeyemi", "tobi.adeyemi@example.com", "Premium Managed", "MODERATE", "Nigeria"],
    ["BP-447216", "Amara Okafor", "amara.okafor@example.com", "Balanced Growth", "MODERATE", "Nigeria"],
    ["BP-447217", "Nosa Bello", "nosa.bello@example.com", "Dividend Income", "LOW", "United Kingdom"],
    ["BP-447218", "Ife Martins", "ife.martins@example.com", "Equity Growth", "HIGH", "Nigeria"],
    ["BP-447219", "Musa Danladi", "musa.danladi@example.com", "Premium Managed", "CUSTOM", "Nigeria"]
  ] as const;
  for (const [accountNumber, name, email, tier, riskLevel, country] of clients) {
    const client = await prisma.client.upsert({
      where: { accountNumber },
      update: { name, email, tier, riskLevel, country, status: "ACTIVE", passwordHash, emailVerifiedAt: new Date() },
      create: { accountNumber, name, email, passwordHash, tier, riskLevel, country, status: "ACTIVE", emailVerifiedAt: new Date(), preferences: { emailNotifications: true, inAppNotifications: true, marketAlerts: true } }
    });
    await prisma.walletAccount.upsert({ where: { clientId: client.id }, update: {}, create: { clientId: client.id, balance: 18_420, available: 17_920, held: 500 } });
    const existingKyc = await prisma.kycCase.findFirst({ where: { clientId: client.id } });
    if (existingKyc) {
      await prisma.kycCase.update({ where: { id: existingKyc.id }, data: { status: "APPROVED", approvedAt: new Date(), expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), assignedReviewer: "Compliance Officer" } });
    } else {
      await prisma.kycCase.create({ data: { clientId: client.id, status: "APPROVED", submittedAt: new Date(), approvedAt: new Date(), expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), assignedReviewer: "Compliance Officer", suitabilityScore: riskLevel === "HIGH" ? 82 : 68 } });
    }
    const legacyKyc = await prisma.kycReview.findFirst({ where: { clientId: client.id } });
    if (legacyKyc) await prisma.kycReview.update({ where: { id: legacyKyc.id }, data: { status: "APPROVED", reviewer: "Compliance Officer", decisionNote: "Approved seeded client" } });
    else await prisma.kycReview.create({ data: { clientId: client.id, requirement: "Identity and address verification", status: "APPROVED", reviewer: "Compliance Officer", decisionNote: "Approved seeded client" } });
  }
}

async function seedProductsAndInstruments() {
  const products = [
    ["Conservative Income", "LOW", 1_000, "Monthly", 6.8, 9.4],
    ["Balanced Growth", "MODERATE", 2_500, "Quarterly", 10.5, 14.8],
    ["Commodity Opportunity", "HIGH", 5_000, "Quarterly", 12.2, 18.9],
    ["Dividend Income", "MODERATE", 3_500, "Monthly / quarterly", 8.9, 13.1],
    ["Equity Growth", "HIGH", 4_000, "Optional", 14.4, 21.6],
    ["Premium Managed", "CUSTOM", 25_000, "Custom", 0, 0]
  ] as const;
  for (const [name, riskLevel, minimum, payoutRule, projectedReturnMin, projectedReturnMax] of products) {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const product = await prisma.portfolioProduct.upsert({
      where: { name },
      update: { slug, riskLevel, minimum, payoutRule, projectedReturnMin, projectedReturnMax, status: "PUBLISHED", publishedAt: new Date(), disclosure: "Returns are projected and market-based. Capital and income are not guaranteed." },
      create: { name, slug, riskLevel, minimum, payoutRule, projectedReturnMin, projectedReturnMax, status: "PUBLISHED", publishedAt: new Date(), description: `${name} broker-managed portfolio product.`, disclosure: "Returns are projected and market-based. Capital and income are not guaranteed." }
    });
    const version = await prisma.portfolioProductVersion.findUnique({ where: { productId_version: { productId: product.id, version: product.version } } });
    if (!version) await prisma.portfolioProductVersion.create({ data: { productId: product.id, version: product.version, terms: { name, riskLevel, minimum, payoutRule, projectedReturnMin, projectedReturnMax }, status: "PUBLISHED", createdBy: "seed", approvedBy: "seed", publishedAt: new Date() } });
  }

  const instruments = [
    ["AAPL", "Apple Inc.", "Stocks", "NASDAQ", "MODERATE", 213.8, true, true],
    ["SPY", "SPDR S&P 500 ETF", "ETFs", "NYSE Arca", "MODERATE", 564.12, true, true],
    ["US10Y", "US Treasury 10Y", "Bonds", "Treasury", "LOW", 99.14, false, true],
    ["XAUUSD", "Gold Spot", "Commodities", "OTC", "MODERATE", 2_421.7, true, true],
    ["VNQ", "Vanguard Real Estate ETF", "REITs", "NYSE Arca", "MODERATE", 88.42, true, true],
    ["NDX", "Nasdaq 100 Index", "Indices", "NASDAQ", "HIGH", 20_115.3, false, true],
    ["SPX-CALL", "S&P 500 Call Strategy", "Options", "CBOE", "HIGH", 41.18, true, false]
  ] as const;
  for (const [symbol, name, category, market, riskLevel, currentPrice, tradable, investable] of instruments) {
    const instrument = await prisma.instrument.upsert({
      where: { symbol },
      update: { name, category, market, riskLevel, currentPrice, tradable, investable, status: "ACTIVE", priceAsOf: new Date(), priceSource: "Admin managed" },
      create: { symbol, name, category, market, riskLevel, currentPrice, tradable, investable, status: "ACTIVE", priceAsOf: new Date(), priceSource: "Admin managed", dividendEligible: ["AAPL", "SPY", "VNQ"].includes(symbol) }
    });
    const price = await prisma.priceSnapshot.findFirst({ where: { instrumentId: instrument.id } });
    if (!price) await prisma.priceSnapshot.create({ data: { instrumentId: instrument.id, price: currentPrice, currency: "USD", source: "Admin managed seed", asOf: new Date() } });
  }

  const allocationsByProduct: Record<string, Array<[string, number]>> = {
    "Conservative Income": [["US10Y", 60], ["SPY", 20], ["VNQ", 20]],
    "Balanced Growth": [["SPY", 35], ["US10Y", 25], ["VNQ", 20], ["XAUUSD", 10], ["AAPL", 10]],
    "Commodity Opportunity": [["XAUUSD", 60], ["SPY", 15], ["US10Y", 15], ["VNQ", 10]],
    "Dividend Income": [["VNQ", 35], ["SPY", 30], ["US10Y", 25], ["AAPL", 10]],
    "Equity Growth": [["SPY", 45], ["AAPL", 30], ["NDX", 25]],
    "Premium Managed": [["SPY", 25], ["US10Y", 20], ["AAPL", 15], ["XAUUSD", 15], ["VNQ", 15], ["NDX", 10]]
  };
  const allocationInstruments = await prisma.instrument.findMany({ where: { symbol: { in: [...new Set(Object.values(allocationsByProduct).flat().map(([symbol]) => symbol))] } } });
  const allProducts = await prisma.portfolioProduct.findMany();
  for (const product of allProducts) {
    const existing = await prisma.portfolioAllocation.count({ where: { productId: product.id, effectiveTo: null } });
    if (!existing) {
      await prisma.portfolioAllocation.createMany({ data: (allocationsByProduct[product.name] || []).map(([symbol, targetWeight]) => ({ productId: product.id, instrumentId: allocationInstruments.find((item) => item.symbol === symbol)!.id, targetWeight })) });
    }
    const fees = await prisma.feeRule.count({ where: { productId: product.id, active: true } });
    if (!fees) await prisma.feeRule.create({ data: { productId: product.id, name: "Annual management fee", type: "MANAGEMENT", rate: product.name === "Premium Managed" ? 0.015 : 0.01, currency: "USD", appliesTo: "Average managed portfolio value" } });
  }
}

async function seedLedger() {
  const clearing = await prisma.ledgerAccount.upsert({ where: { code: "PLATFORM-CLEARING-USD" }, update: {}, create: { code: "PLATFORM-CLEARING-USD", name: "Platform USD clearing", kind: "PLATFORM_CLEARING", currency: "USD", balance: 0, available: 0 } });
  await prisma.ledgerAccount.upsert({ where: { code: "PLATFORM-FEES-USD" }, update: {}, create: { code: "PLATFORM-FEES-USD", name: "Platform USD fees", kind: "PLATFORM_FEES", currency: "USD", balance: 0, available: 0 } });
  await prisma.ledgerAccount.upsert({ where: { code: "PLATFORM-REVENUE-USD" }, update: {}, create: { code: "PLATFORM-REVENUE-USD", name: "Platform USD revenue", kind: "PLATFORM_REVENUE", currency: "USD", balance: 0, available: 0 } });
  const wallets = await prisma.walletAccount.findMany({ include: { client: true } });
  for (const wallet of wallets) {
    const cash = await prisma.ledgerAccount.upsert({
      where: { code: `CLIENT-${wallet.client.accountNumber}-USD-CASH` },
      update: {},
      create: { walletId: wallet.id, code: `CLIENT-${wallet.client.accountNumber}-USD-CASH`, name: `${wallet.client.name} USD cash`, kind: "CLIENT_CASH", currency: "USD", balance: wallet.balance, available: wallet.available }
    });
    const existing = await prisma.ledgerTransaction.findUnique({ where: { reference: `OPEN-${wallet.client.accountNumber}` } });
    if (!existing && wallet.balance.isPositive()) {
      await prisma.ledgerTransaction.create({
        data: {
          reference: `OPEN-${wallet.client.accountNumber}`, clientId: wallet.clientId, type: "OPENING_BALANCE", status: "POSTED", currency: "USD", description: "Opening wallet balance", postedAt: new Date(),
          entries: { create: [{ accountId: cash.id, side: "DEBIT", amount: wallet.balance, currency: "USD" }, { accountId: clearing.id, side: "CREDIT", amount: wallet.balance, currency: "USD" }] }
        }
      });
    }
  }
  const total = wallets.reduce((sum, wallet) => sum.plus(wallet.balance), new Prisma.Decimal(0));
  await prisma.ledgerAccount.update({ where: { id: clearing.id }, data: { balance: total.negated() } });
}

async function seedWorkflows() {
  const tobi = await prisma.client.findUniqueOrThrow({ where: { accountNumber: "BP-447215" } });
  const nosa = await prisma.client.findUniqueOrThrow({ where: { accountNumber: "BP-447217" } });
  const premium = await prisma.portfolioProduct.findUniqueOrThrow({ where: { name: "Premium Managed" } });
  const aapl = await prisma.instrument.findUniqueOrThrow({ where: { symbol: "AAPL" } });

  const beneficiary = await prisma.beneficiary.findFirst({ where: { clientId: tobi.id, label: "Primary bank account" } });
  if (!beneficiary) await prisma.beneficiary.create({ data: { clientId: tobi.id, type: "BANK", label: "Primary bank account", currency: "USD", bankName: "BullPort Settlement Bank", accountName: tobi.name, accountNumberMasked: "****2014", accountToken: "seed-token", status: "VERIFIED", verifiedAt: new Date(), cooldownUntil: new Date(0) } });

  const investment = await prisma.clientInvestment.findFirst({ where: { clientId: tobi.id, productId: premium.id } });
  if (investment) await prisma.clientInvestment.update({ where: { id: investment.id }, data: { investedAmount: 42_000, currentValue: 47_180, units: 42_000, status: "ACTIVE", nextAction: "Monitor the next payout window" } });
  else await prisma.clientInvestment.create({ data: { clientId: tobi.id, productId: premium.id, investedAmount: 42_000, currentValue: 47_180, units: 42_000, status: "ACTIVE", projectedReturnLabel: "Projected, market-based performance", nextAction: "Monitor the next payout window", transactions: { create: { reference: "INV-SEED-447215", type: "OPENING_SUBSCRIPTION", amount: 42_000, units: 42_000, unitPrice: 1 } }, valuations: { create: { value: 47_180, unitPrice: new Prisma.Decimal(47_180).div(42_000), source: "Seed valuation", asOf: new Date() } } } });

  const optionApplication = await prisma.optionsApplication.findFirst({ where: { clientId: tobi.id } });
  if (!optionApplication) await prisma.optionsApplication.create({ data: { clientId: tobi.id, status: "APPROVED", score: 84, questionnaire: { experience: "Advanced", objective: "Hedging" }, disclosureAcceptedAt: new Date(), reviewerId: "seed", decisionNote: "Approved seeded options access", decidedAt: new Date() } });
  await prisma.optionContract.upsert({ where: { symbol: "AAPL-20261218-C-250" }, update: {}, create: { symbol: "AAPL-20261218-C-250", underlyingInstrumentId: aapl.id, type: "CALL", strike: 250, expiry: new Date("2026-12-18T21:00:00.000Z"), premium: 9.25, status: "ACTIVE" } });

  await prisma.deposit.upsert({ where: { reference: "DEP-9013" }, update: {}, create: { reference: "DEP-9013", clientId: tobi.id, method: "CRYPTO", rail: "TRC20", amount: 3_500, received: 3_500, status: "IN_REVIEW", transactionHash: "seed-trc20-transaction" } });
  await prisma.withdrawal.upsert({ where: { reference: "WDR-3381" }, update: {}, create: { reference: "WDR-3381", clientId: nosa.id, destination: "Verified bank account", amount: 2_400, netAmount: 2_400, status: "IN_REVIEW" } });
  await prisma.payout.upsert({ where: { reference: "PAY-7721" }, update: {}, create: { clientId: tobi.id, reference: "PAY-7721", source: "Premium Managed", amount: 1_280, mode: "Wallet", status: "CREDITED", payoutDate: new Date("2026-07-12T09:00:00.000Z") } });
  const report = await prisma.reportExport.findFirst({ where: { name: "June 2026 account statement", clientId: tobi.id } });
  if (!report) await prisma.reportExport.create({ data: { clientId: tobi.id, name: "June 2026 account statement", type: "ACCOUNT_STATEMENT", format: "CSV", period: "June 2026", status: "READY", completedAt: new Date() } });
  await prisma.supportTicket.upsert({ where: { ticketNo: "BP-1208" }, update: {}, create: { ticketNo: "BP-1208", clientId: nosa.id, subject: "Withdrawal timing clarification", category: "Wallet", description: "Please confirm the expected settlement window.", owner: "Finance", status: "AWAITING_BROKER", priority: "High", messages: { create: { authorType: "CLIENT", authorId: nosa.id, body: "Please confirm the expected settlement window." } } } });
}

async function seedSettings() {
  await prisma.systemSetting.upsert({ where: { key: "platform.baseCurrency" }, update: { value: "USD" }, create: { key: "platform.baseCurrency", value: "USD", description: "Canonical accounting currency" } });
  await prisma.systemSetting.upsert({ where: { key: "platform.capabilities" }, update: {}, create: { key: "platform.capabilities", value: { cardFunding: false, bankFunding: true, cryptoFunding: true, internalOrderDesk: true, liveExchangeExecution: false, marketPriceMode: "admin-managed" }, description: "Client-visible capability switches" } });
  await prisma.systemSetting.upsert({ where: { key: "operations.approvals" }, update: {}, create: { key: "operations.approvals", value: { makerChecker: true, withdrawals: true, depositCredits: true, distributions: true, productPublishing: true, ledgerAdjustments: true }, description: "Sensitive operation approval policy" } });
  const rules = [
    ["KYC_REQUIRED", "KYC required for restricted actions", "Client", "HIGH"],
    ["LARGE_WITHDRAWAL", "Large withdrawal review", "Withdrawal", "HIGH"],
    ["OPTIONS_ELIGIBILITY", "Options eligibility required", "Options", "CRITICAL"]
  ] as const;
  for (const [code, name, category, severity] of rules) {
    await prisma.riskRule.upsert({ where: { code }, update: {}, create: { code, name, category, severity, description: name, conditions: {}, action: { createAlert: true } } });
  }
}

async function main() {
  if (process.env.NODE_ENV === "production" && process.env.ALLOW_DEMO_SEED !== "true") throw new Error("Demo seed is disabled in production");
  const adminPassword = await bcrypt.hash("AdminPass123!", 12);
  const clientPassword = await bcrypt.hash("ClientPass123!", 12);
  await seedAdminUsers(adminPassword);
  await seedClients(clientPassword);
  await seedProductsAndInstruments();
  await seedLedger();
  await seedWorkflows();
  await seedSettings();
  const existingAudit = await prisma.auditLog.findFirst({ where: { action: "seedDemoData" } });
  if (!existingAudit) await prisma.auditLog.create({ data: { actorName: "System", action: "seedDemoData", entityType: "System", metadata: { source: "prisma/seed.ts" } } });
}

main().then(() => prisma.$disconnect()).catch(async (error) => {
  console.error(error);
  await prisma.$disconnect();
  process.exit(1);
});
