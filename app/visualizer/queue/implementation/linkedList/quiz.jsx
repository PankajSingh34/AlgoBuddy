"use client";
import React, { useState } from 'react';
import { FaCheck, FaTimes, FaArrowRight, FaArrowLeft, FaInfoCircle, FaRedo, FaTrophy, FaStar, FaAward } from 'react-icons/fa';
import { motion } from 'framer-motion';

const LinkedListQueueQuiz = () => {
  const questions = [
    {
      question: "What pointers are maintained in a linked-list queue?",
      options: ["front (head) and rear (tail)", "top and bottom", "left and right", "prev and next"],
      correctAnswer: 0,
      explanation: "A linked-list queue maintains a head (front) pointer for dequeue and a tail (rear) pointer for enqueue.",
    },
    {
      question: "Where does enqueue add a new node in a linked-list queue?",
      options: ["At the head (front)", "At the tail (rear)", "In the middle", "After sorting"],
      correctAnswer: 1,
      explanation: "Enqueue adds a new node at the tail (rear) of the linked list to maintain FIFO order.",
    },
    {
      question: "Where does dequeue remove a node from in a linked-list queue?",
      options: ["From the tail", "From the head (front)", "From a random position", "From the middle"],
      correctAnswer: 1,
      explanation: "Dequeue removes the node at the head (front) of the linked list, following FIFO (First In First Out).",
    },
    {
      question: "What is the time complexity of enqueue in a linked-list queue with tail pointer?",
      options: ["O(n)", "O(log n)", "O(1)", "O(n²)"],
      correctAnswer: 2,
      explanation: "With a tail pointer, enqueue is O(1) — a new node is added at tail and the tail pointer is updated.",
    },
    {
      question: "What is the main advantage of a linked-list queue over a circular array queue?",
      options: ["Faster dequeue", "Dynamic sizing (no overflow)", "Less memory", "O(1) indexing"],
      correctAnswer: 1,
      explanation: "Linked-list queues grow dynamically, so there is no fixed-size overflow — they only run out of system memory.",
    },
    {
      question: "What extra memory does each node in a linked-list queue require?",
      options: ["A pointer to the next node", "An integer counter", "A character flag", "No extra memory"],
      correctAnswer: 0,
      explanation: "Each node stores data and a pointer to the next node, which adds memory overhead compared to array storage.",
    },
    {
      question: "In a linked-list queue with one element, what do head and tail point to?",
      options: ["head → node, tail → null", "head → node, tail → same node", "head → null, tail → node", "head → node, tail → node.next"],
      correctAnswer: 1,
      explanation: "With one element, both head and tail point to the same node. After another enqueue, tail moves to the new node.",
    },
    {
      question: "When dequeuing from a linked-list queue with one element, what happens to tail?",
      options: ["Tail remains unchanged", "Tail becomes null", "Tail moves to head", "Tail is deleted"],
      correctAnswer: 1,
      explanation: "After removing the only element, both head and tail become null (empty queue).",
    },
    {
      question: "Can a linked-list queue underflow?",
      options: ["No, it's always available", "Yes, when dequeue is called on an empty queue", "Only in Java", "No, because it's dynamic"],
      correctAnswer: 1,
      explanation: "A linked-list queue underflows when dequeue is called on an empty queue (head === null).",
    },
    {
      question: "Which implementation is better when queue size is unpredictable and memory is sufficient?",
      options: ["Array-based (circular)", "Linked-list based", "Both are equivalent", "Neither is suitable"],
      correctAnswer: 1,
      explanation: "A linked-list queue is better when size is unpredictable because it dynamically grows. Array queues have a fixed limit.",
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

  const handleAnswerSelect = (optionIndex) => setSelectedAnswer(optionIndex);

  const handleNextQuestion = () => {
    if (selectedAnswer === null) return;
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = selectedAnswer;
    setAnswers(newAnswers);
    const newScore = newAnswers.reduce((acc, ans, idx) => ans === questions[idx].correctAnswer ? acc + 1 : acc, 0);
    setScore(newScore);
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(newAnswers[currentQuestion + 1]);
    } else {
      setShowSuccessAnimation(true);
      setTimeout(() => { setShowSuccessAnimation(false); setQuizCompleted(true); setShowResult(true); }, 2000);
    }
  };

  const handlePreviousQuestion = () => { setCurrentQuestion(currentQuestion - 1); setSelectedAnswer(answers[currentQuestion - 1]); };

  const resetQuiz = () => {
    setCurrentQuestion(0); setSelectedAnswer(null); setScore(0); setShowResult(false);
    setQuizCompleted(false); setAnswers(Array(questions.length).fill(null)); setShowIntro(true);
  };

  const calculateWeakAreas = () => {
    const w = [];
    if (answers[0] !== questions[0].correctAnswer) w.push("head/tail pointers");
    if (answers[1] !== questions[1].correctAnswer) w.push("enqueue at tail");
    if (answers[2] !== questions[2].correctAnswer) w.push("dequeue from head");
    if (answers[3] !== questions[3].correctAnswer) w.push("enqueue time complexity");
    if (answers[4] !== questions[4].correctAnswer) w.push("dynamic size advantage");
    if (answers[5] !== questions[5].correctAnswer) w.push("memory overhead per node");
    if (answers[6] !== questions[6].correctAnswer) w.push("single element pointers");
    if (answers[7] !== questions[7].correctAnswer) w.push("tail update on dequeue");
    if (answers[8] !== questions[8].correctAnswer) w.push("underflow condition");
    if (answers[9] !== questions[9].correctAnswer) w.push("use case vs array queue");
    return w.length > 0 ? `Focus on improving: ${w.join(', ')}.` : "Perfect! You've mastered Linked List Queue!";
  };

  const startQuiz = () => setShowIntro(false);
  const getStarRating = () => { const p = (score / questions.length) * 100; if (p >= 90) return 5; if (p >= 70) return 4; if (p >= 50) return 3; if (p >= 30) return 2; return 1; };

  return (
    <section className="max-w-4xl mx-auto shadow-lg rounded-xl bg-white dark:bg-neutral-950 mt-8 mb-8 p-6 border border-gray-200 dark:border-gray-700">
      {showIntro ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <div className="flex justify-center mb-6"><div className="bg-blue-100 dark:bg-neutral-900 p-4 rounded-full"><FaAward className="text-4xl text-blue-500" /></div></div>
          <h2 className="text-2xl font-bold mb-4 text-black dark:text-gray-100">Linked List Queue Quiz</h2>
          <div className="bg-white dark:bg-neutral-900 p-4 rounded-lg mb-6 text-left shadow-inner">
            <h3 className="font-bold mb-2 flex items-center text-blue-600 dark:text-blue-400"><FaInfoCircle className="mr-2" /> How it works:</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start"><FaCheck className="text-blue-500 mt-1 mr-2 flex-shrink-0" /><span>+1 point for each correct answer</span></li>
              <li className="flex items-start"><FaTimes className="text-blue-500 mt-1 mr-2 flex-shrink-0" /><span>0 points for wrong answers</span></li>
              <li className="flex items-start"><FaTrophy className="text-blue-500 mt-1 mr-2 flex-shrink-0" /><span>Earn stars based on your final score (max 5)</span></li>
            </ul>
          </div>
          <button onClick={startQuiz} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all shadow-md hover:shadow-lg flex items-center mx-auto">Start Quiz <FaArrowRight className="ml-2" /></button>
        </motion.div>
      ) : showSuccessAnimation ? (
        <div className="flex flex-col items-center justify-center h-64">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500, damping: 15 }} className="mb-4">
            <div className="relative"><div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center"><FaCheck className="text-4xl text-green-500 animate-bounce" /></div></div>
          </motion.div>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xl font-semibold text-gray-700 dark:text-gray-200">Quiz Completed!</motion.p>
        </div>
      ) : !showResult ? (
        <div>
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
                <motion.div key={index} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${selectedAnswer === index ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md" : "border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"}`}
                  onClick={() => handleAnswerSelect(index)}>
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
              <div className="absolute -bottom-2 left-0 right-0 flex justify-center">{[...Array(5)].map((_, i) => (<FaStar key={i} className={`text-2xl mx-1 ${i < getStarRating() ? "text-yellow-400 fill-current" : "text-gray-300 dark:text-gray-600 fill-current"}`} />))}</div>
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

export default LinkedListQueueQuiz;
