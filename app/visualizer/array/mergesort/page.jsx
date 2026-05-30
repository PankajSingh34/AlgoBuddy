import Animation from "@/app/visualizer/array/mergesort/animation";
import Content from "@/app/visualizer/array/mergesort/content";
import Quiz from "@/app/visualizer/array/mergesort/quiz";
import Code from "@/app/visualizer/array/mergesort/codeBlock";
import ExploreOther from "@/app/components/ui/exploreOther";
import ModuleCard from "@/app/components/ui/ModuleCard";
import VisualizerPageLayout, {
  createVisualizerPaths,
} from "@/app/visualizer/components/VisualizerPageLayout";
import { MODULE_MAPS } from "@/lib/modulesMap";

export const metadata = {
  title: "Merge Sort Algorithm | Learn with Interactive Animations",
  description:
    "Understand how Merge Sort works through step-by-step animations and test your knowledge with an interactive quiz. Includes code examples in JavaScript, C, Python, and Java. Perfect for beginners learning efficient divide-and-conquer sorting algorithms both visually and through hands-on coding.",
  keywords: [
    "Merge Sort Visualizer",
    "Merge Sort Animation",
    "Merge Sort Visualization",
    "Merge Sort Algorithm",
    "Merge Sort Quiz",
    "Sorting Algorithm Quiz",
    "Divide and Conquer Sorting",
    "Sorting Algorithm Visualization",
    "Learn Merge Sort",
    "DSA Merge Sort",
    "Practice Merge Sort",
    "Interactive Merge Sort Tool",
    "Test Merge Sort Knowledge",
    "Merge Sort in JavaScript",
    "Merge Sort in C",
    "Merge Sort in Python",
    "Merge Sort in Java",
    "Merge Sort Code Examples",
  ],
  robots: "index, follow",
  openGraph: {
    images: [
      {
        url: "/og/array/mergeSort.png",
        width: 1200,
        height: 630,
        alt: "Merge Sort Algorithm Visualization",
      },
    ],
  },
};

export default function Page() {
  return (
    <VisualizerPageLayout
      paths={createVisualizerPaths("Array", "Merge Sort")}
      title="Merge Sort"
      animation={<Animation />}
      content={<Content />}
      code={<Code />}
      quiz={<Quiz />}
      moduleCard={
        <ModuleCard
          moduleId={MODULE_MAPS.mergeSort}
          description="Mark Merge Sort as done and view it on your dashboard"
          initialDone={false}
        />
      }
      exploreOther={
        <ExploreOther
          title="Explore Sorting Algorithms"
          links={[
            {
              text: "Selection Sort",
              url: "/visualizer/array/selectionsort",
            },
            { text: "Bubble Sort", url: "/visualizer/array/bubblesort" },
            {
              text: "Insertion Sort",
              url: "/visualizer/array/insertionsort",
            },
            { text: "Quick Sort", url: "/visualizer/array/quicksort" },
            { text: "Comparison Mode", url: "/visualizer/array/comparison" },
            { text: "Counting Sort", url: "/visualizer/array/countingsort" },
            { text: "Heap Sort", url: "/visualizer/array/heapsort" },
          ]}
        />
      }
    />
  );
}
