import Animation from "@/app/visualizer/linkedList/operations/comparison/animation";
import Content from "@/app/visualizer/linkedList/operations/comparison/content";
import Quiz from "@/app/visualizer/linkedList/operations/comparison/quiz";
import Code from "@/app/visualizer/linkedList/operations/comparison/codeBlock";
import { StandardAlgorithmPage } from "@/app/components/ui/algorithm-page";

export const metadata = {
    title: 'Linked List Comparison Algorithm | Interactive Visualization & Step-by-Step Guide',
    description:
        'Learn how comparison works in Linked Lists with interactive animations, detailed explanations, and hands-on practice. Visualize each step of the comparison process and master linked list algorithms efficiently.',
    keywords: [
        'Linked List Comparison',
        'Comparison Animation Linked List',
        'Visualize Comparison in Linked List',
        'Linked List Algorithm',
        'DSA Linked List Comparison',
        'Linked List Comparison Visualization',
        'Interactive Linked List',
        'Comparison Step-by-Step',
        'Linked List Learning',
        'Data Structures Animation',
        'DSA Practice Linked List',
        'Comparison Code Example',
        'Linked List Tutorial',
        'Comparison using C',
        'Comparison using Java',
        'Comparison using Javascript',
        'Comparison using Python',
        'Comparison using linked list',
    ],
    robots: 'index, follow',
};

export default function Page() {
  const paths = [
    { name: "Home", href: "/" },
    { name: "Visualizer", href: "/visualizer" },
    { name: "Linked List", href: "/visualizer" },
    { name: "Comparison", href: "" },
  ];

  return (
    <StandardAlgorithmPage
      paths={paths}
      category="Linked List"
      title="Linked List Comparison"
      visualizerTitle="Interactive Visualizer"
      visualizerDescription="Generate two lists and compare them node by node to see where their values diverge."
      visualizer={<Animation />}
      content={<Content />}
      code={<Code />}
      quiz={<Quiz />}
      relatedTopics={{
        title: "Explore Other Operations",
        links: [
          { text: "Insertion", url: "./insertion" },
          { text: "Deletion", url: "./deletion" },
          { text: "Traversal", url: "./traversal" },
          { text: "Merging", url: "./merge" },
          { text: "Searching", url: "./search" },
          { text: "Reverse", url: "./reverse" },
        ],
      }}
    />
  );
};
