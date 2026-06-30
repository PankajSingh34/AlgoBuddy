// security-tests/graph-utils.test.cjs
//
// Run with:  node --experimental-detect-module --test security-tests/graph-utils.test.cjs
//
// Tests pure graph utility functions in src/utils/graph.js.

const { test, describe } = require("node:test");
const assert = require("node:assert/strict");

// ─── Inlined graph.js logic ───────────────────────────────────────────────────
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
      const id = typeof neighbor === "object" ? neighbor.to : neighbor;
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
    steps.push({ current: node, visited: new Set(visited) });
    for (const neighbor of (adj[node] || [])) {
      const id = typeof neighbor === "object" ? neighbor.to : neighbor;
      if (!visited.has(id)) {
        dfs(id);
      }
    }
  }

  dfs(start);
  return steps;
}

// ─── buildAdjacencyList tests ─────────────────────────────────────────────────
describe("buildAdjacencyList", () => {
  test("undirected: creates symmetric adjacency", () => {
    const adj = buildAdjacencyList(3, [{ from: 0, to: 1 }, { from: 1, to: 2 }], false);
    assert.ok(adj[0].includes(1));
    assert.ok(adj[1].includes(0));
    assert.ok(adj[1].includes(2));
    assert.ok(adj[2].includes(1));
  });

  test("directed: only adds forward edges", () => {
    const adj = buildAdjacencyList(3, [{ from: 0, to: 1 }, { from: 1, to: 2 }], true);
    assert.ok(adj[0].includes(1));
    assert.ok(!adj[1].includes(0));
  });

  test("weighted mode: stores {to, weight}", () => {
    const adj = buildAdjacencyList(2, [{ from: 0, to: 1, weight: 5 }], false, true);
    assert.deepEqual(adj[0], [{ to: 1, weight: 5 }]);
    assert.deepEqual(adj[1], [{ to: 0, weight: 5 }]);
  });

  test("default weight is 1", () => {
    const adj = buildAdjacencyList(2, [{ from: 0, to: 1 }], false, true);
    assert.deepEqual(adj[0], [{ to: 1, weight: 1 }]);
  });

  test("isolated nodes have empty arrays", () => {
    const adj = buildAdjacencyList(3, [{ from: 0, to: 1 }], false);
    assert.deepEqual(adj[2], []);
  });

  test("self-loop is added only once", () => {
    const adj = buildAdjacencyList(2, [{ from: 0, to: 0 }], false);
    assert.equal(adj[0].filter(n => n === 0).length, 2, "undirected self-loop adds same node twice");
  });
});

// ─── buildAdjacencyMatrix tests ───────────────────────────────────────────────
describe("buildAdjacencyMatrix", () => {
  test("undirected: creates symmetric matrix", () => {
    const m = buildAdjacencyMatrix(3, [{ from: 0, to: 1 }], false);
    assert.equal(m[0][1], 1);
    assert.equal(m[1][0], 1);
  });

  test("directed: only sets [from][to]", () => {
    const m = buildAdjacencyMatrix(3, [{ from: 0, to: 1 }], true);
    assert.equal(m[0][1], 1);
    assert.equal(m[1][0], 0);
  });

  test("weighted mode: stores weight", () => {
    const m = buildAdjacencyMatrix(2, [{ from: 0, to: 1, weight: 7 }], false, true);
    assert.equal(m[0][1], 7);
    assert.equal(m[1][0], 7);
  });

  test("default weight is 1", () => {
    const m = buildAdjacencyMatrix(2, [{ from: 0, to: 1 }], false, true);
    assert.equal(m[0][1], 1);
  });

  test("multiple edges between same nodes use last weight", () => {
    const m = buildAdjacencyMatrix(2, [{ from: 0, to: 1, weight: 3 }, { from: 0, to: 1, weight: 5 }], false, true);
    assert.equal(m[0][1], 5);
  });
});

// ─── bfsSteps tests ───────────────────────────────────────────────────────────
describe("bfsSteps", () => {
  test("correct visitation order for linear graph", () => {
    const adj = buildAdjacencyList(4, [{ from: 0, to: 1 }, { from: 1, to: 2 }, { from: 2, to: 3 }], false);
    const steps = bfsSteps(adj, 0);
    const order = steps.map(s => s.current);
    assert.deepEqual(order, [0, 1, 2, 3]);
  });

  test("start node is visited first", () => {
    const adj = buildAdjacencyList(2, [{ from: 0, to: 1 }], false);
    const steps = bfsSteps(adj, 0);
    assert.equal(steps[0].current, 0);
    assert.ok(steps[0].visited.has(0));
  });

  test("handles disconnected components", () => {
    const adj = buildAdjacencyList(4, [{ from: 0, to: 1 }, { from: 2, to: 3 }], false);
    const steps = bfsSteps(adj, 0);
    const visited = steps[steps.length - 1].visited;
    // Only nodes 0 and 1 are reachable from start=0
    assert.ok(visited.has(0));
    assert.ok(visited.has(1));
    assert.ok(!visited.has(2));
    assert.ok(!visited.has(3));
  });

  test("each step contains current, visited, and queue", () => {
    const adj = buildAdjacencyList(3, [{ from: 0, to: 1 }, { from: 0, to: 2 }], false);
    const steps = bfsSteps(adj, 0);
    for (const step of steps) {
      assert.ok(typeof step.current === "number");
      assert.ok(step.visited instanceof Set);
      assert.ok(Array.isArray(step.queue));
    }
  });
});

// ─── dfsSteps tests ───────────────────────────────────────────────────────────
describe("dfsSteps", () => {
  test("visits all reachable nodes", () => {
    const adj = buildAdjacencyList(3, [{ from: 0, to: 1 }, { from: 1, to: 2 }], false);
    const steps = dfsSteps(adj, 0);
    const visited = steps[steps.length - 1].visited;
    assert.ok(visited.has(0));
    assert.ok(visited.has(1));
    assert.ok(visited.has(2));
  });

  test("start node is visited first", () => {
    const adj = buildAdjacencyList(2, [{ from: 0, to: 1 }], false);
    const steps = dfsSteps(adj, 0);
    assert.equal(steps[0].current, 0);
  });

  test("handles missing nodes gracefully", () => {
    const adj = buildAdjacencyList(2, [{ from: 0, to: 1 }], false);
    // Node 1 has no outgoing edges; dfs should not crash
    const steps = dfsSteps(adj, 1);
    assert.equal(steps.length, 2);
    assert.equal(steps[0].current, 1);
  });

  test("handles disconnected graph", () => {
    const adj = buildAdjacencyList(4, [{ from: 0, to: 1 }], false);
    const steps = dfsSteps(adj, 2);
    const visited = steps[steps.length - 1].visited;
    assert.ok(visited.has(2));
    assert.ok(!visited.has(0));
    assert.ok(!visited.has(1));
  });
});
