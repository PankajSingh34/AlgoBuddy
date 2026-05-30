import Animation from "@/app/visualizer/sorting/countingsort/animation";
import Content from "@/app/visualizer/sorting/countingsort/content";
import Quiz from "@/app/visualizer/sorting/countingsort/quiz";
import Code from "@/app/visualizer/sorting/countingsort/codeBlock";
import ExploreOther from "@/app/components/ui/exploreOther";
import ModuleCard from "@/app/components/ui/ModuleCard";
import VisualizerPageLayout, { createVisualizerPaths } from "@/app/visualizer/components/VisualizerPageLayout";
import { MODULE_MAPS } from "@/lib/modulesMap";

export const metadata = {
  title: "Counting Sort Algorithm | Learn with Step-by-Step Animation",
  description:
    "Visualize Counting Sort in action with educational explanations, code examples, and a beginner-friendly quiz. Learn how Counting Sort counts occurrences and builds a sorted array efficiently.",
  keywords: [
    "Counting Sort Visualizer",
    "Counting Sort Animation",
    "Counting Sort Algorithm",
    "Counting Sort Quiz",
    "Sorting Algorithm Visualization",
    "Counting Sort in JavaScript",
    "Counting Sort in Python",
    "Algorithm Visualization",
  ],
};

export default function Page() {
  return (
    <VisualizerPageLayout
      paths={createVisualizerPaths("Sorting", "Counting Sort")}
      title="Counting Sort"
      animation={<Animation />}
      content={<Content />}
      code={<Code />}
      quiz={<Quiz />}
      moduleCard={
        <ModuleCard
          moduleId={MODULE_MAPS.countingSort}
          description="Mark Counting Sort as done and track it on your learning dashboard"
          initialDone={false}
        />
      }
      exploreOther={
        <ExploreOther
          title="Explore Sorting Algorithms"
          links={[
            { text: "Bubble Sort", url: "/visualizer/sorting/bubblesort" },
            { text: "Selection Sort", url: "/visualizer/sorting/selectionsort" },
            { text: "Insertion Sort", url: "/visualizer/sorting/insertionsort" },
            { text: "Merge Sort", url: "/visualizer/sorting/mergesort" },
            { text: "Quick Sort", url: "/visualizer/sorting/quicksort" },
          ]}
        />
      }
    />
  );
}
