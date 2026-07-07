import Animation from "@/app/visualizer/array/exponential-search/animation";
import ExploreOther from "@/app/components/ui/exploreOther";
import Code from "@/app/visualizer/array/exponential-search/codeBlock";
import Content from "@/app/visualizer/array/exponential-search/content";
import ModuleCard from "@/app/components/ui/ModuleCard";
import VisualizerPageLayout, {
  createVisualizerPaths,
} from "@/app/visualizer/components/VisualizerPageLayout";
import { MODULE_MAPS } from "@/lib/modulesMap";

export default function Page() {
  return (
    <VisualizerPageLayout
      paths={createVisualizerPaths("Array", "Exponential Search")}
      title="Exponential Search"
      animation={<Animation />}
      content={<Content />}
      code={<Code />}
      moduleCard={
        <ModuleCard
          moduleId={MODULE_MAPS.exponentialSearch}
          description="Mark Exponential Search as done and track your progress"
          initialDone={false}
        />
      }
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
            {
              text: "Fibonacci Search",
              url: "../fibonacci-search",
            },
          ]}
        />
      }
    />
  );
}