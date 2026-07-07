"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Copy, Check, Link2, Play } from "lucide-react";
import { generateSecureCode } from "@/lib/random";

export default function CreateDuelModal({ isOpen, onClose, onCreateMatch, initialTopic, initialDifficulty, initialTimeLimit, initialWager, initialMode, initialPublic }) {
  const [lobbyCode, setLobbyCode] = useState("");
  
  useEffect(() => {
    if (isOpen) {
      setLobbyCode(generateSecureCode(6));
    }
  }, [isOpen]);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`https://algobuddy.me/arena/duel/${lobbyCode}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const handleStart = () => {
    onCreateMatch({
      lobbyCode,
      topic: initialTopic,
      difficulty: initialDifficulty,
      timeLimit: initialTimeLimit,
      wager: initialWager,
      mode: initialMode,
      isPublic: initialPublic
    });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[10100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm"
        />

        {/* Panel */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-md bg-white dark:bg-neutral-900 border border-slate-100 dark:border-neutral-800 rounded-3xl p-6 shadow-2xl z-10"
        >
          {/* Header */}
          <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-neutral-800/80 mb-6">
            <h3 className="text-lg font-bold text-slate-800 dark:text-neutral-200">
              Lobby Created
            </h3>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-50 dark:hover:bg-neutral-800 transition"
            >
              <X size={18} />
            </button>
          </div>

          <div className="space-y-6">
            {/* Lobby Settings Summary */}
            <div className="bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800/80 rounded-xl p-4">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Lobby Configuration</h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="block text-[10px] text-slate-400 mb-1">Topic</span>
                  <span className="text-xs font-bold text-slate-700 dark:text-neutral-300 bg-white dark:bg-neutral-900 px-2 py-1 rounded border border-slate-200 dark:border-neutral-800">{initialTopic || "Random"}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 mb-1">Difficulty</span>
                  <span className={`text-xs font-bold px-2 py-1 rounded border ${initialDifficulty === "Easy" ? "bg-emerald-50 text-emerald-600 border-emerald-200" : initialDifficulty === "Medium" ? "bg-amber-50 text-amber-600 border-amber-200" : "bg-rose-50 text-rose-600 border-rose-200"}`}>{initialDifficulty || "Medium"}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 mb-1">Time Limit</span>
                  <span className="text-xs font-bold text-slate-700 dark:text-neutral-300 bg-white dark:bg-neutral-900 px-2 py-1 rounded border border-slate-200 dark:border-neutral-800">{initialTimeLimit || "30m"}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 mb-1">Mode</span>
                  <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded border border-primary/20">{initialMode || "Standard"}</span>
                </div>
                <div className="col-span-2 flex justify-between items-center bg-white dark:bg-neutral-900 px-3 py-2 rounded-lg border border-slate-200 dark:border-neutral-800 mt-1">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400">XP Wager</span>
                    <span className="text-sm font-black text-amber-500">{initialWager || 50} XP</span>
                  </div>
                  <div className="flex flex-col text-right">
                    <span className="text-[10px] text-slate-400">Visibility</span>
                    <span className={`text-xs font-bold ${initialPublic ? "text-emerald-500" : "text-slate-500"}`}>{initialPublic ? "Public" : "Private"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Lobby Link */}
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 tracking-wider mb-2">
                Invite Link
              </label>
              <div className="flex items-center gap-2 bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800/80 rounded-xl px-3 py-2.5">
                <Link2 size={16} className="text-slate-400 shrink-0" />
                <span className="flex-1 text-xs font-mono text-slate-650 dark:text-neutral-400 truncate">
                  https://algobuddy.me/arena/duel/{lobbyCode}
                </span>
                <button
                  onClick={handleCopy}
                  className="p-1.5 hover:bg-slate-200 dark:hover:bg-neutral-800 rounded-lg text-slate-550 dark:text-neutral-400 transition"
                  title="Copy link"
                >
                  {copied ? (
                    <Check size={14} className="text-emerald-500" />
                  ) : (
                    <Copy size={14} />
                  )}
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={handleStart}
            className="w-full mt-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition duration-200 shadow-md shadow-primary/20"
          >
            <Play size={16} />
            <span>Launch Lobby</span>
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
