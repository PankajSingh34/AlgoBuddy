"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Clock, Database, Activity } from "lucide-react";

export default function ComplexityPanel({ complexity, operationsCount = 0 }) {
  const [isOpen, setIsOpen] = useState(true);

  if (!complexity) return null;
  const { time, space, explanation } = complexity;

  return (
    <div className="rounded-2xl border border-surface-200 bg-white shadow-sm dark:border-surface-800 dark:bg-surface-900">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between p-4"
      >
        <span className="flex items-center gap-2 text-sm font-bold text-surface-900 dark:text-white">
          <Activity className="h-4 w-4 text-primary" />
          Time & Space Complexity
        </span>
        {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>

      {isOpen && (
        <div className="space-y-4 border-t border-surface-100 p-4 dark:border-surface-800">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            <div className="rounded-lg bg-surface-50 p-3 text-center dark:bg-surface-950">
              <p className="text-xs text-surface-500">Best</p>
              <p className="font-mono text-sm font-semibold text-surface-900 dark:text-white">{time?.best}</p>
            </div>
            <div className="rounded-lg bg-surface-50 p-3 text-center dark:bg-surface-950">
              <p className="text-xs text-surface-500">Average</p>
              <p className="font-mono text-sm font-semibold text-surface-900 dark:text-white">{time?.average}</p>
            </div>
            <div className="rounded-lg bg-surface-50 p-3 text-center dark:bg-surface-950">
              <p className="text-xs text-surface-500">Worst</p>
              <p className="font-mono text-sm font-semibold text-surface-900 dark:text-white">{time?.worst}</p>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg bg-surface-50 px-3 py-2 dark:bg-surface-950">
            <span className="flex items-center gap-2 text-sm text-surface-600 dark:text-surface-300">
              <Database className="h-4 w-4" /> Space Complexity
            </span>
            <span className="font-mono text-sm font-semibold text-surface-900 dark:text-white">{space}</span>
          </div>

          <div className="flex items-center justify-between rounded-lg bg-surface-50 px-3 py-2 dark:bg-surface-950">
            <span className="flex items-center gap-2 text-sm text-surface-600 dark:text-surface-300">
              <Clock className="h-4 w-4" /> Operations so far
            </span>
            <span className="font-mono text-sm font-semibold text-primary">{operationsCount}</span>
          </div>

          {explanation && (
            <p className="rounded-lg bg-primary/5 p-3 text-xs leading-relaxed text-surface-600 dark:text-surface-300">
              {explanation}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
