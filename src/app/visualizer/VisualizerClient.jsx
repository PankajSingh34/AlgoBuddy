"use client";
import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiSearch, FiChevronRight, FiBookmark } from "react-icons/fi";
import { useBookmark } from "@/app/hooks/useBookmark";
/* ─── colour + icon theme per DS ─── */
const DS_THEME = {
  Array: {
    color: "#a435f0",
    bg: "#faf5ff",
    border: "#e9d5ff",
    icon: (c) => (
      <svg viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <rect x="3" y="3" width="4" height="18" rx="1" /><rect x="10" y="8" width="4" height="13" rx="1" /><rect x="17" y="5" width="4" height="16" rx="1" />
      </svg>
    ),
  },
  Stack: {
    color: "#2563eb",
    bg: "#eff6ff",
    border: "#bfdbfe",
    icon: (c) => (
      <svg viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <rect x="4" y="2" width="16" height="5" rx="1.5" /><rect x="4" y="9" width="16" height="5" rx="1.5" /><rect x="4" y="16" width="16" height="5" rx="1.5" />
      </svg>
    ),
  },
  Queue: {
    color: "#059669",
    bg: "#f0fdf4",
    border: "#d1fae5",
    icon: (c) => (
      <svg viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <rect x="2" y="7" width="5" height="10" rx="1.5" /><rect x="9.5" y="7" width="5" height="10" rx="1.5" /><rect x="17" y="7" width="5" height="10" rx="1.5" /><path d="M22 12h-1" /><path d="M3 12H2" />
      </svg>
    ),
  },
  "Linked List": {
    color: "#d97706",
    bg: "#fffbeb",
    border: "#fde68a",
    icon: (c) => (
      <svg viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <circle cx="5" cy="12" r="3" /><circle cx="19" cy="12" r="3" /><path d="M8 12h8" /><path d="M14 9l3 3-3 3" />
      </svg>
    ),
  },
  Tree: {
    color: "#7c3aed",
    bg: "#faf5ff",
    border: "#e9d5ff",
    icon: (c) => (
      <svg viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <circle cx="12" cy="5" r="2.5" /><circle cx="6" cy="15" r="2.5" /><circle cx="18" cy="15" r="2.5" /><path d="M10.2 7.2L7.5 12.5" /><path d="M13.8 7.2l2.7 5.3" />
      </svg>
    ),
  },
  Graph: {
    color: "#dc2626",
    bg: "#fef2f2",
    border: "#fecaca",
    icon: (c) => (
      <svg viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <circle cx="5" cy="6" r="2.5" /><circle cx="19" cy="6" r="2.5" /><circle cx="5" cy="18" r="2.5" /><circle cx="19" cy="18" r="2.5" /><path d="M7.5 6h9" /><path d="M5 8.5v7" /><path d="M19 8.5v7" /><path d="M7.5 18h9" /><path d="M7 8l10 8" />
      </svg>
    ),
  },
  HashMap: {
    color: "#db2777",
    bg: "#fdf2f8",
    border: "#fbcfe8",
    icon: (c) => (
      <svg viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <path d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
      </svg>
    ),
  },
  Recursion: {
    color: "#0f766e",
    bg: "#f0fdfa",
    border: "#ccfbf1",
    icon: (c) => (
      <svg viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
      </svg>
    ),
  },
  "AI Algorithms": {
    color: "#0891b2",
    bg: "#ecfeff",
    border: "#c5eaf0",
    icon: (c) => (
      <svg viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <path d="M12 2A4 4 0 0 0 8 6v1H6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2V6a4 4 0 0 0-4-4z" />
        <rect x="9" y="13" width="2" height="2" />
        <rect x="13" y="13" width="2" height="2" />
      </svg>
    ),
  },
};

const getTheme = (t) =>
  DS_THEME[t] || {
    icon: (c) => (
      <svg viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <rect x="3" y="3" width="18" height="18" rx="3" /><path d="M12 8v8" /><path d="M8 12h8" />
      </svg>
    ),
    color: "#6b7280",
    bg: "#f9fafb",
    border: "#e5e7eb",
  };

/* ═══════════════════════════════════════
   Mini Visuals for cards
   ═══════════════════════════════════════ */
