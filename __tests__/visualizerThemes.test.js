import { VISUALIZER_THEMES, getVisualizerTheme, getThemeClasses, getCardTheme } from "@/lib/visualizerThemes";

describe("VISUALIZER_THEMES", () => {
  const expectedThemes = [
    "Array",
    "Stack",
    "Queue",
    "Linked List",
    "Tree",
    "Graph",
    "AI Algorithms",
  ];

  describe("Theme completeness", () => {
    test("contains all expected data structures", () => {
      expect(Object.keys(VISUALIZER_THEMES)).toEqual(expect.arrayContaining(expectedThemes));
    });

    test("each theme has required properties", () => {
      for (const themeName of expectedThemes) {
        const theme = VISUALIZER_THEMES[themeName];
        expect(theme).toBeDefined();
        expect(theme.name).toBe(themeName);
        expect(theme.color).toMatch(/^#[0-9a-fA-F]{6}$/);
        expect(theme.border).toBeDefined();
        expect(theme.label).toBeDefined();
        expect(theme.light).toBeDefined();
        expect(theme.dark).toBeDefined();
      }
    });

    test("each theme has light and dark mode properties", () => {
      const requiredKeys = ["bg", "surface", "border", "text", "accent", "iconBg"];
      
      for (const themeName of expectedThemes) {
        const theme = VISUALIZER_THEMES[themeName];
        
        for (const key of requiredKeys) {
          expect(theme.light[key]).toBeDefined();
          expect(theme.dark[key]).toBeDefined();
        }
        
        // Shadow is only in dark mode
        expect(theme.dark.shadow).toBeDefined();
      }
    });

    test("each theme has unique color", () => {
      const colors = expectedThemes.map(name => VISUALIZER_THEMES[name].color);
      const uniqueColors = [...new Set(colors)];
      expect(uniqueColors.length).toBe(colors.length);
    });
  });

  describe("getVisualizerTheme", () => {
    test("returns correct theme for valid name", () => {
      expect(getVisualizerTheme("Array").name).toBe("Array");
      expect(getVisualizerTheme("Stack").name).toBe("Stack");
      expect(getVisualizerTheme("Queue").name).toBe("Queue");
      expect(getVisualizerTheme("Linked List").name).toBe("Linked List");
      expect(getVisualizerTheme("Tree").name).toBe("Tree");
      expect(getVisualizerTheme("Graph").name).toBe("Graph");
      expect(getVisualizerTheme("AI Algorithms").name).toBe("AI Algorithms");
    });

    test("falls back to Array for unknown name", () => {
      const result = getVisualizerTheme("UnknownStructure");
      expect(result.name).toBe("Array");
    });

    test("falls back to Array for empty string", () => {
      const result = getVisualizerTheme("");
      expect(result.name).toBe("Array");
    });

    test("falls back to Array for null/undefined", () => {
      expect(getVisualizerTheme(null).name).toBe("Array");
      expect(getVisualizerTheme(undefined).name).toBe("Array");
    });
  });

  describe("getThemeClasses", () => {
    test("returns combined light and dark classes for bg", () => {
      const result = getThemeClasses("Array", "bg");
      expect(result).toContain("bg-purple-100");
      expect(result).toContain("dark:bg-purple-950/50");
    });

    test("returns combined classes for surface", () => {
      const result = getThemeClasses("Stack", "surface");
      expect(result).toContain("bg-blue-50");
      expect(result).toContain("dark:bg-blue-950/40");
    });

    test("returns combined classes for border", () => {
      const result = getThemeClasses("Queue", "border");
      expect(result).toContain("border-green-200");
      expect(result).toContain("dark:border-green-500/20");
    });

    test("returns combined classes for text", () => {
      const result = getThemeClasses("Tree", "text");
      expect(result).toContain("text-violet-900");
      expect(result).toContain("dark:text-violet-100");
    });

    test("returns combined classes for accent", () => {
      const result = getThemeClasses("Graph", "accent");
      expect(result).toContain("bg-red-500");
      expect(result).toContain("dark:bg-red-600");
    });

    test("returns combined classes for iconBg", () => {
      const result = getThemeClasses("AI Algorithms", "iconBg");
      expect(result).toContain("bg-cyan-100");
      expect(result).toContain("dark:bg-cyan-950/60");
    });

    test("returns empty string for unknown key", () => {
      const result = getThemeClasses("Array", "nonexistent");
      expect(result).toBe("");
    });

    test("falls back to Array for unknown theme", () => {
      const result = getThemeClasses("Unknown", "bg");
      expect(result).toContain("bg-purple-100");
      expect(result).toContain("dark:bg-purple-950/50");
    });
  });

  describe("getCardTheme", () => {
    test("returns complete theme object with all properties", () => {
      const cardTheme = getCardTheme("Array");
      
      expect(cardTheme.color).toBe("#a435f0");
      expect(cardTheme.bgClasses).toContain("bg-purple-100");
      expect(cardTheme.bgClasses).toContain("dark:bg-purple-950/50");
      expect(cardTheme.surfaceClasses).toContain("bg-purple-50");
      expect(cardTheme.surfaceClasses).toContain("dark:bg-purple-950/40");
      expect(cardTheme.borderClasses).toContain("border-purple-200");
      expect(cardTheme.borderClasses).toContain("dark:border-purple-500/20");
      expect(cardTheme.textClasses).toContain("text-purple-900");
      expect(cardTheme.textClasses).toContain("dark:text-purple-100");
      expect(cardTheme.lightBg).toBe("purple-100");
      expect(cardTheme.darkBgStyle).toContain("dark:bg-purple-950/50");
      expect(cardTheme.border).toBe("border-purple-500/20");
    });

    test("works for all theme names", () => {
      for (const themeName of expectedThemes) {
        const cardTheme = getCardTheme(themeName);
        expect(cardTheme.color).toMatch(/^#[0-9a-fA-F]{6}$/);
        expect(cardTheme.bgClasses).toBeTruthy();
        expect(cardTheme.surfaceClasses).toBeTruthy();
        expect(cardTheme.borderClasses).toBeTruthy();
        expect(cardTheme.textClasses).toBeTruthy();
        expect(cardTheme.lightBg).toBeTruthy();
        expect(cardTheme.darkBgStyle).toBeTruthy();
        expect(cardTheme.border).toBeTruthy();
      }
    });

    test("falls back to Array for unknown theme", () => {
      const cardTheme = getCardTheme("Unknown");
      expect(cardTheme.color).toBe("#a435f0");
      expect(cardTheme.bgClasses).toContain("bg-purple-100");
    });
  });

  describe("Dark mode shadow", () => {
    test("each theme has shadow in dark mode", () => {
      for (const themeName of expectedThemes) {
        expect(VISUALIZER_THEMES[themeName].dark.shadow).toBeDefined();
        expect(VISUALIZER_THEMES[themeName].dark.shadow).toContain("shadow-");
      }
    });
  });

  describe("Label consistency", () => {
    test("each theme has descriptive label", () => {
      for (const themeName of expectedThemes) {
        const label = VISUALIZER_THEMES[themeName].label;
        expect(label).toMatch(/\d+\s+algorithms?/);
      }
    });
  });

  describe("Border property", () => {
    test("each theme has border property", () => {
      for (const themeName of expectedThemes) {
        expect(VISUALIZER_THEMES[themeName].border).toBeDefined();
        expect(VISUALIZER_THEMES[themeName].border).toContain("border-");
      }
    });
  });
});

describe("VisualizerThemes integration", () => {
  test("all themes have consistent structure", () => {
    for (const [name, theme] of Object.entries(VISUALIZER_THEMES)) {
      expect(theme).toHaveProperty("name");
      expect(theme).toHaveProperty("color");
      expect(theme).toHaveProperty("light");
      expect(theme).toHaveProperty("dark");
      expect(theme).toHaveProperty("border");
      expect(theme).toHaveProperty("label");
    }
  });

  test("helper functions handle all themes", () => {
    const themes = Object.keys(VISUALIZER_THEMES);
    
    for (const themeName of themes) {
      // getVisualizerTheme
      expect(() => getVisualizerTheme(themeName)).not.toThrow();
      
      // getThemeClasses
      for (const key of ["bg", "surface", "border", "text", "accent", "iconBg"]) {
        expect(() => getThemeClasses(themeName, key)).not.toThrow();
      }
      
      // getCardTheme
      expect(() => getCardTheme(themeName)).not.toThrow();
    }
  });
});