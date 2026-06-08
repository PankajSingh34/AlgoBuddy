"use client";

import { useMemo, useRef, useState } from "react";
import { Play, RotateCcw } from "lucide-react";
import useVisualizerReset from "@/app/hooks/useVisualizerReset";
import { VisualizerCanvas } from "@/app/visualizer/components/VisualizerCanvas";

const nodes = [
  { id: "A", x: 18, y: 32 },
  { id: "B", x: 42, y: 16 },
  { id: "C", x: 70, y: 28 },
  { id: "D", x: 28, y: 72 },
  { id: "E", x: 62, y: 70 },
];

const edges = [
  { from: "A", to: "B", weight: 2 },
  { from: "A", to: "D", weight: 6 },
  { from: "B", to: "C", weight: 3 },
  { from: "B", to: "D", weight: 8 },
  { from: "B", to: "E", weight: 5 },
  { from: "C", to: "E", weight: 7 },
  { from: "D", to: "E", weight: 4 },
];

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

// Algorithms that only make sense on directed graphs
const DIRECTED_ONLY = ["topological", "dijkstra"];

// Algorithms that only make sense on undirected graphs
const UNDIRECTED_ONLY = ["prim", "kruskal"];

// Algorithms that require weighted edges
const WEIGHTED_ONLY = ["dijkstra", "prim", "kruskal"];

function getNode(id) {
  return nodes.find((node) => node.id === id);
}

function edgeId(edge) {
  return `${edge.from}-${edge.to}`;
}

function arrowEndpoint(x1, y1, x2, y2, r = 6) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const dist = Math.sqrt(dx * dx + dy * dy) || 1;
  return {
    x: x2 - (dx / dist) * (r + 1.5),
    y: y2 - (dy / dist) * (r + 1.5),
  };
}

