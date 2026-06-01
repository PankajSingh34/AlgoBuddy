// lib/rateLimit/rateLimit.js
//
// Sliding-window rate limiter backed by an in-memory Map.
//
// WHY IN-MEMORY?
// ────────────────────────────────────────────────────────────────────
// For a Vercel/serverless deployment the "correct" approach would be
// Redis (Upstash) so limits survive function cold-starts. But:
//   • The project uses no Redis today.
//   • Adding Upstash costs $ and needs new env vars.
//   • For GSSOC the in-memory approach is a safe, reviewable first PR.
//
// NOTE: leave a TODO comment so the maintainer can swap to Redis later.
//
// ALGORITHM (sliding window)
// ────────────────────────────────────────────────────────────────────
// We store an array of timestamps per key. On each request:
//  1. Drop all timestamps older than WINDOW_SEC seconds.
//  2. If the remaining count ≥ MAX_REQUESTS → deny.
//  3. Otherwise push the current timestamp and allow.
//
// This is O(n) per request in the worst case but n is tiny (≤ 10).

const {
  RATE_LIMIT_MAX_REQUESTS,
  RATE_LIMIT_WINDOW_SEC,
} = require("../sandbox/sandbox.config");

// Map<key: string, timestamps: number[]>
// Each value is an array of Unix-ms timestamps for recent requests.
const requestLog = new Map();

/**
 * Check whether a request from `key` is allowed.
 *
 * @param {string} key        - userId from Supabase session, or IP address.
 * @param {number} [maxReq]   - Override for max requests (default from config).
 * @param {number} [windowSec]- Override for window in seconds (default from config).
 * @returns {{ allowed: boolean, remaining: number, retryAfter: number }}
 *   retryAfter is 0 when allowed, otherwise the seconds until the oldest
 *   timestamp expires and a new request would be permitted.
 */
function checkRateLimit(
  key,
  maxReq = RATE_LIMIT_MAX_REQUESTS,
  windowSec = RATE_LIMIT_WINDOW_SEC
) {
  const now = Date.now();
  const windowMs = windowSec * 1000;

  // Get or create the timestamp list for this key
  const timestamps = requestLog.get(key) ?? [];

  // 1. Slide: drop timestamps outside the window
  const recent = timestamps.filter((t) => now - t < windowMs);

  // 2. Check limit
  if (recent.length >= maxReq) {
    // How long until the oldest timestamp falls out of the window
    const oldest = recent[0];
    const retryAfter = Math.ceil((oldest + windowMs - now) / 1000);
    requestLog.set(key, recent); // store pruned list (no new entry)
    return { allowed: false, remaining: 0, retryAfter };
  }

  // 3. Allow — record this request
  recent.push(now);
  requestLog.set(key, recent);

  return {
    allowed: true,
    remaining: maxReq - recent.length,
    retryAfter: 0,
  };
}

/**
 * Reset the rate-limit state for a key.
 * Useful in tests and admin tooling.
 *
 * @param {string} key
 */
function resetKey(key) {
  requestLog.delete(key);
}

/**
 * Wipe the entire in-memory store.
 * Call this in test teardown; not meant for production use.
 */
function resetAll() {
  requestLog.clear();
}

// TODO: swap requestLog to an Upstash Redis client for multi-instance
//       Vercel deployments. Replace checkRateLimit body with:
//       const result = await redis.pipeline()
//         .zadd(key, { score: now, member: now })
//         .zremrangebyscore(key, 0, now - windowMs)
//         .zcard(key)
//         .expire(key, windowSec)
//         .exec();

module.exports = { checkRateLimit, resetKey, resetAll };