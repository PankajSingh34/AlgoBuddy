// security-tests/visualizerThemes.test.cjs
//
// Run with:  node --experimental-detect-module --test security-tests/visualizerThemes.test.cjs
//
// Tests helpers in src/lib/visualizerThemes.js.

const { describe, test } = require("node:test");
const assert = require("node:assert/strict");

// Inline the source under test.
const VISUALIZER_THEMES = {
  Array: {
    name: "Array",
    color: "#a435f0",
    light: {
      bg: "bg-purple-100",
      surface: "bg-purple-50",
      border: "border-purple-200",
      text: "text-purple-900",
      accent: "bg-purple-500",
      iconBg: "bg-purple-100",
    },
    dark: {
      bg: "dark:bg-purple-950/50",
      surface: "dark:bg-purple-950/40",
      border: "dark:border-purple-500/20",
      text: "dark:text-purple-100",
      accent: "dark:bg-purple-600",
      iconBg: "dark:bg-purple-950/60",
      shadow: "dark:shadow-purple-950/50",
    },
    border: "border-purple-500/20",
    label: "10 algorithms",
  },
  Stack: {
    name: "Stack",
    color: "#2563eb",
    light: {
      bg: "bg-blue-100",
      surface: "bg-blue-50",
      border: "border-blue-200",
      text: "text-blue-900",
      accent: "bg-blue-500",
      iconBg: "bg-blue-100",
    },
    dark: {
      bg: "dark:bg-blue-950/50",
      surface: "dark:bg-blue-950/40",
      border: "dark:border-blue-500/20",
      text: "dark:text-blue-100",
      accent: "dark:bg-blue-600",
      iconBg: "dark:bg-blue-950/60",
      shadow: "dark:shadow-blue-950/50",
    },
    border: "border-blue-500/20",
    label: "8 algorithms",
  },
  Queue: {
    name: "Queue",
    color: "#059669",
    light: {
      bg: "bg-green-100",
      surface: "bg-green-50",
      border: "border-green-200",
      text: "text-green-900",
      accent: "bg-green-500",
      iconBg: "bg-green-100",
    },
    dark: {
      bg: "dark:bg-green-950/50",
      surface: "dark:bg-green-950/40",
      border: "dark:border-green-500/20",
      text: "dark:text-green-100",
      accent: "dark:bg-green-600",
      iconBg: "dark:bg-green-950/60",
      shadow: "dark:shadow-green-950/50",
    },
    border: "border-green-500/20",
    label: "10 algorithms",
  },
  "Linked List": {
    name: "Linked List",
    color: "#d97706",
    light: {
      bg: "bg-orange-100",
      surface: "bg-orange-50",
      border: "border-orange-200",
      text: "text-orange-900",
      accent: "bg-orange-500",
      iconBg: "bg-orange-100",
    },
    dark: {
      bg: "dark:bg-orange-950/50",
      surface: "dark:bg-orange-950/40",
      border: "dark:border-orange-500/20",
      text: "dark:text-orange-100",
      accent: "dark:bg-orange-600",
      iconBg: "dark:bg-orange-950/60",
      shadow: "dark:shadow-orange-950/50",
    },
    border: "border-orange-500/20",
    label: "10 algorithms",
  },
  Tree: {
    name: "Tree",
    color: "#7c3aed",
    light: {
      bg: "bg-violet-100",
      surface: "bg-violet-50",
      border: "border-violet-200",
      text: "text-violet-900",
      accent: "bg-violet-500",
      iconBg: "bg-violet-100",
    },
    dark: {
      bg: "dark:bg-violet-950/50",
      surface: "dark:bg-violet-950/40",
      border: "dark:border-violet-500/20",
      text: "dark:text-violet-100",
      accent: "dark:bg-violet-600",
      iconBg: "dark:bg-violet-950/60",
      shadow: "dark:shadow-violet-950/50",
    },
    border: "border-violet-500/20",
    label: "20 algorithms",
  },
  Graph: {
    name: "Graph",
    color: "#dc2626",
    light: {
      bg: "bg-red-100",
      surface: "bg-red-50",
      border: "border-red-200",
      text: "text-red-900",
      accent: "bg-red-500",
      iconBg: "bg-red-100",
    },
    dark: {
      bg: "dark:bg-red-950/50",
      surface: "dark:bg-red-950/40",
      border: "dark:border-red-500/20",
      text: "dark:text-red-100",
      accent: "dark:bg-red-600",
      iconBg: "dark:bg-red-950/60",
      shadow: "dark:shadow-red-950/50",
    },
    border: "border-red-500/20",
    label: "8 algorithms",
  },
  "AI Algorithms": {
    name: "AI Algorithms",
    color: "#0891b2",
    light: {
      bg: "bg-cyan-100",
      surface: "bg-cyan-50",
      border: "border-cyan-200",
      text: "text-cyan-900",
      accent: "bg-cyan-500",
      iconBg: "bg-cyan-100",
    },
    dark: {
      bg: "dark:bg-cyan-950/50",
      surface: "dark:bg-cyan-950/40",
      border: "dark:border-cyan-500/20",
      text: "dark:text-cyan-100",
      accent: "dark:bg-cyan-600",
      iconBg: "dark:bg-cyan-950/60",
      shadow: "dark:shadow-cyan-950/50",
    },
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
    lightBg: theme.light.bg.replace("bg-", ""),
    darkBgStyle: theme.dark.bg,
    border: theme.border,
  };
};

