import { randomUUID } from "node:crypto";
import bcrypt from "bcryptjs";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { app } from "./app";
import { generateTotp } from "./lib/crypto";
import { prisma } from "./lib/prisma";

const databaseIntegration = process.env.RUN_DB_TESTS === "1" ? describe : describe.skip;
const marker = randomUUID().replaceAll("-", "").slice(0, 12);
const password = `BullPort-${marker}-Test!`;
const productName = `Publication workflow ${marker}`;
const instrumentSymbol = `T${marker.slice(0, 8)}`.toUpperCase();
const adminEmails = {
  maker: `portfolio-${marker}@test.bullport.local`,
  checker: `checker-${marker}@test.bullport.local`,
  finance: `finance-${marker}@test.bullport.local`
};
const clientEmail = `client-${marker}@test.bullport.local`;

async function loginAdmin(email: string) {
  const agent = request.agent(app);
  const response = await agent.post("/api/v1/auth/admin/login").send({ email, password }).expect(200);
  const completed = response.body.data.mfaSetupRequired
    ? await agent.post("/api/v1/auth/admin/mfa/confirm").send({
      setupToken: response.body.data.setupToken,
      code: generateTotp(response.body.data.secret)
    }).expect(200)
    : response;
  return { agent, csrf: completed.body.data.session.csrfToken as string };
}

async function loginClient() {
  const agent = request.agent(app);
  const response = await agent.post("/api/v1/auth/client/login").send({ email: clientEmail, password }).expect(200);
  const completed = response.body.data.mfaSetupRequired
    ? await agent.post("/api/v1/auth/client/mfa/confirm").send({
      setupToken: response.body.data.setupToken,
      code: generateTotp(response.body.data.secret)
    }).expect(200)
    : response;
  return { agent, csrf: completed.body.data.session.csrfToken as string };
}

