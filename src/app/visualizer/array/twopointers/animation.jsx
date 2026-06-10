"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { gsap } from "gsap";
import ResetButton from "@/app/components/ui/resetButton";
import GoButton from "@/app/components/ui/goButton";
import PlaybackControls from "@/app/components/ui/PlaybackControls";
import usePlayback from "@/app/hooks/usePlayback";
import useVisualizerReset from "@/app/hooks/useVisualizerReset";
import {
  generateStatesPairSum,
  generateStatesRemoveDuplicates,
  generateStatesContainerWater,
  generateStatesThreeSum,
} from "@/features/algorithms/array/twoPointersLogic";

const PROBLEMS = {
  PAIR_SUM: "pair-sum",
  REMOVE_DUPLICATES: "remove-duplicates",
  CONTAINER_WATER: "container-water",
  THREE_SUM: "three-sum",
};

const Animation = () => {
  const [problemType, setProblemType] = useState(PROBLEMS.PAIR_SUM);
  const [inputData, setInputData] = useState("1, 2, 3, 4, 6");
  const [targetValue, setTargetValue] = useState("6");

  const [dataArray, setDataArray] = useState([]);
  const [leftPointer, setLeftPointer] = useState(-1);
  const [rightPointer, setRightPointer] = useState(-1);
  const [fixedIndex, setFixedIndex] = useState(-1);
  const [bestResult, setBestResult] = useState(null);
  const [currentResult, setCurrentResult] = useState(null);
  const [stepExplanation, setStepExplanation] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [pendingStart, setPendingStart] = useState(false);

  const {
    isPaused,
    isPausedRef,
    speed,
    speedRef,
    setSpeed,
    togglePlayPause,
    increaseSpeed,
    decreaseSpeed,
  } = usePlayback(() => 1);

  const animationRef = useRef(null);
  const wasPausedRef = useRef(false);
  const stateQueueRef = useRef([]);
  const currentStateIdxRef = useRef(0);
  const elementRefs = useRef([]);

  const handleReset = () => {
    clearTimeout(animationRef.current);
    setDataArray([]);
    setLeftPointer(-1);
    setRightPointer(-1);
    setFixedIndex(-1);
    setBestResult(null);
    setCurrentResult(null);
    setStepExplanation("");
    setIsAnimating(false);
    setMessage("");
    setMessageType("");
    setPendingStart(false);
    isPausedRef.current = false;
    wasPausedRef.current = false;
    stateQueueRef.current = [];
    currentStateIdxRef.current = 0;
    setSpeed(1);

    elementRefs.current.forEach((ref) => {
      if (ref) {
        gsap.to(ref, {
          backgroundColor: "#E5E7EB",
          borderColor: "#D1D5DB",
          color: "#1F2937",
          duration: 0,
        });
      }
    });
  };

  useVisualizerReset(handleReset);

  const animateStep = useCallback(() => {
    if (currentStateIdxRef.current >= stateQueueRef.current.length) {
      setIsAnimating(false);
      setMessage("Visualization completed.");
      setMessageType("success");
      return;
    }

    const state = stateQueueRef.current[currentStateIdxRef.current];
    const delay = 1500 / speedRef.current;

    setLeftPointer(state.left);
    setRightPointer(state.right);
    setFixedIndex(state.fixedIndex ?? -1);
    setCurrentResult(state.current);
    setBestResult(state.best);
    setStepExplanation(state.explanation);

    // GSAP highlighting
    elementRefs.current.forEach((ref, index) => {
      if (!ref) return;

      const isLeft = index === state.left;
      const isRight = index === state.right;
      const isFixed = index === state.fixedIndex;
      const isActive = isLeft || isRight || isFixed;

      if (isFixed) {
        // Fixed pointer: teal
        gsap.to(ref, {
          backgroundColor: "#CCFBF1",
          borderColor: "#14B8A6",
          color: "#0F766E",
          duration: 0.3,
        });
      } else if (isActive && state.success) {
        // Found / match: green
        gsap.to(ref, {
          backgroundColor: "#DCFCE7",
          borderColor: "#22C55E",
          color: "#166534",
          duration: 0.3,
        });
      } else if (isActive && state.violation) {
        // Duplicate / violation: red
        gsap.to(ref, {
          backgroundColor: "#FEE2E2",
          borderColor: "#EF4444",
          color: "#991B1B",
          duration: 0.3,
        });
      } else if (isLeft) {
        // Left pointer: purple
        gsap.to(ref, {
          backgroundColor: "#F3E8FF",
          borderColor: "#A855F7",
          color: "#6B21A8",
          duration: 0.3,
        });
      } else if (isRight) {
        // Right pointer: indigo
        gsap.to(ref, {
          backgroundColor: "#E0E7FF",
          borderColor: "#6366F1",
          color: "#3730A3",
          duration: 0.3,
        });
      } else if (state.done && isActive) {
        gsap.to(ref, {
          backgroundColor: "#F3E8FF",
          borderColor: "#A855F7",
          color: "#6B21A8",
          duration: 0.3,
        });
      } else {
        // Default: gray
        gsap.to(ref, {
          backgroundColor: "#E5E7EB",
          borderColor: "#D1D5DB",
          color: "#4B5563",
          duration: 0.3,
        });
      }
    });

    currentStateIdxRef.current++;

    if (!state.done) {
      animationRef.current = setTimeout(() => {
        if (!isPausedRef.current) animateStep();
      }, delay);
    } else {
      setIsAnimating(false);
      setMessage("Visualization completed.");
      setMessageType("success");
    }
  }, [speedRef, isPausedRef]);

  const needsTarget =
    problemType === PROBLEMS.PAIR_SUM || problemType === PROBLEMS.THREE_SUM;

  const handleGo = (e) => {
    e.preventDefault();
    handleReset();

    if (!inputData) {
      setMessage("Please provide input data.");
      setMessageType("warning");
      return;
    }

    const parsedArray = inputData
      .split(",")
      .map((s) => parseInt(s.trim()));

    if (parsedArray.some(isNaN)) {
      setMessage("Invalid input. Please provide comma-separated integers.");
      setMessageType("warning");
      return;
    }

    let targetNum = 0;
    if (needsTarget) {
      targetNum = parseInt(targetValue);
      if (isNaN(targetNum)) {
        setMessage("Please provide a valid integer target.");
        setMessageType("warning");
        return;
      }
    }

    setDataArray(parsedArray);

    let states = [];
    if (problemType === PROBLEMS.PAIR_SUM) {
      states = Array.from(generateStatesPairSum(parsedArray, targetNum));
    } else if (problemType === PROBLEMS.REMOVE_DUPLICATES) {
      states = Array.from(generateStatesRemoveDuplicates(parsedArray));
    } else if (problemType === PROBLEMS.CONTAINER_WATER) {
      states = Array.from(generateStatesContainerWater(parsedArray));
    } else if (problemType === PROBLEMS.THREE_SUM) {
      states = Array.from(generateStatesThreeSum(parsedArray));
    }

    stateQueueRef.current = states;
    currentStateIdxRef.current = 0;
    setIsAnimating(true);
    setPendingStart(true);
  };

  useEffect(() => {
    if (pendingStart && dataArray.length > 0 && stateQueueRef.current.length > 0) {
      setPendingStart(false);
      animateStep();
    }
  }, [pendingStart, dataArray, animateStep]);

  useEffect(() => {
    if (isPaused) {
      wasPausedRef.current = true;
    } else if (wasPausedRef.current && isAnimating) {
      wasPausedRef.current = false;
      clearTimeout(animationRef.current);
      animateStep();
    }
  }, [isPaused, isAnimating, animateStep]);

  const getFontSize = (value) => {
    const len = String(value).length;
    if (len <= 1) return "text-xl font-bold";
    if (len <= 2) return "text-lg font-bold";
    return "text-sm font-semibold";
  };

  const messageClass =
    messageType === "success"
      ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
      : messageType === "warning"
      ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
      : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200";

  const defaultInputs = {
    [PROBLEMS.PAIR_SUM]: { input: "1, 2, 3, 4, 6", target: "6" },
    [PROBLEMS.REMOVE_DUPLICATES]: { input: "1, 1, 2, 3, 3, 4", target: "" },
    [PROBLEMS.CONTAINER_WATER]: { input: "1, 8, 6, 2, 5, 4, 8, 3, 7", target: "" },
    [PROBLEMS.THREE_SUM]: { input: "-4, -1, -1, 0, 1, 2", target: "" },
  };

  return (
    <main className="container mx-auto">
      <p className="text-lg text-center text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto">
        Visualize how the Two Pointers technique efficiently solves array problems
        using left and right pointers moving toward or away from each other.
      </p>

      <form
        onSubmit={handleGo}
        className="max-w-4xl mx-auto bg-white dark:bg-neutral-950 p-6 rounded-xl border border-gray-200 dark:border-gray-700 mb-8 shadow-sm"
      >
        <div className="mb-6">
          <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">
            Select Problem
          </label>
          <select
            value={problemType}
            onChange={(e) => {
              const val = e.target.value;
              setProblemType(val);
              handleReset();
              setInputData(defaultInputs[val].input);
              setTargetValue(defaultInputs[val].target);
            }}
            disabled={isAnimating}
            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:border-[#a435f0] focus:outline-none focus:ring-2 focus:ring-[#a435f0]/30 transition duration-300"
          >
            <optgroup label="Opposite Direction">
              <option value={PROBLEMS.PAIR_SUM}>Pair Sum (Sorted Array)</option>
              <option value={PROBLEMS.CONTAINER_WATER}>Container With Most Water</option>
              <option value={PROBLEMS.THREE_SUM}>Three Sum</option>
            </optgroup>
            <optgroup label="Same Direction">
              <option value={PROBLEMS.REMOVE_DUPLICATES}>
                Remove Duplicates from Sorted Array
              </option>
            </optgroup>
          </select>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1">
            <label
              className="block text-gray-700 dark:text-gray-300 mb-2"
              htmlFor="inputData"
            >
              Array Elements (comma-separated)
            </label>
            <input
              type="text"
              id="inputData"
              value={inputData}
              onChange={(e) => setInputData(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:border-[#a435f0] focus:outline-none focus:ring-2 focus:ring-[#a435f0]/30 transition duration-300 font-mono"
              placeholder="e.g., 1, 2, 3, 4, 6"
              disabled={isAnimating}
            />
          </div>

          {needsTarget && (
            <div className="w-full md:w-1/3">
              <label
                className="block text-gray-700 dark:text-gray-300 mb-2"
                htmlFor="targetValue"
              >
                Target Sum
              </label>
              <input
                type="number"
                id="targetValue"
                value={targetValue}
                onChange={(e) => setTargetValue(e.target.value)}
                className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:border-[#a435f0] focus:outline-none focus:ring-2 focus:ring-[#a435f0]/30 transition duration-300 font-mono"
                placeholder="e.g., 6"
                disabled={isAnimating}
              />
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <GoButton onClick={handleGo} isAnimating={isAnimating} disabled={isAnimating} />
          <ResetButton onReset={handleReset} isAnimating={isAnimating} />
        </div>

        {isAnimating && (
          <div className="mt-6 border-t border-gray-100 dark:border-gray-800 pt-6">
            <PlaybackControls
              isPaused={isPaused}
              speed={speed}
              togglePlayPause={togglePlayPause}
              decreaseSpeed={decreaseSpeed}
              increaseSpeed={increaseSpeed}
            />
          </div>
        )}
      </form>

      {message && (
        <div className={`max-w-4xl mx-auto mb-8 p-4 rounded-lg ${messageClass}`}>
          <p className="text-center font-medium">{message}</p>
        </div>
      )}

      {dataArray.length > 0 && (
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Step info cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-gray-800 p-5 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-[#a435f0] animate-pulse"></span>
                <span className="text-sm font-semibold text-[#a435f0] dark:text-[#c56eff] uppercase tracking-wide">
                  Current Step
                </span>
              </div>
              <p className="text-gray-700 dark:text-gray-200 text-base leading-relaxed font-mono min-h-[3rem]">
                {stepExplanation || "Ready to begin..."}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-5 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm grid grid-cols-2 gap-4 text-center">
              <div>
                <h4 className="text-xs uppercase font-semibold text-gray-500 dark:text-gray-400 mb-1">
                  Current State
                </h4>
                <div className="text-xl font-bold text-gray-800 dark:text-gray-100 font-mono overflow-hidden text-ellipsis whitespace-nowrap">
                  {currentResult !== null ? currentResult : "-"}
                </div>
              </div>
              <div>
                <h4 className="text-xs uppercase font-semibold text-gray-500 dark:text-gray-400 mb-1">
                  Best Result
                </h4>
                <div className="text-xl font-bold text-[#a435f0] dark:text-[#c56eff] font-mono overflow-hidden text-ellipsis whitespace-nowrap">
                  {bestResult !== null ? bestResult : "-"}
                </div>
              </div>
            </div>
          </div>

          {/* Array visualization */}
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md overflow-x-auto border border-gray-100 dark:border-gray-700">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-10 text-center">
              Two Pointers Visualization
            </h2>

            <div className="flex gap-2 justify-center min-w-max pb-10 px-4">
              {dataArray.map((element, index) => {
                const isLeft = index === leftPointer;
                const isRight = index === rightPointer;
                const isFixed = index === fixedIndex;

                return (
                  <div key={index} className="flex flex-col items-center relative">
                    <div
                      ref={(el) => (elementRefs.current[index] = el)}
                      className={`w-14 h-14 md:w-16 md:h-16 flex items-center justify-center rounded-lg border-2 transition-colors duration-200 ${getFontSize(element)} shadow-sm`}
                      style={{ backgroundColor: "#E5E7EB", borderColor: "#D1D5DB" }}
                    >
                      {element}
                    </div>

                    <div className="mt-2 text-xs text-gray-400 font-mono h-4">
                      {index}
                    </div>

                    {/* Pointer labels */}
                    <div className="absolute -bottom-10 flex flex-col items-center gap-1 w-full">
                      {isFixed && (
                        <div className="text-teal-600 font-bold text-xs bg-teal-50 px-2 py-0.5 rounded shadow-sm border border-teal-300">
                          i
                        </div>
                      )}
                      {isLeft && !isFixed && (
                        <div className="text-[#a435f0] font-bold text-xs bg-[#a435f0]/10 px-2 py-0.5 rounded shadow-sm border border-[#a435f0]/30 animate-bounce">
                          L
                        </div>
                      )}
                      {isRight && !isFixed && (
                        <div
                          className="text-indigo-600 font-bold text-xs bg-indigo-50 px-2 py-0.5 rounded shadow-sm border border-indigo-300 animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        >
                          R
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="mt-6 flex flex-wrap justify-center gap-6 text-xs text-gray-500 dark:text-gray-400 font-medium">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-[#F3E8FF] border border-[#A855F7]"></div>
                Left Pointer (L)
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-[#E0E7FF] border border-[#6366F1]"></div>
                Right Pointer (R)
              </div>
              {problemType === PROBLEMS.THREE_SUM && (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-[#CCFBF1] border border-[#14B8A6]"></div>
                  Fixed Element (i)
                </div>
              )}
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-[#DCFCE7] border border-[#22C55E]"></div>
                Match Found
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-[#FEE2E2] border border-[#EF4444]"></div>
                Duplicate
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-[#E5E7EB] border border-[#D1D5DB]"></div>
                Unvisited
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Animation;