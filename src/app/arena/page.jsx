"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useUser } from "@/features/user/UserContext";
import { toast } from "react-hot-toast";
import UpcomingTournament from "@/app/components/ui/UpcomingTournament";
import MatchmakingModal from "@/app/components/ui/MatchmakingModal";
import DuelSimulatorModal from "@/app/components/ui/DuelSimulatorModal";
import CreateDuelModal from "@/app/components/ui/CreateDuelModal";
import BackToTop from "@/app/components/ui/backtotop";
import Footer from "@/app/components/footer";
import {
  Home,
  Swords,
  Trophy,
  Flame,
  Shield,
  Activity,
  Award,
  History,
  User,
  Clock,
  Zap,
  Play,
  ChevronRight,
  TrendingUp,
  Target
} from "lucide-react";
import { useArenaProfile } from "@/app/hooks/useArenaProfile";
import { useSheetProgress } from "@/app/hooks/useSheetProgress";

// Mock recent battle data
const RECENT_BATTLES = [
  { id: "rb1", opponent: "Rahul", result: "Victory", topic: "Two Pointers", date: "12 May, 2024", xp: "+35 XP", rating: "+20 Rating" },
  { id: "rb2", opponent: "Ananya", result: "Defeat", topic: "Binary Search", date: "10 May, 2024", xp: "+5 XP", rating: "-12 Rating" },
  { id: "rb3", opponent: "Aryan", result: "Victory", topic: "Graphs (BFS)", date: "08 May, 2024", xp: "+40 XP", rating: "+25 Rating" }
];

// Mock live battles feed
const LIVE_BATTLES = [
  { id: "l1", p1: "Pankaj", p2: "Rahul", topic: "Two Sum", time: "03:24", difficulty: "Medium", color: "orange" },
  { id: "l2", p2: "Rohit", p1: "Ananya", topic: "Binary Search", time: "05:12", difficulty: "Easy", color: "green" },
  { id: "l3", p1: "Aditya", p2: "Aryan", topic: "N-Queens", time: "08:45", difficulty: "Hard", color: "red" }
];

// Mock leaderboard
const LEADERBOARD_ROWS = [
  { rank: 1, name: "Aryan", rating: 2450 },
  { rank: 2, name: "Pankaj", rating: 2320 },
  { rank: 3, name: "Aditya", rating: 2200 },
  { rank: 4, name: "Rahul", rating: 2130 },
  { rank: 5, name: "Ananya", rating: 2105 },
];

const LEARNING_RECOMMENDATIONS = [
  {
    topic: "Binary Search Tree",
    reason: "Recommended after mastering Binary Search",
    color: "purple"
  },
  {
    topic: "Graph Traversal (BFS)",
    reason: "Next logical step after Tree Traversal",
    color: "blue"
  },
  {
    topic: "Dynamic Programming Basics",
    reason: "Suggested from your recent activity",
    color: "green"
  }
];

const LEARNING_TIMELINE = [
  {
    title: "Arrays Module Completed",
    date: "12 May 2026",
    color: "bg-purple-500",
  },
  {
    title: "7-Day Learning Streak",
    date: "18 May 2026",
    color: "bg-green-500",
  },
  {
    title: "Binary Search Master Badge",
    date: "25 May 2026",
    color: "bg-yellow-500",
  },
  {
    title: "100 Problems Solved",
    date: "01 June 2026",
    color: "bg-blue-500",
  },
];

const ACHIEVEMENT_BADGES = [
  { title: "Module Master", icon: "🏆" },
  { title: "7-Day Streak", icon: "🔥" },
  { title: "Community Helper", icon: "🤝" },
  { title: "Arena Champion", icon: "⚔️" },
];

const LEARNING_GOALS = {
  weekly: {
    completed: 8,
    target: 10,
  },
  monthly: {
    completed: 32,
    target: 50,
  },
};

function getInitials(name) {
  if (!name) return "??";
  const cleanName = name.includes("@") ? name.split("@")[0] : name;
  const parts = cleanName.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return parts[0].slice(0, 2).toUpperCase();
}

