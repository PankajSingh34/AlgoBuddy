"use client";

import React, { useMemo, useEffect, useRef } from "react";
import { FiRotateCcw, FiArrowRight } from "react-icons/fi";

/* ─── tiny confetti helper ─────────────────────────────────────── */
function useConfetti(active) {
  const ref = useRef(null);
  useEffect(() => {
    if (!active || !ref.current) return;
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const pieces = Array.from({ length: 120 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * -canvas.height,
      r: Math.random() * 7 + 3,
      d: Math.random() * 60 + 40,
      color: ["#a855f7", "#facc15", "#34d399", "#f97316", "#60a5fa"][Math.floor(Math.random() * 5)],
      tilt: Math.random() * 10 - 10,
      tiltAngle: 0,
      tiltAngleInc: Math.random() * 0.07 + 0.05,
    }));

    let angle = 0;
    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      angle += 0.01;
      pieces.forEach((p, i) => {
        p.tiltAngle += p.tiltAngleInc;
        p.y += (Math.cos(angle + p.d) + 1.5) * 1.8;
        p.tilt = Math.sin(p.tiltAngle) * 15;
        ctx.beginPath();
        ctx.lineWidth = p.r;
        ctx.strokeStyle = p.color;
        ctx.moveTo(p.x + p.tilt + p.r / 2, p.y);
        ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 2);
        ctx.stroke();
        if (p.y > canvas.height) {
          pieces[i].x = Math.random() * canvas.width;
          pieces[i].y = -10;
        }
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    const stop = setTimeout(() => cancelAnimationFrame(raf), 4500);
    return () => { cancelAnimationFrame(raf); clearTimeout(stop); };
  }, [active]);
  return ref;
}

