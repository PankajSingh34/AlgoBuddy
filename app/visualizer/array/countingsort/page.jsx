import Animation from "@/app/visualizer/array/countingsort/animation";
import Content from "@/app/visualizer/array/countingsort/content";
import Quiz from "@/app/visualizer/array/countingsort/quiz";
import Code from "@/app/visualizer/array/countingsort/codeBlock";
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
      paths={createVisualizerPaths("Array", "Counting Sort")}
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
            { text: "Bubble Sort", url: "/visualizer/array/bubblesort" },
            { text: "Selection Sort", url: "/visualizer/array/selectionsort" },
            { text: "Insertion Sort", url: "/visualizer/array/insertionsort" },
            { text: "Merge Sort", url: "/visualizer/array/mergesort" },
            { text: "Quick Sort", url: "/visualizer/array/quicksort" },
          ]}
        />
      }
    />
  );
}
