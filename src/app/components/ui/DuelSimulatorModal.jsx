"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Play, Pause, RotateCcw, AlertTriangle, CheckCircle, Terminal, RefreshCw } from "lucide-react";

const USER_CODE_LINES = [
  "# Reversing singly-linked list",
  "class Solution:",
  "    def reverseList(self, head: ListNode) -> ListNode:",
  "        prev = None",
  "        curr = head",
  "        while curr:",
  "            next_node = curr.next",
  "            curr.next = prev",
  "            prev = curr",
  "            curr = next_node",
  "        return prev"
];

const OPPONENT_CODE_LINES = [
  "# Reverse linked list",
  "class Solution:",
  "    def reverseList(self, head: ListNode) -> ListNode:",
  "        prev = None",
  "        curr = head",
  "        while curr:",
  "            # Temp store next node",
  "            nxt = curr.next",
  "            curr.next = prev",
  "            prev = curr",
  "            curr = nxt",
  "        return prev"
];

const MOCK_EVENTS = [
  { time: 5, text: "You initialized variables prev and curr." },
  { time: 10, text: "Opponent started working on iteration loop." },
  { time: 15, text: "You compile-tested solution. Compilation failed: ListNode undefined." },
  { time: 22, text: "You corrected type definition for ListNode." },
  { time: 28, text: "Opponent compiled logic. 5/10 test cases passed." },
  { time: 35, text: "You compile-tested solution. 8/10 test cases passed." },
  { time: 42, text: "Opponent optimized list reversal loop." },
  { time: 48, text: "You passed all 10/10 test cases! (Optimal O(N) Time, O(1) Space)" },
  { time: 54, text: "Opponent passed all 10/10 test cases." },
];

