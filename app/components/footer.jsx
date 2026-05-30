"use client";

import React, { useState } from "react";
import Link from "next/link";

import PrivacyPolicyModal from "@/app/components/PrivacyPolicyModal";
import TermsOfServiceModal from "@/app/components/termsOfServicesModal";
import CookiePolicyModal from "@/app/components/cookie";

const Footer = () => {
  const [showPolicyModal, setShowPolicyModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showCookieModal, setShowCookieModal] = useState(false);

  const footerHeading =
    "text-white text-lg font-semibold mb-6 relative after:absolute after:left-0 after:-bottom-2 after:w-10 after:h-[2px] after:bg-gray-600";

  const footerLink =
    "block text-gray-400 hover:text-white transition-colors duration-300 text-sm";

  return (
    <>
      <footer className="relative bg-[#0b0f19] text-gray-400 overflow-hidden">
        {/* Top Green Border */}
        <div className="h-[8px] bg-[#0f3d21]" />

        {/* Background Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#7c3aed10,transparent_60%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1fr] gap-12">
            {/* Left Section */}
            <div>
              <h2 className="text-4xl font-black tracking-tight text-white">
                Algo<span className="text-primary">Buddy</span>
              </h2>

              <p className="mt-6 text-sm leading-8 max-w-xs">
                Interactive visualization tools for mastering data structures
                and algorithms.
              </p>

              {/* Social Icons */}
              <div className="flex items-center gap-4 mt-8">
                {/* GitHub */}
                <a
                  href="https://github.com/PankajSingh34"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full border border-gray-700 flex items-center justify-center hover:border-primary hover:text-primary transition-all duration-300"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                </a>

                {/* LinkedIn */}
                <a
                  href="https://www.linkedin.com/in/pankaj-singh-2a968b212/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full border border-gray-700 flex items-center justify-center hover:border-primary hover:text-primary transition-all duration-300"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zM8 19H5V8h3v11zM6.5 6.732A1.764 1.764 0 116.5 3.2a1.764 1.764 0 010 3.532zM20 19h-3v-5.604c0-3.368-4-3.113-4 0V19h-3V8h3v1.765c1.396-2.586 7-2.777 7 2.476V19z" />
                  </svg>
                </a>

                {/* Email */}
                <a
                  href="mailto:singhps588@gmail.com"
                  className="w-12 h-12 rounded-full border border-gray-700 flex items-center justify-center hover:border-primary hover:text-primary transition-all duration-300"
                >
                  ✉
                </a>
              </div>

              {/* Newsletter */}
              <div className="mt-10">
                <h3 className="text-white font-semibold mb-3">Stay updated</h3>

                <p className="text-sm mb-4">
                  Subscribe to get the latest updates, features, and tutorials.
                </p>

                <div className="flex overflow-hidden rounded-lg border border-gray-700">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 bg-transparent px-4 py-3 text-sm outline-none"
                  />

                  <button className="bg-primary text-white px-5 font-medium hover:opacity-90 transition">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className={footerHeading}>Quick Links</h3>

              <div className="space-y-4 mt-8">
                <Link href="/" className={footerLink}>
                  Home
                </Link>
                <Link href="/visualizations" className={footerLink}>
                  Visualizations
                </Link>
                <Link href="/data-structures" className={footerLink}>
                  Data Structures
                </Link>
                <Link href="/algorithms" className={footerLink}>
                  Algorithms
                </Link>
                <Link href="/about" className={footerLink}>
                  About Us
                </Link>
                <Link href="/contactus" className={footerLink}>
                  Contact Us
                </Link>
              </div>
            </div>

            {/* Resources */}
            <div>
              <h3 className={footerHeading}>Resources</h3>

              <div className="space-y-4 mt-8">
                <Link href="/tutorials" className={footerLink}>
                  Tutorials
                </Link>
                <Link href="/cheatsheets" className={footerLink}>
                  Cheatsheets
                </Link>
                <Link href="/practice" className={footerLink}>
                  Practice Problems
                </Link>
                <Link href="/roadmaps" className={footerLink}>
                  Roadmaps
                </Link>
                <Link href="/blog" className={footerLink}>
                  Blog
                </Link>
                <Link href="/faq" className={footerLink}>
                  FAQ
                </Link>
              </div>
            </div>

            {/* Community */}
            <div>
              <h3 className={footerHeading}>Community</h3>

              <p className="text-sm mt-8 mb-6 leading-7">
                Join our community and connect with learners and developers.
              </p>

              <div className="space-y-4">
                <a href="#" className={footerLink}>
                  Discord
                </a>
                <a href="#" className={footerLink}>
                  GitHub
                </a>
                <a href="#" className={footerLink}>
                  YouTube
                </a>
                <a href="#" className={footerLink}>
                  Twitter
                </a>
              </div>
            </div>

            {/* Legal */}
            <div>
              <h3 className={footerHeading}>Legal</h3>

              <div className="space-y-4 mt-8">
                <button
                  onClick={() => setShowPolicyModal(true)}
                  className={footerLink}
                >
                  Privacy Policy
                </button>

                <button
                  onClick={() => setShowTermsModal(true)}
                  className={footerLink}
                >
                  Terms of Service
                </button>

                <button
                  onClick={() => setShowCookieModal(true)}
                  className={footerLink}
                >
                  Cookies Policy
                </button>

                <Link href="/code-of-conduct" className={footerLink}>
                  Code of Conduct
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="border-t border-gray-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            <p>© {new Date().getFullYear()} AlgoBuddy. All rights reserved.</p>

            <p>
              Made with <span className="text-primary">💜</span> by developers,
              for developers.
            </p>
          </div>
        </div>
      </footer>

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
    </>
  );
};

export default Footer;
