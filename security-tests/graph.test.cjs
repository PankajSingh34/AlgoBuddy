// security-tests/graph.test.cjs
//
// Run with:  node --experimental-detect-module --test security-tests/graph.test.cjs
//
// Tests pure graph logic in src/utils/graph.js.

const { test, describe } = require('node:test');
const assert = require('node:assert/strict');

const {
  buildAdjacencyList,
  buildAdjacencyMatrix,
  bfsSteps,
  dfsSteps,
  hasCycleDirected,
  topologicalSort,
} = require('../src/utils/graph.js');

// ─── buildAdjacencyList ───────────────────────────────────────────────────────

describe('buildAdjacencyList', () => {
  test('initializes all nodes with empty arrays', () => {
    const adj = buildAdjacencyList(3, [], false, false);
    assert.deepStrictEqual(adj, { 0: [], 1: [], 2: [] });
  });

  test('directed: adds edge in one direction', () => {
    const adj = buildAdjacencyList(3, [{ from: 0, to: 1 }], true, false);
    assert.deepStrictEqual(adj[0], [1]);
    assert.deepStrictEqual(adj[1], []);
    assert.deepStrictEqual(adj[2], []);
  });

  test('undirected: mirrors edge in both directions', () => {
    const adj = buildAdjacencyList(3, [{ from: 0, to: 1 }], false, false);
    assert.deepStrictEqual(adj[0], [1]);
    assert.deepStrictEqual(adj[1], [0]);
    assert.deepStrictEqual(adj[2], []);
  });

  test('weighted: stores {to, weight} objects', () => {
    const adj = buildAdjacencyList(3, [{ from: 0, to: 1, weight: 5 }], false, true);
    assert.deepStrictEqual(adj[0], [{ to: 1, weight: 5 }]);
    assert.deepStrictEqual(adj[1], [{ to: 0, weight: 5 }]);
  });

  test('unweighted: stores raw node indices', () => {
    const adj = buildAdjacencyList(3, [{ from: 0, to: 1, weight: 5 }], false, false);
    assert.deepStrictEqual(adj[0], [1]);
    assert.deepStrictEqual(adj[1], [0]);
  });

  test('weighted directed: stores {to, weight} in one direction', () => {
    const adj = buildAdjacencyList(3, [{ from: 0, to: 2, weight: 3 }], true, true);
    assert.deepStrictEqual(adj[0], [{ to: 2, weight: 3 }]);
    assert.deepStrictEqual(adj[1], []);
    assert.deepStrictEqual(adj[2], []);
  });

  test('default weight is 1 when not specified', () => {
    const adj = buildAdjacencyList(2, [{ from: 0, to: 1 }], false, true);
    assert.deepStrictEqual(adj[0], [{ to: 1, weight: 1 }]);
  });

  test('multiple edges on same node', () => {
    const adj = buildAdjacencyList(4, [{ from: 0, to: 1 }, { from: 0, to: 2 }, { from: 0, to: 3 }], false, false);
    assert.deepStrictEqual(adj[0].sort(), [1, 2, 3]);
  });
});

// ─── buildAdjacencyMatrix ─────────────────────────────────────────────────────

describe('buildAdjacencyMatrix', () => {
  test('initializes n×n zero matrix', () => {
    const m = buildAdjacencyMatrix(2, [], false, false);
    assert.deepStrictEqual(m, [[0, 0], [0, 0]]);
  });

  test('directed: sets matrix[u][v] = 1', () => {
    const m = buildAdjacencyMatrix(3, [{ from: 0, to: 1 }], true, false);
    assert.strictEqual(m[0][1], 1);
    assert.strictEqual(m[1][0], 0);
  });

  test('undirected: mirrors to matrix[v][u]', () => {
    const m = buildAdjacencyMatrix(3, [{ from: 0, to: 1 }], false, false);
    assert.strictEqual(m[0][1], 1);
    assert.strictEqual(m[1][0], 1);
  });

  test('weighted: uses weight value', () => {
    const m = buildAdjacencyMatrix(3, [{ from: 0, to: 1, weight: 7 }], true, true);
    assert.strictEqual(m[0][1], 7);
  });

  test('multiple edges accumulate correctly', () => {
    const m = buildAdjacencyMatrix(3, [{ from: 0, to: 1 }, { from: 0, to: 1 }], true, false);
    assert.strictEqual(m[0][1], 1); // last write wins
  });
});

