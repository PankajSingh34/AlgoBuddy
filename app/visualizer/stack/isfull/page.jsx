import Animation from "@/app/visualizer/stack/isfull/animation";
import Content from "@/app/visualizer/stack/isfull/content";
import Quiz from "@/app/visualizer/stack/isfull/quiz";
import Code from "@/app/visualizer/stack/isfull/codeBlock";
import ModuleCard from "@/app/components/ui/ModuleCard";
import { StandardAlgorithmPage } from "@/app/components/ui/algorithm-page";
import { MODULE_MAPS } from "@/lib/modulesMap";

export const metadata = {
  title:
    "Stack Is Full Visualizer | Check Full Condition in Stack with Code in JS, C, Python, Java",
  description:
    "Understand how to check if a Stack is full using interactive animations and code examples in JavaScript, C, Python, and Java. A simple guide for beginners and DSA interview preparation.",
  keywords: [
    "Stack Is Full",
    "Is Full Operation Stack",
    "Stack Full Condition",
    "Stack Capacity Check",
    "DSA Stack Animation",
    "Learn Stack Operations",
    "Stack in JavaScript",
    "Stack in C",
    "Stack in Python",
    "Stack in Java",
    "Stack Code Examples",
    "Stack Overflow Condition",
  ],
  robots: "index, follow",
  openGraph: {
    images: [
      {
        url: "/og/stack/isFull.png",
        width: 1200,
        height: 630,
        alt: "Stack isFull Visualization",
      },
    ],
  },
};

export default function Page() {
  const paths = [
    { name: "Home", href: "/" },
    { name: "Visualizer", href: "/visualizer" },
    { name: "Stack", href: "/visualizer" },
    { name: "Stack : IsFull", href: "" },
  ];

  return (
    <StandardAlgorithmPage
      paths={paths}
      category="Stack"
      title="IsFull Operation"
      visualizerTitle="Interactive Visualizer"
      visualizerDescription="Watch how a bounded stack checks whether it has reached maximum capacity before accepting more values."
      visualizer={<Animation />}
      content={<Content />}
      code={<Code />}
      quiz={<Quiz />}
      moduleCard={
        <ModuleCard
          moduleId={MODULE_MAPS.isFull}
          title="Stack isFull"
          description="Mark Stack : isFull as done and view it on your dashboard"
          initialDone={false}
        />
      }
      relatedTopics={{
        title: "Explore other operations",
        links: [
          { text: "Peek", url: "/visualizer/stack/peek" },
          { text: "Is Empty", url: "/visualizer/stack/isempty" },
          { text: "Push Pop", url: "/visualizer/stack/push-pop" },
        ],
      }}
    />
  );
}
