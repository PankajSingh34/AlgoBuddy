"use client";
import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const SegmentTreeQuiz = () => {
  const questions = [
    {
      question: "What is the primary purpose of a Segment Tree?",
      options: [
        "To compress data for efficient network transmission",
        "To efficiently answer range queries and perform point/range updates over an array",
        "To sort elements in O(N log N) time",
        "To store hierarchical relationship data similar to a database"
      ],
      correctAnswer: 1,
      explanation: "Segment Trees are primarily used for answering range queries (like sum, min, max in a specific interval) and updating elements or ranges efficiently."
    },
    {
      question: "In a Segment Tree representing an array of size N, what does the root node represent?",
      options: [
        "The first element of the array",
        "The largest element in the array",
        "The entire range of the array [0, N-1]",
        "The middle element of the array"
      ],
      correctAnswer: 2,
      explanation: "The root node of a Segment Tree stores the aggregated value (like sum or minimum) for the entire array range from index 0 to N-1."
    },
    {
      question: "How are the children of a node representing the range [L, R] determined in a Segment Tree?",
      options: [
        "The left child is [L, R-1] and the right child is [L+1, R]",
        "The left child is [L, mid] and the right child is [mid+1, R], where mid = (L+R)/2",
        "The children are randomly assigned based on hash values",
        "The tree only has right children"
      ],
      correctAnswer: 1,
      explanation: "A segment tree is a binary tree where a node representing [L, R] is split at the midpoint. Its left child represents [L, mid] and its right child represents [mid+1, R]."
    },
    {
      question: "What is the height of a Segment Tree for an array of size N?",
      options: [
        "O(N)",
        "O(N log N)",
        "O(log N)",
        "O(1)"
      ],
      correctAnswer: 2,
      explanation: "Because the range is halved at each step down the tree, the height of a segment tree is bounded by O(log N)."
    },
    {
      question: "What is the time complexity to build a Segment Tree from an array of size N?",
      options: [
        "O(log N)",
        "O(N)",
        "O(N log N)",
        "O(N²)"
      ],
      correctAnswer: 1,
      explanation: "Building the segment tree involves visiting each node exactly once to compute its value from its children, which takes O(N) time."
    },
    {
      question: "What is the standard maximum size needed for the array to store a Segment Tree of an original array of size N?",
      options: [
        "N",
        "2 * N",
        "4 * N",
        "N log N"
      ],
      correctAnswer: 2,
      explanation: "To safely accommodate a segment tree in an array without out-of-bounds errors, the standard practice is to allocate an array of size 4 * N."
    },
    {
      question: "What is the time complexity of querying the sum (or minimum) of a range [L, R] in a Segment Tree?",
      options: [
        "O(1)",
        "O(log N)",
        "O(N)",
        "O(N log N)"
      ],
      correctAnswer: 1,
      explanation: "A range query visits at most 4 nodes per level of the tree. Since the height is O(log N), the query time complexity is O(log N)."
    },
    {
      question: "What is the time complexity of updating a single element (Point Update) in a Segment Tree?",
      options: [
        "O(1)",
        "O(log N)",
        "O(N)",
        "O(N log N)"
      ],
      correctAnswer: 1,
      explanation: "A point update traces a path from the root to a single leaf node and updates the values back up to the root. Since the height is O(log N), the update takes O(log N) time."
    },
    {
      question: "When performing a Range Query for [L, R], in what scenario does a node representing range [start, end] completely contribute its value without recursive calls to its children?",
      options: [
        "When start == end",
        "When the node's range [start, end] is completely inside the query range [L, R] (i.e., L <= start and end <= R)",
        "When the node's range partially overlaps the query range",
        "When the node's range is completely outside the query range"
      ],
      correctAnswer: 1,
      explanation: "If the node's entire range is completely covered by the query range, we can just return the node's stored value immediately, which is the key to achieving O(log N) query time."
    },
    {
      question: "What should a node return if its range [start, end] is completely outside the query range [L, R] in a Range Sum Query?",
      options: [
        "The maximum integer value",
        "The minimum integer value",
        "0 (zero)",
        "-1"
      ],
      correctAnswer: 2,
      explanation: "For a sum query, a range outside the query should return an identity value for addition, which is 0, so it doesn't affect the total sum."
    },
    {
      question: "What should a node return if its range [start, end] is completely outside the query range [L, R] in a Range Minimum Query?",
      options: [
        "The maximum integer value (Infinity)",
        "The minimum integer value (-Infinity)",
        "0 (zero)",
        "-1"
      ],
      correctAnswer: 0,
      explanation: "For a minimum query, an out-of-bounds range should return Infinity (or max integer) so that the `min()` function ignores it."
    },
    {
      question: "What technique is used in Segment Trees to perform efficient Range Updates (updating an entire interval [L, R] at once)?",
      options: [
        "Memoization",
        "Lazy Propagation",
        "Dynamic Programming",
        "Hashing"
      ],
      correctAnswer: 1,
      explanation: "Lazy Propagation is used to postpone updates to descendants of a node until those descendants are explicitly accessed, keeping range updates at O(log N)."
    },
    {
      question: "How does Lazy Propagation achieve O(log N) for Range Updates?",
      options: [
        "By only updating the root node and ignoring the rest",
        "By updating nodes only when their range is completely within the update interval, and marking them to update their children later",
        "By using multiple threads to update the array in parallel",
        "By changing the data structure to a Hash Map"
      ],
      correctAnswer: 1,
      explanation: "When an update completely covers a node's range, we update the node and record the pending update for its children in a 'lazy' array, stopping the recursion."
    },
    {
      question: "Which of the following is a common disadvantage of a Segment Tree compared to a Fenwick Tree (Binary Indexed Tree)?",
      options: [
        "Segment trees cannot handle range minimum queries",
        "Segment trees are significantly slower theoretically",
        "Segment trees require more memory (space) and have higher constant factor overhead",
        "Segment trees only support point updates, not range queries"
      ],
      correctAnswer: 2,
      explanation: "Segment Trees use more space (typically 4*N vs N for Fenwick Trees) and generally have a larger constant time factor due to recursive calls."
    },
    {
      question: "Which of the following problems can be efficiently solved using a Segment Tree but NOT easily with a standard Fenwick Tree (Binary Indexed Tree)?",
      options: [
        "Range Sum Query with Point Updates",
        "Range Minimum Query with Point Updates",
        "Counting inversions in an array",
        "Prefix Sum Queries"
      ],
      correctAnswer: 1,
      explanation: "While a standard Fenwick Tree is great for cumulative/reversible operations (like sum or XOR), it cannot easily handle non-reversible operations like Minimum or Maximum for arbitrary ranges."
    },
    {
      question: "If the index of a parent node in a 1-indexed array representation of a Segment Tree is `i`, what are the indices of its left and right children?",
      options: [
        "Left: i+1, Right: i+2",
        "Left: 2*i, Right: 2*i + 1",
        "Left: 2*i + 1, Right: 2*i + 2",
        "Left: i-1, Right: i+1"
      ],
      correctAnswer: 1,
      explanation: "In a 1-indexed array representing a binary tree, the left child is located at `2*i` and the right child at `2*i + 1`."
    },
    {
      question: "What is the time complexity of a Range Update WITH Lazy Propagation?",
      options: [
        "O(1)",
        "O(log N)",
        "O(N)",
        "O(N log N)"
      ],
      correctAnswer: 1,
      explanation: "With Lazy Propagation, we do not update individual elements one by one; we update covering segments in O(log N) time, just like a range query."
    },
    {
      question: "Without Lazy Propagation, what would be the worst-case time complexity of a Range Update?",
      options: [
        "O(1)",
        "O(log N)",
        "O(N)",
        "O(N²)"
      ],
      correctAnswer: 2,
      explanation: "Without lazy propagation, a range update would require updating every individual leaf node within the range, taking O(N) time in the worst case (if the range is [0, N-1])."
    }
  ];

  return <QuizEngine title="Segment Tree Quiz" questions={questions} />;
};

export default SegmentTreeQuiz;
