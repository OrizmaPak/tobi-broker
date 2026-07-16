import { Router } from "express";
import { ApiError } from "../../lib/http";
import { ok } from "../../lib/http";
import { v1AdminBrokerRouter } from "./admin-broker.routes";
import { v1AdminCoreRouter } from "./admin-core.routes";
import { v1AdminOperationsRouter } from "./admin-operations.routes";
import { v1AuthRouter } from "./auth.routes";
import { v1ClientRouter } from "./client.routes";
import { v1FilesRouter } from "./files.routes";
import { v1JobsRouter } from "./jobs.routes";
import { openApiDocument } from "./openapi";
import { v1PublicRouter } from "./public.routes";

export const v1Router = Router();

v1Router.get("/", (_req, res) => ok(res, { service: "bullport-backend", apiVersion: "v1", documentation: "/api/v1/openapi.json" }));
v1Router.get("/openapi.json", (_req, res) => ok(res, openApiDocument));
v1Router.use("/auth", v1AuthRouter);
v1Router.use("/public", v1PublicRouter);
v1Router.use("/client", v1ClientRouter);
v1Router.use("/admin", v1AdminCoreRouter);
v1Router.use("/admin", v1AdminBrokerRouter);
v1Router.use("/admin", v1AdminOperationsRouter);
v1Router.use("/files", v1FilesRouter);
v1Router.use("/jobs", v1JobsRouter);
v1Router.use((req, _res, next) => next(new ApiError(404, `Route not found: ${req.method} /api/v1${req.path}`, "ROUTE_NOT_FOUND")));
