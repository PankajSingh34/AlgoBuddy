import { getAuthenticatedUser } from "@/lib/auth";
import { getSupabaseAdmin, jsonResponse, errorResponse } from "@/lib/serverApi";

export async function GET(request) {
  try {
    const authResult = await getAuthenticatedUser();
    if (!authResult.success) {
      return jsonResponse({ error: "Authentication required" }, authResult.type === "CONFIG_ERROR" ? 500 : 401);
    }
    const { searchParams } = new URL(request.url);
    const moduleId = searchParams.get("moduleId");
    const supabase = getSupabaseAdmin();
    let query = supabase.from("user_progress").select("*").eq("user_id", authResult.user.id);
    if (moduleId) query = query.eq("module_id", moduleId);
    const { data, error } = await query.maybeSingle();
    if (error) return jsonResponse({ error: error.message }, 500);
    return jsonResponse(data || {});
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
    const { moduleId, isDone } = body;
    if (!moduleId) return jsonResponse({ error: "moduleId is required" }, 400);
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from("user_progress").upsert(
      { user_id: authResult.user.id, module_id: moduleId, is_done: !!isDone, updated_at: new Date().toISOString() },
      { onConflict: ["user_id", "module_id"] }
    );
    if (error) return jsonResponse({ error: error.message }, 500);
    return jsonResponse({ success: true });
  } catch (error) {
    return errorResponse(error);
  }
}
