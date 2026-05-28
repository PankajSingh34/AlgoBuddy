"use client";

import { useEffect, useMemo, useState } from "react";
import { BarChart3, Code2, Play, RotateCcw } from "lucide-react";

const defaultInput = "-2, 1, -3, 4, -1, 2, 1, -5, 4";

function parseArray(input) {
  const rawValues = input
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);

  const parsed = rawValues
    .map((entry) => Number(entry))
    .filter((value) => Number.isFinite(value));

  return parsed.length === rawValues.length ? parsed : [];
}

function buildFrames(values) {
  if (values.length === 0) return [];

  const frames = [];
  let currentSum = values[0];
  let maxSum = values[0];

  frames.push({
    index: 0,
    value: values[0],
    currentSum,
    maxSum,
    description: `Start with index 0. Current Sum = ${currentSum}, Max Sum = ${maxSum}`,
  });

  for (let i = 1; i < values.length; i += 1) {
    const previousCurrent = currentSum;
    currentSum = Math.max(values[i], previousCurrent + values[i]);
    maxSum = Math.max(maxSum, currentSum);

    frames.push({
      index: i,
      value: values[i],
      currentSum,
      maxSum,
      previousCurrent,
      description: `At index ${i}, compare ${values[i]} vs ${previousCurrent} + ${values[i]} = ${previousCurrent + values[i]}. Current Sum becomes ${currentSum}, Max Sum becomes ${maxSum}`,
    });
  }

  return frames;
}

const codeSnippet = `function kadane(arr) {
  let maxSum = arr[0];
  let currentSum = arr[0];

  for (let i = 1; i < arr.length; i++) {
    currentSum = Math.max(arr[i], currentSum + arr[i]);
    maxSum = Math.max(maxSum, currentSum);
  }
}`;

