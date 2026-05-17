import BfsAnimation from "@/app/visualizer/graph/traversal/bfs/animation";
import Navbar from "@/app/components/navbar";
import BackToTopButton from "@/app/components/ui/backtotop";
import Footer from "@/app/components/footer";
import ExploreOther from "@/app/components/ui/exploreOther";
import Code from "@/app/visualizer/graph/traversal/bfs/codeBlock";
import Quiz from "@/app/visualizer/graph/traversal/bfs/quiz";
import Content from "@/app/visualizer/graph/traversal/bfs/content";
import Breadcrumbs from "@/app/components/ui/Breadcrumbs";
import ArticleActions from "@/app/components/ui/ArticleActions";
import ModuleCard from "@/app/components/ui/ModuleCard";
import { MODULE_MAPS } from "@/lib/modulesMap";

export const metadata = {
  title: "BFS (Breadth-First Search) | Graph Traversal | Step-by-Step Animation",
  description:
    "Visualize the Breadth-First Search graph traversal algorithm with step-by-step animations, code examples in JavaScript, C, Python, and Java, and a BFS quiz to test your understanding. Build a strong foundation in graph algorithms through interactive learning.",
  keywords: [
    "BFS Visualizer",
    "BFS Visualization",
    "BFS Animation",
    "Breadth-First Search",
    "Graph Traversal",
    "Level Order Traversal Graph",
    "Learn BFS",
    "BFS for Beginners",
    "Step-by-Step BFS",
    "Visualize BFS Algorithm",
    "DSA BFS",
    "Algorithm Visualizer",
    "DSA Graph Algorithms",
    "BFS in JavaScript",
    "BFS in C",
    "BFS in Python",
    "BFS in Java",
    "BFS Code Examples",
    "BFS Quiz",
    "Interactive BFS Quiz",
    "DSA Quiz",
    "Quiz for Graph Traversal",
    "Learn Graphs with Quizzes",
    "Graph Practice",
    "Test Your Graph Skills",
  ],
  robots: "index, follow",
  openGraph: {
    images: [
      {
        url: "/og/graph/bfs.png",
        width: 1200,
        height: 630,
        alt: "BFS Graph Traversal Visualization",
      },
    ],
  },
};

export default function Page() {
  const paths = [
    { name: "Home", href: "/" },
    { name: "Visualizer", href: "/visualizer" },
    { name: "Graph : Traversal", href: "/visualizer/graph/traversal" },
    { name: "BFS", href: "" },
  ];

  return (
    <>
      <div>
        <Navbar />
      </div>

      <div className="py-20 bg-white dark:bg-[#0f0f0f] text-[#1a1a1a] dark:text-[#f5f5f5]">
        <section className="px-6 md:px-12">
          <div className="mt-10 sm:mt-10 mb-4">
            <Breadcrumbs paths={paths} />
          </div>
          <div className="flex items-center flex-col">
            <div className="flex">
              <p className="uppercase tracking-wide bg-[#f0fdf4] text-[#16a34a] border border-[#bbf7d0] px-4 py-1 mb-2 rounded-full text-sm font-semibold">
                Graph
              </p>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-center text-[#1a1a1a] dark:text-white mb-0">
              Breadth-First Search (BFS)
            </h1>
            <ArticleActions />
          </div>
          <div className="h-px max-w-4xl mx-auto my-10 bg-gradient-to-r from-transparent via-[#d1d7dc] dark:via-[#333] to-transparent"></div>
          <Content />
        </section>

        <section>
          <BfsAnimation />
        </section>

        <section className="px-6">
          <p className="text-lg text-center text-[#6b7280] dark:text-[#9ca3af] mb-2">
            Test Your Knowledge before moving forward!
          </p>
          <Quiz />
        </section>

        <section className="px-6">
          <Code />
        </section>

        <section className="px-6 md:px-12 my-12">
          <ModuleCard
            moduleId={MODULE_MAPS.graphBfs}
            title="BFS"
            description="Mark BFS as done and view it on your dashboard"
            initialDone={false}
          />
        </section>

        <section className="px-6">
          <ExploreOther
            title="Explore other operations"
            links={[
              { text: "DFS", url: "../dfs" },
              { text: "Dijkstra", url: "../../algorithms/dijkstra" },
            ]}
          />
        </section>
      </div>

      <BackToTopButton />
      <Footer />
    </>
  );
}
