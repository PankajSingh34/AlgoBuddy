import Navbar from "@/app/components/navbar";
import Breadcrumbs from "@/app/components/ui/Breadcrumbs";
import Footer from '@/app/components/footer';
import BackToTopButton from '@/app/components/ui/backtotop';
import Link from "next/link";

export const metadata = {
  title: "Graph Algorithms | AlgoBuddy",
  description: "Learn about Dijkstra, Prim, Kruskal, and Topological Sort graph algorithms.",
};

const cards = [
  {
    title: "Dijkstra's Algorithm",
    desc: "Finds the shortest path from a source vertex to all others in weighted graphs.",
    path: "/visualizer/graph/algorithms/dijkstra",
  },
  {
    title: "Prim's Algorithm",
    desc: "Finds a Minimum Spanning Tree by growing one vertex at a time.",
    path: "/visualizer/graph/algorithms/prim",
  },
  {
    title: "Kruskal's Algorithm",
    desc: "Finds a Minimum Spanning Tree by adding edges in increasing weight order.",
    path: "/visualizer/graph/algorithms/kruskal",
  },
  {
    title: "Topological Sort",
    desc: "Orders vertices of a DAG linearly so every edge goes from earlier to later.",
    path: "/visualizer/graph/algorithms/topological-sort",
  },
];

export default function Page() {
  const paths = [
    { name: "Home", href: "/" },
    { name: "Visualizer", href: "/visualizer" },
    { name: "Graph", href: "/visualizer/graph" },
    { name: "Algorithms", href: "" },
  ];

  return (
    <>
      <div><Navbar /></div>
      <div className="py-20 bg-white dark:bg-[#0f0f0f] text-[#1a1a1a] dark:text-[#f5f5f5] min-h-screen">
        <section className="px-6 md:px-12 max-w-6xl mx-auto">
          <div className="mt-10 sm:mt-10 mb-4"><Breadcrumbs paths={paths} /></div>
          <div className="text-center mb-12">
            <p className="uppercase tracking-wide bg-[#f0fdf4] text-[#16a34a] border border-[#bbf7d0] px-4 py-1 mb-4 rounded-full text-sm font-semibold inline-block">
              Graph Algorithms
            </p>
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#1a1a1a] dark:text-white mb-4">Algorithms</h1>
            <p className="text-lg text-[#6b7280] dark:text-[#9ca3af] max-w-2xl mx-auto">
              Classic graph algorithms for shortest paths, minimum spanning trees, and ordering.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cards.map((card) => (
              <Link key={card.path} href={card.path}
                className="border border-[#e5e7eb] dark:border-[#333] rounded-xl p-6 bg-white dark:bg-[#1a1a1a] hover:bg-[#f0fdf4] dark:hover:bg-[#1a3a1a] transition-colors block">
                <h2 className="text-xl font-bold text-[#1a1a1a] dark:text-white mb-2">{card.title}</h2>
                <p className="text-sm text-[#6b7280] dark:text-[#9ca3af]">{card.desc}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
      <BackToTopButton />
      <Footer />
    </>
  );
}
