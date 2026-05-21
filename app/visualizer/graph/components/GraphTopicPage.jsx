import {
  AlgorithmPageLayout,
  ComplexitySection,
  ExplanationCard,
  RelatedTopicsSection,
  VisualizerContainer,
} from "@/app/components/ui/algorithm-page";
import { getGraphRelatedLinks } from "@/app/visualizer/graph/data";

export default function GraphTopicPage({ topic, Animation }) {
  const paths = [
    { name: "Home", href: "/" },
    { name: "Visualizer", href: "/visualizer" },
    { name: "Graph", href: "/visualizer" },
    { name: topic.title, href: "" },
  ];

  return (
    <AlgorithmPageLayout
      paths={paths}
      category="Graph"
      title={topic.title}
      description={topic.description}
    >
      <section className="container-app mt-10 sm:mt-12">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <ExplanationCard title="Core idea" className="overflow-hidden p-0">
            <section className="border-b border-[#f3f4f6] p-6 dark:border-[#1e1e1e]">
              <div className="space-y-3 text-[#4b5563] dark:text-[#d1d5db]">
                {topic.summary.map((item) => (
                  <p key={item}>{item}</p>
                ))}
              </div>
            </section>

            <section className="p-6">
              <h3 className="mb-4 text-2xl font-black tracking-[-0.03em] text-[#1a1a1a] dark:text-white">
                How it works
              </h3>
              <ol className="space-y-3 pl-5 text-[#4b5563] marker:text-[#a435f0] dark:text-[#d1d5db]">
                {topic.steps.map((step) => (
                  <li key={step} className="list-decimal pl-2">
                    {step}
                  </li>
                ))}
              </ol>
            </section>
          </ExplanationCard>

          <ComplexitySection
            title="Complexity"
            description="Key trade-offs to keep in mind while comparing graph approaches."
            items={topic.complexity}
          />
        </div>
      </section>

      <VisualizerContainer
        title={`${topic.title} Visualizer`}
        description="Interact with the graph and connect the visual steps back to the ideas above."
        maxWidth="max-w-6xl"
      >
        <Animation />
      </VisualizerContainer>

      <RelatedTopicsSection
        title="Explore graph topics"
        columns="4"
        links={getGraphRelatedLinks(topic.key)}
      />
    </AlgorithmPageLayout>
  );
}
