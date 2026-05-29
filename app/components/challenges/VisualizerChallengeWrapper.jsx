"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TOPIC_LABELS = {
  arrays: "Arrays",
  linked_lists: "Linked Lists",
  stack_queue: "Stack & Queue",
  trees: "Trees",
  graphs: "Graphs",
  recursion: "Recursion",
  dynamic_programming: "Dynamic Programming",
  searching_sorting: "Searching & Sorting",
};

// 10 distinct questions per topic, exactly 4 options each
const QUESTIONS_BANK = {
  arrays: [
    {
      prompt: "Find the element at index 3 in the array [12, 5, 8, 19, 3, 7].",
      array: [12, 5, 8, 19, 3, 7],
      highlights: [3],
      options: [
        { id: "opt1", label: "Value 19 (Index 3)" },
        { id: "opt2", label: "Value 8 (Index 2)" },
        { id: "opt3", label: "Value 3 (Index 4)" },
        { id: "opt4", label: "Value 7 (Index 5)" }
      ],
      correctOptionId: "opt1",
      explanation: "Arrays are 0-indexed. Index 0 is 12, index 1 is 5, index 2 is 8, and index 3 is 19."
    },
    {
      prompt: "Sum of Subarray: Calculate the sum of elements from index 1 to index 3 in [4, 2, 7, 1, 9].",
      array: [4, 2, 7, 1, 9],
      highlights: [1, 2, 3],
      options: [
        { id: "opt1", label: "10 (2 + 7 + 1)" },
        { id: "opt2", label: "13 (4 + 2 + 7)" },
        { id: "opt3", label: "8 (7 + 1)" },
        { id: "opt4", label: "19 (2 + 7 + 1 + 9)" }
      ],
      correctOptionId: "opt1",
      explanation: "Summing indices 1, 2, and 3 yields: 2 + 7 + 1 = 10."
    },
    {
      prompt: "Identify the index of the maximum element in the array [8, 14, 23, 6, 12, 18].",
      array: [8, 14, 23, 6, 12, 18],
      highlights: [2],
      options: [
        { id: "opt1", label: "Index 2 (Value 23)" },
        { id: "opt2", label: "Index 3 (Value 6)" },
        { id: "opt3", label: "Index 5 (Value 18)" },
        { id: "opt4", label: "Index 0 (Value 8)" }
      ],
      correctOptionId: "opt1",
      explanation: "23 is the maximum element, located at index 2."
    },
    {
      prompt: "Two Pointer: Left starts at index 0 (val 2), Right at index 4 (val 8). If target sum is 10, should we move Left right or Right left?",
      array: [2, 3, 5, 7, 8],
      highlights: [0, 4],
      options: [
        { id: "opt1", label: "No movement, target found! (2 + 8 = 10)" },
        { id: "opt2", label: "Move Left pointer to index 1" },
        { id: "opt3", label: "Move Right pointer to index 3" },
        { id: "opt4", label: "Move both pointers inwards" }
      ],
      correctOptionId: "opt1",
      explanation: "The elements at index 0 (2) and index 4 (8) sum exactly to 10, meaning we have already found the target."
    },
    {
      prompt: "Prefix Sum Array: For array [3, 1, 4, 2], what is the prefix sum value at index 2?",
      array: [3, 1, 4, 2],
      highlights: [0, 1, 2],
      options: [
        { id: "opt1", label: "8 (3 + 1 + 4)" },
        { id: "opt2", label: "4 (3 + 1)" },
        { id: "opt3", label: "10 (3 + 1 + 4 + 2)" },
        { id: "opt4", label: "6 (3 + 1 + 2)" }
      ],
      correctOptionId: "opt1",
      explanation: "The prefix sum at index 2 is the sum of elements from index 0 to 2: 3 + 1 + 4 = 8."
    },
    {
      prompt: "Equilibrium Index: Which index splits [1, 2, 3, 3] into two equal sum parts?",
      array: [1, 2, 3, 3],
      highlights: [2],
      options: [
        { id: "opt1", label: "Index 2 (Split at 3: 1+2 = 3 on left, 3 on right)" },
        { id: "opt2", label: "Index 1" },
        { id: "opt3", label: "No equilibrium index exists" },
        { id: "opt4", label: "Index 3" }
      ],
      correctOptionId: "opt1",
      explanation: "At index 2 (value 3), the sum of elements before it (1 + 2 = 3) equals the sum of elements after it (3)."
    },
    {
      prompt: "Sliding Window: Window size is 3. What is the maximum sum window in [2, 1, 5, 1, 3, 2]?",
      array: [2, 1, 5, 1, 3, 2],
      highlights: [1, 2, 3],
      options: [
        { id: "opt1", label: "7 (1 + 5 + 1)" },
        { id: "opt2", label: "9 (5 + 1 + 3)" },
        { id: "opt3", label: "8 (2 + 1 + 5)" },
        { id: "opt4", label: "6 (2 + 1 + 3)" }
      ],
      correctOptionId: "opt2",
      explanation: "The window [5, 1, 3] from index 2 to 4 gives the highest sum: 5 + 1 + 3 = 9."
    },
    {
      prompt: "Find Duplicates: At what index do we find the first duplicate element in [5, 8, 2, 8, 9]?",
      array: [5, 8, 2, 8, 9],
      highlights: [1, 3],
      options: [
        { id: "opt1", label: "Index 3 (Value 8)" },
        { id: "opt2", label: "Index 1 (Value 8)" },
        { id: "opt3", label: "Index 2 (Value 2)" },
        { id: "opt4", label: "Index 4 (Value 9)" }
      ],
      correctOptionId: "opt1",
      explanation: "The element at index 3 (8) is the first element we encounter that has already appeared (at index 1)."
    },
    {
      prompt: "Rotate Array: If we rotate [1, 2, 3, 4, 5] to the right by 2 steps, what is the new array?",
      array: [1, 2, 3, 4, 5],
      highlights: [3, 4],
      options: [
        { id: "opt1", label: "[4, 5, 1, 2, 3]" },
        { id: "opt2", label: "[3, 4, 5, 1, 2]" },
        { id: "opt3", label: "[1, 2, 3, 4, 5]" },
        { id: "opt4", label: "[5, 1, 2, 3, 4]" }
      ],
      correctOptionId: "opt1",
      explanation: "Rotating right by 2 shifts the last two elements [4, 5] to the front, producing [4, 5, 1, 2, 3]."
    },
    {
      prompt: "Find Missing Number: The array [1, 2, 4, 5, 6] is missing one number from the range 1 to 6. What is it?",
      array: [1, 2, 4, 5, 6],
      highlights: [2],
      options: [
        { id: "opt1", label: "3" },
        { id: "opt2", label: "4" },
        { id: "opt3", label: "5" },
        { id: "opt4", label: "6" }
      ],
      correctOptionId: "opt1",
      explanation: "The numbers 1, 2, 4, 5, 6 are present. The number 3 is missing."
    }
  ],
  linked_lists: [
    {
      prompt: "Singly Linked List: Given the list 10 -> 20 -> 30 -> NULL, what does head.next.val evaluate to?",
      listNodes: [10, 20, 30],
      highlights: [1],
      options: [
        { id: "opt1", label: "20" },
        { id: "opt2", label: "30" },
        { id: "opt3", label: "NULL" },
        { id: "opt4", label: "10" }
      ],
      correctOptionId: "opt1",
      explanation: "head points to 10. head.next points to the node containing 20, so head.next.val is 20."
    },
    {
      prompt: "Node Insertion: If we insert node 15 between 10 and 20 in 10 -> 20 -> 30, what will 10.next point to?",
      listNodes: [10, 15, 20, 30],
      highlights: [1],
      options: [
        { id: "opt1", label: "15" },
        { id: "opt2", label: "20" },
        { id: "opt3", label: "NULL" },
        { id: "opt4", label: "30" }
      ],
      correctOptionId: "opt1",
      explanation: "To insert 15 after 10, we update 10's next pointer (10.next) to point to the new node 15."
    },
    {
      prompt: "Traversal Count: How many node jumps must be followed to find the end of 5 -> 10 -> 15 -> NULL?",
      listNodes: [5, 10, 15],
      highlights: [2],
      options: [
        { id: "opt1", label: "3 jumps" },
        { id: "opt2", label: "2 jumps" },
        { id: "opt3", label: "4 jumps" },
        { id: "opt4", label: "1 jump" }
      ],
      correctOptionId: "opt1",
      explanation: "We visit 5, jump to 10, jump to 15, and jump to NULL to confirm the end of the list. That takes 3 jumps."
    },
    {
      prompt: "Delete Node: If we delete 20 in 10 -> 20 -> 30, what does 10.next point to?",
      listNodes: [10, 30],
      highlights: [1],
      options: [
        { id: "opt1", label: "30" },
        { id: "opt2", label: "NULL" },
        { id: "opt3", label: "20" },
        { id: "opt4", label: "10" }
      ],
      correctOptionId: "opt1",
      explanation: "Deleting 20 means skipping it by changing 10's next pointer directly to 20's next pointer, which is 30."
    },
    {
      prompt: "Circular List: In a circular linked list 10 -> 20 -> 30 -> (back to 10), what does 30.next point to?",
      listNodes: [10, 20, 30],
      isCircular: true,
      highlights: [0],
      options: [
        { id: "opt1", label: "10" },
        { id: "opt2", label: "NULL" },
        { id: "opt3", label: "20" },
        { id: "opt4", label: "30" }
      ],
      correctOptionId: "opt1",
      explanation: "In a circular linked list, the tail node (30) points back to the head node (10)."
    },
    {
      prompt: "Middle Node: In the list 10 -> 20 -> 30 -> 40 -> 50, which node represents the middle?",
      listNodes: [10, 20, 30, 40, 50],
      highlights: [2],
      options: [
        { id: "opt1", label: "30" },
        { id: "opt2", label: "20" },
        { id: "opt3", label: "40" },
        { id: "opt4", label: "50" }
      ],
      correctOptionId: "opt1",
      explanation: "For a list of size 5, the 3rd node (value 30) is the exact middle node."
    },
    {
      prompt: "Detect Cycle: In the cycle list A -> B -> C -> D -> B, which node is entered twice first?",
      listNodes: ["A", "B", "C", "D"],
      isCycle: true,
      highlights: [1],
      options: [
        { id: "opt1", label: "Node B" },
        { id: "opt2", label: "Node C" },
        { id: "opt3", label: "Node A" },
        { id: "opt4", label: "Node D" }
      ],
      correctOptionId: "opt1",
      explanation: "Traversing the list gives A -> B -> C -> D -> B. Node B is visited twice, confirming it's the start of the loop."
    },
    {
      prompt: "Reverse List: If 1 -> 2 -> 3 -> NULL is reversed, which node becomes the new head?",
      listNodes: [3, 2, 1],
      highlights: [0],
      options: [
        { id: "opt1", label: "3" },
        { id: "opt2", label: "1" },
        { id: "opt3", label: "NULL" },
        { id: "opt4", label: "2" }
      ],
      correctOptionId: "opt1",
      explanation: "Reversing a list flips all directions. The original tail (3) becomes the new head: 3 -> 2 -> 1 -> NULL."
    },
    {
      prompt: "Doubly Linked List: In 10 <-> 20 <-> 30, what does 20.prev point to?",
      listNodes: [10, 20, 30],
      isDoubly: true,
      highlights: [0],
      options: [
        { id: "opt1", label: "10" },
        { id: "opt2", label: "30" },
        { id: "opt3", label: "NULL" },
        { id: "opt4", label: "20" }
      ],
      correctOptionId: "opt1",
      explanation: "In a doubly linked list, each node has a previous pointer. 20's previous pointer points to 10."
    },
    {
      prompt: "Dummy Head: What is the main benefit of using a Sentinel/Dummy node in Linked Lists?",
      listNodes: ["Dummy", 10, 20],
      highlights: [0],
      options: [
        { id: "opt1", label: "Simplifies edge cases like inserting/deleting at head" },
        { id: "opt2", label: "Reduces memory consumption" },
        { id: "opt3", label: "Increases search speeds" },
        { id: "opt4", label: "Allows the list to store duplicates" }
      ],
      correctOptionId: "opt1",
      explanation: "A dummy node removes the need for special checks when modifying the very first element of a linked list."
    }
  ],
  stack_queue: [
    {
      prompt: "Stack Push: You push 'Z' onto stack ['X', 'Y'] (Y is Top). What is the new Top?",
      buffer: ["X", "Y"],
      pushed: "Z",
      isStack: true,
      options: [
        { id: "opt1", label: "Z" },
        { id: "opt2", label: "Y" },
        { id: "opt3", label: "X" },
        { id: "opt4", label: "Stack is empty" }
      ],
      correctOptionId: "opt1",
      explanation: "Stack is LIFO (Last In First Out). The newly pushed element Z sits at the very top of the stack."
    },
    {
      prompt: "Queue Enqueue: You enqueue 'D' to queue ['A', 'B', 'C'] (A is Front). Which element will be dequeued first?",
      buffer: ["A", "B", "C"],
      enqueued: "D",
      isQueue: true,
      options: [
        { id: "opt1", label: "A" },
        { id: "opt2", label: "D" },
        { id: "opt3", label: "C" },
        { id: "opt4", label: "Y" }
      ],
      correctOptionId: "opt1",
      explanation: "Queue is FIFO (First In First Out). The front element 'A' is dequeued first, regardless of new enqueues at the rear."
    },
    {
      prompt: "Stack Pop: You pop from Stack ['A', 'B', 'C'] (C is Top). What is returned?",
      buffer: ["A", "B", "C"],
      popped: true,
      isStack: true,
      options: [
        { id: "opt1", label: "C" },
        { id: "opt2", label: "B" },
        { id: "opt3", label: "A" },
        { id: "opt4", label: "None of the above" }
      ],
      correctOptionId: "opt1",
      explanation: "Pop removes and returns the top element of the stack, which is C."
    },
    {
      prompt: "Queue Dequeue: You dequeue from Queue ['A', 'B', 'C'] (A is Front). What is the new Front?",
      buffer: ["B", "C"],
      isQueue: true,
      options: [
        { id: "opt1", label: "B" },
        { id: "opt2", label: "C" },
        { id: "opt3", label: "A" },
        { id: "opt4", label: "Queue becomes empty" }
      ],
      correctOptionId: "opt1",
      explanation: "Dequeue removes the front node 'A', shifting the front of the queue to the next element 'B'."
    },
    {
      prompt: "Min Stack: For stack [5, 2, 8, 1] (1 is Top), what is the minimum element?",
      buffer: [5, 2, 8, 1],
      isStack: true,
      options: [
        { id: "opt1", label: "1" },
        { id: "opt2", label: "2" },
        { id: "opt3", label: "5" },
        { id: "opt4", label: "8" }
      ],
      correctOptionId: "opt1",
      explanation: "The minimum element in [5, 2, 8, 1] is 1, which sits at the top."
    },
    {
      prompt: "Stack Brackets: Evaluating {[()]}. Which bracket is matched and popped first?",
      buffer: ["{", "[", "("],
      isStack: true,
      options: [
        { id: "opt1", label: "The closing bracket ')' matches and pops '('" },
        { id: "opt2", label: "The opening bracket '{'" },
        { id: "opt3", label: "The closing bracket ']'" },
        { id: "opt4", label: "The outer bracket '{'" }
      ],
      correctOptionId: "opt1",
      explanation: "When evaluating balanced parentheses, the first closing symbol ')' matches the top opening symbol '(', triggering the first pop."
    },
    {
      prompt: "Circular Queue: Size 5. Front is at index 3, Rear is at index 4. Where does next enqueue go?",
      buffer: [null, null, null, "A", "B"],
      isCircular: true,
      options: [
        { id: "opt1", label: "Index 0 (Wraps around)" },
        { id: "opt2", label: "Index 5" },
        { id: "opt3", label: "Queue Overflow" },
        { id: "opt4", label: "Index 1" }
      ],
      correctOptionId: "opt1",
      explanation: "In a circular queue of size 5, index 4 is the end of the array. The rear wraps around to index 0 next."
    },
    {
      prompt: "Deque Operations: Insert element 5 at the front of Deque [10, 20]. What is the new deque?",
      buffer: [5, 10, 20],
      isQueue: true,
      options: [
        { id: "opt1", label: "[5, 10, 20]" },
        { id: "opt2", label: "[10, 20, 5]" },
        { id: "opt3", label: "[5, 20, 10]" },
        { id: "opt4", label: "[10, 5, 20]" }
      ],
      correctOptionId: "opt1",
      explanation: "A Deque (Double Ended Queue) allows inserting at the front, placing 5 before 10 and 20."
    },
    {
      prompt: "Priority Queue: Min-Priority queue holds [15, 5, 10]. Which element is removed first?",
      buffer: [15, 5, 10],
      isQueue: true,
      options: [
        { id: "opt1", label: "5" },
        { id: "opt2", label: "10" },
        { id: "opt3", label: "15" },
        { id: "opt4", label: "None of the above" }
      ],
      correctOptionId: "opt1",
      explanation: "A min-priority queue always retrieves and removes the smallest element first, which is 5."
    },
    {
      prompt: "Queue using Stacks: In implementing a queue using two stacks, to dequeue, we pop from which stack?",
      buffer: ["Stack 1 (In)", "Stack 2 (Out)"],
      isStack: true,
      options: [
        { id: "opt1", label: "The output stack (S2)" },
        { id: "opt2", label: "The input stack (S1)" },
        { id: "opt3", label: "Both stacks simultaneously" },
        { id: "opt4", label: "No stacks are used" }
      ],
      correctOptionId: "opt1",
      explanation: "To maintain FIFO order, we pop elements from Stack 2. If S2 is empty, we transfer all elements from S1 to S2 first."
    }
  ],
  trees: [
    {
      prompt: "BST Insertion: Insert node 7 in this BST. Under which node does it go?",
      treeNodes: [
        { val: 10, x: 150, y: 40 },
        { val: 5, x: 80, y: 100 },
        { val: 15, x: 220, y: 100 }
      ],
      inserting: 7,
      options: [
        { id: "opt1", label: "Right child of 5" },
        { id: "opt2", label: "Left child of 5" },
        { id: "opt3", label: "Left child of 15" },
        { id: "opt4", label: "Right child of 15" }
      ],
      correctOptionId: "opt1",
      explanation: "7 is less than 10 (go left to 5), and greater than 5 (go right under 5)."
    },
    {
      prompt: "In-order traversal: Predict the In-order traversal sequence of tree [10, 5, 15].",
      treeNodes: [
        { val: 10, x: 150, y: 40 },
        { val: 5, x: 80, y: 100 },
        { val: 15, x: 220, y: 100 }
      ],
      options: [
        { id: "opt1", label: "[5, 10, 15]" },
        { id: "opt2", label: "[10, 5, 15]" },
        { id: "opt3", label: "[5, 15, 10]" },
        { id: "opt4", label: "[15, 10, 5]" }
      ],
      correctOptionId: "opt1",
      explanation: "In-order traverses Left -> Root -> Right. For this binary search tree, it outputs sorted order [5, 10, 15]."
    },
    {
      prompt: "AVL Tree: Right-heavy nodes [10, 15, 20]. Which rotation balances this AVL Tree?",
      treeNodes: [
        { val: 10, x: 80, y: 40 },
        { val: 15, x: 150, y: 100 },
        { val: 20, x: 220, y: 160 }
      ],
      options: [
        { id: "opt1", label: "Left Rotation around 10" },
        { id: "opt2", label: "Right Rotation around 15" },
        { id: "opt3", label: "Double Rotation" },
        { id: "opt4", label: "No rotation needed" }
      ],
      correctOptionId: "opt1",
      explanation: "A single Left rotation around 10 lifts 15 to the root and makes 10 its left child, balancing the tree."
    },
    {
      prompt: "Tree Height: What is the height of balanced tree [10, 5, 15]?",
      treeNodes: [
        { val: 10, x: 150, y: 40 },
        { val: 5, x: 80, y: 100 },
        { val: 15, x: 220, y: 100 }
      ],
      options: [
        { id: "opt1", label: "Height 1" },
        { id: "opt2", label: "Height 2" },
        { id: "opt3", label: "Height 0" },
        { id: "opt4", label: "Height 3" }
      ],
      correctOptionId: "opt1",
      explanation: "Height is the number of edges from the root to the lowest leaf. 10 to 5 is 1 edge, so height is 1."
    },
    {
      prompt: "Post-order traversal: Predict the post-order sequence of tree [10, 5, 15].",
      treeNodes: [
        { val: 10, x: 150, y: 40 },
        { val: 5, x: 80, y: 100 },
        { val: 15, x: 220, y: 100 }
      ],
      options: [
        { id: "opt1", label: "[5, 15, 10]" },
        { id: "opt2", label: "[5, 10, 15]" },
        { id: "opt3", label: "[10, 5, 15]" },
        { id: "opt4", label: "[15, 5, 10]" }
      ],
      correctOptionId: "opt1",
      explanation: "Post-order traverses Left -> Right -> Root, visiting 5 first, then 15, and finally root 10."
    },
    {
      prompt: "Pre-order traversal: Predict the pre-order sequence of tree [10, 5, 15].",
      treeNodes: [
        { val: 10, x: 150, y: 40 },
        { val: 5, x: 80, y: 100 },
        { val: 15, x: 220, y: 100 }
      ],
      options: [
        { id: "opt1", label: "[10, 5, 15]" },
        { id: "opt2", label: "[5, 10, 15]" },
        { id: "opt3", label: "[15, 5, 10]" },
        { id: "opt4", label: "[5, 15, 10]" }
      ],
      correctOptionId: "opt1",
      explanation: "Pre-order traverses Root -> Left -> Right, visiting root 10 first, then left child 5, then right child 15."
    },
    {
      prompt: "Level-order (BFS): What is the level-order traversal of BST [10, 5, 15]?",
      treeNodes: [
        { val: 10, x: 150, y: 40 },
        { val: 5, x: 80, y: 100 },
        { val: 15, x: 220, y: 100 }
      ],
      options: [
        { id: "opt1", label: "[10, 5, 15]" },
        { id: "opt2", label: "[5, 10, 15]" },
        { id: "opt3", label: "[5, 15, 10]" },
        { id: "opt4", label: "[15, 10, 5]" }
      ],
      correctOptionId: "opt1",
      explanation: "Level-order traverses nodes level-by-level from top to bottom, left to right: first 10, then 5 and 15."
    },
    {
      prompt: "Balance Factor: What is the AVL balance factor of node 10 in tree 10 -> 5 -> 3?",
      treeNodes: [
        { val: 10, x: 150, y: 40 },
        { val: 5, x: 80, y: 100 },
        { val: 3, x: 40, y: 160 }
      ],
      options: [
        { id: "opt1", label: "+2 (Left-heavy violation)" },
        { id: "opt2", label: "0" },
        { id: "opt3", label: "+1" },
        { id: "opt4", label: "-1" }
      ],
      correctOptionId: "opt1",
      explanation: "Balance Factor = height(left subtree) - height(right subtree). Here left height is 2, right is 0. So BF = +2."
    },
    {
      prompt: "Leaf Nodes: How many leaf nodes does BST [10, 5, 15] contain?",
      treeNodes: [
        { val: 10, x: 150, y: 40 },
        { val: 5, x: 80, y: 100 },
        { val: 15, x: 220, y: 100 }
      ],
      options: [
        { id: "opt1", label: "2 (Nodes 5 and 15)" },
        { id: "opt2", label: "1 (Node 10)" },
        { id: "opt3", label: "3" },
        { id: "opt4", label: "0" }
      ],
      correctOptionId: "opt1",
      explanation: "Leaf nodes have no children. Nodes 5 and 15 are leaves."
    },
    {
      prompt: "Tree Definition: What is the difference between a complete binary tree and a full binary tree?",
      treeNodes: [
        { val: 10, x: 150, y: 40 }
      ],
      options: [
        { id: "opt1", label: "Full means every node has 0 or 2 children; Complete means all levels are filled except possibly the last." },
        { id: "opt2", label: "They are exactly the same" },
        { id: "opt3", label: "Complete means every node must have exactly 2 children." },
        { id: "opt4", label: "Every complete tree must be full" }
      ],
      correctOptionId: "opt1",
      explanation: "A full tree restricts node child counts to 0 or 2. A complete tree requires left-aligned nodes up to the last level."
    }
  ],
  graphs: [
    {
      prompt: "Breadth-First Search: Starting BFS from Node A. Which node is visited next?",
      nodes: [
        { id: "A", x: 100, y: 80, state: "visited" },
        { id: "B", x: 60, y: 160, state: "active" },
        { id: "C", x: 140, y: 160, state: "active" },
        { id: "D", x: 100, y: 240, state: "unvisited" }
      ],
      links: [
        { source: "A", target: "B" },
        { source: "A", target: "C" },
        { source: "B", target: "D" },
        { source: "C", target: "D" }
      ],
      correctNodeId: "B",
      options: [
        { id: "opt1", label: "Node B" },
        { id: "opt2", label: "Node C" },
        { id: "opt3", label: "Node D" },
        { id: "opt4", label: "No nodes are visited" }
      ],
      correctOptionId: "opt1",
      explanation: "BFS visits nodes level-by-level. A's neighbors are B and C. In lexical order, B is processed first."
    },
    {
      prompt: "Depth-First Search: Path is A -> B. Which node will DFS traverse next?",
      nodes: [
        { id: "A", x: 100, y: 80, state: "visited" },
        { id: "B", x: 60, y: 160, state: "visited" },
        { id: "C", x: 140, y: 160, state: "unvisited" },
        { id: "D", x: 60, y: 240, state: "unvisited" }
      ],
      links: [
        { source: "A", target: "B" },
        { source: "A", target: "C" },
        { source: "B", target: "D" }
      ],
      correctNodeId: "D",
      options: [
        { id: "opt1", label: "Node D (Go deeper)" },
        { id: "opt2", label: "Node C (Backtrack to A)" },
        { id: "opt3", label: "Backtrack to B" },
        { id: "opt4", label: "Traversal terminates" }
      ],
      correctOptionId: "opt1",
      explanation: "DFS goes as deep as possible before backtracking. From B, the path continues to D."
    },
    {
      prompt: "Identify the Cycle: Which link forms a cyclic graph when added?",
      nodes: [
        { id: "A", x: 100, y: 80, state: "visited" },
        { id: "B", x: 60, y: 160, state: "visited" },
        { id: "C", x: 140, y: 160, state: "visited" }
      ],
      links: [
        { source: "A", target: "B" },
        { source: "B", target: "C" }
      ],
      cycleLink: { source: "C", target: "A" },
      options: [
        { id: "opt1", label: "Edge C -> A" },
        { id: "opt2", label: "Edge A -> C" },
        { id: "opt3", label: "No edge creates a cycle" },
        { id: "opt4", label: "Edge B -> A" }
      ],
      correctOptionId: "opt1",
      explanation: "Adding the directed edge from C back to A forms the loop A -> B -> C -> A."
    },
    {
      prompt: "Dijkstra Shortest Path: What is the cost of the shortest path from A to D?",
      nodes: [
        { id: "A", x: 100, y: 80, label: "Start" },
        { id: "B", x: 60, y: 160, label: "cost: 2" },
        { id: "C", x: 140, y: 160, label: "cost: 4" },
        { id: "D", x: 100, y: 240, label: "Target" }
      ],
      links: [
        { source: "A", target: "B", weight: 2 },
        { source: "A", target: "C", weight: 4 },
        { source: "B", target: "D", weight: 5 },
        { source: "C", target: "D", weight: 1 }
      ],
      options: [
        { id: "opt1", label: "Cost 5 (via C)" },
        { id: "opt2", label: "Cost 7 (via B)" },
        { id: "opt3", label: "Cost 6" },
        { id: "opt4", label: "Cost 8" }
      ],
      correctOptionId: "opt1",
      explanation: "Path A -> C -> D has a weight of 4 + 1 = 5. Path A -> B -> D is 2 + 5 = 7."
    },
    {
      prompt: "Topological Sort: Which node has an in-degree of 0 and must be processed first?",
      nodes: [
        { id: "A", x: 60, y: 120, state: "unvisited" },
        { id: "B", x: 140, y: 80, state: "unvisited" },
        { id: "C", x: 140, y: 160, state: "unvisited" }
      ],
      links: [
        { source: "A", target: "B" },
        { source: "A", target: "C" },
        { source: "B", target: "C" }
      ],
      correctNodeId: "A",
      options: [
        { id: "opt1", label: "Node A" },
        { id: "opt2", label: "Node B" },
        { id: "opt3", label: "Node C" },
        { id: "opt4", label: "Node D" }
      ],
      correctOptionId: "opt1",
      explanation: "Node A has no incoming arrows (in-degree = 0), so it is processed first in topological ordering."
    },
    {
      prompt: "Adjacency neighbors: List all neighbors of node B.",
      nodes: [
        { id: "A", x: 100, y: 80 },
        { id: "B", x: 60, y: 160 },
        { id: "C", x: 140, y: 160 },
        { id: "D", x: 60, y: 240 }
      ],
      links: [
        { source: "A", target: "B" },
        { source: "B", target: "D" }
      ],
      options: [
        { id: "opt1", label: "Nodes A and D" },
        { id: "opt2", label: "Node D only" },
        { id: "opt3", label: "Nodes A, C and D" },
        { id: "opt4", label: "Node C only" }
      ],
      correctOptionId: "opt1",
      explanation: "In an undirected graph, B is connected directly to A and D."
    },
    {
      prompt: "Prim's Algorithm: Starting MST from node A. Which edge is selected first?",
      nodes: [
        { id: "A", x: 100, y: 80 },
        { id: "B", x: 60, y: 160 },
        { id: "C", x: 140, y: 160 }
      ],
      links: [
        { source: "A", target: "B", weight: 2 },
        { source: "A", target: "C", weight: 4 }
      ],
      options: [
        { id: "opt1", label: "Edge A-B (weight 2)" },
        { id: "opt2", label: "Edge A-C (weight 4)" },
        { id: "opt3", label: "Edge B-D (weight 5)" },
        { id: "opt4", label: "Edge C-D" }
      ],
      correctOptionId: "opt1",
      explanation: "Prim's algorithm greedily selects the minimum weight edge from the currently visited node set, which is A-B (weight 2)."
    },
    {
      prompt: "Graph Representation: If node A is not connected to D, what is entry matrix Adjacency[A][D]?",
      nodes: [
        { id: "A", x: 60, y: 80 },
        { id: "D", x: 140, y: 80 }
      ],
      links: [],
      options: [
        { id: "opt1", label: "0 (or infinity)" },
        { id: "opt2", label: "1" },
        { id: "opt3", label: "-1" },
        { id: "opt4", label: "Null pointer" }
      ],
      correctOptionId: "opt1",
      explanation: "In an adjacency matrix, a value of 0 or infinity indicates no direct edge exists between the two nodes."
    },
    {
      prompt: "Bipartite Graph: Can a graph with an odd cycle (e.g. triangle A-B-C-A) be 2-colored?",
      nodes: [
        { id: "A", x: 100, y: 80 },
        { id: "B", x: 60, y: 160 },
        { id: "C", x: 140, y: 160 }
      ],
      links: [
        { source: "A", target: "B" },
        { source: "B", target: "C" },
        { source: "C", target: "A" }
      ],
      options: [
        { id: "opt1", label: "No, odd cycles violate bipartite bipartition" },
        { id: "opt2", label: "Yes, always" },
        { id: "opt3", label: "Only if directed" },
        { id: "opt4", label: "Only if bipartite check is skipped" }
      ],
      correctOptionId: "opt1",
      explanation: "A graph is bipartite if and only if it contains no odd-length cycles. A triangle has length 3 (odd) and cannot be bipartite."
    },
    {
      prompt: "Connected Components: How many components in a graph of nodes A, B (connected) and C, D (connected) with no edges in between?",
      nodes: [
        { id: "A", x: 50, y: 80 },
        { id: "B", x: 50, y: 180 },
        { id: "C", x: 150, y: 80 },
        { id: "D", x: 150, y: 180 }
      ],
      links: [
        { source: "A", target: "B" },
        { source: "C", target: "D" }
      ],
      options: [
        { id: "opt1", label: "2 components" },
        { id: "opt2", label: "1 component" },
        { id: "opt3", label: "4 components" },
        { id: "opt4", label: "3 components" }
      ],
      correctOptionId: "opt1",
      explanation: "There are two separate disconnected graph networks: {A, B} and {C, D}, giving 2 connected components."
    }
  ],
  recursion: [
    {
      prompt: "Predict Call Stack: Factorial(4) calls 4 * fact(3). What is pushed onto the stack next?",
      stack: ["fact(4)"],
      options: [
        { id: "opt1", label: "fact(3)" },
        { id: "opt2", label: "fact(5)" },
        { id: "opt3", label: "fact(2)" },
        { id: "opt4", label: "fact(1)" }
      ],
      correctOptionId: "opt1",
      explanation: "fact(4) invokes fact(3) recursively, pushing it onto the execution call stack."
    },
    {
      prompt: "Base Case return: Execution reached fact(1). What is the return value of this base case?",
      stack: ["fact(4)", "fact(3)", "fact(2)", "fact(1)"],
      options: [
        { id: "opt1", label: "1" },
        { id: "opt2", label: "0" },
        { id: "opt3", label: "undefined" },
        { id: "opt4", label: "-1" }
      ],
      correctOptionId: "opt1",
      explanation: "For factorial, the base case is fact(1) = 1 (or fact(0) = 1) to stop recursion."
    },
    {
      prompt: "Fibonacci Tree: Predict return value of Fib(3) = Fib(2) + Fib(1), where Fib(2)=1 and Fib(1)=1.",
      tree: { id: "Fib(3)", left: "Fib(2)", right: "Fib(1)" },
      options: [
        { id: "opt1", label: "2" },
        { id: "opt2", label: "1" },
        { id: "opt3", label: "3" },
        { id: "opt4", label: "0" }
      ],
      correctOptionId: "opt1",
      explanation: "Fib(3) sums the results of its children: Fib(2) + Fib(1) = 1 + 1 = 2."
    },
    {
      prompt: "Stack Frame Backtrack: When fact(2) returns 2, which active frame pops off next?",
      stack: ["fact(4)", "fact(3)", "fact(2)"],
      popping: "fact(2)",
      options: [
        { id: "opt1", label: "fact(2)" },
        { id: "opt2", label: "fact(3)" },
        { id: "opt3", label: "fact(4)" },
        { id: "opt4", label: "No active frames" }
      ],
      correctOptionId: "opt1",
      explanation: "The top active frame (fact(2)) finishes executing and is popped off the stack, returning control to fact(3)."
    },
    {
      prompt: "Stack Height: What is the stack height for solving fact(N) recursively?",
      stack: ["fact(N)", "fact(N-1)", "...", "fact(1)"],
      options: [
        { id: "opt1", label: "O(N)" },
        { id: "opt2", label: "O(log N)" },
        { id: "opt3", label: "O(1)" },
        { id: "opt4", label: "O(N^2)" }
      ],
      correctOptionId: "opt1",
      explanation: "Each recursive call adds a stack frame. For N calls, stack depth scales linearly, requiring O(N) space."
    },
    {
      prompt: "Tail Recursion: What is a tail-recursive function?",
      options: [
        { id: "opt1", label: "A function where the recursive call is the last operation executed" },
        { id: "opt2", label: "A function that has no base case" },
        { id: "opt3", label: "A function that uses a queue" },
        { id: "opt4", label: "A function that loops indefinitely" }
      ],
      correctOptionId: "opt1",
      explanation: "Tail recursion is a special case of recursion where the recursive call is the final statement, allowing compiler optimizations."
    },
    {
      prompt: "Tower of Hanoi: What is the minimum moves to solve Tower of Hanoi with 3 disks?",
      options: [
        { id: "opt1", label: "7" },
        { id: "opt2", label: "8" },
        { id: "opt3", label: "5" },
        { id: "opt4", label: "9" }
      ],
      correctOptionId: "opt1",
      explanation: "The recurrence is T(n) = 2*T(n-1) + 1. For n=3, moves = 2^3 - 1 = 7."
    },
    {
      prompt: "Recursive Binary Search: Search 5 in [2, 5, 8]. Mid is 5. What does the recursive step return?",
      options: [
        { id: "opt1", label: "Index 1 (Success)" },
        { id: "opt2", label: "Recurse on left" },
        { id: "opt3", label: "Recurse on right" },
        { id: "opt4", label: "Null" }
      ],
      correctOptionId: "opt1",
      explanation: "Since the element at mid index 1 (5) matches target, the function returns index 1 immediately."
    },
    {
      prompt: "Merge Sort Partition: In sorting [4, 8, 2, 9], what is the first recursive split?",
      options: [
        { id: "opt1", label: "[4, 8] and [2, 9]" },
        { id: "opt2", label: "[4] and [8]" },
        { id: "opt3", label: "[4, 8, 2] and [9]" },
        { id: "opt4", label: "[4, 8]" }
      ],
      correctOptionId: "opt1",
      explanation: "Merge sort splits array directly down the middle, separating [4, 8, 2, 9] into [4, 8] and [2, 9]."
    },
    {
      prompt: "Stack Overflow: What causes a Stack Overflow error in recursion?",
      options: [
        { id: "opt1", label: "Infinite recursion due to missing or unreached base case" },
        { id: "opt2", label: "An array bounds overflow" },
        { id: "opt3", label: "Using too much heap space" },
        { id: "opt4", label: "Memory leak warning" }
      ],
      correctOptionId: "opt1",
      explanation: "Without a valid base case, recursion executes infinitely, running out of call stack memory frame allocation."
    }
  ],
  dynamic_programming: [
    {
      prompt: "Fibonacci DP: To compute Fib(4) bottom-up, what is the formula to fill dp[4]?",
      dpArray: [0, 1, 1, 2, "?"],
      highlights: [2, 3],
      options: [
        { id: "opt1", label: "dp[3] + dp[2]" },
        { id: "opt2", label: "dp[3] * 2" },
        { id: "opt3", label: "dp[3] + 1" },
        { id: "opt4", label: "dp[3] - dp[2]" }
      ],
      correctOptionId: "opt1",
      explanation: "The state transition for Fibonacci is dp[i] = dp[i-1] + dp[i-2]."
    },
    {
      prompt: "Grid Path Counting: How many unique paths from top-left (0,0) to (1,1) in a grid if you can only move Right or Down?",
      dpGrid: [[1, 1], [1, 2]],
      options: [
        { id: "opt1", label: "2 paths" },
        { id: "opt2", label: "1 path" },
        { id: "opt3", label: "3 paths" },
        { id: "opt4", label: "4 paths" }
      ],
      correctOptionId: "opt1",
      explanation: "Paths are: Down->Right or Right->Down. The DP cell transition sums the cell above and cell to the left: 1 + 1 = 2."
    },
    {
      prompt: "Knapsack 0/1: Items have weights [1, 3] and values [6, 10]. Max value with capacity 3?",
      dpArray: [0, 6, 6, 6],
      options: [
        { id: "opt1", label: "10 (take item 2)" },
        { id: "opt2", label: "6 (take item 1)" },
        { id: "opt3", label: "16 (take both)" },
        { id: "opt4", label: "12" }
      ],
      correctOptionId: "opt1",
      explanation: "We can only choose Item 1 (weight 1, value 6) OR Item 2 (weight 3, value 10). Item 2 gives the maximum value of 10."
    },
    {
      prompt: "DP Approaches: Which style describes Memoization vs Tabulation?",
      options: [
        { id: "opt1", label: "Memoization is Top-down (recursive); Tabulation is Bottom-up (iterative)" },
        { id: "opt2", label: "Memoization is Bottom-up; Tabulation is Top-down" },
        { id: "opt3", label: "They are exactly the same" },
        { id: "opt4", label: "They are both Top-down" }
      ],
      correctOptionId: "opt1",
      explanation: "Memoization caches recursive functions top-down. Tabulation builds a state table iteratively bottom-up."
    },
    {
      prompt: "LCS: What is the length of Longest Common Subsequence of \"ABC\" and \"AC\"?",
      options: [
        { id: "opt1", label: "2 (AC)" },
        { id: "opt2", label: "3" },
        { id: "opt3", label: "1" },
        { id: "opt4", label: "0" }
      ],
      correctOptionId: "opt1",
      explanation: "The common elements in order are 'A' and 'C', giving length 2."
    },
    {
      prompt: "Coin Change: Minimum coins to make amount 5 using coins [1, 2, 5]?",
      dpArray: [0, 1, 1, 2, 2, 1],
      options: [
        { id: "opt1", label: "1 coin (using 5)" },
        { id: "opt2", label: "3 coins" },
        { id: "opt3", label: "2 coins" },
        { id: "opt4", label: "5 coins" }
      ],
      correctOptionId: "opt1",
      explanation: "We can make 5 using exactly one single 5-cent coin, which is the absolute minimum."
    },
    {
      prompt: "Climbing Stairs: You can climb 1 or 2 steps at a time. How many ways to reach step 3?",
      dpArray: [1, 1, 2, 3],
      options: [
        { id: "opt1", label: "3 ways" },
        { id: "opt2", label: "2 ways" },
        { id: "opt3", label: "4 ways" },
        { id: "opt4", label: "5 ways" }
      ],
      correctOptionId: "opt1",
      explanation: "Ways to step 3 is ways(2) + ways(1) = 2 + 1 = 3 ways: [1,1,1], [1,2], or [2,1]."
    },
    {
      prompt: "Edit Distance: What is the edit distance between \"cat\" and \"cut\"?",
      options: [
        { id: "opt1", label: "1 replacement" },
        { id: "opt2", label: "2 operations" },
        { id: "opt3", label: "0" },
        { id: "opt4", label: "3 operations" }
      ],
      correctOptionId: "opt1",
      explanation: "Replacing 'a' with 'u' in 'cat' yields 'cut' in exactly 1 operation."
    },
    {
      prompt: "House Robber: Loot houses [2, 7, 9, 3, 1] without robbing adjacent ones. Max profit?",
      dpArray: [2, 7, 11, 11, 12],
      options: [
        { id: "opt1", label: "12 (Rob 2, 9, 1)" },
        { id: "opt2", label: "10 (Rob 7, 3)" },
        { id: "opt3", label: "11" },
        { id: "opt4", label: "9" }
      ],
      correctOptionId: "opt1",
      explanation: "Robbing houses 0 (value 2), 2 (value 9), and 4 (value 1) yields: 2 + 9 + 1 = 12."
    },
    {
      prompt: "Matrix Chain Multiplication: What is the main objective of MCM?",
      options: [
        { id: "opt1", label: "Find the most efficient parenthesization order to multiply matrices" },
        { id: "opt2", label: "Multiply two matrices quickly" },
        { id: "opt3", label: "Find the inverse of a matrix" },
        { id: "opt4", label: "Perform matrix division" }
      ],
      correctOptionId: "opt1",
      explanation: "Matrix multiplication is associative. MCM uses DP to minimize scalar multiplications by ordering computation."
    }
  ],
  searching_sorting: [
    {
      prompt: "Bubble Sort Swap: In sorting [15, 4, 8], which elements will Bubble Sort swap first?",
      array: [15, 4, 8],
      highlights: [0, 1],
      options: [
        { id: "opt1", label: "15 and 4" },
        { id: "opt2", label: "4 and 8" },
        { id: "opt3", label: "No swap needed" },
        { id: "opt4", label: "8 and 15" }
      ],
      correctOptionId: "opt1",
      explanation: "Bubble sort compares adjacent items. Since 15 > 4, it swaps them first."
    },
    {
      prompt: "Selection Sort: Find the element violating the sorted prefix in [2, 5, 3].",
      array: [2, 5, 3],
      highlights: [1, 2],
      options: [
        { id: "opt1", label: "Value 3 (should be before 5)" },
        { id: "opt2", label: "Value 5" },
        { id: "opt3", label: "Value 2" },
        { id: "opt4", label: "No violation exists" }
      ],
      correctOptionId: "opt1",
      explanation: "Selection sort places the smallest remaining elements on the left. 3 is smaller than 5, so it violates sorting order."
    },
    {
      prompt: "Binary Search: In array [2, 4, 6, 8, 10], searching for 8. Which index is calculated as the first mid?",
      array: [2, 4, 6, 8, 10],
      highlights: [2],
      options: [
        { id: "opt1", label: "Index 2 (Value 6)" },
        { id: "opt2", label: "Index 3 (Value 8)" },
        { id: "opt3", label: "Index 1 (Value 4)" },
        { id: "opt4", label: "Index 4 (Value 10)" }
      ],
      correctOptionId: "opt1",
      explanation: "Left is 0, Right is 4. Mid = (0 + 4)/2 = 2. The element at index 2 is 6."
    },
    {
      prompt: "Linear vs Binary Search: What is the worst-case complexity of binary search on a sorted array?",
      options: [
        { id: "opt1", label: "O(log N)" },
        { id: "opt2", label: "O(N)" },
        { id: "opt3", label: "O(1)" },
        { id: "opt4", label: "O(N log N)" }
      ],
      correctOptionId: "opt1",
      explanation: "Binary search cuts search space in half at each iteration, giving logarithmic O(log N) complexity."
    },
    {
      prompt: "Quicksort Pivot: Pivot position of 8 in partitioning [5, 3, 8, 12, 9].",
      array: [5, 3, 8, 12, 9],
      highlights: [2],
      options: [
        { id: "opt1", label: "Index 2 (Pivot 8 swaps with 9)" },
        { id: "opt2", label: "Index 3" },
        { id: "opt3", label: "Index 0" },
        { id: "opt4", label: "Index 4" }
      ],
      correctOptionId: "opt1",
      explanation: "Quicksort partitions elements around pivot 8. Elements smaller (5, 3) go left, larger (9, 12) go right, positioning 8 at index 2."
    },
    {
      prompt: "Merge Sort: What is the result of merging sorted sub-arrays [4, 8] and [2, 9]?",
      array: [2, 4, 8, 9],
      highlights: [0, 1, 2, 3],
      options: [
        { id: "opt1", label: "[2, 4, 8, 9]" },
        { id: "opt2", label: "[4, 8, 2, 9]" },
        { id: "opt3", label: "[2, 9, 4, 8]" },
        { id: "opt4", label: "[8, 4, 9, 2]" }
      ],
      correctOptionId: "opt1",
      explanation: "Merging [4, 8] and [2, 9] in sorted order results in [2, 4, 8, 9]."
    },
    {
      prompt: "Insertion Sort: When processing 3 in [2, 5, 7], where does 3 get inserted?",
      array: [2, 3, 5, 7],
      highlights: [1],
      options: [
        { id: "opt1", label: "Between 2 and 5" },
        { id: "opt2", label: "At the start" },
        { id: "opt3", label: "At the end" },
        { id: "opt4", label: "At the very end" }
      ],
      correctOptionId: "opt1",
      explanation: "Insertion sort places 3 before 5 but after 2, resulting in [2, 3, 5, 7]."
    },
    {
      prompt: "Search next range: Binary search for 12 in [2, 5, 8, 12, 16]. First mid is 8. Which half do we search next?",
      array: [2, 5, 8, 12, 16],
      highlights: [2],
      options: [
        { id: "opt1", label: "Right half (indices 3 to 4)" },
        { id: "opt2", label: "Left half (indices 0 to 1)" },
        { id: "opt3", label: "Nowhere, we are done" },
        { id: "opt4", label: "Indices 0 to 4" }
      ],
      correctOptionId: "opt1",
      explanation: "Since 12 is greater than mid value 8, we discard the left half and search the right partition."
    },
    {
      prompt: "Bubble Sort Complexity: What is the best-case time complexity of Bubble Sort (if the array is already sorted)?",
      options: [
        { id: "opt1", label: "O(N)" },
        { id: "opt2", label: "O(N^2)" },
        { id: "opt3", label: "O(log N)" },
        { id: "opt4", label: "O(N log N)" }
      ],
      correctOptionId: "opt1",
      explanation: "If sorted, a single check pass of O(N) finishes without swaps, terminating early."
    },
    {
      prompt: "Sorting Stability: Which sorting algorithm is stable by default?",
      options: [
        { id: "opt1", label: "Merge Sort" },
        { id: "opt2", label: "Quicksort" },
        { id: "opt3", label: "Heapsort" },
        { id: "opt4", label: "Selection Sort" }
      ],
      correctOptionId: "opt1",
      explanation: "Merge sort preserves relative order of duplicate elements, making it stable by default."
    }
  ]
};

