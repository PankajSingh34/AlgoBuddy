import { getAuthenticatedUser } from "@/lib/auth";
import { exchangeRealtimeSubscriptionToken } from "@/lib/collaboration/sessionStore";
import { checkRateLimit } from "@/lib/rateLimit";
import { getClientIp } from "@/lib/getClientIp";
import { jsonResponse, errorResponse } from "@/lib/serverApi";

export async function POST(request, { params }) {
  try {
    const authResult = await getAuthenticatedUser();
    if (!authResult.success) {
      if (authResult.type === "CONFIG_ERROR" || authResult.type === "AUTH_PROVIDER_ERROR") {
        return jsonResponse({ error: "Authentication service unavailable" }, 500);
      }
      return jsonResponse({ error: "Authentication required" }, 401);
    }

    const user = authResult.user;

    const ip = getClientIp(request.headers);
    const { allowed } = await checkRateLimit(`collab:realtime:${ip}:${params.sessionId}`);
    if (!allowed) {
      return jsonResponse({ error: "Too many realtime token exchange attempts. Please try again shortly." }, 429);
    }

    const body = await request.json().catch(() => ({}));
    const result = await exchangeRealtimeSubscriptionToken(params.sessionId, {
      subscriptionToken: body.subscriptionToken,
      userId: user.id,
    });

    if (result.error) {
      return jsonResponse({ error: result.error }, result.status || 400);
    }

    return jsonResponse(result);
  } catch (error) {
    return errorResponse(error);
  }
}
