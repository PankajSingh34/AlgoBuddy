"use client";
import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import usePlayback from "@/app/hooks/usePlayback";
import LinearMemoryControls from "@/app/components/ui/LinearMemoryControls";
import useVisualizerReset from "@/app/hooks/useVisualizerReset";
import { pushGenerator, popGenerator, peekGenerator, checkEmptyGenerator } from "@/features/algorithms/stack/stackIsEmptyLogic";

const StackVisualizer = () => {
  /* ---------- state ---------- */
  const [stack, setStack] = useState([]);
  const [capacity, setCapacity] = useState(null);
  const [capacityInput, setCapacityInput] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [operation, setOperation] = useState(null);
  const [message, setMessage] = useState("Please set a valid stack capacity first.");
  const [isAnimating, setIsAnimating] = useState(false);
  const [peekedItem, setPeekedItem] = useState(null);
  const [isEmptyStatus, setIsEmptyStatus] = useState(null);
  const { speed, setSpeed } = usePlayback(1);

  const itemRefs = useRef([]);

  /* ---------- helpers ---------- */
  const resetRefs = () => (itemRefs.current = []);

  useVisualizerReset(() => {
    setStack([]);
    setCapacity(null);
    setInputValue("");
    setOperation(null);
    setMessage("Please set a valid stack capacity first.");
    setPeekedItem(null);
    setIsEmptyStatus(null);
    setIsAnimating(false);
    resetRefs();
  });

  /* ---------- set capacity ---------- */
  const handleSetCapacity = () => {
    const size = parseInt(capacityInput, 10);
    if (isNaN(size) || size < 1 || size > 10) {
      setMessage("Please enter a valid capacity between 1 and 10.");
      return;
    }
    setCapacity(size);
    setCapacityInput("");
    setMessage(`Stack capacity set to ${size}. Ready for operations!`);
  };

  /* ---------- push ---------- */
  const push = () => {
    const gen = pushGenerator(stack, inputValue, capacity);
    const startState = gen.next().value;
    
    if (startState.type === 'error') {
      setMessage(startState.message);
      return;
    }
    
    setIsAnimating(true);
    setOperation(startState.operation);
    setMessage("");
    setPeekedItem(null);
    setIsEmptyStatus(null);

    const completeState = gen.next().value;
    setStack(completeState.stack);

    setTimeout(() => {
      const el = itemRefs.current[0];
      gsap.set(el, { y: -60, scale: 0.8, opacity: 0 });
      gsap
        .timeline({ onComplete: () => setIsAnimating(false) })
        .to(el, { y: 0, scale: 1, opacity: 1, duration: 0.4 / speed, ease: "back.out(1.7)" })
        .to(el, { boxShadow: "0 0 10px #3b82f6", duration: 0.2 / speed, yoyo: true, repeat: 1 }, "-=0.2")
        .call(() => setMessage(completeState.message));
    }, 10);

    setInputValue("");
  };

  /* ---------- pop ---------- */
  const pop = () => {
    const gen = popGenerator(stack);
    const startState = gen.next().value;

    if (startState.type === 'error') {
      setMessage(startState.message);
      setIsEmptyStatus(startState.isEmpty);
      return;
    }
    
    setIsAnimating(true);
    setOperation(startState.operation);
    setMessage("");
    setPeekedItem(null);
    setIsEmptyStatus(null);

    const completeState = gen.next().value;
    const el = itemRefs.current[0];
    
    gsap
      .timeline({ onComplete: () => {
        setStack(completeState.stack);
        setIsAnimating(false);
        setMessage(completeState.message);
      } })
      .to(el, { scale: 0.5, rotation: 15, y: 80, opacity: 0, duration: 0.5 / speed, ease: "power2.in" });
  };

  /* ---------- peek ---------- */
  const peek = () => {
    const gen = peekGenerator(stack);
    const startState = gen.next().value;

    if (startState.type === 'error') {
      setMessage(startState.message);
      setIsEmptyStatus(startState.isEmpty);
      return;
    }
    
    setIsAnimating(true);
    setOperation(startState.operation);
    setPeekedItem(startState.peekedItem);
    setIsEmptyStatus(false);

    const completeState = gen.next().value;
    const el = itemRefs.current[0];
    
    gsap
      .timeline({ onComplete: () => setIsAnimating(false) })
      .to(el, { y: -6, boxShadow: "0 0 15px #a855f7", duration: 0.25 / speed })
      .to(el, { y: 0, boxShadow: "0 0 0px transparent", duration: 0.25 / speed })
      .to(el, { y: -6, duration: 0.25 / speed })
      .to(el, { y: 0, duration: 0.25 / speed })
      .call(() => setMessage(completeState.message));
  };

  /* ---------- isEmpty ---------- */
  const checkEmpty = () => {
    const gen = checkEmptyGenerator(stack);
    const startState = gen.next().value;
    
    setIsAnimating(true);
    setOperation(startState.operation);
    setPeekedItem(null);
    
    setTimeout(() => {
      const completeState = gen.next().value;
      setIsEmptyStatus(completeState.isEmpty);
      setOperation(null);
      setMessage(completeState.message);
      setIsAnimating(false);
    }, 1000 / speed);
  };

  /* ---------- reset ---------- */
  const reset = () => {
    setIsAnimating(true);
    gsap.to(itemRefs.current.filter(Boolean), {
      scale: 0,
      y: -60,
      opacity: 0,
      stagger: 0.06 / speed,
      duration: 0.3 / speed,
      onComplete: () => {
        setStack([]);
        setInputValue("");
        setOperation(null);
        setMessage("Stack cleared");
        setPeekedItem(null);
        setIsEmptyStatus(null);
        setIsAnimating(false);
        resetRefs();
      },
    });
  };

  // Construct physical slots from index capacity - 1 down to 0
  const slots = [];
  if (capacity !== null) {
    for (let i = capacity - 1; i >= 0; i--) {
      const isFilled = i < stack.length;
      const itemValue = isFilled ? stack[stack.length - 1 - i] : null;
      slots.push({
        index: i,
        isFilled,
        value: itemValue,
      });
    }
  }

  // Handle capacity-not-set state
  if (capacity === null) {
    return (
      <main className="container mx-auto">
        <p className="text-lg text-center text-gray-600 dark:text-gray-400 mb-8">
          Visualize Push, Pop, Peek, and IsEmpty operations
        </p>

        <div className="max-w-4xl mx-auto">
          <LinearMemoryControls
            inputValue={capacityInput}
            setInputValue={setCapacityInput}
            placeholder="Enter capacity (1-10)..."
            isAnimating={isAnimating}
            operation={operation}
            message={message}
            speed={speed}
            onSpeedChange={setSpeed}
            actions={[
              { label: "Set Capacity", onClick: handleSetCapacity, variant: "primary", needsInput: true }
            ]}
          />

          <div className="bg-white dark:bg-neutral-950 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold mb-4 text-center">Stack Visualization</h2>
            <div className="flex flex-col items-center justify-center min-h-[300px] border border-dashed border-slate-700/50 rounded-2xl p-8 bg-slate-900/5">
              <span className="text-sm font-semibold text-slate-500 text-center">
                Define stack capacity above to initialize the stack structure
              </span>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const actions = [
    { label: "Push", onClick: push, variant: "primary", needsInput: true, disabled: capacity && stack.length >= capacity },
    { label: "IsEmpty", onClick: checkEmpty, variant: "secondary" },
    { label: "Pop", onClick: pop, disabled: stack.length === 0, variant: "secondary" },
    { label: "Reset", onClick: reset, variant: "outline" }
  ];

  if (stack.length === 0) {
    actions.push({ label: "Change Size", onClick: () => { setCapacity(null); setMessage("Please enter a new stack capacity."); }, variant: "secondary" });
  }

  return (
    <main className="container mx-auto">
      <p className="text-lg text-center text-gray-600 dark:text-gray-400 mb-8">
        Visualize Push, Pop, Peek, and IsEmpty operations
      </p>

      <div className="max-w-4xl mx-auto">
        <LinearMemoryControls
          inputValue={inputValue}
          setInputValue={setInputValue}
          isAnimating={isAnimating}
          operation={operation}
          message={message}
          speed={speed}
          onSpeedChange={setSpeed}
          actions={actions}
        />

        {/* Stack Visualization */}
        <div className="bg-white dark:bg-neutral-950 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-center">Stack Visualization</h2>

          <div className="flex flex-col items-center min-h-[300px]">
            {/* Stack status and pointers details */}
            <div className="mb-6 text-center text-sm font-semibold text-slate-500">
              Stack Status:{" "}
              <span className={stack.length >= capacity ? "text-rose-500 font-bold" : "text-[#a435f0] font-bold"}>
                {stack.length === 0 ? "Empty" : stack.length >= capacity ? "Full" : "Active"}
              </span>
              {" | "}Capacity: <span className="text-slate-300 font-bold">{stack.length}</span>/<span className="text-slate-400 font-bold">{capacity}</span>
            </div>

            {/* Stack physical slots visualizer */}
            <div className="w-full max-w-md space-y-1.5">
              {slots.map((slot) => {
                const isTop = slot.index === stack.length - 1;
                return (
                  <div key={slot.index} className="flex items-center gap-4 justify-center">
                    {/* Index display */}
                    <div className="w-16 text-right text-xs font-bold text-slate-400 dark:text-slate-500">
                      Index [{slot.index}]
                    </div>

                    {/* Slot element box */}
                    <div className="w-48 relative">
                      {slot.isFilled ? (
                        <div
                          ref={(el) => {
                            const stackIndex = stack.length - 1 - slot.index;
                            itemRefs.current[stackIndex] = el;
                          }}
                          className={`p-3 border-2 rounded-xl text-center font-medium transition-all duration-300 shadow-md ${
                            slot.index === stack.length - 1 && peekedItem !== null
                              ? "bg-purple-200 dark:bg-purple-800 border-purple-400 dark:border-purple-600 text-purple-900 dark:text-purple-100 shadow-purple-500/10"
                              : isTop
                              ? "bg-[#a435f0]/10 border-[#a435f0] text-slate-100 shadow-[#a435f0]/10"
                              : "bg-slate-800/40 border-slate-700 text-slate-300"
                          }`}
                        >
                          <div>{slot.value}</div>
                        </div>
                      ) : (
                        <div className="p-3 border border-dashed border-slate-700/50 rounded-xl text-center text-slate-600 font-medium bg-slate-900/10 dark:bg-slate-950/20">
                          <div className="text-xs uppercase tracking-wider text-slate-600/80">Empty</div>
                        </div>
                      )}
                    </div>

                    {/* Top indicator arrow */}
                    <div className="w-20 text-left">
                      {isTop ? (
                        <span className="text-xs font-extrabold text-[#a435f0] flex items-center gap-1 animate-pulse">
                          ← top
                        </span>
                      ) : (
                        <span className="text-xs text-transparent">top</span>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Empty pointer display */}
              {stack.length === 0 && (
                <div className="flex items-center gap-4 justify-center pt-2">
                  <div className="w-16"></div>
                  <div className="w-48 text-center text-xs font-bold text-[#a435f0]/80">
                    top = -1 (Empty)
                  </div>
                  <div className="w-20"></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default StackVisualizer;