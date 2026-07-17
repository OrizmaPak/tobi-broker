import request from "supertest";
import { describe, expect, it } from "vitest";
import { app } from "./app";

describe("BullPort API shell", () => {
  it("returns a request ID from the health endpoint", async () => {
    const response = await request(app).get("/health").expect(200);

    expect(response.body).toMatchObject({ ok: true, service: "bullport-backend", version: "1.0.0" });
    expect(response.body.requestId).toEqual(expect.any(String));
    expect(response.headers["x-request-id"]).toBe(response.body.requestId);
  });

  it("publishes the versioned OpenAPI contract", async () => {
    const response = await request(app).get("/api/v1/openapi.json").expect(200);

    expect(response.body.ok).toBe(true);
    expect(response.body.data.openapi).toBe("3.1.0");
    expect(response.body.data.paths).toHaveProperty("/auth/client/login");
    expect(response.body.data.paths).toHaveProperty("/client/kyc/requirements");
    expect(response.body.data.paths).toHaveProperty("/admin/kyc/{id}/documents/{documentId}/decision");
  });

  it("uses the standard error envelope", async () => {
    const response = await request(app).get("/api/v1/not-a-route").expect(404);

    expect(response.body).toMatchObject({ ok: false, error: { code: "ROUTE_NOT_FOUND" } });
    expect(response.body.requestId).toEqual(expect.any(String));
  });
});
