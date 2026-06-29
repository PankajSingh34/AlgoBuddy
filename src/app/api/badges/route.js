import { cookies } from "next/headers";
import { getSupabaseServerClient, jsonResponse, errorResponse } from "@/lib/serverApi";

export async function GET(request) {
  try {
    const cookieStore = await cookies();
    const supabase = getSupabaseServerClient(cookieStore);
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return jsonResponse({ badges: [] }, 401);
    }

    // Fetch all badges from dictionary
    const { data: allBadges, error: dictError } = await supabase
      .from('badges_dictionary')
      .select('*');

    if (dictError) throw dictError;

    // Fetch earned badges
    const { data: earnedBadges, error: earnedError } = await supabase
      .from('user_badges')
      .select('*, badges_dictionary(*)')
      .eq('user_id', user.id);

    if (earnedError) throw earnedError;

    const earnedBadgeIds = new Set(earnedBadges.map(b => b.badge_id));
    
    // Map to include earned status
    const badges = (allBadges || []).map(b => ({
      ...b,
      earned: earnedBadgeIds.has(b.id),
      earned_at: earnedBadges.find(eb => eb.badge_id === b.id)?.earned_at || null
    }));

    return jsonResponse({ badges });
  } catch (error) {
    console.error("[/api/badges GET]", error);
    return errorResponse(error);
  }
}
