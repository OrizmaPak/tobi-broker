import { get, put } from "@vercel/blob";
import { createHash } from "node:crypto";
import { env } from "../config/env";
import { ApiError } from "../lib/http";
import { prisma } from "../lib/prisma";

const allowedTypes = new Set(["application/pdf", "image/jpeg", "image/png", "text/csv"]);

export async function storePrivateFile(input: {
  ownerType: string;
  ownerId: string;
  category: string;
  fileName: string;
  mimeType: string;
  base64: string;
}) {
  if (!env.BLOB_READ_WRITE_TOKEN) throw new ApiError(503, "Document storage is not configured", "STORAGE_UNAVAILABLE");
  if (!allowedTypes.has(input.mimeType)) throw new ApiError(422, "Unsupported file type", "INVALID_FILE_TYPE");
  const body = Buffer.from(input.base64.replace(/^data:[^;]+;base64,/, ""), "base64");
  if (!body.length || body.length > 5 * 1024 * 1024) throw new ApiError(422, "Files must be between 1 byte and 5 MB", "INVALID_FILE_SIZE");
  const safeName = input.fileName.replace(/[^a-zA-Z0-9._-]/g, "-").slice(-120);
  const pathname = `${input.ownerType.toLowerCase()}/${input.ownerId}/${input.category}/${Date.now()}-${safeName}`;
  const blob = await put(pathname, body, {
    access: "private",
    addRandomSuffix: true,
    contentType: input.mimeType,
    token: env.BLOB_READ_WRITE_TOKEN
  });
  return prisma.storedFile.create({
    data: {
      ownerType: input.ownerType,
      ownerId: input.ownerId,
      category: input.category,
      storageKey: blob.pathname,
      fileName: input.fileName,
      mimeType: input.mimeType,
      size: body.length,
      checksum: createHash("sha256").update(body).digest("hex"),
      url: blob.url
    }
  });
}

export async function readPrivateFile(storageKey: string) {
  if (!env.BLOB_READ_WRITE_TOKEN) throw new ApiError(503, "Document storage is not configured", "STORAGE_UNAVAILABLE");
  const result = await get(storageKey, { access: "private", token: env.BLOB_READ_WRITE_TOKEN });
  if (!result) throw new ApiError(404, "File was not found", "FILE_NOT_FOUND");
  return result;
}
