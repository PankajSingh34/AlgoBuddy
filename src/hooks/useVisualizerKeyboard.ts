"use client";
import { useEffect } from "react";

interface UseVisualizerKeyboardOptions {
  onStart?: () => void;
  onReset?: () => void;
  onSpeedChange?: (nextSpeed: number) => void;
  onTogglePlayPause?: () => void;
  speed: number;
  sorting: boolean;
  sorted: boolean;
  enabled?: boolean;
}

/**
 * useVisualizerKeyboard
 *
 * Attaches keyboard shortcuts for the AlgoBuddy visualizer.
 * Guards against firing when the user is typing in an input/textarea/select.
 * Cleans up the listener automatically on unmount.
 *
 * Shortcut map:
 *   Space   → Play / Pause
 *   R / r   → Reset All
 *   + / =   → Speed up (max 5)
 *   -       → Slow down (min 0.5)
 */
export default function useVisualizerKeyboard({
  onStart,
  onReset,
  onSpeedChange,
  onTogglePlayPause,
  speed,
  sorting,
  sorted,
  enabled = true,
}: UseVisualizerKeyboardOptions): void {
  useEffect(() => {
    if (!enabled) return;

    function handleKeyDown(e: KeyboardEvent) {
      // Never fire while the user is typing in a form field
      const tag = document.activeElement?.tagName?.toLowerCase();
      if (tag === "input" || tag === "textarea" || tag === "select") return;

      switch (e.key) {
        case " ":
          e.preventDefault(); // prevent page scroll
          if (onTogglePlayPause && sorting) {
            onTogglePlayPause();
          } else if (sorting) {
            onReset?.();
          } else if (!sorted) {
            // Space while idle → Start
            onStart?.();
          }
          break;

        case "r":
        case "R":
          if (!sorting) {
            onReset?.();
          }
          break;

        case "+":
        case "=":
          onSpeedChange?.(Math.min(parseFloat((speed + 0.5).toFixed(1)), 5));
          break;

        case "-":
          onSpeedChange?.(Math.max(parseFloat((speed - 0.5).toFixed(1)), 0.5));
          break;

        default:
          break;
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [enabled, onStart, onReset, onSpeedChange, onTogglePlayPause, speed, sorting, sorted]);
}
