import ArticleActions from "@/app/components/ui/ArticleActions";
import Content from "@/app/visualizer/stack/implementation/usingLinkedList/content";
import Code from "@/app/visualizer/stack/implementation/usingLinkedList/codeBlock";
import ExploreOther from "@/app/components/ui/exploreOther";
import VisualizerPageLayout, {
  createVisualizerPaths,
} from "@/app/visualizer/components/VisualizerPageLayout";



export default function Page() {
  return (
    <VisualizerPageLayout
      paths={createVisualizerPaths("Stack", "Implementation Using Linked List")}
      title="Implementation Using Linked List"
      headerActions={<ArticleActions />}
      content={<Content />}
      code={<Code />}
      exploreOther={
        <ExploreOther
          title="Explore other implementation"
          links={[{ text: "Using Array", url: "./usingArray" }]}
        />
      }
    />
  );
}
