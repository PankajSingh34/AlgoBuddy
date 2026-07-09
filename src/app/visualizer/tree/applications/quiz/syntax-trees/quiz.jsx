"use client";

import QuizEngine from "@/app/components/ui/QuizEngine";

const questions = [
  {
    question: "What is a Syntax Tree primarily used for?",
    options: [
      "Sorting data",
      "Representing the syntactic structure of source code",
      "Compressing files",
      "Managing databases"
    ],
    correctAnswer: 1,
    explanation:
      "A Syntax Tree represents the grammatical structure of source code according to a programming language's syntax."
  },
  {
    question: "Another common name for a Syntax Tree is:",
    options: [
      "Binary Heap",
      "Abstract Syntax Tree (AST)",
      "Trie",
      "AVL Tree"
    ],
    correctAnswer: 1,
    explanation:
      "Syntax Trees are commonly referred to as Abstract Syntax Trees (ASTs)."
  },
  {
    question: "Which software component typically generates a Syntax Tree?",
    options: [
      "Compiler Parser",
      "Database Engine",
      "Operating System",
      "Web Browser"
    ],
    correctAnswer: 0,
    explanation:
      "The parser phase of a compiler constructs the Abstract Syntax Tree after lexical analysis."
  },
  {
    question: "In a Syntax Tree, internal nodes usually represent:",
    options: [
      "Variables only",
      "Operators or language constructs",
      "Comments",
      "Memory addresses"
    ],
    correctAnswer: 1,
    explanation:
      "Internal nodes represent operations, expressions, or programming language constructs."
  },
  {
    question: "Leaf nodes in a Syntax Tree generally represent:",
    options: [
      "Operators",
      "Operands such as identifiers or constants",
      "Functions",
      "Loops"
    ],
    correctAnswer: 1,
    explanation:
      "Leaf nodes usually store identifiers, literals, or constants."
  },
  {
    question: "Which compiler phase uses the Syntax Tree for semantic analysis?",
    options: [
      "Lexical Analysis",
      "Semantic Analysis",
      "Linking",
      "Loading"
    ],
    correctAnswer: 1,
    explanation:
      "Semantic analysis operates on the AST to perform type checking and validate program correctness."
  },
  {
    question: "Syntax Trees are widely used in:",
    options: [
      "Compilers and Interpreters",
      "Computer Networks",
      "Operating Systems",
      "Database Indexing"
    ],
    correctAnswer: 0,
    explanation:
      "Compilers and interpreters rely on Syntax Trees for code analysis and optimization."
  },
  {
    question: "Which compiler phase typically follows Syntax Tree construction?",
    options: [
      "Semantic Analysis",
      "Power Management",
      "Memory Allocation",
      "File Compression"
    ],
    correctAnswer: 0,
    explanation:
      "After parsing builds the AST, semantic analysis verifies the program before optimization."
  },
  {
    question: "What is one major advantage of using an Abstract Syntax Tree?",
    options: [
      "It reduces program size automatically.",
      "It simplifies code analysis and optimization.",
      "It stores data permanently.",
      "It replaces machine code."
    ],
    correctAnswer: 1,
    explanation:
      "ASTs provide a structured representation that makes optimization and code generation easier."
  },
  {
    question: "Syntax Trees are commonly used in:",
    options: [
      "Compiler Design",
      "Code Optimization",
      "Static Code Analysis",
      "All of the above"
    ],
    correctAnswer: 3,
    explanation:
      "Syntax Trees are fundamental in compiler design, optimization, and static analysis tools."
  }
];

export default function Quiz() {
  return (
    <QuizEngine
      title="Syntax Trees Quiz"
      questions={questions}
    />
  );
}