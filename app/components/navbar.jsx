"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/visualizer", label: "Visualizer" },
  { href: "/blogs", label: "Blogs" },
];

export default function Navbar({ variant = "default" }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const isInner = variant === "inner";

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 4);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (href) => {
    if (href.startsWith("http")) return false;
    if (href.startsWith("/#")) return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  };

  if (isInner) {
    return (
      <>
        <nav
          className={`fixed top-0 left-0 right-0 z-[9998] h-[72px] bg-white dark:bg-[#0f0f0f] flex items-center transition-all duration-200 ${
            scrolled
              ? "border-b border-[#e5e7eb] dark:border-[#222] shadow-sm"
              : "border-b border-transparent"
          }`}
        >
          <div className="w-full max-w-[1200px] mx-auto px-8 flex items-center justify-between h-full">
            <Link
              href="/"
              className="text-[26px] font-black text-[#1a1a1a] dark:text-white tracking-tight hover:opacity-75 transition-opacity"
            >
              Algo<span className="text-[#a435f0]">Buddy</span>
            </Link>

            <div className="hidden md:flex items-center gap-7">
              {NAV_LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`text-[15px] font-medium transition-colors duration-150 ${
                    isActive(l.href)
                      ? "text-[#1a1a1a] dark:text-white font-semibold"
                      : "text-[#4b5563] dark:text-[#a3a3a3] hover:text-[#1a1a1a] dark:hover:text-white"
                  }`}
                >
                  {l.label}
                </Link>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                aria-label="Toggle theme"
                className="w-9 h-9 flex items-center justify-center rounded-full text-[#4b5563] dark:text-[#a3a3a3] hover:bg-[#f3f4f6] dark:hover:bg-[#222] transition-colors"
              >
                {mounted && theme === "dark" ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="5" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                  </svg>
                )}
              </button>
            </div>

            <button
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="Toggle menu"
              className="md:hidden w-10 h-10 flex items-center justify-center text-[#4b5563] dark:text-[#a3a3a3] rounded-lg hover:bg-[#f3f4f6] dark:hover:bg-[#222] transition-colors"
            >
              {menuOpen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </nav>

        {menuOpen && (
          <div className="fixed top-[72px] left-0 right-0 bottom-0 z-[9997] bg-white dark:bg-[#0f0f0f] overflow-y-auto border-t border-[#e5e7eb] dark:border-[#222]">
            <div className="py-2">
              {NAV_LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  className={`block px-6 py-3.5 text-[16px] font-medium transition-colors ${
                    isActive(l.href)
                      ? "text-[#a435f0] bg-[#faf5ff] dark:bg-[#1a0a2e]"
                      : "text-[#374151] dark:text-[#a3a3a3] hover:bg-[#f9fafb] dark:hover:bg-[#1a1a1a] hover:text-[#1a1a1a] dark:hover:text-white"
                  }`}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="h-[72px]" />
      </>
    );
  }

  if (!mounted) {
    return (
      <header className="sticky top-0 z-50 h-16 border-b border-[hsl(var(--border))] bg-[hsl(var(--bg)/0.85)] backdrop-blur-md">
        <div className="container-app h-full flex items-center justify-between">
          <Link href="/" className="font-display text-xl font-bold tracking-tight text-[hsl(var(--text))]">
            Algo<span className="text-[hsl(var(--primary))]">Buddy</span>
          </Link>
          <div className="w-9 h-9" />
        </div>
      </header>
    );
  }

  return (
    <header
      className={`sticky top-0 z-50 h-16 transition-all duration-200 backdrop-blur-md bg-[hsl(var(--bg)/0.85)] ${
        scrolled ? "border-b border-[hsl(var(--border))] shadow-sm" : "border-b border-transparent"
      }`}
    >
      <nav aria-label="Main" className="container-app h-full flex items-center justify-between">
        <Link
          href="/"
          className="font-display text-xl font-bold tracking-tight text-[hsl(var(--text))] hover:opacity-80 transition-opacity"
        >
          Algo<span className="text-[hsl(var(--primary))]">Buddy</span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`relative px-3 py-2 text-sm font-medium transition-colors rounded-md focus-ring ${
                  active
                    ? "text-[hsl(var(--primary))]"
                    : "text-[hsl(var(--text-muted))] hover:text-[hsl(var(--text))]"
                }`}
              >
                {link.label}
                {active && (
                  <span className="absolute inset-x-0 -bottom-px h-0.5 bg-[hsl(var(--primary))] rounded-full" />
                )}
              </Link>
            );
          })}
        </div>

        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
            className="size-9 flex items-center justify-center rounded-md text-[hsl(var(--text-muted))] hover:text-[hsl(var(--text))] hover:bg-[hsl(var(--surface-muted))] transition-colors"
          >
            {theme === "dark" ? (
              <svg className="size-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="5" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
              </svg>
            ) : (
              <svg className="size-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
              </svg>
            )}
          </button>
        </div>

        <div className="md:hidden">
          <button
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
            className="size-8 flex items-center justify-center rounded-md text-[hsl(var(--text-muted))] hover:text-[hsl(var(--text))] hover:bg-[hsl(var(--surface-muted))] transition-colors"
          >
            {menuOpen ? (
              <svg className="size-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="size-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="md:hidden fixed top-16 left-0 right-0 bottom-0 z-50 bg-[hsl(var(--bg))] border-t border-[hsl(var(--border))] overflow-y-auto">
          <div className="py-4 px-3 space-y-1">
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors focus-ring ${
                    active
                      ? "text-[hsl(var(--primary))] bg-[hsl(var(--primary-subtle))]"
                      : "text-[hsl(var(--text-muted))] hover:text-[hsl(var(--text))] hover:bg-[hsl(var(--surface-muted))]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
          <div className="border-t border-[hsl(var(--border))] px-3 py-4">
            <div className="flex items-center justify-between px-3 py-2">
              <span className="text-sm text-[hsl(var(--text-muted))]">Theme</span>
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                aria-label="Toggle theme"
                className="size-9 flex items-center justify-center rounded-md text-[hsl(var(--text-muted))] hover:text-[hsl(var(--text))] hover:bg-[hsl(var(--surface-muted))] transition-colors"
              >
                {theme === "dark" ? (
                  <svg className="size-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="5" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                  </svg>
                ) : (
                  <svg className="size-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
