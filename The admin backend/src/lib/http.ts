import type { NextFunction, Request, Response } from "express";
import { createHash, randomUUID } from "node:crypto";

export class ApiError extends Error {
  statusCode: number;
  code: string;
  fields?: Record<string, string[]>;

  constructor(statusCode: number, message: string, code = "REQUEST_FAILED", fields?: Record<string, string[]>) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.fields = fields;
  }
}

export function asyncHandler(
  handler: (req: Request, res: Response, next: NextFunction) => Promise<unknown>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}

export function ok(res: Response, data: unknown, statusCode = 200, meta?: unknown) {
  return res.status(statusCode).json({
    ok: true,
    data,
    ...(meta ? { meta } : {}),
    requestId: res.locals.requestId
  });
}

export function requestId() {
  return randomUUID();
}

export function hashValue(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

export function reference(prefix: string) {
  return `${prefix}-${Date.now().toString(36).toUpperCase()}-${randomUUID().slice(0, 6).toUpperCase()}`;
}

export function pageInput(query: Request["query"]) {
  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(query.limit) || 20, 1), 100);
  return { page, limit, skip: (page - 1) * limit };
}

export function pageMeta(page: number, limit: number, total: number) {
  return {
    page,
    limit,
    total,
    pages: Math.max(Math.ceil(total / limit), 1)
  };
}
