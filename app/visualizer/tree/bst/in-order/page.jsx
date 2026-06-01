import TreeBSTVisualizer from "../TreeBSTVisualizer";

export const metadata = {
  title: "BST In-Order Traversal Visualizer | Interactive Binary Search Tree Operations | AlgoBuddy",
  description: "Visualize Binary Search Tree in-order traversal step-by-step with interactive animations, path highlighting, and quizzes.",
  keywords: ["BST In-Order Traversal", "Binary Search Tree", "Inorder Traversal", "DSA Visualizations"],
  robots: "index, follow",
};

const BSTInOrderPage = () => {
  return <TreeBSTVisualizer initialMode="in-order" />;
};

export default BSTInOrderPage;
