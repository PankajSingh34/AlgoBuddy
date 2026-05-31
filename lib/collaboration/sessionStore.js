import crypto from "crypto";
import bcrypt from "bcryptjs";
import { Redis } from "@upstash/redis";
import { sanitizeSessionText } from "./sessionTrace.js";

const SESSION_TTL_SECONDS = 7 * 24 * 60 * 60;
const SESSION_INDEX_KEY = "collab:session:index";
const PUBLIC_VISIBILITY = new Set(["public", "unlisted", "private"]);
const PASSWORD_HASH_ALGORITHM = "bcrypt";
const PASSWORD_HASH_WORK_FACTOR = 12;
const DEFAULT_PAGE_LIMIT = 50;
const MAX_PAGE_LIMIT = 100;
const SUBSCRIPTION_TOKEN_TTL_MS = 2 * 60 * 1000;

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

function normalizeJoinCode(value) {
  return String(value || "").replace(/[^a-z0-9]/gi, "").toUpperCase();
}

function normalizeParticipantUserId(value) {
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
  };

  if (includeJoinCode) {
    view.joinCode = session.joinCode;
  }

  return view;
}

async function readSession(sessionId) {
  if (!sessionId) return null;

  if (redis) {
    const value = await redis.get(sessionKey(sessionId));
    return value ? value : null;
  }

  return memorySessions.get(sessionId) || null;
}

async function findSessionByJoinCode(joinCode) {
  const normalizedJoinCode = normalizeJoinCode(joinCode);
  if (!normalizedJoinCode) return null;

  if (redis) {
    const keys = await redis.keys("collab:session:*");
    for (const key of keys) {
      const session = await redis.get(key);
      if (normalizeJoinCode(session?.joinCode) === normalizedJoinCode) {
        return session;
      }
    }
    return null;
  }

  return [...memorySessions.values()].find(
    (session) => normalizeJoinCode(session.joinCode) === normalizedJoinCode,
  ) || null;
}

async function readSessionByIdentifier(identifier) {
  const directSession = await readSession(identifier);
  if (directSession) return directSession;
  return findSessionByJoinCode(identifier);
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

function pruneActiveSubscriptionTokens(tokens, nowMs = Date.now()) {
  const entries = Array.isArray(tokens) ? tokens : [];
  return entries.filter((entry) => {
    if (!entry?.tokenHash || !entry?.userId || !entry?.expiresAt) return false;
    const expiresAt = Date.parse(entry.expiresAt);
    return Number.isFinite(expiresAt) && expiresAt > nowMs;
  });
}

async function issueSubscriptionTokenForParticipant(session, userId) {
  const participantUserId = normalizeParticipantUserId(userId);
  if (!participantUserId) {
    return { error: "Authentication required", status: 401 };
  }

  const participantUserIds = Array.isArray(session.participantUserIds)
    ? [...session.participantUserIds]
    : [];

  if (!participantUserIds.includes(participantUserId)) {
    participantUserIds.push(participantUserId);
  }

  const token = createSubscriptionToken();
  const tokenHash = hashSubscriptionToken(token);
  const nowMs = Date.now();
  const nextTokens = pruneActiveSubscriptionTokens(session.subscriptionTokens, nowMs);
  nextTokens.push({
    tokenHash,
    userId: participantUserId,
    expiresAt: new Date(nowMs + SUBSCRIPTION_TOKEN_TTL_MS).toISOString(),
  });

  const nextSession = await writeSession({
    ...session,
    participantUserIds,
    subscriptionTokens: nextTokens,
  });

  return {
    session: discoverableSessionView(nextSession),
    subscriptionToken: token,
  };
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
  const passwordHash = visibility === "private" ? await hashPassword(input.password) : null;
  const id = createId("session");
  let joinCode = null;
  for (let attempts = 0; attempts < 5; attempts += 1) {
    const candidate = createJoinCode();
    if (!(await findSessionByJoinCode(candidate))) {
      joinCode = candidate;
      break;
    }
  }
  if (!joinCode) {
    throw new Error("Failed to create a unique collaboration join code.");
  }
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
    participantUserIds: [],
    subscriptionTokens: [],
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
function clampLimit(value) {
  const limit = Number.isFinite(Number(value)) ? Number(value) : DEFAULT_PAGE_LIMIT;
  return Math.min(Math.max(1, limit), MAX_PAGE_LIMIT);
}

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
      if (session && session.visibility === "public") {
        sessions.push(discoverableSessionView(session, { includeJoinCode: false }));
      } else if (!session) {
        expiredIds.push(pageIds[i]);
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

  const memorySessionsList = [...memorySessions.values()]
    .filter((session) => session.visibility === "public")
    .map((session) => discoverableSessionView(session, { includeJoinCode: false }))
    .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));
  return { sessions: memorySessionsList, nextCursor: null };
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

  return issueSubscriptionTokenForParticipant(session, userId);
}

export async function exchangeRealtimeSubscriptionToken(
  sessionId,
  { subscriptionToken, userId } = {},
) {
  const session = await readSession(sessionId);
  if (!session) {
    return { error: "Session not found", status: 404 };
  }

  const participantUserId = normalizeParticipantUserId(userId);
  if (!participantUserId) {
    return { error: "Authentication required", status: 401 };
  }

  const participantUserIds = Array.isArray(session.participantUserIds)
    ? session.participantUserIds
    : [];

  if (!participantUserIds.includes(participantUserId)) {
    return { error: "Forbidden", status: 403 };
  }

  const tokenHash = hashSubscriptionToken(subscriptionToken);
  if (!tokenHash) {
    return { error: "Invalid realtime subscription token", status: 403 };
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

  return {
    realtimeChannel: `collab:${session.id}:${session.sessionSecret}`,
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
