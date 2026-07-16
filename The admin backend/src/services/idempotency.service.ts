import { Prisma } from "@prisma/client";
import type { Request } from "express";
import { ApiError, hashValue } from "../lib/http";
import { prisma } from "../lib/prisma";

export async function idempotentMutation<T>(
  req: Request,
  actorId: string,
  route: string,
  handler: (tx: Prisma.TransactionClient) => Promise<T>
) {
  const key = req.get("idempotency-key")?.trim();
  if (!key || key.length < 8 || key.length > 128) {
    throw new ApiError(400, "A valid Idempotency-Key header is required", "IDEMPOTENCY_KEY_REQUIRED");
  }
  const requestHash = hashValue(JSON.stringify(req.body ?? {}));
  return prisma.$transaction(async (tx) => {
    const existing = await tx.idempotencyRecord.findUnique({ where: { key_actorId_route: { key, actorId, route } } });
    if (existing) {
      if (existing.requestHash !== requestHash) throw new ApiError(409, "Idempotency key was already used with different data", "IDEMPOTENCY_CONFLICT");
      return { data: existing.responseBody as T, cached: true };
    }
    const data = await handler(tx);
    const serialized = JSON.parse(JSON.stringify(data)) as Prisma.InputJsonValue;
    await tx.idempotencyRecord.create({
      data: {
        key,
        actorId,
        route,
        requestHash,
        responseStatus: 201,
        responseBody: serialized,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
      }
    });
    return { data, cached: false };
  }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
}
