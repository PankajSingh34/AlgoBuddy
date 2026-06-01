import Animation from "@/app/visualizer/array/selectionsort/animation";
import Content from "@/app/visualizer/array/selectionsort/content";
import Code from "@/app/visualizer/array/selectionsort/codeBlock";
import Quiz from "@/app/visualizer/array/selectionsort/quiz";
import ExploreOther from "@/app/components/ui/exploreOther";
import ModuleCard from "@/app/components/ui/ModuleCard";
import TrackVisit from "@/app/components/ui/TrackVisit";
import VisualizerPageLayout, {
  createVisualizerPaths,
} from "@/app/visualizer/components/VisualizerPageLayout";
import { MODULE_MAPS } from "@/lib/modulesMap";

export const metadata = {
  title: "Selection Sort Algorithm | Step-by-Step Visualization",
  description: "Learn Selection Sort with interactive animations and step-by-step visualization.",
  robots: "index, follow",
  openGraph: {
    images: [{ url: "/og/visualizer.png", width: 1200, height: 630, alt: "Selection Sort Algorithm Visualization" }],
  },
};

export default function Page() {
  return (
    <>
      <TrackVisit name="Selection Sort" path="/visualizer/array/selectionsort" category="Sorting" />
      <VisualizerPageLayout
        paths={createVisualizerPaths("Array", "Selection Sort")}
        title="Selection Sort"
        animation={<Animation />}
        content={<Content />}
        code={<Code />}
        quiz={<Quiz />}
        moduleCard={<ModuleCard moduleId={MODULE_MAPS.selectionSort} description="Mark Selection Sort as done and view it on your dashboard" initialDone={false} />}
        exploreOther={
          <ExploreOther
            title="Explore Sorting Algorithms"
            links={[
              { text: "Bubble Sort", url: "/visualizer/array/bubblesort" },
              { text: "Insertion Sort", url: "/visualizer/array/insertionsort" },
              { text: "Merge Sort", url: "/visualizer/array/mergesort" },
              { text: "Quick Sort", url: "/visualizer/array/quicksort" },
              { text: "Comparison Mode", url: "/visualizer/array/comparison" },
              { text: "Counting Sort", url: "/visualizer/array/countingsort" },
              { text: "Heap Sort", url: "/visualizer/array/heapsort" },
            ]}
          />
        }
      />
    </>
  );
}