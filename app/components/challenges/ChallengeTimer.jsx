"use client";

import React, { useEffect, useState, useRef } from "react";

export default function ChallengeTimer({ duration = 30, activeRound, onTimeout, isPaused }) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const onTimeoutRef = useRef(onTimeout);
  
  useEffect(() => {
    onTimeoutRef.current = onTimeout;
  }, [onTimeout]);

  // Reset timer on new round
  useEffect(() => {
    setTimeLeft(duration);
  }, [activeRound, duration]);

  useEffect(() => {
    if (isPaused || timeLeft <= 0) {
      if (timeLeft === 0 && onTimeoutRef.current) {
        onTimeoutRef.current();
      }
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isPaused]);

  const percentage = (timeLeft / duration) * 100;
  
  // Calculate SVG stroke dashes
  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // Determine color based on time left
  let strokeColor = "stroke-green-500";
  if (timeLeft <= duration * 0.3) {
    strokeColor = "stroke-red-500";
  } else if (timeLeft <= duration * 0.6) {
    strokeColor = "stroke-yellow-500";
  }

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-neutral-50 dark:bg-neutral-900/40 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm w-full">
      <div className="relative w-20 h-20 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="40"
            cy="40"
            r={radius}
            className="stroke-neutral-200 dark:stroke-neutral-800 fill-none"
            strokeWidth="4"
          />
          {/* Animated timer circle */}
          <circle
            cx="40"
            cy="40"
            r={radius}
            className={`${strokeColor} fill-none transition-all duration-1000 ease-linear`}
            strokeWidth="4"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>
        <span className="absolute text-xl font-black font-mono text-surface-900 dark:text-white">
          {timeLeft}
        </span>
      </div>
      <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest mt-2">
        Seconds Left
      </span>
    </div>
  );
}
