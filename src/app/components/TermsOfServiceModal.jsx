import React, { useEffect } from "react";
import { termsSections } from "@/app/data/termsData";

const TermsOfServiceModal = ({ isOpen, onClose }) => {
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
      {/* Backdrop with fade-in animation */}
      <div
        className="fixed inset-0 bg-neutral-900/40 dark:bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal container */}
      <div 
        className="relative bg-white dark:bg-neutral-900 w-full max-w-2xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] overflow-hidden transform transition-all duration-300 max-h-[85vh] flex flex-col ring-1 ring-black/5 dark:ring-white/10"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header with close button */}
        <div className="flex-none px-6 py-4 flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800/60 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md z-10">
          <h2 id="modal-title" className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 tracking-tight">
            Terms of Service
          </h2>
          <button
            onClick={onClose}
            className="p-2 -mr-2 rounded-full text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-200 dark:focus-visible:ring-neutral-700"
            aria-label="Close modal"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 scrollbar-thin scrollbar-thumb-neutral-200 dark:scrollbar-thumb-neutral-700 scrollbar-track-transparent">
          <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
            <p className="mb-8 text-neutral-600 dark:text-neutral-400 leading-relaxed text-[15px]">
              Please read these terms and conditions carefully before using our
              website and services. Your access to and use of the service is
              conditioned on your acceptance of and compliance with these terms.
            </p>

            {/* Terms sections */}
            <div className="space-y-8">
              {termsSections.map((item, index) => (
                <section 
                  key={index} 
                  className="border-b border-neutral-100 dark:border-neutral-800/50 pb-8 last:border-0 last:pb-0"
                >
                  <h3 className="text-base sm:text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-3 flex items-baseline gap-2 tracking-tight">
                    <span className="text-neutral-400 dark:text-neutral-500 font-mono text-sm select-none">{item.id}.</span>
                    {item.title}
                  </h3>
                  
                  {item.points && (
                    <ul className="space-y-2.5 text-neutral-600 dark:text-neutral-400 pl-6 m-0">
                      {item.points.map((subitem, subindex) => (
                        <li 
                          key={subindex} 
                          className="list-disc pl-1 marker:text-neutral-300 dark:marker:text-neutral-600"
                        >
                          <span className="leading-relaxed text-[15px]">{subitem}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  
                  {item.data && (
                    <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-[15px] m-0">
                      {item.data}
                    </p>
                  )}
                  
                  {item.contact && (
                    <div className="mt-3">
                      <a
                        href={`mailto:${item.contact}`}
                        className="inline-flex font-medium text-neutral-900 dark:text-neutral-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        {item.contact}
                      </a>
                    </div>
                  )}
                </section>
              ))}
            </div>

            <div className="mt-10 pt-6 border-t border-neutral-100 dark:border-neutral-800/60">
              <p className="text-sm text-neutral-500 dark:text-neutral-500 m-0">
                Last updated: May 17, 2025
              </p>
            </div>
          </div>
        </div>

        {/* Footer with action button */}
        <div className="flex-none px-6 py-4 border-t border-neutral-100 dark:border-neutral-800/60 bg-neutral-50/80 dark:bg-neutral-900/80 backdrop-blur-md flex justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white font-medium rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-900 text-[15px] dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 shadow-sm"
          >
            I Agree
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsOfServiceModal;
