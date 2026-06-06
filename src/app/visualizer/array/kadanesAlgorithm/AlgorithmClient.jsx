import Animation from "./Animation";
import KadanesCodeBlock from "./KadanesCodeBlock";
import KadanesContent from "./KadanesContent";
import KadanesQuiz from "./KadanesQuiz";
import ModuleCard from "@/app/components/ui/ModuleCard";
import VisualizerPageLayout, { createVisualizerPaths } from "@/app/visualizer/components/VisualizerPageLayout";
import { MODULE_MAPS } from "@/lib/modulesMap";

export default function Page() {
  return (
    <VisualizerPageLayout
      paths={createVisualizerPaths("Array", "Kadane's Algorithm")}
      title="Kadane's Algorithm"
      animation={<Animation />}
      content={<KadanesContent />}
      code={<KadanesCodeBlock />}
      quiz={<KadanesQuiz />}
      moduleCard={
        <ModuleCard
          moduleId={MODULE_MAPS.kadane}
          description="Mark Kadane's Algorithm as done and track your progress"
          initialDone={false}
        />
      }
    />
  );
}