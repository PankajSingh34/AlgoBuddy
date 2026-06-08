import { getAuthenticatedUser } from "@/lib/auth";
import { exchangeRealtimeSubscriptionToken } from "@/lib/collaboration/sessionStore";
import { checkRateLimit } from "@/lib/rateLimit";
import { getClientIp } from "@/lib/getClientIp";

export async function POST(request, { params }) {
  const authResult = await getAuthenticatedUser();
  if (!authResult.success) {
    if (authResult.type === "CONFIG_ERROR" || authResult.type === "AUTH_PROVIDER_ERROR") {
      return Response.json(
        { error: "Authentication service unavailable" },
        { status: 500 },
      );
    }
    return Response.json(
      { error: "Authentication required" },
      { status: 401 },
    );
  }

  const user = authResult.user;

  const ip = getClientIp(request.headers);
  const { allowed } = await checkRateLimit(`collab:realtime:${ip}:${params.sessionId}`);
  if (!allowed) {
    return Response.json(
      { error: "Too many realtime token exchange attempts. Please try again shortly." },
      { status: 429 },
    );
  }

  const body = await request.json().catch(() => ({}));
  const result = await exchangeRealtimeSubscriptionToken(params.sessionId, {
    subscriptionToken: body.subscriptionToken,
    userId: user.id,
  });

  if (result.error) {
    return Response.json({ error: result.error }, { status: result.status || 400 });
  }

  return Response.json(result);
}
