import { describe, expect, test } from "@jest/globals";

import { bubbleSortGenerator } from "../src/features/algorithms/array/bubbleSortLogic.js";
import { selectionSortGenerator } from "../src/features/algorithms/array/selectionSortLogic.js";
import { insertionSortGenerator } from "../src/features/algorithms/array/insertionSortLogic.js";
import { mergeSortGenerator } from "../src/features/algorithms/array/mergeSortLogic.js";
import { quickSortGenerator } from "../src/features/algorithms/array/quickSortLogic.js";
import { heapSortGenerator } from "../src/features/algorithms/array/heapSortLogic.js";

function collectFrames(generator, input) {
  return Array.from(generator(input));
}

function lastFrame(frames) {
  return frames[frames.length - 1];
}

const STANDARD_SORTING_ALGORITHMS = [
  ["Bubble Sort", bubbleSortGenerator],
  ["Selection Sort", selectionSortGenerator],
  ["Insertion Sort", insertionSortGenerator],
  ["Merge Sort", mergeSortGenerator],
  ["Quick Sort", quickSortGenerator],
];

const input = [5, 3, 8, 1, 9, 2, 7, 4, 6];
const expected = [1, 2, 3, 4, 5, 6, 7, 8, 9];

describe.each(STANDARD_SORTING_ALGORITHMS)(
  "%s generator (standard frame format)",
  (name, generator) => {
    test("begins with an init frame", () => {
      const frames = collectFrames(generator, input);
      expect(frames[0].type).toBe("init");
    });

    test("ends with a completed frame containing a sorted array", () => {
      const frames = collectFrames(generator, input);
      const final = lastFrame(frames);
      expect(final.type).toBe("completed");
      expect(final.payload.arr).toEqual(expected);
    });

    test("emits frames with a type string", () => {
      const frames = collectFrames(generator, input);
      for (const frame of frames) {
        expect(frame).toHaveProperty("type");
        expect(typeof frame.type).toBe("string");
      }
    });

    test("preserves original input array", () => {
      const original = [5, 3, 8, 1, 9, 2, 7, 4, 6];
      const copy = [...original];
      collectFrames(generator, original);
      expect(original).toEqual(copy);
    });

    test("handles single-element array", () => {
      const frames = collectFrames(generator, [1]);
      expect(lastFrame(frames).type).toBe("completed");
      expect(lastFrame(frames).payload.arr).toEqual([1]);
    });

    test("handles already-sorted array", () => {
      const sorted = [1, 2, 3, 4, 5];
      const frames = collectFrames(generator, sorted);
      expect(lastFrame(frames).type).toBe("completed");
      expect(lastFrame(frames).payload.arr).toEqual(sorted);
    });

    test("handles reverse-sorted array", () => {
      const reversed = [9, 8, 7, 6, 5, 4, 3, 2, 1];
      const expectedSorted = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      const frames = collectFrames(generator, reversed);
      expect(lastFrame(frames).type).toBe("completed");
      expect(lastFrame(frames).payload.arr).toEqual(expectedSorted);
    });

    test("handles array with duplicates", () => {
      const duplicates = [4, 2, 4, 1, 2, 3];
      const expectedSorted = [1, 2, 2, 3, 4, 4];
      const frames = collectFrames(generator, duplicates);
      expect(lastFrame(frames).type).toBe("completed");
      expect(lastFrame(frames).payload.arr).toEqual(expectedSorted);
    });

    test("yields at least 2 frames (init + completed)", () => {
      const frames = collectFrames(generator, [1]);
      expect(frames.length).toBeGreaterThanOrEqual(2);
    });
  },
);

describe("Heap Sort generator (custom frame format)", () => {
  test("ends with phase 'Complete' and all elements sorted", () => {
    const frames = collectFrames(heapSortGenerator, input);
    const final = lastFrame(frames);
    expect(final.type).toBe("step");
    expect(final.payload.phase).toBe("Complete");
    expect(final.payload.array).toEqual(expected);
  });

  test("preserves original input array", () => {
    const original = [5, 3, 8, 1, 9, 2, 7, 4, 6];
    const copy = [...original];
    collectFrames(heapSortGenerator, original);
    expect(original).toEqual(copy);
  });

  test("handles single-element array", () => {
    const frames = collectFrames(heapSortGenerator, [1]);
    const final = lastFrame(frames);
    expect(final.payload.array).toEqual([1]);
    expect(final.payload.phase).toBe("Complete");
  });

  test("handles already-sorted array", () => {
    const sorted = [1, 2, 3, 4, 5];
    const frames = collectFrames(heapSortGenerator, sorted);
    expect(lastFrame(frames).payload.array).toEqual(sorted);
  });

  test("handles reverse-sorted array", () => {
    const reversed = [9, 8, 7, 6, 5, 4, 3, 2, 1];
    const expectedSorted = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const frames = collectFrames(heapSortGenerator, reversed);
    expect(lastFrame(frames).payload.array).toEqual(expectedSorted);
  });

  test("handles array with duplicates", () => {
    const duplicates = [4, 2, 4, 1, 2, 3];
    const expectedSorted = [1, 2, 2, 3, 4, 4];
    const frames = collectFrames(heapSortGenerator, duplicates);
    expect(lastFrame(frames).payload.array).toEqual(expectedSorted);
  });

  test("tracks comparisons and swaps in payload", () => {
    const frames = collectFrames(heapSortGenerator, input);
    expect(frames[0].payload).toHaveProperty("comparisons");
    expect(frames[0].payload).toHaveProperty("swaps");
    expect(typeof frames[0].payload.comparisons).toBe("number");
    expect(typeof frames[0].payload.swaps).toBe("number");
  });
});
