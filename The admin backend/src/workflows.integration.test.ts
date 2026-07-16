import { randomUUID } from "node:crypto";
import request from "supertest";
import { afterAll, describe, expect, it } from "vitest";
import { app } from "./app";
import { decryptSecret, generateTotp } from "./lib/crypto";
import { prisma } from "./lib/prisma";
import { reconcileLedger } from "./services/ledger.service";

const runDatabaseTests = process.env.RUN_DB_TESTS === "1";
const integration = runDatabaseTests ? describe : describe.skip;

async function loginClient(email = "tobi.adeyemi@example.com") {
  const agent = request.agent(app);
  const response = await agent.post("/api/v1/auth/client/login").send({ email, password: "ClientPass123!" }).expect(200);
  expect(response.body.data.session.accessToken).toBeUndefined();
  return {
    agent,
    csrf: response.body.data.session.csrfToken as string,
    clientId: response.body.data.client.id as string,
    sessionId: response.body.data.session.sessionId as string
  };
}

async function loginAdmin(email: string) {
  const agent = request.agent(app);
  const admin = await prisma.adminUser.findUniqueOrThrow({ where: { email }, include: { mfa: true } });
  const mfaCode = admin.mfa?.enabledAt ? generateTotp(decryptSecret(admin.mfa.secretEncrypted)) : undefined;
  const response = await agent.post("/api/v1/auth/admin/login").send({ email, password: "AdminPass123!", mfaCode }).expect(200);
  if (!response.body.data.mfaSetupRequired) {
    return { agent, csrf: response.body.data.session.csrfToken as string };
  }
  const confirmed = await agent.post("/api/v1/auth/admin/mfa/confirm").send({
    setupToken: response.body.data.setupToken,
    code: generateTotp(response.body.data.secret)
  }).expect(200);
  return { agent, csrf: confirmed.body.data.session.csrfToken as string };
}

