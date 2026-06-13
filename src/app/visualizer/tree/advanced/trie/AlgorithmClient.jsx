import TrieAnimation from "@/app/visualizer/tree/advanced/trie/animation";
import TrieContent from "@/app/visualizer/tree/advanced/trie/content";
import TrieCode from "@/app/visualizer/tree/advanced/trie/codeBlock";
import TrieQuiz from "@/app/visualizer/tree/advanced/trie/quiz";
import ExploreOther from "@/app/components/ui/exploreOther";
import ModuleCard from "@/app/components/ui/ModuleCard";
import VisualizerPageLayout, {
  createVisualizerPaths,
} from "@/app/visualizer/components/VisualizerPageLayout";
import { MODULE_MAPS } from "@/lib/modulesMap";



export default function TriePage() {
  return (
    <VisualizerPageLayout
      paths={createVisualizerPaths("Tree", "Advanced Trees", "Trie (Prefix Tree)")}
      title="Trie (Prefix Tree)"
      animation={<TrieAnimation />}
      content={<TrieContent />}
      code={<TrieCode />}
      quiz={<TrieQuiz />}
      moduleCard={
        <ModuleCard
          moduleId={MODULE_MAPS.trie}
          description="Mark Trie (Prefix Tree) as done and track your progress"
          initialDone={false}
        />
      }
      exploreOther={
        <ExploreOther
          title="Explore other Advanced Trees"
          links={[
            { text: "Red-Black Trees", url: "./red-black" },
            { text: "B-Trees", url: "./b-trees" },
            { text: "Segment Trees", url: "./segment" },
            { text: "Fenwick Trees", url: "./fenwick" }
          ]}
        />
      }
    />
  );
}
