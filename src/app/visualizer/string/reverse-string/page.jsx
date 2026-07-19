import Animation from "@/app/visualizer/string/reverse-string/animation";
import ExploreOther from "@/app/components/ui/exploreOther";
import Code from "@/app/visualizer/string/reverse-string/codeBlock";
import Content from "@/app/visualizer/string/reverse-string/content";
import VisualizerPageLayout, {
  createVisualizerPaths,
} from "@/app/visualizer/components/VisualizerPageLayout";

export default function Page() {
  return (
    <VisualizerPageLayout
      paths={createVisualizerPaths("String", "Reverse String")}
      title="Reverse String"
      animation={<Animation />}
      content={<Content />}
      code={<Code />}
      exploreOther={
        <ExploreOther
          title="Explore other string algorithms"
          links={[
            {
              text: "Palindrome Check",
              url: "../palindrome",
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