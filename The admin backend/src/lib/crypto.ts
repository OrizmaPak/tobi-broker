import { createCipheriv, createDecipheriv, createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { env } from "../config/env";

const BASE32 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

export function randomToken(bytes = 32) {
  return randomBytes(bytes).toString("base64url");
}

export function randomCode(length = 10) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = randomBytes(length);
  return Array.from(bytes, (value) => chars[value % chars.length]).join("");
}

export function base32Encode(input: Buffer) {
  let bits = "";
  for (const byte of input) bits += byte.toString(2).padStart(8, "0");
  let output = "";
  for (let index = 0; index < bits.length; index += 5) {
    output += BASE32[Number.parseInt(bits.slice(index, index + 5).padEnd(5, "0"), 2)];
  }
  return output;
}

function base32Decode(input: string) {
  const bits = input.toUpperCase().replace(/=+$/, "").split("").map((char) => {
    const index = BASE32.indexOf(char);
    if (index < 0) throw new Error("Invalid base32 value");
    return index.toString(2).padStart(5, "0");
  }).join("");
  const bytes: number[] = [];
  for (let index = 0; index + 8 <= bits.length; index += 8) {
    bytes.push(Number.parseInt(bits.slice(index, index + 8), 2));
  }
  return Buffer.from(bytes);
}

function totpAt(secret: string, time: number) {
  const counter = Math.floor(time / 30);
  const buffer = Buffer.alloc(8);
  buffer.writeBigUInt64BE(BigInt(counter));
  const digest = createHmac("sha1", base32Decode(secret)).update(buffer).digest();
  const offset = digest[digest.length - 1] & 15;
  const value = (digest.readUInt32BE(offset) & 0x7fffffff) % 1_000_000;
  return String(value).padStart(6, "0");
}

export function generateTotp(secret: string, now = Date.now()) {
  return totpAt(secret, Math.floor(now / 1000));
}

export function verifyTotp(secret: string, code: string, now = Date.now()) {
  if (!/^\d{6}$/.test(code)) return false;
  return [-1, 0, 1].some((window) => {
    const expected = Buffer.from(totpAt(secret, Math.floor(now / 1000) + window * 30));
    const supplied = Buffer.from(code);
    return expected.length === supplied.length && timingSafeEqual(expected, supplied);
  });
}

function encryptionKey() {
  return scryptSync(env.JWT_SECRET, "bullport-admin-mfa", 32);
}

export function encryptSecret(value: string) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", encryptionKey(), iv);
  const encrypted = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, encrypted]).toString("base64url");
}

export function decryptSecret(value: string) {
  const payload = Buffer.from(value, "base64url");
  const iv = payload.subarray(0, 12);
  const tag = payload.subarray(12, 28);
  const encrypted = payload.subarray(28);
  const decipher = createDecipheriv("aes-256-gcm", encryptionKey(), iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString("utf8");
}

export function createMfaSecret() {
  return base32Encode(randomBytes(20));
}
