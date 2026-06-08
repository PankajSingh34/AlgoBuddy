"use client";
import React, { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import RandomArray from "@/app/components/ui/randomArray";
import CustomArrayInput from "@/app/components/ui/customArrayInput";
import useVisualizerKeyboard from "@/app/hooks/useVisualizerKeyboard";
import usePlayback from "@/app/hooks/usePlayback";
import PlaybackControls from "@/app/components/ui/PlaybackControls";
import useVisualizerReset from "@/app/hooks/useVisualizerReset";
import ChallengeModePanel, {
  createOptions,
  useSortingChallenge,
} from "@/app/visualizer/array/components/ChallengeMode";
import { insertionSortGenerator } from "@/features/algorithms/array/insertionSortLogic";

const getFontSize = (value) => {
  const len = String(value).length;
  if (len <= 2) return "text-lg";
  if (len === 3) return "text-sm";
  return "text-xs";
};

const createInsertionKeyQuestion = (arr, index) => {
  const correctLabel = `${arr[index]} (index ${index})`;
  const options = createOptions(correctLabel, [
    index > 0 ? `${arr[index - 1]} (index ${index - 1})` : null,
    index + 1 < arr.length ? `${arr[index + 1]} (index ${index + 1})` : null,
    "The first element",
  ]);

  return {
    prompt: "Which element will be inserted next?",
    options,
    correctOptionId: "correct",
    explanation: `Insertion Sort takes the element at index ${index}, ${arr[index]}, and inserts it into the sorted left side.`,
  };
};

const InsertionSortVisualizer = () => {
  const [array, setArray] = useState([]);
  const [sorting, setSorting] = useState(false);
  const [sorted, setSorted] = useState(false);
  const [challengeEnabled, setChallengeEnabled] = useState(false);
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
  const [shifts, setShifts] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [totalSteps, setTotalSteps] = useState(0);
  const [currentIndices, setCurrentIndices] = useState({ current: -1, comparing: -1, sortedUpTo: -1 });
  const [currentPhase, setCurrentPhase] = useState("");
  const [stepExplanation, setStepExplanation] = useState("");
  const animationRef = useRef(null);
  const barRefs = useRef([]);
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
    setShifts(0);
    setCurrentStep(0);
    setTotalSteps(0);
    setCurrentIndices({ i: -1, j: -1, key: -1 });
  });
  const {
    activeQuestion,
    askChallenge,
    resetChallengeStats,
    stats: challengeStats,
    submitAnswer,
  } = useSortingChallenge(challengeEnabled);

  // Helper: cancellable delay
  const cancellableDelay = async () => {
    await new Promise((resolve) => {
      resolveRef.current = resolve;
      animationRef.current = setTimeout(resolve, 1000 / speedRef.current);
    });
    await checkPause();
  };

  const resetStats = () => {
    setComparisons(0);
    setShifts(0);
    setCurrentStep(0);
    setTotalSteps(0);
    setCurrentIndices({ current: -1, comparing: -1, sortedUpTo: -1 });
    setCurrentPhase("");
    setStepExplanation("");
    resetChallengeStats();
    if (animationRef.current) clearTimeout(animationRef.current);
  };

  const insertionSort = async () => {
    if (sorted || sorting || array.length === 0) return;
    isSortingRef.current = true;
    resolveRef.current = null;
    setSorting(true);

    // reset bar positions
    barRefs.current.forEach((bar) => bar && gsap.set(bar, { x: 0, y: 0 }));

    const generator = insertionSortGenerator(array);
    let previousCurrentIndices = { current: 1, comparing: 0, sortedUpTo: 0 };
    setCurrentIndices(previousCurrentIndices);
    await cancellableDelay();
    if (!isSortingRef.current) return;

    for (const frame of generator) {
      if (!isSortingRef.current) return;
      const { type, payload } = frame;

      if (type === 'init') {
        setTotalSteps(payload.totalSteps);
        setCurrentStep(0);
      }
      else if (type === 'phase_start') {
        setCurrentPhase(`Pass ${payload.pass} of ${payload.totalPasses}`);
        setStepExplanation(`Inserting ${payload.current} from index ${payload.i} into the sorted portion on the left.`);
        previousCurrentIndices = { current: payload.i, comparing: payload.j, sortedUpTo: payload.i - 1 };
        setCurrentIndices(previousCurrentIndices);

        await askChallenge(createInsertionKeyQuestion(payload.arr, payload.i));
        if (!isSortingRef.current) return;
        await cancellableDelay();
      }
      else if (type === 'comparing') {
        setStepExplanation(`Comparing ${payload.current} with ${payload.arr[payload.j]} at index ${payload.j}.`);
        setComparisons(payload.comparisons);
        setCurrentStep(payload.step);
      }
      else if (type === 'shifting') {
        setShifts(payload.shifts);
        setArray(payload.arr);
        
        // animate shift
        const movingBar = barRefs.current[payload.j + 1];
        if (movingBar) {
          await gsap.to(movingBar, { y: -20, duration: 0.2 });
          await gsap.to(movingBar, { x: "+=70", duration: 0.3, ease: "power2.inOut" });
          await gsap.to(movingBar, { y: 0, duration: 0.2 });
          gsap.set(movingBar, { clearProps: "transform" });
        }
        
        setStepExplanation(`Since ${payload.arr[payload.j+1]} > ${payload.current}, moving ${payload.arr[payload.j+1]} one position ahead.`);
        await cancellableDelay();
        if (!isSortingRef.current) return;
        
        previousCurrentIndices = { current: payload.i, comparing: payload.j - 1, sortedUpTo: payload.i - 1 };
        setCurrentIndices(previousCurrentIndices);
      }
      else if (type === 'found_insertion_point') {
        if (payload.j >= 0) {
          setStepExplanation(`Found insertion point for ${payload.current} at index ${payload.j + 1}.`);
        } else {
          setStepExplanation(`Reached the beginning of the sorted portion. Inserting ${payload.current} at index ${payload.j + 1}.`);
        }
        await cancellableDelay();
      }
      else if (type === 'inserted') {
        setArray(payload.arr);
        const insertBar = barRefs.current[payload.i];
        if (insertBar) {
          const moveX = (payload.j + 1 - payload.i) * 70;
          await gsap.to(insertBar, { y: -20, duration: 0.2 });
          await gsap.to(insertBar, { x: moveX, duration: 0.3, ease: "power2.inOut" });
          await gsap.to(insertBar, { y: 0, duration: 0.2 });
          gsap.set(insertBar, { clearProps: "transform" });
        }
        setStepExplanation(`Placed ${payload.current} into the sorted portion at index ${payload.j + 1}.`);
        await cancellableDelay();
      }
      else if (type === 'completed') {
        setSorting(false);
        setSorted(true);
        isSortingRef.current = false;
        setCurrentPhase("Completed");
        setStepExplanation("Array is fully sorted.");
        setCurrentIndices({ current: -1, comparing: -1, sortedUpTo: payload.arr.length - 1 });
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

  // keyboard shortcuts
  useVisualizerKeyboard({
    onStart:       insertionSort,
    onReset:       reset,
    onSpeedChange: setSpeed,
    onTogglePlayPause: togglePlayPause,
    speed,
    sorting,
    sorted,
  });

  const handleExplainStep = () => {
    const prompt = `I am currently looking at the Insertion Sort algorithm, at step ${currentStep} of ${totalSteps}.
Phase: ${currentPhase}
Explanation on screen: ${stepExplanation}
Current Array State: [${array.join(", ")}]
Currently inserting index: ${currentIndices.current}
Currently comparing with index: ${currentIndices.comparing}
Sorted up to index: ${currentIndices.sortedUpTo}

Please explain exactly what is happening in this step in detail.`;
    
    window.dispatchEvent(
      new CustomEvent("chatbot-explain", { detail: { prompt } })
    );
  };

  return (
    <main className="container mx-auto px-6 pb-6">
      <p className="text-lg text-center text-gray-600 dark:text-gray-400 mb-8">
        Visualize how Insertion Sort builds the final sorted array.
      </p>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-neutral-950 p-4 sm:p-6 rounded-lg shadow-md mb-6 md:mb-8 border border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
            <div className="flex flex-col gap-1">
              <RandomArray onGenerate={(newArray) => { setArray(newArray); setSorted(false); resetStats(); }} disabled={sorting} isPrimary={array.length === 0} />
              <CustomArrayInput 
                onUseCustomArray={(newArray) => { 
                  setArray(newArray); 
                  setSorted(false); 
                  resetStats(); }} 
                    disabled={sorting}   
                    currentArray={array}  
              className="w-full" />
            </div>
            <div className="flex flex-col gap-2 justify-between">
              <button onClick={insertionSort} disabled={!array.length || sorting || sorted} className="w-full disabled:opacity-75 bg-none bg-[#a435f0] hover:bg-[#8f2cd6] px-4 py-2 rounded shadow-sm transition-all duration-300 text-sm sm:text-base text-white">
                {sorting ? "Sorting..." : "Start Insertion Sort"}
              </button>
              <button 
                onClick={reset} disabled={sorting} className="w-full bg-none text-[#a435f0] border border-[#a435f0] hover:bg-[#f3e8ff] dark:hover:bg-[#a435f0]/20 px-4 py-2 rounded transition-colors text-sm sm:text-base">
                Reset All
              </button>
            </div>
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
          <ChallengeModePanel
            activeQuestion={activeQuestion}
            disabled={sorting}
            enabled={challengeEnabled}
            onEnabledChange={setChallengeEnabled}
            onResetStats={resetChallengeStats}
            onSubmitAnswer={submitAnswer}
            stats={challengeStats}
          />
          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded"><div className="font-medium">Comparisons:</div><div className="text-2xl">{comparisons}</div></div>
            <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded"><div className="font-medium">Shifts:</div><div className="text-2xl">{shifts}</div></div>
          </div>
          <div className="col-span-2 bg-gray-100 dark:bg-neutral-900 p-3 rounded mt-2">
            <div className="font-medium">Step:</div>
            <div className="text-xl font-bold">{totalSteps > 0 ? `${currentStep} / ${totalSteps}` : '—'}</div>
            <div className="text-xs text-gray-500 mt-1">{currentStep > 0 && !sorted ? `Inserting element at index ${currentIndices.current}` : sorted ? 'Sorting complete!' : 'Start sorting to see steps'}</div>
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
        {/* Visualization */}
        <div className="bg-white dark:bg-neutral-950 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4">Array Visualization</h2>
          {array.length > 0 ? (
            <div className="flex flex-wrap gap-4 justify-center">
              {array.map((value, index) => {
                const isCurrent = index === currentIndices.current;
                const isComparing = index === currentIndices.comparing;
                const isSorted = sorted || index <= currentIndices.sortedUpTo;
                return (
                  <div key={index} className="flex flex-col items-center">
                    <div
                      ref={(el) => (barRefs.current[index] = el)}
                      className={`bar w-16 h-16 flex items-center justify-center rounded-lg border-2 transition-all duration-300 ${getFontSize(value)} font-medium
                            ${
                              isCurrent
                                ? "bg-yellow-400 dark:bg-yellow-400 border-yellow-600 dark:border-yellow-600 dark:text-gray-800"
                                : isComparing
                                ? "bg-red-400 dark:bg-red-400 border-red-600 dark:border-red-600 dark:text-gray-800"
                                : isSorted
                                ? "bg-green-400 dark:bg-green-400 border-green-600 dark:border-green-600 dark:text-gray-800"
                                : "bg-primary/80 dark:bg-primary/80 border-primary dark:border-primary dark:text-gray-800"
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
            <div className="text-center py-8 text-gray-500">{sorting ? "Sorting..." : "Generate or enter an array to begin"}</div>
          )}
        </div>
      </div>
    </main>
  );
};

export default InsertionSortVisualizer;
