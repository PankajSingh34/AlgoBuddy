"use client";
import { motion } from "framer-motion";
import { FiGithub, FiLinkedin, FiTwitter } from "react-icons/fi";
import { HiUsers } from "react-icons/hi2";

const roleBadgeVariants = {
  Founder: "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300",
  "Co-Founder": "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
  "Lead Designer": "bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300",
  "Tech Lead": "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300",
  DevOps: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300",
};

const teamMembers = [
  {
    name: "Pankaj Singh",
    role: "Founder",
    avatar: "PS",
    bio: "Building AlgoBuddy to make DSA accessible for everyone.",
    links: { github: "#", linkedin: "#", twitter: "#" },
  },
  {
    name: "Jane Doe",
    role: "Co-Founder",
    avatar: "JD",
    bio: "Driving the vision and community growth.",
    links: { github: "#", linkedin: "#", twitter: "#" },
  },
  {
    name: "Alice Smith",
    role: "Lead Designer",
    avatar: "AS",
    bio: "Crafting beautiful and intuitive learning experiences.",
    links: { github: "#", linkedin: "#", twitter: "#" },
  },
  {
    name: "Bob Johnson",
    role: "Tech Lead",
    avatar: "BJ",
    bio: "Architecting the platform for scale and performance.",
    links: { github: "#", linkedin: "#", twitter: "#" },
  },
  {
    name: "Carol Williams",
    role: "DevOps",
    avatar: "CW",
    bio: "Ensuring reliable infrastructure and smooth deployments.",
    links: { github: "#", linkedin: "#", twitter: "#" },
  },
];

export default function CoreTeamSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-xl bg-surface-50 dark:bg-neutral-800 border border-surface-200 dark:border-neutral-700 shadow-sm p-6 sm:p-8"
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-light">
          <HiUsers className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-surface-900 dark:text-white">Core Team</h2>
          <p className="text-sm text-surface-500 dark:text-surface-400">
            Meet the people behind AlgoBuddy.
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {teamMembers.map((member) => (
          <motion.div
            key={member.name}
            whileHover={{ y: -4 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
            className="flex lg:flex-col items-center lg:text-center gap-4 lg:gap-3 p-4 rounded-lg bg-white dark:bg-neutral-700/50 border border-surface-200 dark:border-neutral-700 shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-full flex-shrink-0 bg-surface-200 dark:bg-neutral-600 flex items-center justify-center text-surface-600 dark:text-surface-300 font-bold text-sm lg:text-base">
              {member.avatar}
            </div>

            <div className="min-w-0 flex-1 lg:flex-none">
              <h3 className="font-semibold text-surface-900 dark:text-white text-sm lg:text-base">
                {member.name}
              </h3>
              <span
                className={`inline-block mt-0.5 px-2 py-0.5 text-xs font-medium rounded-full ${roleBadgeVariants[member.role]}`}
              >
                {member.role}
              </span>
              <p className="mt-1.5 text-xs text-surface-500 dark:text-surface-400 leading-relaxed hidden lg:block">
                {member.bio}
              </p>

              <div className="flex items-center lg:justify-center gap-2 mt-2">
                {Object.entries(member.links).map(([platform, url]) => {
                  const Icon =
                    platform === "github"
                      ? FiGithub
                      : platform === "linkedin"
                        ? FiLinkedin
                        : FiTwitter;
                  return (
                    <a
                      key={platform}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-7 h-7 flex items-center justify-center rounded-full text-surface-400 dark:text-surface-500 hover:text-surface-700 dark:hover:text-surface-200 transition-colors duration-150"
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </a>
                  );
                })}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
