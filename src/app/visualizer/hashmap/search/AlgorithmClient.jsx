import Animation from "@/app/visualizer/hashmap/search/animation";
import ArticleActions from "@/app/components/ui/ArticleActions";
import Content from "@/app/visualizer/hashmap/search/content";
import Code from "@/app/visualizer/hashmap/search/codeBlock";
import ExploreOther from "@/app/components/ui/exploreOther";
import VisualizerPageLayout, {
  createVisualizerPaths,
} from "@/app/visualizer/components/VisualizerPageLayout";



export default function Page() {
  return (
    <VisualizerPageLayout
      paths={createVisualizerPaths("HashMap", "Search")}
      title="Search (get)"
      headerActions={<ArticleActions />}
      animation={<Animation />}
      content={<Content />}
      code={<Code />}
      exploreOther={
        <ExploreOther
          title="Explore other operations"
          links={[
            { text: "Insert", url: "/visualizer/hashmap/insert" },
            { text: "Delete", url: "/visualizer/hashmap/delete" },
          ]}
        />
      }
    />
  );
}