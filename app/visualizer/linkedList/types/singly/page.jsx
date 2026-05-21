import Animation from "@/app/visualizer/linkedList/types/singly/animation";
import Content from "@/app/visualizer/linkedList/types/singly/content";
import Quiz from "@/app/visualizer/linkedList/types/singly/quiz";
import Code from "@/app/visualizer/linkedList/types/singly/codeBlock";
import { StandardAlgorithmPage } from "@/app/components/ui/algorithm-page";

export const metadata = {
  title: 'Singly Linked List Implementation | Visualize Linked List in JS, C, Python, Java',
  description: 'Explore Singly Linked List implementation with interactive visualizations and real-time code examples in JavaScript, C, Python, and Java. Learn insertion, deletion, and traversal with step-by-step animations. Perfect for DSA beginners and interview preparation.',
  keywords: [
    'Singly Linked List Implementation',
    'Singly Linked List Visualization',
    'Linked List in JavaScript',
    'Linked List in C',
    'Linked List in Python',
    'Linked List in Java',
    'DSA Linked List',
    'Linked List Operations',
    'Insertion in Linked List',
    'Deletion in Linked List',
    'Traverse Linked List',
    'Learn Linked List',
    'Visualize Linked List',
    'DSA for Beginners',
    'Interactive Linked List Tool',
  ],
  robots: 'index, follow',
};

export default function Page() {
  const paths = [
    { name: "Home", href: "/" },
    { name: "Visualizer", href: "/visualizer" },
    { name: "Linked List", href: "/visualizer" },
    { name: "Singly Linked List", href: "" },
  ];

  return (
    <StandardAlgorithmPage
      paths={paths}
      category="Linked List"
      title="Singly Linked List"
      visualizerTitle="Interactive Visualizer"
      visualizerDescription="Add nodes and follow how each node stores its data together with the next pointer."
      visualizer={<Animation />}
      content={<Content />}
      code={<Code />}
      quiz={<Quiz />}
      relatedTopics={{
        title: "Explore Other Types",
        links: [
          { text: "Doubly Linked List", url: "./doubly" },
          { text: "Circular Linked List", url: "./circular" },
        ],
      }}
    />
  );
};
