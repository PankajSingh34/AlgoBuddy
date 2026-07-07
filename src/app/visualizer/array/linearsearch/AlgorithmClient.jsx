import LinearSearchAnimation from "@/app/visualizer/array/linearsearch/animation";
import ExploreOther from "@/app/components/ui/exploreOther";
import Code from "@/app/visualizer/array/linearsearch/codeBlock";
import Content from "@/app/visualizer/array/linearsearch/content";
import ArticleActions from "@/app/components/ui/ArticleActions";
import VisualizerPageLayout, {
  createVisualizerPaths,
} from "@/app/visualizer/components/VisualizerPageLayout";



export default function Page() {
  return (
    <VisualizerPageLayout
      paths={createVisualizerPaths("Array", "Linear Search")}
      title="Linear Search"
      headerActions={<ArticleActions />}
      animation={<LinearSearchAnimation />}
      content={<Content />}
      code={<Code />}
      exploreOther={
        <ExploreOther
          title="Explore other operations"
          links={[{ text: "Binary Search", url: "./binarysearch" }]}
        />
      }
    />
  );
}
