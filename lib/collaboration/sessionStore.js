import crypto from "crypto";
import { Redis } from "@upstash/redis";
import { sanitizeSessionText } from "./sessionTrace.js";

const SESSION_TTL_SECONDS = 7 * 24 * 60 * 60;
const SESSION_INDEX_KEY = "collab:session:index";
const PUBLIC_VISIBILITY = new Set(["public", "unlisted", "private"]);
const DEFAULT_PAGE_LIMIT = 50;
const MAX_PAGE_LIMIT = 100;

const memorySessions = new Map();

const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? Redis.fromEnv()
    : null;

function createId(prefix) {
  return `${prefix}_${crypto.randomBytes(8).toString("hex")}`;
}

function normalizeVisibility(value) {
  return PUBLIC_VISIBILITY.has(value) ? value : "public";
}

function createJoinCode(sessionId) {
  return sessionId.replace(/_/g, "").slice(0, 8).toUpperCase();
}

function hashPassword(password) {
  if (!password) return null;
  return crypto.createHash("sha256").update(String(password)).digest("hex");
}

function sessionKey(sessionId) {
  return `collab:session:${sessionId}`;
}

function clampLimit(value) {
  const n = parseInt(value, 10);
  if (!Number.isFinite(n) || n < 1) return DEFAULT_PAGE_LIMIT;
  return Math.min(n, MAX_PAGE_LIMIT);
}

function discoverableSessionView(session) {
  if (!session) return null;
  return {
    id: session.id,
    joinCode: session.joinCode,
    title: session.title,
    visibility: session.visibility,
    module: session.module,
    createdAt: session.createdAt,
    updatedAt: session.updatedAt,
    participantCount: session.participantCount || 0,
  };
}

async function readSession(sessionId) {
  if (!sessionId) return null;

  if (redis) {
    const value = await redis.get(sessionKey(sessionId));
    return value ? value : null;
  }

  return memorySessions.get(sessionId) || null;
}

async function writeSession(session) {
  const nextSession = {
    ...session,
    updatedAt: new Date().toISOString(),
  };

  if (redis) {
    await redis.set(sessionKey(nextSession.id), nextSession, {
      ex: SESSION_TTL_SECONDS,
    });
  } else {
    memorySessions.set(nextSession.id, nextSession);
  }

  return nextSession;
}

/**
 * Registers or updates a session in the sorted-set index, scored by the
 * current time so that the most recently active sessions sort first.
 * Uses ZADD with no flags on create (adds new member or updates score) and
 * with XX on update (updates only if the member already exists — avoids
 * re-adding an ID whose key has already expired from the main store).
 */
async function addToSessionIndex(sessionId, score, updateOnly = false) {
  if (!redis) return;
  if (updateOnly) {
    await redis.zadd(SESSION_INDEX_KEY, { xx: true }, { score, member: sessionId });
  } else {
    await redis.zadd(SESSION_INDEX_KEY, { score, member: sessionId });
  }
}

async function removeFromSessionIndex(sessionIds) {
  if (!redis || !sessionIds.length) return;
  await redis.zrem(SESSION_INDEX_KEY, ...sessionIds);
}

export async function createCollaborationSession(input = {}) {
  const title = sanitizeSessionText(input.title || "Untitled session", 80);
  const visibility = normalizeVisibility(input.visibility || "public");
  const passwordHash = visibility === "private" ? hashPassword(input.password) : null;
  const id = createId("session");
  const joinCode = createJoinCode(id);
  const sessionSecret = crypto.randomBytes(24).toString("base64url");
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
    participantCount: 0,
    annotations: [],
    events: [],
  });

  await addToSessionIndex(session.id, Date.now());

  return {
    session: discoverableSessionView(session),
    sessionSecret,
  };
}

/**
 * Lists publicly visible collaboration sessions using a sorted-set secondary
 * index instead of redis.keys(). Supports cursor-based pagination via a score
 * (Unix timestamp ms) so callers can page through results without a keyspace scan.
 *
 * @param {object}  options
 * @param {number}  [options.limit=50]    Max results to return (capped at 100).
 * @param {number}  [options.cursor]      Exclusive upper-bound score from the
 *                                        previous page's nextCursor. Omit or
 *                                        pass Infinity for the first page.
 * @returns {{ sessions: object[], nextCursor: number|null }}
 */
export async function listCollaborationSessions({ limit, cursor } = {}) {
  const pageSize = clampLimit(limit);
  const maxScore = Number.isFinite(Number(cursor)) ? Number(cursor) : "+inf";

  if (redis) {
    // Fetch one extra item to detect whether another page exists.
    const ids = await redis.zrange(SESSION_INDEX_KEY, maxScore, "-inf", {
      byScore: true,
      rev: true,
      limit: { offset: 0, count: pageSize + 1 },
    });

    if (!ids || ids.length === 0) {
      return { sessions: [], nextCursor: null };
    }

    const hasMore = ids.length > pageSize;
    const pageIds = hasMore ? ids.slice(0, pageSize) : ids;

    // Single round-trip to fetch all session objects.
    const values = await redis.mget(...pageIds.map(sessionKey));

    // Identify IDs whose TTL expired — remove them from the index and skip them.
    const expiredIds = [];
    const sessions = [];

    for (let i = 0; i < pageIds.length; i++) {
      const session = values[i];
      if (!session) {
        expiredIds.push(pageIds[i]);
        continue;
      }
      if (session.visibility !== "private") {
        sessions.push(discoverableSessionView(session));
      }
    }

    if (expiredIds.length > 0) {
      await removeFromSessionIndex(expiredIds);
    }

    // Compute the next cursor: lowest score among the returned page IDs.
    let nextCursor = null;
    if (hasMore && pageIds.length > 0) {
      const scores = await redis.zmscore(SESSION_INDEX_KEY, ...pageIds);
      const lowestScore = scores
        ? scores.reduce((min, s) => (s !== null && s < min ? s : min), Infinity)
        : null;
      nextCursor = Number.isFinite(lowestScore) ? lowestScore : null;
    }

    return { sessions, nextCursor };
  }

  // In-memory fallback for local dev: sort newest-first with a stable tie-breaker
  // on id, then use an integer offset as the cursor (simpler than score-based
  // comparison, which breaks when multiple sessions share the same updatedAt ms).
  const all = [...memorySessions.values()]
    .filter((session) => session.visibility !== "private")
    .map(discoverableSessionView)
    .filter(Boolean)
    .sort((left, right) => {
      const timeDiff = right.updatedAt.localeCompare(left.updatedAt);
      return timeDiff !== 0 ? timeDiff : left.id.localeCompare(right.id);
    });

  const offset = Number.isFinite(Number(cursor)) ? Number(cursor) : 0;
  const page = all.slice(offset, offset + pageSize);
  const nextOffsetMemory = offset + page.length;
  const hasMoreMemory = nextOffsetMemory < all.length;

  return {
    sessions: page,
    nextCursor: hasMoreMemory ? nextOffsetMemory : null,
  };
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
  return discoverableSessionView(session);
}

export async function joinCollaborationSession(sessionId, { password } = {}) {
  const session = await readSession(sessionId);
  if (!session) {
    return { error: "Session not found", status: 404 };
  }

  if (session.visibility === "private") {
    const providedHash = hashPassword(password);
    if (!providedHash || providedHash !== session.passwordHash) {
      return { error: "Invalid session password", status: 403 };
    }
  }

  return {
    session: discoverableSessionView(session),
    sessionSecret: session.sessionSecret,
  };
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
  await addToSessionIndex(next.id, Date.now(), true);

  return discoverableSessionView(next);
}
