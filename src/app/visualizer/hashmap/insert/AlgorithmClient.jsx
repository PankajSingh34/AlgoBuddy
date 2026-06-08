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
      paths={createVisualizerPaths("HashMap", "Insert")}
      title="Insert (put)"
      headerActions={<ArticleActions />}
      animation={<Animation />}
      content={<Content />}
      code={<Code />}
      quiz={<Quiz />}
      moduleCard={
        <ModuleCard
          moduleId={MODULE_MAPS.hashmapInsert}
          description="Mark HashMap : Insert as done and track your progress"
          initialDone={false}
        />
      }
      exploreOther={
        <ExploreOther
          title="Explore other operations"
          links={[
            { text: "Search", url: "/visualizer/hashmap/search" },
            { text: "Delete", url: "/visualizer/hashmap/delete" },
          ]}
        />
      }
    />
  );
}