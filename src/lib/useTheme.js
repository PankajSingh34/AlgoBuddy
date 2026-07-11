"use client";
import { useState, useEffect, useCallback } from "react";

function getStoredTheme() {
  if (typeof window === "undefined") return "light";
  const saved = window.localStorage.getItem("theme");
  if (saved === "dark" || saved === "light") return saved;
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) return "dark";
  return "light";
}

function applyTheme(nextTheme) {
  document.documentElement.classList.toggle("dark", nextTheme === "dark");
  window.localStorage.setItem("theme", nextTheme);
}

export function useTheme() {
  const [theme, setTheme] = useState("light");
  const [themeMounted, setThemeMounted] = useState(false);

  useEffect(() => {
    const currentTheme = getStoredTheme();
    setTheme(currentTheme);
    applyTheme(currentTheme);
    setThemeMounted(true);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((currentTheme) => {
      const resolvedTheme = themeMounted ? currentTheme : getStoredTheme();
      const nextTheme = resolvedTheme === "light" ? "dark" : "light";
      applyTheme(nextTheme);
      setThemeMounted(true);
      return nextTheme;
    });
  }, [themeMounted]);

  return { theme, themeMounted, toggleTheme };
}
