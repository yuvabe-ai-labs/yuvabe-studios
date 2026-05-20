import "server-only";

import crypto from "crypto";

export { SESSION_COOKIE, SESSION_MAX_AGE } from "@/lib/admin-auth-constants";

function getSecret(): string {
  const secret = process.env.STUDIO_ADMIN_SECRET;
  if (!secret) throw new Error("STUDIO_ADMIN_SECRET env var is not set.");
  return secret;
}

const ALLOWED_DOMAIN = "@yuvabe.com";

export function checkEmailDomain(email: string): boolean {
  return email.trim().toLowerCase().endsWith(ALLOWED_DOMAIN);
}

export function checkPassword(input: string): boolean {
  const password = process.env.STUDIO_ADMIN_PASSWORD;
  if (!password) return false;
  // Normalise lengths before timingSafeEqual to avoid length-based timing leaks
  const a = Buffer.from(input.padEnd(Math.max(input.length, password.length), "\0"));
  const b = Buffer.from(password.padEnd(Math.max(input.length, password.length), "\0"));
  return input.length === password.length && crypto.timingSafeEqual(a, b);
}

export function createSessionToken(): string {
  const secret = getSecret();
  const payload = `${Date.now()}.${crypto.randomBytes(16).toString("hex")}`;
  const sig = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  return `${payload}.${sig}`;
}

export function verifySessionToken(token: string): boolean {
  if (!token) return false;
  let secret: string;
  try {
    secret = getSecret();
  } catch {
    return false;
  }
  const lastDot = token.lastIndexOf(".");
  if (lastDot === -1) return false;
  const payload = token.slice(0, lastDot);
  const sig = token.slice(lastDot + 1);
  const expected = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  if (sig.length !== expected.length) return false;
  return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
}
