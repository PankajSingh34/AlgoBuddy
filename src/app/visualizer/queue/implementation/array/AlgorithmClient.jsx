import ArticleActions from "@/app/components/ui/ArticleActions";
import Content from "@/app/visualizer/queue/implementation/array/content";
import Code from "@/app/visualizer/queue/implementation/array/codeblock";
import ExploreOther from "@/app/components/ui/exploreOther";
import VisualizerPageLayout, {
  createVisualizerPaths,
} from "@/app/visualizer/components/VisualizerPageLayout";



export default function Page() {
  return (
    <VisualizerPageLayout
      paths={createVisualizerPaths("Queue", "Using Array")}
      title="Using Array"
      headerActions={<ArticleActions />}
      content={<Content />}
      code={<Code />}
      exploreOther={
        <ExploreOther
          title="Explore other implementation"
          links={[{ text: "Using Linked List", url: "./linkedList" }]}
        />
      }
    />
  );
}
