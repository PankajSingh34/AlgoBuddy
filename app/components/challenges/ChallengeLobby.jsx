"use client";

import React, { useState, useEffect, useRef } from "react";
import { FiUsers, FiCopy, FiCheck, FiPlay, FiLoader, FiArrowLeft, FiShare2 } from "react-icons/fi";

const BOT_NAMES = [
  "AlgoWizard 🧙‍♂️",
  "SortingNinja 🥷",
  "GraphGuru 🕸",
  "StackOverlord 📚",
  "TreeArchitect 🌳",
  "CodeCrusader ⚔",
  "BinaryBoss 🤖"
];

export default function ChallengeLobby({ selections, onBack, onStart }) {
  if (!selections) return null;
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);
  const [players, setPlayers] = useState([]);
  const [roomCode, setRoomCode] = useState("");
  const [isStarting, setIsStarting] = useState(false);
  const [hostConfig, setHostConfig] = useState(null);

  // Initialize roomCode and players list based on selection mode
  useEffect(() => {
    const displayUsername = selections.username ? `${selections.username}` : "Player";
    if (selections.mode === "join") {
      const code = selections.roomCode || "";
      setRoomCode(code);
      setPlayers([
        { name: `${displayUsername} 🎮`, status: "Joined", isLocal: true, isHost: false }
      ]);
    } else {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      let code = "CHL-";
      for (let i = 0; i < 4; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      setRoomCode(code);
      setPlayers([
        { name: `${displayUsername} 👑`, status: "Ready", isLocal: true, isHost: true }
      ]);
    }
  }, [selections]);

  // Real-time BroadcastChannel sync
  useEffect(() => {
    if (!roomCode) return;

    const channelName = `algobuddy-lobby-${roomCode}`;
    const channel = typeof window !== "undefined" && window.BroadcastChannel ? new window.BroadcastChannel(channelName) : null;

    if (!channel) return;

    const handleMessage = (event) => {
      const msg = event.data;
      if (!msg) return;

      if (selections.mode === "create") {
        // HOST RECEIVING MESSAGES
        if (msg.type === "JOIN") {
          setPlayers((currentPlayers) => {
            // Check if player already exists
            if (currentPlayers.some(p => p.name === msg.username)) {
              // Respond back with latest state
              channel.postMessage({
                type: "LOBBY_STATE",
                players: currentPlayers,
                topic: selections.topic,
                difficulty: selections.difficulty
              });
              return currentPlayers;
            }

            const newPlayer = {
              name: msg.username,
              status: "Ready",
              isLocal: false,
              isHost: false,
              isBot: false
            };
            const updated = [...currentPlayers, newPlayer];

            // Broadcast new list to everyone
            channel.postMessage({
              type: "LOBBY_STATE",
              players: updated,
              topic: selections.topic,
              difficulty: selections.difficulty
            });

            return updated;
          });
        } else if (msg.type === "LEAVE") {
          setPlayers((currentPlayers) => {
            const updated = currentPlayers.filter(p => p.name !== msg.username);
            channel.postMessage({
              type: "LOBBY_STATE",
              players: updated,
              topic: selections.topic,
              difficulty: selections.difficulty
            });
            return updated;
          });
        }
      } else {
        // JOINER RECEIVING MESSAGES
        if (msg.type === "LOBBY_STATE") {
          const myName = selections.username ? `${selections.username} 🎮` : "Guest 🎮";
          setPlayers(msg.players.map(p => {
            const isMe = p.name === myName || p.name === selections.username || p.name.startsWith(selections.username);
            return {
              ...p,
              isLocal: isMe,
              status: isMe ? "Joined" : p.status
            };
          }));
          setHostConfig({
            topic: msg.topic,
            difficulty: msg.difficulty
          });
        } else if (msg.type === "START_GAME") {
          setIsStarting(true);
          const myName = selections.username ? `${selections.username} 🎮` : "Guest 🎮";
          const finalPlayers = msg.players.map(p => {
            const isMe = p.name === myName || p.name === selections.username || p.name.startsWith(selections.username);
            return {
              ...p,
              isLocal: isMe
            };
          });
          setTimeout(() => {
            onStart(finalPlayers, { topic: msg.topic, difficulty: msg.difficulty });
          }, 1200);
        }
      }
    };

    channel.addEventListener("message", handleMessage);

    // Joiner broadcasts JOIN requests regularly
    let syncInterval;
    if (selections.mode === "join") {
      const myDisplayName = selections.username ? `${selections.username} 🎮` : "Guest 🎮";
      const sendJoin = () => {
        channel.postMessage({
          type: "JOIN",
          username: myDisplayName
        });
      };
      sendJoin();
      syncInterval = setInterval(sendJoin, 1000);
    } else {
      // Host broadcasts state regularly to keep everyone in sync
      const broadcastState = () => {
        setPlayers((currentPlayers) => {
          channel.postMessage({
            type: "LOBBY_STATE",
            players: currentPlayers,
            topic: selections.topic,
            difficulty: selections.difficulty
          });
          return currentPlayers;
        });
      };
      broadcastState();
      syncInterval = setInterval(broadcastState, 1500);
    }

    return () => {
      channel.removeEventListener("message", handleMessage);
      if (selections.mode === "join") {
        const myDisplayName = selections.username ? `${selections.username} 🎮` : "Guest 🎮";
        channel.postMessage({
          type: "LEAVE",
          username: myDisplayName
        });
      }
      clearInterval(syncInterval);
      channel.close();
    };
  }, [roomCode, selections.mode, selections.username, selections.topic, selections.difficulty]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/visualizer?room=${roomCode}`;
    const shareText = `Join my AlgoBuddy DSA visualizer challenge room! Use code: ${roomCode}`;

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: "AlgoBuddy Challenge Room",
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      // Fallback: Copy link
      navigator.clipboard.writeText(`${shareText} - ${shareUrl}`);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    }
  };

  const handleStartGame = () => {
    setIsStarting(true);
    const channelName = `algobuddy-lobby-${roomCode}`;
    const channel = typeof window !== "undefined" && window.BroadcastChannel ? new window.BroadcastChannel(channelName) : null;
    if (channel) {
      channel.postMessage({
        type: "START_GAME",
        players: players,
        topic: selections.topic,
        difficulty: selections.difficulty
      });
      channel.close();
    }
    setTimeout(() => {
      onStart(players);
    }, 1200);
  };

  const handleAddBots = () => {
    if (selections.mode !== "create") return;
    
    const currentBotNames = players.map(p => p.name);
    const availableBots = BOT_NAMES.filter(name => !currentBotNames.includes(name));
    
    if (availableBots.length === 0) return;

    const numBots = Math.min(Math.floor(Math.random() * 2) + 2, availableBots.length);
    const shuffled = [...availableBots].sort(() => 0.5 - Math.random());
    const botsToAdd = shuffled.slice(0, numBots).map(name => ({
      name,
      status: "Ready",
      isLocal: false,
      isHost: false,
      isBot: true
    }));

    setPlayers((current) => {
      const updated = [...current, ...botsToAdd];
      const channelName = `algobuddy-lobby-${roomCode}`;
      const channel = typeof window !== "undefined" && window.BroadcastChannel ? new window.BroadcastChannel(channelName) : null;
      if (channel) {
        channel.postMessage({
          type: "LOBBY_STATE",
          players: updated,
          topic: selections.topic,
          difficulty: selections.difficulty
        });
        channel.close();
      }
      return updated;
    });
  };

  return (
    <div className="max-w-[700px] mx-auto my-12 px-4" style={{ fontFamily: "'Inter', sans-serif" }}>
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors mb-6"
      >
        <FiArrowLeft className="w-4 h-4" /> Exit Lobby
      </button>

      <div className="rounded-3xl border border-purple-200 dark:border-purple-900/60 bg-white dark:bg-[#1c1d1f] shadow-xl overflow-hidden">
        {/* Lobby Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-8 text-white text-center relative">
          <div className="absolute right-4 top-4 flex items-center gap-1.5 text-xs font-bold bg-white/10 px-3 py-1 rounded-full">
            <FiUsers className="w-3.5 h-3.5" />
            <span>{players.length} Players</span>
          </div>

          <h2 className="text-3xl font-black tracking-tight mb-2">Challenge Lobby</h2>
          <p className="text-sm text-purple-100 font-medium">
            Topic: <span className="underline decoration-2 font-extrabold capitalize">{selections.topic?.replace(/_/g, " ")}</span> · 
            Mode: <span className="underline decoration-2 font-extrabold capitalize">{selections.mode}</span> · 
            Difficulty: <span className="underline decoration-2 font-extrabold capitalize">{selections.difficulty}</span>
          </p>
        </div>

        {/* Lobby Content */}
        <div className="p-8 space-y-8">
          {/* Room Code Card */}
          <div className="bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <span className="text-xs font-bold text-neutral-400 block uppercase tracking-wider">Lobby Share Code</span>
              <span className="text-2xl font-black font-mono tracking-widest text-surface-900 dark:text-white select-all">
                {roomCode}
              </span>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <button
                onClick={handleCopyCode}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-sm active:scale-[0.98] transition-all w-full sm:w-auto"
              >
                {copied ? (
                  <>
                    <FiCheck className="w-4 h-4" /> Copied!
                  </>
                ) : (
                  <>
                    <FiCopy className="w-4 h-4" /> Copy Code
                  </>
                )}
              </button>

              <button
                onClick={handleShare}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-900/60 bg-purple-50/30 dark:bg-purple-950/10 hover:bg-purple-50 dark:hover:bg-purple-950/20 shadow-sm active:scale-[0.98] transition-all w-full sm:w-auto"
              >
                {shared ? (
                  <>
                    <FiCheck className="w-4 h-4" /> Link Shared!
                  </>
                ) : (
                  <>
                    <FiShare2 className="w-4 h-4" /> Share Room
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Players List */}
          <div className="space-y-4">
            <h3 className="font-extrabold text-lg text-surface-900 dark:text-white border-b pb-2 border-neutral-100 dark:border-neutral-800 flex items-center gap-2">
              <FiUsers className="text-purple-600" />
              Players Joined
            </h3>

            <div className="grid gap-3 sm:grid-cols-2">
              {players.map((player, idx) => (
                <div 
                  key={idx}
                  className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-200
                    ${player.isLocal 
                      ? "border-purple-600/40 bg-purple-50/20 dark:bg-purple-950/10" 
                      : "border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900"}`}
                >
                  <span className="font-bold text-neutral-800 dark:text-neutral-200">
                    {player.name}
                  </span>
                  
                  <span 
                    className={`text-xs px-2.5 py-1 rounded-full font-extrabold tracking-wider uppercase
                      ${player.status === "Ready" 
                        ? "bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-400" 
                        : "bg-yellow-100 dark:bg-yellow-950/30 text-yellow-700 dark:text-yellow-400"}`}
                  >
                    {player.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Lobby Footer Action */}
          <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 text-center">
            {selections.mode === "join" ? (
              <div className="flex flex-col items-center justify-center space-y-3 py-3">
                <FiLoader className="w-7 h-7 text-purple-600 animate-spin" />
                <p className="text-sm font-semibold text-neutral-600 dark:text-neutral-400">
                  Waiting for room host to initiate the challenge...
                </p>
                <p className="text-xs text-neutral-500">
                  Game will start automatically as soon as the host is ready.
                </p>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={handleAddBots}
                  disabled={isStarting || players.length >= 6}
                  className="w-full sm:w-auto min-w-[150px] inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full text-sm font-extrabold text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-900/60 bg-purple-50/30 dark:bg-purple-950/10 hover:bg-purple-50 dark:hover:bg-purple-950/20 active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  🤖 Add AI Bots
                </button>

                <button
                  onClick={handleStartGame}
                  disabled={isStarting}
                  className="w-full sm:w-auto min-w-[180px] inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-base font-extrabold text-white bg-purple-600 hover:bg-purple-700 shadow-md hover:shadow-lg active:scale-[0.98] transition-all disabled:opacity-75"
                >
                  {isStarting ? (
                    <>
                      <FiLoader className="w-5 h-5 animate-spin" /> Starting...
                    </>
                  ) : (
                    <>
                      <FiPlay className="w-5 h-5 fill-current" /> Play
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
