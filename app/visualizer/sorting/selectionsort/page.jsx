import Animation from "@/app/visualizer/sorting/selectionsort/animation";
import Navbar from "@/app/components/navbarinner";
import BackToTopButton from "@/app/components/ui/backtotop";
import Footer from "@/app/components/footer";
import Content from '@/app/visualizer/sorting/selectionsort/content';
import ExploreOther from "@/app/components/ui/exploreOther";
import Code from "@/app/visualizer/sorting/selectionsort/codeBlock";
import Quiz from "@/app/visualizer/sorting/selectionsort/quiz";
import Breadcrumbs from "@/app/components/ui/Breadcrumbs";
import ArticleActions from "@/app/components/ui/ArticleActions";
import ModuleCard from "@/app/components/ui/ModuleCard";
import { MODULE_MAPS } from "@/lib/modulesMap";

export const metadata = {
  title:
    "Selection Sort Visualizer | Simple Sorting Animation with Code in JS, C, Python, Java",
  description:
    "Visualize Selection Sort in action with step-by-step animations and code examples in JavaScript, C, Python, and Java. A beginner-friendly way to understand this simple sorting algorithm using comparisons and swaps.",
  keywords: [
    "Selection Sort Visualizer",
    "Selection Sort Animation",
    "Selection Sort Algorithm",
    "DSA Selection Sort",
    "Learn Selection Sort",
    "Sorting Algorithm Visualization",
    "Interactive Sorting Tool",
    "Sorting for Beginners",
    "Step by Step Sorting",
    "Selection Sort in JavaScript",
    "Selection Sort in C",
    "Selection Sort in Python",
    "Selection Sort in Java",
    "Selection Sort Code Examples",
  ],
  robots: "index, follow",
  openGraph: {
    images: [
      {
        url: "/og/sorting/selectionSort.png",
        width: 1200,
        height: 630,
        alt: "Selection Sort Algorithm Visualization",
      },
    ],
  },
};

export default function Page() {
  const paths = [
    { name: "Home", href: "/" },
    { name: "Visulaizer", href: "/visualizer" },
    { name: "Selection Sort", href: "" },
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
                Sorting
              </p>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-center text-[#1a1a1a] dark:text-white mb-0">
              Selection Sort
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
            moduleId={MODULE_MAPS.selectionSort}
            title="Selection Sort"
            description="Mark Selection Sort as done and view it on your dashboard"
            initialDone={false}
          />
        </section>

        <section className="px-6">
          <ExploreOther
            title="Explore Sorting Algorithms"
            links={[
              { text: "Quick Sort", url: "/visualizer/sorting/quicksort" },
              { text: "Bubble Sort", url: "/visualizer/sorting/bubblesort" },
              {
                text: "Insertion Sort",
                url: "/visualizer/sorting/insertionsort",
              },
              { text: "Merge Sort", url: "/visualizer/sorting/mergesort" },
              { text: "Heap Sort", url: "/algorithms/sorting/heap" },
            ]}
          />
        </section>
      </div>

      <BackToTopButton />
      <Footer />
    </>
  );
}
