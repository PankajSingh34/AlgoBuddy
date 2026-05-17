import Animation from "@/app/visualizer/trees/traversal/level-order/animation";
import Navbar from "@/app/components/navbar";
import Breadcrumbs from "@/app/components/ui/Breadcrumbs";
import ArticleActions from "@/app/components/ui/ArticleActions";
import Content from "@/app/visualizer/trees/traversal/level-order/content";
import Quiz from "@/app/visualizer/trees/traversal/level-order/quiz";
import Code from "@/app/visualizer/trees/traversal/level-order/codeBlock";
import ExploreOther from "@/app/components/ui/exploreOther";
import ModuleCard from "@/app/components/ui/ModuleCard";
import { MODULE_MAPS } from "@/lib/modulesMap";
import Footer from '@/app/components/footer';
import BackToTopButton from '@/app/components/ui/backtotop';

export const metadata = {
  title:
    "Level-Order Traversal Visualizer & Quiz | Learn Tree Traversal with Code in JS, Python, Java, C, C++",
  description:
    "Understand Level-Order Tree Traversal (BFS) through step-by-step animations and interactive quiz. Includes queue-based implementations in JavaScript, Python, Java, C, and C++ for DSA mastery.",
  keywords: [
    "Level-Order Traversal",
    "BFS Tree Traversal",
    "Binary Tree Level-Order",
    "Queue Tree Traversal",
    "Level-Order Animation",
    "Tree Traversal Quiz",
    "Data Structure Visualization",
    "Learn Tree Traversal",
    "Level-Order in JavaScript",
    "Level-Order in Python",
    "Level-Order in Java",
    "Level-Order in C",
    "Level-Order in C++",
    "Breadth First Search Tree",
    "Level by Level Traversal",
  ],
  robots: "index, follow",
  openGraph: {
    images: [
      {
        url: "/og/trees/levelorder.png",
        width: 1200,
        height: 630,
        alt: "Level-Order Traversal Visualization",
      },
    ],
  },
};

export default function Page() {
  const paths = [
    { name: "Home", href: "/" },
    { name: "Visualizer", href: "/visualizer" },
    { name: "Trees : Level-Order Traversal", href: "" },
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
              Level-Order Traversal (BFS)
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
            moduleId={MODULE_MAPS.levelOrder}
            title="Level-Order Traversal"
            description="Mark Level-Order Traversal as done and view it on your dashboard"
            initialDone={false}
          />
        </section>

        <section className="px-6">
          <ExploreOther
            title="Explore related topics"
            links={[
              { text: "In-Order Traversal", url: "/visualizer/trees/traversal/in-order" },
              { text: "Post-Order Traversal", url: "/visualizer/trees/traversal/post-order" },
            ]}
          />
        </section>
      </div>

      <BackToTopButton />
      <Footer />
    </>
  );
}
