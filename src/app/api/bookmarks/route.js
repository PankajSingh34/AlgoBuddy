import { getAuthenticatedUser } from "@/lib/auth";
import { getSupabaseAdmin, jsonResponse, errorResponse } from "@/lib/serverApi";

export async function GET(request) {
  try {
    const authResult = await getAuthenticatedUser();
    if (!authResult.success) {
      return jsonResponse({ error: "Authentication required" }, authResult.type === "CONFIG_ERROR" ? 500 : 401);
    }
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("problem_bookmarks")
      .select("*")
      .eq("user_id", authResult.user.id);
    if (error) {
      // Log server-side for debugging; always return [] so the UI degrades
      // gracefully (local storage handles the fallback) instead of showing 500.
      console.error("[/api/bookmarks GET] Supabase error:", error.message, error.code);
      return jsonResponse([]);
    }
    return jsonResponse(data || []);
  } catch (error) {
    console.error("[/api/bookmarks GET] Unexpected error:", error.message);
    return jsonResponse([]);
  }
}

export async function POST(request) {
  try {
    const authResult = await getAuthenticatedUser();
    if (!authResult.success) {
      return jsonResponse({ error: "Authentication required" }, authResult.type === "CONFIG_ERROR" ? 500 : 401);
    }
    const body = await request.json().catch(() => ({}));
    const { problemId, topicSlug } = body;
    if (!problemId || !topicSlug) return jsonResponse({ error: "problemId and topicSlug are required" }, 400);
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from("problem_bookmarks").upsert(
      { user_id: authResult.user.id, problem_id: problemId, topic_slug: topicSlug, created_at: new Date().toISOString() },
      { onConflict: ["user_id", "problem_id"] }
    );
    if (error) {
      console.error("[/api/bookmarks POST] Supabase error:", error.message, error.code);
      return jsonResponse({ error: error.message }, 500);
    }
    return jsonResponse({ success: true });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(request) {
  try {
    const authResult = await getAuthenticatedUser();
    if (!authResult.success) {
      return jsonResponse({ error: "Authentication required" }, authResult.type === "CONFIG_ERROR" ? 500 : 401);
    }
    const { searchParams } = new URL(request.url);
    const problemId = searchParams.get("problemId");
    if (!problemId) return jsonResponse({ error: "problemId is required" }, 400);
    const supabase = getSupabaseAdmin();
    const { error } = await supabase
      .from("problem_bookmarks")
      .delete()
      .eq("user_id", authResult.user.id)
      .eq("problem_id", problemId);
    if (error) {
      console.error("[/api/bookmarks DELETE] Supabase error:", error.message, error.code);
      return jsonResponse({ error: error.message }, 500);
    }
    return jsonResponse({ success: true });
  } catch (error) {
    return errorResponse(error);
  }
}
