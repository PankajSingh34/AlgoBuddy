import TreeAVLVisualizer from "../TreeAVLVisualizer";

export const metadata = {
  title: "AVL Insertion Visualizer | Interactive AVL Tree Operations | AlgoBuddy",
  description: "Visualize AVL tree insertion step-by-step with balancing rotations, height updates, and interactive animations.",
  keywords: ["AVL Insertion", "AVL Tree", "Balanced BST", "DSA Visualizations"],
  robots: "index, follow",
};

const AVLInsertionPage = () => {
  return <TreeAVLVisualizer initialMode="insertion" />;
};

export default AVLInsertionPage;
