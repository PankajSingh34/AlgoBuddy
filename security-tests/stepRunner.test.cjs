const { describe, it, beforeEach } = require("node:test");
const assert = require("node:assert/strict");

// -------------------------------------------------------------------
// Module-level state (same as src/lib/visualizer/stepRunner.js)
// -------------------------------------------------------------------

const ALGORITHMS = new Map();

function registerAlgorithm(name, fn) {
  ALGORITHMS.set(name, fn);
}

function createSyncStepRunner(generatorFn) {
  return (input) => {
    const steps = [];
    const gen = generatorFn(input);
    for (const step of gen) {
      steps.push(step);
    }
    return steps;
  };
}

function buildStepRunner(stepGenerator) {
  return async () => {
    const steps = [];
    for await (const step of stepGenerator) {
      steps.push(step);
    }
    return steps;
  };
}

async function* generateSteps(algorithmFn, input) {
  const queue = [input];
  while (queue.length > 0) {
    const state = queue.shift();
    const nextStates = algorithmFn(state);
    for (const next of nextStates) {
      yield next;
      queue.push(next);
    }
  }
}

// -------------------------------------------------------------------
// ALGORITHMS map
// -------------------------------------------------------------------

describe("ALGORITHMS map", () => {
  it("starts empty", () => {
    assert.strictEqual(ALGORITHMS.size, 0);
  });
});

// -------------------------------------------------------------------
// registerAlgorithm
// -------------------------------------------------------------------

describe("registerAlgorithm", () => {
  beforeEach(() => {
    ALGORITHMS.clear();
  });

  it("stores a function under the given name", () => {
    const fn = () => {};
    registerAlgorithm("bfs", fn);
    assert.strictEqual(ALGORITHMS.get("bfs"), fn);
  });

  it("can store multiple algorithms", () => {
    const fn1 = () => {};
    const fn2 = () => {};
    registerAlgorithm("bfs", fn1);
    registerAlgorithm("dfs", fn2);
    assert.strictEqual(ALGORITHMS.size, 2);
    assert.strictEqual(ALGORITHMS.get("bfs"), fn1);
    assert.strictEqual(ALGORITHMS.get("dfs"), fn2);
  });

  it("overwrites an existing algorithm with the same name", () => {
    const fn1 = () => "first";
    const fn2 = () => "second";
    registerAlgorithm("algo", fn1);
    registerAlgorithm("algo", fn2);
    assert.strictEqual(ALGORITHMS.size, 1);
    assert.strictEqual(ALGORITHMS.get("algo"), fn2);
  });
});

// -------------------------------------------------------------------
// createSyncStepRunner
// -------------------------------------------------------------------

describe("createSyncStepRunner", () => {
  it("collects all steps from a synchronous generator function", () => {
    // A generator that yields step snapshots for each count value up to limit
    function* countGen(state) {
      for (let c = state.start; c <= state.limit; c++) {
        yield { count: c };
      }
    }

    const runner = createSyncStepRunner(countGen);
    const steps = runner({ start: 0, limit: 3 });
    assert.strictEqual(steps.length, 4);
    assert.deepStrictEqual(steps[0], { count: 0 });
    assert.deepStrictEqual(steps[1], { count: 1 });
    assert.deepStrictEqual(steps[2], { count: 2 });
    assert.deepStrictEqual(steps[3], { count: 3 });
  });

  it("returns empty array when generator yields nothing", () => {
    function* emptyGen(_state) {
      // yields nothing
    }

    const runner = createSyncStepRunner(emptyGen);
    const steps = runner({});
    assert.deepStrictEqual(steps, []);
  });

  it("handles generator that yields single step then stops", () => {
    function* singleGen(state) {
      yield { visited: state.id };
    }

    const runner = createSyncStepRunner(singleGen);
    const steps = runner({ id: 42 });
    assert.deepStrictEqual(steps, [{ visited: 42 }]);
  });

  it("collects steps preserving order", () => {
    function* orderGen(state) {
      for (let i = 0; i < state.n; i++) {
        yield i;
      }
    }

    const runner = createSyncStepRunner(orderGen);
    const steps = runner({ n: 5 });
    assert.deepStrictEqual(steps, [0, 1, 2, 3, 4]);
  });
});

// -------------------------------------------------------------------
// buildStepRunner (async)
// -------------------------------------------------------------------

describe("buildStepRunner", () => {
  it("collects async generator steps into an array", async () => {
    async function* gen() {
      yield { n: 1 };
      yield { n: 2 };
      yield { n: 3 };
    }

    const runner = buildStepRunner(gen());
    const steps = await runner();
    assert.deepStrictEqual(steps, [{ n: 1 }, { n: 2 }, { n: 3 }]);
  });

  it("returns empty array for empty async generator", async () => {
    async function* emptyGen() {}

    const runner = buildStepRunner(emptyGen());
    const steps = await runner();
    assert.deepStrictEqual(steps, []);
  });

  it("collects async steps with mixed content types", async () => {
    async function* mixedGen() {
      yield { type: "step", id: 1 };
      yield "leaf";
      yield null;
    }

    const runner = buildStepRunner(mixedGen());
    const steps = await runner();
    assert.deepStrictEqual(steps, [{ type: "step", id: 1 }, "leaf", null]);
  });
});

// -------------------------------------------------------------------
// generateSteps
// -------------------------------------------------------------------

describe("generateSteps", () => {
  it("explores a linear BFS chain (state is a number)", async () => {
    // State = a number; next state = n+1; stop at 3
    function linearNext(state) {
      if (state < 3) return [state + 1];
      return [];
    }

    const results = [];
    for await (const step of generateSteps(linearNext, 0)) {
      results.push(step);
    }
    assert.deepStrictEqual(results, [1, 2, 3]);
  });

  it("explores a branching BFS tree", async () => {
    // State = [x, y]; next states expand both x and y
    function expandNext(state) {
      const [x, y] = state;
      if (x + y < 3) return [[x + 1, y], [x, y + 1]];
      return [];
    }

    const results = [];
    for await (const step of generateSteps(expandNext, [0, 0])) {
      results.push(step);
    }
    // BFS order: [0,0] start → children of [0,0]: [1,0],[0,1] → children of [1,0]: [2,0],[1,1] → ...
    assert.ok(results.length > 0);
    assert.deepStrictEqual(results[0], [1, 0]);
    assert.deepStrictEqual(results[1], [0, 1]);
  });

  it("handles empty initial input", async () => {
    function emptyNext(_state) {
      return [];
    }

    const results = [];
    for await (const step of generateSteps(emptyNext, null)) {
      results.push(step);
    }
    assert.deepStrictEqual(results, []);
  });

  it("handles algorithm that immediately returns no next states", async () => {
    function deadEnd(_state) {
      return [];
    }

    const results = [];
    for await (const step of generateSteps(deadEnd, "start")) {
      results.push(step);
    }
    assert.deepStrictEqual(results, []);
  });

  it("yields states in BFS order (queue order preserved)", async () => {
    // Graph: 0 → [1, 2], 1 → [3], 2 → []
    function graphNext(state) {
      const adj = { 0: [1, 2], 1: [3], 2: [], 3: [] };
      return adj[state] || [];
    }

    const results = [];
    for await (const step of generateSteps(graphNext, 0)) {
      results.push(step);
    }
    // BFS order: start with 0's neighbors [1,2], then 1's [3], then 2's []
    assert.deepStrictEqual(results, [1, 2, 3]);
  });
});
