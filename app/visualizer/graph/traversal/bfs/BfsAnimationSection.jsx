"use client";

import { useState } from "react";
import Animation from "./animation";
import { graphNodeIds } from "@/app/visualizer/graph/components/graphData";

export default function BfsAnimationSection() {
  const [startNode, setStartNode] = useState("A");

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-surface-200 bg-surface-50 p-5 shadow-card dark:border-surface-800 dark:bg-surface-900">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">
              Dynamic start node
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-surface-900 dark:text-white">
              Choose the BFS source vertex
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-surface-600 dark:text-surface-400">
              Pick a starting node to rerun the BFS animation. The traversal order updates
              immediately, while the rest of the visualizer stays unchanged.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <label className="flex flex-col gap-1 text-sm font-medium text-surface-700 dark:text-surface-300">
              <span>Start node</span>
              <select
                value={startNode}
                onChange={(event) => setStartNode(event.target.value)}
                className="rounded-xl border border-surface-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-primary dark:border-surface-700 dark:bg-surface-950"
              >
                {graphNodeIds.map((node) => (
                  <option key={node} value={node}>
                    {node}
                  </option>
                ))}
              </select>
            </label>

            <button
              type="button"
              onClick={() => setStartNode("A")}
              className="h-11 rounded-xl border border-surface-200 px-4 text-sm font-semibold text-surface-700 transition hover:border-primary hover:text-primary dark:border-surface-700 dark:text-surface-300"
            >
              Reset source
            </button>
          </div>
        </div>
      </div>

      <Animation startNode={startNode} />
    </div>
  );
}