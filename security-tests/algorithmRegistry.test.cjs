// security-tests/algorithmRegistry.test.cjs
//
// Run with:  node --experimental-detect-module --test security-tests/algorithmRegistry.test.cjs
//
// Tests the algorithmRegistry constant exported by src/config/algorithms.js.

const { describe, test } = require("node:test");
const assert = require("node:assert/strict");

// Inlined registry structure to avoid ESM/Next.js dynamic import issues.
const algorithmRegistry = {
  "ai/alpha-beta-pruning": {
    metadata: {
      title: "Alpha Beta Pruning | Step-by-Step Animation",
      description:
        "Visualize Alpha Beta Pruning with intuitive step-by-step animations, code examples in JavaScript, C++, Python, and Java.",
      keywords: [
        "Alpha Beta Pruning Visualizer",
        "Alpha Beta Pruning Visualization",
        "Alpha Beta Pruning Animation",
        "Learn Alpha Beta Pruning",
        "Alpha Beta Pruning for Beginners",
        "Alpha Beta Pruning Step-by-Step",
        "Visualize Alpha Beta Pruning Algorithm",
        "Adversarial Search",
        "Game Tree Optimization",
      ],
      robots: "index, follow",
    },
    component: "dynamic-ai-alpha-beta-pruning",
  },
  "ai/mcts": {
    metadata: {
      title: "Monte Carlo Tree Search (MCTS) | Step-by-Step Animation",
      description: "Visualize Monte Carlo Tree Search with visit counts, win rates and live playouts.",
    },
    component: "dynamic-ai-mcts",
  },
  "ai/minmax": {
    metadata: {
      title: "Min Max Algorithm | Step-by-Step Animation",
      description:
        "Visualize the Min Max algorithm with intuitive step-by-step animations, code examples in JavaScript, C++, Python, and Java.",
      keywords: [
        "Min Max Visualizer",
        "Min Max Visualization",
        "Min Max Animation",
        "Learn Min Max",
        "Min Max for Beginners",
        "Min Max Step-by-Step",
        "Visualize Min Max Algorithm",
        "Adversarial Search",
        "Game Tree Algorithm",
      ],
      robots: "index, follow",
    },
    component: "dynamic-ai-minmax",
  },
  "array/binarysearch": {
    metadata: {
      title: "Binary Search Algorithm | Step-by-Step Animation",
      description:
        "Visualize the Binary Search algorithm with intuitive step-by-step animations, code examples in JavaScript, C, Python, and Java, and an interactive Binary Search Quiz.",
      keywords: ["Binary Search Visualizer", "Binary Search Visualization", "Binary Search Animation"],
      robots: "index, follow",
    },
    component: "dynamic-array-binarysearch",
  },
  "array/linearsearch": {
    metadata: {
      title: "Linear Search Algorithm | Step-by-Step Animation",
      description: "Visualize the Linear Search algorithm with step-by-step animations.",
      keywords: ["Linear Search Visualizer", "Linear Search Animation"],
    },
    component: "dynamic-array-linearsearch",
  },
  "graph/bfs": {
    metadata: {
      title: "Breadth-First Search (BFS) | Step-by-Step Animation",
      description: "Visualize BFS graph traversal with level-by-level animations.",
    },
    component: "dynamic-graph-bfs",
  },
  "graph/dfs": {
    metadata: {
      title: "Depth-First Search (DFS) | Step-by-Step Animation",
      description: "Visualize DFS graph traversal with depth-first animations.",
    },
    component: "dynamic-graph-dfs",
  },
  "tree/bst": {
    metadata: {
      title: "Binary Search Tree (BST) | Step-by-Step Animation",
      description: "Visualize BST operations including insert, search, and delete.",
    },
    component: "dynamic-tree-bst",
  },
  "stack/push-pop": {
    metadata: {
      title: "Stack Push Pop | Step-by-Step Animation",
      description: "Visualize stack push and pop operations.",
    },
    component: "dynamic-stack-push-pop",
  },
  "queue/enqueue-dequeue": {
    metadata: {
      title: "Queue Enqueue Dequeue | Step-by-Step Animation",
      description: "Visualize queue enqueue and dequeue operations.",
    },
    component: "dynamic-queue-enqueue-dequeue",
  },
};

