import Navbar from "@/app/components/navbar";
import Footer from '@/app/components/footer';
import BackToTopButton from '@/app/components/ui/backtotop';
import Link from "next/link";

export const metadata = {
  title: "Trees | AlgoBuddy",
  description: "Learn about tree data structures including binary trees, BST, traversals, and algorithms.",
};

const cards = [
  { title: "Binary Tree", desc: "Properties, types, and structure of binary trees", links: [
    { name: "Structure & Properties", path: "/visualizer/trees/binaryTree/properties" },
    { name: "Types of Binary Trees", path: "/visualizer/trees/binaryTree/types" },
  ]},
  { title: "Binary Search Tree", desc: "BST operations including insertion, deletion, and balancing", links: [
    { name: "Insertion", path: "/visualizer/trees/bst/insertion" },
    { name: "Deletion", path: "/visualizer/trees/bst/deletion" },
    { name: "Searching", path: "/visualizer/trees/bst/searching" },
    { name: "Balancing (AVL)", path: "/visualizer/trees/bst/avl" },
  ]},
  { title: "Traversal", desc: "Pre-order, in-order, post-order, and level-order traversals", links: [
    { name: "Pre-order", path: "/visualizer/trees/traversal/pre-order" },
    { name: "In-order", path: "/visualizer/trees/traversal/in-order" },
    { name: "Post-order", path: "/visualizer/trees/traversal/post-order" },
    { name: "Level-order (BFS)", path: "/visualizer/trees/traversal/level-order" },
  ]},
  { title: "Algorithms", desc: "Advanced tree algorithms like LCA and diameter", links: [
    { name: "Lowest Common Ancestor", path: "/visualizer/trees/algorithms/lca" },
    { name: "Tree Diameter", path: "/visualizer/trees/algorithms/diameter" },
  ]},
];

export default function Page() {
  return (
    <>
      <div><Navbar /></div>
      <div className="py-20 bg-white dark:bg-[#0f0f0f] text-[#1a1a1a] dark:text-[#f5f5f5] min-h-screen">
        <section className="px-6 md:px-12 max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="uppercase tracking-wide bg-[#f0fdf4] text-[#16a34a] border border-[#bbf7d0] px-4 py-1 mb-4 rounded-full text-sm font-semibold inline-block">
              Tree Data Structures
            </p>
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#1a1a1a] dark:text-white mb-4">
              Trees
            </h1>
            <p className="text-lg text-[#6b7280] dark:text-[#9ca3af] max-w-2xl mx-auto">
              Hierarchical data structures with root, nodes, and edges. Each node has parent/child relationships.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cards.map((section) => (
              <div key={section.title} className="border border-[#e5e7eb] dark:border-[#333] rounded-xl p-6 bg-white dark:bg-[#1a1a1a]">
                <h2 className="text-xl font-bold text-[#1a1a1a] dark:text-white mb-2">{section.title}</h2>
                <p className="text-sm text-[#6b7280] dark:text-[#9ca3af] mb-4">{section.desc}</p>
                <div className="space-y-2">
                  {section.links.map((link) => (
                    <Link key={link.path} href={link.path}
                      className="block px-4 py-2 rounded-lg bg-[#f9fafb] dark:bg-[#222] hover:bg-[#f0fdf4] dark:hover:bg-[#1a3a1a] border border-[#e5e7eb] dark:border-[#333] text-[#1a1a1a] dark:text-[#f5f5f5] transition-colors">
                      {link.name}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
      <BackToTopButton />
      <Footer />
    </>
  );
}
