import CheatsheetDetail from "@/app/components/cheatsheets/CheatsheetDetail";
import Footer from "@/app/components/footer";
import { allCheatsheets, getCheatsheetById } from "@/app/components/cheatsheets/data";

export const dynamic = "force-static";

export async function generateStaticParams() {
  return allCheatsheets.map((c) => ({ id: c.id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;

  const cheatsheet = getCheatsheetById(id);

  if (!cheatsheet) {
    return {
      title: "Cheatsheet Not Found | AlgoBuddy",
    };
  }

  return {
    title: `${cheatsheet.title} Cheatsheet | AlgoBuddy`,
    description: `${cheatsheet.title} — ${cheatsheet.whenToUse || ""} Time complexity: ${cheatsheet.timeComplexity.average}, Space: ${cheatsheet.spaceComplexity}.`,
  };
}

import { notFound } from "next/navigation";

export default async function CheatsheetPage({ params }) {
  const { id } = await params;

  const cheatsheet = getCheatsheetById(id);

  if (!cheatsheet) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0f]">
      <main className="container-app section-app">
        <CheatsheetDetail cheatsheet={cheatsheet} />
      </main>
      <Footer />
    </div>
  );
}
