"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Info } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

/**
 * GraphCanvas - A reusable interactive SVG-based graph editor and visualizer.
 * 
 * @param {Array} nodes - Array of node objects { id, x, y, label, state }
 * @param {Array} edges - Array of edge objects { from, to, weight, directed }
 * @param {Function} onUpdateNodes - Callback when nodes are added/moved/removed
 * @param {Function} onUpdateEdges - Callback when edges are added/updated/removed
 * @param {Object} animationState - Optional state for animation highlighting { visitedNodes, visitingNodes, activeEdge, distances, mstEdges }
 * @param {Boolean} interactive - Whether editing is enabled
 * @param {Boolean} isWeighted - Show edge weights
 * @param {Boolean} isDirected - Show arrows on edges
 */
const GraphCanvas = ({
  nodes = [],
  edges = [],
  onUpdateNodes,
  onUpdateEdges,
  animationState = {},
  interactive = true,
  isWeighted = false,
  isDirected = false,
  className = "",
}) => {
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [isShiftPressed, setIsShiftPressed] = useState(false);
  const [draggingNodeId, setDraggingNodeId] = useState(null);

  const {
    visitedNodes = new Set(),
    visitingNodes = new Set(),
    activeEdge = null,
    distances = {},
    mstEdges = [],
  } = animationState;

  // useGSAP for node state animations
  useGSAP(() => {
    visitingNodes.forEach(nodeId => {
      gsap.to(`#node-circle-${nodeId}`, {
        scale: 1.2,
        duration: 0.3,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut"
      });
    });
  }, { dependencies: [visitingNodes], scope: containerRef });

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Shift") setIsShiftPressed(true);
    };
    const handleKeyUp = (e) => {
      if (e.key === "Shift") setIsShiftPressed(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  const getCanvasCoords = (e) => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const transformed = pt.matrixTransform(svg.getScreenCTM().inverse());
    return { x: transformed.x, y: transformed.y };
  };

  const handleCanvasClick = (e) => {
    if (!interactive) return;
    if (e.target !== svgRef.current) return;

    const { x, y } = getCanvasCoords(e);
    const id = nodes.length > 0 ? (Math.max(...nodes.map(n => parseInt(n.id) || 0)) + 1).toString() : "0";
    const newNode = { id, x, y, label: id };
    onUpdateNodes([...nodes, newNode]);
    setSelectedNode(newNode);

    // GSAP animation for new node
    setTimeout(() => {
      gsap.from(`#node-group-${id}`, {
        scale: 0,
        opacity: 0,
        duration: 0.5,
        ease: "back.out(1.7)"
      });
    }, 0);
  };

  const handleNodePointerDown = (e, node) => {
    if (!interactive) return;
    e.stopPropagation();

    if (isShiftPressed && selectedNode && selectedNode.id !== node.id) {
      // Create edge
      const edgeExists = edges.find(
        (edge) => 
          (edge.from === selectedNode.id && edge.to === node.id) ||
          (!isDirected && edge.from === node.id && edge.to === selectedNode.id)
      );

      if (!edgeExists) {
        const newEdge = {
          from: selectedNode.id,
          to: node.id,
          weight: Math.floor(Math.random() * 9) + 1,
          directed: isDirected,
        };
        onUpdateEdges([...edges, newEdge]);
      }
      setSelectedNode(node);
    } else {
      setSelectedNode(node);
      if (!isShiftPressed) {
        setDraggingNodeId(node.id);
      }
    }
  };

  const handlePointerMove = (e) => {
    if (!draggingNodeId || !interactive) return;
    const { x, y } = getCanvasCoords(e);
    onUpdateNodes(nodes.map(n => n.id === draggingNodeId ? { ...n, x, y } : n));
  };

  const handlePointerUp = () => {
    setDraggingNodeId(null);
  };

  const removeNode = (nodeId) => {
    gsap.to(`#node-group-${nodeId}`, {
      scale: 0,
      opacity: 0,
      duration: 0.3,
      onComplete: () => {
        onUpdateNodes(nodes.filter(n => n.id !== nodeId));
        onUpdateEdges(edges.filter(e => e.from !== nodeId && e.to !== nodeId));
        if (selectedNode?.id === nodeId) setSelectedNode(null);
      }
    });
  };

  const removeEdge = (index) => {
    onUpdateEdges(edges.filter((_, i) => i !== index));
  };

  const updateEdgeWeight = (index, newWeight) => {
    const updatedEdges = [...edges];
    updatedEdges[index] = { ...updatedEdges[index], weight: parseInt(newWeight) || 0 };
    onUpdateEdges(updatedEdges);
  };

  const getNode = (id) => nodes.find(n => n.id === id);

  return (
    <div ref={containerRef} className={`relative flex flex-col ${className}`}>
      {/* Canvas */}
      <div className="relative aspect-[8/5] w-full overflow-hidden rounded-xl border border-surface-200 bg-surface-50 dark:border-surface-800 dark:bg-surface-950">
        <svg
          ref={svgRef}
          viewBox="0 0 800 500"
          className="h-full w-full touch-none select-none"
          onClick={handleCanvasClick}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        >
          {/* Defs for arrowheads */}
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="19"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="currentColor" />
            </marker>
          </defs>

          {/* Edges */}
          {edges.map((edge, i) => {
            const start = getNode(edge.from);
            const end = getNode(edge.to);
            if (!start || !end) return null;

            const isActive = activeEdge && 
              ((activeEdge.from === edge.from && activeEdge.to === edge.to) ||
               (!isDirected && activeEdge.from === edge.to && activeEdge.to === edge.from));

            const isMST = mstEdges.some(
              (me) => 
                (me.from === edge.from && me.to === edge.to) ||
                (!isDirected && me.from === edge.to && me.to === edge.from)
            );

            return (
              <g key={`edge-${i}`} className="group cursor-pointer" onClick={() => interactive && removeEdge(i)}>
                <line
                  x1={start.x}
                  y1={start.y}
                  x2={end.x}
                  y2={end.y}
                  className={`transition-all duration-300 ${
                    isMST
                      ? "stroke-success stroke-[4px]"
                      : isActive 
                        ? "stroke-primary stroke-[3px]" 
                        : "stroke-surface-300 dark:stroke-surface-700 stroke-[2px] group-hover:stroke-red-500"
                  }`}
                  markerEnd={isDirected ? "url(#arrowhead)" : ""}
                />
                {isWeighted && (
                  <g transform={`translate(${(start.x + end.x) / 2}, ${(start.y + end.y) / 2})`}>
                    <rect
                      x="-12"
                      y="-12"
                      width="24"
                      height="24"
                      rx="4"
                      className="fill-white/80 dark:fill-surface-900/80"
                    />
                    <text
                      dy=".3em"
                      textAnchor="middle"
                      className="fill-surface-600 dark:fill-surface-400 text-xs font-bold"
                    >
                      {edge.weight}
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* Nodes */}
          {nodes.map((node) => {
            const isSelected = selectedNode?.id === node.id;
            const isVisited = visitedNodes.has(node.id);
            const isVisiting = visitingNodes.has(node.id);
            const distance = distances[node.id];

            return (
              <g
                id={`node-group-${node.id}`}
                key={node.id}
                onPointerDown={(e) => handleNodePointerDown(e, node)}
                className="cursor-pointer"
              >
                <circle
                  id={`node-circle-${node.id}`}
                  cx={node.x}
                  cy={node.y}
                  r="18"
                  className={`transition-all duration-300 ${
                    isVisiting
                      ? "fill-primary stroke-primary stroke-[4px]"
                      : isVisited
                      ? "fill-success/20 stroke-success stroke-[3px]"
                      : isSelected
                      ? "fill-surface-100 dark:fill-surface-800 stroke-primary stroke-[3px]"
                      : "fill-white dark:fill-surface-900 stroke-surface-300 dark:stroke-surface-700 stroke-[2px]"
                  }`}
                />
                <text
                  x={node.x}
                  y={node.y}
                  dy=".3em"
                  textAnchor="middle"
                  className={`text-sm font-bold select-none transition-colors duration-300 ${
                    isVisiting ? "fill-white" : "fill-surface-700 dark:fill-surface-200"
                  }`}
                >
                  {node.label}
                </text>
                {distance !== undefined && distance !== Infinity && (
                  <text
                    x={node.x}
                    y={node.y - 25}
                    textAnchor="middle"
                    className="fill-primary text-xs font-bold"
                  >
                    dist: {distance}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Instructions Overlay */}
        {interactive && (
          <div className="pointer-events-none absolute bottom-4 left-4 flex flex-col gap-2 text-[10px] text-surface-500">
            <div className="flex items-center gap-1">
              <span className="rounded bg-surface-200 px-1 dark:bg-surface-800 text-surface-700 dark:text-surface-300">Click</span>
              <span>to add node</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="rounded bg-surface-200 px-1 dark:bg-surface-800 text-surface-700 dark:text-surface-300">Shift + Click</span>
              <span>to connect</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="rounded bg-surface-200 px-1 dark:bg-surface-800 text-surface-700 dark:text-surface-300">Drag</span>
              <span>to move</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="rounded bg-surface-200 px-1 dark:bg-surface-800 text-surface-700 dark:text-surface-300">Click edge/node</span>
              <span>to delete</span>
            </div>
          </div>
        )}
      </div>

      {/* Selected Node Actions */}
      <AnimatePresence>
        {selectedNode && interactive && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="flex flex-wrap items-center gap-3 rounded-lg border border-surface-200 bg-white p-3 dark:border-surface-800 dark:bg-surface-900"
          >
            <div className="flex items-center gap-2 border-r border-surface-200 pr-3 dark:border-surface-800">
              <span className="text-sm font-semibold text-surface-500">Node {selectedNode.label}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => removeNode(selectedNode.id)}
                className="flex items-center gap-2 rounded-md bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400"
              >
                <Trash2 className="h-3 w-3" />
                Delete Node
              </button>
            </div>

            {isWeighted && (
              <div className="flex items-center gap-2 border-l border-surface-200 pl-3 dark:border-surface-800">
                <span className="text-xs text-surface-500">Edge weights:</span>
                <div className="flex gap-1 overflow-x-auto">
                  {edges
                    .map((e, i) => ({ ...e, index: i }))
                    .filter(e => e.from === selectedNode.id)
                    .map((edge) => (
                      <div key={edge.index} className="flex items-center gap-1 rounded bg-surface-100 px-2 py-1 dark:bg-surface-800">
                        <span className="text-[10px] text-surface-400">→{edge.to}:</span>
                        <input
                          type="number"
                          value={edge.weight}
                          onChange={(e) => updateEdgeWeight(edge.index, e.target.value)}
                          className="w-8 bg-transparent text-[10px] font-bold outline-none"
                        />
                      </div>
                    ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GraphCanvas;
