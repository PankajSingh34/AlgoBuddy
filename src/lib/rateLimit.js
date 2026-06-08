import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const WINDOW_SECONDS = 60;
const MAX_REQUESTS = 5;

// ---------------------------------------------------------------------------
// In-memory fallback — used when Upstash env vars are not configured.
// Safe for local development (single process) but NOT for serverless
// production where multiple Lambda instances each hold an independent Map.
// ---------------------------------------------------------------------------
const memoryBuckets = new Map();

function checkMemory(key) {
  const now = Date.now();
  
  // --- Memory Leak Fix: Probabilistic Garbage Collection ---
  // Run GC on ~5% of requests to prune expired keys from the Map.
  if (Math.random() < 0.05) {
    for (const [k, b] of memoryBuckets.entries()) {
      if (b.resetAt <= now) {
        memoryBuckets.delete(k);
      }
    }
  }

  const bucket = memoryBuckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    const resetAt = now + WINDOW_SECONDS * 1_000;
    memoryBuckets.set(key, { count: 1, resetAt });
    return { allowed: true, remaining: MAX_REQUESTS - 1, resetAt };
  }
  if (bucket.count >= MAX_REQUESTS) {
    return { allowed: false, remaining: 0, resetAt: bucket.resetAt };
  }
  bucket.count += 1;
  return { allowed: true, remaining: MAX_REQUESTS - bucket.count, resetAt: bucket.resetAt };
}

// ---------------------------------------------------------------------------
// Upstash Redis sliding-window rate limiter — enforced globally across all
// serverless instances. Requires UPSTASH_REDIS_REST_URL and
// UPSTASH_REDIS_REST_TOKEN environment variables (set in Vercel project
// settings; see EnvExample.txt for documentation).
// ---------------------------------------------------------------------------
const ratelimit =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Ratelimit({
        redis: Redis.fromEnv(),
        limiter: Ratelimit.slidingWindow(MAX_REQUESTS, `${WINDOW_SECONDS} s`),
      })
    : null;

/**
 * Checks whether the given identifier (e.g. "contact:1.2.3.4") should be
 * allowed to proceed.
 *
 * In production (Upstash configured): enforced across all Lambda instances via
 * a shared Redis store — bypassing the rate limit by hitting different
 * instances is not possible.
 *
 * In local development (Upstash not configured): falls back to a process-local
 * Map. The limit still works correctly in a single-process dev server.
 *
 * @param {string} key  A namespaced identifier, e.g. "contact:<ip>"
 * @returns {Promise<{ allowed: boolean, remaining: number }>}
 */
export async function checkRateLimit(key) {
  if (!ratelimit) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "Critical: Redis connection variables (UPSTASH_REDIS_REST_URL/TOKEN) must be configured in production environments."
      );
    }
    return checkMemory(key);
  }

const { success, remaining, reset } = await ratelimit.limit(key);

return {
  allowed: success,
  remaining: remaining ?? 0,
  resetAt: reset ?? Date.now() + WINDOW_SECONDS * 1000,
};
}

// ---------------------------------------------------------------------------
// SMTP Quota Protection
// ---------------------------------------------------------------------------
let localSmtpCounter = 0;
let localSmtpDate = new Date().toISOString().split("T")[0];

/**
 * Enforces a global daily quota for outbound SMTP emails to prevent
 * third-party provider exhaustion (e.g. Gmail banning the account).
 * 
 * @param {number} maxPerDay - The maximum number of emails allowed per day.
 */
export async function checkGlobalSmtpQuota(maxPerDay = 500) {
  const today = new Date().toISOString().split("T")[0];

  // In-memory fallback for local dev
  if (!ratelimit) {
    if (localSmtpDate !== today) {
      localSmtpCounter = 0;
      localSmtpDate = today;
    }
    localSmtpCounter += 1;
    return { 
      allowed: localSmtpCounter <= maxPerDay, 
      remaining: Math.max(0, maxPerDay - localSmtpCounter) 
    };
  }

  // Global Redis implementation
  const redis = Redis.fromEnv();
  const dailyKey = `smtp:quota:${today}`;
  const count = await redis.incr(dailyKey);
  if (count === 1) {
    await redis.expire(dailyKey, 86400); // Expire after 24 hours
  }
  
  return { 
    allowed: count <= maxPerDay, 
    remaining: Math.max(0, maxPerDay - count) 
  };
}
