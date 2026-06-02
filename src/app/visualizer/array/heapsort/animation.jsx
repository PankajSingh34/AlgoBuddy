"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ArrayGenerator from "@/app/components/ui/randomArray";
import CustomArrayInput from "@/app/components/ui/customArrayInput";
import PlaybackControls from "@/app/components/ui/PlaybackControls";
import usePlayback from "@/app/hooks/usePlayback";
import useVisualizerKeyboard from "@/app/hooks/useVisualizerKeyboard";
import useVisualizerReset from "@/app/hooks/useVisualizerReset";

const DEFAULT_ARRAY = [42, 18, 76, 33, 9, 55, 64, 27];
const MAX_ITEMS = 12;

const clampArray = (values) =>
  values
    .map((value) => Math.trunc(Number(value)))
    .filter((value) => Number.isFinite(value))
    .map((value) => Math.min(Math.max(value, 1), 100))
    .slice(0, MAX_ITEMS);

const generateArray = (size) =>
  Array.from({ length: size }, () => Math.floor(Math.random() * 96) + 5);

const getFontSize = (value) => {
  const len = String(value).length;
  if (len <= 2) return "text-base";
  if (len === 3) return "text-sm";
  return "text-xs";
};

const getTreePositions = (length) => {
  const levelGap = 94;
  const positions = [];

  for (let index = 0; index < length; index++) {
    const level = Math.floor(Math.log2(index + 1));
    const firstIndexAtLevel = 2 ** level - 1;
    const slot = index - firstIndexAtLevel;
    const nodesOnLevel = 2 ** level;
    positions.push({
      x: ((slot + 1) * 800) / (nodesOnLevel + 1),
      y: 48 + level * levelGap,
    });
  }

  return positions;
};

const getNodePalette = (index, heapSize, activeIndices, compareIndices, swapIndices, sortedIndices) => {
  if (sortedIndices.includes(index)) {
    return { fill: "#d1fae5", stroke: "#10b981", text: "#064e3b" };
  }
  if (swapIndices.includes(index)) {
    return { fill: "#ffe4e6", stroke: "#f43f5e", text: "#881337" };
  }
  if (compareIndices.includes(index)) {
    return { fill: "#fef3c7", stroke: "#f59e0b", text: "#78350f" };
  }
  if (activeIndices.includes(index)) {
    return { fill: "#f3e8ff", stroke: "#a435f0", text: "#581c87" };
  }
  if (index >= heapSize) {
    return { fill: "#f1f5f9", stroke: "#cbd5e1", text: "#64748b" };
  }
  return { fill: "#ffffff", stroke: "#94a3b8", text: "#1f2937" };
};