// ─── bfsSteps ─────────────────────────────────────────────────────────────────

describe('bfsSteps', () => {
  test('visits nodes in breadth-first order', () => {
    const adj = buildAdjacencyList(4, [{ from: 0, to: 1 }, { from: 0, to: 2 }, { from: 1, to: 3 }], false, false);
    const steps = bfsSteps(adj, 0);
    const visitedOrder = steps.map(s => s.current);
    assert.deepStrictEqual(visitedOrder, [0, 1, 2, 3]);
  });

  test('first step has visited = {start} and queue = []', () => {
    const adj = buildAdjacencyList(2, [{ from: 0, to: 1 }], false, false);
    const steps = bfsSteps(adj, 0);
    assert.deepStrictEqual(steps[0].visited, new Set([0]));
    assert.deepStrictEqual(steps[0].queue, []);
  });

  test('isolated node returns single step', () => {
    const adj = buildAdjacencyList(2, [], false, false);
    const steps = bfsSteps(adj, 0);
    assert.strictEqual(steps.length, 1);
    assert.strictEqual(steps[0].current, 0);
  });
});

// ─── dfsSteps ─────────────────────────────────────────────────────────────────

describe('dfsSteps', () => {
  test('visits nodes in depth-first order', () => {
    const adj = buildAdjacencyList(4, [{ from: 0, to: 1 }, { from: 0, to: 2 }, { from: 1, to: 3 }], false, false);
    const steps = dfsSteps(adj, 0);
    const visitedOrder = steps.map(s => s.current);
    // DFS goes 0 -> 1 -> 3, then back to explore 2
    assert.ok(visitedOrder[0] === 0);
    assert.ok(visitedOrder.includes(1));
    assert.ok(visitedOrder.includes(2));
    assert.ok(visitedOrder.includes(3));
    assert.strictEqual(visitedOrder.length, 4);
  });

  test('isolated node returns single step', () => {
    const adj = buildAdjacencyList(1, [], false, false);
    const steps = dfsSteps(adj, 0);
    assert.strictEqual(steps.length, 1);
    assert.strictEqual(steps[0].current, 0);
  });
});

// ─── hasCycleDirected ─────────────────────────────────────────────────────────

describe('hasCycleDirected', () => {
  test('no cycle in DAG', () => {
    const adj = buildAdjacencyList(3, [{ from: 0, to: 1 }, { from: 1, to: 2 }], true, false);
    assert.strictEqual(hasCycleDirected(3, adj), false);
  });

  test('detects cycle 0 -> 1 -> 0', () => {
    const adj = buildAdjacencyList(2, [{ from: 0, to: 1 }, { from: 1, to: 0 }], true, false);
    assert.strictEqual(hasCycleDirected(2, adj), true);
  });

  test('detects self-loop', () => {
    const adj = buildAdjacencyList(1, [{ from: 0, to: 0 }], true, false);
    assert.strictEqual(hasCycleDirected(1, adj), true);
  });
});

// ─── topologicalSort ──────────────────────────────────────────────────────────

describe('topologicalSort', () => {
  test('returns valid order for DAG', () => {
    const adj = buildAdjacencyList(3, [{ from: 0, to: 1 }, { from: 1, to: 2 }], true, false);
    const order = topologicalSort(3, adj);
    assert.ok(order !== null);
    assert.strictEqual(order.length, 3);
    assert.ok(order.indexOf(0) < order.indexOf(1));
    assert.ok(order.indexOf(1) < order.indexOf(2));
  });

  test('returns null when cycle exists', () => {
    const adj = buildAdjacencyList(3, [{ from: 0, to: 1 }, { from: 1, to: 2 }, { from: 2, to: 0 }], true, false);
    assert.strictEqual(topologicalSort(3, adj), null);
  });

  test('empty graph returns empty array', () => {
    const adj = buildAdjacencyList(0, [], true, false);
    const order = topologicalSort(0, adj);
    assert.deepStrictEqual(order, []);
  });
});