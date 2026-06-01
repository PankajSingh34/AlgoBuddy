"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiChevronRight, FiSearch, FiBookOpen } from "react-icons/fi";
import { Award, Zap, BookOpen, Layers } from "lucide-react";
import Footer from "@/app/components/footer";
import BackToTop from "@/app/components/ui/backtotop";
import { practiceData } from "@/lib/practiceData";

/* ─── colour + icon theme per DS ─── */
const DS_THEME = {
  array: {
    color: "#a435f0",
    bg: "#faf5ff",
    border: "#e9d5ff",
    mini: "Array",
    icon: (c) => (
      <svg viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <rect x="3" y="3" width="4" height="18" rx="1" /><rect x="10" y="8" width="4" height="13" rx="1" /><rect x="17" y="5" width="4" height="16" rx="1" />
      </svg>
    ),
  },
  "linked-list": {
    color: "#d97706",
    bg: "#fffbeb",
    border: "#fde68a",
    mini: "Linked List",
    icon: (c) => (
      <svg viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <circle cx="5" cy="12" r="3" /><circle cx="19" cy="12" r="3" /><path d="M8 12h8" /><path d="M14 9l3 3-3 3" />
      </svg>
    ),
  },
  "stack-queue": {
    color: "#2563eb",
    bg: "#eff6ff",
    border: "#bfdbfe",
    mini: "Stack & Queue",
    icon: (c) => (
      <svg viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <rect x="4" y="2" width="16" height="5" rx="1.5" /><rect x="4" y="9" width="16" height="5" rx="1.5" /><rect x="4" y="16" width="16" height="5" rx="1.5" />
      </svg>
    ),
  },
  recursion: {
    color: "#0f766e",
    bg: "#f0fdfa",
    border: "#ccfbf1",
    mini: "Recursion",
    icon: (c) => (
      <svg viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
      </svg>
    ),
  },
  tree: {
    color: "#7c3aed",
    bg: "#faf5ff",
    border: "#e9d5ff",
    mini: "Tree",
    icon: (c) => (
      <svg viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <circle cx="12" cy="5" r="2.5" /><circle cx="6" cy="15" r="2.5" /><circle cx="18" cy="15" r="2.5" /><path d="M10.2 7.2L7.5 12.5" /><path d="M13.8 7.2l2.7 5.3" />
      </svg>
    ),
  },
  graph: {
    color: "#dc2626",
    bg: "#fef2f2",
    border: "#fecaca",
    mini: "Graph",
    icon: (c) => (
      <svg viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <circle cx="5" cy="6" r="2.5" /><circle cx="19" cy="6" r="2.5" /><circle cx="5" cy="18" r="2.5" /><circle cx="19" cy="18" r="2.5" /><path d="M7.5 6h9" /><path d="M5 8.5v7" /><path d="M19 8.5v7" /><path d="M7.5 18h9" /><path d="M7 8l10 8" />
      </svg>
    ),
  },
  dp: {
    color: "#db2777",
    bg: "#fdf2f8",
    border: "#fbcfe8",
    mini: "DP",
    icon: (c) => (
      <svg viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M9 3v18M15 3v18M3 9h18M3 15h18" />
      </svg>
    ),
  },
};

/* ─── Miniature Visuals for practice cards ─── */
function ArrayMiniViz({ color }) {
  const bars = [65, 30, 80, 45, 55, 20, 70];
  const highlight = 2;
  return (
    <div className="flex items-end gap-1 h-[48px] justify-center">
      {bars.map((h, i) => (
        <div
          key={i}
          className="w-4 rounded-t-sm transition-all"
          style={{
            height: `${(h / 80) * 44}px`,
            background: i === highlight ? color : color + "30",
          }}
        />
      ))}
    </div>
  );
}

