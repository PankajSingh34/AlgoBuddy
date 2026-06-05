"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  RefreshCw,
} from "lucide-react";
import {
  VisualizerCard,
  VisualizerInteractiveLayout,
} from "@/app/visualizer/components/VisualizerInteractiveLayout";
import usePlayback from "@/app/hooks/usePlayback";
import useVisualizerKeyboard from "@/app/hooks/useVisualizerKeyboard";
import PlaybackControls from "@/app/components/ui/PlaybackControls";
import useVisualizerReset from "@/app/hooks/useVisualizerReset";

const DEFAULT_VALUES = [5, 11, 8, 12, 4, 9, 3, 7];

// Build segment tree (sum) over arr (0-indexed)
// Returns tree array (1-indexed), tree[1] = root
function buildSegTree(arr) {
  const n = arr.length;
  const tree = new Array(4 * n).fill(0);
  function build(node, start, end) {
    if (start === end) {
      tree[node] = arr[start];
    } else {
      const mid = Math.floor((start + end) / 2);
      build(2 * node, start, mid);
      build(2 * node + 1, mid + 1, end);
      tree[node] = tree[2 * node] + tree[2 * node + 1];
    }
  }
  build(1, 0, n - 1);
  return tree;
}

// Collect tree nodes with positions for rendering
function collectNodes(tree, n) {
  const nodes = [];
  function dfs(node, start, end, depth, xMin, xMax) {
    if (start > end || node >= tree.length) return;
    const x = (xMin + xMax) / 2;
    const y = 50 + depth * 90;
    nodes.push({ node, start, end, x, y, value: tree[node] });
    if (start < end) {
      const mid = Math.floor((start + end) / 2);
      dfs(2 * node, start, mid, depth + 1, xMin, (xMin + xMax) / 2);
      dfs(2 * node + 1, mid + 1, end, depth + 1, (xMin + xMax) / 2, xMax);
    }
  }
  dfs(1, 0, n - 1, 0, 60, 740);
  return nodes;
}

