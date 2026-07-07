import Animation from "@/app/visualizer/linkedlist/types/doubly/animation";
import Content from "@/app/visualizer/linkedlist/types/doubly/content";
import CodeBlock from "@/app/visualizer/linkedlist/types/doubly/codeBlock";
import ExploreOther from "@/app/components/ui/exploreOther";
import VisualizerPageLayout, {
  createVisualizerPaths,
} from "@/app/visualizer/components/VisualizerPageLayout";



export default function Page() {
  return (
    <VisualizerPageLayout
      paths={createVisualizerPaths("Linked List", "Doubly Linked List")}
      title="Doubly Linked List"
      animation={<Animation />}
      content={<Content />}
      code={<CodeBlock />}
      exploreOther={
        <ExploreOther
          title="Explore Other Types"
          links={[
            { text: "Singly Linked List", url: "./singly" },
            { text: "Circular Linked List", url: "./circular" },
          ]}
        />
      }
    />
  );
}
