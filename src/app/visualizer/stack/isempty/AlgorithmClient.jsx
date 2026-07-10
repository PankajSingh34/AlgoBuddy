import Animation from "@/app/visualizer/stack/isempty/animation";
import ArticleActions from "@/app/components/ui/ArticleActions";
import Content from "@/app/visualizer/stack/isempty/content";
import Code from "@/app/visualizer/stack/isempty/codeBlock";
import ExploreOther from "@/app/components/ui/exploreOther";
import VisualizerPageLayout, {
  createVisualizerPaths,
} from "@/app/visualizer/components/VisualizerPageLayout";



export default function Page() {
  return (
    <VisualizerPageLayout
      paths={createVisualizerPaths("Stack", "Is Empty")}
      title="IsEmpty Operation"
      headerActions={<ArticleActions />}
      animation={<Animation />}
      content={<Content />}
      code={<Code />}
      exploreOther={
        <ExploreOther
          title="Explore other operations"
          links={[
            { text: "Push & Pop", url: "/visualizer/stack/push-pop" },
            { text: "Peek", url: "/visualizer/stack/peek" },
            { text: "Is Full", url: "/visualizer/stack/isfull" },
          ]}
        />
      }
    />
  );
}
