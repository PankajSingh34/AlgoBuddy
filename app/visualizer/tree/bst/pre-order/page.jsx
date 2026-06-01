import TreeBSTVisualizer from "../TreeBSTVisualizer";

export const metadata = {
  title: "BST Pre-Order Traversal Visualizer | Interactive Binary Search Tree Operations | AlgoBuddy",
  description: "Visualize Binary Search Tree pre-order traversal step-by-step with interactive animations, path highlighting, and quizzes.",
  keywords: ["BST Pre-Order Traversal", "Binary Search Tree", "Preorder Traversal", "DSA Visualizations"],
  robots: "index, follow",
};

const BSTPreOrderPage = () => {
  return <TreeBSTVisualizer initialMode="pre-order" />;
};

export default BSTPreOrderPage;
