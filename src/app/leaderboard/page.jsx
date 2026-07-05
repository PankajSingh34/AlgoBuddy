import React from 'react';
import { cookies } from 'next/headers';
import { getSupabaseServerClient } from '@/lib/serverApi';
import { Trophy, Medal, Award, Sparkles, TrendingUp } from 'lucide-react';
import Footer from "@/app/components/footer";

export const metadata = {
  title: 'Global Leaderboard - AlgoBuddy',
  description: 'Compete with your peers and track your progress on the AlgoBuddy Global Leaderboard.',
};

export default async function LeaderboardPage() {
  const cookieStore = await cookies();
  const supabase = getSupabaseServerClient(cookieStore);
  
  const { data: leaderboard, error } = await supabase
    .from('global_leaderboard')
    .select('*')
    .limit(50);

  const entries = leaderboard || [];

  return (
    <>
      <div className="min-h-screen bg-slate-50 dark:bg-[#0f1115] text-slate-900 dark:text-white pt-24 pb-20 relative overflow-hidden transition-colors duration-300">
        {/* Background Ornaments */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-purple-600/10 dark:bg-purple-600/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-40 -left-20 w-[400px] h-[400px] bg-blue-500/10 dark:bg-blue-500/5 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute top-60 -right-20 w-[400px] h-[400px] bg-amber-500/10 dark:bg-amber-500/5 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300 font-bold text-sm mb-6 border border-purple-200 dark:border-purple-500/20 shadow-sm">
              <Sparkles className="w-4 h-4" />
              <span>Community Rankings</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
              Global <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500">Leaderboard</span>
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto font-medium">
              Discover the top performers in our community. Complete modules and maintain your streak to climb the ranks!
            </p>
          </div>

          <div className="bg-white/80 dark:bg-[#1a1c23]/80 backdrop-blur-xl rounded-3xl border border-slate-200/50 dark:border-white/5 shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-[auto_1fr_auto] gap-4 items-center p-6 bg-slate-100/50 dark:bg-white/5 border-b border-slate-200/50 dark:border-white/5 font-bold text-slate-500 dark:text-slate-400 uppercase text-xs tracking-wider">
              <div className="w-16 text-center">Rank</div>
              <div>User</div>
              <div className="w-24 text-right pr-4">Score</div>
            </div>

            {/* List */}
            <div className="divide-y divide-slate-100 dark:divide-white/5">
              {entries.length === 0 && !error ? (
                <div className="p-12 text-center text-slate-500 dark:text-slate-400 font-medium">
                  No leaderboard data available yet. Start practicing to be the first!
                </div>
              ) : error ? (
                <div className="p-12 text-center text-red-500 font-medium">
                  Error loading leaderboard. Please try again later.
                </div>
              ) : (
                entries.map((user, index) => {
                  const isTop3 = index < 3;
                  let RankIcon = null;
                  let rankColorClass = "";
                  let bgHoverClass = "hover:bg-slate-50/80 dark:hover:bg-white/[0.02]";

                  if (index === 0) {
                    RankIcon = Trophy;
                    rankColorClass = "text-amber-500 dark:text-amber-400";
                    bgHoverClass = "bg-amber-50/50 hover:bg-amber-50 dark:bg-amber-500/5 dark:hover:bg-amber-500/10";
                  } else if (index === 1) {
                    RankIcon = Medal;
                    rankColorClass = "text-slate-400 dark:text-slate-300";
                    bgHoverClass = "bg-slate-50/50 hover:bg-slate-50 dark:bg-slate-500/5 dark:hover:bg-slate-500/10";
                  } else if (index === 2) {
                    RankIcon = Award;
                    rankColorClass = "text-orange-600 dark:text-orange-500";
                    bgHoverClass = "bg-orange-50/50 hover:bg-orange-50 dark:bg-orange-500/5 dark:hover:bg-orange-500/10";
                  }

                  return (
                    <div 
                      key={user.user_id} 
                      className={`grid grid-cols-[auto_1fr_auto] gap-4 items-center p-4 transition-all duration-300 group ${bgHoverClass}`}
                    >
                      <div className="w-16 flex justify-center items-center">
                        {isTop3 ? (
                          <div className={`flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-[#1a1c23] shadow-sm border border-slate-200/50 dark:border-white/5 ${rankColorClass}`}>
                            <RankIcon className="w-5 h-5" />
                          </div>
                        ) : (
                          <span className="text-lg font-black text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">
                            #{index + 1}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          {user.avatar_url ? (
                            <img 
                              src={user.avatar_url} 
                              alt={user.full_name || 'User Avatar'} 
                              className="w-12 h-12 rounded-full object-cover shadow-sm ring-2 ring-transparent group-hover:ring-purple-500/30 transition-all"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold shadow-sm ring-2 ring-transparent group-hover:ring-purple-500/30 transition-all">
                              {user.full_name ? user.full_name.charAt(0).toUpperCase() : '?'}
                            </div>
                          )}
                          {isTop3 && (
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white dark:bg-[#1a1c23] rounded-full flex items-center justify-center shadow-sm">
                              <div className={`w-3.5 h-3.5 rounded-full ${index === 0 ? 'bg-amber-400' : index === 1 ? 'bg-slate-300' : 'bg-orange-500'}`} />
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 dark:text-white text-base group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                            {user.full_name || 'Anonymous User'}
                          </h3>
                        </div>
                      </div>
                      
                      <div className="pr-4">
                        <div className="flex items-center gap-2 bg-white dark:bg-black/20 px-4 py-2 rounded-xl shadow-sm border border-slate-200/50 dark:border-white/5">
                          <TrendingUp className="w-4 h-4 text-emerald-500" />
                          <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500">
                            {user.score}
                          </span>
                          <span className="text-xs font-bold text-slate-400 dark:text-slate-500">PTS</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
