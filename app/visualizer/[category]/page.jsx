import { notFound } from "next/navigation";
import { sections } from "@/lib/visualizerSections";
import Footer from "@/app/components/footer";
import BackToTop from "@/app/components/ui/backtotop";
import Breadcrumbs from "@/app/components/ui/Breadcrumbs";
import CategoryClient from "./CategoryClient";

// Pre-render all category pages at build time for SEO
export async function generateStaticParams() {
  return sections.map((section) => ({
    category: section.slug,
  }));
}

// Dynamic metadata per category
export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const section = sections.find((s) => s.slug === resolvedParams.category);
  if (!section) return {};

  return {
    title: `${section.title} Visualizer | AlgoBuddy`,
    description: `Interactive visualizations for ${section.title} — ${section.desc}. Learn DSA step by step with AlgoBuddy.`,
    keywords: [section.title, "DSA Visualizer", "AlgoBuddy", "Algorithm", "Data Structures"],
    robots: "index, follow",
  };
}

export default async function CategoryPage({ params }) {
  const resolvedParams = await params;
  const section = sections.find((s) => s.slug === resolvedParams.category);

  // Return 404 for unknown category slugs
  if (!section) notFound();

  return (
    <div
      className="min-h-screen bg-white dark:bg-[#1c1d1f] text-[#1a1a1a] dark:text-[#f5f5f5] flex flex-col"
    >
      <div className="w-full px-6 md:px-12 pt-6">
        <div className="mb-4 mt-2">
          <Breadcrumbs paths={[
            { name: "Home", href: "/" },
            { name: "Visualizer", href: "/visualizer" },
            { name: section.title }
          ]} />
        </div>
      </div>

      <main className="flex-1 max-w-[1100px] w-full mx-auto px-5 pt-4 pb-20">
        <CategoryClient section={section} />
      </main>

      <BackToTop />
      <Footer />
    </div>
  );
}

