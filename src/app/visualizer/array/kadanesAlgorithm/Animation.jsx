"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { gsap } from "gsap";
import ResetButton from "@/app/components/ui/resetButton";
import GoButton from "@/app/components/ui/goButton";
import PlaybackControls from "@/app/components/ui/PlaybackControls";
import usePlayback from "@/app/hooks/usePlayback";
import useVisualizerReset from "@/app/hooks/useVisualizerReset";
import {
  generateStatesMaxSubarray,
  generateStatesCircularSubarray,
} from "@/features/algorithms/array/kadanesLogic";

const PROBLEMS = {
  MAX_SUBARRAY: "max-subarray",
  CIRCULAR: "circular-subarray",
};

const Animation = () => {
  const [problemType, setProblemType] = useState(PROBLEMS.MAX_SUBARRAY);
  const [inputData, setInputData] = useState("-2, 1, -3, 4, -1, 2, 1, -5, 4");

  const [dataArray, setDataArray] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [currentWindow, setCurrentWindow] = useState([]);
  const [bestWindow, setBestWindow] = useState([]);
  const [maxEndingHere, setMaxEndingHere] = useState(null);
  const [maxSoFar, setMaxSoFar] = useState(null);
  const [phaseLabel, setPhaseLabel] = useState("");
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
    setActiveIndex(-1);
    setCurrentWindow([]);
    setBestWindow([]);
    setMaxEndingHere(null);
    setMaxSoFar(null);
    setPhaseLabel("");
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

    setActiveIndex(state.activeIndex ?? -1);
    setCurrentWindow(state.currentWindow ?? []);
    setBestWindow(state.bestWindow ?? []);
    setMaxEndingHere(state.maxEndingHere);
    setMaxSoFar(state.maxSoFar);
    setPhaseLabel(state.phaseLabel ?? "");
    setStepExplanation(state.explanation);

    // GSAP highlighting
    elementRefs.current.forEach((ref, index) => {
      if (!ref) return;

      const inCurrent =
        state.currentWindow.length === 2 &&
        index >= state.currentWindow[0] &&
        index <= state.currentWindow[1];

      const inBest =
        state.bestWindow.length === 2 &&
        index >= state.bestWindow[0] &&
        index <= state.bestWindow[1];

      const isActive = index === state.activeIndex;

      if (isActive && state.newMax) {
        // New max found: bright green
        gsap.to(ref, {
          backgroundColor: "#DCFCE7",
          borderColor: "#22C55E",
          color: "#166534",
          duration: 0.3,
        });
      } else if (isActive && state.reset) {
        // Reset: red/orange
        gsap.to(ref, {
          backgroundColor: "#FEF3C7",
          borderColor: "#F59E0B",
          color: "#92400E",
          duration: 0.3,
        });
      } else if (isActive) {
        // Currently processing: purple
        gsap.to(ref, {
          backgroundColor: "#F3E8FF",
          borderColor: "#A855F7",
          color: "#6B21A8",
          duration: 0.3,
        });
      } else if (inBest && !inCurrent) {
        // Best window only: green
        gsap.to(ref, {
          backgroundColor: "#DCFCE7",
          borderColor: "#22C55E",
          color: "#166534",
          duration: 0.3,
        });
      } else if (inCurrent && inBest) {
        // Both current and best: teal
        gsap.to(ref, {
          backgroundColor: "#CCFBF1",
          borderColor: "#14B8A6",
          color: "#0F766E",
          duration: 0.3,
        });
      } else if (inCurrent) {
        // Current window: indigo
        gsap.to(ref, {
          backgroundColor: "#E0E7FF",
          borderColor: "#6366F1",
          color: "#3730A3",
          duration: 0.3,
        });
      } else {
        // Default
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

  const handleGo = (e) => {
    e.preventDefault();
    handleReset();

    if (!inputData) {
      setMessage("Please provide input data.");
      setMessageType("warning");
      return;
    }

    const parsedArray = inputData.split(",").map((s) => parseInt(s.trim()));
    if (parsedArray.some(isNaN)) {
      setMessage("Invalid input. Please provide comma-separated integers.");
      setMessageType("warning");
      return;
    }

    setDataArray(parsedArray);

    let states = [];
    if (problemType === PROBLEMS.MAX_SUBARRAY) {
      states = Array.from(generateStatesMaxSubarray(parsedArray));
    } else {
      states = Array.from(generateStatesCircularSubarray(parsedArray));
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
    if (len <= 2) return "text-xl font-bold";
    if (len <= 3) return "text-lg font-bold";
    return "text-sm font-semibold";
  };

  const messageClass =
    messageType === "success"
      ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
      : messageType === "warning"
      ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
      : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200";

  const defaultInputs = {
    [PROBLEMS.MAX_SUBARRAY]: "-2, 1, -3, 4, -1, 2, 1, -5, 4",
    [PROBLEMS.CIRCULAR]: "5, -3, 5",
  };

  return (
    <main className="container mx-auto">
      <p className="text-lg text-center text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto">
        Visualize how Kadane&apos;s Algorithm efficiently finds the maximum subarray
        sum in O(N) time using local and global maximum tracking.
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
              setInputData(defaultInputs[val]);
            }}
            disabled={isAnimating}
            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:border-[#a435f0] focus:outline-none focus:ring-2 focus:ring-[#a435f0]/30 transition duration-300"
          >
            <option value={PROBLEMS.MAX_SUBARRAY}>Maximum Subarray Sum</option>
            <option value={PROBLEMS.CIRCULAR}>Maximum Circular Subarray Sum</option>
          </select>
        </div>

        <div className="mb-4">
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
            placeholder="e.g., -2, 1, -3, 4, -1, 2, 1, -5, 4"
            disabled={isAnimating}
          />
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
          {/* Phase label for circular */}
          {phaseLabel && (
            <div className="text-center">
              <span className="inline-block px-4 py-1 rounded-full text-sm font-semibold bg-[#a435f0]/10 text-[#a435f0] border border-[#a435f0]/30">
                {phaseLabel}
              </span>
            </div>
          )}

          {/* Step info cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-gray-800 p-5 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
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
                  Max Ending Here
                </h4>
                <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 font-mono">
                  {maxEndingHere !== null ? maxEndingHere : "-"}
                </div>
              </div>
              <div>
                <h4 className="text-xs uppercase font-semibold text-gray-500 dark:text-gray-400 mb-1">
                  Max So Far
                </h4>
                <div className="text-2xl font-bold text-[#a435f0] dark:text-[#c56eff] font-mono">
                  {maxSoFar !== null ? maxSoFar : "-"}
                </div>
              </div>
            </div>
          </div>

          {/* Array visualization */}
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md overflow-x-auto border border-gray-100 dark:border-gray-700">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-10 text-center">
              Kadane&apos;s Algorithm Visualization
            </h2>

            <div className="flex gap-2 justify-center min-w-max pb-6 px-4">
              {dataArray.map((element, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div
                    ref={(el) => (elementRefs.current[index] = el)}
                    className={`w-14 h-14 md:w-16 md:h-16 flex items-center justify-center rounded-lg border-2 transition-colors duration-200 ${getFontSize(element)} shadow-sm`}
                    style={{ backgroundColor: "#E5E7EB", borderColor: "#D1D5DB" }}
                  >
                    {element}
                  </div>
                  <div className="mt-2 text-xs text-gray-400 font-mono">
                    {index}
                  </div>
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="mt-4 flex flex-wrap justify-center gap-6 text-xs text-gray-500 dark:text-gray-400 font-medium">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-[#F3E8FF] border border-[#A855F7]"></div>
                Current Index
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-[#E0E7FF] border border-[#6366F1]"></div>
                Current Subarray
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-[#DCFCE7] border border-[#22C55E]"></div>
                Best Subarray
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-[#CCFBF1] border border-[#14B8A6]"></div>
                Current = Best
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-[#FEF3C7] border border-[#F59E0B]"></div>
                Reset Point
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