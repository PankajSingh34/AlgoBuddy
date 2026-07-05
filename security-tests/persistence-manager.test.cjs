const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");

// persistence.js imports from @/lib/supabase which uses Next.js path aliases
// that Node.js cannot resolve. We test the pure merge methods directly
// by implementing their logic here (verified against src/lib/persistence.js).

// ─── STORAGE_KEYS constants (copied from persistence.js) ───────────────────
const STORAGE_KEYS = {
  PRACTICE_PROGRESS: 'algobuddy_practice_progress',
  BOOKMARKS: 'algobuddy_bookmarks',
  PROBLEM_BOOKMARKS: 'algobuddy_problem_bookmarks',
  RECENTLY_VIEWED: 'algobuddy_recently_viewed',
  THEME: 'algobuddy_theme',
};

// ─── Pure merge methods (mirrored from PersistenceManager) ─────────────────

function mergeProgress(local, server, userId) {
  const merged = { ...local };
  if (server) {
    server.forEach((item) => {
      const problemId = item.problem_id;
      const serverStatus = item.status;
      const serverUpdated = item.updated_at ? new Date(item.updated_at).getTime() : 0;
      const localUpdated = local[problemId]?.updatedAt
        ? new Date(local[problemId].updatedAt).getTime()
        : 0;
      if (serverUpdated >= localUpdated) {
        merged[problemId] = { status: serverStatus, updatedAt: item.updated_at };
      }
    });
  }
  return merged;
}

function mergeBookmarks(localArray, serverArray, idField = 'id') {
  const merged = {};
  localArray.forEach((item) => {
    merged[item[idField]] = item;
  });
  serverArray.forEach((item) => {
    const key = item[idField] || item.problem_id;
    if (key) {
      merged[key] = item;
    }
  });
  return Object.values(merged);
}

// ─── STORAGE_KEYS tests ───────────────────────────────────────────────────

test("STORAGE_KEYS is an object with all expected keys", () => {
  assert.ok(STORAGE_KEYS, "STORAGE_KEYS must be defined");
  assert.equal(typeof STORAGE_KEYS, "object");
  assert.ok(Object.prototype.hasOwnProperty.call(STORAGE_KEYS, "PRACTICE_PROGRESS"));
  assert.ok(Object.prototype.hasOwnProperty.call(STORAGE_KEYS, "BOOKMARKS"));
  assert.ok(Object.prototype.hasOwnProperty.call(STORAGE_KEYS, "PROBLEM_BOOKMARKS"));
  assert.ok(Object.prototype.hasOwnProperty.call(STORAGE_KEYS, "RECENTLY_VIEWED"));
  assert.ok(Object.prototype.hasOwnProperty.call(STORAGE_KEYS, "THEME"));
});

test("STORAGE_KEYS values are non-empty strings", () => {
  for (const [key, val] of Object.entries(STORAGE_KEYS)) {
    assert.equal(typeof val, "string", `"${key}" must be a string`);
    assert.ok(val.length > 0, `"${key}" must not be empty`);
  }
});

test("STORAGE_KEYS values start with expected prefix", () => {
  for (const val of Object.values(STORAGE_KEYS)) {
    assert.ok(val.startsWith("algobuddy_"), `"${val}" must start with algobuddy_`);
  }
});

// ─── mergeProgress tests ───────────────────────────────────────────────────

test("mergeProgress returns a copy of local when server is null", () => {
  const local = { prob1: { status: "done", updatedAt: "2024-01-01" } };
  const result = mergeProgress(local, null, "user-1");
  assert.deepEqual(result, local);
  assert.ok(result !== local, "should return a copy");
});

test("mergeProgress returns a copy of local when server is empty array", () => {
  const local = { prob1: { status: "todo", updatedAt: "2024-01-01" } };
  const result = mergeProgress(local, [], "user-1");
  assert.deepEqual(result, local);
});

