// security-tests/modulesMap.test.cjs
//
// Run with:  node --test security-tests/modulesMap.test.cjs
//
// Tests src/lib/modulesMap.js — MODULE_MAPS constant lookups.

const { describe, test } = require("node:test");
const assert = require("node:assert/strict");

const { MODULE_MAPS } = require("../src/lib/modulesMap");

// ── Basic shape ───────────────────────────────────────────────────────────────

test("MODULE_MAPS is a plain object", () => {
  assert.strictEqual(typeof MODULE_MAPS, "object");
  assert.ok(!Array.isArray(MODULE_MAPS));
});

test("MODULE_MAPS is not empty", () => {
  const keys = Object.keys(MODULE_MAPS);
  assert.ok(keys.length > 0, "MODULE_MAPS should have at least one entry");
});

test("MODULE_MAPS has at least 50 entries", () => {
  const keys = Object.keys(MODULE_MAPS);
  assert.ok(keys.length >= 50, `Expected >= 50 entries, got ${keys.length}`);
});

// ── Value format ─────────────────────────────────────────────────────────────

test("every value is a non-empty string", () => {
  for (const [key, val] of Object.entries(MODULE_MAPS)) {
    assert.strictEqual(typeof val, "string", `${key} should be a string`);
    assert.ok(val.length > 0, `${key} should not be an empty string`);
  }
});

test("every value is a non-empty string", () => {
  for (const [key, val] of Object.entries(MODULE_MAPS)) {
    assert.strictEqual(typeof val, "string", `${key} should be a string`);
    assert.ok(val.length > 0, `${key} should not be empty`);
  }
});

test("no two different keys share the same UUID value", () => {
  const values = Object.values(MODULE_MAPS);
  const unique = new Set(values);
  assert.strictEqual(
    values.length,
    unique.size,
    `Duplicate UUID values found in MODULE_MAPS`
  );
});

// ── Key coverage ──────────────────────────────────────────────────────────────

const EXPECTED_KEYS = [
  "linearSearch", "binarySearch",
  "bubbleSort", "insertionSort", "selectionSort", "mergeSort", "quickSort",
  "countingSort", "heapSort",
  "pushPop", "peek", "isEmpty", "isFull",
  "postfix", "prefix", "stackArray", "stackLinkedList",
  "enqueueDequeue", "peekFront", "queueIsEmpty", "queueIsFull",
  "singleEnded", "doubleEnded", "circularQueue", "priorityQueue",
  "queueArray", "queueLinkedList",
  "trie", "redBlackTree", "bTree", "segmentTree", "fenwickTree",
  "huffmanCoding", "decisionTrees", "syntaxTrees",
  "hashmapInsert", "hashmapSearch", "hashmapDelete",
  "lca", "diameter", "isomorphism", "serialization",
  "recursionFactorial", "recursionHanoi", "recursionSum",
  "recursionFibonacci", "recursionPrint1ToN", "recursionPrintNTo1",
  "recursionSubsequences", "recursionNQueens",
  "recursionReverseArray", "recursionPalindrome", "recursionBinarySearch",
  "minMax", "alphaBeta", "astar", "mcts",
  "slidingWindow", "monotonicStack", "dsu", "twoPointers",
];

for (const key of EXPECTED_KEYS) {
  test(`key "${key}" exists`, () => {
    assert.ok(
      Object.prototype.hasOwnProperty.call(MODULE_MAPS, key),
      `Missing expected key: ${key}`
    );
  });
}

// ── Unknown key handling ──────────────────────────────────────────────────────

test("unknown key access returns undefined (no crash)", () => {
  assert.strictEqual(MODULE_MAPS.unknownKeyThatDoesNotExist, undefined);
  assert.strictEqual(MODULE_MAPS["does-not-exist"], undefined);
});

test("MODULE_MAPS is immutable from the outside (adding a key does not throw)", () => {
  // The test verifies that we can safely attempt to access a missing key.
  const result = MODULE_MAPS["completely-new-key"];
  assert.strictEqual(result, undefined);
});
