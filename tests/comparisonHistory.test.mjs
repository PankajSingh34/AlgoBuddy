import assert from "node:assert/strict";
import test from "node:test";

import {
  COMPARISON_HISTORY_KEY,
  clearComparisonHistory,
  listComparisonHistory,
  saveComparisonSession,
} from "../src/lib/comparisonHistory.js";

function createMemoryStorage() {
  const data = new Map();
  return {
    getItem: (key) => data.get(key) ?? null,
    setItem: (key, value) => data.set(key, value),
    removeItem: (key) => data.delete(key),
  };
}

test("comparison history saves newest sessions first", () => {
  const storage = createMemoryStorage();

  saveComparisonSession({ id: "a", algorithms: ["quick"], inputSize: 10 }, { storage });
  saveComparisonSession({ id: "b", algorithms: ["merge"], inputSize: 20 }, { storage });

  const history = listComparisonHistory({ storage });
  assert.equal(history.length, 2);
  assert.equal(history[0].id, "b");
  assert.equal(history[1].id, "a");
});

test("comparison history dedupes ids and enforces limit", () => {
  const storage = createMemoryStorage();

  saveComparisonSession({ id: "a", notes: "old" }, { storage, limit: 2 });
  saveComparisonSession({ id: "b" }, { storage, limit: 2 });
  saveComparisonSession({ id: "a", notes: "updated" }, { storage, limit: 2 });

  const history = listComparisonHistory({ storage });
  assert.deepEqual(
    history.map((item) => item.id),
    ["a", "b"],
  );
  assert.equal(history[0].notes, "updated");
});

test("comparison history can be cleared", () => {
  const storage = createMemoryStorage();

  saveComparisonSession({ id: "a" }, { storage });
  clearComparisonHistory({ storage });

  assert.equal(storage.getItem(COMPARISON_HISTORY_KEY), null);
  assert.deepEqual(listComparisonHistory({ storage }), []);
});
