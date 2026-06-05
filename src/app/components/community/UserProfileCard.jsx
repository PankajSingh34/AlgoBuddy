"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FiExternalLink } from "react-icons/fi";
import { FaGithub, FaLinkedin, FaTwitter, FaDev } from "react-icons/fa6";
import { useUser } from "@/features/user/UserContext";

function AnimatedCounter({ value, label }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          let start = 0;
          const duration = 800;
          const step = Math.ceil(value / (duration / 16));
          const timer = setInterval(() => {
            start += step;
            if (start >= value) {
              setCount(value);
              clearInterval(timer);
            } else {
              setCount(start);
            }
          }, 16);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div ref={ref} className="text-center">
      <p className="text-xl font-bold text-surface-900 dark:text-white">{count}</p>
      <p className="text-xs text-surface-500 dark:text-surface-400 uppercase tracking-wider">{label}</p>
    </div>
  );
}

const socialIcons = {
  github: { icon: FaGithub, color: "hover:text-gray-900 dark:hover:text-white", href: null },
  linkedin: { icon: FaLinkedin, color: "hover:text-blue-600", href: null },
  twitter: { icon: FaTwitter, color: "hover:text-sky-500", href: null },
  devto: { icon: FaDev, color: "hover:text-gray-900 dark:hover:text-white", href: null },
};

export default function UserProfileCard({
  avatar,
  name,
  role,
  bio,
  stats = { projects: 0, followers: 0, following: 0 },
  socialLinks = {},
}) {
  const { user } = useUser();
  const displayName = name || user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Guest";
  const displayRole = role || "DSA Learner";
  const displayBio = bio || "Passionate about algorithms and data structures.";
  const avatarSrc = avatar || user?.user_metadata?.avatar_url || null;
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="rounded-xl bg-surface-50 dark:bg-neutral-800 border border-surface-200 dark:border-neutral-700 shadow-sm overflow-hidden"
    >
      <div className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="relative flex-shrink-0">
            <div className="w-16 h-16 rounded-full ring-2 ring-primary/30 dark:ring-primary/40 overflow-hidden flex items-center justify-center bg-surface-200 dark:bg-neutral-700 text-surface-500 dark:text-surface-400 text-xl font-bold">
              {avatarSrc ? (
                <img src={avatarSrc} alt={displayName} className="w-full h-full object-cover" />
              ) : (
                initials
              )}
            </div>
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-surface-900 dark:text-white truncate">{displayName}</h3>
            <span className="inline-block mt-0.5 px-2.5 py-0.5 text-xs font-medium rounded-full bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-light">
              {displayRole}
            </span>
          </div>
        </div>

        <p className="text-sm text-surface-500 dark:text-surface-400 leading-relaxed mb-5">{displayBio}</p>

        <div className="flex justify-around py-3 border-y border-surface-200 dark:border-neutral-700 mb-5">
          <AnimatedCounter value={stats.projects} label="Projects" />
          <AnimatedCounter value={stats.followers} label="Followers" />
          <AnimatedCounter value={stats.following} label="Following" />
        </div>

        <div className="flex items-center justify-center gap-3 mb-5">
          {Object.entries(socialIcons).map(([key, { icon: Icon, color }]) => {
            const href = socialLinks[key];
            if (!href) {
              return (
                <span
                  key={key}
                  className="w-8 h-8 flex items-center justify-center rounded-full text-surface-400 dark:text-surface-500 cursor-not-allowed"
                >
                  <Icon className="w-4 h-4" />
                </span>
              );
            }
            return (
              <a
                key={key}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-8 h-8 flex items-center justify-center rounded-full text-surface-400 dark:text-surface-500 transition-colors duration-200 ${color}`}
              >
                <Icon className="w-4 h-4" />
              </a>
            );
          })}
        </div>

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg border border-surface-300 dark:border-neutral-600 text-surface-700 dark:text-surface-200 bg-white dark:bg-neutral-700 hover:bg-surface-50 dark:hover:bg-neutral-600 transition-colors duration-200 shadow-sm"
        >
          View Full Profile
          <FiExternalLink className="w-3.5 h-3.5" />
        </motion.button>
      </div>
    </motion.div>
  );
}
