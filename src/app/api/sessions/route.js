import { getAuthenticatedUser } from "@/lib/auth";
import {
  createCollaborationSession,
  listCollaborationSessions,
  validateCsrfOrigin,
} from "@/lib/collaboration/sessionStore";
import { checkRateLimit } from "@/lib/rateLimit";
import { getClientIp } from "@/lib/getClientIp";
import { jsonResponse, errorResponse } from "@/lib/serverApi";

export async function GET(request) {
  try {
    const ip = getClientIp(request.headers);
    const { allowed } = await checkRateLimit(`collab:list:${ip}`);
    if (!allowed) {
      return jsonResponse({ error: "Too many requests. Please try again shortly." }, 429);
    }

    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get("limit");
    const cursor = searchParams.get("cursor");

    if (cursor !== null && (typeof cursor !== "string" || cursor.trim() === "")) {
      return jsonResponse({ error: "Invalid cursor parameter." }, 400);
    }

    const limit = limitParam ? Number(limitParam) : undefined;
    const { sessions, nextCursor } = await listCollaborationSessions({
      limit: limit && !Number.isNaN(limit) ? limit : undefined,
      cursor: cursor ?? undefined,
    });
    return jsonResponse({ sessions, nextCursor: nextCursor ?? null });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request) {
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
    const { allowed } = await checkRateLimit(`collab:create:${ip}`);
    if (!allowed) {
      return jsonResponse(
        { error: "Too many collaboration sessions created. Please try again shortly." },
        429,
      );
    }

    const body = await request.json().catch(() => null);
    const { title, visibility, password, module } = body || {};
    const createdBy = user?.id || "";

    if (visibility === "private" && !password) {
      return jsonResponse({ error: "A password is required for private sessions." }, 400);
    }

    const result = await createCollaborationSession({
      title,
      visibility,
      password,
      module,
      createdBy,
    });

    return jsonResponse({
      session: result.session,
      sessionSecret: result.sessionSecret,
      joinUrl: `/visualizer/dry-run?session=${result.session.joinCode}`,
    });
  } catch (error) {
    return errorResponse(error);
  }
}
