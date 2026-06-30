import { cookies } from "next/headers";
import { getAuthenticatedUser } from "@/lib/auth";
import { getSupabaseServerClient, jsonResponse, errorResponse } from "@/lib/serverApi";

// GET /api/progress
// Returns all problem progress for the authenticated user as a flat array,
// along with currentStreak and longestStreak from user_practice_stats so that
// the client always has an authoritative server-side streak value and does not
// have to fall back to the per-device localStorage counter.
export async function GET(request) {
  try {
    const authResult = await getAuthenticatedUser();
    if (!authResult.success) {
      return jsonResponse(
        { error: "Authentication required" },
        authResult.type === "CONFIG_ERROR" ? 500 : 401
      );
    }
    const cookieStore = await cookies();
    const supabase = getSupabaseServerClient(cookieStore);

    // Fetch progress rows and streak stats in parallel.
    const [progressResult, statsResult] = await Promise.all([
      supabase
        .from("user_progress")
        .select("problem_id, status, updated_at")
        .eq("user_id", authResult.user.id),
      supabase
        .from("user_practice_stats")
        .select("current_streak, longest_streak")
        .eq("user_id", authResult.user.id)
        .maybeSingle(),
    ]);

    if (progressResult.error) return jsonResponse({ error: progressResult.error.message }, 500);

    // Return as map: { [problemId]: { status, updatedAt } }
    const progressMap = {};
    (progressResult.data || []).forEach((row) => {
      if (row.problem_id) {
        progressMap[row.problem_id] = {
          status: row.status,
          updatedAt: row.updated_at,
        };
      }
    });

    const stats = statsResult.data;
    return jsonResponse({
      progress: progressMap,
      currentStreak: stats?.current_streak ?? 0,
      longestStreak: stats?.longest_streak ?? 0,
    });
  } catch (error) {
    return errorResponse(error);
  }
}

// POST /api/progress
// Upserts a single problem's progress status
export async function POST(request) {
  try {
    const authResult = await getAuthenticatedUser();
    if (!authResult.success) {
      return jsonResponse(
        { error: "Authentication required" },
        authResult.type === "CONFIG_ERROR" ? 500 : 401
      );
    }
    const body = await request.json().catch(() => ({}));
    const { problemId, status } = body;

    if (!problemId || !status) {
      return jsonResponse({ error: "problemId and status are required" }, 400);
    }

    const validStatuses = ["Not Started", "In Progress", "Completed"];
    if (!validStatuses.includes(status)) {
      return jsonResponse({ error: `status must be one of: ${validStatuses.join(", ")}` }, 400);
    }

    const cookieStore = await cookies();
    const supabase = getSupabaseServerClient(cookieStore);
    const { error } = await supabase.from("user_progress").upsert(
      {
        user_id: authResult.user.id,
        problem_id: problemId,
        status: status,
        updated_at: new Date().toISOString(),
      },
      { onConflict: ["user_id", "problem_id"] }
    );

    if (error) return jsonResponse({ error: error.message }, 500);

    // DB-first streak update: update user_practice_stats when a problem is completed.
    let currentStreak = 0;
    let longestStreak = 0;
    if (status === "Completed") {
      const today = new Date().toISOString().slice(0, 10);

      const { data: stats, error: fetchError } = await supabase
        .from("user_practice_stats")
        .select("current_streak, longest_streak, last_active_date")
        .eq("user_id", authResult.user.id)
        .maybeSingle();

      if (fetchError) return jsonResponse({ error: fetchError.message }, 500);

      if (!stats) {
        const { error: insertError } = await supabase
          .from("user_practice_stats")
          .insert({
            user_id: authResult.user.id,
            current_streak: 1,
            longest_streak: 1,
            last_active_date: today,
            visualized_count: 0,
          });
        if (insertError) return jsonResponse({ error: insertError.message }, 500);
        currentStreak = 1;
        longestStreak = 1;
      } else {
        const lastActive = stats.last_active_date;
        let newCurrent = stats.current_streak;
        let newLongest = stats.longest_streak;

        if (!lastActive) {
          newCurrent = 1;
          newLongest = 1;
        } else if (lastActive === today) {
          // already incremented today — preserve existing values
        } else if (lastActive === today.slice(0, 10)) {
          // already incremented today (alternative format)
        } else if (lastActive === new Date(Date.now() - 86400000).toISOString().slice(0, 10)) {
          newCurrent += 1;
          if (newCurrent > newLongest) newLongest = newCurrent;
        } else {
          newCurrent = 1;
        }

        const { error: updateError } = await supabase
          .from("user_practice_stats")
          .update({
            current_streak: newCurrent,
            longest_streak: newLongest,
            last_active_date: today,
          })
          .eq("user_id", authResult.user.id);

        if (updateError) return jsonResponse({ error: updateError.message }, 500);
        currentStreak = newCurrent;
        longestStreak = newLongest;
      }
    }

    // Return streak data so the client can always trust the server value.
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay()).toISOString();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

    const [dailyResult, weeklyResult, monthlyResult] = await Promise.all([
      supabase.from("user_progress").select("id", { count: "exact", head: true })
        .eq("user_id", authResult.user.id)
        .eq("status", "Completed")
        .gte("updated_at", startOfDay),
      supabase.from("user_progress").select("id", { count: "exact", head: true })
        .eq("user_id", authResult.user.id)
        .eq("status", "Completed")
        .gte("updated_at", startOfWeek),
      supabase.from("user_progress").select("id", { count: "exact", head: true })
        .eq("user_id", authResult.user.id)
        .eq("status", "Completed")
        .gte("updated_at", startOfMonth),
    ]);

    return jsonResponse({
      success: true,
      currentStreak,
      longestStreak,
      dailySolved: dailyResult.count ?? 0,
      weeklySolved: weeklyResult.count ?? 0,
      monthlySolved: monthlyResult.count ?? 0,
    });
  } catch (error) {
    return errorResponse(error);
  }
}
