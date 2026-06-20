"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Clock, 
  Building2, 
  HelpCircle, 
  ArrowRight,
  TrendingUp,
  FileText
} from "lucide-react";

export default function PracticeRightSidebar({
  solved = 28,
  attempted = 16,
  remaining = 75,
  total = 119,
  estimatedTime = "4h 30m",
  easyCount = 60,
  mediumCount = 45,
  hardCount = 14,
  companiesCount = 12,
  activityData = []
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const percentage = useMemo(() => {
    if (total === 0) return 0;
    return Math.round((solved / total) * 100);
  }, [solved, total]);

  // Circular progress dimensions
  const radius = 38;
  const stroke = 8;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <aside className="w-full lg:w-[320px] flex-shrink-0 flex flex-col gap-6 select-none">
      {/* Session Progress Card */}
      <div className="bg-white dark:bg-[#1a1b1e] border border-slate-100 dark:border-neutral-800/80 rounded-2xl p-5 shadow-sm">
        <h3 className="text-xs font-black text-slate-800 dark:text-neutral-200 uppercase tracking-widest mb-4">
          Session Progress
        </h3>

        <div className="flex items-center gap-6 mb-5">
          {/* Radial Chart */}
          <div className="relative w-24 h-24 flex items-center justify-center flex-shrink-0">
            <svg className="w-full h-full transform -rotate-90">
              {/* Background circle */}
              <circle
                stroke="rgba(164, 53, 240, 0.08)"
                fill="transparent"
                strokeWidth={stroke}
                r={normalizedRadius}
                cx="48"
                cy="48"
              />
              {/* Foreground circle */}
              <circle
                stroke="#a435f0"
                fill="transparent"
                strokeWidth={stroke}
                strokeDasharray={circumference + " " + circumference}
                style={{ strokeDashoffset }}
                strokeLinecap="round"
                r={normalizedRadius}
                cx="48"
                cy="48"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-base font-black text-slate-800 dark:text-white leading-none">
                {percentage}%
              </span>
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-xs text-slate-500 dark:text-neutral-400 font-bold">
                <strong className="text-slate-800 dark:text-white mr-1">{solved}</strong> Solved
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className="text-xs text-slate-500 dark:text-neutral-400 font-bold">
                <strong className="text-slate-800 dark:text-white mr-1">{attempted}</strong> Attempted
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-purple-500" />
              <span className="text-xs text-slate-500 dark:text-neutral-400 font-bold">
                <strong className="text-slate-800 dark:text-white mr-1">{remaining}</strong> Remaining
              </span>
            </div>
          </div>
        </div>

        <Link 
          href="/arena" 
          className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-purple-500/5 hover:bg-purple-500/10 text-primary dark:bg-purple-950/20 dark:hover:bg-purple-950/30 rounded-xl text-xs font-black transition border border-purple-500/10"
        >
          <span>View Detailed Progress</span>
          <ArrowRight size={14} />
        </Link>
      </div>

      {/* Session Stats Card */}
      <div className="bg-white dark:bg-[#1a1b1e] border border-slate-100 dark:border-neutral-800/80 rounded-2xl p-5 shadow-sm">
        <h3 className="text-xs font-black text-slate-800 dark:text-neutral-200 uppercase tracking-widest mb-4">
          Session Stats
        </h3>

        <div className="flex flex-col gap-4 text-xs font-bold text-slate-600 dark:text-neutral-300">
          <div className="flex justify-between items-center border-b border-slate-50 dark:border-neutral-800/50 pb-2.5">
            <div className="flex items-center gap-2">
              <FileText size={16} className="text-slate-400" />
              <span>Total Problems</span>
            </div>
            <span className="text-slate-800 dark:text-white font-black">{total}</span>
          </div>
          <div className="flex justify-between items-center border-b border-slate-50 dark:border-neutral-800/50 pb-2.5">
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-slate-400" />
              <span>Estimated Time</span>
            </div>
            <span className="text-slate-800 dark:text-white font-black">{estimatedTime}</span>
          </div>
          <div className="flex justify-between items-center border-b border-slate-50 dark:border-neutral-800/50 pb-2.5">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-600 font-extrabold flex items-center justify-center text-[10px]">
                Gd
              </div>
              <span>Easy</span>
            </div>
            <span className="text-slate-800 dark:text-white font-black">{easyCount}</span>
          </div>
          <div className="flex justify-between items-center border-b border-slate-50 dark:border-neutral-800/50 pb-2.5">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-amber-500/10 text-amber-600 font-extrabold flex items-center justify-center text-[10px]">
                GS
              </div>
              <span>Medium</span>
            </div>
            <span className="text-slate-800 dark:text-white font-black">{mediumCount}</span>
          </div>
          <div className="flex justify-between items-center border-b border-slate-50 dark:border-neutral-800/50 pb-2.5">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-red-500/10 text-red-600 font-extrabold flex items-center justify-center text-[10px]">
                Hd
              </div>
              <span>Hard</span>
            </div>
            <span className="text-slate-800 dark:text-white font-black">{hardCount}</span>
          </div>
          <div className="flex justify-between items-center pb-1">
            <div className="flex items-center gap-2">
              <Building2 size={16} className="text-slate-400" />
              <span>Companies</span>
            </div>
            <span className="text-slate-800 dark:text-white font-black">{companiesCount}</span>
          </div>
        </div>
      </div>

      {/* Activity Card */}
      <div className="bg-white dark:bg-[#1a1b1e] border border-slate-100 dark:border-neutral-800/80 rounded-2xl p-5 shadow-sm transition-all duration-300">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xs font-black text-slate-800 dark:text-neutral-200 uppercase tracking-widest">
            Activity
          </h3>
          {activityData.length > 0 && (
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-[11px] font-black text-primary hover:underline uppercase tracking-wider"
            >
              {isExpanded ? "View Less" : "View All"}
            </button>
          )}
        </div>

        <div className="flex flex-col gap-4">
          {activityData.length === 0 ? (
            <div className="text-xs font-bold text-slate-400 dark:text-neutral-600 py-2 text-center">
              No recent activity
            </div>
          ) : (
            (isExpanded ? activityData : activityData.slice(0, 4)).map((act, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs animate-in fade-in duration-200">
                <div className="flex items-center gap-3">
                  <div className={`w-2.5 h-2.5 rounded-full ${act.statusColor}`} />
                  <span className="font-bold text-slate-750 dark:text-neutral-200 leading-tight">
                    {act.title}
                  </span>
                </div>
                <span className="text-slate-450 dark:text-neutral-500 font-bold whitespace-nowrap">
                  {act.time}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </aside>
  );
}
