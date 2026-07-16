-- Enum values are committed separately because subsequent broker tables and
-- defaults depend on them. PostgreSQL does not permit using a newly-added enum
-- value until the transaction that added it has committed.
ALTER TYPE "InvestmentStatus" ADD VALUE 'FUNDED';
ALTER TYPE "InvestmentStatus" ADD VALUE 'CANCELLED';

ALTER TYPE "KycStatus" ADD VALUE 'DRAFT';
ALTER TYPE "KycStatus" ADD VALUE 'SUBMITTED';
ALTER TYPE "KycStatus" ADD VALUE 'EXPIRED';

ALTER TYPE "MoneyStatus" ADD VALUE 'REQUESTED';
ALTER TYPE "MoneyStatus" ADD VALUE 'UNDER_REVIEW';
ALTER TYPE "MoneyStatus" ADD VALUE 'AWAITING_APPROVAL';
ALTER TYPE "MoneyStatus" ADD VALUE 'PROCESSING';
ALTER TYPE "MoneyStatus" ADD VALUE 'PAID';
ALTER TYPE "MoneyStatus" ADD VALUE 'CANCELLED';
ALTER TYPE "MoneyStatus" ADD VALUE 'REVERSED';
ALTER TYPE "MoneyStatus" ADD VALUE 'FAILED';

ALTER TYPE "ProductStatus" ADD VALUE 'PENDING_APPROVAL';
ALTER TYPE "ProductStatus" ADD VALUE 'ARCHIVED';

ALTER TYPE "TicketStatus" ADD VALUE 'CLOSED';
