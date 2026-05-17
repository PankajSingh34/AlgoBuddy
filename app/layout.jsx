import "./globals.css";
import Script from "next/script";
import { SpeedInsights } from "@vercel/speed-insights/next";
import ClientLayoutWrapper from "@/app/components/ui/ClientLayoutWrapper";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes"
import { Sora, Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google'

const sora = Sora({ subsets: ['latin'], variable: '--font-display', display: 'swap' })
const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-body', display: 'swap' })
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap' })

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export const metadata = {
  metadataBase: new URL("https://algobuddy.in"),
  title: "AlgoBuddy | Visualize & Learn DSA the Smart Way",
  description:
    "Master Data Structures and Algorithms with interactive visualizations. Perfect for students, beginners, and interview prep. Visualize Stack, Queue, Tree, Graph, Sorting & more.",
  keywords: [
    "AlgoBuddy",
    "DSA Visualizer",
    "Data Structures and Algorithms",
    "Visual DSA Tool",
    "Learn DSA Online",
    "DSA for Beginners",
    "DSA Practice",
    "Stack Visualizer",
    "Queue Visualizer",
    "Graph Visualizer",
    "Sorting Algorithms",
  ],
  authors: [{ name: "Sohan Rout" }],
  creator: "Sohan Rout",
  publisher: "AlgoBuddy",
  robots: "index, follow",
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "AlgoBuddy | Visualize & Learn DSA the Smart Way",
    description:
      "Interactive platform to visualize and learn DSA concepts easily. Great for students and interview preparation.",
    url: "https://algobuddy.in/",
    siteName: "AlgoBuddy",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "AlgoBuddy Preview Image",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AlgoBuddy | Learn DSA the Smart Way",
    description:
      "Visualize algorithms like Stack, Queue, Graphs, and Sorting in real-time. Learn DSA interactively.",
    images: ["/og.png"],
  },
};

export default async function RootLayout({ children }) {
  return (
    <html lang="en" className={`${sora.variable} ${jakarta.variable} ${mono.variable}`} suppressHydrationWarning data-scroll-behavior="smooth">
      <body>
        <meta name="application-name" content="AlgoBuddy" />
        <meta property="og:site_name" content="AlgoBuddy" />
        <link rel="icon" href="/favicon.ico?v=2" />

        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}

        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-primary focus:text-[hsl(var(--primary-foreground))] focus:rounded-md focus:shadow-lg">
          Skip to content
        </a>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <TooltipProvider>
            <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
          </TooltipProvider>
        </ThemeProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
