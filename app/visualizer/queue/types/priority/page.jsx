import Animation from "@/app/visualizer/queue/types/priority/animation";
import Navbar from "@/app/components/navbarinner";
import Breadcrumbs from "@/app/components/ui/Breadcrumbs";
import ArticleActions from "@/app/components/ui/ArticleActions";
import Content from "@/app/visualizer/queue/types/priority/content";
import Quiz from "@/app/visualizer/queue/types/priority/quiz";
import Code from "@/app/visualizer/queue/types/priority/codeBlock";
import ModuleCard from "@/app/components/ui/ModuleCard";
import { MODULE_MAPS } from "@/lib/modulesMap";
import ExploreOther from "@/app/components/ui/exploreOther";
import Footer from "@/app/components/footer";
import BackToTop from "@/app/components/ui/backtotop";

export const metadata = {
  title:
    "Priority Queue Algorithm | Visual Guide with Code in JavaScript, C, Python, Java",
  description:
    "Master Priority Queue in Data Structures with easy-to-understand visualizations and complete code examples in JavaScript, C, Python, and Java. Perfect for DSA learners and coding interview prep.",
  keywords: [
    "Priority Queue",
    "Priority Queue DSA",
    "Priority Queue Data Structure",
    "Priority Queue in JavaScript",
    "Priority Queue in C",
    "Priority Queue in Python",
    "Priority Queue in Java",
    "Priority Queue Examples",
    "DSA Queue Operations",
    "Learn Priority Queue",
    "Priority Queue Code",
    "Priority Queue Visualization",
    "DSA Visualizer",
    "Priority Queue for Interviews",
    "Priority Queue Tutorial",
  ],
  robots: "index, follow",
  openGraph: {
    images: [
      {
        url: "/og/queue/priorityQueue.png",
        width: 1200,
        height: 630,
        alt: "Priority Queue Algorithm Visualization",
      },
    ],
  },
};

export default function Page() {
  const paths = [
    { name: "Home", href: "/" },
    { name: "Visualizer", href: "/visualizer" },
    { name: "Priority Queue", href: "" },
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
                Queue
              </p>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-center text-[#1a1a1a] dark:text-white mb-0">
              Priority Queue
            </h1>
            <ArticleActions />
          </div>
          <div className="h-px max-w-4xl mx-auto my-10 bg-gradient-to-r from-transparent via-[#d1d7dc] dark:via-[#333] to-transparent"></div>
          <Content />
        </section>

        <section className="px-6">
          <Animation />
        </section>

        <section className="px-6">
          <p className="text-lg text-center text-gray-600 dark:text-gray-400 mb-8">
            Test Your Knowledge before moving forward!
          </p>
          <Quiz />
        </section>

        <section className="px-6">
          <Code />
        </section>

        <section className="px-6 md:px-12 my-12">
          <ModuleCard
            moduleId={MODULE_MAPS.priorityQueue}
            title="Priority Queue"
            description="Mark Priority Queue as done and view it on your dashboard"
            initialDone={false}
          />
        </section>

        <section className="px-6">
          <ExploreOther
            title="Explore Other Types"
            links={[
              { text: "Single Ended Queue", url: "./singleEnded" },
              { text: "Circular Queue", url: "./circular" },
              { text: "Double-Ended Queue", url: "./deque" },
              { text: "Multiple Queue", url: "./multiple" },
            ]}
          />
        </section>
      </div>

      <BackToTop />
      <Footer />
    </>
  );
}
