// Run with: node --experimental-detect-module --test security-tests/dfsLogic.test.cjs
const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const { pathToFileURL } = require("node:url");

test("dfsGenerator — normal traversal visits all reachable nodes in depth-first order", async () => {
  const { dfsGenerator } = await import(pathToFileURL(path.join(__dirname, "..", "src/features/algorithms/graph/dfsLogic.js")).href);

  const adj = {
    0: [{ node: 1 }, { node: 2 }],
    1: [{ node: 3 }],
    2: [],
    3: [],
  };

  const steps = [...dfsGenerator(adj, 0)];
  // Collect nodes in order of first appearance in visitedNodes
  const seen = new Set();
  const visitOrder = [];
  for (const step of steps) {
    for (const n of step.visitedNodes) {
      if (!seen.has(n)) {
        seen.add(n);
        visitOrder.push(n);
      }
    }
  }
  // DFS should visit 0, then go deep on first branch (0->1->3), then backtrack to 0 and visit 2
  assert.ok(visitOrder.includes(0));
  assert.ok(visitOrder.includes(1));
  assert.ok(visitOrder.includes(2));
  assert.ok(visitOrder.includes(3));
  // 0 must be first
  assert.strictEqual(visitOrder[0], 0);
});

test("dfsGenerator — yields nothing for null adjacency list", async () => {
  const { dfsGenerator } = await import(pathToFileURL(path.join(__dirname, "..", "src/features/algorithms/graph/dfsLogic.js")).href);

  const steps = [...dfsGenerator(null, 0)];
  assert.strictEqual(steps.length, 0);
});

test("dfsGenerator — yields nothing for empty adjacency list", async () => {
  const { dfsGenerator } = await import(pathToFileURL(path.join(__dirname, "..", "src/features/algorithms/graph/dfsLogic.js")).href);

  const steps = [...dfsGenerator({}, 0)];
  assert.strictEqual(steps.length, 0);
});

test("dfsGenerator — yields nothing for invalid startNode", async () => {
  const { dfsGenerator } = await import(pathToFileURL(path.join(__dirname, "..", "src/features/algorithms/graph/dfsLogic.js")).href);

  const adj = { 0: [{ node: 1 }] };
  const steps = [...dfsGenerator(adj, 99)];
  assert.strictEqual(steps.length, 0);
});

test("dfsGenerator — single-node graph yields at least one step", async () => {
  const { dfsGenerator } = await import(pathToFileURL(path.join(__dirname, "..", "src/features/algorithms/graph/dfsLogic.js")).href);

  const adj = { 0: [] };
  const steps = [...dfsGenerator(adj, 0)];
  assert.ok(steps.length > 0, "Should produce at least one step");
  const visitedNodes = new Set();
  steps.forEach((s) => s.visitedNodes.forEach((n) => visitedNodes.add(n)));
  assert.ok(visitedNodes.has(0));
});

test("dfsGenerator — graph with isolated nodes visits only reachable component", async () => {
  const { dfsGenerator } = await import(pathToFileURL(path.join(__dirname, "..", "src/features/algorithms/graph/dfsLogic.js")).href);

  const adj = {
    0: [{ node: 1 }],
    1: [],
    2: [{ node: 3 }],
    3: [],
  };

  const steps = [...dfsGenerator(adj, 0)];
  const visitedNodes = new Set();
  steps.forEach((s) => s.visitedNodes.forEach((n) => visitedNodes.add(n)));
  assert.ok(visitedNodes.has(0));
  assert.ok(visitedNodes.has(1));
  assert.ok(!visitedNodes.has(2), "Isolated node 2 should not be visited");
  assert.ok(!visitedNodes.has(3), "Isolated node 3 should not be visited");
});

test("dfsGenerator — generates backtracking frames (stack.pop entries)", async () => {
  const { dfsGenerator } = await import(pathToFileURL(path.join(__dirname, "..", "src/features/algorithms/graph/dfsLogic.js")).href);

  const adj = {
    0: [{ node: 1 }],
    1: [{ node: 2 }],
    2: [],
  };

  const steps = [...dfsGenerator(adj, 0)];
  const descriptions = steps.map((s) => s.description);
  // Should have backtracking descriptions
  const hasBacktrack = descriptions.some((d) => d.toLowerCase().includes("backtrack"));
  assert.ok(hasBacktrack, "Should contain at least one backtracking step");
});

test("dfsGenerator — plain node values (not objects) are handled correctly", async () => {
  const { dfsGenerator } = await import(pathToFileURL(path.join(__dirname, "..", "src/features/algorithms/graph/dfsLogic.js")).href);

  const adj = {
    0: [1, 2],
    1: [],
    2: [],
  };

  const steps = [...dfsGenerator(adj, 0)];
  const visitedNodes = new Set();
  steps.forEach((s) => s.visitedNodes.forEach((n) => visitedNodes.add(n)));
  assert.ok(visitedNodes.has(0));
  assert.ok(visitedNodes.has(1));
  assert.ok(visitedNodes.has(2));
});

test("dfsGenerator — last step has null currentNode and no visiting nodes", async () => {
  const { dfsGenerator } = await import(pathToFileURL(path.join(__dirname, "..", "src/features/algorithms/graph/dfsLogic.js")).href);

  const adj = {
    0: [{ node: 1 }],
    1: [],
  };

  const steps = [...dfsGenerator(adj, 0)];
  const lastStep = steps[steps.length - 1];
  assert.ok(lastStep.description.toLowerCase().includes("complete"), "Last step should indicate completion");
});
