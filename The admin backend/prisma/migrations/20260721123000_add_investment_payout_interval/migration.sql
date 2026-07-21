ALTER TABLE "PortfolioProduct"
ADD COLUMN "payoutInterval" TEXT NOT NULL DEFAULT 'HOURLY';

ALTER TABLE "ClientInvestment"
ADD COLUMN "payoutInterval" TEXT NOT NULL DEFAULT 'HOURLY';

UPDATE "ClientInvestment" ci
SET "payoutInterval" = COALESCE(pp."payoutInterval", 'HOURLY')
FROM "PortfolioProduct" pp
WHERE ci."productId" = pp."id";
