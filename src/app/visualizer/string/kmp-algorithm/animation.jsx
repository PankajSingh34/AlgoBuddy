"use client";

import { useMemo, useState } from "react";
import { Play, RotateCcw, SkipForward } from "lucide-react";

export default function Animation() {
  const [text, setText] = useState("ABABDABACDABABCABAB");
  const [pattern, setPattern] = useState("ABABCABAB");
  const [step, setStep] = useState(0);

  const states = useMemo(() => {
    const result = [];
    let i = 0;
    let j = 0;

    while (i < text.length && j < pattern.length) {
      result.push({
        textIndex: i,
        patternIndex: j,
        match: text[i] === pattern[j],
      });

      if (text[i] === pattern[j]) {
        i++;
        j++;
      } else {
        i++;
        j = 0;
      }
    }

    return result;
  }, [text, pattern]);

  const current = states[Math.min(step, states.length - 1)] || {
    textIndex: 0,
    patternIndex: 0,
    match: false,
  };

  const nextStep = () => {
    setStep((prev) => Math.min(prev + 1, states.length - 1));
  };

  const reset = () => {
    setStep(0);
  };

  return (
    <div className="rounded-xl border bg-white dark:bg-[#1a1a1a] p-6 shadow">

      <div className="grid md:grid-cols-2 gap-4 mb-6">

        <div>
          <label className="block text-sm font-semibold mb-2">
            Text
          </label>

          <input
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              setStep(0);
            }}
            className="w-full rounded-lg border px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">
            Pattern
          </label>

          <input
            value={pattern}
            onChange={(e) => {
              setPattern(e.target.value);
              setStep(0);
            }}
            className="w-full rounded-lg border px-3 py-2"
          />
        </div>

      </div>

      <div className="space-y-4">

        <div>

          <h3 className="font-semibold mb-2">
            Text
          </h3>

          <div className="flex flex-wrap gap-2">

            {text.split("").map((ch, index) => (
              <div
                key={index}
                className={`w-10 h-10 rounded-lg flex items-center justify-center border font-bold
                ${
                  index === current.textIndex
                    ? current.match
                      ? "bg-green-500 text-white"
                      : "bg-red-500 text-white"
                    : "bg-gray-100 dark:bg-gray-800"
                }`}
              >
                {ch}
              </div>
            ))}

          </div>

        </div>

        <div>

          <h3 className="font-semibold mb-2">
            Pattern
          </h3>

          <div className="flex flex-wrap gap-2">

            {pattern.split("").map((ch, index) => (
              <div
                key={index}
                className={`w-10 h-10 rounded-lg flex items-center justify-center border font-bold
                ${
                  index === current.patternIndex
                    ? current.match
                      ? "bg-green-500 text-white"
                      : "bg-red-500 text-white"
                    : "bg-gray-100 dark:bg-gray-800"
                }`}
              >
                {ch}
              </div>
            ))}

          </div>

        </div>

      </div>

      <div className="flex gap-3 mt-8">

        <button
          onClick={nextStep}
          className="px-4 py-2 rounded-lg bg-violet-600 text-white flex items-center gap-2"
        >
          <Play size={18} />
          Next Step
        </button>

        <button
          onClick={reset}
          className="px-4 py-2 rounded-lg bg-gray-600 text-white flex items-center gap-2"
        >
          <RotateCcw size={18} />
          Reset
        </button>

        <button
          onClick={() => setStep(states.length - 1)}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white flex items-center gap-2"
        >
          <SkipForward size={18} />
          Finish
        </button>

      </div>

      <div className="mt-6 rounded-lg bg-gray-100 dark:bg-gray-800 p-4">

        <p>
          <strong>Current Text Index:</strong> {current.textIndex}
        </p>

        <p>
          <strong>Current Pattern Index:</strong> {current.patternIndex}
        </p>

        <p>
          <strong>Status:</strong>{" "}
          {current.match ? "Characters Match ✅" : "Characters Mismatch ❌"}
        </p>

      </div>

    </div>
  );
}