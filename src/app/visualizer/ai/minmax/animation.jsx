"use client";
import React, { useState, useEffect, useRef } from "react";
import { Play, Pause } from "lucide-react";
import ResetButton from "@/app/components/ui/resetButton";
import GoButton from "@/app/components/ui/goButton";
import usePlayback from "@/app/hooks/usePlayback";

const MinMax = () => {
  const [arrayElements, setArrayElements] = useState("3, 5, 2, 9, 12, 5, 23, 23");
  const [treeNodes, setTreeNodes] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [message, setMessage] = useState("Enter 8 comma-separated numbers for leaf nodes.");
  const [stepExplanation, setStepExplanation] = useState("");
  const [currentNodeClass, setCurrentNodeClass] = useState({});

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

  const runMinMax = async (nodes) => {
    setMessage("Running Min Max Algorithm...");
    let newClasses = { ...currentNodeClass };
    
    // We have 15 nodes in total: 0 to 6 are internal, 7 to 14 are leaves.
    // Level 3: leaves (indices 7-14), max depth
    // Level 2: max nodes (indices 3-6)
    // Level 1: min nodes (indices 1-2)
    // Level 0: max node (index 0)
    
    const evaluate = async (nodeIndex, depth, isMax) => {
      if (depth === 3) {
        newClasses[nodeIndex] = "bg-green-500 text-white border-green-700";
        setCurrentNodeClass({...newClasses});
        setStepExplanation(`Evaluating leaf node at distance ${nodeIndex - 7}, value: ${nodes[nodeIndex].val}`);
        await delay(1000);
        return nodes[nodeIndex].val;
      }
      
      newClasses[nodeIndex] = "bg-yellow-300 text-black border-yellow-500";
      setCurrentNodeClass({...newClasses});
      setStepExplanation(`Visiting ${isMax ? "Max" : "Min"} node.`);
      await delay(1000);
      
      const leftChild = 2 * nodeIndex + 1;
      const rightChild = 2 * nodeIndex + 2;
      
      const leftVal = await evaluate(leftChild, depth + 1, !isMax);
      const rightVal = await evaluate(rightChild, depth + 1, !isMax);
      
      const bestVal = isMax ? Math.max(leftVal, rightVal) : Math.min(leftVal, rightVal);
      
      nodes[nodeIndex].val = bestVal;
      setTreeNodes([...nodes]);
      
      newClasses[leftChild] = "bg-gray-300 text-black border-gray-400";
      newClasses[rightChild] = "bg-gray-300 text-black border-gray-400";
      newClasses[nodeIndex] = "bg-blue-500 text-white border-blue-700";
      setCurrentNodeClass({...newClasses});
      
      setStepExplanation(`${isMax ? "Max" : "Min"} node completed. Chose ${bestVal} from (${leftVal}, ${rightVal}).`);
      await delay(1000);
      
      return bestVal;
    };
    
    const rootVal = await evaluate(0, 0, true);
    setStepExplanation(`Algorithm finished. Optimal value is ${rootVal}.`);
    setMessage(`Finished! Optimal value: ${rootVal}`);
    setIsAnimating(false);
  };

  const handleGo = (e) => {
    e.preventDefault();
    if (isAnimating) return;

    if (!arrayElements.trim()) {
      setMessage("Please enter array elements.");
      return;
    }

    const arr = arrayElements.split(",").map((x) => Number(x.trim()));
    if (arr.some(isNaN) || arr.length !== 8) {
      setMessage("Please enter exactly 8 valid numbers.");
      return;
    }

    const initNodes = new Array(15).fill(null).map((_, i) => ({
      val: i >= 7 ? arr[i - 7] : "?",
      id: i,
    }));
    
    setTreeNodes(initNodes);
    setCurrentNodeClass({});
    setIsAnimating(true);
    
    setTimeout(() => {
        runMinMax(initNodes);
    }, 1000);
  };

  const renderTree = () => {
    if (treeNodes.length === 0) return null;
    
    const getPos = (index) => {
      // Very basic tree positioning
      // Level 0: y: 40, x: 400
      // Level 1: y: 120, x: 200, 600
      // Level 2: y: 200, x: 100, 300, 500, 700
      // Level 3: y: 280, x: 50, 150, 250, 350, 450, 550, 650, 750
      
      let x = 0, y = 0;
      if (index === 0) { x = 400; y = 40; }
      else if (index >= 1 && index <= 2) { y = 120; x = 400 + (index - 1.5) * 400; }
      else if (index >= 3 && index <= 6) { y = 200; x = 400 + (index - 4.5) * 200; }
      else if (index >= 7 && index <= 14) { y = 280; x = 50 + (index - 7) * 100; }
      
      return { x, y };
    };

    const edges = [];
    for (let i = 0; i <= 6; i++) {
        const p1 = getPos(i);
        const p2_left = getPos(2 * i + 1);
        const p2_right = getPos(2 * i + 2);
        edges.push(<line key={`edge-${i}-L`} x1={p1.x} y1={p1.y} x2={p2_left.x} y2={p2_left.y} stroke="#888" strokeWidth="2" />);
        edges.push(<line key={`edge-${i}-R`} x1={p1.x} y1={p1.y} x2={p2_right.x} y2={p2_right.y} stroke="#888" strokeWidth="2" />);
    }

    return (
      <div className="relative w-full max-w-4xl mx-auto overflow-x-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mt-8">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
            Game Tree Visualization
        </h2>
        <div className="min-w-[800px] h-[340px] relative mx-auto">
          <svg className="absolute w-full h-full left-0 top-0 pointer-events-none">
            {edges}
          </svg>
          
          {treeNodes.map((node, i) => {
            const pos = getPos(i);
            const r = 20;
            const styleClass = currentNodeClass[i] || "bg-white text-gray-800 border-gray-400";
            return (
              <div
                key={i}
                className={`absolute flex justify-center items-center font-bold border-2 rounded-full transition-all duration-300 shadow-sm ${styleClass}`}
                style={{
                  width: `${2*r}px`,
                  height: `${2*r}px`,
                  left: `${pos.x - r}px`,
                  top: `${pos.y - r}px`,
                  zIndex: 10
                }}
              >
                {node.val}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <main className="min-h-screen py-8 px-4 sm:px-6 mt-16 font-sans">
      <div className="max-w-3xl mx-auto text-center mb-8">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">
          Min Max Visualization
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Observe how the Min Max algorithm discovers the optimal leaf node value!
        </p>
      </div>

      <form onSubmit={handleGo} className="max-w-3xl mx-auto mb-8 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="flex-1">
            <label htmlFor="arrayElements" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Array Elements (comma separated - exactly 8 items)
            </label>
            <input
              id="arrayElements"
              type="text"
              value={arrayElements}
              onChange={(e) => setArrayElements(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-gray-800 dark:text-gray-200 font-mono"
              placeholder="e.g., 3, 5, 2, 9, 12, 5, 23, 23"
              disabled={isAnimating}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-2 self-end sm:w-auto w-full">
            <GoButton onClick={handleGo} isAnimating={isAnimating} disabled={isAnimating} />
            <ResetButton onReset={handleReset} isAnimating={isAnimating} />
          </div>
        </div>

        {isAnimating && (
          <div className="flex flex-col sm:flex-row items-center justify-between mb-4 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl border border-gray-200 dark:border-gray-700 gap-4">
            <button
              type="button"
              onClick={togglePlayPause}
              className="flex items-center gap-2 bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors font-medium shadow-sm w-full sm:w-auto justify-center"
            >
              {isPaused ? <Play size={20} /> : <Pause size={20} />}
              {isPaused ? "Play" : "Pause"}
            </button>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={decreaseSpeed}
                className="bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600 px-4 py-2 rounded-lg transition-colors shadow-sm"
                disabled={speed <= 0.5}
              >-</button>
              <span className="text-gray-700 dark:text-gray-300 font-medium min-w-[80px] text-center">
                Speed: {speed}x
              </span>
              <button
                type="button"
                onClick={increaseSpeed}
                className="bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600 px-4 py-2 rounded-lg transition-colors shadow-sm"
                disabled={speed >= 5}
              >+</button>
            </div>
          </div>
        )}
      </form>

      {message && (
        <div className="max-w-3xl mx-auto mb-8 p-4 rounded-lg bg-blue-50 dark:bg-gray-800 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-gray-700">
          <p className="text-center font-medium">{message}</p>
        </div>
      )}

      {stepExplanation && (
        <div className="max-w-4xl mx-auto mb-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
          <div className="flex items-center gap-2 bg-[#a435f0]/10 dark:bg-[#a435f0]/20 px-4 py-2 border-b border-[#a435f0]/20">
            <span className="w-2 h-2 rounded-full bg-[#a435f0] animate-pulse"></span>
            <span className="text-sm font-semibold text-[#a435f0] dark:text-[#c56eff] uppercase tracking-wide">
              Step Explanation
            </span>
          </div>
          <div className="px-4 py-3">
            <p className="text-gray-700 dark:text-gray-200 text-sm leading-relaxed font-mono">
              {stepExplanation}
            </p>
          </div>
        </div>
      )}

      {renderTree()}
    </main>
  );
};

export default MinMax;
