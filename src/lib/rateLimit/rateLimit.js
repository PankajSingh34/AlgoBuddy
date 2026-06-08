// lib/rateLimit/rateLimit.js
//
// Sliding-window rate limiter backed by an in-memory Map or Upstash Redis.
//
// WHY IN-MEMORY FALLBACK?
// ────────────────────────────────────────────────────────────────────
// For a Vercel/serverless deployment the "correct" approach is Redis (Upstash)
// so limits survive function cold-starts. But for local development and unit
// testing, falling back to a process-local Map is incredibly simple, fast,
// and doesn't require configuring external environment variables.
//
// ALGORITHM (sliding window)
// ────────────────────────────────────────────────────────────────────
// We store unique member string representations of timestamps in Redis, or
// raw timestamps in an array per key. On each request:
//  1. Drop all timestamps older than WINDOW_SEC seconds.
//  2. If the remaining count ≥ MAX_REQUESTS → deny.
//  3. Otherwise push the current timestamp and allow.
//

const { Redis } = require("@upstash/redis");
const {
  RATE_LIMIT_MAX_REQUESTS,
  RATE_LIMIT_WINDOW_SEC,
} = require("../sandbox/sandbox.config");

// Map<key: string, timestamps: number[]>
// Each value is an array of Unix-ms timestamps for recent requests.
const requestLog = new Map();

const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? Redis.fromEnv()
    : null;

/**
 * Check whether a request from `key` is allowed.
 *
 * @param {string} key        - userId from Supabase session, or IP address.
 * @param {number} [maxReq]   - Override for max requests (default from config).
 * @param {number} [windowSec]- Override for window in seconds (default from config).
 * @returns {Promise<{ allowed: boolean, remaining: number, retryAfter: number }>}
 *   retryAfter is 0 when allowed, otherwise the seconds until the oldest
 *   timestamp expires and a new request would be permitted.
 */
async function checkRateLimit(
  key,
  maxReq = RATE_LIMIT_MAX_REQUESTS,
  windowSec = RATE_LIMIT_WINDOW_SEC
) {
  if (process.env.NODE_ENV === "production" && !redis) {
    throw new Error(
      "Critical: Redis connection variables (UPSTASH_REDIS_REST_URL/TOKEN) must be configured in production environments."
    );
  }

  const now = Date.now();
  const windowMs = windowSec * 1000;

  if (redis) {
    // Generate a unique member to allow multiple distinct requests in the same millisecond.
    const uniqueMember = `${now}-${Math.random().toString(36).slice(2, 10)}`;

    const result = await redis.pipeline()
      .zadd(key, { score: now, member: uniqueMember })
      .zremrangebyscore(key, 0, now - windowMs)
      .zcard(key)
      .expire(key, windowSec)
      .exec();

    const count = result[2]; // Cardinality (ZCARD) is the 3rd pipeline result
    if (count > maxReq) {
      // Find the oldest member in the active window
      const oldestArray = await redis.zrange(key, 0, 0);
      let oldest = now;
      if (oldestArray && oldestArray.length > 0) {
        const oldestMember = oldestArray[0];
        if (oldestMember) {
          const oldestTs = Number(oldestMember.split("-")[0]);
          if (!isNaN(oldestTs)) {
            oldest = oldestTs;
          }
        }
      }
      const retryAfter = Math.ceil((oldest + windowMs - now) / 1000);
      return { allowed: false, remaining: 0, retryAfter: Math.max(1, retryAfter) };
    }

    return {
      allowed: true,
      remaining: Math.max(0, maxReq - count),
      retryAfter: 0,
    };
  }

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

  // --- Memory Leak Fix: Probabilistic In-Memory Garbage Collection ---
  // Run GC on ~5% of requests to prune abandoned keys from the Map.
  // We delete keys where the newest request is older than the window.
  if (Math.random() < 0.05) {
    const gcWindowMs = RATE_LIMIT_WINDOW_SEC * 1000;
    for (const [k, tsArray] of requestLog.entries()) {
      if (tsArray.length === 0 || (now - tsArray[tsArray.length - 1]) > gcWindowMs) {
        requestLog.delete(k);
      }
    }
  }

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
async function resetKey(key) {
  if (redis) {
    await redis.del(key);
  }
  requestLog.delete(key);
}

/**
 * Wipe the entire in-memory store.
 * Call this in test teardown; not meant for production use.
 */
async function resetAll() {
  if (redis) {
    // Attempt to clear rate limit keys in Redis (specifically prefixed or all if needed)
    try {
      const keys = await redis.keys("*");
      if (keys && keys.length > 0) {
        await redis.del(...keys);
      }
    } catch {
      // Gracefully catch any redis errors during cleanup
    }
  }
  requestLog.clear();
}

module.exports = { checkRateLimit, resetKey, resetAll };