// security-tests/graphLogic.test.cjs
//
// Run with:  node --experimental-detect-module --test security-tests/graphLogic.test.cjs
//
// Tests pure graph utility functions from src/utils/graph.js.
// Implementation is inlined from the source file.

const { test, describe } = require('node:test');
const assert = require('node:assert/strict');

// ─── Inlined from src/utils/graph.js ─────────────────────────────────────────

function buildAdjacencyList(nodeCount, edges, isDirected, isWeighted = false) {
  const adj = {};
  for (let i = 0; i < nodeCount; i++) adj[i] = [];
  for (const { from, to, weight = 1 } of edges) {
    adj[from].push(isWeighted ? { to, weight } : to);
    if (!isDirected) adj[to].push(isWeighted ? { to: from, weight } : from);
  }
  return adj;
}

function buildAdjacencyMatrix(nodeCount, edges, isDirected, isWeighted = false) {
  const matrix = Array.from({ length: nodeCount }, () => Array(nodeCount).fill(0));
  for (const { from, to, weight = 1 } of edges) {
    matrix[from][to] = isWeighted ? weight : 1;
    if (!isDirected) matrix[to][from] = isWeighted ? weight : 1;
  }
  return matrix;
}

function bfsSteps(adj, start) {
  const steps = [];
  const visited = new Set();
  const queue = [start];
  visited.add(start);
  while (queue.length > 0) {
    const current = queue.shift();
    steps.push({ current, visited: new Set(visited), queue: [...queue] });
    for (const neighbor of (adj[current] || [])) {
      const id = typeof neighbor === 'object' ? neighbor.to : neighbor;
      if (!visited.has(id)) {
        visited.add(id);
        queue.push(id);
      }
    }
  }
  return steps;
}

function dfsSteps(adj, start) {
  const steps = [];
  const visited = new Set();
  function dfs(node) {
    visited.add(node);
    steps.push({ current: node, visited: new Set(visited), stack: [] });
    for (const neighbor of (adj[node] || [])) {
      const id = typeof neighbor === 'object' ? neighbor.to : neighbor;
      if (!visited.has(id)) dfs(id);
    }
  }
  dfs(start);
  return steps;
}

function dijkstraSteps(adj, start, nodeCount) {
  const steps = [];
  const distances = {};
  const visited = new Set();
  for (let i = 0; i < nodeCount; i++) distances[i] = Infinity;
  distances[start] = 0;
  for (let i = 0; i < nodeCount; i++) {
    let u = -1;
    for (let v = 0; v < nodeCount; v++) {
      if (!visited.has(v) && (u === -1 || distances[v] < distances[u])) u = v;
    }
    if (u === -1 || distances[u] === Infinity) break;
    visited.add(u);
    steps.push({ current: u, visited: new Set(visited), distances: { ...distances } });
    for (const { to, weight } of (adj[u] || [])) {
      if (!visited.has(to) && distances[u] + weight < distances[to]) {
        distances[to] = distances[u] + weight;
      }
    }
  }
  return steps;
}

function hasCycleDirected(nodeCount, adj) {
  const WHITE = 0, GRAY = 1, BLACK = 2;
  const color = Array(nodeCount).fill(WHITE);
  function dfs(u) {
    color[u] = GRAY;
    for (const neighbor of (adj[u] || [])) {
      const v = typeof neighbor === 'object' ? neighbor.to : neighbor;
      if (color[v] === GRAY) return true;
      if (color[v] === WHITE && dfs(v)) return true;
    }
    color[u] = BLACK;
    return false;
  }
  for (let i = 0; i < nodeCount; i++) {
    if (color[i] === WHITE && dfs(i)) return true;
  }
  return false;
}

