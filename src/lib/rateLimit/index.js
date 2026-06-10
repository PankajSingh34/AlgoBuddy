import { Redis } from "@upstash/redis";
import { jwtVerify } from "jose";
import { getClientIp } from "@/lib/getClientIp";

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

    if (redis) {
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
        return { allowed: false, remaining: 0, retryAfter: Math.max(1, retryAfter), resetAt: now + retryAfter * 1000 };
      }
      return { allowed: true, remaining: Math.max(0, maxRequests - count), retryAfter: 0, resetAt: now + windowMs };
    }

    if (process.env.NODE_ENV === "production") {
      throw new Error("Critical: Redis connection variables (UPSTASH_REDIS_REST_URL/TOKEN) must be configured in production environments.");
    }

    gc();

    const bucket = store.get(key);
    if (!bucket || bucket.resetAt <= now) {
      const resetAt = now + windowMs;
      store.set(key, { count: 1, resetAt });
      return { allowed: true, remaining: maxRequests - 1, retryAfter: 0, resetAt };
    }
    if (bucket.count >= maxRequests) {
      const retryAfter = Math.ceil((bucket.resetAt - now) / 1000);
      return { allowed: false, remaining: 0, retryAfter: Math.max(1, retryAfter), resetAt: bucket.resetAt };
    }
    bucket.count += 1;
    return { allowed: true, remaining: maxRequests - bucket.count, retryAfter: 0, resetAt: bucket.resetAt };
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
  if (redis) {
    try { await redis.del(`${RATE_LIMIT_KEY_PREFIX}${key}`); } catch {}
  }
  store.delete(key);
}

export async function resetAll() {
  if (redis) {
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
    } catch (err) {
      console.error("[rateLimit] Error during resetAll:", err);
    }
  }
  store.clear();
}

let localSmtpCounter = 0;
let localSmtpDate = new Date().toISOString().split("T")[0];

export async function checkGlobalSmtpQuota(maxPerDay = 500) {
  const today = new Date().toISOString().split("T")[0];

  if (!redis) {
    if (localSmtpDate !== today) {
      localSmtpCounter = 0;
      localSmtpDate = today;
    }
    localSmtpCounter += 1;
    return {
      allowed: localSmtpCounter <= maxPerDay,
      remaining: Math.max(0, maxPerDay - localSmtpCounter),
    };
  }

  const dailyKey = `smtp:quota:${today}`;
  const count = await redis.incr(dailyKey);
  if (count === 1) {
    await redis.expire(dailyKey, 86400);
  }
  return {
    allowed: count <= maxPerDay,
    remaining: Math.max(0, maxPerDay - count),
  };
}
