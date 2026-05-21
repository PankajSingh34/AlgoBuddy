import Animation from "@/app/visualizer/queue/operations/isfull/animation";
import Content from "@/app/visualizer/queue/operations/isfull/content";
import Quiz from '@/app/visualizer/queue/operations/isfull/quiz';
import Code from "@/app/visualizer/queue/operations/isfull/codeBlock";
import ModuleCard from "@/app/components/ui/ModuleCard";
import { StandardAlgorithmPage } from "@/app/components/ui/algorithm-page";
import { MODULE_MAPS } from "@/lib/modulesMap";

export const metadata = {
  title: "Queue Is Full Operation | Learn with JS, C, Python, Java Code",
  description:
    "Understand how to check if a Queue is full using interactive visualizations and detailed code examples in JavaScript, C, Python, and Java. Perfect for mastering DSA and technical interviews.",
  keywords: [
    "Queue Is Full",
    "Is Full Operation Queue",
    "Queue Full Condition",
    "Queue Capacity Check",
    "Queue Code in JavaScript",
    "Queue Code in C",
    "Queue Code in Python",
    "Queue Code in Java",
    "Queue DSA",
    "Learn Queue Operations",
    "Queue Data Structure",
    "Visualize Queue",
  ],
  robots: "index, follow",
  openGraph: {
    images: [
      {
        url: "/og/queue/isFull.png",
        width: 1200,
        height: 630,
        alt: "isFull Algorithm Visualization",
      },
    ],
  },
};

export default function Page() {
  const paths = [
    { name: "Home", href: "/" },
    { name: "Visualizer", href: "/visualizer" },
    { name: "Queue", href: "/visualizer" },
    { name: "Queue : IsFull", href: "" },
  ];

  return (
    <StandardAlgorithmPage
      paths={paths}
      category="Queue"
      title="IsFull"
      visualizerTitle="Interactive Visualizer"
      visualizerDescription="See how a bounded queue determines whether it has reached capacity before accepting another element."
      visualizer={<Animation />}
      content={<Content />}
      code={<Code />}
      quiz={<Quiz />}
      moduleCard={
        <ModuleCard
          moduleId={MODULE_MAPS.queueIsFull}
          title="Queue : IsFull"
          description="Mark queue : isFull as done and view it on your dashboard"
          initialDone={false}
        />
      }
      relatedTopics={{
        title: "Explore Other Operations",
        links: [
          { text: "Peek Front", url: "./peek-front" },
          { text: "Enqueue & Dequeue", url: "./enqueue-dequeue" },
          { text: "Is Empty", url: "./isempty" },
        ],
      }}
    />
  );
}
