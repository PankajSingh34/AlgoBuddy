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

import { palindromeCheckGenerator } from "@/features/algorithms/string/palindromeCheckLogic";
import { useAnimationEngine } from "@/lib/visualizer/useAnimationEngine";

const PalindromeCheck = () => {
  const [input, setInput] = useState(() =>
    loadFromStorage("palindrome-input", "")
  );

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const [text, setText] = useState("");

  const [visualState, setVisualState] = useState({
    left: -1,
    right: -1,
    matched: [],
    mismatch: [],
    stepExplanation: "",
    stepCount: 0,
    isPalindrome: null,
  });

  useEffect(() => {
    saveToStorage("palindrome-input", input);
  }, [input]);

  const steps = useMemo(() => {
    if (!text) return [];
    return Array.from(palindromeCheckGenerator(text));
  }, [text]);

  const onStep = useCallback((step) => {
    let explanation = "";
    let msg = "";
    let msgType = "";

    switch (step.type) {
      case "compare":
        explanation = `Step ${step.step}: Compare '${step.leftChar}' at index ${step.left} with '${step.rightChar}' at index ${step.right}.`;
        break;

      case "match":
        explanation = `Characters '${step.leftChar}' and '${step.rightChar}' match. Move both pointers inward.`;
        break;

      case "mismatch":
        explanation = `Characters '${step.leftChar}' and '${step.rightChar}' do not match. Therefore, this string is NOT a palindrome.`;
        msg = `"${text}" is NOT a palindrome.`;
        msgType = "error";
        break;

      case "success":
        explanation =
          "All character pairs matched successfully. Therefore, the string IS a palindrome.";
        msg = `"${text}" is a palindrome.`;
        msgType = "success";
        break;

      default:
        break;
    }

    setVisualState({
      left: step.left ?? -1,
      right: step.right ?? -1,
      matched: step.matched || [],
      mismatch: step.mismatch || [],
      stepExplanation: explanation,
      stepCount: step.step || 0,
      isPalindrome: step.result ?? null,
    });

    if (msg) setMessage(msg);
    if (msgType) setMessageType(msgType);
  }, [text]);

  const engine = useAnimationEngine({
    steps,
    onStep,
    initialSpeed: 1000,
  });

  const isAnimating =
    engine.isPlaying || engine.currentStep > 0;
      const handleReset = () => {
    engine.reset();

    removeFromStorage("palindrome-input");

    setInput("");
    setText("");

    setMessage("");
    setMessageType("");

    setVisualState({
      left: -1,
      right: -1,
      matched: [],
      mismatch: [],
      stepExplanation: "",
      stepCount: 0,
      isPalindrome: null,
    });
  };

  const handleGo = (e) => {
    e.preventDefault();

    engine.reset();

    setMessage("");
    setMessageType("");

    setVisualState({
      left: -1,
      right: -1,
      matched: [],
      mismatch: [],
      stepExplanation: "",
      stepCount: 0,
      isPalindrome: null,
    });

    if (!input.trim()) {
      setMessage("Please enter a string.");
      setMessageType("warning");
      return;
    }

    const cleaned = input.trim();

    setText(cleaned);

    setTimeout(() => {
      engine.play();
    }, 50);
  };

  useVisualizerKeyboard({
    onTogglePlayPause: engine.isPlaying
      ? engine.pause
      : () => {
          if (text.length > 0) engine.play();
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
      ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
      : messageType === "warning"
      ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
      : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200";

  return (
    <main className="container mx-auto">
              <p className="text-lg text-center text-gray-600 dark:text-gray-400 mb-8">
        Visualize how the Palindrome Check algorithm compares characters from
        both ends of a string.
      </p>

      <form
        onSubmit={handleGo}
        className="max-w-4xl mx-auto bg-white dark:bg-neutral-950 p-6 rounded-xl border border-gray-200 dark:border-gray-700 mb-8"
      >
        <div className="mb-5">
          <label
            htmlFor="inputString"
            className="block text-gray-700 dark:text-gray-300 mb-2"
          >
            Enter a String
          </label>

          <input
            id="inputString"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g. madam"
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

      {text.length > 0 && (
        <div className="max-w-5xl mx-auto space-y-6">
                      {visualState.stepExplanation && (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="flex items-center gap-2 bg-[#a435f0]/10 dark:bg-[#a435f0]/20 px-4 py-2 border-b border-[#a435f0]/20">
                <span className="w-2 h-2 rounded-full bg-[#a435f0] animate-pulse"></span>

                <span className="text-sm font-semibold text-[#a435f0] uppercase tracking-wide">
                  Step Explanation
                </span>

                {visualState.stepCount > 0 && (
                  <span className="ml-auto text-xs text-gray-500 dark:text-gray-400">
                    Step #{visualState.stepCount}
                  </span>
                )}
              </div>

              <div className="px-4 py-3">
                <p className="font-mono text-sm text-gray-700 dark:text-gray-200">
                  {visualState.stepExplanation}
                </p>
              </div>
            </div>
          )}

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-center mb-6 dark:text-white">
              String Visualization
            </h2>

            <div className="flex flex-wrap justify-center gap-3">
              {text.split("").map((char, index) => {
                let bg =
                  "bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600";

                if (visualState.matched.includes(index)) {
                  bg = "bg-green-500 border-green-700 text-white";
                }

                if (visualState.mismatch.includes(index)) {
                  bg = "bg-red-500 border-red-700 text-white";
                }

                if (
                  index === visualState.left &&
                  !visualState.matched.includes(index)
                ) {
                  bg = "bg-blue-400 border-blue-600 text-white";
                }

                if (
                  index === visualState.right &&
                  !visualState.matched.includes(index)
                ) {
                  bg = "bg-yellow-400 border-yellow-600 text-black";
                }

                return (
                  <div
                    key={index}
                    className="flex flex-col items-center"
                  >
                    <div
                      className={`w-14 h-14 rounded-lg border-2 flex items-center justify-center text-xl font-bold transition-all duration-300 ${bg}`}
                    >
                      {char}
                    </div>

                    <div className="mt-2 text-xs text-gray-500">
                      [{index}]
                    </div>

                    {index === visualState.left && (
                      <div className="text-blue-500 text-xs font-semibold">
                        Left
                      </div>
                    )}

                    {index === visualState.right && (
                      <div className="text-yellow-600 text-xs font-semibold">
                        Right
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm">
              <span>
                🟦 <strong>Left Pointer</strong>
              </span>

              <span>
                🟨 <strong>Right Pointer</strong>
              </span>

              <span>
                🟩 <strong>Matched</strong>
              </span>

              <span>
                🟥 <strong>Mismatch</strong>
              </span>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default PalindromeCheck;