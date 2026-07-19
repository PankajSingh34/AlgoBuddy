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
        "Longest Common Prefix"
      )}
      title="Longest Common Prefix"
      animation={<Animation />}
      content={<Content />}
      code={<Code />}
      exploreOther={
        <ExploreOther
          title="Explore other string algorithms"
          links={[
            {
              text: "Reverse String",
              url: "../reverse-string",
            },
            {
              text: "Palindrome Check",
              url: "../palindrome-check",
            },
            {
              text: "Character Frequency",
              url: "../character-frequency",
            },
            {
              text: "Anagram Check",
              url: "../anagram-check",
            },
          ]}
        />
      }
    />
  );
}