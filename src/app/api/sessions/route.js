import { getAuthenticatedUser } from "@/lib/auth";
import {
  createCollaborationSession,
  listCollaborationSessions,
  validateCsrfOrigin,
} from "@/lib/collaboration/sessionStore";
import { checkRateLimit } from "@/lib/rateLimit";
import { getClientIp } from "@/lib/getClientIp";

export async function GET(request) {
  const ip = getClientIp(request.headers);
  const { allowed } = await checkRateLimit(`collab:list:${ip}`);
  if (!allowed) {
    return Response.json(
      { error: "Too many requests. Please try again shortly." },
      { status: 429 },
    );
  }

  const { searchParams } = new URL(request.url);
  const limitParam = searchParams.get("limit");
  const cursor = searchParams.get("cursor");

  if (cursor !== null && (typeof cursor !== "string" || cursor.trim() === "")) {
    return Response.json(
      { error: "Invalid cursor parameter." },
      { status: 400 },
    );
  }

  const limit = limitParam ? Number(limitParam) : undefined;
  const { sessions, nextCursor } = await listCollaborationSessions({
    limit: limit && !Number.isNaN(limit) ? limit : undefined,
    cursor: cursor ?? undefined,
  });
  return Response.json({ sessions, nextCursor: nextCursor ?? null });
}

export async function POST(request) {
  try {
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
    const { allowed } = await checkRateLimit(`collab:create:${ip}`);
    if (!allowed) {
      return Response.json(
        { error: "Too many collaboration sessions created. Please try again shortly." },
        { status: 429 },
      );
    }

    const body = await request.json().catch(() => null);
    const { title, visibility, password, module } = body || {};
    // Ensure createdBy is strictly inferred from the authenticated user token (preventing spoofing)
    const createdBy = user?.id || "";

    if (visibility === "private" && !password) {
      return Response.json(
        { error: "A password is required for private sessions." },
        { status: 400 },
      );
    }

    const result = await createCollaborationSession({
      title,
      visibility,
      password,
      module,
      createdBy,
    });

    return Response.json({
      session: result.session,
      sessionSecret: result.sessionSecret,
      joinUrl: `/visualizer/dry-run?session=${result.session.joinCode}`,
    });
  } catch (error) {
    return Response.json(
      { error: error?.message || "Failed to create collaboration session" },
      { status: 500 },
    );
  }
}
