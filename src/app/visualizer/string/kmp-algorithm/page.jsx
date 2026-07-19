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
      paths={createVisualizerPaths("String", "KMP Algorithm")}
      title="KMP Algorithm"
      animation={<Animation />}
      content={<Content />}
      code={<Code />}
      exploreOther={
        <ExploreOther
          title="Explore other string algorithms"
          links={[
            {
              text: "Rabin-Karp",
              url: "../rabin-karp",
            },
            {
              text: "Z Algorithm",
              url: "../z-algorithm",
            },
          ]}
        />
      }
    />
  );
}