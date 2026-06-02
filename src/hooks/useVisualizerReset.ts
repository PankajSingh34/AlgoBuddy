"use client";
import { useEffect, useRef } from "react";

export default function useVisualizerReset(resetFn: () => void): void {
  const ref = useRef<() => void>(resetFn);

  useEffect(() => {
    ref.current = resetFn;
  });

  useEffect(() => {
    return () => {
      ref.current?.();
    };
  }, []);
}
