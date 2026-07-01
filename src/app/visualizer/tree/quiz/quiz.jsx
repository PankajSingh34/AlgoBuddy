"use client";
import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const TreeQuiz = () => {
  const questions = [
    {
      question: "Which of the following best describes a Tree data structure?",
      options: [
        "A linear sequence of elements stored contiguously in memory",
        "A hierarchical structure consisting of nodes connected by edges, without cycles",
        "A collection of nodes where each node has exactly two children",
        "A graph where any two nodes are connected by multiple paths"
      ],
      correctAnswer: 1,
      explanation: "A tree is a non-linear, hierarchical data structure consisting of a root node and subtrees of children, with no cycles or loops."
    },
    {
      question: "In a tree, what is a 'Leaf' node?",
      options: [
        "The very top node of the tree",
        "A node that has exactly one child",
        "A node that has no children",
        "Any node that is not the root"
      ],
      correctAnswer: 2,
      explanation: "A leaf node (or external node) is a node that does not have any children."
    },
    {
      question: "What is the 'Depth' of a node in a tree?",
      options: [
        "The number of edges from the node to the deepest leaf",
        "The number of edges from the root to the node",
        "The total number of nodes in the tree",
        "The number of children the node has"
      ],
      correctAnswer: 1,
      explanation: "The depth of a node is defined as the number of edges along the unique path from the root node to that node."
    },
    {
      question: "What defines a 'Binary Tree'?",
      options: [
        "Every node must have exactly two children",
        "Every node can have at most two children",
        "The values in the left subtree are smaller than the parent",
        "The tree must be perfectly balanced"
      ],
      correctAnswer: 1,
      explanation: "A Binary Tree is a tree data structure in which each node has at most two children, referred to as the left child and the right child."
    },
    {
      question: "Which of the following describes a 'Full Binary Tree'?",
      options: [
        "All levels are completely filled except possibly for the last level",
        "Every internal node has exactly two children, and all leaves are at the same level",
        "Every node has either 0 or 2 children",
        "The height of the left and right subtrees of every node differ by at most 1"
      ],
      correctAnswer: 2,
      explanation: "A Full Binary Tree is a binary tree in which every node has either zero or two children."
    },
    {
      question: "Which of the following describes a 'Complete Binary Tree'?",
      options: [
        "Every node has exactly two children",
        "Every level, except possibly the last, is completely filled, and all nodes are as far left as possible",
        "All leaves are at the same depth",
        "The tree has exactly 2^h - 1 nodes"
      ],
      correctAnswer: 1,
      explanation: "In a Complete Binary Tree, all levels are fully filled except the lowest one, which is filled from left to right."
    },
    {
      question: "What is the primary property of a Binary Search Tree (BST)?",
      options: [
        "All nodes must have exactly two children",
        "The left subtree contains values less than the parent, and the right subtree contains values greater than the parent",
        "The tree must always be perfectly balanced",
        "The root node always holds the maximum value"
      ],
      correctAnswer: 1,
      explanation: "A BST enforces the property that for every node, all values in its left subtree are smaller, and all values in its right subtree are greater."
    },
    {
      question: "Which tree traversal method visits nodes in the order: Left Subtree, Root, Right Subtree?",
      options: [
        "Preorder",
        "Inorder",
        "Postorder",
        "Level Order"
      ],
      correctAnswer: 1,
      explanation: "Inorder traversal visits the left subtree, then the root node, then the right subtree. In a BST, this traversal outputs values in sorted ascending order."
    },
    {
      question: "Which tree traversal method is often used to safely delete a tree from memory?",
      options: [
        "Inorder",
        "Preorder",
        "Postorder",
        "Level Order"
      ],
      correctAnswer: 2,
      explanation: "Postorder traversal visits the left subtree, right subtree, and then the root. It's ideal for deleting a tree because a node is deleted only after its children are deleted."
    },
    {
      question: "Level Order Traversal of a tree is equivalent to which graph algorithm?",
      options: [
        "Depth-First Search (DFS)",
        "Breadth-First Search (BFS)",
        "Dijkstra's Algorithm",
        "Prim's Algorithm"
      ],
      correctAnswer: 1,
      explanation: "Level order traversal explores the tree level by level, from top to bottom, left to right. This is exactly how Breadth-First Search (BFS) operates."
    },
    {
      question: "What is the worst-case time complexity for searching an element in a general (unbalanced) Binary Search Tree?",
      options: [
        "O(1)",
        "O(log N)",
        "O(N)",
        "O(N log N)"
      ],
      correctAnswer: 2,
      explanation: "In the worst case (e.g., when elements are inserted in sorted order), the BST degenerates into a linked list, making the search time O(N)."
    },
    {
      question: "What happens when you insert a new node into a standard Binary Search Tree?",
      options: [
        "It replaces the root node and pushes other nodes down",
        "It is always attached as a leaf node at the correct position according to BST rules",
        "It reorganizes the entire tree to stay balanced automatically",
        "It is inserted at the first available spot from left to right"
      ],
      correctAnswer: 1,
      explanation: "Standard BST insertion traverses down the tree based on comparisons and attaches the new node as a leaf at the correct position."
    },
    {
      question: "When deleting a node with TWO children in a Binary Search Tree, what is typically used to replace the deleted node?",
      options: [
        "The node's left child",
        "The node's right child",
        "The Inorder Successor or Inorder Predecessor",
        "A completely new random node"
      ],
      correctAnswer: 2,
      explanation: "To maintain the BST property, a node with two children is replaced by its Inorder Successor (the smallest node in the right subtree) or Inorder Predecessor."
    },
    {
      question: "What is the 'Lowest Common Ancestor' (LCA) of two nodes v and w in a tree?",
      options: [
        "The root of the tree",
        "The deepest node that has both v and w as descendants",
        "The node that is halfway between v and w",
        "The leaf node that is closest to both v and w"
      ],
      correctAnswer: 1,
      explanation: "The LCA of two nodes is the lowest (deepest) node in the tree that has both nodes as descendants (where a node can be a descendant of itself)."
    },
    {
      question: "What does the 'Diameter' of a tree represent?",
      options: [
        "The number of leaf nodes in the tree",
        "The longest path between any two nodes in the tree",
        "The maximum number of children any node has",
        "The total number of edges in the tree"
      ],
      correctAnswer: 1,
      explanation: "The diameter (or width) of a tree is the length of the longest path between any two nodes. This path may or may not pass through the root."
    },
    {
      question: "Why are self-balancing Binary Search Trees (like AVL or Red-Black trees) used?",
      options: [
        "To ensure the tree always uses the minimum amount of memory",
        "To guarantee that the tree is always a Perfect Binary Tree",
        "To maintain O(log N) time complexity for search, insertion, and deletion operations",
        "To allow duplicate values to be stored easily"
      ],
      correctAnswer: 2,
      explanation: "Self-balancing trees automatically adjust their structure during insertions and deletions to prevent degenerating into a list, guaranteeing O(log N) operations."
    },
    {
      question: "What is the time complexity to find the Minimum value in a valid Binary Search Tree?",
      options: [
        "O(1)",
        "O(log N) on average, O(N) in worst case",
        "O(N) always",
        "O(N log N)"
      ],
      correctAnswer: 1,
      explanation: "The minimum value is found by continuously traversing to the left child. This takes O(h) time, which is O(log N) for balanced trees and O(N) for degenerate trees."
    },
    {
      question: "Which data structure is best suited for implementing a Trie (Prefix Tree)?",
      options: [
        "An array",
        "A stack",
        "A specialized tree where nodes represent characters of a string",
        "A priority queue"
      ],
      correctAnswer: 2,
      explanation: "A Trie is a specialized n-ary tree used for storing strings, where each node represents a character, making prefix searches very efficient."
    }
  ];

  return <QuizEngine title="Tree Data Structure Quiz" questions={questions} />;
};

export default TreeQuiz;
