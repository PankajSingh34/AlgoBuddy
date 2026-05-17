"use client";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export default function Breadcrumbs({ paths }) {
  return (
    <nav className="flex items-center text-sm text-[hsl(var(--text-muted))]" aria-label="Breadcrumb">
      {paths.map((path, index) => (
        <div key={index} className="flex items-center">
          <Link
            href={path.href}
            className="hover:text-[hsl(var(--primary))] transition-colors"
          >
            {path.name}
          </Link>
          {index !== paths.length - 1 && (
            <ChevronRight className="mx-2 h-4 w-4 text-[hsl(var(--text-subtle))]" />
          )}
        </div>
      ))}
    </nav>
  );
}
