"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Zap,
  TrendingUp,
  Award,
  ChevronRight,
  Settings,
  HelpCircle
} from "lucide-react";
import {
  VisualizerCard,
  VisualizerInteractiveLayout,
} from "@/app/visualizer/components/VisualizerInteractiveLayout";
import usePlayback from "@/app/hooks/usePlayback";
import PlaybackControls from "@/app/components/ui/PlaybackControls";
import useVisualizerReset from "@/app/hooks/useVisualizerReset";

export default function SortingRaceArena() {
  const [arraySize, setArraySize] = useState(20);
  const [distribution, setDistribution] = useState("random"); // random, reversed, almost-sorted
  const [initialArray, setInitialArray] = useState([]);
  
  // Playback Control States
  const [isRaceRunning, setIsRaceRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [maxSteps, setMaxSteps] = useState(0);
  const { speed, setSpeed } = usePlayback(1);
  const [message, setMessage] = useState("Sorting Race Arena initialized. Click 'Start Race' to watch sorting complexities in action!");

  // Algorithm Specific Run Steps
  const [bubbleSteps, setBubbleSteps] = useState([]);
  const [selectionSteps, setSelectionSteps] = useState([]);
  const [insertionSteps, setInsertionSteps] = useState([]);
  const [quickSteps, setQuickSteps] = useState([]);
  
  // Rankings Tracker
  const [finishOrder, setFinishOrder] = useState([]);

  const timerRef = useRef(null);

  // Initialize shared starting array
  useEffect(() => {
    generateSharedArray();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [arraySize, distribution]);

  const generateSharedArray = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    
    let arr = [];
    if (distribution === "random") {
      arr = Array.from({ length: arraySize }, () => Math.floor(Math.random() * 85) + 15);
    } else if (distribution === "reversed") {
      arr = Array.from({ length: arraySize }, (_, i) => Math.floor(100 - (i / arraySize) * 85));
    } else if (distribution === "almost-sorted") {
      arr = Array.from({ length: arraySize }, (_, i) => Math.floor(15 + (i / arraySize) * 70));
      // Shuffle 2 pairs to make it almost sorted
      if (arr.length > 5) {
        const i1 = 2;
        const i2 = 4;
        [arr[i1], arr[i2]] = [arr[i2], arr[i1]];
        if (arr.length > 8) {
          const i3 = arr.length - 2;
          const i4 = arr.length - 4;
          [arr[i3], arr[i4]] = [arr[i4], arr[i3]];
        }
      }
    }

    setInitialArray(arr);
    
    // Pre-calculate steps for all algorithms
    calculateAllSortSteps(arr);
    
    // Reset Playback
    setCurrentStep(0);
    setMaxSteps(0);
    setIsRaceRunning(false);
    setFinishOrder([]);
    setMessage("Shared starting array generated. All tracks loaded with identical unsorted arrays.");
  };

  useVisualizerReset(() => {
    generateSharedArray();
  });

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // Pre-calculate sorting steps
  const calculateAllSortSteps = (startArr) => {
    // 1. Bubble Sort Steps
    const bArr = [...startArr];
    const bSteps = [{ arr: [...bArr], compared: [], swapped: [], swaps: 0, comps: 0, finished: false }];
    let bSwaps = 0;
    let bComps = 0;
    
    for (let i = 0; i < bArr.length - 1; i++) {
      for (let j = 0; j < bArr.length - i - 1; j++) {
        bComps++;
        const nextSwapped = [];
        if (bArr[j] > bArr[j + 1]) {
          bSwaps++;
          [bArr[j], bArr[j + 1]] = [bArr[j + 1], bArr[j]];
          nextSwapped.push(j, j + 1);
        }
        bSteps.push({
          arr: [...bArr],
          compared: [j, j + 1],
          swapped: nextSwapped,
          swaps: bSwaps,
          comps: bComps,
          finished: false
        });
      }
    }
    bSteps.push({ arr: [...bArr], compared: [], swapped: [], swaps: bSwaps, comps: bComps, finished: true });
    setBubbleSteps(bSteps);

    // 2. Selection Sort Steps
    const sArr = [...startArr];
    const sSteps = [{ arr: [...sArr], compared: [], swapped: [], swaps: 0, comps: 0, finished: false }];
    let sSwaps = 0;
    let sComps = 0;

    for (let i = 0; i < sArr.length - 1; i++) {
      let minIdx = i;
      for (let j = i + 1; j < sArr.length; j++) {
        sComps++;
        sSteps.push({
          arr: [...sArr],
          compared: [j, minIdx],
          swapped: [],
          swaps: sSwaps,
          comps: sComps,
          finished: false
        });
        if (sArr[j] < sArr[minIdx]) {
          minIdx = j;
        }
      }
      if (minIdx !== i) {
        sSwaps++;
        [sArr[i], sArr[minIdx]] = [sArr[minIdx], sArr[i]];
      }
      sSteps.push({
        arr: [...sArr],
        compared: [],
        swapped: [i, minIdx],
        swaps: sSwaps,
        comps: sComps,
        finished: false
      });
    }
    sSteps.push({ arr: [...sArr], compared: [], swapped: [], swaps: sSwaps, comps: sComps, finished: true });
    setSelectionSteps(sSteps);

    // 3. Insertion Sort Steps
    const iArr = [...startArr];
    const iSteps = [{ arr: [...iArr], compared: [], swapped: [], swaps: 0, comps: 0, finished: false }];
    let iSwaps = 0;
    let iComps = 0;

    for (let i = 1; i < iArr.length; i++) {
      const key = iArr[i];
      let j = i - 1;
      iComps++;
      iSteps.push({
        arr: [...iArr],
        compared: [j, j + 1],
        swapped: [],
        swaps: iSwaps,
        comps: iComps,
        finished: false
      });
      while (j >= 0 && iArr[j] > key) {
        iComps++;
        iSwaps++;
        iArr[j + 1] = iArr[j];
        iSteps.push({
          arr: [...iArr],
          compared: [j, j + 1],
          swapped: [j + 1],
          swaps: iSwaps,
          comps: iComps,
          finished: false
        });
        j--;
      }
      iArr[j + 1] = key;
      iSteps.push({
        arr: [...iArr],
        compared: [],
        swapped: [j + 1],
        swaps: iSwaps,
        comps: iComps,
        finished: false
      });
    }
    iSteps.push({ arr: [...iArr], compared: [], swapped: [], swaps: iSwaps, comps: iComps, finished: true });
    setInsertionSteps(iSteps);

    // 4. Quick Sort Steps (Lomuto Partition)
    const qArr = [...startArr];
    const qSteps = [{ arr: [...qArr], compared: [], swapped: [], swaps: 0, comps: 0, finished: false }];
    let qSwaps = 0;
    let qComps = 0;

    const partition = (arr, low, high) => {
      const pivot = arr[high];
      let idx = low - 1;
      
      for (let j = low; j < high; j++) {
        qComps++;
        qSteps.push({
          arr: [...arr],
          compared: [j, high],
          swapped: [],
          swaps: qSwaps,
          comps: qComps,
          finished: false
        });
        if (arr[j] < pivot) {
          idx++;
          qSwaps++;
          [arr[idx], arr[j]] = [arr[j], arr[idx]];
          qSteps.push({
            arr: [...arr],
            compared: [],
            swapped: [idx, j],
            swaps: qSwaps,
            comps: qComps,
            finished: false
          });
        }
      }
      qSwaps++;
      [arr[idx + 1], arr[high]] = [arr[high], arr[idx + 1]];
      qSteps.push({
        arr: [...arr],
        compared: [],
        swapped: [idx + 1, high],
        swaps: qSwaps,
        comps: qComps,
        finished: false
      });
      return idx + 1;
    };

    const quickSort = (arr, low, high) => {
      if (low < high) {
        const pIdx = partition(arr, low, high);
        quickSort(arr, low, pIdx - 1);
        quickSort(arr, pIdx + 1, high);
      }
    };

    quickSort(qArr, 0, qArr.length - 1);
    qSteps.push({ arr: [...qArr], compared: [], swapped: [], swaps: qSwaps, comps: qComps, finished: true });
    setQuickSteps(qSteps);

    // Compute maximum steps among all algorithms to bound our slider
    const totalMax = Math.max(bSteps.length, sSteps.length, iSteps.length, qSteps.length);
    setMaxSteps(totalMax);
  };

  // Synchronized Playback Loop
  useEffect(() => {
    if (!isRaceRunning || maxSteps === 0) return;

    if (currentStep >= maxSteps) {
      setIsRaceRunning(false);
      return;
    }

    // Determine rankings dynamically based on which algorithm finishes first
    const newFinishOrder = [...finishOrder];
    
    const checkFinish = (algoSteps, algoName) => {
      const stepIdx = Math.min(currentStep, algoSteps.length - 1);
      const isFinished = algoSteps[stepIdx]?.finished;
      if (isFinished && !newFinishOrder.includes(algoName)) {
        newFinishOrder.push(algoName);
      }
    };

    checkFinish(quickSteps, "Quick");
    checkFinish(insertionSteps, "Insertion");
    checkFinish(selectionSteps, "Selection");
    checkFinish(bubbleSteps, "Bubble");

    if (newFinishOrder.length !== finishOrder.length) {
      setFinishOrder(newFinishOrder);
    }

    // Generate messaging
    if (newFinishOrder.length === 4) {
      setIsRaceRunning(false);
      setMessage(`Race Complete! 🥇 Quick Sort finished 1st, followed by 🥈 Insertion Sort, 🥉 Selection Sort, and 🐢 Bubble Sort.`);
    } else {
      setMessage(`Race in progress... Step ${currentStep + 1} / ${maxSteps}. Watch Quick Sort leap ahead!`);
    }

    timerRef.current = setTimeout(() => {
      if (currentStep < maxSteps - 1) {
        setCurrentStep(prev => prev + 1);
      } else {
        setIsRaceRunning(false);
      }
    }, 1800 / (speed * 4)); // scale speed higher for comparative race

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isRaceRunning, currentStep, maxSteps, speed, bubbleSteps, selectionSteps, insertionSteps, quickSteps, finishOrder]);

  const startRace = () => {
    if (maxSteps === 0) return;
    setIsRaceRunning(true);
    let nextIdx = currentStep >= maxSteps - 1 ? 0 : currentStep + 1;
    if (nextIdx === 0) setFinishOrder([]);
    setCurrentStep(nextIdx);
  };

  const pauseRace = () => {
    setIsRaceRunning(false);
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const stepForward = () => {
    setIsRaceRunning(false);
    if (currentStep < maxSteps - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const stepBackward = () => {
    setIsRaceRunning(false);
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const resetPlayback = () => {
    setIsRaceRunning(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    setCurrentStep(0);
    setFinishOrder([]);
    setMessage("Race reset. Click 'Start Race' to run again.");
  };

  // Get index clamped data for current step
  const getAlgoStepData = (algoSteps) => {
    if (algoSteps.length === 0) return { arr: initialArray, compared: [], swapped: [], swaps: 0, comps: 0, finished: false };
    const clampedIdx = Math.min(currentStep, algoSteps.length - 1);
    return algoSteps[clampedIdx];
  };

  const bData = getAlgoStepData(bubbleSteps);
  const sData = getAlgoStepData(selectionSteps);
  const iData = getAlgoStepData(insertionSteps);
  const qData = getAlgoStepData(quickSteps);

  const getRankBadge = (algoName) => {
    const idx = finishOrder.indexOf(algoName);
    if (idx === 0) return { emoji: "🥇", text: "1st", color: "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-950/40 dark:text-yellow-300 dark:border-yellow-900" };
    if (idx === 1) return { emoji: "🥈", text: "2nd", color: "bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-950/40 dark:text-slate-300 dark:border-slate-900" };
    if (idx === 2) return { emoji: "🥉", text: "3rd", color: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900" };
    if (idx === 3) return { emoji: "🐢", text: "4th", color: "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-950/40 dark:text-orange-300 dark:border-orange-900" };
    return null;
  };

  return (
    <VisualizerInteractiveLayout>
      {/* 1. Control Desk */}
      <VisualizerCard>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
          
          {/* Preset parameters */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
              <Settings className="w-4.5 h-4.5 text-[#a435f0]" /> Parameters
            </h3>

            {/* Set Array Size */}
            <div className="flex flex-col">
              <label className="text-[10px] text-gray-500 mb-1">Array Size N (10-35)</label>
              <input
                type="number"
                min="10"
                max="35"
                value={arraySize}
                onChange={(e) => setArraySize(Math.min(35, Math.max(10, parseInt(e.target.value) || 10)))}
                className="rounded-lg border p-2 text-sm dark:bg-gray-700 w-full"
                disabled={isRaceRunning}
              />
            </div>

            {/* Distribution */}
            <div className="flex flex-col">
              <label className="text-[10px] text-gray-500 mb-1">Data Layout Preset</label>
              <select
                value={distribution}
                onChange={(e) => setDistribution(e.target.value)}
                className="rounded-lg border p-2 text-sm dark:bg-gray-700 w-full text-md"
                disabled={isRaceRunning}
              >
                <option value="random">Random Distribution</option>
                <option value="reversed">Fully Reversed Array</option>
                <option value="almost-sorted">Almost Sorted Array</option>
              </select>
            </div>
          </div>

          {/* Quick presets/Toggles */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
              <TrendingUp className="w-4.5 h-4.5 text-[#a435f0]" /> Sorting Race Rules
            </h3>
            <div className="bg-[#faf5ff] dark:bg-[#1a0a2e] p-3.5 rounded-lg border border-[#e9d5ff] dark:border-[#3b1a6e] text-xs text-purple-950 dark:text-purple-300 leading-relaxed space-y-2">
              <div>🏎️ <strong>The Rules of the Track:</strong></div>
              <ul className="list-disc pl-4 space-y-1.5 text-[11px]">
                <li>All 4 algorithms start with the **exact same** starting array configuration.</li>
                <li>When the race starts, they step forward in perfect sync.</li>
                <li>Quadratic sorts ($O(N^2)$) take more steps and crawl slowly.</li>
                <li>Divide-and-conquer **Quick Sort** ($O(N \log N)$) splits datasets and finishes with a fraction of the operations!</li>
              </ul>
            </div>
          </div>

          {/* Leaderboard Summary */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
              <Award className="w-4.5 h-4.5 text-[#a435f0]" /> Live Leaderboard
            </h3>
            
            <div className="border dark:border-gray-800 rounded-xl p-3 bg-gray-50/50 dark:bg-gray-800/10 min-h-[92px] flex flex-col justify-center gap-2">
              {finishOrder.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {finishOrder.map((name, i) => {
                    const badge = getRankBadge(name);
                    return (
                      <span
                        key={name}
                        className={`flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg border shadow-sm ${badge?.color}`}
                      >
                        <span>{badge?.emoji}</span>
                        <span>{name}</span>
                      </span>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center text-xs text-gray-400 italic">No algorithms completed yet. Click Start Race!</div>
              )}
            </div>
          </div>
        </div>

        {/* Playback deck */}
        <div className="mt-6">
          <PlaybackControls
            isPlaying={isRaceRunning}
            onPlayPause={isRaceRunning ? pauseRace : startRace}
            onStepForward={stepForward}
            onStepBackward={stepBackward}
            onReset={resetPlayback}
            speed={speed}
            onSpeedChange={setSpeed}
            disabled={maxSteps === 0}
            showPlayPause={true}
          />
        </div>
      </VisualizerCard>

      {/* 2. Visual Status card */}
      <VisualizerCard
        className={
          message.includes("Complete")
            ? "border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/30"
            : isRaceRunning
              ? "border-[#a435f0]/30 bg-[#a435f0]/10 dark:border-[#a435f0]/50 dark:bg-[#a435f0]/20"
              : ""
        }
      >
        <div className="flex justify-between items-center text-xs text-gray-500 mb-2">
          <span>Race Action Log</span>
          <span className="font-bold bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
            Step {currentStep} / {maxSteps}
          </span>
        </div>
        <p className="text-center font-medium text-lg min-h-[28px]">{message}</p>
      </VisualizerCard>

      {/* 3. 4-Track Race Canvas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        
        {/* Track 1: Bubble Sort */}
        <VisualizerCard className="relative overflow-hidden">
          {/* Header & Scoreboard */}
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-sm text-gray-700 dark:text-gray-300">Bubble Sort Track</h3>
            <div className="flex items-center gap-1.5">
              {bData.finished && (
                <span className={`px-2 py-0.5 text-xs font-bold rounded-lg border ${getRankBadge("Bubble")?.color}`}>
                  {getRankBadge("Bubble")?.emoji} {getRankBadge("Bubble")?.text}
                </span>
              )}
            </div>
          </div>

          <div className="flex justify-around items-end bg-gray-50 dark:bg-gray-900/50 p-4 border border-gray-100 dark:border-gray-800 rounded-xl min-h-[160px] h-[160px]">
            {bData.arr.map((val, idx) => {
              const isComp = bData.compared.includes(idx);
              const isSwap = bData.swapped.includes(idx);
              const isSorted = bData.finished;
              
              let barColor = "bg-[#a435f0]/40 border-[#a435f0]/60 dark:bg-[#a435f0]/60 dark:border-[#a435f0]/70";
              if (isComp) barColor = "bg-orange-400 border-orange-500";
              if (isSwap) barColor = "bg-emerald-400 border-emerald-500";
              if (isSorted) barColor = "bg-purple-500 border-purple-600";

              return (
                <div
                  key={idx}
                  className={`w-full mx-[1px] border rounded-t-sm transition-all duration-300 ${barColor}`}
                  style={{ height: `${val}%` }}
                />
              );
            })}
          </div>

          <div className="grid grid-cols-2 gap-2 mt-3 text-[10px] text-gray-500">
            <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded-lg text-center">
              <div>Comparisons</div>
              <div className="font-bold text-gray-800 dark:text-white text-sm">{bData.comps}</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded-lg text-center">
              <div>Swaps / Writes</div>
              <div className="font-bold text-gray-800 dark:text-white text-sm">{bData.swaps}</div>
            </div>
          </div>
        </VisualizerCard>

        {/* Track 2: Selection Sort */}
        <VisualizerCard className="relative overflow-hidden">
          {/* Header & Scoreboard */}
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-sm text-gray-700 dark:text-gray-300">Selection Sort Track</h3>
            <div className="flex items-center gap-1.5">
              {sData.finished && (
                <span className={`px-2 py-0.5 text-xs font-bold rounded-lg border ${getRankBadge("Selection")?.color}`}>
                  {getRankBadge("Selection")?.emoji} {getRankBadge("Selection")?.text}
                </span>
              )}
            </div>
          </div>

          <div className="flex justify-around items-end bg-gray-50 dark:bg-gray-900/50 p-4 border border-gray-100 dark:border-gray-800 rounded-xl min-h-[160px] h-[160px]">
            {sData.arr.map((val, idx) => {
              const isComp = sData.compared.includes(idx);
              const isSwap = sData.swapped.includes(idx);
              const isSorted = sData.finished;
              
              let barColor = "bg-[#a435f0]/40 border-[#a435f0]/60 dark:bg-[#a435f0]/60 dark:border-[#a435f0]/70";
              if (isComp) barColor = "bg-orange-400 border-orange-500";
              if (isSwap) barColor = "bg-emerald-400 border-emerald-500";
              if (isSorted) barColor = "bg-purple-500 border-purple-600";

              return (
                <div
                  key={idx}
                  className={`w-full mx-[1px] border rounded-t-sm transition-all duration-300 ${barColor}`}
                  style={{ height: `${val}%` }}
                />
              );
            })}
          </div>

          <div className="grid grid-cols-2 gap-2 mt-3 text-[10px] text-gray-500">
            <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded-lg text-center">
              <div>Comparisons</div>
              <div className="font-bold text-gray-800 dark:text-white text-sm">{sData.comps}</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded-lg text-center">
              <div>Swaps / Writes</div>
              <div className="font-bold text-gray-800 dark:text-white text-sm">{sData.swaps}</div>
            </div>
          </div>
        </VisualizerCard>

        {/* Track 3: Insertion Sort */}
        <VisualizerCard className="relative overflow-hidden">
          {/* Header & Scoreboard */}
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-sm text-gray-700 dark:text-gray-300">Insertion Sort Track</h3>
            <div className="flex items-center gap-1.5">
              {iData.finished && (
                <span className={`px-2 py-0.5 text-xs font-bold rounded-lg border ${getRankBadge("Insertion")?.color}`}>
                  {getRankBadge("Insertion")?.emoji} {getRankBadge("Insertion")?.text}
                </span>
              )}
            </div>
          </div>

          <div className="flex justify-around items-end bg-gray-50 dark:bg-gray-900/50 p-4 border border-gray-100 dark:border-gray-800 rounded-xl min-h-[160px] h-[160px]">
            {iData.arr.map((val, idx) => {
              const isComp = iData.compared.includes(idx);
              const isSwap = iData.swapped.includes(idx);
              const isSorted = iData.finished;
              
              let barColor = "bg-[#a435f0]/40 border-[#a435f0]/60 dark:bg-[#a435f0]/60 dark:border-[#a435f0]/70";
              if (isComp) barColor = "bg-orange-400 border-orange-500";
              if (isSwap) barColor = "bg-emerald-400 border-emerald-500";
              if (isSorted) barColor = "bg-purple-500 border-purple-600";

              return (
                <div
                  key={idx}
                  className={`w-full mx-[1px] border rounded-t-sm transition-all duration-300 ${barColor}`}
                  style={{ height: `${val}%` }}
                />
              );
            })}
          </div>

          <div className="grid grid-cols-2 gap-2 mt-3 text-[10px] text-gray-500">
            <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded-lg text-center">
              <div>Comparisons</div>
              <div className="font-bold text-gray-800 dark:text-white text-sm">{iData.comps}</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded-lg text-center">
              <div>Swaps / Writes</div>
              <div className="font-bold text-gray-800 dark:text-white text-sm">{iData.swaps}</div>
            </div>
          </div>
        </VisualizerCard>

        {/* Track 4: Quick Sort */}
        <VisualizerCard className="relative overflow-hidden">
          {/* Header & Scoreboard */}
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-sm text-gray-700 dark:text-gray-300">Quick Sort Track (Lomuto Pivot)</h3>
            <div className="flex items-center gap-1.5">
              {qData.finished && (
                <span className={`px-2 py-0.5 text-xs font-bold rounded-lg border ${getRankBadge("Quick")?.color}`}>
                  {getRankBadge("Quick")?.emoji} {getRankBadge("Quick")?.text}
                </span>
              )}
            </div>
          </div>

          <div className="flex justify-around items-end bg-gray-50 dark:bg-gray-900/50 p-4 border border-gray-100 dark:border-gray-800 rounded-xl min-h-[160px] h-[160px]">
            {qData.arr.map((val, idx) => {
              const isComp = qData.compared.includes(idx);
              const isSwap = qData.swapped.includes(idx);
              const isSorted = qData.finished;
              
              let barColor = "bg-[#a435f0]/40 border-[#a435f0]/60 dark:bg-[#a435f0]/60 dark:border-[#a435f0]/70";
              if (isComp) barColor = "bg-orange-400 border-orange-500";
              if (isSwap) barColor = "bg-emerald-400 border-emerald-500";
              if (isSorted) barColor = "bg-purple-500 border-purple-600";

              return (
                <div
                  key={idx}
                  className={`w-full mx-[1px] border rounded-t-sm transition-all duration-300 ${barColor}`}
                  style={{ height: `${val}%` }}
                />
              );
            })}
          </div>

          <div className="grid grid-cols-2 gap-2 mt-3 text-[10px] text-gray-500">
            <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded-lg text-center">
              <div>Comparisons</div>
              <div className="font-bold text-gray-800 dark:text-white text-sm">{qData.comps}</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded-lg text-center">
              <div>Swaps / Writes</div>
              <div className="font-bold text-gray-800 dark:text-white text-sm">{qData.swaps}</div>
            </div>
          </div>
        </VisualizerCard>

      </div>
    </VisualizerInteractiveLayout>
  );
}
