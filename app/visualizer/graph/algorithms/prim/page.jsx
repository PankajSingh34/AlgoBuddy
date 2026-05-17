import Animation from "@/app/visualizer/graph/algorithms/prim/animation";
import Navbar from "@/app/components/navbar";
import Breadcrumbs from "@/app/components/ui/Breadcrumbs";
import ArticleActions from "@/app/components/ui/ArticleActions";
import Content from "@/app/visualizer/graph/algorithms/prim/content";
import Quiz from "@/app/visualizer/graph/algorithms/prim/quiz";
import Code from "@/app/visualizer/graph/algorithms/prim/codeBlock";
import ExploreOther from "@/app/components/ui/exploreOther";
import ModuleCard from "@/app/components/ui/ModuleCard";
import { MODULE_MAPS } from "@/lib/modulesMap";
import Footer from '@/app/components/footer';
import BackToTopButton from '@/app/components/ui/backtotop';

export const metadata = {
  title: "Prim's Algorithm | AlgoBuddy",
  description: "Visualize Prim's Minimum Spanning Tree algorithm with step-by-step animations, code examples in JavaScript, Python, Java, C, and C++, and an interactive quiz to test your understanding of MST, greedy approach, and the cut property.",
  keywords: [
    "Prim's Algorithm Visualizer",
    "Prim's Visualization",
    "Minimum Spanning Tree",
    "MST Algorithm",
    "Learn Prim's Algorithm",
    "Prim's for Beginners",
    "Step-by-Step Prim's",
    "Visualize Prim's Algorithm",
    "DSA Prim's",
    "Algorithm Visualizer",
    "DSA Graph Algorithms",
    "Prim's MST",
    "Prim's in JavaScript",
    "Prim's in Python",
    "Prim's in Java",
    "Prim's in C",
    "Prim's in C++",
    "Cut Property MST",
    "Prim's Quiz",
    "Interactive Prim's Quiz",
    "DSA Quiz",
    "Quiz for Graph Algorithms",
    "MST Practice",
    "Test Your Prim's Skills",
  ],
  robots: "index, follow",
  openGraph: {
    images: [
      {
        url: "/og/graph/prim.png",
        width: 1200,
        height: 630,
        alt: "Prim's Algorithm Visualization",
      },
    ],
  },
};

export default function Page() {
  const paths = [
    { name: "Home", href: "/" },
    { name: "Visualizer", href: "/visualizer" },
    { name: "Graph : Algorithms", href: "/visualizer/graph/algorithms" },
    { name: "Prim's Algorithm", href: "" },
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
            <h1 className="text-4xl md:text-5xl font-extrabold text-center text-[#1a1a1a] dark:text-white mb-0">Prim's Algorithm</h1>
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
            moduleId={MODULE_MAPS.prim}
            title="Prim's Algorithm"
            description="Mark Prim's Algorithm as done and view it on your dashboard"
            initialDone={false}
          />
        </section>

        <section className="px-6">
          <ExploreOther
            title="Explore related algorithms"
            links={[
              { text: "Kruskal's Algorithm", url: "/visualizer/graph/algorithms/kruskal" },
              { text: "Dijkstra's Algorithm", url: "/visualizer/graph/algorithms/dijkstra" },
            ]}
          />
        </section>
      </div>

      <BackToTopButton />
      <Footer />
    </>
  );
}
