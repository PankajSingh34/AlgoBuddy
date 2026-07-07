"use client";

import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const questions = [
  {
    question: "Where is a new node inserted when performing insertion at the beginning of a linked list?",
    options: [
      "After the last node",
      "Before the current head node",
      "At the middle node",
      "After the second node"
    ],
    correctAnswer: 1,
    explanation:
      "The new node becomes the new head and points to the previous head node."
  },
  {
    question: "What is the time complexity of inserting a node at the beginning of a singly linked list?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
    correctAnswer: 0,
    explanation:
      "Only the head pointer needs to be updated, making insertion constant time."
  },
  {
    question: "To insert a node at the end of a singly linked list without a tail pointer, what must be done first?",
    options: [
      "Reverse the list",
      "Traverse to the last node",
      "Delete the head",
      "Sort the list"
    ],
    correctAnswer: 1,
    explanation:
      "The last node must be found before linking the new node."
  },
  {
    question: "What is the time complexity of inserting at the end of a singly linked list without a tail pointer?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
    correctAnswer: 2,
    explanation:
      "Traversal to the last node requires O(n) time."
  },
  {
    question: "Before inserting a node after a given node, what must be updated first?",
    options: [
      "Delete the next node",
      "Set newNode.next to current.next",
      "Change head pointer",
      "Reverse the list"
    ],
    correctAnswer: 1,
    explanation:
      "The new node must first point to the next node before updating the current node's pointer."
  },
  {
    question: "Which pointer is updated last while inserting after a node?",
    options: [
      "head",
      "tail",
      "current.next",
      "newNode.next"
    ],
    correctAnswer: 2,
    explanation:
      "After assigning newNode.next, current.next is updated to complete the insertion."
  },
  {
    question: "What happens if insertion is attempted after a NULL node?",
    options: [
      "Insertion succeeds",
      "A runtime error or invalid operation occurs",
      "The node becomes head",
      "The list is automatically resized"
    ],
    correctAnswer: 1,
    explanation:
      "A valid node reference is required before inserting after it."
  },
  {
    question: "Which linked list allows insertion before a given node without traversing from the head?",
    options: [
      "Singly Linked List",
      "Circular Queue",
      "Doubly Linked List",
      "Stack"
    ],
    correctAnswer: 2,
    explanation:
      "A doubly linked list provides access to the previous node using the prev pointer."
  },
  {
    question: "If a linked list is empty, where does the first inserted node become?",
    options: [
      "Tail only",
      "Head only",
      "Both head and tail",
      "Middle node"
    ],
    correctAnswer: 2,
    explanation:
      "In an empty list, the first node acts as both head and tail."
  },
  {
    question: "Which insertion operation is generally the fastest in a linked list?",
    options: [
      "Insertion at beginning",
      "Insertion at end without tail",
      "Insertion in sorted position",
      "Insertion at middle after traversal"
    ],
    correctAnswer: 0,
    explanation:
      "Insertion at the beginning requires only updating the head pointer, resulting in O(1) complexity."
  }
];

export default function Quiz() {
  return (
    <QuizEngine
      title="Linked List Insertion Quiz"
      questions={questions}
    />
  );
}