export default function SegmentAnimation() {
  const [arr, setArr] = useState([...DEFAULT_VALUES]);
  const [tree, setTree] = useState(() => buildSegTree(DEFAULT_VALUES));
  const [mode, setMode] = useState("query"); // "query" | "update"
  const [queryL, setQueryL] = useState("");
  const [queryR, setQueryR] = useState("");
  const [updateIdx, setUpdateIdx] = useState("");
  const [updateVal, setUpdateVal] = useState("");
  const [steps, setSteps] = useState([]);
  const [currentStepIdx, setCurrentStepIdx] = useState(-1);
  const [isAnimating, setIsAnimating] = useState(false);
  const { speed, setSpeed } = usePlayback(1);
  const [message, setMessage] = useState("Build complete! Select a range query or point update to visualize.");
  const [highlightedNodes, setHighlightedNodes] = useState({}); // node -> state
  const [highlightedArray, setHighlightedArray] = useState({});
  const [resultBox, setResultBox] = useState(null);

  const timerRef = useRef(null);
  useVisualizerReset(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsAnimating(false);
    setMessage("...");
    setSteps([]);
    setCurrentStepIdx(-1);
  });
  const n = arr.length;
  const treeNodes = collectNodes(tree, n);


  useEffect(() => {
    if (currentStepIdx < 0 || currentStepIdx >= steps.length) return;
    const step = steps[currentStepIdx];
    setHighlightedNodes(step.highlightedNodes || {});
    setHighlightedArray(step.highlightedArray || {});
    setMessage(step.explanation || "");
    if (step.result !== undefined) setResultBox(step.result);
  }, [currentStepIdx, steps]);

  useEffect(() => {
    if (!isAnimating || steps.length === 0) return;
    if (currentStepIdx >= steps.length - 1) { setIsAnimating(false); return; }
    timerRef.current = setTimeout(() => setCurrentStepIdx(p => p + 1), 1600 / speed);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [isAnimating, currentStepIdx, steps, speed]);

  const pauseVisualizer = () => { setIsAnimating(false); if (timerRef.current) clearTimeout(timerRef.current); };
  const startVisualizer = () => {
    if (steps.length === 0) return;
    setIsAnimating(true);
    const nextIdx = currentStepIdx === -1 || currentStepIdx >= steps.length - 1 ? 0 : currentStepIdx + 1;
    setCurrentStepIdx(nextIdx);
  };
  const stepForward = () => { setIsAnimating(false); if (currentStepIdx < steps.length - 1) setCurrentStepIdx(p => p + 1); };
  const stepBackward = () => { setIsAnimating(false); if (currentStepIdx > 0) setCurrentStepIdx(p => p - 1); };
  const resetPlayback = () => {
    setIsAnimating(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    setCurrentStepIdx(-1);
    setHighlightedNodes({});
    setHighlightedArray({});
    setResultBox(null);
    setMessage("Playback reset.");
  };

  const handleReset = () => {
    setArr([...DEFAULT_VALUES]);
    setTree(buildSegTree(DEFAULT_VALUES));
    setSteps([]);
    setCurrentStepIdx(-1);
    setHighlightedNodes({});
    setHighlightedArray({});
    setResultBox(null);
    setQueryL(""); setQueryR(""); setUpdateIdx(""); setUpdateVal("");
    setMessage("Tree reset to default. Choose an operation to begin.");
  };

  // === RANGE QUERY ===
  const triggerQuery = () => {
    const l = parseInt(queryL);
    const r = parseInt(queryR);
    if (isNaN(l) || isNaN(r) || l < 0 || r >= n || l > r) {
      setMessage(`⚠️ Enter a valid range (0 ≤ L ≤ R ≤ ${n - 1}).`);
      return;
    }

    setIsAnimating(false);
    setResultBox(null);

    const newSteps = [];
    let totalSum = 0;

    const queryDFS = (node, start, end, qL, qR) => {
      if (qR < start || end < qL) {
        newSteps.push({
          highlightedNodes: { [node]: "error" },
          highlightedArray: Object.fromEntries(Array.from({ length: r - l + 1 }, (_, i) => [l + i, "active"])),
          explanation: `Node [${start}..${end}] is completely outside query [${qL}..${qR}]. Return 0. (Out-of-range node)`,
          result: undefined
        });
        return 0;
      }
      if (qL <= start && end <= qR) {
        totalSum += tree[node];
        newSteps.push({
          highlightedNodes: { [node]: "matched" },
          highlightedArray: Object.fromEntries(Array.from({ length: r - l + 1 }, (_, i) => [l + i, "active"])),
          explanation: `Node [${start}..${end}] is completely inside query [${qL}..${qR}]. Include BIT[${node}] = ${tree[node]}.`,
          result: undefined
        });
        return tree[node];
      }
      newSteps.push({
        highlightedNodes: { [node]: "visiting" },
        highlightedArray: Object.fromEntries(Array.from({ length: r - l + 1 }, (_, i) => [l + i, "active"])),
        explanation: `Node [${start}..${end}] partially overlaps [${qL}..${qR}]. Recurse into both children.`,
        result: undefined
      });
      const mid = Math.floor((start + end) / 2);
      const leftVal = queryDFS(2 * node, start, mid, qL, qR);
      const rightVal = queryDFS(2 * node + 1, mid + 1, end, qL, qR);
      return leftVal + rightVal;
    };

    const result = queryDFS(1, 0, n - 1, l, r);

    newSteps.push({
      highlightedNodes: {},
      highlightedArray: Object.fromEntries(Array.from({ length: r - l + 1 }, (_, i) => [l + i, "matched"])),
      explanation: `✅ Range Sum Query [${l}, ${r}] complete. Result = ${result}.`,
      result: `Sum[${l}..${r}] = ${result}`
    });

    setQueryL(""); setQueryR("");
    setSteps(newSteps);
    setCurrentStepIdx(0);
    setIsAnimating(true);
  };

  // === POINT UPDATE ===
  const triggerUpdate = () => {
    const idx = parseInt(updateIdx);
    const newVal = parseInt(updateVal);
    if (isNaN(idx) || isNaN(newVal) || idx < 0 || idx >= n) {
      setMessage(`⚠️ Enter a valid index (0-${n - 1}) and new value.`);
      return;
    }

    setIsAnimating(false);
    setResultBox(null);

    const newArr = [...arr];
    const oldVal = newArr[idx];
    newArr[idx] = newVal;
    const newTree = buildSegTree(newArr);

    const newSteps = [];
    const delta = newVal - oldVal;

    const updateDFS = (node, start, end, target, delta) => {
      newSteps.push({
        highlightedNodes: { [node]: start === end ? "matched" : "visiting" },
        highlightedArray: { [target]: start === end ? "matched" : "active" },
        explanation: start === end
          ? `Leaf node [${start}]: Update value from ${oldVal} to ${newVal}. Delta = ${delta > 0 ? "+" : ""}${delta}.`
          : `Internal node [${start}..${end}]: Recurse ${target <= Math.floor((start + end) / 2) ? "left" : "right"} toward index ${target}.`,
        result: undefined
      });

      if (start === end) return;
      const mid = Math.floor((start + end) / 2);
      if (target <= mid) updateDFS(2 * node, start, mid, target, delta);
      else updateDFS(2 * node + 1, mid + 1, end, target, delta);
    };

    updateDFS(1, 0, n - 1, idx, delta);

    newSteps.push({
      highlightedNodes: {},
      highlightedArray: { [idx]: "matched" },
      explanation: `✅ Point Update complete. arr[${idx}] = ${oldVal} → ${newVal}. All ancestor nodes updated with delta=${delta}.`,
      result: `Updated arr[${idx}]: ${oldVal} → ${newVal}`
    });

    setArr(newArr);
    setTree(newTree);
    setUpdateIdx(""); setUpdateVal("");
    setSteps(newSteps);
    setCurrentStepIdx(0);
    setIsAnimating(true);
  };

  useVisualizerKeyboard({
    onStepForward: stepForward,
    onStepBackward: stepBackward,
    onTogglePlay: isAnimating ? pauseVisualizer : startVisualizer,
    onReset: resetPlayback,
    onSpeedChange: setSpeed,
    speed: speed,
    sorting: isAnimating,
    sorted: false,
    enabled: true,
  });

  // Color helpers
  const getNodeColor = (nodeId) => {
    const s = highlightedNodes[nodeId];
    if (s === "visiting") return { fill: "#a435f0", stroke: "#d38cff", text: "#fff", glow: true };
    if (s === "matched")  return { fill: "#10b981", stroke: "#34d399", text: "#fff", glow: true };
    if (s === "error")    return { fill: "#ef4444", stroke: "#f87171", text: "#fff", glow: false };
    return { fill: "var(--background)", stroke: "#64748b", text: "var(--foreground)", glow: false };
  };

  const getArrayColor = (i) => {
    const s = highlightedArray[i];
    if (s === "active")   return "border-[#a435f0] bg-[#a435f0]/10 text-[#a435f0] dark:text-[#d38cff]";
    if (s === "matched")  return "border-emerald-500 bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400";
    if (s === "error")    return "border-rose-500 bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400";
    return "border-gray-300 bg-white text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300";
  };

  // Build edge list from treeNodes
  const edges = treeNodes
    .filter(node => node.start < node.end)
    .flatMap(parent => {
      const mid = Math.floor((parent.start + parent.end) / 2);
      const leftChild = treeNodes.find(n => n.node === 2 * parent.node && n.start === parent.start && n.end === mid);
      const rightChild = treeNodes.find(n => n.node === 2 * parent.node + 1 && n.start === mid + 1 && n.end === parent.end);
      const edges = [];
      if (leftChild) edges.push({ x1: parent.x, y1: parent.y + 22, x2: leftChild.x, y2: leftChild.y - 22, highlighted: !!highlightedNodes[leftChild.node] });
      if (rightChild) edges.push({ x1: parent.x, y1: parent.y + 22, x2: rightChild.x, y2: rightChild.y - 22, highlighted: !!highlightedNodes[rightChild.node] });
      return edges;
    });

  return (
    <VisualizerInteractiveLayout>
      <VisualizerCard>
        <div className="flex gap-2 mb-4 bg-gray-100 p-1 rounded-xl w-fit dark:bg-gray-800">
          {[["query", "Range Query"], ["update", "Point Update"]].map(([val, label]) => (
            <button key={val} onClick={() => { setMode(val); resetPlayback(); }}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${mode === val ? "bg-[#a435f0] text-white shadow-md" : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"}`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex flex-col sm:flex-row gap-2">
            {mode === "query" ? (
              <>
                <input type="number" value={queryL} onChange={e => setQueryL(e.target.value)} placeholder={`L (0-${n-1})`}
                  className="flex-1 rounded-lg border p-2 transition-all focus:border-transparent focus:ring-2 focus:ring-[#a435f0] dark:bg-gray-700" disabled={isAnimating} />
                <input type="number" value={queryR} onChange={e => setQueryR(e.target.value)} placeholder={`R (0-${n-1})`}
                  className="flex-1 rounded-lg border p-2 transition-all focus:border-transparent focus:ring-2 focus:ring-[#a435f0] dark:bg-gray-700" disabled={isAnimating}
                  onKeyDown={e => e.key === "Enter" && triggerQuery()} />
                <button onClick={triggerQuery} disabled={isAnimating}
                  className="rounded-lg bg-[#a435f0] px-4 py-2 text-white transition-colors hover:bg-[#8f2cd6] disabled:opacity-50">
                  Query Sum
                </button>
              </>
            ) : (
              <>
                <input type="number" value={updateIdx} onChange={e => setUpdateIdx(e.target.value)} placeholder={`Index (0-${n-1})`}
                  className="flex-1 rounded-lg border p-2 transition-all focus:border-transparent focus:ring-2 focus:ring-[#a435f0] dark:bg-gray-700" disabled={isAnimating} />
                <input type="number" value={updateVal} onChange={e => setUpdateVal(e.target.value)} placeholder="New value"
                  className="flex-1 rounded-lg border p-2 transition-all focus:border-transparent focus:ring-2 focus:ring-[#a435f0] dark:bg-gray-700" disabled={isAnimating}
                  onKeyDown={e => e.key === "Enter" && triggerUpdate()} />
                <button onClick={triggerUpdate} disabled={isAnimating}
                  className="rounded-lg bg-[#a435f0] px-4 py-2 text-white transition-colors hover:bg-[#8f2cd6] disabled:opacity-50">
                  Update
                </button>
              </>
            )}
          </div>
          
          <div className="flex justify-end gap-2 items-start">
            <button onClick={handleReset} className="flex items-center gap-1.5 rounded-lg border border-red-500 text-red-500 px-4 py-2 transition-colors hover:bg-red-500 hover:text-white h-[42px]">
              <RefreshCw className="w-4 h-4" /> Reset
            </button>
          </div>
        </div>

        <div className="mt-6">
          <PlaybackControls 
            isPlaying={isAnimating}
            onPlayPause={isAnimating ? pauseVisualizer : startVisualizer}
            onStepForward={stepForward}
            onStepBackward={stepBackward}
            onReset={resetPlayback}
            speed={speed}
            onSpeedChange={setSpeed}
            disabled={steps.length === 0}
            showPlayPause={true}
          />
        </div>
      </VisualizerCard>

      <VisualizerCard
        className={
          message.includes("complete") || message.includes("✅")
            ? "border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/30"
            : message.includes("Out of range") || message.includes("error") || message.includes("⚠️")
              ? "border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/30"
              : isAnimating
                ? "border-[#a435f0]/30 bg-[#a435f0]/10 dark:border-[#a435f0]/50 dark:bg-[#a435f0]/20"
                : ""
        }
      >
        <div className="flex justify-between items-center text-xs text-gray-500 mb-2">
          <span>Step Explanation</span>
          <span className="font-bold bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
            Step {currentStepIdx !== -1 ? currentStepIdx + 1 : 0} / {steps.length || 0}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <p className="font-medium text-lg min-h-[28px]">{message}</p>
          {resultBox && <span className="ml-auto shrink-0 bg-emerald-100 border border-emerald-200 text-emerald-700 px-3 py-1 rounded-xl text-sm font-bold dark:bg-emerald-900/40 dark:border-emerald-800 dark:text-emerald-400">{resultBox}</span>}
        </div>
      </VisualizerCard>

      <VisualizerCard>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Segment Tree Visualization</h2>
          <div className="flex flex-wrap gap-2 text-xs">
            {[{ color: "bg-[#a435f0]", label: "Visiting" }, { color: "bg-emerald-500", label: "In Range / Updated" }, { color: "bg-red-500", label: "Out of Range" }].map(({ color, label }) => (
              <div key={label} className="flex items-center gap-1.5 px-2 py-1 rounded-lg">
                <span className={`w-2.5 h-2.5 rounded-full ${color}`} />
                <span className="text-gray-500 dark:text-gray-400">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-6 py-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 min-h-[480px]">
          
          {/* Source Array */}
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Source Array (0-indexed)</span>
            <div className="flex gap-1.5">
              {arr.map((val, i) => (
                <div key={i} className="flex flex-col items-center gap-0.5">
                  <div className={`w-12 h-10 flex items-center justify-center border-2 rounded-xl text-sm font-bold transition-all duration-300 ${getArrayColor(i)}`}>{val}</div>
                  <span className="text-[10px] text-gray-500 font-mono">[{i}]</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tree SVG */}
          <div className="overflow-auto flex justify-center">
            <svg width="800" height={50 + Math.ceil(Math.log2(n + 1)) * 90 + 40} viewBox={`0 0 800 ${50 + Math.ceil(Math.log2(n + 1)) * 90 + 40}`} className="max-w-full h-auto">
              {/* Edges */}
              {edges.map((e, i) => (
                <line key={i} x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2}
                  stroke={e.highlighted ? "#a435f0" : "currentColor"} strokeWidth={e.highlighted ? "2.5" : "1.5"}
                  className={`transition-all duration-300 ${e.highlighted ? '' : 'stroke-gray-300 dark:stroke-gray-600'}`} />
              ))}
              {/* Nodes */}
              {treeNodes.map(n => {
                const colors = getNodeColor(n.node);
                const isLeaf = n.start === n.end;
                const label = isLeaf ? `${n.value}` : `Σ${n.value}`;
                const sublabel = `[${n.start}..${n.end}]`;
                
                let fillStyle = colors.fill;
                if (fillStyle === "var(--background)") {
                  fillStyle = "currentColor";
                }
                
                return (
                  <g key={n.node} className="transition-all duration-300">
                    {colors.glow && (
                      <circle cx={n.x} cy={n.y} r="28" fill="none" stroke={colors.stroke} strokeWidth="1.5" strokeDasharray="4,2" className="opacity-80">
                        <animateTransform attributeName="transform" type="rotate" from={`0 ${n.x} ${n.y}`} to={`360 ${n.x} ${n.y}`} dur="4s" repeatCount="indefinite" />
                      </circle>
                    )}
                    <rect x={n.x - 32} y={n.y - 20} width="64" height="40" rx="8"
                      fill={fillStyle} 
                      stroke={colors.stroke} 
                      strokeWidth="1.5" 
                      className={`transition-all duration-300 ${colors.fill === 'var(--background)' ? 'fill-white dark:fill-gray-900' : ''}`} 
                    />
                    <text 
                      x={n.x} y={n.y + 2} 
                      textAnchor="middle" 
                      fill={colors.text} 
                      fontSize="10" 
                      fontWeight="bold"
                      className={colors.text === 'var(--foreground)' ? 'fill-gray-900 dark:fill-gray-100' : ''}
                    >
                      {label}
                    </text>
                    <text x={n.x} y={n.y + 14} textAnchor="middle" fill={colors.text === "#fff" ? "rgba(255,255,255,0.7)" : "#64748b"} fontSize="8">{sublabel}</text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      </VisualizerCard>
    </VisualizerInteractiveLayout>
  );
}
