import SumAnimation from "./animation";
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
      headerDescription="Visualize how recursion computes the sum of the first N integers (N + sum(N-1)), pushing call frames and resolving them LIFO-style."
      headerActions={<ArticleActions />}
      animation={<SumAnimation />}
      content={<Content />}
      code={<Code />}
      quiz={<Quiz />}
      moduleCard={
        <ModuleCard
          moduleId={MODULE_MAPS.recursionSum}
          description="Mark Sum of First N Numbers as done and track your progress"
          initialDone={false}
        />
      }
      exploreOther={
        <ExploreOther
          title="Explore other topics"
          links={[
            { text: "Factorial Recursion", url: "/visualizer/recursion/factorial" },
            { text: "Fibonacci (Tree Recursion)", url: "/visualizer/recursion/fibonacci" },
            { text: "Stack operations", url: "/visualizer/stack/pushpop" }
          ]}
        />
      }
    />
  );
}

