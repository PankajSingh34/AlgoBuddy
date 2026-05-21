"use client";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export default function Breadcrumbs({ paths }) {
  return (
    <nav className="flex items-center text-sm text-gray-600 dark:text-gray-300" aria-label="Breadcrumb">
      {paths.map((path, index) => (
        <div key={index} className="flex items-center">
          {path.href ? (
            <Link
              href={path.href}
              className="transition-colors hover:text-black dark:hover:text-white"
            >
              {path.name}
            </Link>
          ) : (
            <span
              aria-current={index === paths.length - 1 ? "page" : undefined}
              className="font-medium text-gray-800 dark:text-gray-100"
            >
              {path.name}
            </span>
          )}
          {index !== paths.length - 1 && (
            <ChevronRight className="mx-2 h-4 w-4 text-gray-400 dark:text-gray-500" />
          )}
        </div>
      ))}
    </nav>
  );
}
