import Animation from "./animation";
import CodeBlock from "./codeBlock";
import Content from "./content";
import ExploreOther from "@/app/components/ui/exploreOther";
import VisualizerPageLayout, {
  createVisualizerPaths,
} from "@/app/visualizer/components/VisualizerPageLayout";

export const metadata = {
  title: "Palindrome Check | AlgoBuddy",
  description:
    "Learn how the Palindrome Check algorithm works with an interactive visualization.",
};

export default function Page() {
  return (
    <VisualizerPageLayout
      paths={createVisualizerPaths("String", "Palindrome Check")}
      title="Palindrome Check"
      headerDescription="Visualize how the two-pointer technique determines whether a string is a palindrome."
      animation={<Animation />}
      content={<Content />}
      code={<CodeBlock />}
      exploreOther={
        <ExploreOther
            title="Explore other string algorithms"
            links={[
            {
                text: "Reverse String",
                url: "../reverse-string",
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