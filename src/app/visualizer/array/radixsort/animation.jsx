"use client";
import React, { useState, useRef, useEffect } from "react";
import ArrayGenerator from "@/app/components/ui/randomArray";
import CustomArrayInput from "@/app/components/ui/customArrayInput";
import useVisualizerKeyboard from "@/app/hooks/useVisualizerKeyboard";
import usePlayback from "@/app/hooks/usePlayback";
import PlaybackControls from "@/app/components/ui/PlaybackControls";
import { radixSortGenerator } from "@/features/algorithms/array/radixSortLogic";

const getFontSize = (value) => {
  const len = String(value).length;
  if (len <= 2) return "text-lg";
  if (len === 3) return "text-sm";
  return "text-xs";
};

const RadixSortVisualizer = () => {
  const [array, setArray] = useState([]);
  const [buckets, setBuckets] = useState(Array.from({ length: 10 }, () => []));
  const [sorting, setSorting] = useState(false);
  const [sorted, setSorted] = useState(false);
  const [comparisons, setComparisons] = useState(0);
  const [swaps, setSwaps] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [totalSteps, setTotalSteps] = useState(0);
  const [activeIndex, setActiveIndex] = useState(-1);
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
    setActiveIndex(-1);
    setCurrentPhase("");
    setStepExplanation("");
    setBuckets(Array.from({ length: 10 }, () => []));
    if (animationRef.current) clearTimeout(animationRef.current);
  };

  const radixSort = async () => {
    if (sorted || sorting || array.length === 0) return;

    isSortingRef.current = true;
    setSorting(true);
    setSorted(false);

    const generator = radixSortGenerator(array);

    for (const frame of generator) {
      if (!isSortingRef.current) return;
      const { type, payload } = frame;

      if (type === "init") {
        setTotalSteps(payload.totalSteps);
        setCurrentStep(0);
        setBuckets(payload.buckets);
      } else if (type === "digit_pass") {
        setCurrentPhase(`Pass: ${payload.digitPlace.charAt(0).toUpperCase() + payload.digitPlace.slice(1)} Digit`);
        setStepExplanation(payload.stepExplanation);
        setBuckets(payload.buckets);
        setActiveIndex(-1);
        await cancellableDelay(600);
      } else if (type === "counting") {
        setArray(payload.arr);
        setBuckets(payload.buckets);
        setActiveIndex(payload.activeIndex);
        setComparisons(payload.comparisons);
        setCurrentStep(payload.step);
        setStepExplanation(payload.stepExplanation);
        await cancellableDelay();
      } else if (type === "output") {
        setArray(payload.arr);
        setActiveIndex(payload.activeIndex);
        setSwaps(payload.swaps);
        setCurrentStep(payload.step);
        setStepExplanation(payload.stepExplanation);
        await cancellableDelay();
      } else if (type === "done") {
        setArray(payload.arr);
        setBuckets(payload.buckets);
        setActiveIndex(-1);
        setSorting(false);
        setSorted(true);
        setCurrentPhase("Completed");
        setStepExplanation(payload.stepExplanation);
        isSortingRef.current = false;
      }
    }
  };

  const reset = () => {
    isSortingRef.current = false;
    if (resolveRef.current) {
      resolveRef.current();
      resolveRef.current = null;
    }
    if (animationRef.current) clearTimeout(animationRef.current);
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
    onStart: radixSort,
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
        Visualize Radix Sort as it distributes elements into digit buckets pass by pass.
      </p>

      <div className="max-w-5xl mx-auto">
        {/* Controls */}
        <div className="bg-white dark:bg-neutral-950 p-4 sm:p-6 rounded-lg shadow-md mb-6 border border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
            <div className="flex flex-col gap-1">
              <ArrayGenerator
                onGenerate={(newArray) => { setArray(newArray); setSorted(false); resetStats(); }}
                disabled={sorting}
                isPrimary={array.length === 0}
              />
              <CustomArrayInput
                onUseCustomArray={(newArray) => { setArray(newArray); setSorted(false); resetStats(); }}
                disabled={sorting}
                className="w-full"
              />
            </div>
            <div className="flex flex-col gap-2 justify-between">
              <button
                onClick={radixSort}
                disabled={!array.length || sorting || sorted}
                className="w-full disabled:opacity-75 bg-none bg-[#a435f0] hover:bg-[#8f2cd6] px-4 py-2 rounded shadow-sm transition-all duration-300 text-sm sm:text-base text-white"
              >
                {sorting ? "Sorting..." : "Start Radix Sort"}
              </button>
              <button
                onClick={reset}
                className="w-full bg-none text-[#a435f0] border border-[#a435f0] hover:bg-[#f3e8ff] dark:hover:bg-[#a435f0]/20 px-4 py-2 rounded transition-colors text-sm sm:text-base"
              >
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
              <input
                type="range" min="0.5" max="5" step="0.5" value={speed}
                onChange={(e) => setSpeed(parseFloat(e.target.value))}
                className="w-24 sm:w-32"
                disabled={sorting}
              />
              <span className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">{speed}x</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 text-sm mt-2">
            <div className="bg-gray-100 dark:bg-neutral-900 p-3 rounded">
              <div className="font-medium">Digit Reads:</div>
              <div className="text-2xl">{comparisons}</div>
            </div>
            <div className="bg-gray-100 dark:bg-neutral-900 p-3 rounded">
              <div className="font-medium">Placements:</div>
              <div className="text-2xl">{swaps}</div>
            </div>
          </div>

          <div className="bg-gray-100 dark:bg-neutral-900 p-3 rounded mt-2">
            <div className="font-medium">Step:</div>
            <div className="text-xl font-bold">{totalSteps > 0 ? `${currentStep} / ${totalSteps}` : "—"}</div>
          </div>

          <div className="bg-gray-100 dark:bg-neutral-900 p-3 rounded mt-2">
            <div className="font-medium">Phase:</div>
            <div className="text-sm sm:text-base text-gray-800 dark:text-gray-200">{currentPhase || (sorted ? "Completed" : "Ready to start")}</div>
            <div className="font-medium mt-2">Explanation:</div>
            <div className="text-sm text-gray-700 dark:text-gray-300 mt-1">
              {stepExplanation || (sorted ? "Array is fully sorted." : "Run the algorithm to see step-by-step hints.")}
            </div>
          </div>
        </div>

        {/* Array display */}
        <div className="bg-white dark:bg-neutral-950 p-4 sm:p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 mb-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">Current Array</h2>
          {array.length > 0 ? (
            <div className="flex flex-wrap gap-3 justify-center">
              {array.map((value, index) => {
                const isActive = index === activeIndex;
                return (
                  <div key={index} className="flex flex-col items-center">
                    <div
                      className={`w-14 h-14 flex items-center justify-center rounded-lg border-2 ${getFontSize(value)} font-bold transition-all duration-300 ${
                        isActive
                          ? "bg-yellow-400 border-yellow-600 dark:bg-yellow-500 dark:border-yellow-700"
                          : sorted
                          ? "bg-green-400 border-green-600 dark:bg-green-500 dark:border-green-700"
                          : "bg-primary/80 border-primary"
                      }`}
                    >
                      {value}
                    </div>
                    <div className="mt-1 text-xs text-gray-600 dark:text-gray-400">{index}</div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">Generate or enter an array to begin</div>
          )}
        </div>

        {/* Buckets display */}
        <div className="bg-white dark:bg-neutral-950 p-4 sm:p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">Digit Buckets (0–9)</h2>
          {sorting || sorted ? (
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
              {buckets.map((bucket, b) => (
                <div key={b} className="flex flex-col items-center">
                  <div className="w-full text-center font-bold text-xs sm:text-sm mb-1 text-primary">{b}</div>
                  <div className="w-full min-h-[80px] bg-gray-100 dark:bg-neutral-900 rounded-lg border border-gray-300 dark:border-gray-600 flex flex-col-reverse items-center gap-1 p-1">
                    {bucket.map((val, idx) => (
                      <div
                        key={idx}
                        className={`w-full text-center rounded text-xs font-semibold py-0.5 px-1 transition-all duration-200 ${
                          getFontSize(val)
                        } bg-purple-400 dark:bg-purple-600 text-white`}
                      >
                        {val}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Buckets 0–9 will fill during each digit pass.
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default RadixSortVisualizer;
