"use client";
import React, { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { createPortal } from "react-dom";

// Find DOM element across the document
const findElement = (selector, buttonText) => {
  if (typeof document === "undefined") return null;

  // Restrict search to visualizer section to prevent targeting elements in theory, code, or MCQ sections
  const root = document.querySelector(".tour-step-animation-section");
  if (!root) return null;

  // Dedicated speed control finder
  const findSpeedElement = (rootEl) => {
    // 1. Look for native range inputs (used in standard playback controls)
    const range = rootEl.querySelector('input[type="range"]');
    if (range) return range;

    // 2. Look for explicit container containing "Speed:" text (used in sorting/searching visualizers)
    const divs = Array.from(rootEl.querySelectorAll("div, span, p"));
    const speedContainer = divs.find(
      (d) =>
        d.textContent &&
        d.textContent.trim().toLowerCase().startsWith("speed:") &&
        d.children.length > 0
    );
    if (speedContainer) return speedContainer;

    // 3. Fallback: Find the plus button parent container
    const buttons = Array.from(rootEl.querySelectorAll("button"));
    const plusBtn = buttons.find((b) => b.textContent.trim() === "+");
    if (plusBtn) return plusBtn.parentElement || plusBtn;

    return null;
  };

  if (selector === "speed-controls") {
    const speedEl = findSpeedElement(root);
    if (speedEl) return speedEl;
  }

  if (selector && selector !== "speed-controls") {
    const parts = selector.split(",").map((s) => s.trim());
    for (const part of parts) {
      const el = root.querySelector(part);
      if (el) return el;
    }
  }

  if (buttonText) {
    const parts = buttonText.split(",").map((s) => s.trim().toLowerCase());
    const buttons = Array.from(root.querySelectorAll("button"));
    const found = buttons.find((btn) => {
      const text = btn.textContent.trim().toLowerCase();
      const inner = btn.innerText?.toLowerCase() || "";
      return parts.some(part => text.includes(part) || inner.includes(part));
    });
    if (found) return found;
  }

  return null;
};


// Steps map based on visualizer sub-routes
const getTourSteps = (pathname) => {
  const path = pathname.toLowerCase();
  let coreSteps = [];

  if (path.includes("/array/comparison")) {
    coreSteps = [
      {
        title: "Select Algorithm A",
        text: "Choose the first algorithm for side-by-side performance comparison.",
        selector: "select#algo-select-a",
      },
      {
        title: "Select Algorithm B",
        text: "Choose the second algorithm to compare against Algorithm A.",
        selector: "select#algo-select-b",
      },
      {
        title: "Adjust Array Size",
        text: "Drag the slider to increase or decrease the number of elements in the test dataset.",
        selector: "input#size-slider",
      },
      {
        title: "Generate Dataset",
        text: "Click 'Generate Random Array' to create a new random set of numbers.",
        buttonText: "Generate Random Array",
      },
      {
        title: "Use Custom Array",
        text: "Type custom comma-separated numbers and click 'Use Array' to use custom data.",
        buttonText: "Use Array",
      },
      {
        title: "Start Comparison",
        text: "Click 'Start Comparison' (or Pause) to run both algorithms synchronously and compare their steps in real-time.",
        buttonText: "Start Comparison",
      },
      {
        title: "Reset Comparison",
        text: "Click 'Reset' to clear the current sorting state and restore the unsorted dataset.",
        buttonText: "Reset",
      },
      {
        title: "Adjust Simulation Speed",
        text: "Adjust the speed slider to control the playback speed of the comparison.",
        selector: "input#speed-slider",
      }
    ];
  } else if (path.includes("/array/slidingwindow")) {
    coreSteps = [
      {
        title: "Select Problem",
        text: "Choose which sliding window problem variant (fixed or variable size) you want to visualize.",
        selector: "select",
      },
      {
        title: "Input Data",
        text: "Type custom numbers or a string for the sliding window algorithm to process.",
        selector: "input#inputData",
      },
      {
        title: "Window Size / Target",
        text: "Define the window size (K) or target value/sum for the window checks.",
        selector: "input#targetValue",
      },
      {
        title: "Go (Run)",
        text: "Click 'Go' to start the sliding window traversal simulation.",
        buttonText: "Go",
      },
      {
        title: "Adjust Speed",
        text: "Control the speed of the window's sliding animation.",
        selector: "speed-controls",
      },
      {
        title: "Reset",
        text: "Click 'Reset' to stop the visualization and restore initial input conditions.",
        buttonText: "Reset",
      }
    ];
  } else if (path.includes("/linearsearch") || path.includes("/binarysearch")) {
    coreSteps = [
      {
        title: "Input Elements",
        text: "Enter a comma-separated list of values (Binary Search requires elements to be sorted!).",
        selector: "input#arrayElements",
      },
      {
        title: "Generate Dataset",
        text: "Click 'Generate Random Array' or 'Random' to fill the search space with random sorted elements.",
        buttonText: "Generate Random Array",
      },
      {
        title: "Target Value",
        text: "Enter the target search value you want the algorithm to find.",
        selector: "input#target",
      },
      {
        title: "Go (Run Search)",
        text: "Click 'Go' to run the step-by-step search visualization.",
        buttonText: "Go",
      },
      {
        title: "Adjust Speed",
        text: "Control the search animation speed.",
        selector: "speed-controls",
      },
      {
        title: "Reset Search",
        text: "Click 'Reset' to clear search pointers and start over.",
        buttonText: "Reset",
      }
    ];
  } else if (path.includes("sort")) {
    coreSteps = [
      {
        title: "Generate Random Array",
        text: "Click 'Generate Random Array' to build a new random unsorted dataset.",
        buttonText: "Generate Random Array",
      },
      {
        title: "Use Custom Array",
        text: "Type custom comma-separated integers and click 'Use Array' to load your custom numbers.",
        buttonText: "Use Array",
      },
      {
        title: "Start Sorting",
        text: "Click 'Start Sort' (e.g., Start Bubble Sort, Start Merge Sort) to begin the sorting visualizer.",
        buttonText: "Sort",
      },
      {
        title: "Adjust Speed",
        text: "Drag the slider to speed up comparisons or slow them down to examine step logic.",
        selector: "speed-controls",
      },
      {
        title: "Reset Visualizer",
        text: "Click 'Reset All' (or Reset) to abort sorting and restore the unsorted array.",
        buttonText: "Reset",
      }
    ];
  } else if (path.includes("/stack/polish")) {
    coreSteps = [
      {
        title: "Expression Input",
        text: "Type the Infix mathematical expression you wish to convert (e.g., A+B*C).",
        selector: 'input[type="text"]',
      },
      {
        title: "Convert Infix",
        text: "Click 'Convert' to parse tokens and visualize the postfix/prefix conversion logic.",
        buttonText: "Convert",
      },
      {
        title: "Adjust Speed",
        text: "Speed up or slow down stack expression parsing steps.",
        selector: "speed-controls",
      },
      {
        title: "Reset Parser",
        text: "Click 'Reset' to clear the conversion history and the stack.",
        buttonText: "Reset",
      }
    ];
  } else if (path.includes("/stack/monotonic")) {
    coreSteps = [
      {
        title: "Heights Input",
        text: "Enter comma-separated height values of the histogram bars.",
        selector: "input#inputData",
      },
      {
        title: "Go (Run Solver)",
        text: "Click 'Go' to compute the largest rectangle area using a monotonic stack.",
        buttonText: "Go",
      },
      {
        title: "Adjust Speed",
        text: "Control the speed of stack height comparisons.",
        selector: "speed-controls",
      },
      {
        title: "Reset Heights",
        text: "Click 'Reset' to clear the histogram bars.",
        buttonText: "Reset",
      }
    ];
  } else if (path.includes("/stack")) {
    coreSteps = [
      {
        title: "Define Stack Capacity",
        text: "Set a maximum capacity (1-10) to initialize the physical stack structure.",
        selector: 'input[placeholder*="capacity"]',
      },
      {
        title: "Set Capacity",
        text: "Click 'Set Capacity' to create the stack boundaries.",
        buttonText: "Set Capacity",
      },
      {
        title: "Value Input",
        text: "Type a value in the input field to prepare it for stack operations.",
        selector: 'input[type="text"]',
      },
      {
        title: "Push (Insert)",
        text: "Click 'Push' to add your entered value onto the top of the stack (LIFO - Last In, First Out).",
        buttonText: "Push",
      },
      {
        title: "Pop (Remove)",
        text: "Click 'Pop' to remove the top element from the stack.",
        buttonText: "Pop",
      },
      {
        title: "Peek (Inspect)",
        text: "Click 'Peek' to inspect the top element without removing it.",
        buttonText: "Peek",
      },
      {
        title: "IsEmpty Check",
        text: "Click 'IsEmpty' to check if the stack is currently empty.",
        buttonText: "IsEmpty",
      },
      {
        title: "IsFull Check",
        text: "Click 'IsFull' to check if the stack is at its maximum capacity.",
        buttonText: "IsFull",
      },
      {
        title: "Change Size",
        text: "Click 'Change Size' to resize the stack container boundaries (available when stack is empty).",
        buttonText: "Change Size",
      },
      {
        title: "Adjust Speed",
        text: "Slide to adjust the animation speed of stack operations.",
        selector: "speed-controls",
      },
      {
        title: "Reset Stack",
        text: "Click 'Reset' to clear all elements and start over.",
        buttonText: "Reset",
      }
    ];
  } else if (path.includes("/queue/types/deque")) {
    coreSteps = [
      {
        title: "Value Input",
        text: "Type a value to prepare for deque operations.",
        selector: 'input[type="text"]',
      },
      {
        title: "Enqueue Front",
        text: "Click 'Enqueue Front' to add the element at the front of the double-ended queue.",
        buttonText: "Enqueue Front",
      },
      {
        title: "Enqueue Rear",
        text: "Click 'Enqueue Rear' to add the element at the rear of the double-ended queue.",
        buttonText: "Enqueue Rear",
      },
      {
        title: "Dequeue Front",
        text: "Click 'Dequeue Front' to remove the front-most element from the deque.",
        buttonText: "Dequeue Front",
      },
      {
        title: "Dequeue Rear",
        text: "Click 'Dequeue Rear' to remove the rear-most element from the deque.",
        buttonText: "Dequeue Rear",
      },
      {
        title: "Peek Front",
        text: "Click 'Peek Front' to view the front element without removing it.",
        buttonText: "Peek Front",
      },
      {
        title: "Peek Rear",
        text: "Click 'Peek Rear' to view the rear element without removing it.",
        buttonText: "Peek Rear",
      },
      {
        title: "Adjust Speed",
        text: "Tune transition animations using the speed controls.",
        selector: "speed-controls",
      },
      {
        title: "Reset Deque",
        text: "Click 'Reset' to wipe all elements from the deque.",
        buttonText: "Reset",
      }
    ];
  } else if (path.includes("/queue")) {
    coreSteps = [
      {
        title: "Define Queue Capacity",
        text: "Set a maximum capacity (1-15) to initialize the physical queue structure.",
        selector: 'input[min="1"][max="15"]',
      },
      {
        title: "Priority Input",
        text: "Enter priority value (lower number = higher priority) for insertion.",
        selector: 'input[placeholder="Number"]',
      },
      {
        title: "Value Input",
        text: "Type a value in the input field to prepare it for queue operations.",
        selector: 'input[type="text"]',
      },
      {
        title: "Enqueue / Insert",
        text: "Add the element (and its priority, if applicable) to the queue.",
        buttonText: "Enqueue, Insert",
      },
      {
        title: "Dequeue / Extract",
        text: "Remove the element at the front (or the highest priority element).",
        buttonText: "Dequeue, Extract",
      },
      {
        title: "Peek element",
        text: "Inspect the front-most element without removing it.",
        buttonText: "Peek",
      },
      {
        title: "IsEmpty Check",
        text: "Click 'IsEmpty' to verify if the queue is empty.",
        buttonText: "IsEmpty",
      },
      {
        title: "IsFull Check",
        text: "Click 'IsFull' to check if queue capacity is maxed out.",
        buttonText: "IsFull",
      },
      {
        title: "Random Queue",
        text: "Click 'Random Queue' to populate the queue with random elements.",
        buttonText: "Random Queue",
      },
      {
        title: "Adjust Speed",
        text: "Adjust the animation speed using the playback controls.",
        selector: "speed-controls",
      },
      {
        title: "Reset Queue",
        text: "Click 'Reset' to clear all elements in the queue.",
        buttonText: "Reset",
      }
    ];
  } else if (path.includes("/linkedlist/operations/comparison") || path.includes("/linkedlist/operations/merge")) {
    coreSteps = [
      {
        title: "Generate List 1",
        text: "Click to generate a random sequence of nodes for the first linked list.",
        buttonText: "Generate List 1",
      },
      {
        title: "Generate List 2",
        text: "Click to generate a random sequence of nodes for the second linked list.",
        buttonText: "Generate List 2",
      },
      {
        title: "Compare / Merge Lists",
        text: "Click 'Compare Lists' or 'Merge Lists' to start the traversal logic animation.",
        buttonText: "List",
      },
      {
        title: "Reset All",
        text: "Click 'Reset All' to clear both linked lists and start over.",
        buttonText: "Reset",
      }
    ];
  } else if (path.includes("/linkedlist")) {
    coreSteps = [
      {
        title: "Value / Position Input",
        text: "Type a node value and target index/position in the input field.",
        selector: "input",
      },
      {
        title: "Insert Head",
        text: "Click 'Insert Head' to place the value at the beginning of the list.",
        buttonText: "Insert Head",
      },
      {
        title: "Insert Tail",
        text: "Click 'Insert Tail' to append the value to the end of the list.",
        buttonText: "Insert Tail",
      },
      {
        title: "Insert Position",
        text: "Click 'Insert at Position' (or 'Insert') to place your value at a specific list index.",
        buttonText: "Insert at Position",
      },
      {
        title: "Delete Head",
        text: "Click 'Delete Head' to remove the first node of the list.",
        buttonText: "Delete Head",
      },
      {
        title: "Delete Tail",
        text: "Click 'Delete Tail' to remove the last node of the list.",
        buttonText: "Delete Tail",
      },
      {
        title: "Delete Position",
        text: "Click 'Delete at Position' (or 'Delete') to remove a node at a specific index.",
        buttonText: "Delete at Position",
      },
      {
        title: "Add Node",
        text: "Click 'Add Node' to append or insert a node into the list.",
        buttonText: "Add Node",
      },
      {
        title: "Delete Last Node",
        text: "Click 'Delete Last Node' to remove the last node of the list.",
        buttonText: "Delete Last Node",
      },
      {
        title: "Reverse List",
        text: "Click 'Reverse' (or 'Reverse List') to invert all linked list pointer connections.",
        buttonText: "Reverse",
      },
      {
        title: "Generate List",
        text: "Click 'Generate List' to build a randomized linked list sequence.",
        buttonText: "Generate List",
      },
      {
        title: "Animate Traversal",
        text: "Click 'Animate Traversal' (or 'Traversal') to trace list node pointers.",
        buttonText: "Traversal",
      },
      {
        title: "Adjust Speed",
        text: "Control the speed of transition animations using the speed control.",
        selector: "speed-controls",
      },
      {
        title: "Reset List",
        text: "Click 'Reset' (or 'Reset All') to clear the linked list and start fresh.",
        buttonText: "Reset",
      }
    ];
  } else if (path.includes("/hashmap")) {
    coreSteps = [
      {
        title: "Enter Key",
        text: "Type a string key to map to a hash bucket.",
        selector: 'input[placeholder="Key"]',
      },
      {
        title: "Enter Value",
        text: "Type a value to associate with the key.",
        selector: 'input[placeholder="Value"]',
      },
      {
        title: "Key To Process",
        text: "Enter the key to search or delete from the hash buckets.",
        selector: 'input[placeholder*="Key to"]',
      },
      {
        title: "Insert Pair",
        text: "Click 'Insert' to calculate the hash index and store the key-value pair.",
        buttonText: "Insert",
      },
      {
        title: "Search Key",
        text: "Click 'Search' to hash the key and traverse its bucket list to locate the value.",
        buttonText: "Search",
      },
      {
        title: "Delete Key",
        text: "Click 'Delete' to remove the key-value node from the hash table.",
        buttonText: "Delete",
      },
      {
        title: "Reset Hash Table",
        text: "Click 'Reset' to clear all key-value entries.",
        buttonText: "Reset",
      }
    ];
  } else if (path.includes("/tree/advanced/dsu")) {
    coreSteps = [
      {
        title: "Number of Elements",
        text: "Type the number of set nodes to initialize.",
        selector: 'input[type="number"]',
      },
      {
        title: "MakeSet",
        text: "Click 'MakeSet' to build disjoint singleton tree nodes.",
        buttonText: "MakeSet",
      },
      {
        title: "Find Node",
        text: "Type node value and click 'Find' to trace elements up to their root representative.",
        buttonText: "Find",
      },
      {
        title: "Union Sets",
        text: "Type two nodes and click 'Union' to merge their parent sets using rank/size heuristic.",
        buttonText: "Union",
      },
      {
        title: "Full Optimizations",
        text: "Click 'Full Optimizations' to enable both path compression and union by rank.",
        buttonText: "Full Optimizations",
      },
      {
        title: "No Optimizations",
        text: "Click 'No Optimizations' to disable optimizations and observe pure linear tree lookups.",
        buttonText: "No Optimizations",
      },
      {
        title: "Adjust Speed",
        text: "Speed up or slow down find/union animation traces.",
        selector: "speed-controls",
      }
    ];
  } else if (path.includes("/tree/advanced/fenwick") || path.includes("/tree/advanced/segment") || path.includes("/tree/advanced/b-trees")) {
    coreSteps = [
      {
        title: "Configure Mode",
        text: "Switch modes (like Point Update, Range Query, or search modes) to change active operations.",
        selector: "button[class*='px-4']",
      },
      {
        title: "Value Input",
        text: "Type the number key or index value you want to operate on.",
        selector: 'input[type="number"]',
      },
      {
        title: "Update value",
        text: "Click 'Update' to apply changes and traverse tree updates.",
        buttonText: "Update",
      },
      {
        title: "Query Sum",
        text: "Click 'Query Sum' to run range sum operations.",
        buttonText: "Query Sum",
      },
      {
        title: "Insert Key",
        text: "Click 'Insert' to add the key and balance the B-Tree structure.",
        buttonText: "Insert",
      },
      {
        title: "Search Key",
        text: "Click 'Search' to locate a key in the B-Tree.",
        buttonText: "Search",
      },
      {
        title: "Adjust Speed",
        text: "Speed up or slow down the Fenwick/Segment node traverse animation.",
        selector: "speed-controls",
      },
      {
        title: "Reset Table",
        text: "Click 'Reset' to clear all values and nodes.",
        buttonText: "Reset",
      }
    ];
  } else if (path.includes("/tree/advanced/trie")) {
    coreSteps = [
      {
        title: "Word Input",
        text: "Type a lowercase word (a-z) to insert or search in the Trie.",
        selector: 'input[type="text"]',
      },
      {
        title: "Insert Word",
        text: "Click 'Insert' to insert characters character-by-character into the Prefix Tree.",
        buttonText: "Insert",
      },
      {
        title: "Search Word",
        text: "Click 'Search' to trace character paths and check if the word is marked as End of Word.",
        buttonText: "Search",
      },
      {
        title: "Prefix Match",
        text: "Click 'Prefix Match' to see if any words starting with the prefix exist.",
        buttonText: "Prefix Match",
      },
      {
        title: "Clear Trie",
        text: "Click 'Clear Trie' to wipe all nodes from the canvas.",
        buttonText: "Clear Trie",
      },
      {
        title: "Adjust Speed",
        text: "Change simulation speed of tree edge updates.",
        selector: "speed-controls",
      }
    ];
  } else if (path.includes("/tree/applications/heap")) {
    coreSteps = [
      {
        title: "Select Heap Type",
        text: "Toggle between 'Min Heap' and 'Max Heap' structures.",
        buttonText: "Heap",
      },
      {
        title: "Value Input",
        text: "Type a number to prepare for heap operations.",
        selector: 'input[type="number"]',
      },
      {
        title: "Insert Element",
        text: "Click 'Insert' to place the value in the last position and bubble up.",
        buttonText: "Insert",
      },
      {
        title: "Extract Root",
        text: "Click 'Extract Min' or 'Extract Max' to pop the root priority element and run heapify-down.",
        buttonText: "Extract",
      },
      {
        title: "Peek Root",
        text: "Click 'Peek' to inspect the priority element sitting at the top of the heap.",
        buttonText: "Peek",
      },
      {
        title: "Heapify",
        text: "Click 'Heapify' to rebuild the heap structure on the entire array dataset.",
        buttonText: "Heapify",
      },
      {
        title: "Reset Heap",
        text: "Click 'Reset' to clear all heap node elements.",
        buttonText: "Reset",
      }
    ];
  } else if (path.includes("/tree") || path.includes("/avl") || path.includes("/bst")) {
    coreSteps = [
      {
        title: "Value Input",
        text: "Enter a number to prepare it for tree operations.",
        selector: 'input[type="number"]',
      },
      {
        title: "Insert Key",
        text: "Click 'Insert' to add the key. The tree self-balances or structures according to rules.",
        buttonText: "Insert",
      },
      {
        title: "Generate Tree",
        text: "Click 'Generate Random Tree' to build a tree with random nodes.",
        buttonText: "Generate",
      },
      {
        title: "Start Traversal",
        text: "Click 'Start Traversal' (or 'Traversing...') to run traversing algorithms (e.g. In-Order, BFS, DFS).",
        buttonText: "Traversal",
      },
      {
        title: "Find LCA / Diameter",
        text: "Click 'Find LCA' or 'Find Diameter' to run the respective traversal trace.",
        buttonText: "Find",
      },
      {
        title: "Serialize Tree",
        text: "Click 'Serialize' to convert the tree layout to a flat string list.",
        buttonText: "Serialize",
      },
      {
        title: "Deserialize String",
        text: "Click 'Deserialize' to reconstruct the tree structure from a string list.",
        buttonText: "Deserialize",
      },
      {
        title: "Evaluate AST",
        text: "Click 'Evaluate AST' to compile and compute mathematical node symbols step-by-step.",
        buttonText: "Evaluate AST",
      },
      {
        title: "Classify Decision",
        text: "Click 'Classify' to query nodes and get classification results.",
        buttonText: "Classify",
      },
      {
        title: "Start Heap Sort",
        text: "Click 'Start Sort' to start sorting items using the heap algorithm.",
        buttonText: "Start Sort",
      },
      {
        title: "Build Huffman Tree",
        text: "Click 'Build Tree' to run the Huffman encoder tree constructor.",
        buttonText: "Build Tree",
      },
      {
        title: "Adjust Speed",
        text: "Adjust simulation speed to examine tree search paths.",
        selector: "speed-controls",
      },
      {
        title: "Reset Tree",
        text: "Click 'Reset' (or 'Reset All') to clear all nodes in the tree.",
        buttonText: "Reset",
      }
    ];
  } else if (path.includes("/graph")) {
    coreSteps = [
      {
        title: "Graph Grid Canvas",
        text: "Click the canvas grid to place vertices. Drag connections between nodes to build edges.",
        selector: 'canvas, svg',
      },
      {
        title: "Select Algorithm",
        text: "Choose a graph algorithm (like BFS, DFS, Dijkstra, Kruskal) to visualize.",
        selector: 'select',
      },
      {
        title: "Run Graph Search",
        text: "Click 'Visualize' or 'Run' to see how the graph is traversed and paths are discovered.",
        buttonText: "Visualize",
      },
      {
        title: "Clear Graph",
        text: "Click 'Clear Graph' to wipe the grid canvas clean.",
        buttonText: "Clear Graph",
      },
      {
        title: "Adjust Speed",
        text: "Speed up or slow down graph exploration steps.",
        selector: "speed-controls",
      },
      {
        title: "Reset Traversal",
        text: "Click 'Reset' to clear traversal path highlights and retain vertices/edges.",
        buttonText: "Reset",
      }
    ];
  } else if (path.includes("/visualizer/ai/")) {
    coreSteps = [
      {
        title: "Configure Inputs",
        text: "Set exploration coefficient, depth, or branches to configure the AI search tree.",
        selector: 'input[id="exploreC"], input[id="simSize"], input[type="text"]',
      },
      {
        title: "Go (Run Decision)",
        text: "Click 'Go' to start the AI minimax / MCTS search visualization.",
        buttonText: "Go",
      },
      {
        title: "Adjust Speed",
        text: "Speed up or slow down tree branch evaluation simulations.",
        selector: "speed-controls",
      },
      {
        title: "Reset AI Simulation",
        text: "Click 'Reset' to clear all node heuristics and evaluations.",
        buttonText: "Reset",
      }
    ];
  } else if (path.includes("/visualizer/recursion/")) {
    coreSteps = [
      {
        title: "Configure Array Input",
        text: "Type custom numbers to test (for recursive binary search or reverse).",
        selector: "input#arrayInput",
      },
      {
        title: "Configure String Input",
        text: "Type a word to test recursive palindrome detection.",
        selector: "input#stringInput",
      },
      {
        title: "Configure Target Input",
        text: "Enter a search target number.",
        selector: "input#targetInput",
      },
      {
        title: "Configure Input N",
        text: "Set the size parameter N (like recursion depth, factorial N, or Tower size).",
        selector: 'input#nVal, input[type="number"]',
      },
      {
        title: "Select Problem Mode",
        text: "Choose recursion variant problem if applicable.",
        selector: "select",
      },
      {
        title: "Random Data",
        text: "Click 'Random' to populate the inputs with mock test data.",
        buttonText: "Random",
      },
      {
        title: "Go (Start Recursion)",
        text: "Click 'Go' to run the recursive stack tracer.",
        buttonText: "Go",
      },
      {
        title: "Adjust Speed",
        text: "Slide to adjust the playback speed of the recursion stack frames.",
        selector: "speed-controls",
      },
      {
        title: "Reset Recursion",
        text: "Click 'Reset' to clear the recursion stack tree and restart.",
        buttonText: "Reset",
      }
    ];
  } else if (path.includes("/visualizer/complexity-analyzer")) {
    coreSteps = [
      {
        title: "Configure Functions",
        text: "Select algorithms or growth functions to analyze.",
        selector: "select, input",
      },
      {
        title: "Plot Complexity",
        text: "Click 'Go' to calculate and draw operational curves.",
        buttonText: "Go",
      },
      {
        title: "Complexity Graph",
        text: "Compare asymptotic Big-O runtime growth profiles plotted on this chart.",
        selector: "svg, canvas, .shadow-md",
      }
    ];
  } else if (path.includes("/visualizer/dry-run")) {
    coreSteps = [
      {
        title: "Select or Write Code",
        text: "Choose a template algorithm or type your custom code into the editor.",
        selector: "textarea, .monaco-editor",
      },
      {
        title: "Compile & Run",
        text: "Click 'Go' to parse and load the execution snapshot timeline.",
        buttonText: "Go",
      },
      {
        title: "Control Trace Step",
        text: "Use the step-by-step speed controls or frame navigation buttons to advance lines.",
        selector: "speed-controls",
      },
      {
        title: "Variable Inspector",
        text: "Inspect active stack variables, outputs, and array layouts line-by-line.",
        selector: ".font-mono, .border-l",
      }
    ];
  } else {
    // Fallback for general visualizers
    coreSteps = [
      {
        title: "Input Controls",
        text: "Input your custom data or configuration inside the text areas or form controls.",
        selector: 'input, textarea',
      },
      {
        title: "Go (Run Visualizer)",
        text: "Click 'Go' to execute the algorithm logic.",
        buttonText: "Go",
      },
      {
        title: "Adjust Speed",
        text: "Adjust playback speed using the range selector.",
        selector: "speed-controls",
      },
      {
        title: "Reset Elements",
        text: "Click 'Reset' to start over.",
        buttonText: "Reset",
      },
      {
        title: "Visualization Display",
        text: "Inspect the output panel or animation area to see the algorithm's results.",
        selector: '.shadow-md, canvas, svg',
      }
    ];
  }

  return coreSteps;
};

export default function OnboardingTour() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState(false);
  const [steps, setSteps] = useState([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [elementRect, setElementRect] = useState(null);
  const [cardStyles, setCardStyles] = useState({});
  const [direction, setDirection] = useState("forward");

  const step = steps[stepIndex];
  const storageKey = `algobuddy_tour_completed_${pathname}`;

  const isCategoryIndexPage = (path) => {
    if (!path) return true;
    const p = path.toLowerCase();
    if (p === "/visualizer" || p === "/visualizer/") return true;
    
    const categorySlugs = [
      "/visualizer/code-lab",
      "/visualizer/array",
      "/visualizer/recursion",
      "/visualizer/stack",
      "/visualizer/queue",
      "/visualizer/linked-list",
      "/visualizer/linkedlist",
      "/visualizer/tree",
      "/visualizer/hashmap",
      "/visualizer/graph",
      "/visualizer/ai"
    ];
    return categorySlugs.some(slug => p === slug || p === slug + "/");
  };

  const isTheoryOnlyPage = (path) => {
    if (!path) return true;
    const p = path.toLowerCase();
    return (
      p.includes("/tree/binarytree/properties") ||
      p.includes("/tree/binarytree/types") ||
      p.includes("/graph/adjacency-list") ||
      p.includes("/graph/adjacency-matrix") ||
      p.includes("/queue/implementation/array") ||
      p.includes("/queue/implementation/linkedlist") ||
      p.includes("/stack/implementation/usingarray") ||
      p.includes("/stack/implementation/usinglinkedlist")
    );
  };

  useEffect(() => {
    setMounted(true);
    // Only run on specific sub-visualizers, not the index list page, category list pages, or theory-only/representation pages
    if (pathname && pathname.startsWith("/visualizer") && !isCategoryIndexPage(pathname) && !isTheoryOnlyPage(pathname)) {
      const completed = localStorage.getItem(storageKey);
      if (!completed) {
        setActive(true);
        setStepIndex(0);
      } else {
        setActive(false);
      }
    } else {
      setActive(false);
    }
  }, [pathname, storageKey]);

  // Pre-filter steps to exclude controls not rendered on the page
  useEffect(() => {
    if (!active) return;

    const allSteps = getTourSteps(pathname);
    // Wait a tiny delay to allow initial DOM rendering to settle
    const timer = setTimeout(() => {
      const filtered = allSteps.filter((s) => {
        if (!s.selector && !s.buttonText) return true;
        return findElement(s.selector, s.buttonText) !== null;
      });
      setSteps(filtered.length > 0 ? filtered : allSteps);
    }, 150);

    return () => clearTimeout(timer);
  }, [active, pathname]);

  const updateRect = () => {
    if (!active || !step) {
      setElementRect(null);
      return;
    }
    const el = findElement(step.selector, step.buttonText);
    if (el) {
      setElementRect(el.getBoundingClientRect());
    } else {
      setElementRect(null);
    }
  };

  // Recalculate target positions on step index changes, resize, or scroll
  useEffect(() => {
    updateRect();
    window.addEventListener("resize", updateRect);
    window.addEventListener("scroll", updateRect, true);
    return () => {
      window.removeEventListener("resize", updateRect);
      window.removeEventListener("scroll", updateRect, true);
    };
  }, [stepIndex, active, pathname, steps]);

  // Repeatedly try to find the element in case it loads asynchronously,
  // and dynamically skip it if it is missing.
  useEffect(() => {
    if (!active || !step) return;

    let attempts = 0;
    const interval = setInterval(() => {
      const el = findElement(step.selector, step.buttonText);
      if (el) {
        setElementRect(el.getBoundingClientRect());
        clearInterval(interval);
      } else {
        attempts++;
        if (attempts > 8) { // 2 seconds limit
          setElementRect(null);
          clearInterval(interval);
        }
      }
    }, 250);

    return () => clearInterval(interval);
  }, [stepIndex, active, pathname, steps]);

  // Calculate popover positioning
  useEffect(() => {
    if (!active) return;

    if (!elementRect) {
      // Centered fallback layout
      setCardStyles({
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "340px",
      });
      return;
    }

    const cardWidth = 350;
    const cardHeight = 210;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    if (viewportWidth < 768) {
      // Mobile - float full-width at the bottom
      setCardStyles({
        position: "fixed",
        bottom: "16px",
        left: "16px",
        right: "16px",
        transform: "none",
        width: "auto",
      });
      return;
    }

    // Try placing below target
    let top = elementRect.bottom + 16;
    let left = elementRect.left + elementRect.width / 2 - cardWidth / 2;

    // Check bottom boundary -> place above target instead
    if (top + cardHeight > viewportHeight) {
      top = elementRect.top - cardHeight - 16;
    }
    // Check right boundary
    if (left + cardWidth > viewportWidth - 16) {
      left = viewportWidth - cardWidth - 16;
    }
    // Check left boundary
    if (left < 16) {
      left = 16;
    }
    // Check top boundary fallback
    if (top < 16) {
      top = 16;
    }

    setCardStyles({
      position: "fixed",
      top: `${top}px`,
      left: `${left}px`,
      transform: "none",
      width: `${cardWidth}px`,
      maxWidth: "calc(100vw - 32px)",
    });
  }, [elementRect, active, stepIndex, steps]);

  if (!mounted || !active || !step) return null;

  const handleNext = () => {
    setDirection("forward");
    if (stepIndex < steps.length - 1) {
      setStepIndex(stepIndex + 1);
    } else {
      // Finished
      localStorage.setItem(storageKey, "true");
      setActive(false);
    }
  };

  const handleBack = () => {
    setDirection("backward");
    if (stepIndex > 0) {
      setStepIndex(stepIndex - 1);
    }
  };

  const handleSkip = () => {
    localStorage.setItem(storageKey, "true");
    setActive(false);
  };

  return createPortal(
    <>
      {/* 1. Backdrop Spotlight Layer */}
      {elementRect ? (
        // Spotlight mode: Dark mask over everything except the target element
        <div
          className="fixed pointer-events-none z-[9998] rounded-xl border border-[#a435f0] shadow-[0_0_0_9999px_rgba(15,23,42,0.65),_0_0_20px_rgba(164,53,240,0.4)] transition-all duration-300 ease-out"
          style={{
            top: elementRect.top - 6,
            left: elementRect.left - 6,
            width: elementRect.width + 12,
            height: elementRect.height + 12,
          }}
        />
      ) : (
        // Fullscreen dimmed backdrop mode for center-fallback overlays
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-[1px] z-[9998] transition-opacity duration-300 pointer-events-auto" />
      )}

      {/* 2. Glassmorphic Card Popover */}
      <div
        className="z-[9999] bg-slate-900/95 dark:bg-[#0c0c0d]/95 border border-slate-800 text-slate-100 rounded-3xl p-5 shadow-2xl backdrop-blur-md flex flex-col gap-3.5 transition-all duration-300 ease-out"
        style={cardStyles}
      >
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-slate-800 rounded-t-3xl overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#a435f0] via-[#c56eff] to-[#e4a1ff] transition-all duration-300"
            style={{ width: `${((stepIndex + 1) / steps.length) * 100}%` }}
          />
        </div>

        {/* Title & Close */}
        <div className="flex justify-between items-start pt-1.5">
          <h4 className="font-bold text-xs text-[#c56eff] tracking-widest uppercase font-mono">
            {step.title}
          </h4>
          <button
            onClick={handleSkip}
            className="text-slate-400 hover:text-white transition-colors"
            title="Skip Guide"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Description Text */}
        <p className="text-xs text-slate-300 leading-relaxed font-sans min-h-[50px] break-words">
          {step.text}
        </p>

        {/* Bottom controls */}
        <div className="flex justify-between items-center mt-1 pt-2.5 border-t border-slate-800/80 w-full">
          {/* Clean text progress indicator */}
          <span className="text-[11px] font-semibold text-slate-400 font-mono select-none">
            {stepIndex + 1} of {steps.length}
          </span>

          {/* Action Buttons */}
          <div className="flex gap-1.5 items-center">
            {stepIndex > 0 ? (
              <button
                onClick={handleBack}
                className="px-3 py-1.5 text-[11px] font-bold text-slate-400 hover:text-white transition-colors rounded-lg bg-slate-800/50 hover:bg-slate-850"
              >
                Back
              </button>
            ) : (
              <button
                onClick={handleSkip}
                className="px-3 py-1.5 text-[11px] font-bold text-slate-400 hover:text-rose-400 transition-colors"
              >
                Skip
              </button>
            )}

            <button
              onClick={handleNext}
              className="px-4 py-1.5 text-[11px] font-bold text-white bg-[#a435f0] hover:bg-[#8f2cd6] hover:scale-[1.03] active:scale-[0.97] transition-all rounded-lg shadow-md shadow-[#a435f0]/15"
            >
              {stepIndex === steps.length - 1 ? "Finish" : "Next →"}
            </button>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}
