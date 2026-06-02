"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  AlertCircle,
  Plus,
  Search
} from "lucide-react";
import {
  VisualizerCard,
  VisualizerInteractiveLayout,
} from "@/app/visualizer/components/VisualizerInteractiveLayout";
import usePlayback from "@/app/hooks/usePlayback";
import useVisualizerKeyboard from "@/app/hooks/useVisualizerKeyboard";
import PlaybackControls from "@/app/components/ui/PlaybackControls";
import useVisualizerReset from "@/app/hooks/useVisualizerReset";

// Internal Trie Node Class for coordinate mapping
class TrieNode {
  constructor(char = "", id = "root") {
    this.id = id;
    this.char = char;
    this.children = {}; // char -> TrieNode
    this.isEndOfWord = false;
    this.x = 400;
    this.y = 60;
  }
}

export default function TrieAnimation() {
  const [root, setRoot] = useState(null);
  const [nodeIdCounter, setNodeIdCounter] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [message, setMessage] = useState("Add some words to build your Prefix Tree! Click 'Insert' to start.");
  const { speed, setSpeed } = usePlayback(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [steps, setSteps] = useState([]);
  const [currentStepIdx, setCurrentStepIdx] = useState(-1);

  // Setup initial words for a stunning first-time impression
  useEffect(() => {
    let counter = 0;
    const newRoot = new TrieNode("", "root");

    const addWord = (trieRoot, word) => {
      let node = trieRoot;
      for (let char of word) {
        if (!node.children[char]) {
          counter++;
          node.children[char] = new TrieNode(char, `node-${counter}`);
        }
        node = node.children[char];
      }
      node.isEndOfWord = true;
    };

    addWord(newRoot, "cat");
    addWord(newRoot, "car");
    addWord(newRoot, "dog");

    setNodeIdCounter(counter);
    setRoot(newRoot);
  }, []);

  const timerRef = useRef(null);
  useVisualizerReset(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setRoot(null);
    setNodeIdCounter(0);
    setInputValue("");
    setMessage("...");
    setIsAnimating(false);
    setSteps([]);
    setCurrentStepIdx(-1);
  });

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // 1. Recursive symmetric layout calculator (Reingold-Tilford style)
  const computeTreeLayout = (trieRoot) => {
    if (!trieRoot) return { nodesList: [], edgesList: [] };

    let leafCount = 0;
    const nodesList = [];
    const edgesList = [];

    const layoutDFS = (node, level = 0) => {
      const childrenKeys = Object.keys(node.children).sort();
      const childrenList = childrenKeys.map(k => node.children[k]);

      node.y = 80 + level * 90;

      if (childrenList.length === 0) {
        // Leaf node
        node.x = 60 + leafCount * 90;
        leafCount++;
      } else {
        // Compute layout for children recursively first
        childrenList.forEach(child => layoutDFS(child, level + 1));

        // Parent X is average of its first and last child X coordinates
        const firstX = childrenList[0].x;
        const lastX = childrenList[childrenList.length - 1].x;
        node.x = (firstX + lastX) / 2;
      }

      // Read visual highlight state
      const currentStep = steps[currentStepIdx];
      const state = currentStep?.highlightedNodes?.[node.id] || null;

      nodesList.push({
        id: node.id,
        char: node.char,
        x: node.x,
        y: node.y,
        isEndOfWord: node.isEndOfWord,
        state: state
      });

      // Map edges to children
      childrenList.forEach(child => {
        edgesList.push({
          x1: node.x,
          y1: node.y + 20,
          x2: child.x,
          y2: child.y - 20,
          char: child.char,
          isActive: currentStep?.highlightedEdges?.[`${node.id}->${child.id}`] || false
        });
      });
    };

    layoutDFS(trieRoot, 0);
    return { nodesList, edgesList };
  };

  // Render variables
  const { nodesList: renderNodes, edgesList: renderEdges } = computeTreeLayout(root);

  // Dynamic SVG dimensions for responsive scaling
  const getSvgDimensions = () => {
    if (renderNodes.length === 0) return { width: 800, height: 400, offset: 0 };
    const xCoords = renderNodes.map(n => n.x);
    const yCoords = renderNodes.map(n => n.y);

    const minX = Math.min(...xCoords);
    const maxX = Math.max(...xCoords);
    const maxY = Math.max(...yCoords);

    const padding = 60;
    const computedWidth = maxX - minX + padding * 2;
    const computedHeight = maxY + padding * 1.5;

    return {
      width: Math.max(800, computedWidth),
      height: Math.max(380, computedHeight),
      offset: minX - padding
    };
  };

  const svgDimensions = getSvgDimensions();

  // Animation logic play loop
  useEffect(() => {
    if (!isAnimating || steps.length === 0) return;

    if (currentStepIdx >= steps.length) {
      setIsAnimating(false);
      return;
    }

    const currentStep = steps[currentStepIdx];
    setMessage(currentStep.explanation);

    timerRef.current = setTimeout(() => {
      if (currentStepIdx < steps.length - 1) {
        setCurrentStepIdx(prev => prev + 1);
      } else {
        setIsAnimating(false);
        const finalStep = steps[steps.length - 1];
        setMessage(finalStep.explanation);
      }
    }, 1800 / speed);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isAnimating, currentStepIdx, steps, speed]);

  // Actions
  const pauseVisualizer = () => {
    setIsAnimating(false);
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const startVisualizer = () => {
    if (steps.length === 0) return;
    setIsAnimating(true);
    let nextIdx = currentStepIdx === -1 || currentStepIdx >= steps.length - 1 ? 0 : currentStepIdx + 1;
    setCurrentStepIdx(nextIdx);
  };

  const stepForward = () => {
    setIsAnimating(false);
    if (currentStepIdx < steps.length - 1) {
      setCurrentStepIdx(prev => prev + 1);
    }
  };

  const stepBackward = () => {
    setIsAnimating(false);
    if (currentStepIdx > 0) {
      setCurrentStepIdx(prev => prev - 1);
    }
  };

  const resetPlayback = () => {
    setIsAnimating(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    setCurrentStepIdx(-1);
    setMessage("Playback reset. Click play to begin.");
  };

  const handleClearTree = () => {
    setIsAnimating(false);
    setCurrentStepIdx(-1);
    setSteps([]);
    setRoot(new TrieNode("", "root"));
    setNodeIdCounter(0);
    setMessage("Trie cleared. Type a word and click Insert!");
  };

  // Pre-calculated animation generator for INSERT
  const triggerInsert = () => {
    const word = inputValue.trim().toLowerCase();
    if (!word || !/^[a-z]+$/.test(word)) {
      setMessage("⚠️ Please enter a valid lowercase word (a-z) without numbers or symbols.");
      return;
    }

    setIsAnimating(false);
    setInputValue("");

    const newSteps = [];
    let tempRoot = JSON.parse(JSON.stringify(root)); // Deep copy to simulate insertion coordinates

    // Step 0: Starting state
    newSteps.push({
      highlightedNodes: { root: "visiting" },
      highlightedEdges: {},
      explanation: `Begin insertion of word "${word}". Start at the Root node.`
    });

    let node = tempRoot;
    let originalNode = root; // pointer to follow real node IDs
    let counter = nodeIdCounter;

    for (let i = 0; i < word.length; i++) {
      const char = word[i];
      const visitedSoFar = word.slice(0, i + 1);
      const isLast = i === word.length - 1;

      const activeHighlights = {};
      const activeEdges = {};

      // Trace back the current path
      let traceNode = tempRoot;
      activeHighlights[traceNode.id] = "active";
      for (let j = 0; j < i; j++) {
        const nextNode = traceNode.children[word[j]];
        activeHighlights[nextNode.id] = "active";
        activeEdges[`${traceNode.id}->${nextNode.id}`] = true;
        traceNode = nextNode;
      }

      // Check if child node exists
      if (node.children[char]) {
        const childNode = node.children[char];
        activeHighlights[childNode.id] = "visiting";
        activeEdges[`${node.id}->${childNode.id}`] = true;

        newSteps.push({
          highlightedNodes: { ...activeHighlights },
          highlightedEdges: { ...activeEdges },
          explanation: `Character '${char}' already exists under node '${node.char || "root"}'. Follow edge to character node '${char}'.`
        });

        node = childNode;
      } else {
        // Node does not exist, create it!
        counter++;
        const newChild = new TrieNode(char, `node-${counter}`);
        node.children[char] = newChild;

        activeHighlights[newChild.id] = "visiting";
        activeEdges[`${node.id}->${newChild.id}`] = true;

        newSteps.push({
          highlightedNodes: { ...activeHighlights },
          highlightedEdges: { ...activeEdges },
          explanation: `Character '${char}' is missing under node '${node.char || "root"}'. Create a new node for '${char}' and link it.`
        });

        node = newChild;
      }

      if (isLast) {
        node.isEndOfWord = true;
        const finalHighlights = { ...activeHighlights };
        finalHighlights[node.id] = "matched";

        newSteps.push({
          highlightedNodes: finalHighlights,
          highlightedEdges: { ...activeEdges },
          explanation: `Word "${word}" insertion complete. Mark final character node '${char}' as End of Word (isEndOfWord = true).`
        });
      }
    }

    // Update real tree state
    const updateRealTree = () => {
      let rNode = root;
      let c = nodeIdCounter;
      for (let char of word) {
        if (!rNode.children[char]) {
          c++;
          rNode.children[char] = new TrieNode(char, `node-${c}`);
        }
        rNode = rNode.children[char];
      }
      rNode.isEndOfWord = true;
      setNodeIdCounter(c);
      setRoot(root);
    };

    updateRealTree();
    setSteps(newSteps);
    setCurrentStepIdx(0);
    setIsAnimating(true);
  };

  // Pre-calculated animation generator for SEARCH
  const triggerSearch = () => {
    const word = inputValue.trim().toLowerCase();
    if (!word || !/^[a-z]+$/.test(word)) {
      setMessage("⚠️ Please enter a lowercase string to search.");
      return;
    }

    setIsAnimating(false);
    setInputValue("");

    const newSteps = [];

    newSteps.push({
      highlightedNodes: { root: "visiting" },
      highlightedEdges: {},
      explanation: `Search for word "${word}". Start matching characters at the Root node.`
    });

    let node = root;
    let found = true;

    for (let i = 0; i < word.length; i++) {
      const char = word[i];
      const isLast = i === word.length - 1;

      const activeHighlights = {};
      const activeEdges = {};

      // Trace highlighted active path
      let traceNode = root;
      activeHighlights[traceNode.id] = "active";
      for (let j = 0; j < i; j++) {
        const nextNode = traceNode.children[word[j]];
        activeHighlights[nextNode.id] = "active";
        activeEdges[`${traceNode.id}->${nextNode.id}`] = true;
        traceNode = nextNode;
      }

      if (node.children[char]) {
        const childNode = node.children[char];
        activeHighlights[childNode.id] = "visiting";
        activeEdges[`${node.id}->${childNode.id}`] = true;

        newSteps.push({
          highlightedNodes: { ...activeHighlights },
          highlightedEdges: { ...activeEdges },
          explanation: `Found letter '${char}' under node '${node.char || "root"}'. Matching prefix: "${word.slice(0, i + 1)}".`
        });

        node = childNode;
      } else {
        found = false;
        // Mark active node as error
        activeHighlights[node.id] = "error";
        newSteps.push({
          highlightedNodes: { ...activeHighlights },
          highlightedEdges: { ...activeEdges },
          explanation: `Letter '${char}' is missing under node '${node.char || "root"}'. Searching failed: "${word}" is not in the Trie.`
        });
        break;
      }

      if (isLast && found) {
        const finalHighlights = { ...activeHighlights };
        if (node.isEndOfWord) {
          finalHighlights[node.id] = "matched";
          newSteps.push({
            highlightedNodes: finalHighlights,
            highlightedEdges: { ...activeEdges },
            explanation: `Found letter '${char}' and isEndOfWord = true. Success: Word "${word}" exists in the Trie!`
          });
        } else {
          finalHighlights[node.id] = "error";
          newSteps.push({
            highlightedNodes: finalHighlights,
            highlightedEdges: { ...activeEdges },
            explanation: `Traversed all letters, but isEndOfWord = false. Word "${word}" is NOT in the Trie (Prefix match only).`
          });
        }
      }
    }

    setSteps(newSteps);
    setCurrentStepIdx(0);
    setIsAnimating(true);
  };

  // Pre-calculated animation generator for PREFIX SEARCH
  const triggerPrefixSearch = () => {
    const prefix = inputValue.trim().toLowerCase();
    if (!prefix || !/^[a-z]+$/.test(prefix)) {
      setMessage("⚠️ Please enter a lowercase prefix to search.");
      return;
    }

    setIsAnimating(false);
    setInputValue("");

    const newSteps = [];

    newSteps.push({
      highlightedNodes: { root: "visiting" },
      highlightedEdges: {},
      explanation: `Check startsWith prefix "${prefix}". Start at the Root node.`
    });

    let node = root;
    let found = true;

    for (let i = 0; i < prefix.length; i++) {
      const char = prefix[i];
      const isLast = i === prefix.length - 1;

      const activeHighlights = {};
      const activeEdges = {};

      let traceNode = root;
      activeHighlights[traceNode.id] = "active";
      for (let j = 0; j < i; j++) {
        const nextNode = traceNode.children[prefix[j]];
        activeHighlights[nextNode.id] = "active";
        activeEdges[`${traceNode.id}->${nextNode.id}`] = true;
        traceNode = nextNode;
      }

      if (node.children[char]) {
        const childNode = node.children[char];
        activeHighlights[childNode.id] = "visiting";
        activeEdges[`${node.id}->${childNode.id}`] = true;

        newSteps.push({
          highlightedNodes: { ...activeHighlights },
          highlightedEdges: { ...activeEdges },
          explanation: `Letter '${char}' matches. Prefix path exists for: "${prefix.slice(0, i + 1)}".`
        });

        node = childNode;
      } else {
        found = false;
        activeHighlights[node.id] = "error";
        newSteps.push({
          highlightedNodes: { ...activeHighlights },
          highlightedEdges: { ...activeEdges },
          explanation: `Letter '${char}' missing under node '${node.char || "root"}'. Prefix check failed: "${prefix}" does not exist in the Trie.`
        });
        break;
      }

      if (isLast && found) {
        const finalHighlights = { ...activeHighlights };
        finalHighlights[node.id] = "matched";
        newSteps.push({
          highlightedNodes: finalHighlights,
          highlightedEdges: { ...activeEdges },
          explanation: `All letters in prefix "${prefix}" successfully traversed. Success: Prefix exists in the Trie!`
        });
      }
    }

    setSteps(newSteps);
    setCurrentStepIdx(0);
    setIsAnimating(true);
  };

  useVisualizerKeyboard({
    onStepForward: stepForward,
    onStepBackward: stepBackward,
    onTogglePlay: isAnimating ? pauseVisualizer : startVisualizer,
    onReset: resetPlayback,
    onSpeedChange: setSpeed,
    speed: speed,
    sorting: isAnimating,
    sorted: false,
    enabled: true,
  });

  return (
    <VisualizerInteractiveLayout>
      <VisualizerCard>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_auto]">
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter word (a-z)"
                className="flex-1 rounded-lg border p-2 transition-all focus:border-transparent focus:ring-2 focus:ring-[#a435f0] dark:bg-gray-700 uppercase"
                disabled={isAnimating}
                onKeyDown={(e) => e.key === "Enter" && triggerInsert()}
              />
              <button
                onClick={triggerInsert}
                disabled={isAnimating}
                className="flex items-center gap-1 rounded-lg bg-[#a435f0] px-4 py-2 text-white transition-colors hover:bg-[#8f2cd6] disabled:opacity-50"
              >
                <Plus className="w-4 h-4" /> Insert
              </button>
            </div>
            
            <div className="flex gap-2 mt-2">
              <button
                onClick={triggerSearch}
                disabled={isAnimating}
                className="flex flex-1 justify-center items-center gap-1 rounded-lg border border-[#a435f0] text-[#a435f0] px-4 py-2 transition-colors hover:bg-[#a435f0] hover:text-white disabled:opacity-50 dark:hover:bg-[#a435f0] dark:hover:text-white"
              >
                <Search className="w-4 h-4" /> Search
              </button>
              <button
                onClick={triggerPrefixSearch}
                disabled={isAnimating}
                className="flex flex-1 justify-center items-center gap-1 rounded-lg border border-[#a435f0] text-[#a435f0] px-4 py-2 transition-colors hover:bg-[#a435f0] hover:text-white disabled:opacity-50 dark:hover:bg-[#a435f0] dark:hover:text-white"
              >
                Prefix Match
              </button>
            </div>
          </div>
          
          <div className="flex flex-col gap-2 min-w-[120px]">
            <button
              onClick={handleClearTree}
              className="w-full rounded-lg bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700 h-[42px]"
            >
              Clear Trie
            </button>
            <div className="w-full h-full flex items-end">
              <div className="w-full rounded-lg bg-gray-100 p-2 text-center dark:bg-gray-700">
                <div className="text-xs text-gray-500 dark:text-gray-400">Total Nodes</div>
                <div className="font-bold text-[#a435f0] dark:text-[#d38cff]">{nodeIdCounter}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <PlaybackControls 
            isPlaying={isAnimating}
            onPlayPause={isAnimating ? pauseVisualizer : startVisualizer}
            onStepForward={stepForward}
            onStepBackward={stepBackward}
            onReset={resetPlayback}
            speed={speed}
            onSpeedChange={setSpeed}
            disabled={steps.length === 0}
            showPlayPause={true}
          />
        </div>
      </VisualizerCard>

      <VisualizerCard
        className={
          message.includes("Success") || message.includes("complete")
            ? "border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/30"
            : message.includes("failed") || message.includes("missing")
              ? "border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/30"
              : isAnimating
                ? "border-[#a435f0]/30 bg-[#a435f0]/10 dark:border-[#a435f0]/50 dark:bg-[#a435f0]/20"
                : ""
        }
      >
        <div className="flex justify-between items-center text-xs text-gray-500 mb-2">
          <span>Current Action Explanation</span>
          <span className="font-bold bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
            Step {currentStepIdx !== -1 ? currentStepIdx + 1 : 0} / {steps.length || 0}
          </span>
        </div>
        <p className="text-center font-medium text-lg min-h-[28px]">{message}</p>
      </VisualizerCard>

      <VisualizerCard>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Trie Visualization</h2>
          <div className="flex flex-wrap gap-2 text-xs">
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span className="text-gray-500 dark:text-gray-400">Current</span>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg">
              <span className="w-2.5 h-2.5 rounded-full bg-[#a435f0]"></span>
              <span className="text-gray-500 dark:text-gray-400">Match Found</span>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
              <span className="text-gray-500 dark:text-gray-400">Error</span>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg">
              <span className="w-2.5 h-2.5 rounded-full bg-transparent border-2 border-dashed border-[#a435f0]"></span>
              <span className="text-gray-500 dark:text-gray-400">End of Word</span>
            </div>
          </div>
        </div>

        <div className="flex min-h-[440px] justify-center overflow-auto py-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800">
          {renderNodes.length > 0 ? (
            <div className="relative">
              <svg
                width={svgDimensions.width}
                height={svgDimensions.height}
                viewBox={`${svgDimensions.offset} 0 ${svgDimensions.width} ${svgDimensions.height}`}
                className="mx-auto"
              >
                {/* Draw Edges */}
                {renderEdges.map((edge, idx) => {
                  let strokeColor = "#cbd5e1"; // gray-300
                  let strokeWidth = "2";
                  
                  // In dark mode, base stroke should be darker
                  let strokeClass = "stroke-gray-300 dark:stroke-gray-600";
                  
                  if (edge.isActive) {
                    strokeColor = "#a435f0";
                    strokeWidth = "3.5";
                    strokeClass = ""; // Override class if active
                  }

                  return (
                    <g key={`edge-g-${idx}`}>
                      <line
                        x1={edge.x1}
                        y1={edge.y1}
                        x2={edge.x2}
                        y2={edge.y2}
                        stroke={strokeColor}
                        strokeWidth={strokeWidth}
                        className={`transition-all duration-300 ${strokeClass}`}
                      />
                      {/* Edge Label character */}
                      <rect
                        x={(edge.x1 + edge.x2) / 2 - 8}
                        y={(edge.y1 + edge.y2) / 2 - 10}
                        width="16"
                        height="16"
                        rx="3"
                        fill="var(--background)"
                        className="fill-white dark:fill-gray-900"
                        stroke={edge.isActive ? "#a435f0" : "#94a3b8"}
                        strokeWidth="1"
                      />
                      <text
                        x={(edge.x1 + edge.x2) / 2}
                        y={(edge.y1 + edge.y2) / 2 + 3.5}
                        textAnchor="middle"
                        fill={edge.isActive ? "#a435f0" : "#64748b"}
                        fontSize="10"
                        fontWeight="bold"
                        className="uppercase"
                      >
                        {edge.char}
                      </text>
                    </g>
                  );
                })}

                {/* Draw Nodes */}
                {renderNodes.map((node, idx) => {
                  const isCurr = node.state === "visiting";
                  const isMatch = node.state === "matched";
                  const isError = node.state === "error";
                  const isActivePath = node.state === "active";

                  // Default classes for standard visualizer looks
                  let nodeClass = "fill-white stroke-gray-400 dark:fill-gray-800 dark:stroke-gray-600";
                  let textClass = "fill-gray-800 dark:fill-white";
                  let strokeWidth = "2";

                  if (isCurr) {
                    nodeClass = "fill-emerald-50 stroke-emerald-500 dark:fill-emerald-900/30 dark:stroke-emerald-400";
                    textClass = "fill-emerald-700 dark:fill-emerald-300";
                    strokeWidth = "3";
                  } else if (isMatch) {
                    nodeClass = "fill-[#a435f0]/10 stroke-[#a435f0] dark:fill-[#a435f0]/20 dark:stroke-[#d38cff]";
                    textClass = "fill-[#a435f0] dark:fill-[#d38cff]";
                    strokeWidth = "3";
                  } else if (isError) {
                    nodeClass = "fill-red-50 stroke-red-500 dark:fill-red-900/30 dark:stroke-red-400";
                    textClass = "fill-red-700 dark:fill-red-300";
                    strokeWidth = "3";
                  } else if (isActivePath) {
                    nodeClass = "fill-blue-50 stroke-blue-500 dark:fill-blue-900/30 dark:stroke-blue-400";
                    textClass = "fill-blue-700 dark:fill-blue-300";
                    strokeWidth = "3";
                  }

                  return (
                    <g key={`node-g-${idx}`} className="transition-all duration-300">
                      {/* Glowing outer rings for active/searching states */}
                      {(isCurr || isMatch || isError) && (
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r="25"
                          fill="none"
                          className={isCurr ? "stroke-emerald-400" : isMatch ? "stroke-[#a435f0]" : "stroke-red-400"}
                          strokeWidth="1.5"
                          strokeDasharray="4,2"
                        >
                          <animateTransform
                            attributeName="transform"
                            type="rotate"
                            from={`0 ${node.x} ${node.y}`}
                            to={`360 ${node.x} ${node.y}`}
                            dur="4s"
                            repeatCount="indefinite"
                          />
                        </circle>
                      )}

                      {/* Double stroke ring for end of word */}
                      {node.isEndOfWord && (
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r="22"
                          fill="none"
                          className={isMatch ? "stroke-[#a435f0]" : "stroke-[#a435f0]/50 dark:stroke-[#a435f0]/70"}
                          strokeWidth="1.5"
                          strokeDasharray="4,4"
                        />
                      )}

                      {/* Node Core */}
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r="18"
                        strokeWidth={node.isEndOfWord ? "3" : strokeWidth}
                        className={`transition-all duration-300 shadow-sm ${nodeClass}`}
                      />

                      {/* Node Text character */}
                      <text
                        x={node.x}
                        y={node.y + 4.5}
                        textAnchor="middle"
                        fontSize="12"
                        fontWeight="bold"
                        className={`uppercase ${textClass}`}
                      >
                        {node.char || "R"}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-3 text-gray-400">
              <AlertCircle className="w-10 h-10 animate-pulse text-gray-300 dark:text-gray-600" />
              <span className="text-sm font-medium">Workspace is Empty</span>
            </div>
          )}
        </div>
      </VisualizerCard>
    </VisualizerInteractiveLayout>
  );
}
