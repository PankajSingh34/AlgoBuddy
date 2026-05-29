"use client";

import React, { useState, useEffect } from "react";
import { FiX, FiCheck, FiChevronRight, FiChevronLeft, FiPlay, FiSettings, FiUsers, FiLink, FiBookOpen } from "react-icons/fi";

const MODES = [
  { id: "solo", label: "🚀 Solo Challenge", desc: "Practice independently and test your algorithms intuition." },
  { id: "create", label: "👥 Create Challenge Room", desc: "Host a live multiplayer lobby and invite your friends to compete." },
  { id: "join", label: "🔗 Join With Code", desc: "Join an existing multiplayer room using a shared lobby code." },
];

const DSA_TOPICS = [
  { id: "arrays", label: "Arrays", desc: "Interactive array indexing, bounds, and partition states.", icon: "📊" },
  { id: "linked_lists", label: "Linked Lists", desc: "Pointers, node traversals, insertion and deletion events.", icon: "🔗" },
  { id: "stack_queue", label: "Stack & Queue", desc: "LIFO/FIFO buffers, pushing, popping, and enqueue operations.", icon: "📥" },
  { id: "trees", label: "Trees", desc: "BST balance factors, AVL tree rotations, and tree traversals.", icon: "🌲" },
  { id: "graphs", label: "Graphs", desc: "DFS/BFS node traversal orders, Dijkstra costs, and cycle detection.", icon: "🕸" },
  { id: "recursion", label: "Recursion", desc: "Call stack traces, recursion trees, and return value predictions.", icon: "🔄" },
  { id: "dynamic_programming", label: "Dynamic Programming", desc: "Memoization arrays, recursive subproblems, and state tables.", icon: "🧠" },
  { id: "searching_sorting", label: "Searching & Sorting", desc: "Swaps, pivot partitioning, linear search, and binary search.", icon: "🔍" },
];

const DIFFICULTIES = [
  { id: "easy", label: "Easy", desc: "+10 XP. Slow timer. Simple array sizes and node states.", icon: "🟢", color: "text-green-500 bg-green-500/10" },
  { id: "medium", label: "Medium", desc: "+25 XP. Regular timer. Standard sizes and structures.", icon: "🟡", color: "text-yellow-500 bg-yellow-500/10" },
  { id: "hard", label: "Hard", desc: "+50 XP. Double speed timer. Highly nested structures.", icon: "🔴", color: "text-red-500 bg-red-500/10" },
];

