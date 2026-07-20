import { Trophy, Star, TrendingUp, Search } from "lucide-react";
import Image from "next/image";

export default function LeaderboardTab({ leaderboard, leaderboardFilter, setLeaderboardFilter, searchQuery, setSearchQuery, expandedRow, setExpandedRow }) {
  return (
    <div className="w-full max-w-md space-y-4 text-left">
                    <div className="flex gap-2 p-1 bg-slate-100 dark:bg-neutral-800 rounded-lg">
                      {["Global", "Friends", "Weekly", "All-Time"].map(filter => (
                        <button
                          key={filter}
                          onClick={() => setLeaderboardFilter(filter)}
                          className={`flex-1 py-1.5 text-xs font-bold rounded-md transition ${
                            leaderboardFilter === filter
                              ? "bg-white dark:bg-neutral-700 text-primary shadow-sm"
                              : "text-slate-500 hover:text-slate-700 dark:hover:text-neutral-300"
                          }`}
                        >
                          {filter}
                        </button>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                        <input 
                          type="text" 
                          placeholder="Search players..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      </div>
                      <button 
                        onClick={() => {
                          const me = displayLeaderboard?.find(u => u.name === profile?.name || u.userId === profile?.userId);
                          if (me) {
                            const el = document.getElementById(`leaderboard-row-${me.rank}`);
                            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                          } else {
                            toast.info("You are not currently ranked in this view.");
                          }
                        }}
                        className="px-3 py-2 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg flex items-center justify-center transition"
                        title="Jump to My Rank"
                      >
                        <Navigation size={14} className="mr-1"/>
                        <span className="text-[10px] font-bold uppercase tracking-wider">Me</span>
                      </button>
                    </div>

                    {/* Top 3 Podium */}
                    {leaderboard && leaderboard.length >= 3 && !searchQuery.trim() && leaderboardFilter === "Global" && (
                      (() => {
                        const getDisplayName = (player) => player.name || (player.userId ? `User ${player.userId.substring(0,4)}` : "Unknown");
                        const p1 = leaderboard[0], p2 = leaderboard[1], p3 = leaderboard[2];
                        const n1 = getDisplayName(p1), n2 = getDisplayName(p2), n3 = getDisplayName(p3);
                        return (
                          <div className="flex justify-center items-end gap-4 my-6 pt-4 pb-2 px-4 bg-gradient-to-t from-slate-100/50 to-transparent dark:from-neutral-900/50 rounded-xl relative">
                            {/* 2nd Place */}
                            <div className="flex flex-col items-center pb-2">
                              <div className="relative">
                                <div className="w-10 h-10 rounded-full border-2 border-slate-300 dark:border-neutral-500 overflow-hidden mb-1">
                                  {p2.avatarUrl ? <img src={p2.avatarUrl} alt="2nd" className="w-full h-full object-cover"/> : <div className="w-full h-full bg-slate-200 dark:bg-neutral-700 flex items-center justify-center text-[10px] font-bold text-slate-500 dark:text-neutral-400">{getInitials(n2)}</div>}
                                </div>
                                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-slate-300 dark:bg-neutral-600 rounded-full w-4 h-4 flex items-center justify-center text-[8px] font-bold text-slate-700 dark:text-slate-200 shadow-md ring-1 ring-white dark:ring-neutral-900">2</div>
                              </div>
                              <span className="text-[10px] font-bold text-slate-700 dark:text-neutral-300 truncate max-w-[60px] mt-1">{n2.split(" ")[0]}</span>
                              <span className="text-[9px] font-bold text-slate-500">{p2.rating}</span>
                            </div>
                            
                            {/* 1st Place */}
                            <div className="flex flex-col items-center relative z-10 pb-4">
                              <Trophy size={16} className="text-amber-500 mb-1 drop-shadow-md"/>
                              <div className="relative">
                                <div className="w-14 h-14 rounded-full border-2 border-amber-400 dark:border-amber-500 overflow-hidden mb-1 ring-4 ring-amber-400/20 shadow-lg shadow-amber-500/20">
                                  {p1.avatarUrl ? <img src={p1.avatarUrl} alt="1st" className="w-full h-full object-cover"/> : <div className="w-full h-full bg-slate-200 dark:bg-neutral-700 flex items-center justify-center text-xs font-bold text-amber-500">{getInitials(n1)}</div>}
                                </div>
                                <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 bg-amber-400 dark:bg-amber-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold shadow-md ring-2 ring-white dark:ring-neutral-900">1</div>
                              </div>
                              <span className="text-xs font-bold text-slate-900 dark:text-white mt-1.5 truncate max-w-[80px]">{n1.split(" ")[0]}</span>
                              <span className="text-[10px] font-bold text-amber-600 dark:text-amber-500">{p1.rating}</span>
                            </div>
                            
                            {/* 3rd Place */}
                            <div className="flex flex-col items-center pb-1">
                              <div className="relative">
                                <div className="w-9 h-9 rounded-full border-2 border-orange-700/50 dark:border-orange-900 overflow-hidden mb-1">
                                  {p3.avatarUrl ? <img src={p3.avatarUrl} alt="3rd" className="w-full h-full object-cover"/> : <div className="w-full h-full bg-slate-200 dark:bg-neutral-700 flex items-center justify-center text-[9px] font-bold text-orange-800 dark:text-orange-700">{getInitials(n3)}</div>}
                                </div>
                                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-orange-300 dark:bg-orange-900/80 text-orange-900 dark:text-orange-400 rounded-full w-4 h-4 flex items-center justify-center text-[8px] font-bold shadow-md ring-1 ring-white dark:ring-neutral-900">3</div>
                              </div>
                              <span className="text-[10px] font-bold text-slate-700 dark:text-neutral-300 truncate max-w-[60px] mt-1">{n3.split(" ")[0]}</span>
                              <span className="text-[9px] font-bold text-slate-500">{p3.rating}</span>
                            </div>
                          </div>
                        );
                      })()
                    )}

                    <div className="space-y-2">
                      {leaderboard && leaderboard.length > 0 ? (
                        (() => {
                          let displayLeaderboard = leaderboardFilter === "Friends" 
                            ? leaderboard.filter((_, i) => i % 5 === 0)
                            : leaderboardFilter === "Weekly"
                              ? [...leaderboard].slice(0, 15).sort((a,b) => b.winRate - a.winRate)
                              : leaderboard;
                              
                          if (searchQuery.trim()) {
                            const query = searchQuery.toLowerCase();
                            displayLeaderboard = displayLeaderboard.filter(row => {
                              const name = row.name || (row.userId ? `User ${row.userId.substring(0,4)}` : "Unknown");
                              return name.toLowerCase().includes(query);
                            });
                          }
                              
                          if (displayLeaderboard.length === 0) {
                            return (
                              <div className="p-4 text-center text-xs font-semibold text-slate-500 dark:text-neutral-400">
                                No players found in this category.
                              </div>
                            );
                          }

                          return displayLeaderboard.map((row, idx) => {
                            const rank = row.rank || idx + 1;
                            const name = row.name || (row.userId ? `User ${row.userId.substring(0,4)}` : "Unknown");
                            const isMe = name === profile?.name || row.userId === profile?.userId;
                            const isExpanded = expandedRow === rank;
                        return (
                          <div 
                            key={rank} 
                            id={`leaderboard-row-${rank}`}
                            className={`flex flex-col p-2.5 border-b border-slate-50 dark:border-neutral-800 text-xs transition-colors duration-500 cursor-pointer ${isMe ? 'bg-primary/5 dark:bg-primary/10' : 'hover:bg-slate-50 dark:hover:bg-neutral-800/50'}`}
                            onClick={() => setExpandedRow(isExpanded ? null : rank)}
                          >
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-3">
                                <span className="font-semibold">{rank}.</span>
                                {/* Avatar Circle */}
                                <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-neutral-700 flex items-center justify-center font-bold text-[9px] text-slate-650 dark:text-neutral-300 overflow-hidden shrink-0">
                                  {row.avatarUrl ? (
                                    <img 
                                      src={row.avatarUrl} 
                                      alt={name} 
                                      referrerPolicy="no-referrer"
                                      className="w-full h-full object-cover" 
                                      />
                                  ) : (
                                    getInitials(name)
                                  )}
                                </div>
                                <span className="font-semibold text-slate-850 dark:text-neutral-200">{name}</span>
                              </div>
                              <div className="flex items-center gap-3">
                                {row.trend === "up" && <span className="text-emerald-500 font-bold flex items-center gap-0.5 text-[10px]"><TrendingUp size={12}/>{row.trendValue}</span>}
                                {row.trend === "down" && <span className="text-red-500 font-bold flex items-center gap-0.5 text-[10px]"><TrendingDown size={12}/>{row.trendValue}</span>}
                                {row.trend === "hot" && <span className="text-orange-500 font-bold flex items-center gap-0.5 text-[10px]"><Flame size={12}/>Streak</span>}
                                {row.trend === "same" && <span className="text-slate-400 font-bold flex items-center gap-0.5 text-[10px]"><Minus size={12}/></span>}
                                {row.tier && getTierBadge(row.tier)}
                                <span className="font-bold text-primary">{row.rating} Rating</span>
                              </div>
                            </div>
                            
                            {isExpanded && (
                              <div className="mt-3 pt-3 border-t border-slate-100 dark:border-neutral-800 flex justify-between text-slate-500 dark:text-neutral-400">
                                <div className="flex flex-col gap-1">
                                  <span className="text-[10px] uppercase font-bold tracking-wider">Win Rate</span>
                                  <span className="font-semibold text-slate-800 dark:text-neutral-200">{row.winRate || 50}%</span>
                                </div>
                                <div className="flex flex-col gap-1 text-right">
                                  <span className="text-[10px] uppercase font-bold tracking-wider">Top Languages</span>
                                  <div className="flex gap-1 justify-end">
                                    {(row.topLanguages || ["JavaScript", "Python"]).map(lang => (
                                      <span key={lang} className="px-1.5 py-0.5 bg-slate-100 dark:bg-neutral-800 rounded font-semibold text-[10px] text-slate-700 dark:text-neutral-300">{lang}</span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                          });
                        })()
                      ) : (
                        <div className="p-4 text-center text-xs font-semibold text-slate-500 dark:text-neutral-400">
                          Leaderboard is currently empty.
                        </div>
                      )}
                    </div>
                  </div>
  );
}
