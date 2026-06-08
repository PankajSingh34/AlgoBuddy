import { getAuthenticatedUser } from "@/lib/auth";
import { claimSessionPresenter, validateCsrfOrigin } from "@/lib/collaboration/sessionStore";
import { checkRateLimit } from "@/lib/rateLimit";
import { getClientIp } from "@/lib/getClientIp";

export async function POST(request, { params }) {
  if (!validateCsrfOrigin(request)) {
    return Response.json({ error: "CSRF validation failed" }, { status: 403 });
  }

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
  const { allowed } = await checkRateLimit(`collab:presenter:${ip}:${params.sessionId}`);
  if (!allowed) {
    return Response.json(
      { error: "Too many presenter updates. Please try again shortly." },
      { status: 403 },
    );
  }

  const body = await request.json().catch(() => ({}));
  const result = await claimSessionPresenter(params.sessionId, {
    userId: user.id,
    sessionSecret: body.sessionSecret,
  });

  if (result.error) {
    return Response.json({ error: result.error }, { status: result.status || 400 });
  }

  return Response.json(result);
}
