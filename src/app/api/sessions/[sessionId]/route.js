import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import {
  getPublicCollaborationSession,
  joinCollaborationSession,
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
    // Supabase not configured (local dev without env vars) — allow through so
    // development works without full credentials being set up.
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

export async function GET(request, { params }) {
  const { user, configured } = await getAuthenticatedUser();

  if (configured && !user) {
    return Response.json(
      { error: "Authentication required" },
      { status: 401 },
    );
  }

  const ip = getClientIp(request.headers);
  const { allowed } = await checkRateLimit(`collab:lookup:${ip}`);

  if (!allowed) {
    return Response.json(
      { error: "Too many session lookup requests. Please try again shortly." },
      { status: 429 },
    );
  }
 
  const session = await getPublicCollaborationSession(params.sessionId);

  if (!session) {
    return Response.json({ error: "Session not found" }, { status: 404 });
  }

  return Response.json({ session });
}

export async function POST(request, { params }) {
  if (!validateCsrfOrigin(request)) {
    return Response.json({ error: "CSRF validation failed" }, { status: 403 });
  }

  const { user, configured } = await getAuthenticatedUser();
  if (configured && !user) {
    return Response.json(
      { error: "Authentication required" },
      { status: 401 },
    );
  }

  const ip = getClientIp(request.headers);
  const { allowed } = await checkRateLimit(`collab:join:${ip}:${params.sessionId}`);
  if (!allowed) {
    return Response.json(
      { error: "Too many join attempts. Please try again shortly." },
      { status: 429 },
    );
  }

  const body = await request.json().catch(() => ({}));
  const result = await joinCollaborationSession(params.sessionId, {
    password: body.password,
    userId: configured ? user?.id || "" : body.createdBy || "anonymous",
  });

  if (result.error) {
    return Response.json({ error: result.error }, { status: result.status || 400 });
  }

  return Response.json(result);
}
