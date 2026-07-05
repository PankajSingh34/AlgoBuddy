"use client";

import QuizEngine from "@/app/components/ui/QuizEngine";

  const questions = [
  {
    question: "What is the primary idea behind Shell Sort?",
    options: [
      "Compare adjacent elements only",
      "Sort elements far apart before reducing the gap",
      "Always divide the array into two halves",
      "Build a binary heap"
    ],
    correctAnswer: 1,
    explanation: "Shell Sort improves Insertion Sort by first comparing elements that are far apart using a gap sequence."
  },
  {
    question: "Shell Sort is an improvement of which sorting algorithm?",
    options: [
      "Bubble Sort",
      "Merge Sort",
      "Insertion Sort",
      "Selection Sort"
    ],
    correctAnswer: 2,
    explanation: "Shell Sort improves the efficiency of Insertion Sort by allowing exchanges of distant elements."
  },
  {
    question: "Who invented Shell Sort?",
    options: [
      "Donald Knuth",
      "Robert Sedgewick",
      "Donald Shell",
      "Tony Hoare"
    ],
    correctAnswer: 2,
    explanation: "Shell Sort was introduced by Donald Shell in 1959."
  },
  {
    question: "What is the first gap in the original Shell gap sequence?",
    options: [
      "n/2",
      "n",
      "1",
      "2"
    ],
    correctAnswer: 0,
    explanation: "The original Shell sequence starts with gap = n/2 and halves it until it becomes 1."
  },
  {
    question: "The final gap used in Shell Sort is:",
    options: [
      "0",
      "1",
      "2",
      "n/4"
    ],
    correctAnswer: 1,
    explanation: "The algorithm always finishes with a gap of 1, making the final pass equivalent to Insertion Sort."
  },
  {
    question: "What is the best-case time complexity of Shell Sort?",
    options: [
      "O(n)",
      "O(n log n)",
      "O(n²)",
      "O(log n)"
    ],
    correctAnswer: 0,
    explanation: "The best-case complexity can approach O(n), depending on the gap sequence."
  },
  {
    question: "The worst-case time complexity of the original Shell Sort is approximately:",
    options: [
      "O(n²)",
      "O(n log n)",
      "O(log n)",
      "O(n)"
    ],
    correctAnswer: 0,
    explanation: "Using Shell's original gap sequence, the worst-case complexity is O(n²)."
  },
  {
    question: "Shell Sort performs particularly well on:",
    options: [
      "Already partially sorted arrays",
      "Linked Lists",
      "Graphs",
      "Trees"
    ],
    correctAnswer: 0,
    explanation: "Shell Sort performs efficiently when the array is partially sorted."
  },
  {
    question: "Shell Sort belongs to which category of sorting algorithms?",
    options: [
      "Comparison-based",
      "Non-comparison-based",
      "Hashing",
      "Searching"
    ],
    correctAnswer: 0,
    explanation: "Shell Sort compares elements to determine their order."
  },
  {
    question: "Is Shell Sort stable?",
    options: [
      "Yes",
      "No",
      "Only for integers",
      "Only for strings"
    ],
    correctAnswer: 1,
    explanation: "Shell Sort is generally not a stable sorting algorithm."
  },
  {
    question: "Is Shell Sort an in-place sorting algorithm?",
    options: [
      "Yes",
      "No",
      "Only for small arrays",
      "Depends on compiler"
    ],
    correctAnswer: 0,
    explanation: "Shell Sort sorts the array in place with O(1) extra space."
  },
  {
    question: "What is the space complexity of Shell Sort?",
    options: [
      "O(1)",
      "O(n)",
      "O(log n)",
      "O(n²)"
    ],
    correctAnswer: 0,
    explanation: "Shell Sort requires only constant extra memory."
  },
  {
    question: "Which sorting algorithm is executed during each gap pass?",
    options: [
      "Bubble Sort",
      "Selection Sort",
      "Insertion Sort",
      "Merge Sort"
    ],
    correctAnswer: 2,
    explanation: "Each gap pass is essentially a gapped version of Insertion Sort."
  },
  {
    question: "Why does Shell Sort perform fewer shifts than Insertion Sort?",
    options: [
      "It uses recursion",
      "It swaps only adjacent elements",
      "Large gaps move elements closer to their final positions",
      "It divides the array into halves"
    ],
    correctAnswer: 2,
    explanation: "Large gaps reduce the total number of shifts needed later."
  },
  {
    question: "Which gap sequence can improve Shell Sort performance?",
    options: [
      "Knuth Sequence",
      "Sedgewick Sequence",
      "Hibbard Sequence",
      "All of the above"
    ],
    correctAnswer: 3,
    explanation: "Several gap sequences have been proposed to improve Shell Sort's performance."
  },
  {
    question: "Shell Sort is most suitable when:",
    options: [
      "Memory is limited",
      "Stable sorting is required",
      "Data is stored in linked lists",
      "Sorting graphs"
    ],
    correctAnswer: 0,
    explanation: "Shell Sort is in-place and requires very little extra memory."
  },
  {
    question: "What happens if the initial gap is chosen poorly?",
    options: [
      "Sorting becomes impossible",
      "Performance may decrease",
      "The array becomes corrupted",
      "The algorithm becomes recursive"
    ],
    correctAnswer: 1,
    explanation: "Gap sequence selection significantly affects Shell Sort's efficiency."
  },
  {
    question: "Which statement about Shell Sort is TRUE?",
    options: [
      "It always runs in O(n log n)",
      "It is always stable",
      "Performance depends on the gap sequence",
      "It requires additional arrays"
    ],
    correctAnswer: 2,
    explanation: "The choice of gap sequence determines Shell Sort's performance."
  },
  {
    question: "Which algorithm generally performs better than Shell Sort on very large datasets?",
    options: [
      "Merge Sort",
      "Quick Sort",
      "Heap Sort",
      "All of the above"
    ],
    correctAnswer: 3,
    explanation: "Efficient O(n log n) algorithms usually outperform Shell Sort on very large datasets."
  },
  {
    question: "A major advantage of Shell Sort is:",
    options: [
      "Guaranteed O(n log n) complexity",
      "Simple implementation with improved performance over Insertion Sort",
      "Stable sorting",
      "Uses divide and conquer"
    ],
    correctAnswer: 1,
    explanation: "Shell Sort is simple, in-place, and considerably faster than plain Insertion Sort for many practical inputs."
  }
];

export default function Quiz() {
  return (
    <QuizEngine
      title="Shell Sort Quiz"
      questions={questions}
    />
  );
}