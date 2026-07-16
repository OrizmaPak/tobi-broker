import type { NextFunction, Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";
import { ApiError } from "../lib/http";

export function notFound(req: Request, _res: Response, next: NextFunction) {
  next(new ApiError(404, `Route not found: ${req.method} ${req.path}`, "ROUTE_NOT_FOUND"));
}

export function errorHandler(error: Error, _req: Request, res: Response, _next: NextFunction) {
  let statusCode = error instanceof ApiError ? error.statusCode : 500;
  let code = error instanceof ApiError ? error.code : "INTERNAL_ERROR";
  let message = error instanceof ApiError ? error.message : "Internal server error";
  let fields = error instanceof ApiError ? error.fields : undefined;

  if (error instanceof ZodError) {
    statusCode = 422;
    code = "VALIDATION_FAILED";
    message = "Please correct the highlighted fields";
    fields = error.issues.reduce<Record<string, string[]>>((result, issue) => {
      const key = issue.path.join(".") || "request";
      (result[key] ||= []).push(issue.message);
      return result;
    }, {});
  } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      statusCode = 409;
      code = "DUPLICATE_RECORD";
      message = "A record with these details already exists";
    } else if (error.code === "P2025") {
      statusCode = 404;
      code = "NOT_FOUND";
      message = "The requested record was not found";
    }
  }

  if (statusCode >= 500) console.error(`[${res.locals.requestId}]`, error);
  res.status(statusCode).json({
    ok: false,
    error: {
      code,
      message,
      ...(fields ? { fields } : {})
    },
    requestId: res.locals.requestId
  });
}
