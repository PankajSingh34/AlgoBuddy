import { Radio, Eye, Clock, Swords } from "lucide-react";

export default function LiveTab({ liveMatches, handleWatchLive }) {
  return (
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
  );
}
