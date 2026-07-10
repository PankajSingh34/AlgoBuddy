"use client";
import HanoiAnimation from "@/app/visualizer/recursion/tower-of-hanoi/animation";
import ExploreOther from "@/app/components/ui/exploreOther";
import Code from "@/app/visualizer/recursion/tower-of-hanoi/codeBlock";
import Content from "@/app/visualizer/recursion/tower-of-hanoi/content";
import ArticleActions from "@/app/components/ui/ArticleActions";
import VisualizerPageLayout, {
  createVisualizerPaths,
} from "@/app/visualizer/components/VisualizerPageLayout";

export default function Page() {
  return (
    <VisualizerPageLayout
      paths={createVisualizerPaths("Recursion", "Tower of Hanoi")}
      title="Tower of Hanoi Recursion"
      headerDescription="Visualize how the Tower of Hanoi algorithm calls itself, pushes frames to the call stack, reaches the base case, and coordinates disk movements across pegs."
      headerActions={<ArticleActions />}
      animation={<HanoiAnimation />}
      content={<Content />}
      code={<Code />}
      exploreOther={
        <ExploreOther
          title="Explore other topics"
          links={[
            { text: "Fibonacci (Tree Recursion)", url: "/visualizer/recursion/fibonacci" },
            { text: "Factorial Recursion", url: "/visualizer/recursion/factorial" },
            { text: "Recursive Binary Search", url: "/visualizer/recursion/binary-search" }
          ]}
        />
      }
    />
  );
}
