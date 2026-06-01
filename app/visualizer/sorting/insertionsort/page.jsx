import Animation from "@/app/visualizer/sorting/insertionsort/animation";
import Content from "@/app/visualizer/sorting/insertionsort/content";
import Code from "@/app/visualizer/sorting/insertionsort/codeBlock";
import Quiz from "@/app/visualizer/sorting/insertionsort/quiz";
import ExploreOther from "@/app/components/ui/exploreOther";
import ModuleCard from "@/app/components/ui/ModuleCard";
import TrackVisit from "@/app/components/ui/TrackVisit";
import VisualizerPageLayout, {
  createVisualizerPaths,
} from "@/app/visualizer/components/VisualizerPageLayout";
import { MODULE_MAPS } from "@/lib/modulesMap";

export const metadata = {
  title: "Insertion Sort Algorithm | Step-by-Step Visualization",
  description: "Learn Insertion Sort with interactive animations and step-by-step visualization.",
  robots: "index, follow",
  openGraph: {
    images: [{ url: "/og/visualizer.png", width: 1200, height: 630, alt: "Insertion Sort Algorithm Visualization" }],
  },
};

export default function Page() {
  return (
    <>
      <TrackVisit name="Insertion Sort" path="/visualizer/sorting/insertionsort" category="Sorting" />
      <VisualizerPageLayout
        paths={createVisualizerPaths("Array", "Insertion Sort")}
        title="Insertion Sort"
        animation={<Animation />}
        content={<Content />}
        code={<Code />}
        quiz={<Quiz />}
        moduleCard={<ModuleCard moduleId={MODULE_MAPS.insertionSort} description="Mark Insertion Sort as done and view it on your dashboard" initialDone={false} />}
        exploreOther={
          <ExploreOther
            title="Explore Sorting Algorithms"
            links={[
              { text: "Bubble Sort", url: "/visualizer/sorting/bubblesort" },
              { text: "Selection Sort", url: "/visualizer/sorting/selectionsort" },
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