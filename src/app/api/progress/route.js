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

    // Return streak data and counts.
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    const dayOfWeek = now.getDay();
    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - daysToMonday).toISOString();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

    // Fetch progress rows, streak stats, and counts in parallel.
    const [progressResult, statsResult, dailyResult, weeklyResult, monthlyResult] = await Promise.all([
      supabase
        .from("user_progress")
        .select("problem_id, status, updated_at")
        .eq("user_id", authResult.user.id),
      supabase
        .from("user_practice_stats")
        .select("current_streak, longest_streak")
        .eq("user_id", authResult.user.id)
        .maybeSingle(),
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
      dailySolved: dailyResult.count ?? 0,
      weeklySolved: weeklyResult.count ?? 0,
      monthlySolved: monthlyResult.count ?? 0,
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
    const { problemId, status, localDate } = body;

    if (!problemId || !status) {
      return jsonResponse({ error: "problemId and status are required" }, 400);
    }

    const validStatuses = ["Not Started", "In Progress", "Completed"];
    if (!validStatuses.includes(status)) {
      return jsonResponse({ error: `status must be one of: ${validStatuses.join(", ")}` }, 400);
    }

    const cookieStore = await cookies();
    const supabase = getSupabaseServerClient(cookieStore);
    let currentStreak = 0;
    let longestStreak = 0;

    if (status === "Completed") {
      const today = new Date().toISOString().split("T")[0];
      const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

      let verifiedLocalDate = typeof localDate === "string" && /^\d{4}-\d{2}-\d{2}$/.test(localDate)
        ? localDate
        : today;

      // Reject dates outside [yesterday, today] to prevent streak fabrication
      if (verifiedLocalDate < yesterday || verifiedLocalDate > today) {
        verifiedLocalDate = today;
      }

      const { data, error } = await supabase.rpc('upsert_progress_and_update_streak', {
        p_user_id: authResult.user.id,
        p_problem_id: problemId,
        p_status: status,
        p_updated_at: new Date().toISOString(),
        p_local_date: verifiedLocalDate
      });
      if (error) return jsonResponse({ error: error.message }, 500);
      currentStreak = data?.[0]?.current_streak ?? 0;
      longestStreak = data?.[0]?.longest_streak ?? 0;
    } else {
      const { data, error } = await supabase.from("user_progress").upsert(
        {
          user_id: authResult.user.id,
          problem_id: problemId,
          status: status,
          updated_at: new Date().toISOString(),
        },
        { onConflict: ["user_id", "problem_id"] }
      );
      if (error) return jsonResponse({ error: error.message }, 500);

      const { data: streakData, error: streakError } = await supabase
        .from("user_practice_stats")
        .select("current_streak, longest_streak")
        .eq("user_id", authResult.user.id)
        .maybeSingle();
      if (!streakError && streakData) {
        currentStreak = streakData.current_streak ?? 0;
        longestStreak = streakData.longest_streak ?? 0;
      }
    }

    // Return streak data so the client can always trust the server value.
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    const dayOfWeek = now.getDay();
    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - daysToMonday).toISOString();
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
