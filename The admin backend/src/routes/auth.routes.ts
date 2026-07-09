import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt, { type SignOptions } from "jsonwebtoken";
import { z } from "zod";
import { env } from "../config/env";
import { ApiError, asyncHandler, ok } from "../lib/http";
import { prisma } from "../lib/prisma";

export const authRouter = Router();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
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
