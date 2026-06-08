import ArticleActions from "@/app/components/ui/ArticleActions";
import Content from "./content";
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
      paths={createVisualizerPaths("Stack", "Implementation Using Array")}
      title="Implementation Using Array"
      headerActions={<ArticleActions />}
      content={<Content />}
      code={<Code />}
      moduleCard={
        <ModuleCard
          moduleId={MODULE_MAPS.stackArray}
          description="Mark Stack using Array as done and track your progress"
          initialDone={false}
        />
      }
      exploreOther={
        <ExploreOther
          title="Explore other implementation"
          links={[{ text: "Using Linked List", url: "./usingLinkedList" }]}
        />
      }
    />
  );
}
