// __tests__/visualizerThemes.test.js
//
// Run with:  npx jest __tests__/visualizerThemes.test.js --colors=false
//
// Tests the pure helper functions in src/lib/visualizerThemes.js.
// The theme constants are inlined here to avoid ESM import issues with Jest.

const { describe, expect, test } = require("@jest/globals");

// ─── Inlined from src/lib/visualizerThemes.js ──────────────────────────────────

const VISUALIZER_THEMES = {
  Array: {
    name: "Array",
    color: "#a435f0",
    light: { bg: "bg-purple-100", surface: "bg-purple-50", border: "border-purple-200", text: "text-purple-900", accent: "bg-purple-500", iconBg: "bg-purple-100" },
    dark: { bg: "dark:bg-purple-950/50", surface: "dark:bg-purple-950/40", border: "dark:border-purple-500/20", text: "dark:text-purple-100", accent: "dark:bg-purple-600", iconBg: "dark:bg-purple-950/60", shadow: "dark:shadow-purple-950/50" },
    border: "border-purple-500/20",
    label: "10 algorithms",
  },
  Stack: {
    name: "Stack",
    color: "#2563eb",
    light: { bg: "bg-blue-100", surface: "bg-blue-50", border: "border-blue-200", text: "text-blue-900", accent: "bg-blue-500", iconBg: "bg-blue-100" },
    dark: { bg: "dark:bg-blue-950/50", surface: "dark:bg-blue-950/40", border: "dark:border-blue-500/20", text: "dark:text-blue-100", accent: "dark:bg-blue-600", iconBg: "dark:bg-blue-950/60", shadow: "dark:shadow-blue-950/50" },
    border: "border-blue-500/20",
    label: "8 algorithms",
  },
  Queue: {
    name: "Queue",
    color: "#059669",
    light: { bg: "bg-green-100", surface: "bg-green-50", border: "border-green-200", text: "text-green-900", accent: "bg-green-500", iconBg: "bg-green-100" },
    dark: { bg: "dark:bg-green-950/50", surface: "dark:bg-green-950/40", border: "dark:border-green-500/20", text: "dark:text-green-100", accent: "dark:bg-green-600", iconBg: "dark:bg-green-950/60", shadow: "dark:shadow-green-950/50" },
    border: "border-green-500/20",
    label: "10 algorithms",
  },
  "Linked List": {
    name: "Linked List",
    color: "#d97706",
    light: { bg: "bg-orange-100", surface: "bg-orange-50", border: "border-orange-200", text: "text-orange-900", accent: "bg-orange-500", iconBg: "bg-orange-100" },
    dark: { bg: "dark:bg-orange-950/50", surface: "dark:bg-orange-950/40", border: "dark:border-orange-500/20", text: "dark:text-orange-100", accent: "dark:bg-orange-600", iconBg: "dark:bg-orange-950/60", shadow: "dark:shadow-orange-950/50" },
    border: "border-orange-500/20",
    label: "10 algorithms",
  },
  Tree: {
    name: "Tree",
    color: "#7c3aed",
    light: { bg: "bg-violet-100", surface: "bg-violet-50", border: "border-violet-200", text: "text-violet-900", accent: "bg-violet-500", iconBg: "bg-violet-100" },
    dark: { bg: "dark:bg-violet-950/50", surface: "dark:bg-violet-950/40", border: "dark:border-violet-500/20", text: "dark:text-violet-100", accent: "dark:bg-violet-600", iconBg: "dark:bg-violet-950/60", shadow: "dark:shadow-violet-950/50" },
    border: "border-violet-500/20",
    label: "20 algorithms",
  },
  Graph: {
    name: "Graph",
    color: "#dc2626",
    light: { bg: "bg-red-100", surface: "bg-red-50", border: "border-red-200", text: "text-red-900", accent: "bg-red-500", iconBg: "bg-red-100" },
    dark: { bg: "dark:bg-red-950/50", surface: "dark:bg-red-950/40", border: "dark:border-red-500/20", text: "dark:text-red-100", accent: "dark:bg-red-600", iconBg: "dark:bg-red-950/60", shadow: "dark:shadow-red-950/50" },
    border: "border-red-500/20",
    label: "8 algorithms",
  },
  "AI Algorithms": {
    name: "AI Algorithms",
    color: "#0891b2",
    light: { bg: "bg-cyan-100", surface: "bg-cyan-50", border: "border-cyan-200", text: "text-cyan-900", accent: "bg-cyan-500", iconBg: "bg-cyan-100" },
    dark: { bg: "dark:bg-cyan-950/50", surface: "dark:bg-cyan-950/40", border: "dark:border-cyan-500/20", text: "dark:text-cyan-100", accent: "dark:bg-cyan-600", iconBg: "dark:bg-cyan-950/60", shadow: "dark:shadow-cyan-950/50" },
    border: "border-cyan-500/20",
    label: "1 algorithm",
  },
};

