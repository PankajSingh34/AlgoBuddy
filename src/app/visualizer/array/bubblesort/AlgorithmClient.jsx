import Animation from "./animation";
import Content from "./content";
import Quiz from "./quiz";
import Code from "./codeBlock";
import ExploreOther from "@/app/components/ui/exploreOther";
import ModuleCard from "@/app/components/ui/ModuleCard";
import TrackVisit from "@/app/components/ui/TrackVisit";
import VisualizerPageLayout, { createVisualizerPaths } from "@/app/visualizer/components/VisualizerPageLayout";
import { MODULE_MAPS } from "@/lib/modulesMap";



export default function Page() {
  return (
    <>
      <TrackVisit name="Bubble Sort" path="/visualizer/array/bubblesort" category="Sorting" />
      <VisualizerPageLayout
        paths={createVisualizerPaths("Array", "Bubble Sort")}
        title="Bubble Sort"
        animation={<Animation />}
        content={<Content />}
        code={<Code />}
        quiz={<Quiz />}
        moduleCard={<ModuleCard moduleId={MODULE_MAPS.bubbleSort} description="Mark Bubble Sort as done and track your progress" initialDone={false} />}
        exploreOther={<ExploreOther title="Explore Sorting Algorithms" links={[
          { text: "Selection Sort", url: "/visualizer/array/selectionsort" },
          { text: "Insertion Sort", url: "/visualizer/array/insertionsort" },
          { text: "Merge Sort", url: "/visualizer/array/mergesort" },
          { text: "Quick Sort", url: "/visualizer/array/quicksort" },
          { text: "Comparison Mode", url: "/visualizer/array/comparison" },
          { text: "Counting Sort", url: "/visualizer/array/countingsort" },
          { text: "Heap Sort", url: "/visualizer/array/heapsort" },
        ]} />}
      />
    </>
  );
}