function ArrayMiniViz({ color }) {
  const bars = [65, 30, 80, 45, 55, 20, 70];
  const highlight = 2;
  return (
    <div className="flex items-end gap-1 h-[48px]">
      {bars.map((h, i) => (
        <div
          key={i}
          className={`flex-1 rounded-t-sm transition-all ${i === highlight ? '' : 'mini-viz-inactive'}`}
          style={{
            height: `${(h / 80) * 44}px`,
            background: i === highlight ? color : color + "30",
          }}
        />
      ))}
    </div>
  );
}

function StackMiniViz({ color }) {
  const items = ["8", "17", "42"];
  return (
    <div className="flex flex-col gap-1">
      {items.map((v, i) => (
        <div
          key={i}
          className={`h-[14px] rounded text-[10px] font-bold flex items-center justify-center ${i === 0 ? '' : 'mini-viz-inactive'}`}
          style={{
            background: i === 0 ? color : color + "25",
            color: i === 0 ? "#fff" : color,
          }}
        >
          {v}
        </div>
      ))}
    </div>
  );
}

function QueueMiniViz({ color }) {
  const items = ["A", "B", "C", "D"];
  return (
    <div className="flex gap-1 items-center">
      {items.map((v, i) => (
        <div
          key={i}
          className={`w-8 h-8 rounded-md text-[10px] font-bold flex items-center justify-center ${i === 0 ? '' : 'mini-viz-inactive'}`}
          style={{
            background: i === 0 ? color : color + "20",
            color: i === 0 ? "#fff" : color,
          }}
        >
          {v}
        </div>
      ))}
      <span className="text-[10px] font-bold ml-1 mini-viz-arrow" style={{ color }}>
        →
      </span>
    </div>
  );
}

function LinkedListMiniViz({ color }) {
  const nodes = [7, 3, 9, 1];
  return (
    <div className="flex items-center gap-0.5">
      {nodes.map((v, i) => (
        <div key={i} className="flex items-center">
          <div
            className="w-7 h-7 rounded-full text-[10px] font-bold flex items-center justify-center mini-viz-inactive"
            style={{ background: color + "20", color }}
          >
            {v}
          </div>
          {i < nodes.length - 1 && (
            <svg width="12" height="8" className="flex-shrink-0">
              <path d="M0 4 L10 4" stroke={color} strokeWidth="1.5" fill="none" markerEnd="url(#arrowhead)"/>
              <defs>
                <marker id="arrowhead" markerWidth="4" markerHeight="4" refX="4" refY="2" orient="auto">
                  <path d="M0,0 L4,2 L0,4" fill={color} />
                </marker>
              </defs>
            </svg>
          )}
        </div>
      ))}
    </div>
  );
}

function TreeMiniViz({ color }) {
  return (
    <svg viewBox="0 0 80 50" className="w-full h-[48px]">
      <line x1="40" y1="10" x2="20" y2="30" stroke={color + "40"} strokeWidth="1.5" className="mini-viz-line" />
      <line x1="40" y1="10" x2="60" y2="30" stroke={color + "40"} strokeWidth="1.5" className="mini-viz-line" />
      <line x1="20" y1="30" x2="10" y2="45" stroke={color + "40"} strokeWidth="1.5" className="mini-viz-line" />
      <line x1="20" y1="30" x2="30" y2="45" stroke={color + "40"} strokeWidth="1.5" className="mini-viz-line" />
      <circle cx="40" cy="10" r="6" fill={color} />
      <circle cx="20" cy="30" r="5" fill={color + "60"} className="mini-viz-inactive-node" />
      <circle cx="60" cy="30" r="5" fill={color + "60"} className="mini-viz-inactive-node" />
      <circle cx="10" cy="45" r="4" fill={color + "30"} className="mini-viz-inactive-node" />
      <circle cx="30" cy="45" r="4" fill={color + "30"} className="mini-viz-inactive-node" />
    </svg>
  );
}

