'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiChevronRight, FiSearch, FiInfo } from 'react-icons/fi';
import { useState } from 'react';

const InfoPopup = ({ info }) => {
  return (
    <div className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-[#1a1a1a] rounded-xl shadow-xl border border-[#e5e7eb] dark:border-[#333] p-4 z-10">
      {Object.entries(info).map(([key, value]) => (
        <div key={key} className="mb-2 last:mb-0">
          <span className="font-semibold text-[#1a1a1a] dark:text-[#f5f5f5]">{key}: </span>
          <span className="text-[#4b5563] dark:text-[#a3a3a3]">{value}</span>
        </div>
      ))}
    </div>
  );
};

const SectionsDisplay = ({ sections, searchQuery }) => {
  const [hoveredSection, setHoveredSection] = useState(null);

  return (
    <div className="max-w-7xl mx-auto space-y-6 px-4 sm:px-1" style={{ fontFamily: "'Inter', 'Source Sans 3', sans-serif" }}>
      {sections.map((section, sectionIndex) => (
        <motion.div
          key={sectionIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: sectionIndex * 0.05 }}
          className="group relative bg-white dark:bg-[#111] rounded-2xl border border-[#e5e7eb] dark:border-[#222] overflow-hidden transition-all duration-300 hover:shadow-md hover:border-[#a435f0]/30 dark:hover:border-[#a435f0]/30"
        >
          {/* Section Header */}
          <div className="px-6 py-5 border-b border-[#f3f4f6] dark:border-[#222] flex items-center justify-between bg-[#fafafa] dark:bg-[#161616]">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#faf5ff] dark:bg-[#2d1f40] flex items-center justify-center text-[#a435f0]">
                {section.icon}
              </div>
              <h2 className="text-xl font-bold text-[#1a1a1a] dark:text-white" style={{ letterSpacing: "-0.02em" }}>{section.title}</h2>
            </div>
            {section.info && (
              <div
                className="relative"
                onMouseEnter={() => setHoveredSection(sectionIndex)}
                onMouseLeave={() => setHoveredSection(null)}
              >
                <FiInfo className="h-5 w-5 text-[#9ca3af] hover:text-[#a435f0] cursor-pointer transition-colors" />
                {hoveredSection === sectionIndex && (
                  <InfoPopup info={section.info} />
                )}
              </div>
            )}
          </div>

          {/* Section Content */}
          <div className="p-6">
            {section.subsections ? (
              <div className="space-y-7">
                {section.subsections.map((subsection, subIndex) => (
                  <div key={subIndex}>
                    <h3 className="text-[15px] font-semibold text-[#1a1a1a] dark:text-[#f5f5f5] mb-4 pl-3 border-l-[3px] border-[#a435f0]">
                      {subsection.title}
                    </h3>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                      {subsection.items.map((item, itemIndex) => (
                        <Link
                          key={itemIndex}
                          href={item.path}
                          className="group/item relative block p-4 rounded-xl border border-[#e5e7eb] dark:border-[#222] hover:border-[#a435f0]/50 dark:hover:border-[#a435f0]/50 transition-all duration-200 bg-white dark:bg-[#0f0f0f] hover:bg-[#faf5ff] dark:hover:bg-[#1a0a2e] overflow-hidden"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[#374151] dark:text-[#d1d5db] group-hover/item:text-[#a435f0] dark:group-hover/item:text-[#c084fc] font-medium text-[14px] transition-colors">
                              {item.name}
                            </span>
                            <FiChevronRight className="h-4 w-4 text-[#d1d5db] dark:text-[#444] group-hover/item:text-[#a435f0] transition-colors flex-shrink-0" />
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {section.items?.map((item, itemIndex) => (
                  <Link
                    key={itemIndex}
                    href={item.path}
                    className="group/item relative block p-4 rounded-xl border border-[#e5e7eb] dark:border-[#222] hover:border-[#a435f0]/50 dark:hover:border-[#a435f0]/50 transition-all duration-200 bg-white dark:bg-[#0f0f0f] hover:bg-[#faf5ff] dark:hover:bg-[#1a0a2e] overflow-hidden"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[#374151] dark:text-[#d1d5db] group-hover/item:text-[#a435f0] dark:group-hover/item:text-[#c084fc] font-medium text-[14px] transition-colors">
                        {item.name}
                      </span>
                      <FiChevronRight className="h-4 w-4 text-[#d1d5db] dark:text-[#444] group-hover/item:text-[#a435f0] transition-colors flex-shrink-0" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      ))}

      {/* Empty State */}
      {sections.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="text-center py-16"
        >
          <div className="w-20 h-20 mx-auto mb-6 bg-[#faf5ff] dark:bg-[#1a0a2e] rounded-full flex items-center justify-center">
            <FiSearch className="h-9 w-9 text-[#a435f0]" />
          </div>
          <h3 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-3" style={{ letterSpacing: "-0.02em" }}>
            No results found
          </h3>
          <p className="text-[#6b7280] dark:text-[#a3a3a3] max-w-md mx-auto">
            Try searching for different terms or browse our categories
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default SectionsDisplay;