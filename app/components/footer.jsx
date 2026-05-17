"use client";
import React from "react";
import { useState } from "react";
import Link from "next/link";
import PrivacyPolicyModal from "@/app/components/PrivacyPolicyModal";
import TermsOfServiceModal from "@/app/components/termsOfServicesModal";
import CookiePolicyModal from "@/app/components/cookie";

const Footer = () => {
  const [showPolicyModal, setShowPolicyModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showCookieModal, setShowCookieModal] = useState(false);

  return (
    <footer className="bg-[hsl(var(--surface))] border-t border-[hsl(var(--border))]">
      <div className="container-app px-6 py-12">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-10">
          <div className="max-w-xs space-y-3">
            <Link href="/" className="text-xl font-bold font-display tracking-tight text-[hsl(var(--text))]">
              Algo<span className="text-[hsl(var(--primary))]">Buddy</span>
            </Link>
            <p className="text-sm text-[hsl(var(--text-muted))] leading-relaxed font-body">
              Interactive visualization tools for mastering data structures and algorithms.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <a
                href="https://github.com/PankajSingh34"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="w-9 h-9 rounded-full border border-[hsl(var(--border))] flex items-center justify-center text-[hsl(var(--text-muted))] hover:text-[hsl(var(--text))] hover:border-[hsl(var(--text))] transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/in/pankaj-singh-2a968b212/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-9 h-9 rounded-full border border-[hsl(var(--border))] flex items-center justify-center text-[hsl(var(--text-muted))] hover:text-[hsl(var(--text))] hover:border-[hsl(var(--text))] transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            </div>
          </div>

          <div className="flex flex-wrap gap-10">
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[hsl(var(--text-muted))] font-body">
                Navigate
              </h4>
              <ul className="space-y-2">
                {[
                  { href: "/", label: "Home" },
                  { href: "/visualizer", label: "Visualizer" },
                  { href: "/blogs", label: "Blogs" },

                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-[hsl(var(--text-muted))] hover:text-[hsl(var(--primary))] transition-colors font-body"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[hsl(var(--text-muted))] font-body">
                Legal
              </h4>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => setShowPolicyModal(true)}
                    className="text-sm text-[hsl(var(--text-muted))] hover:text-[hsl(var(--primary))] transition-colors font-body"
                  >
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setShowTermsModal(true)}
                    className="text-sm text-[hsl(var(--text-muted))] hover:text-[hsl(var(--primary))] transition-colors font-body"
                  >
                    Terms of Service
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setShowCookieModal(true)}
                    className="text-sm text-[hsl(var(--text-muted))] hover:text-[hsl(var(--primary))] transition-colors font-body"
                  >
                    Cookie Policy
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-[hsl(var(--border))]">
        <div className="container-app px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-[hsl(var(--text-muted))] font-body">
            &copy; {new Date().getFullYear()} AlgoBuddy. All rights reserved.
          </p>
          <p className="text-xs text-[hsl(var(--text-subtle))] font-body">
            Built with care for the DSA community.
          </p>
        </div>
      </div>

      <PrivacyPolicyModal
        isOpen={showPolicyModal}
        onClose={() => setShowPolicyModal(false)}
      />
      <TermsOfServiceModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
      />
      <CookiePolicyModal
        isOpen={showCookieModal}
        onClose={() => setShowCookieModal(false)}
      />
    </footer>
  );
};

export default Footer;
