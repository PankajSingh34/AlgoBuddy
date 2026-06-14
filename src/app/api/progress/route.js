import { cookies } from "next/headers";
import { getAuthenticatedUser } from "@/lib/auth";
import { getSupabaseServerClient, jsonResponse, errorResponse } from "@/lib/serverApi";

// GET /api/progress
// Returns all problem progress for the authenticated user as a flat array
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
    const { data, error } = await supabase
      .from("user_progress")
      .select("problem_id, status, updated_at")
      .eq("user_id", authResult.user.id);

    if (error) return jsonResponse({ error: error.message }, 500);

    // Return as map: { [problemId]: { status, updatedAt } }
    const progressMap = {};
    (data || []).forEach((row) => {
      if (row.problem_id) {
        progressMap[row.problem_id] = {
          status: row.status,
          updatedAt: row.updated_at,
        };
      }
    });

    return jsonResponse({ progress: progressMap });
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
    return jsonResponse({ success: true });
  } catch (error) {
    return errorResponse(error);
  }
}
