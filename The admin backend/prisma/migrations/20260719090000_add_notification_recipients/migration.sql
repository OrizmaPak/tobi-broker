CREATE TYPE "NotificationRecipientType" AS ENUM ('CLIENT', 'ADMIN');

CREATE TYPE "NotificationSeverity" AS ENUM ('INFO', 'SUCCESS', 'WARNING', 'CRITICAL');

ALTER TABLE "Notification"
ADD COLUMN "recipientType" "NotificationRecipientType",
ADD COLUMN "recipientId" TEXT,
ADD COLUMN "eventKey" TEXT,
ADD COLUMN "severity" "NotificationSeverity",
ADD COLUMN "entityType" TEXT,
ADD COLUMN "entityId" TEXT,
ADD COLUMN "metadata" JSONB,
ADD COLUMN "dedupeKey" TEXT;

UPDATE "Notification"
SET
  "recipientType" = 'CLIENT',
  "recipientId" = COALESCE("clientId", 'legacy-client'),
  "severity" = 'INFO';

ALTER TABLE "Notification"
ALTER COLUMN "recipientType" SET DEFAULT 'CLIENT',
ALTER COLUMN "recipientType" SET NOT NULL,
ALTER COLUMN "recipientId" SET NOT NULL,
ALTER COLUMN "severity" SET DEFAULT 'INFO',
ALTER COLUMN "severity" SET NOT NULL;

CREATE UNIQUE INDEX "Notification_dedupeKey_key" ON "Notification"("dedupeKey");
CREATE INDEX "Notification_recipientType_recipientId_readAt_createdAt_idx" ON "Notification"("recipientType", "recipientId", "readAt", "createdAt");
CREATE INDEX "Notification_eventKey_createdAt_idx" ON "Notification"("eventKey", "createdAt");
CREATE INDEX "Notification_entityType_entityId_idx" ON "Notification"("entityType", "entityId");
