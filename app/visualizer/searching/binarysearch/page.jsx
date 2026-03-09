import Animation from "@/app/visualizer/searching/binarysearch/animation";
import Navbar from "@/app/components/navbarinner";
import Footer from "@/app/components/footer";
import BackToTop from "@/app/components/ui/backtotop";
import ExploreOther from "@/app/components/ui/exploreOther";
import Code from "@/app/visualizer/searching/binarysearch/codeBlock";
import Quiz from "@/app/visualizer/searching/binarysearch/quiz";
import Content from '@/app/visualizer/searching/binarysearch/content';
import Breadcrumbs from "@/app/components/ui/Breadcrumbs";
import ArticleActions from "@/app/components/ui/ArticleActions";
import ModuleCard from "@/app/components/ui/ModuleCard";
import { MODULE_MAPS } from "@/lib/modulesMap";

export const metadata = {
  title: "Binary Search Algorithm | Step-by-Step Animation",
  description:
    "Visualize the Binary Search algorithm with intuitive step-by-step animations, code examples in JavaScript, C, Python, and Java, and an interactive Binary Search Quiz to test your knowledge. Perfect for DSA preparation and beginners learning efficient search algorithms.",
  keywords: [
    "Binary Search Visualizer",
    "Binary Search Visualization",
    "Binary Search Animation",
    "Learn Binary Search",
    "Binary Search for Beginners",
    "Binary Search Step-by-Step",
    "Visualize Binary Search Algorithm",
    "DSA Binary Search",
    "Binary Search Explanation",
    "Binary Search Visualization Tool",
    "Efficient Searching Algorithms",
    "Binary Search in JavaScript",
    "Binary Search in C",
    "Binary Search in Python",
    "Binary Search in Java",
    "Binary Search Code Examples",
    "Binary Search Quiz",
    "Interactive Binary Search Quiz",
    "DSA Quiz",
    "Quiz for Binary Search",
    "Learn DSA with Quizzes",
    "Binary Search Practice",
    "Test Your Binary Search Skills",
  ],
  robots: "index, follow",
  openGraph: {
    images: [
      {
        url: "/og/searching/binarySearch.png",
        width: 1200,
        height: 630,
        alt: "Binary Search Algorithm Visualization",
      },
    ],
  },
};

export default function Page() {
  const paths = [
    { name: "Home", href: "/" },
    { name: "Visualizer", href: "/visualizer" },
    { name: "Binary Search", href: "" },
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
                Searching
              </p>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-center text-[#1a1a1a] dark:text-white mb-0">
              Binary Search
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
            moduleId={MODULE_MAPS.binarySearch}
            title="Binary Search"
            description="Mark binary search as done and view it on your dashboard"
            initialDone={false}
          />
        </section>

        <section className="px-6">
          <ExploreOther
            title="Explore other operations"
            links={[{ text: "Linear Search", url: "./linearsearch" }]}
          />
        </section>
      </div>

      <BackToTop />
      <Footer />
    </>
  );
}
