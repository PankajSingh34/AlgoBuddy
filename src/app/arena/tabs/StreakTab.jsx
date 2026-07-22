import { Flame, Check, HelpCircle } from "lucide-react";
import ActivityHeatmap from "@/app/components/ui/ActivityHeatmap";

export default function StreakTab({ profile }) {
  return (
    <div className="w-full text-left space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
                    {/* Hero Section */}
                    <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-3xl p-6 relative overflow-hidden text-white flex flex-col md:flex-row items-center justify-between border border-amber-600 shadow-xl shadow-amber-500/20 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-100 fill-mode-both">
                      <div className="absolute -right-10 -bottom-10 opacity-20 pointer-events-none">
                        <Flame size={240} className="text-white" />
                      </div>
                      <div className="space-y-3 z-10 text-center md:text-left">
                        <span className="text-[10px] bg-white/20 text-white border border-white/30 font-bold uppercase tracking-wider px-2.5 py-1 rounded-full inline-block mb-1">
                          Keep The Fire Burning
                        </span>
                        <h2 className="text-3xl font-black tracking-tight drop-shadow-md">
                          Maintain Your Momentum!
                        </h2>
                        <p className="text-sm text-amber-100 max-w-md">
                          You are currently on a <strong className="text-white">{streakData?.current || 0}-day</strong> streak. 
                          Only <strong className="text-white">{Math.max(10, Math.ceil(((streakData?.current || 0) + 1) / 10) * 10) - (streakData?.current || 0)}</strong> days left to hit your next milestone. Log in and solve problems daily to keep it alive!
                        </p>
                      </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="group bg-white dark:bg-neutral-800 border border-slate-100 dark:border-neutral-800/80 rounded-2xl p-5 flex items-center gap-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-amber-500/30 animate-in zoom-in-95 duration-500 delay-200 fill-mode-both relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none group-hover:bg-amber-500/10 transition-colors duration-500"></div>
                        <div className="w-14 h-14 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0">
                          <Flame size={28} className="animate-pulse" />
                        </div>
                        <div>
                          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Current Streak</div>
                          <div className="text-2xl font-black text-slate-800 dark:text-neutral-200">{streakData?.current || 0}</div>
                        </div>
                      </div>
                      <div className="group bg-white dark:bg-neutral-800 border border-slate-100 dark:border-neutral-800/80 rounded-2xl p-5 flex items-center gap-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-primary/30 animate-in zoom-in-95 duration-500 delay-300 fill-mode-both relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none group-hover:bg-primary/10 transition-colors duration-500"></div>
                        <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                          <Trophy size={28} />
                        </div>
                        <div>
                          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Longest Streak</div>
                          <div className="text-2xl font-black text-slate-800 dark:text-neutral-200">{streakData?.longest || 0}</div>
                        </div>
                      </div>
                      <div className="group bg-white dark:bg-neutral-800 border border-slate-100 dark:border-neutral-800/80 rounded-2xl p-5 flex items-center gap-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-indigo-500/30 animate-in zoom-in-95 duration-500 delay-400 fill-mode-both relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none group-hover:bg-indigo-500/10 transition-colors duration-500"></div>
                        <div className="w-14 h-14 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 shrink-0">
                          <Calendar size={28} />
                        </div>
                        <div>
                          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Total Days Active</div>
                          <div className="text-2xl font-black text-slate-800 dark:text-neutral-200">14</div>
                        </div>
                      </div>
                    </div>

                    {/* Heatmap */}
                    <div className="bg-white dark:bg-neutral-800 border border-slate-100 dark:border-neutral-800/80 rounded-2xl p-6 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500 delay-500 fill-mode-both relative">
                      <ActivityHeatmap currentStreak={streakData?.current} longestStreak={streakData?.longest} />
                    </div>

                    <div className="bg-gradient-to-r from-primary to-purple-600 border border-primary/20 rounded-2xl p-6 text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-primary/20 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-700 fill-mode-both">
                      <div className="absolute -right-10 -bottom-10 opacity-20 pointer-events-none">
                        <Share2 size={200} />
                      </div>
                      <div className="relative z-10 text-center md:text-left flex-1">
                        <h5 className="text-xl font-black mb-1">Brag About Your Streak!</h5>
                        <p className="text-sm text-white/90 max-w-md">
                          You're on a <strong>{streakData?.current || 0} day</strong> coding streak! Show off your dedication to your friends and rivals.
                        </p>
                      </div>
                      <div className="relative z-10 shrink-0">
                        <button 
                          onClick={() => {
                            toast.success("Link copied to clipboard!");
                          }}
                          className="px-6 py-3 bg-white text-primary rounded-xl text-sm font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center gap-2 group"
                        >
                          <Share2 size={18} className="group-hover:scale-110 transition-transform" />
                          Share My Streak
                        </button>
                      </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl p-6 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
                      <div className="absolute -left-6 -bottom-6 opacity-5 text-indigo-500 pointer-events-none">
                        <Shield size={160} />
                      </div>
                      <div className="relative z-10 text-center md:text-left flex-1">
                        <h5 className="text-lg font-bold text-slate-800 dark:text-neutral-200 flex items-center justify-center md:justify-start gap-2">
                          <Shield size={20} className="text-indigo-500" />
                          Streak Freeze
                        </h5>
                        <p className="text-xs text-slate-500 dark:text-neutral-400 mt-2 leading-relaxed">
                          Protect your hard-earned streak! A Streak Freeze saves your streak if you miss a day of coding. It will be consumed automatically.
                        </p>
                      </div>
                      <div className="relative z-10 shrink-0">
                        {hasFreeze ? (
                          <div className="flex flex-col items-center">
                            <button 
                              onClick={() => setHasFreeze(false)}
                              className="px-6 py-2.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-500 dark:text-indigo-400 rounded-xl text-sm font-bold shadow-inner flex items-center gap-2 border border-indigo-200 dark:border-indigo-800/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition"
                            >
                              <Shield size={16} />
                              Equipped
                            </button>
                            <span className="text-[10px] text-slate-400 mt-2 font-semibold">Ready to protect your streak.</span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center">
                            <button 
                              onClick={() => {
                                if ((profile?.xp || 0) >= 500) {
                                  setHasFreeze(true);
                                  toast.success("Streak Freeze equipped!");
                                } else {
                                  toast.error("Not enough XP! You need 500 XP.");
                                }
                              }}
                              className="px-6 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-md shadow-indigo-500/20 transition flex items-center gap-2 group"
                            >
                              <Shield size={16} className="group-hover:scale-110 transition-transform" />
                              Equip Freeze
                            </button>
                            <span className="text-[10px] font-bold text-slate-500 mt-2">Cost: 500 XP</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
  );
}
