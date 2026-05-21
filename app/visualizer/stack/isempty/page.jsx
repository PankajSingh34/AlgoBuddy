import Animation from "@/app/visualizer/stack/isempty/animation";
import Content from "@/app/visualizer/stack/isempty/content";
import Quiz from "@/app/visualizer/stack/isempty/quiz";
import Code from "@/app/visualizer/stack/isempty/codeBlock";
import ModuleCard from "@/app/components/ui/ModuleCard";
import { StandardAlgorithmPage } from "@/app/components/ui/algorithm-page";
import { MODULE_MAPS } from "@/lib/modulesMap";

export const metadata = {
  title:
    "Stack is empty Visualizer | Learn Stack IsEmpty Operation in JS, C, Python, Java",
  description:
    "Visualize how Stack isEmpty operation works in DSA using interactive animations. Great for beginners and interview prep. Includes code examples in JavaScript, C, Python, and Java.",
  keywords: [
    "Stack DSA",
    "Stack Visualizer",
    "Learn Stack",
    "DSA Animation",
    "Stack isEmpty Operation",
    "Check if Stack is Empty",
    "Stack Implementation in JavaScript",
    "Stack Implementation in C",
    "Stack in Python",
    "Stack in Java",
    "Stack Code Examples",
    "Interactive Stack Tool",
  ],
  robots: "index, follow",
  openGraph: {
    images: [
      {
        url: "/og/stack/isEmpty.png",
        width: 1200,
        height: 630,
        alt: "Stack isEmpty Visualization",
      },
    ],
  },
};

export default function Page() {
  const paths = [
    { name: "Home", href: "/" },
    { name: "Visualizer", href: "/visualizer" },
    { name: "Stack", href: "/visualizer" },
    { name: "Stack : IsEmpty", href: "" },
  ];

  return (
    <StandardAlgorithmPage
      paths={paths}
      category="Stack"
      title="IsEmpty Operation"
      visualizerTitle="Interactive Visualizer"
      visualizerDescription="Check how a stack determines whether it contains any elements before other operations run."
      visualizer={<Animation />}
      content={<Content />}
      code={<Code />}
      quiz={<Quiz />}
      moduleCard={
        <ModuleCard
          moduleId={MODULE_MAPS.isEmpty}
          title="Stack isEmpty"
          description="Mark Stack : isEmpty as done and view it on your dashboard"
          initialDone={false}
        />
      }
      relatedTopics={{
        title: "Explore other operations",
        links: [
          { text: "Push & Pop", url: "/visualizer/stack/push-pop" },
          { text: "Peek", url: "/visualizer/stack/peek" },
          { text: "Is Full", url: "/visualizer/stack/isfull" },
        ],
      }}
    />
  );
}
