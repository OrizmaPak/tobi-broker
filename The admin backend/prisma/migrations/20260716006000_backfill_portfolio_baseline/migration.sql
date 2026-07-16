WITH allocation_data("productName", "symbol", "weight") AS (
  VALUES
    ('Conservative Income', 'US10Y', 60.0),
    ('Conservative Income', 'SPY', 20.0),
    ('Conservative Income', 'VNQ', 20.0),
    ('Balanced Growth', 'SPY', 35.0),
    ('Balanced Growth', 'US10Y', 25.0),
    ('Balanced Growth', 'VNQ', 20.0),
    ('Balanced Growth', 'XAUUSD', 10.0),
    ('Balanced Growth', 'AAPL', 10.0),
    ('Commodity Opportunity', 'XAUUSD', 60.0),
    ('Commodity Opportunity', 'SPY', 15.0),
    ('Commodity Opportunity', 'US10Y', 15.0),
    ('Commodity Opportunity', 'VNQ', 10.0),
    ('Dividend Income', 'VNQ', 35.0),
    ('Dividend Income', 'SPY', 30.0),
    ('Dividend Income', 'US10Y', 25.0),
    ('Dividend Income', 'AAPL', 10.0),
    ('Equity Growth', 'SPY', 45.0),
    ('Equity Growth', 'AAPL', 30.0),
    ('Equity Growth', 'NDX', 25.0),
    ('Premium Managed', 'SPY', 25.0),
    ('Premium Managed', 'US10Y', 20.0),
    ('Premium Managed', 'AAPL', 15.0),
    ('Premium Managed', 'XAUUSD', 15.0),
    ('Premium Managed', 'VNQ', 15.0),
    ('Premium Managed', 'NDX', 10.0)
)
INSERT INTO "PortfolioAllocation" ("id", "productId", "instrumentId", "targetWeight", "effectiveFrom")
SELECT
  'alloc_' || SUBSTRING(MD5(product."id" || instrument."id") FROM 1 FOR 24),
  product."id",
  instrument."id",
  allocation_data."weight",
  CURRENT_TIMESTAMP
FROM allocation_data
JOIN "PortfolioProduct" product ON product."name" = allocation_data."productName"
JOIN "Instrument" instrument ON instrument."symbol" = allocation_data."symbol"
WHERE NOT EXISTS (
  SELECT 1 FROM "PortfolioAllocation" existing
  WHERE existing."productId" = product."id" AND existing."effectiveTo" IS NULL
);

INSERT INTO "FeeRule" ("id", "productId", "name", "type", "rate", "currency", "appliesTo", "active", "createdAt", "updatedAt")
SELECT
  'fee_' || SUBSTRING(MD5(product."id" || ':management') FROM 1 FOR 24),
  product."id",
  'Annual management fee',
  'MANAGEMENT',
  CASE WHEN product."name" = 'Premium Managed' THEN 0.015 ELSE 0.01 END,
  'USD',
  'Average managed portfolio value',
  true,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
FROM "PortfolioProduct" product
WHERE NOT EXISTS (
  SELECT 1 FROM "FeeRule" existing
  WHERE existing."productId" = product."id" AND existing."active" = true
);

UPDATE "PortfolioProduct"
SET "status" = 'PUBLISHED', "publishedAt" = COALESCE("publishedAt", CURRENT_TIMESTAMP)
WHERE "name" = 'Commodity Opportunity';

UPDATE "PortfolioProductVersion"
SET "status" = 'PUBLISHED', "publishedAt" = COALESCE("publishedAt", CURRENT_TIMESTAMP)
WHERE "productId" IN (SELECT "id" FROM "PortfolioProduct" WHERE "name" = 'Commodity Opportunity');

INSERT INTO "AuditLog" ("id", "actorType", "actorName", "action", "entityType", "metadata", "createdAt")
SELECT
  'audit_' || SUBSTRING(MD5('portfolio-baseline-20260716006000') FROM 1 FOR 24),
  'SYSTEM'::"ActorType",
  'System',
  'backfillPortfolioBaseline',
  'PortfolioProduct',
  jsonb_build_object('portfolios', 6, 'allocationMethod', 'approved beta baseline', 'feeDisclosure', 'annual management fee'),
  CURRENT_TIMESTAMP
WHERE EXISTS (SELECT 1 FROM "PortfolioProduct")
  AND NOT EXISTS (SELECT 1 FROM "AuditLog" WHERE "action" = 'backfillPortfolioBaseline');
