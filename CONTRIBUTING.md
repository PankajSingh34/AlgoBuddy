# Contributing to AlgoBuddy

Thank you for your interest in contributing to **AlgoBuddy**!
We welcome and appreciate contributions from the community to help make this project better.

---

**Join our community** — **Discord Server: <https://discord.gg/Gv2N4U3KAc>**

---

## ↪️Table of Contents

- [Contribution Areas](#️-contribution-areas)
- [Tech Stack](#️-tech-stack)
- [Getting Started](#️-getting-started)
- [Development Workflow](#️-development-workflow)
- [Issue Assignment Process](#️-issue-assignment-process)
- [Pull Request Guidelines](#️-pull-request-guidelines)
- [Reporting Issues](#️-reporting-issues)
- [Need Help?](#️-need-help)

---

# ↪️ Contribution Areas

We accept contributions in the following areas:

| Area                   | Description                                       |
| ---------------------- | ------------------------------------------------- |
| **Bug Fixes**          | Resolve existing bugs and issues                  |
| **UI/UX Improvements** | Enhance responsiveness, accessibility, and design |
| **New Visualizers**    | Add new DSA visualizers and animations            |
| **Documentation**      | Improve guides, README, and contributor docs      |
| **Performance**        | Optimize application performance and efficiency   |
| **Theme Enhancements** | Improve dark/light mode experience                |

Feel free to suggest new contribution ideas by opening an issue first.

---

# ↪️ Tech Stack

| Layer     | Technology                                         |
| --------- | -------------------------------------------------- |
| Framework | Next.js 16 (App Router)                            |
| Library   | React.js                                           |
| Styling   | Tailwind CSS                                       |
| Language  | JavaScript                                         |
| Database / Auth | Supabase                                     |
| Animation | GSAP, Framer Motion                                |
| Charts    | Recharts                                           |
| Email     | Nodemailer (Gmail)                                 |
| Captcha   | Cloudflare Turnstile                               |

---

# ↪️ Getting Started

Follow these steps to set up the project locally.

## 1. Fork the Repository

Click the **Fork** button at the top-right corner of this repository.

## 2. Clone Your Fork

```bash
git clone https://github.com/your-username/AlgoBuddy.git
```

## 3. Navigate to the Project Directory

```bash
cd AlgoBuddy
```

## 4. Install Dependencies

```bash
npm install
```

> **Note:** If you encounter build errors with `isolated-vm`, ensure you have Python and a C++ compiler installed (required for native addon compilation).

## 5. Set Up Environment Variables

Copy the example env file and fill in the required values:

```bash
cp .env.example .env.local
```

### Required Variables

| Variable | Description | How to Get |
|----------|------------|------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Supabase Dashboard → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Supabase Dashboard → Settings → API |
| `GEMINI_API_KEY` | Google Gemini API key | [aistudio.google.com/apikey](https://aistudio.google.com/apikey) |

### Optional But Recommended

| Variable | Description |
|----------|-------------|
| `TURNSTILE_SECRET_KEY` | Cloudflare Turnstile secret (bypassable in dev) |
| `UPSTASH_REDIS_REST_URL` | Upstash Redis URL for rate limiting |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis token for rate limiting |
| `EMAIL_USER` | Gmail address for contact/review emails |
| `EMAIL_PASSWORD` | Gmail App Password |
| `NEXT_PUBLIC_GA_ID` | Google Analytics Measurement ID |

> ⚠️ **Never commit `.env.local` to version control.** It is already listed in `.gitignore`.

## 6. Start the Development Server

```bash
npm run dev
```

The application will start locally at `http://localhost:3000`.

---

# ↪️ Development Workflow

Follow the workflow below while contributing to the project.

## 1. Create a New Branch

Create a separate branch before making any changes.

**Syntax**

```bash
git checkout -b feature/your-feature-name
```

**Example**

```bash
git checkout -b fix/navbar-responsive-issue
```

---

## 2. Make Your Changes

You can now start working on:

- Bug fixes
- UI/UX improvements
- Documentation updates
- Performance enhancements
- New visualizers

---

## 3. Commit Your Changes

Write clear and meaningful commit messages.

**Syntax**

```bash
git commit -m "type: short-description"
```

**Example**

```bash
git commit -m "fix: improve navbar responsiveness"
```

**Recommended Commit Types**

| Type       | Purpose                  |
| ---------- | ------------------------ |
| `feat`     | New feature              |
| `fix`      | Bug fix                  |
| `docs`     | Documentation updates    |
| `style`    | UI/styling changes       |
| `refactor` | Code improvements        |
| `perf`     | Performance optimization |

---

## 4. Push Your Changes

Push your branch to your forked repository.

```bash
git push origin feature/your-branch-name
```

---

## 5. Open a Pull Request

After pushing your changes:

1. Open your fork on GitHub
2. Click **Compare & Pull Request**
3. Add a clear title and description
4. Submit the pull request

---

# ↪️ Issue Assignment Process

To ensure fair and efficient issue management, please follow these steps:

1. **Browse open issues** — Check the [Issues](https://github.com/PankajSingh34/AlgoBuddy/issues) tab for tasks labelled `good first issue` or `help wanted`.
2. **Comment to request assignment** — Leave a comment on the issue you'd like to work on (e.g., *"I'd like to work on this"*). Do not open a PR without being assigned first.
3. **Wait for assignment** — A maintainer will assign the issue to you. Work will only be reviewed from the assigned contributor.
4. **Submit within the deadline** — If a deadline is mentioned on the issue, please try to submit your PR within that timeframe. If you need more time, let us know in the issue thread.
5. **Avoid duplicate work** — Before starting, check that no one else is already assigned to the same issue.

> If you find a bug or want to suggest a feature that isn't already an issue, please open one first before working on it.

---

# ↪️ Pull Request Guidelines

Before submitting a PR:

- Ensure the project builds without errors (`npm run build`)
- Lint your code (`npm run lint`)
- Test changes on multiple screen sizes (mobile, tablet, desktop)
- Follow clean coding practices and existing code conventions
- Avoid committing unnecessary files (e.g., `.env.local`, `node_modules`)
- Use meaningful commit messages following the conventions above
- Keep PRs focused on a single issue or topic — no unrelated changes
- Add screenshots or screen recordings for UI-related changes
- For new features, include a brief description of the implementation approach
- Reference the issue number in your PR description (e.g., `Closes #123`)
- Ensure your branch is up-to-date with the latest main before submitting

### PR Size Guidelines

- **Small PRs (< 10 files):** Ideal for bug fixes and small enhancements
- **Medium PRs (10–20 files):** Acceptable for focused feature additions
- **Large PRs (> 20 files):** Should be discussed in an issue first

---

# ↪️ Reporting Issues

When creating issues, please include:

- A clear, descriptive title
- A proper explanation of the problem
- Steps to reproduce the issue
- Expected vs. actual behaviour
- Screenshots or error logs, if applicable

---

# ↪️ Need Help?

If you need help while contributing:

- **Open an issue** on GitHub
- **Start a discussion** in the [Discussions](https://github.com/PankajSingh34/AlgoBuddy/discussions) tab
- **Ask in Discord** — [discord.gg/Gv2N4U3KAc](https://discord.gg/Gv2N4U3KAc)

We're happy to help new contributors!

---

# ↪️ Thank You

Thank you for contributing to AlgoBuddy 💙

Your contributions help make learning Data Structures & Algorithms more interactive and accessible for everyone.
