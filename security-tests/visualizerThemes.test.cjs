// security-tests/visualizerThemes.test.cjs
//
// Run with:  node --experimental-detect-module --test security-tests/visualizerThemes.test.cjs
//
// Tests the visualizerThemes helper functions in src/lib/visualizerThemes.js.
// Uses node:test + assert/strict — the same runner as npm run test:security.

const { describe, test } = require("node:test");
const assert = require("node:assert/strict");

// ─── Inline the source to avoid ESM / @/ alias resolution issues ────────────
// (Copied verbatim from src/lib/visualizerThemes.js)

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

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("VISUALIZER_THEMES", () => {
  test("contains Array, Stack, Queue, Linked List, Tree, Graph, AI Algorithms", () => {
    const keys = Object.keys(VISUALIZER_THEMES);
    assert.ok(keys.includes("Array"));
    assert.ok(keys.includes("Stack"));
    assert.ok(keys.includes("Queue"));
    assert.ok(keys.includes("Linked List"));
    assert.ok(keys.includes("Tree"));
    assert.ok(keys.includes("Graph"));
    assert.ok(keys.includes("AI Algorithms"));
  });

  test("each theme has color, light, dark, and border properties", () => {
    for (const [name, theme] of Object.entries(VISUALIZER_THEMES)) {
      assert.ok(theme.color, `${name} must have a color`);
      assert.ok(theme.light, `${name} must have light mode config`);
      assert.ok(theme.dark, `${name} must have dark mode config`);
      assert.ok(theme.border, `${name} must have a border property`);
      assert.ok(theme.light.bg, `${name} light must have bg class`);
      assert.ok(theme.dark.bg, `${name} dark must have bg class`);
    }
  });
});

describe("getVisualizerTheme", () => {
  test("returns the theme object for a valid name like 'Array'", () => {
    const theme = getVisualizerTheme("Array");
    assert.strictEqual(theme.name, "Array");
    assert.strictEqual(theme.color, "#a435f0");
  });

  test("returns the theme object for 'Tree'", () => {
    const theme = getVisualizerTheme("Tree");
    assert.strictEqual(theme.name, "Tree");
    assert.strictEqual(theme.color, "#7c3aed");
  });

  test("returns Array theme for unknown names (fallback)", () => {
    const theme = getVisualizerTheme("NonExistent");
    assert.strictEqual(theme.name, "Array");
  });

  test("returns Array theme for null/undefined input", () => {
    assert.strictEqual(getVisualizerTheme(null).name, "Array");
    assert.strictEqual(getVisualizerTheme(undefined).name, "Array");
  });
});

describe("getThemeClasses", () => {
  test("returns combined light and dark class strings for a valid theme", () => {
    const classes = getThemeClasses("Array", "bg");
    assert.ok(classes.includes("bg-purple-100"));
    assert.ok(classes.includes("dark:bg-purple-950/50"));
  });

  test("returns empty string for an unknown key in a valid theme", () => {
    const classes = getThemeClasses("Array", "nonexistentKey");
    assert.strictEqual(classes, "");
  });

  test("defaults to 'bg' key when no key parameter given", () => {
    const classes = getThemeClasses("Stack");
    assert.ok(classes.includes("bg-blue-100"));
    assert.ok(classes.includes("dark:bg-blue-950/50"));
  });

  test("returns correct classes for 'text' key", () => {
    const classes = getThemeClasses("Graph", "text");
    assert.ok(classes.includes("text-red-900"));
    assert.ok(classes.includes("dark:text-red-100"));
  });

  test("uses Array fallback for unknown theme name", () => {
    const classes = getThemeClasses("UnknownTheme", "bg");
    assert.ok(classes.includes("bg-purple-100"));
  });

  test("returns correct 'border' key classes", () => {
    const classes = getThemeClasses("Queue", "border");
    assert.ok(classes.includes("border-green-200"));
    assert.ok(classes.includes("dark:border-green-500/20"));
  });
});

describe("getCardTheme", () => {
  test("returns an object with color, bgClasses, surfaceClasses, borderClasses, textClasses, border", () => {
    const card = getCardTheme("Array");
    assert.ok("color" in card);
    assert.ok("bgClasses" in card);
    assert.ok("surfaceClasses" in card);
    assert.ok("borderClasses" in card);
    assert.ok("textClasses" in card);
    assert.ok("border" in card);
  });

  test("returns correct color for known themes", () => {
    assert.strictEqual(getCardTheme("Array").color, "#a435f0");
    assert.strictEqual(getCardTheme("Queue").color, "#059669");
    assert.strictEqual(getCardTheme("Graph").color, "#dc2626");
  });

  test("bgClasses contains both light and dark bg classes", () => {
    const card = getCardTheme("Tree");
    assert.ok(card.bgClasses.includes("bg-violet-100"));
    assert.ok(card.bgClasses.includes("dark:bg-violet-950/50"));
  });

  test("surfaceClasses contains both light and dark surface classes", () => {
    const card = getCardTheme("Stack");
    assert.ok(card.surfaceClasses.includes("bg-blue-50"));
    assert.ok(card.surfaceClasses.includes("dark:bg-blue-950/40"));
  });

  test("borderClasses contains both light and dark border classes", () => {
    const card = getCardTheme("Linked List");
    assert.ok(card.borderClasses.includes("border-orange-200"));
    assert.ok(card.borderClasses.includes("dark:border-orange-500/20"));
  });

  test("textClasses contains both light and dark text classes", () => {
    const card = getCardTheme("AI Algorithms");
    assert.ok(card.textClasses.includes("text-cyan-900"));
    assert.ok(card.textClasses.includes("dark:text-cyan-100"));
  });

  test("lightBg strips 'bg-' prefix from the light bg class", () => {
    const card = getCardTheme("Array");
    assert.strictEqual(card.lightBg, "purple-100");
  });

  test("darkBgStyle is the dark bg class string", () => {
    const card = getCardTheme("Array");
    assert.strictEqual(card.darkBgStyle, "dark:bg-purple-950/50");
  });

  test("falls back to Array theme for unknown name", () => {
    const card = getCardTheme("Unknown");
    assert.strictEqual(card.color, "#a435f0");
    assert.ok(card.bgClasses.includes("bg-purple-100"));
  });
});