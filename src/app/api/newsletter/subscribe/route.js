import { getSupabaseAdmin, jsonResponse, errorResponse } from "@/lib/serverApi";
import { isValidNewsletterEmail, normalizeNewsletterEmail } from "@/lib/newsletter";

export async function POST(req) {
  try {
    const { email } = await req.json();
    const normalizedEmail = normalizeNewsletterEmail(email);

    if (!isValidNewsletterEmail(normalizedEmail)) {
      return jsonResponse({ error: "Invalid email address" }, 400);
    }

    const supabase = getSupabaseAdmin();

    const { error } = await supabase
      .from('newsletter_subscriptions')
      .insert([{ email: normalizedEmail }])
      .select()
      .single();

    if (error) {
      if (error.code === '23505') { // Postgres unique violation error code
        return jsonResponse({ message: "You are already subscribed!" }, 200);
      }
      console.error("Newsletter subscription error:", error);
      return errorResponse({ status: 500, message: "Failed to subscribe. Please try again later." });
    }

    return jsonResponse({ message: "Successfully subscribed!" }, 201);
  } catch (error) {
    console.error("Newsletter API error:", error);
    return errorResponse({ status: 500, message: "Internal server error" });
  }
}
