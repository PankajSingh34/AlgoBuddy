import Animation from "@/app/visualizer/sorting/selectionsort/animation";
import Content from "@/app/visualizer/sorting/selectionsort/content";
import Code from "@/app/visualizer/sorting/selectionsort/codeBlock";
import Quiz from "@/app/visualizer/sorting/selectionsort/quiz";
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
      <TrackVisit name="Selection Sort" path="/visualizer/sorting/selectionsort" category="Sorting" />
      <VisualizerPageLayout
        paths={createVisualizerPaths("Sorting", "Selection Sort")}
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
              { text: "Bubble Sort", url: "/visualizer/sorting/bubblesort" },
              { text: "Insertion Sort", url: "/visualizer/sorting/insertionsort" },
              { text: "Merge Sort", url: "/visualizer/sorting/mergesort" },
              { text: "Quick Sort", url: "/visualizer/sorting/quicksort" },
              { text: "Comparison Mode", url: "/visualizer/sorting/comparison" },
              { text: "Counting Sort", url: "/visualizer/sorting/countingsort" },
              { text: "Heap Sort", url: "/visualizer/sorting/heapsort" },
            ]}
          />
        }
      />
    </>
  );
}