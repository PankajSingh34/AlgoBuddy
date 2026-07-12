import CategoryClient from "@/app/visualizer/components/CategoryClient";
import { sections } from "@/lib/visualizerSections";
import Footer from "@/app/components/footer";
import Breadcrumbs from "@/app/components/ui/Breadcrumbs";

export default function Page() {
  const section = sections.find((s) => s.slug === "string");

  return (
    <div className="min-h-screen bg-white dark:bg-[#1c1d1f]">
      <div className="px-6 md:px-12 pt-6">
        <Breadcrumbs
          paths={[
            { name: "Home", href: "/" },
            { name: "Visualizer", href: "/visualizer" },
            { name: "String" },
          ]}
        />
      </div>

      <main className="max-w-[1100px] mx-auto px-5 pt-4 pb-20">
        <CategoryClient section={section} />
      </main>

      <Footer />
    </div>
  );
}