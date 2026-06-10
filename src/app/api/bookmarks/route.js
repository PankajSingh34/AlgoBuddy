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
    if (error) return jsonResponse({ error: error.message }, 500);
    return jsonResponse(data || []);
  } catch (error) {
    return errorResponse(error);
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
    if (error) return jsonResponse({ error: error.message }, 500);
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
    if (error) return jsonResponse({ error: error.message }, 500);
    return jsonResponse({ success: true });
  } catch (error) {
    return errorResponse(error);
  }
}
