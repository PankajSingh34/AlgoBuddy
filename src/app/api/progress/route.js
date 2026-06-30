import { cookies } from "next/headers";
import { getAuthenticatedUser } from "@/lib/auth";
import { getSupabaseServerClient, jsonResponse, errorResponse } from "@/lib/serverApi";

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function toDateOnly(value) {
  if (!value) return null;
  const date = new Date(`${value}T00:00:00.000Z`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function reconcileStreakGap(stats, today) {
  if (!stats?.last_active_date) {
    return false;
  }

  const currentDay = toDateOnly(today);
  const lastActive = toDateOnly(stats.last_active_date);
  if (!currentDay || !lastActive) {
    return false;
  }

  const daysSinceLastActive = Math.floor((currentDay - lastActive) / MS_PER_DAY);
  if (daysSinceLastActive < 2) {
    return false;
  }

  if (daysSinceLastActive === 2 && (stats.streak_freezes ?? 0) > 0) {
    stats.streak_freezes -= 1;
    stats.last_active_date = new Date(currentDay.getTime() - MS_PER_DAY).toISOString().slice(0, 10);
    return true;
  }

  if ((stats.current_streak ?? 0) !== 0) {
    stats.current_streak = 0;
    return true;
  }

  return false;
}

// GET /api/progress
// Returns all problem progress for the authenticated user as a flat array,
// along with streak data so the client can trust the server state.
export async function GET() {
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
    const today = new Date().toISOString().slice(0, 10);

    const [progressResult, statsResult] = await Promise.all([
      supabase
        .from("user_progress")
        .select("problem_id, status, updated_at")
        .eq("user_id", authResult.user.id),
      supabase
        .from("user_practice_stats")
        .select("current_streak, longest_streak, streak_freezes, last_active_date")
        .eq("user_id", authResult.user.id)
        .maybeSingle(),
    ]);

    if (progressResult.error) return jsonResponse({ error: progressResult.error.message }, 500);

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
    if (stats && reconcileStreakGap(stats, today)) {
      const { error: updateError } = await supabase
        .from("user_practice_stats")
        .update({
          current_streak: stats.current_streak,
          longest_streak: stats.longest_streak,
          streak_freezes: stats.streak_freezes,
          last_active_date: stats.last_active_date,
        })
        .eq("user_id", authResult.user.id);

      if (updateError) return jsonResponse({ error: updateError.message }, 500);
    }

    return jsonResponse({
      progress: progressMap,
      currentStreak: stats?.current_streak ?? 0,
      longestStreak: stats?.longest_streak ?? 0,
      streakFreezes: stats?.streak_freezes ?? 1,
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
    const today = new Date().toISOString().slice(0, 10);
    const yesterday = new Date(Date.now() - MS_PER_DAY).toISOString().slice(0, 10);

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

    let currentStreak = 0;
    let longestStreak = 0;
    let streakFreezes = 1;

    if (status === "Completed") {
      const { data: stats, error: fetchError } = await supabase
        .from("user_practice_stats")
        .select("current_streak, longest_streak, last_active_date, streak_freezes")
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
            streak_freezes: 1,
            visualized_count: 0,
          });

        if (insertError) return jsonResponse({ error: insertError.message }, 500);
        currentStreak = 1;
        longestStreak = 1;
        streakFreezes = 1;
      } else {
        if (reconcileStreakGap(stats, today)) {
          const { error: reconcileError } = await supabase
            .from("user_practice_stats")
            .update({
              current_streak: stats.current_streak,
              longest_streak: stats.longest_streak,
              last_active_date: stats.last_active_date,
              streak_freezes: stats.streak_freezes,
            })
            .eq("user_id", authResult.user.id);

          if (reconcileError) return jsonResponse({ error: reconcileError.message }, 500);
        }

        const lastActive = stats.last_active_date;
        let newCurrent = stats.current_streak;
        let newLongest = stats.longest_streak;

        if (!lastActive) {
          newCurrent = 1;
          newLongest = 1;
        } else if (lastActive === today) {
          // already incremented today — preserve existing values
        } else if (lastActive === yesterday) {
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
            streak_freezes: stats.streak_freezes ?? 1,
          })
          .eq("user_id", authResult.user.id);

        if (updateError) return jsonResponse({ error: updateError.message }, 500);
        currentStreak = newCurrent;
        longestStreak = newLongest;
        streakFreezes = stats.streak_freezes ?? 1;
      }
    } else {
      const { data: stats } = await supabase
        .from("user_practice_stats")
        .select("current_streak, longest_streak, streak_freezes")
        .eq("user_id", authResult.user.id)
        .maybeSingle();

      currentStreak = stats?.current_streak ?? 0;
      longestStreak = stats?.longest_streak ?? 0;
      streakFreezes = stats?.streak_freezes ?? 1;
    }

    return jsonResponse({
      success: true,
      currentStreak,
      longestStreak,
      streakFreezes,
    });
  } catch (error) {
    return errorResponse(error);
  }
}