export default function ArenaPage() {
  const { user, loading } = useUser();
  const router = useRouter();
  const { profile, leaderboard, matchHistory, dailyChallenge, loadingProfile, loadingLeaderboard } = useArenaProfile(user);
  const { streakData } = useSheetProgress();


  const ensureLoggedIn = () => {
    if (!user) {
      toast.error("Please login to use this feature!");
      router.push("/login");
      return false;
    }
    return true;
  };

  const [activeTab, setActiveTab] = useState("home"); // home, live, ranked, friend, leaderboard, streak, tournaments, badges, history

  const handleTabChange = (tabId) => {
    if (["ranked", "friend", "streak", "badges", "history"].includes(tabId)) {
      if (!ensureLoggedIn()) return;
    }
    if (typeof window !== "undefined") {
      window.location.hash = tabId === "home" ? "" : tabId;
    }
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      const validTabs = ["home", "live", "ranked", "friend", "leaderboard", "streak", "tournaments", "badges", "history"];
      const protectedTabs = ["ranked", "friend", "streak", "badges", "history"];
      
      if (validTabs.includes(hash)) {
        if (protectedTabs.includes(hash) && !user) {
          if (typeof window !== "undefined") {
            window.location.hash = "";
          }
          setActiveTab("home");
          return;
        }
        setActiveTab(hash);
      } else {
        setActiveTab("home");
      }
    };

    handleHashChange();

    window.addEventListener("hashchange", handleHashChange);
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, [user]);

  // Modals state
  const [matchmakingOpen, setMatchmakingOpen] = useState(false);
  const [createDuelOpen, setCreateDuelOpen] = useState(false);
  const [duelSimulatorOpen, setDuelSimulatorOpen] = useState(false);
  const [selectedOpponent, setSelectedOpponent] = useState(null);
  const [activeDuelProblem, setActiveDuelProblem] = useState("Reverse Linked List");
  const [showXPWidget, setShowXPWidget] = useState(true);

   useEffect(() => {
  if (typeof window !== "undefined") {
    localStorage.setItem(
      "arena-show-xp-widget",
      JSON.stringify(showXPWidget)
    );
  }
}, [showXPWidget]);

  const [currentUserStats, setCurrentUserStats] = useState({
    name: "Pankaj Singh",
    level: 1,
    rating: 1200,
    xp: 0,
    rank: 1,
  });

  useEffect(() => {
    if (!loading && user) {
      setCurrentUserStats({
        userId: user.id,
        name: user.user_metadata?.name || user.email.split("@")[0],
        level: profile?.level || 1,
        rating: profile?.rating || 1200,
        xp: profile?.xp || 0,
        rank: profile?.rank || 1,
      });
    }
  }, [user, loading, profile]);

  const handleMatchFound = (opponent) => {
    setSelectedOpponent(opponent);
    setMatchmakingOpen(false);
    setActiveDuelProblem("Two Sum");
    setDuelSimulatorOpen(true);
  };

  const handleWatchLive = (p1, p2, topic) => {
    setSelectedOpponent({ name: p2, rating: 2100, level: 15, avatar: p2.slice(0, 2).toUpperCase() });
    setActiveDuelProblem(topic);
    setDuelSimulatorOpen(true);
  };

  const handleCreateMatchLaunch = (matchConfig) => {
    setCreateDuelOpen(false);
    setSelectedOpponent({ name: "Opponent", rating: 1600, level: 15, avatar: "OP" });
    setActiveDuelProblem(matchConfig.topic);
    setDuelSimulatorOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-neutral-900">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <section className="bg-slate-50/50 dark:bg-neutral-900 min-h-screen text-slate-800 dark:text-neutral-200">
      <div className="max-w-[1400px] mx-auto px-4 pt-8 pb-16">
        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr_300px] gap-6">

          {/* ─── Column 1: Left Sidebar ────────────────────────────────────────── */}
          <aside className="space-y-6">
            {/* Navigation Menu */}
            <div className="bg-white dark:bg-neutral-800 border border-slate-100 dark:border-neutral-800/80 rounded-2xl p-4 shadow-sm">
              <nav className="space-y-1">
                {[
                  { id: "home", label: "Arena Home", icon: Home },
                  { id: "live", label: "Live Battles", icon: Swords },
                  { id: "ranked", label: "Ranked Match", icon: Trophy },
                  { id: "friend", label: "Friend Challenge", icon: User },
                  { id: "leaderboard", label: "Leaderboard", icon: Activity },
                  { id: "streak", label: "Daily Streak", icon: Flame },
                  { id: "tournaments", label: "Tournaments", icon: Trophy },
                  { id: "badges", label: "Badges", icon: Award },
                  { id: "history", label: "Match History", icon: History }
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleTabChange(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition ${isActive
                          ? "bg-primary text-white shadow-sm"
                          : "text-slate-500 hover:text-slate-800 hover:bg-slate-50 dark:text-neutral-400 dark:hover:text-neutral-200 dark:hover:bg-neutral-900/40"
                        }`}
                    >
                      <Icon size={18} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Rank Card */}
            <div className="bg-white dark:bg-neutral-800 border border-slate-100 dark:border-neutral-800/80 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 bg-primary/10 text-primary dark:text-purple-400 rounded-xl">
                  <Shield size={20} />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 dark:text-neutral-500 uppercase tracking-widest font-bold">
                    Current Rank
                  </span>
                  <div className="text-lg font-extrabold text-slate-800 dark:text-neutral-100 flex items-center gap-1.5 leading-none mt-0.5">
                    #{currentUserStats.rank}
                    <span className="text-xs text-emerald-500 font-semibold flex items-center">
                      ▲ 12
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-slate-100 dark:border-neutral-800/60 pt-4 mb-4 text-center">
                <div>
                  <span className="text-[10px] text-slate-400 dark:text-neutral-500 block uppercase font-medium">Rating</span>
                  <span className="text-base font-bold text-slate-850 dark:text-neutral-200">{currentUserStats.rating}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 dark:text-neutral-500 block uppercase font-medium">XP</span>
                  <span className="text-base font-bold text-slate-850 dark:text-neutral-200">{currentUserStats.xp}</span>
                </div>
              </div>

              <div className="space-y-1 mb-4">
                <div className="flex justify-between text-[10px] text-slate-400 dark:text-neutral-500">
                  <span>Next Rank: +180 XP</span>
                  <span>{currentUserStats.xp % 1000}/1000</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-neutral-900 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-primary h-full rounded-full" style={{ width: `${(currentUserStats.xp % 1000) / 10}%` }} />
                </div>
              </div>

              <button
                onClick={() => {
                  if (!ensureLoggedIn()) return;
                  setMatchmakingOpen(true);
                }}
                className="w-full py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-bold transition shadow-md shadow-primary/10"
              >
                Find Match
              </button>
            </div>
          </aside>

          {/* ─── Column 2: Main Panel ───────────────────────────────────────────── */}
          <main className="space-y-6 overflow-hidden">
            {activeTab === "home" && (
              <>
                {/* Hero Podium Card */}
                <div className="bg-gradient-to-br from-[#1c1d2c] to-[#0f0f18] rounded-3xl p-6 relative overflow-hidden text-white flex flex-col md:flex-row items-center justify-between border border-slate-900">
                  <div className="space-y-4 max-w-sm z-10 text-center md:text-left mb-6 md:mb-0">
                    <span className="text-[10px] bg-primary/20 text-primary-light border border-primary/30 font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                      Welcome to Arena
                    </span>
                    <h2 className="text-2xl font-extrabold tracking-tight">
                      Compete. Learn. <span className="text-primary-light">Climb.</span>
                    </h2>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Challenge developers in real-time DSA battles, climb the leaderboard and become the best.
                    </p>
                    <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                      <button
                        onClick={() => {
                          if (!ensureLoggedIn()) return;
                          setMatchmakingOpen(true);
                        }}
                        className="px-5 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
                      >
                        <Zap size={14} />
                        Find Match
                      </button>
                      <button
                        onClick={() => {
                          if (!ensureLoggedIn()) return;
                          setCreateDuelOpen(true);
                        }}
                        className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
                      >
                        <Swords size={14} />
                        Create Duel
                      </button>
                    </div>
                  </div>

                  {/* Top 3 Avatars Podium Graphic */}
                  <div className="flex gap-4 items-end pr-2 select-none">
                    {/* 2nd Place (Logged in User) */}
                    <div className="flex flex-col items-center mt-6">
                      <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center font-bold text-xs shadow border-2 border-slate-600 mb-1.5 overflow-hidden">
                        {leaderboard[1] ? (
                          <div className="w-full h-full bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-light flex items-center justify-center text-xs font-bold">
                            {getInitials(leaderboard[1]?.name || `User ${leaderboard[1]?.userId.substring(0,4)}`)}
                          </div>
                        ) : (
                          <div className="w-full h-full bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-light flex items-center justify-center text-xs font-bold">
                            {(currentUserStats.name || "Pankaj").split(" ")[0].substring(0,2).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-300 block font-semibold mb-1 truncate max-w-[64px]">
                        {leaderboard[1] ? (leaderboard[1]?.name || `User ${leaderboard[1]?.userId.substring(0,4)}`) : (currentUserStats.name || "Pankaj").split(" ")[0]}
                      </span>
                      <span className="text-[9px] text-slate-400 block mb-2">{leaderboard[1] ? leaderboard[1].xp : currentUserStats.xp || 2320} XP</span>
                      <div className="w-14 h-12 bg-slate-800 border-t border-slate-700 rounded-t-lg flex items-center justify-center font-bold text-slate-400 shadow-lg text-lg">
                        2
                      </div>
                    </div>

                    {/* 1st Place */}
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center font-bold text-sm shadow-md border-2 border-amber-400 mb-1.5 overflow-hidden">
                        {leaderboard[0] ? (
                           <div className="w-full h-full text-white flex items-center justify-center text-sm font-bold">
                             {getInitials(leaderboard[0]?.name || `User ${leaderboard[0]?.userId.substring(0,4)}`)}
                           </div>
                        ) : (
                           <span className="text-white">AY</span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-200 block font-bold mb-1">{leaderboard[0] ? (leaderboard[0]?.name || `User ${leaderboard[0]?.userId.substring(0,4)}`) : "Aryan"}</span>
                      <span className="text-[9px] text-amber-300 block mb-2">{leaderboard[0] ? leaderboard[0].xp : 2450} XP</span>
                      <div className="w-16 h-20 bg-primary border-t border-primary-light rounded-t-lg flex items-center justify-center font-extrabold text-white shadow-lg text-2xl">
                        1
                      </div>
                    </div>

                    {/* 3rd Place */}
                    <div className="flex flex-col items-center mt-8">
                      <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center font-bold text-xs shadow border-2 border-purple-500 mb-1.5 overflow-hidden">
                        {leaderboard[2] ? (
                           <div className="w-full h-full text-white flex items-center justify-center text-xs font-bold">
                             {getInitials(leaderboard[2]?.name || `User ${leaderboard[2]?.userId.substring(0,4)}`)}
                           </div>
                        ) : (
                           <span className="text-white">AD</span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-300 block font-semibold mb-1">{leaderboard[2] ? (leaderboard[2]?.name || `User ${leaderboard[2]?.userId.substring(0,4)}`) : "Aditya"}</span>
                      <span className="text-[9px] text-slate-400 block mb-2">{leaderboard[2] ? leaderboard[2].xp : 2200} XP</span>
                      <div className="w-14 h-12 bg-slate-800 border-t border-slate-700 rounded-t-lg flex items-center justify-center font-bold text-slate-400 shadow-lg text-lg">
                        3
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sub-grid 1: Live Battles & Today's Challenge */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Live Battles */}
                  <div className="bg-white dark:bg-neutral-800 border border-slate-100 dark:border-neutral-800/80 rounded-2xl p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2 shrink-0">
                        <h3 className="text-sm font-bold text-slate-800 dark:text-neutral-200 shrink-0">Live Battles</h3>
                        <span className="ml-1 px-2 py-0.5 rounded-full bg-red-500 text-white text-[9px] font-extrabold uppercase animate-pulse shrink-0">
                          Live
                        </span>
                      </div>
                      <span
                        onClick={() => handleTabChange("live")}
                        className="text-xs text-primary dark:text-purple-400 font-semibold cursor-pointer hover:underline"
                      >
                        View All
                      </span>
                    </div>

                    <div className="space-y-3">
                      {LIVE_BATTLES.slice(0, 2).map((b) => (
                        <div key={b.id} className="flex items-center justify-between p-3 border border-slate-100 dark:border-neutral-900/60 bg-slate-50/20 dark:bg-neutral-900/20 rounded-xl gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1.5">
                              <span className="text-xs font-bold text-slate-700 dark:text-neutral-300 truncate">
                                {b.p1} vs {b.p2}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 text-[10px] text-slate-400 dark:text-neutral-500">
                              <span className="flex items-center gap-1">
                                <Clock size={10} />
                                {b.time}
                              </span>
                              <span className="flex items-center gap-1">
                                <span className={`w-1.5 h-1.5 rounded-full ${b.color === "green" ? "bg-green-500" : "bg-amber-500"
                                  }`} />
                                {b.topic} ({b.difficulty})
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => handleWatchLive(b.p1, b.p2, b.topic)}
                            className="px-3 py-1.5 border border-primary/20 dark:border-purple-500/20 text-primary dark:text-purple-400 hover:bg-primary hover:text-white dark:hover:bg-purple-500 rounded-lg text-xs font-bold transition shrink-0"
                          >
                            Watch Live
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Today's Challenge */}
                  <div className="bg-white dark:bg-neutral-800 border border-slate-100 dark:border-neutral-800/80 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-sm font-bold text-slate-800 dark:text-neutral-200">Today's Challenge</h3>
                        <span className="text-xs text-slate-400 dark:text-neutral-500 font-semibold cursor-default">
                          Daily
                        </span>
                      </div>

                      <div className="flex gap-3.5 items-start p-3 bg-slate-50/50 dark:bg-neutral-900/30 border border-slate-100 dark:border-neutral-800/40 rounded-xl mb-3">
                        <div className="p-2.5 bg-primary/10 text-primary dark:text-purple-400 rounded-lg shrink-0 font-mono text-sm font-extrabold">
                          &lt;/&gt;
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <h4 className="text-sm font-bold text-slate-800 dark:text-neutral-100 truncate">
                              {dailyChallenge ? dailyChallenge.title : "Reverse Linked List"}
                            </h4>
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                              (dailyChallenge ? dailyChallenge.difficulty : "Easy") === "Easy" ? "bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400" :
                              (dailyChallenge ? dailyChallenge.difficulty : "Easy") === "Medium" ? "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400" :
                              "bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400"
                            }`}>
                              {dailyChallenge ? dailyChallenge.difficulty : "Easy"}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 dark:text-neutral-500 leading-normal truncate">
                            {dailyChallenge ? dailyChallenge.description : "Reverse a singly linked list."}
                          </p>
                          <div className="text-[10px] text-primary dark:text-purple-400 font-semibold mt-1">
                            Reward: +{dailyChallenge ? dailyChallenge.xpAward : 50} XP
                          </div>
                        </div>
                      </div>
                    </div>

                    <Link
                      href="/practice"
                      className="w-full py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-bold text-center transition block shadow-md shadow-primary/10"
                    >
                      Solve Now
                    </Link>
                  </div>
                </div>

                {/* Sub-grid 2: Global Leaderboard & Upcoming Tournament */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Leaderboard Table */}
                  <div className="bg-white dark:bg-neutral-800 border border-slate-100 dark:border-neutral-800/80 rounded-2xl p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-bold text-slate-800 dark:text-neutral-200">Global Leaderboard</h3>
                      <span
                        onClick={() => handleTabChange("leaderboard")}
                        className="text-xs text-primary dark:text-purple-400 font-semibold cursor-pointer hover:underline"
                      >
                        View All
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {(leaderboard.length > 0 ? leaderboard : LEADERBOARD_ROWS).map((row, idx) => {
                        const rank = row.rank || idx + 1;
                        const name = row.name || (row.userId ? `User ${row.userId.substring(0,4)}` : "Unknown");
                        return (
                          <div key={rank} className="flex items-center justify-between text-xs px-2 py-1.5 border-b border-slate-50 dark:border-neutral-800 last:border-0">
                            <div className="flex items-center gap-3">
                              <span className={`w-5 text-center font-bold ${rank === 1 ? "text-amber-500" : rank === 2 ? "text-slate-400" : "text-slate-500"
                                }`}>
                                {rank}
                              </span>
                              <span className="font-semibold text-slate-850 dark:text-neutral-200">{name}</span>
                            </div>
                            <span className="font-bold text-slate-800 dark:text-neutral-300">{row.rating}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Tournament Component */}
                  <UpcomingTournament />
                </div>

                {/* Recent Battles */}
                <div className="bg-white dark:bg-neutral-800 border border-slate-100 dark:border-neutral-800/80 rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-slate-800 dark:text-neutral-200">Recent Battles</h3>
                    <span
                      onClick={() => handleTabChange("history")}
                      className="text-xs text-primary dark:text-purple-400 font-semibold cursor-pointer hover:underline"
                    >
                      View All
                    </span>
                  </div>

                  <div className="space-y-3">
                    {(matchHistory?.length > 0 ? matchHistory : RECENT_BATTLES).map((b) => {
                      const isMock = !b.id || typeof b.id === 'string' && !b.id.includes('-'); // Rough check for UUID vs mock id
                      const opponentName = isMock ? b.opponent : b.opponentName;
                      const topic = isMock ? b.topic : b.topic;
                      const date = isMock ? b.date : new Date(b.startTime).toLocaleDateString();
                      const result = isMock ? b.result : b.result;
                      const xpAwarded = isMock ? b.xp : `+${b.xpAwarded} XP`;
                      const ratingChange = isMock ? b.rating : (b.ratingChange >= 0 ? `+${b.ratingChange} Rating` : `${b.ratingChange} Rating`);

                      return (
                      <div key={b.id} className="flex items-center justify-between p-3.5 border border-slate-100 dark:border-neutral-900/60 bg-slate-50/20 dark:bg-neutral-900/20 rounded-xl gap-4 text-xs">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-slate-700 dark:text-neutral-300 truncate">
                              You vs {opponentName}
                            </span>
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${result === "Victory"
                                ? "bg-emerald-500/10 text-emerald-500"
                                : result === "Defeat" ? "bg-red-500/10 text-red-500" : "bg-slate-500/10 text-slate-500"
                              }`}>
                              {result}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-[10px] text-slate-400 dark:text-neutral-500">
                            <span>Topic: {topic}</span>
                            <span>{date}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-right shrink-0">
                            <span className="font-semibold text-primary dark:text-purple-400 block">{xpAwarded}</span>
                            <span className={`text-[10px] font-bold ${ratingChange.startsWith("+") ? "text-emerald-500" : "text-red-500"}`}>
                              {ratingChange}
                            </span>
                          </div>
                          <button
                            onClick={() => {
                              if (!ensureLoggedIn()) return;
                              handleWatchLive("You", opponentName, topic);
                            }}
                            className="px-3.5 py-2 bg-slate-50 hover:bg-slate-100 dark:bg-neutral-900 dark:hover:bg-neutral-850 border border-slate-200 dark:border-neutral-800 rounded-xl font-bold transition shrink-0"
                          >
                            Replay
                          </button>
                        </div>
                      </div>
                    )})}
                  </div>
                </div>
              </>
            )}

            {activeTab !== "home" && (
              <div className="bg-white dark:bg-neutral-800 border border-slate-100 dark:border-neutral-800/80 rounded-2xl p-6 shadow-sm min-h-[400px] flex flex-col justify-center items-center text-center">
                <Swords size={48} className="text-slate-300 dark:text-neutral-750 mb-3 animate-pulse" />
                <h3 className="text-base font-bold text-slate-800 dark:text-neutral-200 capitalize mb-1">
                  {activeTab.replace("-", " ")} Section
                </h3>
                <p className="text-xs text-slate-400 dark:text-neutral-500 max-w-xs leading-normal mb-6">
                  Access matchmaking controls, leaderboards, or customize your profile values directly from the side panels.
                </p>

                {activeTab === "live" && (
                  <div className="w-full max-w-md space-y-3 text-left">
                    {LIVE_BATTLES.map((b) => (
                      <div key={b.id} className="flex items-center justify-between p-3.5 border border-slate-100 dark:border-neutral-900 rounded-xl text-xs">
                        <div>
                          <div className="font-bold text-slate-700 dark:text-neutral-200 mb-1">{b.p1} vs {b.p2}</div>
                          <div className="text-[10px] text-slate-400">{b.topic} • {b.difficulty}</div>
                        </div>
                        <button
                          onClick={() => handleWatchLive(b.p1, b.p2, b.topic)}
                          className="px-3 py-1.5 bg-primary text-white rounded-lg font-bold"
                        >
                          Watch Live
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === "ranked" && (
                  <button
                    onClick={() => setMatchmakingOpen(true)}
                    className="px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-bold shadow-md shadow-primary/10 transition"
                  >
                    Launch Ranked Matchmaking
                  </button>
                )}

                {activeTab === "friend" && (
                  <button
                    onClick={() => setCreateDuelOpen(true)}
                    className="px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-bold shadow-md shadow-primary/10 transition"
                  >
                    Create Custom Lobby
                  </button>
                )}

                {activeTab === "leaderboard" && (
                  <div className="w-full max-w-md space-y-2 text-left">
                    {(leaderboard.length > 0 ? leaderboard : LEADERBOARD_ROWS).map((row, idx) => {
                      const rank = row.rank || idx + 1;
                      const name = row.name || (row.userId ? `User ${row.userId.substring(0,4)}` : "Unknown");
                      return (
                        <div key={rank} className="flex justify-between p-2.5 border-b border-slate-50 dark:border-neutral-800 text-xs">
                          <span className="font-semibold">{rank}. {name}</span>
                          <span className="font-bold text-primary">{row.rating} Rating</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </main>

          {/* ─── Column 3: Right Sidebar ───────────────────────────────────────── */}
          <aside className="space-y-6">
            {/* Daily Streak Card */}
            <div className="bg-white dark:bg-neutral-800 border border-slate-100 dark:border-neutral-800/80 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-800 dark:text-neutral-200">Daily Streak</h3>
                <span className="text-[11px] text-slate-400 dark:text-neutral-500 font-semibold cursor-default">
                  Milestone: {Math.max(10, Math.ceil(((streakData?.current || 0) + 1) / 10) * 10)}d
                </span>
              </div>

              <div className="flex items-center gap-3 bg-amber-500/10 p-3.5 border border-amber-500/20 rounded-xl mb-4 text-amber-500">
                <Flame size={28} className={(streakData?.current || 0) > 0 ? "animate-pulse" : "opacity-50"} />
                <div>
                  <div className="text-xl font-black leading-none">{streakData?.current || 0} Days</div>
                  <span className="text-[10px] text-slate-500 dark:text-amber-500/80 block mt-1 font-semibold">
                    Keep it up! Next milestone: {Math.max(10, Math.ceil(((streakData?.current || 0) + 1) / 10) * 10)} days
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center text-center gap-1 mb-4 border-b border-slate-100 dark:border-neutral-800/60 pb-4">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, idx) => {
                  const today = new Date();
                  const currentDay = today.getDay();
                  const diff = idx - currentDay;
                  const dateToCheck = new Date();
                  dateToCheck.setDate(today.getDate() + diff);
                  
                  const isFuture = diff > 0;
                  const isActive = !isFuture && streakData?.isActive && streakData.isActive(dateToCheck);
                  
                  return (
                    <div key={day} className="flex flex-col items-center">
                      <span className={`text-[9px] block mb-1 font-semibold ${diff === 0 ? "text-amber-500 dark:text-amber-400" : "text-slate-400 dark:text-neutral-500"}`}>{day[0]}</span>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${isActive
                          ? "bg-amber-500 text-white shadow-sm"
                          : isFuture ? "bg-slate-50 dark:bg-neutral-900/50 text-slate-300 dark:text-neutral-700" : "bg-slate-100 dark:bg-neutral-900 text-slate-400 dark:text-neutral-600"
                        }`}>
                        {isActive ? "🔥" : "•"}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-neutral-400">
                <span>Longest Streak</span>
                <span className="font-bold text-slate-800 dark:text-neutral-200">{streakData?.best || 0} Days</span>
              </div>
              <div className="mt-4 p-3 rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
  <div className="flex items-center justify-between">
    <span className="text-xs font-semibold text-slate-700 dark:text-neutral-200">
      📊 Consistency Score
    </span>
    <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
      {streakData?.consistencyScore || 0}%
    </span>
  </div>

  <p className="text-[10px] text-slate-500 dark:text-neutral-400 mt-1">
    Active on {Math.round(((streakData?.consistencyScore || 0) / 100) * 30)} of the last 30 days.
  </p>
</div>
            </div>

            {/* Detailed Stats */}
            <div className="bg-white dark:bg-neutral-800 border border-slate-100 dark:border-neutral-800/80 rounded-2xl p-5 shadow-sm">
              <h3 className="text-sm font-bold text-slate-800 dark:text-neutral-200 mb-4">Your Stats</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Battles Won", value: profile?.battlesWon || 0, icon: Swords, color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" },
                  { label: "Win Rate", value: profile?.battlesWon && (profile?.battlesWon + profile?.battlesLost) > 0 ? `${Math.round((profile.battlesWon / (profile.battlesWon + profile.battlesLost)) * 100)}%` : "0%", icon: TrendingUp, color: "text-blue-500 bg-blue-500/10 border-blue-500/20" },
                  { label: "Problems Solved", value: profile?.totalProblemsSolved || 0, icon: Target, color: "text-purple-500 bg-purple-500/10 border-purple-500/20" },
                  { label: "Current Rating", value: profile?.rating || 1200, icon: Trophy, color: "text-amber-500 bg-amber-500/10 border-amber-500/20" }
                ].map((stat, idx) => {
                  const Icon = stat.icon;
                  return (
                    <div key={idx} className="p-3 border border-slate-100 dark:border-neutral-900 bg-slate-50/20 dark:bg-neutral-900/20 rounded-xl text-center">
                      <div className={`mx-auto w-8 h-8 rounded-lg flex items-center justify-center border ${stat.color} mb-2`}>
                        <Icon size={14} />
                      </div>
                      <span className="text-[9px] text-slate-400 dark:text-neutral-500 block truncate font-medium uppercase tracking-wider">{stat.label}</span>
                      <span className="text-sm font-bold text-slate-850 dark:text-neutral-100 block mt-0.5">{stat.value}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <button
  onClick={() => setShowXPWidget(!showXPWidget)}
  className="text-xs text-primary font-semibold"
>
  {showXPWidget ? "Hide XP Widget" : "Show XP Widget"}
</button>

            {/* XP Progress */}
{showXPWidget && (
  <div className="bg-white dark:bg-neutral-800 border border-slate-100 dark:border-neutral-800/80 rounded-2xl p-5 shadow-sm">
    <div className="flex justify-between items-center mb-3">
      <h3 className="text-sm font-bold text-slate-800 dark:text-neutral-200">
        XP Progress
      </h3>
      <span className="text-xs text-primary dark:text-purple-400 font-bold uppercase tracking-wider">
        Level {currentUserStats.level}
      </span>
    </div>

    <div className="w-full bg-slate-100 dark:bg-neutral-900 h-2.5 rounded-full overflow-hidden mb-3">
      <div
        className="bg-primary h-full rounded-full transition-all duration-500"
        style={{ width: `${(currentUserStats.xp % 1000) / 10}%` }}
      />
    </div>

    <div className="flex justify-between text-xs text-slate-500 dark:text-neutral-400">
      <span>{currentUserStats.xp % 1000} / 1000 XP</span>
      <span className="font-semibold text-slate-700 dark:text-neutral-300">
        Next Reward: Level {currentUserStats.level + 1} 🎁
      </span>
    </div>
  </div>
)}


            {/* Badges Grid */}
            <div className="bg-white dark:bg-neutral-800 border border-slate-100 dark:border-neutral-800/80 rounded-2xl p-5 shadow-sm">
  <div className="flex items-center justify-between mb-4">
    <h3 className="text-sm font-bold text-slate-800 dark:text-neutral-200">
      Achievement Showcase
    </h3>
    <span className="text-xs text-primary">
      {ACHIEVEMENT_BADGES.length} Earned
    </span>
  </div>

  <div className="grid grid-cols-2 gap-3">
    {ACHIEVEMENT_BADGES.map((badge, index) => (
      <div
        key={index}
        className="p-3 rounded-xl border border-slate-200 dark:border-neutral-700 text-center"
      >
        <div className="text-2xl">{badge.icon}</div>
        <p className="text-[10px] font-medium mt-1">
          {badge.title}
        </p>
      </div>
    ))}
  </div>
</div>
          </aside>

        </div>
      </div>

      <Footer />
       <BackToTop />

      {/* ─── Interactive Modals ────────────────────────────────────────────── */}
      <MatchmakingModal
        isOpen={matchmakingOpen}
        onClose={() => setMatchmakingOpen(false)}
        onMatchFound={handleMatchFound}
        currentUserStats={currentUserStats}
      />

      <DuelSimulatorModal
        isOpen={duelSimulatorOpen}
        onClose={() => setDuelSimulatorOpen(false)}
        opponent={selectedOpponent}
        currentUserStats={currentUserStats}
        problemName={activeDuelProblem}
      />

      <CreateDuelModal
        isOpen={createDuelOpen}
        onClose={() => setCreateDuelOpen(false)}
        onCreateMatch={handleCreateMatchLaunch}
      />
    </section>
  );
}
