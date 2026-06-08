"use client";
import React, { useState, useMemo, useCallback } from "react";
import { gsap } from "gsap";
import ArrayGenerator from "@/app/components/ui/randomArray";
import CustomArrayInput from "@/app/components/ui/customArrayInput";
import useVisualizerKeyboard from "@/app/hooks/useVisualizerKeyboard";
import PlaybackControls from "@/app/components/ui/PlaybackControls";
import ChallengeModePanel, {
  createOptions,
  useSortingChallenge,
} from "@/app/visualizer/array/components/ChallengeMode";
import { bubbleSortGenerator } from "@/features/algorithms/array/bubbleSortLogic";
import { useAnimationEngine } from "@/lib/visualizer/useAnimationEngine";

const getFontSize = (value) => {
  const len = String(value).length;
  if (len <= 2) return "text-lg";
  if (len === 3) return "text-sm";
  return "text-xs";
};

const createBubbleSwapQuestion = (arr, j) => {
  const correctLabel = `${arr[j]} and ${arr[j + 1]} (indices ${j} and ${j + 1})`;
  const options = createOptions(correctLabel, [
    j > 0 ? `${arr[j - 1]} and ${arr[j]} (indices ${j - 1} and ${j})` : null,
    j + 2 < arr.length ? `${arr[j + 1]} and ${arr[j + 2]} (indices ${j + 1} and ${j + 2})` : null,
    "No swap will happen",
  ]);
  return {
    prompt: "Which two elements will swap next?",
    options,
    correctOptionId: "correct",
    explanation: `${arr[j]} is greater than ${arr[j + 1]}, so Bubble Sort swaps adjacent indices ${j} and ${j + 1}.`,
  };
};

const precomputeSteps = (inputArray) => {
  const steps = [];
  const generator = bubbleSortGenerator(inputArray);
  for (const frame of generator) {
    const { type, payload } = frame;
    if (type === 'init') {
      steps.push({
        array: inputArray,
        comparisons: 0, swaps: 0, currentStep: 0,
        currentIndices: { i: -1, j: -1 },
        currentPhase: "", stepExplanation: "Starting Bubble Sort...",
        sorted: false, totalSteps: payload.totalSteps,
      });
    } else if (type === 'phase_start') {
      steps.push({
        array: payload.arr,
        comparisons: payload.comparisons,
        swaps: payload.swaps,
        currentStep: payload.step,
        currentIndices: { i: payload.j, j: payload.jNext },
        currentPhase: `Pass ${payload.pass} of ${payload.totalPasses}`,
        stepExplanation: `Starting pass ${payload.pass}, comparing adjacent elements.`,
        sorted: false,
        totalSteps: payload.totalSteps,
      });
    } else if (type === 'comparing') {
      steps.push({
        array: payload.arr,
        comparisons: payload.comparisons,
        swaps: payload.swaps,
        currentStep: payload.step,
        currentIndices: { i: payload.j, j: payload.jNext },
        currentPhase: payload.currentPhase || steps[steps.length - 1]?.currentPhase || "",
        stepExplanation: `Comparing ${payload.arr[payload.j]} and ${payload.arr[payload.jNext]} at indices ${payload.j} and ${payload.jNext}.`,
        sorted: false,
        totalSteps: payload.totalSteps,
      });
    } else if (type === 'swap_needed') {
      const prev = steps[steps.length - 1] || {};
      steps.push({
        array: payload.arr,
        comparisons: payload.comparisons,
        swaps: payload.swaps,
        currentStep: payload.step,
        currentIndices: { i: payload.j, j: payload.jNext },
        currentPhase: prev.currentPhase || "",
        stepExplanation: `Since ${payload.arr[payload.j]} > ${payload.arr[payload.jNext]}, swapping elements at indices ${payload.j} and ${payload.jNext}.`,
        sorted: false,
        totalSteps: payload.totalSteps,
        isSwap: true, swapJ: payload.j,
      });
    } else if (type === 'swapped') {
      steps.push({
        array: payload.arr,
        comparisons: payload.comparisons,
        swaps: payload.swaps,
        currentStep: payload.step,
        currentIndices: { i: -1, j: -1 },
        currentPhase: steps[steps.length - 1]?.currentPhase || "",
        stepExplanation: `Swapped. Array state: [${payload.arr.join(', ')}]`,
        sorted: false,
        totalSteps: payload.totalSteps,
      });
    } else if (type === 'no_swap') {
      steps.push({
        array: payload.arr,
        comparisons: payload.comparisons,
        swaps: payload.swaps,
        currentStep: payload.step,
        currentIndices: { i: -1, j: -1 },
        currentPhase: steps[steps.length - 1]?.currentPhase || "",
        stepExplanation: `No swap needed between ${payload.arr[payload.j]} and ${payload.arr[payload.jNext]}.`,
        sorted: false,
        totalSteps: payload.totalSteps,
      });
    } else if (type === 'early_completion') {
      steps.push({
        array: payload.arr,
        comparisons: payload.comparisons,
        swaps: payload.swaps,
        currentStep: payload.step,
        currentIndices: { i: -1, j: -1 },
        currentPhase: "Completion Check",
        stepExplanation: "No swaps occurred; the array is already sorted.",
        sorted: false,
        totalSteps: payload.totalSteps,
      });
    } else if (type === 'completed') {
      const last = steps[steps.length - 1] || {};
      steps.push({
        array: payload.arr || last.array || [],
        comparisons: payload.comparisons || last.comparisons,
        swaps: payload.swaps || last.swaps,
        currentStep: payload.step || last.currentStep || 0,
        currentIndices: { i: -1, j: -1 },
        currentPhase: "Completed",
        stepExplanation: "Array is fully sorted.",
        sorted: true,
        totalSteps: payload.totalSteps || last.totalSteps,
      });
    }
  }
  return steps;
};

