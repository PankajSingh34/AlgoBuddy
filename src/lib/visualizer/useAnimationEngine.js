"use client";
import { useCallback, useEffect, useRef, useState } from "react";

const DEFAULT_SPEED = 500;

function cloneStep(step) {
  if (step === null || typeof step !== "object") return step;
  return JSON.parse(JSON.stringify(step));
}

export function useAnimationEngine({ steps, onStep, initialSpeed = DEFAULT_SPEED }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeedState] = useState(initialSpeed);

  const rafRef = useRef(null);
  const lastFrameTime = useRef(0);
  const onStepRef = useRef(onStep);
  const isPlayingRef = useRef(false);

  const speedRef = useRef(initialSpeed);

  const stepsLength = steps?.length ?? 0;

  // Reset playback state when a new animation session (new steps array) is provided.
  const stepsKeyRef = useRef(steps);
  useEffect(() => {
    if (steps !== stepsKeyRef.current) {
      stepsKeyRef.current = steps;
      setIsPlaying(false);
      setCurrentStep(0);
    }
  }, [steps]);

  useEffect(() => {
    onStepRef.current = onStep;
  }, [onStep]);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  // Stop automatically when the last step is reached.
  useEffect(() => {
    if (isPlaying && stepsLength > 0 && currentStep >= stepsLength - 1) {
      setIsPlaying(false);
    }
  }, [isPlaying, currentStep, stepsLength]);

  const setSpeed = useCallback((newSpeed) => {
    speedRef.current = newSpeed;
    setSpeedState(newSpeed);
  }, []);

  const play = useCallback(() => {
    setCurrentStep((s) => (s >= stepsLength - 1 ? 0 : s));
    lastFrameTime.current = 0;
    setIsPlaying(true);
  }, [stepsLength]);

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
    lastFrameTime.current = 0;
  }, []);

  const stepForward = useCallback(() => {
    setCurrentStep((s) => Math.min(s + 1, stepsLength - 1));
  }, [stepsLength]);

  const stepBackward = useCallback(() => {
    setCurrentStep((s) => Math.max(s - 1, 0));
  }, []);

  const goToStep = useCallback((step) => {
    setCurrentStep(Math.min(Math.max(0, step), stepsLength - 1));
  }, [stepsLength]);

  // Single rAF loop.
  useEffect(() => {
    if (!isPlaying || stepsLength === 0) return;

    const animate = (timestamp) => {
      if (!isPlayingRef.current) return;

      if (lastFrameTime.current === 0) {
        lastFrameTime.current = timestamp;
      }

      if (timestamp - lastFrameTime.current >= speedRef.current) {
        setCurrentStep((s) => (s < stepsLength - 1 ? s + 1 : s));
        lastFrameTime.current = timestamp;
      }

      if (isPlayingRef.current) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [isPlaying, stepsLength]);

  // Call onStep with a deep-cloned snapshot to prevent mutation of steps.
  useEffect(() => {
    if (steps && currentStep >= 0 && currentStep < stepsLength) {
      onStepRef.current?.(cloneStep(steps[currentStep]), currentStep);
    }
  }, [currentStep, steps, stepsLength]);

  useEffect(() => {
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
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