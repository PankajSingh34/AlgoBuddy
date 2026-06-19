"use client";

import { useEffect, useState } from "react";

export default function KeyboardShortcuts() {
  const [focusMode, setFocusMode] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event) => {
      // Play / Pause
      if (event.code === "Space") {
        event.preventDefault();
        console.log("Play/Pause shortcut triggered");
      }

      // Reset visualization
      if (event.key.toLowerCase() === "r") {
        console.log("Reset shortcut triggered");
      }

      // Next step
      if (event.key === "ArrowRight") {
        console.log("Next step shortcut triggered");
      }

      // Previous step
      if (event.key === "ArrowLeft") {
        console.log("Previous step shortcut triggered");
      }

      // Open search
      if (event.ctrlKey && event.key.toLowerCase() === "k") {
        event.preventDefault();
        console.log("Search shortcut triggered");
      }

      // Toggle focus mode
      if (event.key.toLowerCase() === "f") {
        setFocusMode((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-[#1a1a1a] text-gray-800 dark:text-gray-200 p-4 rounded-2xl border border-[#e5e7eb] dark:border-[#333] shadow-lg hover:shadow-xl transition-all duration-300 text-sm z-50 w-64">
      <h3 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
        <span>⌨</span> Keyboard Shortcuts
      </h3>

      <ul className="space-y-2">
        <li className="flex items-center justify-between text-xs font-medium">
          <span className="text-gray-600 dark:text-gray-400">Play / Pause</span>
          <kbd className="inline-flex items-center justify-center min-w-[1.5rem] px-1.5 py-0.5 font-mono text-[10px] font-bold rounded border bg-gray-50 dark:bg-neutral-800 border-gray-200 dark:border-neutral-700 text-gray-800 dark:text-neutral-200 shadow-sm">Space</kbd>
        </li>
        <li className="flex items-center justify-between text-xs font-medium">
          <span className="text-gray-600 dark:text-gray-400">Reset Visualization</span>
          <kbd className="inline-flex items-center justify-center min-w-[1.5rem] px-1.5 py-0.5 font-mono text-[10px] font-bold rounded border bg-gray-50 dark:bg-neutral-800 border-gray-200 dark:border-neutral-700 text-gray-800 dark:text-neutral-200 shadow-sm">R</kbd>
        </li>
        <li className="flex items-center justify-between text-xs font-medium">
          <span className="text-gray-600 dark:text-gray-400">Next Step</span>
          <kbd className="inline-flex items-center justify-center min-w-[1.5rem] px-1.5 py-0.5 font-mono text-[10px] font-bold rounded border bg-gray-50 dark:bg-neutral-800 border-gray-200 dark:border-neutral-700 text-gray-800 dark:text-neutral-200 shadow-sm">→</kbd>
        </li>
        <li className="flex items-center justify-between text-xs font-medium">
          <span className="text-gray-600 dark:text-gray-400">Previous Step</span>
          <kbd className="inline-flex items-center justify-center min-w-[1.5rem] px-1.5 py-0.5 font-mono text-[10px] font-bold rounded border bg-gray-50 dark:bg-neutral-800 border-gray-200 dark:border-neutral-700 text-gray-800 dark:text-neutral-200 shadow-sm">←</kbd>
        </li>
        <li className="flex items-center justify-between text-xs font-medium">
          <span className="text-gray-600 dark:text-gray-400">Open Search</span>
          <span className="flex items-center gap-0.5">
            <kbd className="inline-flex items-center justify-center min-w-[1.5rem] px-1.5 py-0.5 font-mono text-[10px] font-bold rounded border bg-gray-50 dark:bg-neutral-800 border-gray-200 dark:border-neutral-700 text-gray-800 dark:text-neutral-200 shadow-sm">Ctrl</kbd>
            <span className="text-gray-400 dark:text-gray-600 font-mono text-[10px]">+</span>
            <kbd className="inline-flex items-center justify-center min-w-[1.5rem] px-1.5 py-0.5 font-mono text-[10px] font-bold rounded border bg-gray-50 dark:bg-neutral-800 border-gray-200 dark:border-neutral-700 text-gray-800 dark:text-neutral-200 shadow-sm">K</kbd>
          </span>
        </li>
        <li className="flex items-center justify-between text-xs font-medium">
          <span className="text-gray-600 dark:text-gray-400">Focus Mode</span>
          <kbd className="inline-flex items-center justify-center min-w-[1.5rem] px-1.5 py-0.5 font-mono text-[10px] font-bold rounded border bg-gray-50 dark:bg-neutral-800 border-gray-200 dark:border-neutral-700 text-gray-800 dark:text-neutral-200 shadow-sm">F</kbd>
        </li>
      </ul>

      <div className="mt-4 pt-3 border-t border-gray-100 dark:border-neutral-800 flex items-center justify-between text-xs font-semibold">
        <span className="text-gray-500 dark:text-gray-400">Focus Mode</span>
        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold transition-colors duration-200 ${
          focusMode
            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
            : "bg-gray-100 text-gray-800 dark:bg-neutral-800 dark:text-neutral-400"
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${focusMode ? "bg-green-500 animate-pulse" : "bg-gray-400"}`} />
          {focusMode ? "Enabled" : "Disabled"}
        </span>
      </div>
    </div>
  );
}