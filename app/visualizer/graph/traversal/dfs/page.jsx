import DfsAnimation from "@/app/visualizer/graph/traversal/dfs/animation";
import Navbar from "@/app/components/navbar";
import BackToTopButton from "@/app/components/ui/backtotop";
import Footer from "@/app/components/footer";
import ExploreOther from "@/app/components/ui/exploreOther";
import Code from "@/app/visualizer/graph/traversal/dfs/codeBlock";
import Quiz from "@/app/visualizer/graph/traversal/dfs/quiz";
import Content from "@/app/visualizer/graph/traversal/dfs/content";
import Breadcrumbs from "@/app/components/ui/Breadcrumbs";
import ArticleActions from "@/app/components/ui/ArticleActions";
import ModuleCard from "@/app/components/ui/ModuleCard";
import { MODULE_MAPS } from "@/lib/modulesMap";

export const metadata = {
  title: "DFS (Depth-First Search) | Graph Traversal | Step-by-Step Animation",
  description:
    "Visualize the Depth-First Search graph traversal algorithm with step-by-step animations, code examples in JavaScript, C, Python, and Java, and a DFS quiz to test your understanding. Build a strong foundation in graph algorithms through interactive learning.",
  keywords: [
    "DFS Visualizer",
    "DFS Visualization",
    "DFS Animation",
    "Depth-First Search",
    "Graph Traversal",
    "Stack Graph Traversal",
    "Learn DFS",
    "DFS for Beginners",
    "Step-by-Step DFS",
    "Visualize DFS Algorithm",
    "DSA DFS",
    "Algorithm Visualizer",
    "DSA Graph Algorithms",
    "DFS in JavaScript",
    "DFS in C",
    "DFS in Python",
    "DFS in Java",
    "DFS Code Examples",
    "DFS Quiz",
    "Interactive DFS Quiz",
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
        url: "/og/graph/dfs.png",
        width: 1200,
        height: 630,
        alt: "DFS Graph Traversal Visualization",
      },
    ],
  },
};

export default function Page() {
  const paths = [
    { name: "Home", href: "/" },
    { name: "Visualizer", href: "/visualizer" },
    { name: "Graph : Traversal", href: "/visualizer/graph/traversal" },
    { name: "DFS", href: "" },
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
              Depth-First Search (DFS)
            </h1>
            <ArticleActions />
          </div>
          <div className="h-px max-w-4xl mx-auto my-10 bg-gradient-to-r from-transparent via-[#d1d7dc] dark:via-[#333] to-transparent"></div>
          <Content />
        </section>

        <section>
          <DfsAnimation />
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
            moduleId={MODULE_MAPS.graphDfs}
            title="DFS"
            description="Mark DFS as done and view it on your dashboard"
            initialDone={false}
          />
        </section>

        <section className="px-6">
          <ExploreOther
            title="Explore other operations"
            links={[
              { text: "BFS", url: "../bfs" },
              { text: "Topological Sort", url: "../../algorithms/topological-sort" },
            ]}
          />
        </section>
      </div>

      <BackToTopButton />
      <Footer />
    </>
  );
}
