"use client";
import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const DPQuiz = () => {
  const questions = [
    {
      question: "What is Dynamic Programming (DP)?",
      options: [
        "A method for solving complex problems by breaking them down into simpler, overlapping subproblems",
        "An algorithm that always makes the locally optimal choice at each step",
        "A technique to automatically write computer code dynamically",
        "A database optimization method"
      ],
      correctAnswer: 0,
      explanation: "Dynamic Programming solves complex problems by breaking them down into simpler subproblems and storing the results of these subproblems to avoid redundant computations."
    },
    {
      question: "What are the two main characteristics a problem must have to be solvable using Dynamic Programming?",
      options: [
        "Optimal Substructure and Overlapping Subproblems",
        "Greedy Choice Property and Optimal Substructure",
        "Divide and Conquer and Recursion",
        "Memoization and Tabulation"
      ],
      correctAnswer: 0,
      explanation: "A problem must exhibit Optimal Substructure (the optimal solution to the problem contains optimal solutions to its subproblems) and Overlapping Subproblems (the same subproblems are solved repeatedly) to use DP."
    },
    {
      question: "Which of the following describes the 'Top-Down' approach to Dynamic Programming?",
      options: [
        "Tabulation",
        "Memoization",
        "Iteration",
        "Breadth-First Search"
      ],
      correctAnswer: 1,
      explanation: "Memoization is the top-down approach. It starts with the main problem, breaks it down recursively, and caches the results of subproblems as they are computed."
    },
    {
      question: "Which of the following describes the 'Bottom-Up' approach to Dynamic Programming?",
      options: [
        "Tabulation",
        "Memoization",
        "Recursion",
        "Divide and Conquer"
      ],
      correctAnswer: 0,
      explanation: "Tabulation is the bottom-up approach. It starts by solving the smallest subproblems first and iteratively uses their solutions to build up to the main problem."
    },
    {
      question: "In the context of the Fibonacci sequence, why is plain recursion inefficient without DP?",
      options: [
        "Because it uses too much memory",
        "Because it recalculates the same Fibonacci numbers multiple times",
        "Because it requires a specialized compiler",
        "Because it is impossible to write correctly"
      ],
      correctAnswer: 1,
      explanation: "Plain recursion evaluates the same subproblems repeatedly, resulting in an exponential time complexity of O(2^n). DP solves this by storing the previously calculated values."
    },
    {
      question: "What is 'State' in Dynamic Programming?",
      options: [
        "The language compiler's current memory allocation",
        "A set of parameters that uniquely identifies a specific subproblem",
        "The final output of the algorithm",
        "The condition that breaks the recursive loop"
      ],
      correctAnswer: 1,
      explanation: "A 'state' is a configuration of variables/parameters that uniquely defines a specific subproblem (e.g., in Knapsack, the state is typically defined by the current item index and the remaining capacity)."
    },
    {
      question: "What is a 'State Transition' in Dynamic Programming?",
      options: [
        "Switching from one programming language to another",
        "Converting a recursive function to an iterative one",
        "The mathematical relationship or recurrence relation that connects a state to its smaller subproblems",
        "The process of clearing the memoization table"
      ],
      correctAnswer: 2,
      explanation: "The state transition describes how a problem's solution is built from its subproblems' solutions. E.g., dp[i] = dp[i-1] + dp[i-2]."
    },
    {
      question: "What are 'Base Cases' in DP?",
      options: [
        "The most complex subproblems to solve",
        "The simplest, smallest subproblems that can be solved directly without further breaking down",
        "The worst-case time complexity of the algorithm",
        "The memory allocated for the DP table"
      ],
      correctAnswer: 1,
      explanation: "Base cases are the fundamental building blocks of DP. They are the known initial values (e.g., fib(0) = 0, fib(1) = 1) from which all other states are computed."
    },
    {
      question: "What is the typical time complexity of calculating the Nth Fibonacci number using Dynamic Programming?",
      options: [
        "O(1)",
        "O(log N)",
        "O(N)",
        "O(2^N)"
      ],
      correctAnswer: 2,
      explanation: "With DP, we compute each Fibonacci number exactly once from 1 to N, resulting in a linear O(N) time complexity."
    },
    {
      question: "How can the space complexity of the Bottom-Up Fibonacci DP algorithm be optimized?",
      options: [
        "By using an array of size N",
        "By using a Hash Map instead of an Array",
        "By only keeping track of the last two computed values (O(1) space)",
        "Space complexity cannot be optimized further than O(N)"
      ],
      correctAnswer: 2,
      explanation: "Since fib(n) only depends on fib(n-1) and fib(n-2), we only need two variables to store the previous states, reducing space complexity from O(N) to O(1)."
    },
    {
      question: "In the 0/1 Knapsack Problem, what does '0/1' refer to?",
      options: [
        "The weights must be either 0 or 1",
        "You can either include an item entirely (1) or leave it out entirely (0)",
        "The time complexity is O(N)",
        "The items can be broken down into fractions"
      ],
      correctAnswer: 1,
      explanation: "0/1 means you cannot take a fraction of an item; you must either take the whole item (1) or not take it at all (0)."
    },
    {
      question: "What is the typical time complexity of the 0/1 Knapsack problem using Dynamic Programming?",
      options: [
        "O(N)",
        "O(W)",
        "O(N * W)",
        "O(2^N)"
      ],
      correctAnswer: 2,
      explanation: "The DP table has N (number of items) rows and W (knapsack capacity) columns. We fill each cell in O(1) time, leading to O(N * W) time complexity. This is known as pseudo-polynomial time."
    },
    {
      question: "Which DP problem asks you to find the length of the longest subsequence present in both of two given sequences?",
      options: [
        "Longest Increasing Subsequence (LIS)",
        "Longest Common Subsequence (LCS)",
        "Matrix Chain Multiplication",
        "Coin Change"
      ],
      correctAnswer: 1,
      explanation: "Longest Common Subsequence (LCS) finds the longest sequence that appears in the same relative order in both strings."
    },
    {
      question: "In the Coin Change problem (finding the minimum number of coins to make a given amount), what is the optimal substructure?",
      options: [
        "dp[amount] = max(dp[amount], dp[amount - coin] + 1)",
        "dp[amount] = min(dp[amount], dp[amount - coin] + 1)",
        "dp[amount] = dp[amount - 1] + dp[amount - 2]",
        "dp[amount] = dp[amount] * coin"
      ],
      correctAnswer: 1,
      explanation: "To find the minimum coins for `amount`, we look at the minimum coins needed for `amount - coin` and add 1 (for the current coin), taking the minimum across all available coin denominations."
    },
    {
      question: "What is the time complexity of the standard Dynamic Programming approach for Longest Increasing Subsequence (LIS)?",
      options: [
        "O(N)",
        "O(N log N)",
        "O(N²)",
        "O(2^N)"
      ],
      correctAnswer: 2,
      explanation: "The standard nested loop DP approach for LIS checks every previous element for each element, leading to O(N²) time complexity. (Note: An O(N log N) solution exists using Binary Search, but it's not the standard DP method)."
    },
    {
      question: "What does the Matrix Chain Multiplication DP problem aim to minimize?",
      options: [
        "The number of matrices in the chain",
        "The total number of scalar multiplications required to multiply the matrices",
        "The dimensions of the resulting matrix",
        "The time it takes to add the matrices"
      ],
      correctAnswer: 1,
      explanation: "Matrix Chain Multiplication seeks the optimal parenthesization of a sequence of matrices to minimize the total number of scalar multiplications needed to compute the product."
    },
    {
      question: "When should you generally prefer Tabulation over Memoization?",
      options: [
        "When the state space is sparse and you won't need to visit all subproblems",
        "When you want to avoid the overhead of recursive function calls and potential stack overflow issues",
        "When you are unsure of the base cases",
        "When you need to write the code as quickly as possible"
      ],
      correctAnswer: 1,
      explanation: "Tabulation (bottom-up) uses an iterative approach, avoiding recursion depth limits and function call overhead. Memoization is often preferred when the state space is sparse (not all states need to be computed)."
    },
    {
      question: "Which of the following is NOT a common dynamic programming pattern?",
      options: [
        "1D Array (e.g., Fibonacci, Climbing Stairs)",
        "2D Array/Grid (e.g., Unique Paths, LCS)",
        "Interval/Range (e.g., Matrix Chain Multiplication, Palindrome Substrings)",
        "Greedy Choice (e.g., Fractional Knapsack)"
      ],
      correctAnswer: 3,
      explanation: "The Greedy Choice is a characteristic of Greedy Algorithms, not Dynamic Programming. Fractional Knapsack is solved using a Greedy approach, while 0/1 Knapsack requires DP."
    }
  ];

  return <QuizEngine title="Dynamic Programming Quiz" questions={questions} />;
};

export default DPQuiz;
