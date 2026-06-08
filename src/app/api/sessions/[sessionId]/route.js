import { getAuthenticatedUser } from "@/lib/auth";
import {
  getPublicCollaborationSession,
  joinCollaborationSession,
  validateCsrfOrigin,
} from "@/lib/collaboration/sessionStore";
import { checkRateLimit } from "@/lib/rateLimit";
import { getClientIp } from "@/lib/getClientIp";

export async function GET(request, { params }) {
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

  const ip = getClientIp(request.headers);
  const { allowed } = await checkRateLimit(`collab:lookup:${ip}`);

  if (!allowed) {
    return Response.json(
      { error: "Too many session lookup requests. Please try again shortly." },
      { status: 429 },
    );
  }
 
  const session = await getPublicCollaborationSession(params.sessionId);

  if (!session) {
    return Response.json({ error: "Session not found" }, { status: 404 });
  }

  return Response.json({ session });
}

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
  const { allowed } = await checkRateLimit(`collab:join:${ip}:${params.sessionId}`);
  if (!allowed) {
    return Response.json(
      { error: "Too many join attempts. Please try again shortly." },
      { status: 429 },
    );
  }

  const body = await request.json().catch(() => ({}));
  const result = await joinCollaborationSession(params.sessionId, {
    password: body.password,
    userId: user.id,
  });

  if (result.error) {
    return Response.json({ error: result.error }, { status: result.status || 400 });
  }

  return Response.json(result);
}
