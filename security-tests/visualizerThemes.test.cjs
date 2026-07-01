// security-tests/visualizerThemes.test.cjs
//
// Run with:  node --experimental-detect-module --test security-tests/visualizerThemes.test.cjs
//
// Tests for src/lib/visualizerThemes.js

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

// Inlined helpers from src/lib/visualizerThemes.js
const VISUALIZER_THEMES = {
  Array: {
    name: 'Array',
    color: '#a435f0',
    light: { bg: 'bg-purple-100', surface: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-900', accent: 'bg-purple-500', iconBg: 'bg-purple-100' },
    dark: { bg: 'dark:bg-purple-950/50', surface: 'dark:bg-purple-950/40', border: 'dark:border-purple-500/20', text: 'dark:text-purple-100', accent: 'dark:bg-purple-600', iconBg: 'dark:bg-purple-950/60', shadow: 'dark:shadow-purple-950/50' },
    border: 'border-purple-500/20',
    label: '10 algorithms',
  },
  Stack: {
    name: 'Stack',
    color: '#2563eb',
    light: { bg: 'bg-blue-100', surface: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-900', accent: 'bg-blue-500', iconBg: 'bg-blue-100' },
    dark: { bg: 'dark:bg-blue-950/50', surface: 'dark:bg-blue-950/40', border: 'dark:border-blue-500/20', text: 'dark:text-blue-100', accent: 'dark:bg-blue-600', iconBg: 'dark:bg-blue-950/60', shadow: 'dark:shadow-blue-950/50' },
    border: 'border-blue-500/20',
    label: '8 algorithms',
  },
  Queue: {
    name: 'Queue',
    color: '#059669',
    light: { bg: 'bg-green-100', surface: 'bg-green-50', border: 'border-green-200', text: 'text-green-900', accent: 'bg-green-500', iconBg: 'bg-green-100' },
    dark: { bg: 'dark:bg-green-950/50', surface: 'dark:bg-green-950/40', border: 'dark:border-green-500/20', text: 'dark:text-green-100', accent: 'dark:bg-green-600', iconBg: 'dark:bg-green-950/60', shadow: 'dark:shadow-green-950/50' },
    border: 'border-green-500/20',
    label: '10 algorithms',
  },
  'Linked List': {
    name: 'Linked List',
    color: '#d97706',
    light: { bg: 'bg-orange-100', surface: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-900', accent: 'bg-orange-500', iconBg: 'bg-orange-100' },
    dark: { bg: 'dark:bg-orange-950/50', surface: 'dark:bg-orange-950/40', border: 'dark:border-orange-500/20', text: 'dark:text-orange-100', accent: 'dark:bg-orange-600', iconBg: 'dark:bg-orange-950/60', shadow: 'dark:shadow-orange-950/50' },
    border: 'border-orange-500/20',
    label: '10 algorithms',
  },
  Tree: {
    name: 'Tree',
    color: '#7c3aed',
    light: { bg: 'bg-violet-100', surface: 'bg-violet-50', border: 'border-violet-200', text: 'text-violet-900', accent: 'bg-violet-500', iconBg: 'bg-violet-100' },
    dark: { bg: 'dark:bg-violet-950/50', surface: 'dark:bg-violet-950/40', border: 'dark:border-violet-500/20', text: 'dark:text-violet-100', accent: 'dark:bg-violet-600', iconBg: 'dark:bg-violet-950/60', shadow: 'dark:shadow-violet-950/50' },
    border: 'border-violet-500/20',
    label: '20 algorithms',
  },
  Graph: {
    name: 'Graph',
    color: '#dc2626',
    light: { bg: 'bg-red-100', surface: 'bg-red-50', border: 'border-red-200', text: 'text-red-900', accent: 'bg-red-500', iconBg: 'bg-red-100' },
    dark: { bg: 'dark:bg-red-950/50', surface: 'dark:bg-red-950/40', border: 'dark:border-red-500/20', text: 'dark:text-red-100', accent: 'dark:bg-red-600', iconBg: 'dark:bg-red-950/60', shadow: 'dark:shadow-red-950/50' },
    border: 'border-red-500/20',
    label: '8 algorithms',
  },
  'AI Algorithms': {
    name: 'AI Algorithms',
    color: '#0891b2',
    light: { bg: 'bg-cyan-100', surface: 'bg-cyan-50', border: 'border-cyan-200', text: 'text-cyan-900', accent: 'bg-cyan-500', iconBg: 'bg-cyan-100' },
    dark: { bg: 'dark:bg-cyan-950/50', surface: 'dark:bg-cyan-950/40', border: 'dark:border-cyan-500/20', text: 'dark:text-cyan-100', accent: 'dark:bg-cyan-600', iconBg: 'dark:bg-cyan-950/60', shadow: 'dark:shadow-cyan-950/50' },
    border: 'border-cyan-500/20',
    label: '1 algorithm',
  },
};

const getVisualizerTheme = (name) => {
  return VISUALIZER_THEMES[name] || VISUALIZER_THEMES.Array;
};

const getThemeClasses = (themeName, key = 'bg') => {
  const theme = getVisualizerTheme(themeName);
  const lightClass = theme.light[key] || '';
  const darkClass = theme.dark[key] || '';
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
    lightBg: theme.light.bg.replace('bg-', ''),
    darkBgStyle: theme.dark.bg,
    border: theme.border,
  };
};

describe('VISUALIZER_THEMES data structure', () => {
  it('is a non-null object', () => {
    assert.ok(VISUALIZER_THEMES !== null && typeof VISUALIZER_THEMES === 'object');
  });

  const themeNames = ['Array', 'Stack', 'Queue', 'Linked List', 'Tree', 'Graph', 'AI Algorithms'];
  themeNames.forEach((name) => {
    it(`contains theme for '${name}'`, () => {
      assert.ok(VISUALIZER_THEMES[name] !== undefined, `Missing theme: ${name}`);
      assert.strictEqual(VISUALIZER_THEMES[name].name, name);
    });
  });

  it('each theme has color, light, dark, and border', () => {
    Object.values(VISUALIZER_THEMES).forEach((theme) => {
      assert.ok(typeof theme.color === 'string', 'Missing color');
      assert.ok(typeof theme.light === 'object', 'Missing light');
      assert.ok(typeof theme.dark === 'object', 'Missing dark');
      assert.ok(typeof theme.border === 'string', 'Missing border');
    });
  });
});

describe('getVisualizerTheme', () => {
  themeNames = ['Array', 'Stack', 'Queue', 'Linked List', 'Tree', 'Graph', 'AI Algorithms'];
  themeNames.forEach((name) => {
    it(`returns theme for '${name}'`, () => {
      const theme = getVisualizerTheme(name);
      assert.strictEqual(theme.name, name);
    });
  });

  it('falls back to Array for unknown theme', () => {
    assert.strictEqual(getVisualizerTheme('Unknown').name, 'Array');
  });

  it('falls back to Array for null', () => {
    assert.strictEqual(getVisualizerTheme(null).name, 'Array');
  });

  it('falls back to Array for undefined', () => {
    assert.strictEqual(getVisualizerTheme(undefined).name, 'Array');
  });

  it('falls back to Array for empty string', () => {
    assert.strictEqual(getVisualizerTheme('').name, 'Array');
  });
});

describe('getThemeClasses', () => {
  const keys = ['bg', 'text', 'border', 'accent', 'surface', 'iconBg'];
  const themeNames = ['Array', 'Stack', 'Queue', 'Graph', 'Linked List', 'Tree', 'AI Algorithms'];

  keys.forEach((key) => {
    themeNames.forEach((themeName) => {
      it(`returns merged classes for '${themeName}' key '${key}'`, () => {
        const result = getThemeClasses(themeName, key);
        assert.ok(typeof result === 'string' && result.length > 0, `Empty result for ${themeName}/${key}`);
        // Should contain light class and dark class prefix
        assert.ok(result.includes('dark:'), `Missing dark: prefix in '${result}'`);
      });
    });
  });

  it('falls back gracefully for unknown theme', () => {
    const result = getThemeClasses('NonExistent', 'bg');
    assert.strictEqual(result, 'bg-purple-100 dark:bg-purple-950/50');
  });
});

describe('getCardTheme', () => {
  it('returns correct color for Array', () => {
    const card = getCardTheme('Array');
    assert.strictEqual(card.color, '#a435f0');
  });

  it('returns correct color for Stack', () => {
    assert.strictEqual(getCardTheme('Stack').color, '#2563eb');
  });

  it('returns correct color for Queue', () => {
    assert.strictEqual(getCardTheme('Queue').color, '#059669');
  });

  it('returns correct color for Graph', () => {
    assert.strictEqual(getCardTheme('Graph').color, '#dc2626');
  });

  it('returns correct color for Tree', () => {
    assert.strictEqual(getCardTheme('Tree').color, '#7c3aed');
  });

  it('returns non-empty bgClasses, surfaceClasses, borderClasses, textClasses', () => {
    const card = getCardTheme('Stack');
    assert.ok(typeof card.bgClasses === 'string' && card.bgClasses.length > 0);
    assert.ok(typeof card.surfaceClasses === 'string' && card.surfaceClasses.length > 0);
    assert.ok(typeof card.borderClasses === 'string' && card.borderClasses.length > 0);
    assert.ok(typeof card.textClasses === 'string' && card.textClasses.length > 0);
  });

  it('bgClasses contains both light bg and dark:bg prefixes', () => {
    const card = getCardTheme('Linked List');
    assert.ok(card.bgClasses.includes('bg-'));
    assert.ok(card.bgClasses.includes('dark:bg-'));
  });

  it('falls back to Array for unknown theme', () => {
    const card = getCardTheme('Unknown');
    assert.strictEqual(card.color, '#a435f0');
  });
});
