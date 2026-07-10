"use client";
import { useState, useEffect, useCallback } from "react";

const THEME_STORAGE_KEY = "theme";
const DARK_CLASS = "dark";

function getSystemPreference() {
  if (typeof window === "undefined") return null;
  try {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    return mq.matches ? "dark" : "light";
  } catch {
    return null;
  }
}

function getStoredTheme() {
  if (typeof window === "undefined") return "light";
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === "dark" || saved === "light") return saved;
  } catch {
    // localStorage unavailable
  }
  return null;
}

function resolveInitialTheme() {
  const stored = getStoredTheme();
  if (stored) return stored;
  const system = getSystemPreference();
  if (system) return system;
  return "light";
}

function applyTheme(nextTheme) {
  document.documentElement.classList.toggle(DARK_CLASS, nextTheme === "dark");
  try {
    localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
  } catch {
    // localStorage unavailable
  }
}

export function useTheme() {
  const [theme, setThemeState] = useState("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const initial = resolveInitialTheme();
    applyTheme(initial);
    setThemeState(initial);
    setMounted(true);
  }, []);

  useEffect(() => {
    let mq;
    try {
      mq = window.matchMedia("(prefers-color-scheme: dark)");
    } catch {
      return;
    }
    function handleChange(e) {
      const stored = getStoredTheme();
      if (stored) return;
      const next = e.matches ? "dark" : "light";
      applyTheme(next);
      setThemeState(next);
    }
    mq.addEventListener("change", handleChange);
    return () => mq.removeEventListener("change", handleChange);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((current) => {
      const next = current === "light" ? "dark" : "light";
      applyTheme(next);
      return next;
    });
  }, []);

  const setTheme = useCallback((next) => {
    if (next !== "light" && next !== "dark") return;
    applyTheme(next);
    setThemeState(next);
  }, []);

  return { theme, mounted, toggleTheme, setTheme, isDark: theme === "dark" };
}
