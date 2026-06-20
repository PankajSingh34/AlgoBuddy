import { getAuthenticatedUser } from "@/lib/auth";
import { getSupabaseAdmin, jsonResponse, errorResponse } from "@/lib/serverApi";

export async function POST(request, { params }) {
  try {
    const authResult = await getAuthenticatedUser();
    if (!authResult.success) {
      return jsonResponse(
        { error: "Authentication required" },
        authResult.type === "CONFIG_ERROR" ? 500 : 401
      );
    }

    const { sharedUserId } = await params;
    if (!sharedUserId) return jsonResponse({ error: "sharedUserId is required" }, 400);

    const supabase = getSupabaseAdmin();
    
    // 1. Fetch shared user's sheet items
    const { data: sharedData, error: fetchError } = await supabase
      .from("my_sheet")
      .select("problem_id, note")
      .eq("user_id", sharedUserId);

    if (fetchError) return jsonResponse({ error: fetchError.message }, 500);
    if (!sharedData || sharedData.length === 0) {
      return jsonResponse({ success: true, message: "No items to clone" });
    }

    // 2. Fetch authenticated user's existing sheet items to avoid duplicates
    const { data: userData, error: userFetchError } = await supabase
      .from("my_sheet")
      .select("problem_id")
      .eq("user_id", authResult.user.id);

    if (userFetchError) return jsonResponse({ error: userFetchError.message }, 500);
    
    const existingProblems = new Set((userData || []).map(row => row.problem_id));
    
    // 3. Insert new items
    const toInsert = sharedData
      .filter(item => !existingProblems.has(item.problem_id))
      .map(item => ({
        user_id: authResult.user.id,
        problem_id: item.problem_id,
        note: item.note || "",
        added_at: new Date().toISOString()
      }));

    if (toInsert.length > 0) {
      const { error: insertError } = await supabase
        .from("my_sheet")
        .insert(toInsert);

      if (insertError) return jsonResponse({ error: insertError.message }, 500);
    }

    return jsonResponse({ success: true, clonedCount: toInsert.length });
  } catch (error) {
    return errorResponse(error);
  }
}
