"use client";
import Navbar from "@/app/components/navbar";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import Footer from "@/app/components/footer";
import { PageWrapper } from "@/app/components/ui/PageWrapper";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen } from "lucide-react";

export default function Dashboard() {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchModules();
  }, []);

  async function fetchModules() {
    setLoading(true);
    const { data: modulesData, error: modulesError } = await supabase
      .from("modules")
      .select("*");

    if (modulesError) {
      console.error(modulesError);
      setLoading(false);
      return;
    }

    setModules(modulesData || []);
    setLoading(false);
  }

  return (
    <section className="min-h-screen">
      <Navbar />
      <PageWrapper>
        <main className="section container-app">
          <div className="mb-6">
            <h1 className="font-display text-2xl font-bold text-[hsl(var(--text))]">
              Dashboard
            </h1>
            <p className="text-[hsl(var(--text-muted))] text-sm mt-1 font-body">
              Explore all learning modules.
            </p>
          </div>

          <section>
            <h2 className="font-display text-xl font-semibold text-[hsl(var(--text))] mb-4">
              All Modules
            </h2>
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="p-4 space-y-3">
                    <Skeleton className="h-40 w-full rounded-md" />
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                  </Card>
                ))}
              </div>
            ) : modules.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {modules.map((mod) => (
                  <Card key={mod.id} className="p-4">
                    <img
                      src={`/modules/${mod.image}`}
                      alt={mod.title}
                      className="w-full h-40 object-cover rounded-md mb-3"
                    />
                    <CardTitle className="font-display text-base text-[hsl(var(--text))] mb-1">{mod.title}</CardTitle>
                    <CardDescription className="font-body text-sm mb-3">{mod.description}</CardDescription>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 rounded-2xl bg-[hsl(var(--primary-subtle))] flex items-center justify-center mb-4">
                  <BookOpen className="w-8 h-8 text-[hsl(var(--primary))]" />
                </div>
                <h3 className="font-display text-lg font-semibold text-[hsl(var(--text))]">
                  No modules yet
                </h3>
                <p className="text-[hsl(var(--text-muted))] text-sm mt-2 mb-6 font-body">
                  Check back later for new content.
                </p>
                <Link href="/visualizer">
                  <Button>Start Learning</Button>
                </Link>
              </div>
            )}
          </section>
        </main>
      </PageWrapper>
      <Footer />
    </section>
  );
}
