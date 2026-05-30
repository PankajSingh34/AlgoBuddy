import { notFound } from "next/navigation";
import { sections } from "@/lib/visualizerSections";
import Footer from "@/app/components/footer";
import BackToTop from "@/app/components/ui/backtotop";
import CategoryClient from "../[category]/CategoryClient";

export async function generateMetadata() {
  const section = sections.find((s) => s.slug === "recursion");
  if (!section) return {};

  return {
    title: `${section.title} Visualizer | AlgoBuddy`,
    description: `Interactive visualizations for ${section.title} — ${section.desc}. Learn DSA step by step with AlgoBuddy.`,
    keywords: [section.title, "DSA Visualizer", "AlgoBuddy", "Algorithm", "Data Structures"],
    robots: "index, follow",
  };
}

export default function CategoryPage() {
  const section = sections.find((s) => s.slug === "recursion");

  if (!section) notFound();

  return (
    <div
      className="min-h-screen bg-white dark:bg-[#1c1d1f] text-gray-800 dark:text-gray-200 flex flex-col"
      style={{ fontFamily: "'Inter', 'Source Sans 3', sans-serif" }}
    >
      <main className="flex-1 max-w-[1100px] w-full mx-auto px-5 pt-24 pb-20">
        <CategoryClient section={section} />
      </main>
      <BackToTop />
      <Footer />
    </div>
  );
}
