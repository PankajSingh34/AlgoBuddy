import Animation from "@/app/visualizer/linkedList/types/circular/animation";
import Content from "@/app/visualizer/linkedList/types/circular/content";
import Quiz from "@/app/visualizer/linkedList/types/circular/quiz";
import Code from "@/app/visualizer/linkedList/types/circular/codeBlock";
import { StandardAlgorithmPage } from "@/app/components/ui/algorithm-page";

export const metadata = {
  title: 'Circular Linked List Algorithm | Interactive Learning & Step-by-Step Animation',
  description:
    'Master Circular Linked Lists with interactive visualizations, quizzes, and implementation code. Learn insertion, deletion, and traversal through animations and practice with hands-on exercises.',
  keywords: [
    'Circular Linked List Visualizer',
    'CLL Animation',
    'Visualize Circular Linked List',
    'Learn Circular Linked List',
    'Circular Linked List DSA',
    'Circular Linked List for Beginners',
    'Insertion in Circular Linked List',
    'Deletion in Circular Linked List',
    'Circular Linked List Traversal',
    'DSA Circular Linked List Visualization',
    'DSA Quiz Circular Linked List',
    'Circular Linked List Implementation Code',
    'DSA Learning Platform',
  ],
  robots: 'index, follow',
};
export default function Page() {
  const paths = [
    { name: "Home", href: "/" },
    { name: "Visualizer", href: "/visualizer" },
    { name: "Linked List", href: "/visualizer" },
    { name: "Circular Linked List", href: "" },
  ];

  return (
    <StandardAlgorithmPage
      paths={paths}
      category="Linked List"
      title="Circular Linked List"
      visualizerTitle="Interactive Visualizer"
      visualizerDescription="Visualize how the tail reconnects to the head to form a loop in a circular linked list."
      visualizer={<Animation />}
      content={<Content />}
      code={<Code />}
      quiz={<Quiz />}
      relatedTopics={{
        title: "Explore Other Types",
        links: [
          { text: "Singly Linked List", url: "./singly" },
          { text: "Doubly Linked List", url: "./doubly" },
        ],
      }}
    />
  );
};
