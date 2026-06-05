"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Footer from "@/app/components/footer";
import { HiUsers, HiChat, HiCode } from "react-icons/hi";

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const communityStats = [
  { icon: HiUsers, label: "Active Members", value: "---" },
  { icon: HiCode, label: "Problems Solved", value: "---" },
  { icon: HiChat, label: "Discussions", value: "---" },
];

export default function CommunityPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="min-h-screen bg-white dark:bg-neutral-900">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={mounted ? "visible" : "hidden"}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16"
      >
        <motion.div variants={itemVariants} className="mb-10">
          <h1 className="text-4xl font-bold text-surface-900 dark:text-white">
            Community
          </h1>
          <p className="mt-2 text-surface-500 dark:text-surface-400 text-lg">
            Connect, share, and grow with fellow DSA learners.
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          {communityStats.map((stat) => (
            <div
              key={stat.label}
              className="flex items-center gap-4 p-5 rounded-xl bg-surface-50 dark:bg-neutral-800 border border-surface-200 dark:border-neutral-700 shadow-sm"
            >
              <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-lg bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-light">
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-surface-900 dark:text-white">{stat.value}</p>
                <p className="text-sm text-surface-500 dark:text-surface-400">{stat.label}</p>
              </div>
            </div>
          ))}
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          <motion.aside
            variants={itemVariants}
            className="w-full lg:w-80 flex-shrink-0"
          >
            <div className="lg:sticky lg:top-28 space-y-6">
              <div className="p-6 rounded-xl bg-surface-50 dark:bg-neutral-800 border border-surface-200 dark:border-neutral-700 shadow-sm">
                <h2 className="text-lg font-semibold text-surface-900 dark:text-white mb-3">
                  Profile
                </h2>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-surface-300 dark:bg-neutral-600 flex items-center justify-center text-surface-500 dark:text-surface-400 text-2xl font-bold">
                    ?
                  </div>
                  <div>
                    <h3 className="font-semibold text-surface-900 dark:text-white">
                      Your Name
                    </h3>
                    <p className="text-sm text-surface-500 dark:text-surface-400">
                      DSA Learner
                    </p>
                  </div>
                </div>
                <p className="text-sm text-surface-500 dark:text-surface-400 mb-4">
                  Sign in to see your profile and connect with the community.
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-surface-500 dark:text-surface-400">Projects</span>
                    <span className="font-medium text-surface-900 dark:text-white">0</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-surface-500 dark:text-surface-400">Followers</span>
                    <span className="font-medium text-surface-900 dark:text-white">0</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-surface-500 dark:text-surface-400">Following</span>
                    <span className="font-medium text-surface-900 dark:text-white">0</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.aside>

          <motion.main variants={itemVariants} className="flex-1 min-w-0">
            <div className="space-y-6">
              <div className="p-6 rounded-xl bg-surface-50 dark:bg-neutral-800 border border-surface-200 dark:border-neutral-700 shadow-sm">
                <h2 className="text-xl font-semibold text-surface-900 dark:text-white mb-4">
                  Core Team
                </h2>
                <div className="text-surface-500 dark:text-surface-400">
                  Meet the people behind AlgoBuddy.
                </div>
              </div>
              <div className="p-6 rounded-xl bg-surface-50 dark:bg-neutral-800 border border-surface-200 dark:border-neutral-700 shadow-sm">
                <h2 className="text-xl font-semibold text-surface-900 dark:text-white mb-4">
                  Recent Activity
                </h2>
                <p className="text-surface-500 dark:text-surface-400">
                  Community activity feed coming soon.
                </p>
              </div>
            </div>
          </motion.main>
        </div>
      </motion.div>

      <Footer />
    </section>
  );
}
