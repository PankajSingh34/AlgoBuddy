"use client";
import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";

const ExploreOther = ({
  title,
  links,
  columns = "4",
  icon = <FiArrowRight />,
}) => {
  const gridColumns = {
    "1": "sm:grid-cols-1",
    "2": "sm:grid-cols-2",
    "3": "sm:grid-cols-2 lg:grid-cols-3",
    "4": "sm:grid-cols-2 lg:grid-cols-4",
    "5": "sm:grid-cols-2 lg:grid-cols-5",
  }[columns] || "sm:grid-cols-2 lg:grid-cols-4";

  const isExternal = (url) => url.startsWith("http") || url.startsWith("www");

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))] overflow-hidden mt-6 transition-all duration-300 hover:shadow-md"
    >
      <div className="p-5 sm:p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-xl sm:text-2xl font-semibold text-[hsl(var(--text))] flex items-center gap-3">
            <span className="w-2 h-6 rounded-full bg-[hsl(var(--primary))] flex-shrink-0"></span>
            {title}
          </h2>
        </div>

        <div className={`grid grid-cols-1 ${gridColumns} gap-3`}>
          {links.map((link, index) => (
            <motion.a
              key={index}
              href={link.url}
              target={isExternal(link.url) ? "_blank" : "_self"}
              rel={isExternal(link.url) ? "noopener noreferrer" : ""}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.98 }}
              className="group relative block p-4 rounded-lg border border-[hsl(var(--border))] hover:border-[hsl(var(--primary)/0.4)] transition-all duration-200 bg-[hsl(var(--surface))] hover:bg-[hsl(var(--primary-subtle))] overflow-hidden"
            >
              <div className="relative flex items-center gap-3">
                <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-[hsl(var(--primary-subtle))] flex items-center justify-center text-[hsl(var(--primary))] group-hover:bg-[hsl(var(--primary)/0.15)] transition-colors">
                  {link.icon || icon}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-body text-sm font-medium text-[hsl(var(--text))] group-hover:text-[hsl(var(--primary))] transition-colors truncate">
                    {link.text}
                  </p>
                  {link.description && (
                    <p className="text-xs text-[hsl(var(--text-muted))] truncate">
                      {link.description}
                    </p>
                  )}
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default ExploreOther;
