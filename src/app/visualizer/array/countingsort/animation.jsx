"use client";
import React, { useState, useRef, useEffect } from "react";
import ArrayGenerator from "@/app/components/ui/randomArray";
import CustomArrayInput from "@/app/components/ui/customArrayInput";
import useVisualizerKeyboard from "@/app/hooks/useVisualizerKeyboard";
import usePlayback from "@/app/hooks/usePlayback";
import PlaybackControls from "@/app/components/ui/PlaybackControls";
import { countingSortGenerator } from "@/features/algorithms/array/countingSortLogic";

const getFontSize = (value) => {
  const len = String(value).length;
  if (len <= 2) return "text-lg";
  if (len === 3) return "text-sm";
  return "text-xs";
};

const CountingSortVisualizer = () => {
  const [array, setArray] = useState([]);
  const [counts, setCounts] = useState([]);
  const [output, setOutput] = useState([]);
  const [sorting, setSorting] = useState(false);
  const [sorted, setSorted] = useState(false);
  const [comparisons, setComparisons] = useState(0);
  const [swaps, setSwaps] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [totalSteps, setTotalSteps] = useState(0);
  const [currentIndices, setCurrentIndices] = useState({ current: -1, countIndex: -1, outputIndex: -1 });
  const [currentPhase, setCurrentPhase] = useState("");
  const [stepExplanation, setStepExplanation] = useState("");
  const {
    isPaused,
    speed,
    speedRef,
    setSpeed,
    togglePlayPause,
    increaseSpeed,
    decreaseSpeed,
    checkPause,
  } = usePlayback(1);
  const animationRef = useRef(null);
  const isSortingRef = useRef(false);
  const resolveRef = useRef(null);

  const cancellableDelay = async (ms = 1000) => {
    await new Promise((resolve) => {
      resolveRef.current = resolve;
      animationRef.current = setTimeout(resolve, ms / speedRef.current);
    });
    await checkPause();
  };

  const resetStats = () => {
    setComparisons(0);
    setSwaps(0);
    setCurrentStep(0);
    setTotalSteps(0);
    setCurrentIndices({ current: -1, countIndex: -1, outputIndex: -1 });
    setCurrentPhase("");
    setStepExplanation("");
    setCounts([]);
    setOutput([]);
    if (animationRef.current) {
      clearTimeout(animationRef.current);
    }
  };

  const countingSort = async () => {
    if (sorted || sorting || array.length === 0) return;

    isSortingRef.current = true;
    setSorting(true);
    setSorted(false);

    const generator = countingSortGenerator(array);

    for (const frame of generator) {
      if (!isSortingRef.current) return;
      const { type, payload } = frame;

      if (type === 'init') {
        setCounts(payload.count);
        setOutput(payload.result);
        setTotalSteps(payload.totalSteps);
        setCurrentStep(0);
      }
      else if (type === 'counting_start') {
        setCurrentPhase("Counting Phase");
        setStepExplanation("Scanning the input array and counting how often each value appears.");
      }
      else if (type === 'counting') {
        setCurrentIndices({ current: payload.current, countIndex: payload.countIndex, outputIndex: -1 });
        setStepExplanation(`Incrementing count for value ${payload.value} at index ${payload.value}.`);
        setComparisons(payload.comparisons);
        setCurrentStep(payload.step);
        await cancellableDelay();
      }
      else if (type === 'counted') {
        setCounts(payload.count);
      }
      else if (type === 'prefix_start') {
        setCurrentPhase("Prefix Sum Phase");
        setStepExplanation(`Building cumulative counts to determine final sorted positions.`);
      }
      else if (type === 'prefix') {
        setCurrentIndices({ current: -1, countIndex: payload.countIndex, outputIndex: -1 });
        setStepExplanation(`Computing cumulative count for value ${payload.value} (previous total ${payload.prevTotal}).`);
        setCurrentStep(payload.step);
        await cancellableDelay();
      }
      else if (type === 'prefixed') {
        setCounts(payload.count);
      }
      else if (type === 'placement_start') {
        setCurrentPhase("Placement Phase");
        setStepExplanation(`Placing elements into the output array using the count positions.`);
      }
      else if (type === 'placement') {
        setCurrentIndices({ current: payload.current, countIndex: payload.countIndex, outputIndex: payload.position });
        setStepExplanation(`Placing ${payload.value} into output index ${payload.position}.`);
        setCurrentStep(payload.step);
        await cancellableDelay();
      }
      else if (type === 'placed') {
        setOutput(payload.result);
        setCounts(payload.count);
        setSwaps(payload.swaps);
      }
      else if (type === 'completed') {
        setArray(payload.arr);
        setOutput(payload.result);
        setSorting(false);
        setSorted(true);
        setCurrentPhase("Completed");
        setStepExplanation("Array is fully sorted using Counting Sort.");
        isSortingRef.current = false;
        setCurrentIndices({ current: -1, countIndex: -1, outputIndex: -1 });
      }
    }
  };

  const reset = () => {
    isSortingRef.current = false;
    if (resolveRef.current) {
      resolveRef.current();
      resolveRef.current = null;
    }
    if (animationRef.current) {
      clearTimeout(animationRef.current);
    }
    setArray([]);
    setSorting(false);
    setSorted(false);
    resetStats();
  };

  useEffect(() => {
    return () => {
      if (animationRef.current) clearTimeout(animationRef.current);
    };
  }, []);

  useVisualizerKeyboard({
    onStart: countingSort,
    onReset: reset,
    onSpeedChange: setSpeed,
    onTogglePlayPause: togglePlayPause,
    speed,
    sorting,
    sorted,
  });

  return (
    <main className="container mx-auto px-6 pb-6">
      <p className="text-lg text-center text-gray-600 dark:text-gray-400 mb-8">
        Visualize Counting Sort as it counts values and places them into sorted order.
      </p>

      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-neutral-950 p-4 sm:p-6 rounded-lg shadow-md mb-6 md:mb-8 border border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
            <div className="flex flex-col gap-1">
              <ArrayGenerator onGenerate={(newArray) => { setArray(newArray); setSorted(false); resetStats(); }} disabled={sorting} isPrimary={array.length === 0} />
              <CustomArrayInput onUseCustomArray={(newArray) => { setArray(newArray); setSorted(false); resetStats(); }} disabled={sorting} className="w-full" />
            </div>
            <div className="flex flex-col gap-2 justify-between">
              <button onClick={countingSort} disabled={!array.length || sorting || sorted} className="w-full disabled:opacity-75 bg-none bg-[#a435f0] hover:bg-[#8f2cd6] px-4 py-2 rounded shadow-sm transition-all duration-300 text-sm sm:text-base text-white">
                {sorting ? "Sorting..." : "Start Counting Sort"}
              </button>
              <button onClick={reset} className="w-full bg-none text-[#a435f0] border border-[#a435f0] hover:bg-[#f3e8ff] dark:hover:bg-[#a435f0]/20 px-4 py-2 rounded transition-colors text-sm sm:text-base">
                Reset All
              </button>
            </div>
          </div>

          {sorting && (
            <PlaybackControls
              isPaused={isPaused}
              onTogglePlayPause={togglePlayPause}
              speed={speed}
              onIncreaseSpeed={increaseSpeed}
              onDecreaseSpeed={decreaseSpeed}
              onSpeedChange={setSpeed}
            />
          )}

          {!sorting && (
            <div className="flex items-center gap-4 mb-4">
              <span className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">Speed:</span>
              <input type="range" min="0.5" max="5" step="0.5" value={speed} onChange={(e) => setSpeed(parseFloat(e.target.value))} className="w-24 sm:w-32" disabled={sorting} />
              <span className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">{speed}x</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-gray-100 dark:bg-neutral-900 p-3 rounded">
              <div className="font-medium">Count Operations:</div>
              <div className="text-2xl">{comparisons}</div>
            </div>
            <div className="bg-gray-100 dark:bg-neutral-900 p-3 rounded">
              <div className="font-medium">Placements:</div>
              <div className="text-2xl">{swaps}</div>
            </div>
          </div>

          <div className="col-span-2 bg-gray-100 dark:bg-neutral-900 p-3 rounded mt-2">
            <div className="font-medium">Step:</div>
            <div className="text-xl font-bold">{totalSteps > 0 ? `${currentStep} / ${totalSteps}` : "—"}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{currentStep > 0 && !sorted ? `Processing index ${currentIndices.current}` : sorted ? "Sorting complete!" : "Start sorting to see steps"}</div>
          </div>
          <div className="col-span-2 bg-gray-100 dark:bg-neutral-900 p-3 rounded mt-2">
            <div className="font-medium">Phase:</div>
            <div className="text-sm sm:text-base text-gray-800 dark:text-gray-200">{currentPhase || (sorted ? "Completed" : "Ready to start")}</div>
            <div className="font-medium mt-2">Explanation:</div>
            <div className="text-sm text-gray-700 dark:text-gray-300 mt-1">{stepExplanation || (sorted ? "Array is fully sorted." : "Run the algorithm to see educational hints.")}</div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-950 p-4 sm:p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 mb-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">Input Array</h2>
          {array.length > 0 ? (
            <div className="flex flex-wrap gap-3 justify-center">
              {array.map((value, index) => {
                const isCurrent = index === currentIndices.current;
                return (
                  <div key={index} className="flex flex-col items-center">
                    <div className={`w-14 h-14 flex items-center justify-center rounded-lg border-2 ${getFontSize(value)} font-bold transition-all duration-300 ${isCurrent ? "bg-yellow-400 border-yellow-600" : "bg-primary/80 border-primary"}`}>
                      {value}
                    </div>
                    <div className="mt-1 text-xs text-gray-600 dark:text-gray-400">{index}</div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">{sorting ? "Sorting..." : "Generate or enter an array to begin"}</div>
          )}
        </div>

        <div className="bg-white dark:bg-neutral-950 p-4 sm:p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 mb-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">Count Array</h2>
          {counts.length > 0 ? (
            <div className="flex flex-wrap gap-2 justify-center">
              {counts.map((value, index) => {
                const isCountIndex = index === currentIndices.countIndex;
                return (
                  <div key={index} className="flex flex-col items-center">
                    <div className={`w-14 h-14 flex items-center justify-center rounded-lg border-2 ${getFontSize(value)} font-bold transition-all duration-300 ${isCountIndex ? "bg-pink-400 border-pink-600" : "bg-gray-100 border-gray-300"}`}>
                      {value}
                    </div>
                    <div className="mt-1 text-xs text-gray-600 dark:text-gray-400">{index}</div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">Counting array will appear here as the algorithm processes values.</div>
          )}
        </div>

        <div className="bg-white dark:bg-neutral-950 p-4 sm:p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">Output Array</h2>
          {output.length > 0 ? (
            <div className="flex flex-wrap gap-3 justify-center">
              {output.map((value, index) => {
                const isOutputIndex = index === currentIndices.outputIndex;
                return (
                  <div key={index} className="flex flex-col items-center">
                    <div className={`w-14 h-14 flex items-center justify-center rounded-lg border-2 ${getFontSize(value ?? "") } font-bold transition-all duration-300 ${isOutputIndex ? "bg-green-400 border-green-600" : "bg-gray-100 border-gray-300"}`}>
                      {value ?? ""}
                    </div>
                    <div className="mt-1 text-xs text-gray-600 dark:text-gray-400">{index}</div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">The output array will populate as values are placed into sorted positions.</div>
          )}
        </div>
      </div>
    </main>
  );
};

export default CountingSortVisualizer;
