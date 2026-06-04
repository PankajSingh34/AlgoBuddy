import React, { useEffect, useMemo, useRef, useState } from "react";
import { FiX } from "react-icons/fi";

const cookieSections = [
  {
    id: "what-are-cookies",
    title: "What Are Cookies",
    data: "Cookies are small text files that are stored on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and understanding how you use our site.",
  },
  {
    id: "types-of-cookies",
    title: "Types of Cookies We Use",
    points: [
      "Essential Cookies: Required for basic site functionality and security",
      "Performance Cookies: Help us understand how visitors interact with our website",
      "Functionality Cookies: Remember your preferences and settings",
      "Analytics Cookies: Collect information about your usage patterns",
    ],
  },
  {
    id: "how-we-use-cookies",
    title: "How We Use Cookies",
    points: [
      "To authenticate users and prevent fraudulent use",
      "Remember your preferences and settings",
      "Analyze site traffic and usage patterns",
      "Improve our website performance and user experience",
      "Provide personalized content when available",
    ],
  },
  {
    id: "third-party-cookies",
    title: "Third-Party Cookies",
    data: "We may also use cookies from trusted third-party services for analytics, performance monitoring, and other functionality. These third parties have their own privacy policies governing cookie usage.",
  },
  {
    id: "cookie-management",
    title: "Cookie Management",
    points: [
      "You can control cookie settings through your browser preferences",
      "Most browsers allow you to refuse or delete cookies",
      "Disabling essential cookies may affect website functionality",
      "You can opt-out of analytics cookies using our cookie preferences tool",
    ],
  },
  {
    id: "your-choices",
    title: "Your Choices",
    data: "You have the right to accept or reject cookies. Most web browsers automatically accept cookies, but you can usually modify your browser setting to decline cookies if you prefer. However, this may prevent you from taking full advantage of the website.",
  },
  {
    id: "cookie-duration",
    title: "Cookie Duration",
    data: "Session cookies are temporary and expire when you close your browser. Persistent cookies remain on your device for a set period or until you delete them.",
  },
  {
    id: "updates-to-cookie-policy",
    title: "Updates to Cookie Policy",
    data: "We may update this Cookie Policy from time to time to reflect changes in technology, legislation, or our operations. We encourage you to periodically review this page for the latest information.",
  },
  {
    id: "contact-information",
    title: "Contact Information",
    data: "If you have any questions about our use of cookies, please contact us at",
    contact: "hello@algobuddy.in",
  },
];

