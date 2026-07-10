"use client";
import { memo, useCallback, useMemo } from "react";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const VISUALIZER_SLUG_BY_SEGMENT = {
  linkedlist: "linked-list",
  "dry-run": "code-lab",
  "complexity-analyzer": "code-lab",
};

const Breadcrumbs = memo(function Breadcrumbs({ paths }) {
  const pathname = usePathname();
  const pathSegments = useMemo(() => pathname?.split("/").filter(Boolean) ?? [], [pathname]);
  const isVisualizer = pathSegments[0] === "visualizer";
  const visualizerSegment = pathSegments[1] || "";
  const visualizerSlug = VISUALIZER_SLUG_BY_SEGMENT[visualizerSegment] || visualizerSegment;
  const categoryHref = `/visualizer/${visualizerSlug}`;

  const getHref = useCallback((path, index) => {
    if (path.href) return path.href;
    if (!isVisualizer) return null;
    if (index > 1 && index < paths.length - 1) {
      return categoryHref;
    }
    return null;
  }, [isVisualizer, categoryHref]);

  return (
    <nav className="flex items-center text-sm text-gray-600 dark:text-gray-300" aria-label="Breadcrumb">
      {paths.map((path, index) => {
        const href = getHref(path, index);
        return (
        <div key={index} className="flex items-center">
          {href ? (
            <Link
              href={href}
              className="hover:text-black dark:hover:text-white transition-colors"
            >
              {path.name}
            </Link>
          ) : (
            <span className="text-surface-700 dark:text-surface-300">
              {path.name}
            </span>
          )}
          {index !== paths.length - 1 && (
            <ChevronRight className="mx-2 h-4 w-4 text-gray-400 dark:text-gray-500" />
          )}
        </div>
        );
      })}
    </nav>
  );
});

export default Breadcrumbs;