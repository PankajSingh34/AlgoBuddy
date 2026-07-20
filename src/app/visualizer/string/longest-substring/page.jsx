import Animation from "./animation";
import ExploreOther from "@/app/components/ui/exploreOther";
import Code from "./codeBlock";
import Content from "./content";

import VisualizerPageLayout, {
  createVisualizerPaths,
} from "@/app/visualizer/components/VisualizerPageLayout";

export default function Page() {
  return (
    <VisualizerPageLayout
      paths={createVisualizerPaths(
        "String",
        "Longest Substring Without Repeating Characters"
      )}
      title="Longest Substring Without Repeating Characters"
      animation={<Animation />}
      content={<Content />}
      code={<Code />}
      exploreOther={
        <ExploreOther
          title="Explore other string algorithms"
          links={[
            {
              text: "Minimum Window Substring",
              url: "../minimum-window",
            },
          ]}
        />
      }
    />
  );
}