const CookiePolicyModal = ({ isOpen, onClose }) => {
  const modalRef = useRef(null);
  const closeBtnRef = useRef(null);
  const scrollRef = useRef(null);
  const sectionRefs = useRef({});
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState(cookieSections[0].id);

  const focusableSelector = useMemo(
    () =>
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    []
  );

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      const frame = requestAnimationFrame(() => setIsVisible(true));
      return () => cancelAnimationFrame(frame);
    }
    setIsVisible(false);
    const timeout = setTimeout(() => setShouldRender(false), 220);
    return () => clearTimeout(timeout);
  }, [isOpen]);

  useEffect(() => {
    if (shouldRender) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [shouldRender]);

  useEffect(() => {
    if (!shouldRender || !modalRef.current) return;
    const previouslyFocused = document.activeElement;
    closeBtnRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab") return;
      const focusables = Array.from(
        modalRef.current.querySelectorAll(focusableSelector)
      ).filter((el) => !el.hasAttribute("disabled"));
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      if (previouslyFocused && typeof previouslyFocused.focus === "function") {
        previouslyFocused.focus();
      }
    };
  }, [shouldRender, onClose, focusableSelector]);

  useEffect(() => {
    if (!shouldRender || !scrollRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible.length > 0) {
          setActiveSection(visible[0].target.id);
        }
      },
      {
        root: scrollRef.current,
        rootMargin: "-25% 0px -55% 0px",
        threshold: [0.1, 0.25, 0.5, 0.75],
      }
    );
    cookieSections.forEach((item) => {
      const section = sectionRefs.current[item.id];
      if (section) observer.observe(section);
    });
    return () => observer.disconnect();
  }, [shouldRender]);

  const handleScroll = () => {
    const node = scrollRef.current;
    if (!node) return;
    const max = node.scrollHeight - node.clientHeight;
    const progress = max > 0 ? (node.scrollTop / max) * 100 : 0;
    setScrollProgress(Math.min(100, Math.max(0, progress)));
  };

  const scrollToSection = (id) => {
    const scroller = scrollRef.current;
    const section = sectionRefs.current[id];
    if (!scroller || !section) return;
    const headerOffset = 120;
    const top =
      section.getBoundingClientRect().top -
      scroller.getBoundingClientRect().top +
      scroller.scrollTop -
      headerOffset;
    scroller.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
    setActiveSection(id);
  };

  if (!shouldRender) return null;

  return (
    <div className="fixed inset-0 z-[9999]">
      <div
        className={`fixed inset-0 bg-black/60 transition-opacity duration-200 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cookie-policy-title"
        className={`relative flex h-screen w-screen max-w-none flex-col overflow-hidden bg-white text-neutral-900 transition-all duration-200 dark:bg-neutral-900 dark:text-neutral-100 ${
          isVisible
            ? "translate-y-0 opacity-100 scale-100"
            : "translate-y-2 opacity-0 scale-[0.99]"
        }`}
      >
        {/* Header */}
        <div className="sticky top-0 z-20 border-b border-neutral-200 bg-white/95 px-5 py-2.5 backdrop-blur-sm sm:px-7 dark:border-neutral-700 dark:bg-neutral-900/95">
          <div
            className="absolute left-0 top-0 h-[1.5px] bg-neutral-800 transition-[width] duration-150 dark:bg-neutral-200"
            style={{ width: `${scrollProgress}%` }}
            aria-hidden="true"
          />
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-neutral-500 dark:text-neutral-400">
                Legal
              </p>
              <h2
                id="cookie-policy-title"
                className="mt-0.5 text-lg font-semibold tracking-tight sm:text-xl"
              >
                Cookie Policy
              </h2>
            </div>
            <button
              ref={closeBtnRef}
              onClick={onClose}
              className="rounded-md border border-neutral-300 p-1.5 text-neutral-600 transition-colors hover:bg-neutral-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-800"
              aria-label="Close Cookie Policy"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="min-h-0 flex-1 overflow-y-auto scroll-smooth px-5 py-5 sm:px-7 sm:py-6 scrollbar-thin scrollbar-thumb-neutral-400 scrollbar-track-transparent dark:scrollbar-thumb-neutral-600"
          style={{ scrollPaddingTop: "6.5rem", scrollPaddingBottom: "5rem" }}
        >
          <div className="mx-auto w-full max-w-4xl">
            <p className="max-w-2xl text-[15px] leading-7 text-neutral-700 dark:text-neutral-300 sm:text-base">
              This Cookie Policy explains how we use cookies and similar
              technologies on our website. It describes the types of cookies we
              use, their purposes, and how you can manage your cookie
              preferences.
            </p>
            <p className="mt-2.5 text-xs text-neutral-500 dark:text-neutral-400 sm:text-sm">
              Last updated: May 17, 2025
            </p>

            <div className="mt-7 grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-8">
              {/* Sidebar */}
              <aside className="hidden lg:block">
                <nav className="sticky top-24" aria-label="Cookie policy sections">
                  <p className="mb-4 text-xs font-semibold uppercase tracking-[0.12em] text-neutral-500 dark:text-neutral-400">
                    Contents
                  </p>
                  <ul className="space-y-1.5">
                    {cookieSections.map((item) => (
                      <li key={item.id}>
                        <button
                          type="button"
                          onClick={() => scrollToSection(item.id)}
                          aria-current={
                            activeSection === item.id ? "location" : undefined
                          }
                          className={`text-left text-[13px] leading-5 transition-colors focus:outline-none focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-neutral-500 ${
                            activeSection === item.id
                              ? "font-medium text-neutral-900 dark:text-neutral-100"
                              : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
                          }`}
                        >
                          {item.title}
                        </button>
                      </li>
                    ))}
                  </ul>
                </nav>
              </aside>

              {/* Main Content */}
              <div className="mx-auto w-full max-w-2xl">
                <div className="mb-6 lg:hidden">
                  <label
                    htmlFor="cookie-toc-select"
                    className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-neutral-500 dark:text-neutral-400"
                  >
                    Jump to section
                  </label>
                  <select
                    id="cookie-toc-select"
                    value={activeSection}
                    onChange={(event) => scrollToSection(event.target.value)}
                    className="w-full rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-sm text-neutral-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 dark:border-neutral-600 dark:bg-neutral-900 dark:text-neutral-100"
                  >
                    {cookieSections.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-9">
                  {cookieSections.map((item) => (
                    <section
                      key={item.id}
                      id={item.id}
                      ref={(node) => {
                        sectionRefs.current[item.id] = node;
                      }}
                      className="scroll-mt-24 border-b border-neutral-200 pb-7 last:border-b-0 last:pb-0 dark:border-neutral-700"
                    >
                      <h3 className="text-lg font-semibold tracking-tight sm:text-xl">
                        {item.title}
                      </h3>
                      {item.points && (
                        <ul className="mt-3.5 space-y-1.5 pl-5 text-[14px] leading-6 text-neutral-700 marker:text-neutral-500 dark:text-neutral-300 dark:marker:text-neutral-400 sm:text-[15px] sm:leading-7">
                          {item.points.map((subitem) => (
                            <li key={subitem} className="list-disc">
                              {subitem}
                            </li>
                          ))}
                        </ul>
                      )}
                      {item.data && (
                        <p className="mt-3.5 text-[14px] leading-6 text-neutral-700 dark:text-neutral-300 sm:text-[15px] sm:leading-7">
                          {item.data}
                        </p>
                      )}
                      {item.contact && (
                        <a
                          href={`mailto:${item.contact}`}
                          className="mt-2 block text-[14px] font-semibold text-neutral-800 underline hover:text-neutral-600 dark:text-neutral-200 dark:hover:text-neutral-400"
                        >
                          {item.contact}
                        </a>
                      )}
                    </section>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 flex justify-end border-t border-neutral-200 bg-white/95 p-3 backdrop-blur-sm dark:border-neutral-700 dark:bg-neutral-900/95">
          <button
            onClick={onClose}
            className="rounded-md border border-neutral-300 bg-neutral-900 px-4 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-neutral-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 dark:border-neutral-600 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-300"
          >
            Accept & Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicyModal;