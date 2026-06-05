import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import {
  createCollaborationSession,
  listCollaborationSessions,
  validateCsrfOrigin,
} from "@/lib/collaboration/sessionStore";
import { checkRateLimit } from "@/lib/rateLimit";
import { getClientIp } from "@/lib/getClientIp";

function getSupabaseConfig() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) return null;
  try {
    const parsed = new URL(supabaseUrl);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return null;
  } catch {
    return null;
  }
  return { supabaseUrl, supabaseAnonKey };
}

async function getAuthenticatedUser() {
  const config = getSupabaseConfig();
  if (!config) {
    return { user: null, configured: false };
  }

  const cookieStore = await cookies();
  const client = createServerClient(config.supabaseUrl, config.supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          cookieStore.set(name, value, options);
        });
      },
    },
  });

  const { data } = await client.auth.getUser();
  return { user: data?.user ?? null, configured: true };
}

export async function GET(request) {
  const ip = getClientIp(request.headers);
  const { allowed } = await checkRateLimit(`collab:list:${ip}`);
  if (!allowed) {
    return Response.json(
      { error: "Too many requests. Please try again shortly." },
      { status: 429 },
    );
  }

  const { searchParams } = new URL(request.url);
  const limitParam = searchParams.get("limit");
  const cursor = searchParams.get("cursor");

  if (cursor !== null && (typeof cursor !== "string" || cursor.trim() === "")) {
    return Response.json(
      { error: "Invalid cursor parameter." },
      { status: 400 },
    );
  }

  const limit = limitParam ? Number(limitParam) : undefined;
  const { sessions, nextCursor } = await listCollaborationSessions({
    limit: limit && !Number.isNaN(limit) ? limit : undefined,
    cursor: cursor ?? undefined,
  });
  return Response.json({ sessions, nextCursor: nextCursor ?? null });
}

export async function POST(request) {
  try {
    if (!validateCsrfOrigin(request)) {
      return Response.json({ error: "CSRF validation failed" }, { status: 403 });
    }
    const { user, configured } = await getAuthenticatedUser();
    
    if (process.env.NODE_ENV === "production" && !configured) {
      return Response.json({ error: "Server misconfigured: Authentication environment variables are missing." }, { status: 500 });
    }

    if (configured && !user) {
      return Response.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    const ip = getClientIp(request.headers);
    const { allowed } = await checkRateLimit(`collab:create:${ip}`);
    if (!allowed) {
      return Response.json(
        { error: "Too many collaboration sessions created. Please try again shortly." },
        { status: 429 },
      );
    }

    const body = await request.json().catch(() => null);
    const { title, visibility, password, module } = body || {};
    // Ensure createdBy is strictly inferred from the authenticated user token (preventing spoofing)
    const createdBy = user?.id || "";

    if (visibility === "private" && !password) {
      return Response.json(
        { error: "A password is required for private sessions." },
        { status: 400 },
      );
    }

    const result = await createCollaborationSession({
      title,
      visibility,
      password,
      module,
      createdBy,
    });

    return Response.json({
      session: result.session,
      ...(configured ? { sessionSecret: result.sessionSecret } : {}),
      joinUrl: `/visualizer/dry-run?session=${result.session.joinCode}`,
    });
  } catch (error) {
    return Response.json(
      { error: error?.message || "Failed to create collaboration session" },
      { status: 500 },
    );
  }
}
