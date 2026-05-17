"use client";
import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import ResetButton from "@/app/components/ui/resetButton";
import GoButton from "@/app/components/ui/goButton";

const BSTInsertion = () => {
  const [inputValue, setInputValue] = useState("");
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [insertSequence, setInsertSequence] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [message, setMessage] = useState("");
  const [speed] = useState(1);
  const svgRef = useRef(null);
  const nodeRefs = useRef({});
  const animationRef = useRef(null);

  const NODE_RADIUS = 22;
  const LEVEL_HEIGHT = 70;
  const MIN_GAP = 50;

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    };
  }, []);

  const calculatePositions = (nodeList) => {
    if (nodeList.length === 0) return { nodes: [], edges: [] };

    const positioned = JSON.parse(JSON.stringify(nodeList));
    const nodeMap = {};
    positioned.forEach(n => nodeMap[n.id] = n);

    // Calculate subtree widths
    function getWidth(nodeId) {
      const node = nodeMap[nodeId];
      if (!node) return 0;
      let w = 1;
      if (node.left) w += getWidth(node.left);
      if (node.right) w += getWidth(node.right);
      return w;
    }

    // Position nodes recursively
    function positionNode(nodeId, x, y, availableWidth) {
      const node = nodeMap[nodeId];
      if (!node) return;

      node.x = x;
      node.y = y;

      const leftWidth = node.left ? getWidth(node.left) : 0;
      const rightWidth = node.right ? getWidth(node.right) : 0;
      const totalWidth = leftWidth + rightWidth;
      const childSpacing = Math.max(MIN_GAP, availableWidth / (totalWidth || 1));

      if (node.left) {
        const leftSpace = childSpacing * leftWidth;
        positionNode(node.left, x - leftSpace / 2, y + LEVEL_HEIGHT, leftSpace);
      }
      if (node.right) {
        const rightSpace = childSpacing * rightWidth;
        positionNode(node.right, x + rightSpace / 2, y + LEVEL_HEIGHT, rightSpace);
      }
    }

    const root = positioned.find(n => n.parent === null);
    if (root) {
      const totalWidth = getWidth(root.id);
      positionNode(root.id, 400, 40, Math.max(300, totalWidth * MIN_GAP));
      // Center the root
      const minX = Math.min(...positioned.map(n => n.x));
      const maxX = Math.max(...positioned.map(n => n.x));
      const shift = 400 - (minX + maxX) / 2;
      positioned.forEach(n => n.x += shift);
    }

    const edgeList = [];
    positioned.forEach(n => {
      if (n.parent !== null) {
        const parent = positioned.find(p => p.id === n.parent);
        if (parent) {
          edgeList.push({ from: n.parent, to: n.id });
        }
      }
    });

    return { nodes: positioned, edges: edgeList };
  };

  const insertNode = (value) => {
    if (isNaN(value)) {
      setMessage("Please enter a valid number.");
      return;
    }

    const newId = Date.now();
    const newNode = { id: newId, value: parseInt(value), left: null, right: null, parent: null };

    if (nodes.length === 0) {
      // First node becomes root
      const updatedNodes = [newNode];
      updateTree(updatedNodes, `Inserted ${value} as root.`);
      return;
    }

    // Find insertion position
    let current = nodes[0];
    let path = [];
    while (current) {
      path.push(current.id);
      if (parseInt(value) < current.value) {
        if (current.left === null) {
          newNode.parent = current.id;
          current.left = newNode.id;
          const updatedNodes = [...nodes, newNode];
          updateTree(updatedNodes, `Inserted ${value} as left child of ${current.value}.`);
          animateNodeDrop(newNode.id, path);
          return;
        }
        current = nodes.find(n => n.id === current.left);
      } else {
        if (current.right === null) {
          newNode.parent = current.id;
          current.right = newNode.id;
          const updatedNodes = [...nodes, newNode];
          updateTree(updatedNodes, `Inserted ${value} as right child of ${current.value}.`);
          animateNodeDrop(newNode.id, path);
          return;
        }
        current = nodes.find(n => n.id === current.right);
      }
    }
  };

  const updateTree = (updatedNodes, msg) => {
    const { nodes: positionedNodes, edges: edgeList } = calculatePositions(updatedNodes);
    setNodes(positionedNodes);
    setEdges(edgeList);
    setInsertSequence(prev => [...prev, parseInt(inputValue)]);
    setMessage(msg);
    setInputValue("");
  };

  const animateNodeDrop = (nodeId, path) => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsAnimating(false);
    }, 800 / speed);
  };

  const handleGo = (e) => {
    e.preventDefault();
    if (!inputValue) {
      setMessage("Please enter a value.");
      return;
    }
    insertNode(inputValue);
  };

  const handleReset = () => {
    setNodes([]);
    setEdges([]);
    setInsertSequence([]);
    setMessage("");
    setIsAnimating(false);
    setInputValue("");
    if (animationRef.current) {
      clearTimeout(animationRef.current);
      animationRef.current = null;
    }
    nodeRefs.current = {};
  };

  const edgesList = edges.map((edge, i) => {
    const fromNode = nodes.find(n => n.id === edge.from);
    const toNode = nodes.find(n => n.id === edge.to);
    if (!fromNode || !toNode) return null;
    return { ...edge, x1: fromNode.x, y1: fromNode.y + NODE_RADIUS, x2: toNode.x, y2: toNode.y - NODE_RADIUS };
  }).filter(Boolean);

  return (
    <main className="container mx-auto px-6 pb-4">
      <p className="text-lg text-center text-gray-600 dark:text-gray-400 mb-8">
        Enter a number to insert it into the Binary Search Tree. Watch as the node finds its correct position.
      </p>

      <form
        onSubmit={handleGo}
        className="max-w-4xl mx-auto bg-white dark:bg-neutral-950 p-6 rounded-xl mb-8 border border-gray-200 dark:border-gray-700"
      >
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="insertValue">
            Value to Insert
          </label>
          <div className="flex flex-col sm:flex-row sm:items-end gap-4">
            <input
              type="number"
              id="insertValue"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full sm:max-w-xs p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-400 transition duration-300"
              placeholder="eg. 5"
              disabled={isAnimating}
            />
            <div className="flex gap-2 w-full">
              <GoButton onClick={handleGo} isAnimating={isAnimating} disabled={isAnimating} />
              <ResetButton onReset={handleReset} isAnimating={isAnimating} />
            </div>
          </div>
        </div>
      </form>

      {/* Insertion Sequence */}
      {insertSequence.length > 0 && (
        <div className="max-w-4xl mx-auto mb-4">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1 font-medium">Insertion Sequence:</div>
          <div className="flex flex-wrap gap-2">
            {insertSequence.map((val, i) => (
              <span key={i} className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-sm font-mono">
                {val}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Message */}
      {message && (
        <div className="max-w-4xl mx-auto mb-6 p-4 rounded-lg bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
          <p className="text-center font-medium">{message}</p>
        </div>
      )}

      {/* Tree Visualization */}
      {nodes.length > 0 && (
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">BST Visualization</h2>
          <svg ref={svgRef} viewBox="0 0 800 400" className="w-full h-auto">
            {edgesList.map((edge, i) => (
              <line
                key={i}
                x1={edge.x1}
                y1={edge.y1}
                x2={edge.x2}
                y2={edge.y2}
                stroke="#6B7280"
                strokeWidth="2"
                strokeDasharray="6,3"
              />
            ))}
            {nodes.map((node) => (
              <g
                key={node.id}
                ref={(el) => (nodeRefs.current[node.id] = el)}
              >
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={NODE_RADIUS}
                  fill="#3B82F6"
                  stroke="#2563EB"
                  strokeWidth="2.5"
                />
                <text
                  x={node.x}
                  y={node.y + 1}
                  textAnchor="middle"
                  fill="white"
                  fontSize="14"
                  fontWeight="bold"
                >
                  {node.value}
                </text>
              </g>
            ))}
          </svg>

          <div className="flex flex-wrap justify-center gap-6 mt-4">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-blue-500 rounded mr-2"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Node</span>
            </div>
            <div className="flex items-center">
              <div className="w-6 h-0.5 bg-gray-500 mr-2"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Edge</span>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default BSTInsertion;
