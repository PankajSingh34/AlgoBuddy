"use client";
import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const BinarySearchQuiz = () => {
  const questions = [
    {
      question: "What is the primary requirement for binary search to work?",
      options: [
        "The list must be unsorted",
        "The list must be sorted",
        "The list must contain only numbers",
        "The list must be small in size"
      ],
      correctAnswer: 1,
      explanation: "Binary search requires the list to be sorted beforehand because it relies on comparing the target value to the middle element to determine which half of the list to search next."
    },
    {
      question: "What is the time complexity of binary search in the worst case?",
      options: [
        "O(1)",
        "O(log n)",
        "O(n)",
        "O(n²)"
      ],
      correctAnswer: 1,
      explanation: "In the worst case (when the target is not present), binary search has a time complexity of O(log n) because it halves the search space with each comparison."
    },
    {
      question: "In the array [1, 3, 5, 7, 9, 11, 13], how many comparisons are needed to find the number 5?",
      options: [
        "1",
        "2",
        "3",
        "4"
      ],
      correctAnswer: 2,
      explanation: "First comparison: middle is 7 (too high). Second comparison: new middle is 3 (too low). Third comparison: finds 5."
    },
    {
      question: "What is the best-case scenario for binary search?",
      options: [
        "Target is at the beginning of the list",
        "Target is at the end of the list",
        "Target is the middle element",
        "Target is not in the list"
      ],
      correctAnswer: 2,
      explanation: "The best case occurs when the target is the middle element of the array, requiring only one comparison (O(1))."
    },
    {
      question: "What would binary search return if the target value is not in the list?",
      options: [
        "The first element",
        "The last element",
        "An error message",
        "A 'not found' indication"
      ],
      correctAnswer: 3,
      explanation: "When the target isn't found, binary search typically returns a special value (like -1 or 'not found') to indicate this."
    },
    {
  question: "Why is binary search faster than linear search for large sorted arrays?",
  options: [
    "It checks every element",
    "It divides the search space in half each step",
    "It uses recursion only",
    "It sorts the array during searching"
  ],
  correctAnswer: 1,
  explanation: "Binary search halves the remaining search space after every comparison, resulting in O(log n) time complexity."
},
{
  question: "Which data structure is most suitable for binary search?",
  options: [
    "Unsorted Array",
    "Sorted Array",
    "Queue",
    "Graph"
  ],
  correctAnswer: 1,
  explanation: "Binary search requires the data to be sorted so that half of the search space can be discarded after each comparison."
},
{
  question: "If a sorted array has 16 elements, what is the maximum number of comparisons needed in binary search?",
  options: [
    "4",
    "8",
    "16",
    "5"
  ],
  correctAnswer: 0,
  explanation: "Since log₂(16) = 4, binary search requires at most 4 comparisons in the ideal implementation."
},
{
  question: "What happens if binary search is applied to an unsorted array?",
  options: [
    "It always works correctly",
    "It may return incorrect results",
    "It sorts the array automatically",
    "It becomes O(1)"
  ],
  correctAnswer: 1,
  explanation: "Binary search assumes the array is sorted. On unsorted data, the search decisions become invalid."
},
{
  question: "Which algorithm generally performs better on large sorted datasets?",
  options: [
    "Linear Search",
    "Binary Search",
    "Bubble Sort",
    "Selection Sort"
  ],
  correctAnswer: 1,
  explanation: "Binary Search has O(log n) complexity, making it much faster than Linear Search on large sorted datasets."
},
{
  question: "Which of the following is a prerequisite before performing binary search?",
  options: [
    "The array must be sorted",
    "The array must have unique elements",
    "The array must be reversed",
    "The array must contain integers only"
  ],
  correctAnswer: 0,
  explanation: "Binary search works correctly only on sorted data because it eliminates half of the search space based on ordering."
},
{
  question: "What is the space complexity of an iterative binary search?",
  options: [
    "O(1)",
    "O(log n)",
    "O(n)",
    "O(n²)"
  ],
  correctAnswer: 0,
  explanation: "An iterative implementation uses only a few variables, resulting in O(1) auxiliary space."
},
{
  question: "What is the space complexity of a recursive binary search?",
  options: [
    "O(1)",
    "O(log n)",
    "O(n)",
    "O(n log n)"
  ],
  correctAnswer: 1,
  explanation: "Recursive binary search requires O(log n) stack space due to recursive function calls."
},
{
  question: "How is the middle index commonly calculated to avoid integer overflow?",
  options: [
    "(low + high) / 2",
    "low + (high - low) / 2",
    "(high - low) / 2",
    "high / 2"
  ],
  correctAnswer: 1,
  explanation: "Using low + (high - low) / 2 prevents potential integer overflow when low and high are large values."
},
{
  question: "What should happen if the middle element is greater than the target?",
  options: [
    "Search the right half",
    "Stop searching",
    "Search the left half",
    "Restart the search"
  ],
  correctAnswer: 2,
  explanation: "If the middle element is greater than the target, the target can only exist in the left half of the sorted array."
},
{
  question: "What should happen if the middle element is smaller than the target?",
  options: [
    "Search the left half",
    "Search the right half",
    "Return the middle element",
    "Sort the array again"
  ],
  correctAnswer: 1,
  explanation: "If the middle element is smaller than the target, the search continues in the right half."
},
{
  question: "Which searching algorithm is generally preferred for small unsorted arrays?",
  options: [
    "Binary Search",
    "Jump Search",
    "Linear Search",
    "Interpolation Search"
  ],
  correctAnswer: 2,
  explanation: "Linear search is suitable for small or unsorted arrays because it does not require sorting."
},
{
  question: "What is the maximum number of comparisons needed to search 32 sorted elements using binary search?",
  options: [
    "4",
    "5",
    "6",
    "32"
  ],
  correctAnswer: 1,
  explanation: "Since log₂(32) = 5, binary search requires at most 5 comparisons."
},
{
  question: "If the target element equals the middle element, what does binary search do?",
  options: [
    "Continue searching both halves",
    "Return the index immediately",
    "Restart the search",
    "Move to the next element"
  ],
  correctAnswer: 1,
  explanation: "Once the target matches the middle element, binary search terminates and returns its index."
},
{
  question: "Which real-world application commonly uses binary search?",
  options: [
    "Searching words in a sorted dictionary",
    "Sorting files alphabetically",
    "Drawing graphics",
    "Compressing images"
  ],
  correctAnswer: 0,
  explanation: "Searching a word in a sorted dictionary is a classic application of binary search because the search space is repeatedly divided in half."
}
  ];

  return <QuizEngine title="Binary Search Quiz Challenge" questions={questions} />;
};

export default BinarySearchQuiz;
