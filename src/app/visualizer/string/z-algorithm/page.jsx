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
        "Z Algorithm"
      )}
      title="Z Algorithm"
      animation={<Animation />}
      content={<Content />}
      code={<Code />}
      exploreOther={
        <ExploreOther
          title="Explore other Pattern Matching algorithms"
          links={[
            {
              text: "KMP Algorithm",
              url: "../kmp-algorithm",
            },
            {
              text: "Rabin-Karp",
              url: "../rabin-karp",
            },
          ]}
        />
      }
    />
  );
}