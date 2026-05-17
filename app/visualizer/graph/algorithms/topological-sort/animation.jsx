"use client";
import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import ResetButton from "@/app/components/ui/resetButton";
import GoButton from "@/app/components/ui/goButton";

const TopologicalSortAnimation = () => {
  const [graph, setGraph] = useState(null);
  const [step, setStep] = useState(-1);
  const [inDegrees, setInDegrees] = useState({});
  const [order, setOrder] = useState([]);
  const [queue, setQueue] = useState([]);
  const [processedNodes, setProcessedNodes] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [message, setMessage] = useState("");
  const [isDone, setIsDone] = useState(false);
  const [hasCycle, setHasCycle] = useState(false);
  const animRef = useRef(null);
  const nodeRefs = useRef({});
  const edgeRefs = useRef({});

  const defaultGraph = {
    nodes: [
      { id: "CS101", x: 60, y: 100 },
      { id: "MATH", x: 60, y: 260 },
      { id: "CS201", x: 280, y: 180 },
      { id: "CS301", x: 500, y: 100 },
      { id: "STATS", x: 500, y: 260 },
    ],
    edges: [
      { from: "CS101", to: "CS201" },
      { from: "MATH", to: "CS201" },
      { from: "CS201", to: "CS301" },
      { from: "CS201", to: "STATS" },
    ],
  };

  useEffect(() => {
    setGraph(defaultGraph);
    return () => { if (animRef.current) clearTimeout(animRef.current); };
  }, []);

  const handleReset = () => {
    setStep(-1); setInDegrees({}); setOrder([]); setQueue([]);
    setProcessedNodes([]); setMessage(""); setIsAnimating(false);
    setIsDone(false); setHasCycle(false);
    if (animRef.current) { clearTimeout(animRef.current); animRef.current = null; }
    Object.values(nodeRefs.current).forEach(ref => {
      if (ref) gsap.to(ref, { fill: "#9CA3AF", stroke: "#D1D5DB", duration: 0 });
    });
    Object.values(edgeRefs.current).forEach(ref => {
      if (ref) gsap.to(ref, { stroke: "#94a3b8", strokeWidth: 2, duration: 0 });
    });
  };

  const handleGo = (e) => {
    e.preventDefault();
    if (!graph) return;
    handleReset();
    setIsAnimating(true);
    runTopologicalSort();
  };

  const runTopologicalSort = () => {
    const adj = {};
    const inDeg = {};
    graph.nodes.forEach(n => { adj[n.id] = []; inDeg[n.id] = 0; });
    graph.edges.forEach(e => {
      adj[e.from].push(e.to);
      inDeg[e.to]++;
    });

    const steps = [];
    steps.push({ type: "init", inDeg: { ...inDeg } });

    const q = [];
    Object.keys(inDeg).forEach(v => { if (inDeg[v] === 0) q.push(v); });
    steps.push({ type: "queue", queue: [...q], inDeg: { ...inDeg } });

    const orderList = [];
    const processed = [];

    while (q.length > 0) {
      const u = q.shift();
      orderList.push(u);
      processed.push(u);
      steps.push({ type: "process", node: u, order: [...orderList], processed: [...processed], queue: [...q], inDeg: { ...inDeg } });

      adj[u].forEach(v => {
        inDeg[v]--;
        steps.push({ type: "decrement", from: u, to: v, inDeg: { ...inDeg }, order: [...orderList], processed: [...processed], queue: [...q] });
        if (inDeg[v] === 0) {
          q.push(v);
          steps.push({ type: "enqueue", node: v, queue: [...q], inDeg: { ...inDeg }, order: [...orderList], processed: [...processed] });
        }
      });
    }

    if (orderList.length === graph.nodes.length) {
      steps.push({ type: "done", order: [...orderList] });
    } else {
      steps.push({ type: "cycle", order: [...orderList] });
    }

    animateSteps(steps);
  };

  const animateSteps = (steps) => {
    let i = 0;
    const animate = () => {
      if (i >= steps.length) {
        setIsAnimating(false);
        return;
      }
      const s = steps[i];
      setStep(i);
      setQueue(s.queue || []);
      setOrder(s.order || []);
      setProcessedNodes(s.processed || []);
      if (s.inDeg) setInDegrees({ ...s.inDeg });

      if (s.type === "init") {
        setMessage("Computing in-degrees...");
        graph.nodes.forEach(n => {
          const ref = nodeRefs.current[n.id];
          if (ref) gsap.to(ref, { fill: "#9CA3AF", stroke: "#D1D5DB", duration: 0.3 });
        });
      } else if (s.type === "queue") {
        setMessage(`Initial queue: vertices with in-degree 0 — ${s.queue.join(", ")}`);
      } else if (s.type === "process") {
        const ref = nodeRefs.current[s.node];
        if (ref) gsap.to(ref, { fill: "#22C55E", stroke: "#15803D", duration: 0.4, scale: 1.1 });
        setMessage(`Processing ${s.node}, added to topological order`);
      } else if (s.type === "decrement") {
        const edgeKey = [s.from, s.to].join("-");
        const ref = edgeRefs.current[edgeKey];
        if (ref) gsap.to(ref, { stroke: "#f59e0b", strokeWidth: 3, duration: 0.3 });
        setMessage(`Decrementing in-degree of ${s.to} (now ${s.inDeg[s.to]})`);
      } else if (s.type === "enqueue") {
        setMessage(`${s.node} has in-degree 0, enqueued`);
      } else if (s.type === "done") {
        setIsDone(true);
        setMessage(`Topological Sort complete! Order: ${s.order.join(" → ")}`);
      } else if (s.type === "cycle") {
        setHasCycle(true);
        setMessage("Cycle detected! Topological Sort is not possible.");
      }
      i++;
      animRef.current = setTimeout(animate, 1000);
    };
    animate();
  };

  if (!graph) return null;

  return (
    <main className="container mx-auto px-6 pb-4">
      <p className="text-lg text-center text-gray-600 dark:text-gray-400 mb-8">
        Visualize Kahn's algorithm for Topological Sort on a Directed Acyclic Graph.
      </p>

      <form onSubmit={handleGo} className="max-w-4xl mx-auto bg-white dark:bg-neutral-950 p-6 rounded-xl mb-8 border border-gray-200 dark:border-gray-700">
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 mb-2">Click Sort to run Topological Sort (Kahn's Algorithm)</label>
          <div className="flex gap-2 w-full sm:max-w-xs">
            <GoButton onClick={handleGo} isAnimating={isAnimating} disabled={isAnimating} />
            <ResetButton onReset={handleReset} isAnimating={isAnimating} />
          </div>
        </div>
      </form>

      {message && (
        <div className={`max-w-3xl mx-auto mb-8 p-4 rounded-lg ${hasCycle ? "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200" : step >= 0 ? "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200" : "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"}`}>
          <p className="text-center font-medium">{message}</p>
        </div>
      )}

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">DAG Visualization</h2>
          <svg width="550" height="360" viewBox="0 0 560 360" className="w-full">
            {graph.edges.map((edge, i) => {
              const from = graph.nodes.find(n => n.id === edge.from);
              const to = graph.nodes.find(n => n.id === edge.to);
              const edgeKey = edge.from + "-" + edge.to;
              const isActive = step >= 0;
              return (
                <g key={i}>
                  <defs>
                    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
                      <polygon points="0 0, 10 3.5, 0 7" fill={isActive ? "#f59e0b" : "#94a3b8"} />
                    </marker>
                  </defs>
                  <line ref={el => { edgeRefs.current[edgeKey] = el; }}
                    x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                    stroke={isActive ? "#f59e0b" : "#94a3b8"}
                    strokeWidth={isActive ? 3 : 2}
                    markerEnd="url(#arrowhead)" />
                </g>
              );
            })}
            {graph.nodes.map((node) => {
              const isProcessed = processedNodes.includes(node.id);
              const inDeg = inDegrees[node.id];
              return (
                <g key={node.id}>
                  <circle ref={el => { nodeRefs.current[node.id] = el; }}
                    cx={node.x} cy={node.y} r={28}
                    className={`transition-colors duration-300 ${isProcessed ? "fill-green-500" : "fill-gray-300 dark:fill-gray-600"}`}
                    stroke={isProcessed ? "#15803D" : "#D1D5DB"} strokeWidth={2} />
                  <text x={node.x} y={node.y} textAnchor="middle" dy="0.35em"
                    className="fill-white font-bold text-xs">{node.id}</text>
                  <text x={node.x} y={node.y + 42} textAnchor="middle"
                    className="fill-gray-700 dark:fill-gray-300 text-xs font-mono">
                    in={inDeg !== undefined ? inDeg : "—"}
                  </text>
                </g>
              );
            })}
          </svg>
          <div className="mt-4 flex flex-wrap justify-center gap-4">
            <div className="flex items-center"><div className="w-4 h-4 bg-green-500 rounded mr-2"></div><span className="text-sm">Processed</span></div>
            <div className="flex items-center"><div className="w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded mr-2"></div><span className="text-sm">Unprocessed</span></div>
            <div className="flex items-center"><div className="w-4 h-4 bg-yellow-500 rounded mr-2"></div><span className="text-sm">Active Edge</span></div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Queue</h3>
          <div className="space-y-2">
            {queue.length === 0 && <p className="text-sm text-gray-500 dark:text-gray-400">Queue empty</p>}
            {queue.map((item, i) => (
              <div key={i} className="p-2 bg-gray-100 dark:bg-gray-700 rounded text-center font-mono text-sm">{item}</div>
            ))}
          </div>

          <div className="mt-4">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Topological Order</h4>
            <div className="flex flex-wrap gap-1">
              {order.length === 0 && <p className="text-sm text-gray-500 dark:text-gray-400">No order yet</p>}
              {order.map((item, i) => (
                <span key={i} className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded text-xs font-mono">
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">In-Degrees</h4>
            {graph.nodes.map(n => (
              <div key={n.id} className="flex justify-between text-sm py-1">
                <span>{n.id}</span>
                <span className="font-mono">{inDegrees[n.id] !== undefined ? inDegrees[n.id] : "—"}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default TopologicalSortAnimation;
