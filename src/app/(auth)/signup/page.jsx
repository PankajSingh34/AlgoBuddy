"use client";
import { Moon, Sun } from "lucide-react";
import AuthForm from "@/app/components/ui/AuthForm";
import { useTheme } from "@/app/hooks/useTheme";

export default function SignupPage() {
  const { theme, mounted: themeMounted, toggleTheme } = useTheme();

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
