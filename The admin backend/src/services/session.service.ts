import type { AdminRole, AdminUser, Client } from "@prisma/client";
import type { Request, Response } from "express";
import jwt, { type SignOptions } from "jsonwebtoken";
import { env } from "../config/env";
import { randomToken } from "../lib/crypto";
import { ApiError, hashValue } from "../lib/http";
import { prisma } from "../lib/prisma";

type SessionActor =
  | { type: "CLIENT"; value: Client }
  | { type: "ADMIN"; value: AdminUser };

function cookieOptions(maxAge: number | undefined, httpOnly: boolean) {
  return {
    httpOnly,
    secure: env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    ...(maxAge ? { maxAge } : {})
  };
}

function actorPayload(actor: SessionActor, sessionId: string) {
  if (actor.type === "CLIENT") {
    return {
      id: actor.value.id,
      email: actor.value.email,
      role: "CLIENT" as const,
      name: actor.value.name,
      accountNumber: actor.value.accountNumber,
      actorType: "CLIENT" as const,
      sessionId
    };
  }
  return {
    id: actor.value.id,
    email: actor.value.email,
    role: actor.value.role as AdminRole,
    name: actor.value.name,
    actorType: "ADMIN" as const,
    sessionId
  };
}

function signAccessToken(actor: SessionActor, sessionId: string) {
  return jwt.sign(actorPayload(actor, sessionId), env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN
  } as SignOptions);
}

function refreshLifetime(actor: SessionActor) {
  return actor.type === "CLIENT"
    ? env.CLIENT_REFRESH_DAYS * 24 * 60 * 60 * 1000
    : env.ADMIN_REFRESH_HOURS * 60 * 60 * 1000;
}

function setSessionCookies(res: Response, actor: SessionActor, accessToken: string, refreshToken: string, csrfToken: string, maxAge: number) {
  const persistentAge = actor.type === "CLIENT" ? undefined : maxAge;
  res.cookie("bp_access", accessToken, cookieOptions(actor.type === "CLIENT" ? undefined : 15 * 60 * 1000, true));
  res.cookie("bp_refresh", refreshToken, cookieOptions(persistentAge, true));
  res.cookie("bp_csrf", csrfToken, cookieOptions(persistentAge, false));
}

export function clearSessionCookies(res: Response) {
  const options = { secure: env.NODE_ENV === "production", sameSite: "lax" as const, path: "/" };
  res.clearCookie("bp_access", options);
  res.clearCookie("bp_refresh", options);
  res.clearCookie("bp_csrf", options);
}

export async function createSession(actor: SessionActor, req: Request, res: Response) {
  const refreshToken = randomToken(48);
  const csrfToken = randomToken(24);
  const maxAge = refreshLifetime(actor);
  const session = await prisma.authSession.create({
    data: {
      actorType: actor.type,
      clientId: actor.type === "CLIENT" ? actor.value.id : undefined,
      adminId: actor.type === "ADMIN" ? actor.value.id : undefined,
      refreshTokenHash: hashValue(refreshToken),
      csrfTokenHash: hashValue(csrfToken),
      userAgent: req.get("user-agent")?.slice(0, 500),
      ipAddress: req.ip,
      expiresAt: new Date(Date.now() + maxAge)
    }
  });
  const accessToken = signAccessToken(actor, session.id);
  setSessionCookies(res, actor, accessToken, refreshToken, csrfToken, maxAge);
  return {
    csrfToken,
    expiresIn: 15 * 60,
    sessionId: session.id,
    refreshExpiresAt: session.expiresAt
  };
}

export async function rotateSession(req: Request, res: Response) {
  const raw = req.cookies?.bp_refresh || req.body?.refreshToken;
  if (!raw || typeof raw !== "string") throw new ApiError(401, "Refresh session is required", "REFRESH_REQUIRED");
  const current = await prisma.authSession.findUnique({
    where: { refreshTokenHash: hashValue(raw) },
    include: { client: true, admin: true }
  });
  if (!current) throw new ApiError(401, "Refresh session is invalid", "REFRESH_INVALID");
  if (current.revokedAt) {
    await prisma.authSession.updateMany({
      where: current.clientId ? { clientId: current.clientId } : { adminId: current.adminId },
      data: { revokedAt: new Date() }
    });
    throw new ApiError(401, "Refresh session reuse was detected", "REFRESH_REPLAY");
  }
  if (current.expiresAt <= new Date()) throw new ApiError(401, "Refresh session has expired", "REFRESH_EXPIRED");

  const actor: SessionActor = current.client
    ? { type: "CLIENT", value: current.client }
    : current.admin
      ? { type: "ADMIN", value: current.admin }
      : (() => { throw new ApiError(401, "Session actor no longer exists", "SESSION_INVALID"); })();
  const refreshToken = randomToken(48);
  const csrfToken = randomToken(24);
  const maxAge = refreshLifetime(actor);
  const next = await prisma.$transaction(async (tx) => {
    const revoked = await tx.authSession.updateMany({
      where: { id: current.id, revokedAt: null },
      data: { revokedAt: new Date(), lastUsedAt: new Date() }
    });
    if (revoked.count !== 1) return null;
    return tx.authSession.create({
      data: {
        actorType: actor.type,
        clientId: actor.type === "CLIENT" ? actor.value.id : undefined,
        adminId: actor.type === "ADMIN" ? actor.value.id : undefined,
        refreshTokenHash: hashValue(refreshToken),
        csrfTokenHash: hashValue(csrfToken),
        rotatedFromId: current.id,
        userAgent: req.get("user-agent")?.slice(0, 500),
        ipAddress: req.ip,
        expiresAt: new Date(Date.now() + maxAge)
      }
    });
  });
  if (!next) {
    await prisma.authSession.updateMany({
      where: current.clientId ? { clientId: current.clientId } : { adminId: current.adminId },
      data: { revokedAt: new Date() }
    });
    throw new ApiError(401, "Refresh session reuse was detected", "REFRESH_REPLAY");
  }
  const accessToken = signAccessToken(actor, next.id);
  setSessionCookies(res, actor, accessToken, refreshToken, csrfToken, maxAge);
  return { csrfToken, expiresIn: 15 * 60, sessionId: next.id, refreshExpiresAt: next.expiresAt };
}

export async function revokeSession(req: Request, res: Response) {
  const sessionId = req.user?.sessionId;
  const raw = req.cookies?.bp_refresh;
  if (sessionId) {
    await prisma.authSession.updateMany({ where: { id: sessionId }, data: { revokedAt: new Date() } });
  } else if (raw) {
    await prisma.authSession.updateMany({ where: { refreshTokenHash: hashValue(raw) }, data: { revokedAt: new Date() } });
  }
  clearSessionCookies(res);
}
