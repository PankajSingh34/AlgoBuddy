"use client";
import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import ResetButton from "@/app/components/ui/resetButton";
import GoButton from "@/app/components/ui/goButton";

const BSTDeletion = () => {
  const [inputValue, setInputValue] = useState("");
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [message, setMessage] = useState("");
  const [deletionCase, setDeletionCase] = useState(null);
  const [speed] = useState(1);
  const svgRef = useRef(null);
  const nodeRefs = useRef({});
  const animationRef = useRef(null);

  const NODE_RADIUS = 22;
  const LEVEL_HEIGHT = 70;
  const MIN_GAP = 50;

  // Initial tree setup
  const initialTree = [
    { id: 1, value: 8, left: 2, right: 3, parent: null },
    { id: 2, value: 3, left: 4, right: 5, parent: 1 },
    { id: 3, value: 10, left: 6, right: 7, parent: 1 },
    { id: 4, value: 1, left: null, right: null, parent: 2 },
    { id: 5, value: 6, left: 8, right: 9, parent: 2 },
    { id: 6, value: 9, left: null, right: null, parent: 3 },
    { id: 7, value: 14, left: 10, right: null, parent: 3 },
    { id: 8, value: 4, left: null, right: null, parent: 5 },
    { id: 9, value: 7, left: null, right: null, parent: 5 },
    { id: 10, value: 13, left: null, right: null, parent: 7 },
  ];

  useEffect(() => {
    resetToInitial();
    return () => {
      if (animationRef.current) clearTimeout(animationRef.current);
    };
  }, []);

  const calculatePositions = (nodeList) => {
    if (nodeList.length === 0) return { nodes: [], edges: [] };

    const positioned = JSON.parse(JSON.stringify(nodeList));
    const nodeMap = {};
    positioned.forEach(n => nodeMap[n.id] = n);

    function getWidth(nodeId) {
      const node = nodeMap[nodeId];
      if (!node) return 0;
      let w = 1;
      if (node.left) w += getWidth(node.left);
      if (node.right) w += getWidth(node.right);
      return w;
    }

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
      const minX = Math.min(...positioned.map(n => n.x));
      const maxX = Math.max(...positioned.map(n => n.x));
      const shift = 400 - (minX + maxX) / 2;
      positioned.forEach(n => n.x += shift);
    }

    const edgeList = [];
    positioned.forEach(n => {
      if (n.parent !== null) {
        if (positioned.find(p => p.id === n.parent)) {
          edgeList.push({ from: n.parent, to: n.id });
        }
      }
    });

    return { nodes: positioned, edges: edgeList };
  };

  const resetToInitial = () => {
    const { nodes: posNodes, edges: edgeList } = calculatePositions(initialTree);
    setNodes(posNodes);
    setEdges(edgeList);
    setMessage("Click a node to delete it, or enter a value below.");
    setDeletionCase(null);
    setIsAnimating(false);
    setInputValue("");
  };

  const deleteNode = (value) => {
    if (isNaN(value)) {
      setMessage("Please enter a valid number.");
      return;
    }
    setIsAnimating(true);

    const val = parseInt(value);
    let nodeList = JSON.parse(JSON.stringify(nodes));
    if (nodeList.length === 0) {
      setMessage("Tree is empty.");
      setIsAnimating(false);
      return;
    }

    let target = nodeList.find(n => n.value === val);
    if (!target) {
      setMessage(`Value ${val} not found in the tree.`);
      setIsAnimating(false);
      return;
    }

    const children = nodeList.filter(n => n.parent === target.id);
    const childCount = children.length;
    const parent = nodeList.find(n => n.id === target.parent);

    if (childCount === 0) {
      // Case 1: Leaf
      setDeletionCase("case1");
      if (parent) {
        if (parent.left === target.id) parent.left = null;
        else parent.right = null;
      }
      nodeList = nodeList.filter(n => n.id !== target.id);
      setMessage(`Case 1: Node ${val} is a leaf. Simply removed it.`);
    } else if (childCount === 1) {
      // Case 2: One child
      setDeletionCase("case2");
      const child = children[0];
      child.parent = target.parent;
      if (parent) {
        if (parent.left === target.id) parent.left = child.id;
        else parent.right = child.id;
      }
      nodeList = nodeList.filter(n => n.id !== target.id);
      setMessage(`Case 2: Node ${val} had 1 child. Replaced it with its child.`);
    } else {
      // Case 3: Two children — find inorder successor
      setDeletionCase("case3");
      let successor = findInorderSuccessor(nodeList, target);
      if (successor) {
        const successorParent = nodeList.find(n => n.id === successor.parent);
        target.value = successor.value;
        // Remove successor
        if (successorParent) {
          if (successorParent.left === successor.id) successorParent.left = null;
          else successorParent.right = null;
        }
        nodeList = nodeList.filter(n => n.id !== successor.id);
        setMessage(`Case 3: Node ${val} had 2 children. Replaced with inorder successor ${successor.value}.`);
      }
    }

    const { nodes: posNodes, edges: edgeList } = calculatePositions(nodeList);
    setNodes(posNodes);
    setEdges(edgeList);
    setInputValue("");

    setTimeout(() => {
      setIsAnimating(false);
    }, 500 / speed);
  };

  const findInorderSuccessor = (nodeList, node) => {
    // Find the smallest value in the right subtree
    let current = nodeList.find(n => n.id === node.right);
    if (!current) return null;
    while (current.left) {
      current = nodeList.find(n => n.id === current.left);
    }
    return current;
  };

  const handleGo = (e) => {
    e.preventDefault();
    if (!inputValue) {
      setMessage("Please enter a value to delete.");
      return;
    }
    deleteNode(inputValue);
  };

  const handleNodeClick = (node) => {
    if (isAnimating) return;
    deleteNode(node.value);
  };

  const handleReset = () => {
    if (animationRef.current) {
      clearTimeout(animationRef.current);
      animationRef.current = null;
    }
    resetToInitial();
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
        Click a node or enter a value to delete it. The animation will highlight the deletion case applied.
      </p>

      <form onSubmit={handleGo} className="max-w-4xl mx-auto bg-white dark:bg-neutral-950 p-6 rounded-xl mb-8 border border-gray-200 dark:border-gray-700">
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="deleteValue">Value to Delete</label>
          <div className="flex flex-col sm:flex-row sm:items-end gap-4">
            <input type="number" id="deleteValue" value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full sm:max-w-xs p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-400 transition duration-300"
              placeholder="eg. 3" disabled={isAnimating} />
            <div className="flex gap-2 w-full">
              <GoButton onClick={handleGo} isAnimating={isAnimating} disabled={isAnimating} />
              <ResetButton onReset={handleReset} isAnimating={isAnimating} />
            </div>
          </div>
        </div>
      </form>

      {/* Deletion Case Indicator */}
      {deletionCase && (
        <div className="max-w-4xl mx-auto mb-4">
          <div className="flex flex-wrap gap-4 justify-center">
            <span className={`px-4 py-2 rounded-full text-sm font-mono font-medium border ${
              deletionCase === "case1" ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700" :
              deletionCase === "case2" ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700" :
              "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 border-red-300 dark:border-red-700"
            }`}>
              {deletionCase === "case1" ? "Case: Leaf (0 children)" :
               deletionCase === "case2" ? "Case: One Child (1 child)" :
               "Case: Two Children"}
            </span>
          </div>
        </div>
      )}

      {message && (
        <div className="max-w-4xl mx-auto mb-6 p-4 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
          <p className="text-center font-medium">{message}</p>
        </div>
      )}

      {nodes.length > 0 && (
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">BST Visualization</h2>
          <svg ref={svgRef} viewBox="0 0 800 400" className="w-full h-auto">
            {edgesList.map((edge, i) => (
              <line key={i} x1={edge.x1} y1={edge.y1} x2={edge.x2} y2={edge.y2} stroke="#6B7280" strokeWidth="2" strokeDasharray="6,3" />
            ))}
            {nodes.map((node) => (
              <g key={node.id} ref={(el) => (nodeRefs.current[node.id] = el)} onClick={() => handleNodeClick(node)} style={{ cursor: "pointer" }}>
                <circle cx={node.x} cy={node.y} r={NODE_RADIUS} fill="#3B82F6" stroke="#2563EB" strokeWidth="2.5" />
                <text x={node.x} y={node.y + 1} textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">{node.value}</text>
              </g>
            ))}
          </svg>
          <div className="flex flex-wrap justify-center gap-6 mt-4">
            <div className="flex items-center"><div className="w-4 h-4 bg-blue-500 rounded mr-2"></div><span className="text-sm text-gray-600 dark:text-gray-400">Node</span></div>
            <div className="flex items-center"><div className="w-4 h-4 bg-green-500 rounded mr-2"></div><span className="text-sm text-gray-600 dark:text-gray-400">Leaf (click to delete)</span></div>
            <div className="flex items-center"><div className="w-6 h-0.5 bg-gray-500 mr-2"></div><span className="text-sm text-gray-600 dark:text-gray-400">Edge</span></div>
          </div>
        </div>
      )}
    </main>
  );
};

export default BSTDeletion;
