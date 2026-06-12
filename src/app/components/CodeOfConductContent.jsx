import { codeOfConductSections } from '@/app/data/codeOfConductData'
import Link from "next/link";
export default function CodeOfConductContent() {
  return (
    <>
      <p className="mb-6 text-udemy-muted dark:text-udemy-dark-muted leading-relaxed">
           This Code of Conduct outlines the standards of behavior expected from all users and contributors of our platform. It explains our commitment to creating a respectful, inclusive, and collaborative environment, along with the responsibilities, reporting process, and actions taken to maintain a positive community experience.
          </p>

          {/* Cookie policy sections */}
          <div className="space-y-6">
            <ul>
              {codeOfConductSections.map((item, index) => (
                <li key={index} className="mb-4">
                  <div className="bg-udemy-surface dark:bg-udemy-dark-surface p-5 rounded-xl border border-udemy-border dark:border-udemy-dark-border transition-all duration-300">
                    <div className="flex items-start">
                      <span className="w-6 h-6 flex-shrink-0 font-semibold bg-udemy-purple/10 dark:bg-udemy-purple/20 rounded-full flex items-center justify-center text-udemy-purple dark:text-udemy-purple-light mr-3 mt-0.5">
                        {item.id}
                      </span>
                      <h3 className="text-xl font-bold font-serif text-udemy-text dark:text-udemy-dark-text mb-2">
                        {item.title}
                      </h3>
                    </div>
                    {item.points && (
                      <ul className="space-y-2 text-udemy-muted dark:text-udemy-dark-muted pl-9 mb-2">
                        {item.points.map((subitem, subindex) => (
                          <li
                            key={subindex}
                            className="list-disc text-udemy-muted dark:text-udemy-dark-muted pl-1"
                          >
                            <span className="text-udemy-muted dark:text-udemy-dark-muted">
                              {subitem}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                    {item.data && (
                      <p className="text-udemy-muted dark:text-udemy-dark-muted pl-9 leading-relaxed">
                        {item.data}
                      </p>
                    )}
                    {item.contact && (
                      <div className="pl-9 mt-2">
                        <a
                          href={`mailto:${item.contact}`}
                          className="font-medium text-udemy-text dark:text-udemy-dark-text hover:underline"
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
          <div className="mt-8 pt-4 border-t border-udemy-border dark:border-udemy-dark-border">
            <p className="text-xs text-udemy-muted dark:text-udemy-dark-muted">
              Last updated: May 17, 2025
            </p>
          </div>
      

        {/* Footer with close button */}
        <div className="sticky bottom-0 bg-white dark:bg-udemy-dark-surface border-t border-udemy-border dark:border-udemy-dark-border p-4 flex justify-end">
          <Link
            href="/"
            className="px-6 py-2.5 bg-udemy-purple hover:bg-udemy-purple-dark text-white font-semibold rounded-lg transition-all duration-200 active:scale-95 text-sm"
          >
            Accept & Continue
          </Link>
        </div>
    </>
  )
}