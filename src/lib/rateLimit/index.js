import { Redis } from "@upstash/redis";
import { jwtVerify } from "jose";
import { getClientIp } from "../getClientIp.js";

const RATE_LIMIT_KEY_PREFIX = "rl:";
const store = new Map();

function gc() {
  if (Math.random() < 0.05) {
    const now = Date.now();
    for (const [key, bucket] of store.entries()) {
      if (bucket.resetAt <= now) {
        store.delete(key);
      }
    }
  }
}

const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? Redis.fromEnv()
    : null;

let isRedisOffline = false;
let redisOfflineUntil = 0;
const COOLDOWN_MS = 10000;

function markRedisOffline(err) {
  if (!isRedisOffline) {
    isRedisOffline = true;
    console.error(`[rateLimit] Redis connection failed, activating in-memory fallback. Error: ${err.message || err}`);
  }
  redisOfflineUntil = Date.now() + COOLDOWN_MS;
}

function markRedisOnline() {
  if (isRedisOffline) {
    isRedisOffline = false;
    console.log("[rateLimit] Redis connection restored, resuming Redis-based rate limiting.");
  }
}

function shouldTryRedis() {
  if (!redis) return false;
  if (!isRedisOffline) return true;
  if (Date.now() >= redisOfflineUntil) {
    return true;
  }
  return false;
}

async function resolveIdentityKey(request) {
  try {
    const authHeader = request.headers.get("authorization") ?? "";
    const token = authHeader.replace(/^Bearer\s+/i, "");
    if (token) {
      const secret = new TextEncoder().encode(process.env.SUPABASE_JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);
      if (payload && payload.sub) {
        return `user:${payload.sub}`;
      }
    }
  } catch {}
  const ip = getClientIp(request.headers);
  return `ip:${ip}`;
}

export function createRateLimiter(options) {
  const { maxRequests, windowSeconds } = options;

  async function check(key) {
    const now = Date.now();
    const windowMs = windowSeconds * 1000;
    const redisKey = `${RATE_LIMIT_KEY_PREFIX}${key}`;

    if (shouldTryRedis()) {
      try {
        const uniqueMember = `${now}-${Math.random().toString(36).slice(2, 10)}`;
        const result = await redis
          .pipeline()
          .zadd(redisKey, { score: now, member: uniqueMember })
          .zremrangebyscore(redisKey, 0, now - windowMs)
          .zcard(redisKey)
          .expire(redisKey, windowSeconds)
          .exec();

        const count = result[2];
        if (count > maxRequests) {
          const oldestArray = await redis.zrange(redisKey, 0, 0);
          let oldest = now;
          if (oldestArray?.[0]) {
            const ts = Number(oldestArray[0].split("-")[0]);
            if (!isNaN(ts)) oldest = ts;
          }
          const retryAfter = Math.ceil((oldest + windowMs - now) / 1000);
          markRedisOnline();
          return { allowed: false, remaining: 0, retryAfter: Math.max(1, retryAfter), resetAt: now + retryAfter * 1000 };
        }
        markRedisOnline();
        return { allowed: true, remaining: Math.max(0, maxRequests - count), retryAfter: 0, resetAt: now + windowMs };
      } catch (err) {
        markRedisOffline(err);
      }
    }

    if (process.env.NODE_ENV === "production" && !redis) {
      console.warn("Critical: Redis connection variables (UPSTASH_REDIS_REST_URL/TOKEN) are not configured in production. Using in-memory fallback.");
    }

    gc();

    const isOutage = redis && (isRedisOffline || Date.now() < redisOfflineUntil);
    const limit = isOutage ? Math.max(1, Math.floor(maxRequests * 0.5)) : maxRequests;

    const bucket = store.get(key);
    if (!bucket || bucket.resetAt <= now) {
      const resetAt = now + windowMs;
      store.set(key, { count: 1, resetAt });
      return { allowed: true, remaining: limit - 1, retryAfter: 0, resetAt };
    }
    if (bucket.count >= limit) {
      const retryAfter = Math.ceil((bucket.resetAt - now) / 1000);
      return { allowed: false, remaining: 0, retryAfter: Math.max(1, retryAfter), resetAt: bucket.resetAt };
    }
    bucket.count += 1;
    return { allowed: true, remaining: limit - bucket.count, retryAfter: 0, resetAt: bucket.resetAt };
  }

  async function checkRequest(request) {
    const key = await resolveIdentityKey(request);
    const result = await check(key);
    if (!result.allowed) {
      const { NextResponse } = await import("next/server");
      return NextResponse.json(
        {
          error: "Too many requests",
          message: `Rate limit exceeded. Please wait ${result.retryAfter}s.`,
          retryAfter: result.retryAfter,
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(result.retryAfter),
            "X-RateLimit-Limit": String(maxRequests),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": String(Math.floor(Date.now() / 1000) + result.retryAfter),
          },
        }
      );
    }
    return null;
  }

  return { check, checkRequest };
}

