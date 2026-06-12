import { getAuthenticatedUser } from "@/lib/auth";
import { claimSessionPresenter, validateCsrfOrigin } from "@/lib/collaboration/sessionStore";
import { checkRateLimit } from "@/lib/rateLimit";
import { getClientIp } from "@/lib/getClientIp";
import { jsonResponse, errorResponse } from "@/lib/serverApi";

export async function POST(request, { params }) {
  try {
    if (!validateCsrfOrigin(request)) {
      return jsonResponse({ error: "CSRF validation failed" }, 403);
    }

    const authResult = await getAuthenticatedUser();
    if (!authResult.success) {
      if (authResult.type === "CONFIG_ERROR" || authResult.type === "AUTH_PROVIDER_ERROR") {
        return jsonResponse({ error: "Authentication service unavailable" }, 500);
      }
      return jsonResponse({ error: "Authentication required" }, 401);
    }

    const user = authResult.user;

    const ip = getClientIp(request.headers);
    const { allowed } = await checkRateLimit(`collab:presenter:${ip}:${params.sessionId}`);
    if (!allowed) {
      return jsonResponse({ error: "Too many presenter updates. Please try again shortly." }, 403);
    }

    const body = await request.json().catch(() => ({}));
    const result = await claimSessionPresenter(params.sessionId, {
      userId: user.id,
      sessionSecret: body.sessionSecret,
    });

    if (result.error) {
      return jsonResponse({ error: result.error }, result.status || 400);
    }

    return jsonResponse(result);
  } catch (error) {
    return errorResponse(error);
  }
}
