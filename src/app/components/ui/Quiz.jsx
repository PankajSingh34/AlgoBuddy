"use client";

import React from 'react';
import QuizEngine from './QuizEngine';
import { supabase } from '@/lib/supabase';

export default function Quiz({ moduleId, title, questions }) {
  const handleQuizComplete = async (score, totalQuestions, answers) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        await supabase.from('user_quiz_results').insert({
          user_id: user.id,
          module_id: moduleId,
          score,
          total_questions: totalQuestions,
          answers,
        });
      }
    } catch (err) {
      console.error('Failed to save quiz result:', err);
    }
  };

  return (
    <QuizEngine 
      title={title} 
      questions={questions}
      onQuizComplete={handleQuizComplete}
    />
  );
}
