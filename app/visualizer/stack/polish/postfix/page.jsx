import Animation from "@/app/visualizer/stack/polish/postfix/animation";
import Content from "@/app/visualizer/stack/polish/postfix/content";
import Quiz from "@/app/visualizer/stack/polish/postfix/quiz";
import Code from "@/app/visualizer/stack/polish/postfix/codeBlock";
import ModuleCard from "@/app/components/ui/ModuleCard";
import { StandardAlgorithmPage } from "@/app/components/ui/algorithm-page";
import { MODULE_MAPS } from "@/lib/modulesMap";

export const metadata = {
  title:
    "Postfix Notation using Stack | Learn Postfix Evaluation in DSA with Code in JS, C, Python, Java",
  description:
    "Visualize how Postfix expressions are evaluated using a Stack through interactive animations and code examples in JavaScript, C, Python, and Java. Perfect for DSA beginners and technical interview preparation.",
  keywords: [
    "Postfix Notation",
    "Postfix Evaluation Stack",
    "Stack DSA",
    "Postfix Expression",
    "DSA Postfix",
    "Evaluate Postfix using Stack",
    "Learn Postfix Notation",
    "Postfix Evaluation in JavaScript",
    "Postfix Evaluation in C",
    "Postfix Evaluation in Python",
    "Postfix Evaluation in Java",
    "Stack Code Examples",
    "DSA Expression Evaluation",
  ],
  robots: "index, follow",
  openGraph: {
    images: [
      {
        url: "/og/stack/postfix.png",
        width: 1200,
        height: 630,
        alt: "Stack infix to postfix",
      },
    ],
  },
};

export default function Page() {
  const paths = [
    { name: "Home", href: "/" },
    { name: "Visualizer", href: "/visualizer" },
    { name: "Stack", href: "/visualizer" },
    { name: "Stack : Infix to postfix", href: "" },
  ];

  return (
    <StandardAlgorithmPage
      paths={paths}
      category="Stack"
      title="Infix to Postfix"
      visualizerTitle="Interactive Visualizer"
      visualizerDescription="Follow how the stack processes operators and parentheses while converting an infix expression into postfix form."
      visualizer={<Animation />}
      content={<Content />}
      code={<Code />}
      quiz={<Quiz />}
      moduleCard={
        <ModuleCard
          moduleId={MODULE_MAPS.postfix}
          title="Polish : Postfix Notation"
          description="Mark Polish : postfix as done and view it on your dashboard"
          initialDone={false}
        />
      }
      relatedTopics={{
        title: "Explore other conversions",
        links: [{ text: "Infix to Prefix", url: "./prefix" }],
      }}
    />
  );
}
