import Animation from "@/app/visualizer/stack/polish/postfix/animation";
import ArticleActions from "@/app/components/ui/ArticleActions";
import Content from "@/app/visualizer/stack/polish/postfix/content";
import Code from "@/app/visualizer/stack/polish/postfix/codeBlock";
import ExploreOther from "@/app/components/ui/exploreOther";
import VisualizerPageLayout, {
  createVisualizerPaths,
} from "@/app/visualizer/components/VisualizerPageLayout";



export default function Page() {
  return (
    <VisualizerPageLayout
      paths={createVisualizerPaths("Stack", "Infix to Postfix")}
      title="Infix to Postfix"
      headerActions={<ArticleActions />}
      animation={<Animation />}
      content={<Content />}
      code={<Code />}
      exploreOther={
        <ExploreOther
          title="Explore other conversions"
          links={[{ text: "Infix to Prefix", url: "./prefix" }]}
        />
      }
    />
  );
}
