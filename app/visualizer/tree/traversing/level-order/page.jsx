import TreeTraversalVisualizer from "@/app/visualizer/tree/traversing/TreeTraversalVisualizer";
import VisualizerPageLayout, {
  createVisualizerPaths,
} from "@/app/visualizer/components/VisualizerPageLayout";
import ExploreOther from "@/app/components/ui/exploreOther";

export const metadata = {
  title: "Level-Order Traversal Visualizer | AlgoBuddy",
  description: "Visualize Level-Order binary tree traversal step-by-step with interactive animations and quizzes.",
  keywords: ["Level-Order Traversal", "Binary Tree", "DSA Visualizations"],
  robots: "index, follow",
};

const LevelOrderPage = () => {
  return (
    <VisualizerPageLayout
      paths={createVisualizerPaths("Tree", "Traversing", "Level-Order")}
      title="Level-Order Traversal"
      animation={<TreeTraversalVisualizer initialMode="level-order" />}
      exploreOther={
        <ExploreOther
          title="Explore other Traversals"
          links={[
            { text: "In-Order", url: "/visualizer/tree/traversing/in-order" },
            { text: "Pre-Order", url: "/visualizer/tree/traversing/pre-order" },
            { text: "Post-Order", url: "/visualizer/tree/traversing/post-order" },
            { text: "Level-Order", url: "/visualizer/tree/traversing/level-order" },
            { text: "Morris", url: "/visualizer/tree/traversing/morris" },
          ].filter(l => l.text !== "Level-Order")}
        />
      }
    />
  );
};

export default LevelOrderPage;