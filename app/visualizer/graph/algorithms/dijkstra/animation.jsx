"use client";
import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import ResetButton from "@/app/components/ui/resetButton";
import GoButton from "@/app/components/ui/goButton";

const DijkstraAnimation = () => {
  const [graph, setGraph] = useState(null);
  const [source, setSource] = useState("");
  const [step, setStep] = useState(-1);
  const [distances, setDistances] = useState({});
  const [settled, setSettled] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [message, setMessage] = useState("");
  const [pq, setPq] = useState([]);
  const [edgeHighlights, setEdgeHighlights] = useState([]);
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
    setDistances({});
    setSettled([]);
    setMessage("");
    setIsAnimating(false);
    setPq([]);
    setEdgeHighlights([]);
    setSource("");
    if (animRef.current) {
      clearTimeout(animRef.current);
      animRef.current = null;
    }
    Object.values(nodeRefs.current).forEach((ref) => {
      if (ref) gsap.to(ref, { backgroundColor: "#E5E7EB", borderColor: "#D1D5DB", duration: 0 });
    });
    Object.values(edgeRefs.current).forEach((ref) => {
      if (ref) gsap.to(ref, { stroke: "#94a3b8", strokeWidth: 2, duration: 0 });
    });
  };

  const handleGo = (e) => {
    e.preventDefault();
    if (!source || !graph) {
      setMessage("Please select a source node.");
      return;
    }
    const src = source.toUpperCase();
    if (!graph.nodes.find(n => n.id === src)) {
      setMessage("Invalid source node. Choose from A-E.");
      return;
    }
    handleReset();
    setSource(src);
    setIsAnimating(true);
    runDijkstra(src);
  };

  const runDijkstra = (src) => {
    const nodes = graph.nodes.map(n => n.id);
    const dist = {};
    const prev = {};
    const unvisited = [];
    const settledList = [];
    const pqSteps = [];

    nodes.forEach(n => {
      dist[n] = Infinity;
      prev[n] = null;
    });
    dist[src] = 0;
    unvisited.push({ id: src, dist: 0 });

    while (unvisited.length > 0) {
      unvisited.sort((a, b) => a.dist - b.dist);
      const u = unvisited.shift();
      if (settledList.includes(u.id)) continue;
      settledList.push(u.id);
      pqSteps.push({ type: "extract", node: u.id, dist: dist[u.id], pq: [...unvisited], settled: [...settledList] });

      graph.edges.forEach(edge => {
        if (edge.from === u.id && !settledList.includes(edge.to)) {
          const alt = dist[u.id] + edge.weight;
          if (alt < dist[edge.to]) {
            dist[edge.to] = alt;
            prev[edge.to] = u.id;
            unvisited.push({ id: edge.to, dist: alt });
            pqSteps.push({ type: "relax", from: u.id, to: edge.to, weight: edge.weight, newDist: alt, dist: { ...dist }, settled: [...settledList] });
          }
        }
        if (edge.to === u.id && !settledList.includes(edge.from)) {
          const alt = dist[u.id] + edge.weight;
          if (alt < dist[edge.from]) {
            dist[edge.from] = alt;
            prev[edge.from] = u.id;
            unvisited.push({ id: edge.from, dist: alt });
            pqSteps.push({ type: "relax", from: u.id, to: edge.from, weight: edge.weight, newDist: alt, dist: { ...dist }, settled: [...settledList] });
          }
        }
      });
    }
    pqSteps.push({ type: "done", dist: { ...dist }, settled: [...settledList] });
    animateSteps(pqSteps, dist);
  };

  const animateSteps = (steps, finalDist) => {
    let i = 0;
    const animate = () => {
      if (i >= steps.length) {
        setIsAnimating(false);
        setDistances(finalDist);
        setMessage("Dijkstra's algorithm complete! Shortest distances found.");
        return;
      }
      const s = steps[i];
      setStep(i);
      setPq(s.pq || []);

      if (s.type === "extract") {
        const ref = nodeRefs.current[s.node];
        if (ref) gsap.to(ref, { backgroundColor: "#22C55E", borderColor: "#15803D", duration: 0.4, scale: 1.1 });
        setSettled([...s.settled]);
        setMessage(`Extracted vertex ${s.node} with distance ${s.dist}`);
      } else if (s.type === "relax") {
        const edgeKey = [s.from, s.to].sort().join("-");
        const ref = edgeRefs.current[edgeKey];
        if (ref) gsap.to(ref, { stroke: "#f59e0b", strokeWidth: 4, duration: 0.3 });
        setEdgeHighlights(prev => [...prev, edgeKey]);
        setMessage(`Relaxing edge ${s.from}→${s.to} (weight ${s.weight}), updated ${s.to} to ${s.newDist}`);
      } else if (s.type === "done") {
        setMessage("All vertices settled. Shortest distances computed!");
        setDistances(s.dist);
      }
      setDistances(s.dist || {});
      i++;
      animRef.current = setTimeout(animate, 1500);
    };
    animate();
  };

  if (!graph) return null;

  return (
    <main className="container mx-auto px-6 pb-4">
      <p className="text-lg text-center text-gray-600 dark:text-gray-400 mb-8">
        Visualize Dijkstra's algorithm finding the shortest path from a source node.
      </p>

      <form onSubmit={handleGo} className="max-w-4xl mx-auto bg-white dark:bg-neutral-950 p-6 rounded-xl mb-8 border border-gray-200 dark:border-gray-700">
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="source">Source Node (A-E)</label>
          <div className="flex flex-col sm:flex-row sm:items-end gap-4">
            <input type="text" id="source" value={source} onChange={(e) => setSource(e.target.value.toUpperCase())}
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
        <div className={`max-w-3xl mx-auto mb-8 p-4 rounded-lg ${step >= 0 && step !== -1 ? "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200" : "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"}`}>
          <p className="text-center font-medium">{message}</p>
        </div>
      )}

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Graph Visualization</h2>
          <svg width="500" height="360" viewBox="0 0 640 360" className="w-full">
            {graph.edges.map((edge, i) => {
              const from = graph.nodes.find(n => n.id === edge.from);
              const to = graph.nodes.find(n => n.id === edge.to);
              const edgeKey = [edge.from, edge.to].sort().join("-");
              const isHighlighted = edgeHighlights.includes(edgeKey);
              return (
                <g key={i}>
                  <line ref={el => { edgeRefs.current[edgeKey] = el; }}
                    x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                    stroke={isHighlighted ? "#f59e0b" : "#94a3b8"}
                    strokeWidth={isHighlighted ? 4 : 2}
                    className="transition-colors duration-300" />
                  <text x={(from.x + to.x) / 2} y={(from.y + to.y) / 2 - 10}
                    textAnchor="middle" className="text-sm fill-gray-500 dark:fill-gray-400 font-bold">
                    {edge.weight}
                  </text>
                </g>
              );
            })}
            {graph.nodes.map((node) => {
              const d = distances[node.id];
              const isSettled = settled.includes(node.id);
              const isSrc = source === node.id;
              return (
                <g key={node.id}>
                  <circle ref={el => { nodeRefs.current[node.id] = el; }}
                    cx={node.x} cy={node.y} r={24}
                    className={`transition-colors duration-300 ${isSettled ? "fill-green-500" : isSrc ? "fill-blue-500" : "fill-gray-300 dark:fill-gray-600"}`}
                    stroke={isSettled ? "#15803D" : isSrc ? "#1e40af" : "#D1D5DB"}
                    strokeWidth={2} />
                  <text x={node.x} y={node.y} textAnchor="middle" dy="0.35em"
                    className="fill-white font-bold text-sm">{node.id}</text>
                  {d !== undefined && d !== Infinity && (
                    <text x={node.x} y={node.y + 38} textAnchor="middle"
                      className="fill-gray-700 dark:fill-gray-300 text-xs font-mono">
                      d={d}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
          <div className="mt-4 flex flex-wrap justify-center gap-4">
            <div className="flex items-center"><div className="w-4 h-4 bg-green-500 rounded mr-2"></div><span className="text-sm">Settled</span></div>
            <div className="flex items-center"><div className="w-4 h-4 bg-blue-500 rounded mr-2"></div><span className="text-sm">Source</span></div>
            <div className="flex items-center"><div className="w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded mr-2"></div><span className="text-sm">Unvisited</span></div>
            <div className="flex items-center"><div className="w-4 h-4 bg-yellow-500 rounded mr-2"></div><span className="text-sm">Relaxing Edge</span></div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Priority Queue</h3>
          <div className="space-y-2">
            {pq.length === 0 && <p className="text-sm text-gray-500 dark:text-gray-400">Queue empty</p>}
            {pq.map((item, i) => (
              <div key={i} className="flex justify-between items-center p-2 bg-gray-100 dark:bg-gray-700 rounded">
                <span className="font-mono font-bold">{item.id}</span>
                <span className="font-mono text-sm text-gray-600 dark:text-gray-300">d={item.dist}</span>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Distances</h4>
            {graph.nodes.map(n => (
              <div key={n.id} className="flex justify-between text-sm py-1">
                <span>{n.id}</span>
                <span className="font-mono">{distances[n.id] === undefined || distances[n.id] === Infinity ? "∞" : distances[n.id]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default DijkstraAnimation;
