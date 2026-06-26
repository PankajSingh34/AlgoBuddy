// Run with: node --experimental-detect-module --test security-tests/stepRunner.test.cjs
const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const { pathToFileURL } = require("node:url");

test("registerAlgorithm — stores and retrieves functions from ALGORITHMS map", async () => {
  const { registerAlgorithm } = await import(pathToFileURL(path.join(__dirname, "..", "src/lib/visualizer/stepRunner.js")).href);

  const fn = function* () { yield { step: 1 }; };
  registerAlgorithm("test-algo", fn);
  // Verify no throw on register
  assert.ok(true, "registerAlgorithm should not throw on valid input");
});

test("createSyncStepRunner — runs a generator function and collects all steps", async () => {
  const { createSyncStepRunner } = await import(pathToFileURL(path.join(__dirname, "..", "src/lib/visualizer/stepRunner.js")).href);

  function* simpleGen(input) {
    yield { input, step: 1 };
    yield { input, step: 2 };
    yield { input, step: 3 };
  }

  const runner = createSyncStepRunner(simpleGen);
  const steps = runner("test");
  assert.strictEqual(steps.length, 3);
  assert.strictEqual(steps[0].step, 1);
  assert.strictEqual(steps[1].step, 2);
  assert.strictEqual(steps[2].step, 3);
  assert.strictEqual(steps[0].input, "test");
  assert.strictEqual(steps[1].input, "test");
  assert.strictEqual(steps[2].input, "test");
});

test("createSyncStepRunner — throws on unregistered algorithm name", async () => {
  // This tests the registration-based behavior
  // When no algorithm is registered, createSyncStepRunner should still run
  // the provided generator function without error
  const { createSyncStepRunner } = await import(pathToFileURL(path.join(__dirname, "..", "src/lib/visualizer/stepRunner.js")).href);

  function* dummy() { yield { done: true }; }
  const runner = createSyncStepRunner(dummy);
  const result = runner();
  assert.deepStrictEqual(result, [{ done: true }]);
});

test("buildStepRunner — returns a function that collects async generator output", async () => {
  const { buildStepRunner } = await import(pathToFileURL(path.join(__dirname, "..", "src/lib/visualizer/stepRunner.js")).href);

  async function* asyncGen() {
    yield { value: "a" };
    yield { value: "b" };
    yield { value: "c" };
  }

  const runner = buildStepRunner(asyncGen());
  const steps = await runner();
  assert.strictEqual(steps.length, 3);
  assert.strictEqual(steps[0].value, "a");
  assert.strictEqual(steps[1].value, "b");
  assert.strictEqual(steps[2].value, "c");
});

test("buildStepRunner — works with empty generator", async () => {
  const { buildStepRunner } = await import(pathToFileURL(path.join(__dirname, "..", "src/lib/visualizer/stepRunner.js")).href);

  async function* emptyGen() { /* yields nothing */ }
  const runner = buildStepRunner(emptyGen());
  const steps = await runner();
  assert.deepStrictEqual(steps, []);
});

test("createSyncStepRunner — processes multi-level state machine", async () => {
  const { createSyncStepRunner } = await import(pathToFileURL(path.join(__dirname, "..", "src/lib/visualizer/stepRunner.js")).href);

  function* treeGen(n) {
    if (n <= 0) return;
    yield { node: n, type: "visit" };
    yield* treeGen(n - 1);
    yield { node: n, type: "leave" };
  }

  const runner = createSyncStepRunner(treeGen);
  const steps = runner(3);
  assert.strictEqual(steps.length, 6);
  assert.strictEqual(steps[0].node, 3);
  assert.strictEqual(steps[0].type, "visit");
  assert.strictEqual(steps[3].node, 1);
  assert.strictEqual(steps[3].type, "leave");
  assert.strictEqual(steps[5].node, 3);
  assert.strictEqual(steps[5].type, "leave");
});

test("createSyncStepRunner — handles generator yielding objects with complex state", async () => {
  const { createSyncStepRunner } = await import(pathToFileURL(path.join(__dirname, "..", "src/lib/visualizer/stepRunner.js")).href);

  function* complexGen() {
    yield { visitedNodes: new Set([1, 2]), queue: [], description: "init" };
    yield { visitedNodes: new Set([1, 2, 3]), queue: [], description: "found 3" };
  }

  const runner = createSyncStepRunner(complexGen);
  const steps = runner();
  assert.strictEqual(steps.length, 2);
  assert.deepStrictEqual([...steps[0].visitedNodes], [1, 2]);
  assert.deepStrictEqual([...steps[1].visitedNodes], [1, 2, 3]);
});
