"use client";

import { useEffect, useMemo, useState } from "react";
import { Play, RotateCcw } from "lucide-react";
import {
  buildUndirectedAdjacency,
  edgeId,
  getNodeById,
  graphEdges,
  graphNodes,
} from "./graphData";

const sequences = {
  matrix: ["A", "B", "D", "E"],
  list: ["A", "B", "C", "E"],
  bfs: ["A", "B", "D", "C", "E"],
  dfs: ["A", "B", "C", "E", "D"],
  dijkstra: ["A", "B", "C", "E", "D"],
  prim: ["A", "B", "C", "E", "D"],
  kruskal: ["A-B", "B-C", "D-E", "B-E"],
  topological: ["A", "B", "D", "C", "E"],
};

function normalizeNode(value) {
  return value.trim().toUpperCase();
}

function isValidNode(value) {
  return graphNodes.some((node) => node.id === value);
}

function buildSelectedEdges(parentMap) {
  const selected = new Set();

  for (const [child, parentNode] of parentMap.entries()) {
    if (!parentNode) {
      continue;
    }

    const direct = `${parentNode}-${child}`;
    const reverse = `${child}-${parentNode}`;
    const found = graphEdges.find((edge) => edgeId(edge) === direct || edgeId(edge) === reverse);

    if (found) {
      selected.add(edgeId(found));
    }
  }

  return selected;
}

function buildBfsSteps(startNode) {
  const records = [];
  const visited = [];
  const visitedSet = new Set();
  const queuedSet = new Set([startNode]);
  const queue = [startNode];
  const parentMap = new Map([[startNode, null]]);
  const adjacency = buildUndirectedAdjacency(graphEdges);

  records.push({
    currentNode: startNode,
    queue: [startNode],
    visited: [],
    selectedEdges: new Set(),
    explanation: `Enqueue start vertex ${startNode}. BFS always begins with a FIFO queue.`,
  });

  while (queue.length > 0) {
    const currentNode = queue.shift();
    queuedSet.delete(currentNode);

    if (!visitedSet.has(currentNode)) {
      visitedSet.add(currentNode);
      visited.push(currentNode);
    }

    records.push({
      currentNode,
      queue: [...queue],
      visited: [...visited],
      selectedEdges: buildSelectedEdges(parentMap),
      explanation: `Dequeue ${currentNode} and visit it.`,
    });

    for (const neighbor of adjacency.get(currentNode) || []) {
      if (visitedSet.has(neighbor) || queuedSet.has(neighbor)) {
        continue;
      }

      parentMap.set(neighbor, currentNode);
      queue.push(neighbor);
      queuedSet.add(neighbor);

      records.push({
        currentNode,
        queue: [...queue],
        visited: [...visited],
        selectedEdges: buildSelectedEdges(parentMap),
        explanation: `Discover ${neighbor} from ${currentNode} and enqueue it.`,
      });
    }
  }

  return records;
}