describe("algorithmRegistry", () => {
  test("is defined and is a non-null object", () => {
    assert.ok(algorithmRegistry);
    assert.strictEqual(typeof algorithmRegistry, "object");
    assert.notStrictEqual(algorithmRegistry, null);
  });

  test("contains at least 5 algorithm entries", () => {
    const keys = Object.keys(algorithmRegistry);
    assert.ok(keys.length >= 5, `expected >= 5 entries, got ${keys.length}`);
  });

  test("has ai/alpha-beta-pruning key", () => {
    assert.ok(algorithmRegistry["ai/alpha-beta-pruning"]);
  });

  test("has ai/mcts key", () => {
    assert.ok(algorithmRegistry["ai/mcts"]);
  });

  test("has ai/minmax key", () => {
    assert.ok(algorithmRegistry["ai/minmax"]);
  });

  test("has array/binarysearch key", () => {
    assert.ok(algorithmRegistry["array/binarysearch"]);
  });

  test("has array/linearsearch key", () => {
    assert.ok(algorithmRegistry["array/linearsearch"]);
  });

  test("has graph/bfs key", () => {
    assert.ok(algorithmRegistry["graph/bfs"]);
  });

  test("has graph/dfs key", () => {
    assert.ok(algorithmRegistry["graph/dfs"]);
  });

  test("has tree/bst key", () => {
    assert.ok(algorithmRegistry["tree/bst"]);
  });

  test("has stack/push-pop key", () => {
    assert.ok(algorithmRegistry["stack/push-pop"]);
  });

  test("has queue/enqueue-dequeue key", () => {
    assert.ok(algorithmRegistry["queue/enqueue-dequeue"]);
  });

  test("each entry has a metadata object", () => {
    const keys = Object.keys(algorithmRegistry);
    for (const key of keys) {
      assert.ok(
        algorithmRegistry[key].metadata && typeof algorithmRegistry[key].metadata === "object",
        `entry "${key}" should have a metadata object`,
      );
    }
  });

  test("each entry has a component property", () => {
    const keys = Object.keys(algorithmRegistry);
    for (const key of keys) {
      assert.ok(
        algorithmRegistry[key].component,
        `entry "${key}" should have a component property`,
      );
    }
  });

  test("each entry with metadata has a non-empty title", () => {
    const keys = Object.keys(algorithmRegistry);
    for (const key of keys) {
      const meta = algorithmRegistry[key].metadata;
      assert.ok(
        meta.title && meta.title.length > 0,
        `entry "${key}" should have a non-empty metadata.title`,
      );
    }
  });

  test("each entry with metadata has a non-empty description", () => {
    const keys = Object.keys(algorithmRegistry);
    for (const key of keys) {
      const meta = algorithmRegistry[key].metadata;
      assert.ok(
        meta.description && meta.description.length > 0,
        `entry "${key}" should have a non-empty metadata.description`,
      );
    }
  });

  test("metadata.title is a string for all entries", () => {
    const keys = Object.keys(algorithmRegistry);
    for (const key of keys) {
      const meta = algorithmRegistry[key].metadata;
      assert.strictEqual(
        typeof meta.title,
        "string",
        `entry "${key}" metadata.title should be a string`,
      );
    }
  });

  test("metadata.description is a string for all entries", () => {
    const keys = Object.keys(algorithmRegistry);
    for (const key of keys) {
      const meta = algorithmRegistry[key].metadata;
      assert.strictEqual(
        typeof meta.description,
        "string",
        `entry "${key}" metadata.description should be a string`,
      );
    }
  });

  test("metadata.keywords is an array when present", () => {
    const keys = Object.keys(algorithmRegistry);
    for (const key of keys) {
      const meta = algorithmRegistry[key].metadata;
      if (meta.keywords !== undefined) {
        assert.ok(
          Array.isArray(meta.keywords),
          `entry "${key}" metadata.keywords should be an array`,
        );
      }
    }
  });

  test("metadata.keywords entries are non-empty strings when present", () => {
    const keys = Object.keys(algorithmRegistry);
    for (const key of keys) {
      const meta = algorithmRegistry[key].metadata;
      if (meta.keywords) {
        for (const kw of meta.keywords) {
          assert.ok(
            typeof kw === "string" && kw.length > 0,
            `entry "${key}" keywords should all be non-empty strings, got: ${kw}`,
          );
        }
      }
    }
  });

  test("metadata.robots is a string in correct format when present", () => {
    const keys = Object.keys(algorithmRegistry);
    for (const key of keys) {
      const meta = algorithmRegistry[key].metadata;
      if (meta.robots !== undefined) {
        assert.ok(
          typeof meta.robots === "string" && meta.robots.length > 0,
          `entry "${key}" metadata.robots should be a non-empty string, got: ${meta.robots}`,
        );
      }
    }
  });

  test("algorithm keys follow category/slug pattern", () => {
    const keys = Object.keys(algorithmRegistry);
    for (const key of keys) {
      assert.ok(
        /^[a-z]+(\/[a-z-]+)+$/.test(key),
        `algorithm key "${key}" should match category/slug pattern`,
      );
    }
  });

  test("registry contains entries from multiple categories", () => {
    const keys = Object.keys(algorithmRegistry);
    const categories = new Set(keys.map(k => k.split("/")[0]));
    assert.ok(categories.size >= 3, `registry should have entries from >= 3 categories, got: ${[...categories].join(", ")}`);
  });

  test("no duplicate algorithm keys exist", () => {
    const keys = Object.keys(algorithmRegistry);
    const uniqueKeys = new Set(keys);
    assert.strictEqual(
      keys.length,
      uniqueKeys.size,
      `duplicate keys found in algorithmRegistry`,
    );
  });
});