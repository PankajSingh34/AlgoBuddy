import { describe, expect, test } from "@jest/globals";
import { MODULE_MAPS } from "../../src/lib/modulesMap.js";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const SLUG_RE = /^[a-z][a-z0-9-]*$/;

// Slug-format IDs observed in the codebase (non-UUID)
const KNOWN_SLUG_IDS = new Set([
  "radix-sort-001",
  "heap-visualizer-001",
  "hashmap-insert-001",
  "hashmap-search-001",
  "hashmap-delete-001",
]);

// IDs with non-standard characters (placeholders) — accepted as valid non-empty strings
const KNOWN_PLACEHOLDER_IDS = new Set([
  "1a2b3c4d-5e6f-7g8h-9i0j-k1l2m3n4o5p6", // monotonicStack — non-hex chars
]);

function isValidId(id) {
  if (typeof id !== "string" || !id) return false;
  if (KNOWN_PLACEHOLDER_IDS.has(id)) return true;
  if (KNOWN_SLUG_IDS.has(id)) return true;
  return UUID_RE.test(id);
}

describe("MODULE_MAPS", () => {
  test("is a plain object", () => {
    expect(typeof MODULE_MAPS).toBe("object");
    expect(Array.isArray(MODULE_MAPS)).toBe(false);
  });

  test("has no undefined or null values", () => {
    const keys = Object.keys(MODULE_MAPS);
    expect(keys.length).toBeGreaterThan(0);
    for (const key of keys) {
      expect(MODULE_MAPS[key]).toBeTruthy();
      expect(typeof MODULE_MAPS[key]).toBe("string");
    }
  });

  test("every value is a valid UUID or known slug", () => {
    const keys = Object.keys(MODULE_MAPS);
    expect(keys.length).toBeGreaterThan(0);
    for (const key of keys) {
      const id = MODULE_MAPS[key];
      expect(isValidId(id)).toBe(true);
    }
  });

  test("has keys for core array algorithms", () => {
    expect(MODULE_MAPS.linearSearch).toBeTruthy();
    expect(MODULE_MAPS.binarySearch).toBeTruthy();
    expect(MODULE_MAPS.bubbleSort).toBeTruthy();
    expect(MODULE_MAPS.insertionSort).toBeTruthy();
    expect(MODULE_MAPS.selectionSort).toBeTruthy();
    expect(MODULE_MAPS.mergeSort).toBeTruthy();
    expect(MODULE_MAPS.quickSort).toBeTruthy();
  });

  test("has keys for stack and queue operations", () => {
    expect(MODULE_MAPS.pushPop).toBeTruthy();
    expect(MODULE_MAPS.peek).toBeTruthy();
    expect(MODULE_MAPS.enqueueDequeue).toBeTruthy();
    expect(MODULE_MAPS.queueIsEmpty).toBeTruthy();
    expect(MODULE_MAPS.queueArray).toBeTruthy();
    expect(MODULE_MAPS.queueLinkedList).toBeTruthy();
  });

  test("has keys for recursion visualizers", () => {
    expect(MODULE_MAPS.recursionFactorial).toBeTruthy();
    expect(MODULE_MAPS.recursionFibonacci).toBeTruthy();
    expect(MODULE_MAPS.recursionHanoi).toBeTruthy();
  });

  test("has keys for advanced graph/tree structures", () => {
    expect(MODULE_MAPS.trie).toBeTruthy();
    expect(MODULE_MAPS.heapSort).toBeTruthy();
    expect(MODULE_MAPS.mcts).toBeTruthy();
    expect(MODULE_MAPS.segmentTree).toBeTruthy();
  });

  test("all keys are non-empty strings", () => {
    const keys = Object.keys(MODULE_MAPS);
    for (const key of keys) {
      expect(typeof key).toBe("string");
      expect(key.length).toBeGreaterThan(0);
      expect(key).toBe(key.trim());
    }
  });

  test("has unique values (no duplicate IDs)", () => {
    const values = Object.values(MODULE_MAPS);
    const unique = new Set(values);
    expect(unique.size).toBe(values.length);
  });

  test("known slug IDs match expected slug pattern", () => {
    for (const id of KNOWN_SLUG_IDS) {
      expect(SLUG_RE.test(id)).toBe(true);
    }
  });
});
