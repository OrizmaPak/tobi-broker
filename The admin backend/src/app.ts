import cors from "cors";
import cookieParser from "cookie-parser";
import express from "express";
import { rateLimit } from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";
import { corsOrigins, env } from "./config/env";
import { requestContext } from "./middleware/context";
import { errorHandler, notFound } from "./middleware/error";
import { apiRouter } from "./routes";
import { prisma } from "./lib/prisma";

export const app = express();

app.set("trust proxy", 1);
app.use(requestContext);
app.use(cors({
  origin: corsOrigins,
  credentials: corsOrigins !== "*"
}));
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cookieParser());
app.use(express.json({ limit: "8mb" }));
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: env.NODE_ENV === "test" ? 10_000 : 500,
  standardHeaders: "draft-8",
  legacyHeaders: false
}));
if (env.NODE_ENV !== "test") app.use(morgan("combined"));

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "bullport-backend", version: "1.0.0", requestId: res.locals.requestId });
});

app.get("/ready", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ ok: true, service: "bullport-backend", database: "ready", requestId: res.locals.requestId });
  } catch {
    res.status(503).json({ ok: false, error: { code: "DATABASE_UNAVAILABLE", message: "Database is unavailable" }, requestId: res.locals.requestId });
  }
});

app.use("/api", apiRouter);
app.use(notFound);
app.use(errorHandler);
