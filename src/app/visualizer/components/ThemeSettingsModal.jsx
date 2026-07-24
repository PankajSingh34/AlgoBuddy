import React, { useState, useEffect } from "react";
import { X, Palette, Check } from "lucide-react";

export default function ThemeSettingsModal({ isOpen, onClose }) {
  const [theme, setTheme] = useState("default");

  useEffect(() => {
    const storedTheme = localStorage.getItem("vis-theme");
    if (storedTheme) {
      setTheme(storedTheme);
    }
  }, [isOpen]);

  const themes = [
    { id: "default", name: "Default (Standard)" },
    { id: "high-contrast", name: "High Contrast" },
    { id: "protanopia-safe", name: "Protanopia Safe (Red/Green Colorblind)" },
  ];

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem("vis-theme", newTheme);
    document.documentElement.setAttribute("data-vis-theme", newTheme);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-surface-900 border border-surface-200 dark:border-surface-800">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="rounded-xl bg-primary/10 p-2 text-primary">
            <Palette className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-bold text-surface-900 dark:text-white">
            Visualizer Color Themes
          </h2>
        </div>

        <p className="text-sm text-surface-600 dark:text-surface-400 mb-6">
          Choose a color palette that works best for you. These themes update the colors used for nodes and edges during visualization.
        </p>

        <div className="space-y-3">
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => handleThemeChange(t.id)}
              className={`flex w-full items-center justify-between rounded-xl border p-4 text-left transition-all ${
                theme === t.id
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-surface-200 bg-surface-50 hover:border-primary/50 dark:border-surface-700 dark:bg-surface-950 dark:hover:border-primary/50"
              }`}
            >
              <span className={`font-semibold ${theme === t.id ? "text-primary" : "text-surface-900 dark:text-white"}`}>
                {t.name}
              </span>
              {theme === t.id && <Check className="h-5 w-5 text-primary" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
