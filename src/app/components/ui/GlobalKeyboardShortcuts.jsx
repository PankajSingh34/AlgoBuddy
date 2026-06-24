"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Keyboard, Search, X } from "lucide-react";

const SHORTCUTS = [
  { keys: ["/", "Ctrl+K"], label: "Focus page search" },
  { keys: ["?"], label: "Show keyboard shortcuts" },
  { keys: ["Esc"], label: "Close shortcut help" },
  { keys: ["Ctrl+Shift+P"], label: "Open practice" },
  { keys: ["Ctrl+Shift+V"], label: "Open visualizer" },
];

function isTypingTarget(target) {
  if (!target) return false;
  const tagName = target.tagName?.toLowerCase();
  return (
    tagName === "input" ||
    tagName === "textarea" ||
    tagName === "select" ||
    target.isContentEditable
  );
}

function focusSearchField() {
  const selectors = [
    'input[type="search"]',
    'input[placeholder*="Search"]',
    'input[placeholder*="search"]',
    '[data-shortcut-search="true"]',
  ];

  const field = selectors
    .map((selector) => document.querySelector(selector))
    .find(Boolean);

  if (field && typeof field.focus === "function") {
    field.focus();
    field.select?.();
    return true;
  }

  return false;
}

export default function GlobalKeyboardShortcuts() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (event) => {
      const key = event.key.toLowerCase();
      const isModifier = event.ctrlKey || event.metaKey;

      if (key === "escape" && open) {
        event.preventDefault();
        setOpen(false);
        return;
      }

      if (isTypingTarget(event.target)) return;

      if (key === "?") {
        event.preventDefault();
        setOpen((value) => !value);
        return;
      }

      if (key === "/" || (isModifier && key === "k")) {
        event.preventDefault();
        if (!focusSearchField()) {
          toast("No search field on this page", { icon: <Search className="h-4 w-4" /> });
        }
        return;
      }

      if (!isModifier || !event.shiftKey) return;

      const routes = {
        p: "/practice",
        v: "/visualizer",
      };

      const route = routes[key];
      if (route) {
        event.preventDefault();
        router.push(route);
        toast.success(`Opened ${route}`);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, router]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-950/45 px-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Keyboard shortcuts"
    >
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl dark:border-neutral-800 dark:bg-neutral-950">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-primary/10 p-2 text-primary">
              <Keyboard className="h-5 w-5" />
            </span>
            <h2 className="text-lg font-black text-slate-900 dark:text-neutral-100">
              Keyboard shortcuts
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 focus-ring dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-neutral-100"
            aria-label="Close keyboard shortcuts"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 space-y-3">
          {SHORTCUTS.map((shortcut) => (
            <div
              key={shortcut.label}
              className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 px-3 py-2 dark:border-neutral-800"
            >
              <span className="text-sm font-semibold text-slate-700 dark:text-neutral-300">
                {shortcut.label}
              </span>
              <span className="flex flex-wrap justify-end gap-1.5">
                {shortcut.keys.map((key) => (
                  <kbd
                    key={key}
                    className="rounded-md border border-slate-300 bg-slate-50 px-2 py-1 text-xs font-black text-slate-700 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200"
                  >
                    {key}
                  </kbd>
                ))}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
