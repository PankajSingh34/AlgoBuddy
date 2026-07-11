import React, { useEffect } from "react";
import { FiX } from "react-icons/fi";
import { codeOfConductSections } from "@/app/data/codeOfConductData";

const CodeOfConductModal = ({ isOpen, onClose }) => {
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden rounded-2xl border border-[#2A2A35] bg-[#0F0F14] text-white shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#2A2A35] bg-[#0F0F14] p-4">
          <h2 className="text-xl font-semibold text-white">Code Of Conduct</h2>

          <button
            onClick={onClose}
            className="rounded-md border border-[#2A2A35] p-1.5 text-gray-300 transition-colors hover:bg-[#1A1A22]"
            aria-label="Close"
          >
            <FiX className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6">
          <p className="mb-6 leading-relaxed text-gray-300">
            This Code of Conduct outlines the standards of behavior expected
            from all users and contributors of our platform. It explains our
            commitment to creating a respectful, inclusive, and collaborative
            environment, along with the responsibilities, reporting process, and
            actions taken to maintain a positive community experience.
          </p>

          <div className="space-y-6">
            <ul>
              {codeOfConductSections.map((item, index) => (
                <li key={index} className="mb-4">
                  <div className="rounded-xl border border-[#2A2A35] bg-[#14141A] p-5 transition-all duration-300 hover:border-gray-400/40">
                    <div className="flex items-start">
                      <span className="mr-3 mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 font-semibold text-gray-400">
                        {item.id}
                      </span>

                      <h3 className="mb-2 text-xl font-bold text-white">
                        {item.title}
                      </h3>
                    </div>

                    {item.points && (
                      <ul className="mb-2 space-y-2 pl-9 text-gray-300">
                        {item.points.map((subitem, subindex) => (
                          <li
                            key={subindex}
                            className="list-disc pl-1 leading-relaxed text-gray-300"
                          >
                            {subitem}
                          </li>
                        ))}
                      </ul>
                    )}

                    {item.data && (
                      <p className="pl-9 leading-relaxed text-gray-300">
                        {item.data}
                      </p>
                    )}

                    {item.contact && (
                      <div className="mt-2 pl-9">
                        <a
                          href={`mailto:${item.contact}`}
                          className="font-medium text-gray-400 hover:text-gray-300 hover:underline"
                        >
                          {item.contact}
                        </a>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 border-t border-[#2A2A35] pt-4">
            <p className="text-xs text-gray-400">Last updated: May 17, 2025</p>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 flex justify-end border-t border-[#2A2A35] bg-[#0F0F14] p-4">
          <button
            onClick={onClose}
            className="rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-black transition-all duration-200 hover:bg-gray-200 active:scale-95"
          >
            Accept & Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CodeOfConductModal;
