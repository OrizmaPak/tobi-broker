import { Router } from "express";
import { adminRouter } from "./admin.routes";
import { auditRouter } from "./audit.routes";
import { authRouter } from "./auth.routes";
import { clientRouter } from "./clients.routes";
import { kycRouter } from "./kyc.routes";
import { moneyRouter } from "./money.routes";
import { portfolioRouter } from "./portfolio.routes";
import { supportRouter } from "./support.routes";

export const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/admin", adminRouter);
apiRouter.use("/admin/audit-logs", auditRouter);
apiRouter.use("/clients", clientRouter);
apiRouter.use("/kyc", kycRouter);
apiRouter.use("/money", moneyRouter);
apiRouter.use("/", portfolioRouter);
apiRouter.use("/support", supportRouter);
