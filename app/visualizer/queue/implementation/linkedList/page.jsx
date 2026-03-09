import Navbar from "@/app/components/navbarinner";
import Breadcrumbs from "@/app/components/ui/Breadcrumbs";
import ArticleActions from "@/app/components/ui/ArticleActions";
import Content from "@/app/visualizer/queue/implementation/linkedList/content";
import Code from "@/app/visualizer/queue/implementation/linkedList/codeBlock";
import ModuleCard from "@/app/components/ui/ModuleCard";
import { MODULE_MAPS } from "@/lib/modulesMap";
import ExploreOther from "@/app/components/ui/exploreOther";
import Footer from "@/app/components/footer";
import BackToTop from "@/app/components/ui/backtotop";

export const metadata = {
  title:
    "Queue Implementation Using Linked List | Visualize Queue in JS, C, Python, Java",
  description:
    "Explore Queue implementation using Linked List with real-time visualizations and code examples in JavaScript, C, Python, and Java. Understand how Enqueue and Dequeue work in a dynamic memory structure. Perfect for DSA beginners and interview prep.",
  keywords: [
    "Queue Implementation",
    "Queue using Linked List",
    "Enqueue Dequeue Operations",
    "Queue Data Structure",
    "Linked List Queue",
    "Queue Visualization",
    "DSA Queue Tutorial",
    "Queue in JavaScript",
    "Queue in C",
    "Queue in Python",
    "Queue in Java",
    "Learn Queue",
    "Interactive DSA Tools",
    "DSA with Linked List",
    "DSA for Beginners",
  ],
  robots: "index, follow",
  openGraph: {
    images: [
      {
        url: "/og/queue/queueLinkedList.png",
        width: 1200,
        height: 630,
        alt: "Implementation of Queue using Linked List Algorithm Visualization",
      },
    ],
  },
};

export default function Page() {
  const paths = [
    { name: "Home", href: "/" },
    { name: "Visualizer", href: "/visualizer" },
    { name: "Queue using Linked List", href: "" },
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
              Using Linked List
            </h1>
            <ArticleActions />
          </div>
          <div className="h-px max-w-4xl mx-auto my-10 bg-gradient-to-r from-transparent via-[#d1d7dc] dark:via-[#333] to-transparent"></div>
          <Content />
        </section>

        <section className="px-6">
          <Code />
        </section>

        <section className="px-6 md:px-12 my-12">
          <ModuleCard
            moduleId={MODULE_MAPS.queueLinkedList}
            title="Queue Using Linked List"
            description="Mark Queue implementation using Linked List as done and view it on your dashboard"
            initialDone={false}
          />
        </section>

        <section className="px-6">
          <ExploreOther
            title="Explore other implementation"
            links={[{ text: "Using Array", url: "./array" }]}
          />
        </section>
      </div>

      <BackToTop />
      <Footer />
    </>
  );
}
