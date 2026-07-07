import Animation from "@/app/visualizer/array/binarysearch/animation";
import ExploreOther from "@/app/components/ui/exploreOther";
import Code from "@/app/visualizer/array/binarysearch/codeBlock";
import Content from "@/app/visualizer/array/binarysearch/content";
import VisualizerPageLayout, {
  createVisualizerPaths,
} from "@/app/visualizer/components/VisualizerPageLayout";



export default function Page() {
  return (
    <VisualizerPageLayout
      paths={createVisualizerPaths("Array", "Binary Search")}
      title="Binary Search"
      animation={<Animation />}
      content={<Content />}
      code={<Code />}
      exploreOther={
        <ExploreOther
          title="Explore other operations"
          links={[{ text: "Linear Search", url: "./linearsearch" }]}
        />
      }
    />
  );
}
