"use client";

import React, { useState } from "react";
import {
  Check,
  X,
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  Trophy,
  Star,
  Award,
  HelpCircle,
  Info,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function QuizEngine({ title, questions }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));
  const [showIntro, setShowIntro] = useState(true);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);

  // Compute score dynamically based on finalized answers to prevent double-counting or spoilers
  const score = answers.reduce((acc, ans, idx) => {
    if (idx < currentQuestion || quizCompleted) {
      return ans === questions[idx].correctAnswer ? acc + 1 : acc;
    }
    return acc;
  }, 0);

  const handleAnswerSelect = (optionIndex) => {
    setSelectedAnswer(optionIndex);
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = optionIndex;
    setAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === null) return;

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(answers[currentQuestion + 1]);
    } else {
      setShowSuccessAnimation(true);
      setTimeout(() => {
        setShowSuccessAnimation(false);
        setQuizCompleted(true);
        setShowResult(true);
      }, 2000);
    }
  };

  const handlePreviousQuestion = () => {
    setCurrentQuestion(currentQuestion - 1);
    setSelectedAnswer(answers[currentQuestion - 1]);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setQuizCompleted(false);
    setAnswers(Array(questions.length).fill(null));
    setShowIntro(true);
  };

  const startQuiz = () => {
    setShowIntro(false);
  };

  const getStarRating = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage >= 90) return 5;
    if (percentage >= 70) return 4;
    if (percentage >= 50) return 3;
    if (percentage >= 30) return 2;
    return 1;
  };

  return (
    <section className="max-w-3xl mx-auto rounded-2xl border border-[#e5e7eb] dark:border-[#333] bg-white dark:bg-[#1a1a1a] shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden mt-8 mb-8">
      {/* macOS Terminal style top bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-surface-50 dark:bg-[#202020] border-b border-[#e5e7eb] dark:border-[#333]">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
          <span className="w-3 h-3 rounded-full bg-[#28c840]" />
          <span className="ml-2 text-[12px] font-mono text-surface-500 dark:text-surface-400">
            algobuddy_quiz_session
          </span>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/40 text-[var(--color-primary)] dark:text-[var(--color-primary-light)] text-[11px] font-bold uppercase tracking-wider">
          Active Mode
        </div>
      </div>

      <div className="p-8">
        {showIntro ? (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="flex justify-center mb-6">
              <div className="bg-purple-50 dark:bg-purple-950/40 p-4 rounded-2xl border border-purple-100 dark:border-purple-900/20">
                <Award size={40} className="text-[var(--color-primary)] dark:text-[var(--color-primary-light)]" />
              </div>
            </div>

            <h2 className="text-[24px] font-extrabold mb-3 text-surface-900 dark:text-white leading-tight">
              {title}
            </h2>
            <p className="text-surface-500 dark:text-surface-400 mb-8 max-w-md mx-auto text-[14px]">
              Ready to test your algorithms chops? Prove your expertise and earn stars based on your score.
            </p>

            <div className="bg-surface-50 dark:bg-[#202020] p-6 rounded-xl mb-8 text-left border border-[#e5e7eb] dark:border-[#333]">
              <h3 className="font-extrabold text-[15px] mb-3 flex items-center gap-2 text-[var(--color-primary)] dark:text-[var(--color-primary-light)]">
                <Info size={16} /> Rules of the Challenge:
              </h3>
              <ul className="space-y-2.5 text-[13px] text-surface-600 dark:text-surface-300 font-medium">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" />
                  <span>Receive 1 point for every correct answer.</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <X size={16} className="text-red-500 flex-shrink-0" />
                  <span>No negative marking for incorrect choices.</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Trophy size={16} className="text-yellow-500 flex-shrink-0" />
                  <span>Earn up to 5 stars depending on your accuracy.</span>
                </li>
              </ul>
            </div>

            <button
              onClick={startQuiz}
              className="h-11 px-8 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white rounded-xl font-bold text-[14px] shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 mx-auto"
            >
              <span>Initialize Challenge</span>
              <ArrowRight size={16} />
            </button>
          </motion.div>
        ) : showSuccessAnimation ? (
          <div className="flex flex-col items-center justify-center py-16">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 15 }}
              className="mb-6"
            >
              <div className="relative">
                <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-950/40 rounded-full flex items-center justify-center border border-emerald-100 dark:border-emerald-900/30">
                  <CheckCircle2 size={40} className="text-emerald-500" />
                </div>
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1.6, opacity: 0 }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="absolute inset-0 border-2 border-emerald-400 rounded-full"
                />
              </div>
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-lg font-black text-surface-800 dark:text-surface-200"
            >
              Evaluating Responses...
            </motion.p>
          </div>
        ) : !showResult ? (
          <div className="quiz-container">
            {/* Header progress info */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2.5">
                <span className="text-[13px] font-bold text-[var(--color-primary)] dark:text-[var(--color-primary-light)]">
                  Question {currentQuestion + 1} of {questions.length}
                </span>
                <span className="text-[12px] font-bold bg-purple-50 dark:bg-purple-950/40 px-2.5 py-0.5 rounded-full border border-purple-100 dark:border-purple-900/20 text-[var(--color-primary)] dark:text-[var(--color-primary-light)]">
                  Score: {score}
                </span>
              </div>
              <div className="w-full bg-[#e5e7eb] dark:bg-[#333] rounded-full h-2">
                <div
                  className="bg-[var(--color-primary)] h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                />
              </div>
            </div>

            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-[18px] md:text-[20px] font-extrabold mb-6 text-surface-900 dark:text-white leading-snug">
                {questions[currentQuestion].question}
              </h3>

              <div className="space-y-3 mb-8">
                {questions[currentQuestion].options.map((option, index) => {
                  const isSelected = selectedAnswer === index;
                  return (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className={`p-4 border rounded-xl cursor-pointer transition-all duration-200 ${isSelected
                          ? "border-[var(--color-primary)] bg-purple-50/40 dark:bg-purple-950/20 shadow-sm"
                          : "border-[#e5e7eb] dark:border-[#333] hover:bg-surface-50 dark:hover:bg-[#202020]"
                        }`}
                      onClick={() => handleAnswerSelect(index)}
                    >
                      <div className="flex items-center">
                        <span className={`text-[12px] font-bold mr-3.5 w-6 h-6 flex items-center justify-center rounded-full transition-colors ${isSelected
                            ? "bg-[var(--color-primary)] text-white"
                            : "bg-[#e5e7eb] dark:bg-[#333] text-surface-700 dark:text-surface-300"
                          }`}>
                          {String.fromCharCode(65 + index)}
                        </span>
                        <span className={`text-[14px] font-semibold ${isSelected ? "text-[var(--color-primary)] dark:text-[var(--color-primary-light)]" : "text-surface-700 dark:text-surface-300"}`}>
                          {option}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Control buttons */}
            <div className="flex justify-between items-center border-t border-[#e5e7eb] dark:border-[#333] pt-5">
              <button
                onClick={handlePreviousQuestion}
                disabled={currentQuestion === 0}
                className="h-10 px-5 border border-[#e5e7eb] dark:border-[#333] rounded-xl text-surface-700 dark:text-surface-300 text-[13px] font-bold disabled:opacity-40 flex items-center gap-1.5 hover:bg-surface-50 dark:hover:bg-[#202020] transition-colors"
              >
                <ArrowLeft size={16} />
                <span>Previous</span>
              </button>

              <button
                onClick={handleNextQuestion}
                disabled={selectedAnswer === null}
                className="h-10 px-6 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white rounded-xl text-[13px] font-bold disabled:opacity-40 flex items-center gap-1.5 shadow-sm hover:shadow-md transition-all"
              >
                <span>{currentQuestion === questions.length - 1 ? "Complete" : "Next"}</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="result-container"
          >
            <div className="text-center mb-8 bg-surface-50 dark:bg-[#202020] p-6 rounded-2xl border border-[#e5e7eb] dark:border-[#333]">
              <div className="relative inline-block mb-4">
                <div className="w-24 h-24 bg-purple-50 dark:bg-purple-950/40 rounded-full flex items-center justify-center shadow-md border border-purple-200 dark:border-purple-900/30">
                  <div className="text-2xl font-black text-[var(--color-primary)] dark:text-[var(--color-primary-light)]">
                    {score}/{questions.length}
                  </div>
                </div>
                <div className="absolute -bottom-2 left-0 right-0 flex justify-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className={`mx-0.5 ${i < getStarRating()
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-surface-300 dark:text-surface-700"
                        }`}
                    />
                  ))}
                </div>
              </div>

              <h3 className="text-[20px] font-black mb-1.5 text-surface-950 dark:text-white leading-tight">
                {score === questions.length ? "🌟 Perfect Score!" :
                  score >= questions.length * 0.8 ? "🔥 Excellent Work!" :
                    score >= questions.length * 0.6 ? "✨ Good Job!" :
                      score >= questions.length * 0.4 ? "📚 Keep Practicing!" : "💡 Let's Review Again!"}
              </h3>
              <p className="text-[13px] text-surface-500 dark:text-surface-400 font-semibold uppercase tracking-wider">
                Accuracy: {((score / questions.length) * 100).toFixed(0)}%
              </p>
            </div>

            {/* Breakdown */}
            <div className="space-y-4 mb-8">
              <h4 className="font-extrabold text-[15px] text-surface-800 dark:text-surface-200 border-b border-[#e5e7eb] dark:border-[#333] pb-2">
                Challenge Log & Explanations
              </h4>
              {questions.map((q, index) => {
                const isCorrect = answers[index] === q.correctAnswer;
                return (
                  <div key={index} className="border-b last:border-0 pb-4 border-[#e5e7eb] dark:border-[#333] last:pb-0">
                    <p className="font-extrabold text-[14px] text-surface-900 dark:text-white mb-2 leading-relaxed">
                      {index + 1}. {q.question}
                    </p>
                    <div className={`flex items-start gap-2.5 p-3 rounded-xl border text-[13px] ${isCorrect
                        ? "bg-emerald-50/30 dark:bg-emerald-950/10 border-emerald-100 dark:border-emerald-900/20 text-emerald-800 dark:text-emerald-400"
                        : "bg-red-50/30 dark:bg-red-950/10 border-red-100 dark:border-red-900/20 text-red-800 dark:text-red-400"
                      }`}>
                      {isCorrect ? (
                        <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0 text-emerald-500" />
                      ) : (
                        <AlertTriangle size={16} className="mt-0.5 flex-shrink-0 text-red-500" />
                      )}
                      <div className="flex-1">
                        <p className="font-bold">
                          Your Answer: {answers[index] !== null ? q.options[answers[index]] : "Skipped"}
                        </p>
                        {!isCorrect && (
                          <p className="font-bold mt-1 text-surface-700 dark:text-surface-300">
                            Correct: {q.options[q.correctAnswer]}
                          </p>
                        )}
                        {q.explanation && (
                          <div className="mt-2 text-[12px] font-mono leading-relaxed bg-[#f7f9fa] dark:bg-[#111] border border-[#e5e7eb] dark:border-[#222] p-2.5 rounded-lg text-surface-600 dark:text-surface-400">
                            <span className="text-[var(--color-primary)] dark:text-[var(--color-primary-light)] font-bold"># Explanation:</span> {q.explanation}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={resetQuiz}
              className="w-full h-11 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white rounded-xl font-bold text-[14px] flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
            >
              <RotateCcw size={16} />
              <span>Retry Session</span>
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
