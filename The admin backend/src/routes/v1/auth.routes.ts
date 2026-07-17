import { type ActorType } from "@prisma/client";
import bcrypt from "bcryptjs";
import { Router } from "express";
import { rateLimit } from "express-rate-limit";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { env } from "../../config/env";
import { createMfaSecret, decryptSecret, encryptSecret, randomCode, randomToken, verifyTotp } from "../../lib/crypto";
import { ApiError, asyncHandler, hashValue, ok } from "../../lib/http";
import { prisma } from "../../lib/prisma";
import { requireAdmin, requireClient, requireCsrf } from "../../middleware/auth";
import { notifyClient } from "../../services/notification.service";
import { clearSessionCookies, createSession, revokeSession, rotateSession } from "../../services/session.service";

export const v1AuthRouter = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: env.NODE_ENV === "test" ? 1_000 : 20,
  standardHeaders: "draft-8",
  legacyHeaders: false
});

const password = z.string().min(10).max(128)
  .regex(/[a-z]/, "Password must include a lowercase letter")
  .regex(/[A-Z]/, "Password must include an uppercase letter")
  .regex(/[0-9]/, "Password must include a number")
  .regex(/[^a-zA-Z0-9]/, "Password must include a symbol");

const loginSchema = z.object({ email: z.string().email().transform((value) => value.toLowerCase()), password: z.string().min(1), mfaCode: z.string().optional() });
const registerSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().email().transform((value) => value.toLowerCase()),
  password,
  country: z.string().trim().min(2).max(80).optional(),
  acceptedTerms: z.boolean().default(true)
});

function accountNumber() {
  return `BP-${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 90 + 10)}`;
}

async function recordAttempt(email: string, actorType: ActorType, succeeded: boolean, ipAddress?: string) {
  await prisma.loginAttempt.create({ data: { email, actorType, succeeded, ipAddress } });
}

function actorResponse(actor: { id: string; name: string; email: string; role?: string; accountNumber?: string; status?: string; riskLevel?: string; tier?: string }) {
  return {
    id: actor.id,
    name: actor.name,
    email: actor.email,
    ...(actor.role ? { role: actor.role } : {}),
    ...(actor.accountNumber ? { accountNumber: actor.accountNumber } : {}),
    ...(actor.status ? { status: actor.status } : {}),
    ...(actor.riskLevel ? { riskLevel: actor.riskLevel } : {}),
    ...(actor.tier ? { tier: actor.tier } : {})
  };
}

function clientMfaRequired() {
  return !["false", "0", "no", "off"].includes(String(process.env.CLIENT_MFA_REQUIRED || "true").toLowerCase());
}

v1AuthRouter.post("/client/register", authLimiter, asyncHandler(async (req, res) => {
  const input = registerSchema.parse(req.body);
  if (!input.acceptedTerms) throw new ApiError(422, "Terms and risk disclosures must be accepted", "TERMS_REQUIRED");
  const existing = await prisma.client.findUnique({ where: { email: input.email } });
  if (existing) throw new ApiError(409, "An account already exists for this email", "EMAIL_EXISTS");
  const passwordHash = await bcrypt.hash(input.password, 12);
  const rawVerificationToken = randomToken(32);
  const client = await prisma.$transaction(async (tx) => {
    const created = await tx.client.create({
      data: {
        accountNumber: accountNumber(),
        name: input.name,
        email: input.email,
        passwordHash,
        country: input.country,
        status: "PENDING",
        tier: "Standard",
        riskLevel: "MODERATE",
        preferences: { emailNotifications: true, inAppNotifications: true },
        wallet: { create: { balance: 0, available: 0, currency: "USD" } },
        kycReviews: { create: { requirement: "Identity and address verification", status: "NOT_STARTED" } },
        kycCases: { create: { status: "DRAFT", level: "Standard" } }
      }
    });
    await tx.verificationToken.create({
      data: {
        actorType: "CLIENT",
        actorId: created.id,
        purpose: "EMAIL_VERIFICATION",
        tokenHash: hashValue(rawVerificationToken),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
      }
    });
    return created;
  });
  const session = await createSession({ type: "CLIENT", value: client }, req, res);
  return ok(res, {
    session,
    client: actorResponse(client),
    emailVerificationRequired: false,
    ...(env.NODE_ENV !== "production" ? { verificationToken: rawVerificationToken } : {})
  }, 201);
}));