export default function KadaneVisualizer() {
  const [inputValue, setInputValue] = useState(defaultInput);
  const [speed, setSpeed] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const [error, setError] = useState("");

  const parsedArray = useMemo(() => parseArray(inputValue), [inputValue]);

  const frames = useMemo(() => buildFrames(parsedArray), [parsedArray]);
  const activeFrame = frames[currentFrameIndex] || frames[0] || null;

  useEffect(() => {
    if (!isPlaying || frames.length === 0) return undefined;

    if (currentFrameIndex >= frames.length - 1) {
      setIsPlaying(false);
      return undefined;
    }

    const timer = setTimeout(() => {
      setCurrentFrameIndex((index) => index + 1);
    }, 1500 / speed);

    return () => clearTimeout(timer);
  }, [currentFrameIndex, frames.length, isPlaying, speed]);

  const handleVisualize = () => {
    if (parsedArray.length === 0) {
      setError("Enter at least one valid integer in the array.");
      setIsPlaying(false);
      setCurrentFrameIndex(0);
      return;
    }

    setError("");
    setCurrentFrameIndex(0);
    setIsPlaying(true);
  };

  const handleReset = () => {
    setCurrentFrameIndex(0);
    setIsPlaying(false);
    setError("");
  };

  const statusText = activeFrame
    ? `Checking index ${activeFrame.index} | Current Sum: ${activeFrame.currentSum} | Max Sum: ${activeFrame.maxSum}`
    : "Enter a valid array to begin the animation.";

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 dark:from-[#05070b] dark:via-[#06090f] dark:to-[#02040a] text-slate-900 dark:text-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 rounded-3xl border border-amber-200/60 bg-gradient-to-r from-amber-50 to-orange-50 p-6 shadow-sm dark:border-orange-500/20 dark:from-orange-500/10 dark:to-amber-500/5">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-orange-500/15 p-3 text-orange-600 dark:text-orange-300">
              <BarChart3 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.24em] text-amber-700 dark:text-orange-200">
                Dynamic Programming Visualizer
              </p>
              <h1 className="mt-1 text-3xl font-black tracking-tight sm:text-4xl">
                Kadane&apos;s Algorithm
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-300 sm:text-base">
                Track the rolling subtotal, compare it against the current value, and watch the global maximum update in real time.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-[#10131b]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-600 dark:text-violet-300">
                  Controls Panel
                </p>
                <h2 className="mt-1 text-xl font-bold">Run the simulation</h2>
              </div>
              <div className="rounded-full bg-violet-500/10 px-3 py-1 text-xs font-semibold text-violet-700 dark:text-violet-200">
                O(n)
              </div>
            </div>

            <div className="mt-5 space-y-4">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                Array input
                <textarea
                  value={inputValue}
                  onChange={(event) => {
                    setInputValue(event.target.value);
                    setError("");
                    setIsPlaying(false);
                    setCurrentFrameIndex(0);
                  }}
                  rows="3"
                  className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-3 text-sm text-slate-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
                  placeholder="Enter comma-separated integers"
                />
              </label>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/80">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">Playback speed</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Adjust how quickly each Kadane step advances.</p>
                  </div>
                  <div className="rounded-full bg-slate-900 px-3 py-1 text-xs font-bold text-white dark:bg-slate-100 dark:text-slate-900">
                    {speed.toFixed(1)}x
                  </div>
                </div>

                <input
                  aria-label="Playback speed"
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.5"
                  value={speed}
                  onChange={(event) => setSpeed(Number(event.target.value))}
                  className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-violet-600 dark:bg-slate-700"
                />

                <div className="mt-2 flex justify-between text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                  <span>0.5x</span>
                  <span>1.0x</span>
                  <span>2.0x</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleVisualize}
                  className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-violet-700"
                >
                  <Play className="h-4 w-4" />
                  Visualize Kadane
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset
                </button>
              </div>

              {error ? (
                <div className="rounded-xl border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-200">
                  {error}
                </div>
              ) : null}
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-[#0f172a] p-6 text-slate-100 shadow-sm dark:border-slate-700 dark:bg-[#020617]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-300">Live Code Reference</p>
                <h2 className="mt-1 text-xl font-bold text-white">Kadane Algorithm Implementation</h2>
              </div>
              <div className="rounded-full bg-cyan-500/20 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-200">
                JS
              </div>
            </div>

            <div className="mt-4 overflow-hidden rounded-2xl border border-slate-700 bg-[#020817]">
              <div className="flex items-center gap-2 border-b border-slate-700 px-4 py-3 text-xs text-slate-400">
                <Code2 className="h-4 w-4 text-cyan-300" />
                <span className="font-semibold">editor.js</span>
                <span className="ml-auto rounded-full bg-emerald-500/20 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.22em] text-emerald-200">
                  live
                </span>
              </div>

              <pre className="overflow-x-auto p-4 font-mono text-sm leading-6 text-cyan-100">
                <code>{codeSnippet}</code>
              </pre>
            </div>
          </section>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-[#10131b]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-600 dark:text-amber-200">
                  Visual State
                </p>
                <h2 className="mt-1 text-xl font-bold">Array blocks & active index</h2>
              </div>
              <div className="rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-700 dark:text-amber-200">
                Rolling window
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {parsedArray.length > 0 ? (
                parsedArray.map((value, index) => {
                  const isActive = activeFrame ? index === activeFrame.index : false;
                  const activeBackground = isActive ? "bg-amber-100 border-amber-400 text-amber-900 dark:bg-amber-500/20 dark:border-amber-300 dark:text-amber-50" : "bg-slate-100 border-slate-200 text-slate-800 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100";

                  return (
                    <div
                      key={`${value}-${index}`}
                      className={`rounded-2xl border p-3 text-center shadow-sm transition-all duration-300 ${activeBackground} ${isActive ? "ring-2 ring-amber-300/70" : ""}`}
                    >
                      <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-300">
                        index {index}
                      </div>
                      <div className="mt-2 text-2xl font-black">{value}</div>
                      <div className="mt-2 rounded-full bg-white/70 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-600 dark:bg-slate-900/70 dark:text-slate-300">
                        {isActive ? "active" : "idle"}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-full rounded-2xl border border-dashed border-slate-300 px-4 py-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
                  Enter an array to see the step-by-step Kadane blocks.
                </div>
              )}
            </div>

            <div className="mt-5 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-slate-100 dark:bg-slate-950 dark:text-slate-50">
              <span className="font-bold text-emerald-300">Status Log</span>
              <span className="ml-2">{statusText}</span>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-[#10131b]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-300">
                  Metrics Badges
                </p>
                <h2 className="mt-1 text-xl font-bold">Running totals</h2>
              </div>
              <div className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-200">
                Real-time
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 dark:border-rose-500/20 dark:bg-rose-500/10">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-rose-700 dark:text-rose-200">
                  Current Sum
                </p>
                <p className="mt-3 text-4xl font-black text-rose-700 dark:text-rose-100">
                  {activeFrame ? activeFrame.currentSum : parsedArray[0] || 0}
                </p>
                <p className="mt-2 text-xs text-rose-700/80 dark:text-rose-100/70">
                  The best subtotal ending at the active index.
                </p>
              </div>

              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-500/20 dark:bg-emerald-500/10">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-200">
                  Maximum Sum
                </p>
                <p className="mt-3 text-4xl font-black text-emerald-700 dark:text-emerald-100">
                  {activeFrame ? activeFrame.maxSum : parsedArray[0] || 0}
                </p>
                <p className="mt-2 text-xs text-emerald-700/80 dark:text-emerald-100/70">
                  The best subarray sum seen so far.
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/80">
              <p className="text-sm font-bold text-slate-800 dark:text-slate-100">Why Kadane works</p>
              <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="mt-1 inline-block h-2 w-2 rounded-full bg-violet-500" />
                  Start with the first element as both the current and best sum.
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 inline-block h-2 w-2 rounded-full bg-violet-500" />
                  Decide whether to extend the current subarray or restart at the current value.
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 inline-block h-2 w-2 rounded-full bg-violet-500" />
                  Keep the largest running total seen anywhere in the array.
                </li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
