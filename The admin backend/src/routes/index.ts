import { Router } from "express";
import { requireAdmin } from "../middleware/auth";
import { adminRouter } from "./admin.routes";
import { auditRouter } from "./audit.routes";
import { authRouter } from "./auth.routes";
import { clientPortalRouter } from "./client-portal.routes";
import { clientRouter } from "./clients.routes";
import { kycRouter } from "./kyc.routes";
import { moneyRouter } from "./money.routes";
import { portfolioRouter } from "./portfolio.routes";
import { supportRouter } from "./support.routes";

export const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/client", clientPortalRouter);
apiRouter.use("/admin", requireAdmin, adminRouter);
apiRouter.use("/admin/audit-logs", requireAdmin, auditRouter);
apiRouter.use("/clients", requireAdmin, clientRouter);
apiRouter.use("/kyc", requireAdmin, kycRouter);
apiRouter.use("/money", requireAdmin, moneyRouter);
apiRouter.use("/", requireAdmin, portfolioRouter);
apiRouter.use("/support", requireAdmin, supportRouter);
