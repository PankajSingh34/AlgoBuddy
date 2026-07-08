import Animation from "@/app/visualizer/array/timsort/animation";
import Content from "@/app/visualizer/array/timsort/content";
import Code from "@/app/visualizer/array/timsort/codeBlock";
import ExploreOther from "@/app/components/ui/exploreOther";
import TrackVisit from "@/app/components/ui/TrackVisit";
import VisualizerPageLayout, {
  createVisualizerPaths,
} from "@/app/visualizer/components/VisualizerPageLayout";



export default function Page() {
  return (
    <>
      <TrackVisit name="Tim Sort" path="/visualizer/array/timsort" category="Sorting" />
      <VisualizerPageLayout
        paths={createVisualizerPaths("Array", "Tim Sort")}
        title="Tim Sort"
        animation={<Animation />}
        content={<Content />}
        code={<Code />}
        exploreOther={
          <ExploreOther
            title="Explore Sorting Algorithms"
            links={[
              { text: "Bubble Sort", url: "/visualizer/array/bubblesort" },
              { text: "Quick Sort", url: "/visualizer/array/quicksort" },
              { text: "Shell Sort", url: "/visualizer/array/shellsort" },
              { text: "Selection Sort", url: "/visualizer/array/selectionsort" },
              { text: "Insertion Sort", url: "/visualizer/array/insertionsort" },
              { text: "Merge Sort", url: "/visualizer/array/mergesort" },
              { text: "Bucket Sort", url: "/visualizer/array/bucketsort" },
              { text: "Comparison Mode", url: "/visualizer/array/comparison" },
              { text: "Counting Sort", url: "/visualizer/array/countingsort" },
              { text: "Heap Sort", url: "/visualizer/array/heapsort" },
            ]}
          />
        }
      />
    </>
  );
}