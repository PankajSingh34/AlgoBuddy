import Animation from "./animation";
import Code from "./codeBlock";
import Content from "./content";
import VisualizerPageLayout, {
  createVisualizerPaths,
} from "@/app/visualizer/components/VisualizerPageLayout";



export default function Page() {
  return (
    <VisualizerPageLayout
      paths={createVisualizerPaths("Array", "Sliding Window")}
      title="Sliding Window Technique"
      animation={<Animation />}
      content={<Content />}
      code={<Code />}
    />
  );
}