export default function ChallengeSetupModal({ isOpen, onClose, onComplete, initialStep = 1 }) {
  const [step, setStep] = useState(1);
  const [selections, setSelections] = useState({
    mode: "solo",
    topic: "arrays",
    difficulty: "easy",
    roomCode: "",
    username: "",
  });

  useEffect(() => {
    if (isOpen) {
      setStep(initialStep);
      setSelections((prev) => ({
        ...prev,
        roomCode: "",
      }));
    }
  }, [isOpen, initialStep]);

  if (!isOpen) return null;

  const handleSelect = (key, val) => {
    setSelections((prev) => ({ ...prev, [key]: val }));
  };

  const handleModeChoice = (modeId) => {
    handleSelect("mode", modeId);
    if (modeId === "join") {
      setStep(1.5); // go to join code screen
    } else {
      setStep(2); // go to topic choice
    }
  };

  const handleNext = () => {
    if (step === 1.5) {
      onComplete({ ...selections, mode: "join" });
    } else if (step === 4) {
      onComplete({ ...selections });
    } else {
      setStep((s) => s + 1);
    }
  };

  const handleBack = () => {
    if (step === 1.5) {
      setStep(1);
    } else if (step === 2) {
      setStep(1);
    } else {
      setStep((s) => s - 1);
    }
  };

  const stepTitles = {
    1: "Choose Mode",
    1.5: "Enter Lobby Code",
    2: "Choose DSA Topic",
    3: "Choose Difficulty",
    4: "Confirm & Start",
  };

  const isNextDisabled = () => {
    if (step === 1.5) {
      return !selections.roomCode.trim() || !selections.username.trim();
    }
    if (step === 4) {
      return !selections.username.trim();
    }
    return false;
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-neutral-900/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />

      {/* Modal Card */}
      <div 
        className="relative z-10 w-full max-w-2xl rounded-3xl border border-purple-200 dark:border-purple-900/60 
          bg-white dark:bg-[#1c1d1f] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition-all"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
              <FiSettings className="w-5 h-5" />
            </span>
            <h3 className="text-xl font-bold text-surface-900 dark:text-white">
              Challenge Configuration
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-full text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        {/* Stepper progress indicator (only for solo/create flow) */}
        {step >= 2 && step <= 4 && (
          <div className="px-6 py-3 bg-neutral-50 dark:bg-neutral-900/30 flex items-center gap-1.5 overflow-x-auto">
            {[2, 3, 4].map((s) => (
              <React.Fragment key={s}>
                <div className="flex items-center gap-1">
                  <div 
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all
                      ${step >= s 
                        ? "bg-purple-600 text-white" 
                        : "bg-neutral-200 dark:bg-neutral-800 text-neutral-500"}`}
                  >
                    {step > s ? <FiCheck className="w-3.5 h-3.5" /> : (s - 1)}
                  </div>
                  <span className={`text-xs font-bold whitespace-nowrap ${step === s ? "text-purple-600 dark:text-purple-400" : "text-neutral-500"}`}>
                    {s === 2 && "DSA Topic"}
                    {s === 3 && "Difficulty"}
                    {s === 4 && "Confirm"}
                  </span>
                </div>
                {s < 4 && <div className={`flex-1 h-0.5 min-w-[20px] ${step > s ? "bg-purple-600" : "bg-neutral-200 dark:bg-neutral-800"}`} />}
              </React.Fragment>
            ))}
          </div>
        )}

        {/* Scrollable Content */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          <div className="mb-2">
            <h2 className="text-2xl font-black text-surface-900 dark:text-white tracking-tight">
              {stepTitles[step]}
            </h2>
          </div>

          {/* STEP 1: Choose Mode */}
          {step === 1 && (
            <div className="grid gap-3 py-2">
              {MODES.map((m) => (
                <button
                  key={m.id}
                  onClick={() => handleModeChoice(m.id)}
                  className={`flex items-start gap-4 p-5 rounded-2xl border text-left transition-all duration-200 hover:border-purple-600 active:scale-[0.99]
                    ${selections.mode === m.id 
                      ? "border-purple-600 bg-purple-50/50 dark:bg-purple-950/20 ring-2 ring-purple-600/20" 
                      : "border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900"}`}
                >
                  <div className="flex-1">
                    <h3 className="font-extrabold text-base text-surface-900 dark:text-white">{m.label}</h3>
                    <p className="text-xs text-surface-500 dark:text-surface-400 mt-1 leading-relaxed">{m.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* STEP 1.5: Enter Room Code & Username */}
          {step === 1.5 && (
            <div className="max-w-md mx-auto py-2 text-center space-y-4">
              <div className="p-4 bg-purple-50 dark:bg-purple-950/10 rounded-2xl border border-purple-100 dark:border-purple-950/30">
                <p className="text-sm font-semibold text-purple-700 dark:text-purple-400">
                  You are joining a multiplayer challenge.
                </p>
              </div>

              <div className="space-y-2 text-left">
                <label className="text-sm font-bold text-surface-700 dark:text-surface-300">Room Code</label>
                <input
                  type="text"
                  maxLength={8}
                  value={selections.roomCode}
                  onChange={(e) => {
                    const val = e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, "");
                    handleSelect("roomCode", val);
                  }}
                  placeholder="e.g. CHL-8X2K"
                  className="w-full h-12 px-4 text-center tracking-widest uppercase font-mono font-bold text-lg rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 transition-all text-neutral-800 dark:text-white"
                />
              </div>

              <div className="space-y-2 text-left">
                <label className="text-sm font-bold text-surface-700 dark:text-surface-300">Your Nickname / Username</label>
                <input
                  type="text"
                  maxLength={15}
                  value={selections.username}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^a-zA-Z0-9_]/g, "");
                    handleSelect("username", val);
                  }}
                  placeholder="Enter username"
                  className="w-full h-12 px-4 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 transition-all font-semibold text-neutral-800 dark:text-white"
                />
              </div>
            </div>
          )}

          {/* STEP 2: Choose Topic */}
          {step === 2 && (
            <div className="grid gap-3 sm:grid-cols-2">
              {DSA_TOPICS.map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => handleSelect("topic", topic.id)}
                  className={`flex items-start gap-3.5 p-4 rounded-2xl border text-left transition-all duration-200 hover:border-purple-600
                    ${selections.topic === topic.id 
                      ? "border-purple-600 bg-purple-50/50 dark:bg-purple-950/20 ring-2 ring-purple-600/20" 
                      : "border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900"}`}
                >
                  <span className="text-3xl p-1 bg-white dark:bg-neutral-850 rounded-xl shadow-sm shrink-0">{topic.icon}</span>
                  <div>
                    <h3 className="font-bold text-sm text-surface-900 dark:text-white">{topic.label}</h3>
                    <p className="text-[11px] text-surface-500 dark:text-surface-400 mt-0.5 leading-relaxed">{topic.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* STEP 3: Choose Difficulty */}
          {step === 3 && (
            <div className="grid gap-3">
              {DIFFICULTIES.map((d) => (
                <button
                  key={d.id}
                  onClick={() => handleSelect("difficulty", d.id)}
                  className={`flex items-center gap-4 p-5 rounded-2xl border text-left transition-all duration-200 hover:border-purple-600
                    ${selections.difficulty === d.id 
                      ? "border-purple-600 bg-purple-50/50 dark:bg-purple-950/20 ring-2 ring-purple-600/20" 
                      : "border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900"}`}
                >
                  <span className={`text-2xl p-3 rounded-xl shadow-sm ${d.color}`}>{d.icon}</span>
                  <div>
                    <h3 className="font-extrabold text-base text-surface-900 dark:text-white">{d.label}</h3>
                    <p className="text-xs text-surface-500 dark:text-surface-400 mt-1">{d.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* STEP 4: Confirm & Start */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 bg-neutral-50 dark:bg-neutral-900/40 space-y-4">
                <h3 className="font-bold text-lg text-surface-900 dark:text-white border-b pb-2 border-neutral-200 dark:border-neutral-800">
                  Lobby Details Configuration
                </h3>

                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                  <div>
                    <span className="text-xs text-neutral-500 block">DSA Topic</span>
                    <span className="font-bold text-neutral-800 dark:text-neutral-200 capitalize">
                      {DSA_TOPICS.find((topic) => topic.id === selections.topic)?.label}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-neutral-500 block">Difficulty</span>
                    <span className="font-bold text-neutral-800 dark:text-neutral-200 capitalize">
                      {selections.difficulty}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-neutral-500 block">Game Mode</span>
                    <span className="font-bold text-neutral-800 dark:text-neutral-200">
                      {MODES.find((m) => m.id === selections.mode)?.label.replace(/[^\w\s]/g, "").trim()}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 text-left pt-2 border-t border-neutral-200 dark:border-neutral-800">
                  <label className="text-sm font-bold text-surface-700 dark:text-surface-300">Your Nickname / Username</label>
                  <input
                    type="text"
                    maxLength={15}
                    value={selections.username}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^a-zA-Z0-9_]/g, "");
                      handleSelect("username", val);
                    }}
                    placeholder="Enter username"
                    className="w-full h-12 px-4 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 transition-all font-semibold text-neutral-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="text-center text-xs text-neutral-500 leading-relaxed max-w-sm mx-auto">
                By starting, you will initialize the interactive AlgoBuddy challenge engine. Real-time scores and speed bonuses will be calculated.
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/20 flex justify-between items-center">
          {step > 1 ? (
            <button
              onClick={handleBack}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold border border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              <FiChevronLeft className="w-4 h-4" /> Back
            </button>
          ) : (
            <div />
          )}

          {step === 1 ? (
            <div />
          ) : step === 1.5 ? (
            <button
              onClick={handleNext}
              disabled={isNextDisabled()}
              className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-50 transition-colors"
            >
              Join Lobby <FiChevronRight className="w-4 h-4" />
            </button>
          ) : step < 4 ? (
            <button
              onClick={handleNext}
              className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-purple-600 hover:bg-purple-700 transition-colors"
            >
              Continue <FiChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={isNextDisabled()}
              className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-purple-600 hover:bg-purple-700 transition-colors disabled:opacity-50"
            >
              {selections.mode === "create" ? (
                <>
                  <FiPlay className="w-4 h-4 fill-current" /> Create Lobby
                </>
              ) : (
                <>
                  <FiPlay className="w-4 h-4 fill-current" /> Start Challenge
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
