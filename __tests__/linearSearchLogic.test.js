// __tests__/linearSearchLogic.test.js
//
// Run with:  npx jest __tests__/linearSearchLogic.test.js --colors=false
//
// Tests the linearSearchGenerator from src/features/algorithms/array/linearSearchLogic.js.
// Inlined here to avoid ESM import issues with Jest's transform: {} config.

const { describe, expect, test } = require("@jest/globals");

// ─── Inlined from src/features/algorithms/array/linearSearchLogic.js ─────────────────

function* linearSearchGenerator(arr, targetValue) {
  for (let index = 0; index < arr.length; index++) {
    yield { type: "checking", index };

    if (arr[index] === targetValue) {
      yield { type: "found", index };
      return;
    }
  }

  yield { type: "not_found" };
}

// ─── Helpers ────────────────────────────────────────────────────────────────────

function collectGenerator(gen) {
  const steps = [];
  let result = gen.next();
  while (!result.done) {
    steps.push(result.value);
    result = gen.next();
  }
  return steps;
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("linearSearchGenerator — found cases", () => {
  test("target is first element — correct yield sequence", () => {
    const steps = collectGenerator(linearSearchGenerator([5, 8, 3], 5));
    expect(steps.length).toBe(2);
    expect(steps[0]).toEqual({ type: "checking", index: 0 });
    expect(steps[1]).toEqual({ type: "found", index: 0 });
  });

  test("target is last element — correct yield count", () => {
    const steps = collectGenerator(linearSearchGenerator([1, 2, 3, 4], 4));
    // 4 checking steps (indices 0-3) + 1 found = 5
    expect(steps.length).toBe(5);
    expect(steps[4]).toEqual({ type: "found", index: 3 });
  });

  test("target is in the middle — found with correct index", () => {
    const steps = collectGenerator(linearSearchGenerator([10, 20, 30, 40, 50], 30));
    // Generator yields checking THEN found for each index:
    // index 0: checking(0), 10 != 30
    // index 1: checking(1), 20 != 30
    // index 2: checking(2), 30 == 30 -> found(2), return
    expect(steps[0]).toEqual({ type: "checking", index: 0 });
    expect(steps[1]).toEqual({ type: "checking", index: 1 });
    expect(steps[2]).toEqual({ type: "checking", index: 2 });
    expect(steps[3]).toEqual({ type: "found", index: 2 });
    expect(steps.length).toBe(4);
  });

  test("found at position p yields exactly p+2 frames (p checking + 1 found)", () => {
    const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    for (let target = 0; target < arr.length; target++) {
      const steps = collectGenerator(linearSearchGenerator(arr, arr[target]));
      const expectedCount = target + 2; // target checking steps + 1 found
      expect(steps.length).toBe(expectedCount);
      expect(steps[steps.length - 1]).toEqual({ type: "found", index: target });
    }
  });
});

describe("linearSearchGenerator — not found cases", () => {
  test("target not in array — only checking steps then not_found", () => {
    const steps = collectGenerator(linearSearchGenerator([1, 2, 3], 99));
    // checking indices 0, 1, 2 then not_found
    expect(steps.length).toBe(4);
    expect(steps[0]).toEqual({ type: "checking", index: 0 });
    expect(steps[1]).toEqual({ type: "checking", index: 1 });
    expect(steps[2]).toEqual({ type: "checking", index: 2 });
    expect(steps[3]).toEqual({ type: "not_found" });
  });

  test("no found yield present in not_found case", () => {
    const steps = collectGenerator(linearSearchGenerator([5, 10, 15], 99));
    const foundSteps = steps.filter((s) => s.type === "found");
    expect(foundSteps.length).toBe(0);
  });

  test("empty array — single not_found yield", () => {
    const steps = collectGenerator(linearSearchGenerator([], 5));
    expect(steps.length).toBe(1);
    expect(steps[0]).toEqual({ type: "not_found" });
  });

  test("not found at position n yields n+1 frames (n checking + 1 not_found)", () => {
    const arr = [1, 2, 3, 4, 5];
    for (let i = 0; i < arr.length; i++) {
      const absentTarget = arr[i] + 0.5; // guaranteed not in array
      const steps = collectGenerator(linearSearchGenerator(arr, absentTarget));
      const expectedCount = arr.length + 1;
      expect(steps.length).toBe(expectedCount);
      expect(steps[steps.length - 1]).toEqual({ type: "not_found" });
    }
  });
});

describe("linearSearchGenerator — edge cases", () => {
  test("single element found — yields checking then found", () => {
    const steps = collectGenerator(linearSearchGenerator([42], 42));
    expect(steps.length).toBe(2);
    expect(steps[0]).toEqual({ type: "checking", index: 0 });
    expect(steps[1]).toEqual({ type: "found", index: 0 });
  });

  test("single element not found — yields checking then not_found", () => {
    const steps = collectGenerator(linearSearchGenerator([42], 99));
    expect(steps.length).toBe(2);
    expect(steps[0]).toEqual({ type: "checking", index: 0 });
    expect(steps[1]).toEqual({ type: "not_found" });
  });

  test("array with duplicate values — first occurrence is returned", () => {
    const steps = collectGenerator(linearSearchGenerator([7, 1, 7, 3, 7], 7));
    // checking index 0, then found at 0 (first occurrence)
    expect(steps[0]).toEqual({ type: "checking", index: 0 });
    expect(steps[1]).toEqual({ type: "found", index: 0 });
    expect(steps.length).toBe(2);
  });

  test("negative numbers — found case", () => {
    const steps = collectGenerator(linearSearchGenerator([-5, -3, -1, 0, 1], -1));
    expect(steps[0]).toEqual({ type: "checking", index: 0 });
    expect(steps[1]).toEqual({ type: "checking", index: 1 });
    expect(steps[2]).toEqual({ type: "checking", index: 2 });
    expect(steps[3]).toEqual({ type: "found", index: 2 });
  });

  test("negative numbers — not found case", () => {
    const steps = collectGenerator(linearSearchGenerator([-5, -3, -1, 0, 1], -99));
    expect(steps.length).toBe(6);
    expect(steps[5]).toEqual({ type: "not_found" });
  });

  test("all identical values — found at first element", () => {
    const steps = collectGenerator(linearSearchGenerator([7, 7, 7, 7], 7));
    expect(steps.length).toBe(2);
    expect(steps[0]).toEqual({ type: "checking", index: 0 });
    expect(steps[1]).toEqual({ type: "found", index: 0 });
  });
});

describe("linearSearchGenerator — yield properties", () => {
  test("every checking step has type 'checking' and valid index", () => {
    const steps = collectGenerator(linearSearchGenerator([1, 2, 3, 4, 5], 5));
    const checkingSteps = steps.filter((s) => s.type === "checking");
    checkingSteps.forEach((step, i) => {
      expect(step.type).toBe("checking");
      expect(typeof step.index).toBe("number");
      expect(step.index).toBeGreaterThanOrEqual(0);
      expect(step.index).toBeLessThan(5);
    });
  });

  test("found step has type 'found' and correct index", () => {
    const steps = collectGenerator(linearSearchGenerator([2, 4, 6, 8], 6));
    const foundSteps = steps.filter((s) => s.type === "found");
    expect(foundSteps.length).toBe(1);
    expect(foundSteps[0].index).toBe(2);
  });

  test("not_found step is a plain object with only type property", () => {
    const steps = collectGenerator(linearSearchGenerator([1, 2, 3], 99));
    const notFoundStep = steps.find((s) => s.type === "not_found");
    expect(Object.keys(notFoundStep)).toEqual(["type"]);
  });

  test("generator returns after found (no further yields)", () => {
    const steps = collectGenerator(linearSearchGenerator([10, 20, 30], 20));
    const foundIndex = steps.findIndex((s) => s.type === "found");
    const afterFound = steps.slice(foundIndex + 1);
    // Nothing after found
    expect(afterFound.length).toBe(0);
  });
});
