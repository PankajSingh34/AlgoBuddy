"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Award, CheckCircle2, Star, ListChecks } from "lucide-react";
import Link from "next/link";
import { practiceData } from "@/lib/practiceData";

export default function PracticeStats() {
  const [progress, setProgress] = useState({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem("algobuddy_practice_progress");
      if (saved) {
        setProgress(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load practice progress for stats:", e);
    }
  }, []);

  // Compute stats metrics
  const metrics = useMemo(() => {
    let total = 0;
    let solved = 0;
    let easyTotal = 0;
    let easySolved = 0;
    let mediumTotal = 0;
    let mediumSolved = 0;
    let hardTotal = 0;
    let hardSolved = 0;

    const topicsList = [];

    practiceData.forEach((topic) => {
      let topicTotal = 0;
      let topicSolved = 0;

      topic.subsections.forEach((sub) => {
        sub.items.forEach((item) => {
          total++;
          topicTotal++;
          const status = progress[item.id] || "Not Started";
          if (status === "Completed") {
            solved++;
            topicSolved++;
          }

          if (item.difficulty === "Easy") {
            easyTotal++;
            if (status === "Completed") easySolved++;
          } else if (item.difficulty === "Medium") {
            mediumTotal++;
            if (status === "Completed") mediumSolved++;
          } else if (item.difficulty === "Hard") {
            hardTotal++;
            if (status === "Completed") hardSolved++;
          }
        });
      });

      topicsList.push({
        title: topic.title,
        solved: topicSolved,
        total: topicTotal,
        pct: topicTotal > 0 ? Math.round((topicSolved / topicTotal) * 100) : 0,
      });
    });

    return {
      total,
      solved,
      easy: { total: easyTotal, solved: easySolved },
      medium: { total: mediumTotal, solved: mediumSolved },
      hard: { total: hardTotal, solved: hardSolved },
      topics: topicsList,
      pct: total > 0 ? Math.round((solved / total) * 100) : 0,
    };
  }, [progress]);

  if (!mounted) return null;

  return (
    <section className="bg-white dark:bg-[#2d2f31] border border-surface-200 dark:border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-xl mt-8">
      <div className="flex items-center gap-2 mb-6">
        <ListChecks className="text-primary" />
        <h2 className="text-xl font-bold text-surface-900 dark:text-white">DSA Practice Progress</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_1.5fr] gap-8">
        
        {/* Left Card: Summary Metric */}
        <div className="flex flex-col items-center justify-center bg-surface-50/50 dark:bg-neutral-800/20 border border-surface-200/50 dark:border-neutral-800/40 p-6 rounded-2xl">
          <div className="relative w-32 h-32 flex items-center justify-center mb-4">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="50"
                className="stroke-surface-100 dark:stroke-neutral-800"
                strokeWidth="8"
                fill="transparent"
              />
              <circle
                cx="64"
                cy="64"
                r="50"
                className="stroke-primary"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={314.2}
                strokeDashoffset={314.2 - (314.2 * metrics.pct) / 100}
                strokeLinecap="round"
                style={{ transition: "stroke-dashoffset 0.8s ease-out" }}
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-2xl font-black">{metrics.pct}%</span>
              <span className="text-[9px] font-bold text-surface-400 uppercase">Solved</span>
            </div>
          </div>
          <p className="text-sm font-semibold text-surface-600 dark:text-surface-300">
            Solved <span className="text-primary font-bold">{metrics.solved}</span> / {metrics.total} problems
          </p>
          <Link
            href="/practice"
            className="mt-4 px-5 py-2 text-xs font-bold text-white bg-primary hover:opacity-90 rounded-full transition"
          >
            Continue Sheet
          </Link>
        </div>

        {/* Right Card: Topic-wise Progress and difficulty distribution */}
        <div className="space-y-6">
          {/* Difficulty breakdown */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-surface-400 mb-3">Difficulty Distribution</h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-green-50/50 dark:bg-green-950/10 border border-green-500/10 p-3 rounded-xl flex flex-col items-center">
                <span className="text-[10px] font-bold text-green-600 dark:text-green-400">EASY</span>
                <span className="text-lg font-black mt-1 text-green-700 dark:text-green-400">
                  {metrics.easy.solved}/{metrics.easy.total}
                </span>
              </div>
              <div className="bg-yellow-50/50 dark:bg-yellow-950/10 border border-yellow-500/10 p-3 rounded-xl flex flex-col items-center">
                <span className="text-[10px] font-bold text-yellow-600 dark:text-yellow-400">MEDIUM</span>
                <span className="text-lg font-black mt-1 text-yellow-700 dark:text-yellow-400">
                  {metrics.medium.solved}/{metrics.medium.total}
                </span>
              </div>
              <div className="bg-red-50/50 dark:bg-red-950/10 border border-red-500/10 p-3 rounded-xl flex flex-col items-center">
                <span className="text-[10px] font-bold text-red-600 dark:text-red-400">HARD</span>
                <span className="text-lg font-black mt-1 text-red-700 dark:text-red-400">
                  {metrics.hard.solved}/{metrics.hard.total}
                </span>
              </div>
            </div>
          </div>

          {/* Topics meters */}
          <div className="space-y-3.5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-surface-400">Topic Completion</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {metrics.topics.map((t, idx) => (
                <div key={idx} className="space-y-1.5 bg-surface-50/50 dark:bg-[#1c1d1f]/40 p-3 rounded-xl border border-surface-200/40 dark:border-neutral-800/40">
                  <div className="flex justify-between text-xs font-bold text-surface-700 dark:text-surface-300">
                    <span>{t.title}</span>
                    <span>{t.solved}/{t.total}</span>
                  </div>
                  <div className="w-full h-1.5 bg-surface-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${t.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
