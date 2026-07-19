"use client";

import { useMemo, useState } from "react";
import { Play, RotateCcw, SkipForward } from "lucide-react";

/**
 * Build the Longest Prefix Suffix (LPS / failure-function) array for the
 * given pattern.  lps[i] is the length of the longest proper prefix of
 * pattern[0..i] that is also a suffix.
 */
function buildLPS(pattern) {
  const lps = new Array(pattern.length).fill(0);
  let len = 0; // length of the previous longest prefix-suffix
  let k = 1;

  while (k < pattern.length) {
    if (pattern[k] === pattern[len]) {
      len++;
      lps[k] = len;
      k++;
    } else if (len !== 0) {
      // Do NOT increment k here — try the shorter prefix.
      len = lps[len - 1];
    } else {
      lps[k] = 0;
      k++;
    }
  }

  return lps;
}

/**
 * Generate one animation state per comparison step using the true KMP
 * algorithm.  On a mismatch the pattern pointer is shifted via the LPS
 * table instead of being naively reset to 0.
 */
function generateKMPStates(text, pattern) {
  const result = [];
  if (!pattern.length || !text.length) return result;

  const lps = buildLPS(pattern);
  let i = 0; // index into text
  let j = 0; // index into pattern

  while (i < text.length) {
    const matched = text[i] === pattern[j];

    result.push({
      textIndex: i,
      patternIndex: j,
      match: matched,
      // Snapshot the LPS row so the UI can display it.
      lps: [...lps],
      // Record a full match occurrence for the status panel.
      fullMatch: matched && j === pattern.length - 1,
    });

    if (matched) {
      i++;
      j++;
      if (j === pattern.length) {
        // Full pattern matched — use LPS to continue without re-scanning.
        j = lps[j - 1];
      }
    } else {
      if (j !== 0) {
        // Shift the pattern pointer using the failure function.
        j = lps[j - 1];
      } else {
        // j is already 0; advance the text pointer.
        i++;
      }
    }
  }

  return result;
}

export default function Animation() {
  const [text, setText] = useState("ABABDABACDABABCABAB");
  const [pattern, setPattern] = useState("ABABCABAB");
  const [step, setStep] = useState(0);

  const lps = useMemo(() => buildLPS(pattern), [pattern]);

  const states = useMemo(
    () => generateKMPStates(text, pattern),
    [text, pattern]
  );

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

      <div className="mt-6 rounded-lg bg-gray-100 dark:bg-gray-800 p-4 space-y-2">

        <p>
          <strong>Current Text Index (i):</strong> {current.textIndex}
        </p>

        <p>
          <strong>Current Pattern Index (j):</strong> {current.patternIndex}
        </p>

        <p>
          <strong>Status:</strong>{" "}
          {current.fullMatch
            ? "✅ Full Match Found!"
            : current.match
            ? "Characters Match ✅"
            : "Characters Mismatch ❌ — jumping j via LPS"}
        </p>

        <div>
          <strong>LPS Array:</strong>
          <div className="flex flex-wrap gap-1 mt-1">
            {lps.map((val, idx) => (
              <div
                key={idx}
                className="w-8 h-8 rounded flex items-center justify-center text-xs font-bold border bg-violet-100 dark:bg-violet-900"
              >
                {val}
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}