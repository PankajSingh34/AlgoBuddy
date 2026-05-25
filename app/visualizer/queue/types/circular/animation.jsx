"use client";
import React, { useState } from "react";
import usePlayback from "@/app/hooks/usePlayback";
import LinearMemoryControls from "@/app/components/ui/LinearMemoryControls";
import useVisualizerReset from "@/app/hooks/useVisualizerReset";

const CircularQueueVisualizer = () => {
  const [maxSize, setMaxSize] = useState(5); // capacity
  const [queue, setQueue] = useState(Array(5).fill(null));
  const [front, setFront] = useState(0);
  const [rear, setRear] = useState(-1);
  const [count, setCount] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [operation, setOperation] = useState(null);
  const [message, setMessage] = useState("Circular queue is empty");
  const [isAnimating, setIsAnimating] = useState(false);
  useVisualizerReset(() => {
    setMaxSize(5);
    setQueue(Array(5).fill(null));
    setFront(0);
    setRear(-1);
    setCount(0);
    setInputValue("");
    setOperation(null);
    setMessage("Circular queue is empty");
    setIsAnimating(false);
  });
  const { speed, setSpeed } = usePlayback(1);

  const isEmpty = count === 0;
  const isFull = count === maxSize;

  /* ---------- helpers ---------- */
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const showOp = async (txt, ms = 800) => {
    setOperation(txt);
    await sleep(ms / speed);
    setOperation(null);
  };
  const wrap = (idx) => (idx + maxSize) % maxSize;

  /* ---------- enqueue rear ---------- */
  const enqueue = async () => {
    if (!inputValue.trim()) {
      setMessage("Please enter a value");
      return;
    }
    if (isFull) {
      setMessage("Circular queue is full!");
      return;
    }
    setIsAnimating(true);
    await showOp(`Enqueuing "${inputValue}" at rear …`);
    const newRear = wrap(rear + 1);
    const newQ = [...queue];
    newQ[newRear] = inputValue;
    setQueue(newQ);
    setRear(newRear);
    setCount(count + 1);
    setMessage(`"${inputValue}" added`);
    setInputValue("");
    setIsAnimating(false);
  };

  /* ---------- dequeue front ---------- */
  const dequeue = async () => {
    if (isEmpty) {
      setMessage("Circular queue is empty!");
      return;
    }
    setIsAnimating(true);
    const item = queue[front];
    await showOp(`Dequeuing "${item}" from front …`);
    const newQ = [...queue];
    newQ[front] = null;
    setQueue(newQ);
    setFront(wrap(front + 1));
    setCount(count - 1);
    setMessage(`"${item}" removed`);
    setIsAnimating(false);
  };

  /* ---------- isEmpty ---------- */
  const checkEmpty = async () => {
    setIsAnimating(true);
    await showOp("Checking if empty …");
    setMessage(
      isEmpty ? "Circular queue is EMPTY" : "Circular queue is NOT empty"
    );
    setIsAnimating(false);
  };

  /* ---------- isFull ---------- */
  const checkFull = async () => {
    setIsAnimating(true);
    await showOp("Checking if full …");
    setMessage(
      isFull ? "Circular queue is FULL" : "Circular queue is NOT full"
    );
    setIsAnimating(false);
  };

  /* ---------- reset ---------- */
  const reset = () => {
    setQueue(Array(maxSize).fill(null));
    setFront(0);
    setRear(-1);
    setCount(0);
    setInputValue("");
    setOperation(null);
    setMessage("Circular queue cleared");
  };

  /* ---------- change capacity ---------- */
  const resize = (newCap) => {
    if (newCap < 1) return;
    const newQ = Array(newCap).fill(null);
    let idx = 0;
    for (let i = 0; i < Math.min(count, newCap); i++) {
      newQ[idx++] = queue[wrap(front + i)];
    }
    setQueue(newQ);
    setMaxSize(newCap);
    setFront(0);
    setRear(idx - 1);
    setCount(idx);
    setMessage(`Capacity set to ${newCap}`);
  };

  /* ---------- UI ---------- */
  return (
    <main className="container mx-auto px-6 pt-4 pb-4">
      <p className="text-lg text-center text-gray-600 dark:text-gray-400 mb-8">
        Circular Queue Visualiser (Fixed Capacity)
      </p>

      <div className="max-w-4xl mx-auto">
        {/* ----- Controls card ----- */}
<<<<<<< HEAD
        <div className="bg-white dark:bg-neutral-950 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 mb-8 w-full flex flex-col items-center">
          {/* Capacity Input */}
          <div className="w-full flex justify-center mb-6">
            <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-neutral-900 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700">
              <span className="font-medium">Capacity:</span>
=======
        <div className="bg-white dark:bg-neutral-950 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
          {/* Value input + Enqueue */}
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter value"
              className="flex-1 p-3 border dark:border-gray-700 rounded-lg dark:bg-neutral-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              disabled={isAnimating}
              onKeyDown={(e) => e.key === "Enter" && enqueue()}
            />
            <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
              <label>Capacity:</label>
>>>>>>> c8abb0c (Refactor color scheme from blue to purple across visualizer components for a cohesive design update)
              <input
                type="number"
                min="1"
                max="15"
                value={maxSize}
                onChange={(e) => resize(Number(e.target.value))}
                className="w-16 p-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-blue-500 focus:outline-none text-center"
                disabled={isAnimating}
              />
            </label>
          </div>

<<<<<<< HEAD
          <LinearMemoryControls
            inputValue={inputValue}
            setInputValue={setInputValue}
            isAnimating={isAnimating}
            operation={operation}
            message={message}
            speed={speed}
            onSpeedChange={setSpeed}
            actions={[
              { label: "Enqueue", onClick: enqueue, variant: "primary", needsInput: true, disabled: isFull },
              { label: "Dequeue", onClick: dequeue, disabled: isEmpty, variant: "secondary" },
              { label: "IsEmpty", onClick: checkEmpty, variant: "secondary" },
              { label: "IsFull", onClick: checkFull, variant: "secondary" },
              { label: "Reset", onClick: reset, variant: "outline" }
            ]}
          />
=======
          {/* Action buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            <button
              onClick={enqueue}
              disabled={isAnimating || isFull}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg disabled:opacity-50 transition-all"
            >
              Enqueue Rear
            </button>
            <button
              onClick={dequeue}
              disabled={isAnimating || isEmpty}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg disabled:opacity-50 transition-all"
            >
              Dequeue Front
            </button>
            <button
              onClick={checkEmpty}
              disabled={isAnimating}
              className="bg-green-500 hover:bg-green-600 text-black px-4 py-3 rounded-lg disabled:opacity-50 transition-all"
            >
              IsEmpty
            </button>
            <button
              onClick={checkFull}
              disabled={isAnimating}
              className="bg-green-500 hover:bg-green-600 text-black px-4 py-3 rounded-lg disabled:opacity-50 transition-all"
            >
              IsFull
            </button>
            <button
              onClick={reset}
              disabled={isAnimating}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-lg disabled:opacity-50 transition-all"
            >
              Reset
            </button>
          </div>

          {/* Status banners */}
          <div className="flex flex-col gap-3 mt-4 items-center">
            {operation && (
              <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200 border border-purple-200 dark:border-purple-800 flex items-center gap-2 justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 animate-spin"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{operation}</span>
              </div>
            )}
            {message && (
              <div
                className={`p-3 rounded-lg ${
                  message.includes("added")
                    ? "bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800"
                    : message.includes("removed")
                    ? "bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200 border border-yellow-200 dark:border-yellow-800"
                    : "bg-gray-100 dark:bg-neutral-900 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-600"
                } flex items-center gap-2 justify-center`}
              >
                <span>{message}</span>
              </div>
            )}
          </div>
>>>>>>> c8abb0c (Refactor color scheme from blue to purple across visualizer components for a cohesive design update)
        </div>

        {/* ----- Visualisation card (hidden when empty) ----- */}
        {!isEmpty && (
          <div className="bg-white dark:bg-neutral-950 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 w-full justify-center">
              {/* Front pointer */}
<<<<<<< HEAD
              <div className="text-primary dark:text-[#c27cf7] font-medium flex flex-col items-center">
=======
              <div className="text-purple-600 dark:text-purple-400 font-medium flex flex-col items-center">
>>>>>>> c8abb0c (Refactor color scheme from blue to purple across visualizer components for a cohesive design update)
                <span>Front</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>

              {/* Elements (circular order) */}
              <div className="flex items-center gap-4">
                {Array.from({ length: maxSize }).map((_, idx) => {
                  const itemIdx = wrap(front + idx);
                  const item = queue[itemIdx];
                  const isFront = itemIdx === front;
                  const isRear = itemIdx === rear;
                  return (
                    <div key={itemIdx} className="flex flex-col items-center">
                      <div
                        className={`w-20 h-20 rounded-lg shadow-md flex items-center justify-center text-lg font-medium border-2 ${
                          item === null
                            ? "border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900/30 text-gray-400"
                            : isFront
<<<<<<< HEAD
                            ? "border-[#c27cf7] dark:border-primary-dark bg-blue-50 dark:bg-blue-900/30 text-primary-dark dark:text-blue-200"
=======
                            ? "border-purple-300 dark:border-purple-700 bg-purple-50 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200"
>>>>>>> c8abb0c (Refactor color scheme from blue to purple across visualizer components for a cohesive design update)
                            : isRear
                            ? "border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-200"
                            : "border-gray-200 dark:border-gray-600 bg-white dark:bg-neutral-900"
                        } transition-all`}
                      >
                        {item ?? "·"}
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        #{itemIdx}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Rear pointer */}
              <div className="text-green-600 dark:text-green-400 font-medium flex flex-col items-center">
                <span>Rear</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default CircularQueueVisualizer;
