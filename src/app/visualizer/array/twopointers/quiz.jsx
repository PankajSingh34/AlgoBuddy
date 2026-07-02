"use client";
import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const twoPointersQuestions = [
  {
    question: "What is the primary advantage of the Two Pointers technique over a brute-force nested loop?",
    options: [
      "It works on unsorted arrays without any preprocessing.",
      "It reduces time complexity from O(N²) to O(N).",
      "It reduces space complexity from O(N) to O(log N).",
      "It eliminates the need for any comparisons."
    ],
    correctAnswer: 1,
    explanation: "By moving two pointers strategically instead of checking all pairs, Two Pointers reduces time complexity from O(N²) to O(N)."
  },
  {
    question: "For the Pair Sum problem using Two Pointers, what is a prerequisite for the input array?",
    options: [
      "The array must contain only positive integers.",
      "The array must have an even number of elements.",
      "The array must be sorted.",
      "The array must not contain duplicates."
    ],
    correctAnswer: 2,
    explanation: "The opposite-direction Two Pointers approach for Pair Sum relies on the sorted order to decide whether to move the left pointer right (increase sum) or the right pointer left (decrease sum)."
  },
  {
    question: "In the Remove Duplicates problem using slow/fast pointers, what does the slow pointer represent?",
    options: [
      "The current element being compared.",
      "The boundary of the unique elements processed so far.",
      "The last duplicate found.",
      "The middle of the array."
    ],
    correctAnswer: 1,
    explanation: "The slow pointer marks the end of the valid (unique) region. It only advances when the fast pointer finds a new unique element."
  },
  {
    question: "In the Container With Most Water problem, if arr[left] < arr[right], which pointer should you move and why?",
    options: [
      "Move right left — to find a taller right boundary.",
      "Move left right — the left height is the bottleneck; moving it may find a taller boundary.",
      "Move both pointers inward simultaneously.",
      "Keep both pointers fixed and compute for all inner pairs."
    ],
    correctAnswer: 1,
    explanation: "The area is limited by the shorter height. Moving the taller pointer inward can only decrease width without increasing height, so we move the shorter (left) pointer to potentially find a taller one."
  },
  {
    question: "Why is the Two Pointers technique O(N) even though each step involves two pointer comparisons?",
    options: [
      "Because one pointer never moves.",
      "Because each pointer only moves forward and each element is visited at most once per pointer.",
      "Because the compiler merges the two loops.",
      "Because we break early when a match is found."
    ],
    correctAnswer: 1,
    explanation: "Each pointer traverses the array at most once in a single direction. Total steps = at most 2N, which simplifies to O(N)."
  },
  {
  question: "Which type of problems is the Two Pointers technique most commonly used for?",
  options: [
    "Graph traversal",
    "Problems involving sorted arrays or linked lists",
    "Tree balancing",
    "Dynamic programming only"
  ],
  correctAnswer: 1,
  explanation: "The Two Pointers technique is most effective for sorted arrays, linked lists, and problems requiring simultaneous traversal from two positions."
},
{
  question: "In the Pair Sum problem on a sorted array, what should you do if the current sum is smaller than the target?",
  options: [
    "Move the left pointer to the right",
    "Move the right pointer to the left",
    "Move both pointers inward",
    "Restart the search"
  ],
  correctAnswer: 0,
  explanation: "Moving the left pointer to the right increases the sum because the array is sorted in ascending order."
},
{
  question: "Which pointer usually moves faster in the Fast and Slow Pointer technique used for cycle detection?",
  options: [
    "Slow pointer",
    "Fast pointer",
    "Both move at the same speed",
    "Neither pointer moves"
  ],
  correctAnswer: 1,
  explanation: "The fast pointer typically moves two steps while the slow pointer moves one step, allowing cycle detection."
},
{
  question: "Which famous algorithm uses the Fast and Slow Pointer technique?",
  options: [
    "Dijkstra's Algorithm",
    "Floyd's Cycle Detection Algorithm",
    "Kruskal's Algorithm",
    "Prim's Algorithm"
  ],
  correctAnswer: 1,
  explanation: "Floyd's Cycle Detection Algorithm (Tortoise and Hare) uses fast and slow pointers to detect cycles efficiently."
},
{
  question: "What is the main idea behind the Two Pointers technique?",
  options: [
    "Use recursion to divide the problem",
    "Traverse the data structure simultaneously using two indices or pointers",
    "Sort the array after every iteration",
    "Use extra memory to store visited elements"
  ],
  correctAnswer: 1,
  explanation: "The Two Pointers technique solves problems efficiently by moving two pointers strategically through the data structure."
}
];

const Quiz = () => {
  return <QuizEngine title="Two Pointers Technique Quiz" questions={twoPointersQuestions} />;
};

export default Quiz;