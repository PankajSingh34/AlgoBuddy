import DsuAnimation from "@/app/visualizer/tree/advanced/dsu/animation";
import DsuContent from "@/app/visualizer/tree/advanced/dsu/content";
import DsuCode from "@/app/visualizer/tree/advanced/dsu/codeBlock";
import DsuQuiz from "@/app/visualizer/tree/advanced/dsu/quiz";
import ExploreOther from "@/app/components/ui/exploreOther";
import ModuleCard from "@/app/components/ui/ModuleCard";
import VisualizerPageLayout, {
  createVisualizerPaths,
} from "@/app/visualizer/components/VisualizerPageLayout";
import { MODULE_MAPS } from "@/lib/modulesMap";

export const metadata = {
  title: "Disjoint Set Union (DSU) Visualizer | Interactive Union-Find Algorithm | AlgoBuddy",
  description:
    "Visualize the Disjoint Set Union (DSU / Union-Find) algorithm with step-by-step interactive SVG tree diagrams and parent array grids. Explore Path Compression and Union by Rank optimizations with code examples and custom operations.",
  keywords: [
    "DSU Visualizer",
    "Disjoint Set Union Visualizer",
    "Union-Find Visualizer",
    "Union-Find Animation",
    "Path Compression Visualizer",
    "Union by Rank Visualizer",
    "Learn DSU",
    "Advanced Tree Algorithms",
    "Amortized Complexity Alpha",
    "DSU in JavaScript",
    "DSU in Python",
    "DSU in C++"
  ],
  robots: "index, follow",
};

export default function DsuPage() {
  return (
    <VisualizerPageLayout
      paths={createVisualizerPaths("Tree", "Advanced Trees", "Disjoint Set Union (DSU)")}
      title="Disjoint Set Union (DSU / Union-Find)"
      animation={<DsuAnimation />}
      content={<DsuContent />}
      code={<DsuCode />}
      quiz={<DsuQuiz />}
      moduleCard={
        <ModuleCard
          moduleId={MODULE_MAPS.dsu}
          description="Mark Disjoint Set Union (DSU) as done and view it on your dashboard"
          initialDone={false}
        />
      }
      exploreOther={
        <ExploreOther
          title="Explore other Advanced Trees"
          links={[
            { text: "Red-Black Trees", url: "./red-black" },
            { text: "B-Trees", url: "./b-trees" },
            { text: "Trie (Prefix Tree)", url: "./trie" },
            { text: "Segment Trees", url: "./segment" },
            { text: "Fenwick Trees", url: "./fenwick" }
          ]}
        />
      }
    />
  );
}