function GraphMiniViz({ color }) {
  return (
    <svg viewBox="0 0 80 50" className="w-full h-[48px]">
      <line x1="15" y1="15" x2="40" y2="10" stroke={color + "40"} strokeWidth="1.5" className="mini-viz-line" />
      <line x1="40" y1="10" x2="65" y2="18" stroke={color + "40"} strokeWidth="1.5" className="mini-viz-line" />
      <line x1="15" y1="15" x2="25" y2="40" stroke={color + "40"} strokeWidth="1.5" className="mini-viz-line" />
      <line x1="25" y1="40" x2="55" y2="38" stroke={color + "40"} strokeWidth="1.5" className="mini-viz-line" />
      <line x1="65" y1="18" x2="55" y2="38" stroke={color + "40"} strokeWidth="1.5" className="mini-viz-line" />
      <line x1="40" y1="10" x2="25" y2="40" stroke={color + "40"} strokeWidth="1.5" className="mini-viz-line" />
      <circle cx="15" cy="15" r="5" fill={color} />
      <circle cx="40" cy="10" r="5" fill={color + "80"} className="mini-viz-inactive-node" />
      <circle cx="65" cy="18" r="5" fill={color + "60"} className="mini-viz-inactive-node" />
      <circle cx="25" cy="40" r="5" fill={color + "80"} className="mini-viz-inactive-node" />
      <circle cx="55" cy="38" r="5" fill={color} />
    </svg>
  );
}

function HashMapMiniViz({ color }) {
  const buckets = [
    { key: "k1", val: "v1" },
    { key: null, val: null },
    { key: "k2", val: "v2" },
    { key: "k3", val: "v3" }
  ];
  return (
    <div className="flex gap-2 items-center justify-center h-[48px]">
      {buckets.map((b, i) => (
        <div
          key={i}
          className="flex flex-col items-center justify-center border rounded p-1 w-14 h-10 transition-all duration-300"
          style={{
            background: b.key ? color + "15" : "transparent",
            borderColor: b.key ? color + "50" : color + "20",
          }}
        >
          <span className="text-[8px] font-mono" style={{ color: b.key ? color : color + "50" }}>
            [{i}]
          </span>
          {b.key ? (
            <span className="text-[9px] font-bold" style={{ color }}>
              {b.key}:{b.val}
            </span>
          ) : (
            <span className="text-[9px] font-bold text-gray-300 dark:text-gray-600">∅</span>
          )}
        </div>
      ))}
    </div>
  );
}

