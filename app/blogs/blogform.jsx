"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  PenSquare,
  User,
  Mail,
  BookOpen,
  Tag,
  FileText,
  Eye,
  Send,
  Link as LinkIcon,
} from "lucide-react";

const BlogFormPage = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    title: "",
    category: "",
    description: "",
    content: "",
    experience: "",
    references: "",
  });

  const [showPreview, setShowPreview] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [errors, setErrors] = useState({});

  // Validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    ) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.title.trim()) {
      newErrors.title = "Blog title is required";
    }

    if (!formData.content.trim()) {
      newErrors.content = "Blog content is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setErrors({
      ...errors,
      [e.target.name]: "",
    });
  };

  // Handle Submit
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    console.log("Blog Submitted:", formData);

    setSubmitted(true);

    setFormData({
      fullName: "",
      email: "",
      title: "",
      category: "",
      description: "",
      content: "",
      experience: "",
      references: "",
    });

    setTimeout(() => {
      setSubmitted(false);
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 to-surface-100 dark:from-surface-900 dark:to-surface-950 py-28 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6">
            <PenSquare className="h-8 w-8 text-primary" />
          </div>

          <h1 className="text-5xl font-bold text-surface-800 dark:text-white mb-4">
            Submit Your Blog
          </h1>

          <p className="text-lg text-surface-600 dark:text-surface-300 max-w-2xl mx-auto">
            Share your technical ideas, tutorials, and development experiences
            with the AlgoBuddy community.
          </p>
        </motion.div>

        {/* Success Message */}
        {submitted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-8 p-4 rounded-xl bg-green-100 text-green-700 border border-green-300"
          >
            Blog submitted successfully! Our team will review your submission
            shortly.
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* FORM SECTION */}
          <motion.form
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onSubmit={handleSubmit}
            className="bg-white dark:bg-surface-800 rounded-3xl p-8 shadow-xl border border-surface-200 dark:border-surface-700"
          >
            <div className="space-y-6">
              {/* Full Name */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium mb-2 text-surface-700 dark:text-surface-300">
                  <User className="h-4 w-4" />
                  Full Name *
                </label>

                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 rounded-xl border border-surface-300 dark:border-surface-700 bg-transparent text-surface-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                />

                {errors.fullName && (
                  <p className="text-sm text-red-500 mt-1">{errors.fullName}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium mb-2 text-surface-700 dark:text-surface-300">
                  <Mail className="h-4 w-4" />
                  Email Address *
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email address"
                  className="w-full px-4 py-3 rounded-xl border border-surface-300 dark:border-surface-700 bg-transparent text-surface-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                />

                {errors.email && (
                  <p className="text-sm text-red-500 mt-1">{errors.email}</p>
                )}
              </div>

              {/* Blog Title */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium mb-2 text-surface-700 dark:text-surface-300">
                  <BookOpen className="h-4 w-4" />
                  Blog Title *
                </label>

                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter blog title"
                  className="w-full px-4 py-3 rounded-xl border border-surface-300 dark:border-surface-700 bg-transparent text-surface-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                />

                {errors.title && (
                  <p className="text-sm text-red-500 mt-1">{errors.title}</p>
                )}
              </div>

              {/* Category */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium mb-2 text-surface-700 dark:text-surface-300">
                  <Tag className="h-4 w-4" />
                  Blog Category / Tags
                </label>

                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="React, DSA, AI, Web Dev..."
                  className="w-full px-4 py-3 rounded-xl border border-surface-300 dark:border-surface-700 bg-transparent text-surface-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Description */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium mb-2 text-surface-700 dark:text-surface-300">
                  <FileText className="h-4 w-4" />
                  Short Description
                </label>

                <textarea
                  rows={3}
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Write a short description of your blog idea..."
                  className="w-full px-4 py-3 rounded-xl border border-surface-300 dark:border-surface-700 bg-transparent text-surface-800 dark:text-white resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Blog Content */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium mb-2 text-surface-700 dark:text-surface-300">
                  <PenSquare className="h-4 w-4" />
                  Blog Content / Markdown *
                </label>

                <textarea
                  rows={10}
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  placeholder="# Start writing your markdown blog..."
                  className="w-full px-4 py-3 rounded-xl border border-surface-300 dark:border-surface-700 bg-transparent text-surface-800 dark:text-white font-mono resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                />

                {errors.content && (
                  <p className="text-sm text-red-500 mt-1">{errors.content}</p>
                )}
              </div>

              {/* Experience Level */}
              <div>
                <label className="block text-sm font-medium mb-2 text-surface-700 dark:text-surface-300">
                  Experience Level (Optional)
                </label>

                <select
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-surface-300 dark:border-surface-700 bg-transparent text-surface-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select level</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              {/* References */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium mb-2 text-surface-700 dark:text-surface-300">
                  <LinkIcon className="h-4 w-4" />
                  References / Resources
                </label>

                <textarea
                  rows={3}
                  name="references"
                  value={formData.references}
                  onChange={handleChange}
                  placeholder="Add useful resources or links..."
                  className="w-full px-4 py-3 rounded-xl border border-surface-300 dark:border-surface-700 bg-transparent text-surface-800 dark:text-white resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPreview(!showPreview)}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl border border-surface-300 dark:border-surface-700 hover:bg-surface-100 dark:hover:bg-surface-700 transition"
                >
                  <Eye className="h-4 w-4" />

                  {showPreview ? "Hide Preview" : "Preview"}
                </button>

                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-primary-dark text-white hover:opacity-90 transition"
                >
                  <Send className="h-4 w-4" />
                  Submit Blog
                </button>
              </div>
            </div>
          </motion.form>

          {/* PREVIEW SECTION */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-surface-800 rounded-3xl p-8 shadow-xl border border-surface-200 dark:border-surface-700 overflow-auto"
          >
            <h2 className="text-2xl font-bold mb-6 text-surface-800 dark:text-white">
              Live Preview
            </h2>

            {showPreview ? (
              <div className="space-y-5">
                <div>
                  <span className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary">
                    {formData.category || "Category"}
                  </span>
                </div>

                <h1 className="text-4xl font-bold text-surface-800 dark:text-white">
                  {formData.title || "Your Blog Title"}
                </h1>

                <p className="text-surface-600 dark:text-surface-300">
                  {formData.description ||
                    "Your blog description will appear here..."}
                </p>

                <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap text-surface-700 dark:text-surface-300">
                  {formData.content ||
                    "Your markdown/blog content preview will appear here..."}
                </div>

                {formData.references && (
                  <div className="pt-4 border-t border-surface-200 dark:border-surface-700">
                    <h3 className="font-semibold text-surface-800 dark:text-white mb-2">
                      References
                    </h3>

                    <p className="text-surface-600 dark:text-surface-300 whitespace-pre-wrap">
                      {formData.references}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full min-h-[350px] flex items-center justify-center text-surface-400">
                Click Preview to see your blog rendering.
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default BlogFormPage;