export default function GraphAnimation({ type = "bfs", title = "Graph", startNode }) {
  const [step, setStep] = useState(0);
  const isBfs = type === "bfs";

  const bfsStartNode = useMemo(() => {
    const candidate = typeof startNode === "string" ? normalizeNode(startNode) : "A";
    return isValidNode(candidate) ? candidate : "A";
  }, [startNode]);

  const bfsSteps = useMemo(() => {
    if (!isBfs) {
      return [];
    }

    return buildBfsSteps(bfsStartNode);
  }, [bfsStartNode, isBfs]);

  const sequence = useMemo(() => {
    if (isBfs) {
      return bfsSteps;
    }

    return sequences[type] || sequences.bfs;
  }, [bfsSteps, isBfs, type]);

  useEffect(() => {
    setStep(0);
  }, [sequence]);

  const current = sequence[step];
  const bfsState = isBfs ? current : null;

  const activeNodes = useMemo(() => {
    if (isBfs) {
      return new Set(bfsState?.visited || []);
    }

    if (type === "kruskal") {
      return new Set(sequence.slice(0, step + 1).flatMap((item) => item.split("-")));
    }

    return new Set(sequence.slice(0, step + 1));
  }, [bfsState, isBfs, sequence, step, type]);

  const activeEdges = useMemo(() => {
    if (isBfs) {
      return new Set(bfsState?.selectedEdges || []);
    }

    if (type === "kruskal") {
      return new Set(sequence.slice(0, step + 1));
    }

    const selected = new Set();
    const active = sequence.slice(0, step + 1);

    for (let index = 1; index < active.length; index += 1) {
      const previous = active[index - 1];
      const next = active[index];
      const direct = `${previous}-${next}`;
      const reverse = `${next}-${previous}`;
      const found = graphEdges.find((edge) => edgeId(edge) === direct || edgeId(edge) === reverse);

      if (found) {
        selected.add(edgeId(found));
      }
    }

    return selected;
  }, [bfsState, isBfs, sequence, step, type]);

  const advance = () => setStep((value) => (value + 1) % sequence.length);
  const reset = () => setStep(0);

  return (
    <div className="mx-auto my-10 max-w-4xl rounded-2xl border border-surface-200 bg-white p-5 shadow-card dark:border-surface-800 dark:bg-surface-900">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            Interactive graph view
          </p>
          <h2 className="text-2xl font-bold tracking-tight text-surface-900 dark:text-white">
            {title}
          </h2>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={advance}
            className="btn-base bg-primary text-white hover:bg-primary-dark"
          >
            <Play className="h-4 w-4" />
            Next step
          </button>
          <button
            type="button"
            onClick={reset}
            className="btn-base border border-surface-300 text-surface-800 hover:border-primary hover:text-primary dark:border-surface-700 dark:text-surface-200"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <svg
          viewBox="0 0 100 90"
          role="img"
          aria-label={`${title} graph animation`}
          className="min-h-[280px] w-full rounded-xl bg-surface-50 dark:bg-surface-950"
        >
          {graphEdges.map((edge) => {
            const start = getNodeById(edge.from);
            const end = getNodeById(edge.to);
            const active = activeEdges.has(edgeId(edge));

            return (
              <g key={edgeId(edge)}>
                <line
                  x1={start.x}
                  y1={start.y}
                  x2={end.x}
                  y2={end.y}
                  stroke={active ? "var(--color-primary)" : "var(--color-neutral-300)"}
                  strokeWidth={active ? "1.8" : "1"}
                />
                <text
                  x={(start.x + end.x) / 2}
                  y={(start.y + end.y) / 2 - 1}
                  textAnchor="middle"
                  className="fill-surface-500 text-[4px] font-semibold"
                >
                  {edge.weight}
                </text>
              </g>
            );
          })}
          {graphNodes.map((node) => {
            const active = activeNodes.has(node.id);

            return (
              <g key={node.id}>
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="6"
                  fill={active ? "var(--color-primary)" : "white"}
                  stroke={active ? "var(--color-primary)" : "var(--color-neutral-300)"}
                  strokeWidth="1.5"
                />
                <text
                  x={node.x}
                  y={node.y + 1.5}
                  textAnchor="middle"
                  className={active ? "fill-white text-[5px] font-bold" : "fill-surface-800 text-[5px] font-bold"}
                >
                  {node.id}
                </text>
              </g>
            );
          })}
        </svg>

        <div className="rounded-xl border border-surface-200 bg-surface-50 p-4 dark:border-surface-800 dark:bg-surface-950">
          {isBfs ? (
            <>
              <p className="mb-3 text-sm font-semibold text-surface-700 dark:text-surface-300">
                Step {step + 1} of {sequence.length}
              </p>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="mb-2 font-semibold text-surface-700 dark:text-surface-300">Queue</p>
                  <div className="flex flex-wrap gap-2">
                    {bfsState?.queue.length ? (
                      bfsState.queue.map((item) => (
                        <span
                          key={item}
                          className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-primary"
                        >
                          {item}
                        </span>
                      ))
                    ) : (
                      <span className="text-surface-500 dark:text-surface-400">Queue is empty.</span>
                    )}
                  </div>
                </div>

                <div>
                  <p className="mb-2 font-semibold text-surface-700 dark:text-surface-300">Visited order</p>
                  <div className="flex flex-wrap gap-2">
                    {bfsState?.visited.length ? (
                      bfsState.visited.map((item) => (
                        <span
                          key={item}
                          className="rounded-full border border-success/30 bg-success/10 px-3 py-1 text-success"
                        >
                          {item}
                        </span>
                      ))
                    ) : (
                      <span className="text-surface-500 dark:text-surface-400">Nothing visited yet.</span>
                    )}
                  </div>
                </div>

                <p className="rounded-lg border border-surface-200 bg-white px-3 py-2 text-surface-600 dark:border-surface-800 dark:bg-surface-900 dark:text-surface-300">
                  {bfsState?.explanation}
                </p>

                <p className="text-sm text-surface-500 dark:text-surface-400">
                  Current node: <span className="font-semibold text-surface-800 dark:text-white">{bfsState?.currentNode}</span>
                </p>
              </div>
            </>
          ) : (
            <>
              <p className="mb-3 text-sm font-semibold text-surface-700 dark:text-surface-300">
                Step {step + 1} of {sequence.length}
              </p>
              <div className="space-y-2">
                {sequence.map((item, index) => (
                  <div
                    key={item}
                    className={`rounded-lg border px-3 py-2 text-sm transition-colors ${
                      index === step
                        ? "border-primary bg-primary/10 text-primary"
                        : index < step
                          ? "border-success/40 bg-success/10 text-surface-700 dark:text-surface-200"
                          : "border-surface-200 bg-white text-surface-500 dark:border-surface-800 dark:bg-surface-900"
                    }`}
                  >
                    {type === "kruskal" ? `Choose edge ${item}` : `Visit vertex ${item}`}
                  </div>
                ))}
              </div>
              <p className="mt-4 text-sm text-surface-500 dark:text-surface-400">
                Current focus: <span className="font-semibold text-surface-800 dark:text-white">{current}</span>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
