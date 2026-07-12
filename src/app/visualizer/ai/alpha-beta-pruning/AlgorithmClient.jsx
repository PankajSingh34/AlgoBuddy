import Animation from "@/app/visualizer/ai/alpha-beta-pruning/animation";
import ExploreOther from "@/app/components/ui/exploreOther";
import Code from "@/app/visualizer/ai/alpha-beta-pruning/codeBlock";
import Content from "@/app/visualizer/ai/alpha-beta-pruning/content";
import TrackVisit from "@/app/components/ui/TrackVisit";
import VisualizerPageLayout, {
  createVisualizerPaths,
} from "@/app/visualizer/components/VisualizerPageLayout";



export default function Page() {
  return (
    <>
    <TrackVisit
        name="Alpha Beta Pruning"
        path="/visualizer/ai/alphabeta"
        category="AI Algorithms"
      />
    <VisualizerPageLayout
      paths={createVisualizerPaths("AI Algorithms", "Alpha Beta Pruning")}
      title="Alpha Beta Pruning"
      animation={<Animation />}
      content={<Content />}
      code={<Code />}
      exploreOther={
        <ExploreOther
          title="Explore other topics"
          links={[{ text: "Min Max Algorithm", url: "/visualizer/ai/minmax" }]}
        />
      }
    />
    </>
  );
}
