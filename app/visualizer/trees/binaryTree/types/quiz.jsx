"use client";
import React, { useState } from 'react';
import { FaCheck, FaTimes, FaArrowRight, FaArrowLeft, FaInfoCircle, FaRedo, FaTrophy, FaStar, FaAward } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const TypesQuiz = () => {
  const questions = [
    {
      question: "What defines a Full Binary Tree?",
      options: [
        "Every node has exactly two children",
        "Every node has 0 or 2 children",
        "All leaves are at the same level",
        "Every node has at most 2 children"
      ],
      correctAnswer: 1,
      explanation:
        "A Full Binary Tree requires every node to have either 0 or 2 children. No node can have exactly one child.",
    },
    {
      question: "What is the height of a Degenerate (Skewed) Tree with n nodes?",
      options: [
        "O(log n)",
        "O(1)",
        "O(n)",
        "O(n²)"
      ],
      correctAnswer: 2,
      explanation:
        "A degenerate tree has height n-1 = O(n) because each parent has only one child, forming a linked list structure.",
    },
    {
      question: "Which data structure relies on the Complete Binary Tree property?",
      options: [
        "Hash Table",
        "Binary Search Tree",
        "Heap (Priority Queue)",
        "Linked List"
      ],
      correctAnswer: 2,
      explanation:
        "Heaps are implemented as Complete Binary Trees, where the last level is packed from the left, enabling O(log n) operations.",
    },
    {
      question: "A tree where every internal node has exactly 2 children and all leaves are at the same level is called:",
      options: [
        "Full Binary Tree",
        "Complete Binary Tree",
        "Perfect Binary Tree",
        "Degenerate Tree"
      ],
      correctAnswer: 2,
      explanation:
        "A Perfect Binary Tree is both full and complete — every internal node has 2 children and all leaves are at the same level.",
    },
    {
      question: "Which type of binary tree has the worst-case search time of O(n)?",
      options: [
        "Full Binary Tree",
        "Complete Binary Tree",
        "Balanced Binary Tree",
        "Degenerate (Skewed) Tree"
      ],
      correctAnswer: 3,
      explanation:
        "A degenerate tree has O(n) height, so searching takes O(n) time, making it as inefficient as a linked list.",
    },
    {
      question: "In a Complete Binary Tree with 6 nodes, where are the nodes in the last level positioned?",
      options: [
        "Anywhere in the last level",
        "Packed from the left",
        "Packed from the right",
        "Evenly distributed"
      ],
      correctAnswer: 1,
      explanation:
        "Complete Binary Trees pack the last level from the left, so no gaps exist before the last leaf.",
    },
    {
      question: "What is the maximum number of nodes in a Full Binary Tree of height h?",
      options: [
        "2ʰ",
        "2ʰ⁺¹ - 1",
        "h²",
        "2ʰ - 1"
      ],
      correctAnswer: 1,
      explanation:
        "A full binary tree of height h can have at most 2^(h+1) - 1 nodes (reached when it is also perfect).",
    },
    {
      question: "Which tree type is essentially a linked list?",
      options: [
        "Full Binary Tree",
        "Complete Binary Tree",
        "Degenerate Tree",
        "Perfect Binary Tree"
      ],
      correctAnswer: 2,
      explanation:
        "A degenerate (skewed) tree has each node with only one child, making it structurally identical to a linked list.",
    },
    {
      question: "How can you identify if a tree is degenerate?",
      options: [
        "Count nodes per level",
        "Check if any node has exactly one child across the whole tree",
        "Measure the height",
        "All of the above"
      ],
      correctAnswer: 3,
      explanation:
        "A degenerate tree has height = n-1, and every non-leaf node has exactly one child. All these checks can identify it.",
    },
    {
      question: "Which statement is TRUE about a Complete Binary Tree?",
      options: [
        "All levels must be completely filled",
        "It can have at most one node with only one child",
        "Every node must have 0 or 2 children",
        "It is the same as a Full Binary Tree"
      ],
      correctAnswer: 1,
      explanation:
        "In a Complete Binary Tree, all levels except possibly the last are full. The last level has nodes packed left, meaning at most one node can have only one child (the last internal node).",
    },
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));
  const [showIntro, setShowIntro] = useState(true);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);

  const handleAnswerSelect = (optionIndex) => {
    setSelectedAnswer(optionIndex);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === null) return;

    const newAnswers = [...answers];
    newAnswers[currentQuestion] = selectedAnswer;
    setAnswers(newAnswers);

    const newScore = newAnswers.reduce((acc, ans, idx) => {
      return ans === questions[idx].correctAnswer ? acc + 1 : acc;
    }, 0);
    setScore(newScore);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(newAnswers[currentQuestion + 1]);
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
    setScore(0);
    setShowResult(false);
    setQuizCompleted(false);
    setAnswers(Array(questions.length).fill(null));
    setShowIntro(true);
  };

  const calculateWeakAreas = () => {
    const weakAreas = [];
    if (answers[0] !== questions[0].correctAnswer) weakAreas.push("Full Binary Tree definition");
    if (answers[1] !== questions[1].correctAnswer) weakAreas.push("degenerate tree height");
    if (answers[2] !== questions[2].correctAnswer) weakAreas.push("Complete Binary Tree applications");
    if (answers[3] !== questions[3].correctAnswer) weakAreas.push("Perfect vs Full vs Complete distinction");
    if (answers[4] !== questions[4].correctAnswer) weakAreas.push("degenerate tree performance");
    if (answers[5] !== questions[5].correctAnswer) weakAreas.push("Complete Tree last-level property");
    if (answers[6] !== questions[6].correctAnswer) weakAreas.push("node count formulas");
    if (answers[7] !== questions[7].correctAnswer) weakAreas.push("degenerate tree identification");
    if (answers[8] !== questions[8].correctAnswer) weakAreas.push("identifying tree types");
    if (answers[9] !== questions[9].correctAnswer) weakAreas.push("Complete Tree specific properties");
    return weakAreas.length > 0
      ? `Focus on improving: ${weakAreas.join(', ')}. Review the corresponding sections above.`
      : "Perfect! You've mastered all Binary Tree Types!";
  };

  const startQuiz = () => setShowIntro(false);

  const getStarRating = () => {
    const p = (score / questions.length) * 100;
    if (p >= 90) return 5;
    if (p >= 70) return 4;
    if (p >= 50) return 3;
    if (p >= 30) return 2;
    return 1;
  };

  return (
    <section className="max-w-4xl mx-auto shadow-lg rounded-xl bg-white dark:bg-neutral-950 mt-8 mb-8 p-6 border border-gray-200 dark:border-gray-700">
      {showIntro ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-blue-100 dark:bg-neutral-900 p-4 rounded-full">
              <FaAward className="text-4xl text-blue-500 dark:text-blue-500" />
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-4 text-black dark:text-gray-100">
            Binary Tree Types Quiz
          </h2>
          <div className="bg-white dark:bg-neutral-900 p-4 rounded-lg mb-6 text-left shadow-inner">
            <h3 className="font-bold mb-2 flex items-center text-blue-600 dark:text-blue-400">
              <FaInfoCircle className="mr-2" /> How it works:
            </h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start"><FaCheck className="text-blue-500 mt-1 mr-2 flex-shrink-0" /><span>+1 point for each correct answer</span></li>
              <li className="flex items-start"><FaTimes className="text-blue-500 mt-1 mr-2 flex-shrink-0" /><span>0 points for wrong answers</span></li>
              <li className="flex items-start"><FaTrophy className="text-blue-500 mt-1 mr-2 flex-shrink-0" /><span>Earn stars based on your final score (max 5 stars)</span></li>
            </ul>
          </div>
          <button onClick={startQuiz} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all shadow-md hover:shadow-lg flex items-center mx-auto">
            Start Quiz <FaArrowRight className="ml-2" />
          </button>
        </motion.div>
      ) : showSuccessAnimation ? (
        <div className="flex flex-col items-center justify-center h-64">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500, damping: 15 }} className="mb-4">
            <div className="relative">
              <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <FaCheck className="text-4xl text-green-500 animate-bounce" />
              </div>
              <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1.5, opacity: 0 }} transition={{ duration: 1.5, repeat: Infinity }} className="absolute inset-0 border-4 border-green-300 rounded-full" />
            </div>
          </motion.div>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xl font-semibold text-gray-700 dark:text-gray-200">Quiz Completed!</motion.p>
        </div>
      ) : !showResult ? (
        <div className="quiz-container">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Question {currentQuestion + 1} of {questions.length}</span>
              <span className="text-sm font-medium bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded text-blue-600 dark:text-blue-400">Score: {score.toFixed(1)}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }} />
            </div>
          </div>
          <motion.div key={currentQuestion} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
            <h3 className="text-xl font-semibold mb-6 dark:text-white p-4">{questions[currentQuestion].question}</h3>
            <div className="space-y-3 mb-6">
              {questions[currentQuestion].options.map((option, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${selectedAnswer === index ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md" : "border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"}`}
                  onClick={() => handleAnswerSelect(index)}
                >
                  <div className="flex items-center">
                    <span className={`font-medium mr-3 w-6 h-6 flex items-center justify-center rounded-full ${selectedAnswer === index ? "bg-blue-500 text-white" : "bg-gray-200 dark:bg-gray-600"}`}>{String.fromCharCode(65 + index)}</span>
                    <span>{option}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
          <div className="flex justify-between">
            <button onClick={handlePreviousQuestion} disabled={currentQuestion === 0} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg disabled:opacity-50 flex items-center hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"><FaArrowLeft className="mr-2" /> Previous</button>
            <button onClick={handleNextQuestion} disabled={selectedAnswer === null} className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 hover:from-blue-600 hover:to-purple-600 transition-all flex items-center shadow-md hover:shadow-lg">{currentQuestion === questions.length - 1 ? "Finish" : "Next"} <FaArrowRight className="ml-2" /></button>
          </div>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="result-container">
          <div className="text-center mb-8">
            <div className="relative inline-block mb-4">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full flex items-center justify-center shadow-lg">
                <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">{score.toFixed(1)}/{questions.length}</div>
              </div>
              <div className="absolute -bottom-2 left-0 right-0 flex justify-center">
                {[...Array(5)].map((_, i) => (<FaStar key={i} className={`text-2xl mx-1 ${i < getStarRating() ? "text-yellow-400 fill-current" : "text-gray-300 dark:text-gray-600 fill-current"}`} />))}
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-2 dark:text-white">{score === questions.length ? "Perfect Score!" : score >= questions.length * 0.8 ? "Excellent Work!" : score >= questions.length * 0.6 ? "Good Job!" : score >= questions.length * 0.4 ? "Keep Practicing!" : "Let's Review Again!"}</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">You scored {((score / questions.length) * 100).toFixed(0)}% correct</p>
          </div>
          <div className="bg-white dark:bg-gray-700 p-4 rounded-lg mb-6 shadow-inner">
            <h4 className="font-bold mb-3 flex items-center text-blue-600 dark:text-blue-400"><FaInfoCircle className="mr-2" /> Performance Analysis</h4>
            <p className="text-sm">{calculateWeakAreas()}</p>
          </div>
          <div className="space-y-4 mb-8">
            <h4 className="font-bold text-gray-700 dark:text-gray-300">Question Breakdown:</h4>
            {questions.map((q, index) => (
              <div key={index} className="border-b pb-3 border-gray-200 dark:border-gray-700 last:border-0">
                <p className="font-medium text-gray-800 dark:text-gray-200">{q.question}</p>
                <div className={`flex items-start mt-1 ${answers[index] === q.correctAnswer ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                  {answers[index] === q.correctAnswer ? <FaCheck className="mt-1 mr-2 flex-shrink-0" /> : <FaTimes className="mt-1 mr-2 flex-shrink-0" />}
                  <div>
                    <p className="text-sm">Your answer: {answers[index] !== null ? q.options[answers[index]] : "Not answered"}</p>
                    {answers[index] !== q.correctAnswer && <p className="text-sm">Correct answer: {q.options[q.correctAnswer]}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button onClick={resetQuiz} className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-600 transition-all shadow-md hover:shadow-lg flex items-center justify-center"><FaRedo className="mr-2" /> Take Quiz Again</button>
        </motion.div>
      )}
    </section>
  );
};

export default TypesQuiz;
