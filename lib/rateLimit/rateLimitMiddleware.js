// lib/rateLimit/rateLimitMiddleware.js
//
// Thin Next.js App Router adapter around checkRateLimit.
//
// Usage inside any route handler:
//   import { applyRateLimit } from "@/lib/rateLimit/rateLimitMiddleware";
//
//   export async function POST(request) {
//     const limitResponse = await applyRateLimit(request);
//     if (limitResponse) return limitResponse;   // <-- 429 sent
//     // ... rest of handler
//   }
//
// KEY STRATEGY
// ─────────────────────────────────────────────────────────────────────
// 1. Prefer Supabase userId from the Authorization header (authenticated
//    users get a per-user quota, not a per-IP quota). This prevents one
//    person burning the IP bucket of a shared NAT/proxy.
// 2. Fall back to the real client IP extracted from Vercel / Next.js
//    forwarding headers.

const { NextResponse } = require("next/server");
const { createClient } = require("@supabase/supabase-js");
const { checkRateLimit } = require("./rateLimit");

/**
 * Extract a stable identity key from the incoming request.
 * Returns userId if authenticated, otherwise the best available IP.
 *
 * @param {Request} request  - Native Web API Request (Next.js App Router)
 * @returns {Promise<string>}
 */
async function resolveIdentityKey(request) {
  // ── Try to identify via Supabase JWT ─────────────────────────────
  try {
    const authHeader = request.headers.get("authorization") ?? "";
    const token = authHeader.replace(/^Bearer\s+/i, "");

    if (token) {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_KEY // service key for server-side validation
      );
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser(token);

      if (!error && user?.id) {
        return `user:${user.id}`;
      }
    }
  } catch {
    // If Supabase is unavailable, fall through to IP-based limiting
  }

  // ── Fall back to IP ───────────────────────────────────────────────
  // Vercel sets x-real-ip; fallback chain for other hosts.
  const ip =
    request.headers.get("x-real-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown";

  return `ip:${ip}`;
}

/**
 * Apply rate limiting to the current request.
 *
 * @param {Request} request
 * @returns {Promise<NextResponse|null>}
 *   Returns a 429 NextResponse if the limit is exceeded,
 *   or null if the request should proceed.
 */
async function applyRateLimit(request) {
  const key = await resolveIdentityKey(request);
  const { allowed, remaining, retryAfter } = await checkRateLimit(key);

  if (!allowed) {
    return NextResponse.json(
      {
        error: "Too many requests",
        message: `You can run at most ${process.env.RATE_LIMIT_MAX ?? 10} code executions per minute. Please wait ${retryAfter}s.`,
        retryAfter,
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(retryAfter),
          "X-RateLimit-Limit": String(10),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": String(Math.floor(Date.now() / 1000) + retryAfter),
        },
      }
    );
  }

  // Request is allowed — caller proceeds, nothing returned
  return null;
}

module.exports = { applyRateLimit, resolveIdentityKey };