export default function GraphAnimation({ type = "bfs", title = "Graph" }) {
  const [step, setStep] = useState(0);
  const svgRef = useRef(null);

  // Directed toggle
  const canToggleDirected = !DIRECTED_ONLY.includes(type) && !UNDIRECTED_ONLY.includes(type);
  const forceDirected = DIRECTED_ONLY.includes(type);
  const [isDirected, setIsDirected] = useState(forceDirected);
  useVisualizerReset(() => {
    setStep(0);
  });

  // Weighted toggle — auto-lock ON for weight-dependent algorithms
  const forceWeighted = WEIGHTED_ONLY.includes(type);
  const canToggleWeighted = !WEIGHTED_ONLY.includes(type);
  const [isWeighted, setIsWeighted] = useState(forceWeighted);

  const sequence = sequences[type] || sequences.bfs;
  const current = sequence[Math.min(step, sequence.length - 1)];

  const activeNodes = useMemo(() => {
    if (type === "kruskal") {
      return new Set(sequence.slice(0, step + 1).flatMap((item) => item.split("-")));
    }
    return new Set(sequence.slice(0, step + 1));
  }, [sequence, step, type]);

  const activeEdges = useMemo(() => {
    if (type === "kruskal") return new Set(sequence.slice(0, step + 1));
    const selected = new Set();
    const active = sequence.slice(0, step + 1);
    for (let i = 1; i < active.length; i += 1) {
      const prev = active[i - 1];
      const next = active[i];
      const direct = `${prev}-${next}`;
      const reverse = `${next}-${prev}`;
      const found = isDirected
        ? edges.find((edge) => edgeId(edge) === direct)
        : edges.find((edge) => edgeId(edge) === direct || edgeId(edge) === reverse);
      if (found) selected.add(edgeId(found));
    }
    return selected;
  }, [sequence, step, type, isDirected]);

  const advance = () => setStep((value) => (value + 1) % sequence.length);
  const reset = () => setStep(0);

  const handleToggleDirected = () => {
    setIsDirected((d) => !d);
    reset();
  };

  const handleToggleWeighted = () => {
    setIsWeighted((w) => !w);
    reset();
  };

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

        <div className="flex flex-wrap items-center gap-2">
          {/* Directed / Undirected toggle — hidden for prim/kruskal */}
          {!UNDIRECTED_ONLY.includes(type) && (
            <button
              type="button"
              onClick={canToggleDirected ? handleToggleDirected : undefined}
              title={
                forceDirected
                  ? "This algorithm requires a directed graph"
                  : "Toggle directed / undirected"
              }
              className={`btn-base border text-sm transition-colors ${
                isDirected
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-surface-300 text-surface-600 hover:border-primary hover:text-primary dark:border-surface-700 dark:text-surface-300"
              } ${!canToggleDirected ? "cursor-default opacity-70" : ""}`}
            >
              {isDirected ? "Directed" : "Undirected"}
            </button>
          )}

          {/* Weighted / Unweighted toggle — locked ON for dijkstra/prim/kruskal */}
          <button
            type="button"
            onClick={canToggleWeighted ? handleToggleWeighted : undefined}
            title={
              forceWeighted
                ? "This algorithm requires a weighted graph"
                : "Toggle weighted / unweighted"
            }
            className={`btn-base border text-sm transition-colors ${
              isWeighted
                ? "border-yellow-500 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"
                : "border-surface-300 text-surface-600 hover:border-yellow-500 hover:text-yellow-600 dark:border-surface-700 dark:text-surface-300"
            } ${!canToggleWeighted ? "cursor-default opacity-70" : ""}`}
          >
            {isWeighted ? "Weighted" : "Unweighted"}
          </button>

          <button
            type="button"
            onClick={advance}
            className="btn-base bg-primary text-white hover:bg-primary-dark touch-manipulation min-h-[44px] min-w-[44px]"
          >
            <Play className="h-4 w-4" aria-hidden="true" />
            Next step
          </button>
          <button
            type="button"
            onClick={reset}
            className="btn-base border border-surface-300 text-surface-800 hover:border-primary hover:text-primary dark:border-surface-700 dark:text-surface-200 touch-manipulation min-h-[44px] min-w-[44px]"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Reset
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <VisualizerCanvas
          onSwipeLeft={advance}
          onSwipeRight={() => setStep((s) => Math.max(0, s - 1))}
          watchKey={step}
        >
        <svg
          ref={svgRef}
          viewBox="0 0 100 90"
          role="img"
          aria-label={`${title} graph animation`}
          className="min-h-[280px] w-full rounded-xl bg-surface-50 dark:bg-surface-950"
          style={{ touchAction: "manipulation" }}
        >
          <defs>
            <marker
              id="arrowhead"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="4"
              markerHeight="4"
              orient="auto-start-reverse"
            >
              <path
                d="M2 1L8 5L2 9"
                fill="none"
                stroke="var(--color-primary)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </marker>
            <marker
              id="arrowhead-inactive"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="4"
              markerHeight="4"
              orient="auto-start-reverse"
            >
              <path
                d="M2 1L8 5L2 9"
                fill="none"
                stroke="var(--color-neutral-300)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </marker>
          </defs>

          {edges.map((edge) => {
            const start = getNode(edge.from);
            const end = getNode(edge.to);
            const active = activeEdges.has(edgeId(edge));

            const { x: ex, y: ey } = isDirected
              ? arrowEndpoint(start.x, start.y, end.x, end.y)
              : { x: end.x, y: end.y };

            return (
              <g key={edgeId(edge)}>
                <line
                  x1={start.x}
                  y1={start.y}
                  x2={ex}
                  y2={ey}
                  stroke={
                    active
                      ? "var(--color-primary)"
                      : "var(--color-neutral-300)"
                  }
                  strokeWidth={active ? "1.8" : "1"}
                  markerEnd={
                    isDirected
                      ? active
                        ? "url(#arrowhead)"
                        : "url(#arrowhead-inactive)"
                      : undefined
                  }
                />
                {/* Weight label — only shown in weighted mode */}
                {isWeighted && (
                  <text
                    x={(start.x + end.x) / 2}
                    y={(start.y + end.y) / 2 - 1}
                    textAnchor="middle"
                    className="fill-yellow-500 text-[4px] font-bold"
                    fontSize="4"
                  >
                    {edge.weight}
                  </text>
                )}
              </g>
            );
          })}

          {nodes.map((node) => {
            const active = activeNodes.has(node.id);
            // Advance to the step where this node is first visited on tap/click
            const nodeStep = sequence.indexOf(node.id);
            const isReachable = nodeStep !== -1;
            const handleNodeActivate = isReachable
              ? () => setStep(nodeStep)
              : undefined;

            return (
              <g
                key={node.id}
                onClick={handleNodeActivate}
                onKeyDown={isReachable ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleNodeActivate(); } } : undefined}
                role={isReachable ? "button" : undefined}
                tabIndex={isReachable ? 0 : undefined}
                aria-label={isReachable ? `Jump to node ${node.id}` : undefined}
                style={{ cursor: isReachable ? "pointer" : "default" }}
              >
                {/* Enlarged invisible hit area for easy touch targeting (44x44 CSS px equivalent) */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="10"
                  fill="transparent"
                  stroke="none"
                />
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="6"
                  fill={active ? "var(--color-primary)" : "white"}
                  stroke={
                    active
                      ? "var(--color-primary)"
                      : "var(--color-neutral-300)"
                  }
                  strokeWidth="1.5"
                />
                <text
                  x={node.x}
                  y={node.y + 1.5}
                  textAnchor="middle"
                  className={
                    active
                      ? "fill-white text-[5px] font-bold"
                      : "fill-surface-800 text-[5px] font-bold"
                  }
                  style={{ pointerEvents: "none" }}
                >
                  {node.id}
                </text>
              </g>
            );
          })}
        </svg>
        </VisualizerCanvas>

        <div className="rounded-xl border border-surface-200 bg-surface-50 p-4 dark:border-surface-800 dark:bg-surface-950">
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

          {/* Mode info badges */}
          <div className="mt-4 flex flex-col gap-2">
            {isDirected && (
              <div className="rounded-lg border border-primary/20 bg-primary/5 px-3 py-2 text-xs text-primary">
                Directed mode — edges have one-way direction
              </div>
            )}
            {isWeighted && (
              <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/5 px-3 py-2 text-xs text-yellow-600 dark:text-yellow-400">
                Weighted mode — edge costs are shown
              </div>
            )}
          </div>

          <p className="mt-3 text-sm text-surface-500 dark:text-surface-400">
            Current focus:{" "}
            <span className="font-semibold text-surface-800 dark:text-white">
              {current}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
