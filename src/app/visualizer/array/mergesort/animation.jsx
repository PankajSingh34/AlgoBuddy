"use client";
import React, { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import ArrayGenerator from "@/app/components/ui/randomArray";
import CustomArrayInput from "@/app/components/ui/customArrayInput";
import useVisualizerKeyboard from "@/app/hooks/useVisualizerKeyboard";
import usePlayback from "@/app/hooks/usePlayback";
import PlaybackControls from "@/app/components/ui/PlaybackControls";
import useVisualizerReset from "@/app/hooks/useVisualizerReset";
import { mergeSortGenerator } from "@/features/algorithms/array/mergeSortLogic";

const getFontSize = (value) => {
  const len = String(value).length;
  if (len <= 2) return "text-lg";
  if (len === 3) return "text-sm";
  return "text-xs";
};

const MergeSortVisualizer = () => {
  const [array, setArray] = useState([]);
  const [sorting, setSorting] = useState(false);
  const [sorted, setSorted] = useState(false);
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
  const [comparisons, setComparisons] = useState(0);
  const [swaps, setSwaps] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [totalSteps, setTotalSteps] = useState(0);
  const [currentIndices, setCurrentIndices] = useState({
    left: -1,
    right: -1,
    mergeStart: -1,
    mergeEnd: -1,
    comparing: [],
    levels: [],
    currentLevel: -1,
    recursionPath: [],
    mid: -1,
  });
  const [currentPhase, setCurrentPhase] = useState("");
  const [stepExplanation, setStepExplanation] = useState("");

  const animationRef = useRef(null);
  const isSortingRef = useRef(false);
  const resolveRef = useRef(null);
  useVisualizerReset(() => {
    isSortingRef.current = false;
    if (resolveRef.current) { resolveRef.current(); resolveRef.current = null; }
    if (animationRef.current) clearTimeout(animationRef.current);
    setArray([]);
    setSorting(false);
    setSorted(false);
    setComparisons(0);
    setSwaps(0);
    setCurrentStep(0);
    setTotalSteps(0);
    setCurrentIndices({ left: -1, right: -1, mergeStart: -1, mergeEnd: -1, comparing: [], levels: [], currentLevel: -1 });
  });

  const cancellableDelay = async (ms) => {
    await new Promise((resolve) => {
      resolveRef.current = resolve;
      animationRef.current = setTimeout(() => {
        resolveRef.current = null;
        resolve();
      }, ms / speedRef.current);
    });
    await checkPause();
  };
  

  // Reset all stats and state
  const resetStats = () => {
    setComparisons(0);
    setSwaps(0);
    setCurrentStep(0);
    setTotalSteps(0);
    setCurrentIndices({
      left: -1,
      right: -1,
      mergeStart: -1,
      mergeEnd: -1,
      comparing: [],
      levels: [],
      currentLevel: -1,
      recursionPath: [],
      mid: -1,
    });
    setCurrentPhase("");
    setStepExplanation("");
    if (animationRef.current) {
      clearTimeout(animationRef.current);
    }
  };

  const mergeSort = async () => {
    if (sorted || sorting || array.length === 0) return;
    isSortingRef.current = true;
    setSorting(true);

    const generator = mergeSortGenerator(array);

    for (const frame of generator) {
      if (!isSortingRef.current) return;
      const { type, payload } = frame;

      if (type === 'init') {
        setTotalSteps(payload.totalSteps);
        setCurrentStep(0);
      }
      else if (type === 'divide') {
        setCurrentPhase("Divide Phase");
        setStepExplanation(`Splitting array range [${payload.l}, ${payload.r}] into [${payload.l}, ${payload.m}] and [${payload.m + 1}, ${payload.r}].`);
        setCurrentIndices((prev) => ({
          ...prev,
          currentLevel: payload.level,
          recursionPath: payload.currentPath,
          left: payload.l,
          right: payload.r,
          mid: payload.m,
        }));
        await cancellableDelay(1000);
      }
      else if (type === 'merge_start') {
        setCurrentPhase("Merge Phase");
        setStepExplanation(`Merging two sorted subarrays: [${payload.l}, ${payload.m}] and [${payload.m + 1}, ${payload.r}].`);
      }
      else if (type === 'comparing') {
        setCurrentIndices((prev) => ({
          ...prev,
          comparing: [payload.leftCompareIdx, payload.rightCompareIdx],
          mergeStart: payload.l,
          mergeEnd: payload.r,
        }));
        setStepExplanation(`Comparing ${payload.LVal} from the left subarray with ${payload.RVal} from the right subarray.`);
        setComparisons(payload.comparisons);
        setCurrentStep(payload.step);
        await cancellableDelay(1000);
      }
      else if (type === 'merged' || type === 'merged_remainder') {
        if (type === 'merged') {
          if (payload.fromLeft) {
            setStepExplanation(`Moving ${payload.val} from the left subarray into position ${payload.k}.`);
          } else {
            setStepExplanation(`Moving ${payload.val} from the right subarray into position ${payload.k}.`);
          }
        }
        setSwaps(payload.merges);
        setArray(payload.arr);
        
        // GSAP pop animation for the merged bar
        const bars = document.querySelectorAll(".bar");
        const bar = bars[payload.k];
        if (bar) {
          await gsap.to(bar, { scale: 1.2, duration: 0.2 });
          await gsap.to(bar, { scale: 1.0, duration: 0.2 });
        }
        
        await cancellableDelay(1000);
      }
      else if (type === 'completed') {
        setArray(payload.arr);
        setSorting(false);
        setSorted(true);
        setCurrentPhase("Completed");
        setStepExplanation("Array is fully sorted.");
        isSortingRef.current = false;
        setCurrentIndices({
          left: -1,
          right: -1,
          mergeStart: -1,
          mergeEnd: -1,
          comparing: [],
          levels: [],
          currentLevel: -1,
          recursionPath: [],
          mid: -1,
        });
      }
    }
  };

  // Reset all state and cancel pending delays
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

  // keyboard shortcuts
  useVisualizerKeyboard({
    onStart:       mergeSort,
    onReset:       reset,
    onSpeedChange: setSpeed,
    onTogglePlayPause: togglePlayPause,
    speed,
    sorting,
    sorted,
  });

  const isInCurrentRange = (index) => index >= currentIndices.left && index <= currentIndices.right;
  const isBeingMerged = (index) => index >= currentIndices.mergeStart && index <= currentIndices.mergeEnd;

  const handleExplainStep = () => {
    const prompt = `I am currently looking at the Merge Sort algorithm, at step ${currentStep} of ${totalSteps}.
Phase: ${currentPhase}
Explanation on screen: ${stepExplanation}
Current Array State: [${array.join(", ")}]
Left index: ${currentIndices.left}, Right index: ${currentIndices.right}, Mid: ${currentIndices.mid}
Currently comparing indices: [${currentIndices.comparing.join(", ")}]
Currently merging indices: ${currentIndices.mergeStart} to ${currentIndices.mergeEnd}

Please explain exactly what is happening in this step in detail.`;
    
    window.dispatchEvent(
      new CustomEvent("chatbot-explain", { detail: { prompt } })
    );
  };

  return (
    <main className="container mx-auto px-6 pt-2 pb-6">
      <p className="text-lg text-center text-gray-600 dark:text-gray-400 mb-8">
        Visualize the divide-and-conquer approach of Merge Sort with recursive splitting and merging.
      </p>
      <div className="max-w-4xl mx-auto">
        {/* Controls */}
        <div className="bg-white dark:bg-neutral-950 p-4 sm:p-6 rounded-lg shadow-md mb-6 md:mb-8 border border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <ArrayGenerator
                onGenerate={(newArray) => {
                  setArray(newArray);
                  setSorted(false);
                  resetStats();
                }}
                disabled={sorting}
                isPrimary={array.length === 0}
              />
              <CustomArrayInput
                onUseCustomArray={(newArray) => {
                  setArray(newArray);
                  setSorted(false);
                  resetStats();
                }}
                disabled={sorting}
                currentArray={array}
                className="mb-4"
              />
            </div>
            <div className="flex flex-col gap-2">
              <button
                onClick={mergeSort}
                disabled={!array.length || sorting || sorted}
                className="w-full disabled:opacity-75 bg-none bg-[#a435f0] hover:bg-[#8f2cd6] px-4 py-2 rounded shadow-sm transition-all duration-300 text-sm sm:text-base text-white"
              >
                {sorting ? "Sorting..." : "Start Merge Sort"}
              </button>
              <button
                onClick={reset}
                disabled={sorting}
                className="w-full bg-none text-[#a435f0] border border-[#a435f0] hover:bg-[#f3e8ff] dark:hover:bg-[#a435f0]/20 px-4 py-2 rounded transition-colors text-sm sm:text-base"
              >
                Reset All
              </button>
            </div>
          </div>

          {/* Main Array Visualization */}
          <div className="bg-white dark:bg-neutral-950 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold mb-4">Main Array</h2>
            {array.length > 0 ? (
              <div className="flex flex-wrap gap-4 justify-center">
                {array.map((value, index) => {
                  const isComparing = currentIndices.comparing.includes(index);
                  const isInRange = isInCurrentRange(index);
                  const isMerging = isBeingMerged(index);
                  const isSorted = sorted;

                  return (
                    <div key={index} className="flex flex-col items-center">
                      <div
                        className={`w-16 h-16 flex items-center justify-center rounded-lg border-2 transition-all duration-300 ${getFontSize(value)} font-medium
                            ${
                              isComparing
                                ? "bg-red-400 dark:bg-red-400 border-red-600 dark:border-red-600 text-gray-800"
                                : isMerging
                                ? "bg-green-400 dark:bg-green-400 border-green-600 dark:border-green-600 text-gray-800"
                                : isInRange
                                ? "bg-yellow-400 dark:bg-yellow-400 border-yellow-600 dark:border-yellow-600 text-gray-800"
                                : isSorted
                                ? "bg-green-400 dark:bg-green-400 border-green-600 dark:border-green-600 text-gray-800"
                                : "bg-primary/80 dark:bg-primary border-primary dark:border-primary text-gray-800"
                            }`}
                      >
                        {value}
                      </div>
                      <div className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                        {index}
                        {isComparing && " (comparing)"}
                        {isMerging && !isComparing && " (merging)"}
                        {isInRange &&
                          !isMerging &&
                          !isComparing &&
                          " (current)"}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                {sorting ? "Sorting..." : "Generate or enter an array to begin"}
              </div>
            )}
          </div>

          {/* Playback & Speed controls */}
          {sorting && (
            <PlaybackControls
              isPaused={isPaused}
              onTogglePlayPause={togglePlayPause}
              speed={speed}
              onSpeedChange={setSpeed}
              onExplainStep={handleExplainStep}
            />
          )}

          {!sorting && (
            <div className="flex items-center gap-4 mb-4">
              <span className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">Speed:</span>
              <input
                type="range"
                min="0.5"
                max="5"
                step="0.5"
                value={speed}
                onChange={(e) => setSpeed(parseFloat(e.target.value))}
                className="w-24 sm:w-32"
                disabled={sorting}
              />
              <span className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">{speed}x</span>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-gray-100 dark:bg-neutral-900 p-3 rounded">
              <div className="font-medium">Comparisons:</div>
              <div className="text-2xl">{comparisons}</div>
            </div>
            <div className="bg-gray-100 dark:bg-neutral-900 p-3 rounded">
              <div className="font-medium">Merges:</div>
              <div className="text-2xl">{swaps}</div>
            </div>
          </div>
          <div className="col-span-2 bg-gray-100 dark:bg-neutral-900 p-3 rounded mt-2">
            <div className="font-medium">Step:</div>
            <div className="text-xl font-bold">
              {totalSteps > 0 ? `${currentStep} / ${totalSteps}` : '—'}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {currentStep > 0 && !sorted
                ? `Merging elements at index ${currentIndices.mergeStart} to ${currentIndices.mergeEnd}`
                : sorted
                ? 'Sorting complete!'
                : 'Start sorting to see steps'}
            </div>
          </div>
          <div className="col-span-2 bg-gray-100 dark:bg-neutral-900 p-3 rounded mt-2">
            <div className="font-medium">Phase:</div>
            <div className="text-sm sm:text-base text-gray-800 dark:text-gray-200">
              {currentPhase || (sorted ? 'Completed' : 'Ready to start')}
            </div>
            <div className="font-medium mt-2">Explanation:</div>
            <div className="text-sm text-gray-700 dark:text-gray-300 mt-1">
              {stepExplanation || (sorted ? 'Array is fully sorted.' : 'Run the algorithm to see educational hints.')}
            </div>
          </div>
        </div>
        {/* Main Array Visualization */}
        <div className="bg-white dark:bg-neutral-950 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4">Main Array</h2>
          {array.length > 0 ? (
            <div className="flex flex-wrap gap-4 justify-center">
              {array.map((value, index) => {
                const isComparing = currentIndices.comparing.includes(index);
                const isInRange = isInCurrentRange(index);
                const isMerging = isBeingMerged(index);
                const isSorted = sorted;
                return (
                  <div key={index} className="flex flex-col items-center">
                    <div
                      className={`bar w-16 h-16 flex items-center justify-center rounded-lg border-2 transition-all duration-300 text-lg font-medium
                        ${
                          isComparing
                            ? "bg-red-400 dark:bg-red-400 border-red-600 dark:border-red-600 text-gray-800"
                            : isMerging
                            ? "bg-green-400 dark:bg-green-400 border-green-600 dark:border-green-600 text-gray-800"
                            : isInRange
                            ? "bg-yellow-400 dark:bg-yellow-400 border-yellow-600 dark:border-yellow-600 text-gray-800"
                            : isSorted
                            ? "bg-green-400 dark:bg-green-400 border-green-600 dark:border-green-600 text-gray-800"
                            : "bg-primary/80 dark:bg-primary border-primary dark:border-primary text-gray-800"
                        }`}
                    >
                      {value}
                    </div>
                    <div className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                      {index}
                      {isComparing && " (comparing)"}
                      {isMerging && !isComparing && " (merging)"}
                      {isInRange && !isMerging && !isComparing && " (current)"}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              {sorting ? "Sorting..." : "Generate or enter an array to begin"}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default MergeSortVisualizer;
