"use client";
import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import ResetButton from "@/app/components/ui/resetButton";
import GoButton from "@/app/components/ui/goButton";

const AdjListAnimation = () => {
  const [numVertices, setNumVertices] = useState(4);
  const [edges, setEdges] = useState([]);
  const [adjList, setAdjList] = useState({});
  const [isAnimating, setIsAnimating] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedNode, setSelectedNode] = useState(null);
  const listRefs = useRef({});
  const edgeInputRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    initGraph(4);
    return () => {
      if (animationRef.current) clearTimeout(animationRef.current);
    };
  }, []);

  const initGraph = (n) => {
    const list = {};
    for (let i = 0; i < n; i++) list[i] = [];
    setAdjList(list);
    setEdges([]);
    setSelectedNode(null);
    setMessage(`Graph with ${n} vertices initialized`);
    listRefs.current = {};
  };

  const handleVerticesChange = (e) => {
    const val = parseInt(e.target.value);
    if (val >= 2 && val <= 6) {
      setNumVertices(val);
      initGraph(val);
    }
  };

  const handleAddEdge = () => {
    if (isAnimating) return;
    const input = edgeInputRef.current?.value || "";
    const match = input.match(/(\d+)\s*,\s*(\d+)/);
    if (!match) {
      setMessage("Enter edge as: u, v (e.g., 0, 1)");
      return;
    }
    const u = parseInt(match[1]);
    const v = parseInt(match[2]);
    if (u >= numVertices || v >= numVertices) {
      setMessage(`Vertices must be between 0 and ${numVertices - 1}`);
      return;
    }
    if (edges.some((e) => e[0] === u && e[1] === v)) {
      setMessage(`Edge (${u}, ${v}) already exists`);
      return;
    }

    const newEdges = [...edges, [u, v]];
    setEdges(newEdges);

    const newList = { ...adjList };
    newList[u] = [...newList[u], v];
    newList[v] = [...newList[v], u];
    setAdjList(newList);

    setMessage(`Edge (${u}, ${v}) added`);

    setSelectedNode(u);
    animateListUpdate(u, newList[u]);
    animateListUpdate(v, newList[v]);

    edgeInputRef.current.value = "";
  };

  const animateListUpdate = (node, list) => {
    const ref = listRefs.current[node];
    if (ref) {
      gsap.fromTo(ref, { scale: 1.05 }, { scale: 1, duration: 0.3 });
    }
  };

  const handleNodeClick = (node) => {
    if (isAnimating) return;
    setSelectedNode(node);
    setMessage(`Neighbors of ${node}: [${adjList[node].join(", ")}]`);

    const ref = listRefs.current[node];
    if (ref) {
      gsap.to(ref, { backgroundColor: "#3B82F6", duration: 0.3 });
      gsap.to(ref, {
        backgroundColor: "#1F2937",
        duration: 0.3,
        delay: 1,
      });
    }
  };

  const handleReset = () => {
    setIsAnimating(false);
    setMessage("");
    setSelectedNode(null);
    if (animationRef.current) {
      clearTimeout(animationRef.current);
      animationRef.current = null;
    }
    initGraph(numVertices);
  };

  const handleGo = (e) => {
    e.preventDefault();
    if (isAnimating) return;
    if (edges.length === 0) {
      setMessage("Please add some edges first (e.g., 0, 1)");
      return;
    }

    setIsAnimating(true);
    setMessage("Animating adjacency list...");

    let delay = 0;
    for (let i = 0; i < numVertices; i++) {
      const nodeDelay = delay;
      const ref = listRefs.current[i];
      if (ref) {
        animationRef.current = setTimeout(() => {
          gsap.to(ref, {
            backgroundColor: "#3B82F6",
            scale: 1.05,
            duration: 0.4,
            onComplete: () => {
              gsap.to(ref, {
                backgroundColor: "#1F2937",
                scale: 1,
                duration: 0.3,
              });
            },
          });
        }, nodeDelay);
      }
      delay += 300;
    }

    animationRef.current = setTimeout(() => {
      setIsAnimating(false);
      setMessage(
        `Adjacency list visualization complete. ${edges.length} edge(s) in the graph.`
      );
    }, delay + 500);
  };

  return (
    <main className="container mx-auto px-6 pb-4">
      <p className="text-lg text-center text-gray-600 dark:text-gray-400 mb-8">
        Click a node to see its adjacency list highlighted. Add edges using the input below.
      </p>

      <form
        onSubmit={handleGo}
        className="max-w-4xl mx-auto bg-white dark:bg-neutral-950 p-6 rounded-xl mb-8 border border-gray-200 dark:border-gray-700"
      >
        <div className="flex flex-wrap gap-4 items-end mb-4">
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="numVertices">
              Number of Vertices
            </label>
            <input
              type="number"
              id="numVertices"
              value={numVertices}
              onChange={handleVerticesChange}
              min={2}
              max={6}
              className="w-32 p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition duration-300"
              disabled={isAnimating}
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="edgeInput">
              Add Edge (u, v)
            </label>
            <div className="flex gap-2">
              <input
                ref={edgeInputRef}
                type="text"
                id="edgeInput"
                className="w-40 p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition duration-300"
                placeholder="0, 1"
                disabled={isAnimating}
              />
              <button
                type="button"
                onClick={handleAddEdge}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
                disabled={isAnimating}
              >
                Add
              </button>
            </div>
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

      {Object.keys(adjList).length > 0 && (
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 text-center">
            Adjacency List
          </h2>

          <div className="space-y-3">
            {Array.from({ length: numVertices }, (_, i) => (
              <div
                key={i}
                ref={(el) => (listRefs.current[i] = el)}
                onClick={() => handleNodeClick(i)}
                className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedNode === i
                    ? "bg-blue-50 dark:bg-blue-900/20 border-blue-400"
                    : "bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <span className="font-bold text-blue-600 dark:text-blue-400 min-w-[60px]">
                  Node {i}:
                </span>
                <span className="text-gray-700 dark:text-gray-300">
                  [{adjList[i].join(", ")}]
                  {adjList[i].length === 0 && (
                    <span className="italic text-gray-400 dark:text-gray-500"> empty</span>
                  )}
                </span>
                <span className="ml-auto text-xs text-gray-400 dark:text-gray-500">
                  degree: {adjList[i].length}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-blue-500 rounded mr-2"></div>
              <span className="text-sm text-gray-700 dark:text-gray-300">Selected / Highlighted</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded mr-2"></div>
              <span className="text-sm text-gray-700 dark:text-gray-300">Unselected</span>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default AdjListAnimation;
