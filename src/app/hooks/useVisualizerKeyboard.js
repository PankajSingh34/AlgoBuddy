"use client";
import { useCallback, useEffect } from "react";

/**
 * useVisualizerKeyboard
 *
 * Attaches keyboard shortcuts for the AlgoBuddy visualizer.
 * Guards against firing when the user is typing in an input/textarea/select
 * or a contenteditable element.
 * Cleans up the listener automatically on unmount.
 *
 * Shortcut map (matches the controls in BubbleSortVisualizer and siblings):
 *   Space      → Play / Pause  (calls onTogglePlayPause when sorting, onStart when idle)
 *   ArrowRight → Step forward one iteration (calls onStepForward when paused)
 *   R / r      → Reset All
 *   N / n      → Next step
 *   P / p      → Previous step
 *   +  / =     → Speed up   (increase speed by 0.5, max 5)
 *   -          → Slow down  (decrease speed by 0.5, min 0.5)
 *
 * @param {object}   opts
 * @param {Function} opts.onStart           — the "Start Sort / Play" handler
 * @param {Function} opts.onReset           — the "Reset All" handler
 * @param {Function} opts.onSpeedChange     — called with the next speed value (number)
 * @param {Function} [opts.onTogglePlayPause] — called to toggle play/pause while running
 * @param {Function} [opts.onStepForward]   — called to advance one step (when paused)
 * @param {Function} [opts.onNextStep]      — called to go to the next step
 * @param {Function} [opts.onPrevStep]      — called to go to the previous step
 * @param {number}   opts.speed             — current speed value (0.5 – 5, step 0.5)
 * @param {boolean}  opts.sorting           — true while animation is running
 * @param {boolean}  opts.sorted            — true when sort is complete
 * @param {boolean}  [opts.enabled=true]    — set false to disable (e.g. modal open)
 *
 * NOTE: Pass stable function references (e.g. wrapped in useCallback) for all
 * callback props to avoid unnecessary re-registrations of the event listener.
 */
export default function useVisualizerKeyboard({
  onStart,
  onReset,
  onSpeedChange,
  onTogglePlayPause,
  onStepForward,
  onNextStep,
  onPrevStep,
  speed,
  sorting,
  sorted,
  enabled = true,
}) {
  const handleKeyDown = useCallback(
    (e) => {
      const activeEl = document.activeElement;
      const tag = activeEl?.tagName?.toLowerCase();
      const isInput = tag === "input" || tag === "textarea" || tag === "select";
      const isContentEditable =
        activeEl?.isContentEditable ||
        activeEl?.getAttribute?.("contenteditable") === "true" ||
        activeEl?.closest?.('[contenteditable="true"]');

      if (isInput || isContentEditable) return;

      switch (e.key) {
        case " ":
          e.preventDefault();
          if (onTogglePlayPause && sorting) {
            onTogglePlayPause();
          } else if (!sorted) {
            onStart?.();
          }
          break;

        case "ArrowRight":
          if (onStepForward && !sorted) {
            e.preventDefault();
            onStepForward();
          }
          break;

        case "r":
        case "R":
          if (!sorting) {
            onReset?.();
          }
          break;

        case "n":
        case "N":
          onNextStep?.();
          break;

        case "p":
        case "P":
          onPrevStep?.();
          break;

        case "+":
        case "=":
          onSpeedChange?.(
            Math.min(parseFloat((speed + 0.5).toFixed(1)), 5)
          );
          break;

        case "-":
          onSpeedChange?.(
            Math.max(parseFloat((speed - 0.5).toFixed(1)), 0.5)
          );
          break;

        default:
          break;
      }
    },
    // exhaustive-deps: all props consumed inside the handler are listed here
    [onStart, onReset, onSpeedChange, onTogglePlayPause, onStepForward, onNextStep, onPrevStep, speed, sorting, sorted]
  );

  useEffect(() => {
    if (!enabled) return;
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [enabled, handleKeyDown]);
}

