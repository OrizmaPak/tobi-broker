import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt, { type SignOptions } from "jsonwebtoken";
import { z } from "zod";
import { env } from "../config/env";
import { ApiError, asyncHandler, ok } from "../lib/http";
import { prisma } from "../lib/prisma";
import { notifyClientTx } from "../services/notification.service";

export const authRouter = Router();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

const registerSchema = loginSchema.extend({
  name: z.string().min(2),
  country: z.string().optional()
});

authRouter.post("/admin/login", asyncHandler(async (req, res) => {
  const input = loginSchema.parse(req.body);
  const admin = await prisma.adminUser.findUnique({ where: { email: input.email } });
  if (!admin || !admin.isActive) throw new ApiError(401, "Invalid credentials");

  const valid = await bcrypt.compare(input.password, admin.passwordHash);
  if (!valid) throw new ApiError(401, "Invalid credentials");

  const token = jwt.sign(
    { id: admin.id, email: admin.email, role: admin.role, name: admin.name },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN } as SignOptions
  );

  return ok(res, {
    token,
    admin: { id: admin.id, name: admin.name, email: admin.email, role: admin.role }
  });
}));

authRouter.post("/client/login", asyncHandler(async (req, res) => {
  const input = loginSchema.parse(req.body);
  const client = await prisma.client.findUnique({ where: { email: input.email } });
  if (!client || !client.passwordHash || client.status === "SUSPENDED") {
    throw new ApiError(401, "Invalid credentials");
  }

  const valid = await bcrypt.compare(input.password, client.passwordHash);
  if (!valid) throw new ApiError(401, "Invalid credentials");

  const token = jwt.sign(
    {
      id: client.id,
      email: client.email,
      role: "CLIENT",
      name: client.name,
      accountNumber: client.accountNumber
    },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN } as SignOptions
  );

  return ok(res, {
    token,
    client: {
      id: client.id,
      accountNumber: client.accountNumber,
      name: client.name,
      email: client.email,
      status: client.status,
      riskLevel: client.riskLevel,
      tier: client.tier
    }
  });
}));

authRouter.post("/client/register", asyncHandler(async (req, res) => {
  const input = registerSchema.parse(req.body);
  const existing = await prisma.client.findUnique({ where: { email: input.email } });
  if (existing) throw new ApiError(409, "A client account already exists for this email");

  const passwordHash = await bcrypt.hash(input.password, 10);
  const accountNumber = "BP-" + String(Date.now()).slice(-6);

  const client = await prisma.$transaction(async (tx) => {
    const created = await tx.client.create({
      data: {
        accountNumber,
        name: input.name,
        email: input.email,
        passwordHash,
        status: "PENDING",
        tier: "Standard",
        riskLevel: "MODERATE"
      }
    });

    await tx.walletAccount.create({
      data: {
        clientId: created.id,
        balance: 0,
        available: 0
      }
    });

    await tx.kycReview.create({
      data: {
        clientId: created.id,
        requirement: "Identity and address verification",
        status: "NOT_STARTED",
        documentRef: input.country ? `Country: ${input.country}` : undefined
      }
    });

    await notifyClientTx(tx, {
      clientId: created.id,
      category: "Onboarding",
      eventKey: "kyc.onboarding.required",
      severity: "WARNING",
      title: "Complete KYC verification",
      body: "Submit your identity and address documents before withdrawals or advanced access.",
      actionUrl: "kyc.html",
      entity: { type: "Client", id: created.id },
      dedupeKey: `kyc.onboarding.required:${created.id}`
    });

    return created;
  });

  const token = jwt.sign(
    {
      id: client.id,
      email: client.email,
      role: "CLIENT",
      name: client.name,
      accountNumber: client.accountNumber
    },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN } as SignOptions
  );

  return ok(res, {
    token,
    client: {
      id: client.id,
      accountNumber: client.accountNumber,
      name: client.name,
      email: client.email,
      status: client.status,
      riskLevel: client.riskLevel,
      tier: client.tier
    }
  }, 201);
}));