integration.sequential("broker workflows", () => {
  it("credits an idempotent deposit through maker-checker approval", async () => {
    const key = `deposit-${randomUUID()}`;
    const client = await loginClient();
    const before = await prisma.walletAccount.findUniqueOrThrow({ where: { clientId: client.clientId } });
    const openingBalance = Number(before.balance);
    const payload = { amount: 125, currency: "USD", method: "BANK", rail: "Bank transfer", externalReference: `TEST-${randomUUID()}` };

    const submitted = await client.agent.post("/api/v1/client/deposits").set("x-csrf-token", client.csrf).set("idempotency-key", key).send(payload).expect(201);
    const repeated = await client.agent.post("/api/v1/client/deposits").set("x-csrf-token", client.csrf).set("idempotency-key", key).send(payload).expect(200);
    expect(repeated.body.data.id).toBe(submitted.body.data.id);
    expect(repeated.body.meta.cached).toBe(true);

    const maker = await loginAdmin("finance@bullport.local");
    const approval = await maker.agent
      .post(`/api/v1/admin/money/deposits/${submitted.body.data.id}/request-approval`)
      .set("x-csrf-token", maker.csrf)
      .send({ note: "Bank evidence and sender details verified", received: 125, externalReference: payload.externalReference })
      .expect(201);

    const selfApproval = await maker.agent
      .post(`/api/v1/admin/approvals/${approval.body.data.id}/approve`)
      .set("x-csrf-token", maker.csrf)
      .send({ note: "Attempted maker self approval" })
      .expect(403);
    expect(selfApproval.body.error.code).toBe("MAKER_CHECKER_VIOLATION");

    const wrongRole = await loginAdmin("portfolio@bullport.local");
    const forbidden = await wrongRole.agent
      .post(`/api/v1/admin/approvals/${approval.body.data.id}/approve`)
      .set("x-csrf-token", wrongRole.csrf)
      .send({ note: "Portfolio role must not credit deposits" })
      .expect(403);
    expect(forbidden.body.error.code).toBe("APPROVAL_ROLE_FORBIDDEN");

    const checker = await loginAdmin("admin@bullport.local");
    await checker.agent
      .post(`/api/v1/admin/approvals/${approval.body.data.id}/approve`)
      .set("x-csrf-token", checker.csrf)
      .send({ note: "Independent checker approval completed" })
      .expect(200);

    const after = await prisma.walletAccount.findUniqueOrThrow({ where: { clientId: client.clientId } });
    expect(Number(after.balance)).toBe(openingBalance + 125);
  });

  it("reserves a withdrawal once and releases the hold once on cancellation", async () => {
    const client = await loginClient();
    const beneficiaryResponse = await client.agent.get("/api/v1/client/beneficiaries").expect(200);
    const beneficiary = beneficiaryResponse.body.data.find((item: { status: string }) => item.status === "VERIFIED");
    expect(beneficiary).toBeTruthy();
    const before = await prisma.walletAccount.findUniqueOrThrow({ where: { clientId: client.clientId } });
    const openingHeld = Number(before.held);
    const key = `withdrawal-${randomUUID()}`;
    const payload = { amount: 50, currency: "USD", beneficiaryId: beneficiary.id };

    const submitted = await client.agent.post("/api/v1/client/withdrawals").set("x-csrf-token", client.csrf).set("idempotency-key", key).send(payload).expect(201);
    const repeated = await client.agent.post("/api/v1/client/withdrawals").set("x-csrf-token", client.csrf).set("idempotency-key", key).send(payload).expect(200);
    expect(repeated.body.data.id).toBe(submitted.body.data.id);

    const held = await prisma.walletAccount.findUniqueOrThrow({ where: { clientId: client.clientId } });
    expect(Number(held.held)).toBe(openingHeld + 50);

    await client.agent.post(`/api/v1/client/withdrawals/${submitted.body.data.id}/cancel`).set("x-csrf-token", client.csrf).send({}).expect(200);
    const released = await prisma.walletAccount.findUniqueOrThrow({ where: { clientId: client.clientId } });
    expect(Number(released.held)).toBe(openingHeld);
  });

  it("subscribes to a suitable portfolio idempotently", async () => {
    const client = await loginClient();
    const product = await prisma.portfolioProduct.findFirstOrThrow({
      where: { status: "PUBLISHED", riskLevel: "LOW" },
      orderBy: { minimum: "asc" }
    });
    const before = await prisma.walletAccount.findUniqueOrThrow({ where: { clientId: client.clientId } });
    const key = `investment-${randomUUID()}`;
    const payload = { productId: product.id, amount: Number(product.minimum), reinvestPreference: "WALLET" };
    const created = await client.agent.post("/api/v1/client/investments").set("x-csrf-token", client.csrf).set("idempotency-key", key).send(payload).expect(201);
    const repeated = await client.agent.post("/api/v1/client/investments").set("x-csrf-token", client.csrf).set("idempotency-key", key).send(payload).expect(200);
    expect(repeated.body.data.id).toBe(created.body.data.id);
    const after = await prisma.walletAccount.findUniqueOrThrow({ where: { clientId: client.clientId } });
    expect(Number(after.balance)).toBe(Number(before.balance) - Number(product.minimum));
  });

  it("settles an approved internal order into a client position", async () => {
    const client = await loginClient();
    const instrument = await prisma.instrument.findFirstOrThrow({ where: { symbol: "AAPL", tradable: true } });
    const submitted = await client.agent.post("/api/v1/client/orders")
      .set("x-csrf-token", client.csrf)
      .set("idempotency-key", `order-${randomUUID()}`)
      .send({ instrumentId: instrument.id, side: "BUY", type: "LIMIT", quantity: 1, limitPrice: Number(instrument.currentPrice) })
      .expect(201);
    const desk = await loginAdmin("portfolio@bullport.local");
    await desk.agent.post(`/api/v1/admin/orders/${submitted.body.data.id}/approve`).set("x-csrf-token", desk.csrf).send({ note: "Client eligibility and order risk checks completed" }).expect(200);
    await desk.agent.post(`/api/v1/admin/orders/${submitted.body.data.id}/fill`).set("x-csrf-token", desk.csrf).send({ price: Number(instrument.currentPrice), quantity: 1, fee: 0, note: "Complete fill recorded by the internal order desk" }).expect(200);
    const position = await prisma.position.findUniqueOrThrow({ where: { clientId_instrumentId: { clientId: client.clientId, instrumentId: instrument.id } } });
    expect(Number(position.quantity)).toBeGreaterThanOrEqual(1);
  });

  it("scores and approves options access through compliance", async () => {
    const client = await loginClient("amara.okafor@example.com");
    const application = await client.agent.post("/api/v1/client/options/apply").set("x-csrf-token", client.csrf).send({
      questionnaire: { experience: "TWO_TO_FIVE", knowledge: "INTERMEDIATE", lossTolerance: "MEDIUM", objective: "HEDGING" },
      disclosureAccepted: true,
      score: 100
    }).expect(201);
    expect(application.body.data.score).toBe(70);
    const compliance = await loginAdmin("compliance@bullport.local");
    await compliance.agent.post(`/api/v1/admin/options/applications/${application.body.data.id}/decision`).set("x-csrf-token", compliance.csrf).send({ status: "APPROVED", note: "Suitability responses and risk acknowledgement reviewed" }).expect(200);
    const stored = await prisma.optionsApplication.findUniqueOrThrow({ where: { id: application.body.data.id } });
    expect(stored.status).toBe("APPROVED");
  });

  it("posts a calculated distribution through independent approval", async () => {
    const investment = await prisma.clientInvestment.findFirstOrThrow({ where: { clientId: (await prisma.client.findUniqueOrThrow({ where: { email: "tobi.adeyemi@example.com" } })).id, status: "ACTIVE" } });
    const maker = await loginAdmin("portfolio@bullport.local");
    const now = new Date();
    const batch = await maker.agent.post("/api/v1/admin/distributions").set("x-csrf-token", maker.csrf).send({
      productId: investment.productId,
      type: "PROFIT",
      periodStart: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      periodEnd: now.toISOString(),
      currency: "USD",
      grossAmount: 100,
      feeRate: 0.05,
      note: "Monthly managed portfolio profit allocation"
    }).expect(201);
    const approval = await maker.agent.post(`/api/v1/admin/distributions/${batch.body.data.id}/request-approval`).set("x-csrf-token", maker.csrf).send({ note: "Entitlement calculation frozen for checker approval" }).expect(201);
    const checker = await loginAdmin("admin@bullport.local");
    await checker.agent.post(`/api/v1/admin/approvals/${approval.body.data.id}/approve`).set("x-csrf-token", checker.csrf).send({ note: "Independent distribution review and approval complete" }).expect(200);
    const posted = await prisma.distributionBatch.findUniqueOrThrow({ where: { id: batch.body.data.id }, include: { items: true } });
    expect(posted.status).toBe("POSTED");
    expect(posted.items.every((item) => item.status === "POSTED")).toBe(true);
  });

  it("revokes an active session immediately", async () => {
    const owner = await loginClient();
    const second = await loginClient();
    await owner.agent.delete(`/api/v1/auth/client/sessions/${second.sessionId}`).set("x-csrf-token", owner.csrf).send({}).expect(200);
    const blocked = await second.agent.get("/api/v1/client/dashboard").expect(401);
    expect(blocked.body.error.code).toBe("SESSION_REVOKED");
  });

  it("detects refresh-token replay and revokes the session family", async () => {
    const login = await request(app).post("/api/v1/auth/client/login").send({ email: "tobi.adeyemi@example.com", password: "ClientPass123!" }).expect(200);
    const setCookie = login.headers["set-cookie"] as unknown as string[];
    const oldCookies = setCookie.map((value) => value.split(";")[0]).join("; ");
    const refreshed = await request(app).post("/api/v1/auth/refresh").set("Cookie", oldCookies).send({}).expect(200);
    expect(refreshed.body.data.accessToken).toBeUndefined();
    const replay = await request(app).post("/api/v1/auth/refresh").set("Cookie", oldCookies).send({}).expect(401);
    expect(replay.body.error.code).toBe("REFRESH_REPLAY");
  });

  it("keeps every ledger account reconciled", async () => {
    const reconciliation = await reconcileLedger();
    expect(reconciliation.filter((account) => !account.balanced)).toEqual([]);
  });
});

afterAll(async () => {
  if (runDatabaseTests) await prisma.$disconnect();
});
