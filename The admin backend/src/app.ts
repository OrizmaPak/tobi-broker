import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { corsOrigins } from "./config/env";
import { errorHandler, notFound } from "./middleware/error";
import { apiRouter } from "./routes";

export const app = express();

app.use(cors({ origin: corsOrigins, credentials: false }));
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "bullport-backend" });
});

app.use("/api", apiRouter);
app.use(notFound);
app.use(errorHandler);