v1AuthRouter.post("/client/login", authLimiter, asyncHandler(async (req, res) => {
  const input = loginSchema.parse(req.body);
  const client = await prisma.client.findUnique({ where: { email: input.email }, include: { mfa: true } });
  const now = new Date();
  if (!client || !client.passwordHash || client.status === "SUSPENDED" || (client.lockedUntil && client.lockedUntil > now)) {
    await recordAttempt(input.email, "CLIENT", false, req.ip);
    throw new ApiError(401, "Invalid credentials or temporarily locked account", "INVALID_CREDENTIALS");
  }
  const valid = await bcrypt.compare(input.password, client.passwordHash);
  if (!valid) {
    const attempts = client.failedLoginAttempts + 1;
    await prisma.client.update({
      where: { id: client.id },
      data: { failedLoginAttempts: attempts, lockedUntil: attempts >= 5 ? new Date(Date.now() + 30 * 60 * 1000) : null }
    });
    await recordAttempt(input.email, "CLIENT", false, req.ip);
    throw new ApiError(401, "Invalid credentials", "INVALID_CREDENTIALS");
  }

  if (clientMfaRequired() && !client.mfa?.enabledAt) {
    const secret = createMfaSecret();
    const recoveryCodes = Array.from({ length: 8 }, () => randomCode(10));
    await prisma.clientMfa.upsert({
      where: { clientId: client.id },
      update: { secretEncrypted: encryptSecret(secret), recoveryCodeHashes: recoveryCodes.map(hashValue), enabledAt: null },
      create: { clientId: client.id, secretEncrypted: encryptSecret(secret), recoveryCodeHashes: recoveryCodes.map(hashValue) }
    });
    const setupToken = jwt.sign({ clientId: client.id, purpose: "CLIENT_MFA_SETUP" }, env.JWT_SECRET, { expiresIn: "10m" });
    return ok(res, {
      mfaSetupRequired: true,
      setupToken,
      secret,
      otpauthUrl: `otpauth://totp/BullPort:${encodeURIComponent(client.email)}?secret=${secret}&issuer=BullPort`,
      recoveryCodes
    });
  }

  if (clientMfaRequired() && client.mfa?.enabledAt) {
    if (!input.mfaCode) throw new ApiError(401, "MFA code is required", "MFA_REQUIRED");
    const secret = decryptSecret(client.mfa.secretEncrypted);
    const recoveryHashes = Array.isArray(client.mfa.recoveryCodeHashes) ? client.mfa.recoveryCodeHashes.map(String) : [];
    const suppliedHash = hashValue(input.mfaCode.toUpperCase());
    const recoveryIndex = recoveryHashes.indexOf(suppliedHash);
    if (!verifyTotp(secret, input.mfaCode) && recoveryIndex < 0) throw new ApiError(401, "MFA code is invalid", "MFA_INVALID");
    if (recoveryIndex >= 0) {
      recoveryHashes.splice(recoveryIndex, 1);
      await prisma.clientMfa.update({ where: { id: client.mfa.id }, data: { recoveryCodeHashes: recoveryHashes } });
    }
  }

  const updated = await prisma.client.update({
    where: { id: client.id },
    data: { failedLoginAttempts: 0, lockedUntil: null, lastLoginAt: now }
  });
  await recordAttempt(input.email, "CLIENT", true, req.ip);
  const session = await createSession({ type: "CLIENT", value: updated }, req, res);
  return ok(res, { session, client: actorResponse(updated), emailVerificationRequired: false });
}));