const createHeapSortSteps = (values) => {
  const arr = [...values];
  const steps = [];
  let comparisons = 0;
  let swaps = 0;
  const sorted = [];

  const pushStep = ({
    phase,
    message,
    activeIndices = [],
    compareIndices = [],
    swapIndices = [],
    heapSize = arr.length,
  }) => {
    steps.push({
      array: [...arr],
      activeIndices,
      compareIndices,
      swapIndices,
      sortedIndices: [...sorted],
      heapSize,
      phase,
      message,
      comparisons,
      swaps,
    });
  };

  const heapify = (heapSize, rootIndex, phase) => {
    let largest = rootIndex;
    const left = 2 * rootIndex + 1;
    const right = 2 * rootIndex + 2;

    pushStep({
      phase,
      message: `Heapify index ${rootIndex}; assume ${arr[rootIndex]} is largest.`,
      activeIndices: [rootIndex],
      heapSize,
    });

    if (left < heapSize) {
      comparisons += 1;
      pushStep({
        phase,
        message: `Compare parent ${arr[largest]} with left child ${arr[left]}.`,
        activeIndices: [rootIndex],
        compareIndices: [largest, left],
        heapSize,
      });
      if (arr[left] > arr[largest]) {
        largest = left;
        pushStep({
          phase,
          message: `Left child ${arr[left]} becomes the largest candidate.`,
          activeIndices: [largest],
          heapSize,
        });
      }
    }

    if (right < heapSize) {
      comparisons += 1;
      pushStep({
        phase,
        message: `Compare current largest ${arr[largest]} with right child ${arr[right]}.`,
        activeIndices: [rootIndex],
        compareIndices: [largest, right],
        heapSize,
      });
      if (arr[right] > arr[largest]) {
        largest = right;
        pushStep({
          phase,
          message: `Right child ${arr[right]} becomes the largest candidate.`,
          activeIndices: [largest],
          heapSize,
        });
      }
    }

    if (largest !== rootIndex) {
      pushStep({
        phase,
        message: `Swap ${arr[rootIndex]} with ${arr[largest]} to restore the heap property.`,
        swapIndices: [rootIndex, largest],
        heapSize,
      });
      [arr[rootIndex], arr[largest]] = [arr[largest], arr[rootIndex]];
      swaps += 1;
      pushStep({
        phase,
        message: `Continue heapifying the affected subtree at index ${largest}.`,
        activeIndices: [largest],
        swapIndices: [rootIndex, largest],
        heapSize,
      });
      heapify(heapSize, largest, phase);
    } else {
      pushStep({
        phase,
        message: `Subtree rooted at index ${rootIndex} already satisfies the max-heap rule.`,
        activeIndices: [rootIndex],
        heapSize,
      });
    }
  };

  pushStep({
    phase: "Ready",
    message: "Start by treating the array as a complete binary tree.",
  });

  pushStep({
    phase: "Build Max-Heap",
    message: "Build the max-heap from the last non-leaf node upward.",
  });

  for (let index = Math.floor(arr.length / 2) - 1; index >= 0; index--) {
    pushStep({
      phase: "Build Max-Heap",
      message: `Heapify subtree rooted at index ${index}.`,
      activeIndices: [index],
    });
    heapify(arr.length, index, "Build Max-Heap");
  }

  pushStep({
    phase: "Extract Max",
    message: "The max-heap is ready. Repeatedly move the root to the sorted region.",
  });

  for (let end = arr.length - 1; end > 0; end--) {
    pushStep({
      phase: "Extract Max",
      message: `Swap max ${arr[0]} with the last heap value ${arr[end]}.`,
      swapIndices: [0, end],
      heapSize: end + 1,
    });
    [arr[0], arr[end]] = [arr[end], arr[0]];
    swaps += 1;
    sorted.push(end);
    pushStep({
      phase: "Extract Max",
      message: `${arr[end]} is fixed at index ${end}; shrink the heap.`,
      activeIndices: [end],
      sortedIndices: [...sorted],
      heapSize: end,
    });
    heapify(end, 0, "Heapify Reduced Heap");
  }

  sorted.push(0);
  pushStep({
    phase: "Complete",
    message: "Heap Sort complete. Every value is in ascending order.",
    sortedIndices: [...sorted],
    heapSize: 0,
  });

  return steps;
};

