import type { AdminRole } from "@prisma/client";
import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { ApiError, hashValue } from "../lib/http";
import { prisma } from "../lib/prisma";

export type AuthUser = {
  id: string;
  email: string;
  role: AdminRole | "CLIENT";
  name: string;
  accountNumber?: string;
  sessionId?: string;
  actorType?: "CLIENT" | "ADMIN";
};

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

function accessToken(req: Request) {
  const header = req.headers.authorization;
  if (header?.startsWith("Bearer ")) return header.slice(7);
  return req.cookies?.bp_access as string | undefined;
}

function authenticate(req: Request) {
  const token = accessToken(req);
  if (!token) throw new ApiError(401, "Authentication is required", "AUTH_REQUIRED");
  try {
    return jwt.verify(token, env.JWT_SECRET) as AuthUser;
  } catch {
    throw new ApiError(401, "Session has expired", "SESSION_EXPIRED");
  }
}

async function activeUser(req: Request) {
  const user = authenticate(req);
  if (!user.sessionId) throw new ApiError(401, "Session is invalid", "SESSION_INVALID");
  const session = await prisma.authSession.findFirst({
    where: {
      id: user.sessionId,
      revokedAt: null,
      expiresAt: { gt: new Date() },
      ...(user.role === "CLIENT" ? { clientId: user.id } : { adminId: user.id })
    },
    select: { id: true }
  });
  if (!session) throw new ApiError(401, "Session has been revoked or expired", "SESSION_REVOKED");
  return user;
}

export function optionalAuth(req: Request, _res: Response, next: NextFunction) {
  if (!accessToken(req)) return next();
  activeUser(req).then((user) => {
    req.user = user;
    next();
  }).catch(() => next());
}

export function requireAdmin(req: Request, _res: Response, next: NextFunction) {
  activeUser(req).then((user) => {
    req.user = user;
    if (req.user.role === "CLIENT") throw new ApiError(403, "Admin access is required", "FORBIDDEN");
    next();
  }).catch(next);
}

export function requireClient(req: Request, _res: Response, next: NextFunction) {
  activeUser(req).then((user) => {
    req.user = user;
    if (req.user.role !== "CLIENT") throw new ApiError(403, "Client access is required", "FORBIDDEN");
    next();
  }).catch(next);
}

export function requireAdminRoles(...roles: AdminRole[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const authorize = async () => {
      req.user = req.user || await activeUser(req);
      if (req.user.role === "CLIENT" || !roles.includes(req.user.role)) {
        throw new ApiError(403, "Your role cannot perform this action", "ROLE_FORBIDDEN");
      }
      next();
    };
    authorize().catch(next);
  };
}

export async function requireCsrf(req: Request, _res: Response, next: NextFunction) {
  try {
    if (["GET", "HEAD", "OPTIONS"].includes(req.method)) return next();
    if (req.headers.authorization?.startsWith("Bearer ")) return next();
    const header = req.headers["x-csrf-token"];
    const cookie = req.cookies?.bp_csrf;
    if (!header || typeof header !== "string" || !cookie || header !== cookie) {
      throw new ApiError(403, "CSRF validation failed", "CSRF_FAILED");
    }
    const user = req.user || authenticate(req);
    if (!user.sessionId) throw new ApiError(403, "Session cannot be validated", "CSRF_FAILED");
    const session = await prisma.authSession.findUnique({ where: { id: user.sessionId } });
    if (!session || session.revokedAt || session.expiresAt <= new Date() || session.csrfTokenHash !== hashValue(header)) {
      throw new ApiError(403, "CSRF validation failed", "CSRF_FAILED");
    }
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}
