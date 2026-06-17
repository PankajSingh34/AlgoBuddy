import { cookies } from "next/headers";
import { getAuthenticatedUser } from "@/lib/auth";
import { getSupabaseServerClient, getSupabaseAdmin, jsonResponse, errorResponse } from "@/lib/serverApi";

export async function PATCH(request, { params }) {
  try {
    const authResult = await getAuthenticatedUser();
    if (!authResult.success) {
      return jsonResponse({ error: "Authentication required" }, 401);
    }

    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const { status } = body;

    if (!status || !["accepted", "rejected"].includes(status)) {
      return jsonResponse({ error: "Status must be 'accepted' or 'rejected'" }, 400);
    }

    const cookieStore = await cookies();
    const supabase = getSupabaseServerClient(cookieStore);

    const { data: application, error: fetchError } = await supabase
      .from("applications")
      .select("*, job:job_id(title, company)")
      .eq("id", id)
      .single();

    if (fetchError || !application) {
      return jsonResponse({ error: "Application not found" }, 404);
    }

    if (application.status === status) {
      return jsonResponse({ error: `Application is already ${status}` }, 400);
    }

    const oldStatus = application.status;
    const adminClient = getSupabaseAdmin();

    const { error: updateError } = await adminClient
      .from("applications")
      .update({ status })
      .eq("id", id);

    if (updateError) {
      console.error("[/api/applications/[id] PATCH] Supabase error:", updateError.message);
      return jsonResponse({ error: updateError.message }, 500);
    }

    const statusLabel = status === "accepted" ? "accepted" : "rejected";
    const jobTitle = application.job?.title || "a job";
    const companyName = application.job?.company || "";

    const { error: notifError } = await adminClient
      .from("notifications")
      .insert({
        student_id: application.student_id,
        job_id: application.job_id,
        message: `Your application for ${jobTitle}${companyName ? ` at ${companyName}` : ""} has been ${statusLabel}.`,
        type: "application_status_update",
        metadata: { old_status: oldStatus, new_status: status },
      });

    if (notifError) {
      console.error("[/api/applications/[id] PATCH] Notification insert error:", notifError.message);
    }

    return jsonResponse({ success: true, status });
  } catch (error) {
    return errorResponse(error);
  }
}
