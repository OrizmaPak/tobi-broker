ALTER TABLE "Instrument" ADD COLUMN "marketId" TEXT;

INSERT INTO "Market" ("id", "name", "slug", "category", "description", "status", "sortOrder", "createdAt", "updatedAt")
SELECT
    'market_' || md5(lower(trim(instrument."market"))),
    trim(instrument."market"),
    regexp_replace(lower(trim(instrument."market")), '[^a-z0-9]+', '-', 'g'),
    COALESCE(NULLIF(trim(instrument."category"), ''), 'Imported'),
    'Created automatically from existing instrument records during market relationship migration.',
    'ACTIVE',
    500,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM "Instrument" instrument
WHERE instrument."market" IS NOT NULL
  AND trim(instrument."market") <> ''
  AND NOT EXISTS (
    SELECT 1
    FROM "Market" market
    WHERE lower(market."name") = lower(trim(instrument."market"))
  )
GROUP BY trim(instrument."market"), COALESCE(NULLIF(trim(instrument."category"), ''), 'Imported');

UPDATE "Instrument" instrument
SET "marketId" = market."id",
    "market" = market."name"
FROM "Market" market
WHERE lower(market."name") = lower(trim(instrument."market"));

ALTER TABLE "Instrument" ALTER COLUMN "marketId" SET NOT NULL;

CREATE INDEX "Instrument_marketId_idx" ON "Instrument"("marketId");

ALTER TABLE "Instrument"
ADD CONSTRAINT "Instrument_marketId_fkey"
FOREIGN KEY ("marketId") REFERENCES "Market"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;
