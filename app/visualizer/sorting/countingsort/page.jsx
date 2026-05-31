import Animation from "@/app/visualizer/sorting/countingsort/animation";
import Content from "@/app/visualizer/sorting/countingsort/content";
import Quiz from "@/app/visualizer/sorting/countingsort/quiz";
import Code from "@/app/visualizer/sorting/countingsort/codeBlock";
import ExploreOther from "@/app/components/ui/exploreOther";
import ModuleCard from "@/app/components/ui/ModuleCard";
import TrackVisit from "@/app/components/ui/TrackVisit";
import VisualizerPageLayout, { createVisualizerPaths } from "@/app/visualizer/components/VisualizerPageLayout";
import { MODULE_MAPS } from "@/lib/modulesMap";

export const metadata = {
  title: "Counting Sort Algorithm | Step-by-Step Animation",
  description: "Learn Counting Sort with interactive animations.",
  robots: "index, follow",
  openGraph: { images: [{ url: "/og/visualizer.png", width: 1200, height: 630, alt: "Counting Sort" }] },
};

export default function Page() {
  return (
    <>
      <TrackVisit name="Counting Sort" path="/visualizer/sorting/countingsort" category="Sorting" />
      <VisualizerPageLayout
        paths={createVisualizerPaths("Sorting", "Counting Sort")}
        title="Counting Sort"
        animation={<Animation />}
        content={<Content />}
        code={<Code />}
        quiz={<Quiz />}
        moduleCard={<ModuleCard moduleId={MODULE_MAPS.countingSort} description="Mark Counting Sort as done and view it on your dashboard" initialDone={false} />}
        exploreOther={<ExploreOther title="Explore Sorting Algorithms" links={[
          { text: "Bubble Sort", url: "/visualizer/sorting/bubblesort" },
          { text: "Selection Sort", url: "/visualizer/sorting/selectionsort" },
          { text: "Insertion Sort", url: "/visualizer/sorting/insertionsort" },
          { text: "Merge Sort", url: "/visualizer/sorting/mergesort" },
          { text: "Quick Sort", url: "/visualizer/sorting/quicksort" },
          { text: "Comparison Mode", url: "/visualizer/sorting/comparison" },
          { text: "Heap Sort", url: "/visualizer/sorting/heapsort" },
        ]} />}
      />
    </>
  );
}
