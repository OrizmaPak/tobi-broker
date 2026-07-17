# BullPort Backend

Operational beta API for BullPort. The service uses Express, TypeScript, Prisma, Neon PostgreSQL, Vercel, Cloudinary/Vercel Blob storage, and Resend.

## Applications

- Public website: published portfolios, instruments, fees, disclosures, capabilities, and contact inquiries.
- Client dashboard: identity, KYC, wallet, funding, withdrawals, investments, watchlist, internal orders, options, distributions, reports, notifications, support, and settings.
- Admin console: queues, compliance, money operations, maker-checker approvals, products, instruments, trading, distributions, risk, support, reports, roles, settings, and audit records.

The versioned contract is available at `GET /api/v1/openapi.json`. Legacy `/api` routes remain temporarily available while application migration is completed.

## Local Setup

1. Copy `.env.example` to `.env` and supply private values.
2. Use the Neon pooled endpoint for `DATABASE_URL` during application runtime.
3. Install and verify:

```bash
npm install
npm run prisma:generate
npx prisma validate
npm run typecheck
npm test
npm run dev
```

Run `npm run prisma:deploy` with a direct Neon connection during controlled migrations. Automated test-data loaders are not included in the operational code path; create operational test records through the application workflows or controlled database migrations.

## Response Contract

Successful responses use `{ ok, data, meta, requestId }`. Errors use `{ ok: false, error: { code, message, fields }, requestId }`. Financial mutations accept an `Idempotency-Key` header and execute in database transactions.

## Security

- Client access sessions expire after 15 minutes and rotate through `HttpOnly` refresh cookies.
- Admin sessions require TOTP MFA when `ADMIN_MFA_REQUIRED=true`.
- Cookie mutations require the `bp_csrf` value in `x-csrf-token`.
- Login throttling, global API rate limits, secure headers, password rules, session revocation, and account lockout are enabled.
- Admin roles are enforced for compliance, finance, portfolio, support, audit, and super-admin operations.

## Accounting

Wallet balances are backed by immutable double-entry ledger transactions. Holds reserve available funds for withdrawals and buy orders. Deposits, withdrawals, adjustments, reversals, distributions, investments, and trade settlement are designed to remain balanced, idempotent, and auditable.

## Provider Capabilities

- Bank and crypto funding use manual evidence and maker-checker settlement.
- Card funding remains unavailable until a processor is configured.
- Market prices are admin-managed snapshots with source and timestamp metadata.
- Exchange execution is not represented as live; orders use the internal order desk.
- File upload uses Cloudinary when `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` are configured. Vercel Blob remains available as a fallback with `BLOB_READ_WRITE_TOKEN`.
- Email delivery requires `RESEND_API_KEY`; queued in-app records remain authoritative while email is unavailable.

## Production Rollout

1. Back up the `Tobi` schema.
2. Apply additive Prisma migrations with the direct connection.
3. Run `GET /api/v1/jobs/reconcile` with the job secret and confirm `balanced: true`.
4. Deploy backend, dashboard, admin console, then public website.
5. Smoke test health, readiness, authentication, public data, client workflows, admin queues, and maker-checker decisions.
