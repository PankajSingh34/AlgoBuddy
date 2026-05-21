import Animation from "@/app/visualizer/linkedList/operations/deletion/animation";
import Content from "@/app/visualizer/linkedList/operations/deletion/content";
import Quiz from "@/app/visualizer/linkedList/operations/deletion/quiz";
import Code from "@/app/visualizer/linkedList/operations/deletion/codeBlock";
import { StandardAlgorithmPage } from "@/app/components/ui/algorithm-page";

export const metadata = {
    title: 'Linked List Deletion Algorithm | Interactive Visualization & Step-by-Step Guide',
    description:
        'Learn how deletion works in Linked Lists with interactive animations, detailed explanations, and hands-on practice. Visualize each step of the deletion process and master linked list algorithms efficiently.',
    keywords: [
        'Linked List Deletion',
        'Deletion Animation Linked List',
        'Visualize Deletion in Linked List',
        'Linked List Algorithm',
        'DSA Linked List Deletion',
        'Linked List Deletion Visualization',
        'Interactive Linked List',
        'Deletion Step-by-Step',
        'Linked List Learning',
        'Data Structures Animation',
        'DSA Practice Linked List',
        'Deletion Code Example',
        'Linked List Tutorial',
        'Deletion using C',
        'Deletion using Java',
        'Deletion using Javascript',
        'Deletion using Python',
        'Deletion using linked list',
    ],
    robots: 'index, follow',
};

export default function Page() {
  const paths = [
    { name: "Home", href: "/" },
    { name: "Visualizer", href: "/visualizer" },
    { name: "Linked List", href: "/visualizer" },
    { name: "Deletion", href: "" },
  ];

  return (
    <StandardAlgorithmPage
      paths={paths}
      category="Linked List"
      title="Linked List Deletion"
      visualizerTitle="Interactive Visualizer"
      visualizerDescription="Remove the last node and watch the list update the previous node so its next pointer becomes NULL."
      visualizer={<Animation />}
      content={<Content />}
      code={<Code />}
      quiz={<Quiz />}
      relatedTopics={{
        title: "Explore Other Types",
        links: [
          { text: "Insertion", url: "./insertion" },
          { text: "Searching", url: "./search" },
          { text: "Merge Lists", url: "./merge" },
          { text: "Comparison", url: "./comparison" },
        ],
      }}
    />
  );
};
