"use client";

import Link from "next/link";
import { Layers, GitBranch, Terminal, HelpCircle, ArrowRight, Search, Network, Brain, TreePine, Hash, Cpu } from "lucide-react";
import { motion } from "framer-motion";

export default function QuizPage() {
  
  const quizzes = [
    {
      title: "Searching Quiz",
      description: "Practice all searching algorithms including liner search, binary search, ternary search, etc.",
      href: "/visualizer/array/searching/quiz",
      icon: Search,
      filename: "searching_quiz.js",
      cardBorder: "border-cyan-500/20 dark:border-cyan-500/30",
      topBarBg: "bg-cyan-500/10 dark:bg-cyan-500/20",
      iconStyle: "bg-cyan-500/10 border border-cyan-500/20 dark:border-cyan-500/30 text-cyan-600 dark:text-cyan-400",
      btnBg: "bg-cyan-600 hover:bg-cyan-700 dark:bg-cyan-500 dark:hover:bg-cyan-600",
    },
    {
      title: "Sorting Quiz",
      description: "Practice all sorting algorithms including Bubble, Selection, Insertion, Merge, Quick, Heap, Radix, and Counting Sort.",
      href: "/visualizer/array/sorting/quiz",
      icon: Terminal,
      filename: "sorting_quiz.js",
      cardBorder: "border-indigo-500/20 dark:border-indigo-500/30",
      topBarBg: "bg-indigo-500/10 dark:bg-indigo-500/20",
      iconStyle: "bg-indigo-500/10 border border-indigo-500/20 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-400",
      btnBg: "bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600",
    },
    {
      title: "Array-Interview Patterns Quiz",
      description: "Practice all Interview Patterns algorithms including Sliding Window, Two Pointers.",
      href: "/visualizer/array/Interview-Patterns/quiz",
      icon: Terminal,
      filename: "Interview-Patterns_quiz.js",
      cardBorder: "border-indigo-500/20 dark:border-indigo-500/30",
      topBarBg: "bg-indigo-500/10 dark:bg-indigo-500/20",
      iconStyle: "bg-indigo-500/10 border border-indigo-500/20 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-400",
      btnBg: "bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600",
    },
    {
      title: "Recursion Quiz",
      description: "Practice all recursion topics.",
      href: "/visualizer/recursion/quiz",
      icon: GitBranch,
      filename: "recursion_quiz.js",
      cardBorder: "border-violet-500/20 dark:border-violet-500/30",
      topBarBg: "bg-violet-500/10 dark:bg-violet-500/20",
      iconStyle: "bg-violet-500/10 border border-violet-500/20 dark:border-violet-500/30 text-violet-600 dark:text-violet-400",
      btnBg: "bg-violet-600 hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-600",
    },
    {
      title: "Stack Operations Quiz",
      description: "Test your understanding of Push & Pop, Peek, Is Empty, and Is Full operations.",
      href: "/visualizer/stack/quiz",
      icon: Layers,
      filename: "stack_operations_quiz.js",
      cardBorder: "border-fuchsia-500/20 dark:border-fuchsia-500/30",
      topBarBg: "bg-fuchsia-500/10 dark:bg-fuchsia-500/20",
      iconStyle: "bg-fuchsia-500/10 border border-fuchsia-500/20 dark:border-fuchsia-500/30 text-fuchsia-600 dark:text-fuchsia-400",
      btnBg: "bg-fuchsia-600 hover:bg-fuchsia-700 dark:bg-fuchsia-500 dark:hover:bg-fuchsia-600",
    },
    {
      title: "Polish Notation Evaluation Quiz",
      description: "Test your understanding of Prefix and Postfix Expression Evaluation.",
      href: "/visualizer/stack/polish/quiz",
      icon: HelpCircle,
      filename: "polish_notation_quiz.js",
      cardBorder: "border-blue-500/20 dark:border-blue-500/30",
      topBarBg: "bg-blue-500/10 dark:bg-blue-500/20",
      iconStyle: "bg-blue-500/10 border border-blue-500/20 dark:border-blue-500/30 text-blue-600 dark:text-blue-400",
      btnBg: "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600",
    },
    {
      title: "Implementation Quiz",
      description: "Practice Stack implementation using Array and Linked List.",
      href: "/visualizer/stack/implementation/quiz",
      icon: Layers,
      filename: "stack_impl_quiz.js",
      cardBorder: "border-emerald-500/20 dark:border-emerald-500/30",
      topBarBg: "bg-emerald-500/10 dark:bg-emerald-500/20",
      iconStyle: "bg-emerald-500/10 border border-emerald-500/20 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400",
      btnBg: "bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600",
    },
    {
      title: "Monotonic Stack Quiz",
      description: "Practice Largest Rectangle in Histogram.",
      href: "/visualizer/stack/monotonic/quiz",
      icon: Layers,
      filename: "monotonic_stack_quiz.js",
      cardBorder: "border-teal-500/20 dark:border-teal-500/30",
      topBarBg: "bg-teal-500/10 dark:bg-teal-500/20",
      iconStyle: "bg-teal-500/10 border border-teal-500/20 dark:border-teal-500/30 text-teal-600 dark:text-teal-400",
      btnBg: "bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600",
    },
    {
      title: "Queue Operations Quiz",
      description: "Test your understanding of Enqueue & Dequeue, Peek Front, Is Empty, and Is Full operations.",
      href: "/visualizer/queue/operations/quiz",
      icon: Layers,
      filename: "queue_operations_quiz.js",
      cardBorder: "border-teal-500/20 dark:border-teal-500/30",
      topBarBg: "bg-fuchsia-500/10 dark:bg-fuchsia-500/20",
      iconStyle: "bg-fuchsia-500/10 border border-fuchsia-500/20 dark:border-fuchsia-500/30 text-fuchsia-600 dark:text-fuchsia-400",
      btnBg: "bg-fuchsia-600 hover:bg-fuchsia-700 dark:bg-fuchsia-500 dark:hover:bg-fuchsia-600",
    },
    {
      title: "Queue Types Quiz",
      description:
        "Practice Single Ended Queue, Double Ended Queue, Circular Queue, and Priority Queue concepts.",
      href: "/visualizer/queue/types/quiz",
      icon: Layers,
      filename: "queue_types_quiz.js",
      cardBorder: "border-orange-500/20 dark:border-orange-500/30",
      topBarBg: "bg-orange-500/10 dark:bg-orange-500/20",
      iconStyle:
        "bg-orange-500/10 border border-orange-500/20 dark:border-orange-500/30 text-orange-600 dark:text-orange-400",
      btnBg:
        "bg-orange-600 hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-600",
    },
    {
      title: "Queue Implementation Quiz",
      description:
        "Practice Queue implementations using Arrays and Linked Lists.",
      href: "/visualizer/queue/implementation/quiz",
      icon: Layers,
      filename: "queue_implementation_quiz.js",
      cardBorder: "border-emerald-500/20 dark:border-emerald-500/30",
      topBarBg: "bg-emerald-500/10 dark:bg-emerald-500/20",
      iconStyle:
        "bg-emerald-500/10 border border-emerald-500/20 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400",
      btnBg:
        "bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600",
    },
    {
      title: "Linked List Types Quiz",
      description:
        "Practice Singly, Doubly, Circular Singly, and Circular Doubly Linked List concepts.",
      href: "/visualizer/linkedlist/types/quiz",
      icon: Layers,
      filename: "linked_list_types_quiz.js",
      cardBorder: "border-blue-500/20 dark:border-blue-500/30",
      topBarBg: "bg-blue-500/10 dark:bg-blue-500/20",
      iconStyle:
        "bg-blue-500/10 border border-blue-500/20 dark:border-blue-500/30 text-blue-600 dark:text-blue-400",
      btnBg:
        "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600",
    },
    {
      title: "Linked List Operations Quiz",
      description:
        "Practice Linked List operations including Insertion, Deletion, Search, Traversal, Reverse, and Finding Middle Node.",
      href: "/visualizer/linkedlist/operations/quiz",
      icon: Layers,
      filename: "linked_list_operations_quiz.js",
      cardBorder: "border-blue-500/20 dark:border-blue-500/30",
      topBarBg: "bg-blue-500/10 dark:bg-blue-500/20",
      iconStyle:
        "bg-blue-500/10 border border-blue-500/20 dark:border-blue-500/30 text-blue-600 dark:text-blue-400",
      btnBg:
        "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600",
    },
    {
      title: "Binary Tree Quiz",
      description: "Practice Binary Tree Structure & Properties and Types.",
      href: "/visualizer/tree/binaryTree/quiz",
      filename: "binary_tree_quiz.js",
      icon: Layers,
      cardBorder: "border-green-500/20 dark:border-green-500/30",
      topBarBg: "bg-green-500/10 dark:bg-green-500/20",
      iconStyle:
        "bg-green-500/10 border border-green-500/20 dark:border-green-500/30 text-green-600 dark:text-green-400",
      btnBg:
        "bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600",
    },
    {
      title: "Binary Search Tree Quiz",
      description: "Practice BST insertion, deletion, searching, traversals, and AVL balancing.",
      href: "/visualizer/tree/bst/quiz",
      filename: "binary_search_tree_quiz.js",
      icon: Layers,
      cardBorder: "border-emerald-500/20 dark:border-emerald-500/30",
      topBarBg: "bg-emerald-500/10 dark:bg-emerald-500/20",
      iconStyle:
        "bg-emerald-500/10 border border-emerald-500/20 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400",
      btnBg:
        "bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600",
    },
    {
      title: "Tree Traversal Quiz",
      description:
        "Practice Pre-order, In-order, Post-order, and Level-order traversal algorithms.",
      href: "/visualizer/tree/traversing/quiz",
      filename: "tree_traversal_quiz.js",
      icon: Layers,
      cardBorder: "border-lime-500/20 dark:border-lime-500/30",
      topBarBg: "bg-lime-500/10 dark:bg-lime-500/20",
      iconStyle:
        "bg-lime-500/10 border border-lime-500/20 dark:border-lime-500/30 text-lime-600 dark:text-lime-400",
      btnBg:
        "bg-lime-600 hover:bg-lime-700 dark:bg-lime-500 dark:hover:bg-lime-600",
    },
    {
      title: "Advanced Tree Quiz",
      description:
        "Practice AVL, Red-Black Tree, B-Tree, B+ Tree, Segment Tree, Fenwick Tree, Trie, and Heap Tree concepts.",
      href: "/visualizer/tree/advanced/quiz",
      filename: "advanced_tree_quiz.js",
      icon: Layers,
      cardBorder: "border-emerald-500/20 dark:border-emerald-500/30",
      topBarBg: "bg-emerald-500/10 dark:bg-emerald-500/20",
      iconStyle:
        "bg-emerald-500/10 border border-emerald-500/20 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400",
      btnBg:
        "bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600",
    },
    {
      title: "Tree Applications Quiz",
      description:
        "Practice Heap, Heap Sort, Huffman Coding, Decision Trees, and Syntax Trees.",
      href: "/visualizer/tree/applications/quiz",
      filename: "tree_applications_quiz.js",
      icon: Layers,
      cardBorder: "border-emerald-500/20 dark:border-emerald-500/30",
      topBarBg: "bg-emerald-500/10 dark:bg-emerald-500/20",
      iconStyle:
        "bg-emerald-500/10 border border-emerald-500/20 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400",
      btnBg:
        "bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600",
    },
    {
      title: "HashMap Operation Quiz",
      description:
        "Practice HashMap insertion, searching, and deletion operations.",
      href: "/visualizer/hashmap/operations/quiz",
      filename: "hashmap_quiz.js",
      icon: Hash,
      cardBorder: "border-violet-500/20 dark:border-violet-500/30",
      topBarBg: "bg-violet-500/10 dark:bg-violet-500/20",
      iconStyle:
        "bg-violet-500/10 border border-violet-500/20 dark:border-violet-500/30 text-violet-600 dark:text-violet-400",
      btnBg:
        "bg-violet-600 hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-600",
    },
    {
      title: "Graph Representation Quiz",
      description:
        "Practice Adjacency Matrix and Adjacency List representations.",
      href: "/visualizer/graph/representation/quiz",
      filename: "graph_representation_quiz.js",
      icon: Network,
      cardBorder: "border-cyan-500/20 dark:border-cyan-500/30",
      topBarBg: "bg-cyan-500/10 dark:bg-cyan-500/20",
      iconStyle:
        "bg-cyan-500/10 border border-cyan-500/20 dark:border-cyan-500/30 text-cyan-600 dark:text-cyan-400",
      btnBg:
        "bg-cyan-600 hover:bg-cyan-700 dark:bg-cyan-500 dark:hover:bg-cyan-600",
    },
    {
      title: "Graph Traversal Quiz",
      description:
        "Practice Breadth-First Search (BFS) and Depth-First Search (DFS).",
      href: "/visualizer/graph/traversal/quiz",
      filename: "graph_traversal_quiz.js",
      icon: Network,
      cardBorder: "border-sky-500/20 dark:border-sky-500/30",
      topBarBg: "bg-sky-500/10 dark:bg-sky-500/20",
      iconStyle:
        "bg-sky-500/10 border border-sky-500/20 dark:border-sky-500/30 text-sky-600 dark:text-sky-400",
      btnBg:
        "bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-600",
    },
    {
      title: "Graph Algorithms Quiz",
      description:
        "Practice Dijkstra's, Bellman-Ford, Floyd-Warshall, Prim's, Kruskal's, Topological Sort, and Kosaraju's algorithms.",
      href: "/visualizer/graph/algorithms/quiz",
      filename: "graph_algorithms_quiz.js",
      icon: Network,
      cardBorder: "border-indigo-500/20 dark:border-indigo-500/30",
      topBarBg: "bg-indigo-500/10 dark:bg-indigo-500/20",
      iconStyle:
        "bg-indigo-500/10 border border-indigo-500/20 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-400",
      btnBg:
        "bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600",
    },
    {
      title: "Dynamic Programming Quiz",
      description:
        "Test your understanding of DP concepts including Memoization, Tabulation, Knapsack, and LCS.",
      href: "/visualizer/dp/quiz",
      icon: Brain,
      filename: "dynamic_programming_quiz.js",
      cardBorder: "border-rose-500/20 dark:border-rose-500/30",
      topBarBg: "bg-rose-500/10 dark:bg-rose-500/20",
      iconStyle:
        "bg-rose-500/10 border border-rose-500/20 dark:border-rose-500/30 text-rose-600 dark:text-rose-400",
      btnBg:
        "bg-rose-600 hover:bg-rose-700 dark:bg-rose-500 dark:hover:bg-rose-600",
    },
    {
      title: "Bit Manipulation Quiz",
      description:
        "Test your understanding of binary representations, bitwise operators (&, |, ^, ~, <<, >>), setting/clearing/toggling bits, power of two, Kernighan's algorithm, and bitmasking.",
      href: "/visualizer/bit-manipulation/quiz",
      icon: Cpu,
      filename: "bit_manipulation_quiz.js",
      cardBorder: "border-violet-500/20 dark:border-violet-500/30",
      topBarBg: "bg-violet-500/10 dark:bg-violet-500/20",
      iconStyle:
        "bg-violet-500/10 border border-violet-500/20 dark:border-violet-500/30 text-violet-600 dark:text-violet-400",
      btnBg:
        "bg-violet-600 hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-600",
    },
    {
      title: "Sliding Window Quiz",
      description:
        "Test your understanding of the sliding window technique, fixed vs variable size windows, and contiguous subarrays.",
      href: "/visualizer/array/Interview-Patterns/quiz/slidingWindow",
      icon: Terminal,
      filename: "sliding_window_quiz.js",
      cardBorder: "border-cyan-500/20 dark:border-cyan-500/30",
      topBarBg: "bg-cyan-500/10 dark:bg-cyan-500/20",
      iconStyle:
        "bg-cyan-500/10 border border-cyan-500/20 dark:border-cyan-500/30 text-cyan-600 dark:text-cyan-400",
      btnBg:
        "bg-cyan-600 hover:bg-cyan-700 dark:bg-cyan-500 dark:hover:bg-cyan-600",
    },
  ];
  return (
    <div className="min-h-screen bg-white dark:bg-[#1c1d1f] text-[var(--udemy-text)] dark:text-white transition-colors duration-300 pb-20">
      
      {/* Grid of Quizzes */}
      <div className="max-w-[1100px] mx-auto px-4 pt-6">
        <div className="mb-10">
          <h1 className="font-mono text-4xl md:text-5xl font-bold text-surface-900 dark:text-white">
            <span className="text-violet-500">&gt;</span>{" "}
            Quiz Portal
            <span className="animate-pulse text-violet-500">_</span>
          </h1>
        </div>
        <div className="grid md:grid-cols-2 gap-6 items-stretch">
          {quizzes.map((quiz, index) => {
            const IconComponent = quiz.icon;
            return (
              <motion.div
                key={quiz.href}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -6, scale: 1.015 }}
                whileTap={{ scale: 0.985 }}
                className={`group flex flex-col h-full rounded-2xl border ${quiz.cardBorder} bg-white dark:bg-[#1a1a1a] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300`}
              >
                {/* Terminal command execution style top bar */}
                <div className={`flex items-center justify-between px-4 py-2.5 ${quiz.topBarBg} border-b ${quiz.cardBorder}`}>
                  <div className="flex items-center gap-1.5 font-mono text-[11px] text-surface-600 dark:text-surface-300">
                    <span className="text-violet-500 font-bold">$</span>
                    <span>node {quiz.filename}</span>
                  </div>
                </div>

                {/* Main content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div className="flex items-start gap-4 mb-6">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center p-2.5 flex-shrink-0 ${quiz.iconStyle}`}>
                      <IconComponent size={24} />
                    </div>
                    <div>
                      <h2 className="text-[20px] font-extrabold text-surface-900 dark:text-white group-hover:text-[var(--color-primary)] dark:group-hover:text-[var(--color-primary-light)] transition-colors">
                        {quiz.title}
                      </h2>
                      <p className="text-[14px] text-surface-500 dark:text-surface-400 font-medium mt-0.5">
                        Interactive Challenge
                      </p>
                    </div>
                  </div>

                  <p className="text-[14px] text-surface-600 dark:text-surface-300 leading-relaxed mb-6">
                    {quiz.description}
                  </p>

                  <Link href={quiz.href} className="block mt-auto w-full">
                    <button className={`w-full h-11 rounded-xl ${quiz.btnBg} text-white font-bold text-[14px] flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all`}>
                      <span>Start Quiz</span>
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
