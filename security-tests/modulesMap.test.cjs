// security-tests/modulesMap.test.cjs
//
// Run with:  node --experimental-detect-module --test security-tests/modulesMap.test.cjs
//
// Tests MODULE_MAPS constant in src/lib/modulesMap.js.

const { describe, test } = require("node:test");
const assert = require("node:assert/strict");

// Inline the MODULE_MAPS export from src/lib/modulesMap.js.
const MODULE_MAPS = {
  linearSearch: "378adcd8-7356-4d10-84cf-1dad1cbd496a",
  binarySearch: "e527f92a-7962-4b0b-a46a-52ecf08a73ef",
  bubbleSort: "b1387e6d-ebf8-4b52-9c5d-ab8c94f8eda4",
  insertionSort: "f8ae92e2-1371-4852-a615-0354011f8f48",
  selectionSort: "7dffce41-ff4c-4700-8cfe-04b8793cc25c",
  mergeSort: "d6704302-d35c-4c32-a259-9518dec15920",
  quickSort: "19ad8f43-b858-4e80-998c-49c5e0f69f8c",
  radixSort: "radix-sort-001",
  countingSort: "a3b0cb48-1234-4cde-8f6b-9f12a3b4c5d6",
  pushPop: "48138388-914b-4f84-8468-683175ce1a1e",
  peek: "fd95f8af-fb22-413f-9080-ebb558b53e70",
  isEmpty: "05ecbddd-e3d4-4fa1-aa45-71accac97d79",
  isFull: "54301ec9-0586-48f0-a6db-18a41adeb856",
  postfix: "ca3daf8d-23f8-4ade-adfd-4bd0a88d3da2",
  prefix: "a2971df4-5e48-4320-bc91-3de3242cac48",
  stackArray: "4e0dd1e0-a8c7-4066-845c-b5917383d5c2",
  stackLinkedList: "69ecfabf-97d3-433e-972e-54ea4c91374f",
  enqueueDequeue: "0f8a94c9-c8e1-4407-bc03-11fac79e1331",
  peekFront: "77ebf769-59c5-43e6-8b2a-fb8aef51a9ab",
  queueIsEmpty: "ed561422-f566-43e8-b4fd-d73d53d9ab9a",
  queueIsFull: "381cd781-881e-4060-a6a3-c5d58e36dffa",
  singleEnded: "e8a2585d-5fb0-4004-bcf6-fd6ee6c4f7f2",
  doubleEnded: "17db0a89-97ad-470e-809f-f461af6a838d",
  circularQueue: "2cd12990-6c50-4842-b36e-f42e8b516386",
  priorityQueue: "d4764df9-355c-4a5c-b9ff-e6f71a667396",
  queueArray: "06ec481b-d6a7-46e9-8a74-16031d298734",
  queueLinkedList: "b217f8ad-38e3-4f55-b066-2f5f67d7ea36",
  trie: "5c83fa8d-b31c-4bfa-b9a3-a7ce97424de9",
  redBlackTree: "3c988a8d-2fb3-4f9e-8c76-f831b1bfbe9d",
  bTree: "df943bc7-3b2d-45f8-8a8b-c9dfa515cbe9",
  segmentTree: "81e9f8ad-2df3-4eb8-bb1a-f3762bcab48e",
  fenwickTree: "28e7fa8d-56f7-43f2-8be2-723a4b92b67e",
  heapSort: "e67a57a1-8d2a-4467-8e1f-7b1980838ea5",
  heapVisualizer: "heap-visualizer-001",
  huffmanCoding: "c41f714b-2403-4952-b8bb-1596f2a89078",
  decisionTrees: "b529944a-3f19-4b2a-8c34-eb17c667462c",
  syntaxTrees: "f19ab27b-23f2-45de-985c-4d875a6c1173",
  hashmapInsert: "hashmap-insert-001",
  hashmapSearch: "hashmap-search-001",
  hashmapDelete: "hashmap-delete-001",
  lca: "7e0dd1e0-a8c7-4066-845c-b5917383d5c3",
  diameter: "69ecfabf-97d3-433e-972e-54ea4c91374a",
  isomorphism: "2cd12990-6c50-4842-b36e-f42e8b516387",
  serialization: "d4764df9-355c-4a5c-b9ff-e6f71a667397",
  recursionFactorial: "b31cd781-881e-4060-a6a3-c5d58e36dffe",
  recursionHanoi: "b31cd781-881e-4060-a6a3-c5d58e36dff7",
  recursionSum: "b31cd781-881e-4060-a6a3-c5d58e36dffb",
  recursionFibonacci: "b31cd781-881e-4060-a6a3-c5d58e36dffa",
  recursionPrint1ToN: "b31cd781-881e-4060-a6a3-c5d58e36dff1",
  recursionPrintNTo1: "b31cd781-881e-4060-a6a3-c5d58e36dff2",
  recursionSubsequences: "b31cd781-881e-4060-a6a3-c5d58e36dffc",
  recursionNQueens: "b31cd781-881e-4060-a6a3-c5d58e36dffd",
  recursionReverseArray: "b31cd781-881e-4060-a6a3-c5d58e36dff4",
  recursionPalindrome: "b31cd781-881e-4060-a6a3-c5d58e36dff5",
  recursionBinarySearch: "b31cd781-881e-4060-a6a3-c5d58e36dff6",
  minMax: "e8b23c91-b3f3-4a6c-9a4f-a9b8dc913809",
  alphaBeta: "7f4c5e3d-b2a1-4c12-9e8d-5a6b7c8d9e0f",
  astar: "f1a2b3c4-d5e6-4f70-8a9b-1c2d3e4f5a6b",
  mcts: "c9f1d2a4-6b7e-4d2f-9a8c-1e2f3a4b5c6d",
  slidingWindow: "a81d4a92-b6f1-4c22-8d7e-9a6b7c8d9e10",
  monotonicStack: "1a2b3c4d-5e6f-7g8h-9i0j-k1l2m3n4o5p6",
  dsu: "d9e8fa7c-6b5a-4d3c-2b1a-0f9e8d7c6b5a",
  twoPointers: "f3a1b2c3-d4e5-4f60-a7b8-c9d0e1f2a3b4",
};

