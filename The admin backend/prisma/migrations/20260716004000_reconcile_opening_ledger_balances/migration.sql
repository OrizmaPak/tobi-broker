-- Recalculate cached ledger balances after opening entries are backfilled.
UPDATE "LedgerAccount" AS account
SET
  "balance" = COALESCE(
    (
      SELECT SUM(
        CASE
          WHEN entry."side" = 'DEBIT' THEN entry."amount"
          ELSE -entry."amount"
        END
      )
      FROM "LedgerEntry" AS entry
      WHERE entry."accountId" = account."id"
    ),
    0
  ),
  "updatedAt" = CURRENT_TIMESTAMP;
