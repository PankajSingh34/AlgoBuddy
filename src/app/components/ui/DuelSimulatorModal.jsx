"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Play, AlertTriangle, CheckCircle, Terminal } from "lucide-react";
import { Editor } from "@monaco-editor/react";
import { io } from "socket.io-client";

export default function DuelSimulatorModal({ isOpen, onClose, opponent, currentUserStats, problemName = "Two Sum" }) {
  const [seconds, setSeconds] = useState(0);
  const [userCode, setUserCode] = useState(`function twoSum(nums, target) {\n    // Write your code here\n    \n}`);
  const [oppCode, setOppCode] = useState(`// Opponent is preparing...`);
  const [userOutput, setUserOutput] = useState("");
  const [oppStatus, setOppStatus] = useState("Idle");
  const [logs, setLogs] = useState(["[00:00] Duel started. Let the battle begin!"]);
  const [battleFinished, setBattleFinished] = useState(false);
  const [victoryState, setVictoryState] = useState(null); // "victory" or "defeat"
  const [isExecuting, setIsExecuting] = useState(false);
  const [socket, setSocket] = useState(null);

  const logContainerRef = useRef(null);

  // Formatting time helper
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const addLog = (msg) => {
    setLogs((prev) => [...prev, `[${formatTime(seconds)}] ${msg}`]);
  };

  // Auto-scroll logs
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  // Main game timer
  useEffect(() => {
    if (!isOpen || battleFinished) return;
    const timer = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(timer);
  }, [isOpen, battleFinished]);

  // Socket Connection
  useEffect(() => {
    if (!isOpen) return;

    const socketUrl = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
      ? "http://127.0.0.1:4000"
      : "https://algobuddy-socket-server.onrender.com";

    const newSocket = io(socketUrl, {
      transports: ["websocket", "polling"],
      auth: async (cb) => {
        try {
          const { supabase } = await import('@/lib/supabase');
          const { data: sessionData } = await supabase.auth.getSession();
          cb({ token: sessionData?.session?.access_token || null });
        } catch {
          cb({ token: null });
        }
      }
    });
    setSocket(newSocket);

    // Join room when connected
    newSocket.on("connect", async () => {
      if (opponent?.matchId) {
         newSocket.emit("join_match", { matchId: opponent.matchId });

         const { supabase } = await import('@/lib/supabase');
         const { data: sessionData } = await supabase.auth.getSession();
         const token = sessionData?.session?.access_token;
         if (token) {
           const springBootBase = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" 
             ? "http://localhost:8080" 
             : "https://algobuddy-backend-7iwv.onrender.com";
           try {
             await fetch(`${springBootBase}/api/v1/arena/match/init`, {
               method: "POST",
               headers: {
                 "Content-Type": "application/json",
                 Authorization: `Bearer ${token}`
               },
               body: JSON.stringify({
                 matchId: opponent.matchId,
                 opponentId: opponent.userId,
                 topic: opponent.topic || "Arrays",
                 difficulty: "Easy"
               })
             });
           } catch (e) {
             console.error("Failed to init match:", e);
           }
         }
      }
    });

    newSocket.on("opponent_code_update", (data) => {
      setOppCode(data.code);
    });

    newSocket.on("opponent_test_submit", () => {
      setOppStatus("Running tests...");
      addLog("Opponent is executing code.");
    });

    newSocket.on("opponent_test_result", (data) => {
      setOppStatus(`Tested. Status: ${data.status}`);
      addLog(`Opponent execution result: ${(data.status === 3 || data.status === "SUCCESS") ? "Accepted" : "Failed"}`);
    });

    newSocket.on("match_ended", (data) => {
      setBattleFinished(true);
      if (data.winnerId === currentUserStats?.userId) {
        setVictoryState("victory");
        addLog("VICTORY! You won the battle!");
      } else {
        setVictoryState("defeat");
        addLog("DEFEAT! Your opponent finished first.");
      }
    });

    return () => {
      newSocket.disconnect();
    };
  }, [isOpen]);

  const handleCodeChange = (value) => {
    setUserCode(value);
    if (socket && opponent?.matchId) {
      socket.emit("code_update", {
        matchId: opponent.matchId,
        code: value
      });
    }
  };

  const recordMatchResultToBackend = async (isWinner) => {
    try {
      const { supabase } = await import('@/lib/supabase');
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;
      if (!token) return;

      const springBootBase = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" 
        ? "http://localhost:8080" 
        : "https://algobuddy-backend-7iwv.onrender.com";

      await fetch(`${springBootBase}/api/v1/arena/match-result`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          opponentId: opponent?.userId,
          matchId: opponent?.matchId,
          topic: opponent?.topic || "Arrays",
          difficulty: "Easy",
          isWinner: isWinner
        })
      });
    } catch (e) {
      console.error("Failed to record match result:", e);
    }
  };

  const executeCode = async () => {
    if (!userCode || isExecuting || battleFinished) return;
    setIsExecuting(true);
    setUserOutput("Running...");
    
    if (socket && opponent?.matchId) {
      socket.emit("test_submit", {
        matchId: opponent.matchId
      });
      addLog("You started executing code.");
    }

    try {
      const res = await fetch("/api/code-lab", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: userCode })
      });
      
      const data = await res.json();
      
      let outText = `Status: ${data.message || data.status}\n`;
      if (data.output) outText += `Output: ${data.output}\n`;
      if (data.error) outText += `Error: ${data.error}`;
      setUserOutput(outText);
      addLog(`You received execution result: ${data.message || data.status}`);

      if (socket && opponent?.matchId) {
        socket.emit("test_result", {
          matchId: opponent.matchId,
          status: data.status,
          passed: (data.status === 3 || data.status === "SUCCESS") ? 1 : 0,
          total: 1
        });

        if (data.status === 3 || data.status === "SUCCESS") {
          socket.emit("match_complete", {
            matchId: opponent.matchId
          });
          setBattleFinished(true);
          setVictoryState("victory");
          addLog("VICTORY! You passed all tests and won!");
          recordMatchResultToBackend(true);
        }
      }
    } catch (err) {
      setUserOutput("Error executing code: " + err.message);
    } finally {
      setIsExecuting(false);
    }
  };

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
                onClick={executeCode}
                disabled={isExecuting || battleFinished}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-lg transition font-bold text-sm"
              >
                {isExecuting ? "Running..." : <><Play size={16} /> Run & Submit</>}
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

        {/* Split Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel: Problem Statement */}
          <div className="w-1/4 bg-[#0a0a0f] border-r border-slate-800 p-6 overflow-y-auto hidden md:block">
            <h2 className="text-xl font-bold mb-4">{problemName}</h2>
            <div className="text-sm text-slate-300 space-y-4">
              <p>Given an array of integers <code>nums</code> and an integer <code>target</code>, return indices of the two numbers such that they add up to <code>target</code>.</p>
              <p>You may assume that each input would have exactly one solution, and you may not use the same element twice.</p>
              <div className="bg-slate-900 p-3 rounded-md">
                <strong>Example:</strong><br/>
                <code>Input: nums = [2,7,11,15], target = 9</code><br/>
                <code>Output: [0,1]</code>
              </div>
            </div>
          </div>

          {/* Middle Panel: User Editor */}
          <div className="w-full md:w-[37.5%] flex flex-col border-r border-slate-800 bg-[#1e1e1e]">
            <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                {currentUsername} (You)
              </span>
            </div>
            <div className="flex-1 relative">
              <Editor
                height="100%"
                defaultLanguage="javascript"
                theme="vs-dark"
                value={userCode}
                onChange={handleCodeChange}
                options={{ minimap: { enabled: false }, fontSize: 13 }}
              />
            </div>
            {/* User Terminal */}
            <div className="h-40 bg-[#0d0e12] border-t border-slate-800 p-3 overflow-y-auto">
               <span className="text-xs font-bold text-slate-500 uppercase">Execution Output</span>
               <pre className="text-xs text-slate-300 mt-2 whitespace-pre-wrap">{userOutput}</pre>
            </div>
          </div>

          {/* Right Panel: Opponent Editor */}
          <div className="w-full md:w-[37.5%] flex flex-col bg-[#1e1e1e] opacity-80 pointer-events-none">
            <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-600" />
                {opponentName}
              </span>
              <span className="text-[10px] text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded">{oppStatus}</span>
            </div>
            <div className="flex-1 relative">
              <Editor
                height="100%"
                defaultLanguage="javascript"
                theme="vs-dark"
                value={oppCode}
                options={{ minimap: { enabled: false }, fontSize: 13, readOnly: true }}
              />
            </div>
            <div className="h-40 bg-[#0d0e12] border-t border-slate-800 p-3 overflow-y-auto">
               <span className="text-xs font-bold text-slate-500 uppercase">Opponent Status</span>
               <div className="text-xs text-slate-300 mt-2">{oppStatus === "Idle" ? "Waiting for opponent..." : oppStatus}</div>
            </div>
          </div>
        </div>

        {/* Bottom Console Panel for Logs */}
        <div className="h-24 bg-slate-900 border-t border-slate-800 flex flex-col overflow-hidden hidden md:flex">
          <div
            ref={logContainerRef}
            className="flex-1 p-3 overflow-y-auto space-y-1 font-mono text-xs text-slate-300"
          >
            {logs.map((log, index) => (
              <div
                key={index}
                className={
                  log.includes("VICTORY")
                    ? "text-emerald-400 font-bold"
                    : log.includes("DEFEAT")
                    ? "text-red-400 font-bold"
                    : log.includes("failed")
                    ? "text-red-400"
                    : "text-slate-400"
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
                  {victoryState === "victory" ? (
                    <CheckCircle className="w-16 h-16 text-emerald-400 animate-bounce" />
                  ) : (
                    <AlertTriangle className="w-16 h-16 text-red-500 animate-pulse" />
                  )}
                </div>

                <h2 className="text-2xl font-extrabold text-white mb-2">
                  {victoryState === "victory" ? "Victory!" : "Defeat!"}
                </h2>
                <p className="text-sm text-slate-400 mb-6">
                  {victoryState === "victory" 
                    ? `You solved **${problemName}** in ${formatTime(seconds)} and defeated **${opponentName}**!`
                    : `**${opponentName}** completed the challenge first. Better luck next time!`
                  }
                </p>

                <div className="flex flex-col gap-2.5 mb-6 bg-slate-950/40 p-4 border border-slate-800/80 rounded-xl text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">XP</span>
                    <span className={`font-bold ${victoryState === "victory" ? "text-primary dark:text-purple-400" : "text-slate-400"}`}>
                      {victoryState === "victory" ? "+50 XP" : "+10 XP"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Rating Change</span>
                    <span className={`font-bold ${victoryState === "victory" ? "text-emerald-400" : "text-red-400"}`}>
                      {victoryState === "victory" ? "+25 Rating" : "-15 Rating"}
                    </span>
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
