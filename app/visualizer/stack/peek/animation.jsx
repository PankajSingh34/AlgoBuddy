"use client";
import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import PushPop from "@/app/components/ui/PushPop";
import usePlayback from "@/app/hooks/usePlayback";
import useVisualizerReset from "@/app/hooks/useVisualizerReset";

const StackVisualizer = () => {
  const [stack, setStack] = useState([]);
  const [capacity, setCapacity] = useState(null);
  const [operation, setOperation] = useState(null);
  const [message, setMessage] = useState("Please set a valid stack capacity first.");
  const [isAnimating, setIsAnimating] = useState(false);
  const { speed, setSpeed } = usePlayback(1);

  const stackRef = useRef(null);
  const itemRefs = useRef([]);
  const peekRef = useRef(null);
  useVisualizerReset(() => {
    setStack([]);
    setCapacity(null);
    setOperation(null);
    setMessage("Please set a valid stack capacity first.");
    setIsAnimating(false);
  });

  /* ---------- random numbers ---------- */
  const addRandomStack = () => {
    if (stack.length > 0 || capacity === null) return;
    setIsAnimating(true);
    setOperation("create");
    const maxLen = Math.max(3, capacity - 1);
    const minLen = Math.min(3, capacity);
    const length = minLen + Math.floor(Math.random() * (maxLen - minLen + 1));
    const nums = Array.from(
      { length: Math.min(length, capacity) },
      () => Math.floor(Math.random() * 999) + 1
    );
    setTimeout(() => {
      setStack(nums);
      setOperation(null);
      setIsAnimating(false);
    }, 600 / speed);
  };

  /* ---------- gsap animations (safe) ---------- */
  useEffect(() => {
    itemRefs.current.length = 0;
    if (!stackRef.current) return;

    /* push */
    if (operation?.includes("push") && itemRefs.current[0]) {
      setIsAnimating(true);
      const el = itemRefs.current[0];
      gsap.set(el, { scale: 0, y: -60, opacity: 0 });
      gsap
        .timeline({ onComplete: () => setIsAnimating(false) })
        .to(el, { scale: 1, y: 0, opacity: 1, duration: 0.4, ease: "back.out(1.2)" });
    }

    /* pop */
    if (operation?.includes("pop") && itemRefs.current[0]) {
      setIsAnimating(true);
      const el = itemRefs.current[0];
      gsap.to(el, {
        scale: 0,
        y: -60,
        opacity: 0,
        duration: 0.35,
        ease: "power2.in",
        onComplete: () => setIsAnimating(false),
      });
    }

    /* peek */
    if (operation?.includes("Peek") && itemRefs.current[0]) {
      setMessage(`Top value is ${stack[0]}`);           // ONLY message shown
      setIsAnimating(true);
      const el = itemRefs.current[0];
      peekRef.current = el;
      gsap.to(el, {
        scale: 1.15,
        boxShadow: "0 0 20px #a855f7",
        duration: 0.3,
        yoyo: true,
        repeat: 3,
        ease: "power1.inOut",
        onComplete: () => setIsAnimating(false),
      });
    }

    /* reorder */
    gsap.fromTo(
      itemRefs.current.filter(Boolean),
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.06, duration: 0.25, ease: "power2.out" }
    );

    return () => { peekRef.current = null; };
  }, [stack, operation]);

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

  return (
    <main className="container mx-auto">
      <p className="text-lg text-center text-gray-600 dark:text-gray-400 mb-8">
        Visualize Push, Pop, and Peek operations
      </p>

      <div className="max-w-4xl mx-auto">
        <PushPop
          stack={stack}
          setStack={setStack}
          isAnimating={isAnimating}
          setIsAnimating={setIsAnimating}
          operation={operation}
          setOperation={setOperation}
          message={message}
          setMessage={setMessage}
          speed={speed}
          setSpeed={setSpeed}
          capacity={capacity}
          setCapacity={setCapacity}
          extraActions={[
            { label: "Add Random Stack", onClick: addRandomStack, disabled: isAnimating || stack.length > 0 || capacity === null }
          ]}
        />

        <div ref={stackRef} className="bg-white dark:bg-neutral-950 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-center">Stack Visualization</h2>

          {capacity === null ? (
            <div className="flex flex-col items-center justify-center min-h-[300px] border border-dashed border-slate-700/50 rounded-2xl p-8 bg-slate-900/5">
              <span className="text-sm font-semibold text-slate-500 text-center">
                Define stack capacity above to initialize the stack structure
              </span>
            </div>
          ) : (
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
                              isTop
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
          )}
        </div>
      </div>
    </main>
  );
};

export default StackVisualizer;