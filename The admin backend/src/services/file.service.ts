import { get, put } from "@vercel/blob";
import { v2 as cloudinary } from "cloudinary";
import { createHash } from "node:crypto";
import { extname } from "node:path";
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

function configureCloudinary() {
  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
    secure: true
  });
}

export async function uploadToCloudinary(input: {
  folder: string;
  fileName: string;
  mimeType: string;
  base64: string;
}) {
  if (!hasCloudinaryConfig()) throw new ApiError(503, "Cloudinary storage is not configured", "STORAGE_UNAVAILABLE");
  configureCloudinary();
  const safeName = input.fileName.replace(/[^a-zA-Z0-9._-]/g, "-").slice(-120);
  const resourceType = cloudinaryResourceType(input.mimeType);
  const extension = extname(safeName).replace(/^\./, "").toLowerCase();
  const publicId = `${Date.now()}-${resourceType === "raw" ? safeName : safeName.replace(/\.[^.]+$/, "")}`;
  const result = await cloudinary.uploader.upload(`data:${input.mimeType};base64,${input.base64.replace(/^data:[^;]+;base64,/, "")}`, {
    folder: input.folder.replace(/[^a-zA-Z0-9/_-]/g, "-"),
    public_id: publicId,
    resource_type: resourceType,
    type: "authenticated",
    overwrite: false
  }).catch((error: { message?: string }) => {
    throw new ApiError(502, error.message || "Cloudinary upload failed", "STORAGE_UPLOAD_FAILED");
  });
  if (!result.secure_url || !result.public_id) throw new ApiError(502, "Cloudinary upload failed", "STORAGE_UPLOAD_FAILED");
  const format = result.format || extension || "bin";
  return {
    storageKey: `cloudinary:${result.resource_type || resourceType}:authenticated:${format}:${result.public_id}`,
    url: null,
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

export async function storePublicImage(input: {
  ownerType: string;
  ownerId: string;
  category: string;
  fileName: string;
  mimeType: string;
  base64: string;
}) {
  const allowedImages = new Set(["image/jpeg", "image/png", "image/webp"]);
  if (!allowedImages.has(input.mimeType)) throw new ApiError(422, "Unsupported image type", "INVALID_FILE_TYPE");
  if (!env.BLOB_READ_WRITE_TOKEN) throw new ApiError(503, "Public image storage is not configured", "STORAGE_UNAVAILABLE");
  const body = Buffer.from(input.base64.replace(/^data:[^;]+;base64,/, ""), "base64");
  if (!body.length || body.length > 5 * 1024 * 1024) throw new ApiError(422, "Images must be between 1 byte and 5 MB", "INVALID_FILE_SIZE");
  const safeName = input.fileName.replace(/[^a-zA-Z0-9._-]/g, "-").slice(-120);
  const pathname = `public/${input.ownerType.toLowerCase()}/${input.ownerId}/${input.category}/${Date.now()}-${safeName}`;
  const blob = await put(pathname, body, {
    access: "public",
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
  if (storageKey.startsWith("cloudinary:")) {
    const file = await prisma.storedFile.findUnique({ where: { storageKey } });
    if (!file) throw new ApiError(404, "File content was not found", "FILE_NOT_FOUND");
    const parts = storageKey.split(":");
    const isAuthenticated = parts[2] === "authenticated";
    let sourceUrl = file.url || "";
    if (isAuthenticated) {
      if (!hasCloudinaryConfig()) throw new ApiError(503, "Cloudinary storage is not configured", "STORAGE_UNAVAILABLE");
      configureCloudinary();
      const resourceType = parts[1] as "image" | "video" | "raw";
      const format = parts[3];
      const publicId = parts.slice(4).join(":");
      sourceUrl = cloudinary.utils.private_download_url(publicId, format, {
        resource_type: resourceType,
        type: "authenticated",
        expires_at: Math.floor(Date.now() / 1000) + 300,
        attachment: false
      });
    }
    if (!sourceUrl) throw new ApiError(404, "File content was not found", "FILE_NOT_FOUND");
    const response = await fetch(sourceUrl);
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
