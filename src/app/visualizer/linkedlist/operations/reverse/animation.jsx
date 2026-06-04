"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import useVisualizerReset from "@/app/hooks/useVisualizerReset";
import {
  VisualizerCard,
  VisualizerInteractiveLayout,
} from "@/app/visualizer/components/VisualizerInteractiveLayout";
import { reverseGenerator } from "@/features/algorithms/linkedlist/reverseLogic";

const LinkedListReverse = () => {
  const [list, setList] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentPointer, setCurrentPointer] = useState(-1);
  const [prevPointer, setPrevPointer] = useState(-1);
  const [nextPointer, setNextPointer] = useState(-1);
  const listRefs = useRef([]);
  const containerRef = useRef(null);
  useVisualizerReset(() => {
    setList([]);
    setIsAnimating(false);
    setCurrentPointer(-1);
    setPrevPointer(-1);
    setNextPointer(-1);
  });
  const animationTimeline = useRef(gsap.timeline());

  const generateRandomList = () => {
    const size = Math.floor(Math.random() * 3) + 3;
    const values = Array.from({ length: size }, (_, i) => {
      const base = Math.floor(Math.random() * 20) + 1;
      return base + i * 5;
    });
    const newList = values.map((value, index) => ({
      value,
      id: Date.now() + index + Math.random(),
      next:
        index < size - 1
          ? `0x${(1000 + index).toString(16).padStart(4, "0")}`
          : "NULL",
    }));
    setList(newList);
    setCurrentPointer(-1);
    setPrevPointer(-1);
    setNextPointer(-1);
  };

  const handleReset = () => {
    gsap.killTweensOf("*");
    animationTimeline.current.clear();
    setList([]);
    setIsAnimating(false);
    setCurrentPointer(-1);
    setPrevPointer(-1);
    setNextPointer(-1);
    listRefs.current = [];
  };

  const animateReverse = async () => {
    if (isAnimating || list.length === 0) return;
    setIsAnimating(true);
    animationTimeline.current.clear();

    const generator = reverseGenerator(list);
    let step = generator.next();
    if (step.done) {
        setIsAnimating(false);
        return;
    }

    gsap.set(listRefs.current, {
      backgroundColor: "#10b981",
      scale: 1,
      opacity: 1,
      clearProps: "all",
    });

    const highlightNodes = (prevI, currI, nextI) => {
      listRefs.current.forEach((el, idx) => {
        if (!el) return;
        if (idx === currI) {
          gsap.to(el, { backgroundColor: "#2563eb", scale: 1.1, duration: 0.3 });
        } else if (idx === prevI) {
          gsap.to(el, { backgroundColor: "#f59e0b", scale: 1.05, duration: 0.3 });
        } else if (idx === nextI) {
          gsap.to(el, { backgroundColor: "#6b7280", scale: 1, duration: 0.3 });
        } else {
          gsap.to(el, { backgroundColor: "#10b981", scale: 1, duration: 0.3 });
        }
      });
    };

    const pointerContainer = document.createElement("div");
    pointerContainer.style.position = "relative";
    pointerContainer.style.width = "100%";
    pointerContainer.style.height = "0px";
    pointerContainer.style.marginBottom = "8px";
    containerRef.current.prepend(pointerContainer);

    const createPointerLabel = (color, text) => {
      const label = document.createElement("div");
      label.textContent = text;
      label.style.position = "absolute";
      label.style.top = "0px";
      label.style.padding = "2px 6px";
      label.style.borderRadius = "4px";
      label.style.color = "white";
      label.style.fontSize = "12px";
      label.style.fontWeight = "bold";
      label.style.backgroundColor = color;
      label.style.pointerEvents = "none";
      label.style.whiteSpace = "nowrap";
      label.style.transition = "left 0.5s ease";
      pointerContainer.appendChild(label);
      return label;
    };

    const prevLabel = createPointerLabel("#f59e0b", "Prev");
    const currentLabel = createPointerLabel("#2563eb", "Current");
    const nextLabel = createPointerLabel("#6b7280", "Next");

    const positionPointers = (prevI, currI, nextI) => {
      const containerRect = containerRef.current.getBoundingClientRect();
      const offsetTop = -30;

      const setLabelPos = (label, idx) => {
        if (idx === -1) {
          label.style.opacity = "0";
          return;
        }
        const nodeEl = listRefs.current[idx];
        if (!nodeEl) {
          label.style.opacity = "0";
          return;
        }
        const rect = nodeEl.getBoundingClientRect();
        const left = rect.left - containerRect.left + rect.width / 2 - label.offsetWidth / 2;
        label.style.left = `${left}px`;
        label.style.top = `${offsetTop}px`;
        label.style.opacity = "1";
      };

      setLabelPos(prevLabel, prevI);
      setLabelPos(currentLabel, currI);
      setLabelPos(nextLabel, nextI);
    };

    while (!step.done) {
        const state = step.value;
        
        setCurrentPointer(state.currentIndex);
        setPrevPointer(state.prevIndex);
        setNextPointer(state.nextIndex);
        highlightNodes(state.prevIndex, state.currentIndex, state.nextIndex);
        positionPointers(state.prevIndex, state.currentIndex, state.nextIndex);

        if (state.type === 'start') {
            // Initial state set, no delay needed
        } else if (state.type === 'step_pointers') {
            await new Promise((resolve) => setTimeout(resolve, 800));
        } else if (state.type === 'step_update_link') {
            animationTimeline.current.clear();
            const currentNodeEl = listRefs.current[state.currentIndex];
            if (currentNodeEl) {
                const nextFieldEl = currentNodeEl.querySelector(".text-xs");
                if (nextFieldEl) {
                    await new Promise((resolve) => {
                        gsap.to(nextFieldEl, {
                            opacity: 0,
                            duration: 0.3,
                            onComplete: () => {
                                setList(state.list);
                                resolve();
                            },
                        });
                    });
                    await new Promise((resolve) => {
                        gsap.to(nextFieldEl, { opacity: 1, duration: 0.3, onComplete: resolve });
                    });
                } else {
                    setList(state.list);
                }
            } else {
                setList(state.list);
            }
            await new Promise((resolve) => setTimeout(resolve, 500));
        } else if (state.type === 'complete') {
            await new Promise((resolve) => setTimeout(resolve, 500));
            if (pointerContainer.parentNode) {
                pointerContainer.parentNode.removeChild(pointerContainer);
            }
            setIsAnimating(false);
            return;
        }

        step = generator.next();
    }
  };

  useEffect(() => {
    listRefs.current = listRefs.current.slice(0, list.length);
  }, [list]);

  return (
    <VisualizerInteractiveLayout>
      <p className="text-center text-lg text-[#6b7280] dark:text-[#9ca3af]">
        Visualize how each pointer changes while reversing a linked list step by step.
      </p>

      <VisualizerCard>
        <div className="flex flex-col gap-4 sm:flex-row">
          <button
            onClick={generateRandomList}
            disabled={isAnimating}
            className="flex-1 rounded-lg bg-[#a435f0]/10 px-4 py-3 text-[#a435f0] transition hover:bg-[#a435f0]/20 border border-[#a435f0]/30 disabled:opacity-50 sm:px-6"
          >
            Generate List
          </button>
          <button
            onClick={animateReverse}
            disabled={isAnimating || list.length === 0}
            className="flex-1 rounded-lg bg-primary px-4 py-3 text-white transition hover:bg-primary-dark disabled:opacity-50 sm:px-6"
          >
            {isAnimating ? "Reversing..." : "Reverse List"}
          </button>
          <button
            onClick={handleReset}
            className="flex-1 rounded-lg border border-black px-4 py-3 text-black transition hover:bg-gray-100 dark:border-white dark:text-white dark:hover:bg-gray-700 sm:px-6"
          >
            Reset All
          </button>
        </div>
      </VisualizerCard>

      <VisualizerCard>
        <div className="mb-6 flex flex-wrap justify-center gap-3 text-sm sm:gap-6 sm:text-base">
          <div className="flex items-center">
            <div className="mr-2 h-4 w-4 rounded-md bg-primary"></div>
            <span>List Node</span>
          </div>
          <div className="flex items-center">
            <div className="mr-2 h-4 w-4 rounded-md bg-primary"></div>
            <span>Current Node</span>
          </div>
          <div className="flex items-center">
            <div className="mr-2 h-4 w-4 rounded-md bg-amber-500"></div>
            <span>Previous Node</span>
          </div>
          <div className="flex items-center">
            <div className="mr-2 h-4 w-4 rounded-md bg-gray-600"></div>
            <span>Next Node</span>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <h3 className="mb-4 text-lg font-medium text-emerald-600">
            List {currentPointer >= 0 && `(Current: ${currentPointer + 1})`}
          </h3>
          <div
            ref={containerRef}
            className="relative w-full overflow-x-auto rounded-xl border border-[#e5e7eb] bg-[#f9fafb] p-4 dark:border-[#222] dark:bg-[#181818]"
          >
            {list.length === 0 ? (
              <div className="w-full py-8 text-center text-gray-500 dark:text-gray-400">
                Generate a list to begin.
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                {list.map((node, index) => (
                  <React.Fragment key={`list-${node.id}`}>
                    <div
                      ref={(el) => (listRefs.current[index] = el)}
                      className={`node flex h-16 w-20 flex-col items-center justify-center rounded-md text-lg text-white shadow-md transition-all ${
                        index === currentPointer
                          ? "scale-110 bg-primary ring-4 ring-primary/40"
                          : index === prevPointer
                            ? "scale-105 bg-amber-500 ring-4 ring-amber-300"
                            : index === nextPointer
                              ? "bg-gray-600 ring-2 ring-gray-400"
                              : "bg-primary"
                      }`}
                    >
                      {node.value}
                      <div className="mt-1 text-xs opacity-80">{node.next}</div>
                    </div>
                    {index < list.length - 1 && (
                      <svg
                        className="h-8 w-8 text-gray-600 opacity-70 dark:text-gray-300"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    )}
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>
        </div>
      </VisualizerCard>
    </VisualizerInteractiveLayout>
  );
};

export default LinkedListReverse;
