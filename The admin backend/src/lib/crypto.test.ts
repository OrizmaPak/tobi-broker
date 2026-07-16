import { describe, expect, it } from "vitest";
import { createMfaSecret, decryptSecret, encryptSecret, generateTotp, randomCode, randomToken, verifyTotp } from "./crypto";

describe("security primitives", () => {
  it("validates a known RFC 6238 TOTP vector", () => {
    const secret = "GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ";
    expect(generateTotp(secret, 59_000)).toBe("287082");
    expect(verifyTotp(secret, "287082", 59_000)).toBe(true);
    expect(verifyTotp(secret, "000000", 59_000)).toBe(false);
  });

  it("encrypts MFA secrets with authenticated encryption", () => {
    const secret = createMfaSecret();
    const encrypted = encryptSecret(secret);

    expect(encrypted).not.toContain(secret);
    expect(decryptSecret(encrypted)).toBe(secret);
  });

  it("creates non-repeating URL-safe tokens and recovery codes", () => {
    const tokens = new Set(Array.from({ length: 20 }, () => randomToken()));
    const codes = new Set(Array.from({ length: 20 }, () => randomCode()));

    expect(tokens.size).toBe(20);
    expect(codes.size).toBe(20);
    expect([...codes].every((code) => /^[A-HJ-NP-Z2-9]{10}$/.test(code))).toBe(true);
  });
});
