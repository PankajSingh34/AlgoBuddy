import { generateSteps, buildStepRunner, createSyncStepRunner } from "../src/lib/visualizer/stepRunner";

describe("generateSteps", () => {
  test("yields nothing for empty algorithm", async () => {
    const gen = generateSteps(() => [], "input");
    const steps = [];
    for await (const s of gen) steps.push(s);
    expect(steps).toEqual([]);
  });

  test("yields steps in BFS order for simple branching", async () => {
    const fn = (state) => {
      if (state.depth >= 2) return [];
      return [{ ...state, depth: state.depth + 1, branch: "a" }, { ...state, depth: state.depth + 1, branch: "b" }];
    };
    const gen = generateSteps(fn, { depth: 0 });
    const steps = [];
    for await (const s of gen) steps.push(s);
    expect(steps.length).toBeGreaterThanOrEqual(2);
    expect(steps[0]).toMatchObject({ depth: 1, branch: "a" });
    expect(steps[1]).toMatchObject({ depth: 1, branch: "b" });
  });
});

describe("buildStepRunner", () => {
  test("collects all steps from a generator", async () => {
    async function* dummyGen() { yield 1; yield 2; yield 3; }
    const runner = buildStepRunner(dummyGen());
    const steps = await runner();
    expect(steps).toEqual([1, 2, 3]);
  });

  test("returns empty array for empty generator", async () => {
    async function* emptyGen() {}
    const runner = buildStepRunner(emptyGen());
    const steps = await runner();
    expect(steps).toEqual([]);
  });
});

describe("createSyncStepRunner", () => {
  test("returns all steps from a synchronous generator", () => {
    function* gen(input) { yield input + 1; yield input + 2; }
    const runner = createSyncStepRunner(gen);
    const steps = runner(10);
    expect(steps).toEqual([11, 12]);
  });

  test("returns empty array for empty generator", () => {
    function* empty() {}
    const runner = createSyncStepRunner(empty);
    const steps = runner("anything");
    expect(steps).toEqual([]);
  });
});
