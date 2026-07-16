-- CreateEnum
CREATE TYPE "ActorType" AS ENUM ('CLIENT', 'ADMIN', 'SYSTEM');

-- CreateEnum
CREATE TYPE "TokenPurpose" AS ENUM ('EMAIL_VERIFICATION', 'PASSWORD_RESET', 'MFA_RECOVERY');

-- CreateEnum
CREATE TYPE "LedgerAccountKind" AS ENUM ('CLIENT_CASH', 'CLIENT_INVESTMENT', 'CLIENT_HOLD', 'PLATFORM_CLEARING', 'PLATFORM_FEES', 'PLATFORM_REVENUE');

-- CreateEnum
CREATE TYPE "LedgerEntrySide" AS ENUM ('DEBIT', 'CREDIT');

-- CreateEnum
CREATE TYPE "LedgerTransactionType" AS ENUM ('OPENING_BALANCE', 'DEPOSIT', 'WITHDRAWAL', 'INVESTMENT_SUBSCRIPTION', 'INVESTMENT_EXIT', 'TRADE', 'DIVIDEND', 'PROFIT', 'FEE', 'ADJUSTMENT', 'REVERSAL');

-- CreateEnum
CREATE TYPE "LedgerTransactionStatus" AS ENUM ('PENDING', 'POSTED', 'REVERSED', 'FAILED');

