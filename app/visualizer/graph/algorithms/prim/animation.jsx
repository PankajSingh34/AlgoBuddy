"use client";
import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import ResetButton from "@/app/components/ui/resetButton";
import GoButton from "@/app/components/ui/goButton";

const PrimAnimation = () => {
  const [graph, setGraph] = useState(null);
  const [startNode, setStartNode] = useState("");
  const [step, setStep] = useState(-1);
  const [visited, setVisited] = useState([]);
  const [mstEdges, setMstEdges] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [message, setMessage] = useState("");
  const [candidates, setCandidates] = useState([]);
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
    return () => {
      if (animRef.current) clearTimeout(animRef.current);
    };
  }, []);

  const handleReset = () => {
    setStep(-1);
    setVisited([]);
    setMstEdges([]);
    setMessage("");
    setIsAnimating(false);
    setCandidates([]);
    setIsMstDone(false);
    setStartNode("");
    if (animRef.current) { clearTimeout(animRef.current); animRef.current = null; }
    Object.values(nodeRefs.current).forEach(ref => { if (ref) gsap.to(ref, { fill: "#9CA3AF", stroke: "#D1D5DB", duration: 0 }); });
    Object.values(edgeRefs.current).forEach(ref => { if (ref) gsap.to(ref, { stroke: "#94a3b8", strokeWidth: 2, duration: 0 }); });
  };

  const handleGo = (e) => {
    e.preventDefault();
    if (!startNode || !graph) { setMessage("Please enter a start node."); return; }
    const src = startNode.toUpperCase();
    if (!graph.nodes.find(n => n.id === src)) { setMessage("Invalid start node. Choose from A-E."); return; }
    handleReset();
    setStartNode(src);
    setIsAnimating(true);
    runPrim(src);
  };

  const runPrim = (src) => {
    const visitedList = [];
    const mstEdgeList = [];
    const steps = [];

    visitedList.push(src);
    steps.push({ type: "start", node: src, visited: [...visitedList], mst: [] });

    while (visitedList.length < graph.nodes.length) {
      let minEdge = null;
      let minWeight = Infinity;
      const candidatesList = [];

      graph.edges.forEach(edge => {
        const inVisited = visitedList.includes(edge.from);
        const outVisited = visitedList.includes(edge.to);
        if (inVisited && !outVisited) {
          candidatesList.push({ from: edge.from, to: edge.to, weight: edge.weight });
          if (edge.weight < minWeight) { minWeight = edge.weight; minEdge = edge; }
        }
        if (!inVisited && outVisited) {
          candidatesList.push({ from: edge.from, to: edge.to, weight: edge.weight });
          if (edge.weight < minWeight) { minWeight = edge.weight; minEdge = edge; }
        }
      });

      if (!minEdge) break;

      const newVertex = visitedList.includes(minEdge.from) ? minEdge.to : minEdge.from;
      mstEdgeList.push(minEdge);
      visitedList.push(newVertex);

      steps.push({
        type: "add",
        edge: minEdge,
        vertex: newVertex,
        candidates: candidatesList,
        visited: [...visitedList],
        mst: [...mstEdgeList]
      });
    }

    steps.push({ type: "done", visited: [...visitedList], mst: [...mstEdgeList] });
    animateSteps(steps);
  };

  const animateSteps = (steps) => {
    let i = 0;
    const animate = () => {
      if (i >= steps.length) {
        setIsAnimating(false);
        setIsMstDone(true);
        setMessage("MST complete! Total edges: " + mstEdges.length);
        return;
      }
      const s = steps[i];
      setStep(i);
      setVisited(s.visited);
      setMstEdges(s.mst);

      if (s.type === "start") {
        const ref = nodeRefs.current[s.node];
        if (ref) gsap.to(ref, { fill: "#3B82F6", stroke: "#1e40af", duration: 0.4, scale: 1.1 });
        setMessage(`Starting from vertex ${s.node}`);
      } else if (s.type === "add") {
        setCandidates(s.candidates);
        const edgeKey = [s.edge.from, s.edge.to].sort().join("-");
        const edgeRef = edgeRefs.current[edgeKey];
        if (edgeRef) gsap.to(edgeRef, { stroke: "#22C55E", strokeWidth: 4, duration: 0.4 });
        const nodeRef = nodeRefs.current[s.vertex];
        if (nodeRef) gsap.to(nodeRef, { fill: "#3B82F6", stroke: "#1e40af", duration: 0.4, scale: 1.1 });
        setMessage(`Added edge ${s.edge.from}—${s.edge.to} (weight ${s.edge.weight}), vertex ${s.vertex} joined MST`);
      } else if (s.type === "done") {
        setMessage("Minimum Spanning Tree complete!");
      }
      i++;
      animRef.current = setTimeout(animate, 1500);
    };
    animate();
  };

  if (!graph) return null;

  return (
    <main className="container mx-auto px-6 pb-4">
      <p className="text-lg text-center text-gray-600 dark:text-gray-400 mb-8">
        Visualize Prim's algorithm building a Minimum Spanning Tree.
      </p>

      <form onSubmit={handleGo} className="max-w-4xl mx-auto bg-white dark:bg-neutral-950 p-6 rounded-xl mb-8 border border-gray-200 dark:border-gray-700">
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="startNode">Start Node (A-E)</label>
          <div className="flex flex-col sm:flex-row sm:items-end gap-4">
            <input type="text" id="startNode" value={startNode} onChange={(e) => setStartNode(e.target.value.toUpperCase())}
              className="w-full sm:max-w-xs p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-400 transition duration-300"
              placeholder="eg. A" disabled={isAnimating} />
            <div className="flex gap-2 w-full">
              <GoButton onClick={handleGo} isAnimating={isAnimating} disabled={isAnimating} />
              <ResetButton onReset={handleReset} isAnimating={isAnimating} />
            </div>
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
              return (
                <g key={i}>
                  <line ref={el => { edgeRefs.current[edgeKey] = el; }}
                    x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                    stroke={inMst ? "#22C55E" : "#94a3b8"}
                    strokeWidth={inMst ? 4 : 2} strokeDasharray={inMst ? "none" : "6,3"} />
                  <text x={(from.x + to.x) / 2} y={(from.y + to.y) / 2 - 10}
                    textAnchor="middle" className="text-sm fill-gray-500 dark:fill-gray-400 font-bold">
                    {edge.weight}
                  </text>
                </g>
              );
            })}
            {graph.nodes.map((node) => {
              const isVisited = visited.includes(node.id);
              return (
                <g key={node.id}>
                  <circle ref={el => { nodeRefs.current[node.id] = el; }}
                    cx={node.x} cy={node.y} r={24}
                    className={`transition-colors duration-300 ${isVisited ? "fill-blue-500" : "fill-gray-300 dark:fill-gray-600"}`}
                    stroke={isVisited ? "#1e40af" : "#D1D5DB"} strokeWidth={2} />
                  <text x={node.x} y={node.y} textAnchor="middle" dy="0.35em"
                    className="fill-white font-bold text-sm">{node.id}</text>
                </g>
              );
            })}
          </svg>
          <div className="mt-4 flex flex-wrap justify-center gap-4">
            <div className="flex items-center"><div className="w-4 h-4 bg-blue-500 rounded mr-2"></div><span className="text-sm">In MST</span></div>
            <div className="flex items-center"><div className="w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded mr-2"></div><span className="text-sm">Unvisited</span></div>
            <div className="flex items-center"><div className="w-4 h-4 bg-green-500 rounded mr-2"></div><span className="text-sm">MST Edge</span></div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Edge Candidates</h3>
          <div className="space-y-2">
            {candidates.length === 0 && <p className="text-sm text-gray-500 dark:text-gray-400">No candidates yet</p>}
            {candidates.map((c, i) => (
              <div key={i} className="flex justify-between items-center p-2 bg-gray-100 dark:bg-gray-700 rounded">
                <span className="font-mono text-sm">{c.from}—{c.to}</span>
                <span className="font-mono text-sm text-gray-600 dark:text-gray-300">{c.weight}</span>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">MST Edges</h4>
            {mstEdges.length === 0 && <p className="text-sm text-gray-500 dark:text-gray-400">No edges yet</p>}
            {mstEdges.map((e, i) => (
              <div key={i} className="flex justify-between text-sm py-1">
                <span>{e.from}—{e.to}</span>
                <span className="font-mono">{e.weight}</span>
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

export default PrimAnimation;
