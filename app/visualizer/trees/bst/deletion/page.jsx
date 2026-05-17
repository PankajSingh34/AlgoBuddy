import Animation from "@/app/visualizer/trees/bst/deletion/animation";
import Navbar from "@/app/components/navbar";
import BackToTopButton from "@/app/components/ui/backtotop";
import Footer from "@/app/components/footer";
import ExploreOther from "@/app/components/ui/exploreOther";
import Code from "@/app/visualizer/trees/bst/deletion/codeBlock";
import Quiz from "@/app/visualizer/trees/bst/deletion/quiz";
import Content from "@/app/visualizer/trees/bst/deletion/content";
import Breadcrumbs from "@/app/components/ui/Breadcrumbs";
import ArticleActions from "@/app/components/ui/ArticleActions";
import ModuleCard from "@/app/components/ui/ModuleCard";
import { MODULE_MAPS } from "@/lib/modulesMap";

export const metadata = {
  title: "BST Deletion | Step-by-Step Animation",
  description:
    "Visualize Binary Search Tree deletion with all three cases — leaf, one child, and two children — through interactive animations, code examples, and a quiz.",
  keywords: [
    "BST Deletion",
    "Binary Search Tree Delete",
    "BST Delete Cases",
    "BST Delete Animation",
    "Learn BST Deletion",
    "Three Cases BST Deletion",
    "Binary Search Tree Visualization",
    "DSA BST",
    "Algorithm Visualizer",
    "BST Deletion in JavaScript",
    "BST Deletion in Python",
    "BST Deletion in Java",
    "BST Deletion in C",
    "BST Deletion in C++",
    "BST Quiz Deletion",
    "DSA Quiz Trees",
    "Inorder Successor BST",
  ],
  robots: "index, follow",
  openGraph: {
    images: [
      {
        url: "/og/trees/bstDeletion.png",
        width: 1200,
        height: 630,
        alt: "BST Deletion Visualization",
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
              BST Deletion
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
            moduleId={MODULE_MAPS.bstDeletion}
            title="BST Deletion"
            description="Mark BST deletion as done and view it on your dashboard"
            initialDone={false}
          />
        </section>

        <section className="px-6">
          <ExploreOther
            title="Explore other BST operations"
            links={[
              { text: "BST Insertion", url: "../insertion" },
              { text: "BST Searching", url: "../searching" },
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
