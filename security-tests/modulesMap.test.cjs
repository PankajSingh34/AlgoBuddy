// security-tests/modulesMap.test.cjs
//
// Run with:  node --experimental-detect-module --test security-tests/modulesMap.test.cjs
//
// Tests the MODULE_MAPS constants in src/lib/modulesMap.js.

const { test, describe } = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const { pathToFileURL } = require("node:url");

const modulesMapUrl = pathToFileURL(
  path.join(__dirname, "..", "src/lib/modulesMap.js"),
).href;

let MODULE_MAPS;

test("imports MODULE_MAPS without throwing", async () => {
  const mod = await import(modulesMapUrl);
  MODULE_MAPS = mod.MODULE_MAPS;
});

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

describe("MODULE_MAPS structure", () => {
  test("MODULE_MAPS is defined and is an object", () => {
    assert.ok(MODULE_MAPS !== undefined);
    assert.strictEqual(typeof MODULE_MAPS, "object");
  });

  test("no null or undefined values", () => {
    for (const [key, value] of Object.entries(MODULE_MAPS)) {
      assert.notStrictEqual(value, null, `Key "${key}" has null value`);
      assert.notStrictEqual(value, undefined, `Key "${key}" has undefined value`);
    }
  });

  test("all values are non-empty strings", () => {
    for (const [key, value] of Object.entries(MODULE_MAPS)) {
      assert.strictEqual(typeof value, "string", `Value for "${key}" must be a string`);
      assert.ok(value.length > 0, `Value for "${key}" must not be empty`);
    }
  });

  test("majority of values match UUID v4 format", () => {
    const uuidValues = Object.entries(MODULE_MAPS).filter(([, v]) => UUID_RE.test(v));
    const nonUuidValues = Object.entries(MODULE_MAPS).filter(([, v]) => !UUID_RE.test(v));
    assert.ok(
      uuidValues.length >= Object.keys(MODULE_MAPS).length * 0.6,
      `Expected majority of values to be valid UUIDs. Found ${uuidValues.length} UUIDs vs ${nonUuidValues.length} non-UUIDs: ${nonUuidValues.map(([k]) => k).join(", ")}`,
    );
  });

  test("has expected core algorithm keys", () => {
    const expectedKeys = [
      "linearSearch",
      "binarySearch",
      "bubbleSort",
      "insertionSort",
      "selectionSort",
      "mergeSort",
      "quickSort",
      "heapSort",
      "pushPop",
      "enqueueDequeue",
      "trie",
      "minMax",
      "alphaBeta",
      "astar",
      "mcts",
      "slidingWindow",
      "twoPointers",
    ];
    for (const key of expectedKeys) {
      assert.ok(
        key in MODULE_MAPS,
        `Expected key "${key}" not found in MODULE_MAPS`,
      );
    }
  });

  test("no duplicate values", () => {
    const values = Object.values(MODULE_MAPS);
    const unique = new Set(values);
    assert.strictEqual(
      values.length,
      unique.size,
      `MODULE_MAPS has duplicate values: ${values.length} entries, ${unique.size} unique`,
    );
  });

  test("key names are non-empty strings with allowed characters", () => {
    for (const key of Object.keys(MODULE_MAPS)) {
      assert.strictEqual(typeof key, "string");
      assert.ok(key.length > 0, "Empty key found");
      assert.ok(
        /^[a-zA-Z0-9]+$/i.test(key),
        `Key "${key}" contains unexpected characters (only alphanumeric allowed)`,
      );
    }
  });
});
