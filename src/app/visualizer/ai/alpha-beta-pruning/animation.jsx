"use client";
import React, { useState, useEffect, useRef } from "react";
import { Play, Pause } from "lucide-react";
import ResetButton from "@/app/components/ui/resetButton";
import GoButton from "@/app/components/ui/goButton";
import usePlayback from "@/app/hooks/usePlayback";

const AlphaBetaPruning = () => {
  const [arrayElements, setArrayElements] = useState("3, 5, 2, 9, 12, 5, 23, 23");
  const [treeNodes, setTreeNodes] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [message, setMessage] = useState("Enter 8 comma-separated numbers for leaf nodes.");
  const [stepExplanation, setStepExplanation] = useState("");
  const [currentNodeClass, setCurrentNodeClass] = useState({});
  const [prunedNodes, setPrunedNodes] = useState({});

  const {
    isPaused,
    isPausedRef,
    speed,
    speedRef,
    togglePlayPause,
    increaseSpeed,
    decreaseSpeed,
  } = usePlayback(() => 1);

  const animationRef = useRef(null);

  const handleReset = () => {
    setIsAnimating(false);
    setMessage("Enter 8 comma-separated numbers for leaf nodes.");
    setStepExplanation("");
    setCurrentNodeClass({});
    setPrunedNodes({});
    setTreeNodes([]);
  };

  const delay = (ms) => {
    return new Promise((resolve) => {
      const checkPause = () => {
        if (!isPausedRef.current) {
          setTimeout(resolve, ms / speedRef.current);
        } else {
          setTimeout(checkPause, 100);
        }
      };
      checkPause();
    });
  };

  const runAlphaBeta = async (nodes) => {
    setMessage("Running Alpha-Beta Pruning...");
    let newClasses = { ...currentNodeClass };
    let newPruned = { ...prunedNodes };

    const evaluate = async (nodeIndex, depth, alpha, beta, isMax) => {
      if (depth === 3) {
        newClasses[nodeIndex] = "bg-green-500 text-white border-green-700";
        setCurrentNodeClass({ ...newClasses });
        setStepExplanation(`Evaluating leaf node: ${nodes[nodeIndex].val}`);
        await delay(1000);
        return nodes[nodeIndex].val;
      }

      newClasses[nodeIndex] = "bg-yellow-300 text-black border-yellow-500 scale-110";
      nodes[nodeIndex].alpha = alpha;
      nodes[nodeIndex].beta = beta;
      setTreeNodes([...nodes]);
      setCurrentNodeClass({ ...newClasses });
      setStepExplanation(`Visiting ${isMax ? "Max" : "Min"} node. α=${alpha === -Infinity ? "-∞" : alpha}, β=${beta === Infinity ? "∞" : beta}`);
      await delay(1000);

      const leftChild = 2 * nodeIndex + 1;
      const rightChild = 2 * nodeIndex + 2;

      let bestVal = isMax ? -Infinity : Infinity;

      // Left Child
      const leftVal = await evaluate(leftChild, depth + 1, alpha, beta, !isMax);
      if (isMax) {
        bestVal = Math.max(bestVal, leftVal);
        alpha = Math.max(alpha, bestVal);
      } else {
        bestVal = Math.min(bestVal, leftVal);
        beta = Math.min(beta, bestVal);
      }
      
      nodes[nodeIndex].val = bestVal;
      nodes[nodeIndex].alpha = alpha;
      nodes[nodeIndex].beta = beta;
      setTreeNodes([...nodes]);
      setStepExplanation(`Back at ${isMax ? "Max" : "Min"} node. Updated ${isMax ? "α" : "β"} to ${isMax ? alpha : beta}. Check α=${alpha === -Infinity ? "-∞" : alpha} ≥ β=${beta === Infinity ? "∞" : beta}?`);
      await delay(1000);

      // Pruning check
      if (beta <= alpha) {
        setStepExplanation(`PRUNED! Since ${isMax ? "β (" + beta + ") <= α (" + alpha + ")" : "α (" + alpha + ") >= β (" + beta + ")"}. Ignoring right child.`);
        newPruned[rightChild] = true;
        setPrunedNodes({ ...newPruned });
        
        // Mark pruned sub-tree as grayed out
        const markPruned = (idx) => {
            if (idx > 14) return;
            newPruned[idx] = true;
            markPruned(2 * idx + 1);
            markPruned(2 * idx + 2);
        };
        markPruned(rightChild);
        setPrunedNodes({ ...newPruned });
        
        await delay(1500);
      } else {
        // Right Child
        const rightVal = await evaluate(rightChild, depth + 1, alpha, beta, !isMax);
        if (isMax) {
          bestVal = Math.max(bestVal, rightVal);
          alpha = Math.max(alpha, bestVal);
        } else {
          bestVal = Math.min(bestVal, rightVal);
          beta = Math.min(beta, bestVal);
        }
        nodes[nodeIndex].val = bestVal;
        nodes[nodeIndex].alpha = alpha;
        nodes[nodeIndex].beta = beta;
        setTreeNodes([...nodes]);
      }

      newClasses[nodeIndex] = "bg-blue-500 text-white border-blue-700 scale-100";
      setCurrentNodeClass({ ...newClasses });
      setStepExplanation(`Node ${nodeIndex} completed. Value: ${bestVal}`);
      await delay(1000);

      return bestVal;
    };

    const rootVal = await evaluate(0, 0, -Infinity, Infinity, true);
    setStepExplanation(`Algorithm finished. Optimal value: ${rootVal}`);
    setMessage(`Finished! Optimal value: ${rootVal}`);
    setIsAnimating(false);
  };

  const handleStart = () => {
    const nums = arrayElements.split(",").map((num) => parseInt(num.trim()));
    if (nums.length !== 8 || nums.some(isNaN)) {
      alert("Please enter exactly 8 numbers.");
      return;
    }

    const initNodes = Array(15)
      .fill(null)
      .map((_, i) => ({
        id: i,
        val: i >= 7 ? nums[i - 7] : "?",
        alpha: -Infinity,
        beta: Infinity,
      }));

    setTreeNodes(initNodes);
    setIsAnimating(true);
    setCurrentNodeClass({});
    setPrunedNodes({});
    runAlphaBeta(initNodes);
  };

  const renderTree = () => {
    if (treeNodes.length === 0) return null;

    const levels = [
      [0],
      [1, 2],
      [3, 4, 5, 6],
      [7, 8, 9, 10, 11, 12, 13, 14],
    ];

    return (
      <div className="flex flex-col items-center space-y-12 w-full max-w-4xl mx-auto p-8 bg-white dark:bg-slate-900 rounded-3xl shadow-inner border border-gray-100 dark:border-slate-800/50 overflow-x-auto">
        {levels.map((level, lIdx) => (
          <div key={lIdx} className="flex justify-around w-full min-w-[600px]">
            {level.map((nodeIdx) => {
              const isPruned = prunedNodes[nodeIdx];
              return (
                <div
                  key={nodeIdx}
                  className={`relative flex flex-col items-center transition-all duration-500 ${isPruned ? "opacity-30 grayscale blur-[1px]" : "opacity-100"}`}
                >
                  <div
                    className={`w-14 h-14 md:w-20 md:h-20 flex flex-col items-center justify-center rounded-2xl border-2 transition-all duration-500 z-10 
                      ${currentNodeClass[nodeIdx] || "bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-700 shadow-sm"}`}
                  >
                    <span className="text-base md:text-xl font-black">
                        {treeNodes[nodeIdx].val === Infinity ? "∞" : treeNodes[nodeIdx].val === -Infinity ? "-∞" : treeNodes[nodeIdx].val}
                    </span>
                    {lIdx < 3 && (
                        <div className="text-[9px] md:text-[11px] font-mono opacity-80 mt-0.5">
                           α:{treeNodes[nodeIdx].alpha === -Infinity ? "-∞" : treeNodes[nodeIdx].alpha} β:{treeNodes[nodeIdx].beta === Infinity ? "∞" : treeNodes[nodeIdx].beta}
                        </div>
                    )}
                  </div>
                  {lIdx < 3 && (
                    <div className="absolute top-full h-12 flex justify-center w-0">
                         {/* Visual branching indicators - ideally handled by SVG, but keeping it simple for now */}
                    </div>
                  )}
                  <div className="mt-2 text-[10px] font-bold tracking-wider text-gray-400 dark:text-gray-500 uppercase">
                    {lIdx === 0 ? "MAX" : lIdx === 1 ? "MIN" : lIdx === 2 ? "MAX" : "LEAF"}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center w-full min-h-[600px] bg-white dark:bg-slate-900 md:p-8 p-4 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-sm mb-12">
      <div className="w-full flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
        <div className="flex flex-col gap-2 w-full md:w-auto">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1"> Leaf Nodes (8 required): </label>
            <input
            type="text"
            className="px-5 py-3 border rounded-xl bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm md:w-[350px]"
            value={arrayElements}
            onChange={(e) => setArrayElements(e.target.value)}
            disabled={isAnimating}
            placeholder="e.g. 3, 5, 2, 9, 12, 5, 23, 23"
            />
        </div>
        
        <div className="flex items-center gap-4">
          <ResetButton onClick={handleReset} />
          <GoButton onClick={handleStart} disabled={isAnimating} />
          <button
            onClick={togglePlayPause}
            className="p-3.5 rounded-xl bg-white dark:bg-slate-800 shadow-md hover:shadow-lg transition-all border border-gray-100 dark:border-slate-700 active:scale-95"
          >
            {isPaused ? <Play size={22} className="text-green-600 fill-current" /> : <Pause size={22} className="text-orange-600 fill-current" />}
          </button>
        </div>
      </div>

      <div className="w-full mb-10 min-h-[64px] text-center bg-gray-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-gray-100 dark:border-slate-700/50">
        <p className="text-xl font-bold text-gray-800 dark:text-gray-100">{message}</p>
        <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mt-2 italic">{stepExplanation}</p>
      </div>

      <div className="relative w-full overflow-x-auto pb-10">
        {renderTree()}
      </div>

      <div className="mt-12 pt-8 w-full border-t border-gray-200 dark:border-slate-800/80 flex flex-wrap justify-center gap-x-8 gap-y-4">
        <div className="flex items-center gap-2.5">
            <span className="w-5 h-5 rounded-full bg-yellow-300 border-2 border-yellow-500 shadow-sm"></span>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Current Node</span>
        </div>
        <div className="flex items-center gap-2.5">
            <span className="w-5 h-5 rounded-full bg-blue-500 border-2 border-blue-700 shadow-sm"></span>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed Node</span>
        </div>
        <div className="flex items-center gap-2.5">
            <span className="w-5 h-5 rounded-full bg-green-500 border-2 border-green-700 shadow-sm"></span>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Evaluating Leaf</span>
        </div>
        <div className="flex items-center gap-2.5">
            <span className="w-5 h-5 rounded-full bg-gray-300 opacity-20 border-2 border-gray-400 shadow-sm"></span>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Pruned</span>
        </div>
      </div>
    </div>
  );
};

export default AlphaBetaPruning;
