import Navbar from "@/app/components/navbar";
import Footer from "@/app/components/footer";
import VisualizerClient from "./VisualizerClient";
import ArrayModal from "@/app/components/models/ArrayModal";
import StackModal from "@/app/components/models/StackModel";
import QueueModal from "@/app/components/models/QueueModal";
import LinkedListModal from "@/app/components/models/LinkedListModal";
import TreeModal from "@/app/components/models/TreeModal";
import GraphModal from "@/app/components/models/GraphModal";
import TutorialOverlay from "@/app/components/ui/TutorialOverlay";
import { PageWrapper } from "@/app/components/ui/PageWrapper";

export const metadata = {
  title: "Algorithm Visualizer | AlgoBuddy",
  description:
    "Explore visual representations and source code for various DSA algorithms including searching, sorting, stacks, queues, trees, graphs, and stack-based expression evaluation like Polish Notation using arrays and linked lists.",
  robots: "index, follow",
  openGraph: {
    images: [
      {
        url: "/og/visualizer.png",
        width: 1200,
        height: 630,
        alt: "Algorithm Visualization",
      },
    ],
  },
};

const sections = [
  {
    title: "Array",
    desc: "Searching & sorting algorithms on contiguous memory",
    info: {
      About:
        "An array is a data structure that stores multiple values of the same type in a single variable. Each value is stored at a specific index, starting from 0.",
      Representation: <ArrayModal />,
    },
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
        ],
      },
    ],
  },
  {
    title: "Stack",
    desc: "LIFO operations, polish notations & implementations",
    info: {
      About:
        "LIFO data structure; push adds to top; pop removes from top; peek views top; works like a stack of plates.",
      Representation: <StackModal />,
    },
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
    desc: "FIFO operations, variants & implementations",
    info: {
      About:
        "FIFO data structure; enqueue adds to rear; dequeue removes from front; peek views front.",
      Representation: <QueueModal />,
    },
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
    desc: "Singly, doubly, circular — traversal to merge",
    info: {
      About:
        "Linear data structure; elements (nodes) connected using pointers; each node has data + next.",
      Representation: <LinkedListModal />,
    },
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
          { name: "Reverse", path: "/visualizer/linkedList/operations/reverse" },
          { name: "Merge", path: "/visualizer/linkedList/operations/merge" },
          { name: "Comparison", path: "/visualizer/linkedList/operations/comparison" },
        ],
      },
    ],
  },
  {
    title: "Tree",
    desc: "BST, AVL, traversals, tries & advanced trees",
    info: {
      About:
        "Hierarchical data structure; has root, nodes, edges; each node has parent/child.",
      Types: "binary tree, BST, AVL, etc.",
      Representation: <TreeModal maxLevel={3} />,
    },
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
          { name: "Pre-order", path: "/visualizer/trees/traversal/pre-order" },
          { name: "In-order", path: "/visualizer/trees/traversal/in-order" },
          { name: "Post-order", path: "/visualizer/trees/traversal/post-order" },
          { name: "Level-order (BFS)", path: "/visualizer/trees/traversal/level-order" },
        ],
      },
      {
        title: "Algorithms",
        items: [
          { name: "Lowest Common Ancestor", path: "/visualizer/trees/algorithms/lca" },
          { name: "Tree Diameter", path: "/visualizer/trees/algorithms/diameter" },
        ],
      },
    ],
  },
  {
    title: "Graph",
    desc: "BFS, DFS, Dijkstra, MST & topological sort",
    info: {
      About:
        "A graph is a data structure made up of nodes (vertices) and edges representing connections.",
      Representation: <GraphModal />,
    },
    subsections: [
      {
        title: "Representation",
        items: [
          { name: "Adjacency Matrix", path: "/visualizer/graph/representation/adjacency-matrix" },
          { name: "Adjacency List", path: "/visualizer/graph/representation/adjacency-list" },
        ],
      },
      {
        title: "Traversal",
        items: [
          { name: "Breadth-First Search (BFS)", path: "/visualizer/graph/traversal/bfs" },
          { name: "Depth-First Search (DFS)", path: "/visualizer/graph/traversal/dfs" },
        ],
      },
      {
        title: "Algorithms",
        items: [
          { name: "Dijkstra's Algorithm", path: "/visualizer/graph/algorithms/dijkstra" },
          { name: "Prim's Algorithm", path: "/visualizer/graph/algorithms/prim" },
          { name: "Kruskal's Algorithm", path: "/visualizer/graph/algorithms/kruskal" },
          { name: "Topological Sort", path: "/visualizer/graph/algorithms/topological-sort" },
        ],
      },
    ],
  },
];

const Visualizer = () => {
  const clientSections = sections.map(({ info, ...rest }) => rest);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <TutorialOverlay />
      <PageWrapper>
        <VisualizerClient initialSections={clientSections} />
      </PageWrapper>
      <Footer />
    </div>
  );
};

export default Visualizer;
