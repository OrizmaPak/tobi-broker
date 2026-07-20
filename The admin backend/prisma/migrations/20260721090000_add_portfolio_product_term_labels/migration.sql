ALTER TABLE "PortfolioProduct"
ADD COLUMN "subscriptionType" TEXT NOT NULL DEFAULT 'FLEXIBLE',
ADD COLUMN "payoutCycleCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "projectedReturnType" TEXT NOT NULL DEFAULT 'FLEXIBLE',
ADD COLUMN "projectedReturnMode" TEXT NOT NULL DEFAULT 'RANGE';

UPDATE "PortfolioProduct"
SET
  "subscriptionType" = COALESCE(NULLIF("subscriptionType", ''), 'FLEXIBLE'),
  "payoutCycleCount" = GREATEST(COALESCE("payoutCycleCount", 0), 0),
  "projectedReturnType" = COALESCE(NULLIF("projectedReturnType", ''), 'FLEXIBLE'),
  "projectedReturnMode" = CASE
    WHEN "projectedReturnMin" IS NOT NULL
      AND "projectedReturnMax" IS NOT NULL
      AND "projectedReturnMin" = "projectedReturnMax"
    THEN 'FIXED'
    ELSE 'RANGE'
  END;

UPDATE "PortfolioProductVersion"
SET "terms" = COALESCE("terms", '{}'::jsonb)
  || jsonb_build_object(
    'subscriptionType', 'FLEXIBLE',
    'payoutCycleCount', 0,
    'projectedReturnType', 'FLEXIBLE',
    'projectedReturnMode', CASE
      WHEN ("terms"->>'projectedReturnMin') IS NOT NULL
        AND ("terms"->>'projectedReturnMax') IS NOT NULL
        AND ("terms"->>'projectedReturnMin') = ("terms"->>'projectedReturnMax')
      THEN 'FIXED'
      ELSE 'RANGE'
    END
  )
WHERE "terms" IS NOT NULL;
