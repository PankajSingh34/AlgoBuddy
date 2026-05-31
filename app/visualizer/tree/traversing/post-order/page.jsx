import TreeTraversalVisualizer from "@/app/visualizer/tree/traversing/TreeTraversalVisualizer";
import VisualizerPageLayout, {
  createVisualizerPaths,
} from "@/app/visualizer/components/VisualizerPageLayout";
import ExploreOther from "@/app/components/ui/exploreOther";

export const metadata = {
  title: "Post-Order Traversal Visualizer | AlgoBuddy",
  description: "Visualize Post-Order binary tree traversal step-by-step with interactive animations and quizzes.",
  keywords: ["Post-Order Traversal", "Binary Tree", "DSA Visualizations"],
  robots: "index, follow",
};

const PostOrderPage = () => {
  return (
    <VisualizerPageLayout
      paths={createVisualizerPaths("Tree", "Traversing", "Post-Order")}
      title="Post-Order Traversal"
      animation={<TreeTraversalVisualizer initialMode="post-order" />}
      exploreOther={
        <ExploreOther
          title="Explore other Traversals"
          links={[
            { text: "In-Order", url: "/visualizer/tree/traversing/in-order" },
            { text: "Pre-Order", url: "/visualizer/tree/traversing/pre-order" },
            { text: "Post-Order", url: "/visualizer/tree/traversing/post-order" },
            { text: "Level-Order", url: "/visualizer/tree/traversing/level-order" },
            { text: "Morris", url: "/visualizer/tree/traversing/morris" },
          ].filter(l => l.text !== "Post-Order")}
        />
      }
    />
  );
};

export default PostOrderPage;