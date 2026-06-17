import crypto from "crypto";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";
import { Redis } from "@upstash/redis";
import { sanitizeSessionText } from "./sessionTrace.js";

const SESSION_TTL_SECONDS = 7 * 24 * 60 * 60;
const SESSION_TTL_MS = SESSION_TTL_SECONDS * 1000;
const SESSION_INDEX_KEY = "collab:session:index";
const SESSION_PUBLIC_INDEX_KEY = "collab:session:public:index";
const PUBLIC_VISIBILITY = new Set(["public", "unlisted", "private"]);
const PASSWORD_HASH_ALGORITHM = "bcrypt";
const PASSWORD_HASH_WORK_FACTOR = 12;
const DEFAULT_PAGE_LIMIT = 50;
const MAX_PAGE_LIMIT = 100;
const SUBSCRIPTION_TOKEN_TTL_MS = 2 * 60 * 1000;
const MAX_EXPIRED_BUFFER = 50;
const MEMORY_SWEEP_INTERVAL_MS = 60_000;
const MAX_MEMORY_SESSIONS = parseInt(process.env.MAX_MEMORY_SESSIONS || '1000', 10);

const ATOMIC_WRITE_SCRIPT = `
  redis.call('SET', KEYS[1], ARGV[1], 'EX', ARGV[2])
  redis.call('ZADD', KEYS[2], ARGV[3], KEYS[1])
  if ARGV[4] == "public" then
    redis.call('ZADD', KEYS[3], ARGV[3], KEYS[1])
  else
    redis.call('ZREM', KEYS[3], KEYS[1])
  end
  return 1
`;

const ATOMIC_JOIN_SCRIPT = `
  local key = KEYS[1]
  local indexKey = KEYS[2]
  local userId = ARGV[1]
  local tokenHash = ARGV[2]
  local tokenStr = ARGV[3]
  local expiresAt = ARGV[4]
  local ttl = ARGV[5]
  local score = ARGV[6]
  local nowStr = ARGV[7]

  local json = redis.call('GET', key)
  if not json then return 'NOT_FOUND' end

  local session = cjson.decode(json)

  local participants = session.participantUserIds or {}
  local isNew = true
  for i, id in ipairs(participants) do
    if id == userId then
      isNew = false
      break
    end
  end

  if isNew then
    table.insert(participants, userId)
    session.participantUserIds = participants
    session.participantCount = (session.participantCount or 0) + 1
  end

  local tokens = session.subscriptionTokens or {}
  local activeTokens = {}
  for i, entry in ipairs(tokens) do
    if entry.expiresAt and entry.expiresAt > nowStr then
      table.insert(activeTokens, entry)
    end
  end

  table.insert(activeTokens, {
    tokenHash = tokenHash,
    userId = userId,
    expiresAt = expiresAt
  })
  session.subscriptionTokens = activeTokens

  redis.call('SET', key, cjson.encode(session), 'EX', ttl)
  redis.call('ZADD', indexKey, score, key)
  if session.visibility == "public" then
    redis.call('ZADD', KEYS[3], score, key)
  end

  return cjson.encode(session)
`;

const ATOMIC_LEAVE_SCRIPT = `
  local key = KEYS[1]
  local indexKey = KEYS[2]
  local userId = ARGV[1]
  local ttl = ARGV[2]
  local score = ARGV[3]

  local json = redis.call('GET', key)
  if not json then return 'NOT_FOUND' end

  local session = cjson.decode(json)

  local participants = session.participantUserIds or {}
  local newParticipants = {}
  local found = false
  for i, id in ipairs(participants) do
    if id == userId then
      found = true
    else
      table.insert(newParticipants, id)
    end
  end

  if not found then return cjson.encode({ found = false }) end

  session.participantUserIds = newParticipants
  session.participantCount = math.max(0, (session.participantCount or 1) - 1)

  local tokens = session.subscriptionTokens or {}
  local remainingTokens = {}
  for i, entry in ipairs(tokens) do
    if entry.userId ~= userId then
      table.insert(remainingTokens, entry)
    end
  end
  session.subscriptionTokens = remainingTokens

  redis.call('SET', key, cjson.encode(session), 'EX', ttl)
  redis.call('ZADD', indexKey, score, key)
  if session.visibility == "public" then
    redis.call('ZADD', KEYS[3], score, key)
  end

  return cjson.encode({ found = true, participantCount = session.participantCount })
`;

const ATOMIC_CONSUME_TOKEN_SCRIPT = `
  local key = KEYS[1]
  local indexKey = KEYS[2]
  local tokenHash = ARGV[1]
  local userId = ARGV[2]
  local ttl = ARGV[3]
  local score = ARGV[4]

  local json = redis.call('GET', key)
  if not json then return 'NOT_FOUND' end

  local session = cjson.decode(json)
  local oldTokens = session.subscriptionTokens or {}
  local newTokens = {}
  local found = false

  for i, entry in ipairs(oldTokens) do
    if entry.tokenHash == tokenHash and entry.userId == userId then
      found = true
    else
      table.insert(newTokens, entry)
    end
  end

  if not found then return 'TOKEN_INVALID' end

  session.subscriptionTokens = newTokens
  redis.call('SET', key, cjson.encode(session), 'EX', ttl)
  redis.call('ZADD', indexKey, score, key)
  if session.visibility == "public" then
    redis.call('ZADD', KEYS[3], score, key)
  end
  return session.sessionSecret or ''
`;

