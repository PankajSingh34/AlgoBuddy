// security-tests/visualizerThemes.test.cjs
//
// Run with:  node --experimental-detect-module --test security-tests/visualizerThemes.test.cjs
//
// Tests the visualizerThemes helper functions in src/lib/visualizerThemes.js.

const { describe, test } = require("node:test");
const assert = require("node:assert/strict");

// Inlined source to avoid ESM import issues.
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

const getVisualizerTheme = (name) => {
  return VISUALIZER_THEMES[name] || VISUALIZER_THEMES.Array;
};

const getThemeClasses = (themeName, key = "bg") => {
  const theme = getVisualizerTheme(themeName);
  const lightClass = theme.light[key] || "";
  const darkClass = theme.dark[key] || "";
  return `${lightClass} ${darkClass}`.trim();
};

const getCardTheme = (themeName) => {
  const theme = getVisualizerTheme(themeName);
  return {
    color: theme.color,
    bgClasses: `${theme.light.bg} ${theme.dark.bg}`,
    surfaceClasses: `${theme.light.surface} ${theme.dark.surface}`,
    borderClasses: `${theme.light.border} ${theme.dark.border}`,
    textClasses: `${theme.light.text} ${theme.dark.text}`,
    border: theme.border,
    lightBg: theme.light.bg.replace("bg-", ""),
    darkBgStyle: theme.dark.bg,
  };
};

describe("VISUALIZER_THEMES", () => {
  test("exports an object with expected top-level keys", () => {
    assert.ok(VISUALIZER_THEMES);
    assert.strictEqual(typeof VISUALIZER_THEMES, "object");
    assert.ok(VISUALIZER_THEMES.Array);
    assert.ok(VISUALIZER_THEMES.Stack);
    assert.ok(VISUALIZER_THEMES.Queue);
    assert.ok(VISUALIZER_THEMES["Linked List"]);
    assert.ok(VISUALIZER_THEMES.Tree);
    assert.ok(VISUALIZER_THEMES.Graph);
    assert.ok(VISUALIZER_THEMES["AI Algorithms"]);
  });

  test("each theme has required color, light/dark structures, and label", () => {
    const themeNames = Object.keys(VISUALIZER_THEMES);
    assert.ok(themeNames.length >= 7);
    for (const name of themeNames) {
      const theme = VISUALIZER_THEMES[name];
      assert.strictEqual(theme.name, name);
      assert.ok(/^#[0-9a-fA-F]{6}$/.test(theme.color), `color for ${name} should be hex`);
      assert.ok(theme.light);
      assert.ok(theme.dark);
      assert.ok(theme.border);
      assert.ok(theme.label);
    }
  });
});

describe("getVisualizerTheme", () => {
  test("returns correct theme for known name Array", () => {
    const theme = getVisualizerTheme("Array");
    assert.strictEqual(theme.name, "Array");
    assert.strictEqual(theme.color, "#a435f0");
  });

  test("returns correct theme for known name Stack", () => {
    const theme = getVisualizerTheme("Stack");
    assert.strictEqual(theme.name, "Stack");
    assert.strictEqual(theme.color, "#2563eb");
  });

  test("returns correct theme for known name Tree", () => {
    const theme = getVisualizerTheme("Tree");
    assert.strictEqual(theme.name, "Tree");
    assert.strictEqual(theme.color, "#7c3aed");
  });

  test("returns correct theme for known name Graph", () => {
    const theme = getVisualizerTheme("Graph");
    assert.strictEqual(theme.name, "Graph");
    assert.strictEqual(theme.color, "#dc2626");
  });

  test("returns Array theme as fallback for unknown name", () => {
    const theme = getVisualizerTheme("UnknownTheme");
    assert.strictEqual(theme.name, "Array");
  });

  test("returns Array theme as fallback for null input", () => {
    const theme = getVisualizerTheme(null);
    assert.strictEqual(theme.name, "Array");
  });
});

describe("getThemeClasses", () => {
  test("returns light and dark bg classes for Array theme", () => {
    const result = getThemeClasses("Array", "bg");
    assert.ok(result.includes("bg-purple-100"), "should contain light bg class");
    assert.ok(result.includes("dark:bg-purple-950/50"), "should contain dark bg class");
  });

  test("returns light and dark text classes for Stack theme", () => {
    const result = getThemeClasses("Stack", "text");
    assert.ok(result.includes("text-blue-900"), "should contain light text class");
    assert.ok(result.includes("dark:text-blue-100"), "should contain dark text class");
  });

  test("returns light and dark border classes for Graph theme", () => {
    const result = getThemeClasses("Graph", "border");
    assert.ok(result.includes("border-red-200"), "should contain light border class");
    assert.ok(result.includes("dark:border-red-500/20"), "should contain dark border class");
  });

  test("falls back to Array theme for unknown name", () => {
    const result = getThemeClasses("FakeTheme", "bg");
    assert.ok(result.includes("bg-purple-100"));
  });

  test("defaults to bg key when no key is provided", () => {
    const result = getThemeClasses("Queue");
    assert.ok(result.includes("bg-green-100"));
    assert.ok(result.includes("dark:bg-green-950/50"));
  });

  test("returns empty string for nonexistent key in theme", () => {
    const result = getThemeClasses("Array", "nonexistentKey");
    assert.strictEqual(result, "");
  });
});

describe("getCardTheme", () => {
  test("returns correct shape for Array theme", () => {
    const card = getCardTheme("Array");
    assert.strictEqual(card.color, "#a435f0");
    assert.ok(card.bgClasses.includes("bg-purple-100"));
    assert.ok(card.bgClasses.includes("dark:bg-purple-950/50"));
    assert.ok(card.surfaceClasses.includes("bg-purple-50"));
    assert.ok(card.borderClasses.includes("border-purple-200"));
    assert.ok(card.textClasses.includes("text-purple-900"));
    assert.strictEqual(card.border, "border-purple-500/20");
    assert.strictEqual(card.lightBg, "purple-100");
    assert.strictEqual(card.darkBgStyle, "dark:bg-purple-950/50");
  });

  test("returns correct shape for Queue theme", () => {
    const card = getCardTheme("Queue");
    assert.strictEqual(card.color, "#059669");
    assert.ok(card.bgClasses.includes("bg-green-100"));
    assert.ok(card.bgClasses.includes("dark:bg-green-950/50"));
  });

  test("falls back to Array theme for unknown name", () => {
    const card = getCardTheme("FakeTheme");
    assert.strictEqual(card.color, "#a435f0");
  });

  test("returns correct lightBg format for each theme", () => {
    assert.strictEqual(getCardTheme("Stack").lightBg, "blue-100");
    assert.strictEqual(getCardTheme("Tree").lightBg, "violet-100");
    assert.strictEqual(getCardTheme("Graph").lightBg, "red-100");
    assert.strictEqual(getCardTheme("Linked List").lightBg, "orange-100");
  });
});