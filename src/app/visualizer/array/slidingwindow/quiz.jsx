"use client";
import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const slidingWindowQuestions = [
  {
    question: "What is the primary advantage of the Sliding Window technique over a brute-force nested loop approach?",
    options: [
      "It requires less auxiliary space (O(1) vs O(N)).",
      "It reduces time complexity from O(N²) to O(N).",
      "It can be applied to unsorted arrays to find an exact element.",
      "It automatically sorts the array."
    ],
    correctAnswer: 1,
    explanation: "By avoiding repeated calculations of overlapping subarrays or substrings, Sliding Window reduces the overall time complexity to O(N)."
  },
  {
    question: "In a Variable-Size Sliding Window problem, when do you typically shrink the window from the left?",
    options: [
      "After every single iteration of the loop.",
      "When the right pointer reaches the end of the array.",
      "When the current window violates the problem's condition (e.g., sum exceeds target, duplicate found).",
      "When the left pointer catches up to the right pointer."
    ],
    correctAnswer: 2,
    explanation: "You expand the window until the condition is violated, then shrink it from the left until it becomes valid again."
  },
  {
    question: "Why is the time complexity of the Sliding Window technique O(N) even if there is a 'while' loop inside the 'for' loop?",
    options: [
      "Because the 'while' loop only executes O(log N) times.",
      "Because the left and right pointers only move forward, visiting each element at most twice.",
      "Because the compiler automatically optimizes nested loops.",
      "Because we break out of the loops early."
    ],
    correctAnswer: 1,
    explanation: "Each element is added to the window at most once (by the right pointer) and removed at most once (by the left pointer), resulting in O(N) total operations."
  },
  {
    question: "Which of the following problems is best solved using a Fixed-Size Sliding Window?",
    options: [
      "Longest Substring Without Repeating Characters",
      "Smallest Subarray with a sum greater than X",
      "Maximum Sum Subarray of Size K",
      "Minimum Window Substring"
    ],
    correctAnswer: 2,
    explanation: "Since the window size 'K' is fixed and given, it's a classic fixed-size sliding window problem. The others require dynamically adjusting the window size."
  },
  {
    question: "When applying a Sliding Window to a string to find the longest substring with K unique characters, what auxiliary data structure is most helpful to track characters inside the window?",
    options: [
      "A Stack",
      "A Queue",
      "A HashMap or Frequency Array",
      "A Priority Queue (Heap)"
    ],
    correctAnswer: 2,
    explanation: "A HashMap or Frequency Array is used to keep track of the count of each character currently in the window, allowing you to easily check if there are exactly K unique characters."
  },
  {
  question: "What happens when the sliding window moves one step forward in a fixed-size sliding window?",
  options: [
    "A new element is added to the right and the leftmost element is removed.",
    "The entire window is recalculated from scratch.",
    "Only the left pointer moves.",
    "The window size doubles."
  ],
  correctAnswer: 0,
  explanation: "In a fixed-size sliding window, the leftmost element leaves the window while a new element enters from the right."
},
{
  question: "Which type of problems is Sliding Window most commonly used for?",
  options: [
    "Problems involving contiguous subarrays or substrings.",
    "Sorting arrays.",
    "Graph traversal.",
    "Binary tree traversal."
  ],
  correctAnswer: 0,
  explanation: "Sliding Window is primarily used for problems involving contiguous sequences in arrays or strings."
},
{
  question: "Which pointer is typically moved first when expanding a variable-size sliding window?",
  options: [
    "Left pointer",
    "Right pointer",
    "Both pointers together",
    "Neither pointer"
  ],
  correctAnswer: 1,
  explanation: "The right pointer expands the window by including new elements, while the left pointer moves only when the window needs to shrink."
},
{
  question: "Which of the following is NOT a common Sliding Window application?",
  options: [
    "Longest substring without repeating characters",
    "Maximum average subarray",
    "Breadth First Search traversal",
    "Minimum window substring"
  ],
  correctAnswer: 2,
  explanation: "Breadth First Search is a graph traversal algorithm and does not use the Sliding Window technique."
},
{
  question: "What is the main idea behind the Sliding Window technique?",
  options: [
    "Recompute every possible subarray independently.",
    "Reuse information from the previous window instead of recalculating everything.",
    "Sort the array before processing.",
    "Use recursion to examine all possibilities."
  ],
  correctAnswer: 1,
  explanation: "Sliding Window improves efficiency by updating the current window incrementally instead of recalculating values for every new window."
},
{
  question: "Which data structure is commonly used with Sliding Window problems involving character frequencies?",
  options: [
    "Stack",
    "HashMap",
    "Binary Tree",
    "Heap"
  ],
  correctAnswer: 1,
  explanation: "A HashMap (or frequency array) efficiently keeps track of character counts inside the current window."
},
{
  question: "What is the time complexity of the Sliding Window technique for most problems?",
  options: [
    "O(n²)",
    "O(log n)",
    "O(n)",
    "O(n log n)"
  ],
  correctAnswer: 2,
  explanation: "Since both left and right pointers move forward at most n times, the overall complexity is O(n)."
},
{
  question: "Which type of Sliding Window uses a window size that changes during execution?",
  options: [
    "Fixed-size Sliding Window",
    "Variable-size Sliding Window",
    "Circular Window",
    "Static Window"
  ],
  correctAnswer: 1,
  explanation: "Variable-size Sliding Window expands or shrinks depending on the problem constraints."
},
{
  question: "When solving 'Longest Substring Without Repeating Characters', why is the left pointer moved?",
  options: [
    "To increase the window size",
    "To remove duplicate characters from the current window",
    "To sort the substring",
    "To restart the algorithm"
  ],
  correctAnswer: 1,
  explanation: "The left pointer moves forward until the duplicate character is removed, restoring a valid window."
},
{
  question: "What is the main purpose of maintaining a running sum in a fixed-size Sliding Window?",
  options: [
    "To avoid recalculating the sum of every window",
    "To sort the array",
    "To count duplicate elements",
    "To reverse the window"
  ],
  correctAnswer: 0,
  explanation: "The running sum is updated by adding the incoming element and subtracting the outgoing element, avoiding repeated calculations."
},
{
  question: "Which problem is commonly solved using a variable-size Sliding Window?",
  options: [
    "Maximum Sum Subarray of Size K",
    "Minimum Window Substring",
    "Merge Sort",
    "Binary Search"
  ],
  correctAnswer: 1,
  explanation: "The Minimum Window Substring problem requires dynamically expanding and shrinking the window."
},
{
  question: "What happens when the current window satisfies the required condition in a variable-size Sliding Window problem?",
  options: [
    "The window is always expanded",
    "The window may be shrunk to find a better answer",
    "The algorithm stops immediately",
    "The array is sorted"
  ],
  correctAnswer: 1,
  explanation: "Once a valid window is found, it is often shrunk to determine whether a smaller valid window exists."
},
{
  question: "Sliding Window is most suitable when dealing with:",
  options: [
    "Non-contiguous elements",
    "Contiguous subarrays or substrings",
    "Graph edges",
    "Binary Search Trees"
  ],
  correctAnswer: 1,
  explanation: "Sliding Window works efficiently for contiguous sequences because the window moves continuously through the data."
},
{
  question: "What is the biggest advantage of Sliding Window compared to recalculating every subarray?",
  options: [
    "Less recursion",
    "Reuses previous computations for better efficiency",
    "Requires sorting first",
    "Uses divide and conquer"
  ],
  correctAnswer: 1,
  explanation: "Sliding Window updates the current window instead of recomputing values from scratch, significantly improving performance."
},
{
  question: "Which scenario is ideal for applying the Sliding Window technique?",
  options: [
    "Finding the maximum sum of a contiguous subarray of size K",
    "Sorting an unsorted array",
    "Finding the height of a binary tree",
    "Traversing a graph using DFS"
  ],
  correctAnswer: 0,
  explanation: "Problems involving contiguous subarrays or substrings with fixed or variable lengths are ideal for the Sliding Window technique."
},
{
  question: "In a variable-size Sliding Window, what is the purpose of moving the left pointer?",
  options: [
    "To expand the window",
    "To shrink the window and satisfy the required condition",
    "To restart the algorithm",
    "To sort the window"
  ],
  correctAnswer: 1,
  explanation: "The left pointer is moved to shrink the window whenever it violates the required condition or when trying to optimize the answer."
},
{
  question: "Which of the following problems is NOT typically solved using the Sliding Window technique?",
  options: [
    "Maximum Sum Subarray",
    "Longest Repeating Character Replacement",
    "Topological Sorting",
    "Longest Substring Without Repeating Characters"
  ],
  correctAnswer: 2,
  explanation: "Topological Sorting is a graph algorithm and does not use the Sliding Window technique."
},
{
  question: "Why is Sliding Window more efficient than checking every possible subarray?",
  options: [
    "It uses recursion",
    "It avoids repeated calculations by updating the current window",
    "It sorts the array first",
    "It performs binary search"
  ],
  correctAnswer: 1,
  explanation: "Instead of recalculating every window from scratch, Sliding Window updates the current result incrementally."
},
{
  question: "What does the right pointer represent in the Sliding Window technique?",
  options: [
    "The beginning of the window",
    "The end of the current window",
    "The maximum element",
    "The smallest element"
  ],
  correctAnswer: 1,
  explanation: "The right pointer expands the window by including new elements."
},
{
  question: "If a fixed-size window has size K, how many windows exist in an array of size N?",
  options: [
    "N - K + 1",
    "N + K",
    "K",
    "N × K"
  ],
  correctAnswer: 0,
  explanation: "There are exactly N − K + 1 possible contiguous windows of size K."
},
{
  question: "Which operation is performed when a new element enters a fixed-size Sliding Window?",
  options: [
    "Only remove an element",
    "Add the new element and remove the oldest one",
    "Sort the window",
    "Restart the computation"
  ],
  correctAnswer: 1,
  explanation: "The oldest element leaves the window while the new element is added, allowing efficient updates."
},
{
  question: "Which technique is often combined with Sliding Window for string problems?",
  options: [
    "HashMap or Frequency Array",
    "Binary Search Tree",
    "Heap",
    "AVL Tree"
  ],
  correctAnswer: 0,
  explanation: "A HashMap or frequency array is commonly used to track character frequencies inside the current window."
},
{
  question: "What is the maximum number of times an element is processed in a typical Sliding Window algorithm?",
  options: [
    "Once",
    "Twice",
    "N times",
    "Log N times"
  ],
  correctAnswer: 1,
  explanation: "Each element is visited once by the right pointer and once by the left pointer, resulting in at most two visits."
},
{
  question: "Which problem is a classic example of a variable-size Sliding Window?",
  options: [
    "Maximum Sum of Size K",
    "Longest Subarray with Sum ≤ K",
    "Merge Sort",
    "Selection Sort"
  ],
  correctAnswer: 1,
  explanation: "The window size changes dynamically while maintaining the required condition."
},
{
  question: "Which statement about the Sliding Window technique is TRUE?",
  options: [
    "It always requires nested loops with O(n²) complexity",
    "It is useful only for arrays",
    "It efficiently processes contiguous sequences by maintaining a moving window",
    "It works only on sorted data"
  ],
  correctAnswer: 2,
  explanation: "Sliding Window is designed for efficiently processing contiguous subarrays or substrings while maintaining information about the current window."
}
];

const Quiz = () => {
  return <QuizEngine title="Sliding Window Technique Quiz" questions={slidingWindowQuestions} />;
};

export default Quiz;
