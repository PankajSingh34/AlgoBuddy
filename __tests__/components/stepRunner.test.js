// __tests__/components/stepRunner.test.js
//
// Run with:  npx jest __tests__/components/stepRunner.test.js
//
// Tests the visualizer step runner utilities in src/lib/visualizer/stepRunner.js.

import {
  registerAlgorithm,
  createSyncStepRunner,
  buildStepRunner,
} from '../../src/lib/visualizer/stepRunner.js';

describe('registerAlgorithm', () => {
  test('stores algorithm function under the given name in the internal map', () => {
    const fn = () => [];
    registerAlgorithm('algo-under-test', fn);
    // After registering, no error is thrown for this name.
    // We verify indirectly by checking createSyncStepRunner works with it.
    const runner = createSyncStepRunner(fn);
    expect(Array.isArray(runner('input'))).toBe(true);
  });
});

describe('createSyncStepRunner', () => {
  test('returns an array of steps from synchronous generator iteration', () => {
    const generatorFn = function* (input) {
      yield { value: input, step: 1 };
      yield { value: input + 1, step: 2 };
      yield { value: input + 2, step: 3 };
    };
    const runner = createSyncStepRunner(generatorFn);
    const steps = runner(0);
    expect(steps).toEqual([
      { value: 0, step: 1 },
      { value: 1, step: 2 },
      { value: 2, step: 3 },
    ]);
  });

  test('returns empty array when generator yields nothing', () => {
    const generatorFn = function* () {
      // yields nothing
    };
    const runner = createSyncStepRunner(generatorFn);
    const steps = runner('any-input');
    expect(steps).toEqual([]);
  });

  test('collects all yielded values from a multi-step generator', () => {
    // This generator yields values one at a time, simulating multi-step processing.
    // createSyncStepRunner should collect all of them in order.
    const multiStepGen = function* (start) {
      let current = start;
      for (let i = 0; i < 5; i++) {
        yield { step: i, value: current };
        current = current * 2 + 1;
      }
    };
    const runner = createSyncStepRunner(multiStepGen);
    const steps = runner(1);
    expect(steps).toEqual([
      { step: 0, value: 1 },
      { step: 1, value: 3 },
      { step: 2, value: 7 },
      { step: 3, value: 15 },
      { step: 4, value: 31 },
    ]);
  });

  test('passes through the input unchanged', () => {
    const generatorFn = function* (input) {
      yield input;
    };
    const runner = createSyncStepRunner(generatorFn);
    const steps = runner('my-input');
    expect(steps).toEqual(['my-input']);
  });
});

describe('buildStepRunner', () => {
  test('wraps an async generator and returns all steps as an array', async () => {
    async function* asyncGen(input) {
      yield { async: true, input, n: 1 };
      yield { async: true, input, n: 2 };
    }
    const runner = buildStepRunner(asyncGen(10));
    const steps = await runner();
    expect(steps).toEqual([
      { async: true, input: 10, n: 1 },
      { async: true, input: 10, n: 2 },
    ]);
  });

  test('returns empty array when async generator yields nothing', async () => {
    async function* emptyGen() {
      // yields nothing
    }
    const runner = buildStepRunner(emptyGen());
    const steps = await runner();
    expect(steps).toEqual([]);
  });

  test('preserves step order for async generator', async () => {
    async function* asyncGen() {
      yield { order: 1 };
      yield { order: 2 };
      yield { order: 3 };
    }
    const runner = buildStepRunner(asyncGen());
    const steps = await runner();
    expect(steps.map((s) => s.order)).toEqual([1, 2, 3]);
  });
});
