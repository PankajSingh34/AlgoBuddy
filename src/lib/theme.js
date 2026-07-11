export function getStoredTheme() {
  if (typeof window === "undefined") return "light";

  const saved = window.localStorage.getItem("theme");
  if (saved === "dark" || saved === "light") return saved;

  if (document.documentElement.classList.contains("dark")) return "dark";
  return "light";
}

export function applyTheme(nextTheme) {
  document.documentElement.classList.toggle("dark", nextTheme === "dark");
  window.localStorage.setItem("theme", nextTheme);
}

export function getSystemTheme() {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}