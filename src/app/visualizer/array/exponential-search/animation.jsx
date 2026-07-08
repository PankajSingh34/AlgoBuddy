"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import GoButton from "@/app/components/ui/goButton";
import ResetButton from "@/app/components/ui/resetButton";
import {
  saveToStorage,
  loadFromStorage,
  removeFromStorage,
} from "@/utils/storage";
import useVisualizerKeyboard from "@/app/hooks/useVisualizerKeyboard";
import PlaybackControls from "@/app/components/ui/PlaybackControls";
import { useAnimationEngine } from "@/lib/visualizer/useAnimationEngine";
import { exponentialSearchGenerator } from "@/features/algorithms/array/exponentialSearchLogic";

const getFontSize = (value) => {
  const len = String(value).length;
  if (len <= 2) return "text-lg";
  if (len === 3) return "text-sm";
  return "text-xs";
};

export default function ExponentialSearch() {
  const [arrayElements, setArrayElements] = useState(() =>
    loadFromStorage("exponential-array-elements", "")
  );
  const [target, setTarget] = useState(() =>
    loadFromStorage("exponential-target", "")
  );

  const [array, setArray] = useState([]);
  const [targetValue, setTargetValue] = useState(null);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const [visualState, setVisualState] = useState({
    low: -1,
    high: -1,
    current: -1,
    foundIndex: -1,
    stepExplanation: "",
    stepCount: 0,
  });

  useEffect(() => {
    saveToStorage("exponential-array-elements", arrayElements);
  }, [arrayElements]);

  useEffect(() => {
    saveToStorage("exponential-target", target);
  }, [target]);

  const steps = useMemo(() => {
    if (array.length === 0 || targetValue === null) return [];
    return Array.from(exponentialSearchGenerator(array, targetValue));
  }, [array, targetValue]);

  const onStep = useCallback(
    (step) => {
      let explanation = "";

      switch (step.type) {
        case "range":
          explanation = `Expanding search range. Current index = ${step.current}.`;
          break;

        case "binary":
          explanation = `Binary Search between index ${step.low} and ${step.high}. Mid = ${step.mid}.`;
          break;

        case "found":
          explanation = `Target ${targetValue} found at index ${step.index}.`;
          setMessage(`Element found at index ${step.index}`);
          setMessageType("success");
          break;

        case "not_found":
          explanation = `Target ${targetValue} is not present in the array.`;
          setMessage("Element not found.");
          setMessageType("error");
          break;

        default:
          explanation = "";
      }

      setVisualState({
        low: step.low ?? -1,
        high: step.high ?? -1,
        current: step.current ?? step.mid ?? -1,
        foundIndex: step.index ?? -1,
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

  const isAnimating = engine.isPlaying || engine.currentStep > 0;

  const generateRandomArray = () => {
    const arr = Array.from(
      { length: 10 },
      () => Math.floor(Math.random() * 100)
    ).sort((a, b) => a - b);

    setArrayElements(arr.join(", "));
  };

  const handleReset = () => {
    engine.reset();

    removeFromStorage("exponential-array-elements");
    removeFromStorage("exponential-target");

    setArray([]);
    setTargetValue(null);
    setMessage("");
    setMessageType("");

    setVisualState({
      low: -1,
      high: -1,
      current: -1,
      foundIndex: -1,
      stepExplanation: "",
      stepCount: 0,
    });

    setArrayElements("");
    setTarget("");
  };

  const handleGo = (e) => {
    e.preventDefault();

    engine.reset();

    const arr = arrayElements
      .split(",")
      .map((x) => parseInt(x.trim()));

    const targetNum = parseInt(target);

    if (arr.some(isNaN) || isNaN(targetNum)) {
      setMessage("Invalid input.");
      setMessageType("warning");
      return;
    }

    arr.sort((a, b) => a - b);

    setArray(arr);
    setTargetValue(targetNum);

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
    sorted: engine.currentStep === steps.length - 1,
  });

  return (
    <main className="container mx-auto">

      <p className="text-lg text-center text-gray-600 mb-8">
        Visualize how Exponential Search quickly finds the search range before applying Binary Search.
      </p>

      <form
        onSubmit={handleGo}
        className="max-w-4xl mx-auto bg-white dark:bg-neutral-950 p-6 rounded-xl border mb-8"
      >

        <div className="mb-4">
          <label>Sorted Array</label>

          <div className="flex gap-2">

            <input
              className="w-full border rounded-lg p-3"
              value={arrayElements}
              onChange={(e) => setArrayElements(e.target.value)}
              disabled={isAnimating}
            />

            <button
              type="button"
              onClick={generateRandomArray}
              className="px-4 rounded-lg bg-[#a435f0] text-white"
            >
              Random
            </button>

          </div>
        </div>

        <div className="mb-4">

          <label>Target</label>

          <div className="flex gap-2">

            <input
              type="number"
              className="border rounded-lg p-3 w-48"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
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
            isPlaying={engine.isPlaying}
            onPlayPause={
              engine.isPlaying ? engine.pause : () => engine.play()
            }
            speed={engine.speed / 1000}
            onSpeedChange={(s) => engine.setSpeed(s * 1000)}
            onStepForward={engine.stepForward}
            onStepBackward={engine.stepBackward}
            onReset={engine.reset}
            disabled={!steps.length}
            progressText={`${engine.currentStep + 1}/${steps.length}`}
          />
        )}

      </form>

      {message && (
        <div className="text-center mb-6 font-semibold">
          {message}
        </div>
      )}

      {visualState.stepExplanation && (
        <div className="max-w-4xl mx-auto mb-6 p-4 border rounded-lg">
          <p>{visualState.stepExplanation}</p>
        </div>
      )}

      {array.length > 0 && (
        <div className="flex flex-wrap justify-center gap-4">

          {array.map((value, index) => {

            let color =
              "bg-gray-200 border-gray-400";

            if (index === visualState.foundIndex) {
              color = "bg-green-400 border-green-700";
            } else if (index === visualState.current) {
              color = "bg-yellow-300 border-yellow-600";
            } else if (
              visualState.low !== -1 &&
              visualState.high !== -1 &&
              index >= visualState.low &&
              index <= visualState.high
            ) {
              color = "bg-blue-300 border-blue-600";
            }

            return (
              <div
                key={index}
                className={`w-16 h-16 border-2 rounded-lg flex items-center justify-center ${color} ${getFontSize(
                  value
                )}`}
              >
                {value}
              </div>
            );
          })}

        </div>
      )}

    </main>
  );
}