const memorySessions = new Map();
const memorySessionTtls = new Map();
const memoryLocks = new Map();
let memorySweepTimer = null;
let reconciliationTimer = null;
const RECONCILIATION_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes
let memoryWriteCount = 0;
const MEMORY_WRITE_WARN_THRESHOLD = 50;

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
    console.error(`[sessionStore] Redis connection failed, activating in-memory fallback. Error: ${err.message || err}`);
  }
  redisOfflineUntil = Date.now() + COOLDOWN_MS;
}

let backfillInProgress = false;

async function backfillMemorySessionsToRedis() {
  if (!redis || memorySessions.size === 0 || backfillInProgress) return 0;
  backfillInProgress = true;
  let migrated = 0;
  try {
    const entries = [...memorySessions.entries()];
    const BATCH_SIZE = 100;
    for (let i = 0; i < entries.length; i += BATCH_SIZE) {
      const batch = entries.slice(i, i + BATCH_SIZE);
      for (const [id, session] of batch) {
        const ttl = memorySessionTtls.get(id);
        if (!ttl || ttl <= Date.now()) continue;
        const existing = await redis.get(sessionKey(id));
        if (!existing) {
          await redis.set(sessionKey(id), session, { ex: SESSION_TTL_SECONDS });
          migrated++;
          memorySessions.delete(id);
          memorySessionTtls.delete(id);
        } else {
          memorySessions.delete(id);
          memorySessionTtls.delete(id);
        }
      }
      await new Promise(resolve => setImmediate(resolve));
    }
    if (migrated > 0) {
      console.log(`[sessionStore] Migrated ${migrated} sessions from memory to Redis. Memory sessions remaining: ${memorySessions.size}`);
    } else if (memorySessions.size > 0) {
      console.log(`[sessionStore] Reconciliation complete: ${memorySessions.size} sessions already in Redis, cleared from memory.`);
    }
    return migrated;
  } catch (err) {
    console.error("[sessionStore] Failed to backfill memory sessions to Redis:", err.message || err);
    return 0;
  } finally {
    backfillInProgress = false;
  }
}

function markRedisOnline() {
  if (isRedisOffline) {
    isRedisOffline = false;
    console.log("[sessionStore] Redis connection restored, resuming Redis session storage.");
    backfillMemorySessionsToRedis().catch(err => {
      console.error("[sessionStore] Failed to backfill memory sessions:", err.message || err);
    });
  }
}

function startReconciliationTimer() {
  if (reconciliationTimer) return;
  reconciliationTimer = setInterval(async () => {
    if (memorySessions.size > 0 && shouldTryRedis()) {
      await backfillMemorySessionsToRedis();
    }
    // Log warning if memory session count exceeds threshold
    if (memorySessions.size > MEMORY_WRITE_WARN_THRESHOLD) {
      console.warn(`[sessionStore] High memory session count: ${memorySessions.size}. Redis may be experiencing prolonged outage.`);
    }
    // Log memory usage statistics
    if (memorySessions.size > 0 || memoryWriteCount > 0) {
      console.log(`[sessionStore] Memory session stats: ${memorySessions.size} active, ${memoryWriteCount} total writes to memory fallback.`);
    }
  }, RECONCILIATION_INTERVAL_MS);
  if (reconciliationTimer.unref) reconciliationTimer.unref();
}

function shouldTryRedis() {
  if (!redis) return false;
  if (!isRedisOffline) return true;
  if (Date.now() >= redisOfflineUntil) {
    return true;
  }
  return false;
}

function ensureRedisConnection() {
  if (process.env.NODE_ENV === "production" && !redis) {
    console.warn(
      "Production environment is missing Redis variables; using in-memory collaboration session store."
    );
  }
}

function startMemorySweeper() {
  if (memorySweepTimer) return;
  function scheduleSweep() {
    const ratio = memorySessions.size / MAX_MEMORY_SESSIONS;
    const interval = ratio > 0.8 ? 10_000 : ratio > 0.5 ? 30_000 : MEMORY_SWEEP_INTERVAL_MS;
    memorySweepTimer = setTimeout(() => {
      const now = Date.now();
      for (const [key, expiresAt] of memorySessionTtls) {
        if (now >= expiresAt) {
          memorySessions.delete(key);
          memorySessionTtls.delete(key);
        }
      }
      scheduleSweep();
    }, interval);
    if (memorySweepTimer.unref) memorySweepTimer.unref();
  }
  scheduleSweep();
}

function touchMemorySession(sessionId) {
  memorySessionTtls.set(sessionId, Date.now() + SESSION_TTL_MS);
}

