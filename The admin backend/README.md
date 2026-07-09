# BullPort Backend

Backend API for the BullPort broker platform. This service is prepared for Postgres through Prisma and exposes the first admin/client operational APIs.

## Setup

1. Copy `.env.example` to `.env`.
2. Set `DATABASE_URL` to the Postgres URL.
3. Run:

```bash
npm install
npm run prisma:generate
npm run prisma:migrate
npm run seed
npm run dev
```

## Health

`GET /health`

## Current API Areas

- `POST /api/auth/admin/login`
- `GET /api/admin/overview`
- `GET /api/admin/audit-logs`
- `GET /api/clients`
- `GET /api/clients/:id`
- `POST /api/clients/:id/notes`
- `GET /api/kyc/reviews`
- `POST /api/kyc/reviews/:id/approve`
- `POST /api/kyc/reviews/:id/reject`
- `POST /api/kyc/reviews/:id/request-resubmission`
- `GET /api/money/deposits`
- `POST /api/money/deposits/:id/credit`
- `POST /api/money/deposits/:id/flag`
- `GET /api/money/withdrawals`
- `POST /api/money/withdrawals/:id/approve`
- `POST /api/money/withdrawals/:id/hold`
- `GET /api/portfolio-products`
- `GET /api/client-investments`
- `GET /api/support/tickets`
- `POST /api/support/tickets/:id/assign`
- `POST /api/support/tickets/:id/resolve`
