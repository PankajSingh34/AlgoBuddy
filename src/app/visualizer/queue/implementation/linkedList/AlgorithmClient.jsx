import ArticleActions from "@/app/components/ui/ArticleActions";
import Content from "@/app/visualizer/queue/implementation/linkedList/content";
import Code from "@/app/visualizer/queue/implementation/linkedList/codeBlock";
import ExploreOther from "@/app/components/ui/exploreOther";
import VisualizerPageLayout, {
  createVisualizerPaths,
} from "@/app/visualizer/components/VisualizerPageLayout";



export default function Page() {
  return (
    <VisualizerPageLayout
      paths={createVisualizerPaths("Queue", "Using Linked List")}
      title="Using Linked List"
      headerActions={<ArticleActions />}
      content={<Content />}
      code={<Code />}
      exploreOther={
        <ExploreOther
          title="Explore other implementation"
          links={[{ text: "Using Array", url: "./array" }]}
        />
      }
    />
  );
}
