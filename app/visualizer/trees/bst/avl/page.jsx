import Animation from "@/app/visualizer/trees/bst/avl/animation";
import Navbar from "@/app/components/navbar";
import BackToTopButton from "@/app/components/ui/backtotop";
import Footer from "@/app/components/footer";
import ExploreOther from "@/app/components/ui/exploreOther";
import Code from "@/app/visualizer/trees/bst/avl/codeBlock";
import Quiz from "@/app/visualizer/trees/bst/avl/quiz";
import Content from "@/app/visualizer/trees/bst/avl/content";
import Breadcrumbs from "@/app/components/ui/Breadcrumbs";
import ArticleActions from "@/app/components/ui/ArticleActions";
import ModuleCard from "@/app/components/ui/ModuleCard";
import { MODULE_MAPS } from "@/lib/modulesMap";

export const metadata = {
  title: "AVL Tree Balancing | Step-by-Step Animation",
  description:
    "Visualize AVL tree balancing with interactive animations showing balance factors and rotations (LL, RR, LR, RL), code examples in JavaScript, Python, Java, C, and C++, and a quiz to test your understanding.",
  keywords: [
    "AVL Tree",
    "AVL Balancing",
    "AVL Rotations",
    "LL Rotation",
    "RR Rotation",
    "LR Rotation",
    "RL Rotation",
    "Self-Balancing BST",
    "AVL Tree Animation",
    "AVL Tree Visualization",
    "DSA AVL Tree",
    "Algorithm Visualizer",
    "AVL Tree in JavaScript",
    "AVL Tree in Python",
    "AVL Tree in Java",
    "AVL Tree in C",
    "AVL Tree in C++",
    "AVL Tree Quiz",
    "DSA Quiz Trees",
    "Balance Factor AVL",
  ],
  robots: "index, follow",
  openGraph: {
    images: [
      {
        url: "/og/trees/bstAvl.png",
        width: 1200,
        height: 630,
        alt: "AVL Tree Balancing Visualization",
      },
    ],
  },
};

export default function Page() {
  const paths = [
    { name: "Home", href: "/" },
    { name: "Visualizer", href: "/visualizer" },
    { name: "Trees : AVL", href: "" },
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
              AVL Tree Balancing
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
            moduleId={MODULE_MAPS.bstAvl}
            title="AVL Tree Balancing"
            description="Mark AVL tree balancing as done and view it on your dashboard"
            initialDone={false}
          />
        </section>

        <section className="px-6">
          <ExploreOther
            title="Explore other tree topics"
            links={[
              { text: "BST Insertion", url: "../insertion" },
              { text: "BST Deletion", url: "../deletion" },
              { text: "BST Searching", url: "../searching" },
            ]}
          />
        </section>
      </div>

      <BackToTopButton />
      <Footer />
    </>
  );
}
