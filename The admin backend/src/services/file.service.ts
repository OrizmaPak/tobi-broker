import { get, put } from "@vercel/blob";
import { createHash } from "node:crypto";
import { env } from "../config/env";
import { ApiError } from "../lib/http";
import { prisma } from "../lib/prisma";

const allowedTypes = new Set(["application/pdf", "image/jpeg", "image/png", "text/csv"]);

function hasCloudinaryConfig() {
  return Boolean(env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_API_KEY && env.CLOUDINARY_API_SECRET);
}

function cloudinaryResourceType(mimeType: string) {
  if (mimeType.startsWith("image/")) return "image";
  return "raw";
}

function cloudinarySignature(params: Record<string, string | number>) {
  const payload = Object.entries(params)
    .filter(([, value]) => value !== "" && value !== undefined && value !== null)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => `${key}=${value}`)
    .join("&");
  return createHash("sha1").update(`${payload}${env.CLOUDINARY_API_SECRET}`).digest("hex");
}

export async function uploadToCloudinary(input: {
  folder: string;
  fileName: string;
  mimeType: string;
  base64: string;
}) {
  if (!hasCloudinaryConfig()) throw new ApiError(503, "Cloudinary storage is not configured", "STORAGE_UNAVAILABLE");
  const safeName = input.fileName.replace(/[^a-zA-Z0-9._-]/g, "-").slice(-120);
  const publicId = `${Date.now()}-${safeName.replace(/\.[^.]+$/, "")}`;
  const timestamp = Math.floor(Date.now() / 1000);
  const resourceType = cloudinaryResourceType(input.mimeType);
  const params = {
    folder: input.folder.replace(/[^a-zA-Z0-9/_-]/g, "-"),
    public_id: publicId,
    timestamp
  };
  const form = new FormData();
  form.set("file", `data:${input.mimeType};base64,${input.base64.replace(/^data:[^;]+;base64,/, "")}`);
  form.set("api_key", env.CLOUDINARY_API_KEY || "");
  form.set("folder", params.folder);
  form.set("public_id", params.public_id);
  form.set("timestamp", String(params.timestamp));
  form.set("signature", cloudinarySignature(params));

  const response = await fetch(`https://api.cloudinary.com/v1_1/${env.CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`, {
    method: "POST",
    body: form
  });
  const result = await response.json().catch(() => ({})) as {
    public_id?: string;
    secure_url?: string;
    bytes?: number;
    resource_type?: string;
    format?: string;
    error?: { message?: string };
  };
  if (!response.ok || !result.secure_url || !result.public_id) {
    throw new ApiError(502, result.error?.message || "Cloudinary upload failed", "STORAGE_UPLOAD_FAILED");
  }
  return {
    storageKey: `cloudinary:${result.resource_type || resourceType}:${result.public_id}`,
    url: result.secure_url,
    size: result.bytes,
    fileName: input.fileName
  };
}

export async function storePrivateFile(input: {
  ownerType: string;
  ownerId: string;
  category: string;
  fileName: string;
  mimeType: string;
  base64: string;
}) {
  if (!allowedTypes.has(input.mimeType)) throw new ApiError(422, "Unsupported file type", "INVALID_FILE_TYPE");
  const body = Buffer.from(input.base64.replace(/^data:[^;]+;base64,/, ""), "base64");
  if (!body.length || body.length > 5 * 1024 * 1024) throw new ApiError(422, "Files must be between 1 byte and 5 MB", "INVALID_FILE_SIZE");
  const safeName = input.fileName.replace(/[^a-zA-Z0-9._-]/g, "-").slice(-120);
  const pathname = `${input.ownerType.toLowerCase()}/${input.ownerId}/${input.category}/${Date.now()}-${safeName}`;
  const stored = hasCloudinaryConfig()
    ? await uploadToCloudinary({ folder: `${input.ownerType.toLowerCase()}/${input.ownerId}/${input.category}`, fileName: input.fileName, mimeType: input.mimeType, base64: input.base64 })
    : await storeVercelBlob(pathname, body, input.mimeType, input.fileName);
  return prisma.storedFile.create({
    data: {
      ownerType: input.ownerType,
      ownerId: input.ownerId,
      category: input.category,
      storageKey: stored.storageKey,
      fileName: input.fileName,
      mimeType: input.mimeType,
      size: stored.size || body.length,
      checksum: createHash("sha256").update(body).digest("hex"),
      url: stored.url
    }
  });
}

async function storeVercelBlob(pathname: string, body: Buffer, mimeType: string, fileName: string) {
  if (!env.BLOB_READ_WRITE_TOKEN) throw new ApiError(503, "Document storage is not configured", "STORAGE_UNAVAILABLE");
  const blob = await put(pathname, body, {
    access: "private",
    addRandomSuffix: true,
    contentType: mimeType,
    token: env.BLOB_READ_WRITE_TOKEN
  });
  return {
    storageKey: blob.pathname,
    fileName,
    size: body.length,
    url: blob.url
  };
}

export async function readPrivateFile(storageKey: string) {
  if (storageKey.startsWith("cloudinary:")) {
    const file = await prisma.storedFile.findUnique({ where: { storageKey } });
    if (!file?.url) throw new ApiError(404, "File content was not found", "FILE_NOT_FOUND");
    const response = await fetch(file.url);
    if (!response.ok || !response.body) throw new ApiError(404, "File content was not found", "FILE_NOT_FOUND");
    return {
      statusCode: response.status,
      stream: response.body,
      blob: {
        contentType: response.headers.get("content-type") || file.mimeType,
        size: Number(response.headers.get("content-length") || file.size)
      }
    };
  }
  if (!env.BLOB_READ_WRITE_TOKEN) throw new ApiError(503, "Document storage is not configured", "STORAGE_UNAVAILABLE");
  const result = await get(storageKey, { access: "private", token: env.BLOB_READ_WRITE_TOKEN });
  if (!result) throw new ApiError(404, "File was not found", "FILE_NOT_FOUND");
  return result;
}
