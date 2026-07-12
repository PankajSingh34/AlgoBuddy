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

import { reverseStringGenerator } from "@/features/algorithms/string/reverseStringLogic";

const ReverseString = () => {
  const [inputString, setInputString] = useState(() =>
    loadFromStorage("reverse-string-input", "")
  );

  const [characters, setCharacters] = useState([]);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const [visualState, setVisualState] = useState({
    left: -1,
    right: -1,
    array: [],
    explanation: "",
    step: 0,
    completed: false,
  });

  useEffect(() => {
    saveToStorage("reverse-string-input", inputString);
  }, [inputString]);

  const steps = useMemo(() => {
    if (!characters.length) return [];
    return Array.from(reverseStringGenerator(characters.join("")));
  }, [characters]);

  const onStep = useCallback((step) => {
    setVisualState({
      left: step.left,
      right: step.right,
      array: step.array,
      explanation: step.explanation,
      step: step.step,
      completed: step.type === "complete",
    });

    if (step.type === "complete") {
      setMessage(
        `Reverse Completed : ${step.array.join("")}`
      );
      setMessageType("success");
    }
  }, []);

  const engine = useAnimationEngine({
    steps,
    onStep,
    initialSpeed: 1000,
  });

  const isAnimating =
    engine.isPlaying || engine.currentStep > 0;

  const handleReset = () => {
    engine.reset();

    removeFromStorage("reverse-string-input");

    setInputString("");

    setCharacters([]);

    setMessage("");

    setMessageType("");

    setVisualState({
      left: -1,
      right: -1,
      array: [],
      explanation: "",
      step: 0,
      completed: false,
    });
  };

  const handleGo = (e) => {
    e.preventDefault();

    engine.reset();

    setMessage("");
    setMessageType("");

    if (!inputString.trim()) {
      setMessage("Please enter a string.");
      setMessageType("warning");
      return;
    }

    const chars = inputString.split("");

    setCharacters(chars);

    setTimeout(() => {
      engine.play();
    }, 50);
  };

  useVisualizerKeyboard({
    onTogglePlayPause: engine.isPlaying
      ? engine.pause
      : () => {
          if (characters.length) engine.play();
        },

    onStepForward: engine.stepForward,

    onStepBackward: engine.stepBackward,

    onSpeedChange: (speed) =>
      engine.setSpeed(speed * 1000),

    speed: engine.speed / 1000,

    sorting: engine.isPlaying,

    sorted:
      engine.currentStep === steps.length - 1 &&
      steps.length > 0,
  });

  const messageClass =
    messageType === "success"
      ? "bg-green-100 text-green-800"
      : messageType === "warning"
      ? "bg-yellow-100 text-yellow-800"
      : "bg-red-100 text-red-800";
      return (
  <main className="container mx-auto">

    <p className="text-lg text-center text-gray-600 dark:text-gray-400 mb-8">
      Visualize how the Reverse String algorithm swaps characters using two pointers.
    </p>

    <form
      onSubmit={handleGo}
      className="max-w-4xl mx-auto bg-white dark:bg-neutral-950 p-6 rounded-xl border border-gray-200 dark:border-gray-700 mb-8"
    >
      <div className="mb-4">
        <label className="block text-gray-700 dark:text-gray-300 mb-2">
          Input String
        </label>

        <input
          type="text"
          value={inputString}
          onChange={(e) => setInputString(e.target.value)}
          placeholder="Example: HELLO"
          disabled={isAnimating}
          className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:border-[#a435f0] focus:outline-none focus:ring-2 focus:ring-[#a435f0]/30 transition duration-300"
        />
      </div>

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

      {isAnimating && (
        <div className="mt-5">
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
        </div>
      )}
    </form>

    {message && (
      <div
        className={`max-w-3xl mx-auto mb-8 p-4 rounded-lg ${messageClass}`}
      >
        <p className="text-center font-medium">
          {message}
        </p>
      </div>
    )}
        {characters.length > 0 && (
      <div className="max-w-4xl mx-auto space-y-6">

        {visualState.explanation && (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">

            <div className="flex items-center gap-2 bg-pink-100 dark:bg-pink-900 px-4 py-2 border-b">

              <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse"></span>

              <span className="text-sm font-semibold text-pink-600 uppercase">
                Step Explanation
              </span>

              <span className="ml-auto text-xs text-gray-500">
                Step {visualState.step}
              </span>

            </div>

            <div className="px-4 py-4">
              <p className="font-mono text-sm">
                {visualState.explanation}
              </p>
            </div>

          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">

          <h2 className="text-2xl font-bold text-center mb-8">
            Reverse String Visualization
          </h2>

          <div className="flex justify-center gap-4 flex-wrap">

            {visualState.array.map((char, index) => {

              let bg =
                "bg-gray-200 dark:bg-gray-700";

              let border =
                "border-gray-400";

              if (index === visualState.left) {
                bg = "bg-blue-500";
                border = "border-blue-700";
              }

              if (index === visualState.right) {
                bg = "bg-pink-500";
                border = "border-pink-700";
              }

              if (
                visualState.completed
              ) {
                bg = "bg-green-500";
                border = "border-green-700";
              }

              return (
                <div
                  key={index}
                  className="flex flex-col items-center"
                >

                  <div
                    className={`w-16 h-16 rounded-xl border-2 flex items-center justify-center font-bold text-2xl transition-all duration-500 ${bg} ${border} ${
                      bg === "bg-gray-200 dark:bg-gray-700"
                        ? "text-black dark:text-white"
                        : "text-white"
                    }`}
                  >
                    {char}
                  </div>

                  <div className="mt-2 text-xs h-6">

                    {index === visualState.left && (
                      <span className="text-blue-600 font-semibold">
                        Left
                      </span>
                    )}

                    {index === visualState.right && (
                      <span className="text-pink-600 font-semibold">
                        Right
                      </span>
                    )}

                  </div>

                  <div className="text-[11px] text-gray-500">

                    [{index}]

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

export default ReverseString;