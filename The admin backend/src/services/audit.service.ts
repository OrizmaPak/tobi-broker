import type { ActorType, Prisma } from "@prisma/client";
import type { Request } from "express";
import { prisma } from "../lib/prisma";

type AuditContext = {
  req?: Request;
  actorId?: string;
  actorType?: ActorType;
  actorName?: string;
  reason?: string;
  before?: Prisma.InputJsonValue;
  after?: Prisma.InputJsonValue;
};

export async function writeAudit(
  action: string,
  entityType: string,
  entityId?: string,
  metadata?: Prisma.InputJsonObject,
  context: AuditContext = {}
) {
  const requestUser = context.req?.user;
  const actorType = context.actorType || (requestUser?.role === "CLIENT" ? "CLIENT" : requestUser ? "ADMIN" : "SYSTEM");
  return prisma.auditLog.create({
    data: {
      actorId: actorType === "ADMIN" ? (context.actorId || requestUser?.id) : undefined,
      actorType,
      actorName: context.actorName || requestUser?.name || "System",
      action,
      entityType,
      entityId,
      requestId: context.req?.res?.locals.requestId,
      ipAddress: context.req?.ip,
      userAgent: context.req?.get("user-agent")?.slice(0, 500),
      reason: context.reason,
      before: context.before,
      after: context.after,
      metadata
    }
  });
}
