import { codeOfConductSections } from "@/app/data/codeOfConductData";
import Link from "next/link";

export default function CodeOfConductContent() {
  return (
    <>
      <p className="mb-8 text-gray-700 dark:text-gray-300 leading-relaxed text-base">
        This Code of Conduct outlines the standards of behavior expected from
        all users and contributors of our platform. It explains our commitment
        to creating a respectful, inclusive, and collaborative environment,
        along with the responsibilities, reporting process, and actions taken to
        maintain a positive community experience.
      </p>

      <div className="space-y-6">
        <ul>
          {codeOfConductSections.map((item, index) => (
            <li key={index} className="mb-4">
              <div className="bg-white dark:bg-[#14141A] p-6 rounded-2xl border border-gray-200 dark:border-[#2A2A35] transition-all duration-300">
                <div className="flex items-start mb-3">
                  <span className="w-7 h-7 flex-shrink-0 font-semibold text-gray-500 bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    {item.id}
                  </span>

                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{item.title}</h3>
                </div>

                {item.points && (
                  <ul className="space-y-3 pl-8">
                    {item.points.map((subitem, subindex) => (
                      <li
                        key={subindex}
                        className="list-disc text-gray-700 dark:text-gray-300 leading-relaxed"
                      >
                        {subitem}
                      </li>
                    ))}
                  </ul>
                )}

                {item.data && (
                  <p className="text-gray-700 dark:text-gray-300 pl-8 leading-relaxed">
                    {item.data}
                  </p>
                )}

                {item.contact && (
                  <div className="pl-8 mt-3">
                    <a
                      href={`mailto:${item.contact}`}
                      className="text-gray-900 dark:text-white font-medium transition-colors"
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

      <div className="mt-8 pt-4 border-t border-gray-200 dark:border-[#2A2A35]">
        <p className="text-sm text-gray-500 dark:text-gray-400">Last updated: May 17, 2025</p>
      </div>

      <div className="sticky bottom-0 bg-white/95 dark:bg-[#0B0B0F]/95 backdrop-blur-md border-t border-gray-200 dark:border-[#2A2A35] p-4 flex justify-end mt-8">
        <Link
          href="/"
          className="px-6 py-3 bg-black text-white dark:bg-white dark:text-black font-semibold rounded-full hover:opacity-90 transition-all duration-200 active:scale-95"
        >
          Accept & Continue
        </Link>
      </div>
    </>
  );
}
