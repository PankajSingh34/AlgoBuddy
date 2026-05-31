import { claimSessionPresenter, validateCsrfOrigin } from "@/lib/collaboration/sessionStore";
import { checkRateLimit } from "@/lib/rateLimit";
import { getClientIp } from "@/lib/getClientIp";

export async function POST(request, { params }) {
  if (!validateCsrfOrigin(request)) {
    return Response.json({ error: "CSRF validation failed" }, { status: 403 });
  }

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
    presenterId: body.presenterId,
    sessionSecret: body.sessionSecret,
  });

  if (result.error) {
    return Response.json({ error: result.error }, { status: result.status || 400 });
  }

  return Response.json(result);
}
