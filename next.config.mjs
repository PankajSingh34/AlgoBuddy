/** @type {import('next').NextConfig} */

const cspDirectives = [
  "default-src 'self'",
  // Inline scripts are required for the theme-flash prevention script and Google Analytics
  // in app/layout.jsx. Monaco Editor (used in visualizers) requires 'unsafe-eval' for workers.
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://challenges.cloudflare.com https://va.vercel-scripts.com",
  "style-src 'self' 'unsafe-inline'",
  // blob: and data: are needed for Monaco Editor worker blobs and inline SVG/image assets
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  // wss: for Supabase Realtime websocket; vitals.vercel-insights.com for Speed Insights
  "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://www.google-analytics.com https://analytics.google.com https://challenges.cloudflare.com https://vitals.vercel-insights.com",
  // Cloudflare Turnstile renders its widget inside an iframe from this origin
  "frame-src https://challenges.cloudflare.com",
  // Prevent this site from being embedded in any frame anywhere
  "frame-ancestors 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  // Prevent browsers from MIME-sniffing a response away from the declared content-type
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  // Block this site from being rendered inside a frame or iframe (clickjacking defence)
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  // Control how much referrer information is sent with requests
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  // Force HTTPS for 2 years, including subdomains; eligible for browser preload lists
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  // Restrict access to sensitive browser APIs that this app does not use
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=()",
  },
  // Full Content Security Policy — see directive comments above
  {
    key: "Content-Security-Policy",
    value: cspDirectives,
  },
];

const nextConfig = {
  async headers() {
    return [
      {
        // Apply security headers to every route
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
