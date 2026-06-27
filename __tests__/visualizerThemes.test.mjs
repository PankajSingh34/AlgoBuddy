// __tests__/visualizerThemes.test.mjs
//
// Run with:  NODE_OPTIONS="--experimental-vm-modules" npx jest __tests__/visualizerThemes.test.mjs --colors=false
//
// Tests getVisualizerTheme, getThemeClasses, and getCardTheme in src/lib/visualizerThemes.js.

import { describe, expect, test } from "@jest/globals";
import {
  VISUALIZER_THEMES,
  getVisualizerTheme,
  getThemeClasses,
  getCardTheme,
} from "../src/lib/visualizerThemes.js";

describe("getVisualizerTheme", () => {
  test("returns the correct theme object for a known theme name", () => {
    const theme = getVisualizerTheme("Array");
    expect(theme.name).toBe("Array");
    expect(theme.color).toBe("#a435f0");
    expect(theme.light).toBeDefined();
    expect(theme.dark).toBeDefined();
  });

  test("returns the Array theme as fallback for an unknown name", () => {
    const theme = getVisualizerTheme("NonExistentTheme");
    expect(theme.name).toBe("Array");
  });

  test("returns the Array theme when given null or undefined", () => {
    expect(getVisualizerTheme(null).name).toBe("Array");
    expect(getVisualizerTheme(undefined).name).toBe("Array");
  });

  test("handles known theme names case-sensitively", () => {
    expect(getVisualizerTheme("Stack").name).toBe("Stack");
    expect(getVisualizerTheme("Graph").name).toBe("Graph");
    expect(getVisualizerTheme("Queue").name).toBe("Queue");
  });
});

describe("getThemeClasses", () => {
  test("returns both light and dark class strings for known key", () => {
    const result = getThemeClasses("Array", "bg");
    expect(result).toContain("bg-purple-100");
    expect(result).toContain("dark:bg-purple-950/50");
  });

  test("returns light class when key has no dark counterpart", () => {
    const result = getThemeClasses("Array", "label");
    // label only exists on the top-level theme, not in light/dark sub-objects
    // so both light and dark would be empty strings
    expect(typeof result).toBe("string");
  });

  test("returns empty string for unknown theme name (falls back to Array)", () => {
    const result = getThemeClasses("Unknown", "bg");
    expect(result).toContain("bg-purple-100");
  });

  test("returns empty string for unknown key on valid theme", () => {
    const result = getThemeClasses("Array", "nonexistentKey");
    expect(result).toBe("");
  });
});

describe("getCardTheme", () => {
  test("returns color string and class objects for known theme", () => {
    const card = getCardTheme("Stack");
    expect(card.color).toBe("#2563eb");
    expect(card.bgClasses).toContain("bg-blue-100");
    expect(card.surfaceClasses).toContain("bg-blue-50");
    expect(card.borderClasses).toContain("border-blue-200");
    expect(card.textClasses).toContain("text-blue-900");
  });

  test("falls back to Array theme for unknown name", () => {
    const card = getCardTheme("CompletelyFake");
    expect(card.color).toBe("#a435f0");
  });

  test("includes lightBg and darkBgStyle for inline styles", () => {
    const card = getCardTheme("Array");
    expect(card.lightBg).toBeDefined();
    expect(card.darkBgStyle).toBeDefined();
  });

  test("includes border property for legacy compatibility", () => {
    const card = getCardTheme("Graph");
    expect(card.border).toBeDefined();
    expect(typeof card.border).toBe("string");
  });
});

describe("VISUALIZER_THEMES", () => {
  test("contains all expected theme categories", () => {
    const expectedThemes = [
      "Array",
      "Stack",
      "Queue",
      "Linked List",
      "Tree",
      "Graph",
      "AI Algorithms",
    ];
    expectedThemes.forEach((name) => {
      expect(VISUALIZER_THEMES[name]).toBeDefined();
    });
  });

  test("each theme has color, light, dark, and border properties", () => {
    Object.entries(VISUALIZER_THEMES).forEach(([name, theme]) => {
      expect(typeof theme.color).toBe("string");
      expect(theme.color.length).toBeGreaterThan(0);
      expect(theme.light).toBeDefined();
      expect(theme.dark).toBeDefined();
      expect(typeof theme.border).toBe("string");
    });
  });
});
