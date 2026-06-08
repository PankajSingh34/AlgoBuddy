"use client";

import React, { useEffect, useState, useMemo, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Home, 
  Play, 
  CheckCircle2, 
  Circle, 
  BookOpen, 
  Users, 
  Bookmark, 
  User, 
  Crown, 
  ChevronDown, 
  ChevronUp, 
  Zap, 
  Calendar, 
  Trophy, 
  SlidersHorizontal, 
  Search,
  ExternalLink,
  ChevronRight,
  Moon,
  Sun
} from "lucide-react";
import Footer from "@/app/components/footer";
import BackToTop from "@/app/components/ui/backtotop";
import CompanyLogos from "@/app/components/practice/CompanyLogos";
import TheoryDrawer from "@/app/components/practice/TheoryDrawer";
import { practiceData } from "@/lib/practiceData";
import { useUser } from "@/features/user/UserContext";

// Local storage theme helpers
function getStoredTheme() {
  if (typeof window === "undefined") return "light";
  const saved = window.localStorage.getItem("theme");
  if (saved === "dark" || saved === "light") return saved;
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function applyTheme(nextTheme) {
  document.documentElement.classList.toggle("dark", nextTheme === "dark");
  window.localStorage.setItem("theme", nextTheme);
}

// Topic theme styling
const DS_THEME = {
  array: {
    color: "#a435f0",
    bg: "bg-purple-500/10",
    border: "border-purple-200/50 dark:border-purple-900/30",
    hoverBg: "hover:bg-purple-500/20",
    mini: "Array",
    icon: (c) => (
      <svg viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <rect x="3" y="3" width="4" height="18" rx="1" /><rect x="10" y="8" width="4" height="13" rx="1" /><rect x="17" y="5" width="4" height="16" rx="1" />
      </svg>
    ),
  },
  "linked-list": {
    color: "#d97706",
    bg: "bg-amber-500/10",
    border: "border-amber-200/50 dark:border-amber-900/30",
    hoverBg: "hover:bg-amber-500/20",
    mini: "Linked List",
    icon: (c) => (
      <svg viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <circle cx="5" cy="12" r="3" /><circle cx="19" cy="12" r="3" /><path d="M8 12h8" /><path d="M14 9l3 3-3 3" />
      </svg>
    ),
  },
  "stack-queue": {
    color: "#2563eb",
    bg: "bg-blue-500/10",
    border: "border-blue-200/50 dark:border-blue-900/30",
    hoverBg: "hover:bg-blue-500/20",
    mini: "Stack & Queue",
    icon: (c) => (
      <svg viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <rect x="4" y="2" width="16" height="5" rx="1.5" /><rect x="4" y="9" width="16" height="5" rx="1.5" /><rect x="4" y="16" width="16" height="5" rx="1.5" />
      </svg>
    ),
  },
  recursion: {
    color: "#0f766e",
    bg: "bg-teal-500/10",
    border: "border-teal-200/50 dark:border-teal-900/30",
    hoverBg: "hover:bg-teal-500/20",
    mini: "Recursion",
    icon: (c) => (
      <svg viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
      </svg>
    ),
  },
  tree: {
    color: "#7c3aed",
    bg: "bg-violet-500/10",
    border: "border-violet-200/50 dark:border-violet-900/30",
    hoverBg: "hover:bg-violet-500/20",
    mini: "Tree",
    icon: (c) => (
      <svg viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <circle cx="12" cy="5" r="2.5" /><circle cx="6" cy="15" r="2.5" /><circle cx="18" cy="15" r="2.5" /><path d="M10.2 7.2L7.5 12.5" /><path d="M13.8 7.2l2.7 5.3" />
      </svg>
    ),
  },
  graph: {
    color: "#dc2626",
    bg: "bg-red-500/10",
    border: "border-red-200/50 dark:border-red-900/30",
    hoverBg: "hover:bg-red-500/20",
    mini: "Graph",
    icon: (c) => (
      <svg viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <circle cx="5" cy="6" r="2.5" /><circle cx="19" cy="6" r="2.5" /><circle cx="5" cy="18" r="2.5" /><circle cx="19" cy="18" r="2.5" /><path d="M7.5 6h9" /><path d="M5 8.5v7" /><path d="M19 8.5v7" /><path d="M7.5 18h9" /><path d="M7 8l10 8" />
      </svg>
    ),
  },
  dp: {
    color: "#db2777",
    bg: "bg-pink-500/10",
    border: "border-pink-200/50 dark:border-pink-900/30",
    hoverBg: "hover:bg-pink-500/20",
    mini: "DP",
    icon: (c) => (
      <svg viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M9 3v18M15 3v18M3 9h18M3 15h18" />
      </svg>
    ),
  },
};

export default function PracticePage() {
  const { user } = useUser();
  const [search, setSearch] = useState("");
  const [progress, setProgress] = useState({});
  const [mounted, setMounted] = useState(false);
  const [expandedTopics, setExpandedTopics] = useState({});
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [theme, setTheme] = useState("light");
  const [themeMounted, setThemeMounted] = useState(false);

  const carouselRef = useRef(null);

  // Initialize theme and progress
  useEffect(() => {
    setMounted(true);
    const currentTheme = getStoredTheme();
    setTheme(currentTheme);
    applyTheme(currentTheme);
    setThemeMounted(true);

    try {
      const saved = localStorage.getItem("algobuddy_practice_progress");
      if (saved) {
        setProgress(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load practice progress:", e);
    }
  }, []);

  const toggleTheme = () => {
    setTheme((currentTheme) => {
      const resolvedTheme = themeMounted ? currentTheme : getStoredTheme();
      const nextTheme = resolvedTheme === "light" ? "dark" : "light";
      applyTheme(nextTheme);
      setThemeMounted(true);
      return nextTheme;
    });
  };

  // Compute stats
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
      visualizedCount: 97, // mock value as per design
      streak: 12, // mock value as per design
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

  // Filter roadmaps based on search
  const filteredRoadmap = useMemo(() => {
    if (!search.trim()) return practiceData;
    const q = search.trim().toLowerCase();

    return practiceData.map((topic) => {
      const topicMatches = 
        topic.title.toLowerCase().includes(q) || 
        topic.desc.toLowerCase().includes(q);

      const filteredSubsections = topic.subsections.map((sub) => {
        const filteredItems = sub.items.filter((item) => 
          item.name.toLowerCase().includes(q) ||
          (item.theory?.summary && item.theory.summary.toLowerCase().includes(q)) ||
          (item.companies && item.companies.some((c) => c.toLowerCase().includes(q)))
        );
        return { ...sub, items: filteredItems };
      }).filter((sub) => sub.items.length > 0);

      if (topicMatches) {
        return topic;
      } else if (filteredSubsections.length > 0) {
        return { ...topic, subsections: filteredSubsections };
      }
      return null;
    }).filter(Boolean);
  }, [search]);

  // Automatically expand matches during search
  useEffect(() => {
    if (search.trim()) {
      const activeSlugs = {};
      filteredRoadmap.forEach((topic) => {
        activeSlugs[topic.slug] = true;
      });
      setExpandedTopics(activeSlugs);
    }
  }, [search, filteredRoadmap]);

  const toggleAccordion = (slug) => {
    setExpandedTopics((prev) => ({
      ...prev,
      [slug]: !prev[slug],
    }));
  };

  const handleExpandAll = () => {
    const allExpanded = {};
    practiceData.forEach((topic) => {
      allExpanded[topic.slug] = true;
    });
    setExpandedTopics(allExpanded);
  };

  const handleCollapseAll = () => {
    setExpandedTopics({});
  };

  const handleStatusToggle = (problemId, currentStatus) => {
    const nextStatus = currentStatus === "Completed" ? "Not Started" : "Completed";
    const updated = { ...progress, [problemId]: nextStatus };
    setProgress(updated);
    try {
      localStorage.setItem("algobuddy_practice_progress", JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to update status:", e);
    }
  };

  const handleScrollCarousel = (direction) => {
    if (carouselRef.current) {
      const offset = direction === "left" ? -240 : 240;
      carouselRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  const scrollToAccordion = (slug) => {
    setExpandedTopics((prev) => ({ ...prev, [slug]: true }));
    setTimeout(() => {
      const el = document.getElementById(`accordion-${slug}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-neutral-900 text-slate-800 dark:text-neutral-200 transition-colors duration-300 flex">
      {/* ─── Sidebar navigation ────────────────────────────────────────────── */}
      <aside className="hidden md:flex flex-col w-[260px] bg-white dark:bg-[#1a1b1e] border-r border-slate-100 dark:border-neutral-800/80 fixed left-0 top-[72px] bottom-0 z-40 p-5 select-none justify-between">
        <div className="space-y-6">
          <nav className="space-y-1.5">
            {[
              { label: "Home", icon: Home, href: "/" },
              { label: "Visualizer", icon: Play, href: "/visualizer" },
              { label: "Practice", icon: BookOpen, href: "/practice", active: true },
              { label: "Arena", icon: Trophy, href: "/arena" },
              { label: "Bookmarks", icon: Bookmark, href: "#" },
              { label: "Challenges", icon: Zap, href: "#" },
              { label: "Profile", icon: User, href: "#" }
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <Link
                  key={idx}
                  href={item.href}
                  className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm font-semibold transition ${
                    item.active
                      ? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-light"
                      : "text-slate-500 hover:text-slate-800 hover:bg-slate-50 dark:text-neutral-400 dark:hover:text-neutral-200 dark:hover:bg-neutral-800/50"
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="space-y-4">
          {/* Upgrade Card */}
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/10 border border-purple-100 dark:border-purple-900/30 rounded-2xl p-5 text-center">
            <div className="mx-auto w-9 h-9 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 mb-2.5">
              <Crown size={18} />
            </div>
            <h4 className="text-sm font-bold text-slate-850 dark:text-neutral-100">Upgrade to Pro</h4>
            <p className="text-xs text-slate-400 dark:text-neutral-500 mt-1.5 leading-normal">
              Unlock premium features, unlimited visualization & more.
            </p>
            <button className="w-full mt-4 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-bold transition shadow-md shadow-primary/10">
              Upgrade Now
            </button>
          </div>
        </div>
      </aside>

      {/* ─── Main Content ─────────────────────────────────────────────────── */}
      <main className="flex-1 md:pl-[290px] pt-8 pb-16 px-8 max-w-[1400px] mx-auto w-full overflow-hidden">
        {/* Two-Column Top Header Section */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 mb-10 items-start">
          <div>
            <span className="text-xs font-bold text-primary dark:text-purple-400 uppercase tracking-widest block mb-1">
              Practice
            </span>
            <h1 className="text-4xl font-black text-slate-800 dark:text-white leading-tight">
              Master DSA, one problem at a time.
            </h1>
            <p className="text-sm text-slate-400 dark:text-neutral-500 mt-2.5 font-medium">
              Practice structured. Visualize deeply. Solve confidently.
            </p>

            {/* Search inputs */}
            <div className="relative mt-6 max-w-lg">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-neutral-600" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search problems, topics or companies..."
                className="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-850 text-sm text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-neutral-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition shadow-sm"
              />
            </div>
          </div>

          {/* Your Progress Widget */}
          <div className="bg-white dark:bg-[#1a1b1e] border border-slate-100 dark:border-neutral-800/80 rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4.5">
              <h3 className="text-sm font-bold text-slate-850 dark:text-neutral-200 uppercase tracking-wider">
                Your Progress
              </h3>
              <Link href="/arena" className="text-xs font-bold text-primary dark:text-purple-400 hover:underline">
                View Arena →
              </Link>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm border-b border-slate-50 dark:border-neutral-800/50 pb-2.5">
                <span className="text-slate-400 dark:text-neutral-500 font-semibold">Solved Problems</span>
                <span className="text-base font-bold text-slate-800 dark:text-neutral-200">{stats.solved}</span>
              </div>
              <div className="flex justify-between items-center text-sm border-b border-slate-50 dark:border-neutral-800/50 pb-2.5">
                <span className="text-slate-400 dark:text-neutral-500 font-semibold">Visualized</span>
                <span className="text-base font-bold text-slate-800 dark:text-neutral-200">{stats.visualizedCount}</span>
              </div>
              <div className="flex justify-between items-center text-sm border-b border-slate-50 dark:border-neutral-800/50 pb-2.5">
                <span className="text-slate-400 dark:text-neutral-500 font-semibold">Current Streak</span>
                <span className="text-base font-bold text-slate-800 dark:text-neutral-200">{stats.streak} days</span>
              </div>
              <div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400 dark:text-neutral-500 font-semibold">Roadmap Completion</span>
                  <span className="text-base font-bold text-slate-800 dark:text-neutral-200">{stats.pct}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-neutral-800 h-2 rounded-full overflow-hidden mt-2">
                  <div className="bg-primary h-full rounded-full transition-all duration-500" style={{ width: `${stats.pct}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Explore by Topic Section */}
        <section className="mb-10 relative">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-base font-bold text-slate-800 dark:text-white uppercase tracking-wider">
              Explore by Topic
            </h2>
          </div>

          <div className="relative group/carousel">
            <div 
              ref={carouselRef}
              className="flex gap-4 overflow-x-auto pb-4 scroll-smooth snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {practiceData.map((topic) => {
                const t = DS_THEME[topic.slug] || DS_THEME.array;
                const progressInfo = topicStats[topic.slug] || { total: 0, solved: 0, pct: 0 };
                return (
                  <div
                    key={topic.slug}
                    onClick={() => scrollToAccordion(topic.slug)}
                    className="flex-shrink-0 w-[180px] p-5 bg-white dark:bg-[#1a1b1e] border border-slate-100 dark:border-neutral-800/80 rounded-2xl shadow-sm hover:shadow-md cursor-pointer transition select-none snap-start"
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center p-2 mb-3.5 ${t.bg}`}>
                      {t.icon(t.color)}
                    </div>
                    <h3 className="text-sm font-bold text-slate-850 dark:text-white truncate">
                      {topic.title}
                    </h3>
                    <p className="text-xs text-slate-400 dark:text-neutral-500 font-bold mt-1.5">
                      {progressInfo.total} Problems
                    </p>
                    <p className="text-xs text-slate-400 dark:text-neutral-600 font-semibold mt-0.5">
                      {progressInfo.solved} Solved
                    </p>
                    <div className="w-full h-1.5 bg-slate-100 dark:bg-neutral-800 rounded-full overflow-hidden mt-3.5">
                      <div className="h-full rounded-full" style={{ width: `${progressInfo.pct}%`, backgroundColor: t.color }} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Slider arrows */}
            <button
              onClick={() => handleScrollCarousel("left")}
              className="absolute left-[-16px] top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white dark:bg-neutral-800 shadow border border-slate-100 dark:border-neutral-700 flex items-center justify-center cursor-pointer hover:bg-slate-50 opacity-0 group-hover/carousel:opacity-100 transition duration-200 z-10"
            >
              <ChevronRight className="w-4 h-4 rotate-180 text-slate-600 dark:text-neutral-300" />
            </button>
            <button
              onClick={() => handleScrollCarousel("right")}
              className="absolute right-[-16px] top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white dark:bg-neutral-800 shadow border border-slate-100 dark:border-neutral-700 flex items-center justify-center cursor-pointer hover:bg-slate-50 opacity-0 group-hover/carousel:opacity-100 transition duration-200 z-10"
            >
              <ChevronRight className="w-4 h-4 text-slate-600 dark:text-neutral-300" />
            </button>
          </div>
        </section>

        {/* DSA Roadmap Accordions */}
        <section className="space-y-5">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-base font-bold text-slate-800 dark:text-white uppercase tracking-wider">
                DSA Roadmap
              </h2>
              <p className="text-xs text-slate-400 dark:text-neutral-500 font-bold mt-1">
                Structured way to master Data Structures & Algorithms
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleExpandAll}
                className="px-4 py-2 border border-slate-200 dark:border-neutral-800 hover:bg-slate-50 dark:hover:bg-neutral-800/40 rounded-xl text-xs font-semibold transition"
              >
                Expand All
              </button>
              <button
                onClick={handleCollapseAll}
                className="px-4 py-2 border border-slate-200 dark:border-neutral-800 hover:bg-slate-50 dark:hover:bg-neutral-800/40 rounded-xl text-xs font-semibold transition"
              >
                Collapse All
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {filteredRoadmap.map((topic) => {
              const t = DS_THEME[topic.slug] || DS_THEME.array;
              const isExpanded = !!expandedTopics[topic.slug];
              const progressInfo = topicStats[topic.slug] || { total: 0, solved: 0, pct: 0 };

              return (
                <div 
                  key={topic.slug} 
                  id={`accordion-${topic.slug}`}
                  className="border border-slate-100 dark:border-neutral-800/80 rounded-2xl overflow-hidden bg-white dark:bg-[#1a1b1e] shadow-sm transition-all duration-300"
                >
                  {/* Accordion Header */}
                  <div
                    onClick={() => toggleAccordion(topic.slug)}
                    className="w-full flex items-center justify-between p-5 cursor-pointer hover:bg-slate-50/50 dark:hover:bg-neutral-850 select-none"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center p-2 ${t.bg}`}>
                        {t.icon(t.color)}
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-slate-850 dark:text-white flex items-center gap-2">
                          {topic.title}
                          <span className="text-xs font-medium text-slate-400 dark:text-neutral-500">
                            ({progressInfo.total} Problems • {progressInfo.solved} Solved)
                          </span>
                        </h3>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-sm font-bold text-slate-500 dark:text-neutral-400">
                        {progressInfo.pct}%
                      </span>
                      {isExpanded ? (
                        <ChevronUp size={18} className="text-slate-400" />
                      ) : (
                        <ChevronDown size={18} className="text-slate-400" />
                      )}
                    </div>
                  </div>

                  {/* Accordion Table Content */}
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="overflow-hidden border-t border-slate-50 dark:border-neutral-850 bg-white dark:bg-[#1f2023]"
                      >
                        <div className="p-5 overflow-x-auto">
                          <table className="w-full text-left border-collapse min-w-[700px]">
                            <thead>
                              <tr className="bg-slate-50/40 dark:bg-neutral-900/30 text-xs font-bold uppercase text-slate-400 dark:text-neutral-500 border-b border-slate-100 dark:border-neutral-800">
                                <th className="py-3.5 px-5">Problem</th>
                                <th className="py-3.5 px-5 text-center">Difficulty</th>
                                <th className="py-3.5 px-5 text-center">Companies</th>
                                <th className="py-3.5 px-5 text-center">Actions</th>
                                <th className="py-3.5 px-5 text-center">Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {topic.subsections.flatMap((sub) => sub.items).map((item) => {
                                const status = progress[item.id] || "Not Started";
                                const isCompleted = status === "Completed";
                                return (
                                  <tr
                                    key={item.id}
                                    className="border-b border-slate-50 dark:border-neutral-850 hover:bg-slate-50/20 dark:hover:bg-neutral-800/10 transition last:border-0"
                                  >
                                    {/* Problem Name & Desc */}
                                    <td className="py-5 px-5 max-w-sm">
                                      <div className="font-semibold text-sm text-slate-800 dark:text-white">
                                        {item.name}
                                      </div>
                                      {item.theory?.summary && (
                                        <p className="text-xs text-slate-400 dark:text-neutral-500 leading-normal mt-1 line-clamp-2">
                                          {item.theory.summary}
                                        </p>
                                      )}
                                    </td>

                                    {/* Difficulty */}
                                    <td className="py-5 px-5 text-center">
                                      <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full ${
                                        item.difficulty === "Easy"
                                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                          : item.difficulty === "Medium"
                                            ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                                            : "bg-red-500/10 text-red-600 dark:text-red-400"
                                      }`}>
                                        {item.difficulty}
                                      </span>
                                    </td>

                                    {/* Companies */}
                                    <td className="py-5 px-5 text-center">
                                      <div className="flex justify-center">
                                        <CompanyLogos companies={item.companies} />
                                      </div>
                                    </td>

                                    {/* Actions */}
                                    <td className="py-5 px-5 text-center">
                                      <div className="flex items-center justify-center gap-2.5">
                                        {/* View Theory */}
                                        <button
                                          onClick={() => {
                                            setSelectedProblem(item);
                                            setIsDrawerOpen(true);
                                          }}
                                          className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-neutral-700 text-slate-600 dark:text-neutral-300 hover:bg-slate-50 dark:hover:bg-neutral-800 transition shadow-sm"
                                        >
                                          <BookOpen size={12} />
                                          Theory
                                        </button>

                                        {/* Visualize */}
                                        {item.visualizerUrl ? (
                                          <Link
                                            href={item.visualizerUrl}
                                            className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-primary/20 text-primary dark:text-purple-400 hover:bg-primary hover:text-white dark:hover:bg-purple-500 transition shadow-sm"
                                          >
                                            <Play size={12} />
                                            Visualize
                                          </Link>
                                        ) : (
                                          <span className="text-xs text-slate-300 dark:text-neutral-700 font-bold px-3">N/A</span>
                                        )}

                                        {/* Solve */}
                                        <a
                                          href={item.practiceUrl}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 bg-primary text-white hover:bg-primary-dark rounded-lg transition shadow-sm"
                                        >
                                          Solve <ExternalLink size={10} />
                                        </a>
                                      </div>
                                    </td>

                                    {/* Status Interactive Icon */}
                                    <td className="py-5 px-5 text-center">
                                      <button
                                        onClick={() => handleStatusToggle(item.id, status)}
                                        className="focus:outline-none"
                                        title={isCompleted ? "Mark as Incomplete" : "Mark as Completed"}
                                      >
                                        {isCompleted ? (
                                          <CheckCircle2 size={18} className="text-emerald-500 fill-emerald-500/10 hover:scale-110 transition cursor-pointer" />
                                        ) : (
                                          <Circle size={18} className="text-slate-300 dark:text-neutral-700 hover:text-emerald-500 hover:scale-110 transition cursor-pointer" />
                                        )}
                                      </button>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                          <div className="mt-5 text-center">
                            <Link
                              href={`/practice/${topic.slug}`}
                              className="inline-flex items-center gap-1.5 text-sm font-black text-primary dark:text-purple-400 hover:underline"
                            >
                              View All {topic.subsections.flatMap((sub) => sub.items).length} Problems →
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>

        {/* Goals consistent banner at the bottom */}
        <section className="bg-gradient-to-r from-purple-500/5 to-indigo-500/5 dark:from-purple-950/20 dark:to-indigo-950/15 border border-purple-100/40 dark:border-purple-900/30 rounded-3xl p-8 flex flex-col lg:flex-row items-center justify-between gap-6 mt-12">
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white leading-none">
              Stay consistent, see results!
            </h3>
            <p className="text-xs text-slate-400 dark:text-neutral-500 mt-2 font-bold">
              Practice daily, track progress and become DSA Master.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 justify-center">
            {[
              { label: "Daily Goal", value: "4 / 5 Problems", icon: Zap, color: "text-amber-500 bg-amber-500/10" },
              { label: "Weekly Goal", value: "18 / 25 Problems", icon: Calendar, color: "text-blue-500 bg-blue-500/10" },
              { label: "Monthly Goal", value: "72 / 100 Problems", icon: Trophy, color: "text-purple-500 bg-purple-500/10" }
            ].map((goal, idx) => {
              const Icon = goal.icon;
              return (
                <div key={idx} className="bg-white dark:bg-[#1a1b1e] border border-slate-100 dark:border-neutral-800/80 rounded-2xl px-5 py-4 shadow-sm flex items-center gap-3.5 text-left min-w-[190px] select-none">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${goal.color}`}>
                    <Icon size={18} />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 dark:text-neutral-500 block uppercase font-bold tracking-wider">
                      {goal.label}
                    </span>
                    <span className="text-sm font-bold text-slate-850 dark:text-neutral-200 mt-1 block">
                      {goal.value}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* Theory Drawer */}
      <TheoryDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        problem={selectedProblem}
        topicSlug={selectedProblem ? practiceData.find(t => t.subsections.some(s => s.items.some(i => i.id === selectedProblem.id)))?.slug : null}
      />

      <BackToTop />
    </div>
  );
}
