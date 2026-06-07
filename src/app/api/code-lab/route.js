import { applyRateLimit } from "@/lib/rateLimit/rateLimitMiddleware";
import { executeCode } from "@/lib/sandbox/executor";
import { EXECUTION_STATUS, EXECUTION_MESSAGES } from "@/lib/sandbox/errorCodes";
import { jsonResponse, errorResponse } from "@/lib/serverApi";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const limitResponse = await applyRateLimit(request);
    if (limitResponse) return limitResponse;

    let body;
    try {
      body = await request.json();
    } catch {
      return jsonResponse({ error: "Invalid JSON in request body" }, 400);
    }

    const { code } = body;

    if (typeof code !== "string") {
      return jsonResponse({ error: "`code` must be a string" }, 400);
    }

    if (code.trim().length === 0) {
      return jsonResponse({ error: "No code provided" }, 400);
    }

    if (code.length > 50_000) {
      return jsonResponse({ error: "Code exceeds maximum allowed length (50 000 characters)" }, 400);
    }

    let result;
    try {
      result = await executeCode(code);
    } catch (unexpectedError) {
      console.error("[code-lab] Unexpected executor error:", unexpectedError);
      return jsonResponse(
        {
          status: EXECUTION_STATUS.INTERNAL_ERROR,
          message: EXECUTION_MESSAGES[EXECUTION_STATUS.INTERNAL_ERROR],
          output: "",
          error: "An internal error occurred. Please try again.",
          executionTime: 0,
          memoryUsed: 0,
        },
        500
      );
    }

    const httpStatus =
      result.status === EXECUTION_STATUS.SUCCESS ||
      result.status === EXECUTION_STATUS.RUNTIME_ERROR
        ? 200
        : result.status === EXECUTION_STATUS.TLE ||
          result.status === EXECUTION_STATUS.MLE
        ? 200
        : 500;

    return jsonResponse(
      {
        status: result.status,
        message: EXECUTION_MESSAGES[result.status] ?? result.status,
        output: result.output ?? "",
        error: result.error ?? null,
        executionTime: result.executionTime,
        memoryUsed: result.memoryUsed,
      },
      httpStatus
    );
  } catch (error) {
    return errorResponse(error);
  }
}

export function GET() {
  return jsonResponse({ error: "Method Not Allowed" }, 405);
}