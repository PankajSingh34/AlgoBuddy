import Animation from "./animation";
import ArticleActions from "@/app/components/ui/ArticleActions";
import Content from "./content";
import Quiz from "./quiz";
import Code from "./codeBlock";
import ModuleCard from "@/app/components/ui/ModuleCard";
import ExploreOther from "@/app/components/ui/exploreOther";
import VisualizerPageLayout, {
  createVisualizerPaths,
} from "@/app/visualizer/components/VisualizerPageLayout";
import { MODULE_MAPS } from "@/lib/modulesMap";



export default function Page() {
  return (
    <VisualizerPageLayout
      paths={createVisualizerPaths("Stack", "Peek")}
      title="Peek Operation"
      headerActions={<ArticleActions />}
      animation={<Animation />}
      content={<Content />}
      code={<Code />}
      quiz={<Quiz />}
      moduleCard={
        <ModuleCard
          moduleId={MODULE_MAPS.peek}
          description="Mark Stack : Peek as done and track your progress"
          initialDone={false}
        />
      }
      exploreOther={
        <ExploreOther
          title="Explore other operations"
          links={[
            { text: "Push & Pop", url: "/visualizer/stack/pushpop" },
            { text: "Is Empty", url: "/visualizer/stack/isempty" },
            { text: "Is Full", url: "/visualizer/stack/isfull" },
          ]}
        />
      }
    />
  );
}

