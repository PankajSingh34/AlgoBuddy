import Animation from "@/app/visualizer/array/insertionsort/animation";
import Content from "@/app/visualizer/array/insertionsort/content";
import Code from "@/app/visualizer/array/insertionsort/codeBlock";
import ExploreOther from "@/app/components/ui/exploreOther";
import TrackVisit from "@/app/components/ui/TrackVisit";
import VisualizerPageLayout, {
  createVisualizerPaths,
} from "@/app/visualizer/components/VisualizerPageLayout";



export default function Page() {
  return (
    <>
      <TrackVisit name="Insertion Sort" path="/visualizer/array/insertionsort" category="Sorting" />
      <VisualizerPageLayout
        paths={createVisualizerPaths("Array", "Insertion Sort")}
        title="Insertion Sort"
        animation={<Animation />}
        content={<Content />}
        code={<Code />}
        exploreOther={
          <ExploreOther
            title="Explore Sorting Algorithms"
            links={[
              { text: "Bubble Sort", url: "/visualizer/array/bubblesort" },
              { text: "Selection Sort", url: "/visualizer/array/selectionsort" },
              { text: "Merge Sort", url: "/visualizer/array/mergesort" },
              { text: "Quick Sort", url: "/visualizer/array/quicksort" },
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