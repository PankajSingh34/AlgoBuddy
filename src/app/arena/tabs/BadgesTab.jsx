import { Crown, Award, Flame, Zap, Trophy, Star, ShieldCheck, Users } from "lucide-react";

export default function BadgesTab({ badgeCategory, setBadgeCategory }) {
  return (
                  <div className="w-full text-left space-y-6">
                    <div>
                      <h4 className="text-xl font-extrabold text-slate-800 dark:text-neutral-200 mb-1">Badges & Achievements</h4>
                      <p className="text-xs text-slate-500 dark:text-neutral-400">Complete challenges and win battles to unlock exclusive badges.</p>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { title: "First Blood", desc: "Win your first Arena match", icon: "🩸", unlocked: true, progress: 1, max: 1 },
                        { title: "Module Master", desc: "Complete all basic algorithms", icon: "🏆", unlocked: true, progress: 10, max: 10 },
                        { title: "7-Day Streak", desc: "Maintain a 7-day learning streak", icon: "🔥", unlocked: true, progress: 7, max: 7 },
                        { title: "Arena Champion", desc: "Reach the top 10 on the leaderboard", icon: "⚔️", unlocked: false, progress: 42, max: 100 },
                        { title: "Speed Demon", desc: "Solve a problem in under 2 minutes", icon: "⚡", unlocked: false, progress: 0, max: 1 },
                        { title: "Bug Squasher", desc: "Win 10 matches with 0 syntax errors", icon: "🐛", unlocked: false, progress: 3, max: 10 },
                        { title: "Night Owl", desc: "Win a match between 2AM and 4AM", icon: "🦉", unlocked: false, progress: 0, max: 1 },
                        { title: "Unstoppable", desc: "Win 5 matches in a row", icon: "🛑", unlocked: false, progress: 2, max: 5 },
                      ].map((badge, idx) => (
                        <div 
                          key={idx} 
                          className={`flex flex-col items-center p-5 rounded-2xl border text-center transition ${badge.unlocked ? "bg-gradient-to-b from-white to-slate-50 dark:from-neutral-800 dark:to-neutral-900 border-amber-200 dark:border-amber-500/30 shadow-sm shadow-amber-500/10" : "bg-slate-50 dark:bg-neutral-900 border-slate-200 dark:border-neutral-800 opacity-70 grayscale"}`}
                        >
                          <div className={`text-4xl mb-3 ${badge.unlocked ? "drop-shadow-md" : "opacity-50"}`}>
                            {badge.icon}
                          </div>
                          <h5 className={`text-xs font-bold mb-1 ${badge.unlocked ? "text-slate-800 dark:text-neutral-200" : "text-slate-500 dark:text-neutral-500"}`}>
                            {badge.title}
                          </h5>
                          <p className="text-[9px] text-slate-500 dark:text-neutral-400 mb-3 leading-tight h-6">
                            {badge.desc}
                          </p>
                          
                          <div className="w-full mt-auto">
                            <div className="flex justify-between text-[8px] font-bold mb-1 uppercase tracking-wider text-slate-400">
                              <span>Progress</span>
                              <span>{badge.progress} / {badge.max}</span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${badge.unlocked ? "bg-amber-500" : "bg-slate-400 dark:bg-neutral-600"}`} 
                                style={{ width: `${(badge.progress / badge.max) * 100}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
  );
}