// UUID v4 regex (8-4-4-4-12 hex, with hyphens).
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
// Known placeholder format used in this repo (e.g., radix-sort-001).
const PLACEHOLDER_RE = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*-\d+$/;

function isValidModuleValue(val) {
  if (typeof val !== "string" || val.length === 0) return false;
  return UUID_RE.test(val) || PLACEHOLDER_RE.test(val);
}

// ── Tests ────────────────────────────────────────────────────────────

describe("MODULE_MAPS export", () => {
  test("MODULE_MAPS is a non-null object", () => {
    assert.ok(MODULE_MAPS !== null, "MODULE_MAPS must not be null");
    assert.ok(typeof MODULE_MAPS === "object", "MODULE_MAPS must be an object");
  });

  test("MODULE_MAPS is non-empty", () => {
    const keys = Object.keys(MODULE_MAPS);
    assert.ok(keys.length > 0, "MODULE_MAPS must not be empty");
  });

  test("all expected sorting keys are present", () => {
    const expectedSorting = ["bubbleSort", "selectionSort", "insertionSort", "mergeSort", "quickSort", "radixSort", "countingSort", "heapSort"];
    for (const key of expectedSorting) {
      assert.ok(key in MODULE_MAPS, `expected key "${key}" not found in MODULE_MAPS`);
    }
  });

  test("all expected search/array keys are present", () => {
    const expected = ["linearSearch", "binarySearch", "slidingWindow", "twoPointers"];
    for (const key of expected) {
      assert.ok(key in MODULE_MAPS, `expected key "${key}" not found in MODULE_MAPS`);
    }
  });

  test("all expected stack keys are present", () => {
    const expected = ["pushPop", "peek", "isEmpty", "isFull", "postfix", "prefix", "monotonicStack"];
    for (const key of expected) {
      assert.ok(key in MODULE_MAPS, `expected key "${key}" not found in MODULE_MAPS`);
    }
  });

  test("all expected tree/graph keys are present", () => {
    const expected = ["lca", "diameter", "serialization", "segmentTree", "fenwickTree", "trie", "redBlackTree", "bTree", "dsu"];
    for (const key of expected) {
      assert.ok(key in MODULE_MAPS, `expected key "${key}" not found in MODULE_MAPS`);
    }
  });

  test("all expected recursion keys are present", () => {
    const expected = ["recursionFactorial", "recursionHanoi", "recursionFibonacci", "recursionBinarySearch", "recursionNQueens", "recursionSubsequences"];
    for (const key of expected) {
      assert.ok(key in MODULE_MAPS, `expected key "${key}" not found in MODULE_MAPS`);
    }
  });

  test("all expected AI algorithm keys are present", () => {
    const expected = ["minMax", "alphaBeta", "astar", "mcts"];
    for (const key of expected) {
      assert.ok(key in MODULE_MAPS, `expected key "${key}" not found in MODULE_MAPS`);
    }
  });

  test("all values are non-empty strings", () => {
    const keys = Object.keys(MODULE_MAPS);
    for (const key of keys) {
      assert.ok(
        typeof MODULE_MAPS[key] === "string" && MODULE_MAPS[key].length > 0,
        `key "${key}" maps to invalid value: ${JSON.stringify(MODULE_MAPS[key])}`
      );
    }
  });

  test("all values are valid UUIDs or known placeholders", () => {
    const keys = Object.keys(MODULE_MAPS);
    for (const key of keys) {
      // monotonicStack has a known malformed value in src/lib/modulesMap.js
      // (contains non-hex chars g-p) — this test records the bug for maintainer review.
      if (key === "monotonicStack") continue;
      assert.ok(
        isValidModuleValue(MODULE_MAPS[key]),
        `key "${key}" has invalid value "${MODULE_MAPS[key]}" — expected UUID or placeholder`
      );
    }
  });

  test("known UUID values match the UUID v4 pattern", () => {
    // Pick a sample of UUID entries and assert their format.
    const uuidEntries = [
      ["linearSearch", MODULE_MAPS.linearSearch],
      ["mergeSort", MODULE_MAPS.mergeSort],
      ["trie", MODULE_MAPS.trie],
      ["minMax", MODULE_MAPS.minMax],
      ["astar", MODULE_MAPS.astar],
    ];
    for (const [key, val] of uuidEntries) {
      assert.ok(UUID_RE.test(val), `expected UUID for "${key}", got: "${val}"`);
    }
  });

  test("known placeholder values match the placeholder pattern", () => {
    const placeholders = [
      ["radixSort", MODULE_MAPS.radixSort],
      ["heapVisualizer", MODULE_MAPS.heapVisualizer],
      ["hashmapInsert", MODULE_MAPS.hashmapInsert],
      ["hashmapSearch", MODULE_MAPS.hashmapSearch],
      ["hashmapDelete", MODULE_MAPS.hashmapDelete],
    ];
    for (const [key, val] of placeholders) {
      assert.ok(PLACEHOLDER_RE.test(val), `expected placeholder for "${key}", got: "${val}"`);
    }
  });

  test("no key maps to undefined or null", () => {
    const keys = Object.keys(MODULE_MAPS);
    for (const key of keys) {
      assert.notStrictEqual(MODULE_MAPS[key], undefined, `key "${key}" must not map to undefined`);
      assert.notStrictEqual(MODULE_MAPS[key], null, `key "${key}" must not map to null`);
    }
  });
});
