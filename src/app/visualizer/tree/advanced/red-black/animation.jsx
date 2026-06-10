"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Info,
  RefreshCw,
  Plus
} from "lucide-react";
import useVisualizerKeyboard from "@/app/hooks/useVisualizerKeyboard";
import PlaybackControls from "@/app/components/ui/PlaybackControls";
import useVisualizerReset from "@/app/hooks/useVisualizerReset";
import { RBTree, RBNode, RED, BLACK } from "@/features/algorithms/tree/redBlackTreeLogic";

// Logic moved to src/features/algorithms/tree/redBlackTreeLogic.js

// Compute tree layout (x, y coordinates for each node)
function computeLayout(tree) {
  const nodes = [];
  const edges = [];
  let leafIndex = 0;

  const dfs = (node, depth) => {
    if (!node || node.id === "NIL") return;
    node._depth = depth;
    const leftChild = node.left?.id !== "NIL" ? node.left : null;
    const rightChild = node.right?.id !== "NIL" ? node.right : null;

    if (!leftChild && !rightChild) {
      node._x = 60 + leafIndex * 80;
      leafIndex++;
    } else {
      if (leftChild) dfs(leftChild, depth + 1);
      if (rightChild) dfs(rightChild, depth + 1);
      const childXs = [];
      if (leftChild) childXs.push(leftChild._x);
      if (rightChild) childXs.push(rightChild._x);
      node._x = childXs.reduce((a, b) => a + b, 0) / childXs.length;
    }
    node._y = 60 + depth * 90;

    nodes.push({ id: node.id, value: node.value, color: node.color, x: node._x, y: node._y });

    if (leftChild) edges.push({ x1: node._x, y1: node._y + 20, x2: leftChild._x, y2: leftChild._y - 20, childId: leftChild.id });
    if (rightChild) edges.push({ x1: node._x, y1: node._y + 20, x2: rightChild._x, y2: rightChild._y - 20, childId: rightChild.id });
  };

  if (tree.root?.id !== "NIL") dfs(tree.root, 0);
  return { nodes, edges };
}

const INITIAL_VALUES = [30, 15, 70, 10, 20, 60, 85];

