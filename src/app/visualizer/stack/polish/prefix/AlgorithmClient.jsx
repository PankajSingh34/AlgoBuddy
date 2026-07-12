import Animation from "@/app/visualizer/stack/polish/prefix/animation";
import ArticleActions from "@/app/components/ui/ArticleActions";
import Content from "@/app/visualizer/stack/polish/prefix/content";
import Code from "@/app/visualizer/stack/polish/prefix/codeBlock";
import ExploreOther from "@/app/components/ui/exploreOther";
import VisualizerPageLayout, {
  createVisualizerPaths,
} from "@/app/visualizer/components/VisualizerPageLayout";



export default function Page() {
  return (
    <VisualizerPageLayout
      paths={createVisualizerPaths("Stack", "Infix to Prefix")}
      title="Infix to Prefix"
      headerActions={<ArticleActions />}
      animation={<Animation />}
      content={<Content />}
      code={<Code />}
      exploreOther={
        <ExploreOther
          title="Explore other conversions"
          links={[{ text: "Infix to Postfix", url: "./postfix" }]}
        />
      }
    />
  );
}
