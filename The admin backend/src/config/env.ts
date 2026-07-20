import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const booleanValue = z.preprocess((value) => {
  if (typeof value !== "string") return value;
  const normalized = value.trim().toLowerCase();
  if (["true", "1", "yes", "on"].includes(normalized)) return true;
  if (["false", "0", "no", "off"].includes(normalized)) return false;
  return value;
}, z.boolean());

const trimmedString = z.preprocess((value) => typeof value === "string" ? value.trim() : value, z.string());
const optionalTrimmedString = z.preprocess((value) => {
  if (typeof value !== "string") return value;
  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
}, z.string().optional());

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().default(4000),
  DATABASE_URL: trimmedString.pipe(z.string().min(1, "DATABASE_URL is required")),
  JWT_SECRET: trimmedString.pipe(z.string().min(16, "JWT_SECRET must be at least 16 characters")),
  JWT_EXPIRES_IN: trimmedString.default("15m"),
  CLIENT_REFRESH_DAYS: z.coerce.number().int().min(1).max(30).default(7),
  ADMIN_REFRESH_HOURS: z.coerce.number().int().min(1).max(24).default(8),
  CORS_ORIGIN: trimmedString.default("*"),
  DASHBOARD_URL: optionalTrimmedString.pipe(z.string().url().optional()),
  ADMIN_URL: optionalTrimmedString.pipe(z.string().url().optional()),
  PUBLIC_SITE_URL: optionalTrimmedString.pipe(z.string().url().optional()),
  BLOB_READ_WRITE_TOKEN: z.string().optional(),
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),
  RESEND_FROM: trimmedString.default("BullPort <notifications@bullport.com>"),
  SUPPORT_EMAIL: trimmedString.pipe(z.string().email()).default("support@bullport.com"),
  JOB_SECRET: optionalTrimmedString.pipe(z.string().min(16).optional()),
  CRON_SECRET: optionalTrimmedString.pipe(z.string().min(16).optional()),
  ADMIN_MFA_REQUIRED: booleanValue.default(false)
});

export const env = envSchema.parse(process.env);

export const corsOrigins = env.CORS_ORIGIN === "*"
  ? "*"
  : env.CORS_ORIGIN.split(",").map((origin) => origin.trim()).filter(Boolean);
