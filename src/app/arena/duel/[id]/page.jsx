"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/features/user/UserContext";
import DuelSimulatorModal from "@/app/components/ui/DuelSimulatorModal";

export default function DuelLobbyPage({ params }) {
  const router = useRouter();
  const { user, loading } = useUser();
  
  const [simulatorOpen, setSimulatorOpen] = useState(false);
  const [opponent, setOpponent] = useState(null);

  // Mock socket "player joined"
  useEffect(() => {
    if (user) {
      const timer = setTimeout(() => {
        setOpponent({
          name: "Friend_123",
          rating: 1650,
          level: 16,
          avatar: "FR"
        });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-neutral-900">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-neutral-900">
        <div className="text-center">
          <h2 className="text-xl font-bold text-slate-800 dark:text-neutral-200">Access Denied</h2>
          <p className="text-sm text-slate-500 dark:text-neutral-400">Please sign in to join a duel.</p>
        </div>
      </div>
    );
  }

  const [copied, setCopied] = useState(false);
  const lobbyCode = params.id; 

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-neutral-900 flex flex-col items-center pt-24 px-4">
      <div className="w-full max-w-4xl flex flex-col md:flex-row items-center justify-center gap-8 mb-12">
        {/* Player 1 */}
        <div className="flex flex-col items-center bg-white dark:bg-neutral-800 p-8 rounded-3xl shadow-xl border border-slate-100 dark:border-neutral-800/80 w-64">
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-4 ring-4 ring-primary/20">
            <span className="text-3xl font-black text-primary">{user.user_metadata?.name?.[0] || user.email?.[0]?.toUpperCase()}</span>
          </div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-neutral-200 truncate w-full text-center">{user.user_metadata?.name || user.email?.split('@')[0]}</h3>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Host</span>
        </div>

        {/* VS Badge */}
        <div className="flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-slate-900 dark:bg-white rounded-2xl rotate-12 flex items-center justify-center shadow-2xl">
            <span className="text-2xl font-black text-white dark:text-slate-900 -rotate-12 italic">VS</span>
          </div>
        </div>

        {/* Player 2 */}
        {/* Player 2 */}
        {opponent ? (
          <div className="flex flex-col items-center bg-white dark:bg-neutral-800 p-8 rounded-3xl shadow-xl border border-primary/30 w-64">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-4 ring-4 ring-primary/20">
              <span className="text-3xl font-black text-primary">{opponent.avatar}</span>
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-neutral-200 truncate w-full text-center">{opponent.name}</h3>
            <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest mt-1">Ready</span>
          </div>
        ) : (
          <div className="flex flex-col items-center bg-slate-100 dark:bg-neutral-800/50 p-8 rounded-3xl border-2 border-dashed border-slate-300 dark:border-neutral-700 w-64 relative overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(0,0,0,0.05)_50%,transparent_75%,transparent_100%)] dark:bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.02)_50%,transparent_75%,transparent_100%)] bg-[length:20px_20px] animate-[slide_1s_linear_infinite]" />
            <div className="w-24 h-24 bg-slate-200 dark:bg-neutral-700 rounded-full flex items-center justify-center mb-4 animate-pulse relative z-10">
              <div className="w-12 h-12 border-4 border-slate-300 dark:border-neutral-600 border-t-slate-500 dark:border-t-neutral-400 rounded-full animate-spin" />
            </div>
            <h3 className="text-lg font-bold text-slate-600 dark:text-neutral-400 relative z-10">Waiting for opponent...</h3>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1 relative z-10">Searching</span>
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-neutral-800 border border-slate-100 dark:border-neutral-800/80 rounded-2xl p-6 shadow-sm w-full max-w-md text-center">
        <h4 className="text-sm font-bold text-slate-800 dark:text-neutral-200 mb-2">Invite your friend</h4>
        <p className="text-xs text-slate-500 dark:text-neutral-400 mb-4">Share this code or link with your opponent so they can join the lobby.</p>
        
        <div className="bg-slate-50 dark:bg-neutral-900 rounded-xl p-4 mb-4">
          <span className="text-3xl font-mono font-black text-slate-800 dark:text-neutral-200 tracking-[0.2em]">{lobbyCode}</span>
        </div>

        <button
          onClick={handleCopy}
          className="w-full py-3 bg-slate-100 dark:bg-neutral-900 hover:bg-slate-200 dark:hover:bg-neutral-950 text-slate-700 dark:text-neutral-300 rounded-xl text-sm font-bold transition flex items-center justify-center gap-2"
        >
          {copied ? "Link Copied!" : "Copy Invite Link"}
        </button>
      </div>

      {opponent && (
        <div className="mt-8">
          <button
            onClick={() => setSimulatorOpen(true)}
            className="px-12 py-4 bg-primary hover:bg-primary-dark text-white rounded-2xl text-lg font-black transition-all shadow-xl shadow-primary/30 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/40 animate-bounce"
          >
            START MATCH
          </button>
        </div>
      )}

      <DuelSimulatorModal
        isOpen={simulatorOpen}
        onClose={() => setSimulatorOpen(false)}
        opponent={opponent}
        problem="Arrays"
      />
    </div>
  );
}
