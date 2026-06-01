import Animation from "./animation";
import Code from "./codeBlock";
import Quiz from "./quiz";
import Content from "./content";
import ModuleCard from "@/app/components/ui/ModuleCard";
import VisualizerPageLayout, {
  createVisualizerPaths,
} from "@/app/visualizer/components/VisualizerPageLayout";
import { MODULE_MAPS } from "@/lib/modulesMap";

export const metadata = {
  title: "Sliding Window Technique Visualizer | Array Algorithms",
  description:
    "Visualize the Sliding Window technique with step-by-step animations. Learn fixed-size and variable-size window patterns, view code implementations, and take an interactive quiz.",
  keywords: [
    "Sliding Window Visualizer",
    "Sliding Window Technique",
    "Two Pointers",
    "Array Algorithms",
    "Fixed Size Window",
    "Variable Size Window",
    "Longest Substring Without Repeating Characters",
    "Maximum Sum Subarray of Size K",
    "Algorithm Visualization",
  ],
  robots: "index, follow",
  openGraph: {
    images: [
      {
        url: "/og/visualizer.png",
        width: 1200,
        height: 630,
        alt: "Sliding Window Technique Visualization",
      },
    ],
  },
};

export default function Page() {
  return (
    <VisualizerPageLayout
      paths={createVisualizerPaths("Interview Patterns", "Sliding Window")}
      title="Sliding Window Technique"
      animation={<Animation />}
      content={<Content />}
      code={<Code />}
      quiz={<Quiz />}
      moduleCard={
        <ModuleCard
          moduleId={MODULE_MAPS.slidingWindow}
          description="Mark Sliding Window as done and view it on your dashboard"
          initialDone={false}
        />
      }
    />
  );
}
