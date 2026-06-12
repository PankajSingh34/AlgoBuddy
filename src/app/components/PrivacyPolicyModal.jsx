import React, { useEffect, useMemo, useRef, useState } from "react";
import { FiX } from "react-icons/fi";

export const policySections = [
  {
    id: "information-we-collect",
    title: "Information We Collect",
    points: [
      "Name",
      "Email address",
      "Authentication information (such as sign-in provider and account identifiers)",
      "Device and browser information (such as IP address, browser type, operating system, and device metadata)",
      "Usage analytics (such as pages visited, features used, and interaction events)",
    ],
  },
  {
    id: "how-we-use-your-information",
    title: "How We Use Your Information",
    points: [
      "Account management, including account creation, login, and profile maintenance",
      "Service improvement, including feature development, bug fixing, and performance optimization",
      "Security monitoring to detect abuse, fraud, and unauthorized access attempts",
      "User support, including responding to questions, troubleshooting, and service communication",
    ],
  },
  {
    id: "cookies-and-tracking-technologies",
    title: "Cookies and Tracking Technologies",
    points: [
      "Essential cookies that are necessary for core platform functionality such as authentication and session continuity",
      "Analytics cookies that help us understand product usage and improve platform performance",
      "Preference cookies that remember your settings and improve personalization",
    ],
  },
  {
    id: "data-storage-and-security",
    title: "Data Storage and Security",
    points: [
      "We use encryption and transport security practices to protect data in transit and, where applicable, at rest",
      "We apply secure data handling processes and access controls for internal systems",
      "We maintain safeguards to reduce the risk of unauthorized access, disclosure, alteration, or destruction of data",
    ],
  },
  {
    id: "third-party-services",
    title: "Third-Party Services",
    points: [
      "Authentication providers that help us support secure sign-in",
      "Analytics providers that assist with usage measurement and service quality monitoring",
      "External APIs and service providers required to deliver product features",
    ],
  },
  {
    id: "user-rights",
    title: "User Rights",
    points: [
      "Access personal data we hold about you",
      "Correct inaccurate or incomplete personal data",
      "Delete personal data, subject to legal and operational obligations",
      "Request export of your personal data in a portable format where applicable",
    ],
  },
  {
    id: "data-retention",
    title: "Data Retention",
    data: "We retain personal data for as long as needed to provide our services, comply with legal obligations, resolve disputes, and enforce agreements. Retention periods vary based on the type of data and the purpose for which it was collected.",
  },
  {
    id: "childrens-privacy",
    title: "Children's Privacy",
    data: "Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.",
  },
  {
    id: "policy-updates",
    title: "Policy Updates",
    data: "We may update this Privacy Policy from time to time. Changes become effective when posted, and we may notify users through in-product notices or other appropriate communication channels when material updates occur.",
  },
  {
    id: "contact-information",
    title: "Contact Information",
    data: "For privacy-related questions, requests, or concerns, please contact our support team.",
    contact: "[Support contact details to be added]",
  },
];