v1AuthRouter.post("/client/mfa/confirm", authLimiter, asyncHandler(async (req, res) => {
  const input = z.object({ setupToken: z.string().min(20), code: z.string().regex(/^\d{6}$/) }).parse(req.body);
  let payload: { clientId: string; purpose: string };
  try {
    payload = jwt.verify(input.setupToken, env.JWT_SECRET) as typeof payload;
  } catch {
    throw new ApiError(401, "MFA setup session is invalid or expired", "MFA_SETUP_EXPIRED");
  }
  if (payload.purpose !== "CLIENT_MFA_SETUP") throw new ApiError(401, "MFA setup session is invalid", "MFA_SETUP_INVALID");
  const client = await prisma.client.findUnique({ where: { id: payload.clientId }, include: { mfa: true } });
  if (!client?.mfa || !verifyTotp(decryptSecret(client.mfa.secretEncrypted), input.code)) throw new ApiError(422, "Authenticator code is invalid", "MFA_INVALID");
  await prisma.clientMfa.update({ where: { id: client.mfa.id }, data: { enabledAt: new Date() } });
  const updated = await prisma.client.update({ where: { id: client.id }, data: { failedLoginAttempts: 0, lockedUntil: null, lastLoginAt: new Date() } });
  await recordAttempt(client.email, "CLIENT", true, req.ip);
  const session = await createSession({ type: "CLIENT", value: updated }, req, res);
  return ok(res, { session, client: actorResponse(updated), emailVerificationRequired: false, mfaEnabled: true });
}));

v1AuthRouter.post("/client/verify-email", asyncHandler(async (req, res) => {
  const input = z.object({ token: z.string().min(20) }).parse(req.body);
  const token = await prisma.verificationToken.findUnique({ where: { tokenHash: hashValue(input.token) } });
  if (!token || token.purpose !== "EMAIL_VERIFICATION" || token.usedAt || token.expiresAt <= new Date()) {
    throw new ApiError(400, "Verification token is invalid or expired", "TOKEN_INVALID");
  }
  await prisma.$transaction([
    prisma.client.update({ where: { id: token.actorId }, data: { emailVerifiedAt: new Date() } }),
    prisma.verificationToken.update({ where: { id: token.id }, data: { usedAt: new Date() } })
  ]);
  return ok(res, { verified: true });
}));

v1AuthRouter.post("/client/resend-verification", requireClient, requireCsrf, authLimiter, asyncHandler(async (req, res) => {
  const client = await prisma.client.findUnique({ where: { id: req.user!.id } });
  if (!client) throw new ApiError(404, "Client not found", "CLIENT_NOT_FOUND");
  if (client.emailVerifiedAt) return ok(res, { accepted: true, alreadyVerified: true });
  const raw = randomToken(32);
  await prisma.$transaction(async (tx) => {
    await tx.verificationToken.updateMany({
      where: { actorType: "CLIENT", actorId: client.id, purpose: "EMAIL_VERIFICATION", usedAt: null },
      data: { usedAt: new Date() }
    });
    await tx.verificationToken.create({
      data: {
        actorType: "CLIENT",
        actorId: client.id,
        purpose: "EMAIL_VERIFICATION",
        tokenHash: hashValue(raw),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
      }
    });
  });
  await notifyClient({
    clientId: client.id,
    email: client.email,
    category: "Onboarding",
    title: "Verify your BullPort email",
    body: `Verify your email to continue onboarding. Verification token: ${raw}`,
    actionUrl: "kyc.html"
  });
  return ok(res, { accepted: true, ...(env.NODE_ENV !== "production" ? { verificationToken: raw } : {}) });
}));

v1AuthRouter.post("/forgot-password", authLimiter, asyncHandler(async (req, res) => {
  const input = z.object({ email: z.string().email().transform((value) => value.toLowerCase()), actorType: z.enum(["CLIENT", "ADMIN"]).default("CLIENT") }).parse(req.body);
  const actor = input.actorType === "CLIENT"
    ? await prisma.client.findUnique({ where: { email: input.email } })
    : await prisma.adminUser.findUnique({ where: { email: input.email } });
  if (actor) {
    const raw = randomToken(32);
    await prisma.verificationToken.create({
      data: {
        actorType: input.actorType,
        actorId: actor.id,
        purpose: "PASSWORD_RESET",
        tokenHash: hashValue(raw),
        expiresAt: new Date(Date.now() + 60 * 60 * 1000)
      }
    });
    if (input.actorType === "CLIENT") {
      await notifyClient({ clientId: actor.id, email: actor.email, category: "Security", title: "Reset your BullPort password", body: `Password reset token: ${raw}` });
    }
    if (env.NODE_ENV !== "production") res.setHeader("x-bullport-reset-token", raw);
  }
  return ok(res, { accepted: true, message: "If the account exists, reset instructions have been sent." });
}));

