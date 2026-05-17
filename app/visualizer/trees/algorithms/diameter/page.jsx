import Animation from "@/app/visualizer/trees/algorithms/diameter/animation";
import Navbar from "@/app/components/navbar";
import Breadcrumbs from "@/app/components/ui/Breadcrumbs";
import ArticleActions from "@/app/components/ui/ArticleActions";
import Content from "@/app/visualizer/trees/algorithms/diameter/content";
import Quiz from "@/app/visualizer/trees/algorithms/diameter/quiz";
import Code from "@/app/visualizer/trees/algorithms/diameter/codeBlock";
import ExploreOther from "@/app/components/ui/exploreOther";
import ModuleCard from "@/app/components/ui/ModuleCard";
import { MODULE_MAPS } from "@/lib/modulesMap";
import Footer from '@/app/components/footer';
import BackToTopButton from '@/app/components/ui/backtotop';

export const metadata = {
  title:
    "Tree Diameter Visualizer & Quiz | Learn Longest Path with Code in JS, Python, Java, C, C++",
  description:
    "Understand Tree Diameter algorithm through step-by-step animations and interactive quiz. Includes two-pass DFS and DP implementations in JavaScript, Python, Java, C, and C++ for DSA mastery.",
  keywords: [
    "Tree Diameter",
    "Longest Path in Tree",
    "Tree Algorithm",
    "Binary Tree Diameter",
    "Diameter Animation",
    "Tree Diameter Quiz",
    "Data Structure Visualization",
    "Tree Algorithm",
    "Diameter in JavaScript",
    "Diameter in Python",
    "Diameter in Java",
    "Diameter in C",
    "Diameter in C++",
    "Two Pass DFS",
    "Tree DP",
  ],
  robots: "index, follow",
  openGraph: {
    images: [
      {
        url: "/og/trees/diameter.png",
        width: 1200,
        height: 630,
        alt: "Tree Diameter Visualization",
      },
    ],
  },
};

export default function Page() {
  const paths = [
    { name: "Home", href: "/" },
    { name: "Visualizer", href: "/visualizer" },
    { name: "Trees : Tree Diameter", href: "" },
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
                Trees
              </p>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-center text-[#1a1a1a] dark:text-white mb-0">
              Tree Diameter
            </h1>
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
            moduleId={MODULE_MAPS.treeDiameter}
            title="Tree Diameter"
            description="Mark Tree Diameter as done and view it on your dashboard"
            initialDone={false}
          />
        </section>

        <section className="px-6">
          <ExploreOther
            title="Explore related topics"
            links={[
              { text: "Lowest Common Ancestor", url: "/visualizer/trees/algorithms/lca" },
              { text: "Binary Search Tree", url: "/visualizer/trees/bst" },
            ]}
          />
        </section>
      </div>

      <BackToTopButton />
      <Footer />
    </>
  );
}
