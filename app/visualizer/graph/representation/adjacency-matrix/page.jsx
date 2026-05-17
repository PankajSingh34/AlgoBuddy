import AdjMatrixAnimation from "@/app/visualizer/graph/representation/adjacency-matrix/animation";
import Navbar from "@/app/components/navbar";
import BackToTopButton from "@/app/components/ui/backtotop";
import Footer from "@/app/components/footer";
import ExploreOther from "@/app/components/ui/exploreOther";
import Code from "@/app/visualizer/graph/representation/adjacency-matrix/codeBlock";
import Quiz from "@/app/visualizer/graph/representation/adjacency-matrix/quiz";
import Content from "@/app/visualizer/graph/representation/adjacency-matrix/content";
import Breadcrumbs from "@/app/components/ui/Breadcrumbs";
import ArticleActions from "@/app/components/ui/ArticleActions";
import ModuleCard from "@/app/components/ui/ModuleCard";
import { MODULE_MAPS } from "@/lib/modulesMap";

export const metadata = {
  title: "Adjacency Matrix | Graph Representation | Step-by-Step Animation",
  description:
    "Visualize the Adjacency Matrix graph representation with step-by-step animations, code examples in JavaScript, C, Python, and Java, and a quiz to test your understanding. Build a strong foundation in graph data structures through interactive learning.",
  keywords: [
    "Adjacency Matrix Visualizer",
    "Adjacency Matrix Visualization",
    "Adjacency Matrix Animation",
    "Graph Representation",
    "Graph Data Structure",
    "2D Array Graph",
    "Learn Adjacency Matrix",
    "Adjacency Matrix for Beginners",
    "Step-by-Step Adjacency Matrix",
    "Visualize Graph Representation",
    "DSA Graph Representation",
    "Algorithm Visualizer",
    "DSA Graph Algorithms",
    "Adjacency Matrix in JavaScript",
    "Adjacency Matrix in C",
    "Adjacency Matrix in Python",
    "Adjacency Matrix in Java",
    "Adjacency Matrix Code Examples",
    "Adjacency Matrix Quiz",
    "Interactive Graph Quiz",
    "DSA Quiz",
    "Quiz for Graph Representation",
    "Learn Graphs with Quizzes",
    "Graph Practice",
    "Test Your Graph Skills",
  ],
  robots: "index, follow",
  openGraph: {
    images: [
      {
        url: "/og/graph/adjacencyMatrix.png",
        width: 1200,
        height: 630,
        alt: "Adjacency Matrix Graph Representation Visualization",
      },
    ],
  },
};

export default function Page() {
  const paths = [
    { name: "Home", href: "/" },
    { name: "Visualizer", href: "/visualizer" },
    { name: "Graph : Representation", href: "/visualizer/graph/representation" },
    { name: "Adjacency Matrix", href: "" },
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
              Adjacency Matrix
            </h1>
            <ArticleActions />
          </div>
          <div className="h-px max-w-4xl mx-auto my-10 bg-gradient-to-r from-transparent via-[#d1d7dc] dark:via-[#333] to-transparent"></div>
          <Content />
        </section>

        <section>
          <AdjMatrixAnimation />
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
            moduleId={MODULE_MAPS.adjMatrix}
            title="Adjacency Matrix"
            description="Mark adjacency matrix as done and view it on your dashboard"
            initialDone={false}
          />
        </section>

        <section className="px-6">
          <ExploreOther
            title="Explore other operations"
            links={[
              { text: "Adjacency List", url: "../adjacency-list" },
              { text: "BFS", url: "../../traversal/bfs" },
            ]}
          />
        </section>
      </div>

      <BackToTopButton />
      <Footer />
    </>
  );
}
