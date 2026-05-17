import Navbar from "@/app/components/navbar";
import Breadcrumbs from "@/app/components/ui/Breadcrumbs";
import Footer from '@/app/components/footer';
import BackToTopButton from '@/app/components/ui/backtotop';
import Link from "next/link";

export const metadata = {
  title: "Graph Traversal | AlgoBuddy",
  description: "Learn about BFS and DFS graph traversal algorithms.",
};

const cards = [
  {
    title: "BFS (Breadth-First Search)",
    desc: "Explores vertices level by level using a queue. Finds shortest paths in unweighted graphs.",
    path: "/visualizer/graph/traversal/bfs",
  },
  {
    title: "DFS (Depth-First Search)",
    desc: "Explores as far as possible along each branch before backtracking using a stack.",
    path: "/visualizer/graph/traversal/dfs",
  },
];

export default function Page() {
  const paths = [
    { name: "Home", href: "/" },
    { name: "Visualizer", href: "/visualizer" },
    { name: "Graph", href: "/visualizer/graph" },
    { name: "Traversal", href: "" },
  ];

  return (
    <>
      <div><Navbar /></div>
      <div className="py-20 bg-white dark:bg-[#0f0f0f] text-[#1a1a1a] dark:text-[#f5f5f5] min-h-screen">
        <section className="px-6 md:px-12 max-w-6xl mx-auto">
          <div className="mt-10 sm:mt-10 mb-4"><Breadcrumbs paths={paths} /></div>
          <div className="text-center mb-12">
            <p className="uppercase tracking-wide bg-[#f0fdf4] text-[#16a34a] border border-[#bbf7d0] px-4 py-1 mb-4 rounded-full text-sm font-semibold inline-block">
              Graph Traversal
            </p>
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#1a1a1a] dark:text-white mb-4">Traversal</h1>
            <p className="text-lg text-[#6b7280] dark:text-[#9ca3af] max-w-2xl mx-auto">
              Graph traversal algorithms systematically visit vertices to explore the structure.
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
