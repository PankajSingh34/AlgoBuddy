import CheatsheetsIndex from "@/app/components/cheatsheets/index";
import Footer from "@/app/components/footer";

export const metadata = {
  title: "DSA Cheatsheets | AlgoBuddy",
  description:
    "Comprehensive DSA cheatsheets covering sorting, searching, trees, graphs, linked lists, stacks, queues, hashmaps, recursion, and more. Includes time/space complexity, code snippets, and algorithm steps.",
};

export default function CheatsheetsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <main className="container-app section-app">
        <div className="mx-auto max-w-6xl">
          <CheatsheetsIndex />
        </div>
      </main>
      <Footer />
    </div>
  );
}