export const authLimiter = createRateLimiter({ maxRequests: 5, windowSeconds: 60 });
export const apiLimiter = createRateLimiter({ maxRequests: 5, windowSeconds: 60 });
export const sandboxLimiter = createRateLimiter({ maxRequests: 10, windowSeconds: 60 });

export async function checkRateLimit(key) {
  return apiLimiter.check(key);
}

export async function resetKey(key) {
  if (shouldTryRedis()) {
    try {
      await redis.del(`${RATE_LIMIT_KEY_PREFIX}${key}`);
      markRedisOnline();
    } catch (err) {
      markRedisOffline(err);
    }
  }
  store.delete(key);
}

export async function resetAll({ scope = "rate-limit" } = {}) {
  if (scope !== "rate-limit") {
    throw new Error("Invalid scope for resetAll");
  }
  isRedisOffline = false;
  redisOfflineUntil = 0;
  if (shouldTryRedis()) {
    try {
      let cursor = 0;
      const keysToDelete = [];
      do {
        const result = await redis.scan(cursor, {
          match: `${RATE_LIMIT_KEY_PREFIX}*`,
          count: 100,
        });
        cursor = Number(result[0]);
        keysToDelete.push(...result[1]);
      } while (cursor !== 0);

      if (keysToDelete.length > 0) {
        for (let i = 0; i < keysToDelete.length; i += 100) {
          await redis.del(...keysToDelete.slice(i, i + 100));
        }
      }
      markRedisOnline();
    } catch (err) {
      markRedisOffline(err);
    }
  }
  store.clear();
}

let localSmtpCounter = 0;
let localSmtpDate = new Date().toISOString().split("T")[0];

export async function checkGlobalSmtpQuota(maxPerDay = 500) {
  const today = new Date().toISOString().split("T")[0];

  let currentCount;

  if (!redis) {
    if (localSmtpDate !== today) {
      localSmtpCounter = 0;
      localSmtpDate = today;
    }
    currentCount = localSmtpCounter;
  } else {
    const dailyKey = `smtp:quota:${today}`;
    currentCount = await redis.get(dailyKey) || 0;
  }

  if (currentCount >= maxPerDay) {
    return { allowed: false, remaining: 0 };
  }

  if (!redis) {
    localSmtpCounter += 1;
  } else {
    const dailyKey = `smtp:quota:${today}`;
    const newCount = await redis.incr(dailyKey);
    if (newCount === 1) {
      await redis.expire(dailyKey, 86400);
    }
  }

  const usagePercent = ((currentCount + 1) / maxPerDay) * 100;
  if (usagePercent >= 80) {
    console.warn(
      `[smtp-quota] ${usagePercent.toFixed(0)}% of daily SMTP quota (${currentCount + 1}/${maxPerDay}) consumed`,
    );
  }

  return {
    allowed: true,
    remaining: Math.max(0, maxPerDay - currentCount - 1),
  };
}
