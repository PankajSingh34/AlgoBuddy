// Shared data source for all visualizer sections.
// Used by both /visualizer (grid) and /visualizer/[category] (module view).

export const sections = [
  {
    title: "Code Lab",
    slug: "code-lab",
    desc: "Write custom code, run safe step-by-step dry runs, and analyze time & space complexity",
    subsections: [
      {
        title: "Tools",
        items: [
          {
            name: "Dry Run Visualizer",
            path: "/visualizer/dry-run",
          },
          {
            name: "Complexity Analyzer",
            path: "/visualizer/complexity-analyzer",
          },
        ],
      },
    ],
  },
  {
    title: "Array",
    slug: "array",
    desc: "Searching & sorting algorithms on contiguous memory",
    subsections: [
      {
        title: "Searching",
        items: [
          { name: "Linear Search", path: "/visualizer/searching/linearsearch" },
          { name: "Binary Search", path: "/visualizer/searching/binarysearch" },
        ],
      },
      {
        title: "Sorting",
        items: [
          { name: "Bubble Sort", path: "/visualizer/sorting/bubblesort" },
          { name: "Selection Sort", path: "/visualizer/sorting/selectionsort" },
          { name: "Insertion Sort", path: "/visualizer/sorting/insertionsort" },
          { name: "Merge Sort", path: "/visualizer/sorting/mergesort" },
          { name: "Quick Sort", path: "/visualizer/sorting/quicksort" },
          { name: "Heap Sort", path: "/visualizer/sorting/heapsort" },
          { name: "Counting Sort", path: "/visualizer/sorting/countingsort" },
          { name: "Comparison Mode", path: "/visualizer/sorting/comparison" },
        ],
      },
      {
        title: "Interview Patterns",
        items: [
          { name: "Sliding Window", path: "/visualizer/arrays/slidingwindow" },
        ],
      },
    ],
  },
  {
    title: "Recursion",
    slug: "recursion",
    desc: "Understand stack frames, call stacks, base cases, and tree recursion through animated execution flow",
    subsections: [
      {
        title: "Recursion Topics",
        items: [
          { name: "Basic Recursion", path: "/visualizer/recursion/basic-recursion" },
          { name: "Functional & Parameterized Recursion", path: "/visualizer/recursion/functional-parameterized" },
          { name: "Multiple Recursive Calls", path: "/visualizer/recursion/multiple-calls" },
          { name: "Recursion on Subsequences", path: "/visualizer/recursion/subsequences" },
          { name: "Backtracking", path: "/visualizer/recursion/backtracking" },
          { name: "Recursion Trees", path: "/visualizer/recursion/trees" },
          { name: "Call Stack Visualization", path: "/visualizer/recursion/stack" },
          { name: "Recursive Binary Search", path: "/visualizer/recursion/binary-search" },
        ],
      },
    ],
  },
  {
    title: "Stack",
    slug: "stack",
    desc: "LIFO operations, polish notations & implementations",
    subsections: [
      {
        title: "Operations",
        items: [
          { name: "Push & Pop", path: "/visualizer/stack/push-pop" },
          { name: "Peek", path: "/visualizer/stack/peek" },
          { name: "Is Empty", path: "/visualizer/stack/isempty" },
          { name: "Is Full", path: "/visualizer/stack/isfull" },
        ],
      },
      {
        title: "Polish Notations Evaluation",
        items: [
          { name: "Postfix", path: "/visualizer/stack/polish/postfix" },
          { name: "Prefix", path: "/visualizer/stack/polish/prefix" },
        ],
      },
      {
        title: "Implementation",
        items: [
          { name: "Using Array", path: "/visualizer/stack/implementation/usingArray" },
          { name: "Using Linked List", path: "/visualizer/stack/implementation/usingLinkedList" },
        ],
      },
    ],
  },
  {
    title: "Queue",
    slug: "queue",
    desc: "FIFO operations, variants & implementations",
    subsections: [
      {
        title: "Operations",
        items: [
          { name: "Enqueue & Dequeue", path: "/visualizer/queue/operations/enqueue-dequeue" },
          { name: "Peek Front", path: "/visualizer/queue/operations/peek-front" },
          { name: "Is Empty", path: "/visualizer/queue/operations/isempty" },
          { name: "Is Full", path: "/visualizer/queue/operations/isfull" },
        ],
      },
      {
        title: "Types",
        items: [
          { name: "Single Ended Queue", path: "/visualizer/queue/types/singleEnded" },
          { name: "Double Ended Queue", path: "/visualizer/queue/types/deque" },
          { name: "Circular Queue", path: "/visualizer/queue/types/circular" },
          { name: "Priority Queue", path: "/visualizer/queue/types/priority" },
        ],
      },
      {
        title: "Implementation",
        items: [
          { name: "Using Array", path: "/visualizer/queue/implementation/array" },
          { name: "Using Linked List", path: "/visualizer/queue/implementation/linkedList" },
        ],
      },
    ],
  },
  {
    title: "Linked List",
    slug: "linked-list",
    desc: "Singly, doubly, circular — traversal to merge",
    subsections: [
      {
        title: "Types",
        items: [
          { name: "Singly Linked List", path: "/visualizer/linkedList/types/singly" },
          { name: "Doubly Linked List", path: "/visualizer/linkedList/types/doubly" },
          { name: "Circular Linked List", path: "/visualizer/linkedList/types/circular" },
        ],
      },
      {
        title: "Operations",
        items: [
          { name: "Traversal", path: "/visualizer/linkedList/operations/traversal" },
          { name: "Insertion", path: "/visualizer/linkedList/operations/insertion" },
          { name: "Deletion", path: "/visualizer/linkedList/operations/deletion" },
          { name: "Searching", path: "/visualizer/linkedList/operations/search" },
          { name: "Reverse", path: "/visualizer/linkedList/operations/reverse" },
          { name: "Merge", path: "/visualizer/linkedList/operations/merge" },
          { name: "Comparison", path: "/visualizer/linkedList/operations/comparison" },
        ],
      },
    ],
  },
  {
    title: "Tree",
    slug: "tree",
    desc: "BST, AVL, traversals, tries & advanced trees",
    subsections: [
      {
        title: "Binary Tree",
        items: [
          { name: "Structure & Properties", path: "/visualizer/trees/binaryTree/properties" },
          { name: "Types of Binary Trees", path: "/visualizer/trees/binaryTree/types" },
        ],
      },
      {
        title: "Binary Search Tree",
        items: [
          { name: "Insertion", path: "/visualizer/trees/bst/insertion" },
          { name: "Deletion", path: "/visualizer/trees/bst/deletion" },
          { name: "Searching", path: "/visualizer/trees/bst/searching" },
          { name: "Balancing (AVL)", path: "/visualizer/trees/bst/avl" },
        ],
      },
      {
        title: "Traversal",
        items: [
          { name: "Pre-order", path: "/visualizer/trees/traversing/pre-order" },
          { name: "In-order", path: "/visualizer/trees/traversing/in-order" },
          { name: "Post-order", path: "/visualizer/trees/traversing/post-order" },
          { name: "Level-order (BFS)", path: "/visualizer/trees/traversing/level-order" },
          { name: "Morris Traversal", path: "/visualizer/trees/traversing/morris" },
        ],
      },
      {
        title: "Advanced Trees",
        items: [
          { name: "Red-Black Trees", path: "/visualizer/trees/advanced/red-black" },
          { name: "B-Trees", path: "/visualizer/trees/advanced/b-trees" },
          { name: "Trie (Prefix Tree)", path: "/visualizer/trees/advanced/trie" },
          { name: "Segment Trees", path: "/visualizer/trees/advanced/segment" },
          { name: "Fenwick Trees", path: "/visualizer/trees/advanced/fenwick" },
        ],
      },
      {
        title: "Algorithms",
        items: [
          { name: "Lowest Common Ancestor", path: "/visualizer/trees/algorithms/lca" },
          { name: "Tree Diameter", path: "/visualizer/trees/algorithms/diameter" },
          { name: "Tree Isomorphism", path: "/visualizer/trees/algorithms/isomorphism" },
          { name: "Serialize/Deserialize", path: "/visualizer/trees/algorithms/serialization" },
        ],
      },
      {
        title: "Applications",
        items: [
          { name: "Heap (Min/Max)", path: "/visualizer/trees/applications/heap" },
          { name: "Heap Sort", path: "/visualizer/trees/applications/heapsort" },
          { name: "Huffman Coding", path: "/visualizer/trees/applications/huffman" },
          { name: "Decision Trees", path: "/visualizer/trees/applications/decision-trees" },
          { name: "Syntax Trees", path: "/visualizer/trees/applications/syntax-trees" },
        ],
      },
    ],
  },
  {
    title: "HashMap",
    slug: "hashmap",
    desc: "Key-value pairs with hash function and collision handling",
    subsections: [
      {
        title: "Operations",
        items: [
          { name: "Insert (put)", path: "/visualizer/hashmap/insert" },
          { name: "Search (get)", path: "/visualizer/hashmap/search" },
          { name: "Delete (remove)", path: "/visualizer/hashmap/delete" },
        ],
      },
    ],
  },
  {
    title: "Graph",
    slug: "graph",
    desc: "BFS, DFS, shortest paths, MST & topological sort",
    subsections: [
      {
        title: "Representation",
        items: [
          { name: "Adjacency Matrix", path: "/visualizer/graph/adjacency-matrix" },
          { name: "Adjacency List", path: "/visualizer/graph/adjacency-list" },
        ],
      },
      {
        title: "Traversal",
        items: [
          { name: "Breadth-First Search (BFS)", path: "/visualizer/graph/bfs" },
          { name: "Depth-First Search (DFS)", path: "/visualizer/graph/dfs" },
        ],
      },
      {
        title: "Algorithms",
        items: [
          { name: "Dijkstra's Algorithm", path: "/visualizer/graph/dijkstra" },
          { name: "Floyd-Warshall Algorithm", path: "/visualizer/graph/floyd-warshall" },
          { name: "Prim's Algorithm", path: "/visualizer/graph/prim" },
          { name: "Kruskal's Algorithm", path: "/visualizer/graph/kruskal" },
          { name: "Topological Sort", path: "/visualizer/graph/topological-sort" },
        ],
      },
    ],
  },
  {
    title: "AI Algorithms",
    slug: "ai",
    desc: "Search algorithms used in Artificial Intelligence (Min Max, Alpha Beta Pruning, etc.)",
    subsections: [
      {
        title: "Adversarial Search",
        items: [
          { name: "Min Max Algorithm", path: "/visualizer/ai/minmax" },
          { name: "Alpha Beta Pruning", path: "/visualizer/ai/alpha-beta-pruning" },
        ],
      },
    ],
  },
];
