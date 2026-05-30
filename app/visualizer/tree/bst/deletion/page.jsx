import TreeBSTVisualizer from "../TreeBSTVisualizer";
import VisualizerPageLayout, {
  createVisualizerPaths,
} from "@/app/visualizer/components/VisualizerPageLayout";
import ExploreOther from "@/app/components/ui/exploreOther";

export const metadata = {
  title: "BST Deletion Visualizer | AlgoBuddy",
  description: "Visualize Binary Search Tree deletion step-by-step with interactive animations and quizzes.",
  keywords: ["BST Deletion", "Binary Search Tree", "DSA Visualizations"],
  robots: "index, follow",
};

const BSTDeletionPage = () => {
  return (
    <VisualizerPageLayout
      paths={createVisualizerPaths("Tree", "Binary Search Tree", "Deletion")}
      title="BST Deletion"
      animation={<TreeBSTVisualizer initialMode="deletion" />}
      exploreOther={
        <ExploreOther
          title="Explore other BST operations"
          links={[
            { text: "Insertion", url: "/visualizer/tree/bst/insertion" },
            { text: "Deletion", url: "/visualizer/tree/bst/deletion" },
            { text: "Searching", url: "/visualizer/tree/bst/searching" },
            { text: "Balancing (AVL)", url: "/visualizer/tree/bst/avl" },
          ].filter(l => l.text !== "Deletion")}
        />
      }
    />
  );
};

export default BSTDeletionPage;