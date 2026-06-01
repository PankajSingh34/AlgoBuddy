"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FaGithub, FaLinkedin, FaEnvelope, FaDiscord, FaYoutube, FaTwitter, FaInstagram } from "react-icons/fa6";

import PrivacyPolicyModal from "@/app/components/PrivacyPolicyModal";
import TermsOfServiceModal from "@/app/components/termsOfServicesModal";
import CookiePolicyModal from "@/app/components/cookie";

const Footer = () => {
  const [showPolicyModal, setShowPolicyModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showCookieModal, setShowCookieModal] = useState(false);

  const footerHeading = "text-white text-lg font-semibold mb-6 relative after:absolute after:left-0 after:-bottom-2 after:w-10 after:h-[2px] after:bg-gray-600";
  const footerLink = "block text-gray-400 hover:text-white transition-colors duration-300 text-sm";
  const socialIcon = "w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-primary/20 hover:border-primary/50 hover:text-white transition-all duration-300";

  return (
    <>
      <footer className="relative bg-udemy-dark-bg text-gray-400 overflow-hidden border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1fr] gap-12">
            {/* Left Section */}
            <div>
              <h2 className="text-4xl font-black tracking-tight text-white">
                Algo<span className="text-primary">Buddy</span>
              </h2>

              <p className="mt-6 text-sm leading-8 max-w-xs text-gray-400">
                Interactive visualization tools for mastering data structures
                and algorithms.
              </p>

              {/* Social Icons */}
              <div className="flex items-center gap-3 mt-8">
                <a
                  href="https://github.com/PankajSingh34/AlgoBuddy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={socialIcon}
                  aria-label="GitHub"
                >
                  <FaGithub className="w-4 h-4" />
                </a>

                <a
                  href="https://www.linkedin.com/company/algobuddy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={socialIcon}
                  aria-label="LinkedIn"
                >
                  <FaLinkedin className="w-4 h-4" />
                </a>

                <a
                  href="mailto:AlgoBuddy.connect@gmail.com"
                  className={socialIcon}
                  aria-label="Email"
                >
                  <FaEnvelope className="w-4 h-4" />
                </a>

                <a
                  href="https://www.instagram.com/algobuddy.connect/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={socialIcon}
                  aria-label="Instagram"
                >
                  <FaInstagram className="w-4 h-4" />
                </a>
              </div>

              {/* Newsletter */}
              <div className="mt-10">
                <h3 className="text-white font-semibold mb-2">Stay updated</h3>
                <p className="text-sm mb-4 text-gray-400 max-w-xs">
                  Subscribe to get the latest updates, features, and tutorials.
                </p>

                <div className="flex overflow-hidden rounded-xl border border-white/10 bg-white/5 focus-within:border-primary/50 transition-colors w-full max-w-sm">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 bg-transparent px-4 py-2.5 text-sm outline-none text-white placeholder-gray-500"
                  />
                  <button className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 text-sm font-medium transition-colors">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className={footerHeading}>Quick Links</h3>
              <div className="space-y-4">
                <Link href="/" className={footerLink}>Home</Link>
                <Link href="/visualizations" className={footerLink}>Visualizations</Link>
                <Link href="/data-structures" className={footerLink}>Data Structures</Link>
                <Link href="/algorithms" className={footerLink}>Algorithms</Link>
                <Link href="/about" className={footerLink}>About Us</Link>
                <Link href="/contactus" className={footerLink}>Contact Us</Link>
              </div>
            </div>

            {/* Resources */}
            <div>
              <h3 className={footerHeading}>Resources</h3>
              <div className="space-y-4">
                <Link href="/tutorials" className={footerLink}>Tutorials</Link>
                <Link href="/cheatsheets" className={footerLink}>Cheatsheets</Link>
                <Link href="/practice" className={footerLink}>Practice Problems</Link>
                <Link href="/roadmaps" className={footerLink}>Roadmaps</Link>
                <Link href="/blog" className={footerLink}>Blog</Link>
                <Link href="/faq" className={footerLink}>FAQ</Link>
              </div>
            </div>

            {/* Community */}
            <div>
              <h3 className={footerHeading}>Community</h3>
              <p className="text-sm text-gray-400 mb-6 leading-relaxed pr-4">
                Join our community and connect with learners and developers.
              </p>
              <div className="space-y-4">
                <a href="https://discord.gg/PqnazRxPc" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors duration-300 text-sm">
                  <FaDiscord className="w-4 h-4" /> Discord
                </a>
                <a href="https://github.com/PankajSingh34/AlgoBuddy" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors duration-300 text-sm">
                  <FaGithub className="w-4 h-4" /> GitHub
                </a>
                <a href="#" className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors duration-300 text-sm">
                  <FaYoutube className="w-4 h-4" /> YouTube
                </a>
                <a href="https://x.com/AlgoBuddy_" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors duration-300 text-sm">
                  <FaTwitter className="w-4 h-4" /> Twitter
                </a>
              </div>
            </div>

            {/* Legal */}
            <div>
              <h3 className={footerHeading}>Legal</h3>
              <div className="space-y-4">
                <button onClick={() => setShowPolicyModal(true)} className={footerLink}>
                  Privacy Policy
                </button>
                <button onClick={() => setShowTermsModal(true)} className={footerLink}>
                  Terms of Service
                </button>
                <button onClick={() => setShowCookieModal(true)} className={footerLink}>
                  Cookies Policy
                </button>
                <Link href="/code-of-conduct" className={footerLink}>
                  Code of Conduct
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="border-t border-white/10 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
            <p>© {new Date().getFullYear()} AlgoBuddy. All rights reserved.</p>
            <p>
              Made with <span className="text-primary">💜</span> by developers, for developers.
            </p>
          </div>
        </div>
      </footer>

      <PrivacyPolicyModal isOpen={showPolicyModal} onClose={() => setShowPolicyModal(false)} />
      <TermsOfServiceModal isOpen={showTermsModal} onClose={() => setShowTermsModal(false)} />
      <CookiePolicyModal isOpen={showCookieModal} onClose={() => setShowCookieModal(false)} />
    </>
  );
};

export default Footer;
