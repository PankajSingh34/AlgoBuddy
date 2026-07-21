"use client";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useUser } from "@/features/user/UserContext";
import { toast } from "react-hot-toast";
import UpcomingTournament from "@/app/components/ui/UpcomingTournament";
import MatchmakingModal from "@/app/components/ui/MatchmakingModal";
import DuelSimulatorModal from "@/app/components/ui/DuelSimulatorModal";
import SpectatorSimulatorModal from "@/app/components/ui/SpectatorSimulatorModal";
import CreateDuelModal from "@/app/components/ui/CreateDuelModal";
import TournamentCard from "@/app/components/ui/TournamentCard";
import Footer from "@/app/components/footer";
import {
  Search,
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
  Target,
  ChevronLeft,
  Users,
  Calendar,
  Gift,
  TrendingDown,
  Minus,
  Navigation,
  Share2,
  Star,
  Crown,
  ShieldCheck,
  ShieldAlert
} from "lucide-react";
import { useArenaProfile } from "@/app/hooks/useArenaProfile";
import { useSheetProgress } from "@/app/hooks/useSheetProgress";
import { practiceData } from "@/lib/practiceData";

// Mock live battles feed is removed, we use liveMatches

const ACHIEVEMENT_BADGES = [
  { title: "Module Master", icon: "🏆" },
  { title: "7-Day Streak", icon: "🔥" },
  { title: "Community Helper", icon: "🤝" },
  { title: "Arena Champion", icon: "⚔️" },
];

function calculateLevelProgress(xp) {
  if (!xp) return 0;
  return (xp % 1000) / 10;
}

function getInitials(name) {
  if (!name) return "??";
  const cleanName = name.includes("@") ? name.split("@")[0] : name;
  const parts = cleanName.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return parts[0].slice(0, 2).toUpperCase();
}

function getTierBadge(tier) {
  const colors = {
    "Grandmaster": "bg-red-500/20 text-red-500 border-red-500/50",
    "Diamond": "bg-blue-500/20 text-blue-500 border-blue-500/50",
    "Gold": "bg-amber-500/20 text-amber-500 border-amber-500/50",
    "Silver": "bg-slate-400/20 text-slate-400 border-slate-400/50",
    "Bronze": "bg-orange-700/20 text-orange-700 border-orange-700/50"
  };
  const colorClass = colors[tier] || colors["Bronze"];
  return (
    <span className={`px-2 py-0.5 rounded-md border text-[10px] font-bold uppercase tracking-wider ${colorClass}`}>
      {tier}
    </span>
  );
}

