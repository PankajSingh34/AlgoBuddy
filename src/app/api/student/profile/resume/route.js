import { getSupabaseAdmin, jsonResponse, errorResponse } from "@/lib/serverApi";
import { getAuthenticatedUser } from "@/lib/auth";
import { validateResumeFile, saveResumeFile } from "@/lib/upload";

export async function POST(request) {
  try {
    const authResult = await getAuthenticatedUser();
    if (!authResult.success) {
      return jsonResponse({ error: "Authentication required" }, 401);
    }

    const formData = await request.formData();
    const file = formData.get("resume");

    const validation = validateResumeFile(file);
    if (!validation.valid) {
      return jsonResponse({ error: validation.error }, 400);
    }

    const resumeUrl = await saveResumeFile(file, authResult.user.id);

    const supabase = getSupabaseAdmin();

    const meta = { ...authResult.user.user_metadata, resume_file_url: resumeUrl };

    const { error: updateError } = await supabase.auth.admin.updateUserById(
      authResult.user.id,
      { user_metadata: meta }
    );

    if (updateError) {
      return jsonResponse({ error: updateError.message }, 500);
    }

    return jsonResponse({ resumeUrl }, 200);
  } catch (error) {
    return errorResponse(error);
  }
}
