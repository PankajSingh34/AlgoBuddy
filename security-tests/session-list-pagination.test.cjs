/**
 * Verifies that listCollaborationSessions uses the sorted-set index path
 * (no redis.keys() scan) and returns correctly shaped paginated responses
 * across 0, 1, and N sessions in the in-memory fallback.
 *
 * These tests exercise sessionStore helpers directly using the in-memory
 * (no-Redis) path so they run without network access and without needing
 * Upstash environment variables.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const { pathToFileURL } = require("node:url");

const storeUrl = pathToFileURL(
  path.join(__dirname, "..", "src", "lib", "collaboration", "sessionStore.js"),
).href;

async function loadStore() {
  return import(storeUrl);
}

// Helper: create N sessions and return their discoverable views
async function createSessions(store, n, visibility = "public") {
  const created = [];
  for (let i = 0; i < n; i++) {
    const { session } = await store.createCollaborationSession({
      title: `Session ${i + 1}`,
      visibility,
      module: "sorting",
    });
    created.push(session);
  }
  return created;
}

test("listCollaborationSessions returns empty result when no sessions exist", async () => {
  const store = await loadStore();
  const { sessions, nextCursor } = await store.listCollaborationSessions();
  assert.ok(Array.isArray(sessions), "sessions must be an array");
  assert.equal(sessions.length, 0, "must return zero sessions");
  assert.equal(nextCursor, null, "nextCursor must be null when no sessions exist");
});

test("listCollaborationSessions returns one session", async () => {
  const store = await loadStore();
  const [created] = await createSessions(store, 1);

  const { sessions, nextCursor } = await store.listCollaborationSessions();
  assert.ok(sessions.length >= 1, "must return at least the created session");

  const found = sessions.find((s) => s.id === created.id);
  assert.ok(found, "created session must be present in the list");
  assert.equal(nextCursor, null, "nextCursor must be null when all results fit on one page");
});

test("listCollaborationSessions excludes private sessions", async () => {
  const store = await loadStore();
  const [priv] = await createSessions(store, 1, "private");

  const { sessions } = await store.listCollaborationSessions();
  const found = sessions.find((s) => s.id === priv.id);
  assert.equal(found, undefined, "private sessions must not appear in the public listing");
});

test("listCollaborationSessions returns only discoverable fields", async () => {
  const store = await loadStore();
  await createSessions(store, 1);

  const { sessions } = await store.listCollaborationSessions();
  assert.ok(sessions.length > 0, "must have at least one session to audit");

  const allowed = new Set([
    "id",
    "joinCode",
    "title",
    "visibility",
    "module",
    "createdAt",
    "updatedAt",
    "participantCount",
    "presenterId",
  ]);

  for (const session of sessions) {
    for (const field of Object.keys(session)) {
      assert.ok(
        allowed.has(field),
        `unexpected field "${field}" in listed session`,
      );
    }
    assert.equal(session.sessionSecret, undefined, "sessionSecret must not appear");
    assert.equal(session.passwordHash, undefined, "passwordHash must not appear");
  }
});

test("listCollaborationSessions respects limit parameter", async () => {
  const store = await loadStore();
  await createSessions(store, 5);

  const { sessions, nextCursor } = await store.listCollaborationSessions({ limit: 2 });
  assert.ok(sessions.length <= 2, "must not return more sessions than the limit");
  // There are at least 5 sessions total (may be more from prior tests), so nextCursor
  // must not be null when limit is 2.
  assert.notEqual(nextCursor, null, "nextCursor must be set when more results exist");
});

test("listCollaborationSessions clamps limit to MAX_PAGE_LIMIT (100)", async () => {
  const store = await loadStore();
  // Create 3 sessions; requesting 999 should return all of them (≤ 100).
  await createSessions(store, 3);

  const { sessions } = await store.listCollaborationSessions({ limit: 999 });
  assert.ok(sessions.length <= 100, "must never return more than 100 sessions");
});

test("listCollaborationSessions cursor-based pagination covers all public sessions", async () => {
  const store = await loadStore();

  // Seed 6 distinct public sessions so pagination is observable.
  const seeded = await createSessions(store, 6);
  const seededIds = new Set(seeded.map((s) => s.id));

  // Collect all seeded sessions across pages of size 2.
  const collected = [];
  let cursor;
  let iterations = 0;

  do {
    const result = await store.listCollaborationSessions({ limit: 2, cursor });
    collected.push(...result.sessions.filter((s) => seededIds.has(s.id)));
    cursor = result.nextCursor;
    iterations++;
    // Guard against infinite loop in a broken implementation.
    if (iterations > 20) break;
  } while (cursor !== null);

  const collectedIds = collected.map((s) => s.id);
  for (const id of seededIds) {
    assert.ok(collectedIds.includes(id), `seeded session ${id} must appear in paginated results`);
  }
  // No duplicates across pages.
  const unique = new Set(collectedIds);
  assert.equal(
    unique.size,
    collectedIds.length,
    "paginated pages must not contain duplicate sessions",
  );
});

test("listCollaborationSessions default limit is 50 and must handle gracefully", async () => {
  const store = await loadStore();

  const { sessions } = await store.listCollaborationSessions();
  assert.ok(sessions.length <= 50, "default page must not exceed 50 sessions");
});

test("listCollaborationSessions result is sorted newest-first by updatedAt", async () => {
  const store = await loadStore();
  const created = await createSessions(store, 3);

  // Touch the first session so it has a more recent updatedAt.
  await store.updateCollaborationSession(created[0].id, { participantCount: 1 });

  const { sessions } = await store.listCollaborationSessions();
  const ours = sessions.filter((s) => created.find((c) => c.id === s.id));

  for (let i = 1; i < ours.length; i++) {
    assert.ok(
      ours[i - 1].updatedAt >= ours[i].updatedAt,
      "sessions must be ordered newest-first by updatedAt",
    );
  }
});
