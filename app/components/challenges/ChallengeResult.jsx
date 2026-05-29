"use client";

import React, { useMemo } from "react";
import { FiAward, FiArrowRight, FiRotateCcw, FiCheckCircle, FiClock, FiStar } from "react-icons/fi";

const ACHIEVEMENTS = [
  { id: "master", name: "Visualizer Master", desc: "Achieved 100% accuracy on questions.", icon: "🏆", condition: (acc, score) => acc === 100 },
  { id: "speed", name: "Speed Solver", desc: "Earned a speed bonus in every round.", icon: "⚡", condition: (acc, score) => score > 200 },
  { id: "expert", name: "DSA Expert", desc: "Conquered a Hard mode challenge.", icon: "🧠", condition: (acc, score, diff) => diff === "hard" },
  { id: "guru", name: "Survivor", desc: "Finished all rounds in Survival mode.", icon: "🛡️", condition: (acc, score, diff, mode) => mode === "survival" },
  { id: "junior", name: "Fast Learner", desc: "Completed a full DSA exercise.", icon: "⭐", condition: () => true }, // default
];

export default function ChallengeResult({ players, selections, onRestart, onExit }) {
  if (!selections) return null;
  // Sort players to find winner
  const sortedPlayers = useMemo(() => {
    return [...players].sort((a, b) => b.score - a.score);
  }, [players]);

  const winner = sortedPlayers[0];
  const localPlayer = useMemo(() => {
    return players.find((p) => p.isLocal) || { name: "You", score: 0, accuracy: 100, xp: 0 };
  }, [players]);

  // Determine achievement unlocked
  const unlockedAchievement = useMemo(() => {
    const accuracy = localPlayer.accuracy || 100;
    const score = localPlayer.score || 0;
    const difficulty = selections.difficulty;
    const type = selections.type || "";

    return ACHIEVEMENTS.find(ach => ach.condition(accuracy, score, difficulty, type)) || ACHIEVEMENTS[ACHIEVEMENTS.length - 1];
  }, [localPlayer, selections]);

  const isLocalWinner = localPlayer.name === winner?.name;

  return (
    <div className="max-w-[700px] mx-auto my-12 px-4" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="rounded-3xl border border-purple-200 dark:border-purple-900/60 bg-white dark:bg-[#1c1d1f] shadow-2xl overflow-hidden">
        {/* Celebration Header */}
        <div className={`p-10 text-white text-center relative ${isLocalWinner ? "bg-gradient-to-r from-yellow-500 via-purple-600 to-indigo-600" : "bg-gradient-to-r from-purple-700 to-neutral-800"}`}>
          {isLocalWinner && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 text-5xl animate-bounce pointer-events-none">
              👑
            </div>
          )}
          <h2 className="text-4xl font-black tracking-tight mb-2 mt-4">
            {isLocalWinner ? "Victory!" : "Challenge Completed"}
          </h2>
          <p className="text-purple-100 font-medium max-w-md mx-auto">
            {isLocalWinner 
              ? `Congratulations! You won the challenge with ${localPlayer.score} points!`
              : `${winner?.name || "Someone"} took 1st place! Keep practicing to claim the crown.`}
          </p>
        </div>

        {/* Results Body */}
        <div className="p-8 space-y-8">
          {/* XP & Stats Grid */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-purple-50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/40 rounded-2xl p-4 text-center">
              <span className="text-[10px] uppercase font-bold text-purple-500 block">XP Earned</span>
              <span className="text-3xl font-black text-purple-700 dark:text-purple-400 font-mono">
                +{localPlayer.xp || 0}
              </span>
            </div>
            
            <div className="bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 text-center">
              <span className="text-[10px] uppercase font-bold text-neutral-400 block">Accuracy</span>
              <span className="text-3xl font-black text-neutral-800 dark:text-neutral-200 font-mono">
                {localPlayer.accuracy || 100}%
              </span>
            </div>

            <div className="bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 text-center">
              <span className="text-[10px] uppercase font-bold text-neutral-400 block">Score</span>
              <span className="text-3xl font-black text-neutral-800 dark:text-neutral-200 font-mono">
                {localPlayer.score || 0}
              </span>
            </div>
          </div>

          {/* Achievement Unlocked */}
          <div className="bg-gradient-to-r from-amber-500/10 to-purple-500/10 border border-amber-500/20 rounded-2xl p-5 flex items-center gap-4">
            <span className="text-4xl p-2 bg-white dark:bg-neutral-900 rounded-2xl shadow-sm">{unlockedAchievement.icon}</span>
            <div>
              <span className="text-[10px] font-extrabold uppercase text-amber-600 dark:text-amber-400 block tracking-wider">Achievement Unlocked</span>
              <h4 className="font-extrabold text-base text-surface-900 dark:text-white mt-0.5">{unlockedAchievement.name}</h4>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-normal">{unlockedAchievement.desc}</p>
            </div>
          </div>

          {/* Player Standings List */}
          <div className="space-y-4">
            <h3 className="font-extrabold text-lg text-surface-900 dark:text-white border-b pb-2 border-neutral-100 dark:border-neutral-800 flex items-center gap-2">
              <FiAward className="text-yellow-500" />
              Final Standings
            </h3>
            
            <div className="space-y-3">
              {sortedPlayers.map((player, idx) => {
                const isFirst = idx === 0;
                const isSecond = idx === 1;
                const isThird = idx === 2;
                const isLast = sortedPlayers.length > 1 && idx === sortedPlayers.length - 1;
                
                let badgeClass = "bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 border-neutral-200 dark:border-neutral-700";
                let badgeText = `#${idx + 1}`;
                let containerClass = "border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30";
                
                if (isFirst) {
                  badgeClass = "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20";
                  badgeText = "🥇 1st Place";
                  containerClass = "border-yellow-500/40 bg-yellow-50/10 dark:bg-yellow-950/5 ring-1 ring-yellow-500/20";
                } else if (isSecond) {
                  badgeClass = "bg-slate-300/20 text-slate-600 dark:text-slate-300 border-slate-300/30";
                  badgeText = "🥈 2nd Place";
                } else if (isThird) {
                  badgeClass = "bg-amber-700/10 text-amber-700 dark:text-amber-500 border-amber-700/20";
                  badgeText = "🥉 3rd Place";
                } else if (isLast) {
                  badgeClass = "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20";
                  badgeText = "💀 Loser";
                  containerClass = "border-red-500/30 bg-red-50/5 dark:bg-red-950/5";
                }
                
                // Highlight local player with specific styling if they are not first or last
                if (player.isLocal) {
                  if (!isFirst && !isLast) {
                    containerClass = "border-purple-600/40 bg-purple-50/20 dark:bg-purple-950/10 ring-1 ring-purple-500/10";
                  }
                }

                return (
                  <div 
                    key={player.name}
                    className={`flex items-center justify-between p-4 rounded-2xl border transition-all duration-200 hover:shadow-sm ${containerClass}`}
                  >
                    <div className="flex items-center gap-4">
                      {/* Placement Badge */}
                      <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border shadow-sm ${badgeClass}`}>
                        {badgeText}
                      </span>
                      
                      <span className={`font-bold text-sm flex items-center gap-1.5 ${player.isLocal ? "text-purple-700 dark:text-purple-300 font-extrabold" : "text-neutral-800 dark:text-neutral-200"}`}>
                        {player.name}
                        {player.isLocal && <span className="text-[10px] uppercase font-extrabold bg-purple-100 dark:bg-purple-950 px-2 py-0.5 rounded text-purple-700 dark:text-purple-300">You</span>}
                      </span>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-xs text-neutral-400 dark:text-neutral-500 font-medium">{player.accuracy || 100}% Accuracy</span>
                      <div className="text-right">
                        <span className="font-black text-sm text-neutral-800 dark:text-white block">{player.score}</span>
                        <span className="text-[9px] text-neutral-400 block font-semibold leading-none">points</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 border-t border-neutral-100 dark:border-neutral-800">
            <button
              onClick={onRestart}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-sm font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-md active:scale-[0.98] transition-all"
            >
              <FiRotateCcw className="w-4 h-4" /> Play Again
            </button>
            
            <button
              onClick={onExit}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-sm font-bold text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 border border-neutral-300 dark:border-neutral-700 active:scale-[0.98] transition-all"
            >
              Back to Visualizers <FiArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
