import { describe, expect, test } from "@jest/globals";
import { MODULE_MAPS } from "../src/lib/modulesMap.js";

describe("MODULE_MAPS constant lookups", () => {
  test("exports a populated map with stable keys and values", () => {
    expect(MODULE_MAPS).toBeTruthy();
    expect(typeof MODULE_MAPS).toBe("object");
    expect(Array.isArray(MODULE_MAPS)).toBe(false);

    const keys = Object.keys(MODULE_MAPS);
    expect(keys.length).toBeGreaterThanOrEqual(30);

    const expectedKeys = [
      "linearSearch",
      "binarySearch",
      "bubbleSort",
      "mergeSort",
      "quickSort",
      "radixSort",
      "pushPop",
      "enqueueDequeue",
      "trie",
      "heapSort",
    ];

    expectedKeys.forEach((key) => {
      expect(keys).toContain(key);
      expect(MODULE_MAPS[key]).toEqual(expect.any(String));
      expect(MODULE_MAPS[key].trim()).not.toHaveLength(0);
    });
  });

  test("supports direct lookup and missing keys stay undefined", () => {
    expect(MODULE_MAPS.linearSearch).toBe("378adcd8-7356-4d10-84cf-1dad1cbd496a");
    expect(MODULE_MAPS.nonExistentModule).toBeUndefined();
  });
});