// ── Tests ────────────────────────────────────────────────────────────

describe("getVisualizerTheme", () => {
  test("returns correct theme object for valid name Array", () => {
    const theme = getVisualizerTheme("Array");
    assert.strictEqual(theme.name, "Array");
    assert.strictEqual(theme.color, "#a435f0");
    assert.ok(theme.light);
    assert.ok(theme.dark);
  });

  test("returns correct theme object for valid name Stack", () => {
    const theme = getVisualizerTheme("Stack");
    assert.strictEqual(theme.name, "Stack");
    assert.strictEqual(theme.color, "#2563eb");
  });

  test("returns correct theme object for valid name Graph", () => {
    const theme = getVisualizerTheme("Graph");
    assert.strictEqual(theme.name, "Graph");
    assert.strictEqual(theme.color, "#dc2626");
  });

  test("falls back to Array theme for unknown name", () => {
    const theme = getVisualizerTheme("NonExistent");
    assert.strictEqual(theme.name, "Array");
    assert.strictEqual(theme.color, "#a435f0");
  });

  test("falls back to Array theme for null/undefined", () => {
    assert.strictEqual(getVisualizerTheme(null).name, "Array");
    assert.strictEqual(getVisualizerTheme(undefined).name, "Array");
  });
});

describe("getThemeClasses", () => {
  const keys = ["bg", "surface", "border", "text", "accent", "iconBg"];

  for (const key of keys) {
    test(`returns merged light+dark class for key '${key}' on Array`, () => {
      const result = getThemeClasses("Array", key);
      assert.ok(result.length > 0, "should return non-empty string");
      assert.ok(result.includes("purple"), `should include purple theme class, got: ${result}`);
    });
  }

  test("returns empty string for unknown key on valid theme", () => {
    const result = getThemeClasses("Array", "nonexistentKey");
    assert.strictEqual(result, "");
  });

  test("defaults to bg key when no key is provided", () => {
    const result = getThemeClasses("Tree");
    assert.ok(result.includes("bg-violet"), `should default to bg key, got: ${result}`);
  });

  test("Queue theme returns green classes", () => {
    const result = getThemeClasses("Queue", "bg");
    assert.ok(result.includes("bg-green"), `got: ${result}`);
  });

  test("Graph theme returns red classes", () => {
    const result = getThemeClasses("Graph", "bg");
    assert.ok(result.includes("bg-red"), `got: ${result}`);
  });
});

describe("getCardTheme", () => {
  test("returns structured object with color", () => {
    const card = getCardTheme("Stack");
    assert.strictEqual(card.color, "#2563eb");
  });

  test("returns bgClasses with both light and dark", () => {
    const card = getCardTheme("Array");
    assert.ok(card.bgClasses.includes("bg-purple-100"), `got: ${card.bgClasses}`);
    assert.ok(card.bgClasses.includes("dark:bg-purple-950/50"), `got: ${card.bgClasses}`);
  });

  test("returns surfaceClasses with both light and dark", () => {
    const card = getCardTheme("Tree");
    assert.ok(card.surfaceClasses.includes("bg-violet-50"), `got: ${card.surfaceClasses}`);
    assert.ok(card.surfaceClasses.includes("dark:bg-violet-950/40"), `got: ${card.surfaceClasses}`);
  });

  test("returns borderClasses with both light and dark", () => {
    const card = getCardTheme("Queue");
    assert.ok(card.borderClasses.includes("border-green-200"), `got: ${card.borderClasses}`);
    assert.ok(card.borderClasses.includes("dark:border-green-500/20"), `got: ${card.borderClasses}`);
  });

  test("returns textClasses with both light and dark", () => {
    const card = getCardTheme("Graph");
    assert.ok(card.textClasses.includes("text-red-900"), `got: ${card.textClasses}`);
    assert.ok(card.textClasses.includes("dark:text-red-100"), `got: ${card.textClasses}`);
  });

  test("lightBg strips bg- prefix from light bg class", () => {
    const card = getCardTheme("Linked List");
    assert.strictEqual(card.lightBg, "orange-100");
  });

  test("darkBgStyle contains the dark bg class", () => {
    const card = getCardTheme("Stack");
    assert.strictEqual(card.darkBgStyle, "dark:bg-blue-950/50");
  });

  test("border field reflects theme border value", () => {
    const card = getCardTheme("AI Algorithms");
    assert.strictEqual(card.border, "border-cyan-500/20");
  });

  test("falls back to Array for unknown theme name", () => {
    const card = getCardTheme("Unknown");
    assert.strictEqual(card.color, "#a435f0");
  });
});
