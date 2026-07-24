import Animation from "./animation";
import Code from "./codeBlock";
import Content from "./content";

import ExploreOther from "@/app/components/ui/exploreOther";
import VisualizerPageLayout, {
  createVisualizerPaths,
} from "@/app/visualizer/components/VisualizerPageLayout";

export default function Page() {
  return (
    <VisualizerPageLayout
      paths={createVisualizerPaths(
        "String",
        "Minimum Window Substring"
      )}
      title="Minimum Window Substring"
      animation={<Animation />}
      content={<Content />}
      code={<Code />}
      exploreOther={
        <ExploreOther
          title="Explore other Sliding Window algorithms"
          links={[
            {
              text: "Longest Substring Without Repeating Characters",
              url: "../longest-substring",
            },
          ]}
        />
      }
    />
  );
}