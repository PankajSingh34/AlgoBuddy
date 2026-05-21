import Animation from "@/app/visualizer/sorting/quicksort/animation";
import Content from "@/app/visualizer/sorting/quicksort/content";
import Quiz from "@/app/visualizer/sorting/quicksort/quiz";
import Code from "@/app/visualizer/sorting/quicksort/codeBlock";
import ModuleCard from "@/app/components/ui/ModuleCard";
import { StandardAlgorithmPage } from "@/app/components/ui/algorithm-page";
import { MODULE_MAPS } from "@/lib/modulesMap";

export const metadata = {
  title:
    "Quick Sort Algorithm | Learn with Interactive Animations",
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
        url: "/og/sorting/quickSort.png",
        width: 1200,
        height: 630,
        alt: "Quick Sort Algorithm Visualization",
      },
    ],
  },
};

export default function Page() {
  const paths = [
    { name: "Home", href: "/" },
    { name: "Visualizer", href: "/visualizer" },
    { name: "Sorting", href: "/visualizer" },
    { name: "Quick Sort", href: "" },
  ];

  return (
    <StandardAlgorithmPage
      paths={paths}
      category="Sorting"
      title="Quick Sort"
      visualizerTitle="Interactive Visualizer"
      visualizerDescription="Watch Quick Sort choose pivots, partition values, and recursively sort each side."
      visualizer={<Animation />}
      content={<Content />}
      code={<Code />}
      quiz={<Quiz />}
      moduleCard={
        <ModuleCard
          moduleId={MODULE_MAPS.quickSort}
          title="Quick Sort"
          description="Mark Quick Sort as done and view it on your dashboard"
          initialDone={false}
        />
      }
      relatedTopics={{
        title: "Explore Sorting Algorithms",
        links: [
          { text: "Selection Sort", url: "/visualizer/sorting/selectionsort" },
          { text: "Bubble Sort", url: "/visualizer/sorting/bubblesort" },
          { text: "Insertion Sort", url: "/visualizer/sorting/insertionsort" },
          { text: "Merge Sort", url: "/visualizer/sorting/mergesort" },
          { text: "Heap Sort", url: "/algorithms/sorting/heap" },
        ],
      }}
    />
  );
}
