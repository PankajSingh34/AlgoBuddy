import { cookies } from "next/headers";
import { getAuthenticatedUser } from "@/lib/auth";
import { getSupabaseServerClient, jsonResponse, errorResponse } from "@/lib/serverApi";

export async function POST(request) {
  try {
    const authResult = await getAuthenticatedUser();
    if (!authResult.success) {
      return jsonResponse({ error: "Authentication required" }, authResult.type === "CONFIG_ERROR" ? 500 : 401);
    }
    const body = await request.json().catch(() => ({}));
    const { type } = body;

    // Prefer the client-supplied local date (YYYY-MM-DD) so the activity row
    // reflects the user's own calendar day rather than the server's UTC date.
    // Fall back to UTC date when the client does not send one.
    let localDate = typeof body.localDate === "string" && /^\d{4}-\d{2}-\d{2}$/.test(body.localDate)
      ? body.localDate
      : new Date().toISOString().split("T")[0];

    const cookieStore = await cookies();
    const supabase = getSupabaseServerClient(cookieStore);
    const { data: existing, error: fetchError } = await supabase
      .from("user_activity")
      .select("type")
      .eq("user_id", authResult.user.id)
      .eq("activity_date", localDate)
      .maybeSingle();

    if (fetchError) return jsonResponse({ error: fetchError.message }, 500);

    const mergedType = existing
      ? Array.from(new Set([existing.type, type || "site_visit"])).join(",")
      : (type || "site_visit");

    let { data, error } = await supabase
      .from("user_activity")
      .upsert(
        { user_id: authResult.user.id, activity_date: localDate, type: mergedType },
        { onConflict: "user_id, activity_date" }
      );

    if (error) {
      const errorCode = error?.code;
      if (errorCode === '42501') {
        return jsonResponse({ error: "Permission denied: check RLS policies on user_activity table" }, 403);
      }
      return jsonResponse({ error: error.message }, 500);
    }
    return jsonResponse({ success: true });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function GET(request) {
  try {
    const authResult = await getAuthenticatedUser();
    if (!authResult.success) {
      return jsonResponse({ error: "Authentication required" }, authResult.type === "CONFIG_ERROR" ? 500 : 401);
    }
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get("days") || "30", 10);
    const since = new Date();
    since.setDate(since.getDate() - days);
    const sinceStr = since.toISOString();
    const cookieStore = await cookies();
    const supabase = getSupabaseServerClient(cookieStore);
    let { data, error } = await supabase
      .from("user_activity")
      .select("activity_date, created_at")
      .eq("user_id", authResult.user.id)
      .gte("created_at", sinceStr)
      .order("created_at", { ascending: false });

    if (error) {
      const errorCode = error?.code;
      if (errorCode === '42501') {
        return jsonResponse({ error: "Permission denied: check RLS policies on user_activity table" }, 403);
      }
      return jsonResponse({ error: error.message }, 500);
    }
    return jsonResponse(data || []);
  } catch (error) {
    return errorResponse(error);
  }
}
