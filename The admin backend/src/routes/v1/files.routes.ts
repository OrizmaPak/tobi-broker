import { Readable } from "node:stream";
import { Router } from "express";
import { z } from "zod";
import { ApiError, asyncHandler, ok } from "../../lib/http";
import { prisma } from "../../lib/prisma";
import { optionalAuth, requireCsrf } from "../../middleware/auth";
import { readPrivateFile, storePrivateFile } from "../../services/file.service";

export const v1FilesRouter = Router();
v1FilesRouter.use(optionalAuth);

function authenticated(req: { user?: { id: string; role: string } }) {
  if (!req.user) throw new ApiError(401, "Authentication is required", "AUTH_REQUIRED");
  return req.user;
}

v1FilesRouter.post("/", requireCsrf, asyncHandler(async (req, res) => {
  const user = authenticated(req);
  const input = z.object({ ownerType: z.enum(["CLIENT", "ADMIN"]).optional(), ownerId: z.string().optional(), category: z.string().min(2).max(80), fileName: z.string().min(1).max(160), mimeType: z.enum(["application/pdf", "image/jpeg", "image/png", "text/csv"]), base64: z.string().min(4) }).parse(req.body);
  if (user.role === "CLIENT" && input.ownerId && input.ownerId !== user.id) throw new ApiError(403, "Files can only be uploaded to your account", "FORBIDDEN");
  const file = await storePrivateFile({ ownerType: user.role === "CLIENT" ? "CLIENT" : input.ownerType || "ADMIN", ownerId: user.role === "CLIENT" ? user.id : input.ownerId || user.id, category: input.category, fileName: input.fileName, mimeType: input.mimeType, base64: input.base64 });
  return ok(res, file, 201);
}));

v1FilesRouter.get("/:id", asyncHandler(async (req, res) => {
  const user = authenticated(req);
  const file = await prisma.storedFile.findUnique({ where: { id: String(req.params.id) } });
  if (!file) throw new ApiError(404, "File was not found", "FILE_NOT_FOUND");
  if (user.role === "CLIENT" && (file.ownerType !== "CLIENT" || file.ownerId !== user.id)) throw new ApiError(403, "File access is denied", "FORBIDDEN");
  const result = await readPrivateFile(file.storageKey);
  if (result.statusCode !== 200 || !result.stream) throw new ApiError(404, "File content was not found", "FILE_NOT_FOUND");
  res.setHeader("content-type", result.blob.contentType);
  res.setHeader("content-length", String(result.blob.size));
  res.setHeader("content-disposition", `attachment; filename="${file.fileName.replace(/"/g, "")}"`);
  Readable.fromWeb(result.stream as never).pipe(res);
}));
