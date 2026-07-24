import { Trophy, ArrowUpRight, Zap, Target, Star, Swords, Layout, Flame, Gift } from "lucide-react";

export default function RankedTab({ profile, rankProgress, ringDashoffset, ringCircumference, openMatchmakingModal, currentRank, rankedMatches }) {
  const RankIcon = currentRank.Icon;
  return (
    <div className="w-full text-left space-y-6">
                    <div>
                      <h4 className="text-xl font-extrabold text-slate-800 dark:text-neutral-200 mb-1">Ranked Matchmaking</h4>
                      <p className="text-xs text-slate-500 dark:text-neutral-400">Compete against similarly skilled opponents to climb the ranks.</p>
                    </div>

                    <div className="bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
                      <div className="relative mb-6">
                        <div className="w-32 h-32 rounded-full border-4 border-slate-200 dark:border-neutral-800 flex items-center justify-center shadow-inner bg-white dark:bg-neutral-800 relative z-10">
                          <RankIcon size={64} className={currentRank.color} />
                        </div>
                        <div className={`absolute inset-0 rounded-full border-4 ${currentRank.ringColor} border-t-transparent border-l-transparent transform rotate-45 z-20`}></div>
                      </div>
                      
                      <h3 className={`text-2xl font-black uppercase tracking-widest mb-1 ${currentRank.color === 'text-slate-400' ? 'text-slate-800 dark:text-neutral-200' : currentRank.color}`}>{currentRank.name}</h3>
                      <p className="text-xs text-slate-500 font-bold mb-6">
                        {rankedMatches.length >= 5 ? `${profile?.xp || 0} Rating` : "Play 5 placement matches to reveal your rank"}
                      </p>

                      <div className="w-full max-w-sm mb-6">
                        <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-2">
                          <span>Placement Progress</span>
                          <span>0 / 5</span>
                        </div>
                        <div className="bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl p-4 flex flex-col items-center justify-center text-center flex-1">
                          <Flame size={20} className="text-orange-500 mb-2" />
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Win Streak</span>
                          <span className="text-lg font-black text-slate-800 dark:text-neutral-200 mt-1">{profile?.stats?.currentWinStreak || 0}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between mt-6">
                      <div className="flex items-center gap-4 mb-4 md:mb-0 text-left">
                        <div className="w-12 h-12 bg-white dark:bg-neutral-800 rounded-full flex items-center justify-center shadow-sm shrink-0">
                          <Gift className="text-purple-500" size={24} />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-800 dark:text-neutral-200">Season 1 Rewards</h4>
                          <p className="text-[10px] text-slate-500 dark:text-neutral-400 mt-0.5">Reach Gold tier or higher to unlock the exclusive "Algorithm Master" profile badge and 1000 XP.</p>
                        </div>
                      </div>
                      <div className="text-center md:text-right shrink-0">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Season Ends In</span>
                        <div className="flex gap-2 mt-1 justify-center md:justify-end">
                          <div className="px-2 py-1 bg-white dark:bg-neutral-800 rounded border border-slate-100 dark:border-neutral-700 text-xs font-black text-slate-800 dark:text-neutral-200">14<span className="text-[9px] font-bold text-slate-400 ml-0.5">d</span></div>
                          <div className="px-2 py-1 bg-white dark:bg-neutral-800 rounded border border-slate-100 dark:border-neutral-700 text-xs font-black text-slate-800 dark:text-neutral-200">12<span className="text-[9px] font-bold text-slate-400 ml-0.5">h</span></div>
                        </div>
                      </div>
                    </div>
                  </div>
  );
}
