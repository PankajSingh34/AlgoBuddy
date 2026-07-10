import FibonacciAnimation from "@/app/visualizer/recursion/fibonacci/animation";
import ExploreOther from "@/app/components/ui/exploreOther";
import Code from "@/app/visualizer/recursion/fibonacci/codeBlock";
import Quiz from "@/app/visualizer/recursion/fibonacci/quiz";
import Content from "@/app/visualizer/recursion/fibonacci/content";
import ArticleActions from "@/app/components/ui/ArticleActions";
import VisualizerPageLayout, {
  createVisualizerPaths,
} from "@/app/visualizer/components/VisualizerPageLayout";



export default function Page() {
  return (
    <VisualizerPageLayout
      paths={createVisualizerPaths("Recursion", "Multiple Recursive Calls")}
      title="Multiple Recursive Calls"
      headerDescription="Visualize how Fibonacci uses tree recursion (calling itself twice per step), generating duplicate subproblem calculations and pushing multiple stack frames."
      headerActions={<ArticleActions />}
      animation={<FibonacciAnimation />}
      content={<Content />}
      code={<Code />}
      quiz={<Quiz />}
      exploreOther={
        <ExploreOther
          title="Explore other topics"
          links={[
            { text: "Factorial (Linear Recursion)", url: "/visualizer/recursion/factorial" },
            { text: "Sum of First N Numbers", url: "/visualizer/recursion/sum-of-n" },
            { text: "Stack operations", url: "/visualizer/stack/push-pop" }
          ]}
        />
      }
    />
  );
}
