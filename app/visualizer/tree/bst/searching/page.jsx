import TreeBSTVisualizer from "../TreeBSTVisualizer";
import VisualizerPageLayout, {
  createVisualizerPaths,
} from "@/app/visualizer/components/VisualizerPageLayout";
import ExploreOther from "@/app/components/ui/exploreOther";

export const metadata = {
  title: "BST Searching Visualizer | AlgoBuddy",
  description: "Visualize Binary Search Tree searching step-by-step with interactive animations and quizzes.",
  keywords: ["BST Searching", "Binary Search Tree", "DSA Visualizations"],
  robots: "index, follow",
};

const BSTSearchingPage = () => {
  return (
    <VisualizerPageLayout
      paths={createVisualizerPaths("Tree", "Binary Search Tree", "Searching")}
      title="BST Searching"
      animation={<TreeBSTVisualizer initialMode="searching" />}
      exploreOther={
        <ExploreOther
          title="Explore other BST operations"
          links={[
            { text: "Insertion", url: "/visualizer/tree/bst/insertion" },
            { text: "Deletion", url: "/visualizer/tree/bst/deletion" },
            { text: "Searching", url: "/visualizer/tree/bst/searching" },
            { text: "Balancing (AVL)", url: "/visualizer/tree/bst/avl" },
          ].filter(l => l.text !== "Searching")}
        />
      }
    />
  );
};

export default BSTSearchingPage;