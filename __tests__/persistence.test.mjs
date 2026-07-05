import { persistence } from "../src/lib/persistence";

beforeEach(() => {
  localStorage.clear();
});

describe("PersistenceManager - localStorage operations", () => {
  test("set stores JSON stringified value", () => {
    persistence.set("THEME", "dark");
    expect(localStorage.getItem("algobuddy_theme")).toBe('"dark"');
  });

  test("set stores complex objects", () => {
    const progress = { problem1: "solved", problem2: "attempted" };
    persistence.set("PRACTICE_PROGRESS", progress);
    expect(JSON.parse(localStorage.getItem("algobuddy_practice_progress"))).toEqual(progress);
  });

  test("get retrieves parsed value", async () => {
    localStorage.setItem("algobuddy_theme", '"light"');
    const value = await persistence.get("THEME");
    expect(value).toBe("light");
  });

  test("get returns null for missing key", async () => {
    const value = await persistence.get("BOOKMARKS");
    expect(value).toBeNull();
  });

  test("get returns null for invalid JSON", async () => {
    localStorage.setItem("algobuddy_theme", "not-json");
    const value = await persistence.get("THEME");
    expect(value).toBeNull();
  });

  test("remove deletes key from localStorage", () => {
    localStorage.setItem("algobuddy_theme", '"dark"');
    persistence.remove("THEME");
    expect(localStorage.getItem("algobuddy_theme")).toBeNull();
  });
});

describe("PersistenceManager - mergeProgress", () => {
  test("returns local data when server is null", () => {
    const local = { p1: { status: "solved", updatedAt: "2026-07-05T00:00:00Z" } };
    const merged = persistence.mergeProgress(local, null, "user-1");
    expect(merged).toEqual(local);
  });

  test("returns local data when server is empty", () => {
    const local = { p1: { status: "solved" } };
    const merged = persistence.mergeProgress(local, [], "user-1");
    expect(merged).toEqual(local);
  });

  test("uses server version when newer", () => {
    const local = { p1: { status: "attempted", updatedAt: "2026-07-04T00:00:00Z" } };
    const server = [{ problem_id: "p1", status: "solved", updated_at: "2026-07-05T00:00:00Z" }];
    const merged = persistence.mergeProgress(local, server, "user-1");
    expect(merged.p1.status).toBe("solved");
  });

  test("keeps local version when newer", () => {
    const local = { p1: { status: "solved", updatedAt: "2026-07-05T00:00:00Z" } };
    const server = [{ problem_id: "p1", status: "attempted", updated_at: "2026-07-04T00:00:00Z" }];
    const merged = persistence.mergeProgress(local, server, "user-1");
    expect(merged.p1.status).toBe("solved");
  });

  test("handles mixed local and server entries", () => {
    const local = { p1: { status: "solved" } };
    const server = [{ problem_id: "p2", status: "attempted", updated_at: "2026-07-05T00:00:00Z" }];
    const merged = persistence.mergeProgress(local, server, "user-1");
    expect(merged.p1).toBeDefined();
    expect(merged.p2).toBeDefined();
  });

  test("handles missing updatedAt gracefully", () => {
    const local = { p1: { status: "solved" } };
    const server = [{ problem_id: "p1", status: "attempted", updated_at: "2026-07-05T00:00:00Z" }];
    const merged = persistence.mergeProgress(local, server, "user-1");
    expect(merged.p1.status).toBe("attempted");
  });
});

describe("PersistenceManager - mergeBookmarks", () => {
  test("returns local array when server is empty", () => {
    const local = [{ id: 1, title: "Algo 101" }];
    const merged = persistence.mergeBookmarks(local, [], "id");
    expect(merged).toEqual(local);
  });

  test("merges local and server bookmarks by id", () => {
    const local = [{ id: 1, title: "Algo 101" }];
    const server = [{ id: 2, title: "Sorting" }];
    const merged = persistence.mergeBookmarks(local, server, "id");
    expect(merged.length).toBe(2);
  });

  test("deduplicates by id, preferring server for conflicts", () => {
    const local = [{ id: 1, title: "Old Title" }];
    const server = [{ id: 1, title: "New Title" }];
    const merged = persistence.mergeBookmarks(local, server, "id");
    expect(merged.length).toBe(1);
    expect(merged[0].title).toBe("New Title");
  });

  test("uses problem_id as fallback key when idField is not 'id'", () => {
    const local = [{ id: "p1", title: "Old" }];
    const server = [{ problem_id: "p1", title: "New" }];
    const merged = persistence.mergeBookmarks(local, server, "id");
    expect(merged.length).toBe(1);
    expect(merged[0].title).toBe("New");
  });

  test("handles empty local array", () => {
    const server = [{ id: 1, title: "Sorting" }];
    const merged = persistence.mergeBookmarks([], server, "id");
    expect(merged).toEqual(server);
  });

});
