"use client";
import { useState, useEffect, useCallback } from "react";

function getStoredTheme() {
  if (typeof window === "undefined") return "light";
  const saved = window.localStorage.getItem("theme");
  if (saved === "dark" || saved === "light") return saved;
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function applyTheme(nextTheme) {
  document.documentElement.classList.toggle("dark", nextTheme === "dark");
  window.localStorage.setItem("theme", nextTheme);
}

export function useTheme() {
  const [theme, setThemeState] = useState("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const current = getStoredTheme();
    setThemeState(current);
    applyTheme(current);
    setMounted(true);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const next = prev === "light" ? "dark" : "light";
      applyTheme(next);
      return next;
    });
  }, []);

  return { theme, toggleTheme, mounted };
}
