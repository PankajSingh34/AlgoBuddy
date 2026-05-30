import Animation from "@/app/visualizer/array/quicksort/animation";
import Content from "@/app/visualizer/array/quicksort/content";
import Quiz from "@/app/visualizer/array/quicksort/quiz";
import Code from "@/app/visualizer/array/quicksort/codeBlock";
import ExploreOther from "@/app/components/ui/exploreOther";
import ModuleCard from "@/app/components/ui/ModuleCard";
import VisualizerPageLayout, {
  createVisualizerPaths,
} from "@/app/visualizer/components/VisualizerPageLayout";
import { MODULE_MAPS } from "@/lib/modulesMap";

export const metadata = {
  title: "Quick Sort Algorithm | Learn with Interactive Animations",
  description:
    "Learn how Quick Sort works with step-by-step animations and test your knowledge with an interactive quiz. Includes code examples in JavaScript, C, Python, and Java. Perfect for beginners learning this efficient divide-and-conquer sorting algorithm visually and through hands-on coding.",
  keywords: [
    "Quick Sort Visualizer",
    "Quick Sort Animation",
    "Quick Sort Visualization",
    "Quick Sort Algorithm",
    "Quick Sort Quiz",
    "Sorting Algorithm Quiz",
    "Divide and Conquer Sorting",
    "Sorting Algorithm Visualization",
    "Learn Quick Sort",
    "DSA Quick Sort",
    "Practice Quick Sort",
    "Interactive Quick Sort Tool",
    "Test Quick Sort Knowledge",
    "Quick Sort in JavaScript",
    "Quick Sort in C",
    "Quick Sort in Python",
    "Quick Sort in Java",
    "Quick Sort Code Examples",
  ],
  robots: "index, follow",
  openGraph: {
    images: [
      {
        url: "/og/array/quickSort.png",
        width: 1200,
        height: 630,
        alt: "Quick Sort Algorithm Visualization",
      },
    ],
  },
};

export default function Page() {
  return (
    <VisualizerPageLayout
      paths={createVisualizerPaths("Array", "Quick Sort")}
      title="Quick Sort"
      animation={<Animation />}
      content={<Content />}
      code={<Code />}
      quiz={<Quiz />}
      moduleCard={
        <ModuleCard
          moduleId={MODULE_MAPS.quickSort}
          description="Mark Quick Sort as done and view it on your dashboard"
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
            { text: "Merge Sort", url: "/visualizer/array/mergesort" },
            { text: "Comparison Mode", url: "/visualizer/array/comparison" },
            { text: "Counting Sort", url: "/visualizer/array/countingsort" },
            { text: "Heap Sort", url: "/visualizer/array/heapsort" },
          ]}
        />
      }
    />
  );
}