export default function DuelSimulatorModal({ isOpen, onClose, opponent, currentUserStats, problemName = "Reverse Linked List" }) {
  const [seconds, setSeconds] = useState(0);
  const [userCode, setUserCode] = useState("");
  const [oppCode, setOppCode] = useState("");
  const [userTestCases, setUserTestCases] = useState(0);
  const [oppTestCases, setOppTestCases] = useState(0);
  const [logs, setLogs] = useState(["[00:00] Duel started. Let the battle begin!"]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [battleFinished, setBattleFinished] = useState(false);
  const [victoryState, setVictoryState] = useState(null); // victory, defeat

  const logContainerRef = useRef(null);

  // Formatting time helper
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // Auto-scroll logs
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  // Main game loop
  useEffect(() => {
    if (!isOpen) {
      setSeconds(0);
      setUserCode("");
      setOppCode("");
      setUserTestCases(0);
      setOppTestCases(0);
      setLogs(["[00:00] Duel started. Let the battle begin!"]);
      setBattleFinished(false);
      setVictoryState(null);
      return;
    }

    if (!isPlaying || battleFinished) return;

    const gameInterval = setInterval(() => {
      setSeconds((prevSecs) => {
        const nextSecs = prevSecs + 1;

        // 1. Append code lines based on timer
        const userLineIdx = Math.floor(nextSecs / 5);
        if (userLineIdx < USER_CODE_LINES.length) {
          setUserCode(USER_CODE_LINES.slice(0, userLineIdx + 1).join("\n"));
        }

        const oppLineIdx = Math.floor(nextSecs / 6);
        if (oppLineIdx < OPPONENT_CODE_LINES.length) {
          setOppCode(OPPONENT_CODE_LINES.slice(0, oppLineIdx + 1).join("\n"));
        }

        // 2. Mock logs and test cases progress
        const currentEvent = MOCK_EVENTS.find((e) => e.time === nextSecs);
        if (currentEvent) {
          setLogs((prev) => [...prev, `[${formatTime(nextSecs)}] ${currentEvent.text}`]);
          
          if (currentEvent.text.includes("You compile-tested") || currentEvent.text.includes("You passed")) {
            const match = currentEvent.text.match(/(\d+)\/10/);
            if (match) setUserTestCases(parseInt(match[1]));
          }
          if (currentEvent.text.includes("Opponent compiled") || currentEvent.text.includes("Opponent passed")) {
            const match = currentEvent.text.match(/(\d+)\/10/);
            if (match) setOppTestCases(parseInt(match[1]));
          }
        }

        // 3. Check for victory condition
        if (nextSecs >= 48 && !battleFinished) {
          setBattleFinished(true);
          setVictoryState("victory");
          setLogs((prev) => [...prev, `[${formatTime(nextSecs)}] VICTORY! You won the battle!`]);
          clearInterval(gameInterval);
        }

        return nextSecs;
      });
    }, 1000);

    return () => clearInterval(gameInterval);
  }, [isOpen, isPlaying, battleFinished]);

  if (!isOpen) return null;

  const currentUsername = currentUserStats?.name || "You";
  const opponentName = opponent?.name || "Opponent";

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[10100] flex flex-col bg-slate-950 text-slate-100 overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900/90 border-b border-slate-800 shadow-md">
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <h3 className="text-sm font-extrabold text-slate-200 tracking-wider uppercase">
              Live Duel Arena
            </h3>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 font-semibold">
              {problemName} (Easy)
            </span>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-center">
              <span className="text-xs text-slate-400 block uppercase tracking-wider font-semibold">Time Elapsed</span>
              <span className="text-lg font-mono font-bold text-primary dark:text-purple-400">
                {formatTime(seconds)}
              </span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
                title={isPlaying ? "Pause Duel" : "Resume Duel"}
              >
                {isPlaying ? <Pause size={16} /> : <Play size={16} />}
              </button>
              <button
                onClick={onClose}
                className="p-2 bg-slate-800 hover:bg-red-500 hover:text-white text-slate-300 rounded-lg transition"
                title="Exit Battle"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Split Code Editors Area */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-px bg-slate-800/80 overflow-hidden">
          {/* Left panel (User) */}
          <div className="flex flex-col bg-[#0d0e12] overflow-hidden relative">
            <div className="flex items-center justify-between px-4 py-2 bg-slate-900/40 border-b border-slate-900">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                {currentUsername} (You)
              </span>
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                Test Cases: {userTestCases}/10
              </span>
            </div>
            
            <pre className="flex-1 p-4 font-mono text-xs overflow-auto leading-relaxed select-none text-slate-300">
              <code>{userCode || "# Awaiting skeleton initialize..."}</code>
            </pre>
          </div>

          {/* Right panel (Opponent) */}
          <div className="flex flex-col bg-[#0d0e12] overflow-hidden relative">
            <div className="flex items-center justify-between px-4 py-2 bg-slate-900/40 border-b border-slate-900">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-600" />
                {opponentName}
              </span>
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                Test Cases: {oppTestCases}/10
              </span>
            </div>

            <pre className="flex-1 p-4 font-mono text-xs overflow-auto leading-relaxed select-none text-slate-300">
              <code>{oppCode || "# Awaiting skeleton initialize..."}</code>
            </pre>
          </div>
        </div>

        {/* Bottom Console Panel */}
        <div className="h-44 bg-slate-900 border-t border-slate-800 flex flex-col overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-950 border-b border-slate-900 shrink-0 text-slate-400">
            <Terminal size={14} />
            <span className="text-xs font-semibold uppercase tracking-wider">Live Event Stream Log</span>
          </div>

          <div
            ref={logContainerRef}
            className="flex-1 p-4 overflow-y-auto space-y-1.5 font-mono text-xs text-slate-300"
          >
            {logs.map((log, index) => (
              <div
                key={index}
                className={
                  log.includes("VICTORY")
                    ? "text-emerald-400 font-bold"
                    : log.includes("failed")
                    ? "text-red-400"
                    : "text-slate-300"
                }
              >
                {log}
              </div>
            ))}
          </div>
        </div>

        {/* Victory Overlay Screen */}
        <AnimatePresence>
          {battleFinished && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md"
            >
              <motion.div
                initial={{ scale: 0.9, y: 15 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 15 }}
                className="w-full max-w-sm text-center p-6 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl"
              >
                <div className="flex justify-center mb-4">
                  <CheckCircle className="w-16 h-16 text-emerald-400 animate-bounce" />
                </div>

                <h2 className="text-2xl font-extrabold text-white mb-2">Victory!</h2>
                <p className="text-sm text-slate-400 mb-6">
                  You solved **{problemName}** in {formatTime(seconds)} and defeated **{opponentName}**!
                </p>

                <div className="flex flex-col gap-2.5 mb-6 bg-slate-950/40 p-4 border border-slate-800/80 rounded-xl text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">XP Gained</span>
                    <span className="font-bold text-primary dark:text-purple-400">+50 XP</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Rating Change</span>
                    <span className="font-bold text-emerald-400">+25 Rating</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={onClose}
                    className="flex-1 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-sm font-semibold transition"
                  >
                    Return to Arena
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AnimatePresence>
  );
}
