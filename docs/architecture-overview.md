# Architecture Overview

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| UI Library | React 19 |
| Styling | Tailwind CSS 3.4 |
| Database/Auth | Supabase (PostgreSQL + Auth) |
| Animation | GSAP, Framer Motion |
| Charts | Recharts |
| Code Editor | Monaco Editor |
| AI | Google Gemini API |
| Email | Nodemailer (Gmail) |
| CAPTCHA | Cloudflare Turnstile |
| Rate Limiting | Upstash Redis |
| Analytics | Google Analytics 4 |

## Project Structure

```
src/
├── app/                    # Next.js App Router pages & API
│   ├── (auth)/             # Login / Signup pages
│   ├── (marketing)/        # Marketing pages
│   ├── api/                # API route handlers
│   ├── blog/               # Blog pages
│   ├── components/         # Shared React components
│   ├── dashboard/          # User dashboard
│   ├── hooks/              # Custom React hooks
│   ├── practice/           # Practice problems
│   ├── visualizer/         # Algorithm visualizer
│   ├── layout.jsx          # Root layout
│   └── globals.css         # Global styles
├── features/               # Feature modules
│   ├── algorithms/         # Algorithm implementations
│   ├── notifications/      # Notification system
│   └── user/               # User context & auth
├── lib/                    # Utility libraries
│   ├── rateLimit/          # Rate limiting logic
│   ├── sandbox/            # Code sandbox
│   ├── collaboration/      # Collab features
│   ├── visualizer/         # Visualizer engine
│   ├── env.js              # Env validation
│   ├── supabase.js         # Supabase client
│   ├── csrf.js             # CSRF protection
│   └── verifyTurnstile.js  # CAPTCHA verification
└── utils/                  # Helper functions
```

## Key Architecture Decisions

### 1. App Router with Server Components
- Pages default to server components where possible
- `"use client"` directive only where interactivity is needed
- API routes in `app/api/` use Next.js Route Handlers

### 2. Authentication Flow
- Supabase SSR auth with cookie-based sessions
- Middleware (`src/middleware.js`) handles token refresh and redirects
- `UserContext` provides client-side auth state
- API routes use `getAuthenticatedUser()` from `lib/auth.js`

### 3. State Management
- React Context for global state (User, Notifications)
- `useState`/`useReducer` for local state
- localStorage for persisted preferences (theme, progress)
- No external state management library (avoids unnecessary complexity)

### 4. API Route Pattern

All API routes follow this pattern:

```javascript
import { getAuthenticatedUser } from "@/lib/auth";
import { errorResponse, jsonResponse } from "@/lib/serverApi";

export async function POST(request) {
  try {
    const auth = await getAuthenticatedUser();
    if (!auth.success) {
      return errorResponse(new AuthError());
    }
    // ... handler logic
    return jsonResponse({ data: result });
  } catch (err) {
    return errorResponse(err);
  }
}
```

### 5. Rate Limiting
- Two-tier system: Redis (Upstash) with in-memory fallback
- Identity resolution: JWT user ID > client IP
- Separate limiters for auth, API, sandbox, and chatbot endpoints

### 6. CSRF Protection
- Double-submit cookie pattern
- Tokens generated server-side with HMAC-SHA256
- Validated on state-changing methods (POST, PUT, PATCH, DELETE)

### 7. Code Sandbox
- `isolated-vm` for secure JS execution
- Sandboxed code running in a separate V8 isolate
- Timeout and memory limits enforced

## Component Architecture

### UI Components (`src/app/components/ui/`)
- Pure presentational components
- Accept props, render JSX
- No direct side effects or data fetching
- Reusable across multiple pages

### Feature Components (`src/app/components/`)
- Higher-level components with business logic
- May use hooks and context
- Often page-specific

### Visualizer Components
- Algorithm step generators in `src/features/algorithms/`
- Rendering components in `src/app/components/visualizer/`
- Animation engine using GSAP + Framer Motion

## Environment Variables

All environment variables are validated through `src/lib/env.js`.

Required variables:
- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anon key
- `TURNSTILE_SECRET_KEY` — Cloudflare Turnstile secret
- `GEMINI_API_KEY` — Google Gemini API key

See `.env.example` for the complete reference.
