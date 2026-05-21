import Animation from "@/app/visualizer/sorting/selectionsort/animation";
import Content from '@/app/visualizer/sorting/selectionsort/content';
import Code from "@/app/visualizer/sorting/selectionsort/codeBlock";
import Quiz from "@/app/visualizer/sorting/selectionsort/quiz";
import ModuleCard from "@/app/components/ui/ModuleCard";
import { StandardAlgorithmPage } from "@/app/components/ui/algorithm-page";
import { MODULE_MAPS } from "@/lib/modulesMap";

export const metadata = {
  title:
    "Selection Sort Visualizer | Simple Sorting Animation with Code in JS, C, Python, Java",
  description:
    "Visualize Selection Sort in action with step-by-step animations and code examples in JavaScript, C, Python, and Java. A beginner-friendly way to understand this simple sorting algorithm using comparisons and swaps.",
  keywords: [
    "Selection Sort Visualizer",
    "Selection Sort Animation",
    "Selection Sort Algorithm",
    "DSA Selection Sort",
    "Learn Selection Sort",
    "Sorting Algorithm Visualization",
    "Interactive Sorting Tool",
    "Sorting for Beginners",
    "Step by Step Sorting",
    "Selection Sort in JavaScript",
    "Selection Sort in C",
    "Selection Sort in Python",
    "Selection Sort in Java",
    "Selection Sort Code Examples",
  ],
  robots: "index, follow",
  openGraph: {
    images: [
      {
        url: "/og/sorting/selectionSort.png",
        width: 1200,
        height: 630,
        alt: "Selection Sort Algorithm Visualization",
      },
    ],
  },
};

export default function Page() {
  const paths = [
    { name: "Home", href: "/" },
    { name: "Visualizer", href: "/visualizer" },
    { name: "Sorting", href: "/visualizer" },
    { name: "Selection Sort", href: "" },
  ];

  return (
    <StandardAlgorithmPage
      paths={paths}
      category="Sorting"
      title="Selection Sort"
      visualizerTitle="Interactive Visualizer"
      visualizerDescription="Track the current minimum, scan the remaining items, and place each value into its sorted position."
      visualizer={<Animation />}
      content={<Content />}
      code={<Code />}
      quiz={<Quiz />}
      moduleCard={
        <ModuleCard
          moduleId={MODULE_MAPS.selectionSort}
          title="Selection Sort"
          description="Mark Selection Sort as done and view it on your dashboard"
          initialDone={false}
        />
      }
      relatedTopics={{
        title: "Explore Sorting Algorithms",
        links: [
          { text: "Quick Sort", url: "/visualizer/sorting/quicksort" },
          { text: "Bubble Sort", url: "/visualizer/sorting/bubblesort" },
          { text: "Insertion Sort", url: "/visualizer/sorting/insertionsort" },
          { text: "Merge Sort", url: "/visualizer/sorting/mergesort" },
          { text: "Heap Sort", url: "/algorithms/sorting/heap" },
        ],
      }}
    />
  );
}
