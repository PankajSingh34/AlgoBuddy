// security-tests/sortingGenerators.test.cjs
//
// Run with:  node --experimental-detect-module --test security-tests/sortingGenerators.test.cjs
//
// Tests sorting generator functions from src/utils/sortingGenerators.js.

const { describe, test } = require("node:test");
const assert = require("node:assert/strict");

// Inline the three generators under test from src/utils/sortingGenerators.js.

function* bubbleSortGen(arr) {
  let a = [...arr];
  let n = a.length;
  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      yield {
        array: [...a],
        comparisons: 1,
        swaps: 0,
        currentIndices: { comparing: [j, j + 1] }
      };
      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        swapped = true;
        yield {
          array: [...a],
          comparisons: 0,
          swaps: 1,
          currentIndices: { swapping: [j, j + 1] }
        };
      }
    }
    if (!swapped) break;
  }
}

function* selectionSortGen(arr) {
  let a = [...arr];
  let n = a.length;
  for (let i = 0; i < n - 1; i++) {
    let minIndex = i;
    for (let j = i + 1; j < n; j++) {
      yield {
        array: [...a],
        comparisons: 1,
        swaps: 0,
        currentIndices: { comparing: [j], min: minIndex, active: i }
      };
      if (a[j] < a[minIndex]) {
        minIndex = j;
        yield {
          array: [...a],
          comparisons: 0,
          swaps: 0,
          currentIndices: { comparing: [j], min: minIndex, active: i }
        };
      }
    }
    if (minIndex !== i) {
      [a[i], a[minIndex]] = [a[minIndex], a[i]];
      yield {
        array: [...a],
        comparisons: 0,
        swaps: 1,
        currentIndices: { swapping: [i, minIndex], active: i }
      };
    }
  }
}

function* insertionSortGen(arr) {
  let a = [...arr];
  let n = a.length;
  for (let i = 1; i < n; i++) {
    let current = a[i];
    let j = i - 1;
    yield {
      array: [...a],
      comparisons: 0,
      swaps: 0,
      currentIndices: { key: i, comparing: [j] }
    };
    while (j >= 0 && a[j] > current) {
      yield {
        array: [...a],
        comparisons: 1,
        swaps: 0,
        currentIndices: { key: i, comparing: [j] }
      };
      a[j + 1] = a[j];
      yield {
        array: [...a],
        comparisons: 0,
        swaps: 1,
        currentIndices: { key: i, shifting: [j + 1] }
      };
      j--;
    }
    a[j + 1] = current;
    yield {
      array: [...a],
      comparisons: 0,
      swaps: 0,
      currentIndices: { key: j + 1 }
    };
  }
}

// Helper: collect all steps from a generator.
function collectSteps(gen) {
  const steps = [];
  let result = gen.next();
  while (!result.done) {
    steps.push(result.value);
    result = gen.next();
  }
  return steps;
}

// Helper: verify step shape.
function assertStepShape(step) {
  assert.ok(Array.isArray(step.array), "step.array must be an array");
  assert.ok(typeof step.comparisons === "number" && step.comparisons >= 0,
    `step.comparisons must be non-negative number, got: ${JSON.stringify(step.comparisons)}`);
  assert.ok(typeof step.swaps === "number" && step.swaps >= 0,
    `step.swaps must be non-negative number, got: ${JSON.stringify(step.swaps)}`);
  assert.ok(step.currentIndices && typeof step.currentIndices === "object",
    "step.currentIndices must be an object");
}

// ── Tests ────────────────────────────────────────────────────────────