function enforceMemorySessionCapacity() {
  if (memorySessions.size < MAX_MEMORY_SESSIONS) return;
  const sorted = [...memorySessionTtls.entries()].sort((a, b) => a[1] - b[1]);
  const evictCount = Math.max(1, Math.floor(MAX_MEMORY_SESSIONS * 0.2));
  const toEvict = sorted.slice(0, Math.min(evictCount, sorted.length));
  for (const [key] of toEvict) {
    memorySessions.delete(key);
    memorySessionTtls.delete(key);
  }
  console.warn(`[sessionStore] Evicted ${toEvict.length} oldest sessions. Current size: ${memorySessions.size}`);
}

const TRUSTED_ORIGINS = (() => {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  const origins = new Set([
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'https://algobuddy.me',
    'https://www.algobuddy.me',
    'https://algobuddy.vercel.app',
  ]);
  if (appUrl) origins.add(appUrl.replace(/\/+$/, ''));
  return origins;
})();

function validateCsrfOrigin(request) {
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");
  const source = origin || referer || '';
  const normalized = source.replace(/\/+$/, '');
  return TRUSTED_ORIGINS.has(normalized);
}

function createId(prefix) {
  return `${prefix}_${crypto.randomBytes(8).toString("hex")}`;
}

function normalizeVisibility(value) {
  return PUBLIC_VISIBILITY.has(value) ? value : "public";
}

function normalizeJoinCode(value) {
  return String(value || "").replace(/[^a-z0-9]/gi, "").toUpperCase();
}

function normalizeParticipantUserId(value) {
  return sanitizeSessionText(value, 120);
}

function normalizePresenterId(value) {
  return sanitizeSessionText(value, 120);
}


function createJoinCode() {
  return crypto.randomBytes(5).toString("hex").toUpperCase();
}

function createSubscriptionToken() {
  return crypto.randomBytes(24).toString("base64url");
}

function hashSubscriptionToken(token) {
  const normalized = sanitizeSessionText(token, 240);
  if (!normalized) return "";
  return crypto.createHash("sha256").update(normalized).digest("hex");
}

function hashLegacyPassword(password) {
  if (!password) return null;
  return crypto.createHash("sha256").update(String(password)).digest("hex");
}

async function hashPassword(password) {
  if (!password) return null;
  const hash = await bcrypt.hash(String(password), PASSWORD_HASH_WORK_FACTOR);
  return {
    algorithm: PASSWORD_HASH_ALGORITHM,
    hash,
    salt: bcrypt.getSalt(hash),
    workFactor: bcrypt.getRounds(hash),
  };
}

async function verifyPassword(password, passwordHash) {
  if (!password || !passwordHash) {
    return { ok: false, needsMigration: false };
  }

  if (typeof passwordHash === "string") {
    const legacyHash = hashLegacyPassword(password);
    return {
      ok: legacyHash === passwordHash,
      needsMigration: legacyHash === passwordHash,
    };
  }

  if (passwordHash.algorithm === PASSWORD_HASH_ALGORITHM && passwordHash.hash) {
    return {
      ok: await bcrypt.compare(String(password), passwordHash.hash),
      needsMigration: false,
    };
  }

  return { ok: false, needsMigration: false };
}

function sessionKey(sessionId) {
  return `collab:session:${sessionId}`;
}

function joinCodeKey(code) {
  return `collab:joinCode:${normalizeJoinCode(code)}`;
}

function discoverableSessionView(session, { includeJoinCode = true } = {}) {
  if (!session) return null;
  const view = {
    id: session.id,
    title: session.title,
    visibility: session.visibility,
    module: session.module,
    createdAt: session.createdAt,
    updatedAt: session.updatedAt,
    participantCount: session.participantCount || 0,
    presenterId: session.presenterId || null,
  };

  if (includeJoinCode) {
    view.joinCode = session.joinCode;
  }

  return view;
}

async function readSession(sessionId) {
  ensureRedisConnection();
  if (!sessionId) return null;

  const doRead = async () => {
    let session;
    if (shouldTryRedis()) {
      try {
        const value = await redis.get(sessionKey(sessionId));
        session = value ? value : null;
        markRedisOnline();
        // When Redis is healthy but session not found, also check memory fallback
        // to cover sessions that haven't been backfilled yet
        if (!session && memorySessions.has(sessionId)) {
          session = memorySessions.get(sessionId) || null;
        }
      } catch (err) {
        markRedisOffline(err);
        session = memorySessions.get(sessionId) || null;
      }
    } else {
      session = memorySessions.get(sessionId) || null;
    }

    if (session && Array.isArray(session.subscriptionTokens) && session.subscriptionTokens.length > 0) {
      const pruned = pruneActiveSubscriptionTokens(session.subscriptionTokens);
      if (pruned.length < session.subscriptionTokens.length) {
        session.subscriptionTokens = pruned;
        await writeSession(session);
      }
    }

    return session;
  };

  if (redis) return doRead();
  return withMemoryLock(`read:${sessionId}`, doRead);
}

