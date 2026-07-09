import { Router } from "express";
import { z } from "zod";
import { asyncHandler, ok } from "../lib/http";
import { prisma } from "../lib/prisma";
import { writeAudit } from "../services/audit.service";

export const clientRouter = Router();

clientRouter.get("/", asyncHandler(async (req, res) => {
  const q = typeof req.query.q === "string" ? req.query.q : undefined;
  const clients = await prisma.client.findMany({
    where: q ? {
      OR: [
        { name: { contains: q, mode: "insensitive" } },
        { email: { contains: q, mode: "insensitive" } },
        { accountNumber: { contains: q, mode: "insensitive" } }
      ]
    } : undefined,
    include: { wallet: true },
    orderBy: { createdAt: "desc" }
  });
  return ok(res, clients);
}));

clientRouter.get("/:id", asyncHandler(async (req, res) => {
  const clientId = String(req.params.id);
  const client = await prisma.client.findUnique({
    where: { id: clientId },
    include: {
      wallet: { include: { ledger: { orderBy: { createdAt: "desc" }, take: 20 } } },
      kycReviews: true,
      deposits: { orderBy: { createdAt: "desc" } },
      withdrawals: { orderBy: { createdAt: "desc" } },
      investments: { include: { product: true } },
      tickets: { orderBy: { createdAt: "desc" } },
      notes: { orderBy: { createdAt: "desc" } }
    }
  });
  return ok(res, client);
}));

const noteSchema = z.object({
  category: z.string().min(1),
  body: z.string().min(1),
  createdBy: z.string().optional()
});

clientRouter.post("/:id/notes", asyncHandler(async (req, res) => {
  const input = noteSchema.parse(req.body);
  const clientId = String(req.params.id);
  const note = await prisma.clientNote.create({
    data: { clientId, ...input }
  });
  await writeAudit("createClientNote", "Client", clientId, { category: input.category });
  return ok(res, note, 201);
}));
