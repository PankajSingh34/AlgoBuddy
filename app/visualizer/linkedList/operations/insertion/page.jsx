import Animation from "@/app/visualizer/linkedList/operations/insertion/animation";
import Content from "@/app/visualizer/linkedList/operations/insertion/content";
import Quiz from "@/app/visualizer/linkedList/operations/insertion/quiz";
import Code from "@/app/visualizer/linkedList/operations/insertion/codeBlock";
import { StandardAlgorithmPage } from "@/app/components/ui/algorithm-page";

export const metadata = {
    title: 'Linked List Insertion Algorithm | Interactive Visualization & Step-by-Step Guide',
    description:
        'Learn how insertion works in Linked Lists with interactive animations, detailed explanations, and hands-on practice. Visualize each step of the insertion process and master linked list algorithms efficiently.',
    keywords: [
        'Linked List Insertion',
        'Insertion Animation Linked List',
        'Visualize Insertion in Linked List',
        'Linked List Algorithm',
        'DSA Linked List Insertion',
        'Linked List Insertion Visualization',
        'Interactive Linked List',
        'Insertion Step-by-Step',
        'Linked List Learning',
        'Data Structures Animation',
        'DSA Practice Linked List',
        'Insertion Code Example',
        'Linked List Tutorial',
        'Insertion using C',
        'Insertion using Java',
        'Insertion using Javascript',
        'Insertion using Python',
        'Insertion using linked list',
    ],
    robots: 'index, follow',
};
export default function Page() {
  const paths = [
    { name: "Home", href: "/" },
    { name: "Visualizer", href: "/visualizer" },
    { name: "Linked List", href: "/visualizer" },
    { name: "Insertion", href: "" },
  ];

  return (
    <StandardAlgorithmPage
      paths={paths}
      category="Linked List"
      title="Linked List Insertion"
      visualizerTitle="Interactive Visualizer"
      visualizerDescription="Add nodes one by one and follow how each insertion updates the next pointer of the current tail."
      visualizer={<Animation />}
      content={<Content />}
      code={<Code />}
      quiz={<Quiz />}
      relatedTopics={{
        title: "Explore Other Types",
        links: [
          { text: "Traversal", url: "./traversal" },
          { text: "Deletion", url: "./deletion" },
          { text: "Searching", url: "./search" },
          { text: "Merging", url: "./merge" },
          { text: "Comparison", url: "./comparison" },
          { text: "Reverse", url: "./reverse" },
        ],
      }}
    />
  );
};
