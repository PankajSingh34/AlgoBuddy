import Animation from "@/app/visualizer/sorting/countingsort/animation";
import Content from "@/app/visualizer/sorting/countingsort/content";
import Code from "@/app/visualizer/sorting/countingsort/codeBlock";
import Quiz from "@/app/visualizer/sorting/countingsort/quiz";
import ExploreOther from "@/app/components/ui/exploreOther";
import ModuleCard from "@/app/components/ui/ModuleCard";
import VisualizerPageLayout, {
  createVisualizerPaths,
} from "@/app/visualizer/components/VisualizerPageLayout";
import { MODULE_MAPS } from "@/lib/modulesMap";

export const metadata = {
  title: "Counting Sort Algorithm | Step-by-Step Visualization",
  description:
    "Visualize Counting Sort with frequency counts, cumulative counts, stable output placement, code examples, complexity analysis, and an interactive quiz.",
  keywords: [
    "Counting Sort Visualizer",
    "Counting Sort Animation",
    "Counting Sort Algorithm",
    "Non Comparison Sorting",
    "Linear Time Sorting",
    "Sorting Algorithm Visualization",
    "DSA Counting Sort",
    "Counting Sort Code Examples",
    "Counting Sort Quiz",
  ],
  robots: "index, follow",
  openGraph: {
    images: [
      {
        url: "/og/visualizer.png",
        width: 1200,
        height: 630,
        alt: "Counting Sort Algorithm Visualization",
      },
    ],
  },
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
          description="Mark Counting Sort as done and view it on your dashboard"
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
