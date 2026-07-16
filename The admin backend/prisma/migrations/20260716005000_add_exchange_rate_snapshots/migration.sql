CREATE TABLE "ExchangeRateSnapshot" (
  "id" TEXT NOT NULL,
  "baseCurrency" TEXT NOT NULL,
  "quoteCurrency" TEXT NOT NULL,
  "rate" DECIMAL(24,10) NOT NULL,
  "source" TEXT NOT NULL,
  "asOf" TIMESTAMP(3) NOT NULL,
  "createdBy" TEXT,
  "metadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ExchangeRateSnapshot_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ExchangeRateSnapshot_baseCurrency_quoteCurrency_asOf_key"
ON "ExchangeRateSnapshot"("baseCurrency", "quoteCurrency", "asOf");

CREATE INDEX "ExchangeRateSnapshot_baseCurrency_quoteCurrency_asOf_idx"
ON "ExchangeRateSnapshot"("baseCurrency", "quoteCurrency", "asOf");

UPDATE "Beneficiary"
SET "bankName" = 'BullPort Settlement Bank'
WHERE "bankName" = 'BullPort Demo Bank';

UPDATE "LedgerTransaction"
SET "description" = REPLACE("description", 'demo wallet balance', 'wallet balance')
WHERE "description" ILIKE '%demo wallet balance%';

UPDATE "KycReview"
SET "decisionNote" = REPLACE("decisionNote", 'demo client', 'seeded client')
WHERE "decisionNote" ILIKE '%demo client%';
