import Animation from "@/app/visualizer/queue/operations/enqueue-dequeue/animation";
import ArticleActions from "@/app/components/ui/ArticleActions";
import Content from "@/app/visualizer/queue/operations/enqueue-dequeue/content";
import Code from "@/app/visualizer/queue/operations/enqueue-dequeue/codeBlock";
import ExploreOther from "@/app/components/ui/exploreOther";
import VisualizerPageLayout, {
  createVisualizerPaths,
} from "@/app/visualizer/components/VisualizerPageLayout";



export default function Page() {
  return (
    <VisualizerPageLayout
      paths={createVisualizerPaths("Queue", "Enqueue & Dequeue")}
      title="Enqueue & Dequeue"
      headerActions={<ArticleActions />}
      animation={<Animation />}
      content={<Content />}
      code={<Code />}
      exploreOther={
        <ExploreOther
          title="Explore Other Operations"
          links={[
            { text: "Peek Front", url: "./peek-front" },
            { text: "Is Empty", url: "./isempty" },
            { text: "Is Full", url: "./isfull" },
          ]}
        />
      }
    />
  );
}
