"use client";
import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const BubbleSortQuiz = () => {
  const questions = [
    {
      question: "What is the basic principle of Bubble Sort?",
      options: [
        "Dividing the list into smaller sublists",
        "Repeatedly swapping adjacent elements if they are in the wrong order",
        "Selecting the smallest element and moving it to the front",
        "Merging two sorted lists into one",
      ],
      correctAnswer: 1,
      explanation:
        "Bubble Sort works by repeatedly stepping through the list, comparing adjacent elements and swapping them if they are in the wrong order.",
    },
    {
      question: "What is the time complexity of Bubble Sort in the worst case?",
      options: ["O(n)", "O(n log n)", "O(n²)", "O(1)"],
      correctAnswer: 2,
      explanation:
        "In the worst case (when the list is sorted in reverse order), Bubble Sort requires O(n²) comparisons and swaps.",
    },
    {
      question:
        "In the array [5, 1, 4, 2, 8], how many swaps occur during the first pass of Bubble Sort?",
      options: ["1", "2", "3", "4"],
      correctAnswer: 2,
      explanation:
        "First pass swaps (5,1), (5,4), and (5,2) - totaling 3 swaps. The pair (5,8) doesn't need swapping.",
    },
    {
      question: "When would Bubble Sort perform at its best?",
      options: [
        "When the array is in random order",
        "When the array is sorted in reverse order",
        "When the array is already sorted",
        "When the array contains duplicate values",
      ],
      correctAnswer: 2,
      explanation:
        "Bubble Sort performs best (O(n)) when the array is already sorted, as it only needs one pass through the array without any swaps.",
    },
    {
      question: "What is the space complexity of Bubble Sort?",
      options: ["O(n)", "O(n log n)", "O(n²)", "O(1)"],
      correctAnswer: 3,
      explanation:
        "Bubble Sort is an in-place algorithm that only requires O(1) additional space for temporary storage during swaps.",
    },
    {
      question:
        "How can you optimize Bubble Sort to stop early if the array becomes sorted?",
      options: [
        "By counting the number of swaps",
        "By using a flag to check if any swaps occurred in a pass",
        "By reducing the array size after each pass",
        "By sorting the array in both directions",
      ],
      correctAnswer: 1,
      explanation:
        "Using a flag to track if any swaps occurred during a pass allows the algorithm to terminate early if the array is already sorted.",
    },
    {
      question:
        "Why is Bubble Sort rarely used in practice for large datasets?",
      options: [
        "Because it's too complex to implement",
        "Because it's not a stable sorting algorithm",
        "Because of its O(n²) time complexity for average cases",
        "Because it requires O(n) additional space",
      ],
      correctAnswer: 2,
      explanation:
        "While simple to implement, Bubble Sort's O(n²) time complexity makes it inefficient for large datasets compared to algorithms like QuickSort or MergeSort.",
    },
    {
  question: "What is the basic principle of Bubble Sort?",
  options: [
    "Divide the array into halves",
    "Repeatedly compare and swap adjacent elements",
    "Select the smallest element each time",
    "Insert elements into their correct position"
  ],
  correctAnswer: 1,
  explanation: "Bubble Sort repeatedly compares adjacent elements and swaps them if they are in the wrong order until the array is sorted."
},
{
  question: "What is the worst-case time complexity of Bubble Sort?",
  options: [
    "O(log n)",
    "O(n)",
    "O(n log n)",
    "O(n²)"
  ],
  correctAnswer: 3,
  explanation: "Bubble Sort has a worst-case time complexity of O(n²) because it may need to compare every pair of adjacent elements multiple times."
},
{
  question: "When does Bubble Sort achieve its best-case time complexity?",
  options: [
    "When the array is reverse sorted",
    "When the array is already sorted (with optimization)",
    "When the array contains duplicate values",
    "When the array has only odd numbers"
  ],
  correctAnswer: 1,
  explanation: "With the optimized version of Bubble Sort, an already sorted array requires only one pass, giving a best-case complexity of O(n)."
},
{
  question: "After the first complete pass of Bubble Sort, where does the largest element move?",
  options: [
    "Beginning of the array",
    "Middle of the array",
    "End of the array",
    "It remains in the same position"
  ],
  correctAnswer: 2,
  explanation: "During the first pass, the largest element 'bubbles up' to the last position."
},
{
  question: "Is Bubble Sort a stable sorting algorithm?",
  options: [
    "Yes",
    "No",
    "Only for integers",
    "Only for sorted arrays"
  ],
  correctAnswer: 0,
  explanation: "Bubble Sort is stable because equal elements retain their relative order after sorting."
},
{
  question: "How many passes are required in the worst case to sort an array of n elements using Bubble Sort?",
  options: [
    "n",
    "n - 1",
    "log n",
    "n²"
  ],
  correctAnswer: 1,
  explanation: "Bubble Sort requires at most n - 1 passes to completely sort an array."
},
{
  question: "Which pair of elements does Bubble Sort compare during each step?",
  options: [
    "First and last elements",
    "Random elements",
    "Adjacent elements",
    "Smallest and largest elements"
  ],
  correctAnswer: 2,
  explanation: "Bubble Sort works by comparing adjacent elements and swapping them if they are in the wrong order."
},
{
  question: "What happens if no swaps occur during a complete pass in the optimized Bubble Sort?",
  options: [
    "The algorithm restarts",
    "The algorithm terminates",
    "The array is reversed",
    "Another pass is always performed"
  ],
  correctAnswer: 1,
  explanation: "If no swaps occur during a pass, the array is already sorted, so the algorithm stops."
},
{
  question: "Which type of sorting algorithm is Bubble Sort?",
  options: [
    "Divide and Conquer",
    "Comparison-based sorting",
    "Hashing algorithm",
    "Greedy algorithm"
  ],
  correctAnswer: 1,
  explanation: "Bubble Sort is a comparison-based sorting algorithm because it compares elements to determine their order."
},
{
  question: "Bubble Sort is mainly recommended for:",
  options: [
    "Very large datasets",
    "Small datasets and educational purposes",
    "Database indexing",
    "Real-time systems with huge data"
  ],
  correctAnswer: 1,
  explanation: "Bubble Sort is simple to understand and implement, making it suitable for small datasets and learning."
},
{
  question: "Which element reaches its correct position after every pass of Bubble Sort?",
  options: [
    "Smallest element",
    "Middle element",
    "Largest unsorted element",
    "Random element"
  ],
  correctAnswer: 2,
  explanation: "After each pass, the largest remaining unsorted element moves to its correct position at the end."
},
{
  question: "What is the average-case time complexity of Bubble Sort?",
  options: [
    "O(log n)",
    "O(n)",
    "O(n log n)",
    "O(n²)"
  ],
  correctAnswer: 3,
  explanation: "On average, Bubble Sort performs O(n²) comparisons and swaps."
},
{
  question: "Which sorting algorithm generally performs better than Bubble Sort on large datasets?",
  options: [
    "Merge Sort",
    "Quick Sort",
    "Heap Sort",
    "All of the above"
  ],
  correctAnswer: 3,
  explanation: "Merge Sort, Quick Sort, and Heap Sort all have significantly better average performance than Bubble Sort for large datasets."
},
{
  question: "Can Bubble Sort correctly sort an array containing duplicate elements?",
  options: [
    "Yes",
    "No",
    "Only if duplicates are adjacent",
    "Only after removing duplicates"
  ],
  correctAnswer: 0,
  explanation: "Bubble Sort correctly sorts arrays containing duplicate values while preserving their relative order."
},
{
  question: "Which of the following is a major advantage of Bubble Sort?",
  options: [
    "Fastest sorting algorithm",
    "Easy to understand and implement",
    "Requires recursive calls",
    "Works in O(log n) time"
  ],
  correctAnswer: 1,
  explanation: "Bubble Sort's biggest advantage is its simplicity, making it a popular algorithm for beginners."
}
  ];

  return <QuizEngine title="Bubble Sort Quiz Challenge" questions={questions} />;
};

export default BubbleSortQuiz;
