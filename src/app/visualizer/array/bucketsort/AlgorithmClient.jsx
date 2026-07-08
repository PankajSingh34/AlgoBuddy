import Animation from "@/app/visualizer/array/bucketsort/animation";
import Content from "@/app/visualizer/array/bucketsort/content";
import Code from "@/app/visualizer/array/bucketsort/codeBlock";
import ExploreOther from "@/app/components/ui/exploreOther";
import TrackVisit from "@/app/components/ui/TrackVisit";
import VisualizerPageLayout, {
  createVisualizerPaths,
} from "@/app/visualizer/components/VisualizerPageLayout";



export default function Page() {
  return (
    <>
      <TrackVisit name="Bucket Sort" path="/visualizer/array/bucketsort" category="Sorting" />
      <VisualizerPageLayout
        paths={createVisualizerPaths("Array", "Bucket Sort")}
        title="Bucket Sort"
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