import { prisma } from "../lib/prisma";
import type { Prisma } from "@prisma/client";

export async function writeAudit(
  action: string,
  entityType: string,
  entityId?: string,
  metadata?: Prisma.InputJsonObject
) {
  return prisma.auditLog.create({
    data: {
      actorName: "System",
      action,
      entityType,
      entityId,
      metadata
    }
  });
}
