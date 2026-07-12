import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { ApiError, AuthError, ConfigError, handleApiError } from "@/lib/apiErrors";

let supabaseAdminInstance;

function requireEnvVar(name) {
  const value = process.env[name];
  if (!value) {
    throw new ConfigError(`Environment variable ${name} is not configured`);
  }
  return value;
}

function getSupabaseUrl() {
  return requireEnvVar("NEXT_PUBLIC_SUPABASE_URL");
}

function getAnonKey() {
  return requireEnvVar("NEXT_PUBLIC_SUPABASE_ANON_KEY");
}

function getServiceKey() {
  return requireEnvVar("SUPABASE_SERVICE_KEY");
}

export function getSupabaseAdmin() {
  if (supabaseAdminInstance) return supabaseAdminInstance;
  const url = getSupabaseUrl();
  const key = getServiceKey();
  supabaseAdminInstance = createClient(url, key);
  return supabaseAdminInstance;
}

function createServerClientWithCookies(url, anonKey, cookieStore) {
  const isProduction = process.env.NODE_ENV === "production";
  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          try {
            cookieStore.set(name, value, {
              ...options,
              sameSite: "strict",
              secure: isProduction,
            });
          } catch {
            // Can happen during GET requests or rendering in Next.js
          }
        });
      },
    },
  });
}

/**
 * Creates a Supabase server client using the anon key, which respects
 * Row-Level Security policies defined in the database. Use this for all
 * user-data API routes instead of getSupabaseAdmin().
 * Requires a cookie store (from next/headers cookies()) for SSR auth.
 */
export function getSupabaseServerClient(cookieStore) {
  const url = getSupabaseUrl();
  const anonKey = getAnonKey();
  return createServerClientWithCookies(url, anonKey, cookieStore);
}

/**
 * Creates a Supabase server client using the anon key from request cookies.
 * Alternative for route handlers that don't have access to next/headers cookies().
 */
export function getSupabaseRequestClient(request) {
  const url = getSupabaseUrl();
  const anonKey = getAnonKey();
  return createServerClientWithCookies(url, anonKey, request.cookies);
}

/** Anonymous Supabase client for public reads (no session cookies). */
export function getSupabaseAnonClient() {
  const url = getSupabaseUrl();
  const anonKey = getAnonKey();
  return createClient(url, anonKey);
}

export function jsonResponse(data, status = 200, extraHeaders = {}) {
  return Response.json(data, {
    status,
    headers: { "Content-Type": "application/json", ...extraHeaders },
  });
}

export function errorResponse(error) {
  return handleApiError(error);
}

export { handleApiError };
