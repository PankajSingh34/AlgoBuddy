import TreeHeapVisualizer from "../TreeHeapVisualizer";

export const metadata = {
  title: "Min Heap Visualizer | Interactive Heap Operations | AlgoBuddy",
  description: "Visualize min-heap operations step-by-step with interactive array and tree animations.",
  keywords: ["Min Heap", "Heap Visualizer", "DSA Visualizations"],
  robots: "index, follow",
};

const MinHeapPage = () => {
  return <TreeHeapVisualizer initialHeapType="min" />;
};

export default MinHeapPage;
