"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/contexts/UserContext";
import { supabase } from "@/lib/supabase";

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
const CATEGORIES = [
  { label: "Visualizer",     href: "/visualizer" },
  { label: "Blogs",          href: "/blogs" },
  { label: "Learn CS",       href: "https://learn.dsavisualizer.in/" },
  { label: "Features",       href: "/#features" },
  { label: "About",          href: "/#about" },
  { label: "Reviews",        href: "/#testimonial" },
];

/* ─────────────────────────────────────────────
   ICONS (inline SVG, no extra deps)
───────────────────────────────────────────── */
const SearchIcon = () => (
  <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
    <circle cx="11" cy="11" r="8" />
    <path strokeLinecap="round" d="M21 21l-4.35-4.35" />
  </svg>
);

const ChevronDown = ({ open }) => (
  <svg
    className={`w-4 h-4 ml-0.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
    fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

const MoonIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
  </svg>
);

const SunIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const MenuIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const CloseIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

/* ─────────────────────────────────────────────
   EXPLORE MEGA-DROPDOWN
───────────────────────────────────────────── */
function ExploreDropdown({ onClose }) {
  return (
    <div
      className="absolute left-0 top-[calc(100%+1px)] w-64 bg-white dark:bg-[#2d2f31] border border-[#d1d7dc] dark:border-[#3e4143] shadow-[0_2px_16px_rgba(0,0,0,0.18)] z-[9999]"
      style={{ fontFamily: "'Source Sans 3', sans-serif" }}
    >
      {CATEGORIES.map((c) => (
        <Link
          key={c.href}
          href={c.href}
          onClick={onClose}
          className="block px-5 py-3 text-[15px] font-semibold text-[#1c1d1f] dark:text-[#f7f9fa] hover:bg-[#f7f9fa] dark:hover:bg-[#3e4143] transition-colors"
        >
          {c.label}
        </Link>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   USER DROPDOWN
───────────────────────────────────────────── */
function UserDropdown({ user, onLogout, onClose }) {
  return (
    <div
      className="absolute right-0 top-[calc(100%+8px)] w-52 bg-white dark:bg-[#2d2f31] border border-[#d1d7dc] dark:border-[#3e4143] shadow-[0_2px_16px_rgba(0,0,0,0.18)] z-[9999]"
      style={{ fontFamily: "'Source Sans 3', sans-serif" }}
    >
      <div className="px-4 py-3 border-b border-[#d1d7dc] dark:border-[#3e4143]">
        <p className="text-xs text-[#6a6f73] dark:text-[#9e9e9e] truncate">{user.email}</p>
      </div>
      <Link
        href="/dashboard"
        onClick={onClose}
        className="block px-4 py-3 text-[14px] font-semibold text-[#1c1d1f] dark:text-[#f7f9fa] hover:bg-[#f7f9fa] dark:hover:bg-[#3e4143] transition-colors"
      >
        My Dashboard
      </Link>
      <button
        onClick={() => { onLogout(); onClose(); }}
        className="w-full text-left px-4 py-3 text-[14px] font-semibold text-[#1c1d1f] dark:text-[#f7f9fa] hover:bg-[#f7f9fa] dark:hover:bg-[#3e4143] transition-colors border-t border-[#d1d7dc] dark:border-[#3e4143]"
      >
        Log out
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN NAVBAR
───────────────────────────────────────────── */
export default function Navbar() {
  const [theme, setTheme]           = useState("light");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [exploreOpen, setExploreOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [query, setQuery]           = useState("");

  const exploreRef = useRef(null);
  const userRef    = useRef(null);
  const router     = useRouter();
  const { user, setUser } = useUser();

  /* theme init */
  useEffect(() => {
    const saved = localStorage.getItem("theme") || "light";
    setTheme(saved);
    document.documentElement.classList.toggle("dark", saved === "dark");
  }, []);

  /* close dropdowns on outside click */
  useEffect(() => {
    const fn = (e) => {
      if (exploreRef.current && !exploreRef.current.contains(e.target)) setExploreOpen(false);
      if (userRef.current    && !userRef.current.contains(e.target))    setUserMenuOpen(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
    window.dispatchEvent(new Event("themeChange"));
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push("/");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const q = query.trim();
    if (q) { router.push(`/blogs?q=${encodeURIComponent(q)}`); setMobileOpen(false); }
  };

  /* shared text style */
  const navText = "text-[#1c1d1f] dark:text-[#f7f9fa]";
  const font    = { fontFamily: "'Source Sans 3', sans-serif" };

  return (
    <>
      {/* ══════════════════════════════════════
          DESKTOP BAR  (h-[60px], full-width)
      ══════════════════════════════════════ */}
      <nav
        style={font}
        className="fixed top-0 left-0 right-0 z-[9998] h-[60px] bg-white dark:bg-[#1c1d1f] border-b border-[#d1d7dc] dark:border-[#3e4143] flex items-center"
      >
        <div className="w-full max-w-[1340px] mx-auto px-4 flex items-center gap-3 h-full">

          {/* ── Logo ── */}
          <Link
            href="/"
            style={{ fontFamily: "'Source Serif 4', serif" }}
            className="shrink-0 text-[20px] font-bold text-[#1c1d1f] dark:text-[#f7f9fa] hover:text-[#a435f0] transition-colors whitespace-nowrap tracking-tight"
          >
            Algo<span className="text-[#a435f0]">Buddy</span>
          </Link>

          {/* ── Explore pill (desktop only) ── */}
          <div ref={exploreRef} className="relative hidden md:flex shrink-0">
            <button
              onClick={() => setExploreOpen((o) => !o)}
              className={`flex items-center gap-1 h-[34px] px-4 text-[15px] font-bold border-[1.5px] transition-colors ${
                exploreOpen
                  ? "border-[#a435f0] text-[#a435f0]"
                  : `border-[#1c1d1f] dark:border-[#f7f9fa] ${navText} hover:border-[#a435f0] hover:text-[#a435f0]`
              }`}
            >
              Explore
              <ChevronDown open={exploreOpen} />
            </button>
            {exploreOpen && <ExploreDropdown onClose={() => setExploreOpen(false)} />}
          </div>

          {/* ── Search bar (grows) ── */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 items-center h-[42px] max-w-[580px]"
          >
            <div className="relative w-full h-full">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for anything"
                className={`w-full h-full pl-5 pr-14 rounded-full border-[1.5px] border-[#1c1d1f] dark:border-[#f7f9fa] bg-white dark:bg-[#2d2f31] ${navText} placeholder-[#6a6f73] dark:placeholder-[#9e9e9e] text-[15px] focus:outline-none focus:border-[#a435f0] transition-colors`}
              />
              <button
                type="submit"
                aria-label="Search"
                className="absolute right-0 top-0 h-full w-[52px] flex items-center justify-center rounded-r-full bg-[#1c1d1f] dark:bg-[#f7f9fa] text-white dark:text-[#1c1d1f] hover:bg-[#a435f0] dark:hover:bg-[#a435f0] dark:hover:text-white transition-colors"
              >
                <SearchIcon />
              </button>
            </div>
          </form>

          {/* ── Spacer on desktop so right items hug the right ── */}
          <div className="hidden md:block flex-1" />

          {/* ── Right side items ── */}
          <div className="hidden md:flex items-center gap-1 shrink-0">

            {/* text nav links */}
            {[
              { href: "/#features",    label: "Features" },
              { href: "/#testimonial", label: "Reviews"  },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`px-3 h-[60px] flex items-center text-[15px] font-semibold ${navText} hover:text-[#a435f0] border-b-[3px] border-transparent hover:border-[#a435f0] transition-colors`}
              >
                {l.label}
              </Link>
            ))}

            {/* divider */}
            <div className="w-px h-6 bg-[#d1d7dc] dark:bg-[#3e4143] mx-1" />

            {/* theme toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className={`w-10 h-10 flex items-center justify-center ${navText} hover:text-[#a435f0] transition-colors`}
            >
              {theme === "light" ? <MoonIcon /> : <SunIcon />}
            </button>

            {/* auth */}
            {user ? (
              <div ref={userRef} className="relative ml-1">
                <button onClick={() => setUserMenuOpen((o) => !o)}>
                  <img
                    src={`https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(user.email)}`}
                    alt="avatar"
                    className="w-9 h-9 rounded-full border-2 border-[#a435f0]"
                  />
                </button>
                {userMenuOpen && (
                  <UserDropdown user={user} onLogout={handleLogout} onClose={() => setUserMenuOpen(false)} />
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 ml-1">
                <Link
                  href="/login"
                  className={`h-[42px] px-5 flex items-center text-[15px] font-bold border-[1.5px] border-[#1c1d1f] dark:border-[#f7f9fa] ${navText} hover:border-[#a435f0] hover:text-[#a435f0] transition-colors whitespace-nowrap`}
                >
                  Log in
                </Link>
                <Link
                  href="/login"
                  className="h-[42px] px-5 flex items-center text-[15px] font-bold bg-[#a435f0] hover:bg-[#7d2be0] text-white transition-colors whitespace-nowrap"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>

          {/* ── Mobile right (theme + hamburger) ── */}
          <div className="flex items-center gap-1 ml-auto md:hidden">
            <button onClick={toggleTheme} aria-label="Toggle theme" className={`w-10 h-10 flex items-center justify-center ${navText}`}>
              {theme === "light" ? <MoonIcon /> : <SunIcon />}
            </button>
            <button
              onClick={() => setMobileOpen((o) => !o)}
              aria-label="Toggle menu"
              className={`w-10 h-10 flex items-center justify-center ${navText}`}
            >
              {mobileOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </nav>

      {/* ══════════════════════════════════════
          MOBILE DRAWER
      ══════════════════════════════════════ */}
      {mobileOpen && (
        <div
          style={font}
          className="fixed top-[60px] left-0 right-0 bottom-0 z-[9997] bg-white dark:bg-[#1c1d1f] overflow-y-auto border-t border-[#d1d7dc] dark:border-[#3e4143]"
        >
          {/* mobile search */}
          <div className="px-4 pt-4 pb-3 border-b border-[#d1d7dc] dark:border-[#3e4143]">
            <form onSubmit={handleSearch} className="relative h-[42px]">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for anything"
                className={`w-full h-full pl-5 pr-14 rounded-full border-[1.5px] border-[#1c1d1f] dark:border-[#f7f9fa] bg-white dark:bg-[#2d2f31] ${navText} placeholder-[#6a6f73] text-[15px] focus:outline-none focus:border-[#a435f0] transition-colors`}
              />
              <button
                type="submit"
                className="absolute right-0 top-0 h-full w-[52px] flex items-center justify-center rounded-r-full bg-[#1c1d1f] dark:bg-[#f7f9fa] text-white dark:text-[#1c1d1f]"
              >
                <SearchIcon />
              </button>
            </form>
          </div>

          {/* mobile links */}
          <div className="py-2">
            {CATEGORIES.map((c) => (
              <Link
                key={c.href}
                href={c.href}
                onClick={() => setMobileOpen(false)}
                className={`block px-5 py-3 text-[16px] font-semibold ${navText} hover:bg-[#f7f9fa] dark:hover:bg-[#2d2f31] hover:text-[#a435f0] transition-colors`}
              >
                {c.label}
              </Link>
            ))}
          </div>

          {/* mobile auth */}
          <div className="px-4 pb-6 pt-2 border-t border-[#d1d7dc] dark:border-[#3e4143] flex gap-3">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className={`flex-1 h-[42px] flex items-center justify-center text-[15px] font-bold border-[1.5px] border-[#1c1d1f] dark:border-[#f7f9fa] ${navText}`}
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => { handleLogout(); setMobileOpen(false); }}
                  className="flex-1 h-[42px] text-[15px] font-bold bg-[#a435f0] hover:bg-[#7d2be0] text-white transition-colors"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className={`flex-1 h-[42px] flex items-center justify-center text-[15px] font-bold border-[1.5px] border-[#1c1d1f] dark:border-[#f7f9fa] ${navText} hover:border-[#a435f0] hover:text-[#a435f0] transition-colors`}
                >
                  Log in
                </Link>
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 h-[42px] flex items-center justify-center text-[15px] font-bold bg-[#a435f0] hover:bg-[#7d2be0] text-white transition-colors"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      )}

      {/* Spacer — pushes page content below the 60px fixed bar */}
      <div className="h-[60px]" />
    </>
  );
}
