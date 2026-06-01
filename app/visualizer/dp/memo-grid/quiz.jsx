"use client";
import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const DpQuiz = () => {
  const questions = [
    {
      question: "What is the primary difference between Memoization (Top-Down) and Tabulation (Bottom-Up) in Dynamic Programming?",
      options: [
        "Memoization is iterative and uses a table, while Tabulation is recursive.",
        "Memoization solves subproblems recursively and stores results in a cache on-demand, whereas Tabulation solves all subproblems iteratively in a grid from bottom-up.",
        "Tabulation has a worse time complexity than Memoization.",
        "Memoization always uses O(1) auxiliary stack space."
      ],
      correctAnswer: 1,
      explanation: "Memoization (Top-Down) starts from the main problem and recursively breaks it down, caching solved subproblems to prevent redundant calls. Tabulation (Bottom-Up) builds the solution iteratively from the base cases upward, filling a table sequentially without recursive stack overhead."
    },
    {
      question: "In a 2D dynamic programming grid for the 0/1 Knapsack problem, what do the rows and columns typically represent?",
      options: [
        "Rows represent the capacity, Columns represent the total value.",
        "Rows represent the items available, Columns represent the remaining knapsack capacity.",
        "Rows represent the dynamic programming steps, Columns represent the item values.",
        "Rows represent the item weights, Columns represent the maximum items."
      ],
      correctAnswer: 1,
      explanation: "For 0/1 Knapsack, rows index the set of items considered so far, and columns index the remaining capacities of the knapsack from 0 to W. Each cell dp[i][j] represents the maximum value obtainable using a subset of the first i items with capacity j."
    },
    {
      question: "Which of the following describes the 'overlapping subproblems' property in dynamic programming?",
      options: [
        "A problem has subproblems that share the same structure but have totally independent inputs.",
        "A problem can be solved by combining optimal solutions to non-overlapping subproblems.",
        "An algorithm solves the same subproblem multiple times during recursive execution, making it beneficial to cache results.",
        "Subproblems are solved in parallel using multiple CPU threads."
      ],
      correctAnswer: 2,
      explanation: "Overlapping subproblems exist when a recursive algorithm visits the exact same state multiple times (e.g., computing fib(3) several times in fib(5)). Caching these results (memoization) reduces exponential time complexities to polynomial or linear."
    },
    {
      question: "What does a 'dependency pointer' in a Dynamic Programming dependency grid visually demonstrate?",
      options: [
        "The connection between the code block and the web browser server.",
        "The sequence of mouse hover events fired by the user interface.",
        "The previous subproblem cells (e.g., dp[i-1][j] or dp[i-1][j-weight]) whose values were directly read to compute the current cell's value.",
        "The pointer addresses of the memory layout in C++."
      ],
      correctAnswer: 2,
      explanation: "Dependency pointers (or arrows) map the mathematical recurrence relations of the DP equation. For instance, in Knapsack, calculating dp[i][j] relies on either excluding the item (dp[i-1][j]) or including it (dp[i-1][j-w]), showing exactly which subproblems computed the current state."
    },
    {
      question: "If a top-down dynamic programming recursion tree encounters a state that is already present in the memoization table, what occurs?",
      options: [
        "The program crashes due to stack overflow.",
        "The recursion branch is pruned ('Cache Hit'), immediately returning the stored value in O(1) time without traversing deeper.",
        "The algorithm clears the table and restarts from the base case.",
        "The table allocates new space to re-evaluate the state."
      ],
      correctAnswer: 1,
      explanation: "A cache hit in memoization intercepts the recursive call. Since the state was already solved and stored, the function returns the cached result immediately, pruning the recursion tree and transforming the time complexity from O(2^N) to O(N)."
    }
  ];

  return <QuizEngine title="Dynamic Programming Grid & Memoization Quiz" questions={questions} />;
};

export default DpQuiz;
