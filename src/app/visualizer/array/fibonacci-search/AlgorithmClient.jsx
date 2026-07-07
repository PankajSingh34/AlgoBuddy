import Animation from "@/app/visualizer/array/fibonacci-search/animation";
import ExploreOther from "@/app/components/ui/exploreOther";
import Code from "@/app/visualizer/array/fibonacci-search/codeBlock";
import Content from "@/app/visualizer/array/fibonacci-search/content";
import VisualizerPageLayout, {
  createVisualizerPaths,
} from "@/app/visualizer/components/VisualizerPageLayout";

export default function Page() {
  return (
    <VisualizerPageLayout
      paths={createVisualizerPaths("Array", "Fibonacci Search")}
      title="Fibonacci Search"
      animation={<Animation />}
      content={<Content />}
      code={<Code />}
      exploreOther={
        <ExploreOther
          title="Explore other operations"
          links={[
            {
              text: "Linear Search",
              url: "../linearsearch",
            },
            {
              text: "Binary Search",
              url: "../binarysearch",
            },
            {
              text: "Ternary Search",
              url: "../ternary-search",
            },
            {
              text: "Jump Search",
              url: "../jump-search",
            },
          ]}
        />
      }
    />
  );
}