async function findSessionByJoinCode(joinCode) {
  ensureRedisConnection();
  const normalizedJoinCode = normalizeJoinCode(joinCode);
  if (!normalizedJoinCode) return null;

  if (shouldTryRedis()) {
    try {
      const sessionId = await redis.get(joinCodeKey(normalizedJoinCode));
      if (!sessionId) {
        markRedisOnline();
        return null;
      }
      const session = await readSession(sessionId);
      if (!session) {
        await redis.del(joinCodeKey(normalizedJoinCode));
        markRedisOnline();
        return null;
      }
      markRedisOnline();
      return session;
    } catch (err) {
      markRedisOffline(err);
    }
  }

  return withMemoryLock("findByJoinCode", async () => {
    return [...memorySessions.values()].find(
      (session) => normalizeJoinCode(session.joinCode) === normalizedJoinCode,
    ) || null;
  });
}

async function readSessionByIdentifier(identifier) {
  const directSession = await readSession(identifier);
  if (directSession) return directSession;
  return findSessionByJoinCode(identifier);
}

async function writeSession(session) {
  ensureRedisConnection();
  const nextSession = {
    ...session,
    updatedAt: new Date().toISOString(),
  };

  const doWrite = async () => {
    if (shouldTryRedis()) {
      try {
        await redis.set(sessionKey(nextSession.id), nextSession, {
          ex: SESSION_TTL_SECONDS,
        });
        markRedisOnline();
      } catch (err) {
        markRedisOffline(err);
        startMemorySweeper();
        startReconciliationTimer();
        if (memorySessions.size >= MAX_MEMORY_SESSIONS) {
          enforceMemorySessionCapacity();
        }
        memorySessions.set(nextSession.id, nextSession);
        touchMemorySession(nextSession.id);
        memoryWriteCount++;
        console.warn(`[sessionStore] Session ${nextSession.id} written to memory fallback. Total memory writes: ${memoryWriteCount}`);
      }
    } else {
      startMemorySweeper();
      startReconciliationTimer();
      if (memorySessions.size >= MAX_MEMORY_SESSIONS) {
        enforceMemorySessionCapacity();
      }
      memorySessions.set(nextSession.id, nextSession);
      touchMemorySession(nextSession.id);
      memoryWriteCount++;
      console.warn(`[sessionStore] Session ${nextSession.id} written to memory fallback. Total memory writes: ${memoryWriteCount}`);
    }
    return nextSession;
  };

  if (redis) return doWrite();
  return withMemoryLock(`write:${nextSession.id}`, doWrite);
}

function pruneActiveSubscriptionTokens(tokens, nowMs = Date.now()) {
  const entries = Array.isArray(tokens) ? tokens : [];
  return entries.filter((entry) => {
    if (!entry?.tokenHash || !entry?.userId || !entry?.expiresAt) return false;
    const expiresAt = Date.parse(entry.expiresAt);
    return Number.isFinite(expiresAt) && expiresAt > nowMs;
  });
}

async function issueSubscriptionTokenForParticipant(sessionId, userId) {
  const participantUserId = normalizeParticipantUserId(userId);
  if (!participantUserId) {
    return { error: "Authentication required", status: 401 };
  }

  const token = createSubscriptionToken();
  const tokenHash = hashSubscriptionToken(token);
  const nowMs = Date.now();
  const expiresAt = new Date(nowMs + SUBSCRIPTION_TOKEN_TTL_MS).toISOString();
  const nowStr = new Date(nowMs).toISOString();
  const ttl = SESSION_TTL_SECONDS;
  const score = nowMs;

  if (shouldTryRedis()) {
    try {
      const result = await redis.eval(
        ATOMIC_JOIN_SCRIPT,
        [sessionKey(sessionId), SESSION_INDEX_KEY, SESSION_PUBLIC_INDEX_KEY],
        [participantUserId, tokenHash, token, expiresAt, ttl, score, nowStr],
      );

      if (result === 'NOT_FOUND') {
        markRedisOnline();
        return { error: "Session not found", status: 404 };
      }

      const nextSession = typeof result === 'string' ? JSON.parse(result) : result;

      const participantUserIds = Array.isArray(nextSession.participantUserIds)
        ? nextSession.participantUserIds
        : [];
      const isNewParticipant = participantUserIds.includes(participantUserId);

      markRedisOnline();
      return {
        session: discoverableSessionView(nextSession, { includeJoinCode: false }),
        subscriptionToken: token,
        isNewParticipant,
      };
    } catch (err) {
      markRedisOffline(err);
    }
  }

  return withMemoryLock(sessionId, async () => {
    const session = await readSession(sessionId);
    if (!session) {
      return { error: "Session not found", status: 404 };
    }

    const participantUserIds = Array.isArray(session.participantUserIds)
      ? [...session.participantUserIds]
      : [];

    const isNewParticipant = !participantUserIds.includes(participantUserId);
    if (isNewParticipant) {
      participantUserIds.push(participantUserId);
    }

    const nextTokens = pruneActiveSubscriptionTokens(session.subscriptionTokens, nowMs);
    nextTokens.push({
      tokenHash,
      userId: participantUserId,
      expiresAt,
    });

    const nextSession = await writeSession({
      ...session,
      participantUserIds,
      participantCount: isNewParticipant
        ? (session.participantCount || 0) + 1
        : (session.participantCount || 0),
      subscriptionTokens: nextTokens,
    });

    return {
      session: discoverableSessionView(nextSession, { includeJoinCode: false }),
      subscriptionToken: token,
      isNewParticipant,
    };
  });
}