const BubbleSortVisualizer = () => {
  const [array, setArray] = useState([]);
  const [challengeEnabled, setChallengeEnabled] = useState(false);
  const {
    activeQuestion,
    askChallenge,
    resetChallengeStats,
    stats: challengeStats,
    submitAnswer,
  } = useSortingChallenge(challengeEnabled);

  const [visualState, setVisualState] = useState({
    comparisons: 0, swaps: 0, currentIndices: { i: -1, j: -1 },
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
    if (step.isSwap && step.swapJ !== undefined) {
      const bars = document.querySelectorAll(".bar");
      const bar1 = bars[step.swapJ];
      const bar2 = bars[step.swapJ + 1];
      if (bar1 && bar2) {
        gsap.to(bar1, { x: "+=40", duration: 0.2, yoyo: true });
        gsap.to(bar2, { x: "-=40", duration: 0.2, yoyo: true });
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
      comparisons: 0, swaps: 0, currentIndices: { i: -1, j: -1 },
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
    const prompt = `I am currently looking at the Bubble Sort algorithm, at step ${engine.currentStep} of ${steps.length}.
Phase: ${visualState.currentPhase}
Explanation on screen: ${visualState.stepExplanation}
Current Array State: [${currentStepData?.array?.join(", ") || array.join(", ")}]
Currently comparing indices: i = ${visualState.currentIndices.i}, j = ${visualState.currentIndices.j}

Please explain exactly what is happening in this step in detail.`;

    window.dispatchEvent(
      new CustomEvent("chatbot-explain", { detail: { prompt } })
    );
  };

  return (
    <main className="container mx-auto px-6 pb-4">
      <p className="text-lg text-center text-gray-600 dark:text-gray-400 mb-8">
        Watch Bubble Sort in action as it repeatedly swaps adjacent elements to
        sort the array step by step.
      </p>

      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-neutral-950 p-4 sm:p-6 rounded-lg shadow-md mb-6 md:mb-8 border border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
            <div className="flex flex-col gap-1">
              <ArrayGenerator onGenerate={setArray} disabled={engine.isPlaying} isPrimary={array.length === 0} />
              <CustomArrayInput
                onUseCustomArray={(arr) => {
                  setArray(arr);
                  handleReset();
                }}
                disabled={engine.isPlaying}
                currentArray={array}
                className="w-full"
              />
            </div>
            <div className="flex flex-col gap-2 justify-between">
              <button
                onClick={handleStart}
                disabled={!array.length}
                className="w-full disabled:opacity-75 bg-none bg-[#a435f0] hover:bg-[#8f2cd6] px-4 py-2 rounded shadow-sm transition-all duration-300 text-sm sm:text-base text-white"
              >
                {engine.isPlaying ? "Playing..." : currentStepData?.sorted ? "Restart" : "Start Bubble Sort"}
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

          <ChallengeModePanel
            activeQuestion={activeQuestion}
            disabled={engine.isPlaying}
            enabled={challengeEnabled}
            onEnabledChange={setChallengeEnabled}
            onResetStats={resetChallengeStats}
            onSubmitAnswer={submitAnswer}
            stats={challengeStats}
          />

          <div className="grid grid-cols-2 gap-4 text-sm sm:text-base">
            <div className="bg-gray-100 dark:bg-neutral-900 p-3 rounded">
              <div className="font-medium">Comparisons:</div>
              <div className="text-xl sm:text-2xl">{visualState.comparisons}</div>
            </div>
            <div className="bg-gray-100 dark:bg-neutral-900 p-3 rounded">
              <div className="font-medium">Swaps:</div>
              <div className="text-xl sm:text-2xl">{visualState.swaps}</div>
            </div>
          </div>
          <div className="col-span-2 bg-gray-100 dark:bg-neutral-900 p-3 rounded mt-2">
            <div className="font-medium">Step:</div>
            <div className="text-xl font-bold">
              {visualState.totalSteps > 0 ? `${engine.currentStep + 1} / ${steps.length}` : "—"}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {engine.currentStep > 0 && !visualState.sorted
                ? `Comparing index ${visualState.currentIndices.i} and ${visualState.currentIndices.j}`
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

        <div className="bg-white dark:bg-neutral-950 p-4 sm:p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">Array Visualization</h2>
          {(currentStepData?.array || array).length > 0 ? (
            <div className="flex flex-wrap gap-2 sm:gap-4 justify-center">
              {((currentStepData?.array) || array).map((value, index) => {
                const isComparing = index === visualState.currentIndices.i || index === visualState.currentIndices.j;
                const isSorted = visualState.sorted;
                return (
                  <div key={index} className="flex flex-col items-center">
                    <div
                      className={`bar w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center rounded-lg border-2 shadow-md dark:shadow-blue-900 transition-all duration-300 ${getFontSize(value)} font-bold
                        ${isComparing
                          ? "bg-yellow-400 dark:bg-yellow-400 border-yellow-600 dark:border-yellow-600 dark:text-gray-900"
                          : isSorted
                          ? "bg-green-400 dark:bg-green-400 border-green-600 dark:border-green-600 dark:text-gray-900"
                          : "bg-primary/80 dark:bg-primary/80 border-primary dark:border-primary dark:text-gray-900"
                        }`}
                    >
                      {value}
                    </div>
                    <div className="mt-1 text-xs text-gray-700 dark:text-[#c27cf7] font-semibold">
                      {index === visualState.currentIndices.i && "i"}
                      {index === visualState.currentIndices.j && "j"}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 text-sm sm:text-base">
              {engine.isPlaying ? "Sorting..." : "Generate or enter an array to begin"}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default BubbleSortVisualizer;
