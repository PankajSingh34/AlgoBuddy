import Animation from "@/app/visualizer/trees/bst/searching/animation";
import Navbar from "@/app/components/navbar";
import BackToTopButton from "@/app/components/ui/backtotop";
import Footer from "@/app/components/footer";
import ExploreOther from "@/app/components/ui/exploreOther";
import Code from "@/app/visualizer/trees/bst/searching/codeBlock";
import Quiz from "@/app/visualizer/trees/bst/searching/quiz";
import Content from "@/app/visualizer/trees/bst/searching/content";
import Breadcrumbs from "@/app/components/ui/Breadcrumbs";
import ArticleActions from "@/app/components/ui/ArticleActions";
import ModuleCard from "@/app/components/ui/ModuleCard";
import { MODULE_MAPS } from "@/lib/modulesMap";

export const metadata = {
  title: "BST Searching | Step-by-Step Animation",
  description:
    "Visualize Binary Search Tree searching with interactive animations, code examples in JavaScript, Python, Java, C, and C++, and a quiz to test your understanding.",
  keywords: [
    "BST Searching",
    "Binary Search Tree Search",
    "BST Search Animation",
    "Learn BST Search",
    "BST Search Algorithm",
    "Binary Search Tree Visualization",
    "DSA BST",
    "Algorithm Visualizer",
    "BST Search in JavaScript",
    "BST Search in Python",
    "BST Search in Java",
    "BST Search in C",
    "BST Search in C++",
    "BST Search Quiz",
    "DSA Quiz Trees",
    "Tree Search Algorithm",
  ],
  robots: "index, follow",
  openGraph: {
    images: [
      {
        url: "/og/trees/bstSearching.png",
        width: 1200,
        height: 630,
        alt: "BST Searching Visualization",
      },
    ],
  },
};

export default function Page() {
  const paths = [
    { name: "Home", href: "/" },
    { name: "Visualizer", href: "/visualizer" },
    { name: "Trees : BST", href: "" },
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
              BST Searching
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
            moduleId={MODULE_MAPS.bstSearching}
            title="BST Searching"
            description="Mark BST searching as done and view it on your dashboard"
            initialDone={false}
          />
        </section>

        <section className="px-6">
          <ExploreOther
            title="Explore other BST operations"
            links={[
              { text: "BST Insertion", url: "../insertion" },
              { text: "BST Deletion", url: "../deletion" },
              { text: "AVL Tree Balancing", url: "../avl" },
            ]}
          />
        </section>
      </div>

      <BackToTopButton />
      <Footer />
    </>
  );
}
