ALTER TYPE "InvestmentStatus" ADD VALUE IF NOT EXISTS 'HELD';

ALTER TABLE "ClientInvestment"
ADD COLUMN "profitAccrued" DECIMAL(18,2) NOT NULL DEFAULT 0,
ADD COLUMN "profitAccruedAt" TIMESTAMP(3);

UPDATE "ClientInvestment"
SET
  "profitAccrued" = GREATEST("currentValue" - "investedAmount", 0),
  "profitAccruedAt" = COALESCE("updatedAt", "startDate", "createdAt")
WHERE "profitAccruedAt" IS NULL;
