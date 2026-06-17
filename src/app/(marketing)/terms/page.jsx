import TermsOfServiceContent from "@/app/components/TermsOfServiceContent";

export const metadata = {
  title: "Terms of Service | AlgoBuddy",
  description: "Terms and conditions for using AlgoBuddy.",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen">
      <TermsOfServiceContent />
    </main>
  );
}