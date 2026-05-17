import Navbar from "@/app/components/navbar";
import Footer from '@/app/components/footer';
import BackToTopButton from '@/app/components/ui/backtotop';
import Link from "next/link";

export const metadata = {
  title: "Binary Tree | AlgoBuddy",
  description: "A binary tree is a tree data structure in which each node has at most two children.",
};

const cards = [
  { title: "Structure & Properties", desc: "Understanding the structure and key properties of binary trees", links: [
    { name: "Structure & Properties", path: "/visualizer/trees/binaryTree/properties" },
  ]},
  { title: "Types of Binary Trees", desc: "Full, complete, perfect, balanced, and degenerate binary trees", links: [
    { name: "Types of Binary Trees", path: "/visualizer/trees/binaryTree/types" },
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
              Binary Tree
            </p>
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#1a1a1a] dark:text-white mb-4">
              Binary Tree
            </h1>
            <p className="text-lg text-[#6b7280] dark:text-[#9ca3af] max-w-2xl mx-auto">
              A binary tree is a tree data structure in which each node has at most two children.
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
