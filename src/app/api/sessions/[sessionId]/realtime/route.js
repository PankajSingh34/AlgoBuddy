import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { exchangeRealtimeSubscriptionToken } from "@/lib/collaboration/sessionStore";
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

export async function POST(request, { params }) {
  const { user, configured } = await getAuthenticatedUser();
  if (configured && !user) {
    return Response.json(
      { error: "Authentication required" },
      { status: 401 },
    );
  }

  const ip = getClientIp(request.headers);
  const { allowed } = await checkRateLimit(`collab:realtime:${ip}:${params.sessionId}`);
  if (!allowed) {
    return Response.json(
      { error: "Too many realtime token exchange attempts. Please try again shortly." },
      { status: 429 },
    );
  }

  const body = await request.json().catch(() => ({}));
  const result = await exchangeRealtimeSubscriptionToken(params.sessionId, {
    subscriptionToken: body.subscriptionToken,
    userId: configured ? user?.id || "" : body.createdBy || "anonymous",
  });

  if (result.error) {
    return Response.json({ error: result.error }, { status: result.status || 400 });
  }

  return Response.json(result);
}
