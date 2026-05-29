"use client";

import React from "react";
import { FiPlay, FiCode, FiUsers, FiAward, FiBookOpen } from "react-icons/fi";

export default function ChallengeSection({ onStartChallenge }) {
  const highlights = [
    { text: "Invite friends", icon: <FiUsers className="text-purple-500" /> },
    { text: "Share challenge codes", icon: <FiCode className="text-purple-500" /> },
    { text: "Compete through visualizers", icon: <FiPlay className="text-purple-500" /> },
    { text: "Climb the leaderboard", icon: <FiAward className="text-purple-500" /> },
    { text: "Unlock achievements", icon: <FiAward className="text-purple-500" /> },
    { text: "Master DSA concepts", icon: <FiBookOpen className="text-purple-500" /> },
  ];

  return (
    <div className="mt-16 mb-8 max-w-[1100px] mx-auto px-4">
      <div 
        className="relative overflow-hidden rounded-3xl border border-purple-200 dark:border-purple-900/60 
          bg-gradient-to-br from-purple-50/70 via-white to-purple-100/40 
          dark:from-purple-950/20 dark:via-[#1c1d1f] dark:to-neutral-950 p-8 sm:p-12 shadow-xl transition-all duration-300"
      >
        {/* Decorative ambient glow */}
        <div className="absolute -right-32 -top-32 w-80 h-80 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-32 -bottom-32 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-surface-900 dark:text-white mb-4 tracking-tighter leading-tight">
            ⚔ Level Up Your Learning
          </h2>
          
          <p className="text-base sm:text-lg text-surface-600 dark:text-surface-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Challenge yourself with interactive visual algorithm exercises designed to strengthen your DSA intuition and problem‑solving skills.
          </p>

          {/* Feature Highlights Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-10 max-w-2xl mx-auto text-left">
            {highlights.map((item, idx) => (
              <div 
                key={idx} 
                className="flex items-center gap-3 p-3 rounded-xl bg-white/60 dark:bg-neutral-900/40 border border-purple-100/50 dark:border-purple-950/40 hover:border-purple-300 dark:hover:border-purple-800 transition-colors"
              >
                <div className="p-2 rounded-lg bg-purple-100/80 dark:bg-purple-900/30 text-sm">
                  {item.icon}
                </div>
                <span className="text-sm font-semibold text-surface-800 dark:text-surface-200">
                  {item.text}
                </span>
              </div>
            ))}
          </div>

          {/* Action Button */}
          <div className="flex items-center justify-center">
            <button
              onClick={onStartChallenge}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-12 py-4 rounded-full text-base font-black text-white bg-purple-600 hover:bg-purple-700 shadow-lg hover:shadow-purple-600/30 active:scale-[0.98] transition-all duration-300 hover:scale-[1.02] border border-purple-500/20"
            >
              🚀 Start Challenge
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
