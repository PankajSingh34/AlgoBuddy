"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { FiAlertCircle, FiAward, FiBookOpen, FiClock, FiPlay, FiSmile, FiZap } from "react-icons/fi";
import VisualizerChallengeWrapper from "./VisualizerChallengeWrapper";
import ChallengeLeaderboard from "./ChallengeLeaderboard";
import ChallengeTimer from "./ChallengeTimer";
import ChallengeResult from "./ChallengeResult";

export default function ChallengeScreen({ selections, initialPlayers, onExit, onRestartLobby }) {
  if (!selections) return null;
  const [currentRound, setCurrentRound] = useState(1);
  const [score, setScore] = useState(0);
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [players, setPlayers] = useState([]);
  
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [roundCompleted, setRoundCompleted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  
  const [timerDuration, setTimerDuration] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25);
  const [timerResetKey, setTimerResetKey] = useState(0);
  const [isTimerPaused, setIsTimerPaused] = useState(false);

  // Initialize players list with starting scores
  useEffect(() => {
    const formatted = initialPlayers.map((p) => ({
      ...p,
      score: 0,
      xp: 0,
      accuracy: 100,
      correctCount: 0,
      answered: false,
    }));
    setPlayers(formatted);

    // Set duration based on difficulty
    if (selections.difficulty === "easy") setTimerDuration(30);
    else if (selections.difficulty === "medium") setTimerDuration(20);
    else setTimerDuration(12);
  }, [initialPlayers, selections]);

  // Sync remaining seconds
  useEffect(() => {
    if (isTimerPaused || timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft, isTimerPaused]);

  // Reset clock on next round
  useEffect(() => {
    setTimeLeft(selections.difficulty === "easy" ? 30 : selections.difficulty === "medium" ? 20 : 12);
    setTimerResetKey((k) => k + 1);
    setIsTimerPaused(false);
  }, [currentRound, selections.difficulty]);

  // Simulate other players submitting answers during a round
  useEffect(() => {
    if (roundCompleted || isFinished) return;

    const timers = [];
    players.forEach((player, idx) => {
      if (player.isLocal || player.answered || !player.isBot) return;

      // Random delay before bot answers: between 3s and 12s
      const delay = Math.random() * 8000 + 2000;
      
      const timer = setTimeout(() => {
        setPlayers((currPlayers) => {
          return currPlayers.map((p) => {
            if (p.name === player.name) {
              const baseOdds = selections.difficulty === "easy" ? 0.65 : selections.difficulty === "medium" ? 0.8 : 0.9;
              const isCorrect = Math.random() < baseOdds;
              const pointsEarned = isCorrect 
                ? (selections.difficulty === "easy" ? 10 : selections.difficulty === "medium" ? 25 : 50) + Math.floor(Math.random() * 5)
                : 0;

              return {
                ...p,
                answered: true,
                score: p.score + pointsEarned,
                correctCount: p.correctCount + (isCorrect ? 1 : 0),
                accuracy: Math.round(((p.correctCount + (isCorrect ? 1 : 0)) / currentRound) * 100),
                xp: p.xp + (isCorrect ? pointsEarned : 0)
              };
            }
            return p;
          });
        });
      }, delay);

      timers.push(timer);
    });

    return () => timers.forEach(clearTimeout);
  }, [currentRound, players, roundCompleted, isFinished, selections.difficulty]);

  // Multiplayer BroadcastChannel sync
  useEffect(() => {
    if (selections.mode === "solo" || !selections.roomCode) return;

    const channelName = `algobuddy-game-${selections.roomCode}`;
    const channel = typeof window !== "undefined" && window.BroadcastChannel ? new window.BroadcastChannel(channelName) : null;

    if (!channel) return;

    const handleMessage = (event) => {
      const msg = event.data;
      if (!msg) return;

      if (msg.type === "SCORE_UPDATE") {
        setPlayers((currPlayers) => {
          return currPlayers.map((p) => {
            if (p.name === msg.playerName) {
              return {
                ...p,
                answered: msg.answered,
                score: msg.score,
                correctCount: msg.correctCount,
                accuracy: msg.accuracy,
                xp: msg.xp
              };
            }
            return p;
          });
        });
      } else if (msg.type === "GO_TO_LOBBY") {
        if (onRestartLobby) {
          onRestartLobby();
        }
      }
    };

    channel.addEventListener("message", handleMessage);

    return () => {
      channel.removeEventListener("message", handleMessage);
      channel.close();
    };
  }, [selections.mode, selections.roomCode]);

  const handleQuestionGenerated = useCallback((question) => {
    setActiveQuestion(question);
    setSelectedOptionId(null);
    setIsAnswered(false);
    setRoundCompleted(false);
  }, []);

  const handleSelectOption = (optId) => {
    if (isAnswered) return;
    setSelectedOptionId(optId);
  };

  const handleInteractiveSelect = (details) => {
    if (isAnswered) return;
    // Map visual click indices to option ID if they match
    // E.g. Click on element index 2 might correspond to a sorting option
    if (topic === "arrays" || topic === "searching_sorting") {
      // Find matching index option
      const matchingOpt = activeQuestion?.options.find(opt => 
        opt.label.toLowerCase().includes(`index ${details.index}`)
      );
      if (matchingOpt) {
        setSelectedOptionId(matchingOpt.id);
      }
    }
  };

  const handleTimeout = () => {
    if (isAnswered) return;
    handleSubmitAnswer(null, true);
  };

  const handleSubmitAnswer = (forcedOptionId = null, isForcedTimeout = false) => {
    if (isAnswered) return;

    setIsTimerPaused(true);
    setIsAnswered(true);
    const finalOptionId = forcedOptionId || selectedOptionId;

    const isCorrect = finalOptionId === activeQuestion?.correctOptionId;
    const basePoints = selections.difficulty === "easy" ? 10 : selections.difficulty === "medium" ? 25 : 50;
    
    let roundScore = 0;
    let roundXp = 0;

    if (isCorrect && !isForcedTimeout) {
      // Speed multiplier
      const speedBonus = Math.floor(timeLeft / 2);
      // Streak multiplier
      const streakBonus = streak * 5;
      
      roundScore = basePoints + speedBonus + streakBonus;
      roundXp = basePoints; // XP is flat base
      
      setScore((s) => s + roundScore);
      setXp((x) => x + roundXp);
      setStreak((s) => s + 1);
      setCorrectCount((c) => c + 1);
    } else {
      setStreak(0);
    }

    // Update local player stats in list
    setPlayers((currPlayers) => {
      return currPlayers.map((p) => {
        if (p.isLocal) {
          const nextCorrect = p.correctCount + (isCorrect ? 1 : 0);
          const newScore = p.score + roundScore;
          const newXp = p.xp + roundXp;
          const newAccuracy = Math.round((nextCorrect / currentRound) * 100);

          if (selections.mode !== "solo" && selections.roomCode) {
            const channelName = `algobuddy-game-${selections.roomCode}`;
            const channel = typeof window !== "undefined" && window.BroadcastChannel ? new window.BroadcastChannel(channelName) : null;
            if (channel) {
              channel.postMessage({
                type: "SCORE_UPDATE",
                playerName: p.name,
                answered: true,
                score: newScore,
                correctCount: nextCorrect,
                accuracy: newAccuracy,
                xp: newXp
              });
              channel.close();
            }
          }

          return {
            ...p,
            answered: true,
            score: newScore,
            xp: newXp,
            correctCount: nextCorrect,
            accuracy: newAccuracy,
          };
        }
        return p;
      });
    });

    setRoundCompleted(true);
  };

  const handleNextRound = () => {
    if (currentRound >= 10) {
      setIsFinished(true);
    } else {
      // Reset players "answered" state for next round
      setPlayers((curr) => curr.map(p => ({ ...p, answered: false })));
      
      // If in multiplayer, broadcast that we are ready for next round
      if (selections.mode !== "solo") {
        const channelName = `algobuddy-game-${selections.roomCode}`;
        const channel = typeof window !== "undefined" && window.BroadcastChannel ? new window.BroadcastChannel(channelName) : null;
        if (channel) {
          const myPlayer = players.find(p => p.isLocal);
          channel.postMessage({
            type: "SCORE_UPDATE",
            playerName: myPlayer?.name,
            answered: false,
            score: myPlayer?.score || 0,
            correctCount: myPlayer?.correctCount || 0,
            accuracy: myPlayer?.accuracy || 100,
            xp: myPlayer?.xp || 0
          });
          channel.close();
        }
      }

      setCurrentRound((r) => r + 1);
    }
  };

  const handleRestart = () => {
    setCurrentRound(1);
    setScore(0);
    setXp(0);
    setStreak(0);
    setCorrectCount(0);

    setPlayers((curr) => curr.map((p) => ({
      ...p,
      score: 0,
      xp: 0,
      accuracy: 100,
      correctCount: 0,
      answered: false
    })));

    setActiveQuestion(null);
    setSelectedOptionId(null);
    setIsAnswered(false);
    setRoundCompleted(false);
    setIsFinished(false);

    const defaultDuration = selections.difficulty === "easy" ? 30 : selections.difficulty === "medium" ? 20 : 12;
    setTimerDuration(defaultDuration);
    setTimeLeft(defaultDuration);
    setTimerResetKey((k) => k + 1);
    setIsTimerPaused(false);
  };

  const handleMultiplayerRestart = () => {
    if (selections.mode !== "solo" && selections.roomCode) {
      const channelName = `algobuddy-game-${selections.roomCode}`;
      const channel = typeof window !== "undefined" && window.BroadcastChannel ? new window.BroadcastChannel(channelName) : null;
      if (channel) {
        channel.postMessage({
          type: "GO_TO_LOBBY"
        });
        channel.close();
      }
    }
    if (onRestartLobby) {
      onRestartLobby();
    }
  };

  if (isFinished) {
    return (
      <ChallengeResult
        players={players}
        selections={selections}
        onRestart={selections.mode === "solo" ? handleRestart : handleMultiplayerRestart}
        onExit={onExit}
      />
    );
  }

  const topic = selections.topic;

  return (
    <div className="max-w-[1200px] mx-auto my-8 px-4" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Header Info */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6 bg-white dark:bg-[#1c1d1f] p-6 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
        <div>
          <h2 className="text-2xl font-black text-surface-900 dark:text-white tracking-tight flex items-center gap-2">
            <span>⚔ {selections.mode === "solo" ? "Solo Campaign" : "Live Challenge"}</span>
            <span className="text-xs uppercase font-extrabold px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 tracking-wider">
              {selections.difficulty}
            </span>
          </h2>
          <p className="text-xs text-neutral-400 mt-1 font-semibold">
            Room Code: <span className="font-mono uppercase font-black text-neutral-600 dark:text-neutral-300">{selections.roomCode || "SOLO"}</span>
          </p>
        </div>

        {/* Stats strip */}
        <div className="flex items-center gap-6">
          <div className="text-center">
            <span className="text-[10px] uppercase font-bold text-neutral-400 block">Round</span>
            <span className="text-xl font-black text-neutral-800 dark:text-white font-mono">{currentRound} / 10</span>
          </div>
          <div className="w-px h-8 bg-neutral-200 dark:bg-neutral-800" />
          <div className="text-center">
            <span className="text-[10px] uppercase font-bold text-neutral-400 block">Score</span>
            <span className="text-xl font-black text-neutral-800 dark:text-white font-mono">{score}</span>
          </div>
          <div className="w-px h-8 bg-neutral-200 dark:bg-neutral-800" />
          <div className="text-center flex items-center gap-1 bg-purple-50 dark:bg-purple-950/20 px-3 py-1.5 rounded-xl border border-purple-100 dark:border-purple-950/30">
            <FiZap className="text-purple-600 fill-current w-4 h-4 shrink-0" />
            <div>
              <span className="text-[9px] uppercase font-bold text-purple-500 block leading-none">XP</span>
              <span className="text-lg font-black text-purple-700 dark:text-purple-400 font-mono leading-none">+{xp}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left / Central Area: Live visualizer simulation */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <VisualizerChallengeWrapper
            topic={topic}
            difficulty={selections.difficulty}
            type={selections.type || ""}
            currentRound={currentRound}
            onQuestionGenerated={handleQuestionGenerated}
            selectedOptionId={selectedOptionId}
            isAnswered={isAnswered}
            onNodeSelected={handleInteractiveSelect}
          />

          {/* Bottom Panel: Prompt & Answers input */}
          <div className="bg-white dark:bg-[#1c1d1f] border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 shadow-sm flex flex-col gap-5">
            <div>
              <h4 className="text-xs uppercase font-extrabold tracking-wider text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
                <FiBookOpen />
                Question Challenge
              </h4>
              <h2 className="text-lg sm:text-xl font-extrabold text-neutral-800 dark:text-white mt-1 leading-snug">
                {activeQuestion?.prompt}
              </h2>
            </div>

            {/* Answer Options */}
            <div className="grid gap-3 sm:grid-cols-2">
              {activeQuestion?.options.map((opt) => {
                const isSelected = opt.id === selectedOptionId;
                const isCorrect = opt.id === activeQuestion.correctOptionId;
                const showResult = isAnswered && (isSelected || isCorrect);

                let btnStyles = "border-neutral-200 dark:border-neutral-800 hover:border-purple-600 hover:bg-purple-50/20 dark:hover:bg-purple-950/20 text-neutral-700 dark:text-neutral-300";
                if (isSelected && !isAnswered) {
                  btnStyles = "border-purple-600 bg-purple-50 dark:bg-purple-950/30 ring-2 ring-purple-600/30 text-purple-700 dark:text-purple-300";
                }
                if (showResult) {
                  if (isCorrect) {
                    btnStyles = "border-green-600 bg-green-500/10 text-green-700 dark:text-green-400 font-extrabold";
                  } else if (isSelected) {
                    btnStyles = "border-red-600 bg-red-500/10 text-red-700 dark:text-red-400 font-extrabold";
                  }
                }

                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectOption(opt.id)}
                    disabled={isAnswered}
                    className={`p-4 rounded-2xl border text-left text-sm font-semibold transition-all duration-200 active:scale-[0.99] flex items-center justify-between
                      ${btnStyles}`}
                  >
                    <span>{opt.label}</span>
                    {showResult && isCorrect && <span className="text-green-600 font-bold">✓</span>}
                    {showResult && isSelected && !isCorrect && <span className="text-red-600 font-bold">✗</span>}
                  </button>
                );
              })}
            </div>

            {/* Submit & Next Control bar */}
            <div className="flex items-center justify-between border-t pt-4 border-neutral-100 dark:border-neutral-800">
              <div className="text-xs text-neutral-400 font-medium">
                {streak > 1 && (
                  <span className="inline-flex items-center gap-1 text-amber-500 font-extrabold">
                    🔥 Streak x{streak}! (+{streak * 5} bonus)
                  </span>
                )}
              </div>

              {!isAnswered ? (
                <button
                  onClick={() => handleSubmitAnswer()}
                  disabled={!selectedOptionId}
                  className="px-6 py-2.5 rounded-full text-sm font-bold text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-50 transition-colors shadow-sm"
                >
                  Submit Answer
                </button>
              ) : (
                <button
                  onClick={handleNextRound}
                  className="px-6 py-2.5 rounded-full text-sm font-bold text-white bg-purple-600 hover:bg-purple-700 transition-colors shadow-sm flex items-center gap-1.5"
                >
                  {currentRound >= 10 ? "Finish Challenge" : "Next Round"}
                </button>
              )}
            </div>

            {/* Explanation box */}
            {isAnswered && activeQuestion?.explanation && (
              <div className="p-4 bg-neutral-50 dark:bg-neutral-900/30 rounded-2xl border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed flex items-start gap-2.5 animate-fadeIn">
                <FiAlertCircle className="text-purple-500 shrink-0 w-4 h-4 mt-0.5" />
                <p>{activeQuestion.explanation}</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Area: Timer + Leaderboard */}
        <div className="flex flex-col gap-6">
          <ChallengeTimer
            key={timerResetKey}
            duration={timerDuration}
            activeRound={currentRound}
            onTimeout={handleTimeout}
            isPaused={isTimerPaused}
          />

          <ChallengeLeaderboard
            players={players}
            currentRound={currentRound}
          />

          {/* Tips panel */}
          <div className="bg-white dark:bg-[#1c1d1f] border border-neutral-200 dark:border-neutral-800 rounded-3xl p-5 shadow-sm text-xs text-neutral-400">
            <span className="font-extrabold text-purple-600 dark:text-purple-400 block mb-1.5 uppercase tracking-wider">💡 Pro Tip</span>
            Earn extra speed points by submitting your answers early in the round. Building a streak increases your score bonus multiplier exponentially!
          </div>
        </div>
      </div>
    </div>
  );
}
