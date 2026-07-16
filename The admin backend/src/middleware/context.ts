import type { NextFunction, Request, Response } from "express";
import { requestId } from "../lib/http";

export function requestContext(req: Request, res: Response, next: NextFunction) {
  const id = String(req.headers["x-request-id"] || requestId()).slice(0, 128);
  res.locals.requestId = id;
  res.setHeader("x-request-id", id);
  next();
}
