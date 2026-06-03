import Content from "./content";
import CodeBlock from "./codeBlock";
import ExploreOther from "@/app/components/ui/exploreOther";
import VisualizerPageLayout, {
  createVisualizerPaths,
} from "@/app/visualizer/components/VisualizerPageLayout";



export default function Page() {
  return (
    <VisualizerPageLayout
      paths={createVisualizerPaths("Tree", "Types of Binary Trees")}
      title="Types of Binary Trees"
      content={<Content />}
      code={<CodeBlock />}
      exploreOther={
        <ExploreOther
          title="Explore other implementation"
          links={[{ text: "Structure & Properties", url: "/visualizer/tree/binaryTree/properties" }]}
        />
      }
    />
  );
}
