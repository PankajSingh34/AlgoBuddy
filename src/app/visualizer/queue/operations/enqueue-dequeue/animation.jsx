"use client";
import React, { useState } from "react";
import LinearMemoryControls from "@/app/components/ui/LinearMemoryControls";
import { enqueueGenerator, dequeueGenerator } from "@/features/algorithms/queue/enqueueDequeueLogic";

const QueueVisualizer = () => {
  const [queue, setQueue] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [operation, setOperation] = useState(null);
  const [message, setMessage] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);
  const [speed, setSpeed] = useState(1);

  const enqueue = () => {
    const generator = enqueueGenerator(queue, inputValue);
    let step = generator.next();

    if (step.value?.type === 'error') {
      setMessage(step.value.message);
      return;
    }

    if (step.value?.type === 'start') {
      setIsAnimating(true);
      setOperation(step.value.operation);

      setTimeout(() => {
        step = generator.next();
        if (step.value?.type === 'complete') {
          setQueue(step.value.queue);
          setOperation(null);
          setMessage(step.value.message);
          setInputValue("");
          setIsAnimating(false);
        }
      }, 1000 / speed);
    }
  };

  const dequeue = () => {
    const generator = dequeueGenerator(queue);
    let step = generator.next();

    if (step.value?.type === 'error') {
      setMessage(step.value.message);
      return;
    }

    if (step.value?.type === 'start') {
      setIsAnimating(true);
      setOperation(step.value.operation);

      setTimeout(() => {
        step = generator.next();
        if (step.value?.type === 'complete') {
          setQueue(step.value.queue);
          setOperation(null);
          setMessage(step.value.message);
          setIsAnimating(false);
        }
      }, 1000 / speed);
    }
  };

  const reset = () => {
    setQueue([]);
    setInputValue("");
    setOperation(null);
    setMessage("");
    setIsAnimating(false);
  };

  return (
    <main className="container mx-auto">
      <p className="text-lg text-center text-gray-600 dark:text-gray-400 mb-8">
        Visualize First-In-First-Out (FIFO) operations in real-time
      </p>

        <LinearMemoryControls
          inputValue={inputValue}
          setInputValue={setInputValue}
          isAnimating={isAnimating}
          operation={operation}
          message={message}
          speed={speed}
          onSpeedChange={setSpeed}
          actions={[
            { label: "Enqueue", onClick: enqueue, variant: "primary", needsInput: true },
            { label: "Dequeue", onClick: dequeue, disabled: queue.length === 0, variant: "secondary" },
            { label: "Reset", onClick: reset, variant: "outline" }
          ]}
        />

        {queue.length > 0 && (
          <div className="bg-white dark:bg-neutral-950 p-6 max-w-4xl rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 w-full flex flex-col items-center">
            <h2 className="text-2xl font-semibold mb-6 text-center">Queue Visualization</h2>

            <div className="flex items-center gap-3 w-full justify-center">
              <div className="text-primary dark:text-[#c27cf7] font-medium flex flex-col items-center">
                <span>Front</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>

              <div className="flex items-center gap-4">
                {queue.map((item, index) => (
                  <div
                    key={index}
                    className={`relative flex flex-col items-center transition-all duration-300 ${
                      index === 0 && operation?.includes("Dequeuing")
                        ? "animate-pulse scale-110"
                        : index === queue.length - 1 && operation?.includes("Enqueuing")
                        ? "animate-bounce"
                        : ""
                    }`}
                  >
                    <div className={`w-24 h-24 rounded-lg shadow-md flex items-center justify-center text-lg font-medium border-2 ${
                      index === 0
                        ? "border-[#c27cf7] dark:border-primary-dark"
                        : index === queue.length - 1
                        ? "border-green-300 dark:border-green-700"
                        : "border-gray-200 dark:border-gray-600"
                    } bg-white dark:bg-neutral-900`}>
                      {item}
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-green-600 dark:text-green-400 font-medium flex flex-col items-center">
                <span>Rear</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        )}
    </main>
  );
};

export default QueueVisualizer;
