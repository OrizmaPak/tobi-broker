import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const booleanValue = z.preprocess((value) => {
  if (typeof value !== "string") return value;
  if (["true", "1", "yes", "on"].includes(value.toLowerCase())) return true;
  if (["false", "0", "no", "off"].includes(value.toLowerCase())) return false;
  return value;
}, z.boolean());

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().default(4000),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  JWT_SECRET: z.string().min(16, "JWT_SECRET must be at least 16 characters"),
  JWT_EXPIRES_IN: z.string().default("15m"),
  CLIENT_REFRESH_DAYS: z.coerce.number().int().min(1).max(30).default(7),
  ADMIN_REFRESH_HOURS: z.coerce.number().int().min(1).max(24).default(8),
  CORS_ORIGIN: z.string().default("*"),
  DASHBOARD_URL: z.string().url().optional(),
  ADMIN_URL: z.string().url().optional(),
  PUBLIC_SITE_URL: z.string().url().optional(),
  BLOB_READ_WRITE_TOKEN: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),
  RESEND_FROM: z.string().default("BullPort <notifications@bullport.com>"),
  SUPPORT_EMAIL: z.string().email().default("support@bullport.com"),
  JOB_SECRET: z.string().min(16).optional(),
  ADMIN_MFA_REQUIRED: booleanValue.default(true)
});

export const env = envSchema.parse(process.env);

export const corsOrigins = env.CORS_ORIGIN === "*"
  ? "*"
  : env.CORS_ORIGIN.split(",").map((origin) => origin.trim()).filter(Boolean);
