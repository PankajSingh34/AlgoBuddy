import { Swords, Trophy } from "lucide-react";

export default function HistoryTab({ }) {
  return (
    <div className="w-full text-left space-y-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-sm font-bold text-slate-800 dark:text-neutral-200">Match History</h4>
                      <input 
                        type="text" 
                        placeholder="Search opponent..." 
                        className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 dark:border-neutral-700 bg-slate-50 dark:bg-neutral-900 focus:outline-none focus:border-primary"
                      />
                    </div>
                    {matchHistory && matchHistory.length > 0 ? (
                      <div className="space-y-3">
                        {matchHistory.map((b) => {
                          const opponentName = b.opponentName;
                          const topic = b.topic;
                          const date = new Date(b.startTime).toLocaleDateString();
                          const result = b.result;
                          const xpAwarded = `+${b.xpAwarded} XP`;
                          const ratingChange = b.ratingChange >= 0 ? `+${b.ratingChange} Rating` : `${b.ratingChange} Rating`;

                          return (
                            <div key={b.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 border border-slate-100 dark:border-neutral-800 bg-slate-50/50 dark:bg-neutral-900/50 rounded-xl gap-4 text-xs transition hover:border-slate-200 dark:hover:border-neutral-700">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1.5">
                                  <span className="font-bold text-slate-700 dark:text-neutral-200 text-sm truncate">
                                    You vs {opponentName}
                                  </span>
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                    result === "Victory"
                                      ? "bg-emerald-500/10 text-emerald-500"
                                      : result === "Defeat" ? "bg-red-500/10 text-red-500" : "bg-slate-500/10 text-slate-500"
                                  }`}>
                                    {result}
                                  </span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-500 dark:text-neutral-400">
                                  <span className="flex items-center gap-1.5"><Target size={12} /> {topic}</span>
                                  <span className="flex items-center gap-1.5"><Clock size={12} /> {date}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-6 justify-between md:justify-end">
                                <div className="text-left md:text-right">
                                  <span className="font-bold text-primary dark:text-purple-400 block">{xpAwarded}</span>
                                  <span className={`text-[11px] font-bold ${ratingChange.startsWith("+") ? "text-emerald-500" : "text-red-500"}`}>
                                    {ratingChange}
                                  </span>
                                </div>
                                <button
                                  onClick={() => {
                                    if (!ensureLoggedIn()) return;
                                    handleWatchLive("You", opponentName, topic);
                                  }}
                                  className="px-4 py-2 bg-white hover:bg-slate-50 dark:bg-neutral-800 dark:hover:bg-neutral-700 border border-slate-200 dark:border-neutral-700 rounded-lg font-bold transition shadow-sm text-slate-700 dark:text-neutral-200"
                                >
                                  Replay
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="p-8 text-center text-sm font-semibold text-slate-500 dark:text-neutral-400 bg-slate-50 dark:bg-neutral-900/50 rounded-xl border border-dashed border-slate-200 dark:border-neutral-700">
                        No match history available yet.
                      </div>
                    )}
                  </div>
  );
}
