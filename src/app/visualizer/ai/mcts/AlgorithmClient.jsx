import Animation from "./animation";
import ExploreOther from "@/app/components/ui/exploreOther";
import Code from "./codeBlock";
import Quiz from "./quiz";
import Content from "./content";
import ModuleCard from "@/app/components/ui/ModuleCard";
import VisualizerPageLayout, { createVisualizerPaths } from "@/app/visualizer/components/VisualizerPageLayout";
import { MODULE_MAPS } from "@/lib/modulesMap";



export default function Page() {
  return (
    <VisualizerPageLayout
      paths={createVisualizerPaths("AI Algorithms", "Monte Carlo Tree Search")}
      title="Monte Carlo Tree Search (MCTS)"
      animation={<Animation />}
      content={<Content />}
      code={<Code />}
      quiz={<Quiz />}
      moduleCard={
        <ModuleCard
          moduleId={MODULE_MAPS.mcts}
          description="Mark MCTS as done and track your progress"
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
