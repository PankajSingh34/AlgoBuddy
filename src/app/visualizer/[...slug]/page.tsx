import { notFound } from "next/navigation";
import { algorithmRegistry } from "@/config/algorithms";
import { sections } from "@/lib/visualizerSections";
import CategoryClient from "@/components/visualizer/CategoryClient";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import BackToTop from "@/components/ui/backtotop";
import Footer from "@/components/layout/Footer";
import React from "react";

interface PageProps {
  params: Promise<{
    slug: string[];
  }>;
}

export async function generateStaticParams() {
  const params: { slug: string[] }[] = [];
  
  // Category slugs
  sections.forEach(s => params.push({ slug: [s.slug] }));
  
  // Algorithm slugs
  Object.keys(algorithmRegistry).forEach(slugKey => {
    params.push({ slug: slugKey.split('/') });
  });
  
  return params;
}

export async function generateMetadata({ params }: PageProps) {
  const resolvedParams = await params;
  const slugArray = resolvedParams.slug;
  
  if (slugArray.length === 1) {
    const section = sections.find((s) => s.slug === slugArray[0]);
    if (section) {
      return {
        title: `${section.title} Visualizer | AlgoBuddy`,
        description: `Interactive visualizations for ${section.title}.`,
      };
    }
  } else {
    const slugKey = slugArray.join('/');
    const algo = (algorithmRegistry as Record<string, any>)[slugKey];
    if (algo) {
      return algo.metadata;
    }
  }
  return {};
}

export default async function DynamicRouterPage({ params }: PageProps) {
  const resolvedParams = await params;
  const slugArray = resolvedParams.slug;
  
  // 1. Handle Category Index Page (/visualizer/[category])
  if (slugArray.length === 1) {
    const section = sections.find((s) => s.slug === slugArray[0]);
    if (!section) notFound();
    
    return (
      <div className="min-h-screen bg-white dark:bg-[#1c1d1f] text-[#1a1a1a] dark:text-[#f5f5f5] flex flex-col">
        <div className="w-full px-6 md:px-12 pt-6">
          <div className="mb-4 mt-2">
            <Breadcrumbs paths={[
              { name: "Home", href: "/" },
              { name: "Visualizer", href: "/visualizer" },
              { name: section.title }
            ]} />
          </div>
        </div>
        <main className="flex-1 max-w-[1100px] w-full mx-auto px-5 pt-4 pb-20">
          <CategoryClient section={section} />
        </main>
        <BackToTop />
        <Footer />
      </div>
    );
  }
  
  // 2. Handle Algorithm Page (/visualizer/array/linearsearch or deeper)
  const slugKey = slugArray.join('/');
  const algo = (algorithmRegistry as Record<string, any>)[slugKey];
  if (!algo) notFound();
  
  const AlgorithmComponent = algo.component;
  return <AlgorithmComponent />;
}
