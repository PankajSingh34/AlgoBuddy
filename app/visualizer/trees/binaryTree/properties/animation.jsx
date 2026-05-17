"use client";
import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import ResetButton from "@/app/components/ui/resetButton";
import GoButton from "@/app/components/ui/goButton";

const BinaryTreeProperties = () => {
  const [selectedNode, setSelectedNode] = useState(null);
  const [nodeInfo, setNodeInfo] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [speed] = useState(1);
  const treeRef = useRef(null);
  const nodeRefs = useRef({});

  const treeData = {
    nodes: [
      { id: 1, label: "Root", value: 5, x: 300, y: 40, parent: null },
      { id: 2, label: "L", value: 3, x: 150, y: 120, parent: 1, side: "left" },
      { id: 3, label: "R", value: 7, x: 450, y: 120, parent: 1, side: "right" },
      { id: 4, label: "LL", value: 2, x: 60, y: 200, parent: 2, side: "left" },
      { id: 5, label: "LR", value: 4, x: 240, y: 200, parent: 2, side: "right" },
      { id: 6, label: "RL", value: 6, x: 360, y: 200, parent: 3, side: "left" },
      { id: 7, label: "RR", value: 8, x: 540, y: 200, parent: 3, side: "right" },
      { id: 8, label: "RRL", value: 9, x: 620, y: 280, parent: 7, side: "right" },
    ],
    edges: [
      { from: 1, to: 2 }, { from: 1, to: 3 },
      { from: 2, to: 4 }, { from: 2, to: 5 },
      { from: 3, to: 6 }, { from: 3, to: 7 },
      { from: 7, to: 8 },
    ],
  };

  const getNodeDepth = (nodeId) => {
    let depth = 0;
    let current = treeData.nodes.find(n => n.id === nodeId);
    while (current && current.parent) {
      depth++;
      current = treeData.nodes.find(n => n.id === current.parent);
    }
    return depth;
  };

  const getNodeHeight = (nodeId) => {
    const children = treeData.nodes.filter(n => n.parent === nodeId);
    if (children.length === 0) return 0;
    return 1 + Math.max(...children.map(c => getNodeHeight(c.id)));
  };

  const getNodeDegree = (nodeId) => {
    return treeData.nodes.filter(n => n.parent === nodeId).length;
  };

  const isLeaf = (nodeId) => getNodeDegree(nodeId) === 0;

  const handleNodeClick = (node) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setSelectedNode(node.id);

    const depth = getNodeDepth(node.id);
    const height = getNodeHeight(node.id);
    const degree = getNodeDegree(node.id);
    const leaf = isLeaf(node.id);

    // Reset all nodes
    Object.values(nodeRefs.current).forEach((ref) => {
      if (ref) {
        gsap.to(ref, {
          fill: "#3B82F6",
          stroke: "#2563EB",
          duration: 0.2,
        });
      }
    });

    const nodeEl = nodeRefs.current[node.id];
    if (nodeEl) {
      gsap.to(nodeEl, {
        fill: "#F59E0B",
        stroke: "#D97706",
        duration: 0.3,
        scale: 1.15,
        yoyo: true,
        repeat: 1,
        onComplete: () => {
          setIsAnimating(false);
        },
      });
    }

    setNodeInfo({
      id: node.id,
      label: node.label,
      value: node.value,
      type: leaf ? "Leaf Node" : degree === 2 ? "Internal Node" : "Internal Node (1 child)",
      depth: `Depth = ${depth} (${depth} edge${depth > 1 ? 's' : ''} from root)`,
      height: `Height = ${height} (${height} edge${height > 1 ? 's' : ''} to deepest leaf)`,
      degree: `Degree = ${degree} (${degree} child${degree !== 1 ? 'ren' : ''})`,
      leafStatus: leaf ? "This is a LEAF node (no children)" : "This is an INTERNAL node (has children)",
    });
  };

  const handleReset = () => {
    setSelectedNode(null);
    setNodeInfo(null);
    setIsAnimating(false);
    Object.values(nodeRefs.current).forEach((ref) => {
      if (ref) {
        gsap.to(ref, {
          fill: "#3B82F6",
          stroke: "#2563EB",
          scale: 1,
          duration: 0.2,
        });
      }
    });
  };

  useEffect(() => {
    // Initial animation
    gsap.from(treeRef.current, {
      opacity: 0,
      y: 30,
      duration: 0.6,
      ease: "power2.out",
    });
  }, []);

  const edges = treeData.edges.map((edge, i) => {
    const fromNode = treeData.nodes.find(n => n.id === edge.from);
    const toNode = treeData.nodes.find(n => n.id === edge.to);
    return { ...edge, x1: fromNode.x, y1: fromNode.y + 20, x2: toNode.x, y2: toNode.y - 20 };
  });

  return (
    <main className="container mx-auto px-6 pb-4">
      <p className="text-lg text-center text-gray-600 dark:text-gray-400 mb-8">
        Click on any node to see its properties including depth, height, degree, and classification.
      </p>

      <div className="max-w-4xl mx-auto bg-white dark:bg-neutral-950 p-6 rounded-xl mb-8 border border-gray-200 dark:border-gray-700">
        <svg
          ref={treeRef}
          viewBox="0 0 700 370"
          className="w-full h-auto"
        >
          {/* Edges */}
          {edges.map((edge, i) => (
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

          {/* Nodes */}
          {treeData.nodes.map((node) => (
            <g
              key={node.id}
              ref={(el) => (nodeRefs.current[node.id] = el)}
              onClick={() => handleNodeClick(node)}
              style={{ cursor: "pointer" }}
              className="node-group"
            >
              <circle
                cx={node.x}
                cy={node.y}
                r={22}
                fill={selectedNode === node.id ? "#F59E0B" : "#3B82F6"}
                stroke={selectedNode === node.id ? "#D97706" : "#2563EB"}
                strokeWidth="2.5"
              />
              <text
                x={node.x}
                y={node.y + 1}
                textAnchor="middle"
                fill="white"
                fontSize="12"
                fontWeight="bold"
              >
                {node.value}
              </text>
              <text
                x={node.x}
                y={node.y + 38}
                textAnchor="middle"
                fill="#6B7280"
                fontSize="11"
                className="dark-fill-gray-400"
              >
                {node.label}
              </text>
            </g>
          ))}
        </svg>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-6 mt-4 mb-2">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-500 rounded mr-2"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Node</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-yellow-500 rounded mr-2"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Selected</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded mr-2 border-2 border-gray-400 bg-transparent"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Leaf</span>
          </div>
        </div>

        {/* Node Info Display */}
        {nodeInfo && (
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                Node {nodeInfo.label} (value: {nodeInfo.value})
              </h3>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                nodeInfo.type === "Leaf Node"
                  ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
                  : "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
              }`}>
                {nodeInfo.type}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center">
                <span className="text-sm font-mono bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 px-2 py-1 rounded mr-2">Depth</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">{nodeInfo.depth}</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm font-mono bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 px-2 py-1 rounded mr-2">Height</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">{nodeInfo.height}</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm font-mono bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 px-2 py-1 rounded mr-2">Degree</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">{nodeInfo.degree}</span>
              </div>
              <div className="flex items-center col-span-1 sm:col-span-2">
                <span className="text-sm text-gray-600 dark:text-gray-400 italic">
                  {nodeInfo.leafStatus}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-center mt-6 gap-4">
          <ResetButton onReset={handleReset} isAnimating={isAnimating} />
        </div>
      </div>
    </main>
  );
};

export default BinaryTreeProperties;
