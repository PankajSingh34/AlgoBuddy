import Animation from "@/app/visualizer/stack/push-pop/animation";
import ArticleActions from "@/app/components/ui/ArticleActions";
import Content from "@/app/visualizer/stack/push-pop/content";
import Code from "@/app/visualizer/stack/push-pop/codeBlock";
import ExploreOther from "@/app/components/ui/exploreOther";
import VisualizerPageLayout, {
  createVisualizerPaths,
} from "@/app/visualizer/components/VisualizerPageLayout";



export default function Page() {
  return (
    <VisualizerPageLayout
      paths={createVisualizerPaths("Stack", "Push & Pop")}
      title="Push & Pop"
      headerActions={<ArticleActions />}
      animation={<Animation />}
      content={<Content />}
      code={<Code />}
      exploreOther={
        <ExploreOther
          title="Explore other operations"
          links={[
            { text: "Peek", url: "/visualizer/stack/peek" },
            { text: "Is Empty", url: "/visualizer/stack/isempty" },
            { text: "Is Full", url: "/visualizer/stack/isfull" },
          ]}
        />
      }
    />
  );
}
