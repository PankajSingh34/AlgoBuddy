import Animation from "@/app/visualizer/trees/traversing/in-order/animation";
import { StandardAlgorithmPage } from "@/app/components/ui/algorithm-page";

export const metadata = {
  title: 'Tree Visualizer | Learn Tree Data Structures with Animation',
  description: 'Visualize how Tree Data Structures work in DSA with interactive animations. Perfect for beginners and interview prep.',
  keywords: ['Tree DSA', 'Tree Visualizer', 'Learn Tree', 'Binary Tree', 'DSA Animation'],
  robots: "index, follow",
};

const TreeVisualizer = () => {
  const paths = [
    { name: "Home", href: "/" },
    { name: "Visualizer", href: "/visualizer" },
    { name: "Tree", href: "/visualizer" },
    { name: "In-Order Traversal", href: "" },
  ];

  return (
    <StandardAlgorithmPage
      paths={paths}
      category="Tree"
      title="In-Order Traversal"
      visualizerTitle="Interactive Visualizer"
      visualizerDescription="Insert values into the tree, then animate the left-root-right traversal order step by step."
      visualizer={<Animation />}
    />
  );
};

export default TreeVisualizer;
