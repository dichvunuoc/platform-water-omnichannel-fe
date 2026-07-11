"use client";

import { createAuthClient } from "better-auth/react";
import { phoneNumberClient } from "better-auth/client/plugins";

/**
 * better-auth React client.
 *
 * baseURL MUST be absolute (better-auth rejects relative URLs server-side
 * during prerender). It points same-origin to /api/auth, which next.config.ts
 * rewrites proxy to the backend — so the HttpOnly session cookie flows
 * automatically and no CORS config is needed on the backend.
 *
 * Mirrors the backend better-auth setup (better-auth ^1.6.14, phoneNumber plugin).
 */
// Dynamic baseURL: client uses the browser's origin (works for localhost, tunnel,
// production); server (SSR/prerender) uses localhost (better-auth requires absolute).
const AUTH_BASE_URL =
  typeof window !== "undefined"
    ? `${window.location.origin}/api/auth`
    : `${process.env.NEXT_PUBLIC_APP_ORIGIN?.replace(/\/$/, "") ?? "http://localhost:3001"}/api/auth`;

export const authClient = createAuthClient({
  baseURL: AUTH_BASE_URL,
  fetchOptions: {
    credentials: "include",
  },
  plugins: [phoneNumberClient()],
});

// Convenience re-exports for hooks/components.
export const {
  useSession,
  signIn,
  signOut,
} = authClient;
