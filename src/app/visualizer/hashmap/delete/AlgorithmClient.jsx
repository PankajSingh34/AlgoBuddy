import Animation from "@/app/visualizer/hashmap/delete/animation";
import ArticleActions from "@/app/components/ui/ArticleActions";
import Content from "@/app/visualizer/hashmap/delete/content";
import Code from "@/app/visualizer/hashmap/delete/codeBlock";
import ExploreOther from "@/app/components/ui/exploreOther";
import VisualizerPageLayout, {
  createVisualizerPaths,
} from "@/app/visualizer/components/VisualizerPageLayout";



export default function Page() {
  return (
    <VisualizerPageLayout
      paths={createVisualizerPaths("HashMap", "Delete")}
      title="Delete (remove)"
      headerActions={<ArticleActions />}
      animation={<Animation />}
      content={<Content />}
      code={<Code />}
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