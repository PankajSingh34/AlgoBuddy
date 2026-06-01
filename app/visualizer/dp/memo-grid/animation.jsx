"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Classic default datasets
const DEFAULT_KNAPSACK = {
  items: [
    { name: "A", weight: 2, value: 3 },
    { name: "B", weight: 3, value: 4 },
    { name: "C", weight: 4, value: 5 },
  ],
  capacity: 6,
};

const DEFAULT_LCS = {
  str1: "ABCD",
  str2: "ACD",
};

export default function DpAnimation() {
  const [algo, setAlgo] = useState("knapsack"); // 'knapsack' | 'lcs'
  const [mode, setMode] = useState("tabulation"); // 'tabulation' | 'memoization'

  // Knapsack custom inputs
  const [items, setItems] = useState(DEFAULT_KNAPSACK.items);
  const [capacity, setCapacity] = useState(DEFAULT_KNAPSACK.capacity);

  // LCS custom inputs
  const [str1, setStr1] = useState(DEFAULT_LCS.str1);
  const [str2, setStr2] = useState(DEFAULT_LCS.str2);

  // Input editing state
  const [tempCapacity, setTempCapacity] = useState(DEFAULT_KNAPSACK.capacity);
  const [tempStr1, setTempStr1] = useState(DEFAULT_LCS.str1);
  const [tempStr2, setTempStr2] = useState(DEFAULT_LCS.str2);

  // Playback control state
  const [steps, setSteps] = useState([]);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000); // ms

  // Hover state for tabulation grid dependency overlay
  const [hoveredCell, setHoveredCell] = useState(null);
  const [arrows, setArrows] = useState([]);

  const gridContainerRef = useRef(null);
  const playTimerRef = useRef(null);

  // Solver: Knapsack Tabulation
  const generateKnapsackTabulationSteps = useCallback(() => {
    const list = [];
    const n = items.length;
    const dp = Array.from({ length: n + 1 }, () => new Array(capacity + 1).fill(0));

    // Base cases
    list.push({
      grid: dp.map((row) => [...row]),
      activeCell: null,
      dependencies: [],
      codeLine: 6,
      desc: "Initialize DP grid of size (N+1) x (W+1) with 0.",
    });

    for (let i = 1; i <= n; i++) {
      const wItem = items[i - 1].weight;
      const vItem = items[i - 1].value;

      for (let w = 0; w <= capacity; w++) {
        const deps = [];
        deps.push({ r: i - 1, c: w }); // always depend on previous item excluded

        let val;
        let choice = "";

        if (wItem <= w) {
          deps.push({ r: i - 1, c: w - wItem }); // depend on item included
          const excludeVal = dp[i - 1][w];
          const includeVal = dp[i - 1][w - wItem] + vItem;
          if (includeVal > excludeVal) {
            val = includeVal;
            choice = `Include item ${items[i - 1].name} (value ${vItem}) -> max(${excludeVal}, ${dp[i - 1][w - wItem]} + ${vItem}) = ${includeVal}`;
          } else {
            val = excludeVal;
            choice = `Exclude item ${items[i - 1].name} -> max(${excludeVal}, ${dp[i - 1][w - wItem]} + ${vItem}) = ${excludeVal}`;
          }
        } else {
          val = dp[i - 1][w];
          choice = `Item ${items[i - 1].name} too heavy (weight ${wItem} > capacity ${w}). Retain previous value: ${val}`;
        }

        dp[i][w] = val;

        list.push({
          grid: dp.map((row) => [...row]),
          activeCell: { r: i, c: w },
          dependencies: deps,
          codeLine: wItem <= w ? 18 : 24,
          desc: `Evaluating item ${items[i - 1].name} at capacity ${w}. ${choice}`,
        });
      }
    }

    // Final result highlight
    list.push({
      grid: dp.map((row) => [...row]),
      activeCell: { r: n, c: capacity },
      dependencies: [],
      codeLine: 28,
      desc: `Tabulation complete! Maximum value obtained is ${dp[n][capacity]}`,
    });

    setSteps(list);
  }, [items, capacity]);

  // Solver: Knapsack Memoization
  const generateKnapsackMemoizationSteps = useCallback(() => {
    const list = [];
    const n = items.length;
    const memo = Array.from({ length: n }, () => new Array(capacity + 1).fill(-1));
    const treeNodes = [];

    const solve = (i, w, parentId = null) => {
      const nodeId = `node-${i}-${w}-${treeNodes.length}`;
      const node = {
        id: nodeId,
        parentId,
        label: `solve(${i}, ${w})`,
        state: "active",
        val: null,
        i,
        w,
      };
      treeNodes.push(node);

      // Snapshot for active state
      list.push({
        memo: memo.map((row) => [...row]),
        tree: [...treeNodes],
        activeCell: { r: i, c: w },
        codeLine: 38,
        desc: `Recursive call solve(item: ${i}, remaining_capacity: ${w}) launched.`,
      });

      if (i < 0 || w === 0) {
        node.state = "finished";
        node.val = 0;
        list.push({
          memo: memo.map((row) => [...row]),
          tree: [...treeNodes],
          activeCell: null,
          codeLine: 40,
          desc: `Base case reached: item index ${i} or capacity ${w} is 0. Return 0.`,
        });
        return 0;
      }

      if (memo[i][w] !== -1) {
        node.state = "pruned";
        node.val = memo[i][w];
        list.push({
          memo: memo.map((row) => [...row]),
          tree: [...treeNodes],
          activeCell: { r: i, c: w },
          codeLine: 43,
          desc: `Cache hit! solve(${i}, ${w}) is already computed. Returning memo[${i}][${w}] = ${memo[i][w]} directly (Branch Pruned).`,
        });
        return memo[i][w];
      }

      let val;
      const wItem = items[i].weight;
      const vItem = items[i].value;

      if (wItem <= w) {
        list.push({
          memo: memo.map((row) => [...row]),
          tree: [...treeNodes],
          activeCell: { r: i, c: w },
          codeLine: 47,
          desc: `Item ${items[i].name} fits. Recursively branching left (exclude) and right (include).`,
        });

        const excl = solve(i - 1, w, nodeId);
        const incl = solve(i - 1, w - wItem, nodeId) + vItem;
        val = Math.max(excl, incl);
      } else {
        list.push({
          memo: memo.map((row) => [...row]),
          tree: [...treeNodes],
          activeCell: { r: i, c: w },
          codeLine: 51,
          desc: `Item ${items[i].name} is too heavy (weight ${wItem} > capacity ${w}). Retrying excluding branch only.`,
        });
        val = solve(i - 1, w, nodeId);
      }

      memo[i][w] = val;
      node.state = "finished";
      node.val = val;

      list.push({
        memo: memo.map((row) => [...row]),
        tree: [...treeNodes],
        activeCell: { r: i, c: w },
        codeLine: 53,
        desc: `Solved solve(${i}, ${w}) = ${val}. Caching state in memo[${i}][${w}].`,
      });

      return val;
    };

    solve(n - 1, capacity);
    setSteps(list);
  }, [items, capacity]);

  // Solver: LCS Tabulation
  const generateLcsTabulationSteps = useCallback(() => {
    const list = [];
    const rLen = str1.length;
    const cLen = str2.length;
    const dp = Array.from({ length: rLen + 1 }, () => new Array(cLen + 1).fill(0));

    // Base cases
    list.push({
      grid: dp.map((row) => [...row]),
      activeCell: null,
      dependencies: [],
      codeLine: 6,
      desc: "Initialize DP grid of size (str1+1) x (str2+1) with 0.",
    });

    for (let i = 1; i <= rLen; i++) {
      for (let j = 1; j <= cLen; j++) {
        const deps = [];
        let choice = "";

        if (str1[i - 1] === str2[j - 1]) {
          deps.push({ r: i - 1, c: j - 1 });
          dp[i][j] = dp[i - 1][j - 1] + 1;
          choice = `Characters match: '${str1[i - 1]}'. Diagonal lookup: dp[i-1][j-1] + 1 = ${dp[i][j]}`;
        } else {
          deps.push({ r: i - 1, c: j });
          deps.push({ r: i, c: j - 1 });
          dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
          choice = `Mismatch ('${str1[i - 1]}' != '${str2[j - 1]}'). Max of Top cell (${dp[i - 1][j]}) and Left cell (${dp[i][j - 1]}) = ${dp[i][j]}`;
        }

        list.push({
          grid: dp.map((row) => [...row]),
          activeCell: { r: i, c: j },
          dependencies: deps,
          codeLine: str1[i - 1] === str2[j - 1] ? 18 : 24,
          desc: `Comparing str1[${i - 1}] ('${str1[i - 1]}') with str2[${j - 1}] ('${str2[j - 1]}'). ${choice}`,
        });
      }
    }

    // Final result highlight
    list.push({
      grid: dp.map((row) => [...row]),
      activeCell: { r: rLen, c: cLen },
      dependencies: [],
      codeLine: 28,
      desc: `LCS completed! Longest Common Subsequence length is ${dp[rLen][cLen]}`,
    });

    setSteps(list);
  }, [str1, str2]);

  // Solver: LCS Memoization
  const generateLcsMemoizationSteps = useCallback(() => {
    const list = [];
    const rLen = str1.length;
    const cLen = str2.length;
    const memo = Array.from({ length: rLen }, () => new Array(cLen).fill(-1));
    const treeNodes = [];

    const solve = (i, j, parentId = null) => {
      const nodeId = `node-${i}-${j}-${treeNodes.length}`;
      const node = {
        id: nodeId,
        parentId,
        label: `solve(${i}, ${j})`,
        state: "active",
        val: null,
        i,
        j,
      };
      treeNodes.push(node);

      // Snapshot for active state
      list.push({
        memo: memo.map((row) => [...row]),
        tree: [...treeNodes],
        activeCell: { r: i, c: j },
        codeLine: 38,
        desc: `Recursive call solve(index1: ${i}, index2: ${j}) launched.`,
      });

      if (i < 0 || j < 0) {
        node.state = "finished";
        node.val = 0;
        list.push({
          memo: memo.map((row) => [...row]),
          tree: [...treeNodes],
          activeCell: null,
          codeLine: 40,
          desc: `Base case reached: indices out of bounds (index1: ${i}, index2: ${j}). Return 0.`,
        });
        return 0;
      }

      if (memo[i][j] !== -1) {
        node.state = "pruned";
        node.val = memo[i][j];
        list.push({
          memo: memo.map((row) => [...row]),
          tree: [...treeNodes],
          activeCell: { r: i, c: j },
          codeLine: 43,
          desc: `Cache hit! solve(${i}, ${j}) is already computed. Returning memo[${i}][${j}] = ${memo[i][j]} directly (Branch Pruned).`,
        });
        return memo[i][j];
      }

      let val;
      if (str1[i] === str2[j]) {
        list.push({
          memo: memo.map((row) => [...row]),
          tree: [...treeNodes],
          activeCell: { r: i, c: j },
          codeLine: 47,
          desc: `Characters match ('${str1[i]}'). Recurse diagonally solve(${i - 1}, ${j - 1}) + 1.`,
        });
        val = solve(i - 1, j - 1, nodeId) + 1;
      } else {
        list.push({
          memo: memo.map((row) => [...row]),
          tree: [...treeNodes],
          activeCell: { r: i, c: j },
          codeLine: 51,
          desc: `Characters mismatch ('${str1[i]}' != '${str2[j]}'). Spawning branches solve(${i - 1}, ${j}) and solve(${i}, ${j - 1}).`,
        });
        val = Math.max(solve(i - 1, j, nodeId), solve(i, j - 1, nodeId));
      }

      memo[i][j] = val;
      node.state = "finished";
      node.val = val;

      list.push({
        memo: memo.map((row) => [...row]),
        tree: [...treeNodes],
        activeCell: { r: i, c: j },
        codeLine: 53,
        desc: `Solved solve(${i}, ${j}) = ${val}. Caching state in memo[${i}][${j}].`,
      });

      return val;
    };

    solve(rLen - 1, cLen - 1);
    setSteps(list);
  }, [str1, str2]);

  // Generate steps based on active algorithm and mode
  useEffect(() => {
    setIsPlaying(false);
    setCurrentStepIdx(0);
    setHoveredCell(null);
    setArrows([]);

    if (algo === "knapsack") {
      if (mode === "tabulation") {
        generateKnapsackTabulationSteps();
      } else {
        generateKnapsackMemoizationSteps();
      }
    } else {
      if (mode === "tabulation") {
        generateLcsTabulationSteps();
      } else {
        generateLcsMemoizationSteps();
      }
    }
  }, [
    algo,
    mode,
    generateKnapsackTabulationSteps,
    generateKnapsackMemoizationSteps,
    generateLcsTabulationSteps,
    generateLcsMemoizationSteps,
  ]);

  // Handle auto-play stepping
  useEffect(() => {
    if (isPlaying) {
      playTimerRef.current = setInterval(() => {
        setCurrentStepIdx((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, speed);
    } else {
      if (playTimerRef.current) {
        clearInterval(playTimerRef.current);
      }
    }
    return () => {
      if (playTimerRef.current) {
        clearInterval(playTimerRef.current);
      }
    };
  }, [isPlaying, steps, speed]);

  // Recalculate dependency arrows when hovered cell changes
  useEffect(() => {
    if (!hoveredCell || !gridContainerRef.current || mode !== "tabulation") {
      setArrows([]);
      return;
    }

    const { r, c } = hoveredCell;
    const containerRect = gridContainerRef.current.getBoundingClientRect();
    const currentEl = document.getElementById(`cell-${r}-${c}`);
    if (!currentEl) return;

    const currentRect = currentEl.getBoundingClientRect();
    const currentCenter = {
      x: currentRect.left - containerRect.left + currentRect.width / 2,
      y: currentRect.top - containerRect.top + currentRect.height / 2,
    };

    const newArrows = [];

    // Calculate source dependencies
    if (algo === "knapsack") {
      // Row 0 or Column 0 don't have dependencies
      if (r > 0) {
        // Exclusion dependency: cell above
        const elExclude = document.getElementById(`cell-${r - 1}-${c}`);
        if (elExclude) {
          const rect = elExclude.getBoundingClientRect();
          newArrows.push({
            from: {
              x: rect.left - containerRect.left + rect.width / 2,
              y: rect.top - containerRect.top + rect.height / 2,
            },
            to: currentCenter,
            color: "#6366f1", // purple/indigo
            label: "Exclude",
          });
        }

        // Inclusion dependency: cell above at remaining capacity
        const itemWeight = items[r - 1].weight;
        if (c >= itemWeight) {
          const elInclude = document.getElementById(`cell-${r - 1}-${c - itemWeight}`);
          if (elInclude) {
            const rect = elInclude.getBoundingClientRect();
            newArrows.push({
              from: {
                x: rect.left - containerRect.left + rect.width / 2,
                y: rect.top - containerRect.top + rect.height / 2,
              },
              to: currentCenter,
              color: "#10b981", // emerald green
              label: "Include",
            });
          }
        }
      }
    } else {
      // LCS algorithm
      if (r > 0 && c > 0) {
        if (str1[r - 1] === str2[c - 1]) {
          // Matching chars -> diagonal dependency
          const elDiag = document.getElementById(`cell-${r - 1}-${c - 1}`);
          if (elDiag) {
            const rect = elDiag.getBoundingClientRect();
            newArrows.push({
              from: {
                x: rect.left - containerRect.left + rect.width / 2,
                y: rect.top - containerRect.top + rect.height / 2,
              },
              to: currentCenter,
              color: "#10b981",
              label: "Match (+1)",
            });
          }
        } else {
          // Mismatch -> max of top or left cell
          const elTop = document.getElementById(`cell-${r - 1}-${c}`);
          const elLeft = document.getElementById(`cell-${r}-${c - 1}`);
          if (elTop) {
            const rect = elTop.getBoundingClientRect();
            newArrows.push({
              from: {
                x: rect.left - containerRect.left + rect.width / 2,
                y: rect.top - containerRect.top + rect.height / 2,
              },
              to: currentCenter,
              color: "#f59e0b",
              label: "Exclude Str1",
            });
          }
          if (elLeft) {
            const rect = elLeft.getBoundingClientRect();
            newArrows.push({
              from: {
                x: rect.left - containerRect.left + rect.width / 2,
                y: rect.top - containerRect.top + rect.height / 2,
              },
              to: currentCenter,
              color: "#3b82f6",
              label: "Exclude Str2",
            });
          }
        }
      }
    }

    setArrows(newArrows);
  }, [hoveredCell, algo, items, str1, str2, mode]);

  const handleCustomInputSubmit = (e) => {
    e.preventDefault();
    if (algo === "knapsack") {
      setCapacity(Number(tempCapacity));
    } else {
      setStr1(tempStr1.toUpperCase().slice(0, 8));
      setStr2(tempStr2.toUpperCase().slice(0, 8));
    }
  };

  const currentStep = steps[currentStepIdx] || {
    grid: [],
    memo: [],
    tree: [],
    activeCell: null,
    dependencies: [],
    codeLine: 0,
    desc: "",
  };

  const handleStepForward = () => {
    if (currentStepIdx < steps.length - 1) {
      setCurrentStepIdx(currentStepIdx + 1);
    }
  };

  const handleStepBackward = () => {
    if (currentStepIdx > 0) {
      setCurrentStepIdx(currentStepIdx - 1);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
      {/* Dynamic Controls Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-[#f8fafc] dark:bg-[#1a1b1e] p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm w-full">
        {/* Selectors */}
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={algo}
            onChange={(e) => setAlgo(e.target.value)}
            className="px-4 py-2 bg-white dark:bg-[#2c2d30] border border-gray-300 dark:border-gray-700 rounded-xl font-semibold text-gray-700 dark:text-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
          >
            <option value="knapsack">0/1 Knapsack</option>
            <option value="lcs">Longest Common Subsequence (LCS)</option>
          </select>

          <div className="flex bg-gray-200 dark:bg-[#2c2d30] p-1 rounded-xl">
            <button
              onClick={() => setMode("tabulation")}
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                mode === "tabulation"
                  ? "bg-white dark:bg-[#3e3f42] text-purple-600 dark:text-purple-300 shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              }`}
            >
              Bottom-Up Grid
            </button>
            <button
              onClick={() => setMode("memoization")}
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                mode === "memoization"
                  ? "bg-white dark:bg-[#3e3f42] text-purple-600 dark:text-purple-300 shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              }`}
            >
              Top-Down Memo
            </button>
          </div>
        </div>

        {/* Speed / Controls */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">Speed:</span>
            <input
              type="range"
              min="200"
              max="2000"
              step="200"
              value={2200 - speed}
              onChange={(e) => setSpeed(2200 - Number(e.target.value))}
              className="w-24 accent-purple-600 cursor-pointer"
            />
          </div>

          <div className="flex items-center gap-2 bg-white dark:bg-[#2c2d30] border border-gray-300 dark:border-gray-700 p-1.5 rounded-xl shadow-sm">
            <button
              onClick={handleStepBackward}
              disabled={currentStepIdx === 0}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 disabled:opacity-40"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-4 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-bold shadow-md transition-all flex items-center gap-1"
            >
              {isPlaying ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Pause
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                  Play
                </>
              )}
            </button>

            <button
              onClick={handleStepForward}
              disabled={currentStepIdx === steps.length - 1}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 disabled:opacity-40"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Dynamic Input Form */}
      <form onSubmit={handleCustomInputSubmit} className="flex flex-wrap items-center gap-4 bg-white dark:bg-[#1a1b1e] p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm w-full">
        {algo === "knapsack" ? (
          <>
            <span className="text-sm font-bold text-gray-600 dark:text-gray-300">Knapsack Capacity:</span>
            <input
              type="number"
              min="2"
              max="10"
              value={tempCapacity}
              onChange={(e) => setTempCapacity(Number(e.target.value))}
              className="px-3 py-1.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-[#2c2d30] max-w-[80px]"
            />
          </>
        ) : (
          <>
            <span className="text-sm font-bold text-gray-600 dark:text-gray-300">String 1:</span>
            <input
              type="text"
              value={tempStr1}
              onChange={(e) => setTempStr1(e.target.value.toUpperCase())}
              className="px-3 py-1.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-[#2c2d30] max-w-[120px]"
            />
            <span className="text-sm font-bold text-gray-600 dark:text-gray-300">String 2:</span>
            <input
              type="text"
              value={tempStr2}
              onChange={(e) => setTempStr2(e.target.value.toUpperCase())}
              className="px-3 py-1.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-[#2c2d30] max-w-[120px]"
            />
          </>
        )}
        <button
          type="submit"
          className="px-4 py-2 bg-[#a435f0] hover:bg-[#8f2cd4] text-white font-bold rounded-lg text-sm transition-all"
        >
          Update Visualizer
        </button>
      </form>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full items-stretch">
        
        {/* Left and Middle Visualization Area */}
        <div className="lg:col-span-2 flex flex-col gap-4 bg-white dark:bg-[#1a1b1e] p-6 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm relative min-h-[500px]">
          <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300 flex items-center justify-between">
            <span>Visual Workspace ({mode === "tabulation" ? "Tabulation Grid" : "Memoization Tree"})</span>
            <span className="text-xs font-semibold px-2.5 py-1 bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 rounded-full">
              Step {currentStepIdx + 1} / {steps.length}
            </span>
          </h3>

          {/* Description banner */}
          <div className="bg-[#f0f4ff] dark:bg-[#15203b] border border-[#bfdbfe] dark:border-[#1e3a8a] text-blue-900 dark:text-blue-200 px-4 py-3 rounded-xl text-sm leading-relaxed mb-2 font-medium">
            {currentStep.desc}
          </div>

          <div className="flex-1 flex items-center justify-center relative overflow-auto">
            {mode === "tabulation" ? (
              // 2D Tabulation Grid
              <div ref={gridContainerRef} className="relative p-8">
                {/* SVG Bezier overlay for dependency arrows */}
                {arrows.length > 0 && (
                  <svg className="absolute inset-0 pointer-events-none w-full h-full z-10">
                    <defs>
                      <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="8" refY="3.5" orient="auto">
                        <polygon points="0 0, 10 3.5, 0 7" fill="#8b5cf6" />
                      </marker>
                    </defs>
                    {arrows.map((arrow, idx) => {
                      const dx = arrow.to.x - arrow.from.x;
                      const dy = arrow.to.y - arrow.from.y;
                      const midX = arrow.from.x + dx * 0.5;
                      const midY = arrow.from.y + dy * 0.1; // Control point curve height
                      const path = `M ${arrow.from.x} ${arrow.from.y} Q ${midX} ${midY} ${arrow.to.x} ${arrow.to.y}`;
                      return (
                        <g key={idx}>
                          <path
                            d={path}
                            stroke={arrow.color}
                            strokeWidth="2.5"
                            fill="none"
                            markerEnd="url(#arrowhead)"
                            className="stroke-purple-500 animate-[dash_1.5s_linear_infinite]"
                            style={{
                              strokeDasharray: "5, 5",
                            }}
                          />
                          <text
                            x={midX}
                            y={midY - 10}
                            fill="#8b5cf6"
                            className="text-[10px] font-bold text-center bg-white dark:bg-black p-0.5"
                            textAnchor="middle"
                          >
                            {arrow.label}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                )}

                {/* Render the Grid */}
                <div className="flex flex-col gap-1">
                  {/* Column Header indices */}
                  <div className="flex gap-1">
                    {/* Corner cell */}
                    <div className="w-14 h-12 flex items-center justify-center font-bold text-xs text-gray-400">
                      {algo === "knapsack" ? "Items" : "Str1 \\ Str2"}
                    </div>
                    {/* Capacities or Str2 characters */}
                    {Array.from({ length: algo === "knapsack" ? capacity + 1 : str2.length + 1 }).map((_, c) => (
                      <div key={c} className="w-12 h-12 flex flex-col items-center justify-center bg-gray-50 dark:bg-[#252629] rounded-lg font-bold text-xs text-gray-500">
                        <span>{c}</span>
                        {algo === "lcs" && c > 0 && <span className="text-[10px] text-purple-600 dark:text-purple-400 font-black">{str2[c - 1]}</span>}
                      </div>
                    ))}
                  </div>

                  {/* Row loops */}
                  {currentStep.grid && currentStep.grid.map((row, r) => (
                    <div key={r} className="flex gap-1">
                      {/* Row Header items or Str1 characters */}
                      <div className="w-14 h-12 flex flex-col items-center justify-center bg-gray-50 dark:bg-[#252629] rounded-lg font-bold text-xs text-gray-500">
                        <span>{r}</span>
                        {algo === "knapsack" && r > 0 && (
                          <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold">
                            {items[r - 1].name}(W:{items[r - 1].weight})
                          </span>
                        )}
                        {algo === "lcs" && r > 0 && <span className="text-[10px] text-purple-600 dark:text-purple-400 font-black">{str1[r - 1]}</span>}
                      </div>

                      {/* Cells */}
                      {row.map((val, c) => {
                        const isActive = currentStep.activeCell && currentStep.activeCell.r === r && currentStep.activeCell.c === c;
                        const isDep = currentStep.dependencies && currentStep.dependencies.some((dep) => dep.r === r && dep.c === c);

                        return (
                          <div
                            key={c}
                            id={`cell-${r}-${c}`}
                            onMouseEnter={() => setHoveredCell({ r, c })}
                            onMouseLeave={() => setHoveredCell(null)}
                            className={`w-12 h-12 border rounded-xl flex items-center justify-center font-bold text-sm transition-all duration-300 relative cursor-crosshair group ${
                              isActive
                                ? "bg-amber-100 dark:bg-[#4d3600] border-amber-500 text-amber-900 dark:text-amber-100 scale-105 z-20 shadow-md shadow-amber-500/20"
                                : isDep
                                ? "bg-indigo-100 dark:bg-[#1a233a] border-indigo-400 text-indigo-900 dark:text-indigo-200"
                                : "bg-white dark:bg-[#2c2d30] border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-200"
                            }`}
                          >
                            {val}
                            {/* Hover info helper */}
                            <span className="absolute bottom-0.5 right-0.5 text-[8px] opacity-0 group-hover:opacity-100 text-purple-400 transition-opacity">
                              info
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              // 2D Memoization Tree & Table View
              <div className="flex flex-col gap-6 w-full items-center">
                {/* Visual Recursion Stack nodes list */}
                <div className="flex flex-wrap gap-4 justify-center items-center p-4 bg-gray-50 dark:bg-[#222326] rounded-2xl border border-gray-200 dark:border-gray-800 w-full max-w-xl shadow-inner min-h-[150px]">
                  {currentStep.tree && currentStep.tree.length > 0 ? (
                    <AnimatePresence>
                      {currentStep.tree.map((node) => (
                        <motion.div
                          key={node.id}
                          layout
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className={`px-4 py-2.5 rounded-xl border font-mono text-xs flex flex-col items-center gap-1 shadow-sm ${
                            node.state === "active"
                              ? "bg-amber-100 dark:bg-[#4d3600] border-amber-500 text-amber-900 dark:text-amber-100 font-bold scale-105 animate-pulse"
                              : node.state === "pruned"
                              ? "bg-emerald-100 dark:bg-[#112d1b] border-emerald-500 text-emerald-900 dark:text-emerald-200"
                              : "bg-purple-100 dark:bg-[#2e1d3e] border-purple-500 text-purple-900 dark:text-purple-200"
                          }`}
                        >
                          <span className="font-bold">{node.label}</span>
                          {node.state === "pruned" && (
                            <span className="text-[9px] bg-emerald-600 text-white px-1.5 py-0.5 rounded-full font-sans uppercase font-black tracking-wide">
                              Cache Hit
                            </span>
                          )}
                          <span className="text-[10px] font-black text-gray-500 dark:text-gray-400">
                            Res: {node.val !== null ? node.val : "?"}
                          </span>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  ) : (
                    <span className="text-gray-400 text-sm font-semibold italic">Recursion tree idle. Click Play or Step Forward.</span>
                  )}
                </div>

                {/* Memo cache array table */}
                <div className="flex flex-col gap-2 w-full items-center">
                  <h4 className="text-xs font-bold text-purple-500 tracking-wider uppercase">Memo Cache Table</h4>
                  <div className="flex flex-col gap-1 max-w-full overflow-x-auto p-4 bg-gray-50 dark:bg-[#222326] border border-gray-200 dark:border-gray-800 rounded-xl">
                    {currentStep.memo && currentStep.memo.map((row, r) => (
                      <div key={r} className="flex gap-1">
                        <div className="w-8 h-8 flex items-center justify-center font-bold text-xs text-gray-400">
                          {r}
                        </div>
                        {row.map((val, c) => (
                          <div
                            key={c}
                            className={`w-10 h-10 border rounded-lg flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                              val === -1
                                ? "bg-white dark:bg-[#2c2d30] border-gray-200 dark:border-gray-800 text-gray-300 dark:text-gray-600"
                                : "bg-emerald-100 dark:bg-[#112d1b] border-emerald-500 text-emerald-900 dark:text-emerald-200 scale-105"
                            }`}
                          >
                            {val === -1 ? "-" : val}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Code Highlighting Panel */}
        <div className="bg-[#1e1e24] text-gray-200 p-6 rounded-3xl border border-gray-800 flex flex-col gap-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-gray-800 pb-3">
            <h4 className="text-sm font-bold text-purple-400 flex items-center gap-1.5">
              <span className="w-3 h-3 bg-purple-500 rounded-full"></span>
              Mac Terminal Trace
            </h4>
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 bg-red-500 rounded-full"></span>
              <span className="w-2.5 h-2.5 bg-yellow-500 rounded-full"></span>
              <span className="w-2.5 h-2.5 bg-green-500 rounded-full"></span>
            </div>
          </div>

          {/* Render code snippets corresponding to active view */}
          <div className="flex-1 font-mono text-xs overflow-auto leading-relaxed whitespace-pre py-2 text-gray-300">
            {mode === "tabulation" ? (
              // Tabulation code snippets
              <div>
                <div className={`py-0.5 px-2.5 rounded ${currentStep.codeLine === 6 ? "bg-purple-950/70 border-l-4 border-purple-500 text-white font-bold" : "opacity-60"}`}>
                  1:  // Initialize 2D grid
                </div>
                <div className={`py-0.5 px-2.5 rounded ${currentStep.codeLine === 6 ? "bg-purple-950/70 border-l-4 border-purple-500 text-white font-bold" : "opacity-60"}`}>
                  2:  const dp = Array(n+1).fill(Array(capacity+1).fill(0));
                </div>
                <div className="py-0.5 px-2.5 opacity-60">
                  3:  
                </div>
                <div className="py-0.5 px-2.5 opacity-60">
                  4:  // Outer loops
                </div>
                <div className="py-0.5 px-2.5 opacity-60">
                  5:  for (let i = 1; i &lt;= n; i++) &#123;
                </div>
                <div className="py-0.5 px-2.5 opacity-60">
                  6:      for (let w = 0; w &lt;= capacity; w++) &#123;
                </div>
                <div className={`py-0.5 px-2.5 rounded ${currentStep.codeLine === 18 ? "bg-purple-950/70 border-l-4 border-purple-500 text-white font-bold" : "opacity-60"}`}>
                  7:          if (weights[i-1] &lt;= w) &#123;
                </div>
                <div className={`py-0.5 px-2.5 rounded ${currentStep.codeLine === 18 ? "bg-purple-950/70 border-l-4 border-purple-500 text-white font-bold" : "opacity-60"}`}>
                  8:              dp[i][w] = Math.max(
                </div>
                <div className={`py-0.5 px-2.5 rounded ${currentStep.codeLine === 18 ? "bg-purple-950/70 border-l-4 border-purple-500 text-white font-bold" : "opacity-60"}`}>
                  9:                  dp[i-1][w], 
                </div>
                <div className={`py-0.5 px-2.5 rounded ${currentStep.codeLine === 18 ? "bg-purple-950/70 border-l-4 border-purple-500 text-white font-bold" : "opacity-60"}`}>
                  10:                 dp[i-1][w - weights[i-1]] + values[i-1]
                </div>
                <div className={`py-0.5 px-2.5 rounded ${currentStep.codeLine === 18 ? "bg-purple-950/70 border-l-4 border-purple-500 text-white font-bold" : "opacity-60"}`}>
                  11:             );
                </div>
                <div className={`py-0.5 px-2.5 rounded ${currentStep.codeLine === 24 ? "bg-purple-950/70 border-l-4 border-purple-500 text-white font-bold" : "opacity-60"}`}>
                  12:         &#125; else &#123;
                </div>
                <div className={`py-0.5 px-2.5 rounded ${currentStep.codeLine === 24 ? "bg-purple-950/70 border-l-4 border-purple-500 text-white font-bold" : "opacity-60"}`}>
                  13:             dp[i][w] = dp[i-1][w];
                </div>
                <div className="py-0.5 px-2.5 opacity-60">
                  14:         &#125;
                </div>
                <div className="py-0.5 px-2.5 opacity-60">
                  15:     &#125;
                </div>
                <div className="py-0.5 px-2.5 opacity-60">
                  16: &#125;
                </div>
                <div className={`py-0.5 px-2.5 rounded ${currentStep.codeLine === 28 ? "bg-purple-950/70 border-l-4 border-purple-500 text-white font-bold" : "opacity-60"}`}>
                  17: return dp[n][capacity];
                </div>
              </div>
            ) : (
              // Memoization code snippets
              <div>
                <div className={`py-0.5 px-2.5 rounded ${currentStep.codeLine === 38 ? "bg-purple-950/70 border-l-4 border-purple-500 text-white font-bold" : "opacity-60"}`}>
                  1:  function solve(i, w) &#123;
                </div>
                <div className={`py-0.5 px-2.5 rounded ${currentStep.codeLine === 40 ? "bg-purple-950/70 border-l-4 border-purple-500 text-white font-bold" : "opacity-60"}`}>
                  2:      // Base cases
                </div>
                <div className={`py-0.5 px-2.5 rounded ${currentStep.codeLine === 40 ? "bg-purple-950/70 border-l-4 border-purple-500 text-white font-bold" : "opacity-60"}`}>
                  3:      if (i &lt; 0 || w === 0) return 0;
                </div>
                <div className="py-0.5 px-2.5 opacity-60">
                  4:  
                </div>
                <div className={`py-0.5 px-2.5 rounded ${currentStep.codeLine === 43 ? "bg-purple-950/70 border-l-4 border-purple-500 text-white font-bold" : "opacity-60"}`}>
                  5:      // Cache Hit lookup
                </div>
                <div className={`py-0.5 px-2.5 rounded ${currentStep.codeLine === 43 ? "bg-purple-950/70 border-l-4 border-purple-500 text-white font-bold" : "opacity-60"}`}>
                  6:      if (memo[i][w] !== -1) return memo[i][w];
                </div>
                <div className="py-0.5 px-2.5 opacity-60">
                  7:  
                </div>
                <div className={`py-0.5 px-2.5 rounded ${currentStep.codeLine === 47 ? "bg-purple-950/70 border-l-4 border-purple-500 text-white font-bold" : "opacity-60"}`}>
                  8:      if (weights[i] &lt;= w) &#123;
                </div>
                <div className={`py-0.5 px-2.5 rounded ${currentStep.codeLine === 47 ? "bg-purple-950/70 border-l-4 border-purple-500 text-white font-bold" : "opacity-60"}`}>
                  9:          memo[i][w] = Math.max(
                </div>
                <div className={`py-0.5 px-2.5 rounded ${currentStep.codeLine === 47 ? "bg-purple-950/70 border-l-4 border-purple-500 text-white font-bold" : "opacity-60"}`}>
                  10:             solve(i - 1, w),
                </div>
                <div className={`py-0.5 px-2.5 rounded ${currentStep.codeLine === 47 ? "bg-purple-950/70 border-l-4 border-purple-500 text-white font-bold" : "opacity-60"}`}>
                  11:             solve(i - 1, w - weights[i]) + values[i]
                </div>
                <div className={`py-0.5 px-2.5 rounded ${currentStep.codeLine === 47 ? "bg-purple-950/70 border-l-4 border-purple-500 text-white font-bold" : "opacity-60"}`}>
                  12:         );
                </div>
                <div className={`py-0.5 px-2.5 rounded ${currentStep.codeLine === 51 ? "bg-purple-950/70 border-l-4 border-purple-500 text-white font-bold" : "opacity-60"}`}>
                  13:     &#125; else &#123;
                </div>
                <div className={`py-0.5 px-2.5 rounded ${currentStep.codeLine === 51 ? "bg-purple-950/70 border-l-4 border-purple-500 text-white font-bold" : "opacity-60"}`}>
                  14:         memo[i][w] = solve(i - 1, w);
                </div>
                <div className="py-0.5 px-2.5 opacity-60">
                  15:     &#125;
                </div>
                <div className={`py-0.5 px-2.5 rounded ${currentStep.codeLine === 53 ? "bg-purple-950/70 border-l-4 border-purple-500 text-white font-bold" : "opacity-60"}`}>
                  16:     return memo[i][w];
                </div>
                <div className="py-0.5 px-2.5 opacity-60">
                  17: &#125;
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
