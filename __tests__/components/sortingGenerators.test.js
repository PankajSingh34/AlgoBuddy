// __tests__/components/sortingGenerators.test.js
//
// Run with: npx jest __tests__/components/sortingGenerators.test.js --colors=false
//
// Tests the sorting algorithm generator functions in src/utils/sortingGenerators.js

import { describe, expect, test } from "@jest/globals";
import {
  bubbleSortGen,
  selectionSortGen,
  insertionSortGen,
  mergeSortGen,
  quickSortGen,
  heapSortGen,
} from "../../src/utils/sortingGenerators.js";

function isSorted(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] > arr[i + 1]) return false;
  }
  return true;
}

function collectSteps(gen) {
  const steps = [];
  let result = gen.next();
  while (!result.done) {
    steps.push(result.value);
    result = gen.next();
  }
  return steps;
}

describe("bubbleSortGen", () => {
  test("produces a sorted array at the end of iteration", () => {
    const arr = [5, 3, 8, 4, 2];
    const gen = bubbleSortGen(arr);
    const steps = collectSteps(gen);
    const lastStep = steps[steps.length - 1];
    expect(isSorted(lastStep.array)).toBe(true);
  });

  test("yields step objects with expected shape", () => {
    const arr = [3, 1, 2];
    const gen = bubbleSortGen(arr);
    const step = collectSteps(gen)[0];
    expect(step).toHaveProperty("array");
    expect(step).toHaveProperty("comparisons");
    expect(step).toHaveProperty("swaps");
    expect(step).toHaveProperty("currentIndices");
  });

  test("handles already-sorted input", () => {
    const arr = [1, 2, 3];
    const gen = bubbleSortGen(arr);
    const steps = collectSteps(gen);
    expect(steps.length).toBeGreaterThan(0);
    expect(isSorted(steps[steps.length - 1].array)).toBe(true);
  });

  test("yields no steps for single-element input (already sorted)", () => {
    const arr = [42];
    const gen = bubbleSortGen(arr);
    const steps = collectSteps(gen);
    // Single element: no outer loop iterations, no steps yielded
    expect(steps.length).toBe(0);
  });
});

describe("selectionSortGen", () => {
  test("produces a sorted array at the end of iteration", () => {
    const arr = [64, 25, 12, 22, 11];
    const gen = selectionSortGen(arr);
    const steps = collectSteps(gen);
    expect(isSorted(steps[steps.length - 1].array)).toBe(true);
  });

  test("yields step objects with expected shape", () => {
    const arr = [5, 2, 9];
    const gen = selectionSortGen(arr);
    const step = collectSteps(gen)[0];
    expect(step).toHaveProperty("array");
    expect(step).toHaveProperty("comparisons");
    expect(step).toHaveProperty("swaps");
    expect(step).toHaveProperty("currentIndices");
  });

  test("handles already-sorted input", () => {
    const arr = [1, 2, 3];
    const gen = selectionSortGen(arr);
    const steps = collectSteps(gen);
    expect(isSorted(steps[steps.length - 1].array)).toBe(true);
  });
});

describe("insertionSortGen", () => {
  test("produces a sorted array at the end of iteration", () => {
    const arr = [12, 11, 13, 5, 6];
    const gen = insertionSortGen(arr);
    const steps = collectSteps(gen);
    expect(isSorted(steps[steps.length - 1].array)).toBe(true);
  });

  test("yields step objects with expected shape", () => {
    const arr = [5, 2, 4];
    const gen = insertionSortGen(arr);
    const step = collectSteps(gen)[0];
    expect(step).toHaveProperty("array");
    expect(step).toHaveProperty("comparisons");
    expect(step).toHaveProperty("swaps");
    expect(step).toHaveProperty("currentIndices");
  });

  test("handles already-sorted input", () => {
    const arr = [1, 2, 3];
    const gen = insertionSortGen(arr);
    const steps = collectSteps(gen);
    expect(isSorted(steps[steps.length - 1].array)).toBe(true);
  });
});

describe("mergeSortGen", () => {
  test("produces a sorted array at the end of iteration", () => {
    const arr = [38, 27, 43, 3, 9, 82, 10];
    const gen = mergeSortGen(arr);
    const steps = collectSteps(gen);
    expect(isSorted(steps[steps.length - 1].array)).toBe(true);
  });

  test("yields step objects with expected shape", () => {
    const arr = [5, 1];
    const gen = mergeSortGen(arr);
    const step = collectSteps(gen)[0];
    expect(step).toHaveProperty("array");
    expect(step).toHaveProperty("comparisons");
    expect(step).toHaveProperty("swaps");
    expect(step).toHaveProperty("currentIndices");
  });

  test("yields no steps for single-element input (already sorted)", () => {
    const arr = [99];
    const gen = mergeSortGen(arr);
    const steps = collectSteps(gen);
    // Single element: no merge operations needed
    expect(steps.length).toBe(0);
  });
});

describe("quickSortGen", () => {
  test("produces a sorted array at the end of iteration", () => {
    const arr = [10, 7, 8, 9, 1, 5];
    const gen = quickSortGen(arr);
    const steps = collectSteps(gen);
    expect(isSorted(steps[steps.length - 1].array)).toBe(true);
  });

  test("yields step objects with expected shape", () => {
    const arr = [5, 3];
    const gen = quickSortGen(arr);
    const step = collectSteps(gen)[0];
    expect(step).toHaveProperty("array");
    expect(step).toHaveProperty("comparisons");
    expect(step).toHaveProperty("swaps");
    expect(step).toHaveProperty("currentIndices");
  });

  test("handles already-sorted input", () => {
    const arr = [1, 2, 3, 4, 5];
    const gen = quickSortGen(arr);
    const steps = collectSteps(gen);
    expect(isSorted(steps[steps.length - 1].array)).toBe(true);
  });
});

describe("heapSortGen", () => {
  test("produces a sorted array at the end of iteration", () => {
    const arr = [12, 11, 13, 5, 6, 7];
    const gen = heapSortGen(arr);
    const steps = collectSteps(gen);
    expect(isSorted(steps[steps.length - 1].array)).toBe(true);
  });

  test("yields step objects with expected shape", () => {
    const arr = [5, 2, 8];
    const gen = heapSortGen(arr);
    const step = collectSteps(gen)[0];
    expect(step).toHaveProperty("array");
    expect(step).toHaveProperty("comparisons");
    expect(step).toHaveProperty("swaps");
    expect(step).toHaveProperty("currentIndices");
  });

  test("yields no steps for single-element input (already sorted)", () => {
    const arr = [77];
    const gen = heapSortGen(arr);
    const steps = collectSteps(gen);
    // Single element: no heapify swaps needed
    expect(steps.length).toBe(0);
  });
});
