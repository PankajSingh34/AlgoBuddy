"use client";

import { useEffect, useMemo, useState } from "react";

export default function Animation() {
  const [input, setInput] = useState("abcabcbb");

  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);

  const generatedSteps = useMemo(() => {
    const arr = input.split("");

    const map = new Map();

    let left = 0;
    let maxLength = 0;
    let bestStart = 0;

    const history = [];

    for (let right = 0; right < arr.length; right++) {
      const ch = arr[right];

      if (map.has(ch) && map.get(ch) >= left) {
        left = map.get(ch) + 1;
      }

      map.set(ch, right);

      const length = right - left + 1;

      if (length > maxLength) {
        maxLength = length;
        bestStart = left;
      }

      history.push({
        left,
        right,
        currentChar: ch,
        currentLength: length,
        maxLength,
        bestStart,
        map: new Map(map),
      });
    }

    return history;
  }, [input]);

  useEffect(() => {
    setSteps(generatedSteps);
    setCurrentStep(0);
    setPlaying(false);
  }, [generatedSteps]);

  useEffect(() => {
    if (!playing) return;

    if (currentStep >= steps.length - 1) {
      setPlaying(false);
      return;
    }

    const timer = setTimeout(() => {
      setCurrentStep((prev) => prev + 1);
    }, speed);

    return () => clearTimeout(timer);
  }, [playing, currentStep, speed, steps]);

  if (steps.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-8">
        Enter a string to visualize.
      </div>
    );
  }

  const step = steps[currentStep];

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">
        Sliding Window Visualization
      </h2>

      <div className="mb-6">
        <label className="font-semibold block mb-2">
          Enter String
        </label>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full border rounded-lg p-3"
          placeholder="abcabcbb"
        />
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={() => setPlaying(!playing)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
        >
          {playing ? "Pause" : "Play"}
        </button>

        <button
          onClick={() =>
            setCurrentStep((prev) => Math.max(prev - 1, 0))
          }
          className="bg-gray-200 px-4 py-2 rounded-lg"
        >
          Previous
        </button>

        <button
          onClick={() =>
            setCurrentStep((prev) =>
              Math.min(prev + 1, steps.length - 1)
            )
          }
          className="bg-gray-200 px-4 py-2 rounded-lg"
        >
          Next
        </button>

        <button
          onClick={() => {
            setCurrentStep(0);
            setPlaying(false);
          }}
          className="bg-red-500 text-white px-4 py-2 rounded-lg"
        >
          Reset
        </button>
      </div>

      <div className="mb-8">
        <label className="font-semibold">
          Animation Speed
        </label>

        <input
          type="range"
          min="300"
          max="2000"
          step="100"
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
          className="w-full mt-2"
        />

        <p>{speed} ms</p>
      </div>

      <div className="flex flex-wrap gap-3 justify-center">
        {input.split("").map((char, index) => {
          let bg = "bg-gray-200";

          if (index >= step.left && index <= step.right)
            bg = "bg-green-500 text-white";

          if (
            index >= step.bestStart &&
            index < step.bestStart + step.maxLength
          )
            bg = "bg-blue-600 text-white";

          return (
            <div
              key={index}
              className={`${bg} w-14 h-14 rounded-xl flex flex-col justify-center items-center font-bold text-lg`}
            >
              {char}
              <span className="text-xs">{index}</span>
            </div>
          );
        })}
      </div>

      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-indigo-100 p-4 rounded-lg">
          <p className="font-semibold">Left</p>
          <p className="text-2xl">{step.left}</p>
        </div>

        <div className="bg-purple-100 p-4 rounded-lg">
          <p className="font-semibold">Right</p>
          <p className="text-2xl">{step.right}</p>
        </div>

        <div className="bg-green-100 p-4 rounded-lg">
          <p className="font-semibold">Current Length</p>
          <p className="text-2xl">{step.currentLength}</p>
        </div>

        <div className="bg-orange-100 p-4 rounded-lg">
          <p className="font-semibold">Maximum Length</p>
          <p className="text-2xl">{step.maxLength}</p>
        </div>
      </div>

      <div className="mt-8 bg-gray-100 rounded-lg p-5">
        <h3 className="font-bold text-lg">
          Current Character
        </h3>

        <p className="mt-2 text-xl">
          {step.currentChar}
        </p>
      </div>

      <div className="mt-8">
        <h3 className="font-bold text-xl mb-3">
          HashMap Contents
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[...step.map.entries()].map(([key, value]) => (
            <div
              key={key}
              className="border rounded-lg p-3 text-center"
            >
              <p className="font-bold">{key}</p>
              <p>Index: {value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <p className="font-semibold">
          Step {currentStep + 1} / {steps.length}
        </p>

        <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
          <div
            className="bg-indigo-600 h-3 rounded-full"
            style={{
              width: `${((currentStep + 1) / steps.length) * 100}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}