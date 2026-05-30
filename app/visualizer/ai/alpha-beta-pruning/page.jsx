import Animation from "@/app/visualizer/ai/alpha-beta-pruning/animation";
import ExploreOther from "@/app/components/ui/exploreOther";
import Code from "@/app/visualizer/ai/alpha-beta-pruning/codeBlock";
import Quiz from "@/app/visualizer/ai/alpha-beta-pruning/quiz";
import Content from "@/app/visualizer/ai/alpha-beta-pruning/content";
import ModuleCard from "@/app/components/ui/ModuleCard";
import VisualizerPageLayout, {
  createVisualizerPaths,
} from "@/app/visualizer/components/VisualizerPageLayout";
import { MODULE_MAPS } from "@/lib/modulesMap";

export const metadata = {
  title: "Alpha Beta Pruning | Step-by-Step Animation",
  description:
    "Visualize Alpha Beta Pruning with intuitive step-by-step animations, code examples in JavaScript, C++, Python, and Java.",
  keywords: [
    "Alpha Beta Pruning Visualizer",
    "Alpha Beta Pruning Visualization",
    "Alpha Beta Pruning Animation",
    "Learn Alpha Beta Pruning",
    "Alpha Beta Pruning for Beginners",
    "Alpha Beta Pruning Step-by-Step",
    "Visualize Alpha Beta Pruning Algorithm",
    "Adversarial Search",
    "Game Tree Optimization",
  ],
  robots: "index, follow",
};

export default function Page() {
  return (
    <VisualizerPageLayout
      paths={createVisualizerPaths("AI Algorithms", "Alpha Beta Pruning")}
      title="Alpha Beta Pruning"
      animation={<Animation />}
      content={<Content />}
      code={<Code />}
      quiz={<Quiz />}
      moduleCard={
        <ModuleCard
          moduleId={MODULE_MAPS.alphaBeta}
          description="Mark alpha beta pruning as done and view it on your dashboard"
          initialDone={false}
        />
      }
      exploreOther={
        <ExploreOther
          title="Explore other topics"
          links={[{ text: "Min Max Algorithm", url: "/visualizer/ai/minmax" }]}
        />
      }
    />
  );
}
