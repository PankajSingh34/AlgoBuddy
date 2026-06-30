import { NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rateLimit";
import { getClientIp } from "@/lib/getClientIp";

// GET /api/github-repos?username=shrutssss
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username")?.trim();
  const ip = getClientIp(request.headers);

  const { allowed, resetAt } = await checkRateLimit(`github-repos:${ip}`);
  if (!allowed) {
    const retryAfter = Math.max(1, Math.ceil((resetAt - Date.now()) / 1000));
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429, headers: { "Retry-After": retryAfter.toString() } }
    );
  }

  if (!username) {
    return NextResponse.json({ error: "Missing username" }, { status: 400 });
  }

  if (!/^[a-zA-Z0-9-]{1,39}$/.test(username) || username.startsWith("-") || username.endsWith("-")) {
    return NextResponse.json({ error: "Invalid GitHub username" }, { status: 400 });
  }

  try {
    const headers = { "User-Agent": "AlgoBuddy-App" };

    if (process.env.GITHUB_TOKEN) {
      headers["Authorization"] = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    const res = await fetch(
      `https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=30`,
      { headers, next: { revalidate: 3600 } }
    );

    if (res.status === 404) {
      return NextResponse.json({ error: `GitHub user "${username}" not found` }, { status: 404 });
    }

    if (!res.ok) throw new Error("GitHub API error");

    const data = await res.json();

    const repos = data
      .filter((repo) => !repo.fork)
      .map((repo) => ({
        name: repo.name,
        description: repo.description || "",
        language: repo.language || "",
        topics: repo.topics || [],
        html_url: repo.html_url,
        stargazers_count: repo.stargazers_count,
      }));

    return NextResponse.json({ repos });
  } catch (err) {
    console.error("[github-repos]", err);
    return NextResponse.json({ error: "Failed to fetch GitHub repos" }, { status: 500 });
  }
}
