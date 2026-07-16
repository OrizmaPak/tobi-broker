import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  transactionOptions: {
    maxWait: 15_000,
    timeout: 60_000
  }
});
