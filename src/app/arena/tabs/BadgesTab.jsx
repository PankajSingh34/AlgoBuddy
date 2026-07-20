import { Crown, Award, Flame, Zap, Trophy, Star, ShieldCheck, Users } from "lucide-react";

export default function BadgesTab({ badgeCategory, setBadgeCategory }) {
  return (
    <div className="w-full text-left space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
                    {/* Hero Section */}
                    <div className="bg-gradient-to-br from-amber-600 via-orange-500 to-red-500 rounded-3xl p-8 relative overflow-hidden text-white flex flex-col md:flex-row items-center justify-between shadow-2xl shadow-orange-500/20">
                      {/* Abstract Background Shapes */}
                      <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-white/20 rounded-full blur-3xl pointer-events-none"></div>
                      <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-yellow-400/20 rounded-full blur-3xl pointer-events-none"></div>
                      
                      <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
                        <Crown size={300} className="text-white transform rotate-12" />
                      </div>
                      
                      <div className="space-y-4 z-10 text-center md:text-left flex-1">
                        <span className="text-[10px] bg-white/20 text-white font-bold uppercase tracking-wider px-3 py-1.5 rounded-full inline-block mb-2 backdrop-blur-sm border border-white/30 shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                          Achievement Unlocked
                        </span>
                        <h2 className="text-4xl md:text-5xl font-black tracking-tight drop-shadow-md">
                          Your Badges
                        </h2>
                        <p className="text-orange-100 max-w-lg text-sm md:text-base font-medium drop-shadow">
                          Showcase your algorithmic mastery. Earn exclusive badges by completing challenges, winning tournaments, and maintaining long streaks.
                        </p>
                      </div>
                      
                      <div className="mt-8 md:mt-0 z-10 bg-white/10 p-5 rounded-2xl backdrop-blur-md border border-white/20 flex flex-col items-center min-w-[160px] shadow-xl">
                        <span className="text-xs font-bold uppercase tracking-wider text-orange-200 mb-2">Total Earned</span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-5xl font-black text-white drop-shadow-md">12</span>
                          <span className="text-lg font-bold text-orange-300">/ 50</span>
                        </div>
                      </div>
                    </div>

                    {/* Badge Category Filters */}
                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
                      {["All", "Combat", "Learning", "Tournaments"].map((category) => (
                        <button
                          key={category}
                          onClick={() => setBadgeCategory(category)}
                          className={`px-4 py-2 rounded-full text-xs font-bold transition-colors ${
                            badgeCategory === category
                              ? "bg-slate-800 text-white dark:bg-white dark:text-slate-900 shadow-md"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700 border border-slate-200 dark:border-neutral-700"
                          }`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>

                    {/* Badges Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {[
                        { title: "First Blood", desc: "Win your first duel", icon: <Award size={24} />, earned: true, color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20" },
                        { title: "Hot Streak", desc: "Win 3 duels in a row", icon: <Flame size={24} />, earned: true, color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/20" },
                        { title: "Speed Demon", desc: "Solve under 2 minutes", icon: <Zap size={24} />, earned: true, color: "text-yellow-500", bg: "bg-yellow-500/10", border: "border-yellow-500/20" },
                        { title: "Champion", desc: "Win a weekly tournament", icon: <Trophy size={24} />, earned: false, color: "text-slate-400", bg: "bg-slate-100 dark:bg-neutral-800", border: "border-slate-200 dark:border-neutral-700" },
                        { title: "Flawless", desc: "No syntax errors in a match", icon: <Star size={24} />, earned: false, color: "text-slate-400", bg: "bg-slate-100 dark:bg-neutral-800", border: "border-slate-200 dark:border-neutral-700" },
                        { title: "Grandmaster", desc: "Reach 10,000 XP", icon: <Crown size={24} />, earned: false, color: "text-slate-400", bg: "bg-slate-100 dark:bg-neutral-800", border: "border-slate-200 dark:border-neutral-700" },
                        { title: "Defender", desc: "Block 5 hacks", icon: <ShieldCheck size={24} />, earned: true, color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
                        { title: "Veteran", desc: "Play 100 matches", icon: <Users size={24} />, earned: false, color: "text-slate-400", bg: "bg-slate-100 dark:bg-neutral-800", border: "border-slate-200 dark:border-neutral-700" },
                      ].map((badge, idx) => (
                        <div key={idx} className={`relative p-5 rounded-2xl border flex flex-col items-center text-center transition-all duration-300 ${badge.earned ? `${badge.border} bg-white dark:bg-neutral-800 shadow-sm hover:shadow-md hover:-translate-y-1` : `${badge.border} ${badge.bg} opacity-60 grayscale hover:grayscale-0`}`}>
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${badge.bg} ${badge.color}`}>
                            {badge.icon}
                          </div>
                          <h4 className={`font-bold text-sm mb-1 ${badge.earned ? 'text-slate-800 dark:text-neutral-100' : 'text-slate-500 dark:text-neutral-400'}`}>{badge.title}</h4>
                          <p className="text-[10px] text-slate-500 dark:text-neutral-400 leading-tight">{badge.desc}</p>
                          {!badge.earned && (
                            <div className="absolute inset-0 flex items-center justify-center bg-slate-900/5 dark:bg-black/20 rounded-2xl opacity-0 hover:opacity-100 transition-opacity">
                              <span className="text-xs font-bold text-slate-700 dark:text-neutral-300 bg-white/90 dark:bg-neutral-800/90 px-2 py-1 rounded shadow-sm backdrop-blur-sm">Locked</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
  );
}
