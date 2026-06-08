import FactorialAnimation from "./animation";
import ExploreOther from "@/app/components/ui/exploreOther";
import Code from "./codeBlock";
import Quiz from "./quiz";
import Content from "./content";
import ArticleActions from "@/app/components/ui/ArticleActions";
import ModuleCard from "@/app/components/ui/ModuleCard";
import VisualizerPageLayout, {
  createVisualizerPaths,
} from "@/app/visualizer/components/VisualizerPageLayout";
import { MODULE_MAPS } from "@/lib/modulesMap";



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
      moduleCard={
        <ModuleCard
          moduleId={MODULE_MAPS.recursionFactorial}
          description="Mark Factorial Recursion as done and track your progress"
          initialDone={false}
        />
      }
      exploreOther={
        <ExploreOther
          title="Explore other topics"
          links={[
            { text: "Sum of First N Numbers", url: "/visualizer/recursion/sum-of-n" },
            { text: "Fibonacci (Tree Recursion)", url: "/visualizer/recursion/fibonacci" },
            { text: "Stack operations", url: "/visualizer/stack/pushpop" }
          ]}
        />
      }
    />
  );
}

