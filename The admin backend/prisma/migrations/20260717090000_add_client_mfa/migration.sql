CREATE TABLE "ClientMfa" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "secretEncrypted" TEXT NOT NULL,
    "recoveryCodeHashes" JSONB NOT NULL,
    "enabledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClientMfa_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ClientMfa_clientId_key" ON "ClientMfa"("clientId");

ALTER TABLE "ClientMfa" ADD CONSTRAINT "ClientMfa_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;
