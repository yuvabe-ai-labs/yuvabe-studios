"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { checkEmailDomain, checkPassword, createSessionToken } from "@/lib/admin-auth";
import { SESSION_COOKIE, SESSION_MAX_AGE } from "@/lib/admin-auth-constants";

export type LoginState = { error: string | null };

export async function loginAction(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = formData.get("email");
  const password = formData.get("password");

  if (typeof email !== "string" || !email.trim()) {
    return { error: "Please enter your email address." };
  }

  if (!checkEmailDomain(email)) {
    return { error: "Only @yuvabe.com email addresses are allowed." };
  }

  if (typeof password !== "string" || !checkPassword(password)) {
    return { error: "Incorrect password." };
  }

  const token = createSessionToken();
  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });

  redirect("/studio-admin");
}

export async function logoutAction() {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
  redirect("/studio-admin/login");
}
