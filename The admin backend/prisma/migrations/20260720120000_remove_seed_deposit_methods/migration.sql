UPDATE "SystemSetting"
SET "value" = jsonb_set(
  COALESCE("value", '{}'::jsonb),
  '{methods}',
  COALESCE(
    (
      SELECT jsonb_agg(method)
      FROM jsonb_array_elements(COALESCE("value"->'methods', '[]'::jsonb)) AS method
      WHERE method->>'id' NOT IN ('bank-london-primary', 'crypto-usdt-trc20', 'card-instant')
    ),
    '[]'::jsonb
  ),
  true
),
"updatedAt" = CURRENT_TIMESTAMP
WHERE "key" = 'deposit.methods'
  AND "value" ? 'methods';
