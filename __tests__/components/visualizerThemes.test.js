// __tests__/components/visualizerThemes.test.js
//
// Run with:  ./node_modules/.bin/jest __tests__/components/visualizerThemes.test.js --colors=false

import {
  VISUALIZER_THEMES,
  getVisualizerTheme,
  getThemeClasses,
  getCardTheme,
} from '@/lib/visualizerThemes';

describe('VISUALIZER_THEMES', () => {
  test('exports themes for Array, Stack, Queue, LinkedList, Tree, Graph, AI Algorithms', () => {
    const expected = ['Array', 'Stack', 'Queue', 'Linked List', 'Tree', 'Graph', 'AI Algorithms'];
    expected.forEach((name) => {
      expect(VISUALIZER_THEMES[name]).toBeDefined();
      expect(typeof VISUALIZER_THEMES[name]).toBe('object');
    });
  });

  test('each theme has light and dark class properties', () => {
    Object.entries(VISUALIZER_THEMES).forEach(([name, theme]) => {
      expect(theme.light).toBeDefined();
      expect(theme.dark).toBeDefined();
      expect(theme.light.bg).toBeDefined();
      expect(theme.dark.bg).toBeDefined();
    });
  });

  test('each theme has a color property', () => {
    Object.entries(VISUALIZER_THEMES).forEach(([name, theme]) => {
      expect(theme.color).toBeDefined();
      expect(theme.color).toMatch(/^#[0-9a-fA-F]{6}$/);
    });
  });
});

describe('getVisualizerTheme', () => {
  test('returns the correct theme for known names', () => {
    expect(getVisualizerTheme('Array')).toBe(VISUALIZER_THEMES.Array);
    expect(getVisualizerTheme('Stack')).toBe(VISUALIZER_THEMES.Stack);
    expect(getVisualizerTheme('Queue')).toBe(VISUALIZER_THEMES.Queue);
    expect(getVisualizerTheme('Linked List')).toBe(VISUALIZER_THEMES['Linked List']);
    expect(getVisualizerTheme('Tree')).toBe(VISUALIZER_THEMES.Tree);
    expect(getVisualizerTheme('Graph')).toBe(VISUALIZER_THEMES.Graph);
    expect(getVisualizerTheme('AI Algorithms')).toBe(VISUALIZER_THEMES['AI Algorithms']);
  });

  test('falls back to Array theme for unknown names', () => {
    expect(getVisualizerTheme('UnknownTheme')).toBe(VISUALIZER_THEMES.Array);
    expect(getVisualizerTheme('')).toBe(VISUALIZER_THEMES.Array);
    expect(getVisualizerTheme(null)).toBe(VISUALIZER_THEMES.Array);
    expect(getVisualizerTheme(undefined)).toBe(VISUALIZER_THEMES.Array);
  });
});

describe('getThemeClasses', () => {
  test('returns light and dark class strings for a known theme', () => {
    const result = getThemeClasses('Stack', 'bg');
    expect(result).toContain('bg-blue-100');   // Stack light bg
    expect(result).toContain('dark:bg-blue-950/50'); // Stack dark bg
  });

  test('returns only light class for unknown key', () => {
    const result = getThemeClasses('Queue', 'nonexistent');
    expect(result).toBe('');
  });

  test('falls back to Array theme for unknown theme name', () => {
    const result = getThemeClasses('NonExistent', 'text');
    expect(result).toContain(VISUALIZER_THEMES.Array.light.text);
  });
});

describe('getCardTheme', () => {
  test('returns correct structure for known themes', () => {
    const result = getCardTheme('Array');
    expect(result).toHaveProperty('color', VISUALIZER_THEMES.Array.color);
    expect(result).toHaveProperty('bgClasses');
    expect(result).toHaveProperty('surfaceClasses');
    expect(result).toHaveProperty('borderClasses');
    expect(result).toHaveProperty('textClasses');
    expect(result).toHaveProperty('lightBg');
    expect(result).toHaveProperty('darkBgStyle');
    expect(result).toHaveProperty('border');
  });

  test('bgClasses concatenates light and dark classes', () => {
    const result = getCardTheme('Graph');
    expect(result.bgClasses).toContain(VISUALIZER_THEMES.Graph.light.bg);
    expect(result.bgClasses).toContain(VISUALIZER_THEMES.Graph.dark.bg);
  });

  test('falls back to Array theme for unknown name', () => {
    const result = getCardTheme('GarbageName');
    expect(result.color).toBe(VISUALIZER_THEMES.Array.color);
  });

  test('each theme has distinct colors', () => {
    const colors = Object.values(VISUALIZER_THEMES).map((t) => t.color);
    const unique = new Set(colors);
    expect(unique.size).toBe(colors.length);
  });
});
