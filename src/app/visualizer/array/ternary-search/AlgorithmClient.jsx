import Animation from "@/app/visualizer/array/ternary-search/animation";
import ExploreOther from "@/app/components/ui/exploreOther";
import Code from "@/app/visualizer/array/ternary-search/codeBlock";
import Content from "@/app/visualizer/array/ternary-search/content";
import ModuleCard from "@/app/components/ui/ModuleCard";
import VisualizerPageLayout, {
  createVisualizerPaths,
} from "@/app/visualizer/components/VisualizerPageLayout";
import { MODULE_MAPS } from "@/lib/modulesMap";

export default function Page() {
  return (
    <VisualizerPageLayout
      paths={createVisualizerPaths("Array", "Ternary Search")}
      title="Ternary Search"
      animation={<Animation />}
      content={<Content />}
      code={<Code />}
      moduleCard={
        <ModuleCard
          moduleId={MODULE_MAPS.ternarySearch}
          description="Mark ternary search as done and track your progress"
          initialDone={false}
        />
      }
      exploreOther={
        <ExploreOther
          title="Explore other operations"
          links={[
            { text: "Linear Search", url: "../linearsearch" },
            { text: "Binary Search", url: "../binarysearch" },
          ]}
        />
      }
    />
  );
}