import { Trophy, Clock, Users, ArrowRight, Play, Calendar, History, Sparkles, Award, Flame, TrendingUp, Crown } from "lucide-react";
import TournamentCard from "@/app/components/ui/TournamentCard";

export default function TournamentsTab({ tournamentFilter, setTournamentFilter, tournamentTimeLeft, isLoadingTournaments }) {
  return (
    <div className="w-full text-left space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
                    {/* Hero Section */}
                    <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 rounded-3xl p-8 relative overflow-hidden text-white flex flex-col md:flex-row items-center justify-between border border-indigo-500/30 shadow-2xl shadow-indigo-500/20">
                      {/* Abstract Background Shapes */}
                      <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-primary/30 rounded-full blur-3xl pointer-events-none"></div>
                      <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none"></div>
                      
                      {/* Dynamic Background Particles (Grid & Floating Orbs) */}
                      <div className="absolute inset-0 pointer-events-none overflow-hidden">
                        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
                        <div className="absolute top-[20%] left-[10%] w-2 h-2 rounded-full bg-cyan-400/40 blur-[1px] animate-pulse" style={{ animationDuration: '3s' }}></div>
                        <div className="absolute top-[60%] left-[30%] w-3 h-3 rounded-full bg-indigo-400/40 blur-[1px] animate-pulse" style={{ animationDuration: '4s' }}></div>
                        <div className="absolute top-[30%] right-[25%] w-1.5 h-1.5 rounded-full bg-cyan-300/50 blur-[1px] animate-pulse" style={{ animationDuration: '2.5s' }}></div>
                        <div className="absolute bottom-[20%] right-[15%] w-2.5 h-2.5 rounded-full bg-purple-400/40 blur-[1px] animate-pulse" style={{ animationDuration: '3.5s' }}></div>
                        <div className="absolute top-[80%] left-[50%] w-2 h-2 rounded-full bg-cyan-400/40 blur-[1px] animate-pulse" style={{ animationDuration: '2s' }}></div>
                      </div>
                      
                      <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
                        <Trophy size={300} className="text-white transform -rotate-12" />
                      </div>
                      
                      <div className="space-y-4 z-10 text-center md:text-left flex-1">
                        <span className="text-[10px] bg-white/10 text-cyan-300 border border-cyan-400/30 font-bold uppercase tracking-wider px-3 py-1.5 rounded-full inline-flex items-center gap-2 mb-2 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                          Registrations Open
                        </span>
                        <h2 className="text-4xl md:text-5xl font-black tracking-tight drop-shadow-lg leading-tight">
                          AlgoBuddy <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-primary-light">Weekly Cup</span>
                        </h2>
                        <p className="text-sm md:text-base text-indigo-200 max-w-lg font-medium">
                          Compete in our premier weekly algorithmic showdown. Solve 4 problems in 90 minutes. 
                          Win exclusive badges, massive XP, and global glory.
                        </p>
                      </div>

                      <div className="z-10 mt-8 md:mt-0 flex flex-col items-center bg-black/20 backdrop-blur-md border border-white/10 p-5 rounded-2xl">
                        <div className="flex items-center gap-2 mb-4 text-indigo-200">
                          <Clock size={16} />
                          <span className="text-xs font-bold uppercase tracking-wider">Tournament Starts In</span>
                        </div>
                        <div className="flex gap-3">
                          {[
                            { label: 'Days', value: tournamentTimeLeft.days },
                            { label: 'Hours', value: tournamentTimeLeft.hours },
                            { label: 'Mins', value: tournamentTimeLeft.minutes },
                            { label: 'Secs', value: tournamentTimeLeft.seconds }
                          ].map((unit, idx) => (
                            <div key={idx} className="flex flex-col items-center">
                              <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center border border-white/5 shadow-inner mb-2">
                                <span className={`text-xl font-black ${unit.label === 'Secs' ? 'text-cyan-400' : 'text-white'}`}>
                                  {unit.value.toString().padStart(2, '0')}
                                </span>
                              </div>
                              <span className="text-[9px] font-bold text-indigo-300 uppercase tracking-widest">{unit.label}</span>
                            </div>
                          ))}
                        </div>
                    </div>
                    </div>

                    {/* Player Stats Dashboard Card */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex flex-col border-r border-slate-100 dark:border-neutral-800 pr-4 relative group">
                        <div className="absolute inset-0 bg-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl -m-2"></div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1.5"><Trophy size={12} className="text-amber-500" /> Tournaments Won</span>
                        <span className="text-2xl font-black text-slate-800 dark:text-neutral-100">4</span>
                      </div>
                      <div className="flex flex-col md:border-r border-slate-100 dark:border-neutral-800 pr-4 relative group">
                        <div className="absolute inset-0 bg-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl -m-2"></div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1.5"><Award size={12} className="text-purple-500" /> Average Rank</span>
                        <span className="text-2xl font-black text-slate-800 dark:text-neutral-100">Top 12%</span>
                      </div>
                      <div className="flex flex-col border-r border-slate-100 dark:border-neutral-800 pr-4 relative group">
                        <div className="absolute inset-0 bg-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl -m-2"></div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1.5"><Flame size={12} className="text-red-500" /> Best Win Streak</span>
                        <span className="text-2xl font-black text-slate-800 dark:text-neutral-100">3</span>
                      </div>
                      <div className="flex flex-col relative group">
                        <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl -m-2"></div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1.5"><TrendingUp size={12} className="text-emerald-500" /> Total Earnings</span>
                        <span className="text-2xl font-black text-emerald-500 drop-shadow-sm">12,500 XP</span>
                      </div>
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-neutral-800/50 rounded-xl overflow-x-auto no-scrollbar">
                      {[
                        { id: "Live", icon: Play },
                        { id: "Upcoming", icon: Calendar },
                        { id: "Past", icon: History },
                        { id: "Bracket", icon: Trophy }
                      ].map((filter) => (
                        <button
                          key={filter.id}
                          onClick={() => setTournamentFilter(filter.id)}
                          className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-lg transition-all whitespace-nowrap ${
                            tournamentFilter === filter.id
                              ? "bg-white dark:bg-neutral-700 text-primary dark:text-primary-light shadow-sm"
                              : "text-slate-500 dark:text-neutral-400 hover:text-slate-700 dark:hover:text-neutral-300 hover:bg-slate-200/50 dark:hover:bg-neutral-700/50"
                          }`}
                        >
                          <filter.icon size={16} className={tournamentFilter === filter.id ? "text-primary dark:text-primary-light" : "opacity-70"} />
                          {filter.id}
                          {filter.id === "Live" && (
                            <span className="relative flex h-2 w-2 ml-1">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                            </span>
                          )}
                        </button>
                      ))}
                    </div>

                    {/* Content Placeholder */}
                    {tournamentFilter === "Live" ? (
                      <div className="bg-white dark:bg-neutral-800 border border-slate-100 dark:border-neutral-800/80 rounded-2xl p-5 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                          <h3 className="text-base font-bold text-slate-800 dark:text-neutral-200">Current Live Standings</h3>
                          <span className="px-2 py-1 rounded bg-red-500/10 text-red-500 text-[10px] font-black uppercase tracking-widest animate-pulse">
                            Live
                          </span>
                        </div>
                        <div className="space-y-2">
                          {[
                            { rank: 1, name: "Alex Chen", score: 400, time: "45:12" },
                            { rank: 2, name: "Sarah J.", score: 380, time: "48:05" },
                            { rank: 3, name: "Mike T.", score: 350, time: "52:10" },
                            { rank: 4, name: "You", score: 200, time: "15:00", isYou: true },
                            { rank: 5, name: "David K.", score: 180, time: "18:20" },
                          ].map((player) => (
                            <div key={player.rank} className={`flex items-center justify-between p-3 rounded-xl border ${player.isYou ? 'bg-primary/5 border-primary/30' : 'bg-slate-50 dark:bg-neutral-900/50 border-slate-100 dark:border-neutral-800'}`}>
                              <div className="flex items-center gap-4">
                                <span className={`w-6 text-center font-black ${player.rank === 1 ? 'text-amber-500' : player.rank === 2 ? 'text-slate-400' : player.rank === 3 ? 'text-orange-700' : 'text-slate-500'}`}>#{player.rank}</span>
                                <span className={`font-bold ${player.isYou ? 'text-primary' : 'text-slate-700 dark:text-neutral-200'}`}>{player.name}</span>
                              </div>
                              <div className="flex items-center gap-6 text-sm font-semibold">
                                <span className="text-slate-500 dark:text-neutral-400">{player.time}</span>
                                <span className="w-12 text-right text-slate-800 dark:text-neutral-100">{player.score} pts</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : tournamentFilter === "Upcoming" ? (
                      isLoadingTournaments ? (
                        <div className="space-y-4">
                          {[1, 2].map((i) => (
                            <div key={i} className="bg-white dark:bg-neutral-800 border border-slate-100 dark:border-neutral-800/80 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row gap-5 items-start md:items-center">
                              <div className="w-16 h-16 rounded-2xl bg-slate-200 dark:bg-neutral-700 animate-pulse shrink-0"></div>
                              <div className="flex-1 w-full space-y-3">
                                <div className="h-5 bg-slate-200 dark:bg-neutral-700 rounded w-1/3 animate-pulse"></div>
                                <div className="h-4 bg-slate-200 dark:bg-neutral-700 rounded w-2/3 animate-pulse"></div>
                                <div className="flex gap-4 pt-2">
                                  <div className="h-3 bg-slate-200 dark:bg-neutral-700 rounded w-16 animate-pulse"></div>
                                  <div className="h-3 bg-slate-200 dark:bg-neutral-700 rounded w-16 animate-pulse"></div>
                                  <div className="h-3 bg-slate-200 dark:bg-neutral-700 rounded w-24 animate-pulse"></div>
                                </div>
                              </div>
                              <div className="w-full md:w-[140px] h-24 bg-slate-200 dark:bg-neutral-700 rounded-xl animate-pulse shrink-0 mt-4 md:mt-0"></div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <TournamentCard tournament={{
                            title: "AlgoBuddy Weekly Cup",
                            status: "upcoming",
                            description: "The official weekly algorithmic showdown. Solve 4 problems in 90 minutes.",
                            date: "Sunday, 6:00 PM UTC",
                            duration: "90 mins",
                            participants: 1250,
                            prize: "10k XP + Weekly Champion Badge",
                            color: "bg-primary/5 group-hover:bg-primary/10",
                            iconBg: "bg-primary/10 text-primary"
                          }} />
                          <TournamentCard tournament={{
                            title: "Dynamic Programming Sprint",
                            status: "upcoming",
                            description: "A rapid-fire contest focusing exclusively on DP problems. 1D, 2D, and Trees.",
                            date: "Tuesday, 4:00 PM UTC",
                            duration: "60 mins",
                            participants: 840,
                            prize: "5k XP",
                            color: "bg-blue-500/5 group-hover:bg-blue-500/10",
                            iconBg: "bg-blue-500/10 text-blue-500"
                          }} />
                        </div>
                      )
                    ) : tournamentFilter === "Past" ? (
                      <div className="space-y-4">
                        {[
                          { title: "Graph Theory Masterclass", date: "Last Sunday", winner: "Alex Chen", score: "400/400", time: "38:15", yourRank: 12 },
                          { title: "Beginner's Array Challenge", date: "2 weeks ago", winner: "Sarah J.", score: "400/400", time: "42:01", yourRank: 5 },
                        ].map((past, idx) => (
                          <div key={idx} className="bg-white dark:bg-neutral-800 border border-slate-100 dark:border-neutral-800/80 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 opacity-75 hover:opacity-100 transition-opacity">
                            <div className="flex-1">
                              <h4 className="font-bold text-slate-800 dark:text-neutral-100 mb-1">{past.title}</h4>
                              <span className="text-xs text-slate-500 dark:text-neutral-400">{past.date}</span>
                            </div>
                            <div className="flex items-center gap-8 text-sm">
                              <div>
                                <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Winner</span>
                                <span className="font-bold text-slate-700 dark:text-neutral-200 flex items-center gap-1.5"><Crown size={14} className="text-amber-500" /> {past.winner}</span>
                              </div>
                              <div>
                                <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Top Score</span>
                                <span className="font-bold text-slate-700 dark:text-neutral-200">{past.score}</span>
                              </div>
                              <div className="text-right">
                                <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Your Rank</span>
                                <span className="font-bold text-primary">#{past.yourRank}</span>
                              </div>
                            </div>
                            <button className="px-4 py-2 rounded-lg border border-slate-200 dark:border-neutral-700 text-xs font-bold text-slate-600 dark:text-neutral-300 hover:bg-slate-50 dark:hover:bg-neutral-700/50 transition-colors">
                              View Full Results
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : tournamentFilter === "Bracket" ? (
                      <div className="bg-white dark:bg-neutral-800 border border-slate-100 dark:border-neutral-800/80 rounded-2xl p-6 shadow-sm overflow-x-auto">
                        <div className="min-w-[700px]">
                          <div className="flex justify-between items-center mb-8">
                            <h3 className="text-base font-bold text-slate-800 dark:text-neutral-200">Weekly Cup - Playoffs</h3>
                            <div className="flex gap-4 text-xs font-bold text-slate-500">
                              <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Winner</span>
                              <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-neutral-600"></div> Eliminated</span>
                            </div>
                          </div>
                          
                          <div className="flex justify-between relative">
                            {/* Round 1: Quarterfinals */}
                            <div className="flex flex-col justify-around h-[400px] w-64 z-10">
                              {[
                                { p1: "Alex Chen", s1: 400, p2: "David K.", s2: 320, w: 1 },
                                { p1: "Sarah J.", s1: 380, p2: "Mike T.", s2: 390, w: 2 },
                                { p1: "You", s1: 400, p2: "Anna L.", s2: 350, w: 1, isYou: true },
                                { p1: "John D.", s1: 310, p2: "Emma W.", s2: 370, w: 2 }
                              ].map((match, i) => (
                                <div key={i} className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-700 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow relative">
                                  <div className={`p-2 flex justify-between items-center text-sm ${match.w === 1 ? 'bg-emerald-50 dark:bg-emerald-900/10 font-bold text-emerald-700 dark:text-emerald-400' : 'text-slate-500 dark:text-neutral-400 opacity-70'} ${match.isYou && match.w === 1 ? 'border-l-2 border-primary' : ''}`}>
                                    <span>{match.p1}</span>
                                    <span>{match.s1}</span>
                                  </div>
                                  <div className="h-px w-full bg-slate-100 dark:bg-neutral-800"></div>
                                  <div className={`p-2 flex justify-between items-center text-sm ${match.w === 2 ? 'bg-emerald-50 dark:bg-emerald-900/10 font-bold text-emerald-700 dark:text-emerald-400' : 'text-slate-500 dark:text-neutral-400 opacity-70'} ${match.isYou && match.w === 2 ? 'border-l-2 border-primary' : ''}`}>
                                    <span>{match.p2}</span>
                                    <span>{match.s2}</span>
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Connecting Lines QF to SF */}
                            <svg className="absolute left-64 top-0 w-16 h-full pointer-events-none stroke-slate-200 dark:stroke-neutral-700 stroke-2 fill-none" preserveAspectRatio="none">
                              <path d="M0,50 L32,50 L32,150 L64,150" />
                              <path d="M0,150 L32,150" />
                              <path d="M0,250 L32,250 L32,350 L64,350" />
                              <path d="M0,350 L32,350" />
                            </svg>

                            {/* Round 2: Semifinals */}
                            <div className="flex flex-col justify-around h-[400px] w-64 ml-16 z-10">
                              {[
                                { p1: "Alex Chen", s1: 390, p2: "Mike T.", s2: 400, w: 2 },
                                { p1: "You", s1: 400, p2: "Emma W.", s2: 380, w: 1, isYou: true }
                              ].map((match, i) => (
                                <div key={i} className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-700 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow relative">
                                  <div className={`p-2 flex justify-between items-center text-sm ${match.w === 1 ? 'bg-emerald-50 dark:bg-emerald-900/10 font-bold text-emerald-700 dark:text-emerald-400' : 'text-slate-500 dark:text-neutral-400 opacity-70'} ${match.isYou && match.w === 1 ? 'border-l-2 border-primary' : ''}`}>
                                    <span>{match.p1}</span>
                                    <span>{match.s1}</span>
                                  </div>
                                  <div className="h-px w-full bg-slate-100 dark:bg-neutral-800"></div>
                                  <div className={`p-2 flex justify-between items-center text-sm ${match.w === 2 ? 'bg-emerald-50 dark:bg-emerald-900/10 font-bold text-emerald-700 dark:text-emerald-400' : 'text-slate-500 dark:text-neutral-400 opacity-70'} ${match.isYou && match.w === 2 ? 'border-l-2 border-primary' : ''}`}>
                                    <span>{match.p2}</span>
                                    <span>{match.s2}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                            
                            {/* Connecting Lines SF to Final */}
                            <svg className="absolute left-[34rem] top-0 w-16 h-full pointer-events-none stroke-slate-200 dark:stroke-neutral-700 stroke-2 fill-none" preserveAspectRatio="none">
                              <path d="M0,150 L32,150 L32,250 L64,250" />
                              <path d="M0,350 L32,350 L32,250" />
                            </svg>

                            {/* Round 3: Final */}
                            <div className="flex flex-col justify-center h-[400px] w-64 ml-16 z-10">
                              <div className="bg-white dark:bg-neutral-900 border-2 border-amber-400/50 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow relative ring-4 ring-amber-400/10">
                                <div className="absolute top-0 right-0 p-1">
                                  <Crown size={12} className="text-amber-500 opacity-50" />
                                </div>
                                <div className="p-3 flex justify-between items-center font-bold bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 text-base">
                                  <span className="flex items-center gap-2"><Trophy size={14} /> You</span>
                                  <span>400</span>
                                </div>
                                <div className="h-px w-full bg-amber-200 dark:bg-amber-900/50"></div>
                                <div className="p-3 flex justify-between items-center text-sm text-slate-500 dark:text-neutral-400 opacity-70">
                                  <span>Mike T.</span>
                                  <span>395</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </div>
  );
}
