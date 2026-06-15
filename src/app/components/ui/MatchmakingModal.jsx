"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, Award, Shield, Zap } from "lucide-react";
import { io } from "socket.io-client";

// MOCK fallback just in case
const MOCK_OPPONENTS = [
  { name: "Aryan", rating: 2450, level: 17, avatar: "A", title: "Binary Search Master" },
  { name: "Aditya", rating: 2200, level: 16, avatar: "AD", title: "Speed Demon" },
  { name: "Rahul", rating: 2130, level: 15, avatar: "R", title: "Streak God" },
  { name: "Ananya", rating: 2105, level: 15, avatar: "AN", title: "Consistency King" },
  { name: "Rohit", rating: 1950, level: 14, avatar: "RO", title: "Recursion Ninja" },
];

const SEARCH_STATUSES = [
  "Searching for developer...",
  "Matching based on rating...",
  "Analyzing queue activity...",
  "Expanding search criteria...",
];

export default function MatchmakingModal({ isOpen, onClose, onMatchFound, currentUserStats }) {
  const [seconds, setSeconds] = useState(0);
  const [statusIdx, setStatusIdx] = useState(0);
  const [matchState, setMatchState] = useState("searching"); // searching, matched
  const [matchedOpponent, setMatchedOpponent] = useState(null);

  useEffect(() => {
    if (!isOpen) {
      setSeconds(0);
      setStatusIdx(0);
      setMatchState("searching");
      setMatchedOpponent(null);
      return;
    }

    const timer = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);

    const statusTimer = setInterval(() => {
      setStatusIdx((prev) => (prev < SEARCH_STATUSES.length - 1 ? prev + 1 : prev));
    }, 1800);

    const socketUrl = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
      ? "http://127.0.0.1:4000"
      : "https://algobuddy-socket-server.onrender.com";

    // Establish Socket connection
    const socket = io(socketUrl, {
      transports: ["websocket", "polling"]
    });

    socket.on("connect_error", (err) => {
      console.log("Socket Connection Error (Safe to ignore in dev):", err.message);
    });

    socket.on("connect", () => {
      console.log("Connected to Arena Socket Server:", socket.id);
      socket.emit("join_matchmaking", {
        userId: currentUserStats?.userId || "user-" + Math.random(),
        name: currentUserStats?.name || "Player",
        rating: currentUserStats?.rating || 1200,
        level: currentUserStats?.level || 1,
        topic: "Arrays", // In the future, this could be selectable
        difficulty: "Easy"
      });
    });

    socket.on("match_found", (matchDetails) => {
      console.log("Match found!", matchDetails);
      // Find the opponent from the matchDetails.players array
      const opponentData = matchDetails.players.find(p => p.socketId !== socket.id) || matchDetails.players[0];
      
      const opponent = {
        userId: opponentData.userId,
        name: opponentData.name,
        rating: opponentData.rating || 1200,
        level: opponentData.level || 1,
        avatar: opponentData.name.slice(0, 2).toUpperCase(),
        title: "Challenger",
        matchId: matchDetails.matchId,
        topic: matchDetails.topic
      };

      setMatchedOpponent(opponent);
      setMatchState("matched");
      clearInterval(timer);
      clearInterval(statusTimer);

      // Auto-start duel after 3 seconds of matched display
      setTimeout(() => {
        onMatchFound({ ...opponent, matchId: matchDetails.matchId });
      }, 3000);
    });

    return () => {
      clearInterval(timer);
      clearInterval(statusTimer);
      socket.emit("leave_matchmaking");
      socket.disconnect();
    };
  }, [isOpen, onMatchFound, currentUserStats]);

  if (!isOpen) return null;

  const currentUsername = currentUserStats?.name || "You";
  const currentUserRating = currentUserStats?.rating || 1620;
  const currentUserLevel = currentUserStats?.level || 17;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[10100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm"
        />

        {/* Panel Container */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-lg bg-white dark:bg-neutral-900 border border-slate-100 dark:border-neutral-800 rounded-3xl p-6 shadow-2xl overflow-hidden z-10"
        >
          {/* Header */}
          <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-neutral-800/80 mb-6">
            <h3 className="text-lg font-bold text-slate-800 dark:text-neutral-200">
              {matchState === "searching" ? "Finding DSA Match" : "Match Confirmed!"}
            </h3>
            {matchState === "searching" && (
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-50 dark:hover:bg-neutral-800 transition"
              >
                <X size={18} />
              </button>
            )}
          </div>

          {matchState === "searching" ? (
            <div className="flex flex-col items-center py-6 text-center">
              <div className="relative flex items-center justify-center w-20 h-20 mb-6">
                <Loader2 className="w-16 h-16 text-primary dark:text-purple-400 animate-spin" />
                <span className="absolute text-xs font-bold text-slate-600 dark:text-neutral-300">
                  {seconds}s
                </span>
              </div>

              <motion.p
                key={statusIdx}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm font-semibold text-slate-700 dark:text-neutral-300 min-h-[20px]"
              >
                {SEARCH_STATUSES[statusIdx]}
              </motion.p>

              <p className="text-xs text-slate-400 dark:text-neutral-500 mt-2">
                Searching for players close to Rating {currentUserRating}...
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center py-4">
              <div className="flex w-full items-center justify-around gap-4 mb-6">
                {/* User Card */}
                <div className="flex flex-col items-center text-center p-4 border border-slate-100 dark:border-neutral-800 bg-slate-50/50 dark:bg-neutral-900/20 rounded-2xl w-[42%]">
                  <div className="w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center text-lg font-bold shadow-md mb-3 border-2 border-white dark:border-neutral-900">
                    {currentUsername.slice(0, 2).toUpperCase()}
                  </div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-neutral-200 truncate w-full">
                    {currentUsername}
                  </h4>
                  <div className="flex items-center gap-1 text-[10px] text-slate-500 dark:text-neutral-400 mt-1">
                    <Zap size={10} className="text-yellow-500" />
                    <span>Lvl {currentUserLevel}</span>
                  </div>
                  <div className="text-xs font-semibold text-primary dark:text-purple-400 mt-2">
                    Rating {currentUserRating}
                  </div>
                </div>

                {/* VS Badge */}
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-sm shadow-md animate-bounce">
                    VS
                  </div>
                </div>

                {/* Opponent Card */}
                <div className="flex flex-col items-center text-center p-4 border border-slate-100 dark:border-neutral-800 bg-slate-50/50 dark:bg-neutral-900/20 rounded-2xl w-[42%]">
                  <div className="w-14 h-14 rounded-full bg-purple-600 text-white flex items-center justify-center text-lg font-bold shadow-md mb-3 border-2 border-white dark:border-neutral-900">
                    {matchedOpponent?.avatar}
                  </div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-neutral-200 truncate w-full">
                    {matchedOpponent?.name}
                  </h4>
                  <div className="flex items-center gap-1 text-[10px] text-slate-500 dark:text-neutral-400 mt-1">
                    <Zap size={10} className="text-yellow-500" />
                    <span>Lvl {matchedOpponent?.level}</span>
                  </div>
                  <div className="text-xs font-semibold text-primary dark:text-purple-400 mt-2">
                    Rating {matchedOpponent?.rating}
                  </div>
                </div>
              </div>

              <div className="w-full bg-purple-500/10 border border-purple-500/20 text-purple-700 dark:text-purple-400 rounded-xl p-3 text-center text-xs font-semibold animate-pulse mb-2">
                Starting duel in 3 seconds... Prepare yourself!
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
