import Animation from "@/app/visualizer/hashmap/insert/animation";
import ArticleActions from "@/app/components/ui/ArticleActions";
import Content from "@/app/visualizer/hashmap/insert/content";
import Code from "@/app/visualizer/hashmap/insert/codeBlock";
import ExploreOther from "@/app/components/ui/exploreOther";
import VisualizerPageLayout, {
  createVisualizerPaths,
} from "@/app/visualizer/components/VisualizerPageLayout";



export default function Page() {
  return (
    <VisualizerPageLayout
      paths={createVisualizerPaths("HashMap", "Insert")}
      title="Insert (put)"
      headerActions={<ArticleActions />}
      animation={<Animation />}
      content={<Content />}
      code={<Code />}
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