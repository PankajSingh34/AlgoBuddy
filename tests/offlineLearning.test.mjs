import assert from "node:assert/strict";
import test from "node:test";

import {
  OFFLINE_LEARNING_KEY,
  listOfflineResources,
  markOfflineResourceSynced,
  removeOfflineResource,
  saveOfflineResource,
} from "../src/lib/offlineLearning.js";

function createMemoryStorage() {
  const data = new Map();
  return {
    getItem: (key) => data.get(key) ?? null,
    setItem: (key, value) => data.set(key, value),
    removeItem: (key) => data.delete(key),
  };
}

test("offline learning resources are saved newest first", () => {
  const storage = createMemoryStorage();

  saveOfflineResource({ id: "binary-search", title: "Binary Search", url: "/visualizer/array/binarysearch" }, { storage });
  saveOfflineResource({ id: "quick-sort", title: "Quick Sort", url: "/visualizer/array/quicksort" }, { storage });

  const resources = listOfflineResources({ storage });
  assert.equal(resources.length, 2);
  assert.equal(resources[0].id, "quick-sort");
  assert.equal(resources[1].id, "binary-search");
});

test("offline learning resources can be marked synced", () => {
  const storage = createMemoryStorage();

  saveOfflineResource({ id: "article-1", type: "article", title: "Article", url: "/blog" }, { storage });
  const synced = markOfflineResourceSynced("article-1", { storage });

  assert.equal(synced.synced, true);
  assert.equal(typeof synced.syncedAt, "string");
});

test("offline learning resources can be removed", () => {
  const storage = createMemoryStorage();

  saveOfflineResource({ id: "graph", url: "/visualizer/graph" }, { storage });
  removeOfflineResource("graph", { storage });

  assert.equal(storage.getItem(OFFLINE_LEARNING_KEY), "[]");
  assert.deepEqual(listOfflineResources({ storage }), []);
});
