import LinearSearchAnimation from "@/app/visualizer/array/linearsearch/animation";
import ExploreOther from "@/app/components/ui/exploreOther";
import Code from "@/app/visualizer/array/linearsearch/codeBlock";
import Quiz from "@/app/visualizer/array/linearsearch/quiz";
import Content from "@/app/visualizer/array/linearsearch/content";
import ArticleActions from "@/app/components/ui/ArticleActions";
import ModuleCard from "@/app/components/ui/ModuleCard";
import VisualizerPageLayout, {
  createVisualizerPaths,
} from "@/app/visualizer/components/VisualizerPageLayout";
import { MODULE_MAPS } from "@/lib/modulesMap";

export const metadata = {
  title: "Linear Search Algorithm | Step-by-Step Animation",
  description:
    "Visualize the Linear Search algorithm with step-by-step animations, code examples in JavaScript, C, Python, and Java, and a Linear Search Quiz to test your understanding. Build a strong foundation in DSA through interactive learning.",
  keywords: [
    "Linear Search Visualizer",
    "Linear Search Visualization",
    "Linear Search Animation",
    "Learn Linear Search",
    "Linear Search for Beginners",
    "Step-by-Step Linear Search",
    "Visualize Linear Search Algorithm",
    "DSA Linear Search",
    "Algorithm Visualizer",
    "DSA Searching Algorithms",
    "Search Algorithms DSA",
    "Linear Search in JavaScript",
    "Linear Search in C",
    "Linear Search in Python",
    "Linear Search in Java",
    "Linear Search Code Examples",
    "Linear Search Quiz",
    "Interactive Linear Search Quiz",
    "DSA Quiz",
    "Quiz for Searching Algorithms",
    "Learn DSA with Quizzes",
    "Linear Search Practice",
    "Test Your Linear Search Skills",
  ],
  robots: "index, follow",
  openGraph: {
    images: [
      {
        url: "/og/array/linearSearch.png",
        width: 1200,
        height: 630,
        alt: "Linear Search Algorithm Visualization",
      },
    ],
  },
};

export default function Page() {
  return (
    <VisualizerPageLayout
      paths={createVisualizerPaths("Array", "Linear Search")}
      title="Linear Search"
      headerActions={<ArticleActions />}
      animation={<LinearSearchAnimation />}
      content={<Content />}
      code={<Code />}
      quiz={<Quiz />}
      moduleCard={
        <ModuleCard
          moduleId={MODULE_MAPS.linearSearch}
          description="Mark linear search as done and view it on your dashboard"
          initialDone={false}
        />
      }
      exploreOther={
        <ExploreOther
          title="Explore other operations"
          links={[{ text: "Binary Search", url: "./binarysearch" }]}
        />
      }
    />
  );
}
