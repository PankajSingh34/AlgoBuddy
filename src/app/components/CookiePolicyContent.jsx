"use client";
import { cookieSections } from "./cookie";
import Link from "next/link";

export default function CookiePolicyContent() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <Link href="/" className="text-sm text-neutral-500 hover:text-black dark:hover:text-white transition-colors">
        ← Return Home
      </Link>

      <p className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-500 mt-6">Legal</p>
      <h1 className="mt-2 text-4xl font-bold dark:text-white">Cookie Policy</h1>
      <p className="mt-4 max-w-2xl text-neutral-600 dark:text-neutral-400">
        This Cookie Policy explains how we use cookies and similar
        technologies on our website.
      </p>
      <p className="mt-2 text-sm text-neutral-500">Last updated: May 17, 2025</p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[250px_1fr]">
        <aside>
          <h2 className="mb-4 text-sm font-semibold uppercase dark:text-white">Contents</h2>
          <ul className="space-y-2">
            {cookieSections.map((item) => (
              <li key={item.id}>
                
                <a  href={`#cookie-${item.id}`}
                  className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors"
                >
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
        </aside>

        <div className="space-y-10">
          {cookieSections.map((item) => (
            <section key={item.id} id={`cookie-${item.id}`}>
              <h2 className="text-2xl font-semibold mb-3 dark:text-white">{item.title}</h2>

              {item.points && (
                <ul className="list-disc pl-6 space-y-2 text-neutral-600 dark:text-neutral-400">
                  {item.points.map((point, i) => (
                    <li key={i}>{point}</li>
                  ))}
                </ul>
              )}

              {item.data && (
                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">{item.data}</p>
              )}

              {item.contact && (
                
                <a href={`mailto:${item.contact}`}
                  className="font-medium text-neutral-900 dark:text-neutral-100 hover:text-blue-600 transition-colors"
                >
                  {item.contact}
                </a>
              )}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}