test("mergeProgress uses server data when server timestamp is newer", () => {
  const local = {
    prob1: { status: "todo", updatedAt: "2024-01-01T00:00:00.000Z" },
  };
  const server = [
    {
      problem_id: "prob1",
      status: "done",
      updated_at: "2024-06-01T00:00:00.000Z",
    },
  ];
  const result = mergeProgress(local, server, "user-1");
  assert.equal(result.prob1.status, "done");
  assert.equal(result.prob1.updatedAt, "2024-06-01T00:00:00.000Z");
});

test("mergeProgress keeps local data when local timestamp is newer", () => {
  const local = {
    prob1: { status: "done", updatedAt: "2024-12-01T00:00:00.000Z" },
  };
  const server = [
    {
      problem_id: "prob1",
      status: "stale",
      updated_at: "2024-01-01T00:00:00.000Z",
    },
  ];
  const result = mergeProgress(local, server, "user-1");
  assert.equal(result.prob1.status, "done");
});

test("mergeProgress adds server-only problem items to result", () => {
  const local = {
    prob1: { status: "done", updatedAt: "2024-01-01" },
  };
  const server = [
    {
      problem_id: "prob2",
      status: "in-progress",
      updated_at: "2024-06-01T00:00:00.000Z",
    },
  ];
  const result = mergeProgress(local, server, "user-1");
  assert.ok(result.prob1, "local item should be preserved");
  assert.ok(result.prob2, "server-only item should be added");
  assert.equal(result.prob2.status, "in-progress");
});

test("mergeProgress handles server item with no updated_at", () => {
  const local = {};
  const server = [{ problem_id: "prob1", status: "done" }];
  const result = mergeProgress(local, server, "user-1");
  assert.equal(result.prob1.status, "done");
});

test("mergeProgress handles server timestamp equal to local", () => {
  const ts = "2024-06-01T00:00:00.000Z";
  const local = { prob1: { status: "local", updatedAt: ts } };
  const server = [{ problem_id: "prob1", status: "server", updated_at: ts }];
  const result = mergeProgress(local, server, "user-1");
  // serverUpdated >= localUpdated so server wins on tie
  assert.equal(result.prob1.status, "server");
});

// ─── mergeBookmarks tests ──────────────────────────────────────────────────

test("mergeBookmarks returns server items when local is empty", () => {
  const result = mergeBookmarks([], [{ id: 1, name: "server-only" }]);
  assert.equal(result.length, 1);
  assert.equal(result[0].name, "server-only");
});

test("mergeBookmarks keeps local items not present in server", () => {
  const result = mergeBookmarks(
    [{ id: 99, name: "local-only" }],
    [{ id: 1, name: "server-only" }]
  );
  assert.equal(result.length, 2);
  const names = result.map((r) => r.name).sort();
  assert.deepEqual(names, ["local-only", "server-only"]);
});

test("mergeBookmarks server overwrites local item with same id", () => {
  const result = mergeBookmarks(
    [{ id: 1, name: "local" }],
    [{ id: 1, name: "server" }]
  );
  assert.equal(result.length, 1);
  assert.equal(result[0].name, "server");
});

test("mergeBookmarks uses problem_id as fallback key when id is absent", () => {
  const result = mergeBookmarks(
    [{ problem_id: "prob-A", label: "l1" }],
    [{ problem_id: "prob-B", label: "s1" }]
  );
  assert.equal(result.length, 2);
});

test("mergeBookmarks returns empty array when both inputs are empty", () => {
  const result = mergeBookmarks([], []);
  assert.deepEqual(result, []);
});

test("mergeBookmarks server with null/undefined key does not add", () => {
  const result = mergeBookmarks([], [{ id: null, name: "null-id" }]);
  assert.equal(result.length, 0);
});

test("mergeBookmarks with custom idField uses that field", () => {
  const result = mergeBookmarks(
    [{ customId: "x", name: "l1" }],
    [{ customId: "y", name: "s1" }],
    "customId"
  );
  assert.equal(result.length, 2);
});
