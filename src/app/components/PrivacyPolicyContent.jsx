import { policySections } from "./PrivacyPolicyModal";

export default function PrivacyPolicyContent() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <p className="text-xs font-medium uppercase tracking-[0.14em] text-udemy-muted dark:text-udemy-dark-muted">
        Legal
      </p>

      <h1 className="mt-2 text-4xl font-bold text-udemy-text dark:text-udemy-dark-text">
        Privacy Policy
      </h1>

      <p className="mt-4 max-w-2xl text-udemy-muted dark:text-udemy-dark-muted">
        Your privacy is important to us. This Privacy Policy explains how
        we collect, use, store, and protect your information when you use
        our website and services.
      </p>

      <p className="mt-2 text-sm text-udemy-muted dark:text-udemy-dark-muted">
        Last updated: May 29, 2026
      </p>
        
      <div className="mt-10 grid gap-8 lg:grid-cols-[250px_1fr]">
        <aside>
          <h2 className="mb-4 text-sm font-semibold uppercase text-udemy-text dark:text-udemy-dark-text">
            Contents
          </h2>

          <ul className="space-y-2">
            {policySections.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className="text-sm text-udemy-muted dark:text-udemy-dark-muted hover:text-udemy-text dark:hover:text-udemy-dark-text"
                >
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
        </aside>

        <div className="space-y-10">
          {policySections.map((item) => (
            <section key={item.id} id={item.id} className="text-udemy-muted dark:text-udemy-dark-muted">
              <h2 className="text-2xl font-semibold mb-3 text-udemy-text dark:text-udemy-dark-text">
                {item.title}
              </h2>

              {item.points && (
                <ul className="list-disc pl-6 space-y-2">
                  {item.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              )}

              {item.data && (
                <p className="mt-3">{item.data}</p>
              )}

              {item.contact && (
                <p className="mt-3">{item.contact}</p>
              )}
            </section>
            
          ))}
        </div>
      </div>
    </div>
  );
}