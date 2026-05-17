"use client";
import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import ResetButton from "@/app/components/ui/resetButton";
import GoButton from "@/app/components/ui/goButton";

const BSTSearching = () => {
  const [inputValue, setInputValue] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [message, setMessage] = useState("");
  const [comparisons, setComparisons] = useState(0);
  const [speed] = useState(1);
  const svgRef = useRef(null);
  const nodeRefs = useRef({});
  const animationRef = useRef(null);
  const pathRefs = useRef([]);

  const NODE_RADIUS = 22;
  const LEVEL_HEIGHT = 70;

  const treeNodes = [
    { id: 1, value: 8, x: 400, y: 40, left: 2, right: 3, parent: null },
    { id: 2, value: 3, x: 200, y: 110, left: 4, right: 5, parent: 1 },
    { id: 3, value: 10, x: 600, y: 110, left: 6, right: 7, parent: 1 },
    { id: 4, value: 1, x: 100, y: 180, left: null, right: null, parent: 2 },
    { id: 5, value: 6, x: 300, y: 180, left: 8, right: 9, parent: 2 },
    { id: 6, value: 9, x: 520, y: 180, left: null, right: null, parent: 3 },
    { id: 7, value: 14, x: 680, y: 180, left: 10, right: null, parent: 3 },
    { id: 8, value: 4, x: 240, y: 250, left: null, right: null, parent: 5 },
    { id: 9, value: 7, x: 360, y: 250, left: null, right: null, parent: 5 },
    { id: 10, value: 13, x: 640, y: 250, left: null, right: null, parent: 7 },
  ];

  const edges = treeNodes.map(node => {
    if (node.left) {
      const child = treeNodes.find(n => n.id === node.left);
      return { from: node.id, to: node.left, x1: node.x, y1: node.y + NODE_RADIUS, x2: child.x, y2: child.y - NODE_RADIUS };
    }
    return null;
  }).filter(Boolean).concat(
    treeNodes.map(node => {
      if (node.right) {
        const child = treeNodes.find(n => n.id === node.right);
        return { from: node.id, to: node.right, x1: node.x, y1: node.y + NODE_RADIUS, x2: child.x, y2: child.y - NODE_RADIUS };
      }
      return null;
    }).filter(Boolean)
  );

  useEffect(() => {
    return () => {
      if (animationRef.current) clearTimeout(animationRef.current);
    };
  }, []);

  const resetAllNodes = () => {
    treeNodes.forEach((node) => {
      const el = nodeRefs.current[node.id];
      if (el) {
        gsap.to(el, {
          fill: "#3B82F6",
          stroke: "#2563EB",
          duration: 0.2,
        });
      }
    });
  };

  const handleSearch = (value) => {
    if (isNaN(value)) {
      setMessage("Please enter a valid number.");
      return;
    }

    setIsAnimating(true);
    setSearchResult(null);
    setComparisons(0);
    resetAllNodes();

    const val = parseInt(value);
    let comps = 0;

    const animateStep = (nodeId) => {
      if (!nodeId || !nodeRefs.current[nodeId]) {
        setMessage(`Value ${val} not found in the BST. Comparisons: ${comps}`);
        setSearchResult(false);
        setIsAnimating(false);
        return;
      }

      const node = treeNodes.find(n => n.id === nodeId);
      const el = nodeRefs.current[nodeId];
      comps++;

      gsap.to(el, {
        fill: "#F59E0B",
        stroke: "#D97706",
        duration: 0.3,
        onComplete: () => {
          if (node.value === val) {
            gsap.to(el, {
              fill: "#22C55E",
              stroke: "#15803D",
              duration: 0.3,
            });
            setMessage(`Found ${val}! Comparisons: ${comps}`);
            setSearchResult(true);
            setComparisons(comps);
            setIsAnimating(false);
          } else if (val < node.value) {
            gsap.to(el, {
              fill: "#EF4444",
              stroke: "#DC2626",
              duration: 0.2,
              onComplete: () => {
                setTimeout(() => animateStep(node.left), 300 / speed);
              },
            });
          } else {
            gsap.to(el, {
              fill: "#EF4444",
              stroke: "#DC2626",
              duration: 0.2,
              onComplete: () => {
                setTimeout(() => animateStep(node.right), 300 / speed);
              },
            });
          }
        },
      });
    };

    animateStep(1); // Start from root
  };

  const handleGo = (e) => {
    e.preventDefault();
    if (!inputValue) {
      setMessage("Please enter a value to search.");
      return;
    }
    handleSearch(inputValue);
  };

  const handleReset = () => {
    setInputValue("");
    setSearchResult(null);
    setMessage("");
    setComparisons(0);
    setIsAnimating(false);
    if (animationRef.current) {
      clearTimeout(animationRef.current);
      animationRef.current = null;
    }
    resetAllNodes();
  };

  return (
    <main className="container mx-auto px-6 pb-4">
      <p className="text-lg text-center text-gray-600 dark:text-gray-400 mb-8">
        Enter a value to search in the BST. The path from root to target will be highlighted.
      </p>

      <form onSubmit={handleGo} className="max-w-4xl mx-auto bg-white dark:bg-neutral-950 p-6 rounded-xl mb-8 border border-gray-200 dark:border-gray-700">
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="searchValue">Search Value</label>
          <div className="flex flex-col sm:flex-row sm:items-end gap-4">
            <input type="number" id="searchValue" value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full sm:max-w-xs p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-400 transition duration-300"
              placeholder="eg. 6" disabled={isAnimating} />
            <div className="flex gap-2 w-full">
              <GoButton onClick={handleGo} isAnimating={isAnimating} disabled={isAnimating} />
              <ResetButton onReset={handleReset} isAnimating={isAnimating} />
            </div>
          </div>
        </div>
      </form>

      {/* Message */}
      {message && (
        <div className={`max-w-4xl mx-auto mb-6 p-4 rounded-lg ${
          searchResult === true
            ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
            : searchResult === false
            ? "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
            : "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
        }`}>
          <p className="text-center font-medium">{message}</p>
        </div>
      )}

      {/* Tree Visualization */}
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">BST Search Visualization</h2>
        <svg ref={svgRef} viewBox="0 0 800 330" className="w-full h-auto">
          {edges.map((edge, i) => (
            <line key={i} x1={edge.x1} y1={edge.y1} x2={edge.x2} y2={edge.y2} stroke="#6B7280" strokeWidth="2" strokeDasharray="6,3" />
          ))}
          {treeNodes.map((node) => (
            <g key={node.id} ref={(el) => (nodeRefs.current[node.id] = el)}>
              <circle cx={node.x} cy={node.y} r={NODE_RADIUS} fill="#3B82F6" stroke="#2563EB" strokeWidth="2.5" />
              <text x={node.x} y={node.y + 1} textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">{node.value}</text>
            </g>
          ))}
        </svg>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-6 mt-4">
          <div className="flex items-center"><div className="w-4 h-4 bg-blue-500 rounded mr-2"></div><span className="text-sm text-gray-600 dark:text-gray-400">Unvisited</span></div>
          <div className="flex items-center"><div className="w-4 h-4 bg-yellow-500 rounded mr-2"></div><span className="text-sm text-gray-600 dark:text-gray-400">Checking</span></div>
          <div className="flex items-center"><div className="w-4 h-4 bg-green-500 rounded mr-2"></div><span className="text-sm text-gray-600 dark:text-gray-400">Found</span></div>
          <div className="flex items-center"><div className="w-4 h-4 bg-red-500 rounded mr-2"></div><span className="text-sm text-gray-600 dark:text-gray-400">Not Match</span></div>
        </div>

        {comparisons > 0 && (
          <div className="mt-4 text-center">
            <span className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-full text-sm font-mono text-gray-700 dark:text-gray-300">
              Comparisons made: {comparisons}
            </span>
          </div>
        )}
      </div>
    </main>
  );
};

export default BSTSearching;
