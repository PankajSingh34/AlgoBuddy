import ReverseArrayAnimation from "./animation";
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
      headerDescription="Visualize how two-pointer recursion swaps elements from outer bounds inward to reverse an array."
      headerActions={<ArticleActions />}
      animation={<ReverseArrayAnimation />}
      content={<Content />}
      code={<Code />}
      quiz={<Quiz />}
      moduleCard={
        <ModuleCard
          moduleId={MODULE_MAPS.recursionReverseArray}
          description="Mark Reverse an Array as done and track your progress"
          initialDone={false}
        />
      }
      exploreOther={
        <ExploreOther
          title="Explore other topics"
          links={[
            { text: "String Palindrome Check", url: "/visualizer/recursion/palindrome" },
            { text: "Print 1 to N", url: "/visualizer/recursion/print-1-to-n" },
            { text: "Sum of First N Numbers", url: "/visualizer/recursion/sum-of-n" }
          ]}
        />
      }
    />
  );
}
