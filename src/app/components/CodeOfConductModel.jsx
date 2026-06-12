import React, { useEffect } from 'react'
import { FiX } from 'react-icons/fi'

const codeOfConductSections = [
  {
    id: '1',
    title: 'Our Pledge',
    points: [
      'We as contributors and maintainers pledge to make participation in this project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.',
      'We are committed to creating an open, welcoming, inclusive, and respectful environment for everyone.',
    ],
  },
  {
    id: '2',
    title: 'Our Standards',
    data: 'Examples of behavior that contributes to a positive environment include:',
    points: [
      'Being respectful and inclusive',
      'Using welcoming and constructive language',
      'especting differing viewpoints and experiences',
      'Gracefully accepting constructive criticism',
      'Helping other contributors and community members',
    ],
    data: 'Examples of unacceptable behavior include:',
    points: [
      'Harassment or discriminatory language',
      'Personal attacks or trolling',
      'Public or private harassment',
      'Publishing others’ private information without permission',
      'Any conduct that could be considered inappropriate in a professional setting',
    ],
  },
  {
    id: '3',
    title: 'Contributor Responsibilities',
    data: 'Contributors are expected to:',
    points: [
      'Follow project guidelines',
      'Maintain respectful communication',
      'Focus on collaboration and learning',
      'Report inappropriate behavior if encountered',
    ],
  },
  {
    id: '4',
    title: 'Enforcement',
    data: 'Project maintainers are responsible for clarifying and enforcing standards of acceptable behavior and may take appropriate corrective action in response to any instances of unacceptable behavior.',
  },
  {
    id: '5',
    title: 'Reporting Issues',
    data: [
      'If you experience or witness unacceptable behavior, please report it to the project maintainers through the repository issue section or the official project contact channels.',
      'All complaints will be reviewed and investigated promptly and fairly.',
    ],
  },
  {
    id: '6',
    title: 'Your Choices',
    data: 'This Code of Conduct applies within all project spaces, including:',
    points: [
      'GitHub repositories',
      'Discussions',
      'Pull requests',
      'Community chats',
      'Social platforms related to the project',
    ],
  },
  {
    id: '7',
    title: 'Attribution',
    data: 'This Code of Conduct is inspired by the Contributor Covenant, version 2.1.',
  }
]

const CodeOfConductModel = ({ isOpen, onClose }) => {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop with fade-in animation */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal container with slide-up animation */}
      <div className="relative bg-white dark:bg-udemy-dark-surface text-udemy-text dark:text-udemy-dark-text max-w-3xl w-full rounded-xl shadow-2xl overflow-hidden transform transition-all duration-300 max-h-[90vh] flex flex-col border border-udemy-border dark:border-udemy-dark-border">
        {/* Header with close button */}
        <div className="sticky top-0 bg-white dark:bg-udemy-dark-surface border-b border-udemy-border dark:border-udemy-dark-border p-4 flex justify-between items-center z-10">
          <h2 className="text-xl font-semibold text-udemy-text dark:text-udemy-dark-text">
            Code Of Conduct
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md border border-udemy-border text-udemy-muted hover:bg-udemy-surface dark:border-udemy-dark-border dark:text-udemy-dark-muted dark:hover:bg-udemy-dark-surface transition-colors"
            aria-label="Close"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto p-6 scrollbar-thin">
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
        </div>

        {/* Footer with close button */}
        <div className="sticky bottom-0 bg-white dark:bg-udemy-dark-surface border-t border-udemy-border dark:border-udemy-dark-border p-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-udemy-purple hover:bg-udemy-purple-dark text-white font-semibold rounded-lg transition-all duration-200 active:scale-95 text-sm"
          >
            Accept & Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default CodeOfConductModel
