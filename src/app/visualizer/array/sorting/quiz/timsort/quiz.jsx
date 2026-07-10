"use client";

import QuizEngine from "@/app/components/ui/QuizEngine";

const questions = [
  {
    question: "What is Tim Sort?",
    options: [
      "A graph traversal algorithm",
      "A hybrid sorting algorithm",
      "A searching algorithm",
      "A hashing algorithm"
    ],
    correctAnswer: 1,
    explanation:
      "Tim Sort is a hybrid sorting algorithm derived from Merge Sort and Insertion Sort."
  },
  {
    question: "Tim Sort is primarily based on which two algorithms?",
    options: [
      "Quick Sort and Heap Sort",
      "Merge Sort and Insertion Sort",
      "Selection Sort and Bubble Sort",
      "Counting Sort and Radix Sort"
    ],
    correctAnswer: 1,
    explanation:
      "Tim Sort combines the strengths of Merge Sort and Insertion Sort."
  },
  {
    question: "Who developed Tim Sort?",
    options: [
      "Donald Knuth",
      "Tony Hoare",
      "Tim Peters",
      "Donald Shell"
    ],
    correctAnswer: 2,
    explanation:
      "Tim Sort was developed by Tim Peters in 2002 for Python."
  },
  {
    question: "Tim Sort is the default sorting algorithm in:",
    options: [
      "Python",
      "Java (Objects)",
      "Both Python and Java",
      "C"
    ],
    correctAnswer: 2,
    explanation:
      "Python uses Tim Sort for list sorting, and Java uses it for sorting object arrays."
  },
  {
    question: "Tim Sort performs especially well on:",
    options: [
      "Already partially sorted data",
      "Random graphs",
      "Binary trees",
      "Hash tables"
    ],
    correctAnswer: 0,
    explanation:
      "Tim Sort is optimized for real-world data that is often partially sorted."
  },
  {
    question: "What is a 'run' in Tim Sort?",
    options: [
      "A recursive function",
      "A naturally ordered subsequence",
      "A bucket",
      "A pivot"
    ],
    correctAnswer: 1,
    explanation:
      "A run is a consecutive sequence that is already sorted."
  },
  {
    question: "Which sorting algorithm is used for small runs?",
    options: [
      "Heap Sort",
      "Quick Sort",
      "Insertion Sort",
      "Selection Sort"
    ],
    correctAnswer: 2,
    explanation:
      "Insertion Sort efficiently sorts small runs."
  },
  {
    question: "How are sorted runs combined in Tim Sort?",
    options: [
      "Partitioning",
      "Heapify",
      "Merging",
      "Hashing"
    ],
    correctAnswer: 2,
    explanation:
      "Tim Sort merges sorted runs similarly to Merge Sort."
  },
  {
    question: "The best-case time complexity of Tim Sort is:",
    options: [
      "O(n)",
      "O(n²)",
      "O(log n)",
      "O(n log² n)"
    ],
    correctAnswer: 0,
    explanation:
      "Tim Sort achieves O(n) when the input is already nearly sorted."
  },
  {
    question: "The average-case time complexity of Tim Sort is:",
    options: [
      "O(n)",
      "O(n log n)",
      "O(n²)",
      "O(log n)"
    ],
    correctAnswer: 1,
    explanation:
      "The average running time is O(n log n)."
  },
  {
    question: "The worst-case time complexity of Tim Sort is:",
    options: [
      "O(n²)",
      "O(n log n)",
      "O(log n)",
      "O(n)"
    ],
    correctAnswer: 1,
    explanation:
      "Tim Sort guarantees O(n log n) worst-case performance."
  },
  {
    question: "Tim Sort is:",
    options: [
      "Stable",
      "Unstable",
      "Recursive only",
      "Non-comparison-based"
    ],
    correctAnswer: 0,
    explanation:
      "Tim Sort preserves the relative order of equal elements."
  },
  {
    question: "The space complexity of Tim Sort is approximately:",
    options: [
      "O(1)",
      "O(log n)",
      "O(n)",
      "O(n²)"
    ],
    correctAnswer: 2,
    explanation:
      "Tim Sort requires additional memory for merging runs."
  },
  {
    question: "Why is Tim Sort efficient on real-world datasets?",
    options: [
      "It ignores duplicates",
      "It detects naturally sorted runs",
      "It always uses Quick Sort",
      "It uses hashing"
    ],
    correctAnswer: 1,
    explanation:
      "Tim Sort takes advantage of existing order in the data."
  },
  {
    question: "Tim Sort belongs to which category?",
    options: [
      "Comparison-based sorting",
      "Hashing algorithm",
      "Graph algorithm",
      "Searching algorithm"
    ],
    correctAnswer: 0,
    explanation:
      "Tim Sort compares elements to determine their order."
  },
  {
    question: "Which feature makes Tim Sort adaptive?",
    options: [
      "Random pivot selection",
      "Detecting already sorted runs",
      "Using buckets",
      "Binary search only"
    ],
    correctAnswer: 1,
    explanation:
      "Tim Sort adapts to partially sorted input by identifying runs."
  },
  {
    question: "Which statement about Tim Sort is TRUE?",
    options: [
      "It is unstable",
      "It is adaptive",
      "It requires no extra memory",
      "It is slower than Bubble Sort"
    ],
    correctAnswer: 1,
    explanation:
      "Tim Sort is an adaptive sorting algorithm."
  },
  {
    question: "Tim Sort is commonly used because it:",
    options: [
      "Always runs in O(n)",
      "Performs well on practical datasets",
      "Uses no comparisons",
      "Requires no merging"
    ],
    correctAnswer: 1,
    explanation:
      "Tim Sort is designed for excellent practical performance."
  },
  {
    question: "Which data structure does Tim Sort primarily sort?",
    options: [
      "Graphs",
      "Arrays/Lists",
      "Trees",
      "Queues"
    ],
    correctAnswer: 1,
    explanation:
      "Tim Sort is designed for sorting arrays and lists."
  },
  {
    question: "A major advantage of Tim Sort is:",
    options: [
      "Guaranteed O(1) time",
      "Excellent performance on partially sorted data",
      "No extra memory required",
      "Works only on integers"
    ],
    correctAnswer: 1,
    explanation:
      "Tim Sort is highly efficient for partially sorted real-world datasets."
  }
];

export default function Quiz() {
  return (
    <QuizEngine
      title="Tim Sort Quiz"
      questions={questions}
    />
  );
}