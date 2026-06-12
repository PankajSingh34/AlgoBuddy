"use client";
import PrivacyPolicyContent from "@/app/components/PrivacyPolicyContent";
import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-udemy-bg dark:bg-udemy-dark-bg">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-udemy-border dark:border-udemy-dark-border text-udemy-text dark:text-udemy-dark-text hover:bg-udemy-surface dark:hover:bg-udemy-dark-surface transition-colors mb-6"
        >
          ← Return Home
        </Link>

        <PrivacyPolicyContent />
      </div>
    </main>
  );
}