import Link from "next/link";
import RecentlyViewed from "@/app/components/ui/RecentlyViewed";

export default function RecentlyViewedPage() {
  return (
    <main className="min-h-screen px-6 pt-28 py-12">
      <div className="max-w-4xl mx-auto">
        
        <h1 className="text-3xl font-bold mb-8">
          Recently Viewed Topics
        </h1>
        <RecentlyViewed />
        
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border mb-6"
        >
          ← Return Home
        </Link>
        
      </div>
    </main>
  );
}