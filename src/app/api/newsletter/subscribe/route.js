import { checkRateLimit } from "@/lib/rateLimit";
import { getClientIp } from "@/lib/getClientIp";
import { getSupabaseAdmin, jsonResponse, errorResponse } from "@/lib/serverApi";
import { RATE_LIMITS } from "@/config/rateLimits";

export async function POST(req) {
  try {
    const ip = getClientIp(req.headers);
    const { allowed, remaining, resetAt } = await checkRateLimit(`newsletter:${ip}`);
    if (!allowed) {
      const retryAfter = Math.ceil((resetAt - Date.now()) / 1000);
      return jsonResponse({ message: "Too many requests. Please try again later." }, 429, {
        "Retry-After": retryAfter.toString(),
        "X-RateLimit-Limit": RATE_LIMITS.NEWSLETTER_API.LIMIT.toString(),
        "X-RateLimit-Remaining": "0",
      });
    }

    const { email } = await req.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return jsonResponse({ error: "Invalid email address" }, 400);
    }

    const supabase = getSupabaseAdmin();

    const { error } = await supabase
      .from('newsletter_subscriptions')
      .insert([{ email }])
      .select()
      .single();

    if (error) {
      if (error.code === '23505') { // Postgres unique violation error code
        return jsonResponse({ message: "You are already subscribed!" }, 200);
      }
      console.error("Newsletter subscription error:", error);
      return errorResponse({ status: 500, message: "Failed to subscribe. Please try again later." });
    }

    return jsonResponse({ message: "Successfully subscribed!" }, 201, {
      "X-RateLimit-Limit": RATE_LIMITS.NEWSLETTER_API.LIMIT.toString(),
      "X-RateLimit-Remaining": remaining.toString(),
    });
  } catch (error) {
    console.error("Newsletter API error:", error);
    return errorResponse({ status: 500, message: "Internal server error" });
  }
}
