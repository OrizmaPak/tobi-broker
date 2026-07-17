CREATE TABLE "KycDocumentRequirement" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "documentType" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "uploadMode" TEXT NOT NULL DEFAULT 'FRONT_ONLY',
    "isRequired" BOOLEAN NOT NULL DEFAULT true,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdByAdminId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KycDocumentRequirement_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "KycDocument"
ADD COLUMN "requirementId" TEXT,
ADD COLUMN "side" TEXT NOT NULL DEFAULT 'FRONT';

CREATE UNIQUE INDEX "KycDocumentRequirement_code_key" ON "KycDocumentRequirement"("code");
CREATE INDEX "KycDocumentRequirement_isActive_sortOrder_idx" ON "KycDocumentRequirement"("isActive", "sortOrder");
CREATE INDEX "KycDocument_caseId_requirementId_side_uploadedAt_idx" ON "KycDocument"("caseId", "requirementId", "side", "uploadedAt");

ALTER TABLE "KycDocument"
ADD CONSTRAINT "KycDocument_requirementId_fkey"
FOREIGN KEY ("requirementId") REFERENCES "KycDocumentRequirement"("id") ON DELETE SET NULL ON UPDATE CASCADE;

INSERT INTO "KycDocumentRequirement" (
    "id", "code", "documentType", "description", "uploadMode", "isRequired", "isActive", "sortOrder", "updatedAt"
) VALUES
    ('kyc_req_identity', 'GOVERNMENT_ID', 'Government-issued ID', 'Upload a valid passport, national identity card, or driver licence. The document must be clear and unexpired.', 'FRONT_BACK', true, true, 10, CURRENT_TIMESTAMP),
    ('kyc_req_address', 'PROOF_OF_ADDRESS', 'Proof of address', 'Upload a bank statement, utility bill, or government letter issued within the last three months.', 'FRONT_ONLY', true, true, 20, CURRENT_TIMESTAMP),
    ('kyc_req_funds', 'SOURCE_OF_FUNDS', 'Source of funds', 'Upload evidence that explains how the funds used on BullPort were obtained.', 'FRONT_ONLY', false, true, 30, CURRENT_TIMESTAMP)
ON CONFLICT ("code") DO NOTHING;

UPDATE "KycDocument" AS document
SET "requirementId" = requirement."id",
    "side" = 'FRONT'
FROM "KycDocumentRequirement" AS requirement
WHERE document."requirementId" IS NULL
  AND (
    (LOWER(document."type") LIKE '%government%' AND requirement."code" = 'GOVERNMENT_ID') OR
    (LOWER(document."type") LIKE '%address%' AND requirement."code" = 'PROOF_OF_ADDRESS') OR
    (LOWER(document."type") LIKE '%fund%' AND requirement."code" = 'SOURCE_OF_FUNDS')
  );