v1AuthRouter.post("/reset-password", authLimiter, asyncHandler(async (req, res) => {
  const input = z.object({ token: z.string().min(20), password }).parse(req.body);
  const token = await prisma.verificationToken.findUnique({ where: { tokenHash: hashValue(input.token) } });
  if (!token || token.purpose !== "PASSWORD_RESET" || token.usedAt || token.expiresAt <= new Date()) {
    throw new ApiError(400, "Reset token is invalid or expired", "TOKEN_INVALID");
  }
  const passwordHash = await bcrypt.hash(input.password, 12);
  await prisma.$transaction(async (tx) => {
    if (token.actorType === "CLIENT") await tx.client.update({ where: { id: token.actorId }, data: { passwordHash, failedLoginAttempts: 0, lockedUntil: null } });
    else await tx.adminUser.update({ where: { id: token.actorId }, data: { passwordHash, failedLoginAttempts: 0, lockedUntil: null } });
    await tx.authSession.updateMany({ where: token.actorType === "CLIENT" ? { clientId: token.actorId } : { adminId: token.actorId }, data: { revokedAt: new Date() } });
    await tx.verificationToken.update({ where: { id: token.id }, data: { usedAt: new Date() } });
  });
  clearSessionCookies(res);
  return ok(res, { reset: true });
}));

v1AuthRouter.post("/admin/login", authLimiter, asyncHandler(async (req, res) => {
  const input = loginSchema.parse(req.body);
  const admin = await prisma.adminUser.findUnique({ where: { email: input.email }, include: { mfa: true } });
  const now = new Date();
  if (!admin || !admin.isActive || (admin.lockedUntil && admin.lockedUntil > now)) {
    await recordAttempt(input.email, "ADMIN", false, req.ip);
    throw new ApiError(401, "Invalid credentials or temporarily locked account", "INVALID_CREDENTIALS");
  }
  const valid = await bcrypt.compare(input.password, admin.passwordHash);
  if (!valid) {
    const attempts = admin.failedLoginAttempts + 1;
    await prisma.adminUser.update({ where: { id: admin.id }, data: { failedLoginAttempts: attempts, lockedUntil: attempts >= 5 ? new Date(Date.now() + 30 * 60 * 1000) : null } });
    await recordAttempt(input.email, "ADMIN", false, req.ip);
    throw new ApiError(401, "Invalid credentials", "INVALID_CREDENTIALS");
  }

  if (env.ADMIN_MFA_REQUIRED && !admin.mfa?.enabledAt) {
    const secret = createMfaSecret();
    const recoveryCodes = Array.from({ length: 8 }, () => randomCode(10));
    await prisma.adminMfa.upsert({
      where: { adminId: admin.id },
      update: { secretEncrypted: encryptSecret(secret), recoveryCodeHashes: recoveryCodes.map(hashValue), enabledAt: null },
      create: { adminId: admin.id, secretEncrypted: encryptSecret(secret), recoveryCodeHashes: recoveryCodes.map(hashValue) }
    });
    const setupToken = jwt.sign({ adminId: admin.id, purpose: "MFA_SETUP" }, env.JWT_SECRET, { expiresIn: "10m" });
    return ok(res, {
      mfaSetupRequired: true,
      setupToken,
      secret,
      otpauthUrl: `otpauth://totp/BullPort:${encodeURIComponent(admin.email)}?secret=${secret}&issuer=BullPort`,
      recoveryCodes
    });
  }

  if (env.ADMIN_MFA_REQUIRED && admin.mfa?.enabledAt) {
    if (!input.mfaCode) throw new ApiError(401, "MFA code is required", "MFA_REQUIRED");
    const secret = decryptSecret(admin.mfa.secretEncrypted);
    const recoveryHashes = Array.isArray(admin.mfa.recoveryCodeHashes) ? admin.mfa.recoveryCodeHashes.map(String) : [];
    const suppliedHash = hashValue(input.mfaCode.toUpperCase());
    const recoveryIndex = recoveryHashes.indexOf(suppliedHash);
    if (!verifyTotp(secret, input.mfaCode) && recoveryIndex < 0) throw new ApiError(401, "MFA code is invalid", "MFA_INVALID");
    if (recoveryIndex >= 0) {
      recoveryHashes.splice(recoveryIndex, 1);
      await prisma.adminMfa.update({ where: { id: admin.mfa.id }, data: { recoveryCodeHashes: recoveryHashes } });
    }
  }

  const updated = await prisma.adminUser.update({ where: { id: admin.id }, data: { failedLoginAttempts: 0, lockedUntil: null, lastLoginAt: now } });
  await recordAttempt(input.email, "ADMIN", true, req.ip);
  const session = await createSession({ type: "ADMIN", value: updated }, req, res);
  return ok(res, { session, admin: actorResponse({ ...updated, role: updated.role }) });
}));

