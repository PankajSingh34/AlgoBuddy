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
      paths={createVisualizerPaths("HashMap", "Delete")}
      title="Delete (remove)"
      headerActions={<ArticleActions />}
      animation={<Animation />}
      content={<Content />}
      code={<Code />}
      quiz={<Quiz />}
      moduleCard={
        <ModuleCard
          moduleId={MODULE_MAPS.hashmapDelete}
          description="Mark HashMap : Delete as done and track your progress"
          initialDone={false}
        />
      }
      exploreOther={
        <ExploreOther
          title="Explore other operations"
          links={[
            { text: "Insert", url: "/visualizer/hashmap/insert" },
            { text: "Search", url: "/visualizer/hashmap/search" },
          ]}
        />
      }
    />
  );
}