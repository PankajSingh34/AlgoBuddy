"use client";

import QuizEngine from "@/app/components/ui/QuizEngine";

const questions = [
  {
    question: "What is a Decision Tree primarily used for?",
    options: [
      "Sorting arrays",
      "Classification and Regression",
      "Graph traversal",
      "Memory allocation"
    ],
    correctAnswer: 1,
    explanation:
      "Decision Trees are supervised machine learning models used for both classification and regression tasks."
  },
  {
    question: "What does the root node of a Decision Tree represent?",
    options: [
      "A prediction",
      "The first feature or attribute used to split the data",
      "The final class label",
      "A leaf node"
    ],
    correctAnswer: 1,
    explanation:
      "The root node represents the feature that best splits the dataset according to the chosen criterion."
  },
  {
    question: "What do the leaf nodes of a Decision Tree represent?",
    options: [
      "Features",
      "Intermediate calculations",
      "Final prediction or class label",
      "Training samples"
    ],
    correctAnswer: 2,
    explanation:
      "Leaf nodes contain the final decision, prediction, or class label."
  },
  {
    question: "Which algorithm is commonly used to build Decision Trees?",
    options: [
      "Dijkstra's Algorithm",
      "ID3",
      "Binary Search",
      "Prim's Algorithm"
    ],
    correctAnswer: 1,
    explanation:
      "ID3 is one of the earliest and most widely known algorithms for constructing Decision Trees."
  },
  {
    question: "Which metric is commonly used to select the best feature in ID3?",
    options: [
      "Mean Squared Error",
      "Information Gain",
      "Euclidean Distance",
      "Cosine Similarity"
    ],
    correctAnswer: 1,
    explanation:
      "ID3 selects the attribute with the highest Information Gain."
  },
  {
    question: "Which metric is commonly used in the CART algorithm?",
    options: [
      "Entropy",
      "Gini Index",
      "Jaccard Index",
      "Pearson Correlation"
    ],
    correctAnswer: 1,
    explanation:
      "CART uses the Gini Index to measure the quality of splits."
  },
  {
    question: "What is overfitting in a Decision Tree?",
    options: [
      "The tree is too small to learn patterns.",
      "The tree memorizes training data and performs poorly on new data.",
      "The tree has too few features.",
      "The tree cannot classify data."
    ],
    correctAnswer: 1,
    explanation:
      "Overfitting occurs when the tree becomes overly complex and fails to generalize to unseen data."
  },
  {
    question: "Which technique helps reduce overfitting in Decision Trees?",
    options: [
      "Heapify",
      "Pruning",
      "Hashing",
      "Serialization"
    ],
    correctAnswer: 1,
    explanation:
      "Pruning removes unnecessary branches, improving generalization."
  },
  {
    question: "Decision Trees are an example of which type of Machine Learning?",
    options: [
      "Unsupervised Learning",
      "Reinforcement Learning",
      "Supervised Learning",
      "Deep Learning"
    ],
    correctAnswer: 2,
    explanation:
      "Decision Trees are supervised learning algorithms trained using labeled data."
  },
  {
    question: "Decision Trees are commonly used in:",
    options: [
      "Medical Diagnosis",
      "Fraud Detection",
      "Customer Classification",
      "All of the above"
    ],
    correctAnswer: 3,
    explanation:
      "Decision Trees are widely used across domains such as healthcare, finance, and customer analytics."
  }
];

export default function Quiz() {
  return (
    <QuizEngine
      title="Decision Trees Quiz"
      questions={questions}
    />
  );
}