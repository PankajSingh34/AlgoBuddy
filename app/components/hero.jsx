"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { event } from "@/lib/gtag";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } }
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } }
};

const HeroSection = () => {
  const handleStart = () => {
    event({
      action: "click_start_visualizing",
      category: "Hero",
      label: "Start Visualizing Button",
    });
  };

  return (
    <section className="section container-app text-center min-h-[calc(100vh-4rem)] flex items-center justify-center relative overflow-hidden">
      <motion.div variants={container} initial="hidden" animate="show" className="relative z-10 w-full">
        <motion.div variants={item}>
          <Badge className="mb-6 bg-[hsl(var(--primary-subtle))] text-[hsl(var(--primary))] border-[hsl(var(--primary)/0.2)]">
            Open Source &middot; Learn Visually
          </Badge>
        </motion.div>

        <motion.h1 variants={item} className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[hsl(var(--text))]">
          Learn Algorithms,{' '}
          <span className="text-[hsl(var(--primary))]">Visually.</span>
        </motion.h1>

        <motion.p variants={item} className="mt-6 text-base sm:text-lg text-[hsl(var(--text-muted))] max-w-2xl mx-auto font-body">
          Interactive visualizations for DSA concepts. Watch algorithms run step by step,<br className="hidden sm:block" />
          built for students, by students.
        </motion.p>

        <motion.div variants={item} className="mt-10 flex flex-wrap justify-center gap-4">
          <Link href="/visualizer" onClick={handleStart}>
            <Button size="lg" className="shadow-glow">
              Start Visualizing
            </Button>
          </Link>
          <Link href="/blogs">
            <Button size="lg" variant="outline">
              Browse Algorithms
            </Button>
          </Link>
        </motion.div>
      </motion.div>

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-[hsl(var(--primary)/0.05)] blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-[hsl(var(--accent)/0.05)] blur-3xl" />
      </div>
    </section>
  );
};

export default HeroSection;
