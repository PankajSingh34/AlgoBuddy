"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { gsap } from "gsap";
import ArrayGenerator from "@/app/components/ui/randomArray";
import CustomArrayInput from "@/app/components/ui/customArrayInput";
import { saveToStorage, loadFromStorage } from "@/utils/storage";
import useVisualizerKeyboard from "@/app/hooks/useVisualizerKeyboard";
import KeyboardShortcutsLegend from "@/app/components/ui/KeyboardShortcutsLegend";
import InteractiveChallengeModal from "@/app/components/ui/InteractiveChallengeModal";

const getFontSize = (value) => {
  const len = String(value).length;
  if (len <= 2) return "text-lg";
  if (len === 3) return "text-sm";
  return "text-xs";
};

const BubbleSortVisualizer = () => {
  const [sorting, setSorting] = useState(false);
  const [sorted, setSorted] = useState(false);
  const [array, setArray] = useState(() => loadFromStorage("bubble-array", []));
  const [speed, setSpeed] = useState(() => loadFromStorage("bubble-speed", 1));
  const [currentStep, setCurrentStep] = useState(0);
  const [totalSteps, setTotalSteps] = useState(0);
  const [comparisons, setComparisons] = useState(0);
  const [swaps, setSwaps] = useState(0);
  const [currentIndices, setCurrentIndices] = useState({ i: -1, j: -1 });
  const [challengeStats, setChallengeStats] = useState({ questionsAsked: 0, correctAnswers: 0 });
  const [challengeState, setChallengeState] = useState({
    open: false,
    question: "",
    options: [],
    selectedOption: null,
    answerIndex: 0,
    feedback: "",
  });

  useEffect(() => { saveToStorage("bubble-array", array); }, [array]);
  useEffect(() => { saveToStorage("bubble-speed", speed); }, [speed]);

  const animationRef = useRef(null);
  const isSortingRef = useRef(false);
  const resolveRef = useRef(null);

  const handleArrayGenerated = (newArray) => {
    setArray(newArray);
    setSorted(false);
    resetStats();
  };

  const resetStats = () => {
    setComparisons(0);
    setSwaps(0);
    setCurrentStep(0);
    setTotalSteps(0);
    setCurrentIndices({ i: -1, j: -1 });
    setChallengeStats({ questionsAsked: 0, correctAnswers: 0 });
    if (animationRef.current) clearTimeout(animationRef.current);
  };

  const cancellableDelay = () =>
    new Promise((resolve) => {
      resolveRef.current = resolve;
      animationRef.current = setTimeout(resolve, 1000 / speed);
    });

  const closeChallenge = () => {
    setChallengeState({
      open: false,
      question: "",
      options: [],
      selectedOption: null,
      answerIndex: 0,
      feedback: "",
    });
  };

  const askChallenge = (question, options, answerIndex) =>
    new Promise((resolve) => {
      setChallengeState({
        open: true,
        question,
        options,
        selectedOption: null,
        answerIndex,
        feedback: "",
      });
      challengeResolveRef.current = resolve;
    });

  const challengeResolveRef = useRef(null);

  const onChallengeSelect = (selectedOption) => {
    setChallengeState((prev) => ({ ...prev, selectedOption }));
  };

  const onChallengeSubmit = () => {
    if (challengeState.selectedOption === null) return;

    const isCorrect = challengeState.selectedOption === challengeState.answerIndex;
    const feedback = isCorrect
      ? "Correct! The animation will continue."
      : `Not quite. The correct answer was option ${challengeState.answerIndex + 1}.`;

    setChallengeStats((prev) => ({
      questionsAsked: prev.questionsAsked + 1,
      correctAnswers: prev.correctAnswers + (isCorrect ? 1 : 0),
    }));

    setChallengeState((prev) => ({
      ...prev,
      feedback,
      open: false,
    }));

    challengeResolveRef.current?.(isCorrect);
    challengeResolveRef.current = null;
  };

  const getBubblePairOptions = (arr, j, type = "compare") => {
    const optionLabel = (index) =>
      index >= 0 && index < arr.length ? `Index ${index}: ${arr[index]}` : "No element";

    const distractors = [
      [j - 1, j],
      [j + 1, j + 2],
      [j + 2, j + 3],
    ];

    const questionText =
      type === "swap"
        ? "Which pair was just swapped?"
        : "Which two elements will compare next?";

    const options = [
      `${optionLabel(j)} and ${optionLabel(j + 1)}`,
      `${optionLabel(distractors[0][0])} and ${optionLabel(distractors[0][1])}`,
      `${optionLabel(distractors[1][0])} and ${optionLabel(distractors[1][1])}`,
      `${optionLabel(distractors[2][0])} and ${optionLabel(distractors[2][1])}`,
    ];

    return { questionText, options };
  };

  const bubbleSort = async () => {
    if (sorted || sorting || array.length === 0) return;

    isSortingRef.current = true;
    setSorting(true);
    let arr = [...array];
    let n = arr.length;
    let tempSwaps = 0;
    let tempComparisons = 0;
    setTotalSteps(Math.floor((n * (n - 1)) / 2));
    setCurrentStep(0);

    for (let i = 0; i < n - 1; i++) {
      let swapped = false;

      for (let j = 0; j < n - i - 1; j++) {
        if (!isSortingRef.current) return;

        setCurrentIndices({ i: j, j: j + 1 });
        tempComparisons++;
        setComparisons(tempComparisons);
        setCurrentStep((prev) => prev + 1);

        const { questionText, options } = getBubblePairOptions(arr, j, "compare");
        await askChallenge(questionText, options, 0);
        if (!isSortingRef.current) return;

        await cancellableDelay();
        if (!isSortingRef.current) return;

        if (arr[j] > arr[j + 1]) {
          const bars = document.querySelectorAll(".bar");
          const bar1 = bars[j];
          const bar2 = bars[j + 1];
          if (bar1 && bar2) {
            await gsap.to(bar1, { x: "+=40", duration: 0.3, yoyo: true });
            await gsap.to(bar2, { x: "-=40", duration: 0.3, yoyo: true });
            await gsap.to([bar1, bar2], { x: "0", duration: 0 });
          }

          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          swapped = true;
          tempSwaps++;
          setSwaps(tempSwaps);
          setArray([...arr]);

          const swapQuestion = getBubblePairOptions(arr, j, "swap");
          await askChallenge(swapQuestion.questionText, swapQuestion.options, 0);
          if (!isSortingRef.current) return;

          await cancellableDelay();
          if (!isSortingRef.current) return;
        }
      }

      if (!swapped) break;
    }

    isSortingRef.current = false;
    setSorting(false);
    setSorted(true);
  };

  const reset = () => {
    isSortingRef.current = false;
    if (challengeResolveRef.current) {
      challengeResolveRef.current(false);
      challengeResolveRef.current = null;
    }
    closeChallenge();

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

  const handleStart = useCallback(() => {
    bubbleSort();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sorting, sorted, array, speed]);

  const handleReset = useCallback(() => {
    reset();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSpeedChange = useCallback((nextSpeed) => {
    setSpeed(nextSpeed);
  }, []);

  useVisualizerKeyboard({
    onStart: handleStart,
    onReset: handleReset,
    onSpeedChange: handleSpeedChange,
    speed,
    sorting,
    sorted,
  });

  const accuracy = challengeStats.questionsAsked === 0
    ? 0
    : Math.round((challengeStats.correctAnswers / challengeStats.questionsAsked) * 100);

  return (
    <main className="container mx-auto px-6 pb-4">
      <InteractiveChallengeModal
        open={challengeState.open}
        question={challengeState.question}
        options={challengeState.options}
        selectedOption={challengeState.selectedOption}
        onSelect={onChallengeSelect}
        onSubmit={onChallengeSubmit}
        totalQuestions={challengeStats.questionsAsked}
        correctAnswers={challengeStats.correctAnswers}
        feedback={challengeState.feedback}
      />

      <p className="text-lg text-center text-gray-600 dark:text-gray-400 mb-8">
        Watch Bubble Sort in action as it repeatedly swaps adjacent elements to
        sort the array step by step.
      </p>

      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-neutral-950 p-4 sm:p-6 rounded-lg shadow-md mb-6 md:mb-8 border border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
            <div className="flex flex-col gap-1">
              <ArrayGenerator onGenerate={handleArrayGenerated} disabled={sorting} />
              <CustomArrayInput
                onUseCustomArray={(arr) => {
                  setArray(arr);
                  setSorted(false);
                  resetStats();
                }}
                disabled={sorting}
                className="w-full"
              />
            </div>
            <div className="flex flex-col gap-2 justify-between">
              <button
                onClick={bubbleSort}
                disabled={!array.length || sorting || sorted}
                className="w-full disabled:opacity-75 bg-none bg-green-500 px-4 py-2 rounded shadow-sm transition-all duration-300 text-sm sm:text-base text-black"
              >
                {sorting ? "Sorting..." : "Start Bubble Sort"}
              </button>
              <button
                onClick={reset}
                className="w-full bg-none text-white bg-red-500 px-4 py-2 rounded transition-colors text-sm sm:text-base"
              >
                Reset All
              </button>
            </div>
          </div>

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
            <div className="ml-auto">
              <KeyboardShortcutsLegend />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm sm:text-base">
            <div className="bg-gray-100 dark:bg-neutral-900 p-3 rounded">
              <div className="font-medium">Comparisons:</div>
              <div className="text-xl sm:text-2xl">{comparisons}</div>
            </div>
            <div className="bg-gray-100 dark:bg-neutral-900 p-3 rounded">
              <div className="font-medium">Swaps:</div>
              <div className="text-xl sm:text-2xl">{swaps}</div>
            </div>
            <div className="bg-gray-100 dark:bg-neutral-900 p-3 rounded">
              <div className="font-medium">Challenge Score</div>
              <div className="text-xl sm:text-2xl">{accuracy}%</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {challengeStats.questionsAsked} asked • {challengeStats.correctAnswers} correct
              </div>
            </div>
          </div>

          <div className="col-span-2 bg-gray-100 dark:bg-neutral-900 p-3 rounded mt-2">
            <div className="font-medium">Step:</div>
            <div className="text-xl font-bold">
              {totalSteps > 0 ? `${currentStep} / ${totalSteps}` : "—"}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {currentStep > 0 && !sorted
                ? `Comparing index ${currentIndices.i} and ${currentIndices.j}`
                : sorted
                ? "Sorting complete!"
                : "Start sorting to see steps"}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-950 p-4 sm:p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">Array Visualization</h2>
          {array.length > 0 ? (
            <div className="flex flex-wrap gap-2 sm:gap-4 justify-center">
              {array.map((value, index) => {
                const isComparing = index === currentIndices.i || index === currentIndices.j;
                const isSorted = sorted;
                return (
                  <div key={index} className="flex flex-col items-center">
                    <div
                      className={`bar w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center rounded-lg border-2 shadow-md dark:shadow-blue-900 transition-all duration-300 ${getFontSize(value)} font-bold
                        ${isComparing
                          ? "bg-yellow-400 dark:bg-yellow-400 border-yellow-600 dark:border-yellow-600 dark:text-gray-900"
                          : isSorted
                          ? "bg-green-400 dark:bg-green-400 border-green-600 dark:border-green-600 dark:text-gray-900"
                          : "bg-blue-400 dark:bg-blue-400 border-blue-600 dark:border-blue-600 dark:text-gray-900"
                        }`}
                    >
                      {value}
                    </div>
                    <div className="mt-1 text-xs text-gray-700 dark:text-blue-300 font-semibold">
                      {index === currentIndices.i && "i"}
                      {index === currentIndices.j && "j"}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 text-sm sm:text-base">
              {sorting ? "Sorting..." : "Generate or enter an array to begin"}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default BubbleSortVisualizer;