-- CreateEnum
CREATE TYPE "HoldStatus" AS ENUM ('ACTIVE', 'RELEASED', 'CAPTURED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "BeneficiaryType" AS ENUM ('BANK', 'CRYPTO');

-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('PENDING', 'VERIFIED', 'REJECTED', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "ApprovalStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "OrderSide" AS ENUM ('BUY', 'SELL');

-- CreateEnum
CREATE TYPE "OrderType" AS ENUM ('MARKET', 'LIMIT', 'STOP', 'STOP_LIMIT');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING_REVIEW', 'APPROVED', 'PARTIALLY_FILLED', 'FILLED', 'SETTLED', 'CANCELLED', 'REJECTED', 'FAILED');

-- CreateEnum
CREATE TYPE "OptionType" AS ENUM ('CALL', 'PUT');

-- CreateEnum
CREATE TYPE "OptionsAccessStatus" AS ENUM ('NOT_APPLIED', 'PENDING', 'APPROVED', 'RESTRICTED', 'SUSPENDED', 'REJECTED');

-- CreateEnum
CREATE TYPE "DistributionType" AS ENUM ('DIVIDEND', 'PROFIT', 'INTEREST');

-- CreateEnum
CREATE TYPE "DistributionStatus" AS ENUM ('DRAFT', 'CALCULATED', 'PENDING_APPROVAL', 'APPROVED', 'POSTED', 'REVERSED', 'FAILED');

-- CreateEnum
CREATE TYPE "DistributionMode" AS ENUM ('WALLET', 'REINVEST');

-- CreateEnum
CREATE TYPE "DeliveryChannel" AS ENUM ('IN_APP', 'EMAIL');

-- CreateEnum
CREATE TYPE "DeliveryStatus" AS ENUM ('PENDING', 'SENT', 'FAILED', 'SKIPPED');

-- CreateEnum
CREATE TYPE "RiskAlertStatus" AS ENUM ('OPEN', 'IN_REVIEW', 'RESOLVED', 'DISMISSED');

-- CreateEnum
CREATE TYPE "Severity" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');

-- AlterTable
ALTER TABLE "AdminUser" ADD COLUMN     "failedLoginAttempts" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "lastLoginAt" TIMESTAMP(3),
ADD COLUMN     "lockedUntil" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "AuditLog" ADD COLUMN     "actorType" "ActorType" NOT NULL DEFAULT 'SYSTEM',
ADD COLUMN     "after" JSONB,
ADD COLUMN     "before" JSONB,
ADD COLUMN     "ipAddress" TEXT,
ADD COLUMN     "reason" TEXT,
ADD COLUMN     "requestId" TEXT,
ADD COLUMN     "userAgent" TEXT;

-- AlterTable
ALTER TABLE "Client" ADD COLUMN     "addressLine1" TEXT,
ADD COLUMN     "addressLine2" TEXT,
ADD COLUMN     "baseCurrency" TEXT NOT NULL DEFAULT 'USD',
ADD COLUMN     "city" TEXT,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "emailVerifiedAt" TIMESTAMP(3),
ADD COLUMN     "failedLoginAttempts" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "lastLoginAt" TIMESTAMP(3),
ADD COLUMN     "lockedUntil" TIMESTAMP(3),
ADD COLUMN     "phoneVerifiedAt" TIMESTAMP(3),
ADD COLUMN     "postalCode" TEXT,
ADD COLUMN     "preferences" JSONB,
ADD COLUMN     "riskQuestionnaire" JSONB,
ADD COLUMN     "state" TEXT,
ADD COLUMN     "suitabilityScore" INTEGER,
ADD COLUMN     "taxId" TEXT,
ADD COLUMN     "taxResidence" TEXT;

-- AlterTable
ALTER TABLE "ClientInvestment" ADD COLUMN     "closedAt" TIMESTAMP(3),
ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'USD',
ADD COLUMN     "maturityDate" TIMESTAMP(3),
ADD COLUMN     "productVersionId" TEXT,
ADD COLUMN     "projectedReturnLabel" TEXT,
ADD COLUMN     "reinvestPreference" "DistributionMode" NOT NULL DEFAULT 'WALLET',
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "units" DECIMAL(24,8) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Deposit" ADD COLUMN     "approvalRequestId" TEXT,
ADD COLUMN     "approvedAt" TIMESTAMP(3),
ADD COLUMN     "creditedAt" TIMESTAMP(3),
ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'USD',
ADD COLUMN     "evidenceFileId" TEXT,
ADD COLUMN     "externalReference" TEXT,
ADD COLUMN     "ledgerTransactionId" TEXT,
ADD COLUMN     "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "transactionHash" TEXT;

-- AlterTable
ALTER TABLE "Instrument" ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'USD',
ADD COLUMN     "currentPrice" DECIMAL(24,8),
ADD COLUMN     "dividendEligible" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "investable" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "priceAsOf" TIMESTAMP(3),
ADD COLUMN     "priceSource" TEXT,
ADD COLUMN     "suspendedReason" TEXT,
ADD COLUMN     "tradable" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "actionUrl" TEXT;

-- AlterTable
ALTER TABLE "Payout" ADD COLUMN     "distributionItemId" TEXT;

-- AlterTable
ALTER TABLE "PortfolioProduct" ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'USD',
ADD COLUMN     "disclosure" TEXT,
ADD COLUMN     "durationDays" INTEGER,
ADD COLUMN     "eligibility" JSONB,
ADD COLUMN     "projectedReturnMax" DECIMAL(8,4),
ADD COLUMN     "projectedReturnMin" DECIMAL(8,4),
ADD COLUMN     "publishedAt" TIMESTAMP(3),
ADD COLUMN     "slug" TEXT,
ADD COLUMN     "version" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "ReportExport" ADD COLUMN     "clientId" TEXT,
ADD COLUMN     "completedAt" TIMESTAMP(3),
ADD COLUMN     "error" TEXT,
ADD COLUMN     "fileUrl" TEXT,
ADD COLUMN     "filters" JSONB,
ADD COLUMN     "requestedBy" TEXT,
ADD COLUMN     "storageKey" TEXT;

-- AlterTable
ALTER TABLE "SupportTicket" ADD COLUMN     "category" TEXT NOT NULL DEFAULT 'General',
ADD COLUMN     "closedAt" TIMESTAMP(3),
ADD COLUMN     "description" TEXT;

-- AlterTable
ALTER TABLE "WalletAccount" ADD COLUMN     "held" DECIMAL(18,2) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Withdrawal" ADD COLUMN     "approvalRequestId" TEXT,
ADD COLUMN     "approvedAt" TIMESTAMP(3),
ADD COLUMN     "beneficiaryId" TEXT,
ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'USD',
ADD COLUMN     "externalReference" TEXT,
ADD COLUMN     "fee" DECIMAL(18,2) NOT NULL DEFAULT 0,
ADD COLUMN     "holdReference" TEXT,
ADD COLUMN     "ledgerTransactionId" TEXT,
ADD COLUMN     "netAmount" DECIMAL(18,2),
ADD COLUMN     "paidAt" TIMESTAMP(3),
ADD COLUMN     "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "AdminMfa" (
    "id" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "secretEncrypted" TEXT NOT NULL,
    "recoveryCodeHashes" JSONB NOT NULL,
    "enabledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdminMfa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuthSession" (
    "id" TEXT NOT NULL,
    "actorType" "ActorType" NOT NULL,
    "clientId" TEXT,
    "adminId" TEXT,
    "refreshTokenHash" TEXT NOT NULL,
    "csrfTokenHash" TEXT NOT NULL,
    "userAgent" TEXT,
    "ipAddress" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "lastUsedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revokedAt" TIMESTAMP(3),
    "rotatedFromId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuthSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "id" TEXT NOT NULL,
    "actorType" "ActorType" NOT NULL,
    "actorId" TEXT NOT NULL,
    "purpose" "TokenPurpose" NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VerificationToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LoginAttempt" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "actorType" "ActorType" NOT NULL,
    "ipAddress" TEXT,
    "succeeded" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LoginAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KycCase" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "status" "KycStatus" NOT NULL DEFAULT 'DRAFT',
    "level" TEXT NOT NULL DEFAULT 'Standard',
    "submittedAt" TIMESTAMP(3),
    "approvedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "assignedReviewer" TEXT,
    "riskQuestionnaire" JSONB,
    "suitabilityScore" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KycCase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KycDocument" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "storageKey" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "checksum" TEXT,
    "status" "VerificationStatus" NOT NULL DEFAULT 'PENDING',
    "rejectionNote" TEXT,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" TIMESTAMP(3),

    CONSTRAINT "KycDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KycCheck" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" "VerificationStatus" NOT NULL DEFAULT 'PENDING',
    "result" JSONB,
    "checkedBy" TEXT,
    "checkedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "KycCheck_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KycDecision" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "status" "KycStatus" NOT NULL,
    "reviewerId" TEXT NOT NULL,
    "note" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "KycDecision_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LedgerAccount" (
    "id" TEXT NOT NULL,
    "walletId" TEXT,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "kind" "LedgerAccountKind" NOT NULL,
    "currency" TEXT NOT NULL,
    "balance" DECIMAL(24,8) NOT NULL DEFAULT 0,
    "available" DECIMAL(24,8) NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LedgerAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LedgerTransaction" (
    "id" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "clientId" TEXT,
    "type" "LedgerTransactionType" NOT NULL,
    "status" "LedgerTransactionStatus" NOT NULL DEFAULT 'PENDING',
    "currency" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "idempotencyKey" TEXT,
    "externalReference" TEXT,
    "initiatedBy" TEXT,
    "approvedBy" TEXT,
    "metadata" JSONB,
    "postedAt" TIMESTAMP(3),
    "reversedTransactionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LedgerTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LedgerEntry" (
    "id" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "side" "LedgerEntrySide" NOT NULL,
    "amount" DECIMAL(24,8) NOT NULL,
    "currency" TEXT NOT NULL,
    "memo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LedgerEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WalletHold" (
    "id" TEXT NOT NULL,
    "walletId" TEXT NOT NULL,
    "ledgerAccountId" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "amount" DECIMAL(24,8) NOT NULL,
    "currency" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "status" "HoldStatus" NOT NULL DEFAULT 'ACTIVE',
    "expiresAt" TIMESTAMP(3),
    "releasedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WalletHold_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Beneficiary" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "type" "BeneficiaryType" NOT NULL,
    "label" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "bankName" TEXT,
    "accountName" TEXT,
    "accountNumberMasked" TEXT,
    "accountToken" TEXT,
    "cryptoNetwork" TEXT,
    "walletAddressMasked" TEXT,
    "walletAddressToken" TEXT,
    "status" "VerificationStatus" NOT NULL DEFAULT 'PENDING',
    "verifiedAt" TIMESTAMP(3),
    "cooldownUntil" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Beneficiary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentMethod" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "type" "BeneficiaryType" NOT NULL,
    "label" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "details" JSONB NOT NULL,
    "status" "VerificationStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaymentMethod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApprovalRequest" (
    "id" TEXT NOT NULL,
    "actionType" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "payload" JSONB,
    "payloadHash" TEXT NOT NULL,
    "status" "ApprovalStatus" NOT NULL DEFAULT 'PENDING',
    "initiatedByAdminId" TEXT NOT NULL,
    "approvedByAdminId" TEXT,
    "decisionNote" TEXT,
    "expiresAt" TIMESTAMP(3),
    "decidedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ApprovalRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IdempotencyRecord" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "actorId" TEXT NOT NULL,
    "route" TEXT NOT NULL,
    "requestHash" TEXT NOT NULL,
    "responseStatus" INTEGER NOT NULL,
    "responseBody" JSONB NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IdempotencyRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PortfolioProductVersion" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "terms" JSONB NOT NULL,
    "status" "ProductStatus" NOT NULL DEFAULT 'DRAFT',
    "createdBy" TEXT NOT NULL,
    "approvedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "publishedAt" TIMESTAMP(3),

    CONSTRAINT "PortfolioProductVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PortfolioAllocation" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "instrumentId" TEXT NOT NULL,
    "targetWeight" DECIMAL(8,4) NOT NULL,
    "minimumWeight" DECIMAL(8,4),
    "maximumWeight" DECIMAL(8,4),
    "effectiveFrom" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "effectiveTo" TIMESTAMP(3),

    CONSTRAINT "PortfolioAllocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeeRule" (
    "id" TEXT NOT NULL,
    "productId" TEXT,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "rate" DECIMAL(8,6),
    "flatAmount" DECIMAL(18,2),
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "appliesTo" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FeeRule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvestmentTransaction" (
    "id" TEXT NOT NULL,
    "investmentId" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "amount" DECIMAL(18,2) NOT NULL,
    "units" DECIMAL(24,8) NOT NULL DEFAULT 0,
    "unitPrice" DECIMAL(24,8) NOT NULL DEFAULT 1,
    "ledgerTransactionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InvestmentTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvestmentValuation" (
    "id" TEXT NOT NULL,
    "investmentId" TEXT NOT NULL,
    "value" DECIMAL(18,2) NOT NULL,
    "unitPrice" DECIMAL(24,8) NOT NULL,
    "source" TEXT NOT NULL,
    "asOf" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InvestmentValuation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvestmentHolding" (
    "id" TEXT NOT NULL,
    "investmentId" TEXT NOT NULL,
    "instrumentId" TEXT NOT NULL,
    "quantity" DECIMAL(24,8) NOT NULL,
    "averageCost" DECIMAL(24,8) NOT NULL,
    "currentPrice" DECIMAL(24,8) NOT NULL,
    "marketValue" DECIMAL(18,2) NOT NULL,
    "asOf" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InvestmentHolding_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PriceSnapshot" (
    "id" TEXT NOT NULL,
    "instrumentId" TEXT NOT NULL,
    "price" DECIMAL(24,8) NOT NULL,
    "bid" DECIMAL(24,8),
    "ask" DECIMAL(24,8),
    "currency" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "asOf" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PriceSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WatchlistItem" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "instrumentId" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WatchlistItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "instrumentId" TEXT NOT NULL,
    "side" "OrderSide" NOT NULL,
    "type" "OrderType" NOT NULL,
    "quantity" DECIMAL(24,8) NOT NULL,
    "limitPrice" DECIMAL(24,8),
    "stopPrice" DECIMAL(24,8),
    "currency" TEXT NOT NULL,
    "estimatedAmount" DECIMAL(18,2),
    "holdReference" TEXT,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING_REVIEW',
    "rejectionReason" TEXT,
    "approvedBy" TEXT,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approvedAt" TIMESTAMP(3),
    "settledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TradeFill" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "quantity" DECIMAL(24,8) NOT NULL,
    "price" DECIMAL(24,8) NOT NULL,
    "fee" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "externalReference" TEXT,
    "executedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TradeFill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Position" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "instrumentId" TEXT NOT NULL,
    "quantity" DECIMAL(24,8) NOT NULL,
    "averageCost" DECIMAL(24,8) NOT NULL,
    "marketValue" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "realizedPnl" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "unrealizedPnl" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Position_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OptionContract" (
    "id" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "underlyingInstrumentId" TEXT NOT NULL,
    "type" "OptionType" NOT NULL,
    "strike" DECIMAL(24,8) NOT NULL,
    "expiry" TIMESTAMP(3) NOT NULL,
    "premium" DECIMAL(24,8) NOT NULL,
    "multiplier" INTEGER NOT NULL DEFAULT 100,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OptionContract_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OptionsApplication" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "status" "OptionsAccessStatus" NOT NULL DEFAULT 'NOT_APPLIED',
    "questionnaire" JSONB,
    "score" INTEGER,
    "disclosureAcceptedAt" TIMESTAMP(3),
    "reviewerId" TEXT,
    "decisionNote" TEXT,
    "decidedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OptionsApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DistributionBatch" (
    "id" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "productId" TEXT,
    "instrumentId" TEXT,
    "type" "DistributionType" NOT NULL,
    "periodStart" TIMESTAMP(3) NOT NULL,
    "periodEnd" TIMESTAMP(3) NOT NULL,
    "currency" TEXT NOT NULL,
    "grossAmount" DECIMAL(18,2) NOT NULL,
    "feeAmount" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "netAmount" DECIMAL(18,2) NOT NULL,
    "status" "DistributionStatus" NOT NULL DEFAULT 'DRAFT',
    "calculationSnapshot" JSONB,
    "createdBy" TEXT NOT NULL,
    "approvedBy" TEXT,
    "approvedAt" TIMESTAMP(3),
    "postedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DistributionBatch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DistributionItem" (
    "id" TEXT NOT NULL,
    "batchId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "investmentId" TEXT,
    "grossAmount" DECIMAL(18,2) NOT NULL,
    "feeAmount" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "netAmount" DECIMAL(18,2) NOT NULL,
    "mode" "DistributionMode" NOT NULL DEFAULT 'WALLET',
    "status" "DistributionStatus" NOT NULL DEFAULT 'CALCULATED',
    "ledgerTransactionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DistributionItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RiskRule" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "severity" "Severity" NOT NULL,
    "conditions" JSONB NOT NULL,
    "action" JSONB NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RiskRule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RiskAlert" (
    "id" TEXT NOT NULL,
    "clientId" TEXT,
    "productId" TEXT,
    "instrumentId" TEXT,
    "category" TEXT NOT NULL,
    "severity" "Severity" NOT NULL,
    "title" TEXT NOT NULL,
    "details" JSONB,
    "status" "RiskAlertStatus" NOT NULL DEFAULT 'OPEN',
    "assignedTo" TEXT,
    "resolvedBy" TEXT,
    "resolution" TEXT,
    "resolvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RiskAlert_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupportMessage" (
    "id" TEXT NOT NULL,
    "ticketId" TEXT NOT NULL,
    "authorType" "ActorType" NOT NULL,
    "authorId" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SupportMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotificationDelivery" (
    "id" TEXT NOT NULL,
    "notificationId" TEXT NOT NULL,
    "channel" "DeliveryChannel" NOT NULL,
    "recipient" TEXT NOT NULL,
    "status" "DeliveryStatus" NOT NULL DEFAULT 'PENDING',
    "providerId" TEXT,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "lastError" TEXT,
    "sentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NotificationDelivery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OutboxEvent" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "status" "JobStatus" NOT NULL DEFAULT 'PENDING',
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "nextAttemptAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastError" TEXT,
    "processedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OutboxEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StoredFile" (
    "id" TEXT NOT NULL,
    "ownerType" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "storageKey" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "checksum" TEXT,
    "url" TEXT,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StoredFile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminTask" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "priority" TEXT NOT NULL DEFAULT 'Normal',
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "assignedToId" TEXT,
    "entityType" TEXT,
    "entityId" TEXT,
    "dueAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdminTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SystemSetting" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "description" TEXT,
    "isSecret" BOOLEAN NOT NULL DEFAULT false,
    "updatedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SystemSetting_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AdminMfa_adminId_key" ON "AdminMfa"("adminId");

-- CreateIndex
CREATE UNIQUE INDEX "AuthSession_refreshTokenHash_key" ON "AuthSession"("refreshTokenHash");

-- CreateIndex
CREATE INDEX "AuthSession_clientId_revokedAt_idx" ON "AuthSession"("clientId", "revokedAt");

-- CreateIndex
CREATE INDEX "AuthSession_adminId_revokedAt_idx" ON "AuthSession"("adminId", "revokedAt");

-- CreateIndex
CREATE INDEX "AuthSession_expiresAt_idx" ON "AuthSession"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_tokenHash_key" ON "VerificationToken"("tokenHash");

-- CreateIndex
CREATE INDEX "VerificationToken_actorType_actorId_purpose_idx" ON "VerificationToken"("actorType", "actorId", "purpose");

-- CreateIndex
CREATE INDEX "LoginAttempt_email_actorType_createdAt_idx" ON "LoginAttempt"("email", "actorType", "createdAt");

-- CreateIndex
CREATE INDEX "LoginAttempt_ipAddress_createdAt_idx" ON "LoginAttempt"("ipAddress", "createdAt");

-- CreateIndex
CREATE INDEX "KycCase_clientId_status_idx" ON "KycCase"("clientId", "status");

-- CreateIndex
CREATE INDEX "KycDocument_caseId_type_idx" ON "KycDocument"("caseId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "LedgerAccount_code_key" ON "LedgerAccount"("code");

-- CreateIndex
CREATE INDEX "LedgerAccount_currency_kind_idx" ON "LedgerAccount"("currency", "kind");

-- CreateIndex
CREATE UNIQUE INDEX "LedgerAccount_walletId_kind_currency_key" ON "LedgerAccount"("walletId", "kind", "currency");

-- CreateIndex
CREATE UNIQUE INDEX "LedgerTransaction_reference_key" ON "LedgerTransaction"("reference");

-- CreateIndex
CREATE UNIQUE INDEX "LedgerTransaction_idempotencyKey_key" ON "LedgerTransaction"("idempotencyKey");

-- CreateIndex
CREATE INDEX "LedgerTransaction_clientId_createdAt_idx" ON "LedgerTransaction"("clientId", "createdAt");

-- CreateIndex
CREATE INDEX "LedgerTransaction_status_createdAt_idx" ON "LedgerTransaction"("status", "createdAt");

-- CreateIndex
CREATE INDEX "LedgerEntry_transactionId_idx" ON "LedgerEntry"("transactionId");

-- CreateIndex
CREATE INDEX "LedgerEntry_accountId_createdAt_idx" ON "LedgerEntry"("accountId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "WalletHold_reference_key" ON "WalletHold"("reference");

-- CreateIndex
CREATE INDEX "WalletHold_walletId_status_idx" ON "WalletHold"("walletId", "status");

-- CreateIndex
CREATE INDEX "Beneficiary_clientId_status_idx" ON "Beneficiary"("clientId", "status");

-- CreateIndex
CREATE INDEX "ApprovalRequest_entityType_entityId_status_idx" ON "ApprovalRequest"("entityType", "entityId", "status");

-- CreateIndex
CREATE INDEX "ApprovalRequest_status_createdAt_idx" ON "ApprovalRequest"("status", "createdAt");

-- CreateIndex
CREATE INDEX "IdempotencyRecord_expiresAt_idx" ON "IdempotencyRecord"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "IdempotencyRecord_key_actorId_route_key" ON "IdempotencyRecord"("key", "actorId", "route");

-- CreateIndex
CREATE UNIQUE INDEX "PortfolioProductVersion_productId_version_key" ON "PortfolioProductVersion"("productId", "version");

-- CreateIndex
CREATE UNIQUE INDEX "PortfolioAllocation_productId_instrumentId_effectiveFrom_key" ON "PortfolioAllocation"("productId", "instrumentId", "effectiveFrom");

-- CreateIndex
CREATE UNIQUE INDEX "InvestmentTransaction_reference_key" ON "InvestmentTransaction"("reference");

-- CreateIndex
CREATE UNIQUE INDEX "InvestmentValuation_investmentId_asOf_key" ON "InvestmentValuation"("investmentId", "asOf");

-- CreateIndex
CREATE UNIQUE INDEX "InvestmentHolding_investmentId_instrumentId_key" ON "InvestmentHolding"("investmentId", "instrumentId");

-- CreateIndex
CREATE INDEX "PriceSnapshot_instrumentId_asOf_idx" ON "PriceSnapshot"("instrumentId", "asOf");

-- CreateIndex
CREATE UNIQUE INDEX "WatchlistItem_clientId_instrumentId_key" ON "WatchlistItem"("clientId", "instrumentId");

-- CreateIndex
CREATE UNIQUE INDEX "Order_reference_key" ON "Order"("reference");

-- CreateIndex
CREATE INDEX "Order_clientId_status_idx" ON "Order"("clientId", "status");

-- CreateIndex
CREATE INDEX "Order_status_submittedAt_idx" ON "Order"("status", "submittedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Position_clientId_instrumentId_key" ON "Position"("clientId", "instrumentId");

-- CreateIndex
CREATE UNIQUE INDEX "OptionContract_symbol_key" ON "OptionContract"("symbol");

-- CreateIndex
CREATE INDEX "OptionsApplication_clientId_status_idx" ON "OptionsApplication"("clientId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "DistributionBatch_reference_key" ON "DistributionBatch"("reference");

-- CreateIndex
CREATE INDEX "DistributionBatch_status_createdAt_idx" ON "DistributionBatch"("status", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "DistributionItem_batchId_clientId_investmentId_key" ON "DistributionItem"("batchId", "clientId", "investmentId");

-- CreateIndex
CREATE UNIQUE INDEX "RiskRule_code_key" ON "RiskRule"("code");

-- CreateIndex
CREATE INDEX "RiskAlert_status_severity_createdAt_idx" ON "RiskAlert"("status", "severity", "createdAt");

-- CreateIndex
CREATE INDEX "SupportMessage_ticketId_createdAt_idx" ON "SupportMessage"("ticketId", "createdAt");

-- CreateIndex
CREATE INDEX "NotificationDelivery_status_createdAt_idx" ON "NotificationDelivery"("status", "createdAt");

-- CreateIndex
CREATE INDEX "OutboxEvent_status_nextAttemptAt_idx" ON "OutboxEvent"("status", "nextAttemptAt");

-- CreateIndex
CREATE UNIQUE INDEX "StoredFile_storageKey_key" ON "StoredFile"("storageKey");

-- CreateIndex
CREATE INDEX "StoredFile_ownerType_ownerId_category_idx" ON "StoredFile"("ownerType", "ownerId", "category");

-- CreateIndex
CREATE UNIQUE INDEX "SystemSetting_key_key" ON "SystemSetting"("key");

-- CreateIndex
CREATE INDEX "AuditLog_entityType_entityId_createdAt_idx" ON "AuditLog"("entityType", "entityId", "createdAt");

-- CreateIndex
CREATE INDEX "AuditLog_actorId_createdAt_idx" ON "AuditLog"("actorId", "createdAt");

-- CreateIndex
CREATE INDEX "AuditLog_requestId_idx" ON "AuditLog"("requestId");

-- CreateIndex
CREATE INDEX "ClientInvestment_clientId_status_idx" ON "ClientInvestment"("clientId", "status");

-- CreateIndex
CREATE INDEX "Deposit_clientId_status_idx" ON "Deposit"("clientId", "status");

-- CreateIndex
CREATE INDEX "Notification_clientId_readAt_createdAt_idx" ON "Notification"("clientId", "readAt", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Payout_distributionItemId_key" ON "Payout"("distributionItemId");

-- CreateIndex
CREATE UNIQUE INDEX "PortfolioProduct_slug_key" ON "PortfolioProduct"("slug");

-- CreateIndex
CREATE INDEX "ReportExport_clientId_createdAt_idx" ON "ReportExport"("clientId", "createdAt");

-- CreateIndex
CREATE INDEX "Withdrawal_clientId_status_idx" ON "Withdrawal"("clientId", "status");

-- AddForeignKey
ALTER TABLE "AdminMfa" ADD CONSTRAINT "AdminMfa_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "AdminUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuthSession" ADD CONSTRAINT "AuthSession_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuthSession" ADD CONSTRAINT "AuthSession_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "AdminUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KycCase" ADD CONSTRAINT "KycCase_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KycDocument" ADD CONSTRAINT "KycDocument_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "KycCase"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KycCheck" ADD CONSTRAINT "KycCheck_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "KycCase"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KycDecision" ADD CONSTRAINT "KycDecision_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "KycCase"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LedgerAccount" ADD CONSTRAINT "LedgerAccount_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "WalletAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LedgerTransaction" ADD CONSTRAINT "LedgerTransaction_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LedgerEntry" ADD CONSTRAINT "LedgerEntry_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "LedgerTransaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LedgerEntry" ADD CONSTRAINT "LedgerEntry_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "LedgerAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WalletHold" ADD CONSTRAINT "WalletHold_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "WalletAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WalletHold" ADD CONSTRAINT "WalletHold_ledgerAccountId_fkey" FOREIGN KEY ("ledgerAccountId") REFERENCES "LedgerAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Beneficiary" ADD CONSTRAINT "Beneficiary_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentMethod" ADD CONSTRAINT "PaymentMethod_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApprovalRequest" ADD CONSTRAINT "ApprovalRequest_initiatedByAdminId_fkey" FOREIGN KEY ("initiatedByAdminId") REFERENCES "AdminUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApprovalRequest" ADD CONSTRAINT "ApprovalRequest_approvedByAdminId_fkey" FOREIGN KEY ("approvedByAdminId") REFERENCES "AdminUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PortfolioProductVersion" ADD CONSTRAINT "PortfolioProductVersion_productId_fkey" FOREIGN KEY ("productId") REFERENCES "PortfolioProduct"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PortfolioAllocation" ADD CONSTRAINT "PortfolioAllocation_productId_fkey" FOREIGN KEY ("productId") REFERENCES "PortfolioProduct"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PortfolioAllocation" ADD CONSTRAINT "PortfolioAllocation_instrumentId_fkey" FOREIGN KEY ("instrumentId") REFERENCES "Instrument"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeeRule" ADD CONSTRAINT "FeeRule_productId_fkey" FOREIGN KEY ("productId") REFERENCES "PortfolioProduct"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvestmentTransaction" ADD CONSTRAINT "InvestmentTransaction_investmentId_fkey" FOREIGN KEY ("investmentId") REFERENCES "ClientInvestment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvestmentValuation" ADD CONSTRAINT "InvestmentValuation_investmentId_fkey" FOREIGN KEY ("investmentId") REFERENCES "ClientInvestment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvestmentHolding" ADD CONSTRAINT "InvestmentHolding_investmentId_fkey" FOREIGN KEY ("investmentId") REFERENCES "ClientInvestment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvestmentHolding" ADD CONSTRAINT "InvestmentHolding_instrumentId_fkey" FOREIGN KEY ("instrumentId") REFERENCES "Instrument"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PriceSnapshot" ADD CONSTRAINT "PriceSnapshot_instrumentId_fkey" FOREIGN KEY ("instrumentId") REFERENCES "Instrument"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WatchlistItem" ADD CONSTRAINT "WatchlistItem_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WatchlistItem" ADD CONSTRAINT "WatchlistItem_instrumentId_fkey" FOREIGN KEY ("instrumentId") REFERENCES "Instrument"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_instrumentId_fkey" FOREIGN KEY ("instrumentId") REFERENCES "Instrument"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TradeFill" ADD CONSTRAINT "TradeFill_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Position" ADD CONSTRAINT "Position_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Position" ADD CONSTRAINT "Position_instrumentId_fkey" FOREIGN KEY ("instrumentId") REFERENCES "Instrument"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OptionContract" ADD CONSTRAINT "OptionContract_underlyingInstrumentId_fkey" FOREIGN KEY ("underlyingInstrumentId") REFERENCES "Instrument"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OptionsApplication" ADD CONSTRAINT "OptionsApplication_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DistributionBatch" ADD CONSTRAINT "DistributionBatch_productId_fkey" FOREIGN KEY ("productId") REFERENCES "PortfolioProduct"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DistributionBatch" ADD CONSTRAINT "DistributionBatch_instrumentId_fkey" FOREIGN KEY ("instrumentId") REFERENCES "Instrument"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DistributionItem" ADD CONSTRAINT "DistributionItem_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "DistributionBatch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DistributionItem" ADD CONSTRAINT "DistributionItem_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DistributionItem" ADD CONSTRAINT "DistributionItem_investmentId_fkey" FOREIGN KEY ("investmentId") REFERENCES "ClientInvestment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payout" ADD CONSTRAINT "Payout_distributionItemId_fkey" FOREIGN KEY ("distributionItemId") REFERENCES "DistributionItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiskAlert" ADD CONSTRAINT "RiskAlert_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiskAlert" ADD CONSTRAINT "RiskAlert_productId_fkey" FOREIGN KEY ("productId") REFERENCES "PortfolioProduct"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiskAlert" ADD CONSTRAINT "RiskAlert_instrumentId_fkey" FOREIGN KEY ("instrumentId") REFERENCES "Instrument"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupportMessage" ADD CONSTRAINT "SupportMessage_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "SupportTicket"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationDelivery" ADD CONSTRAINT "NotificationDelivery_notificationId_fkey" FOREIGN KEY ("notificationId") REFERENCES "Notification"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportExport" ADD CONSTRAINT "ReportExport_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminTask" ADD CONSTRAINT "AdminTask_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "AdminUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Preserve and normalize the existing beta data before the new services take ownership.
UPDATE "Client"
SET "emailVerifiedAt" = COALESCE("emailVerifiedAt", "createdAt");

UPDATE "WalletAccount"
SET "held" = GREATEST("balance" - "available", 0);

UPDATE "PortfolioProduct"
SET "slug" = lower(regexp_replace(regexp_replace("name", '[^a-zA-Z0-9]+', '-', 'g'), '(^-|-$)', '', 'g')),
    "publishedAt" = CASE WHEN "status" = 'PUBLISHED' THEN COALESCE("publishedAt", "createdAt") ELSE "publishedAt" END,
    "disclosure" = COALESCE("disclosure", 'Returns are projected and market-based. Capital and income are not guaranteed.');

UPDATE "Instrument"
SET "tradable" = CASE WHEN lower("status") LIKE '%trad%' OR lower("status") = 'active' THEN true ELSE "tradable" END,
    "investable" = CASE WHEN lower("status") IN ('inactive', 'suspended') THEN false ELSE true END,
    "priceSource" = COALESCE("priceSource", 'Admin managed');

UPDATE "ClientInvestment"
SET "units" = CASE WHEN "investedAmount" > 0 THEN "investedAmount" ELSE 0 END,
    "projectedReturnLabel" = COALESCE("projectedReturnLabel", 'Projected, market-based performance');

INSERT INTO "LedgerAccount" ("id", "walletId", "code", "name", "kind", "currency", "balance", "available", "createdAt", "updatedAt")
SELECT 'la_' || md5(w."id" || ':cash'), w."id", 'CLIENT-' || c."accountNumber" || '-USD-CASH', c."name" || ' USD cash', 'CLIENT_CASH', 'USD', w."balance", w."available", CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM "WalletAccount" w
JOIN "Client" c ON c."id" = w."clientId";

INSERT INTO "LedgerAccount" ("id", "walletId", "code", "name", "kind", "currency", "balance", "available", "createdAt", "updatedAt") VALUES
('la_platform_clearing_usd', NULL, 'PLATFORM-CLEARING-USD', 'Platform USD clearing', 'PLATFORM_CLEARING', 'USD', 0, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('la_platform_fees_usd', NULL, 'PLATFORM-FEES-USD', 'Platform USD fees', 'PLATFORM_FEES', 'USD', 0, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('la_platform_revenue_usd', NULL, 'PLATFORM-REVENUE-USD', 'Platform USD revenue', 'PLATFORM_REVENUE', 'USD', 0, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO "LedgerTransaction" ("id", "reference", "clientId", "type", "status", "currency", "description", "postedAt", "createdAt")
SELECT 'lt_' || md5(w."id" || ':opening'), 'OPEN-' || c."accountNumber", c."id", 'OPENING_BALANCE', 'POSTED', 'USD', 'Opening balance migrated from the legacy wallet', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM "WalletAccount" w
JOIN "Client" c ON c."id" = w."clientId"
WHERE w."balance" <> 0;

INSERT INTO "LedgerEntry" ("id", "transactionId", "accountId", "side", "amount", "currency", "memo", "createdAt")
SELECT 'le_' || md5(w."id" || ':opening:client'), 'lt_' || md5(w."id" || ':opening'), 'la_' || md5(w."id" || ':cash'), 'DEBIT', abs(w."balance"), 'USD', 'Legacy wallet opening balance', CURRENT_TIMESTAMP
FROM "WalletAccount" w
WHERE w."balance" <> 0;

INSERT INTO "LedgerEntry" ("id", "transactionId", "accountId", "side", "amount", "currency", "memo", "createdAt")
SELECT 'le_' || md5(w."id" || ':opening:clearing'), 'lt_' || md5(w."id" || ':opening'), 'la_platform_clearing_usd', 'CREDIT', abs(w."balance"), 'USD', 'Opening balance clearing entry', CURRENT_TIMESTAMP
FROM "WalletAccount" w
WHERE w."balance" <> 0;

INSERT INTO "KycCase" ("id", "clientId", "status", "level", "submittedAt", "approvedAt", "assignedReviewer", "createdAt", "updatedAt")
SELECT 'kc_' || md5(k."id"), k."clientId", k."status", 'Standard', k."createdAt",
       CASE WHEN k."status" = 'APPROVED' THEN k."updatedAt" ELSE NULL END,
       k."reviewer", k."createdAt", k."updatedAt"
FROM "KycReview" k;

INSERT INTO "PortfolioProductVersion" ("id", "productId", "version", "terms", "status", "createdBy", "createdAt", "publishedAt")
SELECT 'pv_' || md5(p."id" || ':1'), p."id", 1,
       jsonb_build_object('description', p."description", 'minimum', p."minimum", 'currency', p."currency", 'payoutRule', p."payoutRule", 'riskLevel', p."riskLevel", 'disclosure', p."disclosure"),
       p."status", 'migration', p."createdAt", p."publishedAt"
FROM "PortfolioProduct" p;

INSERT INTO "InvestmentTransaction" ("id", "investmentId", "reference", "type", "amount", "units", "unitPrice", "createdAt")
SELECT 'it_' || md5(i."id" || ':opening'), i."id", 'INV-OPEN-' || substr(md5(i."id"), 1, 12), 'OPENING_SUBSCRIPTION', i."investedAmount", i."units", 1, i."createdAt"
FROM "ClientInvestment" i;

INSERT INTO "InvestmentValuation" ("id", "investmentId", "value", "unitPrice", "source", "asOf", "createdAt")
SELECT 'iv_' || md5(i."id" || ':opening'), i."id", i."currentValue",
       CASE WHEN i."units" > 0 THEN i."currentValue" / i."units" ELSE 1 END,
       'Legacy migration', i."updatedAt", CURRENT_TIMESTAMP
FROM "ClientInvestment" i;

INSERT INTO "SystemSetting" ("id", "key", "value", "description", "createdAt", "updatedAt") VALUES
('setting_base_currency', 'platform.baseCurrency', '"USD"'::jsonb, 'Canonical accounting currency', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('setting_capabilities', 'platform.capabilities', '{"cardFunding":false,"bankFunding":true,"cryptoFunding":true,"internalOrderDesk":true,"liveExchangeExecution":false,"marketPriceMode":"admin-managed"}'::jsonb, 'Client-visible capability switches', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('setting_approval', 'operations.approvals', '{"makerChecker":true,"withdrawals":true,"depositCredits":true,"distributions":true,"productPublishing":true,"ledgerAdjustments":true}'::jsonb, 'Sensitive operation approval policy', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO "RiskRule" ("id", "code", "name", "category", "description", "severity", "conditions", "action", "createdAt", "updatedAt") VALUES
('risk_rule_kyc', 'KYC_REQUIRED', 'KYC required for restricted actions', 'Client', 'Blocks investments, withdrawals, and options access until KYC approval.', 'HIGH', '{"kycStatus":{"not":"APPROVED"}}'::jsonb, '{"block":["INVESTMENT","WITHDRAWAL","OPTIONS"]}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('risk_rule_withdrawal', 'LARGE_WITHDRAWAL', 'Large withdrawal review', 'Withdrawal', 'Escalates large withdrawals for enhanced review.', 'HIGH', '{"amount":{"gte":10000}}'::jsonb, '{"createAlert":true,"requireEnhancedReview":true}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('risk_rule_options', 'OPTIONS_ELIGIBILITY', 'Options eligibility required', 'Options', 'Blocks options orders without an approved suitability application.', 'CRITICAL', '{"optionsStatus":{"not":"APPROVED"}}'::jsonb, '{"block":true,"createAlert":true}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
