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

import { ternarySearchGenerator } from "@/features/algorithms/array/ternarySearchLogic";

const getFontSize = (value) => {
  const len = String(value).length;

  if (len <= 2) return "text-lg";
  if (len === 3) return "text-sm";
  return "text-xs";
};

const TernarySearch = () => {
  const [arrayElements, setArrayElements] = useState(() =>
    loadFromStorage("ternary-array-elements", "")
  );

  const [target, setTarget] = useState(() =>
    loadFromStorage("ternary-target", "")
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
    mid1: -1,
    mid2: -1,
    foundIndex: -1,
    stepExplanation: "",
    stepCount: 0,
  });

  useEffect(() => {
    saveToStorage("ternary-array-elements", arrayElements);
  }, [arrayElements]);

  useEffect(() => {
    saveToStorage("ternary-target", target);
  }, [target]);

  const steps = useMemo(() => {
    if (array.length === 0 || targetValue === null) return [];

    return Array.from(
      ternarySearchGenerator(array, targetValue)
    );
  }, [array, targetValue]);

  const onStep = useCallback(
    (step) => {
      let explanation = "";
      let msg = "";
      let msgType = "";

      switch (step.type) {
        case "checking":
          explanation =
            `Step ${step.step}: low=${step.l}, high=${step.h}, ` +
            `mid1=${step.mid1}, mid2=${step.mid2}. ` +
            `Compare target ${targetValue} with ` +
            `arr[mid1]=${step.arrMid1} and arr[mid2]=${step.arrMid2}.`;
          break;

        case "found_mid1":
          explanation =
            `Target ${targetValue} found at mid1 (index ${step.mid1}).`;

          msg = `Element ${targetValue} found at index ${step.mid1}!`;
          msgType = "success";
          break;

        case "found_mid2":
          explanation =
            `Target ${targetValue} found at mid2 (index ${step.mid2}).`;

          msg = `Element ${targetValue} found at index ${step.mid2}!`;
          msgType = "success";
          break;

        case "discard_right_two_thirds":
          explanation =
            `Target is smaller than arr[mid1]. ` +
            `Discard middle and right portions.`;
          break;

        case "discard_left_two_thirds":
          explanation =
            `Target is greater than arr[mid2]. ` +
            `Discard left and middle portions.`;
          break;

        case "discard_outer_thirds":
          explanation =
            `Target lies between mid1 and mid2. ` +
            `Discard both outer thirds.`;
          break;

        case "not_found":
          explanation =
            `Search range exhausted. Target ${targetValue} does not exist.`;

          msg = `Element ${targetValue} not found.`;
          msgType = "error";
          break;

        default:
          break;
      }

      setVisualState({
        low: step.l ?? -1,
        high: step.h ?? -1,
        mid1: step.mid1 ?? -1,
        mid2: step.mid2 ?? -1,
        foundIndex:
          step.type === "found_mid1"
            ? step.mid1
            : step.type === "found_mid2"
            ? step.mid2
            : -1,
        stepExplanation: explanation,
        stepCount: step.step || 0,
      });

      if (msg) setMessage(msg);
      if (msgType) setMessageType(msgType);
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
    const handleReset = () => {
  engine.reset();

  removeFromStorage("ternary-array-elements");
  removeFromStorage("ternary-target");

  setArray([]);
  setTargetValue(null);

  setMessage("");
  setMessageType("");

  setVisualState({
    low: -1,
    high: -1,
    mid1: -1,
    mid2: -1,
    foundIndex: -1,
    stepExplanation: "",
    stepCount: 0,
  });

  setAutoSort(false);
  setShowAutoSort(false);

  setArrayElements("");
  setTarget("");
};

const generateRandomArray = () => {
  if (isAnimating) return;

  const size = Math.floor(Math.random() * 6) + 5;

  const arr = Array.from(
    { length: size },
    () => Math.floor(Math.random() * 100)
  ).sort((a, b) => a - b);

  setArrayElements(arr.join(", "));
};

const handleGo = (e) => {
  e.preventDefault();

  engine.reset();

  setMessage("");
  setMessageType("");

  setVisualState({
    low: -1,
    high: -1,
    mid1: -1,
    mid2: -1,
    foundIndex: -1,
    stepExplanation: "",
    stepCount: 0,
  });

  if (!arrayElements || !target) {
    setMessage("Please fill in all fields.");
    setMessageType("warning");
    return;
  }

  const raw = arrayElements
    .split(",")
    .map((x) => x.trim());

  if (raw.some((x) => x.includes("."))) {
    setMessage(
      "Only integers are supported."
    );
    setMessageType("warning");
    return;
  }

  const elements = raw.map(Number);
  const targetVal = Number(target);

  if (
    elements.some(isNaN) ||
    isNaN(targetVal)
  ) {
    setMessage("Invalid input.");
    setMessageType("warning");
    return;
  }

  const sorted = elements.every(
    (x, i) => i === 0 || x >= elements[i - 1]
  );

  if (!sorted && !autoSort) {
    setMessage(
      "Array must be sorted in ascending order."
    );

    setMessageType("warning");
    setShowAutoSort(true);
    return;
  }

  let processed = [...elements];

  if (!sorted && autoSort) {
    processed.sort((a, b) => a - b);

    setArrayElements(processed.join(","));

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
        if (array.length > 0) {
          engine.play();
        }
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
      Visualize how Ternary Search efficiently finds an element in a sorted array.
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
            disabled={isAnimating}
            onChange={(e) =>
              setArrayElements(e.target.value)
            }
            placeholder="1,3,5,7,9"
            className="w-full p-3 rounded-lg border"
          />

          <button
            type="button"
            onClick={generateRandomArray}
            disabled={isAnimating}
            className="px-4 bg-[#a435f0] text-white rounded-lg"
          >
            Random
          </button>

        </div>
      </div>

      <div className="mb-4">

        <label className="block mb-2">
          Target
        </label>

        <div className="flex flex-col sm:flex-row gap-4">

          <input
            type="number"
            value={target}
            disabled={isAnimating}
            onChange={(e) =>
              setTarget(e.target.value)
            }
            className="w-full sm:max-w-xs p-3 rounded-lg border"
          />

          <div className="flex gap-2">

            <GoButton
              onClick={handleGo}
              isAnimating={isAnimating}
              disabled={isAnimating}
            />

            <ResetButton
              onReset={handleReset}
              isAnimating={isAnimating}
            />

          </div>

        </div>

      </div>

      {isAnimating && (
        <PlaybackControls
          isPlaying={engine.isPlaying}
          onPlayPause={
            engine.isPlaying
              ? engine.pause
              : () => engine.play()
          }
          speed={engine.speed / 1000}
          onSpeedChange={(s) =>
            engine.setSpeed(s * 1000)
          }
          onStepForward={engine.stepForward}
          onStepBackward={engine.stepBackward}
          onReset={engine.reset}
          onExplainStep={() => {}}
          disabled={steps.length === 0}
          progressText={`${Math.max(
            engine.currentStep + 1,
            0
          )} / ${steps.length}`}
        />
      )}
    </form>

    {message && (
      <div
        className={`max-w-3xl mx-auto mb-8 p-4 rounded-lg ${messageClass}`}
      >
        <p className="text-center font-medium">
          {message}
        </p>

        {showAutoSort && (
          <div className="mt-3 flex justify-center">

            <label className="flex items-center gap-2">

              <input
                type="checkbox"
                checked={autoSort}
                onChange={(e) =>
                  setAutoSort(e.target.checked)
                }
              />

              Auto-sort the array

            </label>

          </div>
        )}
      </div>
    )}
        {array.length > 0 && (
      <div className="max-w-5xl mx-auto space-y-6">

        {visualState.stepExplanation && (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">

            <div className="flex items-center gap-2 bg-[#a435f0]/10 dark:bg-[#a435f0]/20 px-4 py-2 border-b border-[#a435f0]/20">
              <span className="w-2 h-2 rounded-full bg-[#a435f0] animate-pulse"></span>

              <span className="text-sm font-semibold text-[#a435f0] uppercase">
                Step Explanation
              </span>

              {visualState.stepCount > 0 && (
                <span className="ml-auto text-xs text-gray-500">
                  Iteration #{visualState.stepCount}
                </span>
              )}
            </div>

            <div className="px-4 py-3">
              <p className="font-mono text-sm leading-relaxed">
                {visualState.stepExplanation}
              </p>
            </div>

            <div className="px-4 py-2 bg-gray-50 dark:bg-gray-900/50 border-t flex flex-wrap gap-4 text-xs">

              <span>
                <span className="font-semibold text-blue-600">
                  ■ Blue
                </span>{" "}
                = Search Range
              </span>

              <span>
                <span className="font-semibold text-yellow-500">
                  ■ Yellow
                </span>{" "}
                = mid1
              </span>

              <span>
                <span className="font-semibold text-orange-500">
                  ■ Orange
                </span>{" "}
                = mid2
              </span>

              <span>
                <span className="font-semibold text-green-600">
                  ■ Green
                </span>{" "}
                = Found
              </span>

              <span>
                <span className="font-semibold text-gray-400">
                  ■ Gray
                </span>{" "}
                = Eliminated
              </span>

            </div>
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">

          <h2 className="text-2xl font-semibold text-center mb-6">
            Array Visualization
          </h2>

          <div className="flex flex-wrap justify-center gap-4">

            {array.map((element, index) => {

              const labels = [];

              if (index === visualState.low) labels.push("low");
              if (index === visualState.mid1) labels.push("mid1");
              if (index === visualState.mid2) labels.push("mid2");
              if (index === visualState.high) labels.push("high");

              let bg =
                "bg-[#E5E7EB] dark:bg-gray-700";

              let border =
                "border-[#D1D5DB] dark:border-gray-600";

              if (index === visualState.foundIndex) {

                bg = "bg-green-500";
                border = "border-green-700";

              } else if (index === visualState.mid1) {

                bg = "bg-yellow-400";
                border = "border-yellow-700";

              } else if (index === visualState.mid2) {

                bg = "bg-orange-400";
                border = "border-orange-700";

              } else if (
                visualState.low !== -1 &&
                visualState.high !== -1 &&
                index >= visualState.low &&
                index <= visualState.high
              ) {

                bg = "bg-blue-300";
                border = "border-blue-600";
              }

              return (
                <div
                  key={index}
                  className="flex flex-col items-center"
                >

                  <div
                    className={`w-16 h-16 rounded-lg border-2 flex items-center justify-center transition-all duration-300 ${bg} ${border} ${getFontSize(
                      element
                    )}`}
                  >
                    {element}
                  </div>

                  <div className="mt-1 text-xs font-mono text-center h-10">

                    {labels.map((label) => (

                      <div
                        key={label}
                        className={
                          label === "mid1"
                            ? "text-yellow-600 font-semibold"
                            : label === "mid2"
                            ? "text-orange-600 font-semibold"
                            : "text-blue-600 font-semibold"
                        }
                      >
                        {label}
                      </div>

                    ))}

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

export default TernarySearch;