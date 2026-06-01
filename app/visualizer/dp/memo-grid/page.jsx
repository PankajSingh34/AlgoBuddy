import DpAnimation from "@/app/visualizer/dp/memo-grid/animation";
import DpContent from "@/app/visualizer/dp/memo-grid/content";
import DpCode from "@/app/visualizer/dp/memo-grid/codeBlock";
import DpQuiz from "@/app/visualizer/dp/memo-grid/quiz";
import ExploreOther from "@/app/components/ui/exploreOther";
import ModuleCard from "@/app/components/ui/ModuleCard";
import VisualizerPageLayout, {
  createVisualizerPaths,
} from "@/app/visualizer/components/VisualizerPageLayout";
import { MODULE_MAPS } from "@/lib/modulesMap";

export const metadata = {
  title: "Dynamic Programming Memoization & Dependency Grid Visualizer | AlgoBuddy",
  description:
    "Explore dynamic programming through interactive tabulation grids with glowing dependency arrows and top-down recursive memoization trees. Master classic DP algorithms like Knapsack and LCS with step-by-step animations.",
  keywords: [
    "Dynamic Programming Visualizer",
    "Memoization Visualizer",
    "Tabulation Visualizer",
    "Knapsack Visualizer",
    "LCS Visualizer",
    "DP Dependency Grid",
    "Recursion Tree Pruning",
    "Dynamic Programming tutorial",
    "DSA animations"
  ],
  robots: "index, follow",
};

export default function DpMemoGridPage() {
  return (
    <VisualizerPageLayout
      paths={createVisualizerPaths("Dynamic Programming", "Grid & Memoization", "Memoization & Dependency Grid")}
      title="Dynamic Programming Memoization & Grid"
      animation={<DpAnimation />}
      content={<DpContent />}
      code={<DpCode />}
      quiz={<DpQuiz />}
      moduleCard={
        <ModuleCard
          moduleId={MODULE_MAPS.dpMemoGrid}
          description="Mark Dynamic Programming Grid & Memoization as done and track it on your dashboard"
          initialDone={false}
        />
      }
      exploreOther={
        <ExploreOther
          title="Explore other Recursion & Visualizer Topics"
          links={[
            { text: "Recursion Trees", url: "/visualizer/recursion/trees" },
            { text: "Call Stack Visualization", url: "/visualizer/recursion/stack" },
            { text: "Monotonic Stack", url: "/visualizer/stack/monotonic/largestrectangle" },
            { text: "Trie (Prefix Tree)", url: "/visualizer/trees/advanced/trie" }
          ]}
        />
      }
    />
  );
}
