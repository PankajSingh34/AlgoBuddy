import ArticleActions from "@/app/components/ui/ArticleActions";
import Content from "@/app/visualizer/stack/implementation/usingArray/content";
import Code from "@/app/visualizer/stack/implementation/usingArray/codeBlock";
import ExploreOther from "@/app/components/ui/exploreOther";
import VisualizerPageLayout, {
  createVisualizerPaths,
} from "@/app/visualizer/components/VisualizerPageLayout";



export default function Page() {
  return (
    <VisualizerPageLayout
      paths={createVisualizerPaths("Stack", "Implementation Using Array")}
      title="Implementation Using Array"
      headerActions={<ArticleActions />}
      content={<Content />}
      code={<Code />}
      exploreOther={
        <ExploreOther
          title="Explore other implementation"
          links={[{ text: "Using Linked List", url: "./usingLinkedList" }]}
        />
      }
    />
  );
}
