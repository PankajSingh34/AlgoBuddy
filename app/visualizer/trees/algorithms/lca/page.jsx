import Animation from "@/app/visualizer/trees/algorithms/lca/animation";
import Navbar from "@/app/components/navbar";
import Breadcrumbs from "@/app/components/ui/Breadcrumbs";
import ArticleActions from "@/app/components/ui/ArticleActions";
import Content from "@/app/visualizer/trees/algorithms/lca/content";
import Quiz from "@/app/visualizer/trees/algorithms/lca/quiz";
import Code from "@/app/visualizer/trees/algorithms/lca/codeBlock";
import ExploreOther from "@/app/components/ui/exploreOther";
import ModuleCard from "@/app/components/ui/ModuleCard";
import { MODULE_MAPS } from "@/lib/modulesMap";
import Footer from '@/app/components/footer';
import BackToTopButton from '@/app/components/ui/backtotop';

export const metadata = {
  title:
    "Lowest Common Ancestor Visualizer & Quiz | Learn LCA with Code in JS, Python, Java, C, C++",
  description:
    "Understand the Lowest Common Ancestor algorithm through step-by-step animations and interactive quiz. Includes recursive and parent-pointer implementations in JavaScript, Python, Java, C, and C++ for DSA mastery.",
  keywords: [
    "Lowest Common Ancestor",
    "LCA Algorithm",
    "Tree LCA",
    "Binary Tree LCA",
    "LCA Animation",
    "LCA Quiz",
    "Data Structure Visualization",
    "Tree Algorithm",
    "LCA in JavaScript",
    "LCA in Python",
    "LCA in Java",
    "LCA in C",
    "LCA in C++",
    "Recursive LCA",
    "Parent Pointer LCA",
  ],
  robots: "index, follow",
  openGraph: {
    images: [
      {
        url: "/og/trees/lca.png",
        width: 1200,
        height: 630,
        alt: "Lowest Common Ancestor Visualization",
      },
    ],
  },
};

export default function Page() {
  const paths = [
    { name: "Home", href: "/" },
    { name: "Visualizer", href: "/visualizer" },
    { name: "Trees : Lowest Common Ancestor", href: "" },
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
              Lowest Common Ancestor
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
            moduleId={MODULE_MAPS.treeLca}
            title="Lowest Common Ancestor"
            description="Mark Lowest Common Ancestor as done and view it on your dashboard"
            initialDone={false}
          />
        </section>

        <section className="px-6">
          <ExploreOther
            title="Explore related topics"
            links={[
              { text: "Tree Diameter", url: "/visualizer/trees/algorithms/diameter" },
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
