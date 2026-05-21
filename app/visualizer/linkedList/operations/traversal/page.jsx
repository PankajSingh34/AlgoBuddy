import Animation from "@/app/visualizer/linkedList/operations/traversal/animation";
import Content from "@/app/visualizer/linkedList/operations/traversal/content";
import Quiz from "@/app/visualizer/linkedList/operations/traversal/quiz";
import Code from "@/app/visualizer/linkedList/operations/traversal/codeBlock";
import { StandardAlgorithmPage } from "@/app/components/ui/algorithm-page";

export const metadata = {
    title: 'Linked List Traversal Algorithm | Interactive Visualization & Step-by-Step Guide',
    description:
        'Explore how traversal works in Linked Lists with interactive animations, clear explanations, and hands-on practice. Visualize each step of the traversal process and master linked list algorithms efficiently.',
    keywords: [
        'Linked List Traversal',
        'Traversal Animation Linked List',
        'Visualize Traversal in Linked List',
        'Linked List Algorithm',
        'DSA Linked List Traversal',
        'Linked List Traversal Visualization',
        'Interactive Linked List',
        'Traversal Step-by-Step',
        'Linked List Learning',
        'Data Structures Animation',
        'DSA Practice Linked List',
        'Traversal Code Example',
        'Linked List Tutorial',
        'Traversal using C',
        'Traversal using Java',
        'Traversal using Javascript',
        'Traversal using Python',
        'Traversal using linked list',
    ],
    robots: 'index, follow',
};
export default function Page() {
  const paths = [
    { name: "Home", href: "/" },
    { name: "Visualizer", href: "/visualizer" },
    { name: "Linked List", href: "/visualizer" },
    { name: "Traversal", href: "" },
  ];

  return (
    <StandardAlgorithmPage
      paths={paths}
      category="Linked List"
      title="Linked List Traversal"
      visualizerTitle="Interactive Visualizer"
      visualizerDescription="Generate a list and animate the traversal process as each node and pointer gets highlighted in sequence."
      visualizer={<Animation />}
      content={<Content />}
      code={<Code />}
      quiz={<Quiz />}
      relatedTopics={{
        title: "Explore Other Operations",
        links: [
          { text: "Insertion", url: "./insertion" },
          { text: "Deletion", url: "./deletion" },
          { text: "Compare", url: "./comparison" },
          { text: "Merge", url: "./merge" },
          { text: "Searching", url: "./search" },
          { text: "Reverse", url: "./reverse" },
        ],
      }}
    />
  );
};
