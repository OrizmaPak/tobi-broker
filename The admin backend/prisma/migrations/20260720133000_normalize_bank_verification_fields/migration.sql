UPDATE "SystemSetting"
SET "value" = jsonb_set(
  COALESCE("value", '{}'::jsonb),
  '{methods}',
  COALESCE(
    (
      SELECT jsonb_agg(
        CASE
          WHEN method->>'type' = 'BANK' THEN jsonb_set(
            method,
            '{fields}',
            COALESCE(
              (
                SELECT jsonb_agg(field)
                FROM jsonb_array_elements(COALESCE(method->'fields', '[]'::jsonb)) AS field
                WHERE field->>'id' NOT IN ('bankName', 'accountNumber')
              ),
              '[]'::jsonb
            ),
            true
          )
          ELSE method
        END
      )
      FROM jsonb_array_elements(COALESCE("value"->'methods', '[]'::jsonb)) AS method
    ),
    '[]'::jsonb
  ),
  true
),
"updatedAt" = CURRENT_TIMESTAMP
WHERE "key" = 'withdrawal.methods'
  AND "value" ? 'methods';
