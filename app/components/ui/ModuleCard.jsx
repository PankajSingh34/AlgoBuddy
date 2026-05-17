"use client";
import { useState } from "react";
import { toast } from "react-hot-toast";

export default function ModuleCard({ moduleId, description, initialDone }) {
  const storageKey = `module_done_${moduleId}`;
  const [isDone, setIsDone] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(storageKey);
      return saved !== null ? saved === "true" : !!initialDone;
    }
    return !!initialDone;
  });

  function toggleCompletion() {
    const next = !isDone;
    setIsDone(next);
    localStorage.setItem(storageKey, next.toString());
    toast.success(next ? "Module marked as completed!" : "Module marked as incomplete.");
  }

  return (
    <div
      className={`border border-gray-200 dark:border-gray-700 max-w-4xl mx-auto rounded-lg p-4 shadow-lg flex flex-col justify-between ${
        isDone ? "bg-green-50 dark:bg-green-900/30" : "bg-white dark:bg-zinc-950"
      }`}
    >
      <div className="my-4 px-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Done With the Learning
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
        </div>
        <input
          type="checkbox"
          checked={isDone}
          onChange={toggleCompletion}
          className={`w-6 h-6 rounded cursor-pointer transition duration-300 ${
            isDone ? "accent-green-500 ring-2 ring-green-500" : "accent-blue-600"
          }`}
        />
      </div>
    </div>
  );
}
