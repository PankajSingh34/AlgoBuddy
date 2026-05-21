import Animation from "@/app/visualizer/queue/types/deque/animation";
import Content from "@/app/visualizer/queue/types/deque/content";
import Quiz from "@/app/visualizer/queue/types/deque/quiz";
import Code from "@/app/visualizer/queue/types/deque/codeBlock";
import ModuleCard from "@/app/components/ui/ModuleCard";
import { StandardAlgorithmPage } from "@/app/components/ui/algorithm-page";
import { MODULE_MAPS } from "@/lib/modulesMap";

export const metadata = {
  title: "Double Ended Queue (Deque) | Learn with JS, C, Python, Java Code",
  description:
    "Explore Double Ended Queue (Deque) in Data Structures with visual animations and full code implementations in JavaScript, C, Python, and Java. Perfect for mastering DSA concepts and interview preparation.",
  keywords: [
    "Double Ended Queue",
    "Double Ended Queue Visualizer",
    "Deque in DSA",
    "DSA Deque",
    "Double Ended Queue in JavaScript",
    "Deque in C",
    "Deque in Python",
    "Deque in Java",
    "DSA Queue Operations",
    "Learn Deque DSA",
    "Deque Code Examples",
    "DSA Visualizer",
  ],
  robots: "index, follow",
  openGraph: {
    images: [
      {
        url: "/og/queue/deque.png",
        width: 1200,
        height: 630,
        alt: "Double Ended Queue Algorithm Visualization",
      },
    ],
  },
};

export default function Page() {
  const paths = [
    { name: "Home", href: "/" },
    { name: "Visualizer", href: "/visualizer" },
    { name: "Queue", href: "/visualizer" },
    { name: "Queue : Double Ended", href: "" },
  ];

  return (
    <StandardAlgorithmPage
      paths={paths}
      category="Queue"
      title="Double Ended"
      visualizerTitle="Interactive Visualizer"
      visualizerDescription="Explore how a deque supports insertion and deletion from both the front and the rear."
      visualizer={<Animation />}
      content={<Content />}
      code={<Code />}
      quiz={<Quiz />}
      moduleCard={
        <ModuleCard
          moduleId={MODULE_MAPS.doubleEnded}
          title="Double Ended"
          description="Mark Double Ended Queue as done and view it on your dashboard"
          initialDone={false}
        />
      }
      relatedTopics={{
        title: "Explore Other Types",
        links: [
          { text: "Single Ended Queue", url: "./singleEnded" },
          { text: "Circular Queue", url: "./circular" },
          { text: "Multiple Queue", url: "./multiple" },
          { text: "Priority Queue", url: "./priority" },
        ],
      }}
    />
  );
}
