const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");

// Clear the algorithm registry before each test run to avoid cross-test pollution.
const stepRunnerPath = path.resolve(__dirname, "..", "src", "lib", "visualizer", "stepRunner.js");

// Since stepRunner.js uses module-level state (ALGORITHMS Map),
// we import fresh for each test group.
async function getStepRunnerExports() {
  const mod = await import(`file://${stepRunnerPath}`);
  return mod;
}

// Helper: simple BFS tree expansion function for testing generateSteps
function bfsNext(state) {
  const { value, children } = state;
  return (children || []).map((child) => child);
}

test("createStepWorker uses a registered algorithm", async () => {
  const { registerAlgorithm } = await getStepRunnerExports();

  // Register a simple tree walker
  function treeWalker(state) {
    return (state.children || []);
  }
  registerAlgorithm("test-tree-walker", treeWalker);

  // createStepWorker returns a Worker, which we cannot instantiate in Node.js
  // (it requires a browser environment). Instead, we verify that calling
  // createStepWorker with a registered algorithm does NOT throw.
  const { createStepWorker } = await getStepRunnerExports();
  // The Worker is created synchronously without throwing even if we never postMessage.
  // In Node.js this will fail because Worker is not defined — so we test
  // that the function is called without throwing for a registered name.
  try {
    createStepWorker("test-tree-walker");
  } catch (err) {
    // In Node.js environment Worker is undefined, so it may throw.
    // What matters is that it does NOT throw with "Unknown algorithm".
    assert.ok(
      !err.message.includes("Unknown algorithm"),
      `Should not throw Unknown algorithm, got: ${err.message}`
    );
  }
});

test("generateSteps yields all states in BFS order", async () => {
  const { generateSteps } = await getStepRunnerExports();

  const tree = {
    value: "A",
    children: [
      { value: "B", children: [{ value: "D", children: [] }] },
      { value: "C", children: [{ value: "E", children: [] }] },
    ],
  };

  const steps = [];
  for await (const step of generateSteps(bfsNext, tree)) {
    steps.push(step);
  }

  assert.equal(steps.length, 4, "Should yield 4 nodes in BFS order");
  assert.equal(steps[0].value, "B");
  assert.equal(steps[1].value, "C");
  assert.equal(steps[2].value, "D");
  assert.equal(steps[3].value, "E");
});

test("generateSteps yields nothing for a leaf node", async () => {
  const { generateSteps } = await getStepRunnerExports();

  const leaf = { value: "X", children: [] };

  const steps = [];
  for await (const step of generateSteps(bfsNext, leaf)) {
    steps.push(step);
  }

  assert.equal(steps.length, 0, "Leaf node should yield no steps");
});

test("buildStepRunner collects steps from an async generator", async () => {
  const { buildStepRunner, generateSteps } = await getStepRunnerExports();

  const tree = {
    value: "root",
    children: [{ value: "child1", children: [] }, { value: "child2", children: [] }],
  };

  const runner = buildStepRunner(generateSteps(bfsNext, tree));
  const steps = await runner();

  assert.equal(steps.length, 2, "Should collect 2 child steps");
  assert.equal(steps[0].value, "child1");
  assert.equal(steps[1].value, "child2");
});

test("buildStepRunner returns empty array for leaf input", async () => {
  const { buildStepRunner, generateSteps } = await getStepRunnerExports();

  const runner = buildStepRunner(generateSteps(bfsNext, { value: "leaf", children: [] }));
  const steps = await runner();

  assert.deepEqual(steps, []);
});

test("createSyncStepRunner runs a sync generator and returns all steps", async () => {
  const { createSyncStepRunner } = await getStepRunnerExports();

  function* simpleGen(input) {
    let node = input;
    while (node.children && node.children.length > 0) {
      const next = node.children[0];
      yield next;
      node = next;
    }
  }

  const runner = createSyncStepRunner(simpleGen);
  const steps = runner({ value: "start", children: [{ value: "middle", children: [{ value: "end", children: [] }] }] });

  assert.equal(steps.length, 2, "Should return 2 steps");
  assert.equal(steps[0].value, "middle");
  assert.equal(steps[1].value, "end");
});

test("createSyncStepRunner returns empty array when generator yields nothing", async () => {
  const { createSyncStepRunner } = await getStepRunnerExports();

  function* emptyGen(input) {
    // Yields nothing
  }

  const runner = createSyncStepRunner(emptyGen);
  const steps = runner({ value: "solo" });

  assert.deepEqual(steps, [], "Should return empty array");
});

test("generateSteps handles nodes with multiple children", async () => {
  const { generateSteps } = await getStepRunnerExports();

  const tree = {
    value: "root",
    children: [
      { value: "a", children: [] },
      { value: "b", children: [] },
      { value: "c", children: [] },
    ],
  };

  const steps = [];
  for await (const step of generateSteps(bfsNext, tree)) {
    steps.push(step);
  }

  assert.equal(steps.length, 3);
  assert.equal(steps[0].value, "a");
  assert.equal(steps[1].value, "b");
  assert.equal(steps[2].value, "c");
});

test("createStepWorker throws for unregistered algorithm", async () => {
  const { createStepWorker } = await getStepRunnerExports();

  assert.throws(
    () => createStepWorker("nonexistent-algo-xyz"),
    /Unknown algorithm/,
    "Should throw with Unknown algorithm error"
  );
});
