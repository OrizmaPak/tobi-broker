-- CreateEnum
CREATE TYPE "AdminRole" AS ENUM ('SUPER_ADMIN', 'COMPLIANCE', 'FINANCE', 'PORTFOLIO_MANAGER', 'SUPPORT', 'AUDITOR');

-- CreateEnum
CREATE TYPE "ClientStatus" AS ENUM ('ACTIVE', 'PENDING', 'RESTRICTED', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "KycStatus" AS ENUM ('NOT_STARTED', 'PENDING', 'IN_REVIEW', 'APPROVED', 'REJECTED', 'RESUBMISSION_REQUIRED');

-- CreateEnum
CREATE TYPE "MoneyStatus" AS ENUM ('PENDING', 'IN_REVIEW', 'APPROVED', 'CONFIRMED', 'CREDITED', 'FLAGGED', 'HELD', 'REJECTED', 'BLOCKED');

-- CreateEnum
CREATE TYPE "RiskLevel" AS ENUM ('LOW', 'MODERATE', 'HIGH', 'CUSTOM');

-- CreateEnum
CREATE TYPE "ProductStatus" AS ENUM ('DRAFT', 'REVIEW', 'PUBLISHED', 'HIDDEN');

-- CreateEnum
CREATE TYPE "InvestmentStatus" AS ENUM ('PENDING', 'ACTIVE', 'REVIEW', 'EXIT_REQUESTED', 'CLOSED');

-- CreateEnum
CREATE TYPE "TicketStatus" AS ENUM ('OPEN', 'AWAITING_BROKER', 'AWAITING_CLIENT', 'ESCALATED', 'RESOLVED');

-- CreateTable
CREATE TABLE "AdminUser" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "AdminRole" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Client" (
    "id" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "status" "ClientStatus" NOT NULL DEFAULT 'PENDING',
    "riskLevel" "RiskLevel" NOT NULL DEFAULT 'MODERATE',
    "tier" TEXT NOT NULL DEFAULT 'Standard',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClientNote" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClientNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KycReview" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "requirement" TEXT NOT NULL,
    "documentRef" TEXT,
    "status" "KycStatus" NOT NULL DEFAULT 'PENDING',
    "reviewer" TEXT,
    "decisionNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KycReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WalletAccount" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "balance" DECIMAL(18,2) NOT NULL,
    "available" DECIMAL(18,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WalletAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WalletTransaction" (
    "id" TEXT NOT NULL,
    "walletId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "amount" DECIMAL(18,2) NOT NULL,
    "reference" TEXT NOT NULL,
    "status" "MoneyStatus" NOT NULL,
    "memo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WalletTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Deposit" (
    "id" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "rail" TEXT NOT NULL,
    "amount" DECIMAL(18,2) NOT NULL,
    "received" DECIMAL(18,2),
    "status" "MoneyStatus" NOT NULL DEFAULT 'PENDING',
    "reviewNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Deposit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Withdrawal" (
    "id" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "amount" DECIMAL(18,2) NOT NULL,
    "status" "MoneyStatus" NOT NULL DEFAULT 'PENDING',
    "reviewNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Withdrawal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PortfolioProduct" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "riskLevel" "RiskLevel" NOT NULL,
    "minimum" DECIMAL(18,2) NOT NULL,
    "payoutRule" TEXT NOT NULL,
    "status" "ProductStatus" NOT NULL DEFAULT 'DRAFT',
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PortfolioProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClientInvestment" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "investedAmount" DECIMAL(18,2) NOT NULL,
    "currentValue" DECIMAL(18,2) NOT NULL,
    "status" "InvestmentStatus" NOT NULL DEFAULT 'PENDING',
    "nextAction" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClientInvestment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payout" (
    "id" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "amount" DECIMAL(18,2) NOT NULL,
    "mode" TEXT NOT NULL,
    "status" "MoneyStatus" NOT NULL DEFAULT 'PENDING',
    "payoutDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payout_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Instrument" (
    "id" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "market" TEXT NOT NULL,
    "riskLevel" "RiskLevel" NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Instrument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupportTicket" (
    "id" TEXT NOT NULL,
    "ticketNo" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "owner" TEXT,
    "status" "TicketStatus" NOT NULL DEFAULT 'OPEN',
    "priority" TEXT NOT NULL DEFAULT 'Normal',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SupportTicket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "clientId" TEXT,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReportExport" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "format" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReportExport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "actorId" TEXT,
    "actorName" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Client_accountNumber_key" ON "Client"("accountNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Client_email_key" ON "Client"("email");

-- CreateIndex
CREATE UNIQUE INDEX "WalletAccount_clientId_key" ON "WalletAccount"("clientId");

-- CreateIndex
CREATE UNIQUE INDEX "Deposit_reference_key" ON "Deposit"("reference");

-- CreateIndex
CREATE UNIQUE INDEX "Withdrawal_reference_key" ON "Withdrawal"("reference");

-- CreateIndex
CREATE UNIQUE INDEX "PortfolioProduct_name_key" ON "PortfolioProduct"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Payout_reference_key" ON "Payout"("reference");

-- CreateIndex
CREATE UNIQUE INDEX "Instrument_symbol_key" ON "Instrument"("symbol");

-- CreateIndex
CREATE UNIQUE INDEX "SupportTicket_ticketNo_key" ON "SupportTicket"("ticketNo");

-- AddForeignKey
ALTER TABLE "ClientNote" ADD CONSTRAINT "ClientNote_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KycReview" ADD CONSTRAINT "KycReview_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WalletAccount" ADD CONSTRAINT "WalletAccount_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WalletTransaction" ADD CONSTRAINT "WalletTransaction_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "WalletAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deposit" ADD CONSTRAINT "Deposit_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Withdrawal" ADD CONSTRAINT "Withdrawal_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientInvestment" ADD CONSTRAINT "ClientInvestment_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientInvestment" ADD CONSTRAINT "ClientInvestment_productId_fkey" FOREIGN KEY ("productId") REFERENCES "PortfolioProduct"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payout" ADD CONSTRAINT "Payout_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupportTicket" ADD CONSTRAINT "SupportTicket_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "AdminUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;
