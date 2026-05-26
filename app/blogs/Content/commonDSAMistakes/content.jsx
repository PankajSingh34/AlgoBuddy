"use client";
import { FiCopy, FiBookmark, FiShare2 } from "react-icons/fi";
import { useState } from "react";

const BlogContent = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const introParagraphs = [
    `Learning Data Structures and Algorithms (DSA) can feel overwhelming for beginners. Many students start with excitement but quickly become frustrated because of common learning mistakes.`,

    `The good news is that these mistakes are completely normal and can be fixed with the right mindset, proper guidance, and consistent practice.`,

    `In this article, we'll discuss some of the most common mistakes beginners make while learning DSA and how you can avoid them effectively.`,
  ];

  const mistakes = [
    {
      title: "Memorizing Solutions Instead of Understanding Logic",
      description:
        "Many beginners try to memorize coding solutions line by line. While this may help temporarily, it does not improve real problem-solving skills. Focus on understanding why the solution works instead of blindly copying code.",
    },
    {
      title: "Ignoring Time Complexity",
      description:
        "Writing working code is important, but writing efficient code matters too. Beginners often ignore time complexity and end up creating slow solutions. Learning Big-O notation early helps you think more efficiently.",
    },
    {
      title: "Not Practicing Consistently",
      description:
        "DSA is a skill that improves with regular practice. Solving problems only once in a while makes it difficult to build pattern recognition and confidence.",
    },
    {
      title: "Skipping Dry Runs",
      description:
        "Dry running helps you understand how an algorithm works step by step. Beginners who skip this process often struggle with debugging and logic building.",
    },
    {
      title: "Fear of Debugging",
      description:
        "Errors and bugs are a normal part of programming. Instead of getting frustrated, treat debugging as a learning opportunity that helps improve your understanding.",
    },
  ];

  const tips = [
    { point: "Focus on understanding patterns instead of memorizing code" },
    { point: "Practice consistently, even if it's just 1 problem daily" },
    { point: "Analyze time and space complexity for every solution" },
    { point: "Use visualizers and dry runs to strengthen concepts" },
    { point: "Be patient — improvement takes time and repetition" },
  ];

  return (
    <article className="max-w-4xl mx-auto px-4 pt-14 py-10">
      {/* Article Header */}
      <header className="mb-12 pt-14">
        <div className="flex items-center justify-between mb-4">
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-black text-white dark:bg-zinc-700 dark:text-zinc-200">
            DSA Learning
          </span>

          <div className="flex space-x-3 text-gray-500 dark:text-zinc-400">
            <button
              onClick={handleCopy}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
              aria-label="Copy link"
            >
              {copied ? <span className="text-xs">Copied!</span> : <FiCopy />}
            </button>

            <button
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
              aria-label="Bookmark"
            >
              <FiBookmark />
            </button>

            <button
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
              aria-label="Share"
            >
              <FiShare2 />
            </button>
          </div>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-black dark:text-zinc-100 mb-4 leading-tight">
          Common Mistakes Beginners Make While Learning DSA
        </h1>

        <div className="flex items-center text-gray-500 dark:text-zinc-400 text-sm">
          <span>Published on May 26, 2025</span>
          <span className="mx-2">•</span>
          <span>7 min read</span>
        </div>
      </header>

      {/* Featured Image */}
      <div className="relative w-full h-64 md:h-96 bg-gray-100 dark:bg-zinc-800 rounded-xl mb-12 overflow-hidden">
        <img
          src="/blog/commonDSAMistakes.png"
          alt="Common mistakes beginners make while learning DSA"
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent opacity-30 dark:opacity-50"></div>

        <div className="absolute bottom-6 left-6 text-white dark:text-zinc-100">
          <p className="text-sm">
            Learn smarter and avoid common DSA learning mistakes
          </p>
        </div>
      </div>

      {/* Article Content */}
      <div className="prose prose-lg dark:prose-invert max-w-none">
        {introParagraphs.map((paragraph, index) => (
          <p
            key={index}
            className="text-lg text-gray-700 dark:text-zinc-300 leading-relaxed mb-8"
          >
            {paragraph}
          </p>
        ))}

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-black dark:text-zinc-100 mb-6 pb-2 border-b border-gray-200 dark:border-zinc-700">
            Common Mistakes
          </h2>

          <div className="space-y-8">
            {mistakes.map((mistake, index) => (
              <div
                key={index}
                className="border dark:border-zinc-700 p-6 rounded-lg hover:shadow-md dark:hover:shadow-zinc-700/30 transition-shadow"
              >
                <h3 className="font-bold text-xl mb-3 dark:text-zinc-100">
                  {mistake.title}
                </h3>

                <p className="text-gray-600 dark:text-zinc-400">
                  {mistake.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-black dark:bg-zinc-800 text-white dark:text-white p-8 rounded-xl mb-12">
          <h3 className="text-xl font-bold mb-4">
            Tips to Improve Faster
          </h3>

          <ul className="list-disc pl-6 space-y-2">
            {tips.map((tip, index) => (
              <li key={index}>{tip.point}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-black dark:text-zinc-100 mb-4">
            Final Thoughts
          </h2>

          <p className="text-lg dark:text-zinc-300">
            DSA is not about solving hundreds of problems blindly. It is about
            building logical thinking and learning how to approach problems
            efficiently. Everyone struggles at the beginning, so don't be afraid
            of mistakes. Stay consistent, keep practicing, and focus on
            understanding concepts deeply.
          </p>
        </section>
      </div>

      {/* Footer */}
      <footer className="mt-16 pt-8 border-t border-gray-200 dark:border-zinc-700">
        <div className="flex flex-wrap justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="font-bold text-black dark:text-zinc-100 mb-2">
              Share this article
            </h3>

            <div className="flex space-x-3">
              {["Twitter", "LinkedIn", "Facebook"].map((social) => (
                <button
                  key={social}
                  className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors dark:border-zinc-600 dark:text-zinc-300"
                >
                  {social}
                </button>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </article>
  );
};

export default BlogContent;