export default function ArenaPage() {
  const { user, loading } = useUser();
  const router = useRouter();
  const { profile, leaderboard, matchHistory, dailyChallenge, loadingProfile, loadingLeaderboard } = useArenaProfile(user);
  const { progress, getStatus, streakData } = useSheetProgress();

  const ensureLoggedIn = () => {
    if (loading) return false; 
    if (!user) {
      toast.error("Please login to use this feature!");
      router.push("/login?next=/arena");
      return false;
    }
    return true;
  };

  const [activeTab, setActiveTab] = useState("home"); // home, live, ranked, friend, leaderboard, streak, tournaments, badges, history
  const [leaderboardFilter, setLeaderboardFilter] = useState("Global");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedRow, setExpandedRow] = useState(null);

  // Tournament Timer State
  const [tournamentTimeLeft, setTournamentTimeLeft] = useState({
    days: 0, hours: 0, minutes: 0, seconds: 0
  });
  const [tournamentFilter, setTournamentFilter] = useState("Upcoming");
  const [badgeCategory, setBadgeCategory] = useState("All");
  const [hasFreeze, setHasFreeze] = useState(false);

  const calculateRank = (xp) => {
    if (xp >= 10000) return { name: "Grandmaster", Icon: Crown, color: "text-purple-500", ringColor: "border-purple-500" };
    if (xp >= 5000) return { name: "Diamond", Icon: Award, color: "text-indigo-500", ringColor: "border-indigo-500" };
    if (xp >= 2500) return { name: "Platinum", Icon: Star, color: "text-cyan-500", ringColor: "border-cyan-500" };
    if (xp >= 1000) return { name: "Gold", Icon: ShieldCheck, color: "text-yellow-500", ringColor: "border-yellow-500" };
    if (xp >= 500) return { name: "Silver", Icon: ShieldAlert, color: "text-slate-400", ringColor: "border-slate-400" };
    return { name: "Bronze", Icon: Shield, color: "text-amber-700", ringColor: "border-amber-700" };
  };

  const rankedMatches = matchHistory?.filter(m => m.mode === 'ranked' || m.isRanked) || [];
  const currentRank = rankedMatches.length >= 5 ? calculateRank(profile?.xp || 0) : { name: "Unranked", Icon: Trophy, color: "text-slate-400", ringColor: "border-primary" };
  const RankIcon = currentRank.Icon;

  const handleTabChange = (tabId) => {
    if (["ranked", "friend", "streak", "badges", "history"].includes(tabId)) {
      if (!ensureLoggedIn()) return;
    }
    if (typeof window !== "undefined") {
      router.push(tabId === "home" ? "/arena" : `/arena#${tabId}`);
      setActiveTab(tabId);
    }
  };

  const rankProgress = Math.min(((profile?.xp || 0) % 1000) / 1000 * 100, 100);
  const ringRadius = 62;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringDashoffset = ringCircumference - (rankProgress / 100) * ringCircumference;

  // Tournament Timer Effect
  useEffect(() => {
    const getNextTargetDate = () => {
      const now = new Date();
      const target = new Date();
      target.setDate(now.getDate() + ((7 - now.getDay()) % 7)); // Next Sunday
      target.setHours(18, 0, 0, 0); // 6:00 PM
      if (target.getTime() <= now.getTime()) {
        target.setDate(target.getDate() + 7);
      }
      return target;
    };

    const targetDate = getNextTargetDate();

    const updateTimer = () => {
      const difference = targetDate.getTime() - new Date().getTime();
      if (difference <= 0) {
        setTournamentTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setTournamentTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      const validTabs = ["home", "live", "ranked", "friend", "leaderboard", "streak", "tournaments", "badges", "history"];
      const protectedTabs = ["ranked", "friend", "streak", "badges", "history"];
      
      if (validTabs.includes(hash)) {
        // Don't redirect while auth session is still resolving — user may be logged in
        if (protectedTabs.includes(hash) && !loading && !user) {
          router.push("/arena");
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
  }, [user, loading, router]);

  // Live Matches polling
  const [liveMatches, setLiveMatches] = useState([]);

  useEffect(() => {
    let timeoutId;
    let isOffline = false;

    const fetchLiveMatches = async () => {
      try {
        const socketUrl = process.env.NEXT_PUBLIC_SOCKET_SERVER_URL || 
          (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" || window.location.hostname.startsWith("192.168.")
            ? `http://${window.location.hostname}:4000`
            : "https://algobuddy-socket-server.onrender.com");
          
        const res = await fetch(`${socketUrl}/api/matches/active`);
        if (res.ok) {
          const data = await res.json();
          setLiveMatches(data.matches || []);
          if (isOffline) {
            isOffline = false;
            console.log("Live matches server is back online.");
          }
        } else {
          throw new Error(`Server returned status: ${res.status}`);
        }
      } catch (err) {
        if (!isOffline) {
          isOffline = true;
          console.warn("Live matches server is offline. Real-time updates disabled. Retrying less frequently.");
        }
      } finally {
        // Schedule next poll: 5 seconds if online, 60 seconds if offline
        const delay = isOffline ? 60000 : 5000;
        timeoutId = setTimeout(fetchLiveMatches, delay);
      }
    };

    fetchLiveMatches();
    return () => clearTimeout(timeoutId);
  }, []);

  // Modals state
  const [matchmakingOpen, setMatchmakingOpen] = useState(false);
  const [matchmakingOptions, setMatchmakingOptions] = useState({});
  const [createDuelOpen, setCreateDuelOpen] = useState(false);
  const [duelDifficulty, setDuelDifficulty] = useState("Medium");
  const [duelTime, setDuelTime] = useState("30m");
  const [duelTopic, setDuelTopic] = useState("Random");
  const [joinCode, setJoinCode] = useState("");
  const [duelWager, setDuelWager] = useState(50);
  const [duelMode, setDuelMode] = useState("Standard");
  const [duelPublic, setDuelPublic] = useState(false);

  const handleJoinLobby = () => {
    if (joinCode.length !== 6) {
      toast.error("Please enter a valid 6-digit invite code.");
      return;
    }
    window.location.href = `/arena/duel/${joinCode}`;
  };

  // Fix for browser back button from Matchmaking modal (Issue #1333)
  // Fix for browser back button from Create Duel modal (Issue #1336)
  useEffect(() => {
    const handlePopState = (e) => {
      if (matchmakingOpen) {
        setMatchmakingOpen(false);
      } else if (createDuelOpen) {
        setCreateDuelOpen(false);
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [matchmakingOpen, createDuelOpen]);

  const openMatchmakingModal = (options = {}) => {
    if (!ensureLoggedIn()) return;
    window.history.pushState({ modal: "matchmaking" }, "", window.location.href);
    setMatchmakingOptions(options);
    setMatchmakingOpen(true);
  };

  const closeMatchmakingModal = () => {
    setMatchmakingOpen(false);
    if (window.history.state?.modal === "matchmaking") {
      window.history.back();
    }
  };

  const openCreateDuelModal = () => {
    if (!ensureLoggedIn()) return;
    window.history.pushState({ modal: "createDuel" }, "", window.location.href);
    setCreateDuelOpen(true);
  };

  const closeCreateDuelModal = () => {
    setCreateDuelOpen(false);
    if (window.history.state?.modal === "createDuel") {
      window.history.back();
    }
  };
  const [duelSimulatorOpen, setDuelSimulatorOpen] = useState(false);
  const [selectedOpponent, setSelectedOpponent] = useState(null);
  const [activeDuelProblem, setActiveDuelProblem] = useState("Reverse Linked List");


  const [currentUserStats, setCurrentUserStats] = useState({
    name: "",
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
    closeMatchmakingModal();
    setActiveDuelProblem("Two Sum");
    setDuelSimulatorOpen(true);
  };

  const handleWatchLive = (matchData) => {
    // Let's store it in state so we can pass it to the SpectatorModal
    setSpectatingMatch(matchData);
    setSpectatorModalOpen(true);
  };

  const [spectatorModalOpen, setSpectatorModalOpen] = useState(false);
  const [spectatingMatch, setSpectatingMatch] = useState(null);
  const [isLoadingTournaments, setIsLoadingTournaments] = useState(true);

  useEffect(() => {
    if (activeTab === "tournaments" && isLoadingTournaments) {
      const timer = setTimeout(() => {
        setIsLoadingTournaments(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [activeTab, isLoadingTournaments]);

  const handleCreateMatchLaunch = (matchConfig) => {
    setCreateDuelOpen(false);
    if (matchConfig?.lobbyCode) {
      router.push(`/arena/duel/${matchConfig.lobbyCode}`);
    }
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
          <aside className="space-y-6 lg:sticky lg:top-24 h-max">
            {/* Navigation Menu */}
            <div className="bg-white dark:bg-neutral-800 border border-slate-100 dark:border-neutral-800/80 rounded-2xl p-3 shadow-sm">
              <nav className="space-y-0.5">
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
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${isActive
                          ? "bg-gradient-to-r from-primary/10 to-transparent border border-primary/20 text-primary dark:from-primary/20 dark:border-primary/30 dark:text-primary-light shadow-sm"
                          : "text-slate-500 hover:text-slate-800 hover:bg-slate-50 dark:text-neutral-400 dark:hover:text-neutral-200 dark:hover:bg-neutral-900/40 border border-transparent"
                        }`}
                    >
                      <Icon size={isActive ? 20 : 18} className={isActive ? "text-primary dark:text-primary-light" : ""} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* XP Progress */}
            <div className="bg-white dark:bg-neutral-800 border border-slate-100 dark:border-neutral-800/80 rounded-2xl p-5 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none group-hover:bg-primary/10 transition-colors duration-500"></div>
              
              <div className="flex justify-between items-center mb-4 relative z-10">
                <h3 className="text-sm font-bold text-slate-800 dark:text-neutral-200 flex items-center gap-2">
                  <Star size={16} className="text-amber-500" />
                  XP Progress
                </h3>
                <span className="text-[10px] bg-primary/10 text-primary dark:text-primary-light font-black uppercase tracking-widest px-2 py-0.5 rounded-md border border-primary/20">
                  Lvl {currentUserStats.level}
                </span>
              </div>

              <div className="relative z-10">
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span className="text-slate-700 dark:text-neutral-300">{calculateLevelProgress(currentUserStats.xp).toFixed(0)}%</span>
                  <span className="text-slate-500 dark:text-neutral-500">{1000 - (currentUserStats.xp % 1000)} XP to Next</span>
                </div>
                
                <div className="w-full bg-slate-100 dark:bg-neutral-900 h-2.5 rounded-full overflow-hidden mb-3 border border-slate-200 dark:border-neutral-800">
                  <div
                    className="bg-gradient-to-r from-primary to-purple-400 h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(168,85,247,0.4)]"
                    style={{ width: `${calculateLevelProgress(currentUserStats.xp)}%` }}
                  />
                </div>

                <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-neutral-400 bg-slate-50 dark:bg-neutral-900/50 p-2 rounded-lg border border-slate-100 dark:border-neutral-800 mt-4">
                  <Gift size={12} className="text-purple-500 shrink-0" />
                  <span>Next: <strong className="text-slate-700 dark:text-neutral-300">Level {currentUserStats.level + 1} Badge</strong></span>
                </div>
              </div>
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
                          openMatchmakingModal();
                        }}
                        className="px-5 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
                      >
                        <Zap size={14} />
                        Find Match
                      </button>
                      <button
                        onClick={openCreateDuelModal}
                        className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
                      >
                        <Swords size={14} />
                        Create Duel
                      </button>
                    </div>
                  </div>

                  {/* Top 3 Avatars Podium Graphic */}
                  <div className="flex gap-4 items-end pr-2 select-none">
                    {/* 2nd Place */}
                    <div className="flex flex-col items-center mt-6">
                      <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center font-bold text-xs shadow border-2 border-slate-600 mb-1.5 overflow-hidden">
                        {leaderboard[1]?.avatarUrl ? (
                          <img 
                            src={leaderboard[1].avatarUrl} 
                            alt={leaderboard[1]?.name || "User"} 
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover" 
                          />
                        ) : leaderboard[1] ? (
                          <div className="w-full h-full bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-light flex items-center justify-center text-xs font-bold">
                            {getInitials(leaderboard[1]?.name || `User ${leaderboard[1]?.userId.substring(0,4)}`)}
                          </div>
                        ) : (
                          <div className="w-full h-full bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-500">
                            -
                          </div>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-300 block font-semibold mb-1 truncate max-w-[64px]">
                        {leaderboard[1] ? (leaderboard[1]?.name || `User ${leaderboard[1]?.userId.substring(0,4)}`) : "Unranked"}
                      </span>
                      <span className="text-[9px] text-slate-400 block mb-2">{leaderboard[1] ? `${leaderboard[1].xp} XP` : "-"}</span>
                      <div className="w-14 h-12 bg-slate-800 border-t border-slate-700 rounded-t-lg flex items-center justify-center font-bold text-slate-400 shadow-lg text-lg">
                        2
                      </div>
                    </div>

                    {/* 1st Place */}
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center font-bold text-sm shadow-md border-2 border-amber-400 mb-1.5 overflow-hidden">
                        {leaderboard[0]?.avatarUrl ? (
                          <img 
                            src={leaderboard[0].avatarUrl} 
                            alt={leaderboard[0]?.name || "User"} 
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover" 
                          />
                        ) : leaderboard[0] ? (
                           <div className="w-full h-full text-white flex items-center justify-center text-sm font-bold">
                             {getInitials(leaderboard[0]?.name || `User ${leaderboard[0]?.userId.substring(0,4)}`)}
                           </div>
                        ) : (
                           <div className="w-full h-full bg-slate-800 flex items-center justify-center text-sm font-bold text-slate-500">
                             -
                           </div>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-200 block font-bold mb-1">{leaderboard[0] ? (leaderboard[0]?.name || `User ${leaderboard[0]?.userId.substring(0,4)}`) : "Unranked"}</span>
                      <span className="text-[9px] text-amber-300 block mb-2">{leaderboard[0] ? `${leaderboard[0].xp} XP` : "-"}</span>
                      <div className="w-16 h-20 bg-primary border-t border-primary-light rounded-t-lg flex items-center justify-center font-extrabold text-white shadow-lg text-2xl">
                        1
                      </div>
                    </div>

                    {/* 3rd Place */}
                    <div className="flex flex-col items-center mt-8">
                      <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center font-bold text-xs shadow border-2 border-purple-500 mb-1.5 overflow-hidden">
                        {leaderboard[2]?.avatarUrl ? (
                          <img 
                            src={leaderboard[2].avatarUrl} 
                            alt={leaderboard[2]?.name || "User"} 
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover" 
                          />
                        ) : leaderboard[2] ? (
                           <div className="w-full h-full text-white flex items-center justify-center text-xs font-bold">
                             {getInitials(leaderboard[2]?.name || `User ${leaderboard[2]?.userId.substring(0,4)}`)}
                           </div>
                        ) : (
                           <div className="w-full h-full bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-500">
                             -
                           </div>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-300 block font-semibold mb-1">{leaderboard[2] ? (leaderboard[2]?.name || `User ${leaderboard[2]?.userId.substring(0,4)}`) : "Unranked"}</span>
                      <span className="text-[9px] text-slate-400 block mb-2">{leaderboard[2] ? `${leaderboard[2].xp} XP` : "-"}</span>
                      <div className="w-14 h-12 bg-slate-800 border-t border-slate-700 rounded-t-lg flex items-center justify-center font-bold text-slate-400 shadow-lg text-lg">
                        3
                      </div>
                    </div>
                  </div>
                </div>

                {/* Your Stats Card */}
                <div className="bg-white dark:bg-neutral-800 border border-slate-100 dark:border-neutral-800/80 rounded-2xl p-6 shadow-sm">
                  <h3 className="text-base font-bold text-slate-800 dark:text-neutral-200 mb-4">Your Stats</h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {[
                      { label: "Battles Won", value: profile?.battlesWon || 0, icon: Swords, color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" },
                      { label: "Win Rate", value: profile?.battlesWon && (profile?.battlesWon + profile?.battlesLost) > 0 ? `${Math.round((profile.battlesWon / (profile.battlesWon + profile.battlesLost)) * 100)}%` : "0%", icon: TrendingUp, color: "text-blue-500 bg-blue-500/10 border-blue-500/20" },
                      { label: "Problems Solved", value: profile?.totalProblemsSolved || 0, icon: Target, color: "text-purple-500 bg-purple-500/10 border-purple-500/20" },
                      { label: "Current Rating", value: profile?.rating || 1200, icon: Trophy, color: "text-amber-500 bg-amber-500/10 border-amber-500/20" },
                      { label: "Current Rank", value: `#${currentUserStats.rank}`, icon: Shield, color: "text-slate-500 bg-slate-500/10 border-slate-500/20" },
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

                {/* Sub-grid 2: Achievement Showcase & Upcoming Tournament */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                  {/* Upcoming Tournament */}
                  <UpcomingTournament />
                </div>
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
                    {matchHistory && matchHistory.length > 0 ? (
                      matchHistory.map((b) => {
                        const opponentName = b.opponentName;
                        const topic = b.topic;
                        const date = new Date(b.startTime).toLocaleDateString();
                        const result = b.result;
                        const xpAwarded = `+${b.xpAwarded} XP`;
                        const ratingChange = b.ratingChange >= 0 ? `+${b.ratingChange} Rating` : `${b.ratingChange} Rating`;

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
                              className="px-3.5 py-2 bg-slate-50 hover:bg-slate-100 dark:bg-neutral-900 dark:hover:bg-neutral-800 border border-slate-200 dark:border-neutral-800 rounded-xl font-bold transition shrink-0"
                            >
                              Replay
                            </button>
                          </div>
                        </div>
                      )})
                    ) : (
                      <div className="p-4 text-center text-xs font-semibold text-slate-500 dark:text-neutral-400">
                        No recent battles found.
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {activeTab !== "home" && (
              <div className="bg-white dark:bg-neutral-800 border border-slate-100 dark:border-neutral-800/80 rounded-2xl p-6 shadow-sm">


                {activeTab === "live" && (
                  <div className="w-full max-w-md space-y-3 text-left">
                    {liveMatches.length > 0 ? liveMatches.map((b) => {
                      const p1 = b.players?.[0]?.name || "Player 1";
                      const p2 = b.players?.[1]?.name || "Player 2";
                      return (
                      <div key={b.matchId} className="flex items-center justify-between p-3.5 border border-slate-100 dark:border-neutral-900 rounded-xl text-xs">
                        <div>
                          <div className="font-bold text-slate-700 dark:text-neutral-200 mb-1">{p1} vs {p2}</div>
                          <div className="text-[10px] text-slate-400">{b.topic} • {b.difficulty}</div>
                        </div>
                        <button
                          onClick={() => handleWatchLive(b)}
                          className="px-3 py-1.5 bg-primary text-white rounded-lg font-bold"
                        >
                          Watch Live
                        </button>
                      </div>
                    )}) : (
                      <div className="text-center text-xs text-slate-500">No active battles right now.</div>
                    )}
                  </div>
                )}

                {activeTab === "ranked" && (
                  <div className="w-full text-left space-y-6">
                    <div>
                      <h4 className="text-xl font-extrabold text-slate-800 dark:text-neutral-200 mb-1">Ranked Matchmaking</h4>
                      <p className="text-xs text-slate-500 dark:text-neutral-400">Compete against similarly skilled opponents to climb the ranks.</p>
                    </div>

                    <div className="bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
                      <div className="relative mb-6">
                        <div className="w-32 h-32 rounded-full border-4 border-slate-200 dark:border-neutral-800 flex items-center justify-center shadow-inner bg-white dark:bg-neutral-800 relative z-10">
                          <RankIcon size={64} className={currentRank.color} />
                        </div>
                        <div className={`absolute inset-0 rounded-full border-4 ${currentRank.ringColor} border-t-transparent border-l-transparent transform rotate-45 z-20`}></div>
                      </div>
                      
                      <h3 className={`text-2xl font-black uppercase tracking-widest mb-1 ${currentRank.color === 'text-slate-400' ? 'text-slate-800 dark:text-neutral-200' : currentRank.color}`}>{currentRank.name}</h3>
                      <p className="text-xs text-slate-500 font-bold mb-6">
                        {rankedMatches.length >= 5 ? `${profile?.xp || 0} Rating` : "Play 5 placement matches to reveal your rank"}
                      </p>

                      <div className="w-full max-w-sm mb-6">
                        <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-2">
                          <span>Placement Progress</span>
                          <span>0 / 5</span>
                        </div>
                        <div className="bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl p-4 flex flex-col items-center justify-center text-center flex-1">
                          <Flame size={20} className="text-orange-500 mb-2" />
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Win Streak</span>
                          <span className="text-lg font-black text-slate-800 dark:text-neutral-200 mt-1">{profile?.stats?.currentWinStreak || 0}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between mt-6">
                      <div className="flex items-center gap-4 mb-4 md:mb-0 text-left">
                        <div className="w-12 h-12 bg-white dark:bg-neutral-800 rounded-full flex items-center justify-center shadow-sm shrink-0">
                          <Gift className="text-purple-500" size={24} />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-800 dark:text-neutral-200">Season 1 Rewards</h4>
                          <p className="text-[10px] text-slate-500 dark:text-neutral-400 mt-0.5">Reach Gold tier or higher to unlock the exclusive "Algorithm Master" profile badge and 1000 XP.</p>
                        </div>
                      </div>
                      <div className="text-center md:text-right shrink-0">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Season Ends In</span>
                        <div className="flex gap-2 mt-1 justify-center md:justify-end">
                          <div className="px-2 py-1 bg-white dark:bg-neutral-800 rounded border border-slate-100 dark:border-neutral-700 text-xs font-black text-slate-800 dark:text-neutral-200">14<span className="text-[9px] font-bold text-slate-400 ml-0.5">d</span></div>
                          <div className="px-2 py-1 bg-white dark:bg-neutral-800 rounded border border-slate-100 dark:border-neutral-700 text-xs font-black text-slate-800 dark:text-neutral-200">12<span className="text-[9px] font-bold text-slate-400 ml-0.5">h</span></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "friend" && (
                  <div className="w-full text-left space-y-6">
                    <div>
                      <h4 className="text-xl font-extrabold text-slate-800 dark:text-neutral-200 mb-1">Play with Friends</h4>
                      <p className="text-xs text-slate-500 dark:text-neutral-400">Create a private lobby and invite your friends to a custom code duel.</p>
                    </div>

                    <div className="bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <h5 className="text-sm font-bold text-slate-800 dark:text-neutral-200">Lobby Settings</h5>
                          
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Mode</label>
                            <div className="flex gap-2">
                              {["Standard", "Optimization"].map(mode => (
                                <button 
                                  key={mode} 
                                  onClick={() => setDuelMode(mode)}
                                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg border ${duelMode === mode ? "bg-primary/10 border-primary/30 text-primary" : "bg-white dark:bg-neutral-800 border-slate-200 dark:border-neutral-700 text-slate-600 dark:text-neutral-400 hover:border-slate-300"}`}
                                >
                                  {mode}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Topic</label>
                            <select
                              value={duelTopic}
                              onChange={(e) => setDuelTopic(e.target.value)}
                              className="w-full py-2 px-3 text-xs font-bold rounded-lg border bg-white dark:bg-neutral-800 border-slate-200 dark:border-neutral-700 text-slate-600 dark:text-neutral-300 focus:outline-none focus:border-primary/50 transition"
                            >
                              <option value="Random">Random</option>
                              <option value="Arrays">Arrays</option>
                              <option value="Strings">Strings</option>
                              <option value="Hash Tables">Hash Tables</option>
                              <option value="Two Pointers">Two Pointers</option>
                              <option value="Dynamic Programming">Dynamic Programming</option>
                              <option value="Graphs">Graphs</option>
                            </select>
                          </div>

                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Difficulty</label>
                            <div className="flex gap-2">
                              {["Easy", "Medium", "Hard"].map(diff => (
                                <button 
                                  key={diff} 
                                  onClick={() => setDuelDifficulty(diff)}
                                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg border ${duelDifficulty === diff ? "bg-primary/10 border-primary/30 text-primary" : "bg-white dark:bg-neutral-800 border-slate-200 dark:border-neutral-700 text-slate-600 dark:text-neutral-400 hover:border-slate-300"}`}
                                >
                                  {diff}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Time Limit</label>
                            <div className="flex gap-2">
                              {["15m", "30m", "60m"].map(time => (
                                <button 
                                  key={time} 
                                  onClick={() => setDuelTime(time)}
                                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg border ${duelTime === time ? "bg-primary/10 border-primary/30 text-primary" : "bg-white dark:bg-neutral-800 border-slate-200 dark:border-neutral-700 text-slate-600 dark:text-neutral-400 hover:border-slate-300"}`}
                                >
                                  {time}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">XP Wager</label>
                              <span className="text-xs font-bold text-primary">{duelWager} XP</span>
                            </div>
                            <input 
                              type="range" 
                              min="0" 
                              max="500" 
                              step="10" 
                              value={duelWager}
                              onChange={(e) => setDuelWager(Number(e.target.value))}
                              className="w-full accent-primary h-1.5 bg-slate-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer"
                            />
                            <div className="flex justify-between text-[9px] text-slate-400 font-bold px-1">
                              <span>0</span>
                              <span>250</span>
                              <span>500</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between p-3 bg-white dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 rounded-xl">
                            <div className="flex flex-col">
                              <span className="text-xs font-bold text-slate-800 dark:text-neutral-200">Public Lobby</span>
                              <span className="text-[10px] text-slate-500">Allow anyone to join your duel</span>
                            </div>
                            <button
                              onClick={() => setDuelPublic(!duelPublic)}
                              className={`w-10 h-5 rounded-full relative transition-colors duration-200 focus:outline-none ${duelPublic ? "bg-primary" : "bg-slate-300 dark:bg-neutral-600"}`}
                            >
                              <span className={`absolute top-0.5 left-0.5 bg-white w-4 h-4 rounded-full transition-transform duration-200 shadow-sm ${duelPublic ? "translate-x-5" : "translate-x-0"}`} />
                            </button>
                          </div>
                        </div>

                        <div className="space-y-4 flex flex-col">
                          <h5 className="text-sm font-bold text-slate-800 dark:text-neutral-200">Invite Players</h5>
                          
                          <div className="flex-1 bg-white dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 rounded-xl p-4 flex flex-col items-center justify-center text-center space-y-3">
                            <Users size={32} className="text-slate-300 dark:text-neutral-600" />
                            <p className="text-[10px] text-slate-500 max-w-[150px]">Create the lobby to generate an invite code.</p>
                            <button
                              onClick={openCreateDuelModal}
                              className="w-full py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl text-xs font-bold shadow-md shadow-primary/20 transition"
                            >
                              Generate Invite Link
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl p-6 mt-4">
                      <div className="flex flex-col md:flex-row gap-6 items-center">
                        <div className="flex-1 space-y-2">
                          <h5 className="text-sm font-bold text-slate-800 dark:text-neutral-200">Join an Existing Lobby</h5>
                          <p className="text-xs text-slate-500">Have an invite code from a friend? Enter it below to join their custom duel.</p>
                        </div>
                        <div className="w-full md:w-auto flex flex-col sm:flex-row gap-2">
                          <input 
                            type="text" 
                            placeholder="Enter 6-digit code"
                            maxLength={6}
                            value={joinCode}
                            onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                            className="w-full md:w-48 px-4 py-2.5 bg-white dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 rounded-xl text-sm font-mono tracking-widest uppercase focus:outline-none focus:border-primary/50 transition placeholder:normal-case placeholder:tracking-normal"
                          />
                          <button
                            onClick={handleJoinLobby}
                            disabled={joinCode.length !== 6}
                            className={`px-6 py-2.5 rounded-xl text-xs font-bold shadow-md transition flex items-center justify-center ${joinCode.length === 6 ? "bg-primary hover:bg-primary/90 text-white shadow-primary/20" : "bg-slate-200 dark:bg-neutral-800 text-slate-400 dark:text-neutral-600 cursor-not-allowed"}`}
                          >
                            Join Lobby
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "leaderboard" && (
                  <div className="w-full max-w-md space-y-4 text-left">
                    <div className="flex gap-2 p-1 bg-slate-100 dark:bg-neutral-800 rounded-lg">
                      {["Global", "Friends", "Weekly", "All-Time"].map(filter => (
                        <button
                          key={filter}
                          onClick={() => setLeaderboardFilter(filter)}
                          className={`flex-1 py-1.5 text-xs font-bold rounded-md transition ${
                            leaderboardFilter === filter
                              ? "bg-white dark:bg-neutral-700 text-primary shadow-sm"
                              : "text-slate-500 hover:text-slate-700 dark:hover:text-neutral-300"
                          }`}
                        >
                          {filter}
                        </button>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                        <input 
                          type="text" 
                          placeholder="Search players..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      </div>
                      <button 
                        onClick={() => {
                          const me = displayLeaderboard?.find(u => u.name === profile?.name || u.userId === profile?.userId);
                          if (me) {
                            const el = document.getElementById(`leaderboard-row-${me.rank}`);
                            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                          } else {
                            toast.info("You are not currently ranked in this view.");
                          }
                        }}
                        className="px-3 py-2 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg flex items-center justify-center transition"
                        title="Jump to My Rank"
                      >
                        <Navigation size={14} className="mr-1"/>
                        <span className="text-[10px] font-bold uppercase tracking-wider">Me</span>
                      </button>
                    </div>

                    {/* Top 3 Podium */}
                    {leaderboard && leaderboard.length >= 3 && !searchQuery.trim() && leaderboardFilter === "Global" && (
                      (() => {
                        const getDisplayName = (player) => player.name || (player.userId ? `User ${player.userId.substring(0,4)}` : "Unknown");
                        const p1 = leaderboard[0], p2 = leaderboard[1], p3 = leaderboard[2];
                        const n1 = getDisplayName(p1), n2 = getDisplayName(p2), n3 = getDisplayName(p3);
                        return (
                          <div className="flex justify-center items-end gap-4 my-6 pt-4 pb-2 px-4 bg-gradient-to-t from-slate-100/50 to-transparent dark:from-neutral-900/50 rounded-xl relative">
                            {/* 2nd Place */}
                            <div className="flex flex-col items-center pb-2">
                              <div className="relative">
                                <div className="w-10 h-10 rounded-full border-2 border-slate-300 dark:border-neutral-500 overflow-hidden mb-1">
                                  {p2.avatarUrl ? <img src={p2.avatarUrl} alt="2nd" className="w-full h-full object-cover"/> : <div className="w-full h-full bg-slate-200 dark:bg-neutral-700 flex items-center justify-center text-[10px] font-bold text-slate-500 dark:text-neutral-400">{getInitials(n2)}</div>}
                                </div>
                                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-slate-300 dark:bg-neutral-600 rounded-full w-4 h-4 flex items-center justify-center text-[8px] font-bold text-slate-700 dark:text-slate-200 shadow-md ring-1 ring-white dark:ring-neutral-900">2</div>
                              </div>
                              <span className="text-[10px] font-bold text-slate-700 dark:text-neutral-300 truncate max-w-[60px] mt-1">{n2.split(" ")[0]}</span>
                              <span className="text-[9px] font-bold text-slate-500">{p2.rating}</span>
                            </div>
                            
                            {/* 1st Place */}
                            <div className="flex flex-col items-center relative z-10 pb-4">
                              <Trophy size={16} className="text-amber-500 mb-1 drop-shadow-md"/>
                              <div className="relative">
                                <div className="w-14 h-14 rounded-full border-2 border-amber-400 dark:border-amber-500 overflow-hidden mb-1 ring-4 ring-amber-400/20 shadow-lg shadow-amber-500/20">
                                  {p1.avatarUrl ? <img src={p1.avatarUrl} alt="1st" className="w-full h-full object-cover"/> : <div className="w-full h-full bg-slate-200 dark:bg-neutral-700 flex items-center justify-center text-xs font-bold text-amber-500">{getInitials(n1)}</div>}
                                </div>
                                <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 bg-amber-400 dark:bg-amber-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold shadow-md ring-2 ring-white dark:ring-neutral-900">1</div>
                              </div>
                              <span className="text-xs font-bold text-slate-900 dark:text-white mt-1.5 truncate max-w-[80px]">{n1.split(" ")[0]}</span>
                              <span className="text-[10px] font-bold text-amber-600 dark:text-amber-500">{p1.rating}</span>
                            </div>
                            
                            {/* 3rd Place */}
                            <div className="flex flex-col items-center pb-1">
                              <div className="relative">
                                <div className="w-9 h-9 rounded-full border-2 border-orange-700/50 dark:border-orange-900 overflow-hidden mb-1">
                                  {p3.avatarUrl ? <img src={p3.avatarUrl} alt="3rd" className="w-full h-full object-cover"/> : <div className="w-full h-full bg-slate-200 dark:bg-neutral-700 flex items-center justify-center text-[9px] font-bold text-orange-800 dark:text-orange-700">{getInitials(n3)}</div>}
                                </div>
                                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-orange-300 dark:bg-orange-900/80 text-orange-900 dark:text-orange-400 rounded-full w-4 h-4 flex items-center justify-center text-[8px] font-bold shadow-md ring-1 ring-white dark:ring-neutral-900">3</div>
                              </div>
                              <span className="text-[10px] font-bold text-slate-700 dark:text-neutral-300 truncate max-w-[60px] mt-1">{n3.split(" ")[0]}</span>
                              <span className="text-[9px] font-bold text-slate-500">{p3.rating}</span>
                            </div>
                          </div>
                        );
                      })()
                    )}

                    <div className="space-y-2">
                      {leaderboard && leaderboard.length > 0 ? (
                        (() => {
                          let displayLeaderboard = leaderboardFilter === "Friends" 
                            ? leaderboard.filter((_, i) => i % 5 === 0)
                            : leaderboardFilter === "Weekly"
                              ? [...leaderboard].slice(0, 15).sort((a,b) => b.winRate - a.winRate)
                              : leaderboard;
                              
                          if (searchQuery.trim()) {
                            const query = searchQuery.toLowerCase();
                            displayLeaderboard = displayLeaderboard.filter(row => {
                              const name = row.name || (row.userId ? `User ${row.userId.substring(0,4)}` : "Unknown");
                              return name.toLowerCase().includes(query);
                            });
                          }
                              
                          if (displayLeaderboard.length === 0) {
                            return (
                              <div className="p-4 text-center text-xs font-semibold text-slate-500 dark:text-neutral-400">
                                No players found in this category.
                              </div>
                            );
                          }

                          return displayLeaderboard.map((row, idx) => {
                            const rank = row.rank || idx + 1;
                            const name = row.name || (row.userId ? `User ${row.userId.substring(0,4)}` : "Unknown");
                            const isMe = name === profile?.name || row.userId === profile?.userId;
                            const isExpanded = expandedRow === rank;
                        return (
                          <div 
                            key={rank} 
                            id={`leaderboard-row-${rank}`}
                            className={`flex flex-col p-2.5 border-b border-slate-50 dark:border-neutral-800 text-xs transition-colors duration-500 cursor-pointer ${isMe ? 'bg-primary/5 dark:bg-primary/10' : 'hover:bg-slate-50 dark:hover:bg-neutral-800/50'}`}
                            onClick={() => setExpandedRow(isExpanded ? null : rank)}
                          >
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-3">
                                <span className="font-semibold">{rank}.</span>
                                {/* Avatar Circle */}
                                <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-neutral-700 flex items-center justify-center font-bold text-[9px] text-slate-650 dark:text-neutral-300 overflow-hidden shrink-0">
                                  {row.avatarUrl ? (
                                    <img 
                                      src={row.avatarUrl} 
                                      alt={name} 
                                      referrerPolicy="no-referrer"
                                      className="w-full h-full object-cover" 
                                      />
                                  ) : (
                                    getInitials(name)
                                  )}
                                </div>
                                <span className="font-semibold text-slate-850 dark:text-neutral-200">{name}</span>
                              </div>
                              <div className="flex items-center gap-3">
                                {row.trend === "up" && <span className="text-emerald-500 font-bold flex items-center gap-0.5 text-[10px]"><TrendingUp size={12}/>{row.trendValue}</span>}
                                {row.trend === "down" && <span className="text-red-500 font-bold flex items-center gap-0.5 text-[10px]"><TrendingDown size={12}/>{row.trendValue}</span>}
                                {row.trend === "hot" && <span className="text-orange-500 font-bold flex items-center gap-0.5 text-[10px]"><Flame size={12}/>Streak</span>}
                                {row.trend === "same" && <span className="text-slate-400 font-bold flex items-center gap-0.5 text-[10px]"><Minus size={12}/></span>}
                                {row.tier && getTierBadge(row.tier)}
                                <span className="font-bold text-primary">{row.rating} Rating</span>
                              </div>
                            </div>
                            
                            {isExpanded && (
                              <div className="mt-3 pt-3 border-t border-slate-100 dark:border-neutral-800 flex justify-between text-slate-500 dark:text-neutral-400">
                                <div className="flex flex-col gap-1">
                                  <span className="text-[10px] uppercase font-bold tracking-wider">Win Rate</span>
                                  <span className="font-semibold text-slate-800 dark:text-neutral-200">{row.winRate || 50}%</span>
                                </div>
                                <div className="flex flex-col gap-1 text-right">
                                  <span className="text-[10px] uppercase font-bold tracking-wider">Top Languages</span>
                                  <div className="flex gap-1 justify-end">
                                    {(row.topLanguages || ["JavaScript", "Python"]).map(lang => (
                                      <span key={lang} className="px-1.5 py-0.5 bg-slate-100 dark:bg-neutral-800 rounded font-semibold text-[10px] text-slate-700 dark:text-neutral-300">{lang}</span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                          });
                        })()
                      ) : (
                        <div className="p-4 text-center text-xs font-semibold text-slate-500 dark:text-neutral-400">
                          Leaderboard is currently empty.
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {activeTab === "history" && (
                  <div className="w-full text-left space-y-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-sm font-bold text-slate-800 dark:text-neutral-200">Match History</h4>
                      <input 
                        type="text" 
                        placeholder="Search opponent..." 
                        className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 dark:border-neutral-700 bg-slate-50 dark:bg-neutral-900 focus:outline-none focus:border-primary"
                      />
                    </div>
                    {matchHistory && matchHistory.length > 0 ? (
                      <div className="space-y-3">
                        {matchHistory.map((b) => {
                          const opponentName = b.opponentName;
                          const topic = b.topic;
                          const date = new Date(b.startTime).toLocaleDateString();
                          const result = b.result;
                          const xpAwarded = `+${b.xpAwarded} XP`;
                          const ratingChange = b.ratingChange >= 0 ? `+${b.ratingChange} Rating` : `${b.ratingChange} Rating`;

                          return (
                            <div key={b.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 border border-slate-100 dark:border-neutral-800 bg-slate-50/50 dark:bg-neutral-900/50 rounded-xl gap-4 text-xs transition hover:border-slate-200 dark:hover:border-neutral-700">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1.5">
                                  <span className="font-bold text-slate-700 dark:text-neutral-200 text-sm truncate">
                                    You vs {opponentName}
                                  </span>
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                    result === "Victory"
                                      ? "bg-emerald-500/10 text-emerald-500"
                                      : result === "Defeat" ? "bg-red-500/10 text-red-500" : "bg-slate-500/10 text-slate-500"
                                  }`}>
                                    {result}
                                  </span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-500 dark:text-neutral-400">
                                  <span className="flex items-center gap-1.5"><Target size={12} /> {topic}</span>
                                  <span className="flex items-center gap-1.5"><Clock size={12} /> {date}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-6 justify-between md:justify-end">
                                <div className="text-left md:text-right">
                                  <span className="font-bold text-primary dark:text-purple-400 block">{xpAwarded}</span>
                                  <span className={`text-[11px] font-bold ${ratingChange.startsWith("+") ? "text-emerald-500" : "text-red-500"}`}>
                                    {ratingChange}
                                  </span>
                                </div>
                                <button
                                  onClick={() => {
                                    if (!ensureLoggedIn()) return;
                                    handleWatchLive("You", opponentName, topic);
                                  }}
                                  className="px-4 py-2 bg-white hover:bg-slate-50 dark:bg-neutral-800 dark:hover:bg-neutral-700 border border-slate-200 dark:border-neutral-700 rounded-lg font-bold transition shadow-sm text-slate-700 dark:text-neutral-200"
                                >
                                  Replay
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="p-8 text-center text-sm font-semibold text-slate-500 dark:text-neutral-400 bg-slate-50 dark:bg-neutral-900/50 rounded-xl border border-dashed border-slate-200 dark:border-neutral-700">
                        No match history available yet.
                      </div>
                    )}
                  </div>
                )}
                {activeTab === "streak" && (
                  <div className="w-full text-left space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
                    {/* Hero Section */}
                    <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-3xl p-6 relative overflow-hidden text-white flex flex-col md:flex-row items-center justify-between border border-amber-600 shadow-xl shadow-amber-500/20 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-100 fill-mode-both">
                      <div className="absolute -right-10 -bottom-10 opacity-20 pointer-events-none">
                        <Flame size={240} className="text-white" />
                      </div>
                      <div className="space-y-3 z-10 text-center md:text-left">
                        <span className="text-[10px] bg-white/20 text-white border border-white/30 font-bold uppercase tracking-wider px-2.5 py-1 rounded-full inline-block mb-1">
                          Keep The Fire Burning
                        </span>
                        <h2 className="text-3xl font-black tracking-tight drop-shadow-md">
                          Maintain Your Momentum!
                        </h2>
                        <p className="text-sm text-amber-100 max-w-md">
                          You are currently on a <strong className="text-white">{streakData?.current || 0}-day</strong> streak. 
                          Only <strong className="text-white">{Math.max(10, Math.ceil(((streakData?.current || 0) + 1) / 10) * 10) - (streakData?.current || 0)}</strong> days left to hit your next milestone. Log in and solve problems daily to keep it alive!
                        </p>
                      </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="group bg-white dark:bg-neutral-800 border border-slate-100 dark:border-neutral-800/80 rounded-2xl p-5 flex items-center gap-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-amber-500/30 animate-in zoom-in-95 duration-500 delay-200 fill-mode-both relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none group-hover:bg-amber-500/10 transition-colors duration-500"></div>
                        <div className="w-14 h-14 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0">
                          <Flame size={28} className="animate-pulse" />
                        </div>
                        <div>
                          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Current Streak</div>
                          <div className="text-2xl font-black text-slate-800 dark:text-neutral-200">{streakData?.current || 0}</div>
                        </div>
                      </div>
                      <div className="group bg-white dark:bg-neutral-800 border border-slate-100 dark:border-neutral-800/80 rounded-2xl p-5 flex items-center gap-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-primary/30 animate-in zoom-in-95 duration-500 delay-300 fill-mode-both relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none group-hover:bg-primary/10 transition-colors duration-500"></div>
                        <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                          <Trophy size={28} />
                        </div>
                        <div>
                          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Longest Streak</div>
                          <div className="text-2xl font-black text-slate-800 dark:text-neutral-200">{streakData?.longest || 0}</div>
                        </div>
                      </div>
                      <div className="group bg-white dark:bg-neutral-800 border border-slate-100 dark:border-neutral-800/80 rounded-2xl p-5 flex items-center gap-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-indigo-500/30 animate-in zoom-in-95 duration-500 delay-400 fill-mode-both relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none group-hover:bg-indigo-500/10 transition-colors duration-500"></div>
                        <div className="w-14 h-14 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 shrink-0">
                          <Calendar size={28} />
                        </div>
                        <div>
                          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Total Days Active</div>
                          <div className="text-2xl font-black text-slate-800 dark:text-neutral-200">14</div>
                        </div>
                      </div>
                    </div>

                    {/* Heatmap */}
                    <div className="bg-white dark:bg-neutral-800 border border-slate-100 dark:border-neutral-800/80 rounded-2xl p-6 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500 delay-500 fill-mode-both relative">
                      <div className="flex items-center justify-between mb-6">
                        <h5 className="text-sm font-bold text-slate-800 dark:text-neutral-200">Activity Heatmap</h5>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-slate-100 dark:bg-neutral-900 px-2 py-1 rounded-md">Last 30 Days</span>
                      </div>
                      
                      <div className="flex flex-col gap-1 overflow-x-auto pb-2">
                        {/* Heatmap Grid */}
                        <div className="flex gap-2 min-w-max">
                          {/* Day Labels */}
                          <div className="flex flex-col gap-2 pt-6 text-[10px] font-semibold text-slate-400 mr-2 justify-between">
                            <span className="h-5 flex items-center">Mon</span>
                            <span className="h-5 flex items-center">Wed</span>
                            <span className="h-5 flex items-center">Fri</span>
                          </div>
                          {Array.from({ length: 6 }).map((_, weekIdx) => {
                            // 6 columns (weeks), each 5 days (mon-fri approx) or 7 days.
                            // The original design had 30 days flat. Let's make it a realistic 7x5 or 5x6 grid.
                            // Let's use 5 weeks x 7 days = 35 days for a better layout.
                            return (
                              <div key={weekIdx} className="flex flex-col gap-2">
                                {/* Week/Month Label roughly */}
                                {weekIdx % 2 === 0 ? (
                                  <div className="text-[10px] font-semibold text-slate-400 h-4 text-center">
                                    {new Date(Date.now() - (5 - weekIdx) * 7 * 24 * 60 * 60 * 1000).toLocaleDateString(undefined, { month: 'short' })}
                                  </div>
                                ) : (
                                  <div className="h-4"></div>
                                )}
                                {Array.from({ length: 7 }).map((_, dayIdx) => {
                                  const totalDays = 35;
                                  const daysAgo = totalDays - 1 - (weekIdx * 7 + dayIdx);
                                  
                                  // Don't render future days if daysAgo < 0
                                  if (daysAgo < 0 || daysAgo >= 30) return <div key={dayIdx} className="w-5 h-5 opacity-0"></div>;

                                  const current = streakData?.current || 0;
                                  let isActive = daysAgo < current;
                                  if (!isActive) {
                                    isActive = (daysAgo * 7) % 11 < 4 && daysAgo < 25; 
                                  }
                                  
                                  const d = new Date();
                                  d.setDate(d.getDate() - daysAgo);
                                  const dateStr = d.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });
                                  
                                  // Intensity based on 'activity'
                                  const intensityClass = isActive? ((daysAgo % 3 === 0)  
                                  ? "bg-primary dark:bg-primary-light shadow-[0_0_8px_rgba(164,53,240,0.35)]"   
                                  : "bg-primary/70 dark:bg-primary-light/70 shadow-[0_0_8px_rgba(164,53,240,0.25)]")
                                  : "bg-slate-100 dark:bg-neutral-700/50";

                                  return (
                                    <div 
                                      key={dayIdx} 
                                      className={`w-5 h-5 rounded-[4px] transition-all duration-300 ${intensityClass} hover:scale-125 hover:ring-2 hover:ring-primary/50 cursor-pointer relative group`}
                                    >
                                      {/* Tooltip */}
                                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-2.5 py-1.5 bg-slate-800 text-white text-[10px] font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl flex flex-col items-center">
                                        <span>{isActive ? "Active Day 🔥" : "No Activity"}</span>
                                        <span className="text-slate-400 font-medium">{dateStr}</span>
                                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Legend */}
                      <div className="flex items-center gap-2 mt-6 justify-end text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                        <span>Less</span>
                        <div className="flex gap-1">
                          <div className="w-3 h-3 rounded-[3px] bg-slate-100 dark:bg-neutral-700/50"></div>
                          <div className="w-3 h-3 rounded-[3px] bg-primary/40"></div>
                          <div className="w-3 h-3 rounded-[3px] bg-primary/70"></div>
                          <div className="w-3 h-3 rounded-[3px] bg-primary dark:bg-primary-light"></div>
                        </div>
                        <span>More</span>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-primary to-purple-600 border border-primary/20 rounded-2xl p-6 text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-primary/20 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-700 fill-mode-both">
                      <div className="absolute -right-10 -bottom-10 opacity-20 pointer-events-none">
                        <Share2 size={200} />
                      </div>
                      <div className="relative z-10 text-center md:text-left flex-1">
                        <h5 className="text-xl font-black mb-1">Brag About Your Streak!</h5>
                        <p className="text-sm text-white/90 max-w-md">
                          You're on a <strong>{streakData?.current || 0} day</strong> coding streak! Show off your dedication to your friends and rivals.
                        </p>
                      </div>
                      <div className="relative z-10 shrink-0">
                        <button 
                          onClick={() => {
                            toast.success("Link copied to clipboard!");
                          }}
                          className="px-6 py-3 bg-white text-primary rounded-xl text-sm font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center gap-2 group"
                        >
                          <Share2 size={18} className="group-hover:scale-110 transition-transform" />
                          Share My Streak
                        </button>
                      </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl p-6 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
                      <div className="absolute -left-6 -bottom-6 opacity-5 text-indigo-500 pointer-events-none">
                        <Shield size={160} />
                      </div>
                      <div className="relative z-10 text-center md:text-left flex-1">
                        <h5 className="text-lg font-bold text-slate-800 dark:text-neutral-200 flex items-center justify-center md:justify-start gap-2">
                          <Shield size={20} className="text-indigo-500" />
                          Streak Freeze
                        </h5>
                        <p className="text-xs text-slate-500 dark:text-neutral-400 mt-2 leading-relaxed">
                          Protect your hard-earned streak! A Streak Freeze saves your streak if you miss a day of coding. It will be consumed automatically.
                        </p>
                      </div>
                      <div className="relative z-10 shrink-0">
                        {hasFreeze ? (
                          <div className="flex flex-col items-center">
                            <button 
                              onClick={() => setHasFreeze(false)}
                              className="px-6 py-2.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-500 dark:text-indigo-400 rounded-xl text-sm font-bold shadow-inner flex items-center gap-2 border border-indigo-200 dark:border-indigo-800/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition"
                            >
                              <Shield size={16} />
                              Equipped
                            </button>
                            <span className="text-[10px] text-slate-400 mt-2 font-semibold">Ready to protect your streak.</span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center">
                            <button 
                              onClick={() => {
                                if ((profile?.xp || 0) >= 500) {
                                  setHasFreeze(true);
                                  toast.success("Streak Freeze equipped!");
                                } else {
                                  toast.error("Not enough XP! You need 500 XP.");
                                }
                              }}
                              className="px-6 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-md shadow-indigo-500/20 transition flex items-center gap-2 group"
                            >
                              <Shield size={16} className="group-hover:scale-110 transition-transform" />
                              Equip Freeze
                            </button>
                            <span className="text-[10px] font-bold text-slate-500 mt-2">Cost: 500 XP</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                {activeTab === "tournaments" && (
                  <div className="w-full text-left space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
                    {/* Hero Section */}
                    <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 rounded-3xl p-8 relative overflow-hidden text-white flex flex-col md:flex-row items-center justify-between border border-indigo-500/30 shadow-2xl shadow-indigo-500/20">
                      {/* Abstract Background Shapes */}
                      <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-primary/30 rounded-full blur-3xl pointer-events-none"></div>
                      <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none"></div>
                      
                      {/* Dynamic Background Particles (Grid & Floating Orbs) */}
                      <div className="absolute inset-0 pointer-events-none overflow-hidden">
                        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
                        <div className="absolute top-[20%] left-[10%] w-2 h-2 rounded-full bg-cyan-400/40 blur-[1px] animate-pulse" style={{ animationDuration: '3s' }}></div>
                        <div className="absolute top-[60%] left-[30%] w-3 h-3 rounded-full bg-indigo-400/40 blur-[1px] animate-pulse" style={{ animationDuration: '4s' }}></div>
                        <div className="absolute top-[30%] right-[25%] w-1.5 h-1.5 rounded-full bg-cyan-300/50 blur-[1px] animate-pulse" style={{ animationDuration: '2.5s' }}></div>
                        <div className="absolute bottom-[20%] right-[15%] w-2.5 h-2.5 rounded-full bg-purple-400/40 blur-[1px] animate-pulse" style={{ animationDuration: '3.5s' }}></div>
                        <div className="absolute top-[80%] left-[50%] w-2 h-2 rounded-full bg-cyan-400/40 blur-[1px] animate-pulse" style={{ animationDuration: '2s' }}></div>
                      </div>
                      
                      <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
                        <Trophy size={300} className="text-white transform -rotate-12" />
                      </div>
                      
                      <div className="space-y-4 z-10 text-center md:text-left flex-1">
                        <span className="text-[10px] bg-white/10 text-cyan-300 border border-cyan-400/30 font-bold uppercase tracking-wider px-3 py-1.5 rounded-full inline-flex items-center gap-2 mb-2 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                          Registrations Open
                        </span>
                        <h2 className="text-4xl md:text-5xl font-black tracking-tight drop-shadow-lg leading-tight">
                          AlgoBuddy <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-primary-light">Weekly Cup</span>
                        </h2>
                        <p className="text-sm md:text-base text-indigo-200 max-w-lg font-medium">
                          Compete in our premier weekly algorithmic showdown. Solve 4 problems in 90 minutes. 
                          Win exclusive badges, massive XP, and global glory.
                        </p>
                      </div>

                      <div className="z-10 mt-8 md:mt-0 flex flex-col items-center bg-black/20 backdrop-blur-md border border-white/10 p-5 rounded-2xl">
                        <div className="flex items-center gap-2 mb-4 text-indigo-200">
                          <Clock size={16} />
                          <span className="text-xs font-bold uppercase tracking-wider">Tournament Starts In</span>
                        </div>
                        <div className="flex gap-3">
                          {[
                            { label: 'Days', value: tournamentTimeLeft.days },
                            { label: 'Hours', value: tournamentTimeLeft.hours },
                            { label: 'Mins', value: tournamentTimeLeft.minutes },
                            { label: 'Secs', value: tournamentTimeLeft.seconds }
                          ].map((unit, idx) => (
                            <div key={idx} className="flex flex-col items-center">
                              <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center border border-white/5 shadow-inner mb-2">
                                <span className={`text-xl font-black ${unit.label === 'Secs' ? 'text-cyan-400' : 'text-white'}`}>
                                  {unit.value.toString().padStart(2, '0')}
                                </span>
                              </div>
                              <span className="text-[9px] font-bold text-indigo-300 uppercase tracking-widest">{unit.label}</span>
                            </div>
                          ))}
                        </div>
                    </div>
                    </div>

                    {/* Player Stats Dashboard Card */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex flex-col border-r border-slate-100 dark:border-neutral-800 pr-4 relative group">
                        <div className="absolute inset-0 bg-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl -m-2"></div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1.5"><Trophy size={12} className="text-amber-500" /> Tournaments Won</span>
                        <span className="text-2xl font-black text-slate-800 dark:text-neutral-100">4</span>
                      </div>
                      <div className="flex flex-col md:border-r border-slate-100 dark:border-neutral-800 pr-4 relative group">
                        <div className="absolute inset-0 bg-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl -m-2"></div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1.5"><Award size={12} className="text-purple-500" /> Average Rank</span>
                        <span className="text-2xl font-black text-slate-800 dark:text-neutral-100">Top 12%</span>
                      </div>
                      <div className="flex flex-col border-r border-slate-100 dark:border-neutral-800 pr-4 relative group">
                        <div className="absolute inset-0 bg-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl -m-2"></div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1.5"><Flame size={12} className="text-red-500" /> Best Win Streak</span>
                        <span className="text-2xl font-black text-slate-800 dark:text-neutral-100">3</span>
                      </div>
                      <div className="flex flex-col relative group">
                        <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl -m-2"></div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1.5"><TrendingUp size={12} className="text-emerald-500" /> Total Earnings</span>
                        <span className="text-2xl font-black text-emerald-500 drop-shadow-sm">12,500 XP</span>
                      </div>
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-neutral-800/50 rounded-xl overflow-x-auto no-scrollbar">
                      {[
                        { id: "Live", icon: Play },
                        { id: "Upcoming", icon: Calendar },
                        { id: "Past", icon: History },
                        { id: "Bracket", icon: Trophy }
                      ].map((filter) => (
                        <button
                          key={filter.id}
                          onClick={() => setTournamentFilter(filter.id)}
                          className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-lg transition-all whitespace-nowrap ${
                            tournamentFilter === filter.id
                              ? "bg-white dark:bg-neutral-700 text-primary dark:text-primary-light shadow-sm"
                              : "text-slate-500 dark:text-neutral-400 hover:text-slate-700 dark:hover:text-neutral-300 hover:bg-slate-200/50 dark:hover:bg-neutral-700/50"
                          }`}
                        >
                          <filter.icon size={16} className={tournamentFilter === filter.id ? "text-primary dark:text-primary-light" : "opacity-70"} />
                          {filter.id}
                          {filter.id === "Live" && (
                            <span className="relative flex h-2 w-2 ml-1">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                            </span>
                          )}
                        </button>
                      ))}
                    </div>

                    {/* Content Placeholder */}
                    {tournamentFilter === "Live" ? (
                      <div className="bg-white dark:bg-neutral-800 border border-slate-100 dark:border-neutral-800/80 rounded-2xl p-5 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                          <h3 className="text-base font-bold text-slate-800 dark:text-neutral-200">Current Live Standings</h3>
                          <span className="px-2 py-1 rounded bg-red-500/10 text-red-500 text-[10px] font-black uppercase tracking-widest animate-pulse">
                            Live
                          </span>
                        </div>
                        <div className="space-y-2">
                          {[
                            { rank: 1, name: "Alex Chen", score: 400, time: "45:12" },
                            { rank: 2, name: "Sarah J.", score: 380, time: "48:05" },
                            { rank: 3, name: "Mike T.", score: 350, time: "52:10" },
                            { rank: 4, name: "You", score: 200, time: "15:00", isYou: true },
                            { rank: 5, name: "David K.", score: 180, time: "18:20" },
                          ].map((player) => (
                            <div key={player.rank} className={`flex items-center justify-between p-3 rounded-xl border ${player.isYou ? 'bg-primary/5 border-primary/30' : 'bg-slate-50 dark:bg-neutral-900/50 border-slate-100 dark:border-neutral-800'}`}>
                              <div className="flex items-center gap-4">
                                <span className={`w-6 text-center font-black ${player.rank === 1 ? 'text-amber-500' : player.rank === 2 ? 'text-slate-400' : player.rank === 3 ? 'text-orange-700' : 'text-slate-500'}`}>#{player.rank}</span>
                                <span className={`font-bold ${player.isYou ? 'text-primary' : 'text-slate-700 dark:text-neutral-200'}`}>{player.name}</span>
                              </div>
                              <div className="flex items-center gap-6 text-sm font-semibold">
                                <span className="text-slate-500 dark:text-neutral-400">{player.time}</span>
                                <span className="w-12 text-right text-slate-800 dark:text-neutral-100">{player.score} pts</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : tournamentFilter === "Upcoming" ? (
                      isLoadingTournaments ? (
                        <div className="space-y-4">
                          {[1, 2].map((i) => (
                            <div key={i} className="bg-white dark:bg-neutral-800 border border-slate-100 dark:border-neutral-800/80 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row gap-5 items-start md:items-center">
                              <div className="w-16 h-16 rounded-2xl bg-slate-200 dark:bg-neutral-700 animate-pulse shrink-0"></div>
                              <div className="flex-1 w-full space-y-3">
                                <div className="h-5 bg-slate-200 dark:bg-neutral-700 rounded w-1/3 animate-pulse"></div>
                                <div className="h-4 bg-slate-200 dark:bg-neutral-700 rounded w-2/3 animate-pulse"></div>
                                <div className="flex gap-4 pt-2">
                                  <div className="h-3 bg-slate-200 dark:bg-neutral-700 rounded w-16 animate-pulse"></div>
                                  <div className="h-3 bg-slate-200 dark:bg-neutral-700 rounded w-16 animate-pulse"></div>
                                  <div className="h-3 bg-slate-200 dark:bg-neutral-700 rounded w-24 animate-pulse"></div>
                                </div>
                              </div>
                              <div className="w-full md:w-[140px] h-24 bg-slate-200 dark:bg-neutral-700 rounded-xl animate-pulse shrink-0 mt-4 md:mt-0"></div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <TournamentCard tournament={{
                            title: "AlgoBuddy Weekly Cup",
                            status: "upcoming",
                            description: "The official weekly algorithmic showdown. Solve 4 problems in 90 minutes.",
                            date: "Sunday, 6:00 PM UTC",
                            duration: "90 mins",
                            participants: 1250,
                            prize: "10k XP + Weekly Champion Badge",
                            color: "bg-primary/5 group-hover:bg-primary/10",
                            iconBg: "bg-primary/10 text-primary"
                          }} />
                          <TournamentCard tournament={{
                            title: "Dynamic Programming Sprint",
                            status: "upcoming",
                            description: "A rapid-fire contest focusing exclusively on DP problems. 1D, 2D, and Trees.",
                            date: "Tuesday, 4:00 PM UTC",
                            duration: "60 mins",
                            participants: 840,
                            prize: "5k XP",
                            color: "bg-blue-500/5 group-hover:bg-blue-500/10",
                            iconBg: "bg-blue-500/10 text-blue-500"
                          }} />
                        </div>
                      )
                    ) : tournamentFilter === "Past" ? (
                      <div className="space-y-4">
                        {[
                          { title: "Graph Theory Masterclass", date: "Last Sunday", winner: "Alex Chen", score: "400/400", time: "38:15", yourRank: 12 },
                          { title: "Beginner's Array Challenge", date: "2 weeks ago", winner: "Sarah J.", score: "400/400", time: "42:01", yourRank: 5 },
                        ].map((past, idx) => (
                          <div key={idx} className="bg-white dark:bg-neutral-800 border border-slate-100 dark:border-neutral-800/80 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 opacity-75 hover:opacity-100 transition-opacity">
                            <div className="flex-1">
                              <h4 className="font-bold text-slate-800 dark:text-neutral-100 mb-1">{past.title}</h4>
                              <span className="text-xs text-slate-500 dark:text-neutral-400">{past.date}</span>
                            </div>
                            <div className="flex items-center gap-8 text-sm">
                              <div>
                                <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Winner</span>
                                <span className="font-bold text-slate-700 dark:text-neutral-200 flex items-center gap-1.5"><Crown size={14} className="text-amber-500" /> {past.winner}</span>
                              </div>
                              <div>
                                <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Top Score</span>
                                <span className="font-bold text-slate-700 dark:text-neutral-200">{past.score}</span>
                              </div>
                              <div className="text-right">
                                <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Your Rank</span>
                                <span className="font-bold text-primary">#{past.yourRank}</span>
                              </div>
                            </div>
                            <button className="px-4 py-2 rounded-lg border border-slate-200 dark:border-neutral-700 text-xs font-bold text-slate-600 dark:text-neutral-300 hover:bg-slate-50 dark:hover:bg-neutral-700/50 transition-colors">
                              View Full Results
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : tournamentFilter === "Bracket" ? (
                      <div className="bg-white dark:bg-neutral-800 border border-slate-100 dark:border-neutral-800/80 rounded-2xl p-6 shadow-sm overflow-x-auto">
                        <div className="min-w-[700px]">
                          <div className="flex justify-between items-center mb-8">
                            <h3 className="text-base font-bold text-slate-800 dark:text-neutral-200">Weekly Cup - Playoffs</h3>
                            <div className="flex gap-4 text-xs font-bold text-slate-500">
                              <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Winner</span>
                              <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-neutral-600"></div> Eliminated</span>
                            </div>
                          </div>
                          
                          <div className="flex justify-between relative">
                            {/* Round 1: Quarterfinals */}
                            <div className="flex flex-col justify-around h-[400px] w-64 z-10">
                              {[
                                { p1: "Alex Chen", s1: 400, p2: "David K.", s2: 320, w: 1 },
                                { p1: "Sarah J.", s1: 380, p2: "Mike T.", s2: 390, w: 2 },
                                { p1: "You", s1: 400, p2: "Anna L.", s2: 350, w: 1, isYou: true },
                                { p1: "John D.", s1: 310, p2: "Emma W.", s2: 370, w: 2 }
                              ].map((match, i) => (
                                <div key={i} className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-700 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow relative">
                                  <div className={`p-2 flex justify-between items-center text-sm ${match.w === 1 ? 'bg-emerald-50 dark:bg-emerald-900/10 font-bold text-emerald-700 dark:text-emerald-400' : 'text-slate-500 dark:text-neutral-400 opacity-70'} ${match.isYou && match.w === 1 ? 'border-l-2 border-primary' : ''}`}>
                                    <span>{match.p1}</span>
                                    <span>{match.s1}</span>
                                  </div>
                                  <div className="h-px w-full bg-slate-100 dark:bg-neutral-800"></div>
                                  <div className={`p-2 flex justify-between items-center text-sm ${match.w === 2 ? 'bg-emerald-50 dark:bg-emerald-900/10 font-bold text-emerald-700 dark:text-emerald-400' : 'text-slate-500 dark:text-neutral-400 opacity-70'} ${match.isYou && match.w === 2 ? 'border-l-2 border-primary' : ''}`}>
                                    <span>{match.p2}</span>
                                    <span>{match.s2}</span>
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Connecting Lines QF to SF */}
                            <svg className="absolute left-64 top-0 w-16 h-full pointer-events-none stroke-slate-200 dark:stroke-neutral-700 stroke-2 fill-none" preserveAspectRatio="none">
                              <path d="M0,50 L32,50 L32,150 L64,150" />
                              <path d="M0,150 L32,150" />
                              <path d="M0,250 L32,250 L32,350 L64,350" />
                              <path d="M0,350 L32,350" />
                            </svg>

                            {/* Round 2: Semifinals */}
                            <div className="flex flex-col justify-around h-[400px] w-64 ml-16 z-10">
                              {[
                                { p1: "Alex Chen", s1: 390, p2: "Mike T.", s2: 400, w: 2 },
                                { p1: "You", s1: 400, p2: "Emma W.", s2: 380, w: 1, isYou: true }
                              ].map((match, i) => (
                                <div key={i} className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-700 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow relative">
                                  <div className={`p-2 flex justify-between items-center text-sm ${match.w === 1 ? 'bg-emerald-50 dark:bg-emerald-900/10 font-bold text-emerald-700 dark:text-emerald-400' : 'text-slate-500 dark:text-neutral-400 opacity-70'} ${match.isYou && match.w === 1 ? 'border-l-2 border-primary' : ''}`}>
                                    <span>{match.p1}</span>
                                    <span>{match.s1}</span>
                                  </div>
                                  <div className="h-px w-full bg-slate-100 dark:bg-neutral-800"></div>
                                  <div className={`p-2 flex justify-between items-center text-sm ${match.w === 2 ? 'bg-emerald-50 dark:bg-emerald-900/10 font-bold text-emerald-700 dark:text-emerald-400' : 'text-slate-500 dark:text-neutral-400 opacity-70'} ${match.isYou && match.w === 2 ? 'border-l-2 border-primary' : ''}`}>
                                    <span>{match.p2}</span>
                                    <span>{match.s2}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                            
                            {/* Connecting Lines SF to Final */}
                            <svg className="absolute left-[34rem] top-0 w-16 h-full pointer-events-none stroke-slate-200 dark:stroke-neutral-700 stroke-2 fill-none" preserveAspectRatio="none">
                              <path d="M0,150 L32,150 L32,250 L64,250" />
                              <path d="M0,350 L32,350 L32,250" />
                            </svg>

                            {/* Round 3: Final */}
                            <div className="flex flex-col justify-center h-[400px] w-64 ml-16 z-10">
                              <div className="bg-white dark:bg-neutral-900 border-2 border-amber-400/50 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow relative ring-4 ring-amber-400/10">
                                <div className="absolute top-0 right-0 p-1">
                                  <Crown size={12} className="text-amber-500 opacity-50" />
                                </div>
                                <div className="p-3 flex justify-between items-center font-bold bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 text-base">
                                  <span className="flex items-center gap-2"><Trophy size={14} /> You</span>
                                  <span>400</span>
                                </div>
                                <div className="h-px w-full bg-amber-200 dark:bg-amber-900/50"></div>
                                <div className="p-3 flex justify-between items-center text-sm text-slate-500 dark:text-neutral-400 opacity-70">
                                  <span>Mike T.</span>
                                  <span>395</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </div>
                )}
                
                {activeTab === "badges" && (
                  <div className="w-full text-left space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
                    {/* Hero Section */}
                    <div className="bg-gradient-to-br from-amber-600 via-orange-500 to-red-500 rounded-3xl p-8 relative overflow-hidden text-white flex flex-col md:flex-row items-center justify-between shadow-2xl shadow-orange-500/20">
                      {/* Abstract Background Shapes */}
                      <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-white/20 rounded-full blur-3xl pointer-events-none"></div>
                      <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-yellow-400/20 rounded-full blur-3xl pointer-events-none"></div>
                      
                      <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
                        <Crown size={300} className="text-white transform rotate-12" />
                      </div>
                      
                      <div className="space-y-4 z-10 text-center md:text-left flex-1">
                        <span className="text-[10px] bg-white/20 text-white font-bold uppercase tracking-wider px-3 py-1.5 rounded-full inline-block mb-2 backdrop-blur-sm border border-white/30 shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                          Achievement Unlocked
                        </span>
                        <h2 className="text-4xl md:text-5xl font-black tracking-tight drop-shadow-md">
                          Your Badges
                        </h2>
                        <p className="text-orange-100 max-w-lg text-sm md:text-base font-medium drop-shadow">
                          Showcase your algorithmic mastery. Earn exclusive badges by completing challenges, winning tournaments, and maintaining long streaks.
                        </p>
                      </div>
                      
                      <div className="mt-8 md:mt-0 z-10 bg-white/10 p-5 rounded-2xl backdrop-blur-md border border-white/20 flex flex-col items-center min-w-[160px] shadow-xl">
                        <span className="text-xs font-bold uppercase tracking-wider text-orange-200 mb-2">Total Earned</span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-5xl font-black text-white drop-shadow-md">12</span>
                          <span className="text-lg font-bold text-orange-300">/ 50</span>
                        </div>
                      </div>
                    </div>

                    {/* Badge Category Filters */}
                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
                      {["All", "Combat", "Learning", "Tournaments"].map((category) => (
                        <button
                          key={category}
                          onClick={() => setBadgeCategory(category)}
                          className={`px-4 py-2 rounded-full text-xs font-bold transition-colors ${
                            badgeCategory === category
                              ? "bg-slate-800 text-white dark:bg-white dark:text-slate-900 shadow-md"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700 border border-slate-200 dark:border-neutral-700"
                          }`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>

                    {/* Badges Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {[
                        { title: "First Blood", desc: "Win your first duel", icon: <Award size={24} />, earned: true, color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20" },
                        { title: "Hot Streak", desc: "Win 3 duels in a row", icon: <Flame size={24} />, earned: true, color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/20" },
                        { title: "Speed Demon", desc: "Solve under 2 minutes", icon: <Zap size={24} />, earned: true, color: "text-yellow-500", bg: "bg-yellow-500/10", border: "border-yellow-500/20" },
                        { title: "Champion", desc: "Win a weekly tournament", icon: <Trophy size={24} />, earned: false, color: "text-slate-400", bg: "bg-slate-100 dark:bg-neutral-800", border: "border-slate-200 dark:border-neutral-700" },
                        { title: "Flawless", desc: "No syntax errors in a match", icon: <Star size={24} />, earned: false, color: "text-slate-400", bg: "bg-slate-100 dark:bg-neutral-800", border: "border-slate-200 dark:border-neutral-700" },
                        { title: "Grandmaster", desc: "Reach 10,000 XP", icon: <Crown size={24} />, earned: false, color: "text-slate-400", bg: "bg-slate-100 dark:bg-neutral-800", border: "border-slate-200 dark:border-neutral-700" },
                        { title: "Defender", desc: "Block 5 hacks", icon: <ShieldCheck size={24} />, earned: true, color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
                        { title: "Veteran", desc: "Play 100 matches", icon: <Users size={24} />, earned: false, color: "text-slate-400", bg: "bg-slate-100 dark:bg-neutral-800", border: "border-slate-200 dark:border-neutral-700" },
                      ].map((badge, idx) => (
                        <div key={idx} className={`relative p-5 rounded-2xl border flex flex-col items-center text-center transition-all duration-300 ${badge.earned ? `${badge.border} bg-white dark:bg-neutral-800 shadow-sm hover:shadow-md hover:-translate-y-1` : `${badge.border} ${badge.bg} opacity-60 grayscale hover:grayscale-0`}`}>
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${badge.bg} ${badge.color}`}>
                            {badge.icon}
                          </div>
                          <h4 className={`font-bold text-sm mb-1 ${badge.earned ? 'text-slate-800 dark:text-neutral-100' : 'text-slate-500 dark:text-neutral-400'}`}>{badge.title}</h4>
                          <p className="text-[10px] text-slate-500 dark:text-neutral-400 leading-tight">{badge.desc}</p>
                          {!badge.earned && (
                            <div className="absolute inset-0 flex items-center justify-center bg-slate-900/5 dark:bg-black/20 rounded-2xl opacity-0 hover:opacity-100 transition-opacity">
                              <span className="text-xs font-bold text-slate-700 dark:text-neutral-300 bg-white/90 dark:bg-neutral-800/90 px-2 py-1 rounded shadow-sm backdrop-blur-sm">Locked</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </main>

          {/* ─── Column 3: Right Sidebar ───────────────────────────────────────── */}
          <aside className="space-y-6 lg:sticky lg:top-24 h-max">
            {/* Daily Streak Card */}
            <div className="bg-white dark:bg-neutral-800 border border-slate-100 dark:border-neutral-800/80 rounded-2xl p-5 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none group-hover:bg-amber-500/10 transition-colors duration-500"></div>

              <div className="flex items-center justify-between mb-4 relative z-10">
                <h3 className="text-sm font-bold text-slate-800 dark:text-neutral-200 flex items-center gap-2">
                  <Flame size={16} className="text-amber-500" />
                  Daily Streak
                </h3>
                <span className="text-[10px] bg-amber-500/10 text-amber-600 dark:text-amber-400 font-black uppercase tracking-widest px-2 py-0.5 rounded-md border border-amber-500/20">
                  Goal: {Math.max(10, Math.ceil(((streakData?.current || 0) + 1) / 10) * 10)}d
                </span>
              </div>

              <div className="flex items-center gap-3 bg-gradient-to-r from-amber-500/10 to-transparent p-4 border border-amber-500/20 rounded-xl mb-4 text-amber-500 relative z-10">
                <div className="w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center shrink-0">
                  <Flame size={24} className={(streakData?.current || 0) > 0 ? "animate-pulse drop-shadow-md" : "opacity-50"} />
                </div>
                <div>
                  <div className="text-2xl font-black leading-none drop-shadow-sm">{streakData?.current || 0} Days</div>
                  <span className="text-[10px] text-slate-500 dark:text-neutral-400 block mt-1 font-semibold">
                    Keep it up! Next milestone: {Math.max(10, Math.ceil(((streakData?.current || 0) + 1) / 10) * 10)} days
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center text-center gap-1 mt-2 relative z-10">
                {["S", "M", "T", "W", "T", "F", "S"].map((day, idx) => {
                  const today = new Date();
                  const currentDay = today.getDay();
                  const diff = idx - currentDay;
                  const dateToCheck = new Date();
                  dateToCheck.setDate(today.getDate() + diff);
                  
                  const isFuture = diff > 0;
                  const isActive = !isFuture && -diff < (streakData?.current || 0);
                  
                  return (
                    <div key={idx} className="flex flex-col items-center group/day">
                      <span className={`text-[10px] block mb-1.5 font-bold uppercase ${diff === 0 ? "text-amber-500 dark:text-amber-400" : "text-slate-400 dark:text-neutral-500 group-hover/day:text-slate-600 dark:group-hover/day:text-neutral-300 transition-colors"}`}>{day}</span>
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${isActive
                          ? "bg-amber-500 text-white shadow-md shadow-amber-500/30 scale-110"
                          : isFuture ? "bg-slate-50 dark:bg-neutral-900/50 text-slate-300 dark:text-neutral-700" : "bg-slate-100 dark:bg-neutral-900 text-slate-400 dark:text-neutral-600 hover:bg-slate-200 dark:hover:bg-neutral-800"
                        }`}>
                        {isActive ? "🔥" : "•"}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Leaderboard Table */}
            <div className="bg-white dark:bg-neutral-800 border border-slate-100 dark:border-neutral-800/80 rounded-2xl p-5 shadow-sm flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-800 dark:text-neutral-200 flex items-center gap-2">
                  <Trophy size={16} className="text-primary" />
                  Global Leaderboard
                </h3>
                <button
                  onClick={() => handleTabChange("leaderboard")}
                  className="text-[10px] text-primary dark:text-primary-light font-bold uppercase tracking-widest hover:bg-primary/10 px-2 py-1 rounded transition-colors"
                >
                  View All
                </button>
              </div>

              <div className="space-y-1">
                {leaderboard && leaderboard.length > 0 ? (
                  leaderboard.slice(0, 10).map((row, idx) => {
                    const rank = row.rank || idx + 1;
                    const name = row.name || (row.userId ? `User ${row.userId.substring(0, 4)}` : "Unknown");
                    const isCurrentUser = name === currentUserStats.name;
                    return (
                      <div
                        key={rank}
                        className={`flex items-center justify-between text-xs px-2.5 py-2 rounded-lg transition-all
                        ${isCurrentUser
                            ? "bg-primary/10 border border-primary/20 shadow-sm"
                            : "hover:bg-slate-50 dark:hover:bg-neutral-700/50 border border-transparent"
                          }
                        `}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`w-4 text-center font-black ${rank === 1 ? "text-amber-500" : rank === 2 ? "text-slate-400" : rank === 3 ? "text-orange-700" : "text-slate-400 dark:text-neutral-500"
                            }`}>
                            {rank}
                          </span>
                          <div className={`w-7 h-7 rounded-full bg-slate-200 dark:bg-neutral-700 flex items-center justify-center font-bold text-[9px] text-slate-600 dark:text-neutral-300 overflow-hidden shrink-0 ${rank === 1 ? "ring-2 ring-amber-400/50" : ""}`}>
                            {row.avatarUrl ? (
                              <img src={row.avatarUrl} alt={name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                            ) : (
                              getInitials(name)
                            )}
                          </div>
                          <span className={`font-bold truncate max-w-[120px] ${isCurrentUser ? "text-primary dark:text-primary-light" : "text-slate-700 dark:text-neutral-300"}`}>{name}</span>
                        </div>
                        <span className={`font-black ${isCurrentUser ? "text-primary" : "text-slate-800 dark:text-neutral-200"}`}>{row.rating}</span>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-4 text-center text-xs font-semibold text-slate-500 dark:text-neutral-400 bg-slate-50 dark:bg-neutral-900/50 rounded-xl border border-dashed border-slate-200 dark:border-neutral-700">
                    Leaderboard is currently empty.
                  </div>
                )}
              </div>
            </div>

            {/* Rules & Scoring Accordion */}
            <div className="bg-white dark:bg-neutral-800 border border-slate-100 dark:border-neutral-800/80 rounded-2xl p-5 shadow-sm">
              <h3 className="text-sm font-bold text-slate-800 dark:text-neutral-200 flex items-center gap-2 mb-4">
                <ShieldCheck size={16} className="text-emerald-500" />
                Rules & Scoring
              </h3>
              
              <div className="space-y-2">
                {[
                  { q: "How is XP calculated?", a: "XP is based on problem difficulty, execution speed, and optimal memory usage. First solver bonus applies." },
                  { q: "Penalty for wrong submissions?", a: "Each incorrect submission adds a 5-minute time penalty to your total duration." },
                  { q: "Can I use external libraries?", a: "Only standard language libraries are allowed. External dependencies will cause compilation errors." },
                  { q: "How does matchmaking work?", a: "You are matched with opponents within ±100 rating points to ensure fair competition." }
                ].map((rule, idx) => (
                  <details key={idx} className="group border border-slate-200 dark:border-neutral-700 rounded-lg bg-slate-50 dark:bg-neutral-900/50 open:bg-white dark:open:bg-neutral-800 transition-colors">
                    <summary className="flex items-center justify-between p-3 cursor-pointer list-none font-bold text-xs text-slate-700 dark:text-neutral-300 group-open:text-primary dark:group-open:text-primary-light select-none">
                      {rule.q}
                      <span className="transition-transform duration-200 group-open:rotate-90">
                        <ChevronRight size={14} className="text-slate-400 group-open:text-primary" />
                      </span>
                    </summary>
                    <div className="px-3 pb-3 pt-1 text-[11px] text-slate-500 dark:text-neutral-400 leading-relaxed">
                      {rule.a}
                    </div>
                  </details>
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
        onClose={() => closeMatchmakingModal()}
        isRanked={matchmakingOptions.isRanked || false}
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
        onClose={closeCreateDuelModal}
        onCreateMatch={handleCreateMatchLaunch}
        currentUserStats={currentUserStats}
        initialTopic={duelTopic}
        initialDifficulty={duelDifficulty}
        initialTimeLimit={duelTime}
        initialWager={duelWager}
        initialMode={duelMode}
        initialPublic={duelPublic}
      />

      <SpectatorSimulatorModal
        isOpen={spectatorModalOpen}
        onClose={() => {
          setSpectatorModalOpen(false);
          setSpectatingMatch(null);
        }}
        matchData={spectatingMatch}
      />
    </section>
  );
}