async function leaveCollaborationSession(sessionIdentifier, userId) {
  const participantUserId = normalizeParticipantUserId(userId);
  if (!participantUserId) {
    return { error: "Authentication required", status: 401 };
  }

  if (shouldTryRedis()) {
    try {
      const result = await redis.eval(
        ATOMIC_LEAVE_SCRIPT,
        [sessionKey(sessionIdentifier), SESSION_INDEX_KEY, SESSION_PUBLIC_INDEX_KEY],
        [participantUserId, SESSION_TTL_SECONDS, Date.now()],
      );

      if (result === 'NOT_FOUND') {
        markRedisOnline();
        return { error: "Session not found", status: 404 };
      }

      const parsed = typeof result === 'string' ? JSON.parse(result) : result;
      markRedisOnline();
      return { left: parsed.found, participantCount: parsed.participantCount };
    } catch (err) {
      markRedisOffline(err);
    }
  }

  return withMemoryLock(sessionIdentifier, async () => {
    const session = await readSession(sessionIdentifier);
    if (!session) {
      return { error: "Session not found", status: 404 };
    }

    const participantUserIds = Array.isArray(session.participantUserIds)
      ? session.participantUserIds
      : [];

    if (!participantUserIds.includes(participantUserId)) {
      return { left: false, participantCount: session.participantCount || 0 };
    }

    const nextUserIds = participantUserIds.filter((id) => id !== participantUserId);
    const nextTokens = Array.isArray(session.subscriptionTokens)
      ? session.subscriptionTokens.filter((entry) => entry.userId !== participantUserId)
      : [];

    await writeSession({
      ...session,
      participantUserIds: nextUserIds,
      participantCount: Math.max(0, (session.participantCount || 1) - 1),
      subscriptionTokens: nextTokens,
    });

    return { left: true, participantCount: Math.max(0, (session.participantCount || 1) - 1) };
  });
}

/**
 * Registers or updates a session in the sorted-set index, scored by the
 * current time so that the most recently active sessions sort first.
 * Uses ZADD with no flags on create (adds new member or updates score) and
 * with XX on update (updates only if the member already exists — avoids
 * re-adding an ID whose key has already expired from the main store).
 */
async function addToSessionIndex(sessionId, score, updateOnly = false, visibility = null) {
  if (!shouldTryRedis()) return;
  try {
    if (updateOnly) {
      await redis.zadd(SESSION_INDEX_KEY, { xx: true }, { score, member: sessionId });
      if (visibility === "public") {
        await redis.zadd(SESSION_PUBLIC_INDEX_KEY, { xx: true }, { score, member: sessionId });
      } else if (visibility !== null) {
        await redis.zrem(SESSION_PUBLIC_INDEX_KEY, sessionId);
      }
    } else {
      await redis.zadd(SESSION_INDEX_KEY, { score, member: sessionId });
      if (visibility === "public") {
        await redis.zadd(SESSION_PUBLIC_INDEX_KEY, { score, member: sessionId });
      } else if (visibility !== null) {
        await redis.zrem(SESSION_PUBLIC_INDEX_KEY, sessionId);
      }
    }
    markRedisOnline();
  } catch (err) {
    markRedisOffline(err);
  }
}

async function atomicAddToSessionIndex(sessionId, score) {
  if (shouldTryRedis()) {
    try {
      const sessionKeyStr = sessionKey(sessionId);
      const sessionData = await redis.get(sessionKeyStr);
      if (!sessionData) {
        markRedisOnline();
        return;
      }
      const sessionVisibility = (typeof sessionData === 'string' ? JSON.parse(sessionData) : sessionData).visibility || "public";
      await redis.eval(ATOMIC_WRITE_SCRIPT, [sessionKeyStr, SESSION_INDEX_KEY, SESSION_PUBLIC_INDEX_KEY], [
        typeof sessionData === 'string' ? sessionData : JSON.stringify(sessionData),
        SESSION_TTL_SECONDS,
        score,
        sessionVisibility,
      ]);
      markRedisOnline();
    } catch (err) {
      markRedisOffline(err);
    }
  }
}

async function removeFromSessionIndex(sessionIds) {
  if (!shouldTryRedis() || !sessionIds.length) return;
  try {
    await redis.zrem(SESSION_INDEX_KEY, ...sessionIds);
    await redis.zrem(SESSION_PUBLIC_INDEX_KEY, ...sessionIds);
    markRedisOnline();
  } catch (err) {
    markRedisOffline(err);
  }
}

