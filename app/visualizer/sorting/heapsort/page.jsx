import Animation from "@/app/visualizer/sorting/heapsort/animation";
import Content from "@/app/visualizer/sorting/heapsort/content";
import Code from "@/app/visualizer/sorting/heapsort/codeBlock";
import Quiz from "@/app/visualizer/sorting/heapsort/quiz";
import ExploreOther from "@/app/components/ui/exploreOther";
import ModuleCard from "@/app/components/ui/ModuleCard";
import TrackVisit from "@/app/components/ui/TrackVisit";
import VisualizerPageLayout, {
  createVisualizerPaths,
} from "@/app/visualizer/components/VisualizerPageLayout";
import { MODULE_MAPS } from "@/lib/modulesMap";

export const metadata = {
  title: "Heap Sort Algorithm | Learn with Interactive Animations",
  description: "Learn Heap Sort with step-by-step visualization of max-heap construction, swapping, heapifying, and extraction.",
  robots: "index, follow",
  openGraph: {
    images: [{ url: "/og/visualizer.png", width: 1200, height: 630, alt: "Heap Sort Algorithm Visualization" }],
  },
};

export default function Page() {
  return (
    <>
      <TrackVisit name="Heap Sort" path="/visualizer/sorting/heapsort" category="Sorting" />
      <VisualizerPageLayout
        paths={createVisualizerPaths("Sorting", "Heap Sort")}
        title="Heap Sort"
        animation={<Animation />}
        content={<Content />}
        code={<Code />}
        quiz={<Quiz />}
        moduleCard={<ModuleCard moduleId={MODULE_MAPS.heapSort} description="Mark Heap Sort as done and view it on your dashboard" initialDone={false} />}
        exploreOther={
          <ExploreOther
            title="Explore Sorting Algorithms"
            links={[
              { text: "Bubble Sort", url: "/visualizer/sorting/bubblesort" },
              { text: "Selection Sort", url: "/visualizer/sorting/selectionsort" },
              { text: "Insertion Sort", url: "/visualizer/sorting/insertionsort" },
              { text: "Merge Sort", url: "/visualizer/sorting/mergesort" },
              { text: "Quick Sort", url: "/visualizer/sorting/quicksort" },
              { text: "Counting Sort", url: "/visualizer/sorting/countingsort" },
              { text: "Comparison Mode", url: "/visualizer/sorting/comparison" },
            ]}
          />
        }
      />
    </>
  );
}