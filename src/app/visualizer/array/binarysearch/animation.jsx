"use client";
import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Play, Pause } from "lucide-react";
import ResetButton from "@/app/components/ui/resetButton";
import GoButton from "@/app/components/ui/goButton";
import { saveToStorage, loadFromStorage, removeFromStorage } from "@/utils/storage";
import useVisualizerKeyboard from "@/app/hooks/useVisualizerKeyboard";
import usePlayback from "@/app/hooks/usePlayback";
import PlaybackControls from "@/app/components/ui/PlaybackControls";
import useVisualizerReset from "@/app/hooks/useVisualizerReset";
import { binarySearchGenerator } from "@/features/algorithms/array/binarySearchLogic";

const getFontSize = (value) => {
  const len = String(value).length;
  if (len <= 2) return "text-lg";
  if (len === 3) return "text-sm";
  return "text-xs";
};

const BinarySearch = () => {
  const [arrayElements, setArrayElements] = useState(() =>
    loadFromStorage("binary-array-elements", "")
  );
  const [target, setTarget] = useState(() =>
    loadFromStorage("binary-target", "")
  );
  const [array, setArray] = useState([]);
  const [i, setI] = useState(-1);
  const [j, setJ] = useState(-1);
  const [mid, setMid] = useState(-1);
  const [foundIndex, setFoundIndex] = useState(-1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [stepExplanation, setStepExplanation] = useState("");
  const [stepCount, setStepCount] = useState(0);
  const [autoSort, setAutoSort] = useState(false);
  const [showAutoSort, setShowAutoSort] = useState(false);

  const {
    isPaused,
    speed,
    speedRef,
    setSpeed,
    togglePlayPause,
    increaseSpeed,
    decreaseSpeed,
    checkPause,
  } = usePlayback(() => loadFromStorage("binary-speed", 1));

  const animationRef = useRef(null);
  const resolveRef = useRef(null);
  const isSearchingRef = useRef(false);
  const formRef = useRef(null);
  const elementRefs = useRef([]);

  useEffect(() => { saveToStorage("binary-array-elements", arrayElements); }, [arrayElements]);
  useEffect(() => { saveToStorage("binary-target", target); }, [target]);
  useEffect(() => {
    saveToStorage("binary-speed", speed);
    speedRef.current = speed;
  }, [speed, speedRef]);

  const handleReset = () => {
    isSearchingRef.current = false;
    clearTimeout(animationRef.current);
    if (resolveRef.current) {
      resolveRef.current();
      resolveRef.current = null;
    }
    removeFromStorage("binary-array-elements");
    removeFromStorage("binary-target");
    removeFromStorage("binary-speed");
    setArray([]); setI(-1); setJ(-1); setMid(-1); setFoundIndex(-1);
    setMessage(""); setMessageType(""); setStepExplanation(""); setStepCount(0);
    setIsAnimating(false); 
    setAutoSort(false);
    setShowAutoSort(false);
    setArrayElements(""); setTarget(""); setSpeed(1);
    if (formRef.current) formRef.current.reset();
    elementRefs.current.forEach((ref) => {
      if (ref) gsap.to(ref, { backgroundColor: "#E5E7EB", borderColor: "#D1D5DB", duration: 0 });
    });
  };

  const generateRandomArray = () => {
    if (isAnimating) return;
    const size = Math.floor(Math.random() * 6) + 5;
    const elements = Array.from({ length: size }, () =>
      Math.floor(Math.random() * 100)
    ).sort((a, b) => a - b);
    setArrayElements(elements.join(", "));
  };

  const cancellableDelay = async (multiplier = 1) => {
    await new Promise((resolve) => {
      resolveRef.current = resolve;
      animationRef.current = setTimeout(resolve, (1500 / speedRef.current) * multiplier);
    });
    await checkPause();
  };

  const animateBinarySearch = async (processedElements, targetValue) => {
    isSearchingRef.current = true;
    const generator = binarySearchGenerator(processedElements, targetValue);

    for (const frame of generator) {
      if (!isSearchingRef.current) return;

      if (frame.type === 'checking') {
        setI(frame.l);
        setJ(frame.h);
        setMid(frame.m);
        setStepCount(frame.step);
        setStepExplanation(
          `Step ${frame.step}: low=${frame.l}, high=${frame.h} → mid = ⌊(${frame.l} + ${frame.h}) / 2⌋ = ${frame.m}. Comparing arr[${frame.m}] = ${frame.arrM} with target ${targetValue}.`
        );

        elementRefs.current.forEach((ref, index) => {
          if (!ref) return;
          if (index === frame.m) {
            gsap.to(ref, { backgroundColor: "#EAB308", borderColor: "#A16207", duration: 0.3 });
          } else if (index >= frame.l && index <= frame.h) {
            gsap.to(ref, { backgroundColor: "#93C5FD", borderColor: "#3B82F6", duration: 0.3 });
          } else {
            gsap.to(ref, { backgroundColor: "#E5E7EB", borderColor: "#D1D5DB", duration: 0.3 });
          }
        });

        await cancellableDelay(1);
      } else if (frame.type === 'found') {
        setFoundIndex(frame.m);
        setMessage(`Element ${targetValue} found at index ${frame.m}!`);
        setMessageType("success");
        setStepExplanation(
          `✓ arr[${frame.m}] = ${targetValue} equals target ${targetValue}. Found at index ${frame.m} after ${frame.step} step${frame.step > 1 ? "s" : ""}!`
        );
        setIsAnimating(false);
        isSearchingRef.current = false;
        gsap.to(elementRefs.current[frame.m], {
          backgroundColor: "#22C55E",
          borderColor: "#15803D",
          duration: 0.3,
        });
        return;
      } else if (frame.type === 'discard_left') {
        setStepExplanation(
          `arr[${frame.m}] = ${processedElements[frame.m]} < target ${targetValue} → target is in the RIGHT half. Discard left side. New low = ${frame.m + 1}.`
        );
        await cancellableDelay(0.6);
      } else if (frame.type === 'discard_right') {
        setStepExplanation(
          `arr[${frame.m}] = ${processedElements[frame.m]} > target ${targetValue} → target is in the LEFT half. Discard right side. New high = ${frame.m - 1}.`
        );
        await cancellableDelay(0.6);
      } else if (frame.type === 'not_found') {
        setMessage(`Element ${targetValue} not found in the array.`);
        setMessageType("error");
        setStepExplanation(
          `Search range exhausted (low > high). The element ${targetValue} does not exist in this array.`
        );
        setIsAnimating(false);
        isSearchingRef.current = false;
        return;
      }
    }
  };

  const handleGo = (e) => {
    e.preventDefault();
    handleReset();

    if (!arrayElements || !target) {
      setMessage("Please fill in all fields.");
      setMessageType("warning");
      return;
    }

    const rawElements = arrayElements.split(",").map((el) => el.trim());
    if (rawElements.some((el) => el.includes("."))) {
      setMessage("Only integers are supported. Please remove decimal values.");
      setMessageType("warning");
      return;
    }

    const elements = rawElements.map((el) => parseInt(el));
    const targetValue = parseInt(target);

    if (elements.some(isNaN) || isNaN(targetValue)) {
      setMessage("Invalid array elements or target.");
      setMessageType("warning");
      return;
    }

    const isSorted = elements.every(
      (el, idx) => idx === 0 || el >= elements[idx - 1]
    );

    if (!isSorted && !autoSort) {
      setMessage("Array must be sorted in ascending order.");
      setMessageType("warning");
      setShowAutoSort(true);
      return;
    }

    let processedElements = [...elements];

    if (!isSorted && autoSort) {  
      processedElements.sort((a, b) => a - b);
      setArrayElements(processedElements.join(", "));
      setShowAutoSort(false);
    }

    setArray(processedElements);
    setI(0);
    setJ(processedElements.length - 1);
    setIsAnimating(true);
    
    animateBinarySearch(processedElements, targetValue);
  };

  const togglePlayPauseRef = useRef(togglePlayPause);
  useEffect(() => { togglePlayPauseRef.current = togglePlayPause; }, [togglePlayPause]);

  const isAnimatingRef = useRef(isAnimating);
  useVisualizerReset(() => {
    handleReset();
  });
  useEffect(() => { isAnimatingRef.current = isAnimating; }, [isAnimating]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        e.code === "Space" &&
        isAnimatingRef.current &&
        document.activeElement.tagName !== "INPUT" &&
        document.activeElement.tagName !== "BUTTON"
      ) {
        e.preventDefault();
        togglePlayPauseRef.current();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const messageClass =
    messageType === "success"
      ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
      : messageType === "warning"
      ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
      : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200";

  return (
    <main className="container mx-auto">
      <p className="text-lg text-center text-gray-600 dark:text-gray-400 mb-8">
        Visualize how Binary Search efficiently finds an element in a sorted array.
      </p>
      <form
        ref={formRef}
        onSubmit={handleGo}
        className="max-w-4xl mx-auto bg-white dark:bg-neutral-950 p-6 rounded-xl border border-gray-200 dark:border-gray-700 mb-8"
      >
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="arrayElements">
            Sorted Array Elements (comma-separated)
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              id="arrayElements"
              value={arrayElements}
              onChange={(e) => setArrayElements(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:border-[#a435f0] focus:outline-none focus:ring-2 focus:ring-[#a435f0]/30 transition duration-300"
              placeholder="e.g., 1, 3, 4, 6, 8"
              disabled={isAnimating}
            />
            <button
              type="button"
              onClick={generateRandomArray}
              className="px-4 py-2 font-bold bg-[#a435f0] text-white rounded-lg hover:bg-[#8f2cd6] transition-all duration-200"
              disabled={isAnimating}
            >
              Random
            </button>
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="target">
            Target Element
          </label>
          <div className="flex flex-col sm:flex-row sm:items-end gap-4">
            <input
              type="number"
              id="target"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              className="w-full sm:max-w-xs p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:border-[#a435f0] focus:outline-none focus:ring-2 focus:ring-[#a435f0]/30 transition duration-300"
              placeholder="eg. 4"
              disabled={isAnimating}
            />
            <div className="flex gap-2 w-full">
              <GoButton onClick={handleGo} isAnimating={isAnimating} disabled={isAnimating} />
              <ResetButton onReset={handleReset} isAnimating={isAnimating} />
            </div>
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
        <div className={`max-w-3xl mx-auto mb-8 p-4 rounded-lg ${messageClass}`}>
          <p className="text-center font-medium">{message}</p>

          {showAutoSort && (
            <div className="mt-3 flex justify-center">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoSort}
                  onChange={(e) => setAutoSort(e.target.checked)}
                />
                <span>Auto-sort the array for me</span>
              </label>
            </div>
          )}
        </div>
      )}

      {array.length > 0 && (
        <div className="max-w-4xl mx-auto space-y-6">
          {stepExplanation && (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="flex items-center gap-2 bg-[#a435f0]/10 dark:bg-[#a435f0]/20 px-4 py-2 border-b border-[#a435f0]/20">
                <span className="w-2 h-2 rounded-full bg-[#a435f0] animate-pulse"></span>
                <span className="text-sm font-semibold text-[#a435f0] dark:text-[#c56eff] uppercase tracking-wide">
                  Step Explanation
                </span>
                {stepCount > 0 && (
                  <span className="ml-auto text-xs text-gray-500 dark:text-gray-400">
                    Iteration #{stepCount}
                  </span>
                )}
              </div>
              <div className="px-4 py-3">
                <p className="text-gray-700 dark:text-gray-200 text-sm leading-relaxed font-mono">
                  {stepExplanation}
                </p>
              </div>
              <div className="px-4 py-2 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-700 flex flex-wrap gap-4 text-xs text-gray-500 dark:text-gray-400">
                <span><span className="font-semibold text-yellow-600 dark:text-yellow-400">■ Yellow</span> = mid index</span>
                <span><span className="font-semibold text-primary dark:text-[#c27cf7]">■ Blue</span> = active search range</span>
                <span><span className="font-semibold text-gray-400">■ Gray</span> = eliminated</span>
                <span><span className="font-semibold text-green-500">■ Green</span> = found</span>
              </div>
            </div>
          )}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
              Array Visualization
            </h2>
            <div className="flex flex-wrap gap-4 justify-center">
              {array.map((element, index) => {
                const labels = [];
                if (index === i) labels.push("low");
                if (index === mid) labels.push("mid");
                if (index === j) labels.push("high");
                return (
                  <div key={index} className="flex flex-col items-center">
                    <div
                      ref={(el) => (elementRefs.current[index] = el)}
                      className={`w-16 h-16 flex items-center justify-center rounded-lg border-2 transition-all duration-300 ${getFontSize(element)} font-medium`}
                    >
                      {element}
                    </div>
                    <div className="mt-1 text-xs text-gray-600 dark:text-gray-400 text-center font-mono">
                      {labels.map((label, idx) => (
                        <div
                          key={idx}
                          className={
                            label === "mid"
                              ? "text-yellow-600 dark:text-yellow-400 font-semibold"
                              : label === "low" || label === "high"
                              ? "text-primary dark:text-[#c27cf7] font-semibold"
                              : ""
                          }
                        >
                          {label}
                        </div>
                      ))}
                      <div className="text-gray-400 dark:text-gray-600 text-[10px]">[{index}]</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default BinarySearch;