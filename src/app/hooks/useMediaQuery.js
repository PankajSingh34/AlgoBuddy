"use client";
import { useState, useEffect } from "react";

export function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    let mq;
    try {
      mq = window.matchMedia(query);
    } catch {
      return;
    }
    setMatches(mq.matches);
    function onChange(e) {
      setMatches(e.matches);
    }
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}
