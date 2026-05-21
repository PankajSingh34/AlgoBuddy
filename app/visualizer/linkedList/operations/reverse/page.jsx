import Animation from "@/app/visualizer/linkedList/operations/reverse/animation";
import Content from "@/app/visualizer/linkedList/operations/reverse/content";
import Quiz from "@/app/visualizer/linkedList/operations/reverse/quiz";
import Code from "@/app/visualizer/linkedList/operations/reverse/codeBlock";
import { StandardAlgorithmPage } from "@/app/components/ui/algorithm-page";

export const metadata = {
    title: 'Linked List Reverse Algorithm | Interactive Visualization & Step-by-Step Guide',
    description:
        'Explore how reversing a linked list works with interactive animations, clear explanations, and hands-on practice. Visualize each step of the reverse process and master linked list algorithms efficiently.',
    keywords: [
        'Linked List Reverse',
        'Reverse Animation Linked List',
        'Visualize Reverse in Linked List',
        'Linked List Algorithm',
        'DSA Linked List Reverse',
        'Linked List Reverse Visualization',
        'Interactive Linked List',
        'Reverse Step-by-Step',
        'Linked List Learning',
        'Data Structures Animation',
        'DSA Practice Linked List',
        'Reverse Code Example',
        'Linked List Tutorial',
        'Reverse using C',
        'Reverse using Java',
        'Reverse using Javascript',
        'Reverse using Python',
        'Reverse linked list',
    ],
    robots: 'index, follow',
};

export default function Page() {
  const paths = [
    { name: "Home", href: "/" },
    { name: "Visualizer", href: "/visualizer" },
    { name: "Linked List", href: "/visualizer" },
    { name: "Reverse", href: "" },
  ];

  return (
    <StandardAlgorithmPage
      paths={paths}
      category="Linked List"
      title="Reverse Linked List"
      visualizerTitle="Interactive Visualizer"
      visualizerDescription="Follow the current, previous, and next pointers as each link gets rewired during reversal."
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
          { text: "Comparison", url: "./comparison" },
          { text: "Searching", url: "./search" },
          { text: "Merging", url: "./merge" },
        ],
      }}
    />
  );
};
