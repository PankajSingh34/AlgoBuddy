import React, { useEffect } from "react";
import { FiX } from "react-icons/fi";

const cookieSections = [
  {
    id: "1",
    title: "What Are Cookies",
    data: "Cookies are small text files that are stored on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and understanding how you use our site.",
  },
  {
    id: "2",
    title: "Types of Cookies We Use",
    points: [
      "Essential Cookies: Required for basic site functionality and security",
      "Performance Cookies: Help us understand how visitors interact with our website",
      "Functionality Cookies: Remember your preferences and settings",
      "Analytics Cookies: Collect information about your usage patterns",
    ],
  },
  {
    id: "3",
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
    id: "4",
    title: "Third-Party Cookies",
    data: "We may also use cookies from trusted third-party services for analytics, performance monitoring, and other functionality. These third parties have their own privacy policies governing cookie usage.",
  },
  {
    id: "5",
    title: "Cookie Management",
    points: [
      "You can control cookie settings through your browser preferences",
      "Most browsers allow you to refuse or delete cookies",
      "Disabling essential cookies may affect website functionality",
      "You can opt-out of analytics cookies using our cookie preferences tool",
    ],
  },
  {
    id: "6",
    title: "Your Choices",
    data: "You have the right to accept or reject cookies. Most web browsers automatically accept cookies, but you can usually modify your browser setting to decline cookies if you prefer. However, this may prevent you from taking full advantage of the website.",
  },
  {
    id: "7",
    title: "Updates to Cookie Policy",
    data: "We may update this Cookie Policy from time to time to reflect changes in technology, legislation, or our operations. We encourage you to periodically review this page for the latest information.",
  },
  {
    id: "8",
    title: "Contact Information",
    data: "If you have any questions about our use of cookies, please contact us at",
    contact: "hello@algobuddy.in",
  },
];

const CookiePolicyModal = ({ isOpen, onClose }) => {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm transition-opacity duration-300 dark:bg-neutral-900/60"
        onClick={onClose}
      />

      {/* Modal container */}
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="cookie-modal-title"
        className="relative bg-white dark:bg-[#0a0a0a] text-neutral-800 dark:text-neutral-200 max-w-3xl w-full rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 max-h-[90vh] flex flex-col border border-neutral-200 dark:border-neutral-800"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white/90 dark:bg-[#0a0a0a]/90 backdrop-blur-md border-b border-neutral-100 dark:border-neutral-800 px-6 py-5 flex justify-between items-center z-10">
          <h2 id="cookie-modal-title" className="text-xl font-semibold tracking-tight text-neutral-900 dark:text-white">
            Cookie Policy
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-neutral-500 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800 transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-200 dark:focus:ring-neutral-700"
            aria-label="Close"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto px-6 py-8 scroll-smooth scrollbar-thin scrollbar-thumb-neutral-200 dark:scrollbar-thumb-neutral-800">
          <div className="max-w-2xl mx-auto space-y-10">
            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-[15px]">
              This Cookie Policy explains how we use cookies and similar
              technologies on our website. It describes the types of cookies we
              use, their purposes, and how you can manage your cookie preferences.
            </p>

            <div className="space-y-10">
              {cookieSections.map((item) => (
                <section key={item.id} className="scroll-mt-20">
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4 tracking-tight flex items-baseline gap-2">
                    <span className="text-neutral-400 dark:text-neutral-500 font-medium text-sm">{item.id}.</span>
                    {item.title}
                  </h3>
                  
                  {item.points && (
                    <ul className="space-y-3 mb-4">
                      {item.points.map((subitem, subindex) => (
                        <li
                          key={subindex}
                          className="flex items-start text-neutral-600 dark:text-neutral-400 leading-relaxed text-[15px]"
                        >
                          <span className="mr-3 text-neutral-300 dark:text-neutral-600 mt-1.5 text-xs">
                            •
                          </span>
                          <span>{subitem}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {item.data && (
                    <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-[15px] mb-4">
                      {item.data}
                    </p>
                  )}
                  {item.contact && (
                    <div>
                      <a
                        href={`mailto:${item.contact}`}
                        className="text-primary hover:text-primary/80 dark:text-primary dark:hover:text-primary/80 font-medium transition-colors focus:outline-none focus:underline"
                      >
                        {item.contact}
                      </a>
                    </div>
                  )}
                </section>
              ))}
            </div>

            {/* Additional Info */}
            <section className="pt-8 border-t border-neutral-100 dark:border-neutral-800/60">
              <h4 className="text-base font-semibold text-neutral-900 dark:text-neutral-100 mb-3 flex items-center gap-2">
                <span role="img" aria-label="cookie">🍪</span> Cookie Duration
              </h4>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-[15px]">
                Session cookies are temporary and expire when you close your
                browser. Persistent cookies remain on your device for a set period
                or until you delete them.
              </p>
            </section>

            <div className="pt-2">
              <p className="text-sm text-neutral-400 dark:text-neutral-500">
                Last updated: May 17, 2025
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-neutral-50/90 dark:bg-[#0a0a0a]/90 backdrop-blur-md border-t border-neutral-100 dark:border-neutral-800 px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white font-medium rounded-lg transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-900 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 dark:focus:ring-white dark:focus:ring-offset-neutral-900 text-sm shadow-sm"
          >
            Accept & Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicyModal;
