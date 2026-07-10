import FactorialAnimation from "@/app/visualizer/recursion/factorial/animation";
import ExploreOther from "@/app/components/ui/exploreOther";
import Code from "@/app/visualizer/recursion/factorial/codeBlock";
import Quiz from "@/app/visualizer/recursion/factorial/quiz";
import Content from "@/app/visualizer/recursion/factorial/content";
import ArticleActions from "@/app/components/ui/ArticleActions";
import VisualizerPageLayout, {
  createVisualizerPaths,
} from "@/app/visualizer/components/VisualizerPageLayout";



export default function Page() {
  return (
    <VisualizerPageLayout
      paths={createVisualizerPaths("Recursion", "Functional & Parameterized Recursion")}
      title="Functional & Parameterized Recursion"
      headerDescription="Visualize how the Factorial algorithm calls itself, pushes frames to the call stack, reaches the base case, and propagates return values back up."
      headerActions={<ArticleActions />}
      animation={<FactorialAnimation />}
      content={<Content />}
      code={<Code />}
      quiz={<Quiz />}
      exploreOther={
        <ExploreOther
          title="Explore other topics"
          links={[
            { text: "Sum of First N Numbers", url: "/visualizer/recursion/sum-of-n" },
            { text: "Fibonacci (Tree Recursion)", url: "/visualizer/recursion/fibonacci" },
            { text: "Stack operations", url: "/visualizer/stack/push-pop" }
          ]}
        />
      }
    />
  );
}
