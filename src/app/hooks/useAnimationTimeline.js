// app/hooks/useAnimationTimeline.js
// Fix for Issue #2693: Shared GSAP timeline management hook.
// Prevents interleaved timelines when user clicks "Run" during an animation.

import { useRef, useState, useCallback } from 'react';
import gsap from 'gsap';

/**
 * useAnimationTimeline
 *
 * A custom React hook that manages a single GSAP timeline per visualizer.
 * Guarantees the previous timeline is killed before a new one starts,
 * preventing the visual corruption caused by interleaved timelines.
 *
 * Usage:
 *   const { timelineRef, isRunning, startAnimation, resetAnimation } = useAnimationTimeline();
 */
export function useAnimationTimeline() {
  // Stores the current GSAP timeline — useRef so it persists across renders
  // without causing re-renders when it changes.
  const timelineRef = useRef(null);

  // Tracks whether an animation is currently playing.
  // Used to disable the "Run" button during playback.
  const [isRunning, setIsRunning] = useState(false);

  /**
   * Call this at the START of every animation function.
   * It kills any existing timeline, then creates and returns a fresh one.
   *
   * @returns {GSAPTimeline} A new, clean GSAP timeline ready to use.
   */
  const startAnimation = useCallback(() => {
    // ── THE CORE FIX ────────────────────────────────────────────────────────
    // Kill the previous timeline if one exists.
    // Without this, the old timeline keeps running in the background
    // and fights the new one for control of the same DOM elements.
    if (timelineRef.current) {
      timelineRef.current.kill();
      timelineRef.current = null;
    }
    // ────────────────────────────────────────────────────────────────────────

    // Create a fresh timeline
    const tl = gsap.timeline({
      onComplete: () => {
        // When animation finishes naturally, mark as no longer running
        setIsRunning(false);
      },
    });

    // Store it so we can kill it later if needed
    timelineRef.current = tl;

    // Mark animation as active — this disables the Run button in the UI
    setIsRunning(true);

    return tl;
  }, []);

  /**
   * Call this when user clicks "Reset" or "Randomize Array".
   * Kills the timeline AND uses GSAP .set() to instantly snap
   * all bars back to their original visual state.
   *
   * @param {Array<HTMLElement>} elements - The bar DOM elements to reset.
   * @param {Object} initialStyles - CSS properties to reset to (e.g. { backgroundColor: '#8b5cf6', height: '...px' })
   */
  const resetAnimation = useCallback((elements = [], initialStyles = {}) => {
    // Kill timeline immediately
    if (timelineRef.current) {
      timelineRef.current.kill();
      timelineRef.current = null;
    }

    // Snap all elements back to their starting state instantly
    // .set() applies styles with zero duration — no animation, just instant reset
    if (elements.length > 0) {
      gsap.set(elements, {
        ...initialStyles,
        clearProps: 'all',   // Clears any GSAP-applied inline styles
      });
    }

    // Mark animation as stopped — re-enables the Run button
    setIsRunning(false);
  }, []);

  return {
    timelineRef,   // The current GSAP timeline (ref)
    isRunning,     // Boolean — true while animation plays
    startAnimation,  // Call this to kill old + create new timeline
    resetAnimation,  // Call this on Reset/Randomize
  };
}
