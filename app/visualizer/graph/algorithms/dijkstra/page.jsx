import Animation from "@/app/visualizer/graph/algorithms/dijkstra/animation";
import Navbar from "@/app/components/navbar";
import Breadcrumbs from "@/app/components/ui/Breadcrumbs";
import ArticleActions from "@/app/components/ui/ArticleActions";
import Content from "@/app/visualizer/graph/algorithms/dijkstra/content";
import Quiz from "@/app/visualizer/graph/algorithms/dijkstra/quiz";
import Code from "@/app/visualizer/graph/algorithms/dijkstra/codeBlock";
import ExploreOther from "@/app/components/ui/exploreOther";
import ModuleCard from "@/app/components/ui/ModuleCard";
import { MODULE_MAPS } from "@/lib/modulesMap";
import Footer from '@/app/components/footer';
import BackToTopButton from '@/app/components/ui/backtotop';

export const metadata = {
  title: "Dijkstra's Algorithm | AlgoBuddy",
  description: "Visualize Dijkstra's shortest path algorithm with step-by-step animations, code examples in JavaScript, Python, Java, C, and C++, and an interactive quiz to test your understanding of priority queues, relaxation, and single-source shortest paths.",
  keywords: [
    "Dijkstra's Algorithm Visualizer",
    "Dijkstra Visualization",
    "Shortest Path Algorithm",
    "Learn Dijkstra",
    "Dijkstra for Beginners",
    "Step-by-Step Dijkstra",
    "Visualize Dijkstra Algorithm",
    "DSA Dijkstra",
    "Algorithm Visualizer",
    "DSA Graph Algorithms",
    "Priority Queue Dijkstra",
    "Dijkstra in JavaScript",
    "Dijkstra in Python",
    "Dijkstra in Java",
    "Dijkstra in C",
    "Dijkstra in C++",
    "Single Source Shortest Path",
    "Dijkstra Quiz",
    "Interactive Dijkstra Quiz",
    "DSA Quiz",
    "Quiz for Graph Algorithms",
    "Graph Traversal Quiz",
    "Dijkstra Practice",
    "Test Your Dijkstra Skills",
  ],
  robots: "index, follow",
  openGraph: {
    images: [
      {
        url: "/og/graph/dijkstra.png",
        width: 1200,
        height: 630,
        alt: "Dijkstra's Algorithm Visualization",
      },
    ],
  },
};

export default function Page() {
  const paths = [
    { name: "Home", href: "/" },
    { name: "Visualizer", href: "/visualizer" },
    { name: "Graph : Algorithms", href: "/visualizer/graph/algorithms" },
    { name: "Dijkstra's Algorithm", href: "" },
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
            <p className="uppercase tracking-wide bg-[#f0fdf4] text-[#16a34a] border border-[#bbf7d0] px-4 py-1 mb-2 rounded-full text-sm font-semibold">Graph</p>
            <h1 className="text-4xl md:text-5xl font-extrabold text-center text-[#1a1a1a] dark:text-white mb-0">Dijkstra's Algorithm</h1>
            <ArticleActions />
          </div>
          <div className="h-px max-w-4xl mx-auto my-10 bg-gradient-to-r from-transparent via-[#d1d7dc] dark:via-[#333] to-transparent"></div>
          <Content />
        </section>

        <section>
          <Animation />
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
            moduleId={MODULE_MAPS.dijkstra}
            title="Dijkstra's Algorithm"
            description="Mark Dijkstra's Algorithm as done and view it on your dashboard"
            initialDone={false}
          />
        </section>

        <section className="px-6">
          <ExploreOther
            title="Explore related algorithms"
            links={[
              { text: "Prim's Algorithm", url: "/visualizer/graph/algorithms/prim" },
              { text: "BFS", url: "/visualizer/graph/traversal/bfs" },
            ]}
          />
        </section>
      </div>

      <BackToTopButton />
      <Footer />
    </>
  );
}
