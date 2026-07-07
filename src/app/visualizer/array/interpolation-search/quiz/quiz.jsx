"use client";

import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const interpolationSearchQuestions = [
  {
    question: "What is the primary requirement for Interpolation Search?",
    options: [
      "The array must be sorted",
      "The array must be circular",
      "The array must contain unique elements",
      "The array must be unsorted",
    ],
    answer: "The array must be sorted",
    explanation:
      "Interpolation Search only works correctly on sorted arrays.",
  },
  {
    question: "Interpolation Search performs best when the data is:",
    options: [
      "Randomly distributed",
      "Uniformly distributed",
      "Reverse sorted",
      "Duplicated",
    ],
    answer: "Uniformly distributed",
    explanation:
      "It estimates the target's position assuming values are uniformly distributed.",
  },
  {
    question: "Which searching algorithm estimates the target position using a formula?",
    options: [
      "Linear Search",
      "Binary Search",
      "Interpolation Search",
      "Jump Search",
    ],
    answer: "Interpolation Search",
    explanation:
      "Interpolation Search predicts the likely position before comparing.",
  },
  {
    question: "What is the average time complexity of Interpolation Search on uniformly distributed data?",
    options: [
      "O(n)",
      "O(log n)",
      "O(log log n)",
      "O(n log n)",
    ],
    answer: "O(log log n)",
    explanation:
      "Interpolation Search is faster than Binary Search for uniformly distributed data.",
  },
  {
    question: "What is the worst-case time complexity of Interpolation Search?",
    options: [
      "O(log n)",
      "O(log log n)",
      "O(n)",
      "O(1)",
    ],
    answer: "O(n)",
    explanation:
      "For non-uniformly distributed data, it may degrade to linear time.",
  },
  {
    question: "Which pointer represents the beginning of the search interval?",
    options: [
      "mid",
      "low",
      "high",
      "pos",
    ],
    answer: "low",
    explanation:
      "The 'low' pointer always marks the start of the search range.",
  },
  {
    question: "What does the variable 'pos' represent in Interpolation Search?",
    options: [
      "The middle element",
      "The predicted position of the target",
      "The last element",
      "The first element",
    ],
    answer: "The predicted position of the target",
    explanation:
      "The algorithm calculates an estimated position using interpolation.",
  },
  {
    question: "Which of these algorithms generally performs better than Binary Search on uniformly distributed data?",
    options: [
      "Linear Search",
      "Interpolation Search",
      "Bubble Sort",
      "Selection Sort",
    ],
    answer: "Interpolation Search",
    explanation:
      "Interpolation Search reduces the search space more efficiently for uniform data.",
  },
  {
    question: "What is the space complexity of Interpolation Search?",
    options: [
      "O(1)",
      "O(log n)",
      "O(n)",
      "O(n²)",
    ],
    answer: "O(1)",
    explanation:
      "Only a constant amount of extra memory is required.",
  },
  {
    question: "Interpolation Search is most suitable for:",
    options: [
      "Small unsorted arrays",
      "Large sorted uniformly distributed datasets",
      "Linked Lists",
      "Stacks",
    ],
    answer: "Large sorted uniformly distributed datasets",
    explanation:
      "Its prediction formula works best when values are evenly distributed.",
  },
  {
  question: "What happens if the target is smaller than the value at the estimated position?",
  options: [
    "Search continues in the right half",
    "The low pointer increases",
    "The high pointer decreases",
    "The search stops immediately",
  ],
  answer: "The high pointer decreases",
  explanation:
    "If the estimated value is greater than the target, the search continues in the left portion.",
},
{
  question: "Interpolation Search calculates the estimated position based on:",
  options: [
    "The middle index",
    "The Fibonacci sequence",
    "The values of the elements",
    "The square root of the array size",
  ],
  answer: "The values of the elements",
  explanation:
    "It estimates the target position using the values at the low and high indices.",
},
{
  question: "Which formula is used to estimate the next position in Interpolation Search?",
  options: [
    "mid = (low + high) / 2",
    "pos = low + ((target - arr[low]) × (high - low)) / (arr[high] - arr[low])",
    "jump = √n",
    "pos = high / 2",
  ],
  answer:
    "pos = low + ((target - arr[low]) × (high - low)) / (arr[high] - arr[low])",
  explanation:
    "Interpolation Search predicts the most probable position using this interpolation formula.",
},
{
  question: "Which searching algorithm always checks the middle element first?",
  options: [
    "Interpolation Search",
    "Jump Search",
    "Binary Search",
    "Linear Search",
  ],
  answer: "Binary Search",
  explanation:
    "Binary Search always begins by checking the middle element, unlike Interpolation Search.",
},
{
  question: "Interpolation Search is especially useful for:",
  options: [
    "Strings",
    "Uniformly distributed numeric data",
    "Linked Lists",
    "Graphs",
  ],
  answer: "Uniformly distributed numeric data",
  explanation:
    "It performs best when numeric values are evenly distributed.",
},
{
  question: "If all elements in the array are identical, Interpolation Search should:",
  options: [
    "Handle the case carefully to avoid division by zero",
    "Always return the first element",
    "Always fail",
    "Sort the array again",
  ],
  answer: "Handle the case carefully to avoid division by zero",
  explanation:
    "When arr[low] equals arr[high], the denominator becomes zero, so this case must be handled.",
},
{
  question: "Interpolation Search is an improvement over which algorithm for uniformly distributed data?",
  options: [
    "Linear Search",
    "Binary Search",
    "Bubble Sort",
    "Depth First Search",
  ],
  answer: "Binary Search",
  explanation:
    "Interpolation Search improves Binary Search by estimating a better search position.",
},
{
  question: "Which of the following is NOT required for Interpolation Search?",
  options: [
    "Sorted array",
    "Random access to elements",
    "Uniform distribution for best performance",
    "Linked List implementation",
  ],
  answer: "Linked List implementation",
  explanation:
    "Interpolation Search is designed for arrays with random access, not linked lists.",
},
{
  question: "When does Interpolation Search perform poorly?",
  options: [
    "When the array is uniformly distributed",
    "When the values are unevenly distributed",
    "When the array is sorted",
    "When the target is the first element",
  ],
  answer: "When the values are unevenly distributed",
  explanation:
    "Non-uniform data leads to inaccurate position estimates and poor performance.",
},
{
  question: "Which statement about Interpolation Search is correct?",
  options: [
    "It works on unsorted arrays",
    "It predicts the target position before comparison",
    "It always performs in O(log log n)",
    "It requires additional memory proportional to the array size",
  ],
  answer: "It predicts the target position before comparison",
  explanation:
    "Interpolation Search estimates the most likely position of the target before checking it.",
}
];

export default function InterpolationSearchQuiz() {
  return (
    <QuizEngine
      title="Interpolation Search Quiz"
      subtitle="Test your understanding of Interpolation Search."
      questions={interpolationSearchQuestions}
    />
  );
}