export async function createCollaborationSession(input = {}) {
  const title = sanitizeSessionText(input.title || "Untitled session", 80);
  const visibility = normalizeVisibility(input.visibility || "public");
  const passwordHash = visibility === "private" ? await hashPassword(input.password) : null;
  const id = createId("session");
  let joinCode = null;
  for (let attempts = 0; attempts < 5; attempts += 1) {
    const candidate = createJoinCode();
    if (shouldTryRedis()) {
      try {
        const reserved = await redis.set(joinCodeKey(candidate), id, {
          ex: SESSION_TTL_SECONDS,
          nx: true,
        });
        markRedisOnline();
        if (reserved) {
          joinCode = candidate;
          break;
        }
      } catch (err) {
        markRedisOffline(err);
        if (!(await findSessionByJoinCode(candidate))) {
          joinCode = candidate;
          break;
        }
      }
    } else if (!(await findSessionByJoinCode(candidate))) {
      joinCode = candidate;
      break;
    }
  }
  if (!joinCode) {
    throw new Error("Failed to create a unique collaboration join code.");
  }
  const sessionSecret = crypto.randomBytes(24).toString("base64url");
  const channelId = crypto.randomBytes(8).toString("hex");
  const now = new Date().toISOString();

  const session = await writeSession({
    id,
    joinCode,
    title,
    visibility,
    module: sanitizeSessionText(input.module || "dry-run", 40),
    presenterId: null,
    createdAt: now,
    updatedAt: now,
    createdBy: sanitizeSessionText(input.createdBy || "", 80),
    passwordHash,
    sessionSecret,
    channelId,
    participantCount: 0,
    participantUserIds: [],
    subscriptionTokens: [],
    annotations: [],
    events: [],
  });

  await atomicAddToSessionIndex(session.id, Date.now());

  return {
    session: discoverableSessionView(session),
    sessionSecret,
  };
}

export { validateCsrfOrigin };

export async function backfillJoinCodeIndex() {
  if (!shouldTryRedis()) return { backfilled: 0 };
  try {
    let backfilled = 0;
    let cursor = 0;
    do {
      const result = await redis.scan(cursor, { match: "collab:session:*", count: 100 });
      cursor = Number(result[0]);
      const keys = result[1];
      for (const key of keys) {
        const session = await redis.get(key);
        if (session?.joinCode) {
          const existing = await redis.get(joinCodeKey(session.joinCode));
          if (!existing) {
            await redis.set(joinCodeKey(session.joinCode), session.id, {
              ex: SESSION_TTL_SECONDS,
            });
            backfilled += 1;
          }
        }
      }
    } while (cursor !== 0);
    markRedisOnline();
    return { backfilled };
  } catch (err) {
    markRedisOffline(err);
    return { backfilled: 0 };
  }
}

/**
 * Lists publicly visible collaboration sessions using a sorted-set secondary
 * index instead of redis.keys(). Supports cursor-based pagination via a
 * composite cursor (score::sessionId) so callers can page through results
 * without a keyspace scan.  The composite cursor avoids skipping or
 * duplicating entries when multiple sessions share the same timestamp score.
 *
 * @param {object}  options
 * @param {number}  [options.limit=50]    Max results to return (capped at 100).
 * @param {string}  [options.cursor]      Composite cursor from the previous
 *                                        page's nextCursor (format "score::id").
 *                                        Omit for the first page.
 * @returns {{ sessions: object[], nextCursor: string|null }}
 */
function parseCursor(cursor) {
  if (!cursor || cursor === "+inf") return { score: "+inf", offset: 0 };
  const parts = cursor.split("::", 2);
  const score = Number.isFinite(Number(parts[0])) ? Number(parts[0]) : "+inf";
  const offset = Number.isFinite(Number(parts[1])) ? Number(parts[1]) : 0;
  return { score, offset };
}

function clampLimit(value) {
  const limit = Number.isFinite(Number(value)) ? Number(value) : DEFAULT_PAGE_LIMIT;
  return Math.min(Math.max(1, limit), MAX_PAGE_LIMIT);
}