databaseIntegration.sequential("portfolio product publication", () => {
  beforeAll(async () => {
    const passwordHash = await bcrypt.hash(password, 12);
    await prisma.adminUser.createMany({
      data: [
        { name: "Test Portfolio Maker", email: adminEmails.maker, passwordHash, role: "PORTFOLIO_MANAGER" },
        { name: "Test Publication Checker", email: adminEmails.checker, passwordHash, role: "SUPER_ADMIN" },
        { name: "Test Finance Admin", email: adminEmails.finance, passwordHash, role: "FINANCE" }
      ]
    });
    await prisma.client.create({
      data: {
        accountNumber: `TST${marker.toUpperCase()}`,
        name: "Publication Test Client",
        email: clientEmail,
        passwordHash,
        status: "ACTIVE",
        riskLevel: "MODERATE",
        emailVerifiedAt: new Date()
      }
    });
  });

  it("publishes only the exact configured and approved terms version", async () => {
    const maker = await loginAdmin(adminEmails.maker);
    const checker = await loginAdmin(adminEmails.checker);
    const finance = await loginAdmin(adminEmails.finance);
    const client = await loginClient();
    const terms = {
      name: productName,
      description: "A temporary product used to verify the complete publication workflow.",
      riskLevel: "MODERATE",
      minimum: 250,
      currency: "USD",
      payoutRule: "Quarterly",
      projectedReturnMin: 4,
      projectedReturnMax: 8,
      disclosure: "Returns are projected and market-based. Capital and income are not guaranteed.",
      eligibility: {}
    };

    const created = await maker.agent.post("/api/v1/admin/portfolio-products")
      .set("x-csrf-token", maker.csrf)
      .send(terms)
      .expect(201);
    const productId = created.body.data.id as string;
    expect(created.body.data.status).toBe("DRAFT");
    expect(created.body.data.version).toBe(1);

    const missingAllocation = await maker.agent.post(`/api/v1/admin/portfolio-products/${productId}/request-publication`)
      .set("x-csrf-token", maker.csrf)
      .send({ note: "Attempt publication before allocation exists" })
      .expect(422);
    expect(missingAllocation.body.error.code).toBe("ALLOCATION_REQUIRED");

    const instrument = await maker.agent.post("/api/v1/admin/instruments")
      .set("x-csrf-token", maker.csrf)
      .send({ symbol: instrumentSymbol, name: "Temporary workflow instrument", category: "Fund", market: "Test", currency: "USD", riskLevel: "MODERATE", tradable: false, investable: true, status: "ACTIVE" })
      .expect(201);
    await maker.agent.put(`/api/v1/admin/portfolio-products/${productId}/allocations`)
      .set("x-csrf-token", maker.csrf)
      .send({ allocations: [{ instrumentId: instrument.body.data.id, targetWeight: 100 }] })
      .expect(200);

    const firstRequest = await maker.agent.post(`/api/v1/admin/portfolio-products/${productId}/request-publication`)
      .set("x-csrf-token", maker.csrf)
      .send({ note: "Initial configured product publication request" })
      .expect(201);
    const firstApprovalId = firstRequest.body.data.id as string;
    const hiddenBeforeApproval = await client.agent.get("/api/v1/client/portfolios").expect(200);
    expect(hiddenBeforeApproval.body.data.some((product: { id: string }) => product.id === productId)).toBe(false);

    await maker.agent.put(`/api/v1/admin/portfolio-products/${productId}`)
      .set("x-csrf-token", maker.csrf)
      .send({ ...terms, description: "Updated terms invalidate the first publication approval request." })
      .expect(200);
    const cancelled = await prisma.approvalRequest.findUniqueOrThrow({ where: { id: firstApprovalId } });
    expect(cancelled.status).toBe("REJECTED");
    await checker.agent.post(`/api/v1/admin/approvals/${firstApprovalId}/approve`)
      .set("x-csrf-token", checker.csrf)
      .send({ note: "A stale request must not be publishable" })
      .expect(404);

    const secondRequest = await maker.agent.post(`/api/v1/admin/portfolio-products/${productId}/request-publication`)
      .set("x-csrf-token", maker.csrf)
      .send({ note: "Updated terms and allocation are ready for publication" })
      .expect(201);
    const secondApprovalId = secondRequest.body.data.id as string;
    const forbidden = await finance.agent.post(`/api/v1/admin/approvals/${secondApprovalId}/approve`)
      .set("x-csrf-token", finance.csrf)
      .send({ note: "Finance must not publish portfolio products" })
      .expect(403);
    expect(forbidden.body.error.code).toBe("APPROVAL_ROLE_FORBIDDEN");

    await checker.agent.post(`/api/v1/admin/approvals/${secondApprovalId}/approve`)
      .set("x-csrf-token", checker.csrf)
      .send({ note: "Terms, disclosure, and allocation independently reviewed" })
      .expect(200);
    const published = await prisma.portfolioProduct.findUniqueOrThrow({ where: { id: productId }, include: { versions: true } });
    expect(published.status).toBe("PUBLISHED");
    expect(published.version).toBe(2);
    expect(published.versions.find((version) => version.version === 2)?.status).toBe("PUBLISHED");

    const visibleAfterApproval = await client.agent.get("/api/v1/client/portfolios").expect(200);
    expect(visibleAfterApproval.body.data.some((product: { id: string }) => product.id === productId)).toBe(true);
  }, 180_000);
});

afterAll(async () => {
  if (process.env.RUN_DB_TESTS !== "1") return;
  const products = await prisma.portfolioProduct.findMany({ where: { name: productName }, select: { id: true } });
  const instruments = await prisma.instrument.findMany({ where: { symbol: instrumentSymbol }, select: { id: true } });
  const admins = await prisma.adminUser.findMany({ where: { email: { in: Object.values(adminEmails) } }, select: { id: true } });
  const productIds = products.map((product) => product.id);
  const instrumentIds = instruments.map((instrument) => instrument.id);
  const adminIds = admins.map((admin) => admin.id);
  if (productIds.length) await prisma.approvalRequest.deleteMany({ where: { entityType: "PortfolioProduct", entityId: { in: productIds } } });
  await prisma.auditLog.deleteMany({ where: { OR: [{ actorId: { in: adminIds } }, { entityId: { in: [...productIds, ...instrumentIds] } }] } });
  if (productIds.length) await prisma.portfolioProduct.deleteMany({ where: { id: { in: productIds } } });
  if (instrumentIds.length) await prisma.instrument.deleteMany({ where: { id: { in: instrumentIds } } });
  await prisma.client.deleteMany({ where: { email: clientEmail } });
  await prisma.loginAttempt.deleteMany({ where: { email: { in: [...Object.values(adminEmails), clientEmail] } } });
  if (adminIds.length) await prisma.adminUser.deleteMany({ where: { id: { in: adminIds } } });
  await prisma.$disconnect();
});
