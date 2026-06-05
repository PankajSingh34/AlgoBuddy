"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Trophy, Target, TrendingUp, Award } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function QuizStats() {
  const [quizResults, setQuizResults] = useState([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    loadQuizResults();
  }, []);

  const loadQuizResults = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('user_quiz_results')
          .select('*')
          .eq('user_id', user.id)
          .order('completed_at', { ascending: false });

        if (error) throw error;
        setQuizResults(data || []);
      }
    } catch (err) {
      console.error("Failed to load quiz results:", err);
    }
  };

  // Compute stats metrics
  const metrics = useMemo(() => {
    if (quizResults.length === 0) {
      return {
        totalQuizzes: 0,
        averageScore: 0,
        bestScore: 0,
        totalQuestions: 0,
        correctAnswers: 0,
        recentResults: [],
      };
    }

    const totalQuizzes = quizResults.length;
    const totalQuestions = quizResults.reduce((sum, r) => sum + r.total_questions, 0);
    const correctAnswers = quizResults.reduce((sum, r) => sum + r.score, 0);
    const averageScore = Math.round((correctAnswers / totalQuestions) * 100);
    const bestScore = Math.max(...quizResults.map(r => Math.round((r.score / r.total_questions) * 100)));
    const recentResults = quizResults.slice(0, 5);

    return {
      totalQuizzes,
      averageScore,
      bestScore,
      totalQuestions,
      correctAnswers,
      recentResults,
    };
  }, [quizResults]);

  if (!mounted) return null;

  return (
    <section className="bg-white dark:bg-[#2d2f31] border border-surface-200 dark:border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-xl mt-8">
      <div className="flex items-center gap-2 mb-6">
        <Trophy className="text-primary" />
        <h2 className="text-xl font-bold text-surface-900 dark:text-white">Quiz Progress</h2>
      </div>

      {quizResults.length === 0 ? (
        <div className="text-center py-8">
          <Award className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <p className="text-gray-500 dark:text-gray-400">No quiz results yet. Take a quiz to see your progress!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1.5fr] gap-8">
          {/* Left Card: Summary Metrics */}
          <div className="flex flex-col items-center justify-center bg-surface-50/50 dark:bg-neutral-800/20 border border-surface-200/50 dark:border-neutral-800/40 p-6 rounded-2xl">
            <div className="relative w-32 h-32 flex items-center justify-center mb-4">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="50"
                  className="stroke-surface-100 dark:stroke-neutral-800"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="50"
                  className="stroke-primary"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={314.2}
                  strokeDashoffset={314.2 - (314.2 * metrics.averageScore) / 100}
                  strokeLinecap="round"
                  style={{ transition: "stroke-dashoffset 0.8s ease-out" }}
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-2xl font-black">{metrics.averageScore}%</span>
                <span className="text-[9px] font-bold text-surface-400 uppercase">Avg Score</span>
              </div>
            </div>
            <p className="text-sm font-semibold text-surface-600 dark:text-surface-300">
              Best: <span className="text-primary font-bold">{metrics.bestScore}%</span>
            </p>
            <p className="text-xs text-surface-500 dark:text-surface-400 mt-1">
              {metrics.totalQuizzes} quizzes completed
            </p>
          </div>

          {/* Right Card: Stats and Recent Results */}
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-blue-50/50 dark:bg-blue-950/10 border border-blue-500/10 p-3 rounded-xl flex flex-col items-center">
                <Target className="w-5 h-5 text-blue-600 dark:text-blue-400 mb-1" />
                <span className="text-lg font-black text-blue-700 dark:text-blue-400">
                  {metrics.correctAnswers}/{metrics.totalQuestions}
                </span>
                <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase">
                  Correct
                </span>
              </div>
              <div className="bg-purple-50/50 dark:bg-purple-950/10 border border-purple-500/10 p-3 rounded-xl flex flex-col items-center">
                <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400 mb-1" />
                <span className="text-lg font-black text-purple-700 dark:text-purple-400">
                  {metrics.totalQuizzes}
                </span>
                <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase">
                  Quizzes
                </span>
              </div>
            </div>

            {/* Recent Results */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-surface-400">Recent Results</h3>
              <div className="space-y-2">
                {metrics.recentResults.map((result, idx) => {
                  const percentage = Math.round((result.score / result.total_questions) * 100);
                  const scoreColor = percentage >= 70 ? 'text-green-600 dark:text-green-400' : 
                                   percentage >= 50 ? 'text-yellow-600 dark:text-yellow-400' : 
                                   'text-red-600 dark:text-red-400';
                  return (
                    <div key={idx} className="flex items-center justify-between bg-surface-50/50 dark:bg-[#1c1d1f]/40 p-3 rounded-xl border border-surface-200/40 dark:border-neutral-800/40">
                      <div className="flex-1">
                        <p className="text-xs font-bold text-surface-700 dark:text-surface-300">
                          {result.module_id}
                        </p>
                        <p className="text-[10px] text-surface-500 dark:text-surface-400">
                          {new Date(result.completed_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className={`text-sm font-black ${scoreColor}`}>
                        {result.score}/{result.total_questions}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
