import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../lib/http";

export function notFound(req: Request, _res: Response, next: NextFunction) {
  next(new ApiError(404, `Route not found: ${req.method} ${req.path}`));
}

export function errorHandler(error: Error, _req: Request, res: Response, _next: NextFunction) {
  const statusCode = error instanceof ApiError ? error.statusCode : 500;
  res.status(statusCode).json({
    ok: false,
    error: {
      message: statusCode === 500 ? "Internal server error" : error.message
    }
  });
}