function topologicalSort(nodeCount, adj) {
  const inDegree = Array(nodeCount).fill(0);
  for (let u = 0; u < nodeCount; u++) {
    for (const neighbor of (adj[u] || [])) {
      const v = typeof neighbor === 'object' ? neighbor.to : neighbor;
      inDegree[v]++;
    }
  }
  const queue = [];
  for (let i = 0; i < nodeCount; i++) { if (inDegree[i] === 0) queue.push(i); }
  const order = [];
  while (queue.length > 0) {
    const u = queue.shift();
    order.push(u);
    for (const neighbor of (adj[u] || [])) {
      const v = typeof neighbor === 'object' ? neighbor.to : neighbor;
      inDegree[v]--;
      if (inDegree[v] === 0) queue.push(v);
    }
  }
  return order.length === nodeCount ? order : null;
}

// ─── buildAdjacencyList tests ─────────────────────────────────────────────────
describe('buildAdjacencyList', () => {
  test('creates empty list for zero nodes', () => {
    const adj = buildAdjacencyList(0, [], false);
    assert.deepStrictEqual(adj, {});
  });

  test('populates all nodes with empty arrays initially', () => {
    const adj = buildAdjacencyList(3, [], false);
    assert.deepStrictEqual(adj, { 0: [], 1: [], 2: [] });
  });

  test('adds edges for undirected graph', () => {
    const adj = buildAdjacencyList(3, [{ from: 0, to: 1 }, { from: 1, to: 2 }], false);
    assert.ok(adj[0].includes(1));
    assert.ok(adj[1].includes(0));
    assert.ok(adj[1].includes(2));
    assert.ok(adj[2].includes(1));
  });

  test('adds edges only forward for directed graph', () => {
    const adj = buildAdjacencyList(3, [{ from: 0, to: 1 }, { from: 1, to: 2 }], true);
    assert.ok(adj[0].includes(1));
    assert.ok(!adj[1].includes(0));
  });

  test('uses {to, weight} for weighted undirected graph', () => {
    const adj = buildAdjacencyList(2, [{ from: 0, to: 1, weight: 5 }], false, true);
    assert.deepStrictEqual(adj[0], [{ to: 1, weight: 5 }]);
    assert.deepStrictEqual(adj[1], [{ to: 0, weight: 5 }]);
  });

  test('uses plain node ids for unweighted graph', () => {
    const adj = buildAdjacencyList(2, [{ from: 0, to: 1 }], false, false);
    assert.strictEqual(typeof adj[0][0], 'number');
    assert.strictEqual(adj[0][0], 1);
  });
});

// ─── buildAdjacencyMatrix tests ────────────────────────────────────────────────
describe('buildAdjacencyMatrix', () => {
  test('initializes n×n matrix with zeros', () => {
    const mat = buildAdjacencyMatrix(3, [], false);
    assert.strictEqual(mat.length, 3);
    assert.strictEqual(mat[0].length, 3);
    assert.strictEqual(mat[2][1], 0);
  });

  test('sets 1 for undirected edge', () => {
    const mat = buildAdjacencyMatrix(2, [{ from: 0, to: 1 }], false);
    assert.strictEqual(mat[0][1], 1);
    assert.strictEqual(mat[1][0], 1);
  });

  test('sets 1 only forward for directed edge', () => {
    const mat = buildAdjacencyMatrix(2, [{ from: 0, to: 1 }], true);
    assert.strictEqual(mat[0][1], 1);
    assert.strictEqual(mat[1][0], 0);
  });

  test('uses weight values for weighted graph', () => {
    const mat = buildAdjacencyMatrix(2, [{ from: 0, to: 1, weight: 7 }], false, true);
    assert.strictEqual(mat[0][1], 7);
    assert.strictEqual(mat[1][0], 7);
  });
});

