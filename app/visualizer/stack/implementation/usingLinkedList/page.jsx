import Content from "@/app/visualizer/stack/implementation/usingLinkedList/content";
import Code from "@/app/visualizer/stack/implementation/usingLinkedList/codeBlock";
import ModuleCard from "@/app/components/ui/ModuleCard";
import { StandardAlgorithmPage } from "@/app/components/ui/algorithm-page";
import { MODULE_MAPS } from "@/lib/modulesMap";

export const metadata = {
  title:
    "Stack Implementation using Linked List | Learn Stack in DSA with JS, C, Python, Java Code",
  description:
    "Explore how to implement a Stack using a Linked List with step-by-step visual explanations, animations, and complete code in JavaScript, C, Python, and Java. Ideal for DSA learners and coding interview prep.",
  keywords: [
    "Stack using Linked List",
    "Stack Implementation",
    "Stack Implementation in JavaScript",
    "Stack Implementation in C",
    "Stack Implementation in Python",
    "Stack Implementation in Java",
    "Linked List Stack",
    "DSA Stack",
    "Data Structures Stack",
    "Stack Push Pop Linked List",
    "Learn Stack DSA",
    "Visualize Stack Implementation",
    "Stack Code Examples",
  ],
  robots: "index, follow",
  openGraph: {
    images: [
      {
        url: "/og/stack/stackLinkedList.png",
        width: 1200,
        height: 630,
        alt: "Stack Implementation using Linked List",
      },
    ],
  },
};

export default function Page() {
  const paths = [
    { name: "Home", href: "/" },
    { name: "Visualizer", href: "/visualizer" },
    { name: "Stack", href: "/visualizer" },
    { name: "Stack : Implementation Using Linked List", href: "" },
  ];

  return (
    <StandardAlgorithmPage
      paths={paths}
      category="Stack"
      title="Implementation Using Linked List"
      content={<Content />}
      code={<Code />}
      moduleCard={
        <ModuleCard
          moduleId={MODULE_MAPS.stackLinkedList}
          title="Stack Implementation using Linked List"
          description="Mark Stack using Linked List as done and view it on your dashboard"
          initialDone={false}
        />
      }
      relatedTopics={{
        title: "Explore other implementation",
        links: [{ text: "Using Array", url: "./usingArray" }],
      }}
    />
  );
}
