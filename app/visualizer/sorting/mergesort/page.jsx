import Animation from "@/app/visualizer/sorting/mergesort/animation";
import Content from "@/app/visualizer/sorting/mergesort/content";
import Quiz from "@/app/visualizer/sorting/mergesort/quiz";
import Code from "@/app/visualizer/sorting/mergesort/codeBlock";
import ExploreOther from "@/app/components/ui/exploreOther";
import ModuleCard from "@/app/components/ui/ModuleCard";
import TrackVisit from "@/app/components/ui/TrackVisit";
import VisualizerPageLayout, { createVisualizerPaths } from "@/app/visualizer/components/VisualizerPageLayout";
import { MODULE_MAPS } from "@/lib/modulesMap";

export const metadata = {
  title: "Merge Sort Algorithm | Step-by-Step Animation",
  description: "Learn Merge Sort with interactive animations.",
  robots: "index, follow",
  openGraph: { images: [{ url: "/og/visualizer.png", width: 1200, height: 630, alt: "Merge Sort" }] },
};

export default function Page() {
  return (
    <>
      <TrackVisit name="Merge Sort" path="/visualizer/sorting/mergesort" category="Sorting" />
      <VisualizerPageLayout
        paths={createVisualizerPaths("Array", "Merge Sort")}
        title="Merge Sort"
        animation={<Animation />}
        content={<Content />}
        code={<Code />}
        quiz={<Quiz />}
        moduleCard={<ModuleCard moduleId={MODULE_MAPS.mergeSort} description="Mark Merge Sort as done and view it on your dashboard" initialDone={false} />}
        exploreOther={<ExploreOther title="Explore Sorting Algorithms" links={[
          { text: "Bubble Sort", url: "/visualizer/sorting/bubblesort" },
          { text: "Selection Sort", url: "/visualizer/sorting/selectionsort" },
          { text: "Insertion Sort", url: "/visualizer/sorting/insertionsort" },
          { text: "Quick Sort", url: "/visualizer/sorting/quicksort" },
          { text: "Comparison Mode", url: "/visualizer/sorting/comparison" },
          { text: "Counting Sort", url: "/visualizer/sorting/countingsort" },
          { text: "Heap Sort", url: "/visualizer/sorting/heapsort" },
        ]} />}
      />
    </>
  );
}
