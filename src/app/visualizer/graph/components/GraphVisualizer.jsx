"use client";

import React, { useState, useMemo, useCallback, useEffect, useRef } from "react";
import {
  Settings2,
  BarChart3,
  Info,
  Trash2,
  Wand2,
  Code2,
  Download,
  AlertTriangle,
  Palette
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import GraphCanvas from "@/app/components/models/GraphCanvas";
import AdjacencyPanel from "@/app/components/models/AdjacencyPanel";
import PlaybackControls from "@/app/components/ui/PlaybackControls";
import useVisualizerKeyboard from "@/app/hooks/useVisualizerKeyboard";
import ThemeSettingsModal from "@/app/visualizer/components/ThemeSettingsModal";
import { useAnimationEngine } from "@/lib/visualizer/useAnimationEngine";
import { CustomInputPanel } from "@/app/visualizer/components/CustomInputPanel";
import { bfsGenerator } from "@/features/algorithms/graph/bfsLogic";
import { dfsGenerator } from "@/features/algorithms/graph/dfsLogic";
import { dijkstraGenerator } from "@/features/algorithms/graph/dijkstraLogic";
import { bellmanFordGenerator } from "@/features/algorithms/graph/bellmanFordLogic";
import { floydWarshallGenerator } from "@/features/algorithms/graph/floydWarshallLogic";
import { primGenerator } from "@/features/algorithms/graph/primLogic";
import { kruskalGenerator } from "@/features/algorithms/graph/kruskalLogic";
import { topologicalSortGenerator } from "@/features/algorithms/graph/topologicalSortLogic";
import { kosarajuGenerator } from "@/features/algorithms/graph/kosarajuLogic";
import { tarjanGenerator } from "@/features/algorithms/graph/tarjanLogic";
import { aStarGenerator } from "@/features/algorithms/graph/aStarLogic";
import { fordFulkersonGenerator } from "@/features/algorithms/graph/fordFulkersonLogic";
import { adjacencyListGenerator } from "@/features/algorithms/graph/adjacencyListLogic";
import { adjacencyMatrixGenerator } from "@/features/algorithms/graph/adjacencyMatrixLogic";
import { ALGORITHM_PSEUDOCODE } from "../constants/pseudocode";

const weightedAlgorithms = new Set(["dijkstra", "bellman-ford", "floyd-warshall", "prim", "kruskal", "a-star", "ford-fulkerson"]);
const directedAlgorithms = new Set(["dijkstra", "bellman-ford", "floyd-warshall", "topological-sort", "kosaraju", "tarjan", "a-star", "ford-fulkerson"]);

const defaultGraphs = {
  bfs: {
    nodes: [
      { id: "0", x: 400, y: 80, label: "0" },
      { id: "1", x: 250, y: 200, label: "1" },
      { id: "2", x: 550, y: 200, label: "2" },
      { id: "3", x: 150, y: 350, label: "3" },
      { id: "4", x: 350, y: 350, label: "4" },
      { id: "5", x: 650, y: 350, label: "5" },
    ],
    edges: [
      { from: "0", to: "1", weight: 1, directed: false },
      { from: "0", to: "2", weight: 1, directed: false },
      { from: "1", to: "3", weight: 1, directed: false },
      { from: "1", to: "4", weight: 1, directed: false },
      { from: "2", to: "5", weight: 1, directed: false },
    ]
  },
  dfs: {
    nodes: [
      { id: "0", x: 400, y: 80, label: "0" },
      { id: "1", x: 250, y: 200, label: "1" },
      { id: "2", x: 550, y: 200, label: "2" },
      { id: "3", x: 150, y: 350, label: "3" },
      { id: "4", x: 350, y: 350, label: "4" },
      { id: "5", x: 650, y: 350, label: "5" },
    ],
    edges: [
      { from: "0", to: "1", weight: 1, directed: false },
      { from: "1", to: "3", weight: 1, directed: false },
      { from: "3", to: "4", weight: 1, directed: false },
      { from: "0", to: "2", weight: 1, directed: false },
      { from: "2", to: "5", weight: 1, directed: false },
    ]
  },
  dijkstra: {
    nodes: [
      { id: "0", x: 100, y: 250, label: "A" },
      { id: "1", x: 300, y: 100, label: "B" },
      { id: "2", x: 300, y: 400, label: "C" },
      { id: "3", x: 500, y: 100, label: "D" },
      { id: "4", x: 500, y: 400, label: "E" },
      { id: "5", x: 700, y: 250, label: "F" },
    ],
    edges: [
      { from: "0", to: "1", weight: 4, directed: true },
      { from: "0", to: "2", weight: 2, directed: true },
      { from: "1", to: "3", weight: 5, directed: true },
      { from: "1", to: "2", weight: 1, directed: true },
      { from: "2", to: "1", weight: 8, directed: true },
      { from: "2", to: "3", weight: 10, directed: true },
      { from: "2", to: "4", weight: 3, directed: true },
      { from: "3", to: "5", weight: 2, directed: true },
      { from: "4", to: "3", weight: 4, directed: true },
      { from: "4", to: "5", weight: 6, directed: true },
    ]
  },
  "floyd-warshall": {
    nodes: [
      { id: "0", x: 120, y: 160, label: "A" },
      { id: "1", x: 340, y: 90, label: "B" },
      { id: "2", x: 560, y: 160, label: "C" },
      { id: "3", x: 250, y: 360, label: "D" },
      { id: "4", x: 520, y: 350, label: "E" },
    ],
    edges: [
      { from: "0", to: "1", weight: 3, directed: true },
      { from: "0", to: "3", weight: 8, directed: true },
      { from: "1", to: "2", weight: 1, directed: true },
      { from: "1", to: "3", weight: 4, directed: true },
      { from: "2", to: "4", weight: 2, directed: true },
      { from: "3", to: "2", weight: 2, directed: true },
      { from: "3", to: "4", weight: 7, directed: true },
      { from: "4", to: "0", weight: 4, directed: true },
    ]
  },
  "bellman-ford": {
    nodes: [
      { id: "0", x: 100, y: 250, label: "A" },
      { id: "1", x: 300, y: 100, label: "B" },
      { id: "2", x: 300, y: 400, label: "C" },
      { id: "3", x: 500, y: 100, label: "D" },
      { id: "4", x: 500, y: 400, label: "E" },
      { id: "5", x: 700, y: 250, label: "F" },
    ],
    edges: [
      { from: "0", to: "1", weight: 4, directed: true },
      { from: "0", to: "2", weight: 2, directed: true },
      { from: "1", to: "3", weight: 5, directed: true },
      { from: "1", to: "2", weight: 1, directed: true },
      { from: "2", to: "1", weight: 8, directed: true },
      { from: "2", to: "3", weight: 10, directed: true },
      { from: "2", to: "4", weight: 3, directed: true },
      { from: "3", to: "5", weight: 2, directed: true },
      { from: "4", to: "3", weight: -4, directed: true },
      { from: "4", to: "5", weight: 6, directed: true },
    ]
  },
  "a-star": {
    nodes: [
      { id: "0", x: 100, y: 250, label: "A" },
      { id: "1", x: 300, y: 100, label: "B" },
      { id: "2", x: 300, y: 400, label: "C" },
      { id: "3", x: 500, y: 100, label: "D" },
      { id: "4", x: 500, y: 400, label: "E" },
      { id: "5", x: 700, y: 250, label: "F" },
    ],
    edges: [
      { from: "0", to: "1", weight: 4, directed: true },
      { from: "0", to: "2", weight: 2, directed: true },
      { from: "1", to: "3", weight: 5, directed: true },
      { from: "1", to: "2", weight: 1, directed: true },
      { from: "2", to: "4", weight: 3, directed: true },
      { from: "3", to: "5", weight: 2, directed: true },
      { from: "4", to: "5", weight: 6, directed: true },
    ]
  },
  "ford-fulkerson": {
    nodes: [
      { id: "0", x: 100, y: 250, label: "S" },
      { id: "1", x: 300, y: 100, label: "A" },
      { id: "2", x: 300, y: 400, label: "B" },
      { id: "3", x: 500, y: 100, label: "C" },
      { id: "4", x: 500, y: 400, label: "D" },
      { id: "5", x: 700, y: 250, label: "T" },
    ],
    edges: [
      { from: "0", to: "1", weight: 10, directed: true },
      { from: "0", to: "2", weight: 10, directed: true },
      { from: "1", to: "2", weight: 2, directed: true },
      { from: "1", to: "3", weight: 4, directed: true },
      { from: "1", to: "4", weight: 8, directed: true },
      { from: "2", to: "4", weight: 9, directed: true },
      { from: "4", to: "3", weight: 6, directed: true },
      { from: "3", to: "5", weight: 10, directed: true },
      { from: "4", to: "5", weight: 10, directed: true },
    ]
  },
  prim: {
    nodes: [
      { id: "0", x: 400, y: 80, label: "0" },
      { id: "1", x: 250, y: 200, label: "1" },
      { id: "2", x: 550, y: 200, label: "2" },
      { id: "3", x: 150, y: 350, label: "3" },
      { id: "4", x: 350, y: 350, label: "4" },
      { id: "5", x: 650, y: 350, label: "5" },
    ],
    edges: [
      { from: "0", to: "1", weight: 2, directed: false },
      { from: "0", to: "2", weight: 3, directed: false },
      { from: "1", to: "3", weight: 5, directed: false },
      { from: "1", to: "4", weight: 1, directed: false },
      { from: "2", to: "5", weight: 4, directed: false },
      { from: "4", to: "5", weight: 2, directed: false },
    ]
  },
  kruskal: {
    nodes: [
      { id: "0", x: 400, y: 80, label: "0" },
      { id: "1", x: 250, y: 200, label: "1" },
      { id: "2", x: 550, y: 200, label: "2" },
      { id: "3", x: 150, y: 350, label: "3" },
      { id: "4", x: 350, y: 350, label: "4" },
      { id: "5", x: 650, y: 350, label: "5" },
    ],
    edges: [
      { from: "0", to: "1", weight: 2, directed: false },
      { from: "0", to: "2", weight: 3, directed: false },
      { from: "1", to: "3", weight: 5, directed: false },
      { from: "1", to: "4", weight: 1, directed: false },
      { from: "2", to: "5", weight: 4, directed: false },
      { from: "4", to: "5", weight: 2, directed: false },
    ]
  },
  "topological-sort": {
    nodes: [
      { id: "0", x: 100, y: 100, label: "A" },
      { id: "1", x: 300, y: 100, label: "B" },
      { id: "2", x: 500, y: 100, label: "C" },
      { id: "3", x: 100, y: 400, label: "D" },
      { id: "4", x: 300, y: 400, label: "E" },
      { id: "5", x: 500, y: 400, label: "F" },
    ],
    edges: [
      { from: "0", to: "1", weight: 1, directed: true },
      { from: "1", to: "2", weight: 1, directed: true },
      { from: "3", to: "1", weight: 1, directed: true },
      { from: "3", to: "4", weight: 1, directed: true },
      { from: "4", to: "5", weight: 1, directed: true },
      { from: "2", to: "5", weight: 1, directed: true },
    ]
  },
  "kosaraju": {
    nodes: [
      { id: "0", x: 150, y: 150, label: "0" },
      { id: "1", x: 350, y: 100, label: "1" },
      { id: "2", x: 250, y: 300, label: "2" },
      { id: "3", x: 500, y: 300, label: "3" },
      { id: "4", x: 650, y: 150, label: "4" },
    ],
    edges: [
      { from: "0", to: "1", weight: 1, directed: true },
      { from: "1", to: "2", weight: 1, directed: true },
      { from: "2", to: "0", weight: 1, directed: true },
      { from: "1", to: "3", weight: 1, directed: true },
      { from: "3", to: "4", weight: 1, directed: true },
      { from: "4", to: "3", weight: 1, directed: true },
    ]
  },
  "tarjan": {
    nodes: [
      { id: "0", x: 150, y: 150, label: "0" },
      { id: "1", x: 350, y: 100, label: "1" },
      { id: "2", x: 250, y: 300, label: "2" },
      { id: "3", x: 500, y: 300, label: "3" },
      { id: "4", x: 650, y: 150, label: "4" },
    ],
    edges: [
      { from: "0", to: "1", weight: 1, directed: true },
      { from: "1", to: "2", weight: 1, directed: true },
      { from: "2", to: "0", weight: 1, directed: true },
      { from: "1", to: "3", weight: 1, directed: true },
      { from: "3", to: "4", weight: 1, directed: true },
      { from: "4", to: "3", weight: 1, directed: true },
    ]
  },
  "adjacency-list": {
    nodes: [
      { id: "0", x: 100, y: 250, label: "0" },
      { id: "1", x: 300, y: 100, label: "1" },
      { id: "2", x: 300, y: 400, label: "2" },
      { id: "3", x: 500, y: 250, label: "3" },
    ],
    edges: [
      { from: "0", to: "1", weight: 1, directed: false },
      { from: "0", to: "2", weight: 1, directed: false },
      { from: "1", to: "3", weight: 1, directed: false },
      { from: "2", to: "3", weight: 1, directed: false },
    ]
  },
  "adjacency-matrix": {
    nodes: [
      { id: "0", x: 100, y: 250, label: "0" },
      { id: "1", x: 300, y: 100, label: "1" },
      { id: "2", x: 300, y: 400, label: "2" },
      { id: "3", x: 500, y: 250, label: "3" },
    ],
    edges: [
      { from: "0", to: "1", weight: 1, directed: false },
      { from: "0", to: "2", weight: 1, directed: false },
      { from: "1", to: "3", weight: 1, directed: false },
      { from: "2", to: "3", weight: 1, directed: false },
    ]
  }
};

const complexityData = {
  bfs: [
    { name: 'Time', value: 80, label: 'O(V+E)', full: 'Time Complexity' },
    { name: 'Space', value: 60, label: 'O(V)', full: 'Space Complexity' },
  ],
  dfs: [
    { name: 'Time', value: 80, label: 'O(V+E)', full: 'Time Complexity' },
    { name: 'Space', value: 60, label: 'O(V)', full: 'Space Complexity' },
  ],
  dijkstra: [
    { name: 'Time', value: 95, label: 'O((V+E)logV)', full: 'Time Complexity' },
    { name: 'Space', value: 60, label: 'O(V)', full: 'Space Complexity' },
  ],
  "floyd-warshall": [
    { name: 'Time', value: 100, label: 'O(V^3)', full: 'Time Complexity' },
    { name: 'Space', value: 90, label: 'O(V^2)', full: 'Space Complexity' },
  ],
  "bellman-ford": [
    { name: 'Time', value: 90, label: 'O(VE)', full: 'Time Complexity' },
    { name: 'Space', value: 60, label: 'O(V)', full: 'Space Complexity' },
  ],
  prim: [
    { name: 'Time', value: 90, label: 'O(ElogV)', full: 'Time Complexity' },
    { name: 'Space', value: 60, label: 'O(V)', full: 'Space Complexity' },
  ],
  "a-star": [
    { name: 'Time', value: 85, label: 'O(E)', full: 'Time Complexity' },
    { name: 'Space', value: 60, label: 'O(V)', full: 'Space Complexity' },
  ],
  "ford-fulkerson": [
    { name: 'Time', value: 95, label: 'O(V E^2)', full: 'Time Complexity' },
    { name: 'Space', value: 75, label: 'O(V^2)', full: 'Space Complexity' },
  ],
  kruskal: [
    { name: 'Time', value: 90, label: 'O(ElogE)', full: 'Time Complexity' },
    { name: 'Space', value: 60, label: 'O(V)', full: 'Space Complexity' },
  ],
  "topological-sort": [
    { name: 'Time', value: 80, label: 'O(V+E)', full: 'Time Complexity' },
    { name: 'Space', value: 60, label: 'O(V)', full: 'Space Complexity' },
  ],
  "kosaraju": [
    { name: 'Time', value: 80, label: 'O(V+E)', full: 'Time Complexity' },
    { name: 'Space', value: 60, label: 'O(V)', full: 'Space Complexity' },
  ],
  "tarjan": [
    { name: 'Time', value: 80, label: 'O(V+E)', full: 'Time Complexity' },
    { name: 'Space', value: 60, label: 'O(V)', full: 'Space Complexity' },
  ],
  "adjacency-list": [
    { name: 'Space', value: 60, label: 'O(V+E)', full: 'Space Complexity' },
    { name: 'Add Node', value: 10, label: 'O(1)', full: 'Time Complexity' },
  ],
  "adjacency-matrix": [
    { name: 'Space', value: 90, label: 'O(V^2)', full: 'Space Complexity' },
    { name: 'Edge Check', value: 10, label: 'O(1)', full: 'Time Complexity' },
  ],
};

const comparisonData = [
  { name: 'BFS', time: 80, space: 60 },
  { name: 'DFS', time: 80, space: 60 },
  { name: 'Dijkstra', time: 95, space: 65 },
  { name: 'Bellman', time: 90, space: 60 },
  { name: 'Floyd', time: 100, space: 90 },
  { name: 'MST', time: 90, space: 60 },
  { name: 'SCC', time: 80, space: 60 },
];

export default function GraphVisualizer({ algorithm = "bfs", startNode: initialStartNode }) {
  const {
    nodes, setNodes,
    edges, setEdges,
    updateGraph,
    undo, redo, canUndo, canRedo,
    resetGraph
  } = useGraphHistory(defaultGraphs[algorithm]?.nodes || [], defaultGraphs[algorithm]?.edges || []);
  const [isPseudocodeOpen, setIsPseudocodeOpen] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const savedNodes = localStorage.getItem(`algobuddy_custom_nodes_${algorithm}`);
      const savedEdges = localStorage.getItem(`algobuddy_custom_edges_${algorithm}`);
      if (savedNodes && savedEdges) {
        resetGraph(JSON.parse(savedNodes), JSON.parse(savedEdges));
      } else {
        resetGraph(defaultGraphs[algorithm]?.nodes || [], defaultGraphs[algorithm]?.edges || []);
      }
    } catch (err) {
      console.error("Failed to load custom graph:", err);
    }
    setIsLoaded(true);
  }, [algorithm]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(`algobuddy_custom_nodes_${algorithm}`, JSON.stringify(nodes));
      localStorage.setItem(`algobuddy_custom_edges_${algorithm}`, JSON.stringify(edges));
    }
  }, [nodes, edges, algorithm, isLoaded]);

  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!isEditing) return;

    const handleKeyDown = (e) => {
      const activeEl = document.activeElement;
      const tag = activeEl?.tagName?.toLowerCase();
      if (tag === "input" || tag === "textarea" || tag === "select" || activeEl?.isContentEditable) return;

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          if (canRedo) redo();
        } else {
          if (canUndo) undo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        if (canRedo) redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isEditing, undo, redo, canUndo, canRedo]);

  const [targetNode, setTargetNode] = useState("");
  const canvasContainerRef = useRef(null);
  const [isExporting, setIsExporting] = useState(false);

  const [isDirectedManual, setIsDirectedManual] = useState(null);

  useEffect(() => {
    setIsDirectedManual(null);
  }, [algorithm]);

  // Derived flags
  const isWeighted = weightedAlgorithms.has(algorithm);
  const isDirected = isDirectedManual !== null ? isDirectedManual : directedAlgorithms.has(algorithm);

  const [comparisonAlgorithm, setComparisonAlgorithm] = useState("");

  const generateFrames = useCallback((alg) => {
    if (!alg) return [];
    
    // Check if the target algorithm requires weighted/directed manually
    const isW = weightedAlgorithms.has(alg);
    
    const adj = {};
    nodes.forEach(n => adj[n.id] = []);
    edges.forEach(e => {
      if (isW) {
        adj[e.from].push({ node: e.to, weight: e.weight ?? 1 });
        if (!e.directed) adj[e.to].push({ node: e.from, weight: e.weight ?? 1 });
      } else {
        adj[e.from].push(e.to);
        if (!e.directed) adj[e.to].push(e.from);
      }
    });

    const startNodeId = initialStartNode || (nodes.length > 0 ? nodes[0].id : null);
    const finalGoalNodeId = targetNode || (nodes.length > 1 ? nodes[nodes.length - 1].id : null);
    
    if (alg === "bfs") return Array.from(bfsGenerator(adj, startNodeId));
    if (alg === "dfs") return Array.from(dfsGenerator(adj, startNodeId));
    if (alg === "dijkstra") return Array.from(dijkstraGenerator(adj, startNodeId, targetNode || null));
    if (alg === "a-star") return Array.from(aStarGenerator(nodes, edges, startNodeId, finalGoalNodeId));
    if (alg === "bellman-ford") return Array.from(bellmanFordGenerator(nodes, edges, startNodeId));
    if (alg === "floyd-warshall") return Array.from(floydWarshallGenerator(nodes, edges));
    if (alg === "prim") return Array.from(primGenerator(adj, startNodeId));
    if (alg === "kruskal") return Array.from(kruskalGenerator(nodes, edges));
    if (alg === "topological-sort") return Array.from(topologicalSortGenerator(adj, nodes.map(n => n.id)));
    if (alg === "kosaraju") return Array.from(kosarajuGenerator(adj, nodes));
    if (alg === "tarjan") return Array.from(tarjanGenerator(adj, nodes));
    if (alg === "ford-fulkerson") {
      const sinkNodeId = nodes.length > 1 ? nodes[nodes.length - 1].id : null;
      return Array.from(fordFulkersonGenerator(nodes, edges, startNodeId, sinkNodeId));
    }
    if (alg === "adjacency-list") return Array.from(adjacencyListGenerator(nodes, edges));
    if (alg === "adjacency-matrix") return Array.from(adjacencyMatrixGenerator(nodes, edges));
    return [];
  }, [nodes, edges, initialStartNode, targetNode]);

  const frames = useMemo(() => generateFrames(algorithm), [generateFrames, algorithm]);
  const frames2 = useMemo(() => generateFrames(comparisonAlgorithm), [generateFrames, comparisonAlgorithm]);

  const hasNegativeWeightError = (algorithm === "dijkstra" || comparisonAlgorithm === "dijkstra") && edges.some(e => Number(e.weight) < 0);

  const onStep = useCallback((step) => {
    // No specific local state needs to be updated here 
    // since the visual representation is fully derived from `frames[engine.currentStep]`.
  }, []);

  const engine = useAnimationEngine({ steps: frames, onStep, initialSpeed: 1000 });
  const engine2 = useAnimationEngine({ steps: frames2, onStep, initialSpeed: 1000 });

  // Handle edge weight updates from GraphCanvas
  const handleUpdateEdgeWeight = useCallback((edgeIdx, newWeight) => {
    setEdges((prev) =>
      prev.map((e, i) => (i === edgeIdx ? { ...e, weight: newWeight } : e))
    );
    engine.reset();
    engine2.reset();
  }, [engine, engine2]);

  // When adding an edge, default weight = 1
  const handleAddEdge = useCallback((edge) => {
    setEdges((prev) => [...prev, { ...edge, weight: 1, directed: isDirected }]);
    engine.reset();
    engine2.reset();
  }, [isDirected, engine, engine2]);

  const handleCustomGraphInput = useCallback((parsedEdges) => {
    if (parsedEdges === null) {
      resetGraph(defaultGraphs[algorithm]?.nodes || [], defaultGraphs[algorithm]?.edges || []);
    } else {
      const nodeIds = Array.from(
        new Set(parsedEdges.flatMap(e => [e.source, e.target]))
      ).sort((a, b) => a - b);
      
      const centerX = 400;
      const centerY = 250;
      const radius = 180;
      const numNodes = nodeIds.length;
      
      const newNodes = nodeIds.map((id, idx) => {
        const angle = (idx * 2 * Math.PI) / (numNodes || 1);
        return {
          id: String(id),
          x: Math.round(centerX + radius * Math.cos(angle)),
          y: Math.round(centerY + radius * Math.sin(angle)),
          label: !isNaN(Number(id)) ? String.fromCharCode(65 + (Number(id) % 26)) : String(id)
        };
      });

      const newEdges = parsedEdges.map(e => ({
        from: String(e.source),
        to: String(e.target),
        weight: e.weight,
        directed: isDirected
      }));

      resetGraph(newNodes, newEdges);
    }
    engine.reset();
    engine2.reset();
  }, [algorithm, isDirected, engine, engine2]);

  const togglePlay = () => {
    if (engine.isPlaying || engine2.isPlaying) {
      engine.pause();
      engine2.pause();
    } else {
      if (engine.currentStep >= frames.length - 1 && frames.length > 0) engine.reset();
      if (engine2.currentStep >= frames2.length - 1 && frames2.length > 0) engine2.reset();
      setTimeout(() => {
        if (frames.length > 0) engine.play();
        if (frames2.length > 0) engine2.play();
      }, 50);
    }
    setIsEditing(false); // If they press play/pause, it shouldn't be in edit mode
  };

  const reset = () => {
    engine.reset();
    engine2.reset();
    setIsEditing(true);
  };

  const stepForward = () => {
    engine.stepForward();
    engine2.stepForward();
    setIsEditing(false);
  };

  const stepBackward = () => {
    engine.stepBackward();
    engine2.stepBackward();
    setIsEditing(false);
  };

  const setSpeed = (s) => {
    engine.setSpeed(s * 1000);
    engine2.setSpeed(s * 1000);
  };

  useVisualizerKeyboard({
    onStart: togglePlay,
    onTogglePlayPause: togglePlay,
    sorting: engine.isPlaying || engine2.isPlaying,
    onReset: reset,
    speed: engine.speed / 1000,
    onSpeedChange: setSpeed,
  });

  const currentFrameData = frames[engine.currentStep] || {};
  const showFloydMatrix = algorithm === "floyd-warshall" && currentFrameData.matrix;
  const nodeLabelById = Object.fromEntries(nodes.map((node) => [node.id, node.label || node.id]));

  const addNode = ({ x, y }) => {
    const usedIds = new Set(nodes.map((node) => node.id));
    let nextId = `${nodes.length}`;
    let counter = nodes.length;
    while (usedIds.has(nextId)) {
      counter += 1;
      nextId = `${counter}`;
    }

    setNodes((current) => [
      ...current,
      {
        id: nextId,
        x,
        y,
        label: String.fromCharCode(65 + (counter % 26)),
      },
    ]);
    engine.reset();
    engine2.reset();
  };

  const moveNode = (id, x, y) => {
    setNodes((current) =>
      current.map((node) =>
        node.id === id
          ? { ...node, x, y }
          : node
      )
    );
  };

  const removeNode = (id) => {
    updateGraph(
      (current) => current.filter((node) => node.id !== id),
      (current) => current.filter((edge) => edge.from !== id && edge.to !== id)
    );
    engine.reset();
    engine2.reset();
  };

  const removeEdge = (edgeIndex) => {
    setEdges((current) => current.filter((_, index) => index !== edgeIndex));
    engine.reset();
    engine2.reset();
  };

  const clearGraph = useCallback(() => {
    resetGraph([], []);
    engine.reset();
    engine2.reset();
  }, [resetGraph, engine, engine2]);

  const generateRandomGraph = useCallback(() => {
    const input = window.prompt("Enter number of nodes (max 20):", "6");
    if (!input) return;
    const count = parseInt(input, 10);
    if (isNaN(count) || count < 2 || count > 20) {
      alert("Please enter a valid number between 2 and 20.");
      return;
    }

    const newNodes = [];
    for (let i = 0; i < count; i++) {
      newNodes.push({
        id: String(i),
        x: Math.floor(Math.random() * 600) + 100,
        y: Math.floor(Math.random() * 300) + 50,
        label: String(i),
      });
    }

    const newEdges = [];
    for (let i = 1; i < count; i++) {
      const parent = Math.floor(Math.random() * i);
      newEdges.push({
        from: String(parent),
        to: String(i),
        weight: isWeighted ? Math.floor(Math.random() * 20) + 1 : 1,
        directed: isDirected
      });
    }

    const extraEdges = Math.floor(count * 0.5);
    for (let i = 0; i < extraEdges; i++) {
      const fromIdx = Math.floor(Math.random() * count);
      const toIdx = Math.floor(Math.random() * count);
      if (fromIdx !== toIdx) {
        const exists = newEdges.some(e => (e.from === String(fromIdx) && e.to === String(toIdx)) || (!isDirected && e.from === String(toIdx) && e.to === String(fromIdx)));
        if (!exists) {
          newEdges.push({
            from: String(fromIdx),
            to: String(toIdx),
            weight: isWeighted ? Math.floor(Math.random() * 20) + 1 : 1,
            directed: isDirected
          });
        }
      }
    }

    resetGraph(newNodes, newEdges);
    engine.reset();
    engine2.reset();
  }, [isWeighted, isDirected, engine, engine2, resetGraph]);

  const reverseEdge = (edgeIndex) => {
    setEdges((current) =>
      current.map((edge, index) =>
        index === edgeIndex ? { ...edge, from: edge.to, to: edge.from } : edge,
      ),
    );
    engine.reset();
    engine2.reset();
  };

  return (
    <div className="mt-8 space-y-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                isEditing 
                  ? "bg-primary text-white" 
                  : "bg-surface-100 text-surface-600 hover:bg-surface-200 dark:bg-surface-800 dark:text-surface-300"
              }`}
            >
              <Settings2 className="h-4 w-4" />
              {isEditing ? "Editing Mode" : "Visualization Mode"}
            </button>

            {!isEditing && (
              <div className="flex items-center gap-2 rounded-lg bg-surface-100 px-3 py-1.5 dark:bg-surface-800">
                <label className="text-sm font-medium text-surface-600 dark:text-surface-300">Compare:</label>
                <select
                  value={comparisonAlgorithm}
                  onChange={(e) => {
                    setComparisonAlgorithm(e.target.value);
                    engine.reset();
                    engine2.reset();
                  }}
                  className="bg-transparent text-sm font-bold text-primary outline-none"
                >
                  <option value="">None</option>
                  {Object.keys(defaultGraphs).map(alg => (
                    <option key={alg} value={alg} disabled={alg === algorithm}>
                      {alg.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {isEditing && (
              <>
                <button
                  onClick={clearGraph}
                  className="flex items-center gap-2 rounded-lg bg-red-100 px-3 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-200 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40"
                >
                  <Trash2 className="h-4 w-4" />
                  Clear Graph
                </button>
                <button
                  onClick={generateRandomGraph}
                  className="flex items-center gap-2 rounded-lg bg-indigo-100 px-3 py-1.5 text-sm font-medium text-indigo-700 transition-colors hover:bg-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400 dark:hover:bg-indigo-900/50"
                >
                  <Wand2 className="h-4 w-4" />
                  Random Graph
                </button>
              </>
            )}

            <button
              onClick={async () => {
                if (!canvasContainerRef.current || isExporting) return;
                setIsExporting(true);
                try {
                  const html2canvas = (await import("html2canvas")).default;
                  const canvas = await html2canvas(canvasContainerRef.current, {
                    backgroundColor: document.documentElement.classList.contains("dark") ? "#0f172a" : "#ffffff",
                    scale: 2, // High resolution
                  });
                  const dataUrl = canvas.toDataURL("image/png");
                  const a = document.createElement("a");
                  a.href = dataUrl;
                  a.download = `algobuddy-${algorithm}-graph.png`;
                  a.click();
                } catch (err) {
                  console.error("Export failed", err);
                } finally {
                  setIsExporting(false);
                }
              }}
              disabled={isExporting}
              className="flex items-center gap-2 rounded-lg bg-green-100 px-3 py-1.5 text-sm font-medium text-green-700 transition-colors hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50"
            >
              <Download className="h-4 w-4" />
              {isExporting ? "Exporting..." : "Export PNG"}
            </button>
            
            <button
              onClick={() => setIsThemeModalOpen(true)}
              className="flex items-center gap-2 rounded-lg bg-purple-100 px-3 py-1.5 text-sm font-medium text-purple-700 transition-colors hover:bg-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:hover:bg-purple-900/50"
            >
              <Palette className="h-4 w-4" />
              Color Themes
            </button>

            {["dijkstra", "a-star", "ford-fulkerson"].includes(algorithm) && (
              <div className="flex items-center gap-2 ml-2">
                <label className="text-sm font-medium text-surface-600 dark:text-surface-300">Target Node:</label>
                <select
                  value={targetNode}
                  onChange={(e) => {
                    setTargetNode(e.target.value);
                    engine.reset();
                  }}
                  className="bg-surface-50 border border-surface-200 dark:bg-surface-800 dark:border-surface-600 rounded px-2 py-1 text-sm text-surface-900 dark:text-white"
                >
                  {algorithm !== "a-star" && <option value="">None (Traverse all)</option>}
                  {nodes.map(n => (
                    <option key={n.id} value={n.id}>{n.label || n.id}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Weighted badge */}
            {isWeighted && (
              <span className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 px-3 py-1.5 text-xs font-semibold text-yellow-600 dark:text-yellow-400">
                Weighted
              </span>
            )}

            {/* Directed/Undirected Toggle */}
            <button
              onClick={() => {
                if (!isEditing) return;
                const nextIsDirected = !isDirected;
                setIsDirectedManual(nextIsDirected);
                setEdges(prev => prev.map(e => ({ ...e, directed: nextIsDirected })));
                engine.reset();
              }}
              disabled={!isEditing}
              className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${
                isDirected 
                  ? "border-primary/30 bg-primary/10 text-primary" 
                  : "border-surface-400/30 bg-surface-400/10 text-surface-600 dark:text-surface-400"
              } ${isEditing ? "hover:bg-primary/20 cursor-pointer" : "cursor-default"}`}
            >
              {isDirected ? "Directed" : "Undirected"}
            </button>



            {!isEditing && (
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-2 rounded-lg bg-surface-100 px-3 py-1.5 text-sm font-medium text-surface-600 dark:bg-surface-800 dark:text-surface-300">
                  <Info className="h-4 w-4 text-primary" />
                  {currentFrameData.description || "Ready to start"}
                </div>
                {currentFrameData.queue && currentFrameData.queue.length > 0 && (
                  <div className="flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-bold text-primary dark:bg-blue-900/20 dark:text-[#c27cf7]">
                    Queue: [{currentFrameData.queue.join(", ")}]
                  </div>
                )}
                {currentFrameData.stack && currentFrameData.stack.length > 0 && (
                  <div className="flex items-center gap-2 rounded-lg bg-purple-50 px-3 py-1.5 text-xs font-bold text-purple-600 dark:bg-purple-900/20 dark:text-[#c27cf7]">
                    Stack: [{currentFrameData.stack.join(", ")}]
                  </div>
                )}
                {currentFrameData.distances && (
                  <div className="flex items-center gap-2 rounded-lg bg-yellow-50 px-3 py-1.5 text-xs font-bold text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400">
                    Distances: {Object.entries(currentFrameData.distances)
                      .map(([k, v]) => `${nodeLabelById[k] || k}:${v === Infinity ? "∞" : v}`)
                      .join(", ")}
                  </div>
                )}
                {currentFrameData.pq && (
                  <div className="flex items-center gap-2 rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400">
                    PQ: [{currentFrameData.pq.map(item => `(${nodeLabelById[item.node] || item.node}:${item.dist})`).join(", ")}]
                  </div>
                )}
                {currentFrameData.intermediate && (
                  <div className="flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700 dark:bg-amber-900/20 dark:text-amber-300">
                    k: {nodes.find((node) => node.id === currentFrameData.intermediate)?.label || currentFrameData.intermediate}
                  </div>
                )}
                {currentFrameData.result && currentFrameData.result.length > 0 && (
                  <div className="flex items-center gap-2 rounded-lg bg-success/10 px-3 py-1.5 text-xs font-bold text-success">
                    Order: {currentFrameData.result.join(" → ")}
                  </div>
                )}
                {currentFrameData.sccs && currentFrameData.sccs.length > 0 && (
                  <div className="flex items-center gap-2 rounded-lg bg-cyan-50 px-3 py-1.5 text-xs font-bold text-cyan-700 dark:bg-cyan-900/20 dark:text-cyan-400">
                    SCCs: {currentFrameData.sccs.map(scc => `[${scc.join(",")}]`).join(" ")}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <div className={`grid gap-6 items-stretch min-h-[420px] ${comparisonAlgorithm ? 'lg:grid-cols-2' : 'lg:grid-cols-1'}`}>
          <div ref={canvasContainerRef} className="border rounded-xl overflow-hidden bg-white dark:bg-surface-900 border-surface-200 dark:border-surface-800 flex flex-col">
            {comparisonAlgorithm && <div className="bg-surface-50 p-2 text-center text-xs font-bold border-b dark:border-surface-800 text-primary">{algorithm.toUpperCase()}</div>}
            <GraphCanvas
              nodes={nodes}
              edges={edges}
              onAddNode={addNode}
              onAddEdge={handleAddEdge}
              onRemoveNode={removeNode}
              onRemoveEdge={removeEdge}
              onReverseEdge={reverseEdge}
              onMoveNode={moveNode}
              onUpdateEdgeWeight={handleUpdateEdgeWeight}
              animationState={!isEditing ? currentFrameData : {}}
              interactive={isEditing}
              isWeighted={isWeighted}
              isDirected={isDirected}
              visitedSet={currentFrameData.visitedNodes}
              currentNode={currentFrameData.currentNode}
              className="w-full h-full flex-1"
            />
          </div>
          {comparisonAlgorithm && (
            <div className="border rounded-xl overflow-hidden bg-white dark:bg-surface-900 border-surface-200 dark:border-surface-800 flex flex-col">
              <div className="bg-surface-50 p-2 text-center text-xs font-bold border-b dark:border-surface-800 text-primary">{comparisonAlgorithm.toUpperCase()}</div>
              <GraphCanvas
                nodes={nodes}
                edges={edges}
                onAddNode={addNode}
                onAddEdge={handleAddEdge}
                onRemoveNode={removeNode}
                onRemoveEdge={removeEdge}
                onReverseEdge={reverseEdge}
                onMoveNode={moveNode}
                onUpdateEdgeWeight={handleUpdateEdgeWeight}
                animationState={!isEditing ? (frames2[engine2.currentStep] || {}) : {}}
                interactive={isEditing}
                isWeighted={weightedAlgorithms.has(comparisonAlgorithm)}
                isDirected={isDirectedManual !== null ? isDirectedManual : directedAlgorithms.has(comparisonAlgorithm)}
                visitedSet={(frames2[engine2.currentStep] || {}).visitedNodes}
                currentNode={(frames2[engine2.currentStep] || {}).currentNode}
                className="w-full h-full flex-1"
              />
            </div>
          )}
        </div>

        {/* Controls Bar */}
        <div className="flex flex-col gap-2">
          {hasNegativeWeightError && (
            <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm font-medium text-red-800 dark:bg-red-900/20 dark:text-red-400">
              <AlertTriangle className="h-5 w-5 flex-shrink-0" />
              <p>
                <strong>Dijkstra's Algorithm cannot handle negative edge weights.</strong> It assumes all weights are non-negative to guarantee shortest paths. Please use <strong>Bellman-Ford</strong> instead, or remove the negative weights.
              </p>
            </div>
          )}
          <PlaybackControls
            isPlaying={engine.isPlaying}
            onPlayPause={togglePlay}
            speed={engine.speed / 1000}
            onSpeedChange={(s) => engine.setSpeed(s * 1000)}
            onStepForward={stepForward}
            onStepBackward={stepBackward}
            onReset={reset}
            progressText={`${Math.max(engine.currentStep, engine2.currentStep) + 1} / ${Math.max(frames.length, frames2.length) || 1}`}
            disabled={(frames.length === 0 && frames2.length === 0) || hasNegativeWeightError}
          />
        </div>

      {/* Info & Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          {/* Complexity Card */}
          <div className="rounded-2xl border border-surface-200 bg-white p-5 shadow-sm dark:border-surface-800 dark:bg-surface-900">
            <div className="mb-4 flex items-center gap-2 text-primary">
              <BarChart3 className="h-5 w-5" />
              <h3 className="font-bold">Complexity Analysis</h3>
            </div>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={complexityData[algorithm]} layout="vertical" margin={{ left: -20, right: 20 }}>
                  <XAxis type="number" hide domain={[0, 100]} />
                  <YAxis dataKey="name" type="category" stroke="currentColor" className="text-[10px] text-surface-500" />
                  <Tooltip 
                    cursor={{ fill: 'transparent' }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="rounded-lg border border-surface-200 bg-white p-2 text-xs shadow-lg dark:border-surface-800 dark:bg-surface-950">
                            <p className="font-bold text-primary">{payload[0].payload.full}</p>
                            <p className="font-mono font-bold text-surface-900 dark:text-white">{payload[0].payload.label}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                    {complexityData[algorithm].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? "var(--color-primary)" : "var(--color-success)"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-surface-500">Worst Case Time</span>
                <span className="font-mono font-bold text-primary">{complexityData[algorithm][0].label}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-surface-500">Worst Case Space</span>
                <span className="font-mono font-bold text-success">{complexityData[algorithm][1].label}</span>
              </div>
            </div>
          </div>

          {/* Algorithm Comparison */}
          <div className="rounded-2xl border border-surface-200 bg-white p-5 shadow-sm dark:border-surface-800 dark:bg-surface-900">
            <h3 className="mb-4 text-sm font-bold text-surface-900 dark:text-white">Algorithm Comparison</h3>
            <div className="h-40 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-surface-200)" />
                  <XAxis dataKey="name" stroke="currentColor" className="text-[10px] text-surface-500" />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--color-surface-950)', border: 'none', borderRadius: '8px', fontSize: '10px' }}
                    itemStyle={{ color: 'white' }}
                  />
                  <Bar dataKey="time" fill="var(--color-primary)" radius={[4, 4, 0, 0]} name="Time Complexity Score" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2 text-[10px] text-surface-500 leading-tight">
              Higher score indicates more operations or complex data structures involved in the worst case.
            </p>
          </div>
        </div>

      {/* Adjacency Representation & Custom Input */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-surface-200 bg-white p-5 shadow-sm dark:border-surface-800 dark:bg-surface-900">
          <h3 className="mb-4 text-sm font-bold text-surface-900 dark:text-white">Adjacency Representation</h3>
          <AdjacencyPanel
            nodes={nodes}
            edges={edges}
            isDirected={isDirected}
            isWeighted={isWeighted}
          />
          <div className="mt-4 space-y-4">
            {showFloydMatrix && (
              <div>
                <h4 className="mb-2 text-[10px] font-bold uppercase tracking-wider text-surface-500">Floyd-Warshall Distance Matrix</h4>
                <div className="overflow-auto rounded-lg bg-surface-50 p-3 font-mono text-[11px] dark:bg-surface-950">
                  <table className="w-full border-collapse text-center">
                    <thead>
                      <tr>
                        <th className="p-1"></th>
                        {currentFrameData.matrixNodes.map((nodeId) => (
                          <th
                            key={nodeId}
                            className={`p-1 ${
                              currentFrameData.intermediate === nodeId
                                ? "text-amber-600 dark:text-amber-300"
                                : "text-primary"
                            }`}
                          >
                            {nodeLabelById[nodeId]}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {currentFrameData.matrixNodes.map((rowId) => (
                        <tr key={rowId}>
                          <td className="p-1 font-bold text-primary">{nodeLabelById[rowId]}</td>
                          {currentFrameData.matrixNodes.map((colId) => {
                            const isFocus = currentFrameData.row === rowId && currentFrameData.col === colId;
                            const isUpdated =
                              currentFrameData.updatedCell?.row === rowId &&
                              currentFrameData.updatedCell?.col === colId;
                            const value = currentFrameData.matrix[rowId][colId];
                            return (
                              <td
                                key={colId}
                                className={`border border-surface-200 p-1 dark:border-surface-800 ${
                                  isUpdated
                                    ? "bg-success/20 text-success"
                                    : isFocus
                                      ? "bg-primary/10 text-primary"
                                      : ""
                                }`}
                              >
                                {value === Infinity ? "INF" : value}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            <div>
              <h4 className="mb-2 text-[10px] font-bold uppercase tracking-wider text-surface-500">Adjacency List</h4>
              <div className="max-h-64 overflow-auto rounded-lg bg-surface-50 p-3 font-mono text-[11px] dark:bg-surface-950">
                {nodes.map(node => {
                  const neighbors = edges
                    .filter(e => e.from === node.id || (!e.directed && e.to === node.id))
                    .map(e => {
                      const neighbor = e.from === node.id ? e.to : e.from;
                      const label = nodeLabelById[neighbor] || neighbor;
                      return isWeighted ? `${label}(${e.weight})` : label;
                    });
                  return (
                    <div key={node.id} className="mb-1">
                      <span className="text-primary font-bold">{node.label}</span>: [{neighbors.join(", ")}]
                    </div>
                  );
                })}
              </div>
            </div>
            <div>
              <h4 className="mb-2 text-[10px] font-bold uppercase tracking-wider text-surface-500">Adjacency Matrix</h4>
              <div className="overflow-auto rounded-lg bg-surface-50 p-3 font-mono text-[11px] dark:bg-surface-950">
                <table className="w-full border-collapse text-center">
                  <thead>
                    <tr>
                      <th className="p-1"></th>
                      {nodes.map(n => <th key={n.id} className="p-1 text-primary">{n.label}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {nodes.map(row => (
                      <tr key={row.id}>
                        <td className="p-1 font-bold text-primary">{row.label}</td>
                        {nodes.map(col => {
                          const edge = edges.find(e => 
                            (e.from === row.id && e.to === col.id) || 
                            (!e.directed && ((e.from === row.id && e.to === col.id) || (e.from === col.id && e.to === row.id)))
                          );
                          return (
                            <td key={col.id} className="border border-surface-200 p-1 dark:border-surface-800">
                              {edge ? (isWeighted ? edge.weight : 1) : 0}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <CustomInputPanel
            inputType="graph"
            onApply={handleCustomGraphInput}
            currentData={edges}
          />
        </div>
        </div>
      </div>
      
      <ThemeSettingsModal 
        isOpen={isThemeModalOpen} 
        onClose={() => setIsThemeModalOpen(false)} 
      />
      </div>
    </div>
  );
}