function RecursionMiniViz({ color }) {
  const frames = ["f(3)", "f(2)", "f(1)"];
  return (
    <div className="flex flex-col gap-1 items-center justify-center h-[48px] w-full">
      {frames.map((v, i) => (
        <div
          key={i}
          className={`h-[12px] rounded text-[8px] font-mono font-bold flex items-center justify-center border transition-all duration-300 ${i === 0 ? '' : 'mini-viz-inactive'}`}
          style={{
            width: `${60 - i * 12}px`,
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


function CustomCodeMiniViz({ color }) {
  const lines = [
    { width: "75%", highlight: true },
    { width: "55%", highlight: false },
    { width: "85%", highlight: false },
    { width: "45%", highlight: false },
  ];
  return (
    <div className="flex flex-col gap-1.5 justify-center h-[48px] px-1">
      {lines.map((l, i) => (
        <div
          key={i}
          className="rounded-sm h-[9px] transition-all duration-300"
          style={{
            width: l.width,
            background: l.highlight ? color : color + "30",
          }}
        />
      ))}
    </div>
  );
}

function AIAlgorithmsMiniViz({ color }) {
  return (
    <svg viewBox="0 0 80 50" className="w-full h-[48px]">
      <circle cx="40" cy="10" r="5" fill={color} />
      <line x1="40" y1="10" x2="25" y2="25" stroke={color} strokeWidth="1.5" opacity="0.4" />
      <line x1="40" y1="10" x2="55" y2="25" stroke={color} strokeWidth="1.5" opacity="0.4" />
      <circle cx="25" cy="25" r="4" fill={color} opacity="0.7" />
      <circle cx="55" cy="25" r="4" fill={color} opacity="0.7" />
      <line x1="25" y1="25" x2="15" y2="40" stroke={color} strokeWidth="1.5" opacity="0.2" />
      <line x1="25" y1="25" x2="35" y2="40" stroke={color} strokeWidth="1.5" opacity="0.2" />
      <circle cx="15" cy="40" r="3" fill={color} opacity="0.4" />
      <circle cx="35" cy="40" r="3" fill={color} opacity="0.4" />
    </svg>
  );
}


const MINI_VIZ = {
  Array: ArrayMiniViz,
  Stack: StackMiniViz,
  Queue: QueueMiniViz,
  "Linked List": LinkedListMiniViz,
  Tree: TreeMiniViz,
  Graph: GraphMiniViz,
  HashMap: HashMapMiniViz,
  Recursion: RecursionMiniViz,
  "Code Lab": CustomCodeMiniViz,
  "AI Algorithms": AIAlgorithmsMiniViz,
};

/* ═══════════════════════════════════════
   DS Card — homepage-style window card
   ═══════════════════════════════════════ */
function DSCard({ section, theme, delay }) {
  const MiniViz = MINI_VIZ[section.title];
  const count = section.subsections
    ? section.subsections.reduce((a, s) => a + s.items.length, 0)
    : 0;
  const href = `/visualizer/${section.slug}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6, scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      className="group w-full h-full"
    >
      <Link href={href} className="block w-full h-full text-left cursor-pointer">
        <div
          className="rounded-2xl border overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col"
          style={{ borderColor: theme.border }}
          data-theme-card={section.title || "Custom Code"}
        >
          {/* title bar */}
          <div
            className="flex items-center gap-2 px-4 py-3 border-b transition-colors duration-300"
            style={{ background: theme.bg, borderColor: theme.border }}
            data-theme-header={section.title || "Custom Code"}
          >
            <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <span className="w-3 h-3 rounded-full bg-[#28c840]" />
            <span className="ml-2 text-[12px] font-mono text-surface-500 dark:text-surface-300">
              {section.title.toLowerCase().replace(/\s/g, "")}.js
            </span>
          </div>

          {/* card body */}
          <div
            className="p-5 bg-white transition-colors duration-300 flex-1 flex flex-col"
            data-theme-card={section.title || "Custom Code"}
          >
            {/* icon + title */}
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center p-2 flex-shrink-0 transition-colors duration-300"
                style={{ background: theme.bg }}
                data-theme-header={section.title || "Custom Code"}
              >
                {theme.icon(theme.color)}
              </div>
              <div>
                <h3 className="text-[18px] font-extrabold text-surface-900 dark:text-white transition-colors">
                  {section.title}
                </h3>
                <p className="text-[12px] text-surface-500 dark:text-surface-400 font-medium transition-colors">
                  {count} algorithm{count !== 1 ? "s" : ""} to explore
                </p>
              </div>
            </div>

            {/* description */}
            <p className="text-[13px] text-surface-600 dark:text-surface-300 leading-relaxed mb-4 transition-colors">
              {section.desc}
            </p>

            {/* mini visualization */}
            {MiniViz && (
              <div
                className="rounded-lg p-3 mb-4 border transition-colors duration-300"
                style={{ background: theme.bg, borderColor: theme.border }}
                data-theme-header={section.title || "Custom Code"}
              >
                <MiniViz color={theme.color} />
              </div>
            )}

            {/* CTA pill */}
            <div
              className="mt-auto inline-flex items-center gap-2 h-[36px] px-5 rounded-full text-[13px] font-bold text-white
                group-hover:gap-3 transition-all duration-200"
              style={{ background: theme.color }}
            >
              Explore {section.title}
              <FiChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

/* ═══════════════════════════════════════
   Main Client Component — Grid only
   ═══════════════════════════════════════ */
export default function VisualizerClient({ initialSections }) {
  const [search, setSearch] = useState("");
  const { addBookmark, removeBookmark, isBookmarked } = useBookmark();
const searchRef = useRef(null);
const [searchHistory, setSearchHistory] = useState(() => {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem("algobuddy_search_history") || "[]");
  } catch { return []; }
});
const [showHistory, setShowHistory] = useState(false);

// Keyboard shortcut Ctrl+K or /
useEffect(() => {
  const handleKeyDown = (e) => {
    if ((e.ctrlKey && e.key === "k") || e.key === "/") {
      e.preventDefault();
      searchRef.current?.focus();
      setShowHistory(true);
    }
    if (e.key === "Escape") {
      searchRef.current?.blur();
      setShowHistory(false);
    }
  };
  window.addEventListener("keydown", handleKeyDown);
  return () => window.removeEventListener("keydown", handleKeyDown);
}, []);

// Save search history
const handleSearchChange = (e) => {
  const val = e.target.value;
  setSearch(val);
  if (val.trim().length > 2) {
    setSearchHistory((prev) => {
      const updated = [val, ...prev.filter((h) => h !== val)].slice(0, 5);
      localStorage.setItem("algobuddy_search_history", JSON.stringify(updated));
      return updated;
    });
  }
};
  const filtered = useMemo(() => {
    if (!search.trim()) return initialSections;
    const q = search.toLowerCase();
    return initialSections
      .map((sec) => {
        const titleHit = sec.title.toLowerCase().includes(q);
        const subs = sec.subsections
          ?.map((sub) => {
            const subHit = sub.title.toLowerCase().includes(q);
            const items = sub.items.filter((i) => i.name.toLowerCase().includes(q));
            return { ...sub, items: subHit ? sub.items : items };
          })
          .filter((sub) => sub.items.length > 0);
        return { ...sec, subsections: subs, _hit: titleHit || (subs && subs.length > 0) };
      })
      .filter((s) => s._hit);
  }, [search, initialSections]);

  const flatResults = useMemo(() => {
    if (!search.trim()) return [];
    const q = search.toLowerCase();
    const r = [];
    initialSections.forEach((sec) =>
      sec.subsections?.forEach((sub) =>
        sub.items.forEach((item) => {
          if (item.name.toLowerCase().includes(q)) r.push({ ...item, ds: sec.title });
        }),
      ),
    );
    return r;
  }, [search, initialSections]);

  return (
    <div>
      <style>{`
        .dark [data-theme-card="Code Lab"] { background: #2d2f31 !important; border-color: #4b5563 !important; }
        .dark [data-theme-card="Array"] { background: #1a0e2d !important; border-color: #5b21b6 !important; }
        .dark [data-theme-card="Stack"] { background: #111d33 !important; border-color: #1e3a8a !important; }
        .dark [data-theme-card="Queue"] { background: #122b19 !important; border-color: #166534 !important; }
        .dark [data-theme-card="Linked List"] { background: #2b1a08 !important; border-color: #92400e !important; }
        .dark [data-theme-card="Tree"] { background: #1a0e2d !important; border-color: #5b21b6 !important; }
        .dark [data-theme-card="Graph"] { background: #2c1215 !important; border-color: #991b1b !important; }
        .dark [data-theme-card="HashMap"] { background: #2e1022 !important; border-color: #9d174d !important; }
        .dark [data-theme-card="Recursion"] { background: #0c231e !important; border-color: #115e59 !important; }
        .dark [data-theme-card="AI Algorithms"] { background: #062d35 !important; border-color: #0891b2 !important; }
        .dark [data-theme-header="Code Lab"] { background: #3e4143 !important; border-color: #4b5563 !important; }
        .dark [data-theme-header="Array"] { background: #23133d !important; border-color: #5b21b6 !important; }
        .dark [data-theme-header="Stack"] { background: #182847 !important; border-color: #1e3a8a !important; }
        .dark [data-theme-header="Queue"] { background: #173820 !important; border-color: #166534 !important; }
        .dark [data-theme-header="Linked List"] { background: #3d240a !important; border-color: #92400e !important; }
        .dark [data-theme-header="Tree"] { background: #23133d !important; border-color: #5b21b6 !important; }
        .dark [data-theme-header="Graph"] { background: #3d171b !important; border-color: #991b1b !important; }
        .dark [data-theme-header="HashMap"] { background: #3b132b !important; border-color: #9d174d !important; }
        .dark [data-theme-header="Recursion"] { background: #0f3129 !important; border-color: #115e59 !important; }
        .dark [data-theme-header="AI Algorithms"] { background: #0a3d47 !important; border-color: #0891b2 !important; }
        .dark [data-theme-card="Array"] .mini-viz-inactive { background: #5b21b6 !important; }
        .dark [data-theme-card="Stack"] .mini-viz-inactive { background: #1e3a8a !important; color: #93c5fd !important; }
        .dark [data-theme-card="Queue"] .mini-viz-inactive { background: #166534 !important; color: #86efac !important; }
        .dark [data-theme-card="Queue"] .mini-viz-arrow { color: #86efac !important; }
        .dark [data-theme-card="Linked List"] .mini-viz-inactive { background: #92400e !important; color: #fcd34d !important; }
        .dark [data-theme-card="Tree"] .mini-viz-inactive-node { fill: #5b21b6 !important; }
        .dark [data-theme-card="Graph"] .mini-viz-inactive-node { fill: #991b1b !important; }
        .dark [data-theme-card="Recursion"] .mini-viz-inactive { background: #115e59 !important; color: #99f6e4 !important; border-color: #115e59 !important; }
        .dark .mini-viz-line { stroke: #4b5563 !important; }
      `}</style>

      <section className="px-5 pt-12 pb-20 min-h-screen bg-gradient-to-b from-white via-surface-50 to-purple-50/40 dark:bg-none dark:bg-[#1c1d1f] transition-colors duration-300">
        <div className="max-w-[1100px] mx-auto">
          

          <div className="relative max-w-[480px] mx-auto mt-8 mb-14">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9ca3af]" />
            <input
              type="text"
              ref={searchRef}
value={search}
onChange={handleSearchChange}
onFocus={() => setShowHistory(true)}
onBlur={() => setTimeout(() => setShowHistory(false), 200)}
placeholder="Search algorithms... (Press / or Ctrl+K)"
              className="w-full h-[52px] pl-12 pr-4 rounded-2xl border border-[#e5e7eb] dark:border-[#333] bg-white dark:bg-[#1a1a1a] text-[#1a1a1a] dark:text-white placeholder-[#9ca3af] text-[15px] shadow-sm focus:outline-none focus:border-[#a435f0] focus:ring-2 focus:ring-[#a435f0]/20 transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#1a1a1a] dark:hover:text-white transition-colors"
              >
                x
              </button>
            )}
          </div>

          {search.trim() ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}>
              {flatResults.length > 0 ? (
                <div className="max-w-3xl mx-auto">
                  <p className="text-[13px] font-bold text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-5">
                    {flatResults.length} result{flatResults.length !== 1 ? "s" : ""}
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {flatResults.map((item, i) => {
                      const t = getTheme(item.ds);
                      return (
                        <Link
                          key={i}
                          href={item.path}
                          className="group/r flex items-center gap-3 p-4 rounded-xl bg-white dark:bg-[#2d2f31] border dark:border-[#4b5563] hover:shadow-md transition-all duration-200"
                          style={{ borderColor: t.border }}
                        >
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center p-1.5 flex-shrink-0"
                            style={{ background: t.bg }}
                            data-theme-header={item.ds}
                          >
                            {t.icon(t.color)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-[14px] font-semibold text-surface-900 dark:text-white group-hover/r:text-primary transition-colors">{item.name}</span>
                            <span className="block text-[11px] text-surface-500 dark:text-surface-400">{item.ds}</span>
                          </div>
                          <button
  onClick={(e) => {
    e.preventDefault();
    isBookmarked(item.path)
      ? removeBookmark(item.path)
      : addBookmark({ name: item.name, path: item.path, category: item.ds });
  }}
  className="p-1 rounded hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
>
  <FiBookmark
    className={`w-4 h-4 ${isBookmarked(item.path) ? "text-purple-500 fill-purple-500" : "text-surface-300"}`}
  />
</button>
                          <FiChevronRight className="w-4 h-4 text-surface-300 dark:text-surface-500 group-hover/r:translate-x-1 transition-all" />
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-surface-100 dark:bg-surface-800">
                    <FiSearch className="h-6 w-6 text-surface-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-surface-900 dark:text-white mb-2">No results found</h3>
                  <p className="text-surface-500 dark:text-surface-400 text-[15px]">Try a different search term</p>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
                {filtered.map((section, i) => (
                  <DSCard
                    key={section.title}
                    section={section}
                    theme={getTheme(section.title)}
                    delay={i * 0.07}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
