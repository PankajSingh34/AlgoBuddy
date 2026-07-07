"use client";
import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const MergeSortQuiz = () => {
  const questions = [
    {
      question: "What is the fundamental principle behind Merge Sort?",
      options: [
        "Repeatedly swapping adjacent elements if they are in the wrong order",
        "Dividing the array into smaller subarrays and merging them back in sorted order",
        "Selecting the smallest element and moving it to the front",
        "Building the sorted array one element at a time by insertion"
      ],
      correctAnswer: 1,
      explanation: "Merge Sort follows the divide-and-conquer approach by recursively dividing the array into halves until single elements remain, then merging them back in sorted order."
    },
    {
      question: "What is the time complexity of Merge Sort in all cases (best, average, worst)?",
      options: [
        "O(n)",
        "O(n log n)",
        "O(n²)",
        "O(log n)"
      ],
      correctAnswer: 1,
      explanation: "Merge Sort has consistent O(n log n) performance in all cases because it always divides the array in half and performs linear-time merges regardless of input order."
    },
    {
      question: "In the array [38, 27, 43, 3, 9, 82, 10], how many times is the array divided before reaching single elements?",
      options: [
        "2 times",
        "3 times",
        "4 times",
        "5 times"
      ],
      correctAnswer: 1,
      explanation: "The array is divided 3 times: 1) [38,27,43] and [3,9,82,10], 2) [38], [27,43], [3,9], [82,10], 3) All subarrays are single elements."
    },
    {
      question: "What is the space complexity of Merge Sort?",
      options: [
        "O(1)",
        "O(log n)",
        "O(n)",
        "O(n²)"
      ],
      correctAnswer: 2,
      explanation: "Merge Sort requires O(n) additional space for temporary arrays during the merging phase, making it not an in-place sorting algorithm."
    },
    {
      question: "Which of these is NOT an advantage of Merge Sort?",
      options: [
        "Stable sorting (maintains relative order of equal elements)",
        "Excellent for large datasets",
        "Requires minimal additional memory (O(1) space)",
        "Well-suited for external sorting"
      ],
      correctAnswer: 2,
      explanation: "Merge Sort requires O(n) additional space, not O(1). Its advantages include stability, consistent O(n log n) performance, and suitability for external sorting."
    },
    {
      question: "Why is Merge Sort particularly good for sorting linked lists?",
      options: [
        "Because it doesn't require random access to elements",
        "Because it's the fastest sorting algorithm for all cases",
        "Because it can sort in O(1) space with linked lists",
        "Because it doesn't require comparisons"
      ],
      correctAnswer: 0,
      explanation: "Merge Sort works well with linked lists because it primarily requires sequential access (not random access) during the merge phase, and it can be implemented with O(1) space for linked lists."
    },
    {
      question: "What makes Merge Sort suitable for external sorting (sorting data too large for RAM)?",
      options: [
        "Its ability to sort with minimal comparisons",
        "Its divide-and-conquer approach that works well with sequential access",
        "Its in-place sorting capability",
        "Its O(n) best-case time complexity"
      ],
      correctAnswer: 1,
      explanation: "Merge Sort's divide-and-conquer approach works well with sequential access patterns needed for external storage, and it can efficiently merge sorted runs from disk."
    },
    {
  question: "What is the main strategy used by Merge Sort?",
  options: [
    "Greedy",
    "Divide and Conquer",
    "Dynamic Programming",
    "Backtracking"
  ],
  correctAnswer: 1,
  explanation: "Merge Sort follows the Divide and Conquer strategy by recursively splitting the array and then merging the sorted halves."
},
{
  question: "What is the worst-case time complexity of Merge Sort?",
  options: [
    "O(n²)",
    "O(n log n)",
    "O(log n)",
    "O(n)"
  ],
  correctAnswer: 1,
  explanation: "Merge Sort performs O(n log n) operations in the best, average, and worst cases."
},
{
  question: "What is the extra space complexity of Merge Sort?",
  options: [
    "O(1)",
    "O(log n)",
    "O(n)",
    "O(n²)"
  ],
  correctAnswer: 2,
  explanation: "Merge Sort requires an auxiliary array during merging, resulting in O(n) extra space."
},
{
  question: "Is Merge Sort a stable sorting algorithm?",
  options: [
    "Yes",
    "No",
    "Only for integers",
    "Only for linked lists"
  ],
  correctAnswer: 0,
  explanation: "Merge Sort is stable because equal elements preserve their relative order after sorting."
},
{
  question: "Which type of dataset is Merge Sort especially suitable for?",
  options: [
    "Very small arrays",
    "Large datasets requiring stable sorting",
    "Already sorted arrays only",
    "Hash tables"
  ],
  correctAnswer: 1,
  explanation: "Merge Sort is efficient for large datasets and guarantees O(n log n) performance with stable sorting."
},
{
  question: "What happens after Merge Sort divides the array into single-element subarrays?",
  options: [
    "The algorithm stops",
    "The subarrays are merged back in sorted order",
    "The array is reversed",
    "The elements are randomly shuffled"
  ],
  correctAnswer: 1,
  explanation: "After dividing the array into single-element subarrays, Merge Sort merges them back together while maintaining sorted order."
},
{
  question: "Merge Sort is classified as which type of sorting algorithm?",
  options: [
    "Comparison-based sorting",
    "Counting-based sorting",
    "Hashing algorithm",
    "Greedy algorithm"
  ],
  correctAnswer: 0,
  explanation: "Merge Sort compares elements while merging, making it a comparison-based sorting algorithm."
},
{
  question: "How many recursive calls are generally made before reaching the base case in Merge Sort?",
  options: [
    "O(1)",
    "O(log n)",
    "O(n)",
    "O(n²)"
  ],
  correctAnswer: 1,
  explanation: "The array is repeatedly divided into halves, resulting in a recursion depth of O(log n)."
},
{
  question: "What is the base case of the Merge Sort algorithm?",
  options: [
    "When the array has one or zero elements",
    "When the array is completely sorted",
    "When two elements remain",
    "When the array size is even"
  ],
  correctAnswer: 0,
  explanation: "A single-element (or empty) array is already sorted, making it the base case."
},
{
  question: "Which operation takes linear time in Merge Sort?",
  options: [
    "Dividing the array",
    "Finding the middle element",
    "Merging two sorted subarrays",
    "Recursive calls"
  ],
  correctAnswer: 2,
  explanation: "Merging two sorted subarrays requires comparing and copying all elements, taking O(n) time."
},
{
  question: "Why is Merge Sort considered a stable sorting algorithm?",
  options: [
    "It uses recursion",
    "It preserves the relative order of equal elements",
    "It sorts in-place",
    "It performs fewer comparisons"
  ],
  correctAnswer: 1,
  explanation: "Merge Sort keeps equal elements in the same relative order as they appeared in the input."
},
{
  question: "Which data structure is commonly used as temporary storage during Merge Sort?",
  options: [
    "Stack",
    "Queue",
    "Auxiliary array",
    "Linked list"
  ],
  correctAnswer: 2,
  explanation: "Merge Sort uses an auxiliary array to temporarily store merged elements before copying them back."
},
{
  question: "Which of the following is a disadvantage of Merge Sort?",
  options: [
    "Poor worst-case performance",
    "Requires additional memory",
    "Cannot sort duplicate elements",
    "Not suitable for recursion"
  ],
  correctAnswer: 1,
  explanation: "Merge Sort requires O(n) extra memory, making it less memory-efficient than some in-place sorting algorithms."
},
{
  question: "Which sorting algorithm always guarantees O(n log n) time complexity?",
  options: [
    "Bubble Sort",
    "Insertion Sort",
    "Selection Sort",
    "Merge Sort"
  ],
  correctAnswer: 3,
  explanation: "Merge Sort consistently performs in O(n log n) time regardless of the input order."
},
{
  question: "Which scenario is ideal for using Merge Sort?",
  options: [
    "Large datasets requiring stable sorting",
    "Very small arrays only",
    "Arrays with one element",
    "Hash table lookups"
  ],
  correctAnswer: 0,
  explanation: "Merge Sort is an excellent choice for large datasets where stable sorting and predictable O(n log n) performance are important."
}
  ];

  return <QuizEngine title="Merge Sort Quiz Challenge" questions={questions} />;
};

export default MergeSortQuiz;