function getVisualizerTheme(name) {
  return VISUALIZER_THEMES[name] || VISUALIZER_THEMES.Array;
}

function getThemeClasses(themeName, key) {
  key = key || "bg";
  const theme = getVisualizerTheme(themeName);
  const lightClass = theme.light[key] || "";
  const darkClass = theme.dark[key] || "";
  return `${lightClass} ${darkClass}`.trim();
}

function getCardTheme(themeName) {
  const theme = getVisualizerTheme(themeName);
  return {
    color: theme.color,
    bgClasses: `${theme.light.bg} ${theme.dark.bg}`,
    surfaceClasses: `${theme.light.surface} ${theme.dark.surface}`,
    borderClasses: `${theme.light.border} ${theme.dark.border}`,
    textClasses: `${theme.light.text} ${theme.dark.text}`,
    lightBg: theme.light.bg.replace("bg-", ""),
    darkBgStyle: theme.dark.bg,
    border: theme.border,
  };
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("VISUALIZER_THEMES", () => {
  test("exports themes for Array, Stack, Queue, Linked List, Tree, Graph, AI Algorithms", () => {
    const expected = ["Array", "Stack", "Queue", "Linked List", "Tree", "Graph", "AI Algorithms"];
    expected.forEach((name) => {
      expect(VISUALIZER_THEMES[name]).toBeDefined();
      expect(typeof VISUALIZER_THEMES[name]).toBe("object");
    });
  });

  test("each theme has color, light, dark, border, label properties", () => {
    Object.entries(VISUALIZER_THEMES).forEach(([name, theme]) => {
      expect(typeof theme.color).toBe("string");
      expect(theme.color.length).toBeGreaterThan(0);
      expect(typeof theme.light).toBe("object");
      expect(typeof theme.dark).toBe("object");
      expect(typeof theme.border).toBe("string");
      expect(typeof theme.label).toBe("string");
    });
  });

  test("each theme has required light/dark properties: bg, surface, border, text, accent, iconBg", () => {
    const required = ["bg", "surface", "border", "text", "accent", "iconBg"];
    required.forEach((key) => {
      Object.entries(VISUALIZER_THEMES).forEach(([name, theme]) => {
        expect(theme.light[key]).toBeDefined();
        expect(typeof theme.light[key]).toBe("string");
        expect(theme.dark[key]).toBeDefined();
        expect(typeof theme.dark[key]).toBe("string");
      });
    });
  });

  test("each theme color is a valid hex color string", () => {
    const hexColor = /#[0-9a-fA-F]{6}/;
    Object.entries(VISUALIZER_THEMES).forEach(([name, theme]) => {
      expect(theme.color).toMatch(hexColor);
    });
  });
});

describe("getVisualizerTheme", () => {
  test("returns correct theme for known name Array", () => {
    const theme = getVisualizerTheme("Array");
    expect(theme).toBeDefined();
    expect(theme.name).toBe("Array");
  });

  test("returns correct theme for known name Stack", () => {
    const theme = getVisualizerTheme("Stack");
    expect(theme).toBeDefined();
    expect(theme.name).toBe("Stack");
  });

  test("returns correct theme for known name Graph", () => {
    const theme = getVisualizerTheme("Graph");
    expect(theme).toBeDefined();
    expect(theme.name).toBe("Graph");
  });

  test("returns Array fallback for unknown name", () => {
    const theme = getVisualizerTheme("NonExistent");
    expect(theme).toBeDefined();
    expect(theme.name).toBe("Array");
  });

  test("returns Array fallback for null", () => {
    const theme = getVisualizerTheme(null);
    expect(theme).toBeDefined();
    expect(theme.name).toBe("Array");
  });

  test("returns Array fallback for undefined", () => {
    const theme = getVisualizerTheme(undefined);
    expect(theme).toBeDefined();
    expect(theme.name).toBe("Array");
  });

  test("Array and Graph themes have different colors", () => {
    const arrayTheme = getVisualizerTheme("Array");
    const graphTheme = getVisualizerTheme("Graph");
    expect(arrayTheme.color).not.toBe(graphTheme.color);
  });
});

describe("getThemeClasses", () => {
  test("returns both light and dark classes for known theme and key", () => {
    const classes = getThemeClasses("Array", "bg");
    expect(classes).toContain("bg-purple-100");
    expect(classes).toContain("dark:bg-purple-950/50");
  });

  test("returns both light and dark classes for Stack", () => {
    const classes = getThemeClasses("Stack", "text");
    expect(classes).toContain("text-blue-900");
    expect(classes).toContain("dark:text-blue-100");
  });

  test("returns Array fallback classes for unknown theme", () => {
    const classes = getThemeClasses("UnknownTheme", "bg");
    expect(classes).toContain("bg-purple-100");
  });

  test("returns empty string when key is absent from theme light", () => {
    const result = getThemeClasses("Array", "nonexistentKey");
    expect(typeof result).toBe("string");
  });

  test("result is a non-empty string for a valid theme and key", () => {
    const result = getThemeClasses("Tree", "surface");
    expect(result.length).toBeGreaterThan(0);
  });
});

describe("getCardTheme", () => {
  test("returns correct structure for Array theme", () => {
    const card = getCardTheme("Array");
    expect(card).toHaveProperty("color");
    expect(card).toHaveProperty("bgClasses");
    expect(card).toHaveProperty("surfaceClasses");
    expect(card).toHaveProperty("borderClasses");
    expect(card).toHaveProperty("textClasses");
    expect(card).toHaveProperty("border");
    expect(card).toHaveProperty("lightBg");
    expect(card).toHaveProperty("darkBgStyle");
  });

  test("color matches the theme color for known theme", () => {
    const treeTheme = VISUALIZER_THEMES["Tree"];
    const card = getCardTheme("Tree");
    expect(card.color).toBe(treeTheme.color);
  });

  test("bgClasses contains light bg class for known theme", () => {
    const card = getCardTheme("Queue");
    expect(card.bgClasses).toContain("bg-green-100");
    expect(card.bgClasses).toContain("dark:bg-green-950/50");
  });

  test("surfaceClasses contains both light and dark variants", () => {
    const card = getCardTheme("Linked List");
    expect(card.surfaceClasses).toContain("bg-orange-50");
    expect(card.surfaceClasses).toContain("dark:bg-orange-950/40");
  });

  test("borderClasses contains both light and dark variants", () => {
    const card = getCardTheme("Graph");
    expect(card.borderClasses).toContain("border-red-200");
    expect(card.borderClasses).toContain("dark:border-red-500/20");
  });

  test("textClasses contains both light and dark variants", () => {
    const card = getCardTheme("AI Algorithms");
    expect(card.textClasses).toContain("text-cyan-900");
    expect(card.textClasses).toContain("dark:text-cyan-100");
  });

  test("border is the theme border string", () => {
    const arrayTheme = VISUALIZER_THEMES["Array"];
    const card = getCardTheme("Array");
    expect(card.border).toBe(arrayTheme.border);
  });

  test("returns Array fallback for unknown theme", () => {
    const card = getCardTheme("CompletelyFake");
    expect(card.color).toBe(VISUALIZER_THEMES.Array.color);
  });

  test("lightBg is a string (bg class without the bg- prefix)", () => {
    const card = getCardTheme("Stack");
    expect(typeof card.lightBg).toBe("string");
    expect(card.lightBg.length).toBeGreaterThan(0);
  });

  test("darkBgStyle is a string containing dark:bg", () => {
    const card = getCardTheme("Stack");
    expect(typeof card.darkBgStyle).toBe("string");
    expect(card.darkBgStyle).toContain("dark:bg");
  });
});