export async function listCollaborationSessions({ limit, cursor } = {}) {
  ensureRedisConnection();
  const pageSize = clampLimit(limit);
  const parsedCursor = parseCursor(cursor);
  const maxScore = parsedCursor.score;
  const offset = parsedCursor.offset;

  if (shouldTryRedis()) {
    try {
      if (Math.random() < 0.05) {
        const cutoffMs = Date.now() - SESSION_TTL_MS;
        await redis.zremrangebyscore(SESSION_INDEX_KEY, "-inf", cutoffMs);
        await redis.zremrangebyscore(SESSION_PUBLIC_INDEX_KEY, "-inf", cutoffMs);
      }

      const fetchSize = pageSize + MAX_EXPIRED_BUFFER;
      const ids = await redis.zrange(SESSION_PUBLIC_INDEX_KEY, maxScore, "-inf", {
        byScore: true,
        rev: true,
        limit: { offset, count: fetchSize },
      });

      if (!ids || ids.length === 0) {
        markRedisOnline();
        return { sessions: [], nextCursor: null };
      }

      const values = await redis.mget(...ids.map(sessionKey));
      const sessions = [];
      const expiredIds = [];

      for (let i = 0; i < ids.length; i++) {
        const id = ids[i];
        const session = values[i];

        if (session && session.visibility === "public") {
          sessions.push(discoverableSessionView(session, { includeJoinCode: false }));
          if (sessions.length >= pageSize) break;
        } else if (!session) {
          expiredIds.push(id);
        } else if (session && session.visibility !== "public") {
          await redis.zrem(SESSION_PUBLIC_INDEX_KEY, id);
        }
      }

      if (expiredIds.length > 0) {
        await removeFromSessionIndex(expiredIds);
      }

      let nextCursor = null;
      if (sessions.length > 0) {
        const sessionKeys = sessions.map((s) => sessionKey(s.id));
        const scores = await redis.zmscore(SESSION_PUBLIC_INDEX_KEY, ...sessionKeys);
        
        const lastScore = scores[scores.length - 1];
        if (lastScore !== null) {
          let scoreCount = 0;
          for (let i = scores.length - 1; i >= 0; i--) {
            if (scores[i] === lastScore) scoreCount++;
            else break;
          }
          
          let nextOffset = scoreCount;
          if (lastScore === maxScore) {
             nextOffset = offset + scoreCount;
          }
          nextCursor = `${lastScore}::${nextOffset}`;
        }
      }

      markRedisOnline();
      return { sessions, nextCursor };
    } catch (err) {
      markRedisOffline(err);
    }
  }

  let memorySessionsList = [...memorySessions.values()]
    .filter((session) => session.visibility === "public")
    .map((session) => discoverableSessionView(session, { includeJoinCode: false }))
    .sort((left, right) => {
      const timeDiff = right.updatedAt.localeCompare(left.updatedAt);
      if (timeDiff !== 0) return timeDiff;
      return left.id.localeCompare(right.id);
    });

  let startIndex = 0;
  if (maxScore !== "+inf") {
    startIndex = memorySessionsList.findIndex((s) => {
      const st = new Date(s.updatedAt).getTime();
      return st <= maxScore;
    });
    if (startIndex >= 0) {
      startIndex += offset;
    } else {
      return { sessions: [], nextCursor: null };
    }
  }

  const page = memorySessionsList.slice(startIndex, startIndex + pageSize);
  const hasMore = startIndex + pageSize < memorySessionsList.length;
  let nextCursor = null;
  if (hasMore && page.length > 0) {
    const last = page[page.length - 1];
    const lastScore = new Date(last.updatedAt).getTime();
    let scoreCount = 0;
    for (let i = page.length - 1; i >= 0; i--) {
      if (new Date(page[i].updatedAt).getTime() === lastScore) scoreCount++;
      else break;
    }
    let nextOffset = scoreCount;
    if (lastScore === maxScore) {
       nextOffset = offset + scoreCount;
    }
    nextCursor = `${lastScore}::${nextOffset}`;
  }

  return { sessions: page, nextCursor };
}

export async function getCollaborationSession(sessionId) {
  return readSession(sessionId);
}

/**
 * Public-safe session lookup for use in HTTP GET handlers.
 * Returns only the discoverable view — never sessionSecret or passwordHash.
 * Returns null when the session does not exist.
 */
export async function getPublicCollaborationSession(sessionId) {
  const session = await readSession(sessionId);
  return discoverableSessionView(session, { includeJoinCode: false });
}

export async function joinCollaborationSession(sessionIdentifier, { password, userId } = {}) {
  const session = await readSessionByIdentifier(sessionIdentifier);
  if (!session) {
    return { error: "Session not found", status: 404 };
  }

  if (session.visibility === "private") {
    const verification = await verifyPassword(password, session.passwordHash);
    if (!verification.ok) {
      return { error: "Invalid session password", status: 403 };
    }

    if (verification.needsMigration) {
      session.passwordHash = await hashPassword(password);
      await writeSession(session);
    }
  }

  return issueSubscriptionTokenForParticipant(session.id, userId);
}

export async function claimSessionPresenter(sessionId, { userId } = {}) {
  const session = await readSession(sessionId);
  if (!session) {
    return { error: "Session not found", status: 404 };
  }

  if (!userId) {
    return { error: "Authentication required", status: 401 };
  }

  // Only the session creator can claim presenter privileges
  if (session.createdBy && session.createdBy !== userId) {
    return { error: "Only the session creator can claim presenter.", status: 403 };
  }

  const participantUserId = normalizeParticipantUserId(userId);
  if (!participantUserId) {
    return { error: "Authentication required", status: 401 };
  }

  const participantUserIds = Array.isArray(session.participantUserIds)
    ? session.participantUserIds
    : [];

  if (!participantUserIds.includes(participantUserId)) {
    return { error: "Caller is not a session participant", status: 403 };
  }

  const updated = await updateCollaborationSession(sessionId, {
    presenterId: participantUserId,
  });

  return { session: updated };
}


function withMemoryLock(key, fn) {
  const lockKey = `collab:lock:${key}`;
  return new Promise((resolve, reject) => {
    const tryLock = () => {
      if (memoryLocks.get(lockKey)) {
        setTimeout(tryLock, 5);
        return;
      }
      memoryLocks.set(lockKey, true);
      Promise.resolve().then(() => fn())
        .then((result) => {
          memoryLocks.delete(lockKey);
          resolve(result);
        })
        .catch((err) => {
          memoryLocks.delete(lockKey);
          reject(err);
        });
    };
    tryLock();
  });
}

