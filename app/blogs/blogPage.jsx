"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { CalendarDays, Clock, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PopularTopics from "@/app/blogs/components/PopularTopics";
import blogData from "@/app/blogs/data/blogs.json";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const BlogPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const searchRef = useRef(null);

  const filteredBlogs = blogData.filter((blog) => {
    const matchesSearch =
      searchQuery === "" ||
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );
    const matchesCategory =
      activeCategory === "All" || blog.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ["All", ...new Set(blogData.map((blog) => blog.category))];

  const featuredPosts = [...blogData]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 4);

  const popularTags = [
    "React", "JavaScript", "CSS", "TypeScript", "Web Dev", "Performance", "DSA",
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchQuery("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-[hsl(var(--bg))]">
      <main className="section container-app">
        <section className="mb-20 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="font-display text-4xl md:text-5xl font-bold text-[hsl(var(--text))] mb-4 leading-tight"
          >
            Insights for{" "}
            <span className="text-[hsl(var(--primary))]">
              Modern Developers
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg text-[hsl(var(--text-muted))] max-w-3xl mx-auto mb-10 font-body"
          >
            Tutorials, guides, and deep dives on web development and DSA.
          </motion.p>
        </section>

        {/* Featured Posts */}
        <section className="mb-20">
          <h2 className="font-display text-2xl font-semibold text-[hsl(var(--text))] mb-6">
            Featured Articles
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <motion.div
              key={featuredPosts[0]?.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              whileHover={{ y: -4 }}
              className="col-span-12 lg:col-span-6"
            >
              <Link href={featuredPosts[0]?.slug}>
                <Card className="h-full overflow-hidden card-interactive p-0">
                  <div className="relative h-64 w-full overflow-hidden">
                    <img
                      src={featuredPosts[0]?.image}
                      alt={featuredPosts[0]?.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    <Badge className="absolute top-4 right-4 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]">
                      {featuredPosts[0]?.category}
                    </Badge>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center text-sm text-[hsl(var(--text-muted))] mb-3 font-body">
                      <CalendarDays className="mr-1.5 size-4" />
                      <span className="mr-3">{featuredPosts[0]?.date}</span>
                      <Clock className="mr-1.5 size-4" />
                      <span>{featuredPosts[0]?.readTime}</span>
                    </div>
                    <h3 className="font-display text-xl font-bold text-[hsl(var(--text))] mb-2 group-hover:text-[hsl(var(--primary))] transition-colors">
                      {featuredPosts[0]?.title}
                    </h3>
                    <p className="text-[hsl(var(--text-muted))] mb-4 line-clamp-3 font-body text-sm">
                      {featuredPosts[0]?.excerpt}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {featuredPosts[0]?.tags.map((tag, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>

            <div className="col-span-12 lg:col-span-6 flex flex-col gap-6">
              {featuredPosts.slice(1, 5).map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -2 }}
                >
                  <Link href={post.slug}>
                    <Card className="flex gap-4 items-start p-4 card-interactive">
                      <div className="w-32 h-24 flex-shrink-0 overflow-hidden rounded-md">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center text-sm text-[hsl(var(--text-muted))] mb-1 font-body">
                          <CalendarDays className="mr-1.5 size-3.5" />
                          <span className="mr-3">{post.date}</span>
                          <Clock className="mr-1.5 size-3.5" />
                          <span>{post.readTime}</span>
                        </div>
                        <h3 className="font-display text-base font-semibold text-[hsl(var(--text))] mb-1 truncate">
                          {post.title}
                        </h3>
                        <p className="text-sm text-[hsl(var(--text-muted))] line-clamp-2 font-body">
                          {post.excerpt}
                        </p>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <PopularTopics
          tags={popularTags}
          onTagClick={(tag) => {
            setSearchQuery(tag);
            setActiveCategory("All");
          }}
        />

        <section className="mb-12">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeCategory === category
                    ? "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] shadow-glow"
                    : "bg-[hsl(var(--surface))] text-[hsl(var(--text-muted))] hover:text-[hsl(var(--text))] border border-[hsl(var(--border))]"
                }`}
              >
                {category}
                {category !== "All" &&
                  ` (${blogData.filter((b) => b.category === category).length})`}
              </button>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-[hsl(var(--text))] mb-8">
            {activeCategory === "All" ? "All Blog Posts" : activeCategory}
            <span className="text-[hsl(var(--text-muted))] text-base font-normal ml-2 font-body">
              ({filteredBlogs.length} articles)
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBlogs.length > 0 ? (
              filteredBlogs.map((post) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ y: -3 }}
                >
                  <Link href={post.slug}>
                    <Card className="h-full overflow-hidden card-interactive p-0">
                      <div className="aspect-video overflow-hidden relative">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        />
                      </div>
                      <div className="p-5 flex flex-col gap-3">
                        <div className="flex items-center justify-between text-sm text-[hsl(var(--text-muted))] font-body">
                          <div className="flex items-center">
                            <CalendarDays className="mr-1.5 size-3.5" />
                            <span>{post.date}</span>
                          </div>
                          <span className="text-[hsl(var(--primary))] flex items-center font-medium text-xs">
                            Read <ArrowRight className="ml-1 size-3" />
                          </span>
                        </div>
                        <Badge variant="secondary" className="w-fit text-xs">
                          {post.category}
                        </Badge>
                        <h3 className="font-display text-base font-bold text-[hsl(var(--text))] line-clamp-2">
                          {post.title}
                        </h3>
                        <div className="flex flex-wrap gap-1.5 mt-auto">
                          {post.tags.map((tag, i) => (
                            <Badge
                              key={i}
                              variant="outline"
                              className="text-[10px] cursor-pointer hover:bg-[hsl(var(--primary-subtle))] hover:text-[hsl(var(--primary))] transition-colors"
                            >
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center py-24 text-center">
                <div className="w-16 h-16 rounded-2xl bg-[hsl(var(--primary-subtle))] flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-[hsl(var(--primary))]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="font-display text-xl font-semibold text-[hsl(var(--text))]">No articles found</h3>
                <p className="text-[hsl(var(--text-muted))] mt-2 max-w-sm font-body">
                  We couldn&apos;t find any articles matching your search.
                </p>
                <Button
                  variant="outline"
                  className="mt-6"
                  onClick={() => {
                    setSearchQuery("");
                    setActiveCategory("All");
                  }}
                >
                  Clear filters
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default BlogPage;
