// __tests__/components/stepRunner.test.js
//
// Run with:  ./node_modules/.bin/jest __tests__/components/stepRunner.test.js --colors=false
//
// Tests the step runner utilities in src/lib/visualizer/stepRunner.js.

import {
  registerAlgorithm,
  generateSteps,
  buildStepRunner,
  createSyncStepRunner,
  createStepWorker,
} from '@/lib/visualizer/stepRunner.js';

describe('registerAlgorithm', () => {
  afterEach(() => {
    jest.resetModules();
  });

  test('storing an algorithm does not throw', () => {
    const fn = () => [];
    expect(() => registerAlgorithm('test-algo', fn)).not.toThrow();
  });
});

describe('createStepWorker', () => {
  afterEach(() => {
    jest.resetModules();
  });

  test('throws for unregistered algorithm name', () => {
    expect(() => createStepWorker('nonexistent-algo')).toThrow(
      'Unknown algorithm: "nonexistent-algo"',
    );
  });
});

describe('generateSteps', () => {
  test('yields all steps from a simple BFS-like step generator', async () => {
    function simpleStep(state) {
      if (state.n >= 3) return [];
      return [{ n: state.n + 1 }];
    }

    const steps = [];
    for await (const step of generateSteps(simpleStep, { n: 0 })) {
      steps.push(step);
    }

    expect(steps).toEqual([{ n: 1 }, { n: 2 }, { n: 3 }]);
  });

  test('returns empty array for a step function that immediately returns empty', async () => {
    function emptyStep(state) {
      return [];
    }

    const steps = [];
    for await (const step of generateSteps(emptyStep, { n: 0 })) {
      steps.push(step);
    }

    expect(steps).toEqual([]);
  });
});

describe('buildStepRunner', () => {
  test('consumes a step generator and returns all steps as an array', async () => {
    async function* gen() {
      yield { id: 1 };
      yield { id: 2 };
      yield { id: 3 };
    }

    const runner = buildStepRunner(gen());
    const steps = await runner();

    expect(steps).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }]);
  });

  test('returns empty array for an empty generator', async () => {
    async function* gen() {}

    const runner = buildStepRunner(gen());
    const steps = await runner();

    expect(steps).toEqual([]);
  });
});

describe('createSyncStepRunner', () => {
  test('wraps a generator function and collects steps synchronously', () => {
    function* myGen(input) {
      yield { visited: input.start };
      yield { visited: input.start + 1 };
      yield { visited: input.start + 2 };
    }

    const runner = createSyncStepRunner(myGen);
    const steps = runner({ start: 10 });

    expect(steps).toEqual([{ visited: 10 }, { visited: 11 }, { visited: 12 }]);
  });

  test('returns empty array when generator yields nothing', () => {
    function* emptyGen(input) {
      return;
      yield input; // unreachable
    }

    const runner = createSyncStepRunner(emptyGen);
    const steps = runner({ n: 0 });

    expect(steps).toEqual([]);
  });
});
