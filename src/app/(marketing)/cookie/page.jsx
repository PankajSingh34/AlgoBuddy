import CookiePolicyContent from "@/app/components/CookiePolicyContent";

export const metadata = {
  title: "Cookies Policy | AlgoBuddy",
  description: "Cookie policy for AlgoBuddy.",
};

export default function CookiesPage() {
  return (
    <main className="min-h-screen">
      <CookiePolicyContent />
    </main>
  );
}