import Animation from "@/app/visualizer/linkedList/operations/merge/animation";
import Content from "@/app/visualizer/linkedList/operations/merge/content";
import Quiz from "@/app/visualizer/linkedList/operations/merge/quiz";
import Code from "@/app/visualizer/linkedList/operations/merge/codeBlock";
import { StandardAlgorithmPage } from "@/app/components/ui/algorithm-page";

export const metadata = {
    title: 'Linked List Merge Algorithm | Interactive Visualization & Step-by-Step Guide',
    description:
        'Learn how merging works in Linked Lists with interactive animations, detailed explanations, and hands-on practice. Visualize each step of the merge process and master linked list algorithms efficiently.',
    keywords: [
        'Linked List Merge',
        'Merge Animation Linked List',
        'Visualize Merge in Linked List',
        'Linked List Algorithm',
        'DSA Linked List Merge',
        'Linked List Merge Visualization',
        'Interactive Linked List',
        'Merge Step-by-Step',
        'Linked List Learning',
        'Data Structures Animation',
        'DSA Practice Linked List',
        'Merge Code Example',
        'Linked List Tutorial',
        'Merge using C',
        'Merge using Java',
        'Merge using Javascript',
        'Merge using Python',
        'Merge using linked list',
    ],
    robots: 'index, follow',
};

export default function Page() {
  const paths = [
    { name: "Home", href: "/" },
    { name: "Visualizer", href: "/visualizer" },
    { name: "Linked List", href: "/visualizer" },
    { name: "Merge", href: "" },
  ];

  return (
    <StandardAlgorithmPage
      paths={paths}
      category="Linked List"
      title="Merge Linked Lists"
      visualizerTitle="Interactive Visualizer"
      visualizerDescription="Merge two sorted linked lists while tracking the active pointers and the growing merged result."
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
          { text: "Reverse", url: "./reverse" },
        ],
      }}
    />
  );
};
