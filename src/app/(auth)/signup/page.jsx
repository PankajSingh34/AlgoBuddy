import Head from "next/head";
import AuthForm from "@/app/components/ui/AuthForm";

export default function SignupPage() {
  return (
    <>
      <Head>
        <link rel="stylesheet" href="/styles/dark-mode.css" />
      </Head>
      <AuthForm isLogin={false} />
      <button className="toggle" id="theme-toggle">🌙 Dark mode</button>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            // Load persisted theme
            const saved = localStorage.getItem('theme');
            const root = document.documentElement;
            if (saved) root.dataset.theme = saved;
            const btn = document.getElementById('theme-toggle');
            const setTheme = (t) => {
              root.dataset.theme = t;
              localStorage.setItem('theme', t);
              btn.textContent = t === 'dark' ? '☀️ Light mode' : '🌙 Dark mode';
            };
            btn.addEventListener('click', () => {
              setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark');
            });
            // Initialize button label
            btn.textContent = root.dataset.theme === 'dark' ? '☀️ Light mode' : '🌙 Dark mode';
          `
        }}
      />
    </>
  );
}

