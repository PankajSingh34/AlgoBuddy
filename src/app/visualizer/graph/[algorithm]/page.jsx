import GraphVisualizer from "../components/GraphVisualizer";
import GraphTopicPage from "../components/GraphTopicPage";
import { graphTopics } from "../data";
import DiscussionThread from "@/app/components/visualizer/DiscussionThread";

export async function generateStaticParams() {
  return [
    { algorithm: "bfs" },
    { algorithm: "dfs" },
    { algorithm: "dijkstra" },
    { algorithm: "a-star" },
    { algorithm: "bellman-ford" },
    { algorithm: "floyd-warshall" },
    { algorithm: "prim" },
    { algorithm: "kruskal" },
    { algorithm: "topological-sort" },
    { algorithm: "kosaraju" },
    { algorithm: "tarjan" },
    { algorithm: "ford-fulkerson" },
    { algorithm: "adjacency-list" },
    { algorithm: "adjacency-matrix" },
    { algorithm: "a-star" },
  ];
}

export async function generateMetadata({ params }) {
  const { algorithm } = await params;
  const topic = graphTopics[algorithm];

  if (!topic) return { title: "Algorithm Not Found" };

  return {
    title: `${topic.title} | AlgoBuddy Graph Visualizer`,
    description: topic.description,
    robots: "index, follow",
  };
}

export default async function Page({ params, searchParams }) {
  const { algorithm } = await params;
  const { startNode } = (await searchParams) || {};
  const topic = graphTopics[algorithm];

  if (!topic) {
    return (
      <div className="flex h-screen items-center justify-center">
        <h1 className="text-2xl font-bold">Algorithm not found</h1>
      </div>
    );
  }

  // Define a wrapper component to ensure props are passed correctly
  const AnimationWrapper = (props) => (
    <GraphVisualizer algorithm={algorithm} {...props} />
  );

  return (
    <>
      <GraphTopicPage 
        topic={topic} 
        Animation={AnimationWrapper}
        startNode={startNode}
      />
      <div className="bg-white dark:bg-[#1c1d1f] w-full border-t dark:border-gray-800 pt-8 pb-16">
        <DiscussionThread topicId={algorithm} />
      </div>
    </>
  );
}
