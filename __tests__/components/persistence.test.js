import { describe, expect, test } from "@jest/globals";

// Inline merge logic from src/lib/persistence.js PersistenceManager class
// to test independently without needing localStorage or Supabase.

function mergeProgress(local, server) {
  const merged = { ...local };
  if (server) {
    server.forEach((item) => {
      const problemId = item.problem_id;
      const serverStatus = item.status;
      const serverUpdated = item.updated_at
        ? new Date(item.updated_at).getTime()
        : 0;
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

function mergeBookmarks(localArray, serverArray, idField = "id") {
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

describe("mergeProgress", () => {
  test("returns local data unchanged when server is empty", () => {
    const local = {
      prob1: { status: "completed", updatedAt: "2026-06-15" },
    };
    expect(mergeProgress(local, [])).toEqual(local);
  });

  test("returns local data unchanged when server is null", () => {
    const local = { prob1: { status: "attempted" } };
    expect(mergeProgress(local, null)).toEqual(local);
  });

  test("server wins when server updated_at is newer", () => {
    const local = {
      prob1: { status: "attempted", updatedAt: "2026-06-15T00:00:00Z" },
    };
    const server = [
      { problem_id: "prob1", status: "completed", updated_at: "2026-06-16T00:00:00Z" },
    ];
    const result = mergeProgress(local, server);
    expect(result.prob1.status).toBe("completed");
    expect(result.prob1.updatedAt).toBe("2026-06-16T00:00:00Z");
  });

  test("local wins when local updated_at is newer", () => {
    const local = {
      prob1: { status: "completed", updatedAt: "2026-06-17T00:00:00Z" },
    };
    const server = [
      { problem_id: "prob1", status: "attempted", updated_at: "2026-06-15T00:00:00Z" },
    ];
    const result = mergeProgress(local, server);
    expect(result.prob1.status).toBe("completed");
    expect(result.prob1.updatedAt).toBe("2026-06-17T00:00:00Z");
  });

  test("server wins when local has no updatedAt", () => {
    const local = { prob1: { status: "attempted" } };
    const server = [
      { problem_id: "prob1", status: "completed", updated_at: "2026-06-16T00:00:00Z" },
    ];
    const result = mergeProgress(local, server);
    expect(result.prob1.status).toBe("completed");
  });

  test("local wins when server has no updated_at (serverUpdated defaults to 0)", () => {
    const local = {
      prob1: { status: "attempted", updatedAt: "2026-06-15T00:00:00Z" },
    };
    const server = [{ problem_id: "prob1", status: "completed" }];
    const result = mergeProgress(local, server);
    // serverUpdated defaults to 0, localUpdated > 0, so local wins
    expect(result.prob1.status).toBe("attempted");
  });

  test("does not lose local items not present in server", () => {
    const local = {
      prob1: { status: "completed", updatedAt: "2026-06-15" },
      prob2: { status: "attempted", updatedAt: "2026-06-15" },
    };
    const server = [{ problem_id: "prob1", status: "completed", updated_at: "2026-06-15" }];
    const result = mergeProgress(local, server);
    expect(result.prob2).toBeTruthy();
    expect(result.prob2.status).toBe("attempted");
  });

  test("adds new server items not present in local", () => {
    const local = {};
    const server = [
      { problem_id: "prob3", status: "new", updated_at: "2026-06-16T00:00:00Z" },
    ];
    const result = mergeProgress(local, server);
    expect(result.prob3).toBeTruthy();
    expect(result.prob3.status).toBe("new");
  });
});

describe("mergeBookmarks", () => {
  test("returns deduplicated array when local and server have same items", () => {
    const local = [{ id: "b1", url: "http://example.com/1" }];
    const server = [{ id: "b1", url: "http://example.com/1" }];
    const result = mergeBookmarks(local, server);
    expect(result.length).toBe(1);
    expect(result[0].id).toBe("b1");
  });

  test("merges local and server arrays", () => {
    const local = [{ id: "b1", url: "http://example.com/1" }];
    const server = [{ id: "b2", url: "http://example.com/2" }];
    const result = mergeBookmarks(local, server);
    expect(result.length).toBe(2);
    const ids = result.map((r) => r.id);
    expect(ids).toContain("b1");
    expect(ids).toContain("b2");
  });

  test("server value overwrites local for same id", () => {
    const local = [{ id: "b1", url: "http://old.com" }];
    const server = [{ id: "b1", url: "http://new.com" }];
    const result = mergeBookmarks(local, server);
    expect(result.length).toBe(1);
    expect(result[0].url).toBe("http://new.com");
  });

  test("uses problem_id when idField is 'problem_id'", () => {
    const local = [{ problem_id: "p1", url: "http://example.com/p1" }];
    const server = [{ problem_id: "p2", url: "http://example.com/p2" }];
    const result = mergeBookmarks(local, server, "problem_id");
    expect(result.length).toBe(2);
  });

  test("handles empty local array", () => {
    const server = [{ id: "b1", url: "http://example.com/1" }];
    const result = mergeBookmarks([], server);
    expect(result.length).toBe(1);
  });

  test("handles empty server array", () => {
    const local = [{ id: "b1", url: "http://example.com/1" }];
    const result = mergeBookmarks(local, []);
    expect(result.length).toBe(1);
  });

  test("returns empty array when both inputs are empty", () => {
    expect(mergeBookmarks([], [])).toEqual([]);
  });

  test("skips server items with no idField and no problem_id", () => {
    const local = [{ id: "b1", url: "http://example.com/1" }];
    const server = [{ noIdField: "x" }];
    const result = mergeBookmarks(local, server);
    expect(result.length).toBe(1);
  });
});