function LinkedListMiniViz({ color }) {
  const nodes = [7, 3, 9, 1];
  return (
    <div className="flex items-center justify-center gap-1.5 h-[48px]">
      {nodes.map((v, i) => (
        <React.Fragment key={i}>
          <div
            className="w-7 h-7 rounded-full text-[10px] font-bold flex items-center justify-center border"
            style={{ background: color + "15", color, borderColor: color + "40" }}
          >
            {v}
          </div>
          {i < nodes.length - 1 && (
            <span className="text-[10px] font-bold" style={{ color: color + "90" }}>
              →
            </span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

function StackQueueMiniViz({ color }) {
  return (
    <div className="flex gap-6 items-center justify-center h-[48px]">
      {/* Mini Stack */}
      <div className="w-10 h-10 border-b-2 border-x-2 rounded-b flex flex-col justify-end p-0.5 gap-0.5" style={{ borderColor: color + "40" }}>
        <div className="h-2 text-[6px] font-bold rounded flex items-center justify-center text-white" style={{ background: color }}>20</div>
        <div className="h-2 text-[6px] font-bold rounded flex items-center justify-center" style={{ background: color + "20", color }}>10</div>
      </div>
      {/* Mini Queue */}
      <div className="w-16 h-6 border-y-2 flex items-center p-0.5 gap-1 justify-center" style={{ borderColor: color + "40" }}>
        <div className="w-4 h-4 text-[6px] font-bold rounded flex items-center justify-center text-white" style={{ background: color }}>A</div>
        <div className="w-4 h-4 text-[6px] font-bold rounded flex items-center justify-center" style={{ background: color + "20", color }}>B</div>
      </div>
    </div>
  );
}

function RecursionMiniViz({ color }) {
  const frames = ["f(3)", "f(2)", "f(1)"];
  return (
    <div className="flex flex-col gap-0.5 items-center justify-center h-[48px] w-full">
      {frames.map((v, i) => (
        <div
          key={i}
          className="h-3 rounded text-[8px] font-mono font-bold flex items-center justify-center border"
          style={{
            width: `${50 - i * 10}px`,
            background: i === 0 ? color : color + "15",
            color: i === 0 ? "#fff" : color,
            borderColor: i === 0 ? color : color + "40",
          }}
        >
          {v}
        </div>
      ))}
    </div>
  );
}

function TreeMiniViz({ color }) {
  return (
    <div className="flex items-center justify-center h-[48px]">
      <svg viewBox="0 0 80 50" className="w-16 h-[44px]">
        <line x1="40" y1="10" x2="20" y2="30" stroke={color + "40"} strokeWidth="1.5" />
        <line x1="40" y1="10" x2="60" y2="30" stroke={color + "40"} strokeWidth="1.5" />
        <circle cx="40" cy="10" r="6" fill={color} />
        <circle cx="20" cy="30" r="5" fill={color + "60"} />
        <circle cx="60" cy="30" r="5" fill={color + "60"} />
      </svg>
    </div>
  );
}

function GraphMiniViz({ color }) {
  return (
    <div className="flex items-center justify-center h-[48px]">
      <svg viewBox="0 0 80 50" className="w-16 h-[44px]">
        <line x1="15" y1="15" x2="40" y2="10" stroke={color + "40"} strokeWidth="1.5" />
        <line x1="40" y1="10" x2="65" y2="18" stroke={color + "40"} strokeWidth="1.5" />
        <line x1="15" y1="15" x2="25" y2="40" stroke={color + "40"} strokeWidth="1.5" />
        <line x1="25" y1="40" x2="55" y2="38" stroke={color + "40"} strokeWidth="1.5" />
        <line x1="65" y1="18" x2="55" y2="38" stroke={color + "40"} strokeWidth="1.5" />
        <circle cx="15" cy="15" r="5" fill={color} />
        <circle cx="40" cy="10" r="5" fill={color + "60"} />
        <circle cx="65" cy="18" r="5" fill={color + "40"} />
        <circle cx="25" cy="40" r="5" fill={color + "60"} />
        <circle cx="55" cy="38" r="5" fill={color} />
      </svg>
    </div>
  );
}

function DPMiniViz({ color }) {
  return (
    <div className="flex gap-1 items-center justify-center h-[48px]">
      {[0, 1, 2].map((r) => (
        <div key={r} className="flex flex-col gap-1">
          {[0, 1, 2].map((c) => {
            const isMatch = r === c;
            return (
              <div
                key={c}
                className="w-3.5 h-3.5 rounded border flex items-center justify-center text-[7px] font-mono font-bold"
                style={{
                  background: isMatch ? color : "transparent",
                  borderColor: isMatch ? color : color + "30",
                  color: isMatch ? "#fff" : color + "80",
                }}
              >
                {isMatch ? "1" : "0"}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

const MINI_VIZ = {
  Array: ArrayMiniViz,
  "Linked List": LinkedListMiniViz,
  "Stack & Queue": StackQueueMiniViz,
  Recursion: RecursionMiniViz,
  Tree: TreeMiniViz,
  Graph: GraphMiniViz,
  DP: DPMiniViz,
};

export default function PracticeHub() {
  const [search, setSearch] = useState("");
  const [progress, setProgress] = useState({});
  const [mounted, setMounted] = useState(false);
  // Load progress from localStorage on mount
  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem("algobuddy_practice_progress");
      if (saved) {
        setProgress(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load practice progress:", e);
    }
  }, []);

  // Compute overall stats
  const stats = useMemo(() => {
    let totalProblems = 0;
    let solvedProblems = 0;
    let easyTotal = 0;
    let easySolved = 0;
    let mediumTotal = 0;
    let mediumSolved = 0;
    let hardTotal = 0;
    let hardSolved = 0;

    practiceData.forEach((topic) => {
      topic.subsections.forEach((sub) => {
        sub.items.forEach((item) => {
          totalProblems++;
          const status = progress[item.id] || "Not Started";
          if (status === "Completed") {
            solvedProblems++;
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
    });

    return {
      total: totalProblems,
      solved: solvedProblems,
      easy: { total: easyTotal, solved: easySolved },
      medium: { total: mediumTotal, solved: mediumSolved },
      hard: { total: hardTotal, solved: hardSolved },
      pct: totalProblems > 0 ? Math.round((solvedProblems / totalProblems) * 100) : 0,
    };
  }, [progress]);

  // Compute topic-wise progress
  const topicStats = useMemo(() => {
    const map = {};
    practiceData.forEach((topic) => {
      let total = 0;
      let solved = 0;
      topic.subsections.forEach((sub) => {
        sub.items.forEach((item) => {
          total++;
          if (progress[item.id] === "Completed") {
            solved++;
          }
        });
      });
      map[topic.slug] = {
        total,
        solved,
        pct: total > 0 ? Math.round((solved / total) * 100) : 0,
      };
    });
    return map;
  }, [progress]);

  const filteredTopics = useMemo(() => {
    if (!search.trim()) return practiceData;
    const q = search.toLowerCase();
    return practiceData.filter(
      (topic) =>
        topic.title.toLowerCase().includes(q) ||
        topic.desc.toLowerCase().includes(q) ||
        topic.subsections.some((sub) =>
          sub.title.toLowerCase().includes(q) ||
          sub.items.some((item) => item.name.toLowerCase().includes(q))
        )
    );
  }, [search]);

  return (
    <div className="min-h-screen bg-white dark:bg-[#1c1d1f] text-surface-900 dark:text-white transition-colors duration-300">

      {/* Hero Section inspired by Apna College but Purple themed */}
      <section className="relative px-5 pt-12 pb-8 bg-gradient-to-b from-white via-surface-50 to-purple-50/40 dark:bg-none dark:bg-[#1c1d1f] border-b border-surface-100 dark:border-neutral-800">
        {/* Decorative background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/10 dark:bg-primary/5 blur-3xl rounded-full pointer-events-none" />

        <div className="max-w-[1100px] mx-auto relative">
          <div className="text-center mb-10">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight mb-4">
              DSA Sheet - <span className="text-primary">Master Interview Questions</span>
            </h1>
            <p className="text-md sm:text-lg text-surface-600 dark:text-surface-400 max-w-2xl mx-auto leading-relaxed">
              Curated roadmap mapping directly to your interactive visualizers. Complete concepts visually, dry-run theory steps, and conquer premium coding tasks.
            </p>
          </div>

          {/* Stats Dashboard Card (Apna College Style, Purple Branding) */}
          <div className="bg-white dark:bg-[#2d2f31] border border-surface-200 dark:border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-xl max-w-4xl mx-auto mb-12">
            <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1.8fr] gap-8 items-center">
              {/* Left Column: Progress Meter */}
              <div className="flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-surface-200 dark:border-neutral-800 pb-6 md:pb-0 md:pr-8">
                <div className="relative w-36 h-36 flex items-center justify-center">
                  {/* Outer circle track */}
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="72"
                      cy="72"
                      r="60"
                      className="stroke-surface-100 dark:stroke-neutral-800"
                      strokeWidth="10"
                      fill="transparent"
                    />
                    <circle
                      cx="72"
                      cy="72"
                      r="60"
                      className="stroke-primary"
                      strokeWidth="10"
                      fill="transparent"
                      strokeDasharray={376.8}
                      strokeDashoffset={mounted ? 376.8 - (376.8 * stats.pct) / 100 : 376.8}
                      strokeLinecap="round"
                      style={{ transition: "stroke-dashoffset 1s ease-out" }}
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-3xl font-black">{mounted ? `${stats.pct}%` : "0%"}</span>
                    <span className="text-[10px] font-bold text-surface-500 uppercase tracking-wider">Completed</span>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <p className="text-sm font-semibold text-surface-600 dark:text-surface-300">
                    Solved <span className="text-primary font-bold">{mounted ? stats.solved : 0}</span> / {stats.total} Questions
                  </p>
                </div>
              </div>

              {/* Right Column: Details & Tags */}
              <div className="space-y-5">
                <div>
                  <h3 className="text-xl font-bold mb-2">Curated Roadmap Stats</h3>
                  <div className="flex flex-wrap gap-2.5">
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400">
                      Easy: {mounted ? stats.easy.solved : 0}/{stats.easy.total}
                    </span>
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-yellow-50 text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-400">
                      Medium: {mounted ? stats.medium.solved : 0}/{stats.medium.total}
                    </span>
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400">
                      Hard: {mounted ? stats.hard.solved : 0}/{stats.hard.total}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-surface-100 dark:border-neutral-800">
                  <span className="text-[12px] font-medium text-surface-600 dark:text-surface-300 leading-relaxed font-poppins">
                    <span className="text-primary font-extrabold uppercase text-[10px] tracking-wider mr-1.5">Pro-Tip:</span>
                    Tap <span className="font-bold text-primary dark:text-purple-300">Theory</span> inside any problem below to watch its visual step-by-step dry run before practicing!
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative max-w-[480px] mx-auto">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search practice topics or questions..."
              className="w-full h-[52px] pl-12 pr-4 rounded-2xl border border-surface-200 dark:border-neutral-800 bg-white dark:bg-[#2d2f31] text-surface-900 dark:text-white placeholder-surface-400 text-[15px] shadow-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-900 dark:hover:text-white transition-colors"
              >
                x
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Topics Roadmap Container Grid */}
      <section className="px-5 pt-4 pb-16 max-w-[1100px] mx-auto">
        {filteredTopics.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
            <style>{`
              .dark [data-theme-card="Array"] { background: #1a0e2d !important; border-color: #5b21b6 !important; }
              .dark [data-theme-card="Stack & Queue"] { background: #111d33 !important; border-color: #1e3a8a !important; }
              .dark [data-theme-card="Linked List"] { background: #2b1a08 !important; border-color: #92400e !important; }
              .dark [data-theme-card="Recursion"] { background: #0c231e !important; border-color: #115e59 !important; }
              .dark [data-theme-card="Tree"] { background: #1a0e2d !important; border-color: #5b21b6 !important; }
              .dark [data-theme-card="Graph"] { background: #2c1215 !important; border-color: #991b1b !important; }
              .dark [data-theme-card="DP"] { background: #2e1022 !important; border-color: #9d174d !important; }
              
              .dark [data-theme-header="Array"] { background: #23133d !important; border-color: #5b21b6 !important; }
              .dark [data-theme-header="Stack & Queue"] { background: #182847 !important; border-color: #1e3a8a !important; }
              .dark [data-theme-header="Linked List"] { background: #3d240a !important; border-color: #92400e !important; }
              .dark [data-theme-header="Recursion"] { background: #0f3129 !important; border-color: #115e59 !important; }
              .dark [data-theme-header="Tree"] { background: #23133d !important; border-color: #5b21b6 !important; }
              .dark [data-theme-header="Graph"] { background: #3d171b !important; border-color: #991b1b !important; }
              .dark [data-theme-header="DP"] { background: #3b132b !important; border-color: #9d174d !important; }
            `}</style>
            {filteredTopics.map((topic, i) => {
              const t = DS_THEME[topic.slug] || DS_THEME.array;
              const MiniViz = MINI_VIZ[t.mini];
              const currentTopicStats = topicStats[topic.slug] || { total: 0, solved: 0, pct: 0 };
              return (
                <motion.div
                  key={topic.slug}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ y: -6, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="group w-full h-full"
                >
                  <Link href={`/practice/${topic.slug}`} className="block w-full h-full text-left cursor-pointer">
                    <div
                      className="rounded-2xl border overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col bg-white"
                      style={{ borderColor: t.border }}
                      data-theme-card={t.mini}
                    >
                      {/* title bar */}
                      <div
                        className="flex items-center gap-2 px-4 py-3 border-b transition-colors duration-300"
                        style={{ background: t.bg, borderColor: t.border }}
                        data-theme-header={t.mini}
                      >
                        <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                        <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
                        <span className="w-3 h-3 rounded-full bg-[#28c840]" />
                        <span className="ml-2 text-[12px] font-mono text-surface-500 dark:text-surface-300">
                          {topic.slug.replace("-", "")}.js
                        </span>
                      </div>

                      {/* card body */}
                      <div
                        className="p-5 flex-1 flex flex-col bg-white"
                        data-theme-card={t.mini}
                      >
                        {/* icon + title */}
                        <div className="flex items-center gap-3 mb-3">
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center p-2 flex-shrink-0 transition-colors duration-300"
                            style={{ background: t.bg }}
                            data-theme-header={t.mini}
                          >
                            {t.icon(t.color)}
                          </div>
                          <div>
                            <h3 className="text-[18px] font-extrabold text-surface-900 dark:text-white transition-colors">
                              {topic.title}
                            </h3>
                            <p className="text-[12px] text-surface-500 dark:text-surface-400 font-medium transition-colors">
                              {mounted ? `${currentTopicStats.solved}/${currentTopicStats.total} Solved` : `0/${currentTopicStats.total} Solved`}
                            </p>
                          </div>
                        </div>

                        {/* description */}
                        <p className="text-[13px] text-surface-600 dark:text-surface-300 leading-relaxed mb-4 transition-colors line-clamp-2">
                          {topic.desc}
                        </p>

                        {/* mini visualization */}
                        {MiniViz && (
                          <div
                            className="rounded-lg p-3 mb-4 border transition-colors duration-300"
                            style={{ background: t.bg, borderColor: t.border }}
                            data-theme-header={t.mini}
                          >
                            <MiniViz color={t.color} />
                          </div>
                        )}

                        <div className="mt-auto space-y-4">
                          {/* Progress Bar */}
                          <div className="w-full">
                            <div className="flex justify-between text-[10px] font-bold text-surface-400 dark:text-surface-300 mb-1 uppercase tracking-wider">
                              <span>Progress</span>
                              <span>{mounted ? `${currentTopicStats.pct}%` : "0%"}</span>
                            </div>
                            <div className="w-full h-1.5 bg-surface-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                              <div
                                className="h-full transition-all duration-500 rounded-full"
                                style={{
                                  width: mounted ? `${currentTopicStats.pct}%` : "0%",
                                  background: t.color
                                }}
                              />
                            </div>
                          </div>

                          {/* Action button */}
                          <div
                            className="inline-flex w-full items-center justify-center gap-2 h-[38px] px-5 rounded-full text-[13px] font-bold text-white
                              group-hover:gap-3 transition-all duration-200"
                            style={{ background: t.color }}
                          >
                            Explore {topic.title}
                            <FiChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-surface-100 dark:bg-neutral-800">
              <FiSearch className="h-6 w-6 text-surface-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">No matching topics found</h3>
            <p className="text-surface-500 dark:text-surface-400 text-sm">Try searching for generic terms like "binary" or "stack"</p>
          </div>
        )}
      </section>

      <Footer />
      <BackToTop />
    </div>
  );
}

