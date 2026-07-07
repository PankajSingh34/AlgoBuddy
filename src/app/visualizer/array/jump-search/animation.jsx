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

import { jumpSearchGenerator } from "@/features/algorithms/array/jumpSearchLogic";

const getFontSize = (value) => {
  const len = String(value).length;

  if (len <= 2) return "text-lg";
  if (len === 3) return "text-sm";
  return "text-xs";
};

const JumpSearch = () => {

  const [arrayElements, setArrayElements] = useState(() =>
    loadFromStorage("jump-array-elements", "")
  );

  const [target, setTarget] = useState(() =>
    loadFromStorage("jump-target", "")
  );

  const [array, setArray] = useState([]);
  const [targetValue, setTargetValue] = useState(null);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const [autoSort, setAutoSort] = useState(false);
  const [showAutoSort, setShowAutoSort] = useState(false);

  const [visualState, setVisualState] = useState({

    current: -1,
    prev: -1,
    step: -1,
    foundIndex: -1,

    phase: "",

    explanation: "",

    iteration: 0,

  });

  useEffect(() => {
    saveToStorage(
      "jump-array-elements",
      arrayElements
    );
  }, [arrayElements]);

  useEffect(() => {
    saveToStorage(
      "jump-target",
      target
    );
  }, [target]);

  const steps = useMemo(() => {

    if (
      array.length === 0 ||
      targetValue === null
    )
      return [];

    return Array.from(
      jumpSearchGenerator(
        array,
        targetValue
      )
    );

  }, [array, targetValue]);

  const onStep = useCallback(
    (step) => {

      let explanation = "";
      let msg = "";
      let msgType = "";

      switch (step.type) {

        case "jump":

          explanation =
            `Jumping from index ${step.prev} to index ${step.current}. ` +
            `Current value = ${step.value}`;

          break;

        case "block_found":

          explanation =
            `Target may exist between index ${step.prev} and ${step.step - 1}. Starting linear search.`;

          break;

        case "checking":

          explanation =
            `Checking arr[${step.index}] = ${step.value}`;

          break;

        case "found":

          explanation =
            `Target found at index ${step.index}.`;

          msg =
            `Element ${targetValue} found at index ${step.index}!`;

          msgType = "success";

          break;

        case "not_found":

          explanation =
            `Target not present in the array.`;

          msg =
            `Element ${targetValue} not found.`;

          msgType = "error";

          break;

        default:
          break;
      }

      setVisualState({

        current:
          step.current ??
          step.index ??
          -1,

        prev:
          step.prev ?? -1,

        step:
          step.step ?? -1,

        foundIndex:
          step.type === "found"
            ? step.index
            : -1,

        phase: step.type,

        explanation,

        iteration:
          step.iteration || 0,

      });

      if (msg)
        setMessage(msg);

      if (msgType)
        setMessageType(msgType);

    },
    [targetValue]
  );

  const engine =
    useAnimationEngine({

      steps,

      onStep,

      initialSpeed: 1000,

    });

  const isAnimating =
    engine.isPlaying ||
    engine.currentStep > 0;
    const handleReset = () => {
  engine.reset();

  removeFromStorage("jump-array-elements");
  removeFromStorage("jump-target");

  setArray([]);
  setTargetValue(null);

  setMessage("");
  setMessageType("");

  setVisualState({
    current: -1,
    prev: -1,
    step: -1,
    foundIndex: -1,
    phase: "",
    explanation: "",
    iteration: 0,
  });

  setAutoSort(false);
  setShowAutoSort(false);

  setArrayElements("");
  setTarget("");
};

const generateRandomArray = () => {
  if (isAnimating) return;

  const size = Math.floor(Math.random() * 6) + 6;

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
    current: -1,
    prev: -1,
    step: -1,
    foundIndex: -1,
    phase: "",
    explanation: "",
    iteration: 0,
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
    setMessage("Only integers are supported.");
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
    setMessage("Array must be sorted in ascending order.");
    setMessageType("warning");
    setShowAutoSort(true);
    return;
  }

  let processed = [...elements];

  if (!sorted && autoSort) {
    processed.sort((a, b) => a - b);

    setArrayElements(processed.join(", "));
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

  onSpeedChange: (speed) =>
    engine.setSpeed(speed * 1000),

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
      Visualize how Jump Search efficiently finds an element in a sorted array.
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
            className="w-full p-3 rounded-lg border border-gray-300"
          />

          <button
            type="button"
            onClick={generateRandomArray}
            disabled={isAnimating}
            className="px-4 py-2 rounded-lg bg-[#a435f0] text-white"
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
            className="w-full sm:max-w-xs p-3 rounded-lg border border-gray-300"
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

        {visualState.explanation && (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">

            <div className="flex items-center gap-2 bg-[#a435f0]/10 dark:bg-[#a435f0]/20 px-4 py-2 border-b">

              <span className="w-2 h-2 rounded-full bg-[#a435f0] animate-pulse"></span>

              <span className="text-sm font-semibold text-[#a435f0] uppercase">
                Step Explanation
              </span>

              {visualState.iteration > 0 && (
                <span className="ml-auto text-xs text-gray-500">
                  Iteration #{visualState.iteration}
                </span>
              )}

            </div>

            <div className="p-4">
              <p className="font-mono text-sm leading-relaxed">
                {visualState.explanation}
              </p>
            </div>

            <div className="px-4 py-2 bg-gray-50 dark:bg-gray-900/50 border-t flex flex-wrap gap-4 text-xs">

              <span>
                <span className="font-semibold text-purple-600">
                  ■ Purple
                </span>{" "}
                = Jump Pointer
              </span>

              <span>
                <span className="font-semibold text-blue-600">
                  ■ Blue
                </span>{" "}
                = Current Block
              </span>

              <span>
                <span className="font-semibold text-yellow-600">
                  ■ Yellow
                </span>{" "}
                = Linear Search
              </span>

              <span>
                <span className="font-semibold text-green-600">
                  ■ Green
                </span>{" "}
                = Found
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

              let bg =
                "bg-[#E5E7EB] dark:bg-gray-700";

              let border =
                "border-[#D1D5DB] dark:border-gray-600";

              const labels = [];

              if (
                visualState.prev !== -1 &&
                visualState.step !== -1 &&
                index >= visualState.prev &&
                index < visualState.step
              ) {
                bg = "bg-blue-300";
                border = "border-blue-600";
              }

              if (
                visualState.phase === "jump" &&
                index === visualState.current
              ) {
                bg = "bg-purple-500";
                border = "border-purple-700";
                labels.push("jump");
              }

              if (
                visualState.phase === "checking" &&
                index === visualState.current
              ) {
                bg = "bg-yellow-400";
                border = "border-yellow-700";
                labels.push("check");
              }

              if (
                index === visualState.foundIndex
              ) {
                bg = "bg-green-500";
                border = "border-green-700";
                labels.push("found");
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

                  <div className="mt-1 text-xs font-mono h-10 text-center">

                    {labels.map((label) => (
                      <div
                        key={label}
                        className={
                          label === "jump"
                            ? "text-purple-600 font-semibold"
                            : label === "check"
                            ? "text-yellow-600 font-semibold"
                            : "text-green-600 font-semibold"
                        }
                      >
                        {label}
                      </div>
                    ))}

                    <div className="text-[10px] text-gray-400">
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

export default JumpSearch;