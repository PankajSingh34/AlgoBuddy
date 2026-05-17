"use client";
import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import ResetButton from "@/app/components/ui/resetButton";
import GoButton from "@/app/components/ui/goButton";

const BfsAnimation = () => {
  const [numVertices] = useState(6);
  const [edges, setEdges] = useState([
    [0, 1], [0, 2], [1, 3], [1, 4], [2, 5], [3, 5],
  ]);
  const [startNode, setStartNode] = useState(0);
  const [adjList, setAdjList] = useState({});
  const [queue, setQueue] = useState([]);
  const [visited, setVisited] = useState([]);
  const [traversalOrder, setTraversalOrder] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [message, setMessage] = useState("");
  const [currentNode, setCurrentNode] = useState(null);
  const nodeRefs = useRef({});
  const queueRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    buildAdjList();
    return () => {
      if (animationRef.current) clearTimeout(animationRef.current);
    };
  }, [edges, numVertices]);

  const buildAdjList = () => {
    const list = {};
    for (let i = 0; i < numVertices; i++) list[i] = [];
    edges.forEach(([u, v]) => {
      list[u].push(v);
      list[v].push(u);
    });
    setAdjList(list);
  };

  const handleReset = () => {
    setIsAnimating(false);
    setQueue([]);
    setVisited([]);
    setTraversalOrder([]);
    setMessage("");
    setCurrentNode(null);
    if (animationRef.current) {
      clearTimeout(animationRef.current);
      animationRef.current = null;
    }
    Object.keys(nodeRefs.current).forEach((key) => {
      gsap.to(nodeRefs.current[key], {
        backgroundColor: "#3B82F6",
        borderColor: "#2563EB",
        scale: 1,
        duration: 0.2,
      });
    });
  };

  const handleGo = (e) => {
    e.preventDefault();
    if (isAnimating) return;
    handleReset();

    setIsAnimating(true);
    const q = [startNode];
    const vis = new Set([startNode]);
    const order = [startNode];
    setQueue([...q]);
    setVisited([...vis]);
    setTraversalOrder([...order]);
    setCurrentNode(startNode);
    setMessage(`Starting BFS from node ${startNode}`);

    animateNode(startNode, "#EAB308");
    animateBFS(q, vis, order);
  };

  const animateBFS = (q, vis, order) => {
    let delay = 800;

    const step = () => {
      if (q.length === 0) {
        setIsAnimating(false);
        setCurrentNode(null);
        setMessage(`BFS complete! Traversal order: [${order.join(" → ")}]`);
        return;
      }

      const u = q.shift();
      setCurrentNode(u);
      setQueue([...q]);
      setMessage(`Dequeued node ${u}. Processing neighbors...`);

      animateNode(u, "#22C55E");

      adjList[u].forEach((v) => {
        if (!vis.has(v)) {
          vis.add(v);
          q.push(v);
          order.push(v);
          setQueue([...q]);
          setVisited(new Set(vis));
          setTraversalOrder([...order]);

          const nodeDelay = delay + 300;
          animationRef.current = setTimeout(() => {
            animateNode(v, "#EAB308");
            setMessage(`Visited node ${v} from ${u}. Queue: [${q.join(", ")}]`);
          }, nodeDelay);
          delay = nodeDelay + 400;
        }
      });

      animationRef.current = setTimeout(() => {
        animateNode(u, "#3B82F6");
        step();
      }, delay);
      delay += 600;
    };

    step();
  };

  const animateNode = (node, color) => {
    const ref = nodeRefs.current[node];
    if (ref) {
      gsap.to(ref, {
        backgroundColor: color,
        borderColor: color,
        scale: 1.15,
        duration: 0.3,
        yoyo: true,
        repeat: 1,
      });
    }
  };

  const graphPositions = [
    { x: 250, y: 40 },
    { x: 100, y: 150 },
    { x: 400, y: 150 },
    { x: 50, y: 300 },
    { x: 200, y: 300 },
    { x: 400, y: 300 },
  ];

  return (
    <main className="container mx-auto px-6 pb-4">
      <p className="text-lg text-center text-gray-600 dark:text-gray-400 mb-8">
        Watch BFS traverse the graph level by level. The queue fills with neighbors as nodes are discovered.
      </p>

      <form
        onSubmit={handleGo}
        className="max-w-4xl mx-auto bg-white dark:bg-neutral-950 p-6 rounded-xl mb-8 border border-gray-200 dark:border-gray-700"
      >
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="startNode">
              Start Node
            </label>
            <input
              type="number"
              id="startNode"
              value={startNode}
              onChange={(e) => setStartNode(Math.min(Math.max(parseInt(e.target.value) || 0, 0), numVertices - 1))}
              min={0}
              max={numVertices - 1}
              className="w-32 p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition duration-300"
              disabled={isAnimating}
            />
          </div>
          <div className="flex gap-2">
            <GoButton onClick={handleGo} isAnimating={isAnimating} disabled={isAnimating} />
            <ResetButton onReset={handleReset} isAnimating={isAnimating} />
          </div>
        </div>
      </form>

      {message && (
        <div className="max-w-3xl mx-auto mb-8 p-4 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
          <p className="text-center font-medium">{message}</p>
        </div>
      )}

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Graph Visualization */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 text-center">
            Graph
          </h2>
          <svg viewBox="0 0 500 380" className="w-full h-auto">
            {/* Edges */}
            {edges.map(([u, v], i) => (
              <line
                key={i}
                x1={graphPositions[u].x}
                y1={graphPositions[u].y}
                x2={graphPositions[v].x}
                y2={graphPositions[v].y}
                stroke="#4B5563"
                strokeWidth="2"
                className="dark:stroke-gray-500"
              />
            ))}
            {/* Nodes */}
            {Array.from({ length: numVertices }, (_, i) => (
              <g key={i}>
                <circle
                  ref={(el) => (nodeRefs.current[i] = el)}
                  cx={graphPositions[i].x}
                  cy={graphPositions[i].y}
                  r="24"
                  fill="#3B82F6"
                  stroke="#2563EB"
                  strokeWidth="2"
                  className="transition-colors"
                />
                <text
                  x={graphPositions[i].x}
                  y={graphPositions[i].y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="white"
                  fontSize="16"
                  fontWeight="bold"
                >
                  {i}
                </text>
              </g>
            ))}
          </svg>

          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {Array.from({ length: numVertices }, (_, i) => (
              <span
                key={i}
                className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  traversalOrder.includes(i)
                    ? visited.has(i)
                      ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-500"
                    : "bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-400"
                }`}
              >
                {i}
              </span>
            ))}
          </div>

          {traversalOrder.length > 0 && (
            <p className="text-center mt-3 text-sm text-gray-600 dark:text-gray-400">
              Traversal Order: {traversalOrder.join(" → ")}
            </p>
          )}
        </div>

        {/* Queue Visualization */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 text-center">
            Queue
          </h2>
          <div
            ref={queueRef}
            className="flex flex-col-reverse gap-2 min-h-[200px]"
          >
            {queue.length === 0 && !isAnimating && (
              <p className="text-gray-400 dark:text-gray-500 text-center italic mt-8">
                Queue is empty
              </p>
            )}
            {queue.map((node, i) => (
              <div
                key={`${node}-${i}`}
                className="bg-yellow-500 text-white font-bold p-3 rounded-lg text-center text-lg animate-pulse"
              >
                {node}
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-4 text-xs">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded mr-1"></div>
              <span>Processed</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-yellow-500 rounded mr-1"></div>
              <span>In Queue</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded mr-1"></div>
              <span>Unvisited</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default BfsAnimation;
