"use client";
import dynamic from "next/dynamic";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useUser } from "@/features/user/UserContext";
import { toast } from "react-hot-toast";
import UpcomingTournament from "@/app/components/ui/UpcomingTournament";
import TournamentCard from "@/app/components/ui/TournamentCard";
import ActivityHeatmap from "@/app/components/ui/ActivityHeatmap";
import Footer from "@/app/components/footer";
import BadgesTab from "./tabs/BadgesTab";
import LeaderboardTab from "./tabs/LeaderboardTab";
import HistoryTab from "./tabs/HistoryTab";
import TournamentsTab from "./tabs/TournamentsTab";
import FriendTab from "./tabs/FriendTab";
import StreakTab from "./tabs/StreakTab";
import RankedTab from "./tabs/RankedTab";
import LiveTab from "./tabs/LiveTab";
import HomeTab from "./tabs/HomeTab";

// Lazy Load Heavy Modals to significantly reduce Initial JS Bundle size
const MatchmakingModal = dynamic(() => import("@/app/components/ui/MatchmakingModal"), { ssr: false });
const DuelSimulatorModal = dynamic(() => import("@/app/components/ui/DuelSimulatorModal"), { ssr: false });
const SpectatorSimulatorModal = dynamic(() => import("@/app/components/ui/SpectatorSimulatorModal"), { ssr: false });
const CreateDuelModal = dynamic(() => import("@/app/components/ui/CreateDuelModal"), { ssr: false });
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
                  <HomeTab 
                    profile={profile}
                    currentUserStats={currentUserStats}
                    leaderboard={leaderboard}
                    openMatchmakingModal={openMatchmakingModal}
                    openCreateDuelModal={openCreateDuelModal}
                    matchHistory={matchHistory}
                    handleTabChange={handleTabChange}
                    handleWatchLive={handleWatchLive}
                    ensureLoggedIn={ensureLoggedIn}
                  />
                )}

            {activeTab !== "home" && (
              <div className="bg-white dark:bg-neutral-800 border border-slate-100 dark:border-neutral-800/80 rounded-2xl p-6 shadow-sm">


                {activeTab === "live" && (
                  <LiveTab 
                    liveMatches={liveMatches}
                    handleWatchLive={handleWatchLive}
                  />
                )}

                {activeTab === "ranked" && (
                  <RankedTab 
                    profile={profile}
                    rankProgress={rankProgress}
                    ringDashoffset={ringDashoffset}
                    ringCircumference={ringCircumference}
                    openMatchmakingModal={openMatchmakingModal}
                    currentRank={currentRank}
                    rankedMatches={rankedMatches}
                  />
                )}

                {activeTab === "friend" && (
                  <FriendTab 
                    joinCode={joinCode}
                    setJoinCode={setJoinCode}
                    openCreateDuelModal={openCreateDuelModal}
                  />
                )}

                {activeTab === "leaderboard" && (
                  <LeaderboardTab leaderboard={leaderboard} leaderboardFilter={leaderboardFilter} setLeaderboardFilter={setLeaderboardFilter} searchQuery={searchQuery} setSearchQuery={setSearchQuery} expandedRow={expandedRow} setExpandedRow={setExpandedRow} profile={profile} />
                )}
                {activeTab === "history" && (
                  <HistoryTab />
                )}
                {activeTab === "streak" && (
                  <StreakTab profile={profile} />
                )}
                {activeTab === "tournaments" && (
                  <TournamentsTab 
                    tournamentFilter={tournamentFilter}
                    setTournamentFilter={setTournamentFilter}
                    tournamentTimeLeft={tournamentTimeLeft}
                    isLoadingTournaments={isLoadingTournaments}
                  />
                )}
                
                {activeTab === "badges" && (
                  <BadgesTab badgeCategory={badgeCategory} setBadgeCategory={setBadgeCategory} />
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
