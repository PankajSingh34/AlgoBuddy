const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

// Inline graph utilities from src/utils/graph.js

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
  const visited = new Set([start]);
  const queue = [start];

  steps.push({ visited: new Set(visited), current: start, queue: [...queue] });

  while (queue.length > 0) {
    const u = queue.shift();
    for (const neighbor of (adj[u] || [])) {
      const v = typeof neighbor === "object" ? neighbor.to : neighbor;
      if (!visited.has(v)) {
        visited.add(v);
        queue.push(v);
        steps.push({ visited: new Set(visited), current: v, queue: [...queue] });
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

function hasCycleDirected(nodeCount, adj) {
  const WHITE = 0, GRAY = 1, BLACK = 2;
  const color = Array(nodeCount).fill(WHITE);

  function dfs(u) {
    color[u] = GRAY;
    for (const neighbor of (adj[u] || [])) {
      const v = typeof neighbor === "object" ? neighbor.to : neighbor;
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
      const v = typeof neighbor === "object" ? neighbor.to : neighbor;
      inDegree[v]++;
    }
  }

  const queue = [];
  for (let i = 0; i < nodeCount; i++) {
    if (inDegree[i] === 0) queue.push(i);
  }

  const order = [];
  while (queue.length > 0) {
    const u = queue.shift();
    order.push(u);
    for (const neighbor of (adj[u] || [])) {
      const v = typeof neighbor === "object" ? neighbor.to : neighbor;
      inDegree[v]--;
      if (inDegree[v] === 0) queue.push(v);
    }
  }

  return order.length === nodeCount ? order : null;
}

// ---- Tests ----

describe('buildAdjacencyList', () => {
  it('builds empty graph with no edges', () => {
    const adj = buildAdjacencyList(3, [], false);
    assert.deepEqual(adj, { 0: [], 1: [], 2: [] });
  });

  it('adds edges for undirected graph', () => {
    const adj = buildAdjacencyList(3, [{ from: 0, to: 1 }, { from: 1, to: 2 }], false);
    assert.ok(adj[0].includes(1));
    assert.ok(adj[1].includes(0));
    assert.ok(adj[1].includes(2));
    assert.ok(adj[2].includes(1));
  });

  it('adds edges for directed graph', () => {
    const adj = buildAdjacencyList(3, [{ from: 0, to: 1 }, { from: 1, to: 2 }], true);
    assert.ok(adj[0].includes(1));
    assert.ok(!adj[1].includes(0));
    assert.ok(adj[1].includes(2));
    assert.ok(!adj[2].includes(1));
  });

  it('adds weighted edges when isWeighted=true', () => {
    const adj = buildAdjacencyList(2, [{ from: 0, to: 1, weight: 5 }], false, true);
    assert.deepEqual(adj[0], [{ to: 1, weight: 5 }]);
    assert.deepEqual(adj[1], [{ to: 0, weight: 5 }]);
  });

  it('defaults weight to 1 for unweighted graph', () => {
    const adj = buildAdjacencyList(2, [{ from: 0, to: 1 }], false, false);
    assert.equal(adj[0][0], 1);
    assert.equal(adj[1][0], 0);
  });
});

describe('buildAdjacencyMatrix', () => {
  it('initializes matrix with zeros', () => {
    const m = buildAdjacencyMatrix(3, [], false);
    assert.equal(m.length, 3);
    assert.equal(m[0].length, 3);
    assert.equal(m[0][0], 0);
  });

  it('sets edges correctly for undirected graph', () => {
    const m = buildAdjacencyMatrix(3, [{ from: 0, to: 1 }], false);
    assert.equal(m[0][1], 1);
    assert.equal(m[1][0], 1);
    assert.equal(m[0][0], 0);
  });

  it('sets edges correctly for directed graph', () => {
    const m = buildAdjacencyMatrix(3, [{ from: 0, to: 1 }], true);
    assert.equal(m[0][1], 1);
    assert.equal(m[1][0], 0);
  });

  it('sets weighted edges correctly', () => {
    const m = buildAdjacencyMatrix(2, [{ from: 0, to: 1, weight: 5 }], false, true);
    assert.equal(m[0][1], 5);
    assert.equal(m[1][0], 5);
  });
});

describe('bfsSteps', () => {
  it('starts with the start node', () => {
    const adj = buildAdjacencyList(3, [{ from: 0, to: 1 }, { from: 1, to: 2 }], false);
    const steps = bfsSteps(adj, 0);
    assert.equal(steps[0].current, 0);
    assert.ok(steps[0].visited.has(0));
  });

  it('visits all reachable nodes', () => {
    const adj = buildAdjacencyList(4, [{ from: 0, to: 1 }, { from: 1, to: 2 }, { from: 2, to: 3 }], false);
    const steps = bfsSteps(adj, 0);
    const last = steps[steps.length - 1];
    assert.ok(last.visited.has(3));
  });

  it('queue grows and shrinks during traversal', () => {
    const adj = buildAdjacencyList(4, [{ from: 0, to: 1 }, { from: 0, to: 2 }, { from: 2, to: 3 }], false);
    const steps = bfsSteps(adj, 0);
    assert.ok(steps.some(s => s.queue.length > 1));
  });
});

describe('primSteps', () => {
  it('builds MST for a simple connected graph', () => {
    // 0-1 (1), 1-2 (2), 0-2 (3) -> MST uses edges 1 and 2 (total 3)
    const adj = buildAdjacencyList(3, [{ from: 0, to: 1, weight: 1 }, { from: 1, to: 2, weight: 2 }, { from: 0, to: 2, weight: 3 }], false, true);
    const steps = primSteps(adj, 0, 3);
    const last = steps[steps.length - 1];
    const totalWeight = last.mstEdges.reduce((s, e) => s + e.weight, 0);
    assert.equal(last.mstEdges.length, 2);
    assert.equal(totalWeight, 3);
  });

  it('handles disconnected graph gracefully', () => {
    const adj = buildAdjacencyList(4, [{ from: 0, to: 1, weight: 1 }], false, true);
    const steps = primSteps(adj, 0, 4);
    const last = steps[steps.length - 1];
    assert.ok(last.visited.size <= 2);
  });
});

describe('hasCycleDirected', () => {
  it('returns false for DAG', () => {
    const adj = buildAdjacencyList(3, [{ from: 0, to: 1 }, { from: 1, to: 2 }], true);
    assert.equal(hasCycleDirected(3, adj), false);
  });

  it('returns true when cycle exists', () => {
    const adj = buildAdjacencyList(3, [{ from: 0, to: 1 }, { from: 1, to: 2 }, { from: 2, to: 0 }], true);
    assert.equal(hasCycleDirected(3, adj), true);
  });

  it('handles self-loop as cycle', () => {
    const adj = buildAdjacencyList(1, [{ from: 0, to: 0 }], true);
    assert.equal(hasCycleDirected(1, adj), true);
  });

  it('returns false for empty graph', () => {
    const adj = buildAdjacencyList(0, [], true);
    assert.equal(hasCycleDirected(0, adj), false);
  });
});

describe('topologicalSort', () => {
  it('returns correct order for DAG', () => {
    const adj = buildAdjacencyList(3, [{ from: 0, to: 1 }, { from: 1, to: 2 }], true);
    const order = topologicalSort(3, adj);
    assert.ok(order !== null);
    assert.equal(order.length, 3);
    assert.ok(order.indexOf(0) < order.indexOf(1));
    assert.ok(order.indexOf(1) < order.indexOf(2));
  });

  it('returns null when cycle exists', () => {
    const adj = buildAdjacencyList(3, [{ from: 0, to: 1 }, { from: 1, to: 2 }, { from: 2, to: 0 }], true);
    assert.equal(topologicalSort(3, adj), null);
  });

  it('handles multiple sources', () => {
    const adj = buildAdjacencyList(3, [{ from: 0, to: 2 }, { from: 1, to: 2 }], true);
    const order = topologicalSort(3, adj);
    assert.ok(order !== null);
    assert.ok(order.indexOf(2) > order.indexOf(0));
    assert.ok(order.indexOf(2) > order.indexOf(1));
  });

  it('returns null for disconnected graph with cycle in one component', () => {
    // Node 0->1, node 2->3->2 (cycle)
    const adj = { 0: [1], 1: [], 2: [3], 3: [2] };
    assert.equal(topologicalSort(4, adj), null);
  });

  it('returns all nodes for empty graph', () => {
    const adj = buildAdjacencyList(3, [], true);
    const order = topologicalSort(3, adj);
    assert.ok(order !== null);
    assert.equal(order.length, 3);
  });
});
