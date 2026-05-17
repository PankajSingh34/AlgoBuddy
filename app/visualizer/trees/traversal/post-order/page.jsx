import Animation from "@/app/visualizer/trees/traversal/post-order/animation";
import Navbar from "@/app/components/navbar";
import Breadcrumbs from "@/app/components/ui/Breadcrumbs";
import ArticleActions from "@/app/components/ui/ArticleActions";
import Content from "@/app/visualizer/trees/traversal/post-order/content";
import Quiz from "@/app/visualizer/trees/traversal/post-order/quiz";
import Code from "@/app/visualizer/trees/traversal/post-order/codeBlock";
import ExploreOther from "@/app/components/ui/exploreOther";
import ModuleCard from "@/app/components/ui/ModuleCard";
import { MODULE_MAPS } from "@/lib/modulesMap";
import Footer from '@/app/components/footer';
import BackToTopButton from '@/app/components/ui/backtotop';

export const metadata = {
  title:
    "Post-Order Traversal Visualizer & Quiz | Learn Tree Traversal with Code in JS, Python, Java, C, C++",
  description:
    "Understand Post-Order Tree Traversal through step-by-step animations and interactive quiz. Includes recursive and iterative implementations in JavaScript, Python, Java, C, and C++ for DSA mastery.",
  keywords: [
    "Post-Order Traversal",
    "Tree Traversal",
    "Binary Tree Post-Order",
    "DFS Traversal",
    "Post-Order Animation",
    "Tree Traversal Quiz",
    "Data Structure Visualization",
    "Learn Tree Traversal",
    "Post-Order in JavaScript",
    "Post-Order in Python",
    "Post-Order in Java",
    "Post-Order in C",
    "Post-Order in C++",
    "Recursive Post-Order",
    "Iterative Post-Order",
    "Left Right Root Traversal",
  ],
  robots: "index, follow",
  openGraph: {
    images: [
      {
        url: "/og/trees/postorder.png",
        width: 1200,
        height: 630,
        alt: "Post-Order Traversal Visualization",
      },
    ],
  },
};

export default function Page() {
  const paths = [
    { name: "Home", href: "/" },
    { name: "Visualizer", href: "/visualizer" },
    { name: "Trees : Post-Order Traversal", href: "" },
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
              Post-Order Traversal
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
            moduleId={MODULE_MAPS.postOrder}
            title="Post-Order Traversal"
            description="Mark Post-Order Traversal as done and view it on your dashboard"
            initialDone={false}
          />
        </section>

        <section className="px-6">
          <ExploreOther
            title="Explore related topics"
            links={[
              { text: "In-Order Traversal", url: "/visualizer/trees/traversal/in-order" },
              { text: "Pre-Order Traversal", url: "/visualizer/trees/traversal/pre-order" },
            ]}
          />
        </section>
      </div>

      <BackToTopButton />
      <Footer />
    </>
  );
}
