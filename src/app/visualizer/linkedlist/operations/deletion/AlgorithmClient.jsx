import Animation from "@/app/visualizer/linkedlist/operations/deletion/animation";
import Content from "@/app/visualizer/linkedlist/operations/deletion/content";
import CodeBlock from "@/app/visualizer/linkedlist/operations/deletion/codeBlock";
import ExploreOther from "@/app/components/ui/exploreOther";
import VisualizerPageLayout, {
  createVisualizerPaths,
} from "@/app/visualizer/components/VisualizerPageLayout";



export default function Page() {
  return (
    <VisualizerPageLayout
      paths={createVisualizerPaths("Linked List", "Deletion")}
      title="Deletion"
      animation={<Animation />}
      content={<Content />}
      code={<CodeBlock />}
      exploreOther={
        <ExploreOther
          title="Explore Other Types"
          links={[
            { text: "Insertion", url: "./insertion" },
            { text: "Searching", url: "./search" },
            { text: "Merge Lists", url: "./merge" },
            { text: "Comparison", url: "./comparison" },
          ]}
        />
      }
    />
  );
}
