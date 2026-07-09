import { Router } from "express";
import { z } from "zod";
import { asyncHandler, ok } from "../lib/http";
import { prisma } from "../lib/prisma";
import { writeAudit } from "../services/audit.service";

export const supportRouter = Router();

const assignSchema = z.object({
  owner: z.string().min(1),
  priority: z.string().optional()
});

supportRouter.get("/tickets", asyncHandler(async (_req, res) => {
  const tickets = await prisma.supportTicket.findMany({
    include: { client: true },
    orderBy: { updatedAt: "desc" }
  });
  return ok(res, tickets);
}));

supportRouter.post("/tickets/:id/assign", asyncHandler(async (req, res) => {
  const input = assignSchema.parse(req.body);
  const ticketId = String(req.params.id);
  const ticket = await prisma.supportTicket.update({
    where: { id: ticketId },
    data: {
      owner: input.owner,
      priority: input.priority,
      status: "AWAITING_BROKER"
    }
  });
  await writeAudit("assignSupportTicket", "SupportTicket", ticket.id, input);
  return ok(res, ticket);
}));

supportRouter.post("/tickets/:id/resolve", asyncHandler(async (req, res) => {
  const ticketId = String(req.params.id);
  const ticket = await prisma.supportTicket.update({
    where: { id: ticketId },
    data: { status: "RESOLVED" }
  });
  await writeAudit("resolveSupportTicket", "SupportTicket", ticket.id);
  return ok(res, ticket);
}));
