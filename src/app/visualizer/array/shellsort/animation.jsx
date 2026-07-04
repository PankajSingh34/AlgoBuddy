"use client";
import React, { useState, useMemo, useCallback } from "react";
import { gsap } from "gsap";
import ArrayGenerator from "@/app/components/ui/randomArray";
import CustomArrayInput from "@/app/components/ui/customArrayInput";
import useVisualizerKeyboard from "@/app/hooks/useVisualizerKeyboard";
import PlaybackControls from "@/app/components/ui/PlaybackControls";
import { shellSortGenerator } from "@/features/algorithms/array/shellSortLogic";
import { useAnimationEngine } from "@/lib/visualizer/useAnimationEngine";

const getFontSize = (value) => {
  const len = String(value).length;
  if (len <= 2) return "text-lg";
  if (len === 3) return "text-sm";
  return "text-xs";
};

const precomputeSteps = (inputArray) => {
    const steps = [];
    const generator = shellSortGenerator(inputArray);

    for (const frame of generator) {
        const { type, payload } = frame;
        const lastStep = steps[steps.length - 1] || { array: [...inputArray], comparisons: 0, swaps: 0, currentStep: 0, currentIndices: {}, currentPhase: "", stepExplanation: "", sorted: false, totalSteps: 0 };

        switch (type) {
            case 'init':
                steps.push({
                    ...lastStep,
                    array: [...inputArray],
                    stepExplanation: "Starting Shell Sort...",
                    totalSteps: payload.totalSteps,
                });
                break;
            case 'gap_start':
                steps.push({
                    ...lastStep,
                    array: [...lastStep.array],
                    currentStep: payload.step,
                    currentIndices: { ...lastStep.currentIndices, currentGap: payload.gap },
                    currentPhase: `Sorting with gap = ${payload.gap}`,
                    stepExplanation: `Starting a pass with a gap of ${payload.gap}.`,
                    totalSteps: payload.totalSteps,
                });
                break;
            case 'outer_loop':
                steps.push({
                    ...lastStep,
                    array: [...lastStep.array],
                    currentStep: payload.step,
                    currentIndices: { ...lastStep.currentIndices, i: payload.i, temp: payload.temp },
                    currentPhase: `Sorting with gap = ${payload.gap}`,
                    stepExplanation: `Picking element at index ${payload.i} (value: ${payload.temp}) for gapped insertion.`,
                    totalSteps: payload.totalSteps,
                });
                break;
            case 'comparing':
                steps.push({
                    ...lastStep,
                    array: [...lastStep.array],
                    comparisons: payload.comparisons,
                    currentStep: payload.step,
                    currentIndices: { ...lastStep.currentIndices, j: payload.j, compareTo: payload.j - payload.gap },
                    stepExplanation: `Comparing ${payload.temp} with element at index ${payload.j - payload.gap} (value: ${payload.arr[payload.j - payload.gap]}).`,
                    totalSteps: payload.totalSteps,
                });
                break;
            case 'shift':
                steps.push({
                    ...lastStep,
                    array: [...payload.arr],
                    swaps: payload.swaps,
                    currentStep: payload.step,
                    currentIndices: { ...lastStep.currentIndices, j: payload.j - payload.gap },
                    stepExplanation: `Shifting ${payload.arr[payload.j]} from index ${payload.j} to ${payload.j + payload.gap}.`,
                    isSwapped: true,
                    totalSteps: payload.totalSteps,
                });
                break;
            case 'insertion':
                steps.push({
                    ...lastStep,
                    array: [...payload.arr],
                    swaps: payload.swaps,
                    currentStep: payload.step,
                    currentIndices: { ...lastStep.currentIndices, i: -1, j: -1, temp: null, compareTo: -1 },
                    stepExplanation: `Inserting ${payload.temp} at its correct sorted position: index ${payload.j}.`,
                    isSwapped: true,
                    totalSteps: payload.totalSteps,
                });
                break;
            case 'completed':
                steps.push({
                    ...lastStep,
                    array: [...payload.arr],
                    currentStep: payload.step,
                    currentIndices: { currentGap: -1, i: -1, j: -1, temp: null, compareTo: -1 },
                    currentPhase: "Completed",
                    stepExplanation: "Array is fully sorted.",
                    sorted: true,
                    totalSteps: payload.totalSteps,
                });
                break;
        }
    }
    return steps;
};

