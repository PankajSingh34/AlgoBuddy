"use client";
import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import AuthForm from "@/app/components/ui/AuthForm";
import { getStoredTheme, applyTheme } from "@/lib/theme";

export default function SignupPage() {
  const [theme, setTheme] = useState("light");
  const [themeMounted, setThemeMounted] = useState(false);

  useEffect(() => {
    const currentTheme = getStoredTheme();
    setTheme(currentTheme);
    applyTheme(currentTheme);
    setThemeMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme((currentTheme) => {
      const resolvedTheme = themeMounted
        ? currentTheme
        : getStoredTheme();

      const nextTheme =
        resolvedTheme === "light" ? "dark" : "light";

      applyTheme(nextTheme);
      setThemeMounted(true);

      return nextTheme;
    });
  };

  return (
    <>
      <AuthForm isLogin={false} />
      <button
        onClick={toggleTheme}
        aria-label={
          themeMounted
            ? `Switch to ${theme === "light" ? "dark" : "light"} mode`
            : "Toggle theme"
        }
        className="fixed top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-udemy-dark-surface transition-colors focus-ring z-[9999]"
      >
        {!themeMounted || theme === "light" ? (
          <Moon className="w-5 h-5" />
        ) : (
          <Sun className="w-5 h-5" />
        )}
      </button>
    </>
  );
}
