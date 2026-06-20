import { getSupabaseAdmin, jsonResponse, errorResponse } from "@/lib/serverApi";

export async function GET(request, { params }) {
  try {
    const { userId } = await params;
    if (!userId) return jsonResponse({ error: "userId is required" }, 400);

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("my_sheet")
      .select("problem_id, added_at, note")
      .eq("user_id", userId);

    if (error) return jsonResponse({ error: error.message }, 500);

    const items = (data || []).map((row) => ({
      problemId: row.problem_id,
      addedAt: row.added_at,
      note: row.note || "",
    }));

    return jsonResponse({ items });
  } catch (error) {
    return errorResponse(error);
  }
}
