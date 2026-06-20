import { cookies } from "next/headers";
import { getAuthenticatedUser } from "@/lib/auth";
import { getSupabaseServerClient, jsonResponse, errorResponse } from "@/lib/serverApi";

export async function GET() {
  try {
    const authResult = await getAuthenticatedUser();
    if (!authResult.success) {
      return jsonResponse({ error: "Authentication required" }, 401);
    }

    const cookieStore = await cookies();
    const supabase = getSupabaseServerClient(cookieStore);

    const userId = authResult.user.id;

    const { data: applications, error: appError } = await supabase
      .from("applications")
      .select("status, applied_at, job:job_id(title, company)")
      .eq("student_id", userId);

    if (appError) {
      console.error("[/api/student/dashboard/stats] Applications error:", appError.message);
      return jsonResponse({ error: appError.message }, 500);
    }

    const { count: totalBookmarks, error: bmError } = await supabase
      .from("bookmarks")
      .select("id", { count: "exact", head: true })
      .eq("student_id", userId);

    if (bmError) {
      console.error("[/api/student/dashboard/stats] Bookmarks error:", bmError.message);
    }

    const apps = applications || [];
    const totalApplications = apps.length;
    const pendingApplications = apps.filter((a) => a.status === "pending").length;
    const acceptedApplications = apps.filter((a) => a.status === "accepted").length;
    const rejectedApplications = apps.filter((a) => a.status === "rejected").length;

    const recentActivity = apps
      .slice()
      .sort((a, b) => new Date(b.applied_at) - new Date(a.applied_at))
      .slice(0, 5)
      .map((a) => ({
        jobTitle: a.job?.title || "Unknown",
        company: a.job?.company || "",
        status: a.status,
        date: a.applied_at,
      }));

    return jsonResponse({
      totalApplications,
      pendingApplications,
      acceptedApplications,
      rejectedApplications,
      totalBookmarks: totalBookmarks || 0,
      recentActivity,
    });
  } catch (error) {
    return errorResponse(error);
  }
}
