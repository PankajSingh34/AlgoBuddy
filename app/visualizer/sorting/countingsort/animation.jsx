"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ArrayGenerator from "@/app/components/ui/randomArray";
import CustomArrayInput from "@/app/components/ui/customArrayInput";
import PlaybackControls from "@/app/components/ui/PlaybackControls";
import ChallengeModePanel, {
  createOptions,
  useSortingChallenge,
} from "@/app/visualizer/sorting/components/ChallengeMode";
import usePlayback from "@/app/hooks/usePlayback";
import useVisualizerKeyboard from "@/app/hooks/useVisualizerKeyboard";
import { loadFromStorage, saveToStorage } from "@/utils/storage";

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const normalizeArray = (values, minValue, maxValue) =>
  values
    .map((value) => Math.trunc(Number(value)))
    .filter((value) => Number.isFinite(value))
    .map((value) => clamp(value, minValue, maxValue))
    .slice(0, 12);

const generateCountingArray = (minValue, maxValue) =>
  Array.from({ length: maxValue - minValue + 1 }, (_, index) => ({
    value: minValue + index,
    count: 0,
  }));

const getCellClass = (active, done, accent = "purple") => {
  if (active) {
    return accent === "green"
      ? "border-green-600 bg-green-100 text-green-900 dark:bg-green-900/40 dark:text-green-100"
      : accent === "yellow"
      ? "border-yellow-600 bg-yellow-100 text-yellow-900 dark:bg-yellow-900/40 dark:text-yellow-100"
      : "border-[#a435f0] bg-purple-100 text-purple-900 dark:bg-purple-900/40 dark:text-purple-100";
  }

  if (done) {
    return "border-green-500 bg-green-50 text-green-900 dark:bg-green-950/30 dark:text-green-100";
  }

  return "border-gray-200 bg-white text-gray-900 dark:border-gray-700 dark:bg-neutral-950 dark:text-gray-100";
};

const createPlacementQuestion = (value, countValue, index) => ({
  prompt: `Where will value ${value} be placed next?`,
  options: createOptions(`Output index ${index}`, [
    index > 0 ? `Output index ${index - 1}` : null,
    `Output index ${index + 1}`,
    `Count slot ${countValue}`,
  ]),
  correctOptionId: "correct",
  explanation: `The cumulative count for ${value} is ${countValue}, so the stable placement index is ${countValue - 1}.`,
});