// ─── bfsSteps tests ───────────────────────────────────────────────────────────
describe('bfsSteps', () => {
  test('visits single node', () => {
    const adj = { 0: [] };
    const steps = bfsSteps(adj, 0);
    assert.strictEqual(steps.length, 1);
    assert.strictEqual(steps[0].current, 0);
    assert.ok(steps[0].visited.has(0));
  });

  test('visits nodes in BFS order', () => {
    const adj = buildAdjacencyList(4, [{ from: 0, to: 1 }, { from: 0, to: 2 }, { from: 1, to: 3 }], false);
    const steps = bfsSteps(adj, 0);
    const visitedOrder = steps.map(s => s.current);
    assert.strictEqual(visitedOrder[0], 0);
    assert.ok([1, 2].includes(visitedOrder[1]));
  });

  test('queue grows as neighbors are discovered', () => {
    const adj = buildAdjacencyList(3, [{ from: 0, to: 1 }, { from: 0, to: 2 }], false);
    const steps = bfsSteps(adj, 0);
    // First step: node 0 dequeued, queue was [start] before dequeue => empty after
    // After processing neighbors, subsequent steps have queue entries
    assert.ok(steps.length >= 3);
    // Verify final visited set is correct
    const last = steps[steps.length - 1];
    assert.ok(last.visited.has(0));
    assert.ok(last.visited.has(1));
    assert.ok(last.visited.has(2));
  });

  test('handles disconnected components (partial visit)', () => {
    const adj = buildAdjacencyList(4, [{ from: 0, to: 1 }], false);
    const steps = bfsSteps(adj, 0);
    const visited = steps[steps.length - 1].visited;
    assert.ok(visited.has(0));
    assert.ok(visited.has(1));
    assert.ok(!visited.has(2));
    assert.ok(!visited.has(3));
  });
});

// ─── dfsSteps tests ───────────────────────────────────────────────────────────
describe('dfsSteps', () => {
  test('visits single node', () => {
    const adj = { 0: [] };
    const steps = dfsSteps(adj, 0);
    assert.strictEqual(steps.length, 1);
    assert.strictEqual(steps[0].current, 0);
  });

  test('visits all reachable nodes', () => {
    const adj = buildAdjacencyList(3, [{ from: 0, to: 1 }, { from: 1, to: 2 }], false);
    const steps = dfsSteps(adj, 0);
    const visited = steps[steps.length - 1].visited;
    assert.ok(visited.has(0));
    assert.ok(visited.has(1));
    assert.ok(visited.has(2));
  });

  test('each step records visited set snapshot', () => {
    const adj = buildAdjacencyList(2, [{ from: 0, to: 1 }], false);
    const steps = dfsSteps(adj, 0);
    assert.ok(steps[0].visited.has(0));
    assert.ok(steps[1].visited.has(1));
  });
});

// ─── hasCycleDirected tests ───────────────────────────────────────────────────
describe('hasCycleDirected', () => {
  test('returns false for empty graph', () => {
    const adj = buildAdjacencyList(0, [], true);
    assert.strictEqual(hasCycleDirected(0, adj), false);
  });

  test('returns false for single node with no edges', () => {
    const adj = { 0: [] };
    assert.strictEqual(hasCycleDirected(1, adj), false);
  });

  test('returns false for simple DAG (0->1->2)', () => {
    const adj = buildAdjacencyList(3, [{ from: 0, to: 1 }, { from: 1, to: 2 }], true);
    assert.strictEqual(hasCycleDirected(3, adj), false);
  });

  test('returns true for self-loop', () => {
    const adj = buildAdjacencyList(1, [{ from: 0, to: 0 }], true);
    assert.strictEqual(hasCycleDirected(1, adj), true);
  });

  test('returns true for cycle 0->1->2->0', () => {
    const adj = buildAdjacencyList(3, [{ from: 0, to: 1 }, { from: 1, to: 2 }, { from: 2, to: 0 }], true);
    assert.strictEqual(hasCycleDirected(3, adj), true);
  });

  test('returns true for two-node cycle 0->1->0', () => {
    const adj = buildAdjacencyList(2, [{ from: 0, to: 1 }, { from: 1, to: 0 }], true);
    assert.strictEqual(hasCycleDirected(2, adj), true);
  });

  test('handles disconnected components with cycle in one component', () => {
    const adj = buildAdjacencyList(4, [{ from: 0, to: 1 }, { from: 2, to: 3 }, { from: 3, to: 2 }], true);
    assert.strictEqual(hasCycleDirected(4, adj), true);
  });
});

