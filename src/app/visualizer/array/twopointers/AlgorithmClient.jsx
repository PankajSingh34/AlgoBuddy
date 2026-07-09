import Animation from "./animation";
import Code from "./codeblock";
import Content from "./content";
import VisualizerPageLayout, {
  createVisualizerPaths,
} from "@/app/visualizer/components/VisualizerPageLayout";

export default function Page() {
  return (
    <VisualizerPageLayout
      paths={createVisualizerPaths("Array", "Two Pointers")}
      title="Two Pointers Technique"
      animation={<Animation />}
      content={<Content />}
      code={<Code />}
    />
  );
}
