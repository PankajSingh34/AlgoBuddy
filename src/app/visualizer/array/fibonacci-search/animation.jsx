"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
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
import { fibonacciSearchGenerator } from "@/features/algorithms/array/fibonacciSearchLogic";

const getFontSize = (value) => {
  const len = String(value).length;
  if (len <= 2) return "text-lg";
  if (len === 3) return "text-sm";
  return "text-xs";
};

export default function FibonacciSearch() {
  const [arrayElements, setArrayElements] = useState(() =>
    loadFromStorage("fib-array-elements", "")
  );

  const [target, setTarget] = useState(() =>
    loadFromStorage("fib-target", "")
  );

  const [array, setArray] = useState([]);
  const [targetValue, setTargetValue] = useState(null);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const [visualState, setVisualState] = useState({
    offset: -1,
    probe: -1,
    foundIndex: -1,
    stepExplanation: "",
    stepCount: 0,
  });

  useEffect(() => {
    saveToStorage("fib-array-elements", arrayElements);
  }, [arrayElements]);

  useEffect(() => {
    saveToStorage("fib-target", target);
  }, [target]);

  const steps = useMemo(() => {
    if (array.length === 0 || targetValue === null) return [];
    return Array.from(fibonacciSearchGenerator(array, targetValue));
  }, [array, targetValue]);

  const onStep = useCallback(
    (step) => {
      let explanation = "";
      let msg = "";
      let msgType = "";

      switch (step.type) {
        case "checking":
          explanation = `Step ${step.step}: Probe index = ${step.i}. Compare arr[${step.i}] = ${step.value} with target ${targetValue}.`;
          break;

        case "move_right":
          explanation = `arr[${step.i}] < ${targetValue}. Move to the right portion.`;
          break;

        case "move_left":
          explanation = `arr[${step.i}] > ${targetValue}. Continue searching in the left portion.`;
          break;

        case "found":
          explanation = `Target ${targetValue} found at index ${step.i}.`;
          msg = `Element found at index ${step.i}`;
          msgType = "success";
          break;

        case "not_found":
          explanation = `Target ${targetValue} is not present in the array.`;
          msg = "Element not found.";
          msgType = "error";
          break;

        default:
          break;
      }

      setVisualState({
        offset: step.offset ?? -1,
        probe: step.i ?? -1,
        foundIndex: step.type === "found" ? step.i : -1,
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

  const isAnimating = engine.isPlaying || engine.currentStep > 0;

  const handleReset = () => {
    engine.reset();

    removeFromStorage("fib-array-elements");
    removeFromStorage("fib-target");

    setArray([]);
    setTargetValue(null);

    setArrayElements("");
    setTarget("");

    setMessage("");
    setMessageType("");

    setVisualState({
      offset: -1,
      probe: -1,
      foundIndex: -1,
      stepExplanation: "",
      stepCount: 0,
    });
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

    const elements = arrayElements
      .split(",")
      .map((v) => parseInt(v.trim()));

    const targetVal = parseInt(target);

    if (elements.some(isNaN) || isNaN(targetVal)) {
      setMessage("Please enter valid input.");
      setMessageType("warning");
      return;
    }

    setArray(elements);
    setTargetValue(targetVal);

    setTimeout(() => engine.play(), 50);
  };

  useVisualizerKeyboard({
    onTogglePlayPause: engine.isPlaying
      ? engine.pause
      : () => engine.play(),
    onStepForward: engine.stepForward,
    onStepBackward: engine.stepBackward,
    onSpeedChange: (s) => engine.setSpeed(s * 1000),
    speed: engine.speed / 1000,
    sorting: engine.isPlaying,
    sorted: false,
  });

  return (
    <main className="container mx-auto">

      <p className="text-lg text-center text-gray-600 dark:text-gray-400 mb-8">
        Visualize how Fibonacci Search efficiently finds an element using Fibonacci numbers.
      </p>

      {/* Input Form */}
      <form
        onSubmit={handleGo}
        className="max-w-4xl mx-auto bg-white dark:bg-neutral-950 p-6 rounded-xl border mb-8"
      >

        <label className="block mb-2">
          Sorted Array Elements
        </label>

        <div className="flex gap-2 mb-4">

          <input
            value={arrayElements}
            onChange={(e) => setArrayElements(e.target.value)}
            className="w-full border rounded-lg p-3"
            placeholder="1,3,5,7,9"
          />

          <button
            type="button"
            onClick={generateRandomArray}
            className="px-4 rounded-lg bg-[#a435f0] text-white"
          >
            Random
          </button>

        </div>

        <label className="block mb-2">
          Target
        </label>

        <div className="flex gap-2">

          <input
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            className="border rounded-lg p-3 flex-1"
            type="number"
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

        {isAnimating && (
          <div className="mt-5">
            <PlaybackControls
              isPlaying={engine.isPlaying}
              onPlayPause={
                engine.isPlaying
                  ? engine.pause
                  : engine.play
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
              progressText={`${engine.currentStep + 1}/${steps.length}`}
            />
          </div>
        )}

      </form>

      {message && (
        <div className="max-w-3xl mx-auto mb-6 text-center font-semibold">
          {message}
        </div>
      )}

      {visualState.stepExplanation && (
        <div className="max-w-4xl mx-auto mb-6 p-4 border rounded-xl">
          <h3 className="font-bold mb-2">
            Step Explanation
          </h3>

          <p>{visualState.stepExplanation}</p>
        </div>
      )}

      {array.length > 0 && (
        <div className="flex flex-wrap justify-center gap-4">

          {array.map((num, idx) => {

            let bg = "bg-gray-200";

            if (idx === visualState.probe)
              bg = "bg-yellow-400";

            if (idx === visualState.foundIndex)
              bg = "bg-green-500";

            return (
              <div
                key={idx}
                className="flex flex-col items-center"
              >

                <div
                  className={`w-16 h-16 rounded-lg border flex items-center justify-center ${bg} ${getFontSize(num)}`}
                >
                  {num}
                </div>

                <span className="text-xs mt-1">
                  [{idx}]
                </span>

              </div>
            );
          })}

        </div>
      )}

    </main>
  );
}