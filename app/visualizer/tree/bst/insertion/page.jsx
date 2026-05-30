import TreeBSTVisualizer from "../TreeBSTVisualizer";
import VisualizerPageLayout, {
  createVisualizerPaths,
} from "@/app/visualizer/components/VisualizerPageLayout";
import ExploreOther from "@/app/components/ui/exploreOther";

export const metadata = {
  title: "BST Insertion Visualizer | Interactive Binary Search Tree Operations | AlgoBuddy",
  description: "Visualize Binary Search Tree element insertion step-by-step with interactive animations, path highlightings, and quizzes.",
  keywords: ["BST Insertion", "Binary Search Tree", "Insert Node BST", "DSA Visualizations"],
  robots: "index, follow",
};

const BSTInsertionPage = () => {
  return (
    <VisualizerPageLayout
      paths={createVisualizerPaths("Tree", "Binary Search Tree", "Insertion")}
      title="BST Insertion"
      animation={<TreeBSTVisualizer initialMode="insertion" />}
      exploreOther={
        <ExploreOther
          title="Explore other BST operations"
          links={[
            { text: "Deletion", url: "/visualizer/tree/bst/deletion" },
            { text: "Searching", url: "/visualizer/tree/bst/searching" },
            { text: "Balancing (AVL)", url: "/visualizer/tree/bst/avl" },
          ]}
        />
      }
    />
  );
};

export default BSTInsertionPage;
