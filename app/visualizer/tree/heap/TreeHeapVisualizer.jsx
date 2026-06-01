"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Footer from "@/app/components/footer";
import usePlayback from "@/app/hooks/usePlayback";
import PlaybackControls from "@/app/components/ui/PlaybackControls";
import { heapIndexToTreeCoords, insertHeap, extractRoot, buildHeap } from "./heapUtils";
import { Info, Layers, AlertCircle } from "lucide-react";

const stateColors = {
  comparing: { fill: "#3b82f6", stroke: "#60a5fa" },
  swapping: { fill: "#f59e0b", stroke: "#fbbf24" },
  inserted: { fill: "#10b981", stroke: "#34d399" },
  extracted: { fill: "#ef4444", stroke: "#f87171" },
  done: { fill: "#334155", stroke: "#64748b" },
};

const nodeRadius = 21;

const getStateColor = (state) => stateColors[state] || { fill: "#0f172a", stroke: "#334155" };

const getSvgDimensions = (nodes) => {
  if (nodes.length === 0) return { width: 800, height: 400, offsetX: 0 };

  const xCoords = nodes.map((n) => n.x);
  const yCoords = nodes.map((n) => n.y);
  const minX = Math.min(...xCoords);
  const maxX = Math.max(...xCoords);
  const maxY = Math.max(...yCoords);
  const padding = 60;

  return {
    width: Math.max(800, maxX - minX + padding * 2),
    height: Math.max(380, maxY + padding * 1.8),
    offsetX: minX - padding,
  };
};

const parseBuildInput = (value) =>
  value
    .split(",")
    .map((item) => parseInt(item.trim(), 10))
    .filter((item) => !Number.isNaN(item));

