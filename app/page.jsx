import Navbar from "@/app/components/navbar";
import Hero from "@/app/components/hero";
import ConceptsSection from "@/app/components/ConceptsSection";
import PersonalizedSection from "@/app/components/PersonalizedSection";
import Footer from "@/app/components/footer";
import { PageWrapper } from "@/app/components/ui/PageWrapper";

export const metadata = {
  title: "AlgoBuddy | Visualize & Learn DSA the Smart Way",
  description:
    "Master Data Structures and Algorithms with interactive visualizations. Perfect for students, beginners, and interview prep. Visualize Stack, Queue, Tree, Graph, Sorting & more.",
  robots: "index, follow",
};

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <PageWrapper>
        <Hero />
        <PersonalizedSection />
        <ConceptsSection />
        <Footer />
      </PageWrapper>
    </div>
  );
}
