import TreeBSTVisualizer from "../TreeBSTVisualizer";

export const metadata = {
  title: "BST Post-Order Traversal Visualizer | Interactive Binary Search Tree Operations | AlgoBuddy",
  description: "Visualize Binary Search Tree post-order traversal step-by-step with interactive animations, path highlighting, and quizzes.",
  keywords: ["BST Post-Order Traversal", "Binary Search Tree", "Postorder Traversal", "DSA Visualizations"],
  robots: "index, follow",
};

const BSTPostOrderPage = () => {
  return <TreeBSTVisualizer initialMode="post-order" />;
};

export default BSTPostOrderPage;
