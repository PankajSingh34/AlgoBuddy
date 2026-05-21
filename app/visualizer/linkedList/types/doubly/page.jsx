import Animation from "@/app/visualizer/linkedList/types/doubly/animation";
import Content from "@/app/visualizer/linkedList/types/doubly/content";
import Quiz from "@/app/visualizer/linkedList/types/doubly/quiz";
import Code from "@/app/visualizer/linkedList/types/doubly/codeBlock";
import { StandardAlgorithmPage } from "@/app/components/ui/algorithm-page";

export const metadata = {
  title: 'Doubly Linked List Implementation | Visualize Doubly Linked List in JS, C, Python, Java',
  description: 'Explore Doubly Linked List implementation with interactive animations and code examples in JavaScript, C, Python, and Java. Learn insertion, deletion, and traversal from both directions. Perfect for DSA beginners and interview preparation.',
  keywords: [
    'Doubly Linked List Implementation',
    'DLL Visualization',
    'Doubly Linked List in JavaScript',
    'Doubly Linked List in C',
    'Doubly Linked List in Python',
    'Doubly Linked List in Java',
    'DSA Doubly Linked List',
    'Bidirectional Linked List',
    'Insertion in DLL',
    'Deletion in DLL',
    'DLL Operations',
    'Learn Doubly Linked List',
    'DSA for Beginners',
    'Interactive Linked List Visualizer',
  ],
  robots: 'index, follow',
};

export default function Page() {
  const paths = [
    { name: "Home", href: "/" },
    { name: "Visualizer", href: "/visualizer" },
    { name: "Linked List", href: "/visualizer" },
    { name: "Doubly Linked List", href: "" },
  ];

  return (
    <StandardAlgorithmPage
      paths={paths}
      category="Linked List"
      title="Doubly Linked List"
      visualizerTitle="Interactive Visualizer"
      visualizerDescription="See how each node keeps track of both the previous and next pointer in a doubly linked list."
      visualizer={<Animation />}
      content={<Content />}
      code={<Code />}
      quiz={<Quiz />}
      relatedTopics={{
        title: "Explore Other Types",
        links: [
          { text: "Singly Linked List", url: "./singly" },
          { text: "Circular Linked List", url: "./circular" },
        ],
      }}
    />
  );
};
