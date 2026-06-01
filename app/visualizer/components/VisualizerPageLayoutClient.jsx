"use client";

import { useEffect, useRef, useState } from "react";
import Footer from "@/app/components/footer";
import BackToTop from "@/app/components/ui/backtotop";
import Breadcrumbs from "@/app/components/ui/Breadcrumbs";
import ReadingTime from "@/app/components/ui/ReadingTime";
import VisualizerSessionControls from "./VisualizerSessionControls";

function VisualizerPageSection({ children, className }) {
  if (!children) {
    return null;
  }

  return <section className={className}>{children}</section>;
}

export default function VisualizerPageLayoutClient({
  paths,
  title,
  headerDescription,
  headerActions,
  animation,
  content,
  code,
  quiz,
  moduleCard,
  exploreOther,
  extraSections = [],
  animationSectionClassName = "px-6",
  contentSectionClassName = "px-6 md:px-12",
  codeSectionClassName = "px-6",
  quizSectionClassName = "px-6",
  moduleSectionClassName = "px-6 md:px-12 my-12",
  exploreSectionClassName = "px-6",
}) {
  const [mounted, setMounted] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <>
      <div className="min-h-screen bg-[#fafafa] dark:bg-black">
        <div className="max-w-6xl mx-auto py-8">
          <Breadcrumbs paths={paths} />

          <div className="my-8 md:my-12">
            <h1 className="text-4xl md:text-5xl font-bold text-[#1a1a1a] dark:text-white mb-4">
              {title}
            </h1>
            <ReadingTime targetRef={contentRef} />
            {headerDescription && (
              <p className="text-lg text-[#6b7280] dark:text-[#9ca3af]">
                {headerDescription}
              </p>
            )}
            {headerActions && <div className="mt-4">{headerActions}</div>}
          </div>

          <VisualizerPageSection className={`my-8 md:my-12 ${animationSectionClassName}`}>
            {animation}
          </VisualizerPageSection>

          <VisualizerSessionControls />

          <VisualizerPageSection className={`my-8 md:my-12 ${contentSectionClassName}`}>
            <div ref={contentRef}>{content}</div>
          </VisualizerPageSection>

          <VisualizerPageSection className={`my-8 md:my-12 ${codeSectionClassName}`}>
            {code}
          </VisualizerPageSection>

          <VisualizerPageSection className={`my-8 md:my-12 ${quizSectionClassName}`}>
            {quiz}
          </VisualizerPageSection>

          <VisualizerPageSection className={moduleSectionClassName}>
            {moduleCard}
          </VisualizerPageSection>

          <VisualizerPageSection className={exploreSectionClassName}>
            {exploreOther}
          </VisualizerPageSection>

          {extraSections.map((section, index) => (
            <VisualizerPageSection key={index} className={section.className}>
              {section.content}
            </VisualizerPageSection>
          ))}
        </div>
      </div>

      <Footer />
      <BackToTop />
    </>
  );
}
