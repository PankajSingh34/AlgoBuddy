import { createServerClient } from "@supabase/ssr";
import { getSupabaseConfig as _getSupabaseConfig } from "./shared-utils.js";

// For testing purposes, allow overriding the dependency functions
let cookiesImpl = null;
let createServerClientImpl = null;

export function setMockDependencies(cookies, createServerClient) {
  cookiesImpl = cookies;
  createServerClientImpl = createServerClient;
}

export function getSupabaseConfig() {
  const config = _getSupabaseConfig();
  if (!config) return null;
  const serviceKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey || String(serviceKey).trim().startsWith("Your ")) return null;
  config.supabaseServiceKey = String(serviceKey).trim();
  return config;
}

export async function getAuthenticatedUser() {  
  const config = getSupabaseConfig();
  if (!config) {
    console.error("[Authentication Helper] Config error: Missing or invalid Supabase environment variables.");
    return { success: false, type: "CONFIG_ERROR" };
  }

  try {
    let cookieStore;
    if (cookiesImpl) {
      cookieStore = await cookiesImpl();
    } else {
      const nextHeaders = await import("next/headers");
      cookieStore = await nextHeaders.cookies();
    }

    const clientCreator = createServerClientImpl || createServerClient;
    const client = clientCreator(config.supabaseUrl, config.supabaseAnonKey, {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch (e) {
            // Can happen during GET requests or rendering in Next.js, which is expected/normal.
          }
        },
      },
    });

    // Race getUser() against a 5-second timeout so that network issues
    // (ConnectTimeoutError to Supabase) fail fast instead of blocking
    // every API route for the full 10-second fetch timeout.
    let timeoutId;
    // Resolve with a sentinel instead of rejecting+silencing:
    // .catch(()=>{}) previously caused race() to return undefined,
    // making the destructure below throw TypeError → mis-classified as AUTH_PROVIDER_ERROR.
    const timeoutPromise = new Promise((resolve) => {
      timeoutId = setTimeout(
        () => resolve({ data: null, error: null, __timedOut: true }),
        5000
      );
    });

    let raceResult;
    try {
      raceResult = await Promise.race([
        client.auth.getUser(),
        timeoutPromise,
      ]);
    } finally {
      clearTimeout(timeoutId);
    }

    if (raceResult?.__timedOut) {
      console.warn("[Authentication Helper] Auth check timed out — treating as unauthenticated.");
      return { success: false, type: "UNAUTHENTICATED" };
    }

    const { data, error } = raceResult;

    if (error) {
      console.error("[Authentication Helper] Auth provider error during getUser:", error.message || error);
      return { success: false, type: "AUTH_PROVIDER_ERROR" };
    }

    if (!data || !data.user) {
      console.warn("[Authentication Helper] Unauthenticated request: No user session found.");
      return { success: false, type: "UNAUTHENTICATED" };
    }

    return { success: true, user: data.user };
  } catch (err) {
    // Network-level errors (e.g. UND_ERR_CONNECT_TIMEOUT) still reach here.
    // The explicit timeout case is now handled above via the __timedOut sentinel.
    if (err?.cause?.code === "UND_ERR_CONNECT_TIMEOUT") {
      console.warn("[Authentication Helper] Network timeout — treating as unauthenticated.");
      return { success: false, type: "UNAUTHENTICATED" };
    }
    console.error("[Authentication Helper] Critical exception during authentication verification:", err.message || err);
    return { success: false, type: "AUTH_PROVIDER_ERROR" };
  }
}

/**
 * Verifies a Supabase JWT access token directly using the Supabase admin client.
 * Used by the WebSocket arena server and other non-HTTP contexts where
 * cookie-based session verification is not available.
 *
 * @param {string} token - The Supabase access_token JWT
 * @returns {Promise<object|null>} The verified user object, or null if invalid/expired
 */
export async function verifySupabaseToken(token) {
  if (!token) return null;

  const config = getSupabaseConfig();
  if (!config) {
    console.error("[verifySupabaseToken] Config error: Missing Supabase environment variables.");
    return null;
  }

  try {
    // Use the service role client for admin-level token verification
    const { createClient } = await import("@supabase/supabase-js");
    const adminClient = createClient(config.supabaseUrl, config.supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data, error } = await adminClient.auth.getUser(token);
    if (error || !data?.user) {
      console.warn("[verifySupabaseToken] Token verification failed:", error?.message || "No user returned");
      return null;
    }

    return data.user;
  } catch (err) {
    console.error("[verifySupabaseToken] Error:", err.message || err);
    return null;
  }
}
