"use client";

import { useState } from "react";

export default function Animation() {
  const [text, setText] = useState("ADOBECODEBANC");
  const [pattern, setPattern] = useState("ABC");
  const [window, setWindow] = useState({ start: -1, end: -1 });

  const runDemo = () => {
    if (!text || !pattern) {
      setWindow({ start: -1, end: -1 });
      return;
    }

    const need = {};
    const have = {};

    for (const ch of pattern) {
      need[ch] = (need[ch] || 0) + 1;
    }

    let required = Object.keys(need).length;
    let formed = 0;

    let left = 0;
    let answer = [-1, 0, 0];

    for (let right = 0; right < text.length; right++) {
      const c = text[right];
      have[c] = (have[c] || 0) + 1;

      if (need[c] && have[c] === need[c]) {
        formed++;
      }

      while (left <= right && formed === required) {
        if (
          answer[0] === -1 ||
          right - left + 1 < answer[0]
        ) {
          answer = [right - left + 1, left, right];
        }

        const ch = text[left];
        have[ch]--;

        if (need[ch] && have[ch] < need[ch]) {
          formed--;
        }

        left++;
      }
    }

    if (answer[0] === -1) {
      setWindow({ start: -1, end: -1 });
    } else {
      setWindow({
        start: answer[1],
        end: answer[2],
      });
    }
  };

  return (
    <div className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1b1b1b] p-6">
      <h2 className="text-2xl font-bold mb-6">
        Minimum Window Substring Visualization
      </h2>

      <div className="space-y-5">
        <div>
          <label className="block mb-2 font-semibold">
            Text
          </label>

          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full rounded-lg border px-4 py-2 dark:bg-[#111]"
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold">
            Pattern
          </label>

          <input
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            className="w-full rounded-lg border px-4 py-2 dark:bg-[#111]"
          />
        </div>

        <button
          onClick={runDemo}
          className="px-6 py-2 rounded-lg bg-pink-600 hover:bg-pink-700 text-white font-semibold"
        >
          Find Minimum Window
        </button>

        <div className="rounded-xl bg-slate-100 dark:bg-slate-800 p-4">
          <p className="font-semibold mb-3">Text</p>

          <div className="flex flex-wrap gap-2">
            {text.split("").map((ch, i) => {
              const highlight =
                window.start !== -1 &&
                i >= window.start &&
                i <= window.end;

              return (
                <span
                  key={i}
                  className={`w-8 h-8 rounded flex items-center justify-center font-bold ${
                    highlight
                      ? "bg-pink-600 text-white"
                      : "bg-white dark:bg-slate-700"
                  }`}
                >
                  {ch}
                </span>
              );
            })}
          </div>
        </div>

        <div className="rounded-xl bg-slate-100 dark:bg-slate-800 p-4">
          {window.start === -1 ? (
            <p>No valid window found.</p>
          ) : (
            <>
              <p className="font-semibold text-green-600">
                Minimum Window Found
              </p>

              <p className="mt-2">
                Start Index: <strong>{window.start}</strong>
              </p>

              <p>
                End Index: <strong>{window.end}</strong>
              </p>

              <p className="mt-2">
                Window:
                <strong>
                  {" "}
                  {text.slice(window.start, window.end + 1)}
                </strong>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}