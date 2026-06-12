/**
 * Verifies that the collaboration session GET endpoint never leaks
 * sessionSecret or passwordHash to callers — authenticated or not.
 *
 * These tests exercise sessionStore helpers directly (no HTTP server needed)
 * so they run fast and without network access.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const path = require("node:path");
const { pathToFileURL } = require("node:url");

const storeUrl = pathToFileURL(
  path.join(__dirname, "..", "src", "lib", "collaboration", "sessionStore.js"),
).href;

async function loadStore() {
  return import(storeUrl);
}

function legacySha256(password) {
  return crypto.createHash("sha256").update(String(password)).digest("hex");
}

test("getPublicCollaborationSession strips sessionSecret from public session", async () => {
  const {
    createCollaborationSession,
    getPublicCollaborationSession,
  } = await loadStore();

  const { session, sessionSecret } = await createCollaborationSession({
    title: "Leak test — public",
    visibility: "public",
  });

  assert.ok(sessionSecret, "createCollaborationSession must return sessionSecret to creator");

  const pub = await getPublicCollaborationSession(session.id);

  assert.ok(pub, "getPublicCollaborationSession must return a result for existing session");
  assert.equal(
    pub.sessionSecret,
    undefined,
    "sessionSecret must not appear in public session view",
  );
  assert.equal(
    pub.passwordHash,
    undefined,
    "passwordHash must not appear in public session view",
  );
});

test("getPublicCollaborationSession strips passwordHash from private session", async () => {
  const {
    createCollaborationSession,
    getPublicCollaborationSession,
  } = await loadStore();

  const { session } = await createCollaborationSession({
    title: "Leak test — private",
    visibility: "private",
    password: "hunter2",
  });

  const pub = await getPublicCollaborationSession(session.id);

  assert.ok(pub, "getPublicCollaborationSession must return a result for private session");
  assert.equal(
    pub.passwordHash,
    undefined,
    "passwordHash must never be returned by the public helper",
  );
  assert.equal(
    pub.sessionSecret,
    undefined,
    "sessionSecret must never be returned by the public helper",
  );
});

test("getPublicCollaborationSession returns null for non-existent session", async () => {
  const { getPublicCollaborationSession } = await loadStore();

  const result = await getPublicCollaborationSession("session_nonexistent00");
  assert.equal(result, null, "must return null for unknown session ID");
});

test("getPublicCollaborationSession returns only discoverable fields", async () => {
  const {
    createCollaborationSession,
    getPublicCollaborationSession,
  } = await loadStore();

  const { session } = await createCollaborationSession({
    title: "Field audit",
    visibility: "public",
    module: "sorting",
    createdBy: "tester",
  });

  const pub = await getPublicCollaborationSession(session.id);

  const allowed = new Set([
    "id",
    "title",
    "visibility",
    "module",
    "createdAt",
    "updatedAt",
    "participantCount",
    "presenterId",
  ]);

  const returned = Object.keys(pub);
  for (const field of returned) {
    assert.ok(
      allowed.has(field),
      `unexpected field "${field}" found in public session view`,
    );
  }
});

test("createCollaborationSession uses a random join code independent of session ID", async () => {
  const { createCollaborationSession } = await loadStore();

  const { session } = await createCollaborationSession({
    title: "Random join code audit",
    visibility: "public",
  });

  const deterministicCode = session.id.replace(/_/g, "").slice(0, 8).toUpperCase();
  assert.match(session.joinCode, /^[A-F0-9]{10}$/, "join code must be a random hex secret");
  assert.notEqual(
    session.joinCode,
    deterministicCode,
    "join code must not be derived from the session ID",
  );
});

test("listCollaborationSessions hides join codes and excludes unlisted sessions", async () => {
  const {
    createCollaborationSession,
    listCollaborationSessions,
  } = await loadStore();

  const { session: publicSession } = await createCollaborationSession({
    title: "Anonymous list visible",
    visibility: "public",
  });
  const { session: unlistedSession } = await createCollaborationSession({
    title: "Anonymous list hidden",
    visibility: "unlisted",
  });

  const { sessions } = await listCollaborationSessions();
  const listedPublicSession = sessions.find((session) => session.id === publicSession.id);

  assert.ok(listedPublicSession, "public sessions may appear in anonymous listing");
  assert.equal(
    listedPublicSession.joinCode,
    undefined,
    "anonymous session listing must not expose join codes",
  );
  assert.equal(
    sessions.some((session) => session.id === unlistedSession.id),
    false,
    "unlisted sessions must require an explicit invite link",
  );
});

test("joinCollaborationSession resolves random join codes without anonymous listing", async () => {
  const {
    createCollaborationSession,
    joinCollaborationSession,
  } = await loadStore();

  const { session } = await createCollaborationSession({
    title: "Secret code join",
    visibility: "unlisted",
  });

  const joined = await joinCollaborationSession(session.joinCode, { userId: "user_join_by_code" });
  assert.ok(!joined.error, "valid join code must allow joining");
  assert.equal(joined.session.id, session.id, "join code must resolve to the session ID server-side");
  assert.equal(joined.session.joinCode, undefined, "join code must not be exposed after joining");
  assert.ok(joined.subscriptionToken, "join must return a realtime subscription token");
  assert.equal(joined.sessionSecret, undefined, "join must not return the long-lived session secret");
});

test("joinCollaborationSession requires an authenticated participant user id", async () => {
  const {
    createCollaborationSession,
    joinCollaborationSession,
  } = await loadStore();

  const { session } = await createCollaborationSession({
    title: "Join auth required",
    visibility: "public",
  });

  const result = await joinCollaborationSession(session.id);
  assert.equal(result.status, 401, "joining without a user id must be rejected");
  assert.equal(result.error, "Authentication required");
});

test("exchangeRealtimeSubscriptionToken is user-bound and single-use", async () => {
  const {
    createCollaborationSession,
    joinCollaborationSession,
    exchangeRealtimeSubscriptionToken,
  } = await loadStore();

  const { session } = await createCollaborationSession({
    title: "Realtime token exchange",
    visibility: "public",
  });

  const joined = await joinCollaborationSession(session.id, { userId: "token_user_1" });
  assert.ok(joined.subscriptionToken, "join must return a token for exchange");

  const denied = await exchangeRealtimeSubscriptionToken(session.id, {
    subscriptionToken: joined.subscriptionToken,
    userId: "token_user_2",
  });
  assert.equal(denied.status, 403, "different participant user id must be rejected");

  const granted = await exchangeRealtimeSubscriptionToken(session.id, {
    subscriptionToken: joined.subscriptionToken,
    userId: "token_user_1",
  });
  assert.ok(granted.realtimeChannel, "valid token exchange must return realtime channel credential");
  assert.match(granted.realtimeChannel, /^collab:session_[a-f0-9]+:[A-Za-z0-9_-]+$/);

  const replay = await exchangeRealtimeSubscriptionToken(session.id, {
    subscriptionToken: joined.subscriptionToken,
    userId: "token_user_1",
  });
  assert.equal(replay.status, 403, "subscription token must be single-use");
});

test("getCollaborationSession (internal) retains all fields including sessionSecret", async () => {
  const {
    createCollaborationSession,
    getCollaborationSession,
  } = await loadStore();

  const { session, sessionSecret } = await createCollaborationSession({
    title: "Internal helper audit",
    visibility: "public",
  });

  const internal = await getCollaborationSession(session.id);

  assert.ok(internal, "internal helper must return the full session object");
  assert.equal(
    internal.sessionSecret,
    sessionSecret,
    "internal helper must preserve sessionSecret for server-side callers",
  );
});

test("joinCollaborationSession for private session requires correct password", async () => {
  const {
    createCollaborationSession,
    getCollaborationSession,
    joinCollaborationSession,
  } = await loadStore();

  const { session } = await createCollaborationSession({
    title: "Join auth test",
    visibility: "private",
    password: "correct-password",
  });

  const stored = await getCollaborationSession(session.id);
  assert.equal(
    stored.passwordHash?.algorithm,
    "bcrypt",
    "new private sessions must use bcrypt password hashes",
  );
  assert.equal(
    stored.passwordHash?.workFactor,
    12,
    "bcrypt password metadata must include the configured work factor",
  );
  assert.ok(stored.passwordHash?.salt, "bcrypt password metadata must include the per-session salt");
  assert.notEqual(
    stored.passwordHash?.hash,
    legacySha256("correct-password"),
    "private session passwords must not be stored as unsalted SHA-256",
  );

  const denied = await joinCollaborationSession(session.id, {
    password: "wrong",
    userId: "private_join_user",
  });
  assert.equal(denied.status, 403, "wrong password must be rejected with 403");
  assert.ok(denied.error, "rejected join must include an error message");

  const granted = await joinCollaborationSession(session.id, {
    password: "correct-password",
    userId: "private_join_user",
  });
  assert.ok(!granted.error, "correct password must be accepted");
  assert.ok(granted.subscriptionToken, "granted join must return a realtime subscription token");
  assert.equal(granted.sessionSecret, undefined, "join must never return sessionSecret");
  assert.equal(
    granted.session?.passwordHash,
    undefined,
    "granted join must not expose passwordHash in session view",
  );
});

test("joinCollaborationSession migrates legacy SHA-256 password hashes after successful join", async () => {
  const {
    createCollaborationSession,
    getCollaborationSession,
    joinCollaborationSession,
  } = await loadStore();

  const { session } = await createCollaborationSession({
    title: "Legacy migration test",
    visibility: "private",
    password: "legacy-password",
  });

  const internal = await getCollaborationSession(session.id);
  internal.passwordHash = legacySha256("legacy-password");

  const denied = await joinCollaborationSession(session.id, {
    password: "wrong-password",
    userId: "legacy_migration_user",
  });
  assert.equal(denied.status, 403, "wrong legacy password must still be rejected");

  const granted = await joinCollaborationSession(session.id, {
    password: "legacy-password",
    userId: "legacy_migration_user",
  });
  assert.ok(!granted.error, "correct legacy password must be accepted during migration");
  assert.ok(granted.subscriptionToken, "successful join must return a subscription token");

  const migrated = await getCollaborationSession(session.id);
  assert.equal(
    migrated.passwordHash?.algorithm,
    "bcrypt",
    "legacy SHA-256 hashes must be upgraded to bcrypt after successful verification",
  );
  assert.notEqual(
    migrated.passwordHash?.hash,
    legacySha256("legacy-password"),
    "migrated password hash must not remain unsalted SHA-256",
  );
});

test("joinCollaborationSession for missing session returns 404", async () => {
  const { joinCollaborationSession } = await loadStore();

  const result = await joinCollaborationSession("session_doesnotexist00");
  assert.equal(result.status, 404, "joining non-existent session must return 404");
});
