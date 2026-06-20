"use client";

import React from "react";
import { 
  ArrowLeft, 
  Layers, 
  ListTodo, 
  GitMerge, 
  Building2, 
  Trophy, 
  Bookmark, 
  History, 
  GraduationCap, 
  Flame, 
  ScrollText,
  ChevronRight 
} from "lucide-react";

export default function PracticeSidebar({ 
  activeView, 
  onViewChange, 
  solvedCount = 8, 
  dailySolved = 0,
  weeklySolved = 0,
  monthlySolved = 0,
  dailyGoal = 3,
  weeklyGoal = 10,
  monthlyGoal = 50,
  streakDays = 0,
  bestStreak = 0,
  mySheetCount = 0,
  onBackToPractice
}) {
  const navItems = [
    { id: "my-sheet",     label: "My Sheet",     icon: ScrollText, badge: mySheetCount > 0 ? mySheetCount : null },
    { id: "problem-list", label: "Problem List", icon: ListTodo },
    { id: "topic-wise",   label: "Topic-wise",   icon: GitMerge },
    { id: "company-wise", label: "Company-wise", icon: Building2 },
    { id: "bookmarks",    label: "Bookmarks",    icon: Bookmark },
    { id: "recent-solved",label: "Recent Solved",icon: History },
  ];

  const dailyGoalPercentage = Math.min(100, Math.round((dailySolved / dailyGoal) * 100) || 0);
  const weeklyGoalPercentage = Math.min(100, Math.round((weeklySolved / weeklyGoal) * 100) || 0);
  const monthlyGoalPercentage = Math.min(100, Math.round((monthlySolved / monthlyGoal) * 100) || 0);
  const achievementBadges = [
  {
    name: "7 Day Streak",
    icon: "🔥",
    unlocked: streakDays >= 7,
  },
  {
    name: "30 Day Streak",
    icon: "🏆",
    unlocked: streakDays >= 30,
  },
  {
    name: "50 Problems",
    icon: "🎯",
    unlocked: solvedCount >= 50,
  },
  {
    name: "100 Problems",
    icon: "🚀",
    unlocked: solvedCount >= 100,
  },
];

  return (
    <aside className="w-full lg:w-[260px] flex-shrink-0 flex flex-col gap-6 select-none">
      {/* Back button */}
      <button 
        onClick={onBackToPractice}
        className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-purple-500/10 text-primary dark:bg-purple-950/20 dark:text-purple-400 font-bold text-sm w-fit transition hover:scale-102 active:scale-98"
      >
        <ArrowLeft size={16} />
        <span>Back to Home</span>
      </button>

      {/* Navigation List */}
      <nav className="flex flex-col gap-1 bg-white dark:bg-[#1a1b1e] border border-slate-100 dark:border-neutral-800/80 rounded-2xl p-4 shadow-sm">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${
                isActive
                  ? "bg-primary text-white shadow-md shadow-primary/20 dark:shadow-none"
                  : item.id === "my-sheet"
                    ? "text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/30 border border-purple-200/60 dark:border-purple-800/40"
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-50 dark:text-neutral-400 dark:hover:text-neutral-200 dark:hover:bg-neutral-800/50"
              }`}
            >
              <Icon
                size={18}
                className={isActive ? "text-white" : item.id === "my-sheet" ? "text-purple-500 dark:text-purple-400" : "text-slate-400 dark:text-neutral-500"}
              />
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge && !isActive && (
                <span className="text-[10px] font-black bg-primary text-white rounded-full px-1.5 py-0.5 min-w-[18px] text-center leading-tight">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Widgets Column */}
      <div className="flex flex-col sm:flex-row lg:flex-col gap-4">
        {/* Achievement Badges */}
<div className="bg-white dark:bg-[#1a1b1e] border border-slate-100 dark:border-neutral-800/80 rounded-2xl p-5 shadow-sm">
  <h3 className="text-sm font-black text-slate-800 dark:text-white mb-4">
    Achievement Badges
  </h3>

  <div className="space-y-3">
    {achievementBadges.map((badge) => (
      <div
        key={badge.name}
        className={`flex items-center justify-between p-3 rounded-xl ${
          badge.unlocked
            ? "bg-green-50 dark:bg-green-900/20"
            : "bg-slate-50 dark:bg-neutral-800"
        }`}
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">{badge.icon}</span>
          <span className="text-xs font-bold">
            {badge.name}
          </span>
        </div>

        <span
          className={`text-[10px] font-black px-2 py-1 rounded-full ${
            badge.unlocked
              ? "bg-green-500 text-white"
              : "bg-slate-300 text-slate-600"
          }`}
        >
          {badge.unlocked ? "Unlocked" : "Locked"}
        </span>
      </div>
    ))}
  </div>
</div>
        {/* Daily Goal Card */}
        <div className="flex-1 bg-white dark:bg-[#1a1b1e] border border-slate-100 dark:border-neutral-800/80 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-4.5">
            <div className="w-9 h-9 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center">
              <Flame size={18} className="fill-orange-500/10" />
            </div>
            <div>
              <span className="text-[10px] font-black text-slate-400 dark:text-neutral-500 uppercase tracking-widest block">
                Daily Goal
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-xl font-black text-slate-800 dark:text-white">
                  {dailySolved}/{dailyGoal}
                </span>
                <span className="text-xs text-slate-400 dark:text-neutral-500 font-semibold">
                  Problems Solved
                </span>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-100 dark:bg-neutral-800 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-primary h-full rounded-full transition-all duration-500" 
              style={{ width: `${dailyGoalPercentage}%` }}
            />
          </div>
        </div>

        {/* Weekly Goal Card */}
        <div className="flex-1 bg-white dark:bg-[#1a1b1e] border border-slate-100 dark:border-neutral-800/80 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-4.5">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
              <Layers size={18} />
            </div>
            <div>
              <span className="text-[10px] font-black text-slate-400 dark:text-neutral-500 uppercase tracking-widest block">
                Weekly Goal
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-xl font-black text-slate-800 dark:text-white">
                  {weeklySolved}/{weeklyGoal}
                </span>
                <span className="text-xs text-slate-400 dark:text-neutral-500 font-semibold">
                  Problems Solved
                </span>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-100 dark:bg-neutral-800 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-purple-500 h-full rounded-full transition-all duration-500" 
              style={{ width: `${weeklyGoalPercentage}%` }}
            />
          </div>
        </div>

        {/* Monthly Goal Card */}
        <div className="flex-1 bg-white dark:bg-[#1a1b1e] border border-slate-100 dark:border-neutral-800/80 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-4.5">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <Trophy size={18} />
            </div>
            <div>
              <span className="text-[10px] font-black text-slate-400 dark:text-neutral-500 uppercase tracking-widest block">
                Monthly Goal
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-xl font-black text-slate-800 dark:text-white">
                  {monthlySolved}/{monthlyGoal}
                </span>
                <span className="text-xs text-slate-400 dark:text-neutral-500 font-semibold">
                  Problems Solved
                </span>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-100 dark:bg-neutral-800 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-blue-500 h-full rounded-full transition-all duration-500" 
              style={{ width: `${monthlyGoalPercentage}%` }}
            />
          </div>
        </div>

        {/* Streak Card */}
        <div className="flex-1 bg-white dark:bg-[#1a1b1e] border border-slate-100 dark:border-neutral-800/80 rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="w-11 h-11 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center flex-shrink-0 animate-pulse">
            <Flame size={22} className="fill-amber-500/20" />
          </div>
          <div>
            <span className="text-[10px] font-black text-slate-400 dark:text-neutral-500 uppercase tracking-widest block">
              Current Streak
            </span>
            <span className="text-xl font-black text-slate-800 dark:text-white block mt-0.5">
              {streakDays} Days
            </span>
            <span className="text-[10px] text-slate-400 dark:text-neutral-500 font-bold block mt-0.5">
              🔥 Best: {bestStreak} Days
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
