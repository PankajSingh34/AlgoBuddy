"use client";
import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const twoPointersQuestions = [
  {
    question: "What is the primary advantage of the Two Pointers technique over a brute-force nested loop?",
    options: [
      "It works on unsorted arrays without any preprocessing.",
      "It reduces time complexity from O(N²) to O(N).",
      "It reduces space complexity from O(N) to O(log N).",
      "It eliminates the need for any comparisons."
    ],
    correctAnswer: 1,
    explanation: "By moving two pointers strategically instead of checking all pairs, Two Pointers reduces time complexity from O(N²) to O(N)."
  },
  {
    question: "For the Pair Sum problem using Two Pointers, what is a prerequisite for the input array?",
    options: [
      "The array must contain only positive integers.",
      "The array must have an even number of elements.",
      "The array must be sorted.",
      "The array must not contain duplicates."
    ],
    correctAnswer: 2,
    explanation: "The opposite-direction Two Pointers approach for Pair Sum relies on the sorted order to decide whether to move the left pointer right (increase sum) or the right pointer left (decrease sum)."
  },
  {
    question: "In the Remove Duplicates problem using slow/fast pointers, what does the slow pointer represent?",
    options: [
      "The current element being compared.",
      "The boundary of the unique elements processed so far.",
      "The last duplicate found.",
      "The middle of the array."
    ],
    correctAnswer: 1,
    explanation: "The slow pointer marks the end of the valid (unique) region. It only advances when the fast pointer finds a new unique element."
  },
  {
    question: "In the Container With Most Water problem, if arr[left] < arr[right], which pointer should you move and why?",
    options: [
      "Move right left — to find a taller right boundary.",
      "Move left right — the left height is the bottleneck; moving it may find a taller boundary.",
      "Move both pointers inward simultaneously.",
      "Keep both pointers fixed and compute for all inner pairs."
    ],
    correctAnswer: 1,
    explanation: "The area is limited by the shorter height. Moving the taller pointer inward can only decrease width without increasing height, so we move the shorter (left) pointer to potentially find a taller one."
  },
  {
    question: "Why is the Two Pointers technique O(N) even though each step involves two pointer comparisons?",
    options: [
      "Because one pointer never moves.",
      "Because each pointer only moves forward and each element is visited at most once per pointer.",
      "Because the compiler merges the two loops.",
      "Because we break early when a match is found."
    ],
    correctAnswer: 1,
    explanation: "Each pointer traverses the array at most once in a single direction. Total steps = at most 2N, which simplifies to O(N)."
  },
  {
  question: "Which type of problems is the Two Pointers technique most commonly used for?",
  options: [
    "Graph traversal",
    "Problems involving sorted arrays or linked lists",
    "Tree balancing",
    "Dynamic programming only"
  ],
  correctAnswer: 1,
  explanation: "The Two Pointers technique is most effective for sorted arrays, linked lists, and problems requiring simultaneous traversal from two positions."
},
{
  question: "In the Pair Sum problem on a sorted array, what should you do if the current sum is smaller than the target?",
  options: [
    "Move the left pointer to the right",
    "Move the right pointer to the left",
    "Move both pointers inward",
    "Restart the search"
  ],
  correctAnswer: 0,
  explanation: "Moving the left pointer to the right increases the sum because the array is sorted in ascending order."
},
{
  question: "Which pointer usually moves faster in the Fast and Slow Pointer technique used for cycle detection?",
  options: [
    "Slow pointer",
    "Fast pointer",
    "Both move at the same speed",
    "Neither pointer moves"
  ],
  correctAnswer: 1,
  explanation: "The fast pointer typically moves two steps while the slow pointer moves one step, allowing cycle detection."
},
{
  question: "Which famous algorithm uses the Fast and Slow Pointer technique?",
  options: [
    "Dijkstra's Algorithm",
    "Floyd's Cycle Detection Algorithm",
    "Kruskal's Algorithm",
    "Prim's Algorithm"
  ],
  correctAnswer: 1,
  explanation: "Floyd's Cycle Detection Algorithm (Tortoise and Hare) uses fast and slow pointers to detect cycles efficiently."
},
{
  question: "What is the main idea behind the Two Pointers technique?",
  options: [
    "Use recursion to divide the problem",
    "Traverse the data structure simultaneously using two indices or pointers",
    "Sort the array after every iteration",
    "Use extra memory to store visited elements"
  ],
  correctAnswer: 1,
  explanation: "The Two Pointers technique solves problems efficiently by moving two pointers strategically through the data structure."
},
{
  question: "What is the time complexity of the Two Pointers technique for most array problems?",
  options: [
    "O(n²)",
    "O(log n)",
    "O(n)",
    "O(n log n)"
  ],
  correctAnswer: 2,
  explanation: "Since each pointer moves across the array at most once, the overall time complexity is O(n)."
},
{
  question: "Which pointer movement increases the current sum in a sorted array?",
  options: [
    "Move the left pointer to the right",
    "Move the right pointer to the left",
    "Move both pointers left",
    "Do not move any pointer"
  ],
  correctAnswer: 0,
  explanation: "Moving the left pointer to the right selects a larger value, increasing the current sum."
},
{
  question: "When searching for a target sum in a sorted array, what should you do if the current sum is greater than the target?",
  options: [
    "Move the left pointer right",
    "Move the right pointer left",
    "Move both pointers",
    "Restart the algorithm"
  ],
  correctAnswer: 1,
  explanation: "Moving the right pointer left decreases the current sum because the array is sorted."
},
{
  question: "Which type of linked list problem commonly uses fast and slow pointers?",
  options: [
    "Sorting",
    "Cycle Detection",
    "Tree Traversal",
    "Hashing"
  ],
  correctAnswer: 1,
  explanation: "Fast and slow pointers are widely used for detecting cycles in linked lists."
},
{
  question: "If the fast and slow pointers meet in a linked list, what can be concluded?",
  options: [
    "The list is sorted",
    "The list contains a cycle",
    "The list is empty",
    "The list has duplicate values"
  ],
  correctAnswer: 1,
  explanation: "If both pointers meet, Floyd's Cycle Detection Algorithm confirms the presence of a cycle."
},
{
  question: "Which problem commonly uses opposite-direction pointers?",
  options: [
    "Pair Sum in a Sorted Array",
    "Merge Sort",
    "Breadth First Search",
    "Topological Sort"
  ],
  correctAnswer: 0,
  explanation: "Pair Sum is a classic opposite-direction Two Pointers problem."
},
{
  question: "Which pointer technique is commonly used to find the middle node of a linked list?",
  options: [
    "Left and Right Pointers",
    "Fast and Slow Pointers",
    "Sliding Window",
    "Binary Search"
  ],
  correctAnswer: 1,
  explanation: "The slow pointer moves one step while the fast pointer moves two steps, allowing the slow pointer to reach the middle."
},
{
  question: "How many times is each element typically visited in the Two Pointers technique?",
  options: [
    "Once or twice",
    "Exactly n times",
    "log n times",
    "n² times"
  ],
  correctAnswer: 0,
  explanation: "Each element is generally visited at most once by each pointer."
},
{
  question: "Which of the following is NOT a common application of Two Pointers?",
  options: [
    "Removing duplicates",
    "Checking if a string is a palindrome",
    "Finding shortest paths in graphs",
    "Pair Sum"
  ],
  correctAnswer: 2,
  explanation: "Shortest path problems are solved using graph algorithms, not Two Pointers."
},
{
  question: "What is the biggest advantage of the Two Pointers technique?",
  options: [
    "Reduces unnecessary comparisons",
    "Sorts the data automatically",
    "Requires recursion",
    "Uses extra memory"
  ],
  correctAnswer: 0,
  explanation: "Two Pointers avoids checking every possible pair, greatly improving efficiency."
},
{
  question: "Which string problem commonly uses Two Pointers?",
  options: [
    "Palindrome Checking",
    "Merge Sort",
    "Heap Construction",
    "Counting Sort"
  ],
  correctAnswer: 0,
  explanation: "Palindrome checking compares characters from both ends using two pointers."
},
{
  question: "In palindrome checking, what happens if the characters at both pointers are equal?",
  options: [
    "Stop immediately",
    "Move both pointers toward the center",
    "Restart the algorithm",
    "Swap the characters"
  ],
  correctAnswer: 1,
  explanation: "Matching characters allow both pointers to move inward until they meet."
},
{
  question: "What happens when the left pointer crosses the right pointer during palindrome checking?",
  options: [
    "The string is confirmed to be a palindrome",
    "The string is reversed",
    "The algorithm fails",
    "The search restarts"
  ],
  correctAnswer: 0,
  explanation: "Crossing pointers indicates that all corresponding characters matched."
},
{
  question: "Which data structure is frequently used with Two Pointers?",
  options: [
    "Arrays",
    "Linked Lists",
    "Strings",
    "All of the above"
  ],
  correctAnswer: 3,
  explanation: "Two Pointers is commonly applied to arrays, linked lists, and strings."
},
{
  question: "Why does the Two Pointers technique often require sorted input?",
  options: [
    "To move pointers intelligently based on comparisons",
    "To reduce memory usage",
    "To allow recursion",
    "To eliminate duplicates automatically"
  ],
  correctAnswer: 0,
  explanation: "Sorted order enables efficient pointer movement toward the solution."
},
{
  question: "Which technique is commonly combined with Two Pointers for array partitioning?",
  options: [
    "Quick Sort Partition",
    "Breadth First Search",
    "Binary Search Tree",
    "Heapify"
  ],
  correctAnswer: 0,
  explanation: "Quick Sort's partition step uses a two-pointer approach."
},
{
  question: "What is the auxiliary space complexity of most Two Pointers algorithms?",
  options: [
    "O(1)",
    "O(log n)",
    "O(n)",
    "O(n²)"
  ],
  correctAnswer: 0,
  explanation: "Only a few pointer variables are needed, resulting in constant extra space."
},
{
  question: "Which scenario is ideal for applying Two Pointers?",
  options: [
    "Finding pairs in a sorted array",
    "Traversing graphs",
    "Building heaps",
    "Performing DFS"
  ],
  correctAnswer: 0,
  explanation: "Two Pointers excels at efficiently finding pairs and processing sorted arrays."
},
{
  question: "Which famous linked list problem is solved using fast and slow pointers?",
  options: [
    "Finding the middle node",
    "Sorting the list",
    "Merging lists",
    "Deleting duplicates"
  ],
  correctAnswer: 0,
  explanation: "The middle node can be found efficiently using fast and slow pointers."
},
{
  question: "Which statement about the Two Pointers technique is TRUE?",
  options: [
    "It always requires nested loops",
    "It is useful for optimizing problems involving sequential traversal",
    "It only works on graphs",
    "It always requires additional arrays"
  ],
  correctAnswer: 1,
  explanation: "Two Pointers optimizes sequential traversal problems by moving two indices strategically instead of using nested loops."
}
];

const Quiz = () => {
  return <QuizEngine title="Two Pointers Technique Quiz" questions={twoPointersQuestions} />;
};

export default Quiz;