export default function TreeHeapVisualizer({ initialHeapType = "min" }) {
  const [heapArray, setHeapArray] = useState([null]);
  const [targetHeapArray, setTargetHeapArray] = useState([null]);
  const [isMinHeap, setIsMinHeap] = useState(initialHeapType !== "max");
  const [inputValue, setInputValue] = useState("");
  const [buildInput, setBuildInput] = useState("");
  const [steps, setSteps] = useState([]);
  const [currentStepIdx, setCurrentStepIdx] = useState(-1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [message, setMessage] = useState("Build or insert values to start.");
  const timerRef = useRef(null);
  const { speed, setSpeed } = usePlayback(1);

  const resetPlayback = useCallback(() => {
    setIsAnimating(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    setSteps([]);
    setCurrentStepIdx(-1);
  }, []);

  const resetHeap = useCallback(
    (nextType) => {
      resetPlayback();
      setHeapArray([null]);
      setTargetHeapArray([null]);
      setInputValue("");
      setBuildInput("");
      setIsMinHeap(nextType);
      setMessage(nextType ? "Min-heap mode selected." : "Max-heap mode selected.");
    },
    [resetPlayback]
  );

  useEffect(() => {
    resetHeap(initialHeapType !== "max");
  }, [initialHeapType, resetHeap]);

  const startPlayback = useCallback((nextArray, nextSteps) => {
    setTargetHeapArray(nextArray);
    setSteps(nextSteps);
    setCurrentStepIdx(0);
    setIsAnimating(true);
  }, []);

  const handleInsert = useCallback(() => {
    const value = parseInt(inputValue, 10);
    if (Number.isNaN(value)) {
      setMessage("Please enter a valid number to insert.");
      return;
    }

    resetPlayback();
    const nextSteps = [];
    const result = insertHeap(heapArray, value, isMinHeap, nextSteps);
    setInputValue("");
    setMessage(`Inserting ${value} into the heap...`);
    startPlayback(result.array, nextSteps);
  }, [heapArray, inputValue, isMinHeap, resetPlayback, startPlayback]);

  const handleExtract = useCallback(() => {
    if (heapArray.length <= 1) {
      setMessage("The heap is empty.");
      return;
    }

    resetPlayback();
    const nextSteps = [];
    const result = extractRoot(heapArray, isMinHeap, nextSteps);
    setMessage(`Extracting the root value ${result.extractedValue}...`);
    startPlayback(result.array, nextSteps);
  }, [heapArray, isMinHeap, resetPlayback, startPlayback]);

  const handleBuild = useCallback(() => {
    const values = parseBuildInput(buildInput);
    if (values.length === 0) {
      setMessage("Enter comma-separated numbers to build a heap.");
      return;
    }

    resetPlayback();
    const nextSteps = [];
    const result = buildHeap(values, isMinHeap, nextSteps);
    setBuildInput("");
    setMessage("Building heap with Floyd's algorithm...");
    startPlayback(result.array, nextSteps);
  }, [buildInput, isMinHeap, resetPlayback, startPlayback]);

  const startVisualizer = useCallback(() => {
    if (steps.length === 0) {
      setMessage("Run an operation first to generate an animation.");
      return;
    }
    setIsAnimating(true);
    if (currentStepIdx === -1) setCurrentStepIdx(0);
  }, [currentStepIdx, steps.length]);

  const pauseVisualizer = useCallback(() => {
    setIsAnimating(false);
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const stepForward = useCallback(() => {
    setIsAnimating(false);
    if (currentStepIdx < steps.length - 1) {
      setCurrentStepIdx((prev) => prev + 1);
    }
  }, [currentStepIdx, steps.length]);

  const stepBackward = useCallback(() => {
    setIsAnimating(false);
    if (currentStepIdx > 0) {
      setCurrentStepIdx((prev) => prev - 1);
    }
  }, [currentStepIdx]);

  const handleResetPlayback = useCallback(() => {
    setIsAnimating(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    setSteps([]);
    setCurrentStepIdx(-1);
    setMessage("Playback reset.");
  }, []);

  const clearHeap = useCallback(() => {
    resetPlayback();
    setHeapArray([null]);
    setTargetHeapArray([null]);
    setInputValue("");
    setBuildInput("");
    setMessage(isMinHeap ? "Min heap cleared." : "Max heap cleared.");
  }, [isMinHeap, resetPlayback]);

  useEffect(() => {
    if (!isAnimating || steps.length === 0) return;

    if (currentStepIdx >= steps.length) {
      setIsAnimating(false);
      return;
    }

    const currentStep = steps[currentStepIdx];
    setMessage(currentStep.explanation);

    timerRef.current = setTimeout(() => {
      if (currentStepIdx < steps.length - 1) {
        setCurrentStepIdx((prev) => prev + 1);
      } else {
        setIsAnimating(false);
        setHeapArray(targetHeapArray);
        setMessage("Operation completed successfully!");
      }
    }, 1800 / speed);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentStepIdx, isAnimating, speed, steps, targetHeapArray]);

  const currentStep = steps[currentStepIdx] || null;
  const activeArray = currentStep?.arraySnapshot || heapArray;
  const activeTypeLabel = isMinHeap ? "Min-Heap" : "Max-Heap";

  const treeNodes = heapIndexToTreeCoords(activeArray, activeArray.length - 1, 800);
  const svgDimensions = getSvgDimensions(treeNodes);

  const getStateForIndex = (index) => {
    if (!currentStep) return null;
    return currentStep.highlightedNodes?.[index] || (currentStep.highlightedIndices?.includes(index) ? "comparing" : null);
  };

  const showAmberBanner = currentStep && (currentStep.stepType.includes("imbalance") || currentStep.stepType.includes("rotation"));

  return (
    <div className="min-h-screen bg-[#080b16] text-white">
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-24 flex flex-col gap-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2 text-xs font-semibold uppercase tracking-wider text-indigo-400 bg-indigo-950/40 px-3 py-1 rounded-full w-fit border border-indigo-900/50">
              <Layers className="w-3.5 h-3.5" /> Heap Interactive Operations
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-200 to-indigo-400">
              {activeTypeLabel}
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-xl">
              Insert, extract, and build the heap while watching the tree and array stay in sync.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => resetHeap(true)}
              aria-pressed={isMinHeap}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${isMinHeap ? "bg-indigo-600 text-white border-indigo-500" : "bg-slate-900 text-slate-300 border-slate-700"}`}
            >
              Min-Heap
            </button>
            <button
              type="button"
              onClick={() => resetHeap(false)}
              aria-pressed={!isMinHeap}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${!isMinHeap ? "bg-indigo-600 text-white border-indigo-500" : "bg-slate-900 text-slate-300 border-slate-700"}`}
            >
              Max-Heap
            </button>
          </div>
        </div>

        <div className="bg-[#111] backdrop-blur-xl border border-[#222] p-5 rounded-2xl flex flex-col gap-5 shadow-lg shadow-black/20">
          <div className="flex flex-col lg:flex-row gap-4 lg:items-end justify-between">
            <div className="flex flex-col sm:flex-row gap-2.5 w-full lg:w-auto">
              <input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Insert value"
                disabled={isAnimating}
                className="w-full sm:w-36 px-3 py-2 text-xs bg-[#1a1a1a] border border-[#333] rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                onKeyDown={(e) => e.key === "Enter" && handleInsert()}
              />
              <button
                type="button"
                onClick={handleInsert}
                disabled={isAnimating}
                className="px-4 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-900 disabled:opacity-40 text-white rounded-xl transition-all"
              >
                Insert
              </button>
              <button
                type="button"
                onClick={handleExtract}
                disabled={isAnimating || heapArray.length <= 1}
                className="px-4 py-2 text-xs font-bold bg-[#1a1a1a] hover:bg-[#2a2a2a] text-slate-200 rounded-xl transition-all border border-[#333] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Extract Root
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 w-full lg:w-auto">
              <input
                type="text"
                value={buildInput}
                onChange={(e) => setBuildInput(e.target.value)}
                placeholder="e.g. 5, 3, 8, 1, 4"
                disabled={isAnimating}
                className="w-full sm:w-72 px-3 py-2 text-xs bg-[#1a1a1a] border border-[#333] rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
              <button
                type="button"
                onClick={handleBuild}
                disabled={isAnimating}
                className="px-4 py-2 text-xs font-bold bg-[#1a1a1a] hover:bg-[#2a2a2a] text-slate-200 rounded-xl transition-all border border-[#333] disabled:opacity-40"
              >
                Build Heap
              </button>
            </div>
          </div>

          <PlaybackControls
            isPlaying={isAnimating}
            onPlayPause={isAnimating ? pauseVisualizer : startVisualizer}
            onStepForward={stepForward}
            onStepBackward={stepBackward}
            onReset={handleResetPlayback}
            onClear={clearHeap}
            clearLabel="Clear Heap"
            speed={speed}
            onSpeedChange={setSpeed}
            disabled={steps.length === 0 && !isAnimating}
            showPlayPause={true}
            progressText={`Step ${currentStepIdx !== -1 ? currentStepIdx + 1 : 0} / ${steps.length || 0}`}
          />
        </div>

        <div className={`bg-[#111] border border-[#222] rounded-2xl p-4 flex flex-col gap-2 ${showAmberBanner ? "text-amber-100" : ""}`}>
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400 font-semibold flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-indigo-400" /> Action Explanation
            </span>
            <span className="text-slate-400 font-bold bg-[#1a1a1a] px-2.5 py-0.5 rounded-full border border-[#333]">
              Step {currentStepIdx !== -1 ? currentStepIdx + 1 : 0} / {steps.length || 0}
            </span>
          </div>
          <div className="text-[14px] leading-relaxed min-h-[24px] text-center" style={{ color: "var(--color-muted)" }}>
            {message}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-5">
          <div className="w-full lg:w-1/2 bg-[#111] border border-[#222] rounded-3xl p-6 shadow-inner relative overflow-hidden min-h-[440px]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-400">
                <Layers className="w-3.5 h-3.5" /> Tree View
              </div>
              <span className="text-xs text-slate-400">Heap nodes by index</span>
            </div>

            {!treeNodes.length ? (
              <div className="flex flex-col items-center gap-2.5 text-slate-500 py-12">
                <AlertCircle className="w-10 h-10 text-slate-700" />
                <span className="text-sm font-semibold">Workspace Empty</span>
                <span className="text-xs max-w-xs text-center text-slate-600">Build the heap or insert values to see the tree.</span>
              </div>
            ) : (
              <svg
                width="100%"
                height="100%"
                viewBox={`0 0 ${svgDimensions.width} ${svgDimensions.height}`}
                className="overflow-visible"
                style={{ minHeight: "360px" }}
              >
                {treeNodes.map((node) => {
                  const parent = treeNodes.find((item) => item.index === node.parentIndex);
                  const state = getStateForIndex(node.index);
                  const { fill, stroke } = getStateColor(state);
                  return parent ? (
                    <line
                      key={`edge-${node.index}`}
                      x1={parent.x - svgDimensions.offsetX}
                      y1={parent.y + nodeRadius}
                      x2={node.x - svgDimensions.offsetX}
                      y2={node.y - nodeRadius}
                      stroke="#334155"
                    strokeWidth="2.5"
                  />
                ) : null;
              })}

                {treeNodes.map((node) => {
                  const state = getStateForIndex(node.index);
                  const { fill, stroke } = getStateColor(state);
                  const isNull = node.index === 0;
                  return (
                    <g key={`node-${node.index}`} className="transition-all duration-300">
                      <circle
                        cx={node.x - svgDimensions.offsetX}
                        cy={node.y}
                        r={nodeRadius}
                        fill={isNull ? "#0f172a" : fill}
                        stroke={isNull ? "#475569" : stroke}
                        strokeWidth="2.5"
                        strokeDasharray={isNull ? "4,3" : undefined}
                        opacity={isNull ? 0.75 : 1}
                      />
                      <text
                        x={node.x - svgDimensions.offsetX}
                        y={node.y + 4}
                        textAnchor="middle"
                        fill={isNull ? "#94a3b8" : "#fff"}
                        fontSize="12"
                        fontWeight="700"
                      >
                        {isNull ? "null" : node.value}
                      </text>
                      <text
                        x={node.x - svgDimensions.offsetX}
                        y={node.y + 38}
                        textAnchor="middle"
                        fill={isNull ? "#64748b" : "#94a3b8"}
                        fontSize="9"
                        fontWeight="700"
                      >
                        {node.index}
                      </text>
                    </g>
                  );
                })}
              </svg>
            )}
          </div>

          <div className="w-full lg:w-1/2 bg-[#111] border border-[#222] rounded-3xl p-6 shadow-inner relative overflow-hidden min-h-[440px]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-400">
                <Layers className="w-3.5 h-3.5" /> Array View
              </div>
              <span className="text-xs text-slate-400">1-indexed heap array</span>
            </div>

            <div className="w-full overflow-x-auto pb-2">
              <div className="flex items-stretch gap-2 min-w-max">
                {(activeArray || [null]).map((value, index) => {
                  const state = currentStep?.highlightedNodes?.[index] || (currentStep?.highlightedIndices?.includes(index) ? "comparing" : null);
                  const { fill, stroke } = getStateColor(state);
                  const isNull = index === 0;

                  return (
                    <div
                      key={`array-${index}`}
                      className={`relative rounded-xl border flex flex-col items-center justify-center shrink-0 ${isNull ? "w-14 h-16 opacity-75 border-dashed" : "w-16 h-20"}`}
                      style={{
                        backgroundColor: isNull ? "#0f172a" : fill,
                        borderColor: isNull ? "#334155" : stroke,
                      }}
                    >
                      <div className="absolute top-1 left-1.5 text-[9px] text-slate-400 font-bold">
                        {index}
                      </div>
                      <div className="text-sm font-bold text-white mt-2">
                        {isNull ? "null" : value}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
