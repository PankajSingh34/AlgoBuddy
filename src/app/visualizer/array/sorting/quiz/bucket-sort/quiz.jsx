"use client";

import QuizEngine from "@/app/components/ui/QuizEngine";

const questions = [
  {
    question: "What is the primary idea behind Bucket Sort?",
    options: [
      "Compare adjacent elements repeatedly",
      "Divide elements into buckets and sort each bucket",
      "Build a binary heap",
      "Partition the array into two halves"
    ],
    correctAnswer: 1,
    explanation:
      "Bucket Sort distributes elements into multiple buckets, sorts each bucket individually, and then combines them."
  },
  {
    question: "Bucket Sort works best when the input data is:",
    options: [
      "Randomly distributed",
      "Uniformly distributed",
      "Reverse sorted",
      "Nearly sorted"
    ],
    correctAnswer: 1,
    explanation:
      "Bucket Sort performs best when the input values are uniformly distributed across the range."
  },
  {
    question: "Bucket Sort belongs to which category of sorting algorithms?",
    options: [
      "Comparison-based",
      "Non-comparison-based",
      "Recursive",
      "Divide and Conquer"
    ],
    correctAnswer: 1,
    explanation:
      "Bucket Sort distributes elements into buckets rather than relying solely on comparisons."
  },
  {
    question: "Which algorithm is commonly used to sort individual buckets?",
    options: [
      "Insertion Sort",
      "Quick Sort",
      "Merge Sort",
      "Selection Sort"
    ],
    correctAnswer: 0,
    explanation:
      "Insertion Sort is commonly used because buckets are usually small."
  },
  {
    question: "What is the best-case time complexity of Bucket Sort?",
    options: [
      "O(n)",
      "O(n log n)",
      "O(n²)",
      "O(log n)"
    ],
    correctAnswer: 0,
    explanation:
      "With uniformly distributed data, Bucket Sort runs in linear time."
  },
  {
    question: "What is the average-case time complexity of Bucket Sort?",
    options: [
      "O(n)",
      "O(n²)",
      "O(log n)",
      "O(n³)"
    ],
    correctAnswer: 0,
    explanation:
      "The average-case complexity is O(n) when elements are evenly distributed."
  },
  {
    question: "What is the worst-case time complexity of Bucket Sort?",
    options: [
      "O(n)",
      "O(n log n)",
      "O(n²)",
      "O(log n)"
    ],
    correctAnswer: 2,
    explanation:
      "If all elements fall into one bucket, Bucket Sort degrades to O(n²)."
  },
  {
    question: "Bucket Sort is most suitable for:",
    options: [
      "Floating-point numbers",
      "Graphs",
      "Trees",
      "Linked Lists"
    ],
    correctAnswer: 0,
    explanation:
      "Bucket Sort is often used for floating-point numbers uniformly distributed over a range."
  },
  {
    question: "Which step comes first in Bucket Sort?",
    options: [
      "Merge buckets",
      "Create buckets",
      "Swap elements",
      "Find pivot"
    ],
    correctAnswer: 1,
    explanation:
      "The algorithm begins by creating buckets based on the input range."
  },
  {
    question: "After distributing elements into buckets, what is the next step?",
    options: [
      "Delete duplicates",
      "Sort each bucket",
      "Reverse the array",
      "Create new buckets"
    ],
    correctAnswer: 1,
    explanation:
      "Each bucket is sorted individually before combining."
  },
  {
    question: "Bucket Sort is generally:",
    options: [
      "Stable",
      "Unstable",
      "Recursive only",
      "Heap-based"
    ],
    correctAnswer: 0,
    explanation:
      "Bucket Sort can be stable if a stable sorting algorithm is used within each bucket."
  },
  {
    question: "What is the space complexity of Bucket Sort?",
    options: [
      "O(1)",
      "O(n + k)",
      "O(log n)",
      "O(n²)"
    ],
    correctAnswer: 1,
    explanation:
      "Additional space is needed for buckets and their contents."
  },
  {
    question: "What does 'k' represent in Bucket Sort?",
    options: [
      "Number of buckets",
      "Number of swaps",
      "Maximum element",
      "Minimum element"
    ],
    correctAnswer: 0,
    explanation:
      "k represents the number of buckets used."
  },
  {
    question: "Bucket Sort performs poorly when:",
    options: [
      "Data is uniformly distributed",
      "Most elements fall into a single bucket",
      "Array size is small",
      "Elements are unique"
    ],
    correctAnswer: 1,
    explanation:
      "Uneven distribution causes one bucket to become large, reducing efficiency."
  },
  {
    question: "Bucket Sort is commonly used for:",
    options: [
      "Sorting decimal values",
      "Sorting graphs",
      "Searching arrays",
      "Tree traversal"
    ],
    correctAnswer: 0,
    explanation:
      "Bucket Sort is particularly useful for floating-point and decimal values."
  },
  {
    question: "Bucket Sort first divides the input based on:",
    options: [
      "Value range",
      "Array index",
      "Binary representation",
      "Random order"
    ],
    correctAnswer: 0,
    explanation:
      "Elements are placed into buckets according to their value range."
  },
  {
    question: "Which of the following is NOT an advantage of Bucket Sort?",
    options: [
      "Fast for uniformly distributed data",
      "Simple implementation",
      "Always O(n)",
      "Can be stable"
    ],
    correctAnswer: 2,
    explanation:
      "Bucket Sort is not always O(n); its worst-case complexity is O(n²)."
  },
  {
    question: "Bucket Sort is especially efficient when:",
    options: [
      "Input values are evenly spread",
      "Input is reverse sorted",
      "Input contains duplicates only",
      "Input size is always 2"
    ],
    correctAnswer: 0,
    explanation:
      "Uniformly distributed input leads to balanced buckets and better performance."
  },
  {
    question: "After sorting all buckets, the final step is to:",
    options: [
      "Delete buckets",
      "Merge buckets into one sorted array",
      "Reverse each bucket",
      "Shuffle the buckets"
    ],
    correctAnswer: 1,
    explanation:
      "The sorted buckets are concatenated to form the final sorted array."
  },
  {
    question: "Which statement about Bucket Sort is TRUE?",
    options: [
      "It always uses recursion",
      "It distributes elements into buckets before sorting",
      "It always compares adjacent elements",
      "It cannot sort decimal numbers"
    ],
    correctAnswer: 1,
    explanation:
      "Bucket Sort works by distributing elements into buckets and sorting each bucket individually."
  }
];

export default function Quiz() {
  return (
    <QuizEngine
      title="Bucket Sort Quiz"
      questions={questions}
    />
  );
}