const PrivacyPolicyModal = ({ isOpen, onClose }) => {
  const modalRef = useRef(null);
  const closeBtnRef = useRef(null);
  const scrollRef = useRef(null);
  const sectionRefs = useRef({});
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState(policySections[0].id);

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
        const visible = entries.filter((entry) => entry.isIntersecting);

        if (visible.length === 0) return;

        const mostVisible = visible.reduce((prev, current) =>
          current.intersectionRatio > prev.intersectionRatio ? current : prev
      );

      setActiveSection(mostVisible.target.id);
    },
    {
      root: scrollRef.current,
      rootMargin: "-25% 0px -55% 0px",
      threshold: [0.1, 0.25, 0.5, 0.75],
    }
  );

    policySections.forEach((item) => {
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
    if (node.scrollTop + node.clientHeight >= node.scrollHeight - 10) {
    setActiveSection("contact-information");
    }
  };

  const scrollToSection = (id) => {
    console.log("Scrolling to:", id);
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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4">
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
        aria-labelledby="privacy-policy-title"
        className={`relative flex h-[min(92vh,calc(100dvh-1.5rem))] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-udemy-border bg-udemy-surface text-udemy-text shadow-xl transition-all duration-200 sm:h-[min(90vh,calc(100dvh-2rem))] dark:border-udemy-dark-border dark:bg-udemy-dark-surface dark:text-udemy-dark-text ${
          isVisible
            ? "translate-y-0 opacity-100 scale-100"
            : "translate-y-2 opacity-0 scale-[0.99]"
        }`}
      >
        <div className="sticky top-0 z-20 border-b border-udemy-border bg-udemy-surface/95 px-5 py-2.5 backdrop-blur-sm sm:px-7 dark:border-udemy-dark-border dark:bg-udemy-dark-surface/95">
          <div
            className="absolute left-0 top-0 h-[1.5px] bg-udemy-purple transition-[width] duration-150 dark:bg-udemy-purple-light"
            style={{ width: `${scrollProgress}%` }}
            aria-hidden="true"
          />
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-udemy-muted dark:text-udemy-dark-muted">
                Legal
              </p>
              <h2
                id="privacy-policy-title"
                className="mt-0.5 text-lg font-semibold tracking-tight sm:text-xl"
              >
                Privacy Policy
              </h2>
            </div>
            <button
              ref={closeBtnRef}
              onClick={onClose}
              className="rounded-md border border-udemy-border p-1.5 text-udemy-muted transition-colors hover:bg-udemy-purple/10 focus:outline-none dark:border-udemy-dark-border dark:text-udemy-dark-muted dark:hover:bg-udemy-purple/20"
              aria-label="Close Privacy Policy"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="min-h-0 flex-1 overflow-y-auto scroll-smooth px-5 py-5 sm:px-7 sm:py-6 scrollbar-thin scrollbar-track-transparent"
          style={{ scrollPaddingTop: "6.5rem", scrollPaddingBottom: "5rem" }}
        >
          <div className="mx-auto w-full max-w-4xl">
            <p className="max-w-2xl text-[15px] leading-7 text-udemy-muted dark:text-udemy-dark-muted sm:text-base">
              Your privacy is important to us. This Privacy Policy explains how
              we collect, use, store, and protect your information when you use
              our website and services.
            </p>
            <p className="mt-2.5 text-xs text-udemy-muted dark:text-udemy-dark-muted sm:text-sm">
              Last updated: May 29, 2026
            </p>

            <div className="mt-7 grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-8">
              <aside className="hidden lg:block">
                <nav className="sticky top-24" aria-label="Privacy policy sections">
                  <p className="mb-4 text-xs font-semibold uppercase tracking-[0.12em] text-udemy-muted dark:text-udemy-dark-muted">
                    Contents
                  </p>
                  <ul className="space-y-1.5">
                    {policySections.map((item) => (
                      <li key={item.id}>
                        <button
                          type="button"
                          onClick={() => scrollToSection(item.id)}
                          aria-current={
                            activeSection === item.id ? "location" : undefined
                          }
                          className={`text-left text-[13px] leading-5 transition-colors focus:outline-none focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-udemy-purple ${
                            activeSection === item.id
                              ? "font-medium text-udemy-text dark:text-udemy-dark-text"
                              : "text-udemy-muted hover:text-udemy-text dark:text-udemy-dark-muted dark:hover:text-udemy-dark-text"
                          }`}
                        >
                          {item.title}
                        </button>
                      </li>
                    ))}
                  </ul>
                </nav>
              </aside>

              <div className="mx-auto w-full max-w-2xl">
                <div className="mb-6 lg:hidden">
                  <label
                    htmlFor="privacy-toc-select"
                    className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-udemy-muted dark:text-udemy-dark-muted"
                  >
                    Jump to section
                  </label>
                  <select
                    id="privacy-toc-select"
                    value={activeSection}
                    onChange={(event) => scrollToSection(event.target.value)}
                    className="w-full rounded-md border border-udemy-border bg-udemy-surface px-3 py-1.5 text-sm text-udemy-text focus:outline-none dark:border-udemy-dark-border dark:bg-udemy-dark-surface dark:text-udemy-dark-text"
                  >
                    {policySections.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-9 pb-24">
                  {policySections.map((item) => (
                    <section
                      key={item.id}
                      id={item.id}
                      ref={(node) => {
                        sectionRefs.current[item.id] = node;
                      }}
                      className="scroll-mt-24 border-b border-udemy-border pb-7 last:border-b-0 last:pb-0 dark:border-udemy-dark-border"
                    >
                      <h3 className="text-lg font-semibold tracking-tight sm:text-xl">
                        {item.title}
                      </h3>
                      {item.points && (
                        <ul className="mt-3 space-y-1 pl-5 text-[13px] leading-5 text-udemy-muted dark:text-udemy-dark-muted sm:text-[15px] sm:leading-7">
                          {item.points.map((subitem) => (
                            <li key={subitem} className="list-disc">
                              {subitem}
                            </li>
                          ))}
                        </ul>
                      )}
                      {item.data && (
                        <p className="mt-2.5 text-[13px] leading-5 text-udemy-muted dark:text-udemy-dark-muted sm:text-[15px] sm:leading-7">
                          {item.data}
                        </p>
                      )}
                      {item.contact && (
                        <p className="mt-2 text-[13px] leading-5 text-udemy-muted dark:text-udemy-dark-muted sm:text-[15px] sm:leading-7">
                          {item.contact}
                        </p>
                      )}
                    </section>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      

        <div className="sticky bottom-0 flex justify-end border-t border-udemy-border bg-udemy-surface/95 p-3 backdrop-blur-sm dark:border-udemy-dark-border dark:bg-udemy-dark-surface/95">
          <button
            onClick={onClose}
            className="rounded-md bg-udemy-purple px-4 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-udemy-purple-dark focus:outline-none"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyModal;
