import { Router } from "express";
import { asyncHandler, ok } from "../lib/http";
import { prisma } from "../lib/prisma";

export const portfolioRouter = Router();

portfolioRouter.get("/portfolio-products", asyncHandler(async (_req, res) => {
  const products = await prisma.portfolioProduct.findMany({
    orderBy: { name: "asc" }
  });
  return ok(res, products);
}));

portfolioRouter.get("/client-investments", asyncHandler(async (_req, res) => {
  const investments = await prisma.clientInvestment.findMany({
    include: { client: true, product: true },
    orderBy: { updatedAt: "desc" }
  });
  return ok(res, investments);
}));

portfolioRouter.get("/instruments", asyncHandler(async (_req, res) => {
  const instruments = await prisma.instrument.findMany({
    orderBy: { symbol: "asc" }
  });
  return ok(res, instruments);
}));

portfolioRouter.get("/payouts", asyncHandler(async (_req, res) => {
  const payouts = await prisma.payout.findMany({
    include: { client: true },
    orderBy: { payoutDate: "desc" }
  });
  return ok(res, payouts);
}));
