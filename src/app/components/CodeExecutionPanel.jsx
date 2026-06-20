"use client";

import { useState } from "react";

const codeExamples = {
  JavaScript: [
    "function linearSearch(arr, target) {",
    "  for(let i = 0; i < arr.length; i++) {",
    "    if(arr[i] === target) return i;",
    "  }",
    "  return -1;",
    "}",
  ],

  Python: [
    "def linear_search(arr, target):",
    "    for i in range(len(arr)):",
    "        if arr[i] == target:",
    "            return i",
    "    return -1",
  ],
};

export default function CodeExecutionPanel() {
  const [language, setLanguage] = useState("JavaScript");
  const [currentLine, setCurrentLine] = useState(0);

  const nextStep = () => {
    setCurrentLine((prev) =>
      prev < codeExamples[language].length - 1 ? prev + 1 : prev
    );
  };

  const reset = () => {
    setCurrentLine(0);
  };

  return (
    <div className="grid md:grid-cols-2 gap-5 p-5">

      {/* Code Side */}
      <div className="bg-black text-white p-4 rounded-lg">
        <div className="flex justify-between mb-3">
          <h2 className="font-bold">
            Source Code
          </h2>

          <select
            className="text-black rounded px-2"
            value={language}
            onChange={(e) => {
              setLanguage(e.target.value);
              setCurrentLine(0);
            }}
          >
            <option>JavaScript</option>
            <option>Python</option>
          </select>
        </div>


        <pre>
          {codeExamples[language].map((line, index) => (
            <div
              key={index}
              className={`px-2 py-1 rounded ${
                index === currentLine
                  ? "bg-yellow-500 text-black"
                  : ""
              }`}
            >
              {index + 1}. {line}
            </div>
          ))}
        </pre>
      </div>


      {/* Visualization Side */}
      <div className="bg-gray-100 dark:bg-gray-800 p-5 rounded-lg">
        <h2 className="font-bold mb-3">
          Algorithm Visualization
        </h2>

        <div className="h-40 flex items-center justify-center border rounded">
          Step {currentLine + 1}
        </div>


        <div className="mt-4 flex gap-3">

          <button
            onClick={nextStep}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Next Step
          </button>

          <button
            onClick={reset}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Reset
          </button>

        </div>

      </div>

    </div>
  );
}