export async function exchangeRealtimeSubscriptionToken(
  sessionId,
  { subscriptionToken, userId } = {},
) {
  ensureRedisConnection();
  const participantUserId = normalizeParticipantUserId(userId);
  if (!participantUserId) {
    return { error: "Authentication required", status: 401 };
  }

  const tokenHash = hashSubscriptionToken(subscriptionToken);
  if (!tokenHash) {
    return { error: "Invalid realtime subscription token", status: 403 };
  }

  const computeResult = (sessionSecret) => {
    const channelSecret = crypto
      .createHash("sha256")
      .update(sessionSecret)
      .digest("hex")
      .slice(0, 16);

    return {
      realtimeChannel: `collab:${sessionId}:${channelSecret}`,
    };
  };

  if (shouldTryRedis()) {
    try {
      const result = await redis.eval(
        ATOMIC_CONSUME_TOKEN_SCRIPT,
        [sessionKey(sessionId), SESSION_INDEX_KEY, SESSION_PUBLIC_INDEX_KEY],
        [tokenHash, participantUserId, SESSION_TTL_SECONDS, Date.now()],
      );

      if (result === 'NOT_FOUND') {
        markRedisOnline();
        return { error: "Session not found", status: 404 };
      }
      if (result === 'TOKEN_INVALID') {
        markRedisOnline();
        return { error: "Invalid realtime subscription token", status: 403 };
      }

      markRedisOnline();
      return computeResult(result);
    } catch (err) {
      markRedisOffline(err);
    }
  }

  // In-memory fallback with mutual exclusion
  return withMemoryLock(sessionId, async () => {
    const session = await readSession(sessionId);
    if (!session) {
      return { error: "Session not found", status: 404 };
    }

    const participantUserIds = Array.isArray(session.participantUserIds)
      ? session.participantUserIds
      : [];

    if (!participantUserIds.includes(participantUserId)) {
      return { error: "Forbidden", status: 403 };
    }

    const activeTokens = pruneActiveSubscriptionTokens(session.subscriptionTokens);
    const tokenIndex = activeTokens.findIndex((entry) => {
      return entry.tokenHash === tokenHash && entry.userId === participantUserId;
    });

    if (tokenIndex < 0) {
      return { error: "Invalid realtime subscription token", status: 403 };
    }

    activeTokens.splice(tokenIndex, 1);

    await writeSession({
      ...session,
      subscriptionTokens: activeTokens,
    });

    return computeResult(session.sessionSecret);
  });

}

export async function updateCollaborationSession(sessionId, patch = {}) {
  const current = await readSession(sessionId);
  if (!current) return null;

  const next = await writeSession({
    ...current,
    ...patch,
  });

  // Float the session to the top of the index on activity. The XX flag ensures
  // we do not accidentally re-add sessions whose TTL has expired from the main
  // store but whose ID might still linger in the index.
  // Uses atomic Lua script only for the initial add; update uses ZADD XX.
  await addToSessionIndex(next.id, Date.now(), true, next.visibility);

  return discoverableSessionView(next);
}

export { leaveCollaborationSession };

// Crash-recovery: on graceful shutdown, dump memory sessions to temp file
if (typeof process !== "undefined" && process.on) {

  function dumpMemorySessions() {
    if (memorySessions.size === 0) return;
    const enabled = process.env.SESSION_STORE_DUMP_ENABLED === 'true';
    if (!enabled) {
      console.log(`[sessionStore] Crash dump disabled via SESSION_STORE_DUMP_ENABLED. ${memorySessions.size} sessions not dumped.`);
      return;
    }
    const dumpDir = process.env.TEMP_DIR || "/tmp";
    const dumpPath = path.join(dumpDir, `algobuddy-session-store-dump-${Date.now()}.json`);
    try {
      const maxDumpSessions = 1000;
      const sessionsToDump = memorySessions.size > maxDumpSessions
        ? Object.fromEntries([...memorySessions.entries()].slice(0, maxDumpSessions))
        : Object.fromEntries(memorySessions);
      const dump = {
        timestamp: new Date().toISOString(),
        totalSessions: memorySessions.size,
        dumpedSessions: Math.min(memorySessions.size, maxDumpSessions),
        sessions: sessionsToDump,
      };
      if (!fs.existsSync(dumpDir)) {
        fs.mkdirSync(dumpDir, { recursive: true });
      }
      fs.writeFileSync(dumpPath, JSON.stringify(dump, null, 2));
      console.log(`[sessionStore] Dumped ${Math.min(memorySessions.size, maxDumpSessions)}/${memorySessions.size} memory sessions to ${dumpPath}`);
    } catch (err) {
      console.error("[sessionStore] Failed to dump memory sessions:", err.message || err);
    }
  }

  process.on("SIGTERM", () => {
    console.log("[sessionStore] SIGTERM received, dumping memory sessions...");
    // Attempt to backfill to Redis first if possible
    if (redis && shouldTryRedis()) {
      backfillMemorySessionsToRedis().finally(() => dumpMemorySessions());
    } else {
      dumpMemorySessions();
    }
  });

  process.on("SIGINT", () => {
    console.log("[sessionStore] SIGINT received, dumping memory sessions...");
    if (redis && shouldTryRedis()) {
      backfillMemorySessionsToRedis().finally(() => dumpMemorySessions());
    } else {
      dumpMemorySessions();
    }
  });
}