export default function HeapSortVisualizer() {
  const [array, setArray] = useState(DEFAULT_ARRAY);
  const [arraySize, setArraySize] = useState(DEFAULT_ARRAY.length);
  const [steps, setSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [sorting, setSorting] = useState(false);
  const [sorted, setSorted] = useState(false);
  const timerRef = useRef(null);
  useVisualizerReset(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setArray(DEFAULT_ARRAY);
    setArraySize(DEFAULT_ARRAY.length);
    setSteps([]);
    setCurrentStepIndex(-1);
    setSorting(false);
    setSorted(false);
  });

  const {
    isPaused,
    speed,
    setSpeed,
    togglePlayPause,
    increaseSpeed,
    decreaseSpeed,
  } = usePlayback(1);

  const currentStep = steps[currentStepIndex] || null;
  const displayArray = currentStep?.array ?? array;
  const maxValue = useMemo(() => Math.max(...displayArray, 1), [displayArray]);
  const positions = useMemo(
    () => getTreePositions(displayArray.length),
    [displayArray.length]
  );
  const treeHeight = Math.max(260, 110 + Math.ceil(Math.log2(displayArray.length + 1)) * 94);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const resetPlayback = useCallback(() => {
    clearTimer();
    setSteps([]);
    setCurrentStepIndex(-1);
    setSorting(false);
    setSorted(false);
  }, [clearTimer]);

  const applyArray = useCallback(
    (values) => {
      const next = clampArray(values);
      setArray(next);
      setArraySize(next.length);
      resetPlayback();
    },
    [resetPlayback]
  );

  const handleSizeChange = (event) => {
    const nextSize = Number(event.target.value);
    setArraySize(nextSize);
    applyArray(generateArray(nextSize));
  };

  const startHeapSort = useCallback(() => {
    if (!array.length) return;

    if (!steps.length || sorted) {
      const nextSteps = createHeapSortSteps(array);
      setSteps(nextSteps);
      setCurrentStepIndex(0);
      setSorted(false);
    }

    setSorting(true);
  }, [array, sorted, steps.length]);

  const resetAll = useCallback(() => {
    resetPlayback();
    setArray([]);
    setArraySize(DEFAULT_ARRAY.length);
  }, [resetPlayback]);

  useEffect(() => {
    clearTimer();
    if (!sorting || isPaused || !steps.length) return;

    if (currentStepIndex >= steps.length - 1) {
      setSorting(false);
      setSorted(true);
      return;
    }

    timerRef.current = setTimeout(() => {
      setCurrentStepIndex((index) => index + 1);
    }, 900 / speed);

    return clearTimer;
  }, [clearTimer, currentStepIndex, isPaused, sorting, speed, steps.length]);

  useEffect(() => clearTimer, [clearTimer]);

  useVisualizerKeyboard({
    onStart: startHeapSort,
    onReset: resetAll,
    onSpeedChange: setSpeed,
    onTogglePlayPause: togglePlayPause,
    onIncreaseSpeed: increaseSpeed,
    onDecreaseSpeed: decreaseSpeed,
    speed,
    sorting,
    sorted,
  });

  const activeIndices = currentStep?.activeIndices ?? [];
  const compareIndices = currentStep?.compareIndices ?? [];
  const swapIndices = currentStep?.swapIndices ?? [];
  const sortedIndices = currentStep?.sortedIndices ?? [];
  const heapSize = currentStep?.heapSize ?? displayArray.length;
  const progressText = steps.length
    ? `${Math.max(currentStepIndex + 1, 0)} / ${steps.length}`
    : "0 / 0";

  const getItemClass = (index) => {
    if (sortedIndices.includes(index)) {
      return "border-emerald-500 bg-emerald-100 text-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-200";
    }
    if (swapIndices.includes(index)) {
      return "border-rose-500 bg-rose-100 text-rose-900 dark:bg-rose-950/60 dark:text-rose-100";
    }
    if (compareIndices.includes(index)) {
      return "border-amber-500 bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-100";
    }
    if (activeIndices.includes(index)) {
      return "border-[#a435f0] bg-purple-100 text-purple-950 dark:bg-purple-950/60 dark:text-purple-100";
    }
    if (index >= heapSize) {
      return "border-slate-300 bg-slate-100 text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-500";
    }
    return "border-gray-300 bg-white text-gray-800 dark:border-gray-700 dark:bg-neutral-900 dark:text-gray-200";
  };

  return (
    <main className="container mx-auto px-4 pb-6 pt-4">
      <p className="mb-8 text-center text-lg text-gray-600 dark:text-gray-400">
        Build a max-heap, swap the root into place, and heapify the reduced heap step by step.
      </p>

      <div className="mx-auto max-w-6xl">
        <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4 shadow-md dark:border-gray-700 dark:bg-neutral-950 sm:p-6">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_280px]">
            <div className="flex flex-col gap-2">
              <ArrayGenerator
                onGenerate={() => applyArray(generateArray(arraySize))}
                disabled={sorting}
                isPrimary={array.length === 0}
              />
              <CustomArrayInput
                onUseCustomArray={applyArray}
                disabled={sorting}
                currentArray={array}
                className="w-full"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Custom values are rounded, clamped from 1 to 100, and limited to {MAX_ITEMS} items.
              </p>
            </div>

            <div className="rounded-lg bg-gray-100 p-3 dark:bg-neutral-900">
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Array size
                </label>
                <span className="text-sm font-bold text-[#a435f0]">
                  {arraySize} items
                </span>
              </div>
              <input
                type="range"
                min="5"
                max={MAX_ITEMS}
                value={arraySize}
                onChange={handleSizeChange}
                disabled={sorting}
                className="w-full accent-[#a435f0]"
              />
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Larger arrays show more heap levels and heapify calls.
              </p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-2 md:grid-cols-2">
            <button
              onClick={startHeapSort}
              disabled={!array.length || (sorted && !sorting)}
              className="w-full rounded bg-[#a435f0] px-4 py-2 text-sm text-white shadow-sm transition-colors hover:bg-[#8f2cd6] disabled:opacity-75 sm:text-base"
            >
              {sorting ? "Sorting..." : sorted ? "Sorted" : "Start Heap Sort"}
            </button>
            <button
              onClick={resetAll}
              disabled={sorting}
              className="w-full rounded border border-[#a435f0] px-4 py-2 text-sm text-[#a435f0] transition-colors hover:bg-[#f3e8ff] dark:hover:bg-[#a435f0]/20 sm:text-base"
            >
              Reset All
            </button>
          </div>

          {sorting ? (
            <div className="mt-4">
              <PlaybackControls
                isPlaying={!isPaused}
                onPlayPause={togglePlayPause}
                speed={speed}
                onSpeedChange={setSpeed}
                progressText={progressText}
              />
            </div>
          ) : (
            <div className="mt-4 flex items-center gap-4">
              <span className="text-sm text-gray-700 dark:text-gray-300 sm:text-base">
                Speed:
              </span>
              <input
                type="range"
                min="0.5"
                max="5"
                step="0.5"
                value={speed}
                onChange={(event) => setSpeed(parseFloat(event.target.value))}
                className="w-24 accent-[#a435f0] sm:w-32"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300 sm:text-base">
                {speed}x
              </span>
            </div>
          )}

          <div className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4 sm:text-base">
            <div className="rounded bg-gray-100 p-3 dark:bg-neutral-900">
              <div className="font-medium">Phase</div>
              <div className="text-lg font-bold">{currentStep?.phase ?? "Ready"}</div>
            </div>
            <div className="rounded bg-gray-100 p-3 dark:bg-neutral-900">
              <div className="font-medium">Comparisons</div>
              <div className="text-lg font-bold">{currentStep?.comparisons ?? 0}</div>
            </div>
            <div className="rounded bg-gray-100 p-3 dark:bg-neutral-900">
              <div className="font-medium">Swaps</div>
              <div className="text-lg font-bold">{currentStep?.swaps ?? 0}</div>
            </div>
            <div className="rounded bg-gray-100 p-3 dark:bg-neutral-900">
              <div className="font-medium">Step</div>
              <div className="text-lg font-bold">{progressText}</div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-md dark:border-gray-700 dark:bg-neutral-950 sm:p-6">
          <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="text-lg font-semibold sm:text-xl">Heap Sort Visualization</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {currentStep?.message ?? "Generate an array, then start Heap Sort."}
            </p>
          </div>

          <section className="mb-8">
            <h3 className="mb-2 text-sm font-semibold uppercase text-gray-500 dark:text-gray-400">
              Array view
            </h3>
            <div className="flex h-64 items-end justify-center gap-1.5 rounded-lg bg-gray-50 p-4 dark:bg-neutral-900 sm:gap-2">
              {displayArray.length ? (
                displayArray.map((value, index) => {
                  const height = `${Math.max((value / maxValue) * 100, 14)}%`;
                  return (
                    <div
                      key={`${value}-${index}`}
                      className="flex h-full min-w-0 flex-1 flex-col items-center justify-end"
                    >
                      <div
                        style={{ height }}
                        className={`flex w-full max-w-14 items-end justify-center rounded-t-lg border-2 px-1 pb-2 font-bold shadow-sm transition-all duration-300 ${getFontSize(value)} ${getItemClass(index)}`}
                      >
                        {value}
                      </div>
                      <span className="mt-1 text-[10px] font-semibold text-gray-500 dark:text-gray-400">
                        {index}
                      </span>
                    </div>
                  );
                })
              ) : (
                <div className="self-center text-center text-gray-500">
                  Generate or enter an array to begin
                </div>
              )}
            </div>
          </section>

          <section>
            <div className="mb-2 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="text-sm font-semibold uppercase text-gray-500 dark:text-gray-400">
                Heap tree
              </h3>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Heap size: {heapSize} | Sorted region: {displayArray.length - heapSize}
              </div>
            </div>
            <div className="overflow-auto rounded-lg border border-gray-100 bg-gray-50 py-4 dark:border-gray-800 dark:bg-neutral-900">
              <svg
                width="800"
                height={treeHeight}
                viewBox={`0 0 800 ${treeHeight}`}
                className="mx-auto h-auto max-w-full"
                role="img"
                aria-label="Binary heap tree visualization"
              >
                {displayArray.map((_, index) => {
                  const left = 2 * index + 1;
                  const right = 2 * index + 2;
                  return [left, right].map((child) => {
                    if (child >= heapSize || index >= heapSize) return null;
                    return (
                      <line
                        key={`${index}-${child}`}
                        x1={positions[index].x}
                        y1={positions[index].y + 24}
                        x2={positions[child].x}
                        y2={positions[child].y - 24}
                        stroke="#94a3b8"
                        strokeWidth="2"
                      />
                    );
                  });
                })}

                {displayArray.map((value, index) => {
                  const inHeap = index < heapSize;
                  const nodePalette = getNodePalette(
                    index,
                    heapSize,
                    activeIndices,
                    compareIndices,
                    swapIndices,
                    sortedIndices
                  );
                  return (
                    <g
                      key={`${value}-node-${index}`}
                      className={`transition-opacity duration-300 ${inHeap ? "opacity-100" : "opacity-45"}`}
                    >
                      <circle
                        cx={positions[index].x}
                        cy={positions[index].y}
                        r="25"
                        fill={nodePalette.fill}
                        stroke={nodePalette.stroke}
                        strokeWidth="2.5"
                      />
                      <text
                        x={positions[index].x}
                        y={positions[index].y + 5}
                        textAnchor="middle"
                        fill={nodePalette.text}
                        className="text-sm font-bold"
                      >
                        {value}
                      </text>
                      <text
                        x={positions[index].x + 31}
                        y={positions[index].y + 5}
                        className="fill-gray-500 text-xs dark:fill-gray-400"
                      >
                        [{index}]
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
