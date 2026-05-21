import Animation from "@/app/visualizer/trees/binaryTree/types/animation";
import Content from "@/app/visualizer/trees/binaryTree/types/content";
import Code from "@/app/visualizer/trees/binaryTree/types/codeBlock";
import { StandardAlgorithmPage } from "@/app/components/ui/algorithm-page";

export const metadata = {
  title: 'Binary Tree Types | Learn Full, Complete, and Degenerate Binary Trees in DSA',
  description: 'Learn about Binary Tree types in Data Structures and Algorithms, including Full Binary Tree, Complete Binary Tree, and Degenerate Tree with clear visual explanations, animations, and code examples in JavaScript, C, Python, and Java.',
  keywords: [
    'Binary Tree',
    'Binary Tree Types',
    'Full Binary Tree',
    'Complete Binary Tree',
    'Degenerate Tree',
    'Binary Tree Visualization',
    'DSA Binary Trees',
    'Binary Tree Animation',
    'Binary Tree Implementation',
    'Binary Tree in JavaScript',
    'Binary Tree in C',
    'Binary Tree in Python',
    'Binary Tree in Java',
    'Learn Binary Trees DSA',
  ],
  robots: 'index, follow',
};

export default function Page(){
  const paths = [
    { name: "Home", href: "/" },
    { name: "Visualizer", href: "/visualizer" },
    { name: "Tree", href: "/visualizer" },
    { name: "Types of Binary Trees", href: "" },
  ];

  return(
    <StandardAlgorithmPage
      paths={paths}
      category="Tree"
      title="Types of Binary Trees"
      content={<Content />}
      code={<Code />}
      relatedTopics={{
        title: "Explore other implementation",
        links: [{ text: "Structure & Properties", url: "./properties" }],
      }}
    />
  );
};
