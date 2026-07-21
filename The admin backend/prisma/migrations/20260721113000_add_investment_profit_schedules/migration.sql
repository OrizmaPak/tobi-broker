CREATE TABLE "InvestmentProfitSchedule" (
  "id" TEXT NOT NULL,
  "investmentId" TEXT NOT NULL,
  "clientId" TEXT NOT NULL,
  "productId" TEXT NOT NULL,
  "instrumentId" TEXT,
  "scheduledAt" TIMESTAMP(3) NOT NULL,
  "type" TEXT NOT NULL DEFAULT 'BOT_PROFIT',
  "expectedAmount" DECIMAL(18,2) NOT NULL,
  "actualAmount" DECIMAL(18,2),
  "status" TEXT NOT NULL DEFAULT 'PENDING',
  "strategyName" TEXT NOT NULL DEFAULT 'BullPort HFT Bot',
  "note" TEXT,
  "postedAt" TIMESTAMP(3),
  "createdByAdminId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "InvestmentProfitSchedule_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "InvestmentTradeReceipt" (
  "id" TEXT NOT NULL,
  "scheduleId" TEXT NOT NULL,
  "investmentId" TEXT NOT NULL,
  "clientId" TEXT NOT NULL,
  "productId" TEXT NOT NULL,
  "instrumentId" TEXT,
  "reference" TEXT NOT NULL,
  "strategyName" TEXT NOT NULL,
  "side" TEXT NOT NULL,
  "entryAt" TIMESTAMP(3) NOT NULL,
  "exitAt" TIMESTAMP(3) NOT NULL,
  "entryPrice" DECIMAL(24,8) NOT NULL,
  "exitPrice" DECIMAL(24,8) NOT NULL,
  "quantity" DECIMAL(24,8) NOT NULL,
  "notional" DECIMAL(18,2) NOT NULL,
  "grossPnl" DECIMAL(18,2) NOT NULL,
  "fees" DECIMAL(18,2) NOT NULL DEFAULT 0,
  "netPnl" DECIMAL(18,2) NOT NULL,
  "source" TEXT NOT NULL,
  "sourceSnapshot" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "InvestmentTradeReceipt_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "InvestmentProfitSchedule_investmentId_scheduledAt_key" ON "InvestmentProfitSchedule"("investmentId", "scheduledAt");
CREATE INDEX "InvestmentProfitSchedule_clientId_status_scheduledAt_idx" ON "InvestmentProfitSchedule"("clientId", "status", "scheduledAt");
CREATE INDEX "InvestmentProfitSchedule_status_scheduledAt_idx" ON "InvestmentProfitSchedule"("status", "scheduledAt");
CREATE UNIQUE INDEX "InvestmentTradeReceipt_scheduleId_key" ON "InvestmentTradeReceipt"("scheduleId");
CREATE UNIQUE INDEX "InvestmentTradeReceipt_reference_key" ON "InvestmentTradeReceipt"("reference");
CREATE INDEX "InvestmentTradeReceipt_clientId_createdAt_idx" ON "InvestmentTradeReceipt"("clientId", "createdAt");
CREATE INDEX "InvestmentTradeReceipt_investmentId_createdAt_idx" ON "InvestmentTradeReceipt"("investmentId", "createdAt");

ALTER TABLE "InvestmentProfitSchedule" ADD CONSTRAINT "InvestmentProfitSchedule_investmentId_fkey" FOREIGN KEY ("investmentId") REFERENCES "ClientInvestment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "InvestmentProfitSchedule" ADD CONSTRAINT "InvestmentProfitSchedule_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "InvestmentProfitSchedule" ADD CONSTRAINT "InvestmentProfitSchedule_productId_fkey" FOREIGN KEY ("productId") REFERENCES "PortfolioProduct"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "InvestmentProfitSchedule" ADD CONSTRAINT "InvestmentProfitSchedule_instrumentId_fkey" FOREIGN KEY ("instrumentId") REFERENCES "Instrument"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "InvestmentTradeReceipt" ADD CONSTRAINT "InvestmentTradeReceipt_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "InvestmentProfitSchedule"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "InvestmentTradeReceipt" ADD CONSTRAINT "InvestmentTradeReceipt_investmentId_fkey" FOREIGN KEY ("investmentId") REFERENCES "ClientInvestment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "InvestmentTradeReceipt" ADD CONSTRAINT "InvestmentTradeReceipt_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "InvestmentTradeReceipt" ADD CONSTRAINT "InvestmentTradeReceipt_productId_fkey" FOREIGN KEY ("productId") REFERENCES "PortfolioProduct"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "InvestmentTradeReceipt" ADD CONSTRAINT "InvestmentTradeReceipt_instrumentId_fkey" FOREIGN KEY ("instrumentId") REFERENCES "Instrument"("id") ON DELETE SET NULL ON UPDATE CASCADE;
