"use client";

import React from "react";
import { FiAward, FiCheck, FiCpu, FiUser } from "react-icons/fi";

export default function ChallengeLeaderboard({ players, currentRound }) {
  // Sort players by score descending
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  return (
    <div className="bg-neutral-50 dark:bg-neutral-900/40 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b pb-2 border-neutral-200 dark:border-neutral-800">
        <h3 className="font-extrabold text-sm text-surface-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
          <FiAward className="text-yellow-500" />
          Leaderboard
        </h3>
        <span className="text-xs font-black bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded">
          Round {currentRound}
        </span>
      </div>

      <div className="space-y-2">
        {sortedPlayers.map((player, idx) => {
          const isTop3 = idx < 3;
          const rankColors = [
            "text-yellow-500 bg-yellow-500/10 border-yellow-500/20",
            "text-gray-400 bg-gray-400/10 border-gray-400/20",
            "text-amber-600 bg-amber-600/10 border-amber-600/20"
          ];

          return (
            <div
              key={player.name}
              className={`flex items-center justify-between p-3 rounded-xl border transition-all duration-300
                ${player.isLocal
                  ? "border-purple-500 bg-purple-500/10 dark:bg-purple-950/20"
                  : "border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900"}`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                {/* Rank Badge */}
                <div 
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2
                    ${isTop3 
                      ? rankColors[idx] 
                      : "text-neutral-500 bg-neutral-100 dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700"}`}
                >
                  {idx + 1}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-1">
                    {!player.isLocal ? (
                      <FiCpu className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                    ) : (
                      <FiUser className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                    )}
                    <span className="font-extrabold text-sm text-neutral-800 dark:text-neutral-200 truncate">
                      {player.name}
                    </span>
                  </div>
                  <span className="text-[10px] text-neutral-400 block font-semibold mt-0.5">
                    Acc: {player.accuracy || 100}% · XP: +{player.xp || 0}
                  </span>
                </div>
              </div>

              {/* Status / Points */}
              <div className="text-right shrink-0 flex items-center gap-2">
                {player.answered && (
                  <span className="p-1 rounded-full bg-green-100 dark:bg-green-950/30 text-green-600 text-xs" title="Answer Submitted">
                    <FiCheck className="w-3.5 h-3.5" />
                  </span>
                )}
                
                <span className="font-black font-mono text-base text-neutral-800 dark:text-white">
                  {player.score} pts
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
