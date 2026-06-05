import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

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

export async function GET() {
  try {
    const config = getSupabaseConfig();
    if (!config) {
      return Response.json(
        { error: "Supabase not configured" },
        { status: 503 }
      );
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

    const { data: team, error } = await client
      .from("community_team")
      .select("*")
      .order("order", { ascending: true });

    if (error) {
      return Response.json(
        { error: "Failed to fetch team" },
        { status: 500 }
      );
    }

    return Response.json({ team });
  } catch (error) {
    return Response.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
