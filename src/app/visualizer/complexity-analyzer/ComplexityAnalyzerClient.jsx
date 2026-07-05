"use client";

import { useState } from "react";

/**
 * Reusable Time & Space Complexity Panel
 * Props:
 * - complexity: { time: { best, average, worst }, space, explanation }
 * - operationsCount: number (live count of operations so far)
 */
export default function ComplexityPanel({ complexity, operationsCount = 0 }) {
  const [collapsed, setCollapsed] = useState(false);

  if (!complexity) return null;

  return (
    <div className="rounded-2xl border border-surface-200 bg-white shadow-sm dark:border-surface-800 dark:bg-surface-900 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-surface-100 dark:border-surface-800">
        <h2 className="font-bold text-sm">Complexity Panel</h2>
        <button
          onClick={() => setCollapsed((prev) => !prev)}
          className="text-xs px-2 py-1 rounded bg-surface-100 hover:bg-surface-200 dark:bg-surface-800 dark:hover:bg-surface-700 transition"
        >
          {collapsed ? "Expand" : "Collapse"}
        </button>
      </div>

      {!collapsed && (
        <div className="p-4 space-y-4 text-sm">
          <div>
            <h3 className="font-semibold mb-2 text-surface-600 dark:text-surface-300">
              Time Complexity
            </h3>
            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-lg bg-surface-50 dark:bg-surface-950 p-2 text-center">
                <p className="text-xs text-surface-500">Best</p>
                <p className="font-mono font-semibold">{complexity.time.best}</p>
              </div>
              <div className="rounded-lg bg-surface-50 dark:bg-surface-950 p-2 text-center">
                <p className="text-xs text-surface-500">Average</p>
                <p className="font-mono font-semibold">{complexity.time.average}</p>
              </div>
              <div className="rounded-lg bg-surface-50 dark:bg-surface-950 p-2 text-center">
                <p className="text-xs text-surface-500">Worst</p>
                <p className="font-mono font-semibold">{complexity.time.worst}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2 text-surface-600 dark:text-surface-300">
              Space Complexity
            </h3>
            <div className="rounded-lg bg-surface-50 dark:bg-surface-950 p-2 text-center">
              <p className="font-mono font-semibold">{complexity.space}</p>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg bg-primary/10 px-3 py-2">
            <span className="text-surface-600 dark:text-surface-300">
              Operations so far
            </span>
            <span className="font-mono font-bold text-primary">
              {operationsCount}
            </span>
          </div>

          <p className="text-xs text-surface-500 dark:text-surface-400 leading-relaxed">
            {complexity.explanation}
          </p>
        </div>
      )}
    </div>
  );
}