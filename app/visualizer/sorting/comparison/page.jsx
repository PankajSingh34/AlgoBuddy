import React from "react";
import VisualizerPageLayout, {
  createVisualizerPaths,
} from "@/app/visualizer/components/VisualizerPageLayout";
import ComparisonClient from "./ComparisonClient";
import ExploreOther from "@/app/components/ui/exploreOther";

export const metadata = {
  title: "Sorting Algorithm Comparison Mode | Side-by-Side Visualizer",
  description:
    "Compare Bubble Sort, Selection Sort, Insertion Sort, Merge Sort, Quick Sort, and Heap Sort side-by-side on AlgoBuddy. Watch synchronous animations on identical datasets and compare comparisons, swaps, and time in real-time.",
  keywords: [
    "algorithm comparison",
    "sorting visualizer",
    "bubble sort vs merge sort",
    "quick sort vs merge sort",
    "dsa visualizer comparison",
    "sorting algorithm performance",
  ],
  robots: "index, follow",
  openGraph: {
    images: [
      {
        url: "/og/sorting/comparison.png",
        width: 1200,
        height: 630,
        alt: "Sorting Algorithm Comparison Mode Visualization",
      },
    ],
  },
};

export default function ComparisonPage() {
  return (
    <VisualizerPageLayout
      paths={createVisualizerPaths("Array", "Comparison Mode")}
      title="Sorting Comparison Mode"
      headerDescription="Select two sorting algorithms to run synchronously side-by-side on the identical dataset, and inspect their performance characteristics in real time."
      animation={<ComparisonClient />}
      exploreOther={
        <ExploreOther
          title="Explore Individual Sorting Algorithms"
          links={[
            { text: "Bubble Sort", url: "/visualizer/sorting/bubblesort" },
            { text: "Selection Sort", url: "/visualizer/sorting/selectionsort" },
            { text: "Insertion Sort", url: "/visualizer/sorting/insertionsort" },
            { text: "Merge Sort", url: "/visualizer/sorting/mergesort" },
            { text: "Quick Sort", url: "/visualizer/sorting/quicksort" },
            { text: "Heap Sort", url: "/visualizer/sorting/heapsort" },
          ]}
        />
      }
    />
  );
}
