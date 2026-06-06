"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUser } from "@/features/user/UserContext";
import UpcomingTournament from "@/app/components/ui/UpcomingTournament";
import MatchmakingModal from "@/app/components/ui/MatchmakingModal";
import DuelSimulatorModal from "@/app/components/ui/DuelSimulatorModal";
import CreateDuelModal from "@/app/components/ui/CreateDuelModal";
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

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  const [activeTab, setActiveTab] = useState("home"); // home, live, ranked, friend, leaderboard, streak, tournaments, badges, history

  // Modals state
  const [matchmakingOpen, setMatchmakingOpen] = useState(false);
  const [createDuelOpen, setCreateDuelOpen] = useState(false);
  const [duelSimulatorOpen, setDuelSimulatorOpen] = useState(false);
  const [selectedOpponent, setSelectedOpponent] = useState(null);
  const [activeDuelProblem, setActiveDuelProblem] = useState("Reverse Linked List");

  const [currentUserStats, setCurrentUserStats] = useState({
    name: "Pankaj Singh",
    level: 17,
    rating: 1620,
    xp: 4200,
    rank: 28,
  });

  useEffect(() => {
    if (!loading && user) {
      setCurrentUserStats({
        name: user.user_metadata?.name || user.email.split("@")[0],
        level: user.user_metadata?.level || 17,
        rating: user.user_metadata?.rating || 1620,
        xp: user.user_metadata?.xp || 4200,
        rank: user.user_metadata?.rank || 28,
      });
    }
  }, [user, loading]);

  const handleMatchFound = (opponent) => {
    setSelectedOpponent(opponent);
    setMatchmakingOpen(false);
    setActiveDuelProblem("Reverse Linked List");
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

  if (loading || !user) {
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
                      onClick={() => setActiveTab(item.id)}
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
                onClick={() => setMatchmakingOpen(true)}
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
                        onClick={() => setMatchmakingOpen(true)}
                        className="px-5 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
                      >
                        <Zap size={14} />
                        Find Match
                      </button>
                      <button
                        onClick={() => setCreateDuelOpen(true)}
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
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center font-bold text-xs shadow border-2 border-slate-600 mb-1.5 overflow-hidden">
                        {user?.user_metadata?.avatar_url || user?.user_metadata?.picture ? (
                          <img
                            src={user.user_metadata.avatar_url || user.user_metadata.picture}
                            alt="avatar"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-light flex items-center justify-center text-xs font-bold">
                            {getInitials(currentUserStats.name || user?.email)}
                          </div>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-300 block font-semibold mb-1 truncate max-w-[64px]">
                        {(currentUserStats.name || "Pankaj").split(" ")[0]}
                      </span>
                      <span className="text-[9px] text-slate-400 block mb-2">{currentUserStats.xp || 2320} XP</span>
                      <div className="w-14 h-12 bg-slate-800 border-t border-slate-700 rounded-t-lg flex items-center justify-center font-bold text-slate-400 shadow-lg text-lg">
                        2
                      </div>
                    </div>

                    {/* 1st Place */}
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center font-bold text-sm shadow-md border-2 border-amber-400 mb-1.5">
                        AY
                      </div>
                      <span className="text-[10px] text-slate-200 block font-bold mb-1">Aryan</span>
                      <span className="text-[9px] text-amber-300 block mb-2">2450 XP</span>
                      <div className="w-16 h-20 bg-primary border-t border-primary-light rounded-t-lg flex items-center justify-center font-extrabold text-white shadow-lg text-2xl">
                        1
                      </div>
                    </div>

                    {/* 3rd Place */}
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center font-bold text-xs shadow border-2 border-purple-500 mb-1.5">
                        AD
                      </div>
                      <span className="text-[10px] text-slate-300 block font-semibold mb-1">Aditya</span>
                      <span className="text-[9px] text-slate-400 block mb-2">2200 XP</span>
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
                        onClick={() => setActiveTab("live")}
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
                              Reverse Linked List
                            </h4>
                            <span className="px-2 py-0.5 rounded bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400 text-[9px] font-bold">
                              Easy
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 dark:text-neutral-500 leading-normal truncate">
                            Reverse a singly linked list.
                          </p>
                          <div className="text-[10px] text-primary dark:text-purple-400 font-semibold mt-1">
                            Reward: +50 XP
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
                        onClick={() => setActiveTab("leaderboard")}
                        className="text-xs text-primary dark:text-purple-400 font-semibold cursor-pointer hover:underline"
                      >
                        View All
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {LEADERBOARD_ROWS.map((row) => (
                        <div key={row.rank} className="flex items-center justify-between text-xs px-2 py-1.5 border-b border-slate-50 dark:border-neutral-800 last:border-0">
                          <div className="flex items-center gap-3">
                            <span className={`w-5 text-center font-bold ${row.rank === 1 ? "text-amber-500" : row.rank === 2 ? "text-slate-400" : "text-slate-500"
                              }`}>
                              {row.rank}
                            </span>
                            <span className="font-semibold text-slate-850 dark:text-neutral-200">{row.name}</span>
                          </div>
                          <span className="font-bold text-slate-800 dark:text-neutral-300">{row.rating}</span>
                        </div>
                      ))}
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
                      onClick={() => setActiveTab("history")}
                      className="text-xs text-primary dark:text-purple-400 font-semibold cursor-pointer hover:underline"
                    >
                      View All
                    </span>
                  </div>

                  <div className="space-y-3">
                    {RECENT_BATTLES.map((b) => (
                      <div key={b.id} className="flex items-center justify-between p-3.5 border border-slate-100 dark:border-neutral-900/60 bg-slate-50/20 dark:bg-neutral-900/20 rounded-xl gap-4 text-xs">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-slate-700 dark:text-neutral-300 truncate">
                              You vs {b.opponent}
                            </span>
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${b.result === "Victory"
                                ? "bg-emerald-500/10 text-emerald-500"
                                : "bg-red-500/10 text-red-500"
                              }`}>
                              {b.result}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-[10px] text-slate-400 dark:text-neutral-500">
                            <span>Topic: {b.topic}</span>
                            <span>{b.date}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-right shrink-0">
                            <span className="font-semibold text-primary dark:text-purple-400 block">{b.xp}</span>
                            <span className={`text-[10px] font-bold ${b.rating.startsWith("+") ? "text-emerald-500" : "text-red-500"}`}>
                              {b.rating}
                            </span>
                          </div>
                          <button
                            onClick={() => handleWatchLive("You", b.opponent, b.topic)}
                            className="px-3.5 py-2 bg-slate-50 hover:bg-slate-100 dark:bg-neutral-900 dark:hover:bg-neutral-850 border border-slate-200 dark:border-neutral-800 rounded-xl font-bold transition shrink-0"
                          >
                            Replay
                          </button>
                        </div>
                      </div>
                    ))}
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
                    {LEADERBOARD_ROWS.map((row) => (
                      <div key={row.rank} className="flex justify-between p-2.5 border-b border-slate-50 dark:border-neutral-800 text-xs">
                        <span className="font-semibold">{row.rank}. {row.name}</span>
                        <span className="font-bold text-primary">{row.rating} Rating</span>
                      </div>
                    ))}
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
                  Milestone: 20d
                </span>
              </div>

              <div className="flex items-center gap-3 bg-amber-500/10 p-3.5 border border-amber-500/20 rounded-xl mb-4 text-amber-500">
                <Flame size={28} className="animate-pulse" />
                <div>
                  <div className="text-xl font-black leading-none">17 Days</div>
                  <span className="text-[10px] text-slate-500 dark:text-amber-500/80 block mt-1 font-semibold">
                    Keep it up! Next milestone: 20 days
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center text-center gap-1 mb-4 border-b border-slate-100 dark:border-neutral-800/60 pb-4">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, idx) => {
                  const isActive = idx !== 4; // Mock Friday off
                  return (
                    <div key={day} className="flex flex-col items-center">
                      <span className="text-[9px] text-slate-400 dark:text-neutral-500 block mb-1 font-semibold">{day[0]}</span>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${isActive
                          ? "bg-amber-500 text-white shadow-sm"
                          : "bg-slate-100 dark:bg-neutral-900 text-slate-400 dark:text-neutral-600"
                        }`}>
                        {isActive ? "🔥" : "•"}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-neutral-400">
                <span>Longest Streak</span>
                <span className="font-bold text-slate-800 dark:text-neutral-200">43 Days</span>
              </div>
            </div>

            {/* Detailed Stats */}
            <div className="bg-white dark:bg-neutral-800 border border-slate-100 dark:border-neutral-800/80 rounded-2xl p-5 shadow-sm">
              <h3 className="text-sm font-bold text-slate-800 dark:text-neutral-200 mb-4">Your Stats</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Battles Won", value: "124", icon: Swords, color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" },
                  { label: "Win Rate", value: "67%", icon: TrendingUp, color: "text-blue-500 bg-blue-500/10 border-blue-500/20" },
                  { label: "Problems Solved", value: "486", icon: Target, color: "text-purple-500 bg-purple-500/10 border-purple-500/20" },
                  { label: "Current Rating", value: "1620", icon: Trophy, color: "text-amber-500 bg-amber-500/10 border-amber-500/20" }
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

            {/* XP Progress */}
            <div className="bg-white dark:bg-neutral-800 border border-slate-100 dark:border-neutral-800/80 rounded-2xl p-5 shadow-sm">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-bold text-slate-800 dark:text-neutral-200">XP Progress</h3>
                <span className="text-xs text-primary dark:text-purple-400 font-bold uppercase tracking-wider">
                  Level {currentUserStats.level}
                </span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-neutral-900 h-2.5 rounded-full overflow-hidden mb-3">
                <div className="bg-primary h-full rounded-full" style={{ width: "84%" }} />
              </div>
              <div className="flex justify-between text-xs text-slate-500 dark:text-neutral-400">
                <span>{currentUserStats.xp}/5000 XP</span>
                <span className="font-semibold text-slate-700 dark:text-neutral-300">Next Reward: Level 18 🎁</span>
              </div>
            </div>

            {/* Badges Grid */}
            <div className="bg-white dark:bg-neutral-800 border border-slate-100 dark:border-neutral-800/80 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-800 dark:text-neutral-200">Badges</h3>
                <span
                  onClick={() => setActiveTab("badges")}
                  className="text-xs text-primary dark:text-purple-400 font-semibold cursor-pointer hover:underline"
                >
                  View All
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2.5">
                {[
                  { label: "Binary Search Master", emoji: "🏆", bg: "bg-purple-500/10 border-purple-500/20" },
                  { label: "Speed Demon", emoji: "⚡", bg: "bg-amber-500/10 border-amber-500/20" },
                  { label: "Streak God", emoji: "🔥", bg: "bg-red-500/10 border-red-500/20" },
                  { label: "Consistency King", emoji: "👑", bg: "bg-blue-500/10 border-blue-500/20" }
                ].map((b, idx) => (
                  <div
                    key={idx}
                    className={`aspect-square rounded-xl flex items-center justify-center text-xl border ${b.bg} shadow-sm`}
                    title={b.label}
                  >
                    {b.emoji}
                  </div>
                ))}
              </div>
            </div>
          </aside>

        </div>
      </div>

      <Footer />

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
