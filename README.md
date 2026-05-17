<p align="center">
  <h1 align="center">AlgoBuddy</h1>
</p>

<p align="center">
  <strong>Pick an algorithm. Watch it run. Change the inputs. See what actually happens.</strong>
</p>

<p align="center">
  <a href="https://algobuddy.in"><img src="https://img.shields.io/badge/Live-Demo-brightgreen?style=flat-square" alt="Live Demo"></a>
  <a href="https://github.com/PankajSingh34/AlgoBuddy/actions"><img src="https://img.shields.io/github/actions/workflow/status/PankajSingh34/AlgoBuddy/test.yml?style=flat-square" alt="Build Status"></a>
  <a href="./LICENSE"><img src="https://img.shields.io/badge/License-Apache%202.0-blue.svg?style=flat-square" alt="License"></a>
  <a href="./CONTRIBUTING.md"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen?style=flat-square" alt="PRs Welcome"></a>
</p>

<p align="center">
  <a href="https://skillicons.dev">
    <img src="https://skillicons.dev/icons?i=git,js,react,nextjs,tailwind,supabase,redis,npm,vercel,googlecloud" />
  </a>
</p>

Most DSA learning tools show you a static diagram and call it done. AlgoBuddy actually runs the algorithm — step by step, comparison by comparison, swap by swap. Pick a topic, tweak the inputs, and watch it move. Then read the explanation, peek at the code in a few languages, and take a quiz to see if it clicked.

Behind the scenes it is Next.js with Supabase for auth and storage. If you sign up, your dashboard tracks everything — completed modules, a 90-day heatmap, current streak.