export default function VisualizerChallengeWrapper({
  topic,
  difficulty,
  type,
  currentRound,
  onQuestionGenerated,
  selectedOptionId,
  isAnswered,
  onNodeSelected
}) {
  const [activeSelectIndex, setActiveSelectIndex] = useState(null);

  // Safely index question based on round (1-indexed round, mapping to 0..9 index)
  const questionIndex = Math.min(Math.max(0, currentRound - 1), 9);
  
  const questionData = React.useMemo(() => {
    const list = QUESTIONS_BANK[topic] || QUESTIONS_BANK["arrays"];
    return list[questionIndex];
  }, [topic, questionIndex]);

  // Inform parent of new question data
  useEffect(() => {
    onQuestionGenerated(questionData);
  }, [questionData, onQuestionGenerated]);

  const handleSelectIndex = (idx, details) => {
    setActiveSelectIndex(idx);
    if (onNodeSelected) {
      onNodeSelected(details);
    }
  };

  const isCorrectOption = (optId) => optId === questionData?.correctOptionId;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center min-h-[350px] bg-neutral-900/5 dark:bg-neutral-950/40 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 transition-all">
      <div className="flex-1 flex items-center justify-center w-full">
        <AnimatePresence mode="wait">
          
          {/* ARRAYS VISUALIZER */}
          {topic === "arrays" && (
            <motion.div
              key={`arr-${currentRound}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex items-center justify-center gap-2.5 w-full max-w-md h-[120px] px-4"
            >
              {questionData?.array?.map((val, idx) => {
                const isHighlighted = questionData.highlights?.includes(idx);
                const isSelected = selectedOptionId && isCorrectOption(selectedOptionId) && isHighlighted;
                const isWrongSelected = selectedOptionId && !isCorrectOption(selectedOptionId) && isHighlighted;

                let bgClass = "bg-white dark:bg-[#1a1a1a] border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200";
                if (isHighlighted) bgClass = "bg-purple-500/10 border-purple-500/80 text-purple-700 dark:text-purple-400";
                if (isSelected) bgClass = "bg-green-500 border-green-600 text-white";
                if (isWrongSelected) bgClass = "bg-red-500 border-red-600 text-white";

                return (
                  <div key={idx} className="flex flex-col items-center flex-1">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      onClick={() => handleSelectIndex(idx, { type: "arrays", index: idx })}
                      className={`w-full aspect-square flex items-center justify-center rounded-2xl border-2 shadow-sm font-black font-mono cursor-pointer transition-all duration-300
                        ${bgClass} ${activeSelectIndex === idx ? "ring-2 ring-purple-600" : ""}`}
                    >
                      {val}
                    </motion.div>
                    <span className="text-[10px] font-extrabold text-neutral-400 mt-2">
                      [{idx}]
                    </span>
                  </div>
                );
              })}
            </motion.div>
          )}

          {/* LINKED LISTS VISUALIZER */}
          {topic === "linked_lists" && (
            <motion.div
              key={`ll-${currentRound}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex items-center justify-center gap-2 overflow-x-auto py-4 w-full max-w-xl"
            >
              {questionData?.listNodes?.map((val, idx) => {
                const isHighlighted = questionData.highlights?.includes(idx);
                const isSelected = selectedOptionId && isCorrectOption(selectedOptionId) && isHighlighted;
                const isWrongSelected = selectedOptionId && !isCorrectOption(selectedOptionId) && isHighlighted;

                let bgClass = "bg-white dark:bg-[#1a1a1a] border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200";
                if (isHighlighted) bgClass = "bg-purple-500/10 border-purple-500/80 text-purple-700 dark:text-purple-400";
                if (isSelected) bgClass = "bg-green-500 border-green-600 text-white";
                if (isWrongSelected) bgClass = "bg-red-500 border-red-600 text-white";

                return (
                  <React.Fragment key={idx}>
                    <div className="flex flex-col items-center">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className={`w-14 h-14 rounded-full border-2 flex items-center justify-center font-black text-sm shadow-sm transition-all duration-300
                          ${bgClass}`}
                      >
                        {val}
                      </motion.div>
                      <span className="text-[9px] font-bold text-neutral-400 mt-1.5">
                        {idx === 0 ? "head" : `node[${idx}]`}
                      </span>
                    </div>
                    {idx < questionData.listNodes.length - 1 && (
                      <div className="flex items-center">
                        <svg className="w-8 h-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </div>
                    )}
                    {idx === questionData.listNodes.length - 1 && (
                      <div className="flex items-center text-xs font-black text-neutral-400 ml-1">
                        ➜ {questionData.isCircular ? "head" : "NULL"}
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </motion.div>
          )}

          {/* STACK & QUEUE VISUALIZER */}
          {topic === "stack_queue" && (
            <motion.div
              key={`sq-${currentRound}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center justify-center w-full max-w-sm min-h-[220px]"
            >
              {/* Stack visual */}
              {questionData?.isStack && (
                <div className="flex flex-col items-center">
                  <div className="border-b-4 border-x-4 border-neutral-400 dark:border-neutral-700 w-32 min-h-[140px] flex flex-col-reverse justify-start p-2 gap-2 rounded-b-2xl">
                    {questionData.buffer?.map((val, idx) => (
                      <div key={idx} className="p-2 rounded bg-purple-100 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900 text-center font-black text-sm text-purple-700 dark:text-purple-300">
                        {val}
                      </div>
                    ))}
                    {questionData.pushed && isAnswered && (
                      <motion.div
                        initial={{ y: -50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="p-2 rounded bg-green-500 border border-green-600 text-white text-center font-black text-sm"
                      >
                        {questionData.pushed}
                      </motion.div>
                    )}
                  </div>
                  <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider mt-3">Stack Buffer</span>
                </div>
              )}

              {/* Queue visual */}
              {questionData?.isQueue && (
                <div className="flex flex-col items-center">
                  <div className="flex border-y-4 border-neutral-400 dark:border-neutral-700 w-64 h-16 p-2 gap-2">
                    {questionData.buffer?.map((val, idx) => (
                      <div key={idx} className="flex-1 flex items-center justify-center rounded bg-purple-100 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900 font-black text-sm text-purple-700 dark:text-purple-300">
                        {val}
                      </div>
                    ))}
                    {questionData.enqueued && isAnswered && (
                      <motion.div
                        initial={{ x: 30, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="flex-1 flex items-center justify-center rounded bg-green-500 border border-green-600 text-white font-black text-sm"
                      >
                        {questionData.enqueued}
                      </motion.div>
                    )}
                  </div>
                  <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider mt-3">Queue Buffer</span>
                </div>
              )}

              {/* Circular Queue visual */}
              {questionData?.isCircular && (
                <div className="relative w-44 h-44 rounded-full border-4 border-neutral-300 dark:border-neutral-800 flex items-center justify-center">
                  <div className="absolute w-24 h-24 rounded-full border-4 border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-900" />
                  {[0, 1, 2, 3, 4].map((val) => {
                    const angles = [0, 72, 144, 216, 288];
                    const transforms = `rotate(${angles[val]}deg) translate(0, -60px)`;
                    const item = questionData.buffer[val];
                    
                    return (
                      <div
                        key={val}
                        className={`absolute w-10 h-10 rounded-full border flex items-center justify-center font-black text-xs shadow-sm
                          ${item 
                            ? "bg-purple-100 dark:bg-purple-950/40 border-purple-300 dark:border-purple-950 text-purple-700 dark:text-purple-300" 
                            : "bg-neutral-100 dark:bg-neutral-800 border-neutral-300 dark:border-neutral-800 text-neutral-400"}`}
                        style={{ transform: transforms }}
                      >
                        {item || "∅"}
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}

          {/* TREES VISUALIZER */}
          {topic === "trees" && (
            <motion.div
              key={`tree-${currentRound}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-sm h-[200px]"
            >
              <svg className="w-full h-full" viewBox="0 0 300 200">
                {questionData?.treeNodes?.length > 1 && (
                  <>
                    <line x1="150" y1="40" x2="80" y2="100" className="stroke-neutral-300 dark:stroke-neutral-800" strokeWidth="2" />
                    <line x1="150" y1="40" x2="220" y2="100" className="stroke-neutral-300 dark:stroke-neutral-800" strokeWidth="2" />
                  </>
                )}
                {questionData?.treeNodes?.length > 2 && questionData.treeNodes[2].val === 20 && (
                  <line x1="150" y1="100" x2="220" y2="160" className="stroke-neutral-300 dark:stroke-neutral-800" strokeWidth="2" />
                )}

                {currentRound === 1 && (
                  <>
                    <circle cx="40" cy="160" r="12" className="fill-none stroke-dashed stroke-purple-400 fill-purple-400/5 cursor-pointer" strokeWidth="2" />
                    <circle cx="120" cy="160" r="12" className={`fill-none stroke-dashed stroke-purple-400 fill-purple-400/5 cursor-pointer ${activeSelectIndex === "right-of-5" ? "fill-purple-500/30" : ""}`} strokeWidth="2" onClick={() => handleSelectIndex("right-of-5", { child: "left-right" })} />
                  </>
                )}

                {questionData?.treeNodes?.map((node, idx) => {
                  let fill = "fill-white dark:fill-[#1c1d1f] stroke-purple-500 dark:stroke-purple-900";
                  let textFill = "fill-neutral-800 dark:fill-neutral-200";

                  return (
                    <g key={idx}>
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r="16"
                        className={`${fill} transition-all duration-300`}
                        strokeWidth="2"
                      />
                      <text
                        x={node.x}
                        y={node.y + 4}
                        textAnchor="middle"
                        className={`${textFill} font-black text-xs font-mono`}
                      >
                        {node.val}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </motion.div>
          )}

          {/* GRAPHS VISUALIZER */}
          {topic === "graphs" && (
            <motion.div
              key={`graph-${currentRound}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-sm h-[200px]"
            >
              <svg className="w-full h-full" viewBox="0 0 200 300">
                {/* Edges */}
                {questionData?.links?.map((link, idx) => {
                  const sourceNode = questionData.nodes.find(n => n.id === link.source);
                  const targetNode = questionData.nodes.find(n => n.id === link.target);
                  return (
                    <line
                      key={idx}
                      x1={sourceNode.x}
                      y1={sourceNode.y}
                      x2={targetNode.x}
                      y2={targetNode.y}
                      className="stroke-neutral-300 dark:stroke-neutral-800"
                      strokeWidth="2"
                    />
                  );
                })}

                {questionData?.cycleLink && isAnswered && (
                  <line
                    x1={questionData.nodes.find(n => n.id === questionData.cycleLink.source).x}
                    y1={questionData.nodes.find(n => n.id === questionData.cycleLink.source).y}
                    x2={questionData.nodes.find(n => n.id === questionData.cycleLink.target).x}
                    y2={questionData.nodes.find(n => n.id === questionData.cycleLink.target).y}
                    className="stroke-red-500 stroke-dasharray-4"
                    strokeWidth="2"
                    strokeDasharray="4"
                  />
                )}

                {/* Nodes */}
                {questionData?.nodes?.map((node) => {
                  const isActive = node.state === "active";
                  const isVisited = node.state === "visited";
                  
                  let fill = "fill-white dark:fill-[#1c1d1f] stroke-neutral-400 dark:stroke-neutral-700";
                  let textFill = "fill-neutral-800 dark:fill-neutral-200";

                  if (isActive) {
                    fill = "fill-yellow-400/20 stroke-yellow-500";
                  } else if (isVisited) {
                    fill = "fill-purple-500/20 stroke-purple-600";
                  }

                  if (isAnswered) {
                    if (node.id === questionData.correctNodeId) {
                      fill = "fill-green-500 stroke-green-600";
                      textFill = "fill-white";
                    }
                  }

                  return (
                    <g 
                      key={node.id} 
                      className="cursor-pointer"
                      onClick={() => handleSelectIndex(node.id, { type: "graphs", nodeId: node.id })}
                    >
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r="16"
                        className={`${fill} transition-all duration-300`}
                        strokeWidth="2"
                      />
                      <text
                        x={node.x}
                        y={node.y + 4}
                        textAnchor="middle"
                        className={`${textFill} font-black text-xs font-mono`}
                      >
                        {node.id}
                      </text>
                      {node.label && (
                        <text
                          x={node.x}
                          y={node.y + 26}
                          textAnchor="middle"
                          className="fill-neutral-400 text-[8px] font-bold"
                        >
                          {node.label}
                        </text>
                      )}
                    </g>
                  );
                })}
              </svg>
            </motion.div>
          )}

          {/* RECURSION VISUALIZER */}
          {topic === "recursion" && (
            <motion.div
              key={`rec-${currentRound}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center gap-4 w-full max-w-sm"
            >
              {questionData?.stack && (
                <div className="border border-purple-200 dark:border-purple-900/60 rounded-2xl p-4 bg-white dark:bg-[#1c1d1f] w-64 shadow-sm">
                  <div className="text-[10px] font-black uppercase text-purple-600 tracking-wider text-center border-b pb-2 mb-3 border-neutral-100 dark:border-neutral-800">
                    Call Stack
                  </div>
                  <div className="flex flex-col-reverse gap-1.5 min-h-[140px] justify-start">
                    {questionData.stack.map((frame, idx) => {
                      const isPopping = questionData.popping === frame && isAnswered;
                      return (
                        <motion.div
                          key={idx}
                          layout
                          className={`p-2 rounded-xl text-xs font-mono font-black text-center border
                            ${isPopping 
                              ? "bg-red-500 border-red-600 text-white" 
                              : "bg-purple-100 dark:bg-purple-950/30 border-purple-200 dark:border-purple-900 text-purple-800 dark:text-purple-300"}`}
                        >
                          {frame}
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              )}

              {questionData?.tree && (
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full border-2 border-purple-600 flex items-center justify-center font-black text-sm bg-purple-50 dark:bg-purple-950/20 text-purple-700 dark:text-purple-300 shadow-sm">
                    {questionData.tree.id}
                  </div>
                  <div className="flex gap-16 mt-6 relative">
                    <div className="absolute left-8 right-8 top-[-24px] h-6 border-t-2 border-x-2 border-neutral-300 dark:border-neutral-800" />
                    <div className="w-12 h-12 rounded-full border border-neutral-300 dark:border-neutral-800 flex items-center justify-center font-bold text-xs bg-neutral-50 dark:bg-neutral-900">
                      {questionData.tree.left}
                    </div>
                    <div className="w-12 h-12 rounded-full border border-neutral-300 dark:border-neutral-800 flex items-center justify-center font-bold text-xs bg-neutral-50 dark:bg-neutral-900">
                      {questionData.tree.right}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* DYNAMIC PROGRAMMING VISUALIZER */}
          {topic === "dynamic_programming" && (
            <motion.div
              key={`dp-${currentRound}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center gap-5 w-full max-w-md h-[180px] px-4"
            >
              {questionData?.dpArray && (
                <div className="w-full">
                  <span className="text-[10px] font-bold text-neutral-400 block mb-2 uppercase text-center">DP Memoization Array</span>
                  <div className="flex border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden bg-white dark:bg-[#1a1a1a] shadow-sm">
                    {questionData.dpArray.map((val, idx) => {
                      const isHighlighted = questionData.highlights?.includes(idx);
                      const isTarget = val === "?";
                      
                      let bgClass = "";
                      if (isTarget) bgClass = "bg-purple-100 dark:bg-purple-950/20 text-purple-700 font-extrabold";
                      else if (isHighlighted) bgClass = "bg-yellow-400/20 border-yellow-500 text-yellow-800 dark:text-yellow-300";

                      return (
                        <div key={idx} className={`flex-1 text-center py-4 border-r border-neutral-200 dark:border-neutral-800 last:border-r-0 font-bold font-mono ${bgClass}`}>
                          {isTarget && isAnswered ? questionData.correctOptionId === "opt1" ? "3" : "2" : val}
                          <span className="text-[8px] text-neutral-400 block mt-1 font-sans">[{idx}]</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {questionData?.dpGrid && (
                <div className="flex flex-col items-center">
                  <span className="text-[10px] font-bold text-neutral-400 block mb-2 uppercase">DP Grid State transitions</span>
                  <div className="grid grid-cols-2 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden bg-white dark:bg-[#1a1a1a] shadow-sm w-36">
                    {questionData.dpGrid.map((row, rIdx) => 
                      row.map((val, cIdx) => (
                        <div key={`${rIdx}-${cIdx}`} className="text-center py-3 border-r border-b border-neutral-200 dark:border-neutral-800 font-bold font-mono last:border-r-0">
                          {val}
                          <span className="text-[8px] text-neutral-400 block font-sans">({rIdx},{cIdx})</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* SEARCHING & SORTING VISUALIZER */}
          {topic === "searching_sorting" && (
            <motion.div
              key={`sort-${currentRound}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex items-end justify-center gap-3 w-full max-w-md h-[180px] px-4"
            >
              {questionData?.array?.map((val, idx) => {
                const isHighlighted = questionData.highlights?.includes(idx);
                const isSelected = selectedOptionId && isCorrectOption(selectedOptionId) && isHighlighted;
                const isWrongSelected = selectedOptionId && !isCorrectOption(selectedOptionId) && isHighlighted;
                
                let bgClass = "bg-purple-500/20 border-purple-500/40 text-purple-700 dark:text-purple-300";
                if (isHighlighted) bgClass = "bg-yellow-400/30 border-yellow-500 text-yellow-800 dark:text-yellow-300 scale-105";
                if (isSelected) bgClass = "bg-green-500 border-green-600 text-white scale-105";
                if (isWrongSelected) bgClass = "bg-red-500 border-red-600 text-white";

                return (
                  <div key={idx} className="flex flex-col items-center flex-1">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      onClick={() => handleSelectIndex(idx, { type: "searching_sorting", index: idx })}
                      className={`w-full flex items-center justify-center rounded-2xl border-2 shadow-sm font-black font-mono cursor-pointer transition-all duration-300
                        ${bgClass} ${activeSelectIndex === idx ? "ring-2 ring-purple-600" : ""}`}
                      style={{ height: `${val * 8 + 40}px` }}
                    >
                      {val}
                    </motion.div>
                    <span className="text-[10px] font-extrabold text-neutral-400 mt-2">
                      [{idx}]
                    </span>
                  </div>
                );
              })}
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
