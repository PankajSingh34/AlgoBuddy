"use client";
import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const Quiz = () => {
  const questions = [
  {
    "question": "What is the primary goal when comparing two linked lists?",
    "options": [
      "To merge them into one list",
      "To determine if they are structurally and value-wise identical",
      "To reverse both lists",
      "To delete duplicate nodes"
    ],
    "correctAnswer": 1,
    "explanation": "The comparison aims to check whether the two linked lists have the same sequence of values in the same order."
  },
  {
    "question": "What condition indicates that two linked lists are not equal?",
    "options": [
      "Both have the same head node",
      "One list is longer than the other",
      "Both lists have the same length",
      "Both are empty"
    ],
    "correctAnswer": 1,
    "explanation": "If one list ends before the other, they differ in length and are not equal."
  },
  {
    "question": "What approach is commonly used to compare two linked lists?",
    "options": [
      "Recursive traversal",
      "Simultaneous traversal using two pointers",
      "Storing values in a hash map",
      "Binary search"
    ],
    "correctAnswer": 1,
    "explanation": "The most common method is using two pointers to traverse both lists node by node and compare their values."
  },
  {
    "question": "What should be checked at each step during linked list comparison?",
    "options": [
      "If node values are equal",
      "If both nodes are at the tail",
      "If the next pointers match",
      "If memory addresses are the same"
    ],
    "correctAnswer": 0,
    "explanation": "At each step, the values of corresponding nodes should be compared to determine equality."
  },
  {
    "question": "What does it mean if both pointers reach null at the same time during comparison?",
    "options": [
      "The lists are not equal",
      "An error occurred",
      "Both lists are equal",
      "One list is circular"
    ],
    "correctAnswer": 2,
    "explanation": "If both lists end simultaneously without any mismatches, they are equal."
  },
  {
    "question": "What is the time complexity of comparing two linked lists with n nodes each?",
    "options": [
      "O(n^2)",
      "O(log n)",
      "O(n)",
      "O(1)"
    ],
    "correctAnswer": 2,
    "explanation": "Each node is visited once during comparison, resulting in linear time complexity O(n)."
  },
  {
    "question": "Which case is a valid edge case in linked list comparison?",
    "options": [
      "One list is empty",
      "Both lists contain the same object references",
      "Both lists are infinite",
      "Both lists are sorted"
    ],
    "correctAnswer": 0,
    "explanation": "An important edge case is when one list is empty and the other is not."
  },
  {
    "question": "How should object nodes with same values but different references be treated in comparison?",
    "options": [
      "As equal if their values match",
      "As unequal always",
      "Only compare memory addresses",
      "Skip such nodes"
    ],
    "correctAnswer": 0,
    "explanation": "Linked list comparison typically checks for value equality, not memory address equality."
  },
  {
    "question": "Why is it important to compare both length and values when comparing two linked lists?",
    "options": [
      "Length indicates memory usage",
      "Lists must be sorted first",
      "To ensure complete equality",
      "To avoid stack overflow"
    ],
    "correctAnswer": 2,
    "explanation": "Even if values match in part, differing lengths imply inequality. Full comparison ensures both length and value match."
  },
  {
    "question": "What will the comparison function return if the lists differ at any node?",
    "options": [
      "True",
      "Null",
      "False",
      "0"
    ],
    "correctAnswer": 2,
    "explanation": "The comparison function returns false as soon as a mismatch is detected."
  }
];

<<<<<<< HEAD
  return <QuizEngine title="Comparing Quiz Challenge" questions={questions} />;
=======
  const handleAnswerSelect = (optionIndex) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(optionIndex);
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = optionIndex;
    setAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === null) return;
    
    if (showExplanation && !penaltyApplied) {
      setScore(prevScore => Math.max(0, prevScore - 0.5));
      setPenaltyApplied(true);
    }

    if (selectedAnswer === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
    
    setShowExplanation(false);
    setPenaltyApplied(false);
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
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
    setShowExplanation(false);
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
    setShowExplanation(false);
    setShowIntro(true);
    setPenaltyApplied(false);
  };

  const calculateWeakAreas = () => {
    const weakAreas = [];
    if (answers[0] !== questions[0].correctAnswer) {
      weakAreas.push("understanding the basic principle of Selection Sort");
    }
    if (answers[1] !== questions[1].correctAnswer) {
      weakAreas.push("time complexity analysis");
    }
    if (answers[2] !== questions[2].correctAnswer) {
      weakAreas.push("counting swaps in Selection Sort");
    }
    if (answers[3] !== questions[3].correctAnswer) {
      weakAreas.push("comparison with other simple sorts");
    }
    if (answers[4] !== questions[4].correctAnswer) {
      weakAreas.push("space complexity");
    }
    if (answers[5] !== questions[5].correctAnswer) {
      weakAreas.push("stability characteristics");
    }
    if (answers[6] !== questions[6].correctAnswer) {
      weakAreas.push("practical applications");
    }
    
    return weakAreas.length > 0 
      ? `Focus on improving: ${weakAreas.join(', ')}. Review the corresponding sections above.`
      : "Perfect! You've mastered all Selection Sort concepts!";
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
    <section className="max-w-2xl mx-auto shadow-lg rounded-xl bg-white dark:bg-gray-800 mt-8 mb-8 p-6 border border-gray-200 dark:border-gray-700">
      {showIntro ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="flex justify-center mb-6">
            <div className="bg-purple-100 dark:bg-purple-900/30 p-4 rounded-full">
              <FaAward className="text-4xl text-purple-500 dark:text-purple-500" />
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-4 text-black dark:text-gray-100">
            Comparing Quiz Challenge
          </h2>
          <div className="bg-white dark:bg-gray-700 p-4 rounded-lg mb-6 text-left shadow-inner">
            <h3 className="font-bold mb-2 flex items-center text-purple-600 dark:text-purple-400">
              <FaInfoCircle className="mr-2" /> How it works:
            </h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <FaCheck className="text-purple-500 mt-1 mr-2 flex-shrink-0" />
                <span>+1 point for each correct answer</span>
              </li>
              <li className="flex items-start">
                <FaTimes className="text-purple-500 mt-1 mr-2 flex-shrink-0" />
                <span>0 points for wrong answers</span>
              </li>
              <li className="flex items-start">
                <FaInfoCircle className="text-purple-500 mt-1 mr-2 flex-shrink-0" />
                <span>-0.5 point penalty for viewing explanations</span>
              </li>
              <li className="flex items-start">
                <FaTrophy className="text-purple-500 mt-1 mr-2 flex-shrink-0" />
                <span>Earn stars based on your final score (max 5 stars)</span>
              </li>
            </ul>
          </div>
          <button
            onClick={startQuiz}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-600 transition-all shadow-md hover:shadow-lg flex items-center mx-auto"
          >
            Start Quiz <FaArrowRight className="ml-2" />
          </button>
        </motion.div>
      ) : showSuccessAnimation ? (
        <div className="flex flex-col items-center justify-center h-64">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 15 }}
            className="mb-4"
          >
            <div className="relative">
              <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <FaCheck className="text-4xl text-green-500 animate-bounce" />
              </div>
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1.5, opacity: 0 }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute inset-0 border-4 border-green-300 rounded-full"
              />
            </div>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xl font-semibold text-gray-700 dark:text-gray-200"
          >
            Quiz Completed!
          </motion.p>
        </div>
      ) : !showResult ? (
        <div className="quiz-container">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
                Question {currentQuestion + 1} of {questions.length}
              </span>
              <span className="text-sm font-medium bg-purple-100 dark:bg-purple-900/30 px-2 py-1 rounded text-purple-600 dark:text-purple-400">
                Score: {score.toFixed(1)}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div
                className="bg-gradient-to-r from-purple-500 to-purple-500 h-2.5 rounded-full transition-all duration-500"
                style={{
                  width: `${((currentQuestion + 1) / questions.length) * 100}%`,
                }}
              />
            </div>
          </div>

          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-xl font-semibold mb-6 dark:text-white p-4">
              {questions[currentQuestion].question}
            </h3>

            <div className="space-y-3 mb-6">
              {questions[currentQuestion].options.map((option, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedAnswer === index
                      ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20 shadow-md"
                      : "border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                  onClick={() => handleAnswerSelect(index)}
                >
                  <div className="flex items-center">
                    <span
                      className={`font-medium mr-3 w-6 h-6 flex items-center justify-center rounded-full ${
                        selectedAnswer === index
                          ? "bg-purple-500 text-white"
                          : "bg-gray-200 dark:bg-gray-600"
                      }`}
                    >
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span>{option}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            {selectedAnswer !== null && (
              <div className="mb-6">
                <button
                  onClick={() => setShowExplanation(!showExplanation)}
                  className="text-sm flex items-center text-purple-600 dark:text-purple-400 hover:underline mb-2"
                >
                  <FaInfoCircle className="mr-1" />
                  {showExplanation ? "Hide Explanation" : "Show Explanation"}
                </button>
                <AnimatePresence>
                  {showExplanation && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-sm overflow-hidden"
                    >
                      {questions[currentQuestion].explanation}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </motion.div>

          <div className="flex justify-between">
            <button
              onClick={handlePreviousQuestion}
              disabled={currentQuestion === 0}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg disabled:opacity-50 flex items-center hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              <FaArrowLeft className="mr-2" /> Previous
            </button>

            <button
              onClick={handleNextQuestion}
              disabled={selectedAnswer === null}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg disabled:opacity-50 hover:from-purple-600 hover:to-purple-600 transition-all flex items-center shadow-md hover:shadow-lg"
            >
              {currentQuestion === questions.length - 1 ? "Finish" : "Next"}{" "}
              <FaArrowRight className="ml-2" />
            </button>
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="result-container"
        >
          <div className="text-center mb-8">
            <div className="relative inline-block mb-4">
              <div className="w-32 h-32 bg-gradient-to-br from-purple-100 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/20 rounded-full flex items-center justify-center shadow-lg">
                <div className="text-4xl font-bold text-purple-600 dark:text-purple-400">
                  {score.toFixed(1)}/{questions.length}
                </div>
              </div>
              <div className="absolute -bottom-2 left-0 right-0 flex justify-center">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={`text-2xl mx-1 ${
                      i < getStarRating()
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300 dark:text-gray-600 fill-current"
                    }`}
                  />
                ))}
              </div>
            </div>

            <h3 className="text-2xl font-bold mb-2 dark:text-white">
              {score === questions.length
                ? "Perfect Score!"
                : score >= questions.length * 0.8
                ? "Excellent Work!"
                : score >= questions.length * 0.6
                ? "Good Job!"
                : score >= questions.length * 0.4
                ? "Keep Practicing!"
                : "Let's Review Again!"}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              You scored {((score / questions.length) * 100).toFixed(0)}%
              correct
            </p>
          </div>

          <div className="bg-white dark:bg-gray-700 p-4 rounded-lg mb-6 shadow-inner">
            <h4 className="font-bold mb-3 flex items-center text-purple-600 dark:text-purple-400">
              <FaInfoCircle className="mr-2" /> Performance Analysis
            </h4>
            <p className="text-sm">{calculateWeakAreas()}</p>
          </div>

          <div className="space-y-4 mb-8">
            <h4 className="font-bold text-gray-700 dark:text-gray-300">
              Question Breakdown:
            </h4>
            {questions.map((q, index) => (
              <div
                key={index}
                className="border-b pb-3 border-gray-200 dark:border-gray-700 last:border-0"
              >
                <p className="font-medium text-gray-800 dark:text-gray-200">
                  {q.question}
                </p>
                <div
                  className={`flex items-start mt-1 ${
                    answers[index] === q.correctAnswer
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {answers[index] === q.correctAnswer ? (
                    <FaCheck className="mt-1 mr-2 flex-shrink-0" />
                  ) : (
                    <FaTimes className="mt-1 mr-2 flex-shrink-0" />
                  )}
                  <div>
                    <p className="text-sm">
                      Your answer:{" "}
                      {answers[index] !== null
                        ? q.options[answers[index]]
                        : "Not answered"}
                    </p>
                    {answers[index] !== q.correctAnswer && (
                      <p className="text-sm">
                        Correct answer: {q.options[q.correctAnswer]}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={resetQuiz}
            className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:from-purple-700 hover:to-purple-600 transition-all shadow-md hover:shadow-lg flex items-center justify-center"
          >
            <FaRedo className="mr-2" /> Take Quiz Again
          </button>
        </motion.div>
      )}
    </section>
  );
>>>>>>> c8abb0c (Refactor color scheme from blue to purple across visualizer components for a cohesive design update)
};

export default Quiz;
