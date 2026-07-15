import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { ApiError } from "../lib/http";

export type AuthUser = {
  id: string;
  email: string;
  role: string;
  name: string;
  accountNumber?: string;
};

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export function requireAdmin(req: Request, _res: Response, next: NextFunction) {
  requireBearerRole(req, next, function (user) {
    return user.role !== "CLIENT";
  });
}

export function requireClient(req: Request, _res: Response, next: NextFunction) {
  requireBearerRole(req, next, function (user) {
    return user.role === "CLIENT";
  });
}

function requireBearerRole(
  req: Request,
  next: NextFunction,
  isAllowed: (user: AuthUser) => boolean
) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    next(new ApiError(401, "Missing bearer token"));
    return;
  }

  try {
    req.user = jwt.verify(header.slice(7), env.JWT_SECRET) as AuthUser;
    if (!isAllowed(req.user)) {
      next(new ApiError(403, "Insufficient permissions"));
      return;
    }
    next();
  } catch {
    next(new ApiError(401, "Invalid or expired token"));
  }
}