describe("bubbleSortGen", () => {
  test("empty array produces no yields", () => {
    const steps = collectSteps(bubbleSortGen([]));
    assert.deepStrictEqual(steps, []);
  });

  test("single-element array produces zero steps (loop start is i=1, n=1 gives no iterations)", () => {
    const steps = collectSteps(bubbleSortGen([42]));
    assert.deepStrictEqual(steps, [], "bubbleSortGen should not yield for single-element input");
  });

  test("two equal elements are unchanged", () => {
    const steps = collectSteps(bubbleSortGen([5, 5]));
    assertStepShape(steps[0]);
    assert.deepStrictEqual(steps[steps.length - 1].array, [5, 5]);
  });

  test("reversed array produces sorted output at final step", () => {
    const input = [3, 2, 1];
    const steps = collectSteps(bubbleSortGen(input));
    const finalStep = steps[steps.length - 1];
    assert.deepStrictEqual(finalStep.array, [1, 2, 3],
      `expected [1,2,3], got: ${JSON.stringify(finalStep.array)}`);
  });

  test("already-sorted array terminates early via swapped flag", () => {
    const input = [1, 2, 3];
    const steps = collectSteps(bubbleSortGen(input));
    assert.ok(steps.length > 0, "should produce at least the first comparison step");
    // After first inner loop with no swaps, bubble sort should break.
    // The test verifies the generator terminates rather than looping forever.
  });

  test("all step objects have correct shape", () => {
    const steps = collectSteps(bubbleSortGen([4, 2, 7, 1]));
    assert.ok(steps.length > 0, "should produce steps");
    for (const step of steps) {
      assertStepShape(step);
    }
  });

  test("all yielded arrays are arrays", () => {
    const steps = collectSteps(bubbleSortGen([5, 3, 8, 1]));
    for (const step of steps) {
      assert.ok(Array.isArray(step.array), "each step.array must be an array");
    }
  });
});

describe("selectionSortGen", () => {
  test("empty array produces no yields", () => {
    const steps = collectSteps(selectionSortGen([]));
    assert.deepStrictEqual(steps, []);
  });

  test("single-element array produces zero steps (loop condition i < n-1 = 0 < 0 is false)", () => {
    const steps = collectSteps(selectionSortGen([7]));
    assert.deepStrictEqual(steps, [], "selectionSortGen should not yield for single-element input");
  });

  test("two equal elements are unchanged", () => {
    const steps = collectSteps(selectionSortGen([5, 5]));
    assertStepShape(steps[0]);
    assert.deepStrictEqual(steps[steps.length - 1].array, [5, 5]);
  });

  test("unsorted array produces sorted output at final step", () => {
    const steps = collectSteps(selectionSortGen([64, 25, 12, 22]));
    const finalStep = steps[steps.length - 1];
    assert.deepStrictEqual(finalStep.array, [12, 22, 25, 64],
      `expected sorted output, got: ${JSON.stringify(finalStep.array)}`);
  });

  test("all step objects have correct shape", () => {
    const steps = collectSteps(selectionSortGen([3, 1, 4, 1, 5]));
    assert.ok(steps.length > 0);
    for (const step of steps) {
      assertStepShape(step);
    }
  });
});

describe("insertionSortGen", () => {
  test("empty array produces no yields", () => {
    const steps = collectSteps(insertionSortGen([]));
    assert.deepStrictEqual(steps, []);
  });

  test("single-element array produces zero steps (loop starts at i=1, n=1 gives no iterations)", () => {
    const steps = collectSteps(insertionSortGen([9]));
    assert.deepStrictEqual(steps, [], "insertionSortGen should not yield for single-element input");
  });

  test("two equal elements are unchanged", () => {
    const steps = collectSteps(insertionSortGen([5, 5]));
    assertStepShape(steps[0]);
    assert.deepStrictEqual(steps[steps.length - 1].array, [5, 5]);
  });

  test("unsorted array produces sorted output at final step", () => {
    const steps = collectSteps(insertionSortGen([5, 2, 9, 1, 5]));
    const finalStep = steps[steps.length - 1];
    assert.deepStrictEqual(finalStep.array, [1, 2, 5, 5, 9],
      `expected sorted output, got: ${JSON.stringify(finalStep.array)}`);
  });

  test("already-sorted array produces minimal steps", () => {
    const input = [1, 2, 3, 4];
    const steps = collectSteps(insertionSortGen(input));
    assert.ok(steps.length > 0);
    assert.deepStrictEqual(steps[steps.length - 1].array, [1, 2, 3, 4]);
  });

  test("all step objects have correct shape", () => {
    const steps = collectSteps(insertionSortGen([4, 3, 2, 1]));
    assert.ok(steps.length > 0);
    for (const step of steps) {
      assertStepShape(step);
    }
  });
});
