"use client";
import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import ResetButton from "@/app/components/ui/resetButton";
import GoButton from "@/app/components/ui/goButton";

const KruskalAnimation = () => {
  const [graph, setGraph] = useState(null);
  const [sortedEdges, setSortedEdges] = useState([]);
  const [step, setStep] = useState(-1);
  const [mstEdges, setMstEdges] = useState([]);
  const [skippedEdges, setSkippedEdges] = useState([]);
  const [processedCount, setProcessedCount] = useState(0);
  const [sets, setSets] = useState({});
  const [isAnimating, setIsAnimating] = useState(false);
  const [message, setMessage] = useState("");
  const [isMstDone, setIsMstDone] = useState(false);
  const animRef = useRef(null);
  const nodeRefs = useRef({});
  const edgeRefs = useRef({});

  const defaultGraph = {
    nodes: [
      { id: "A", x: 120, y: 180 },
      { id: "B", x: 320, y: 80 },
      { id: "C", x: 320, y: 280 },
      { id: "D", x: 520, y: 80 },
      { id: "E", x: 520, y: 280 },
    ],
    edges: [
      { from: "A", to: "B", weight: 4 },
      { from: "A", to: "C", weight: 2 },
      { from: "B", to: "C", weight: 1 },
      { from: "B", to: "D", weight: 5 },
      { from: "C", to: "D", weight: 8 },
      { from: "C", to: "E", weight: 10 },
      { from: "D", to: "E", weight: 2 },
    ],
  };

  useEffect(() => {
    setGraph(defaultGraph);
    return () => { if (animRef.current) clearTimeout(animRef.current); };
  }, []);

  const handleReset = () => {
    setStep(-1); setMstEdges([]); setSkippedEdges([]); setProcessedCount(0);
    setMessage(""); setIsAnimating(false); setIsMstDone(false); setSets({});
    if (animRef.current) { clearTimeout(animRef.current); animRef.current = null; }
    Object.values(nodeRefs.current).forEach(ref => { if (ref) gsap.to(ref, { fill: "#9CA3AF", stroke: "#D1D5DB", duration: 0 }); });
    Object.values(edgeRefs.current).forEach(ref => { if (ref) gsap.to(ref, { stroke: "#94a3b8", strokeWidth: 2, duration: 0 }); });
  };

  const handleGo = (e) => {
    e.preventDefault();
    if (!graph) return;
    handleReset();
    setIsAnimating(true);
    runKruskal();
  };

  const runKruskal = () => {
    const edges = [...graph.edges].sort((a, b) => a.weight - b.weight);
    setSortedEdges(edges);

    const parent = {};
    const rank = {};
    graph.nodes.forEach(n => { parent[n.id] = n.id; rank[n.id] = 0; });

    const find = (x) => {
      if (parent[x] !== x) parent[x] = find(parent[x]);
      return parent[x];
    };
    const union = (x, y) => {
      const rx = find(x), ry = find(y);
      if (rx === ry) return false;
      if (rank[rx] < rank[ry]) parent[rx] = ry;
      else if (rank[rx] > rank[ry]) parent[ry] = rx;
      else { parent[ry] = rx; rank[rx]++; }
      return true;
    };

    const mst = [];
    const skipped = [];
    const steps = [];
    let currentSets = {};

    graph.nodes.forEach(n => { currentSets[n.id] = n.id; });
    steps.push({ type: "init", sets: { ...currentSets } });

    edges.forEach(edge => {
      const inSameSet = find(edge.from) === find(edge.to);
      if (!inSameSet) {
        union(edge.from, edge.to);
        mst.push(edge);
        graph.nodes.forEach(n => { currentSets[n.id] = find(n.id); });
        steps.push({ type: "add", edge, sets: { ...currentSets }, mst: [...mst] });
      } else {
        skipped.push(edge);
        steps.push({ type: "skip", edge, sets: { ...currentSets }, skipped: [...skipped] });
      }
    });

    steps.push({ type: "done", mst: [...mst] });
    animateSteps(steps);
  };

  const animateSteps = (steps) => {
    let i = 0;
    const animate = () => {
      if (i >= steps.length) {
        setIsAnimating(false); setIsMstDone(true);
        setMessage("Kruskal's algorithm complete! MST found.");
        return;
      }
      const s = steps[i];
      setStep(i);

      if (s.type === "init") {
        setSets(s.sets);
        setMessage("All edges sorted. Processing smallest to largest...");
      } else if (s.type === "add") {
        setMstEdges(s.mst);
        setSets(s.sets);
        setProcessedCount(i);
        const edgeKey = [s.edge.from, s.edge.to].sort().join("-");
        const ref = edgeRefs.current[edgeKey];
        if (ref) gsap.to(ref, { stroke: "#22C55E", strokeWidth: 4, duration: 0.4 });
        const fromRef = nodeRefs.current[s.edge.from];
        const toRef = nodeRefs.current[s.edge.to];
        if (fromRef) gsap.to(fromRef, { fill: "#3B82F6", stroke: "#1e40af", duration: 0.3 });
        if (toRef) gsap.to(toRef, { fill: "#3B82F6", stroke: "#1e40af", duration: 0.3 });
        setMessage(`Added edge ${s.edge.from}—${s.edge.to} (weight ${s.edge.weight})`);
      } else if (s.type === "skip") {
        setSkippedEdges(s.skipped);
        setProcessedCount(i);
        const edgeKey = [s.edge.from, s.edge.to].sort().join("-");
        const ref = edgeRefs.current[edgeKey];
        if (ref) gsap.to(ref, { stroke: "#EF4444", strokeWidth: 3, duration: 0.3 });
        setMessage(`Skipped edge ${s.edge.from}—${s.edge.to} (weight ${s.edge.weight}) — would create cycle`);
      } else if (s.type === "done") {
        setMessage("Minimum Spanning Tree complete!");
      }
      i++;
      animRef.current = setTimeout(animate, 1200);
    };
    animate();
  };

  if (!graph) return null;

  return (
    <main className="container mx-auto px-6 pb-4">
      <p className="text-lg text-center text-gray-600 dark:text-gray-400 mb-8">
        Visualize Kruskal's algorithm building a Minimum Spanning Tree by processing sorted edges.
      </p>

      <form onSubmit={handleGo} className="max-w-4xl mx-auto bg-white dark:bg-neutral-950 p-6 rounded-xl mb-8 border border-gray-200 dark:border-gray-700">
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 mb-2">Click Run to start Kruskal's algorithm</label>
          <div className="flex gap-2 w-full sm:max-w-xs">
            <GoButton onClick={handleGo} isAnimating={isAnimating} disabled={isAnimating} />
            <ResetButton onReset={handleReset} isAnimating={isAnimating} />
          </div>
        </div>
      </form>

      {message && (
        <div className={`max-w-3xl mx-auto mb-8 p-4 rounded-lg ${step >= 0 ? "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200" : "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"}`}>
          <p className="text-center font-medium">{message}</p>
        </div>
      )}

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">MST Visualization</h2>
          <svg width="500" height="360" viewBox="0 0 640 360" className="w-full">
            {graph.edges.map((edge, i) => {
              const from = graph.nodes.find(n => n.id === edge.from);
              const to = graph.nodes.find(n => n.id === edge.to);
              const edgeKey = [edge.from, edge.to].sort().join("-");
              const inMst = mstEdges.some(e => e.from === edge.from && e.to === edge.to);
              const isSkipped = skippedEdges.some(e => e.from === edge.from && e.to === edge.to);
              let strokeColor = "#94a3b8";
              if (inMst) strokeColor = "#22C55E";
              else if (isSkipped) strokeColor = "#EF4444";
              return (
                <g key={i}>
                  <line ref={el => { edgeRefs.current[edgeKey] = el; }}
                    x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                    stroke={strokeColor} strokeWidth={inMst ? 4 : isSkipped ? 3 : 2}
                    strokeDasharray={inMst || isSkipped ? "none" : "6,3"} />
                  <text x={(from.x + to.x) / 2} y={(from.y + to.y) / 2 - 10}
                    textAnchor="middle" className="text-sm fill-gray-500 dark:fill-gray-400 font-bold">
                    {edge.weight}
                  </text>
                </g>
              );
            })}
            {graph.nodes.map((node) => {
              const inMst = mstEdges.some(e => e.from === node.id) || mstEdges.some(e => e.to === node.id);
              return (
                <g key={node.id}>
                  <circle ref={el => { nodeRefs.current[node.id] = el; }}
                    cx={node.x} cy={node.y} r={24}
                    className={`transition-colors duration-300 ${inMst ? "fill-blue-500" : "fill-gray-300 dark:fill-gray-600"}`}
                    stroke={inMst ? "#1e40af" : "#D1D5DB"} strokeWidth={2} />
                  <text x={node.x} y={node.y} textAnchor="middle" dy="0.35em"
                    className="fill-white font-bold text-sm">{node.id}</text>
                </g>
              );
            })}
          </svg>
          <div className="mt-4 flex flex-wrap justify-center gap-4">
            <div className="flex items-center"><div className="w-4 h-4 bg-green-500 rounded mr-2"></div><span className="text-sm">Added to MST</span></div>
            <div className="flex items-center"><div className="w-4 h-4 bg-red-500 rounded mr-2"></div><span className="text-sm">Skipped (cycle)</span></div>
            <div className="flex items-center"><div className="w-4 h-4 bg-blue-500 rounded mr-2"></div><span className="text-sm">In MST</span></div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Sorted Edges</h3>
          <div className="space-y-1 max-h-48 overflow-y-auto">
            {sortedEdges.map((e, i) => {
              const isProcessed = i < processedCount;
              const inMst = mstEdges.some(me => me.from === e.from && me.to === e.to);
              const isSkipped = skippedEdges.some(se => se.from === e.from && se.to === e.to);
              let bgClass = "bg-gray-100 dark:bg-gray-700";
              if (inMst) bgClass = "bg-green-100 dark:bg-green-900";
              else if (isSkipped) bgClass = "bg-red-100 dark:bg-red-900";
              return (
                <div key={i} className={`flex justify-between items-center p-1.5 rounded text-sm ${bgClass}`}>
                  <span className="font-mono">{e.from}—{e.to}</span>
                  <span className="font-mono">{e.weight}</span>
                </div>
              );
            })}
          </div>
          <div className="mt-4">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">MST Edges</h4>
            {mstEdges.length === 0 && <p className="text-sm text-gray-500 dark:text-gray-400">No edges yet</p>}
            {mstEdges.map((e, i) => (
              <div key={i} className="flex justify-between text-sm py-1">
                <span>{e.from}—{e.to}</span><span className="font-mono">{e.weight}</span>
              </div>
            ))}
            {isMstDone && (
              <p className="mt-3 font-bold text-green-600 dark:text-green-400">
                Total weight: {mstEdges.reduce((sum, e) => sum + e.weight, 0)}
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default KruskalAnimation;
