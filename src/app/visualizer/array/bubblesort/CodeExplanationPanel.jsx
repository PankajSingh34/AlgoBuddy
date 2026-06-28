"use client";
import { useState } from "react";

const codeSteps = {
  javascript: [
    { line: 1, code: "for (let i = 0; i < arr.length; i++) {", explanation: "Outer loop: i goes from 0 to end. Each pass bubbles the largest unsorted element to its correct position." },
    { line: 2, code: "  for (let j = 0; j < arr.length - i - 1; j++) {", explanation: "Inner loop: j compares adjacent elements. We stop at length-i-1 because last i elements are already sorted." },
    { line: 3, code: "    if (arr[j] > arr[j + 1]) {", explanation: "Compare current element with next. If current is bigger, we need to swap them." },
    { line: 4, code: "      [arr[j], arr[j+1]] = [arr[j+1], arr[j]];", explanation: "Swap! The bigger element moves one step to the right (bubbles up)." },
    { line: 5, code: "    }", explanation: "End of swap block." },
    { line: 6, code: "  }", explanation: "End of inner loop. One full inner pass done — largest unsorted element is now in place." },
    { line: 7, code: "}", explanation: "End of outer loop. Array is fully sorted!" },
  ],
  python: [
    { line: 1, code: "for i in range(len(arr)):", explanation: "Outer loop: i goes from 0 to end. Each pass bubbles the largest unsorted element to its correct position." },
    { line: 2, code: "  for j in range(len(arr)-i-1):", explanation: "Inner loop: j compares adjacent elements. We stop at length-i-1 because last i elements are already sorted." },
    { line: 3, code: "    if arr[j] > arr[j+1]:", explanation: "Compare current element with next. If current is bigger, we need to swap them." },
    { line: 4, code: "      arr[j], arr[j+1] = arr[j+1], arr[j]", explanation: "Swap! The bigger element moves one step to the right (bubbles up)." },
    { line: 5, code: "  # inner loop ends", explanation: "End of inner loop. One full inner pass done." },
    { line: 6, code: "# outer loop ends", explanation: "End of outer loop. Array is fully sorted!" },
  ],
  java: [
    { line: 1, code: "for (int i = 0; i < n-1; i++) {", explanation: "Outer loop: i goes from 0 to n-1. Each pass bubbles the largest unsorted element to its correct position." },
    { line: 2, code: "  for (int j = 0; j < n-i-1; j++) {", explanation: "Inner loop: j compares adjacent elements. Stops at n-i-1 as last i elements are already sorted." },
    { line: 3, code: "    if (arr[j] > arr[j+1]) {", explanation: "Compare current element with next. If current is bigger, we need to swap." },
    { line: 4, code: "      int temp = arr[j];", explanation: "Save current element in a temporary variable before overwriting." },
    { line: 5, code: "      arr[j] = arr[j+1];", explanation: "Move the smaller element to the left position." },
    { line: 6, code: "      arr[j+1] = temp;", explanation: "Put the bigger element to the right position. Swap complete!" },
    { line: 7, code: "    }", explanation: "End of swap block." },
    { line: 8, code: "  }", explanation: "End of inner loop. Largest unsorted element is now in place." },
    { line: 9, code: "}", explanation: "End of outer loop. Array is fully sorted!" },
  ],
};

export default function CodeExplanationPanel({ currentStep = 0, iValues = { i: 0, j: 0, array: [] } }) {
  const [lang, setLang] = useState("javascript");
  const [isOpen, setIsOpen] = useState(true);

  const steps = codeSteps[lang];
  const activeLineIndex = currentStep % steps.length;
  const activeStep = steps[activeLineIndex];

  return (
    <div className="w-full max-w-2xl mx-auto mt-4 rounded-xl border border-purple-400 bg-[#1a1a2e] text-white shadow-lg">
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 bg-purple-700 rounded-t-xl cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h2 className="text-base font-semibold tracking-wide">📖 Code Explanation Panel</h2>
        <span className="text-xl">{isOpen ? "▲" : "▼"}</span>
      </div>

      {isOpen && (
        <div className="p-4 space-y-4">
          {/* Language Selector */}
          <div className="flex gap-2">
            {["javascript", "python", "java"].map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                  lang === l
                    ? "bg-purple-600 text-white"
                    : "bg-[#2a2a4a] text-gray-300 hover:bg-purple-800"
                }`}
              >
                {l.charAt(0).toUpperCase() + l.slice(1)}
              </button>
            ))}
          </div>

          {/* Code Block */}
          <div className="bg-[#0f0f1a] rounded-lg p-3 font-mono text-sm overflow-auto max-h-52">
            {steps.map((step, idx) => (
              <div
                key={idx}
                className={`px-2 py-0.5 rounded transition-all ${
                  idx === activeLineIndex
                    ? "bg-purple-600 text-white font-bold"
                    : "text-gray-400"
                }`}
              >
                <span className="select-none mr-2 text-gray-600">{step.line}</span>
                {step.code}
              </div>
            ))}
          </div>

          {/* Explanation Box */}
          <div className="bg-purple-900/40 border border-purple-500 rounded-lg px-4 py-3 text-sm">
            <p className="text-purple-300 font-semibold mb-1">💡 What's happening:</p>
            <p className="text-gray-200">{activeStep.explanation}</p>
          </div>

          {/* Variable State Tracker */}
          <div className="bg-[#0f0f1a] rounded-lg p-3 text-sm">
            <p className="text-purple-300 font-semibold mb-2">📊 Variable State Tracker</p>
            <div className="flex flex-wrap gap-3">
              <span className="bg-purple-800 px-3 py-1 rounded-full">
                i = <strong>{iValues.i}</strong>
              </span>
              <span className="bg-purple-800 px-3 py-1 rounded-full">
                j = <strong>{iValues.j}</strong>
              </span>
              <span className="bg-purple-800 px-3 py-1 rounded-full">
                array = [{iValues.array?.join(", ")}]
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}