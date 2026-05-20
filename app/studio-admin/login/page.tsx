"use client";

import { useActionState } from "react";
import { useState } from "react";
import { AtSign, Eye, EyeOff, Lock } from "lucide-react";
import Image from "next/image";

import { loginAction } from "@/app/studio-admin/login/actions";
import type { LoginState } from "@/app/studio-admin/login/actions";

const initialState: LoginState = { error: null };

export default function StudioAdminLoginPage() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-(--neutral-50) px-4">
      {/* Ambient background */}
      <div aria-hidden="true" className="admin-login-ambient pointer-events-none fixed inset-0" />
      {/* Fine grid overlay */}
      <div aria-hidden="true" className="admin-login-grid pointer-events-none fixed inset-0 opacity-40" />

      <div className="relative w-full max-w-105">
        {/* Logo */}
        <div className="mb-10 flex flex-col items-center gap-4">
          <Image
            src="/logo.svg"
            alt="Yuvabe Studios"
            width={200}
            height={57}
            className="h-auto w-50"
            priority
          />
          <div className="flex items-center gap-2">
            <div className="h-px w-8 bg-(--neutral-300)" />
            <span className="font-mono text-[10px] font-medium uppercase tracking-widest text-(--neutral-400)">
              Content Studio
            </span>
            <div className="h-px w-8 bg-(--neutral-300)" />
          </div>
        </div>

        {/* Card */}
        <div className="overflow-hidden rounded-3xl border border-(--color-border-default) bg-white shadow-[0_20px_60px_rgba(17,17,17,0.08),0_4px_16px_rgba(17,17,17,0.04)]">
          {/* Card header */}
          <div className="border-b border-(--color-border-default) bg-(--neutral-50)/60 px-8 py-6">
            <h1 className="text-[20px] font-semibold tracking-tight text-(--neutral-900)">
              Welcome back
            </h1>
            <p className="mt-1 text-[13px] leading-relaxed text-(--neutral-500)">
              Sign in with your <span className="font-medium text-(--neutral-700)">@yuvabe.com</span> email and admin password.
            </p>
          </div>

          {/* Form */}
          <form action={formAction} className="space-y-4 px-8 py-7">
            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-[13px] font-medium text-(--neutral-700)">
                Work email
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-(--neutral-400)">
                  <AtSign size={14} />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="you@yuvabe.com"
                  className="w-full rounded-xl border border-(--color-border-default) bg-(--neutral-50) py-3.5 pl-10 pr-4 text-[14px] outline-none transition-all placeholder:text-(--neutral-400) focus:border-brand focus:bg-white focus:shadow-[0_0_0_3px_rgba(88,41,199,0.1)]"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-[13px] font-medium text-(--neutral-700)">
                Password
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-(--neutral-400)">
                  <Lock size={14} />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  placeholder="Enter admin password"
                  className="w-full rounded-xl border border-(--color-border-default) bg-(--neutral-50) py-3.5 pl-10 pr-11 text-[14px] outline-none transition-all placeholder:text-(--neutral-400) focus:border-brand focus:bg-white focus:shadow-[0_0_0_3px_rgba(88,41,199,0.1)]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute inset-y-0 right-4 flex items-center text-(--neutral-400) transition hover:text-(--neutral-600)"
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {state.error && (
              <div className="flex items-start gap-2.5 rounded-xl border border-red-100 bg-red-50 px-4 py-3">
                <span className="mt-0.5 size-1.5 shrink-0 rounded-full bg-red-400" />
                <p className="text-[13px] font-medium text-red-600">{state.error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={pending}
              className="w-full rounded-xl bg-brand py-3.5 text-[14px] font-semibold text-white shadow-[0_4px_16px_rgba(88,41,199,0.3)] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(88,41,199,0.4)] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none"
            >
              {pending ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-[12px] text-(--neutral-400)">
          Access restricted to Yuvabe Studios team members.
        </p>
      </div>
    </main>
  );
}
