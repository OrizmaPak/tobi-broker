import { Router } from "express";
import { asyncHandler, ok } from "../lib/http";
import { prisma } from "../lib/prisma";

export const auditRouter = Router();

auditRouter.get("/", asyncHandler(async (_req, res) => {
  const logs = await prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 100
  });
  return ok(res, logs);
}));
