// security-tests/graphUtility-edge.test.cjs
//
// Run with: node --experimental-detect-module --test security-tests/graphUtility-edge.test.cjs

const { describe, test } = require("node:test");
const assert = require("node:assert/strict");

// Inlined source from src/utils/graph.js
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
    steps.push({ current: node, visited: new Set(visited), stack: [] });
    for (const neighbor of (adj[node] || [])) {
      const id = typeof neighbor === "object" ? neighbor.to : neighbor;
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

function primSteps(adj, start, nodeCount) {
  const steps = [];
  const visited = new Set();
  const mstEdges = [];

  visited.add(start);

  while (visited.size < nodeCount) {
    let bestEdge = null;
    let bestWeight = Infinity;

    for (const u of visited) {
      for (const { to, weight } of (adj[u] || [])) {
        if (!visited.has(to) && weight < bestWeight) {
          bestWeight = weight;
          bestEdge = { from: u, to, weight };
        }
      }
    }

    if (!bestEdge) break;

    visited.add(bestEdge.to);
    mstEdges.push(bestEdge);
    steps.push({ current: bestEdge.to, visited: new Set(visited), mstEdges: [...mstEdges] });
  }
  return steps;
}

// ── Tests ────────────────────────────────────────────────────────────

describe("buildAdjacencyList — edge cases", () => {
  test("empty edges array returns only empty adjacency lists", () => {
    const adj = buildAdjacencyList(3, [], true);
    assert.deepStrictEqual(adj, { 0: [], 1: [], 2: [] });
  });

  test("single-node with no edges", () => {
    const adj = buildAdjacencyList(1, [], false);
    assert.deepStrictEqual(adj, { 0: [] });
  });

  test("self-loop edge {from:0, to:0} adds only one direction in directed graph", () => {
    const adj = buildAdjacencyList(1, [{ from: 0, to: 0 }], true);
    assert.deepStrictEqual(adj, { 0: [0] });
  });

  test("self-loop in undirected graph adds node twice (current behavior)", () => {
    // Note: source pushes to both ends of undirected edge even for self-loops.
    // This is a pre-existing quirk of the implementation.
    const adj = buildAdjacencyList(1, [{ from: 0, to: 0 }], false);
    assert.deepStrictEqual(adj, { 0: [0, 0] });
  });

  test("disconnected nodes have empty adjacency lists for unconnected nodes", () => {
    const adj = buildAdjacencyList(3, [{ from: 0, to: 1 }], true);
    assert.deepStrictEqual(adj[0], [1]);
    assert.deepStrictEqual(adj[1], []);
    assert.deepStrictEqual(adj[2], []);
  });
});

describe("buildAdjacencyMatrix — edge cases", () => {
  test("empty edges returns zero matrix", () => {
    const m = buildAdjacencyMatrix(3, [], true);
    assert.deepStrictEqual(m, [[0, 0, 0], [0, 0, 0], [0, 0, 0]]);
  });

  test("disconnected nodes have zeros at unconnected positions", () => {
    const m = buildAdjacencyMatrix(3, [{ from: 0, to: 1 }], true);
    assert.equal(m[0][1], 1);
    assert.equal(m[1][0], 0);
    assert.equal(m[2][0], 0);
    assert.equal(m[2][1], 0);
  });
});

describe("bfsSteps — edge cases", () => {
  test("single node graph", () => {
    const adj = { 0: [] };
    const steps = bfsSteps(adj, 0);
    assert.equal(steps.length, 1);
    assert.equal(steps[0].current, 0);
    assert.deepStrictEqual([...steps[0].visited], [0]);
  });

  test("disconnected graph visits only reachable component", () => {
    const adj = { 0: [1], 1: [], 2: [3], 3: [] };
    const steps = bfsSteps(adj, 0);
    const visitedNodes = [...new Set(steps.map((s) => s.current))];
    assert.deepStrictEqual(visitedNodes, [0, 1]);
  });
});

describe("dfsSteps — edge cases", () => {
  test("single node graph", () => {
    const adj = { 0: [] };
    const steps = dfsSteps(adj, 0);
    assert.equal(steps.length, 1);
    assert.equal(steps[0].current, 0);
    assert.deepStrictEqual([...steps[0].visited], [0]);
  });

  test("disconnected graph visits only reachable component", () => {
    const adj = { 0: [1], 1: [], 2: [3], 3: [] };
    const steps = dfsSteps(adj, 0);
    const visitedNodes = [...new Set(steps.map((s) => s.current))];
    assert.deepStrictEqual(visitedNodes, [0, 1]);
  });
});

describe("dijkstraSteps — edge cases", () => {
  test("single node with no edges", () => {
    const adj = { 0: [] };
    const steps = dijkstraSteps(adj, 0, 1);
    assert.equal(steps.length, 1);
    assert.equal(steps[0].current, 0);
    assert.equal(steps[0].distances[0], 0);
  });

  test("unreachable destination has Infinity distance", () => {
    const adj = buildAdjacencyList(3, [{ from: 0, to: 1 }], true, true);
    const steps = dijkstraSteps(adj, 0, 3);
    assert.equal(steps.at(-1).distances[2], Infinity);
  });

  test("all edges have equal weight converges correctly", () => {
    const adj = buildAdjacencyList(
      3,
      [
        { from: 0, to: 1, weight: 1 },
        { from: 1, to: 2, weight: 1 },
      ],
      true,
      true,
    );
    const steps = dijkstraSteps(adj, 0, 3);
    assert.equal(steps.at(-1).distances[2], 2);
  });
});

describe("primSteps — edge cases", () => {
  test("single node with no edges produces zero steps", () => {
    // No edges to process, so the while loop (visited.size < nodeCount)
    // terminates immediately without pushing any steps.
    const adj = { 0: [] };
    const steps = primSteps(adj, 0, 1);
    assert.equal(steps.length, 0);
  });

  test("disconnected graph terminates early with no more edges to add", () => {
    // Node 0 connected to 1, but node 2 is isolated
    const adj = { 0: [{ to: 1, weight: 1 }], 1: [], 2: [] };
    const steps = primSteps(adj, 0, 3);
    // Should add only edge 0-1 then stop (no more edges to 2)
    assert.ok(steps.length >= 1);
    const allVisited = [...steps.at(-1).visited];
    assert.ok(allVisited.length <= 2); // node 2 never reachable
  });
});
