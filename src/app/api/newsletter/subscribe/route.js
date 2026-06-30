import { getSupabaseAdmin, jsonResponse, errorResponse } from "@/lib/serverApi";
import { checkRateLimit } from "@/lib/rateLimit";
import { getClientIp } from "@/lib/getClientIp";

const NEWSLETTER_RATE_LIMIT = 5;

export async function POST(req) {
  try {
    const ip = getClientIp(req.headers);
    const { allowed, resetAt } = await checkRateLimit(`newsletter:${ip}`);
    if (!allowed) {
      const retryAfter = Math.max(1, Math.ceil((resetAt - Date.now()) / 1000));
      return jsonResponse({ error: "Too many requests. Please try again later." }, 429, {
        "Retry-After": retryAfter.toString(),
        "X-RateLimit-Limit": NEWSLETTER_RATE_LIMIT.toString(),
        "X-RateLimit-Remaining": "0",
      });
    }

    const { email } = await req.json();
    const normalizedEmail = String(email || "").trim().toLowerCase();

    if (!normalizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
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
