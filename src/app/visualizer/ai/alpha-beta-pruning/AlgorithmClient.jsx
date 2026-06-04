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