v1AuthRouter.post("/admin/mfa/confirm", authLimiter, asyncHandler(async (req, res) => {
  const input = z.object({ setupToken: z.string().min(20), code: z.string().regex(/^\d{6}$/) }).parse(req.body);
  let payload: { adminId: string; purpose: string };
  try {
    payload = jwt.verify(input.setupToken, env.JWT_SECRET) as typeof payload;
  } catch {
    throw new ApiError(401, "MFA setup session is invalid or expired", "MFA_SETUP_EXPIRED");
  }
  if (payload.purpose !== "MFA_SETUP") throw new ApiError(401, "MFA setup session is invalid", "MFA_SETUP_INVALID");
  const admin = await prisma.adminUser.findUnique({ where: { id: payload.adminId }, include: { mfa: true } });
  if (!admin?.mfa || !verifyTotp(decryptSecret(admin.mfa.secretEncrypted), input.code)) throw new ApiError(422, "Authenticator code is invalid", "MFA_INVALID");
  await prisma.adminMfa.update({ where: { id: admin.mfa.id }, data: { enabledAt: new Date() } });
  const session = await createSession({ type: "ADMIN", value: admin }, req, res);
  return ok(res, { session, admin: actorResponse({ ...admin, role: admin.role }), mfaEnabled: true });
}));

v1AuthRouter.post("/refresh", authLimiter, asyncHandler(async (req, res) => ok(res, await rotateSession(req, res))));

v1AuthRouter.post("/client/logout", requireClient, requireCsrf, asyncHandler(async (req, res) => {
  await revokeSession(req, res);
  return ok(res, { loggedOut: true });
}));

v1AuthRouter.post("/admin/logout", requireAdmin, requireCsrf, asyncHandler(async (req, res) => {
  await revokeSession(req, res);
  return ok(res, { loggedOut: true });
}));

const changePasswordSchema = z.object({ currentPassword: z.string().min(1), newPassword: password });

v1AuthRouter.post("/client/change-password", requireClient, requireCsrf, asyncHandler(async (req, res) => {
  const input = changePasswordSchema.parse(req.body);
  const client = await prisma.client.findUnique({ where: { id: req.user!.id } });
  if (!client?.passwordHash || !await bcrypt.compare(input.currentPassword, client.passwordHash)) {
    throw new ApiError(422, "Current password is incorrect", "CURRENT_PASSWORD_INVALID");
  }
  if (await bcrypt.compare(input.newPassword, client.passwordHash)) {
    throw new ApiError(422, "New password must be different", "PASSWORD_UNCHANGED");
  }
  const passwordHash = await bcrypt.hash(input.newPassword, 12);
  await prisma.$transaction([
    prisma.client.update({ where: { id: client.id }, data: { passwordHash } }),
    prisma.authSession.updateMany({
      where: { clientId: client.id, id: { not: req.user!.sessionId }, revokedAt: null },
      data: { revokedAt: new Date() }
    })
  ]);
  return ok(res, { changed: true, otherSessionsRevoked: true });
}));