const CountingSortVisualizer = () => {
  const [minValue, setMinValue] = useState(() => loadFromStorage("counting-min", 0));
  const [maxValue, setMaxValue] = useState(() => loadFromStorage("counting-max", 9));
  const [array, setArray] = useState(() =>
    normalizeArray(loadFromStorage("counting-array", [4, 2, 2, 8, 3, 3, 1]), 0, 9)
  );
  const [countArray, setCountArray] = useState(() => generateCountingArray(0, 9));
  const [outputArray, setOutputArray] = useState([]);
  const [phase, setPhase] = useState("Ready");
  const [message, setMessage] = useState("Generate or enter values in the selected range.");
  const [activeInputIndex, setActiveInputIndex] = useState(-1);
  const [activeCountIndex, setActiveCountIndex] = useState(-1);
  const [activeOutputIndex, setActiveOutputIndex] = useState(-1);
  const [currentStep, setCurrentStep] = useState(0);
  const [totalSteps, setTotalSteps] = useState(0);
  const [writes, setWrites] = useState(0);
  const [sorting, setSorting] = useState(false);
  const [sorted, setSorted] = useState(false);
  const [challengeEnabled, setChallengeEnabled] = useState(false);
  const animationRef = useRef(null);
  const resolveRef = useRef(null);
  const isSortingRef = useRef(false);

  const {
    isPaused,
    speed,
    speedRef,
    setSpeed,
    togglePlayPause,
    increaseSpeed,
    decreaseSpeed,
    checkPause,
  } = usePlayback(loadFromStorage("counting-speed", 1));

  const {
    activeQuestion,
    askChallenge,
    resetChallengeStats,
    stats: challengeStats,
    submitAnswer,
  } = useSortingChallenge(challengeEnabled);

  const safeRange = useMemo(() => {
    const min = Math.trunc(Number(minValue));
    const max = Math.trunc(Number(maxValue));
    if (!Number.isFinite(min) || !Number.isFinite(max) || min > max) {
      return { min: 0, max: 9 };
    }
    return { min, max: Math.min(max, min + 20) };
  }, [minValue, maxValue]);

  useEffect(() => {
    saveToStorage("counting-array", array);
  }, [array]);

  useEffect(() => {
    saveToStorage("counting-speed", speed);
  }, [speed]);

  useEffect(() => {
    saveToStorage("counting-min", safeRange.min);
    saveToStorage("counting-max", safeRange.max);
  }, [safeRange.min, safeRange.max]);

  const resetStats = useCallback(() => {
    setCountArray(generateCountingArray(safeRange.min, safeRange.max));
    setOutputArray([]);
    setPhase("Ready");
    setMessage("Generate or enter values in the selected range.");
    setActiveInputIndex(-1);
    setActiveCountIndex(-1);
    setActiveOutputIndex(-1);
    setCurrentStep(0);
    setTotalSteps(0);
    setWrites(0);
    resetChallengeStats();
    if (animationRef.current) clearTimeout(animationRef.current);
  }, [resetChallengeStats, safeRange.max, safeRange.min]);

  useEffect(() => {
    const nextArray = normalizeArray(array, safeRange.min, safeRange.max);
    setArray(nextArray);
    resetStats();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [safeRange.min, safeRange.max]);

  const cancellableDelay = async () => {
    await new Promise((resolve) => {
      resolveRef.current = resolve;
      animationRef.current = setTimeout(resolve, 1000 / speedRef.current);
    });
    await checkPause();
  };

  const applyArray = (values) => {
    setArray(normalizeArray(values, safeRange.min, safeRange.max));
    setSorted(false);
    resetStats();
  };

  const handleRangeChange = (type, value) => {
    const next = Math.trunc(Number(value));
    if (!Number.isFinite(next)) return;

    if (type === "min") {
      setMinValue(Math.min(next, Number(maxValue)));
      return;
    }

    setMaxValue(Math.max(next, Number(minValue)));
  };

  const handleGenerate = () => {
    const length = 10;
    const next = Array.from(
      { length },
      () => Math.floor(Math.random() * (safeRange.max - safeRange.min + 1)) + safeRange.min
    );
    applyArray(next);
  };

  const countingSort = async () => {
    if (sorting || sorted || array.length === 0) return;

    isSortingRef.current = true;
    setSorting(true);
    setSorted(false);
    setCurrentStep(0);
    setTotalSteps(array.length * 2 + (safeRange.max - safeRange.min));
    setWrites(0);

    const counts = Array(safeRange.max - safeRange.min + 1).fill(0);
    const output = Array(array.length).fill(null);
    setCountArray(generateCountingArray(safeRange.min, safeRange.max));
    setOutputArray(output);

    setPhase("Frequency count");
    for (let i = 0; i < array.length; i++) {
      if (!isSortingRef.current) return;
      const countIndex = array[i] - safeRange.min;
      counts[countIndex] += 1;
      setActiveInputIndex(i);
      setActiveCountIndex(countIndex);
      setActiveOutputIndex(-1);
      setCountArray(counts.map((count, index) => ({ value: safeRange.min + index, count })));
      setCurrentStep((step) => step + 1);
      setMessage(`Read ${array[i]} at input index ${i}; increment count[${array[i]}].`);
      await cancellableDelay();
    }

    setPhase("Cumulative count");
    for (let i = 1; i < counts.length; i++) {
      if (!isSortingRef.current) return;
      counts[i] += counts[i - 1];
      setActiveInputIndex(-1);
      setActiveCountIndex(i);
      setActiveOutputIndex(-1);
      setCountArray(counts.map((count, index) => ({ value: safeRange.min + index, count })));
      setCurrentStep((step) => step + 1);
      setMessage(`Add previous total so count[${safeRange.min + i}] becomes ${counts[i]}.`);
      await cancellableDelay();
    }

    setPhase("Stable placement");
    let writeCount = 0;
    for (let i = array.length - 1; i >= 0; i--) {
      if (!isSortingRef.current) return;
      const value = array[i];
      const countIndex = value - safeRange.min;
      const targetIndex = counts[countIndex] - 1;
      await askChallenge(createPlacementQuestion(value, counts[countIndex], targetIndex));
      if (!isSortingRef.current) return;
      output[targetIndex] = value;
      counts[countIndex] -= 1;
      writeCount += 1;
      setWrites(writeCount);
      setActiveInputIndex(i);
      setActiveCountIndex(countIndex);
      setActiveOutputIndex(targetIndex);
      setOutputArray([...output]);
      setCountArray(counts.map((count, index) => ({ value: safeRange.min + index, count })));
      setCurrentStep((step) => step + 1);
      setMessage(`Place ${value} into output index ${targetIndex}, then decrement its count.`);
      await cancellableDelay();
    }

    if (!isSortingRef.current) return;
    setArray(output);
    setPhase("Complete");
    setMessage("Counting Sort is complete. The output array is now sorted.");
    setActiveInputIndex(-1);
    setActiveCountIndex(-1);
    setActiveOutputIndex(-1);
    setSorting(false);
    setSorted(true);
    isSortingRef.current = false;
  };

  const reset = useCallback(() => {
    isSortingRef.current = false;
    if (resolveRef.current) {
      resolveRef.current();
      resolveRef.current = null;
    }
    if (animationRef.current) clearTimeout(animationRef.current);
    setSorting(false);
    setSorted(false);
    setArray([]);
    resetStats();
  }, [resetStats]);

  useEffect(() => {
    return () => {
      if (animationRef.current) clearTimeout(animationRef.current);
    };
  }, []);

  const handleStart = useCallback(() => {
    countingSort();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sorting, sorted, array, safeRange.min, safeRange.max, speed]);

  useVisualizerKeyboard({
    onStart: handleStart,
    onReset: reset,
    onSpeedChange: setSpeed,
    onTogglePlayPause: togglePlayPause,
    speed,
    sorting,
    sorted,
  });

  return (
    <main className="container mx-auto px-6 pb-4">
      <p className="mb-8 text-center text-lg text-gray-600 dark:text-gray-400">
        Build the frequency table, convert it to cumulative counts, then place values into a stable output array.
      </p>

      <div className="mx-auto max-w-5xl">
        <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4 shadow-md dark:border-gray-700 dark:bg-neutral-950 sm:p-6 md:mb-8">
          <div className="mb-4 grid grid-cols-1 gap-3 lg:grid-cols-[1fr_280px]">
            <div className="flex flex-col gap-2">
              <ArrayGenerator
                onGenerate={handleGenerate}
                disabled={sorting}
                isPrimary={array.length === 0}
              />
              <CustomArrayInput
                onUseCustomArray={applyArray}
                disabled={sorting}
                className="w-full"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Values are rounded to integers, clamped to the selected range, and limited to 12 items.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 rounded-lg bg-gray-100 p-3 dark:bg-neutral-900">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Min value
                <input
                  type="number"
                  value={safeRange.min}
                  min="0"
                  max="30"
                  disabled={sorting}
                  onChange={(event) => handleRangeChange("min", event.target.value)}
                  className="mt-1 w-full rounded border border-gray-300 bg-white p-2 dark:border-gray-700 dark:bg-neutral-950"
                />
              </label>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Max value
                <input
                  type="number"
                  value={safeRange.max}
                  min={safeRange.min}
                  max={safeRange.min + 20}
                  disabled={sorting}
                  onChange={(event) => handleRangeChange("max", event.target.value)}
                  className="mt-1 w-full rounded border border-gray-300 bg-white p-2 dark:border-gray-700 dark:bg-neutral-950"
                />
              </label>
              <div className="col-span-2 text-xs text-gray-500 dark:text-gray-400">
                Range size k = {safeRange.max - safeRange.min + 1}. Counting Sort uses O(n + k) time and space.
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            <button
              onClick={countingSort}
              disabled={!array.length || sorting || sorted}
              className="w-full rounded bg-[#a435f0] px-4 py-2 text-sm text-white shadow-sm transition-colors hover:bg-[#8f2cd6] disabled:opacity-75 sm:text-base"
            >
              {sorting ? "Sorting..." : "Start Counting Sort"}
            </button>
            <button
              onClick={reset}
              className="w-full rounded border border-[#a435f0] px-4 py-2 text-sm text-[#a435f0] transition-colors hover:bg-[#f3e8ff] dark:hover:bg-[#a435f0]/20 sm:text-base"
            >
              Reset All
            </button>
          </div>

          {sorting ? (
            <PlaybackControls
              isPaused={isPaused}
              onTogglePlayPause={togglePlayPause}
              speed={speed}
              onIncreaseSpeed={increaseSpeed}
              onDecreaseSpeed={decreaseSpeed}
              onSpeedChange={setSpeed}
            />
          ) : (
            <div className="mt-4 flex items-center gap-4">
              <span className="text-sm text-gray-700 dark:text-gray-300 sm:text-base">Speed:</span>
              <input
                type="range"
                min="0.5"
                max="5"
                step="0.5"
                value={speed}
                onChange={(event) => setSpeed(parseFloat(event.target.value))}
                className="w-24 sm:w-32"
                disabled={sorting}
              />
              <span className="text-sm text-gray-700 dark:text-gray-300 sm:text-base">{speed}x</span>
            </div>
          )}

          <ChallengeModePanel
            activeQuestion={activeQuestion}
            disabled={sorting}
            enabled={challengeEnabled}
            onEnabledChange={setChallengeEnabled}
            onResetStats={resetChallengeStats}
            onSubmitAnswer={submitAnswer}
            stats={challengeStats}
          />

          <div className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4 sm:text-base">
            <div className="rounded bg-gray-100 p-3 dark:bg-neutral-900">
              <div className="font-medium">Phase</div>
              <div className="text-lg font-bold">{phase}</div>
            </div>
            <div className="rounded bg-gray-100 p-3 dark:bg-neutral-900">
              <div className="font-medium">Writes</div>
              <div className="text-lg font-bold">{writes}</div>
            </div>
            <div className="rounded bg-gray-100 p-3 dark:bg-neutral-900">
              <div className="font-medium">Range</div>
              <div className="text-lg font-bold">k = {safeRange.max - safeRange.min + 1}</div>
            </div>
            <div className="rounded bg-gray-100 p-3 dark:bg-neutral-900">
              <div className="font-medium">Step</div>
              <div className="text-lg font-bold">{totalSteps ? `${currentStep} / ${totalSteps}` : "-"}</div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-md dark:border-gray-700 dark:bg-neutral-950 sm:p-6">
          <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="text-lg font-semibold sm:text-xl">Counting Sort Visualization</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">{message}</p>
          </div>

          <section className="mb-6">
            <h3 className="mb-2 text-sm font-semibold uppercase text-gray-500 dark:text-gray-400">Input array</h3>
            <div className="flex flex-wrap justify-center gap-2">
              {array.length ? (
                array.map((value, index) => (
                  <div key={`${value}-${index}`} className="flex flex-col items-center">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-lg border-2 text-base font-bold shadow-sm transition-colors sm:h-14 sm:w-14 ${getCellClass(index === activeInputIndex, sorted, "yellow")}`}
                    >
                      {value}
                    </div>
                    <span className="mt-1 text-xs text-gray-500">{index}</span>
                  </div>
                ))
              ) : (
                <div className="py-6 text-center text-gray-500">Generate or enter an array to begin</div>
              )}
            </div>
          </section>

          <section className="mb-6">
            <h3 className="mb-2 text-sm font-semibold uppercase text-gray-500 dark:text-gray-400">Count array</h3>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-10">
              {countArray.map((item, index) => (
                <div
                  key={item.value}
                  className={`rounded-lg border-2 p-2 text-center transition-colors ${getCellClass(index === activeCountIndex, false)}`}
                >
                  <div className="text-xs text-gray-500 dark:text-gray-400">value</div>
                  <div className="font-bold">{item.value}</div>
                  <div className="mt-1 rounded bg-gray-100 px-2 py-1 font-mono text-sm dark:bg-neutral-900">
                    {item.count}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="mb-2 text-sm font-semibold uppercase text-gray-500 dark:text-gray-400">Output array</h3>
            <div className="flex flex-wrap justify-center gap-2">
              {(outputArray.length ? outputArray : Array(array.length).fill(null)).map((value, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-lg border-2 text-base font-bold shadow-sm transition-colors sm:h-14 sm:w-14 ${getCellClass(index === activeOutputIndex, value !== null, "green")}`}
                  >
                    {value ?? ""}
                  </div>
                  <span className="mt-1 text-xs text-gray-500">{index}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default CountingSortVisualizer;
