import { describe, expect, test } from "@jest/globals";
import {
  SEARCH_INDEX,
  CATEGORIES,
} from "../../src/app/components/commandPaletteIndex.js";

describe("SEARCH_INDEX", () => {
  test("is a non-empty array", () => {
    expect(Array.isArray(SEARCH_INDEX)).toBe(true);
    expect(SEARCH_INDEX.length).toBeGreaterThan(0);
  });

  test("every entry has required fields: name, path, category", () => {
    for (const entry of SEARCH_INDEX) {
      expect(typeof entry.name).toBe("string");
      expect(entry.name.length).toBeGreaterThan(0);
      expect(typeof entry.path).toBe("string");
      expect(entry.path.length).toBeGreaterThan(0);
      expect(typeof entry.category).toBe("string");
      expect(entry.category.length).toBeGreaterThan(0);
    }
  });

  test("every path starts with a forward slash", () => {
    for (const entry of SEARCH_INDEX) {
      expect(entry.path.startsWith("/")).toBe(true);
    }
  });

  test("every entry has a valid category from CATEGORIES", () => {
    const validCategories = new Set(CATEGORIES);
    for (const entry of SEARCH_INDEX) {
      expect(validCategories.has(entry.category)).toBe(true);
    }
  });

  test("has no duplicate paths", () => {
    const paths = SEARCH_INDEX.map((e) => e.path);
    const unique = new Set(paths);
    expect(unique.size).toBe(paths.length);
  });

  test("has entries for core visualizer categories", () => {
    const categories = new Set(SEARCH_INDEX.map((e) => e.category));
    expect(categories.has("Array")).toBe(true);
    expect(categories.has("Recursion")).toBe(true);
    expect(categories.has("Stack")).toBe(true);
    expect(categories.has("Queue")).toBe(true);
  });

  test("includes home and visualizer page entries", () => {
    const paths = SEARCH_INDEX.map((e) => e.path);
    expect(paths).toContain("/");
    expect(paths).toContain("/visualizer");
    expect(paths).toContain("/practice");
  });
});

describe("CATEGORIES", () => {
  test("is a non-empty array of strings", () => {
    expect(Array.isArray(CATEGORIES)).toBe(true);
    expect(CATEGORIES.length).toBeGreaterThan(0);
    for (const cat of CATEGORIES) {
      expect(typeof cat).toBe("string");
      expect(cat.length).toBeGreaterThan(0);
    }
  });

  test("has no duplicate categories", () => {
    const unique = new Set(CATEGORIES);
    expect(unique.size).toBe(CATEGORIES.length);
  });

  test("includes expected top-level categories", () => {
    const catSet = new Set(CATEGORIES);
    expect(catSet.has("Array")).toBe(true);
    expect(catSet.has("Recursion")).toBe(true);
    expect(catSet.has("Stack")).toBe(true);
    expect(catSet.has("Graph")).toBe(true);
    expect(catSet.has("Hash Map")).toBe(true);
    expect(catSet.has("Page")).toBe(true);
  });
});
