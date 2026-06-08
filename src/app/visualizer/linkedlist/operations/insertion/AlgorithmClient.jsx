import Animation from "./animation";
import Content from "./content";
import Quiz from "./quiz";
import CodeBlock from "./codeBlock";
import ExploreOther from "@/app/components/ui/exploreOther";
import VisualizerPageLayout, {
  createVisualizerPaths,
} from "@/app/visualizer/components/VisualizerPageLayout";



export default function Page() {
  return (
    <VisualizerPageLayout
      paths={createVisualizerPaths("Linked List", "Insertion")}
      title="Insertion"
      animation={<Animation />}
      content={<Content />}
      code={<CodeBlock />}
      quiz={<Quiz />}
      exploreOther={
        <ExploreOther
          title="Explore Other Types"
          links={[
            { text: "Traversal", url: "./traversal" },
            { text: "Deletion", url: "./deletion" },
            { text: "Searching", url: "./search" },
            { text: "Merging", url: "./merge" },
            { text: "Comparison", url: "./comparison" },
            { text: "Reverse", url: "./reverse" },
          ]}
        />
      }
    />
  );
}
