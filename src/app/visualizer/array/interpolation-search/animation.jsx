"use client";

import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";

import GoButton from "@/app/components/ui/goButton";
import ResetButton from "@/app/components/ui/resetButton";
import PlaybackControls from "@/app/components/ui/PlaybackControls";

import {
  saveToStorage,
  loadFromStorage,
  removeFromStorage,
} from "@/utils/storage";

import useVisualizerKeyboard from "@/app/hooks/useVisualizerKeyboard";
import { useAnimationEngine } from "@/lib/visualizer/useAnimationEngine";

import {
  interpolationSearchGenerator,
} from "@/features/algorithms/array/interpolationSearchLogic";

const getFontSize = (value) => {
  const len = String(value).length;

  if (len <= 2) return "text-lg";
  if (len === 3) return "text-sm";

  return "text-xs";
};

const InterpolationSearch = () => {
  const [arrayElements, setArrayElements] = useState(() =>
    loadFromStorage("interpolation-array-elements", "")
  );

  const [target, setTarget] = useState(() =>
    loadFromStorage("interpolation-target", "")
  );

  const [array, setArray] = useState([]);

  const [targetValue, setTargetValue] = useState(null);

  const [message, setMessage] = useState("");

  const [messageType, setMessageType] = useState("");

  const [autoSort, setAutoSort] = useState(false);

  const [showAutoSort, setShowAutoSort] = useState(false);

  const [visualState, setVisualState] = useState({
    low: -1,
    high: -1,
    pos: -1,
    foundIndex: -1,
    stepExplanation: "",
    stepCount: 0,
  });

  useEffect(() => {
    saveToStorage(
      "interpolation-array-elements",
      arrayElements
    );
  }, [arrayElements]);

  useEffect(() => {
    saveToStorage(
      "interpolation-target",
      target
    );
  }, [target]);

  const steps = useMemo(() => {
    if (array.length === 0 || targetValue === null)
      return [];

    return Array.from(
      interpolationSearchGenerator(array, targetValue)
    );
  }, [array, targetValue]);

  const onStep = useCallback(
    (step) => {
      let explanation = "";

      switch (step.type) {
        case "checking":
          explanation = `Checking estimated position ${step.pos}.`;
          break;

        case "move_right":
          explanation = `Target is greater than current value. Move the low pointer to the right.`;
          break;

        case "move_left":
          explanation = `Target is smaller than current value. Move the high pointer to the left.`;
          break;

        case "found":
          explanation = `Target ${targetValue} found at index ${step.pos}.`;

          setMessage(
            `Element ${targetValue} found at index ${step.pos}!`
          );

          setMessageType("success");
          break;

        case "not_found":
          explanation = `Element ${targetValue} is not present in the array.`;

          setMessage(
            `Element ${targetValue} not found.`
          );

          setMessageType("error");
          break;

        default:
          explanation = "";
      }

      setVisualState({
        low: step.low ?? -1,
        high: step.high ?? -1,
        pos: step.pos ?? -1,
        foundIndex:
          step.type === "found"
            ? step.pos
            : -1,
        stepExplanation: explanation,
        stepCount: step.step || 0,
      });
    },
    [targetValue]
  );

  const engine = useAnimationEngine({
    steps,
    onStep,
    initialSpeed: 1000,
  });

  const isAnimating =
    engine.isPlaying || engine.currentStep > 0;

  const generateRandomArray = () => {
    if (isAnimating) return;

    const size =
      Math.floor(Math.random() * 6) + 5;

    const elements = Array.from(
      { length: size },
      () =>
        Math.floor(Math.random() * 100)
    ).sort((a, b) => a - b);

    setArrayElements(elements.join(", "));
  };
    const handleReset = () => {
    engine.reset();

    removeFromStorage("interpolation-array-elements");
    removeFromStorage("interpolation-target");

    setArray([]);
    setTargetValue(null);

    setMessage("");
    setMessageType("");

    setVisualState({
      low: -1,
      high: -1,
      pos: -1,
      foundIndex: -1,
      stepExplanation: "",
      stepCount: 0,
    });

    setAutoSort(false);
    setShowAutoSort(false);

    setArrayElements("");
    setTarget("");
  };

  const handleGo = (e) => {
    e.preventDefault();

    engine.reset();

    setMessage("");
    setMessageType("");

    setVisualState({
      low: -1,
      high: -1,
      pos: -1,
      foundIndex: -1,
      stepExplanation: "",
      stepCount: 0,
    });

    if (!arrayElements || !target) {
      setMessage("Please fill in all fields.");
      setMessageType("warning");
      return;
    }

    const rawElements = arrayElements
      .split(",")
      .map((el) => el.trim());

    if (rawElements.some((el) => el.includes("."))) {
      setMessage(
        "Only integers are supported."
      );
      setMessageType("warning");
      return;
    }

    const elements = rawElements.map(Number);
    const targetVal = parseInt(target);

    if (
      elements.some(isNaN) ||
      isNaN(targetVal)
    ) {
      setMessage("Invalid input.");
      setMessageType("warning");
      return;
    }

    const isSorted = elements.every(
      (v, i) =>
        i === 0 || v >= elements[i - 1]
    );

    if (!isSorted && !autoSort) {
      setMessage(
        "Array must be sorted in ascending order."
      );
      setMessageType("warning");
      setShowAutoSort(true);
      return;
    }

    let processed = [...elements];

    if (!isSorted && autoSort) {
      processed.sort((a, b) => a - b);

      setArrayElements(
        processed.join(", ")
      );

      setShowAutoSort(false);
    }

    setArray(processed);
    setTargetValue(targetVal);

    setTimeout(() => {
      engine.play();
    }, 50);
  };

  useVisualizerKeyboard({
    onTogglePlayPause: engine.isPlaying
      ? engine.pause
      : () => {
          if (array.length)
            engine.play();
        },

    onStepForward: engine.stepForward,

    onStepBackward: engine.stepBackward,

    onSpeedChange: (s) =>
      engine.setSpeed(s * 1000),

    speed: engine.speed / 1000,

    sorting: engine.isPlaying,

    sorted:
      engine.currentStep ===
        steps.length - 1 &&
      steps.length > 0,
  });

  const messageClass =
    messageType === "success"
      ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
      : messageType === "warning"
      ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
      : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200";

  return (
    <main className="container mx-auto">

      <p className="text-lg text-center text-gray-600 dark:text-gray-400 mb-8">
        Visualize how Interpolation Search estimates the most likely position of the target in a sorted array.
      </p>

      <form
        onSubmit={handleGo}
        className="max-w-4xl mx-auto bg-white dark:bg-neutral-950 p-6 rounded-xl border border-gray-200 dark:border-gray-700 mb-8"
      >

        <div className="mb-4">

          <label className="block mb-2">
            Sorted Array Elements
          </label>

          <div className="flex gap-2">

            <input
              type="text"
              value={arrayElements}
              onChange={(e) =>
                setArrayElements(
                  e.target.value
                )
              }
              className="w-full p-3 rounded-lg border"
              placeholder="2, 5, 9, 14, 20"
              disabled={isAnimating}
            />

            <button
              type="button"
              onClick={
                generateRandomArray
              }
              className="px-4 py-2 bg-[#a435f0] text-white rounded-lg"
            >
              Random
            </button>

          </div>

        </div>

        <div className="mb-4">

          <label className="block mb-2">
            Target Element
          </label>

          <div className="flex gap-2">

            <input
              type="number"
              value={target}
              onChange={(e) =>
                setTarget(
                  e.target.value
                )
              }
              className="w-48 p-3 rounded-lg border"
              disabled={isAnimating}
            />

            <GoButton
              onClick={handleGo}
              isAnimating={isAnimating}
            />

            <ResetButton
              onReset={handleReset}
              isAnimating={isAnimating}
            />

          </div>

        </div>

        {isAnimating && (
          <PlaybackControls
            isPlaying={
              engine.isPlaying
            }
            onPlayPause={
              engine.isPlaying
                ? engine.pause
                : () =>
                    engine.play()
            }
            speed={
              engine.speed / 1000
            }
            onSpeedChange={(s) =>
              engine.setSpeed(
                s * 1000
              )
            }
            onStepForward={
              engine.stepForward
            }
            onStepBackward={
              engine.stepBackward
            }
            onReset={
              engine.reset
            }
            disabled={
              steps.length === 0
            }
            progressText={`${
              Math.max(
                engine.currentStep + 1,
                0
              )
            } / ${steps.length}`}
          />
        )}

      </form>
            {message && (
        <div
          className={`max-w-3xl mx-auto mb-8 p-4 rounded-lg ${messageClass}`}
        >
          <p className="text-center font-medium">{message}</p>

          {showAutoSort && (
            <div className="mt-3 flex justify-center">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoSort}
                  onChange={(e) =>
                    setAutoSort(e.target.checked)
                  }
                />
                <span>Auto-sort the array for me</span>
              </label>
            </div>
          )}
        </div>
      )}

      {array.length > 0 && (
        <div className="max-w-4xl mx-auto space-y-6">

          {visualState.stepExplanation && (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">

              <div className="flex items-center gap-2 bg-[#a435f0]/10 dark:bg-[#a435f0]/20 px-4 py-2">

                <span className="w-2 h-2 rounded-full bg-[#a435f0] animate-pulse"></span>

                <span className="text-sm font-semibold text-[#a435f0] uppercase tracking-wide">
                  Step Explanation
                </span>

                {visualState.stepCount > 0 && (
                  <span className="ml-auto text-xs text-gray-500">
                    Iteration #{visualState.stepCount}
                  </span>
                )}

              </div>

              <div className="px-4 py-3">
                <p className="font-mono text-sm">
                  {visualState.stepExplanation}
                </p>
              </div>

              <div className="px-4 py-2 bg-gray-50 dark:bg-gray-900/40 flex flex-wrap gap-4 text-xs">

                <span>
                  <span className="font-semibold text-yellow-600">
                    ■ Yellow
                  </span>{" "}
                  = Estimated Position
                </span>

                <span>
                  <span className="font-semibold text-blue-600">
                    ■ Blue
                  </span>{" "}
                  = Active Search Range
                </span>

                <span>
                  <span className="font-semibold text-green-600">
                    ■ Green
                  </span>{" "}
                  = Found Element
                </span>

              </div>

            </div>
          )}

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">

            <h2 className="text-2xl font-semibold text-center mb-6">
              Array Visualization
            </h2>

            <div className="flex flex-wrap gap-4 justify-center">

              {array.map((element, index) => {

                const labels = [];

                if (index === visualState.low)
                  labels.push("low");

                if (index === visualState.pos)
                  labels.push("pos");

                if (index === visualState.high)
                  labels.push("high");

                let bgColor =
                  "bg-gray-200 dark:bg-gray-700";

                let borderColor =
                  "border-gray-400";

                if (
                  index ===
                  visualState.foundIndex
                ) {
                  bgColor = "bg-green-500";
                  borderColor =
                    "border-green-700";
                } else if (
                  index === visualState.pos
                ) {
                  bgColor = "bg-yellow-400";
                  borderColor =
                    "border-yellow-700";
                } else if (
                  visualState.low !== -1 &&
                  visualState.high !== -1 &&
                  index >= visualState.low &&
                  index <= visualState.high
                ) {
                  bgColor = "bg-blue-300";
                  borderColor =
                    "border-blue-700";
                }

                return (
                  <div
                    key={index}
                    className="flex flex-col items-center"
                  >

                    <div
                      className={`w-16 h-16 rounded-lg border-2 flex items-center justify-center transition-all duration-300 font-semibold ${getFontSize(
                        element
                      )} ${bgColor} ${borderColor}`}
                    >
                      {element}
                    </div>

                    <div className="mt-2 text-xs text-center font-mono h-8">

                      {labels.map(
                        (label, i) => (
                          <div
                            key={i}
                            className={
                              label ===
                              "pos"
                                ? "text-yellow-600 font-semibold"
                                : "text-blue-600 font-semibold"
                            }
                          >
                            {label}
                          </div>
                        )
                      )}

                      <div className="text-gray-400 text-[10px]">
                        [{index}]
                      </div>

                    </div>

                  </div>
                );

              })}

            </div>

          </div>

        </div>
      )}

    </main>
  );
};

export default InterpolationSearch;