export default function RedBlackAnimation() {
  const [rbTree] = useState(() => {
    const t = new RBTree();
    for (const v of INITIAL_VALUES) {
      for (const step of t.insertGenerator(v)) {}
    }
    return t;
  });
  const [displayTree, setDisplayTree] = useState(() => {
    const t = new RBTree();
    for (const v of INITIAL_VALUES) {
      for (const step of t.insertGenerator(v)) {}
    }
    return t;
  });
  const [inputValue, setInputValue] = useState("");
  const [steps, setSteps] = useState([]);
  const [currentStepIdx, setCurrentStepIdx] = useState(-1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [message, setMessage] = useState("Red-Black Tree pre-loaded! Insert values to observe rotations and recoloring.");
  const [highlighted, setHighlighted] = useState({});

  const timerRef = useRef(null);
  useVisualizerReset(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsAnimating(false);
    setMessage("...");
    setSteps([]);
    setCurrentStepIdx(-1);
  });
  const activeTreeRef = useRef(() => {
    const t = new RBTree();
    for (const v of INITIAL_VALUES) {
      for (const step of t.insertGenerator(v)) {}
    }
    return t;
  });

  useEffect(() => {
    const t = new RBTree();
    for (const v of INITIAL_VALUES) {
      for (const step of t.insertGenerator(v)) {}
    }
    activeTreeRef.current = t;
  }, []);



  useEffect(() => {
    if (currentStepIdx < 0 || currentStepIdx >= steps.length) return;
    const step = steps[currentStepIdx];
    setDisplayTree(step.tree);
    setHighlighted(step.highlighted || {});
    setMessage(step.explanation || "");
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
    setHighlighted({});
    setMessage("Playback reset.");
  };

  const handleReset = () => {
    const t = new RBTree();
    for (const v of INITIAL_VALUES) {
      for (const step of t.insertGenerator(v)) {}
    }
    activeTreeRef.current = t;
    setDisplayTree(t.clone());
    setSteps([]);
    setCurrentStepIdx(-1);
    setHighlighted({});
    setInputValue("");
    setMessage("Tree reset to default. Insert values to observe RB tree balancing.");
  };

  const triggerInsert = () => {
    const val = parseInt(inputValue);
    if (isNaN(val) || val < 1 || val > 999) {
      setMessage("⚠️ Please enter a valid integer (1-999).");
      return;
    }
    setIsAnimating(false);
    setInputValue("");

    const gen = activeTreeRef.current.insertGenerator(val);
    const newSteps = Array.from(gen);
    
    activeTreeRef.current = activeTreeRef.current; // stays same ref

    setSteps(newSteps);
    setCurrentStepIdx(0);
    setIsAnimating(false);
  };

  useVisualizerKeyboard({
    onStepForward: stepForward,
    onStepBackward: stepBackward,
    onTogglePlayPause: isAnimating ? pauseVisualizer : startVisualizer,
    onReset: resetPlayback,
    onSpeedChange: setSpeed,
    speed: speed,
    sorting: isAnimating,
    sorted: false,
    enabled: true,
  });

  const { nodes, edges } = computeLayout(displayTree);
  const svgWidth = Math.max(800, nodes.length > 0 ? Math.max(...nodes.map(n => n.x)) + 100 : 800);
  const svgHeight = Math.max(380, nodes.length > 0 ? Math.max(...nodes.map(n => n.y)) + 60 : 380);

  const getNodeStyle = (nodeId, color) => {
    const state = highlighted[nodeId];
    if (state === "visiting") return { fill: "#8b5cf6", stroke: "#c084fc", glow: true };
    if (state === "active")   return { fill: "#10b981", stroke: "#34d399", glow: true };
    if (state === "matched")  return { fill: "#f59e0b", stroke: "#fbbf24", glow: true };
    if (color === "RED")      return { fill: "#dc2626", stroke: "#ef4444", glow: false };
    return { fill: "#0f172a", stroke: "#475569", glow: false }; // BLACK node
  };

  return (
    <div className="bg-slate-950 text-slate-100 font-sans p-6 rounded-3xl border border-slate-900 shadow-2xl flex flex-col gap-6 max-w-7xl mx-auto selection:bg-purple-500/30 selection:text-purple-200">

      {/* Control Bar */}
      <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-5 rounded-2xl flex flex-col xl:flex-row gap-5 justify-between items-center shadow-lg shadow-black/20">
        <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto items-center">
          <input
            type="number"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            placeholder="Value (1-999)"
            className="w-full sm:w-36 px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-[#a435f0] transition-colors"
            disabled={isAnimating}
            onKeyDown={e => e.key === "Enter" && triggerInsert()}
          />
          <button onClick={triggerInsert} disabled={isAnimating}
            className="flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold bg-[#a435f0] hover:bg-[#8f2cd6] text-white rounded-xl transition-all shadow-md w-full sm:w-auto">
            <Plus className="w-3.5 h-3.5" /> Insert
          </button>
        </div>

        <div className="w-full xl:w-auto flex justify-center xl:justify-end">
          <PlaybackControls 
            isPlaying={isAnimating}
            onPlayPause={isAnimating ? pauseVisualizer : startVisualizer}
            onStepForward={stepForward}
            onStepBackward={stepBackward}
            onReset={resetPlayback}
            onClear={handleReset}
            clearLabel="Clear Tree"
            speed={speed}
            onSpeedChange={setSpeed}
            disabled={steps.length === 0}
            showPlayPause={true}
          />
        </div>
      </div>

      {/* Explanation Panel */}
      <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4 flex flex-col gap-2">
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-400 font-semibold flex items-center gap-1.5"><Info className="w-3.5 h-3.5 text-red-400" /> Insertion Step Explanation</span>
          <span className="text-slate-500 font-bold bg-slate-950 px-2.5 py-0.5 rounded-full border border-slate-900">Step {currentStepIdx !== -1 ? currentStepIdx + 1 : 0} / {steps.length || 0}</span>
        </div>
        <div className="text-sm font-medium text-red-200/90 leading-relaxed min-h-[40px] flex items-center">{message}</div>
      </div>

      {/* Legend + SVG Canvas */}
      <div className="bg-slate-900/30 border border-slate-800 rounded-3xl p-6 relative overflow-hidden min-h-[380px] flex flex-col gap-4">
        <div className="flex flex-wrap gap-2 text-xs">
          {[
            { bg: "bg-red-600 border border-red-400", label: "RED node" },
            { bg: "bg-slate-900 border border-slate-500", label: "BLACK node" },
            { bg: "bg-purple-600", label: "Visiting / Being Fixed" },
            { bg: "bg-emerald-600", label: "Rotated / Active" },
            { bg: "bg-amber-500", label: "Fixed / Root" },
          ].map(({ bg, label }) => (
            <div key={label} className="flex items-center gap-1.5 bg-slate-950/70 border border-slate-800 px-2.5 py-1 rounded-lg">
              <span className={`w-3 h-3 rounded-full ${bg}`} />
              <span className="text-slate-400">{label}</span>
            </div>
          ))}
        </div>

        <div className="overflow-auto flex justify-center">
          <svg width={svgWidth} height={svgHeight} viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="max-w-full h-auto">
            {edges.map((e, i) => (
              <line key={i} x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2}
                stroke={highlighted[e.childId] ? "#8b5cf6" : "#334155"} strokeWidth={highlighted[e.childId] ? "2.5" : "2"}
                className="transition-all duration-300" />
            ))}
            {nodes.map(node => {
              const style = getNodeStyle(node.id, node.color);
              return (
                <g key={node.id} className="transition-all duration-300">
                  {style.glow && <circle cx={node.x} cy={node.y} r="28" fill="none" stroke={style.stroke} strokeWidth="1.5" strokeDasharray="4,2" className="opacity-60 animate-pulse" />}
                  <circle cx={node.x} cy={node.y} r="20" fill={style.fill} stroke={style.stroke} strokeWidth="2.5" className="transition-all duration-300 shadow-xl" />
                  <text x={node.x} y={node.y + 4.5} textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">{node.value}</text>
                  <text x={node.x} y={node.y - 26} textAnchor="middle" fill={node.color === "RED" ? "#f87171" : "#64748b"} fontSize="7.5" fontWeight="bold">{node.color}</text>
                </g>
              );
            })}
            {nodes.length === 0 && (
              <text x="400" y="180" textAnchor="middle" fill="#475569" fontSize="14">Insert a value to start the Red-Black Tree visualization</text>
            )}
          </svg>
        </div>

        {/* RB Properties Reminder */}
        <div className="absolute bottom-4 right-4 bg-slate-950/90 border border-slate-800 rounded-xl px-3 py-2 text-xs space-y-0.5 max-w-xs">
          <p className="text-slate-400 font-bold mb-1">RB Tree Rules:</p>
          <p className="text-slate-500">1. Root is always BLACK</p>
          <p className="text-slate-500">2. RED node has BLACK children</p>
          <p className="text-slate-500">3. All paths: equal BLACK height</p>
        </div>
      </div>
    </div>
  );
}
