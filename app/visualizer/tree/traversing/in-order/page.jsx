import TreeTraversalVisualizer from "@/app/visualizer/tree/traversing/TreeTraversalVisualizer";
import VisualizerPageLayout, {
  createVisualizerPaths,
} from "@/app/visualizer/components/VisualizerPageLayout";
import ExploreOther from "@/app/components/ui/exploreOther";

export const metadata = {
  title: "In-Order Traversal Visualizer | AlgoBuddy",
  description: "Visualize In-Order binary tree traversal step-by-step with interactive animations and quizzes.",
  keywords: ["In-Order Traversal", "Binary Tree", "DSA Visualizations"],
  robots: "index, follow",
};

const InOrderPage = () => {
  return (
    <VisualizerPageLayout
      paths={createVisualizerPaths("Tree", "Traversing", "In-Order")}
      title="In-Order Traversal"
      animation={<TreeTraversalVisualizer initialMode="in-order" />}
      exploreOther={
        <ExploreOther
          title="Explore other Traversals"
          links={[
            { text: "In-Order", url: "/visualizer/tree/traversing/in-order" },
            { text: "Pre-Order", url: "/visualizer/tree/traversing/pre-order" },
            { text: "Post-Order", url: "/visualizer/tree/traversing/post-order" },
            { text: "Level-Order", url: "/visualizer/tree/traversing/level-order" },
            { text: "Morris", url: "/visualizer/tree/traversing/morris" },
          ].filter(l => l.text !== "In-Order")}
        />
      }
    />
  );
};

export default InOrderPage;