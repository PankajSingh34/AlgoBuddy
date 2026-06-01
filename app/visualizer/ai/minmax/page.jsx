import Animation from "@/app/visualizer/ai/minmax/animation";
import ExploreOther from "@/app/components/ui/exploreOther";
import Code from "@/app/visualizer/ai/minmax/codeBlock";
import Quiz from "@/app/visualizer/ai/minmax/quiz";
import Content from "@/app/visualizer/ai/minmax/content";
import ModuleCard from "@/app/components/ui/ModuleCard";
import VisualizerPageLayout, {
  createVisualizerPaths,
} from "@/app/visualizer/components/VisualizerPageLayout";
import { MODULE_MAPS } from "@/lib/modulesMap";

export const metadata = {
  title: "Min Max Algorithm | Step-by-Step Animation",
  description:
    "Visualize the Min Max algorithm with intuitive step-by-step animations, code examples in JavaScript, C++, Python, and Java.",
  keywords: [
    "Min Max Visualizer",
    "Min Max Visualization",
    "Min Max Animation",
    "Learn Min Max",
    "Min Max for Beginners",
    "Min Max Step-by-Step",
    "Visualize Min Max Algorithm",
    "Adversarial Search",
    "Game Tree Algorithm",
  ],
  robots: "index, follow",
};

export default function Page() {
  return (
    <VisualizerPageLayout
      paths={createVisualizerPaths("AI Algorithms", "Min Max Algorithm")}
      title="Min Max Algorithm"
      animation={<Animation />}
      content={<Content />}
      code={<Code />}
      quiz={<Quiz />}
      moduleCard={
        <ModuleCard
          moduleId={MODULE_MAPS.minMax}
          description="Mark min max algorithm as done and view it on your dashboard"
          initialDone={false}
        />
      }
      exploreOther={
        <ExploreOther
          title="Explore other topics"
          links={[{ text: "Alpha Beta Pruning", url: "/visualizer/ai/alpha-beta-pruning" }]}
        />
      }
    />
  );
}