// ─── topologicalSort tests ────────────────────────────────────────────────────
describe('topologicalSort', () => {
  test('returns empty array for 0 nodes', () => {
    const adj = buildAdjacencyList(0, [], true);
    const result = topologicalSort(0, adj);
    assert.deepStrictEqual(result, []);
  });

  test('returns correct order for linear DAG 0->1->2', () => {
    const adj = buildAdjacencyList(3, [{ from: 0, to: 1 }, { from: 1, to: 2 }], true);
    const result = topologicalSort(3, adj);
    assert.ok(result !== null);
    assert.strictEqual(result.indexOf(0) < result.indexOf(1), true);
    assert.strictEqual(result.indexOf(1) < result.indexOf(2), true);
  });

  test('returns correct order for branching DAG', () => {
    const adj = buildAdjacencyList(4, [{ from: 0, to: 1 }, { from: 0, to: 2 }, { from: 1, to: 3 }, { from: 2, to: 3 }], true);
    const result = topologicalSort(4, adj);
    assert.ok(result !== null);
    assert.strictEqual(result.indexOf(0) < result.indexOf(1), true);
    assert.strictEqual(result.indexOf(0) < result.indexOf(2), true);
    assert.ok(result.indexOf(1) < result.indexOf(3) || result.indexOf(2) < result.indexOf(3));
  });

  test('returns null when cycle exists (0->1->2->0)', () => {
    const adj = buildAdjacencyList(3, [{ from: 0, to: 1 }, { from: 1, to: 2 }, { from: 2, to: 0 }], true);
    const result = topologicalSort(3, adj);
    assert.strictEqual(result, null);
  });

  test('returns null for self-loop', () => {
    const adj = buildAdjacencyList(1, [{ from: 0, to: 0 }], true);
    const result = topologicalSort(1, adj);
    assert.strictEqual(result, null);
  });
});

// ─── dijkstraSteps tests ──────────────────────────────────────────────────────
describe('dijkstraSteps', () => {
  test('sets start node distance to 0', () => {
    const adj = buildAdjacencyList(1, [], true, true);
    const steps = dijkstraSteps(adj, 0, 1);
    assert.strictEqual(steps[0].distances[0], 0);
  });

  test('marks start as visited in first step', () => {
    const adj = buildAdjacencyList(1, [], true, true);
    const steps = dijkstraSteps(adj, 0, 1);
    assert.ok(steps[0].visited.has(0));
  });

  test('unreachable nodes stay at Infinity', () => {
    const adj = buildAdjacencyList(3, [{ from: 0, to: 1 }], true, true);
    const steps = dijkstraSteps(adj, 0, 3);
    const last = steps[steps.length - 1];
    assert.strictEqual(last.distances[2], Infinity);
  });

  test('computes correct shortest path in simple graph', () => {
    const adj = buildAdjacencyList(2, [{ from: 0, to: 1, weight: 5 }], true, true);
    const steps = dijkstraSteps(adj, 0, 2);
    const last = steps[steps.length - 1];
    assert.strictEqual(last.distances[0], 0);
    assert.strictEqual(last.distances[1], 5);
  });

  test('chooses shorter path when multiple edges exist', () => {
    const adj = buildAdjacencyList(3, [{ from: 0, to: 1, weight: 10 }, { from: 0, to: 2, weight: 1 }, { from: 2, to: 1, weight: 2 }], true, true);
    const steps = dijkstraSteps(adj, 0, 3);
    const last = steps[steps.length - 1];
    // 0 -> 2 -> 1 = 3, vs 0 -> 1 = 10
    assert.strictEqual(last.distances[1], 3);
  });
});