v1AuthRouter.post("/admin/change-password", requireAdmin, requireCsrf, asyncHandler(async (req, res) => {
  const input = changePasswordSchema.parse(req.body);
  const admin = await prisma.adminUser.findUnique({ where: { id: req.user!.id } });
  if (!admin || !await bcrypt.compare(input.currentPassword, admin.passwordHash)) {
    throw new ApiError(422, "Current password is incorrect", "CURRENT_PASSWORD_INVALID");
  }
  if (await bcrypt.compare(input.newPassword, admin.passwordHash)) {
    throw new ApiError(422, "New password must be different", "PASSWORD_UNCHANGED");
  }
  const passwordHash = await bcrypt.hash(input.newPassword, 12);
  await prisma.$transaction([
    prisma.adminUser.update({ where: { id: admin.id }, data: { passwordHash } }),
    prisma.authSession.updateMany({
      where: { adminId: admin.id, id: { not: req.user!.sessionId }, revokedAt: null },
      data: { revokedAt: new Date() }
    })
  ]);
  return ok(res, { changed: true, otherSessionsRevoked: true });
}));

v1AuthRouter.get("/client/me", requireClient, asyncHandler(async (req, res) => {
  const client = await prisma.client.findUnique({ where: { id: req.user!.id } });
  if (!client) throw new ApiError(404, "Client not found", "CLIENT_NOT_FOUND");
  return ok(res, actorResponse(client));
}));

v1AuthRouter.get("/admin/me", requireAdmin, asyncHandler(async (req, res) => {
  const admin = await prisma.adminUser.findUnique({ where: { id: req.user!.id }, include: { mfa: { select: { enabledAt: true } } } });
  if (!admin) throw new ApiError(404, "Admin not found", "ADMIN_NOT_FOUND");
  return ok(res, { ...actorResponse({ ...admin, role: admin.role }), mfaEnabled: Boolean(admin.mfa?.enabledAt) });
}));

async function listSessions(req: Parameters<typeof requireClient>[0], res: Parameters<typeof requireClient>[1]) {
  const sessions = await prisma.authSession.findMany({
    where: req.user!.role === "CLIENT" ? { clientId: req.user!.id, revokedAt: null } : { adminId: req.user!.id, revokedAt: null },
    select: { id: true, userAgent: true, ipAddress: true, lastUsedAt: true, expiresAt: true, createdAt: true },
    orderBy: { lastUsedAt: "desc" }
  });
  return ok(res, sessions);
}

v1AuthRouter.get("/client/sessions", requireClient, asyncHandler(listSessions));
v1AuthRouter.get("/admin/sessions", requireAdmin, asyncHandler(listSessions));

v1AuthRouter.delete("/client/sessions/:id", requireClient, requireCsrf, asyncHandler(async (req, res) => {
  const session = await prisma.authSession.findFirst({ where: { id: String(req.params.id), clientId: req.user!.id } });
  if (!session) throw new ApiError(404, "Session not found", "SESSION_NOT_FOUND");
  await prisma.authSession.update({ where: { id: session.id }, data: { revokedAt: new Date() } });
  if (session.id === req.user!.sessionId) clearSessionCookies(res);
  return ok(res, { revoked: true, currentSession: session.id === req.user!.sessionId });
}));

v1AuthRouter.delete("/admin/sessions/:id", requireAdmin, requireCsrf, asyncHandler(async (req, res) => {
  const session = await prisma.authSession.findFirst({ where: { id: String(req.params.id), adminId: req.user!.id } });
  if (!session) throw new ApiError(404, "Session not found", "SESSION_NOT_FOUND");
  await prisma.authSession.update({ where: { id: session.id }, data: { revokedAt: new Date() } });
  if (session.id === req.user!.sessionId) clearSessionCookies(res);
  return ok(res, { revoked: true, currentSession: session.id === req.user!.sessionId });
}));
