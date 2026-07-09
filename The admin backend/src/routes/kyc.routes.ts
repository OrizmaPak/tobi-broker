import { Router } from "express";
import { z } from "zod";
import { asyncHandler, ok } from "../lib/http";
import { prisma } from "../lib/prisma";
import { writeAudit } from "../services/audit.service";

export const kycRouter = Router();

const decisionSchema = z.object({
  note: z.string().optional()
});

kycRouter.get("/reviews", asyncHandler(async (_req, res) => {
  const reviews = await prisma.kycReview.findMany({
    include: { client: true },
    orderBy: { updatedAt: "desc" }
  });
  return ok(res, reviews);
}));

kycRouter.post("/reviews/:id/approve", asyncHandler(async (req, res) => {
  const input = decisionSchema.parse(req.body);
  const reviewId = String(req.params.id);
  const review = await prisma.kycReview.update({
    where: { id: reviewId },
    data: { status: "APPROVED", decisionNote: input.note }
  });
  await writeAudit("approveKyc", "KycReview", review.id, { note: input.note });
  return ok(res, review);
}));

kycRouter.post("/reviews/:id/reject", asyncHandler(async (req, res) => {
  const input = decisionSchema.parse(req.body);
  const reviewId = String(req.params.id);
  const review = await prisma.kycReview.update({
    where: { id: reviewId },
    data: { status: "REJECTED", decisionNote: input.note }
  });
  await writeAudit("rejectKyc", "KycReview", review.id, { note: input.note });
  return ok(res, review);
}));

kycRouter.post("/reviews/:id/request-resubmission", asyncHandler(async (req, res) => {
  const input = decisionSchema.parse(req.body);
  const reviewId = String(req.params.id);
  const review = await prisma.kycReview.update({
    where: { id: reviewId },
    data: { status: "RESUBMISSION_REQUIRED", decisionNote: input.note }
  });
  await writeAudit("requestKycResubmission", "KycReview", review.id, { note: input.note });
  return ok(res, review);
}));
