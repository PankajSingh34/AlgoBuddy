import Animation from "@/app/visualizer/queue/operations/peek-front/animation";
import Content from "@/app/visualizer/queue/operations/peek-front/content";
import Quiz from "@/app/visualizer/queue/operations/peek-front/quiz";
import Code from "@/app/visualizer/queue/operations/peek-front/codeBlock";
import ModuleCard from "@/app/components/ui/ModuleCard";
import { StandardAlgorithmPage } from "@/app/components/ui/algorithm-page";
import { MODULE_MAPS } from "@/lib/modulesMap";

export const metadata = {
  title: "Queue Peek Front Operation | Learn with JS, C, Java, Python Code",
  description:
    "Understand the Peek Front operation in Queue with interactive animations and code examples in JavaScript, C, Python, and Java. Ideal for DSA beginners and interview preparation.",
  keywords: [
    "Queue Peek Front",
    "Queue peek front Visulaization",
    "Peek Front Operation",
    "Queue DSA",
    "Queue Front Element",
    "Queue Peek in JavaScript",
    "Queue Peek in C",
    "Queue Peek in Python",
    "Queue Peek in Java",
    "Queue Data Structure",
    "DSA Queue Operations",
    "Peek Front Code Examples",
    "Queue Visualization",
    "Learn Queue DSA",
  ],
  robots: "index, follow",
  openGraph: {
    images: [
      {
        url: "/og/queue/peekFront.png",
        width: 1200,
        height: 630,
        alt: "Peek Front Algorithm Visualization",
      },
    ],
  },
};

export default function Page() {
  const paths = [
    { name: "Home", href: "/" },
    { name: "Visualizer", href: "/visualizer" },
    { name: "Queue", href: "/visualizer" },
    { name: "Peek Front", href: "" },
  ];

  return (
    <StandardAlgorithmPage
      paths={paths}
      category="Queue"
      title="Peek Front"
      visualizerTitle="Interactive Visualizer"
      visualizerDescription="See how the queue reveals the front element without removing it from the data structure."
      visualizer={<Animation />}
      content={<Content />}
      code={<Code />}
      quiz={<Quiz />}
      moduleCard={
        <ModuleCard
          moduleId={MODULE_MAPS.peekFront}
          title="Peek Front"
          description="Mark queue : Peek Front as done and view it on your dashboard"
          initialDone={false}
        />
      }
      relatedTopics={{
        title: "Explore Other Operations",
        links: [
          { text: "Enqueue & Dequeue", url: "./enqueue-dequeue" },
          { text: "Is Full", url: "./isfull" },
          { text: "Is Empty", url: "./isempty" },
        ],
      }}
    />
  );
}
