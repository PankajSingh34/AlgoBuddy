"use client";
import { useCallback, useEffect, useRef, useState } from "react";

const DEFAULT_SPEED = 500;

export function useAnimationEngine({ steps, onStep, initialSpeed = DEFAULT_SPEED }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(initialSpeed);
  const rafRef = useRef(null);
  const lastFrameTime = useRef(0);
  const onStepRef = useRef(onStep);
  const stepsLength = steps?.length ?? 0;

  useEffect(() => {
    onStepRef.current = onStep;
  }, [onStep]);

  const play = useCallback(() => {
    if (currentStep >= stepsLength - 1) {
      setCurrentStep(0);
    }
    setIsPlaying(true);
  }, [currentStep, stepsLength]);

  const pause = useCallback(() => {
    setIsPlaying(false);
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const reset = useCallback(() => {
    setIsPlaying(false);
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    setCurrentStep(0);
  }, []);

  const stepForward = useCallback(() => {
    setCurrentStep((s) => {
      const next = Math.min(s + 1, stepsLength - 1);
      return next;
    });
  }, [stepsLength]);

  const stepBackward = useCallback(() => {
    setCurrentStep((s) => Math.max(s - 1, 0));
  }, []);

  const goToStep = useCallback((step) => {
    setCurrentStep(Math.min(Math.max(0, step), stepsLength - 1));
  }, [stepsLength]);

  useEffect(() => {
    if (!isPlaying || stepsLength === 0) return;

    const animate = (timestamp) => {
      if (timestamp - lastFrameTime.current >= speed) {
        setCurrentStep((s) => {
          if (s >= stepsLength - 1) {
            setIsPlaying(false);
            return s;
          }
          return s + 1;
        });
        lastFrameTime.current = timestamp;
      }
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [isPlaying, speed, stepsLength]);

  useEffect(() => {
    if (steps && steps[currentStep]) {
      onStepRef.current?.(steps[currentStep], currentStep);
    }
  }, [currentStep, steps]);

  useEffect(() => {
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return {
    currentStep,
    isPlaying,
    speed,
    setSpeed,
    play,
    pause,
    reset,
    stepForward,
    stepBackward,
    goToStep,
  };
}
