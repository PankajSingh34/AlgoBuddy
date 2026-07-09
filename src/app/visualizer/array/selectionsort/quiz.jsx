"use client";
import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const SelectionSortQuiz = () => {
  const questions = [
    {
      question: "What is the basic principle of Selection Sort?",
      options: [
        "Dividing the list into smaller sublists",
        "Repeatedly finding the minimum element and swapping it with the current position",
        "Comparing adjacent elements and swapping if they're in the wrong order",
        "Merging two sorted lists into one"
      ],
      correctAnswer: 1,
      explanation: "Selection Sort works by repeatedly finding the minimum element from the unsorted part and putting it at the beginning."
    },
    {
      question: "What is the time complexity of Selection Sort in all cases?",
      options: [
        "O(n)",
        "O(n log n)",
        "O(n²)",
        "O(1)"
      ],
      correctAnswer: 2,
      explanation: "Selection Sort always requires O(n²) comparisons regardless of input order because it must scan all remaining elements for each position."
    },
    {
      question: "In the array [64, 25, 12, 22, 11], how many swaps occur during the entire sorting process?",
      options: [
        "1",
        "2",
        "4",
        "5"
      ],
      correctAnswer: 2,
      explanation: "Selection Sort makes only 4 swaps total (one for each element except the last): 64↔11, 25↔12, 22↔22 (no swap), and 64↔25."
    },
    {
      question: "What makes Selection Sort different from Bubble Sort?",
      options: [
        "Selection Sort is stable while Bubble Sort is not",
        "Selection Sort makes fewer swaps (O(n) vs O(n²))",
        "Bubble Sort has better worst-case time complexity",
        "Selection Sort requires additional O(n) space"
      ],
      correctAnswer: 1,
      explanation: "The key advantage of Selection Sort is that it makes only O(n) swaps compared to Bubble Sort's O(n²) swaps in worst case."
    },
    {
      question: "What is the space complexity of Selection Sort?",
      options: [
        "O(n)",
        "O(n log n)",
        "O(n²)",
        "O(1)"
      ],
      correctAnswer: 3,
      explanation: "Like Bubble Sort, Selection Sort is an in-place algorithm that only requires O(1) additional space for temporary storage during swaps."
    },
    {
      question: "Why is Selection Sort not considered stable?",
      options: [
        "Because it changes the relative order of equal elements",
        "Because its time complexity varies with input",
        "Because it requires recursive implementation",
        "Because it uses additional memory"
      ],
      correctAnswer: 0,
      explanation: "Selection Sort isn't stable because the swapping of elements can change the relative order of equal keys (e.g., [5a, 2, 5b] → [2, 5b, 5a])."
    },
    {
      question: "When might Selection Sort be preferred over other simple sorts?",
      options: [
        "When the input is already sorted",
        "When memory writes are expensive",
        "When stability is required",
        "When dealing with very large datasets"
      ],
      correctAnswer: 1,
      explanation: "Selection Sort's O(n) swaps make it useful when memory writes are expensive, even though it still requires O(n²) comparisons."
    },
    {
    question: "What is the basic idea behind Selection Sort?",
    options: [
      "Swap adjacent elements repeatedly",
      "Select the smallest element and place it in the correct position",
      "Divide the array into halves",
      "Insert elements into a sorted portion"
    ],
    correctAnswer: 1,
    explanation: "Selection Sort repeatedly finds the smallest element from the unsorted portion and places it at the beginning."
  },
  {
    question: "What is the worst-case time complexity of Selection Sort?",
    options: [
      "O(log n)",
      "O(n)",
      "O(n²)",
      "O(n log n)"
    ],
    correctAnswer: 2,
    explanation: "Selection Sort always performs O(n²) comparisons regardless of the initial order of the elements."
  },
  {
    question: "How many swaps does Selection Sort perform in the worst case?",
    options: [
      "n²",
      "n",
      "n-1",
      "1"
    ],
    correctAnswer: 2,
    explanation: "Selection Sort performs at most n−1 swaps, making it efficient in terms of swap operations."
  },
  {
    question: "Is Selection Sort a stable sorting algorithm?",
    options: [
      "Yes",
      "No",
      "Only for integers",
      "Only for sorted arrays"
    ],
    correctAnswer: 1,
    explanation: "Standard Selection Sort is not stable because swapping can change the relative order of equal elements."
  },
  {
    question: "Which statement about Selection Sort is correct?",
    options: [
      "It requires additional memory",
      "It always performs the same number of comparisons",
      "It only works on sorted arrays",
      "It is faster than Merge Sort for large datasets"
    ],
    correctAnswer: 1,
    explanation: "Selection Sort performs the same number of comparisons regardless of whether the array is sorted or unsorted."
  },
  {
  question: "What is the first step performed in Selection Sort?",
  options: [
    "Compare adjacent elements",
    "Find the smallest element in the unsorted portion",
    "Divide the array into two halves",
    "Insert the first element into a sorted list"
  ],
  correctAnswer: 1,
  explanation: "Selection Sort begins by finding the smallest element in the unsorted portion of the array."
},
{
  question: "After each pass of Selection Sort, which part of the array is guaranteed to be sorted?",
  options: [
    "The last element",
    "The first part of the array",
    "The middle elements",
    "The entire array"
  ],
  correctAnswer: 1,
  explanation: "After every pass, one more element is placed in its correct position at the beginning of the array."
},
{
  question: "How many passes are required to sort an array of n elements using Selection Sort?",
  options: [
    "n",
    "n - 1",
    "log n",
    "n²"
  ],
  correctAnswer: 1,
  explanation: "Selection Sort requires n - 1 passes because the last element is automatically in its correct position."
},
{
  question: "What is the best-case time complexity of Selection Sort?",
  options: [
    "O(1)",
    "O(log n)",
    "O(n)",
    "O(n²)"
  ],
  correctAnswer: 3,
  explanation: "Selection Sort always performs O(n²) comparisons, even if the array is already sorted."
},
{
  question: "Which operation is minimized in Selection Sort compared to Bubble Sort?",
  options: [
    "Comparisons",
    "Swaps",
    "Memory usage",
    "Recursion"
  ],
  correctAnswer: 1,
  explanation: "Selection Sort performs far fewer swaps than Bubble Sort, making it useful when write operations are expensive."
},
{
  question: "Selection Sort belongs to which category of sorting algorithms?",
  options: [
    "Comparison-based sorting",
    "Non-comparison sorting",
    "Divide and Conquer",
    "Hash-based sorting"
  ],
  correctAnswer: 0,
  explanation: "Selection Sort compares elements to determine their correct order, making it a comparison-based sorting algorithm."
},
{
  question: "Why is Selection Sort generally not suitable for large datasets?",
  options: [
    "It uses too much memory",
    "It requires recursion",
    "It has O(n²) time complexity",
    "It cannot sort duplicate values"
  ],
  correctAnswer: 2,
  explanation: "Selection Sort performs O(n²) comparisons, making it inefficient for large datasets."
},
{
  question: "Can Selection Sort correctly sort an array containing duplicate elements?",
  options: [
    "Yes",
    "No",
    "Only if duplicates are adjacent",
    "Only after removing duplicates"
  ],
  correctAnswer: 0,
  explanation: "Selection Sort correctly sorts arrays with duplicate values, although it is not a stable sorting algorithm."
},
{
  question: "Which sorting algorithm usually performs fewer swaps?",
  options: [
    "Bubble Sort",
    "Selection Sort",
    "Both perform the same number of swaps",
    "Merge Sort"
  ],
  correctAnswer: 1,
  explanation: "Selection Sort performs at most n−1 swaps, whereas Bubble Sort may perform many more."
},
{
  question: "What is one major advantage of Selection Sort?",
  options: [
    "Guaranteed O(n log n) performance",
    "Simple implementation with minimal swaps",
    "Stable sorting by default",
    "Works faster than Quick Sort on large arrays"
  ],
  correctAnswer: 1,
  explanation: "Selection Sort is easy to implement and minimizes the number of swaps, making it useful in scenarios where writing to memory is costly."
}
  ];

  return <QuizEngine title="Selection Sort Quiz Challenge" questions={questions} />;
};

export default SelectionSortQuiz;
