"use client";
import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import ResetButton from "@/app/components/ui/resetButton";
import GoButton from "@/app/components/ui/goButton";

const AVLAnimation = () => {
  const [inputValue, setInputValue] = useState("");
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [insertSequence, setInsertSequence] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [message, setMessage] = useState("");
  const [rotationType, setRotationType] = useState(null);
  const [speed] = useState(1);
  const svgRef = useRef(null);
  const nodeRefs = useRef({});
  const animationRef = useRef(null);

  const NODE_RADIUS = 22;
  const LEVEL_HEIGHT = 70;
  const MIN_GAP = 50;

  useEffect(() => {
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
      if (n.parent !== null && positioned.find(p => p.id === n.parent)) {
        edgeList.push({ from: n.parent, to: n.id });
      }
    });

    return { nodes: positioned, edges: edgeList };
  };

  const getHeight = (nodeId, nodeList) => {
    const node = nodeList.find(n => n.id === nodeId);
    if (!node) return -1;
    if (!node.left && !node.right) return 0;
    const leftH = node.left ? getHeight(node.left, nodeList) : -1;
    const rightH = node.right ? getHeight(node.right, nodeList) : -1;
    return 1 + Math.max(leftH, rightH);
  };

  const getBalanceFactor = (nodeId, nodeList) => {
    const node = nodeList.find(n => n.id === nodeId);
    if (!node) return 0;
    const leftH = node.left ? getHeight(node.left, nodeList) : -1;
    const rightH = node.right ? getHeight(node.right, nodeList) : -1;
    return leftH - rightH;
  };

  // AVL rotations
  const rotateRight = (nodeList, y) => {
    const x = nodeList.find(n => n.id === y.left);
    if (!x) return y;
    const T2 = x.right;
    const parent = nodeList.find(n => n.id === y.parent);

    // Perform rotation
    x.right = y.id;
    y.left = T2;

    // Update parents
    x.parent = y.parent;
    y.parent = x.id;
    if (T2) {
      const t2Node = nodeList.find(n => n.id === T2);
      if (t2Node) t2Node.parent = y.id;
    }

    if (parent) {
      if (parent.left === y.id) parent.left = x.id;
      else parent.right = x.id;
    }

    return x;
  };

  const rotateLeft = (nodeList, x) => {
    const y = nodeList.find(n => n.id === x.right);
    if (!y) return x;
    const T2 = y.left;
    const parent = nodeList.find(n => n.id === x.parent);

    y.left = x.id;
    x.right = T2;

    y.parent = x.parent;
    x.parent = y.id;
    if (T2) {
      const t2Node = nodeList.find(n => n.id === T2);
      if (t2Node) t2Node.parent = x.id;
    }

    if (parent) {
      if (parent.left === x.id) parent.left = y.id;
      else parent.right = y.id;
    }

    return y;
  };

  const insertAVL = (value) => {
    if (isNaN(value)) {
      setMessage("Please enter a valid number.");
      return;
    }

    let nodeList = JSON.parse(JSON.stringify(nodes));
    const newId = Date.now();
    const newNode = { id: newId, value: parseInt(value), left: null, right: null, parent: null };

    if (nodeList.length === 0) {
      nodeList.push(newNode);
      const { nodes: posNodes, edges: edgeList } = calculatePositions(nodeList);
      setNodes(posNodes);
      setEdges(edgeList);
      setInsertSequence(prev => [...prev, parseInt(value)]);
      setMessage(`Inserted ${value} as root. Balance factor: 0.`);
      setInputValue("");
      return;
    }

    // BST insert
    let current = nodeList[0];
    let inserted = false;
    while (!inserted) {
      if (parseInt(value) < current.value) {
        if (current.left === null) {
          newNode.parent = current.id;
          current.left = newId;
          nodeList.push(newNode);
          inserted = true;
        } else {
          current = nodeList.find(n => n.id === current.left);
        }
      } else {
        if (current.right === null) {
          newNode.parent = current.id;
          current.right = newId;
          nodeList.push(newNode);
          inserted = true;
        } else {
          current = nodeList.find(n => n.id === current.right);
        }
      }
    }

    // Check balance factors and rebalance
    let rotated = false;
    let unbalancedNode = null;
    let bf;

    // Find the first unbalanced node on the path from new node to root
    let checkNode = newNode;
    while (checkNode) {
      bf = getBalanceFactor(checkNode.id, nodeList);
      if (bf > 1 || bf < -1) {
        unbalancedNode = checkNode;
        break;
      }
      if (checkNode.parent === null) break;
      checkNode = nodeList.find(n => n.id === checkNode.parent);
    }

    if (unbalancedNode) {
      const val = unbalancedNode.value;
      const leftChild = unbalancedNode.left ? nodeList.find(n => n.id === unbalancedNode.left) : null;
      const rightChild = unbalancedNode.right ? nodeList.find(n => n.id === unbalancedNode.right) : null;

      // LL case
      if (bf > 1 && leftChild && (parseInt(value) < leftChild.value)) {
        rotateRight(nodeList, unbalancedNode.id);
        rotated = true;
        setRotationType("LL (Right Rotation)");
        setMessage(`LL imbalance at ${val}. Performing right rotation.`);
      }
      // LR case
      else if (bf > 1 && leftChild && (parseInt(value) > leftChild.value)) {
        rotateLeft(nodeList, leftChild.id);
        rotateRight(nodeList, unbalancedNode.id);
        rotated = true;
        setRotationType("LR (Left-Right Rotation)");
        setMessage(`LR imbalance at ${val}. Left rotation then right rotation.`);
      }
      // RR case
      else if (bf < -1 && rightChild && (parseInt(value) > rightChild.value)) {
        rotateLeft(nodeList, unbalancedNode.id);
        rotated = true;
        setRotationType("RR (Left Rotation)");
        setMessage(`RR imbalance at ${val}. Performing left rotation.`);
      }
      // RL case
      else if (bf < -1 && rightChild && (parseInt(value) < rightChild.value)) {
        rotateRight(nodeList, rightChild.id);
        rotateLeft(nodeList, unbalancedNode.id);
        rotated = true;
        setRotationType("RL (Right-Left Rotation)");
        setMessage(`RL imbalance at ${val}. Right rotation then left rotation.`);
      }
    }

    if (!rotated) {
      setRotationType(null);
      setMessage(`Inserted ${value}. Tree is balanced. BF: ${getBalanceFactor(nodeList[0].id, nodeList)}`);
    }

    const { nodes: posNodes, edges: edgeList } = calculatePositions(nodeList);
    setNodes(posNodes);
    setEdges(edgeList);
    setInsertSequence(prev => [...prev, parseInt(value)]);
    setInputValue("");
  };

  const handleGo = (e) => {
    e.preventDefault();
    if (!inputValue) {
      setMessage("Please enter a value.");
      return;
    }
    setIsAnimating(true);
    insertAVL(inputValue);
    setTimeout(() => setIsAnimating(false), 500 / speed);
  };

  const handleReset = () => {
    setNodes([]);
    setEdges([]);
    setInsertSequence([]);
    setMessage("");
    setIsAnimating(false);
    setInputValue("");
    setRotationType(null);
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
        Insert values to build an AVL tree. Watch balance factors and rotations as the tree self-balances.
      </p>

      <form onSubmit={handleGo} className="max-w-4xl mx-auto bg-white dark:bg-neutral-950 p-6 rounded-xl mb-8 border border-gray-200 dark:border-gray-700">
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="avlValue">Value to Insert</label>
          <div className="flex flex-col sm:flex-row sm:items-end gap-4">
            <input type="number" id="avlValue" value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full sm:max-w-xs p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-400 transition duration-300"
              placeholder="eg. 10" disabled={isAnimating} />
            <div className="flex gap-2 w-full">
              <GoButton onClick={handleGo} isAnimating={isAnimating} disabled={isAnimating} />
              <ResetButton onReset={handleReset} isAnimating={isAnimating} />
            </div>
          </div>
        </div>
      </form>

      {/* Rotation Indicator */}
      {rotationType && (
        <div className="max-w-4xl mx-auto mb-4 flex justify-center">
          <span className="px-4 py-2 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full text-sm font-mono font-medium border border-purple-300 dark:border-purple-700">
            Rotation: {rotationType}
          </span>
        </div>
      )}

      {/* Insertion Sequence */}
      {insertSequence.length > 0 && (
        <div className="max-w-4xl mx-auto mb-4">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1 font-medium">Insertion Sequence:</div>
          <div className="flex flex-wrap gap-2">
            {insertSequence.map((val, i) => (
              <span key={i} className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-sm font-mono">{val}</span>
            ))}
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
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">AVL Tree Visualization</h2>
          <svg ref={svgRef} viewBox="0 0 800 400" className="w-full h-auto">
            {edgesList.map((edge, i) => (
              <line key={i} x1={edge.x1} y1={edge.y1} x2={edge.x2} y2={edge.y2} stroke="#6B7280" strokeWidth="2" strokeDasharray="6,3" />
            ))}
            {nodes.map((node) => {
              const bf = getBalanceFactor(node.id, nodes);
              const fillColor = bf > 1 || bf < -1 ? "#EF4444" : bf === 0 ? "#3B82F6" : "#F59E0B";
              return (
                <g key={node.id} ref={(el) => (nodeRefs.current[node.id] = el)}>
                  <circle cx={node.x} cy={node.y} r={NODE_RADIUS} fill={fillColor} stroke={bf > 1 || bf < -1 ? "#DC2626" : "#2563EB"} strokeWidth="2.5" />
                  <text x={node.x} y={node.y + 1} textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">{node.value}</text>
                  <text x={node.x} y={node.y + NODE_RADIUS + 15} textAnchor="middle" fill="#9CA3AF" fontSize="11" fontFamily="monospace">BF:{bf > 0 ? `+${bf}` : bf}</text>
                </g>
              );
            })}
          </svg>

          {/* Legend */}
          <div className="flex flex-wrap justify-center gap-6 mt-6">
            <div className="flex items-center"><div className="w-4 h-4 bg-blue-500 rounded mr-2"></div><span className="text-sm text-gray-600 dark:text-gray-400">Balanced (BF=0)</span></div>
            <div className="flex items-center"><div className="w-4 h-4 bg-yellow-500 rounded mr-2"></div><span className="text-sm text-gray-600 dark:text-gray-400">Slightly Unbalanced (BF=±1)</span></div>
            <div className="flex items-center"><div className="w-4 h-4 bg-red-500 rounded mr-2"></div><span className="text-sm text-gray-600 dark:text-gray-400">Unbalanced (rotate needed)</span></div>
          </div>
        </div>
      )}
    </main>
  );
};

export default AVLAnimation;
