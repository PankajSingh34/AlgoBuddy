"use client";
import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const BucketSortQuiz = () => {
  const questions = [
    {
      question: "What is the primary principle of Bucket Sort?",
      options: [
        "Comparing and swapping adjacent elements",
        "Distributing elements into a number of buckets",
        "Selecting a pivot and partitioning",
        "Building a max-heap from the elements"
      ],
      correctAnswer: 1,
      explanation: "Bucket Sort works by distributing the elements of an array into a number of buckets. Each bucket is then sorted individually, and finally, the sorted buckets are concatenated."
    },
    {
      question: "What is the average-case time complexity of Bucket Sort?",
      options: [
        "O(n^2)",
        "O(n log n)",
        "O(n + k)",
        "O(k log k)"
      ],
      correctAnswer: 2,
      explanation: "The average-case time complexity is O(n + k), where 'n' is the number of elements and 'k' is the number of buckets, assuming elements are uniformly distributed."
    },
    {
      question: "When does Bucket Sort have a worst-case time complexity of O(n²)?",
      options: [
        "When the input array is already sorted",
        "When all elements are placed into a single bucket",
        "When the number of buckets is equal to the number of elements",
        "When the input array is sorted in reverse"
      ],
      correctAnswer: 1,
      explanation: "The worst-case scenario occurs when all elements fall into one bucket. If that bucket is then sorted with an O(n²) algorithm like Insertion Sort, the total complexity becomes O(n²)."
    },
    {
      question: "What is the space complexity of Bucket Sort?",
      options: [
        "O(1)",
        "O(log n)",
        "O(n + k)",
        "O(n^2)"
      ],
      correctAnswer: 2,
      explanation: "Bucket Sort requires O(n + k) auxiliary space, where 'n' is for the elements and 'k' is for the buckets themselves."
    },
    {
      question: "Which sorting algorithm is commonly used to sort the individual buckets in Bucket Sort?",
      options: [
        "Merge Sort",
        "Quick Sort",
        "Insertion Sort",
        "Heap Sort"
      ],
      correctAnswer: 2,
      explanation: "Insertion Sort is often used for sorting the buckets because it is very efficient for small or nearly sorted lists, which buckets are expected to be."
    },
    {
      question: "Bucket Sort is most effective under which condition?",
      options: [
        "The input data is sorted in reverse order",
        "The input data contains many duplicate values",
        "The input data is uniformly distributed across a range",
        "The input data has a very small range of values"
      ],
      correctAnswer: 2,
      explanation: "Bucket Sort's efficiency heavily relies on the input elements being uniformly distributed, which ensures that elements are spread evenly across the buckets."
    },
    {
      question: "Is Bucket Sort a stable sorting algorithm?",
      options: [
        "Yes, always",
        "No, never",
        "It depends on the sorting algorithm used for the buckets",
        "Only for negative numbers"
      ],
      correctAnswer: 2,
      explanation: "The stability of Bucket Sort depends on the stability of the algorithm used to sort each bucket. If a stable sort like Insertion Sort is used, Bucket Sort will also be stable."
    },
    {
      question: "What is the first step in the Bucket Sort algorithm?",
      options: [
        "Sort each bucket individually",
        "Create a set of empty buckets",
        "Concatenate the sorted buckets",
        "Find the maximum value in the array"
      ],
      correctAnswer: 1,
      explanation: "The first step is to initialize 'k' empty buckets, which will be used to distribute the elements from the input array."
    },
    {
      question: "Bucket Sort is an example of what type of sorting algorithm?",
      options: [
        "Comparison-based sort",
        "In-place sort",
        "Distribution sort",
        "Exchange sort"
      ],
      correctAnswer: 2,
      explanation: "Bucket Sort is a distribution sort because it distributes elements into buckets based on their values."
    },
    {
      question: "How are elements typically placed into buckets?",
      options: [
        "Randomly",
        "Based on a hash function or a formula mapping values to bucket indices",
        "Alternating between buckets",
        "Always in the first bucket"
      ],
      correctAnswer: 1,
      explanation: "A mapping function is used to calculate the appropriate bucket index for each element, often based on its value relative to the overall range of values."
    }
  ];

  return <QuizEngine title="Bucket Sort Quiz Challenge" questions={questions} />;
};

export default BucketSortQuiz;
