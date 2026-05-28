import KadaneVisualizer from "./KadaneVisualizer";

export const metadata = {
  title: "Kadane's Algorithm Visualizer | AlgoBuddy",
  description:
    "Interactive Kadane's algorithm visualizer to explore maximum subarray sum, running totals, and step-by-step execution.",
};

export default function Page() {
  return <KadaneVisualizer />;
}
