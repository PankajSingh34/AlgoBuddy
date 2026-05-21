import Animation from "@/app/visualizer/queue/types/circular/animation";
import Content from "@/app/visualizer/queue/types/circular/content";
import Quiz from "@/app/visualizer/queue/types/circular/quiz";
import Code from "@/app/visualizer/queue/types/circular/codeBlock";
import ModuleCard from "@/app/components/ui/ModuleCard";
import { StandardAlgorithmPage } from "@/app/components/ui/algorithm-page";
import { MODULE_MAPS } from "@/lib/modulesMap";

export const metadata = {
  title: "Circular Queue | Learn with JS, C, Python, Java Code",
  description:
    "Understand how Circular Queue works in Data Structures using animations and complete code examples in JavaScript, C, Python, and Java. Ideal for DSA beginners and interview preparation.",
  keywords: [
    "Circular Queue",
    "Circular Queue Visualizer",
    "Circular Queue DSA",
    "Circular Queue in JavaScript",
    "Circular Queue in C",
    "Circular Queue in Python",
    "Circular Queue in Java",
    "Queue Data Structure",
    "DSA Queue Operations",
    "Learn Circular Queue",
    "Circular Queue Code Examples",
    "DSA Visualizer",
  ],
  robots: "index, follow",
  openGraph: {
    images: [
      {
        url: "/og/queue/circularQueue.png",
        width: 1200,
        height: 630,
        alt: "Circular Queue Algorithm Visualization",
      },
    ],
  },
};

export default function Page() {
  const paths = [
    { name: "Home", href: "/" },
    { name: "Visualizer", href: "/visualizer" },
    { name: "Queue", href: "/visualizer" },
    { name: "Circular Queue", href: "" },
  ];

  return (
    <StandardAlgorithmPage
      paths={paths}
      category="Queue"
      title="Circular Queue"
      visualizerTitle="Interactive Visualizer"
      visualizerDescription="See how a circular queue reuses freed positions and wraps around to the start of the array."
      visualizer={<Animation />}
      content={<Content />}
      code={<Code />}
      quiz={<Quiz />}
      moduleCard={
        <ModuleCard
          moduleId={MODULE_MAPS.circularQueue}
          title="Circular Queue"
          description="Mark Circular Queue as done and view it on your dashboard"
          initialDone={false}
        />
      }
      relatedTopics={{
        title: "Explore Other Types",
        links: [
          { text: "Single Ended Queue", url: "./singleEnded" },
          { text: "Double Ended Queue", url: "./deque" },
          { text: "Multiple Queue", url: "./multiple" },
          { text: "Priority Queue", url: "./priority" },
        ],
      }}
    />
  );
}