Try it: [algobuddy.in](https://algobuddy.in)

---

## What you can do with it

**Searching.** Linear and Binary search. Each comparison lights up as the algorithm narrows things down.

**Sorting.** Bubble, Selection, Insertion, Merge, Quick sort. Crank the speed from half-pace to 5x. Type in your own array or hit random. The comparison and swap counters tick up while the bars shuffle around.

**Stacks.** Push, Pop, Peek, IsEmpty, IsFull — all animated. The app shows both an array version and a linked-list version. It also evaluates postfix and prefix expressions if that is what you are studying.

**Queues.** Enqueue, Dequeue, Peek Front, IsEmpty, IsFull. Four types: Single-Ended, Deque, Circular, Priority. Array and linked-list variants for each.

**Linked Lists.** Singly, Doubly, Circular. Step through traversal, insertion, deletion, searching, reverse, merge, and comparison.

**Trees.** Binary Tree types, BST insertion/deletion/searching, AVL balancing, In-order traversal with animated steps.

**Graphs** — coming.

Every module also has a walkthrough, complexity charts drawn with Recharts, code tabs in JS / C / Python / Java, a multiple-choice quiz, and a daily challenge embed from Hello World.

If you create an account you can mark modules complete. Your dashboard shows what you finished, a 90-day activity heatmap, and a streak.

Auth is Supabase — email/password or Google OAuth. Cloudflare Turnstile sits on the signup form to keep bots out.

The blog has four posts. Topics: whether DSA actually matters for web developers, how implementations differ across languages, a beginner-friendly data structures explainer, and realistic timelines for learning DSA.

Dark mode. Light mode. Breadcrumbs. Back-to-top. Article share buttons. Tutorial overlay for first-time visitors. A floating contact form if something breaks.

---

## Tech stack

| Category | Tools |
|---|---|
| Framework | Next.js 16 (app router) |
| Language | JavaScript (JSX) |
| UI | React 19, Tailwind CSS |
| Animation | GSAP 3, Framer Motion 12 |
| Charts | Recharts |
| Icons | lucide-react, react-icons |
| Code display | prism-react-renderer, react-syntax-highlighter, Monaco Editor |
| Backend / DB | Supabase (auth, PostgreSQL, storage) |
| Anti-bot | Cloudflare Turnstile |
| Email | Nodemailer (Gmail SMTP) |
| Analytics | Google Analytics, Vercel Speed Insights |
| SEO | next-sitemap (dynamic route discovery) |
| Extras | tsParticles, react-responsive-carousel, react-markdown, react-hot-toast, axios |

---

## Getting started

You need Node.js 18+, a Supabase account (free tier is fine), and a Cloudflare Turnstile account.

```bash
git clone https://github.com/PankajSingh34/AlgoBuddy.git
cd algobuddy
npm install
```

Drop a `.env` file in the project root:

| Variable | What it is for |
|---|---|
| `EMAIL_USER` | Gmail address the app sends emails from |
| `EMAIL_PASSWORD` | Gmail app password |
| `NEXT_PUBLIC_GA_ID` | Google Analytics ID |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase public anon key |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Cloudflare Turnstile site key |
| `TURNSTILE_SECRET_KEY` | Cloudflare Turnstile secret |
| `SUPABASE_SERVICE_KEY` | Supabase service role key |
| `SITE_URL` | Your deployment URL |

Then:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Scripts

| Command | Does what? |
|---|---|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run lint` | Run ESLint |
| `npm run postbuild` | Generate sitemap |

---

## API routes

| Route | Method | What it does |
|---|---|---|
| `/api/auth` | POST | Verifies Turnstile CAPTCHA, handles Supabase signup and login |
| `/api/contact` | POST | Contact form sends email via Nodemailer |
| `/api/send-review` | POST | Review form sends email with rating |

---

## Database tables

### `user_progress`

Tracks module completion per user.

| Column | Type |
|---|---|
| `id` | uuid |
| `user_id` | uuid |
| `module_id` | uuid |
| `is_done` | boolean |
| `updated_at` | timestamptz |

### `user_activity`

Daily visit logs — feeds the heatmap and streak counter.

| Column | Type |
|---|---|
| `id` | uuid |
| `user_id` | uuid |
| `activity_date` | date |
| `type` | text |

### `modules`

The full list of modules on the platform.

| Column | Type |
|---|---|
| `id` | uuid |
| `title` | text |
| `description` | text |
| `image` | text |

---

## Project structure

```
app/
  page.jsx                        # Homepage
  layout.jsx                      # Root — analytics, providers, auth
  not-found.jsx                   # 404 page
  globals.css                     # Tailwind + custom styles

  visualizer/
    page.jsx                      # Hub showing DS category cards
    searching/                    # Linear & Binary search
    sorting/                      # Bubble through Quick sort
    stack/                        # Stack ops, polish notation, implementations
    queue/                        # Queue ops, types, implementations
    linkedList/                   # Linked list types & operations
    trees/                        # Binary trees, BST, AVL, In-order

  dashboard/page.jsx              # Protected user dashboard
  blogs/                          # Blog listing + 4 articles
  login/page.jsx                  # Auth page

  api/
    auth/route.js                 # CAPTCHA + Supabase auth
    contact/route.js              # Email contact form
    send-review/route.js          # Email review form

  components/
    hero.jsx, navbar.jsx, footer.jsx
    feature.jsx, faq.jsx, review.jsx, about.jsx
    support.jsx, cookie.jsx
    models/                       # GSAP-animated DS models
    ui/                           # ModuleCard, SearchBar, Breadcrumbs, etc.

  contexts/
    AuthContext.js                # Legacy JWT auth
    UserContext.jsx               # Supabase session auth

lib/
  supabase.js                     # Supabase client
  gtag.js                         # GA helpers
  activity.js                     # Activity tracking
  modulesMap.js                   # UUID mappings per module

public/
  og.png, og/                     # OpenGraph images
  modules/                        # Module thumbnails
  blog/                           # Blog images
  favicon.ico, favicon.svg
  robots.txt, sitemap.xml
  ads.txt
  google647afbccc581b5c2.html     # Google Search Console verification
```

---

## What is next

Graph algorithms — BFS, DFS, Dijkstra, Prim's, Kruskal's, Topological Sort. More tree content — Pre-order, Post-order, Level-order, Morris Traversal, Red-Black Trees, B-Trees, Trie, Segment Trees, Fenwick Trees. Heap Sort. Huffman Coding. Better mobile support. More community features.

---

## CI

A GitHub Actions workflow runs on every PR to main. It installs deps, lints, and builds across Ubuntu, macOS, and Windows with Node 20.

---

## Contributing

Bug reports, feature ideas, docs improvements, pull requests — all welcome. See [CONTRIBUTING.md](./CONTRIBUTING.md) and follow the [Code of Conduct](./CODE_OF_CONDUCT.md).

---

## License

Apache 2.0. See [LICENSE](./LICENSE).

---

## Thanks

Built on [Next.js](https://nextjs.org), [React](https://react.dev), [GSAP](https://gsap.com), [Framer Motion](https://www.framer.com/motion), [Supabase](https://supabase.com), [Vercel](https://vercel.com), [Recharts](https://recharts.org), and the rest of the open source libraries listed above.

---

## Who built this

**Sohan Rout** and **Pankaj Singh**.

<p>
  <a href="https://www.linkedin.com/in/pankaj-singh-2a968b212/">
    <img src="https://skillicons.dev/icons?i=linkedin" alt="LinkedIn" />
  </a>
</p>