/* ─── Podium Block ──────────────────────────────────────────────── */
function PodiumBlock({ player, place, isLocal }) {
  const config = {
    1: { height: "h-36", bg: "from-yellow-400 to-amber-500", shadow: "shadow-yellow-500/40", medal: "🥇", label: "1st Place", crown: true },
    2: { height: "h-24", bg: "from-slate-300 to-slate-400", shadow: "shadow-slate-400/40", medal: "🥈", label: "2nd Place", crown: false },
    3: { height: "h-16", bg: "from-amber-600 to-orange-700", shadow: "shadow-amber-700/40", medal: "🥉", label: "3rd Place", crown: false },
  }[place];

  return (
    <div className="flex flex-col items-center gap-2 flex-1">
      {/* Crown above winner */}
      {config.crown && (
        <div className="text-4xl animate-bounce select-none">👑</div>
      )}

      {/* Avatar circle */}
      <div
        className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl font-black border-4 ${
          place === 1
            ? "border-yellow-400 bg-yellow-100 dark:bg-yellow-950"
            : place === 2
            ? "border-slate-300 bg-slate-100 dark:bg-slate-800"
            : "border-amber-600 bg-amber-100 dark:bg-amber-950"
        } ${isLocal ? "ring-4 ring-purple-500 ring-offset-2" : ""}`}
      >
        {config.medal}
      </div>

      {/* Name */}
      <div className="text-center px-1">
        <p
          className={`text-sm font-black leading-tight truncate max-w-[90px] ${
            isLocal ? "text-purple-700 dark:text-purple-300" : "text-neutral-800 dark:text-neutral-100"
          }`}
        >
          {player.name}
        </p>
        {isLocal && (
          <span className="text-[9px] uppercase font-extrabold bg-purple-100 dark:bg-purple-950 px-1.5 py-0.5 rounded text-purple-700 dark:text-purple-300">
            You
          </span>
        )}
        <p className="text-xs text-neutral-500 dark:text-neutral-400 font-bold mt-0.5">
          {player.score} pts
        </p>
      </div>

      {/* Podium block */}
      <div
        className={`w-full ${config.height} bg-gradient-to-b ${config.bg} shadow-lg ${config.shadow} rounded-t-2xl flex items-center justify-center`}
      >
        <span className="text-white font-black text-sm tracking-wide">{config.label}</span>
      </div>
    </div>
  );
}

/* ─── Loser Row ─────────────────────────────────────────────────── */
function LoserRow({ player, isLocal }) {
  return (
    <div
      className={`flex items-center justify-between px-5 py-4 rounded-2xl border border-red-500/30 bg-red-50/10 dark:bg-red-950/10`}
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl select-none">💀</span>
        <div>
          <p
            className={`text-sm font-extrabold ${
              isLocal ? "text-purple-700 dark:text-purple-300" : "text-neutral-700 dark:text-neutral-200"
            }`}
          >
            {player.name}
            {isLocal && (
              <span className="ml-2 text-[9px] uppercase font-extrabold bg-purple-100 dark:bg-purple-950 px-1.5 py-0.5 rounded text-purple-700 dark:text-purple-300">
                You
              </span>
            )}
          </p>
          <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider">Loser</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm font-black text-neutral-800 dark:text-white">{player.score}</p>
        <p className="text-[9px] text-neutral-400 font-semibold">points</p>
      </div>
    </div>
  );
}

/* ─── Middle-place Row (4th, 5th, etc.) ─────────────────────────── */
function MidRow({ player, idx, isLocal }) {
  return (
    <div
      className={`flex items-center justify-between px-5 py-3.5 rounded-2xl border ${
        isLocal
          ? "border-purple-600/40 bg-purple-50/20 dark:bg-purple-950/10"
          : "border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30"
      }`}
    >
      <div className="flex items-center gap-3">
        <span className="w-7 h-7 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center text-xs font-black text-neutral-600 dark:text-neutral-300">
          {idx + 1}
        </span>
        <p
          className={`text-sm font-bold ${
            isLocal ? "text-purple-700 dark:text-purple-300 font-extrabold" : "text-neutral-700 dark:text-neutral-200"
          }`}
        >
          {player.name}
          {isLocal && (
            <span className="ml-2 text-[9px] uppercase font-extrabold bg-purple-100 dark:bg-purple-950 px-1.5 py-0.5 rounded text-purple-700 dark:text-purple-300">
              You
            </span>
          )}
        </p>
      </div>
      <div className="text-right">
        <p className="text-sm font-black text-neutral-800 dark:text-white">{player.score}</p>
        <p className="text-[9px] text-neutral-400 font-semibold">points</p>
      </div>
    </div>
  );
}

/* ─── Main Component ────────────────────────────────────────────── */
export default function ChallengeResult({ players, selections, onRestart, onExit }) {
  if (!selections) return null;

  const sorted = useMemo(() => [...players].sort((a, b) => b.score - a.score), [players]);

  const localPlayer = useMemo(
    () => players.find((p) => p.isLocal) || { name: "You", score: 0, accuracy: 100, xp: 0 },
    [players]
  );

  const isLocalWinner = sorted[0]?.name === localPlayer.name;
  const confettiRef = useConfetti(isLocalWinner);

  // Split into podium (top 3), middle, loser
  const podium = sorted.slice(0, Math.min(3, sorted.length));
  const middle = sorted.length > 4 ? sorted.slice(3, sorted.length - 1) : [];
  const loser = sorted.length > 1 ? sorted[sorted.length - 1] : null;

  return (
    <div className="relative max-w-[760px] mx-auto my-10 px-4" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Confetti canvas (winner only) */}
      {isLocalWinner && (
        <canvas
          ref={confettiRef}
          className="pointer-events-none fixed inset-0 w-full h-full z-[9998]"
        />
      )}

      <div className="rounded-3xl border border-purple-200 dark:border-purple-900/60 bg-white dark:bg-[#1c1d1f] shadow-2xl overflow-hidden">
        {/* ── Header ── */}
        <div
          className={`p-8 text-white text-center relative overflow-hidden ${
            isLocalWinner
              ? "bg-gradient-to-br from-yellow-400 via-purple-600 to-indigo-600"
              : "bg-gradient-to-br from-purple-700 to-neutral-800"
          }`}
        >
          <div className="text-5xl mb-3 select-none">
            {isLocalWinner ? "🏆" : "🎮"}
          </div>
          <h2 className="text-4xl font-black tracking-tight mb-2">
            {isLocalWinner ? "Victory!" : "Challenge Complete!"}
          </h2>
          <p className="text-purple-100 text-sm max-w-sm mx-auto font-medium">
            {isLocalWinner
              ? `You crushed it with ${localPlayer.score} points! 🎉`
              : `${sorted[0]?.name || "Player"} won with ${sorted[0]?.score ?? 0} points. Better luck next time!`}
          </p>

          {/* Decorative orbs */}
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        </div>

        {/* ── Body ── */}
        <div className="p-8 space-y-8">

          {/* ── Podium (shown only when ≥ 2 players) ── */}
          {sorted.length >= 2 && (
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-6 text-center">
                🏅 Final Standings
              </p>

              {/* Podium visual */}
              <div className="flex items-end justify-center gap-3">
                {/* 2nd on left */}
                {podium[1] && (
                  <PodiumBlock
                    player={podium[1]}
                    place={2}
                    isLocal={podium[1].isLocal}
                  />
                )}
                {/* 1st in center */}
                {podium[0] && (
                  <PodiumBlock
                    player={podium[0]}
                    place={1}
                    isLocal={podium[0].isLocal}
                  />
                )}
                {/* 3rd on right */}
                {podium[2] && (
                  <PodiumBlock
                    player={podium[2]}
                    place={3}
                    isLocal={podium[2].isLocal}
                  />
                )}
              </div>
            </div>
          )}

          {/* ── Middle-place rows ── */}
          {middle.length > 0 && (
            <div className="space-y-2">
              {middle.map((p, i) => (
                <MidRow key={p.name} player={p} idx={i + 3} isLocal={p.isLocal} />
              ))}
            </div>
          )}

          {/* ── Loser row ── */}
          {loser && <LoserRow player={loser} isLocal={loser.isLocal} />}

          {/* ── Solo / single-player stat strip ── */}
          {sorted.length === 1 && (
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-purple-50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/40 rounded-2xl p-4">
                <span className="text-[10px] uppercase font-bold text-purple-500 block">XP Earned</span>
                <span className="text-2xl font-black text-purple-700 dark:text-purple-400 font-mono">
                  +{localPlayer.xp || 0}
                </span>
              </div>
              <div className="bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4">
                <span className="text-[10px] uppercase font-bold text-neutral-400 block">Accuracy</span>
                <span className="text-2xl font-black text-neutral-800 dark:text-neutral-200 font-mono">
                  {localPlayer.accuracy || 100}%
                </span>
              </div>
              <div className="bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4">
                <span className="text-[10px] uppercase font-bold text-neutral-400 block">Score</span>
                <span className="text-2xl font-black text-neutral-800 dark:text-neutral-200 font-mono">
                  {localPlayer.score || 0}
                </span>
              </div>
            </div>
          )}

          {/* ── Action buttons ── */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 border-t border-neutral-100 dark:border-neutral-800">
            <button
              onClick={onRestart}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-sm font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-md active:scale-[0.98] transition-all"
            >
              <FiRotateCcw className="w-4 h-4" /> Play Again
            </button>
            <button
              onClick={onExit}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-sm font-bold text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 border border-neutral-300 dark:border-neutral-700 active:scale-[0.98] transition-all"
            >
              Back to Visualizers <FiArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
