import TreeAVLVisualizer from "../TreeAVLVisualizer";

export const metadata = {
  title: "AVL Deletion Visualizer | Interactive AVL Tree Operations | AlgoBuddy",
  description: "Visualize AVL tree deletion step-by-step with balancing rotations, height updates, and interactive animations.",
  keywords: ["AVL Deletion", "AVL Tree", "Balanced BST", "DSA Visualizations"],
  robots: "index, follow",
};

const AVLDeletionPage = () => {
  return <TreeAVLVisualizer initialMode="deletion" />;
};

export default AVLDeletionPage;
