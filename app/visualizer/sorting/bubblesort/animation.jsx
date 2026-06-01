"use client";

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";

import { gsap } from "gsap";

import ArrayGenerator from "@/app/components/ui/randomArray";
import CustomArrayInput from "@/app/components/ui/customArrayInput";

import {
  saveToStorage,
  loadFromStorage,
  removeFromStorage,
} from "@/utils/storage";

import useVisualizerKeyboard from "@/app/hooks/useVisualizerKeyboard";
import usePlayback from "@/app/hooks/usePlayback";

import PlaybackControls from "@/app/components/ui/PlaybackControls";

import useVisualizerReset from "@/app/hooks/useVisualizerReset";

import {
  useVisualizerSession,
} from "@/app/contexts/VisualizerSessionContext";

import ChallengeModePanel, {
  createOptions,
  useSortingChallenge,
} from "@/app/visualizer/sorting/components/ChallengeMode";

const getFontSize = (value) => {
  const len = String(value).length;

  if (len <= 2) return "text-lg";
  if (len === 3) return "text-sm";

  return "text-xs";
};

const createBubbleSwapQuestion = (arr, j) => {
  const correctLabel = `${arr[j]} and ${arr[j + 1]} (indices ${j} and ${
    j + 1
  })`;

  const options = createOptions(correctLabel, [
    j > 0
      ? `${arr[j - 1]} and ${arr[j]} (indices ${j - 1} and ${j})`
      : null,

    j + 2 < arr.length
      ? `${arr[j + 1]} and ${arr[j + 2]} (indices ${j + 1} and ${
          j + 2
        })`
      : null,

    "No swap will happen",
  ]);

  return {
    prompt: "Which two elements will swap next?",
    options,
    correctOptionId: "correct",

    explanation: `${arr[j]} is greater than ${
      arr[j + 1]
    }, so Bubble Sort swaps adjacent indices ${j} and ${j + 1}.`,
  };
};

const BubbleSortVisualizer = () => {
  const [sorting, setSorting] = useState(false);
  const [sorted, setSorted] = useState(false);

  const [array, setArray] = useState(() =>
    loadFromStorage("bubble-array", [])
  );

  const [challengeEnabled, setChallengeEnabled] =
    useState(false);

  const {
    isPaused,
    speed,
    speedRef,
    setSpeed,
    togglePlayPause,
    increaseSpeed,
    decreaseSpeed,
    checkPause,
  } = usePlayback(loadFromStorage("bubble-speed", 1));

  const [currentStep, setCurrentStep] = useState(0);
  const [timeline, setTimeline] = useState([]);
  const [totalSteps, setTotalSteps] = useState(0);

  const [comparisons, setComparisons] = useState(0);
  const [swaps, setSwaps] = useState(0);

  const [currentIndices, setCurrentIndices] =
    useState({
      i: -1,
      j: -1,
    });

  const timelineContainerRef = useRef(null);

  const animationRef = useRef(null);
  const isSortingRef = useRef(false);
  const resolveRef = useRef(null);

  const {
    activeQuestion,
    askChallenge,
    resetChallengeStats,
    stats: challengeStats,
    submitAnswer,
  } = useSortingChallenge(challengeEnabled);

  const {
    registerCallbacks,
    unregisterCallbacks,
  } = useVisualizerSession();

  useEffect(() => {
    saveToStorage("bubble-array", array);
  }, [array]);

  useEffect(() => {
    saveToStorage("bubble-speed", speed);
  }, [speed]);

  useEffect(() => {
    if (timelineContainerRef.current) {
      timelineContainerRef.current.scrollTop =
        timelineContainerRef.current.scrollHeight;
    }
  }, [timeline]);

  const handleArrayGenerated = (newArray) => {
    setArray(newArray);
    setSorted(false);
    resetStats();
  };

  const resetStats = () => {
    setComparisons(0);
    setSwaps(0);
    setCurrentStep(0);
    setTimeline([]);
    setTotalSteps(0);

    setCurrentIndices({
      i: -1,
      j: -1,
    });

    resetChallengeStats();

    if (animationRef.current) {
      clearTimeout(animationRef.current);
    }
  };

  const cancellableDelay = async () => {
    await new Promise((resolve) => {
      resolveRef.current = resolve;

      animationRef.current = setTimeout(
        resolve,
        1000 / speedRef.current
      );
    });

    await checkPause();
  };

  const bubbleSort = async () => {
    if (sorted || sorting || array.length === 0) {
      return;
    }

    isSortingRef.current = true;

    setSorting(true);

    let arr = [...array];

    let n = arr.length;

    let tempSwaps = 0;
    let tempComparisons = 0;

    setTotalSteps(Math.floor((n * (n - 1)) / 2));

    setCurrentStep(0);
    setTimeline([]);

    for (let i = 0; i < n - 1; i++) {
      let swapped = false;

      for (let j = 0; j < n - i - 1; j++) {
        if (!isSortingRef.current) return;

        setCurrentIndices({
          i: j,
          j: j + 1,
        });

        tempComparisons++;

        setComparisons(tempComparisons);

        setCurrentStep((prev) => prev + 1);

        setTimeline((prev) => [
          ...prev,
          `Comparing index ${j} and ${j + 1}`,
        ]);

        await cancellableDelay();

        if (!isSortingRef.current) return;

        if (arr[j] > arr[j + 1]) {
          await askChallenge(
            createBubbleSwapQuestion(arr, j)
          );

          if (!isSortingRef.current) return;

          const bars =
            document.querySelectorAll(".bar");

          const bar1 = bars[j];
          const bar2 = bars[j + 1];

          if (bar1 && bar2) {
            await gsap.to(bar1, {
              x: "+=40",
              duration: 0.3,
              yoyo: true,
            });

            await gsap.to(bar2, {
              x: "-=40",
              duration: 0.3,
              yoyo: true,
            });

            await gsap.to([bar1, bar2], {
              x: "0",
              duration: 0,
            });
          }

          const first = arr[j];
          const second = arr[j + 1];

          [arr[j], arr[j + 1]] = [
            arr[j + 1],
            arr[j],
          ];

          swapped = true;

          tempSwaps++;

          setSwaps(tempSwaps);

          setArray([...arr]);

          setTimeline((prev) => [
            ...prev,
            `Swapped ${first} with ${second}`,
          ]);

          await cancellableDelay();

          if (!isSortingRef.current) return;
        }
      }

      if (!swapped) break;
    }

    isSortingRef.current = false;

    setSorting(false);
    setSorted(true);

    setTimeline((prev) => [
      ...prev,
      "Sorting completed successfully!",
    ]);
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

    removeFromStorage("bubble-array");
    removeFromStorage("bubble-speed");

    setArray([]);

    setSorting(false);
    setSorted(false);

    resetStats();
  };

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    };
  }, []);

  const handleStart = useCallback(() => {
    bubbleSort();
  }, [sorting, sorted, array, speed]);

  const handleReset = useCallback(() => {
    reset();
  }, []);

  const handleSpeedChange = useCallback(
    (nextSpeed) => {
      setSpeed(nextSpeed);
    },
    [setSpeed]
  );

  useVisualizerKeyboard({
    onStart: handleStart,
    onReset: handleReset,
    onSpeedChange: handleSpeedChange,
    onTogglePlayPause: togglePlayPause,
    speed,
    sorting,
    sorted,
  });

  return (
    <main className="container mx-auto px-6 pb-4">
      {/* your existing JSX */}
    </main>
  );
};

export default BubbleSortVisualizer;