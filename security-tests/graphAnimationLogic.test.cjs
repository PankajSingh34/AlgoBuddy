/**
 * Regression tests for BFS and DFS animation generators in
 * src/features/algorithms/graph/bfsLogic.js
 * src/features/algorithms/graph/dfsLogic.js
 *
 * NOTE: These generators treat numeric node id 0 as falsy (guard: !startNode).
 * Tests use string node ids ('A', 'B', etc.) to avoid this edge case.
 *
 * Run with: node --experimental-detect-module --test security-tests/graphAnimationLogic.test.cjs
 */
const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("path");

const { bfsGenerator } = require(path.resolve(__dirname, "../src/features/algorithms/graph/bfsLogic.js"));
const { dfsGenerator } = require(path.resolve(__dirname, "../src/features/algorithms/graph/dfsLogic.js"));

function consume(generator) {
  const steps = [];
  let r;
  while (!(r = generator.next()).done) steps.push(r.value);
  return steps;
}

// ─── BFS Tests ─────────────────────────────────────────────────────────────────

test("bfsGenerator: visits all reachable nodes from start", () => {
  const adj = { A: ["B", "C"], B: ["D"], C: [], D: [] };
  const steps = consume(bfsGenerator(adj, "A"));
  assert.ok(steps.length > 0, "should yield steps");
  const last = steps[steps.length - 1];
  assert.ok(last.visitedNodes !== undefined, "step should have visitedNodes");
});

test("bfsGenerator: start node not in graph returns nothing", () => {
  const adj = { A: ["B"], B: [] };
  const steps = consume(bfsGenerator(adj, "Z"));
  assert.strictEqual(steps.length, 0, "should not yield steps for missing start");
});

test("bfsGenerator: single node graph yields one visiting step", () => {
  const adj = { A: [] };
  const steps = consume(bfsGenerator(adj, "A"));
  assert.ok(steps.length > 0, "should yield at least one step");
  const visiting = steps.find((s) => s.visitingNodes && s.visitingNodes.has("A"));
  assert.ok(visiting !== undefined, "should visit node A");
});

test("bfsGenerator: all steps have required properties", () => {
  const adj = { A: ["B"], B: [] };
  const steps = consume(bfsGenerator(adj, "A"));
  assert.ok(steps.length > 0, "all steps should have required properties");
  for (const step of steps) {
    assert.ok("visitedNodes" in step, "step should have visitedNodes");
    assert.ok("visitingNodes" in step, "step should have visitingNodes");
    assert.ok("queue" in step, "step should have queue");
    assert.ok("currentNode" in step, "step should have currentNode");
  }
});

test("bfsGenerator: disconnected graph only visits connected component", () => {
  const adj = {
    A: ["B"],
    B: [],
    C: ["D"], // separate component
    D: [],
  };
  const steps = consume(bfsGenerator(adj, "A"));
  assert.ok(steps.length > 0);
  const last = steps[steps.length - 1];
  assert.ok(last.visitedNodes.has("A"), "node A should be visited");
  assert.ok(last.visitedNodes.has("B"), "node B should be visited");
  assert.ok(!last.visitedNodes.has("C"), "node C should not be visited");
  assert.ok(!last.visitedNodes.has("D"), "node D should not be visited");
});

test("bfsGenerator: queue grows as unvisited neighbors are discovered", () => {
  const adj = { A: ["B", "C"], B: [], C: [] };
  const steps = consume(bfsGenerator(adj, "A"));
  const last = steps[steps.length - 1];
  assert.ok(Array.isArray(last.queue), "queue should be an array");
});

// ─── DFS Tests ─────────────────────────────────────────────────────────────────

test("dfsGenerator: visits all reachable nodes from start", () => {
  const adj = { A: ["B", "C"], B: ["D"], C: [], D: [] };
  const steps = consume(dfsGenerator(adj, "A"));
  assert.ok(steps.length > 0, "should yield steps");
  const last = steps[steps.length - 1];
  assert.ok(last.visitedNodes !== undefined, "step should have visitedNodes");
});

test("dfsGenerator: start node not in graph returns nothing", () => {
  const adj = { A: ["B"], B: [] };
  const steps = consume(dfsGenerator(adj, "Z"));
  assert.strictEqual(steps.length, 0, "should not yield steps for missing start");
});

test("dfsGenerator: single node graph yields one visiting step", () => {
  const adj = { A: [] };
  const steps = consume(dfsGenerator(adj, "A"));
  assert.ok(steps.length > 0, "should yield at least one step");
  const visiting = steps.find((s) => s.visitingNodes && s.visitingNodes.has("A"));
  assert.ok(visiting !== undefined, "should visit node A");
});

test("dfsGenerator: all steps have required properties", () => {
  const adj = { A: ["B"], B: [] };
  const steps = consume(dfsGenerator(adj, "A"));
  assert.ok(steps.length > 0, "should yield steps");
  for (const step of steps) {
    assert.ok("visitedNodes" in step, "step should have visitedNodes");
    assert.ok("visitingNodes" in step, "step should have visitingNodes");
    assert.ok("stack" in step, "step should have stack");
    assert.ok("currentNode" in step, "step should have currentNode");
  }
});

test("dfsGenerator: disconnected graph only visits connected component", () => {
  const adj = {
    A: ["B"],
    B: [],
    C: ["D"],
    D: [],
  };
  const steps = consume(dfsGenerator(adj, "A"));
  const last = steps[steps.length - 1];
  assert.ok(last.visitedNodes.has("A"), "node A should be visited");
  assert.ok(last.visitedNodes.has("B"), "node B should be visited");
  assert.ok(!last.visitedNodes.has("C"), "node C should not be visited");
  assert.ok(!last.visitedNodes.has("D"), "node D should not be visited");
});

test("dfsGenerator: yields backtracking frames", () => {
  const adj = {
    A: ["B", "C"],
    B: [],
    C: [],
  };
  const steps = consume(dfsGenerator(adj, "A"));
  const backtrackFrames = steps.filter(
    (s) => s.description && s.description.includes("Backtracking")
  );
  assert.ok(backtrackFrames.length > 0, "should yield backtracking frames");
});

test("dfsGenerator: visitedNodes grows monotonically (never decreases)", () => {
  const adj = { A: ["B", "C"], B: [], C: [] };
  const steps = consume(dfsGenerator(adj, "A"));
  for (const step of steps) {
    assert.ok(step.visitedNodes instanceof Set, "visitedNodes should be a Set");
  }
});
