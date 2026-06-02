import ArenaAnimation from "@/app/visualizer/sorting/race-arena/animation";
import ArenaContent from "@/app/visualizer/sorting/race-arena/content";
import ArenaCode from "@/app/visualizer/sorting/race-arena/codeBlock";
import ArenaQuiz from "@/app/visualizer/sorting/race-arena/quiz";
import ExploreOther from "@/app/components/ui/exploreOther";
import ModuleCard from "@/app/components/ui/ModuleCard";
import VisualizerPageLayout, {
  createVisualizerPaths,
} from "@/app/visualizer/components/VisualizerPageLayout";
import { MODULE_MAPS } from "@/lib/modulesMap";

export const metadata = {
  title: "Sorting Race Arena | Compare Bubble, Selection, Insertion & Quick Sort | AlgoBuddy",
  description:
    "Race multiple sorting algorithms side-by-side on identical arrays in real-time. Compare quadratic O(N^2) sorting with logarithmic O(N log N) sorting interactively with custom sizes and speed control.",
  keywords: [
    "Sorting Race Visualizer",
    "Compare Sorting Algorithms",
    "Bubble vs Quick Sort",
    "Sorting Speed Race",
    "Real-Time Sorting Comparison",
    "Learn Sorting Complexities",
    "DSA Sorting Arena",
    "Algorithm Benchmark Tool"
  ],
  robots: "index, follow",
};

export default function ArenaPage() {
  return (
    <VisualizerPageLayout
      paths={createVisualizerPaths("Array", "Sorting", "Sorting Race Arena")}
      title="Sorting Race Arena (Multi-Algorithm Comparison)"
      animation={<ArenaAnimation />}
      content={<ArenaContent />}
      code={<ArenaCode />}
      quiz={<ArenaQuiz />}
      moduleCard={
        <ModuleCard
          moduleId={MODULE_MAPS.sortingRaceArena}
          description="Mark Sorting Race Arena as done and view it on your dashboard"
          initialDone={false}
        />
      }
      exploreOther={
        <ExploreOther
          title="Explore other Sorting Operations"
          links={[
            { text: "Bubble Sort", url: "../sorting/bubblesort" },
            { text: "Selection Sort", url: "../sorting/selectionsort" },
            { text: "Insertion Sort", url: "../sorting/insertionsort" },
            { text: "Merge Sort", url: "../sorting/mergesort" },
            { text: "Quick Sort", url: "../sorting/quicksort" }
          ]}
        />
      }
    />
  );
}
