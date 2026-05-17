"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center container-app text-center">
      <div className="space-y-4">
        <p className="font-mono text-8xl font-bold text-[hsl(var(--primary)/0.2)] select-none">
          404
        </p>
        <h1 className="font-display text-3xl font-bold text-[hsl(var(--text))]">
          Page not found
        </h1>
        <p className="text-[hsl(var(--text-muted))] font-body">
          This route doesn&apos;t exist. Check the URL or head back home.
        </p>
        <Link href="/" className="inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors h-9 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/80 mt-4">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
