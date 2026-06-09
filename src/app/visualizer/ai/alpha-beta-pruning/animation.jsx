"use client";
import React, { useState, useEffect, useRef } from "react";
import { Play, Pause } from "lucide-react";
import ResetButton from "@/app/components/ui/resetButton";
import GoButton from "@/app/components/ui/goButton";
import useVisualizerKeyboard from "@/app/hooks/useVisualizerKeyboard";
import { useAnimationEngine } from "@/lib/visualizer/useAnimationEngine";
import { generateAlphaBetaSteps } from "@/features/algorithms/ai/alphaBetaLogic";
import PlaybackControls from "@/app/components/ui/PlaybackControls";

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

  const handleStart = () => {
    const nums = arrayElements.split(",").map((num) => parseInt(num.trim()));
    if (nums.length !== 8 || nums.some(isNaN)) {
      alert("Please enter exactly 8 numbers.");
      return;
    }

    engine.reset();
    const generatedSteps = generateAlphaBetaSteps(nums);
    setSteps(generatedSteps);
    setTimeout(() => { engine.play(); }, 50);
  };

  useVisualizerKeyboard({
    onStart: engine.isPlaying ? engine.pause : engine.play,
    onTogglePlayPause: engine.isPlaying ? engine.pause : engine.play,
    sorting: engine.isPlaying,
    onReset: handleReset,
    speed: 1000 / engine.speed,
    onSpeedChange: (s) => engine.setSpeed(1000 / s),
    enabled: steps.length > 0,
  });

  const currentStep = steps[engine.currentStep] || null;
  const treeNodes = currentStep ? currentStep.nodes : [];
  const currentNodeClass = currentStep ? currentStep.classes : {};
  const prunedNodes = currentStep ? currentStep.pruned : {};
  const stepExplanation = currentStep ? currentStep.explanation : "";

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
            disabled={engine.isPlaying}
            placeholder="e.g. 3, 5, 2, 9, 12, 5, 23, 23"
            />
        </div>
        
        <div className="flex items-center gap-4">
          <ResetButton onReset={handleReset} />
          <GoButton onClick={handleStart} disabled={engine.isPlaying} />
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
