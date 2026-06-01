import TreeHeapVisualizer from "../TreeHeapVisualizer";

export const metadata = {
  title: "Max Heap Visualizer | Interactive Heap Operations | AlgoBuddy",
  description: "Visualize max-heap operations step-by-step with interactive array and tree animations.",
  keywords: ["Max Heap", "Heap Visualizer", "DSA Visualizations"],
  robots: "index, follow",
};

const MaxHeapPage = () => {
  return <TreeHeapVisualizer initialHeapType="max" />;
};

export default MaxHeapPage;
