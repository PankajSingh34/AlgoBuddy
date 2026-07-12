"use client";
import AuthGuard from "./AuthGuard";
import Animation from "./animation";
import ExploreOther from "@/app/components/ui/exploreOther";
import Code from "./codeBlock";
import Content from "./content";
import VisualizerPageLayout, { createVisualizerPaths } from "@/app/visualizer/components/VisualizerPageLayout";

export default function ClientVisualizer() {
  return (
    <AuthGuard>
      <VisualizerPageLayout
        paths={createVisualizerPaths("AI Algorithms", "A* Search")}
        title="A* Search"
        animation={<Animation />}
        content={<Content />}
        code={<Code />}
        exploreOther={
          <ExploreOther
            title="Explore other topics"
            links={[{ text: "Monte Carlo Tree Search (MCTS)", url: "/visualizer/ai/mcts" }]}
          />
        }
      />
    </AuthGuard>
  );
}
