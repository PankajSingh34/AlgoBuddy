import Animation from "@/app/visualizer/queue/types/priority/animation";
import Content from "@/app/visualizer/queue/types/priority/content";
import Quiz from "@/app/visualizer/queue/types/priority/quiz";
import Code from "@/app/visualizer/queue/types/priority/codeBlock";
import ModuleCard from "@/app/components/ui/ModuleCard";
import { StandardAlgorithmPage } from "@/app/components/ui/algorithm-page";
import { MODULE_MAPS } from "@/lib/modulesMap";

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
    { name: "Queue", href: "/visualizer" },
    { name: "Priority Queue", href: "" },
  ];

  return (
    <StandardAlgorithmPage
      paths={paths}
      category="Queue"
      title="Priority Queue"
      visualizerTitle="Interactive Visualizer"
      visualizerDescription="Watch higher-priority items move ahead of lower-priority items while preserving queue-style processing."
      visualizer={<Animation />}
      content={<Content />}
      code={<Code />}
      quiz={<Quiz />}
      moduleCard={
        <ModuleCard
          moduleId={MODULE_MAPS.priorityQueue}
          title="Priority Queue"
          description="Mark Priority Queue as done and view it on your dashboard"
          initialDone={false}
        />
      }
      relatedTopics={{
        title: "Explore Other Types",
        links: [
          { text: "Single Ended Queue", url: "./singleEnded" },
          { text: "Circular Queue", url: "./circular" },
          { text: "Double-Ended Queue", url: "./deque" },
          { text: "Multiple Queue", url: "./multiple" },
        ],
      }}
    />
  );
}
