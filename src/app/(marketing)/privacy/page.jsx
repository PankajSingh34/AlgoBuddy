"use client";
import PrivacyPolicyContent from "@/app/components/PrivacyPolicyContent";
import Link from "next/link";
import Footer from "@/app/components/footer";


export default function PrivacyPage() {
  return (
    <main className="min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border mb-6"
        >
          ← Return Home
        </Link>

        <PrivacyPolicyContent />
      </div>
      <Footer/>
    </main>
  );
}