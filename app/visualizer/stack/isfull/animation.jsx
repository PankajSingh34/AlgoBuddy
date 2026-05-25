"use client";
import React, { useState, useEffect } from "react";
import PushPop from "@/app/components/ui/PushPop";
import usePlayback from "@/app/hooks/usePlayback";
import useVisualizerReset from "@/app/hooks/useVisualizerReset";

const StackVisualizer = () => {
  const [stack, setStack] = useState([]);
  const [capacity, setCapacity] = useState(null);
  const [operation, setOperation] = useState(null);
  const [message, setMessage] = useState("Please set a valid stack capacity first.");
  const [isAnimating, setIsAnimating] = useState(false);
  const [isFull, setIsFull] = useState(false);
  useVisualizerReset(() => {
    setStack([]);
    setCapacity(null);
    setOperation(null);
    setMessage("Please set a valid stack capacity first.");
    setIsAnimating(false);
    setIsFull(false);
  });
  const { speed, setSpeed } = usePlayback(1); // Read speed from hook (controlled inside PushPop)

  // Check if stack is full
  const checkIfFull = () => {
    if (capacity === null) return;
    setIsAnimating(true);
    setOperation("Checking if stack is full...");

    setTimeout(() => {
      const fullStatus = stack.length >= capacity;
      setIsFull(fullStatus);
      setOperation(null);
      setMessage(fullStatus ? `Stack is FULL! top (${stack.length - 1}) >= size - 1 (${capacity - 1})` : "Stack is NOT full");
      setIsAnimating(false);
    }, 1000 / speed);
  };

  // Effect to update isFull status when stack changes
  useEffect(() => {
    if (capacity !== null) {
      setIsFull(stack.length >= capacity);
    }
  }, [stack, capacity]);

  // Construct physical slots from index capacity - 1 down to 0
  const slots = [];
  if (capacity !== null) {
    for (let i = capacity - 1; i >= 0; i--) {
      const isFilled = i < stack.length;
      const itemValue = isFilled ? stack[stack.length - 1 - i] : null;
      slots.push({
        index: i,
        isFilled,
        value: itemValue,
      });
    }
  }

  return (
    <main className="container mx-auto">
      <p className="text-lg text-center text-gray-600 dark:text-gray-400 mb-8">
        Visualize the LIFO (Last In, First Out) principle
      </p>

      <div className="max-w-4xl mx-auto">
        {/* Use the PushPop component */}
        <PushPop
          stack={stack}
          setStack={setStack}
          isAnimating={isAnimating}
          setIsAnimating={setIsAnimating}
          operation={operation}
          setOperation={setOperation}
          message={message}
          setMessage={setMessage}
          speed={speed}
          setSpeed={setSpeed}
          capacity={capacity}
          setCapacity={setCapacity}
          extraActions={[
            { label: "Check If Full", onClick: checkIfFull, variant: "secondary", disabled: capacity === null }
          ]}
        />

<<<<<<< HEAD
=======
        {/* Is Full Check Button */}
        <button
          onClick={checkIfFull}
          disabled={isAnimating}
          className="w-full mb-4 duration-300 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Check If Full
        </button>

>>>>>>> c8abb0c (Refactor color scheme from blue to purple across visualizer components for a cohesive design update)
        {/* Stack Visualization */}
        <div className="bg-white dark:bg-neutral-950 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-center">Stack Visualization</h2>

<<<<<<< HEAD
          {capacity === null ? (
            <div className="flex flex-col items-center justify-center min-h-[300px] border border-dashed border-slate-700/50 rounded-2xl p-8 bg-slate-900/5">
              <span className="text-sm font-semibold text-slate-500 text-center">
                Define stack capacity above to initialize the stack structure
              </span>
=======
          {/* Operation Status */}
          {operation && (
            <div className="mb-4 p-3 rounded-lg bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200">
              {operation}
>>>>>>> c8abb0c (Refactor color scheme from blue to purple across visualizer components for a cohesive design update)
            </div>
          ) : (
            <div className="flex flex-col items-center min-h-[300px]">
              {/* Stack status and pointers details */}
              <div className="mb-6 text-center text-sm font-semibold text-slate-500">
                Stack Status:{" "}
                <span className={stack.length >= capacity ? "text-rose-500 font-bold" : "text-[#a435f0] font-bold"}>
                  {stack.length === 0 ? "Empty" : stack.length >= capacity ? "Full" : "Active"}
                </span>
                {" | "}Capacity: <span className="text-slate-300 font-bold">{stack.length}</span>/<span className="text-slate-400 font-bold">{capacity}</span>
              </div>

              {/* Stack physical slots visualizer */}
              <div className="w-full max-w-md space-y-1.5">
                {slots.map((slot) => {
                  const isTop = slot.index === stack.length - 1;
                  return (
                    <div key={slot.index} className="flex items-center gap-4 justify-center">
                      {/* Index display */}
                      <div className="w-16 text-right text-xs font-bold text-slate-400 dark:text-slate-500">
                        Index [{slot.index}]
                      </div>

                      {/* Slot element box */}
                      <div className="w-48 relative">
                        {slot.isFilled ? (
                          <div
                            className={`p-3 border-2 rounded-xl text-center font-medium transition-all duration-300 shadow-md ${
                              isTop
                                ? "bg-[#a435f0]/10 border-[#a435f0] text-slate-100 shadow-[#a435f0]/10"
                                : "bg-slate-800/40 border-slate-700 text-slate-300"
                            } ${
                              isAnimating &&
                              isTop &&
                              operation?.includes("Peek")
                                ? "animate-pulse"
                                : isAnimating && isTop
                                ? "animate-bounce"
                                : ""
                            } ${
                              isFull && isAnimating && operation?.includes("full")
                                ? "border-red-500 dark:border-red-500 animate-pulse shadow-rose-500/10 shadow-lg"
                                : ""
                            }`}
                          >
                            <div>{slot.value}</div>
                          </div>
                        ) : (
                          <div className="p-3 border border-dashed border-slate-700/50 rounded-xl text-center text-slate-600 font-medium bg-slate-900/10 dark:bg-slate-950/20">
                            <div className="text-xs uppercase tracking-wider text-slate-600/80">Empty</div>
                          </div>
                        )}
                      </div>

<<<<<<< HEAD
                      {/* Top indicator arrow */}
                      <div className="w-20 text-left">
                        {isTop ? (
                          <span className="text-xs font-extrabold text-[#a435f0] flex items-center gap-1 animate-pulse">
                            ← top
                          </span>
                        ) : (
                          <span className="text-xs text-transparent">top</span>
                        )}
                      </div>
=======
          {/* Vertical Stack */}
          <div className="flex flex-col items-center min-h-[300px]">
            {/* Top indicator */}
            <div className="mb-2 text-sm text-gray-600 dark:text-gray-400">
              {stack.length > 0 ? "↑ Top" : ""}
            </div>

            {/* Stack elements with full state animation */}
            <div className="w-32 relative">
              {stack.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Stack is empty
                </div>
              ) : (
                <div className="space-y-1">
                  {stack.map((item, index) => (
                    <div
                      key={index}
                      className={`p-3 border-2 rounded text-center font-medium transition-all duration-300 ${
                        index === 0
                          ? "bg-purple-100 dark:bg-purple-900 border-purple-300 dark:border-purple-700"
                          : "bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                      } ${
                        isAnimating &&
                        index === 0 &&
                        operation?.includes("Peek")
                          ? "animate-pulse"
                          : isAnimating && index === 0
                          ? "animate-bounce"
                          : ""
                      } ${
                        isFull && isAnimating && operation?.includes("full")
                          ? "border-red-500 dark:border-red-500 animate-pulse"
                          : ""
                      }`}
                    >
                      {item}
                      {index === 0 && (
                        <div className="text-xs mt-1 text-gray-500 dark:text-gray-400">
                          (Top)
                        </div>
                      )}
>>>>>>> c8abb0c (Refactor color scheme from blue to purple across visualizer components for a cohesive design update)
                    </div>
                  );
                })}

                {/* Empty pointer display */}
                {stack.length === 0 && (
                  <div className="flex items-center gap-4 justify-center pt-2">
                    <div className="w-16"></div>
                    <div className="w-48 text-center text-xs font-bold text-[#a435f0]/80">
                      top = -1 (Empty)
                    </div>
                    <div className="w-20"></div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default StackVisualizer;
