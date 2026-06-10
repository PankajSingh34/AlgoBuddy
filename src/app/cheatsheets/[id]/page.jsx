import CheatsheetDetail from "@/app/components/cheatsheets/CheatsheetDetail";
import Footer from "@/app/components/footer";
import {
  allCheatsheets,
  getCheatsheetById,
} from "@/app/components/cheatsheets/data";

export const dynamic = "force-static";

export async function generateStaticParams() {
  return allCheatsheets.map((c) => ({
    id: c.id,
  }));
}

export async function generateMetadata({ params }) {
  const id = params?.id;
  const cheatsheet = getCheatsheetById(id);

  if (!cheatsheet) {
    return {
      title: "Cheatsheet Not Found | AlgoBuddy",
      description: "The requested cheatsheet does not exist.",
    };
  }

  return {
    title: `${cheatsheet.title} Cheatsheet | AlgoBuddy`,
    description: `${cheatsheet.title} — ${
      cheatsheet.whenToUse || ""
    } Time complexity: ${cheatsheet.timeComplexity?.average || ""}, Space: ${
      cheatsheet.spaceComplexity || ""
    }.`,
  };
}

export default function CheatsheetPage({ params }) {
  const id = params?.id;
  const cheatsheet = getCheatsheetById(id);

  // ✅ Proper fallback UI (this is what you were missing)
  if (!cheatsheet) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center text-center px-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Cheatsheet not found
          </h1>
          <a
            href="/cheatsheets"
            className="text-[#a435f0] hover:text-[#c084fc] transition-colors"
          >
            ← Back to cheatsheets
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <main className="container-app section-app">
        <CheatsheetDetail cheatsheet={cheatsheet} />
      </main>
      <Footer />
    </div>
  );
}
