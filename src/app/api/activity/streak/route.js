import { cookies } from "next/headers";
import { getAuthenticatedUser } from "@/lib/auth";
import { getSupabaseServerClient, jsonResponse, errorResponse } from "@/lib/serverApi";

export async function GET(request) {
  try {
    const authResult = await getAuthenticatedUser();
    if (!authResult.success) {
      return jsonResponse({ error: "Authentication required" }, authResult.type === "CONFIG_ERROR" ? 500 : 401);
    }
    const cookieStore = await cookies();
    const supabase = getSupabaseServerClient(cookieStore);

    const { data, error } = await supabase
      .from("user_practice_stats")
      .select("current_streak, longest_streak")
      .eq("user_id", authResult.user.id)
      .maybeSingle();

    if (error) return jsonResponse({ error: error.message }, 500);

    return jsonResponse({
      streak: data?.current_streak ?? 0,
      longestStreak: data?.longest_streak ?? 0,
    });
  } catch (error) {
    return errorResponse(error);
  }
}
