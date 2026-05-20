import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { SESSION_COOKIE } from "@/lib/admin-auth-constants";

// We cannot import server-only modules (like node:crypto) directly into middleware
// because middleware runs on the Edge runtime. Instead we re-implement a lightweight
// HMAC verification here using the Web Crypto API.

async function verifyToken(token: string, secret: string): Promise<boolean> {
  try {
    const lastDot = token.lastIndexOf(".");
    if (lastDot === -1) return false;
    const payload = token.slice(0, lastDot);
    const sig = token.slice(lastDot + 1);

    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"],
    );
    const expectedBuffer = await crypto.subtle.sign(
      "HMAC",
      key,
      new TextEncoder().encode(payload),
    );
    const expected = Array.from(new Uint8Array(expectedBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    return sig === expected;
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow the login page and its actions through unconditionally
  if (pathname.startsWith("/studio-admin/login")) {
    return NextResponse.next();
  }

  const secret = process.env.STUDIO_ADMIN_SECRET ?? "";
  const token = request.cookies.get(SESSION_COOKIE)?.value ?? "";
  const valid = secret && token ? await verifyToken(token, secret) : false;

  if (!valid) {
    const loginUrl = new URL("/studio-admin/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/studio-admin/:path*"],
};