const ShellSortVisualizer = () => {
  const [array, setArray] = useState([]);

  const [visualState, setVisualState] = useState({
    comparisons: 0, swaps: 0, 
    currentIndices: { currentGap: -1, i: -1, j: -1, temp: null, compareTo: -1 },
    currentPhase: "", stepExplanation: "", sorted: false, totalSteps: 0,
  });

  const steps = useMemo(() => {
    if (array.length === 0) return [];
    return precomputeSteps(array);
  }, [array]);

  const onStep = useCallback((step) => {
    setVisualState({
      comparisons: step.comparisons,
      swaps: step.swaps,
      currentIndices: step.currentIndices,
      currentPhase: step.currentPhase,
      stepExplanation: step.stepExplanation,
      sorted: step.sorted,
      totalSteps: step.totalSteps,
    });

    if (step.isSwapped) {
      const bars = document.querySelectorAll(".array-bar");
      if (bars.length > 0) {
        gsap.fromTo(
          bars,
          { scale: 1, opacity: 0.8 },
          { scale: 1.05, opacity: 1, duration: 0.2, stagger: 0.05, yoyo: true, repeat: 1 }
        );
      }
    }
  }, []);

  const engine = useAnimationEngine({ steps, onStep, initialSpeed: 500 });
  const currentStepData = steps[engine.currentStep];

  const handleStart = useCallback(() => {
    if (currentStepData?.sorted) {
      engine.reset();
      setTimeout(() => engine.play(), 50);
    } else {
      engine.play();
    }
  }, [engine, currentStepData]);

  const handleReset = useCallback(() => {
    setVisualState({
      comparisons: 0, swaps: 0, 
      currentIndices: { currentGap: -1, i: -1, j: -1, temp: null, compareTo: -1 },
      currentPhase: "", stepExplanation: "", sorted: false, totalSteps: 0,
    });
    engine.reset();
  }, [engine]);

  useVisualizerKeyboard({
    onStart: handleStart,
    onReset: handleReset,
    onSpeedChange: (s) => engine.setSpeed(s * 1000),
    onTogglePlayPause: engine.isPlaying ? engine.pause : handleStart,
    speed: engine.speed / 500,
    sorting: engine.isPlaying,
    sorted: currentStepData?.sorted || false,
  });

  const handleExplainStep = () => {
    const prompt = `I am currently looking at the Shell Sort algorithm, at step ${engine.currentStep} of ${steps.length}.
Phase: ${visualState.currentPhase}
Explanation on screen: ${visualState.stepExplanation}
Current Array State: [${currentStepData?.array?.join(", ") || array.join(", ")}]
Current Gap: ${visualState.currentIndices.currentGap}
Outer loop index (i): ${visualState.currentIndices.i}
Inner loop index (j): ${visualState.currentIndices.j}
Please explain exactly what is happening in this step in detail.`;
    
    window.dispatchEvent(
      new CustomEvent("chatbot-explain", { detail: { prompt } })
    );
  };

  return (
    <main className="container mx-auto px-6 pt-4 pb-6">
      <p className="text-lg text-center text-gray-600 dark:text-gray-400 mb-8">
        Visualize Shell Sort&apos;s diminishing increment sorting approach.
      </p>

      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-neutral-950 p-4 sm:p-6 rounded-lg shadow-md mb-6 md:mb-8 border border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <ArrayGenerator
                onGenerate={(newArray) => {
                  setArray(newArray);
                  handleReset();
                }}
                disabled={engine.isPlaying}
                isPrimary={array.length === 0}
              />
              <CustomArrayInput
                onUseCustomArray={(newArray) => {
                  setArray(newArray);
                  handleReset();
                }}
                disabled={engine.isPlaying}
                currentArray={array}
              />
            </div>
            <div className="flex flex-col gap-2">
              <button
                onClick={handleStart}
                disabled={!array.length}
                className="w-full disabled:opacity-75 bg-none bg-[#a435f0] hover:bg-[#8f2cd6] px-4 py-2 rounded shadow-sm transition-all duration-300 text-sm sm:text-base text-white"
              >
                {engine.isPlaying ? "Sorting..." : currentStepData?.sorted ? "Restart" : "Start Shell Sort"}
              </button>
              <button
                onClick={handleReset}
                disabled={engine.isPlaying}
                className="w-full bg-none text-[#a435f0] border border-[#a435f0] hover:bg-[#f3e8ff] dark:hover:bg-[#a435f0]/20 px-4 py-2 rounded transition-colors text-sm sm:text-base"
              >
                Reset All
              </button>
            </div>
          </div>
          
          {engine.isPlaying && (
            <PlaybackControls
              isPlaying={engine.isPlaying}
              onPlayPause={engine.isPlaying ? engine.pause : handleStart}
              speed={engine.speed / 500}
              onSpeedChange={(s) => engine.setSpeed(s * 500)}
              onStepForward={engine.stepForward}
              onStepBackward={engine.stepBackward}
              onReset={engine.reset}
              onExplainStep={handleExplainStep}
              disabled={steps.length === 0}
            />
          )}

          {!engine.isPlaying && (
            <div className="flex items-center gap-4 mb-4">
              <span className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">Speed:</span>
              <input
                type="range"
                min="0.5"
                max="5"
                step="0.5"
                value={engine.speed / 500}
                onChange={(e) => engine.setSpeed(parseFloat(e.target.value) * 500)}
                className="w-24 sm:w-32"
              />
              <span className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">{engine.speed / 500}x</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-gray-100 dark:bg-neutral-900 p-3 rounded">
              <div className="font-medium">Comparisons:</div>
              <div className="text-2xl">{visualState.comparisons}</div>
            </div>
            <div className="bg-gray-100 dark:bg-neutral-900 p-3 rounded">
              <div className="font-medium">Swaps:</div>
              <div className="text-2xl">{visualState.swaps}</div>
            </div>
          </div>
          <div className="col-span-2 bg-gray-100 dark:bg-neutral-900 p-3 rounded mt-2">
            <div className="font-medium">Step:</div>
            <div className="text-xl font-bold">
              {visualState.totalSteps > 0 ? `${engine.currentStep + 1} / ${steps.length}` : "—"}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {engine.currentStep > 0 && !visualState.sorted
                ? `Sorting with gap ${visualState.currentIndices.currentGap}`
                : visualState.sorted
                ? "Sorting complete!"
                : "Start sorting to see steps"}
            </div>
          </div>
          <div className="col-span-2 bg-gray-100 dark:bg-neutral-900 p-3 rounded mt-2">
            <div className="font-medium">Phase:</div>
            <div className="text-sm sm:text-base text-gray-800 dark:text-gray-200">
              {visualState.currentPhase || (visualState.sorted ? "Completed" : "Ready to start")}
            </div>
            <div className="font-medium mt-2">Explanation:</div>
            <div className="text-sm text-gray-700 dark:text-gray-300 mt-1">
              {visualState.stepExplanation || (visualState.sorted ? "Array is fully sorted." : "Run the algorithm to see educational hints.")}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-950 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4">Array Visualization</h2>
          {(currentStepData?.array || array).length > 0 ? (
            <div className="flex flex-wrap gap-4 justify-center">
              {(currentStepData?.array || array).map((value, index) => {
                const { i, j, compareTo, currentGap } = visualState.currentIndices;
                const isOuter = index === i;
                const isInner = index === j;
                const isCompareTo = index === compareTo;
                const isInGapSequence = currentGap > 0 && (index - i) % currentGap === 0 && index <= i;

                return (
                  <div key={index} className="flex flex-col items-center">
                    <div
                      className={`array-bar w-16 h-16 flex items-center justify-center rounded-lg border-2 transition-all duration-300 ${getFontSize(value)} font-medium
                            ${
                              isOuter
                                ? "bg-red-400 dark:bg-red-600 border-red-600 dark:border-red-400"
                                : isInner
                                ? "bg-yellow-400 dark:bg-yellow-600 border-yellow-600 dark:border-yellow-400"
                                : isCompareTo
                                ? "bg-primary/80 dark:bg-primary border-primary dark:border-primary/80"
                                : visualState.sorted
                                ? "bg-green-400 dark:bg-green-600 border-green-600 dark:border-green-400"
                                : isInGapSequence
                                ? "bg-purple-100 dark:bg-purple-900 border-purple-300 dark:border-purple-700"
                                : "bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                            }`}
                    >
                      {value}
                    </div>
                    <div className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                      {index}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              {engine.isPlaying ? "Sorting..." : "Generate or enter an array to begin"}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default ShellSortVisualizer;
