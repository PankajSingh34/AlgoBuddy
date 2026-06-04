// app/api/code-lab/route.js
//
// WHAT CHANGED FROM THE ORIGINAL
// ─────────────────────────────────────────────────────────────────────
// BEFORE: user code was executed directly in this Node.js process
//         (e.g. via eval, vm.runInNewContext, or child_process.exec).
//         That exposed the server to DoS, OOM, and arbitrary code execution.
//
// AFTER:
//   • applyRateLimit()  →  429 if user fires too many requests
//   • executeCode()     →  runs user code in an isolated V8 isolate
//                          with 1000 ms timeout + 32 MB memory cap
//   • Structured JSON   →  { status, output, error, executionTime, memoryUsed }
//
// The only import you need to change if you add TypeScript support is
// the return type annotation.

import { NextResponse } from "next/server";
import { applyRateLimit } from "@/lib/rateLimit/rateLimitMiddleware";
import { executeCode } from "@/lib/sandbox/executor";
import { EXECUTION_STATUS, EXECUTION_MESSAGES } from "@/lib/sandbox/errorCodes";

export const runtime = "nodejs"; // required — isolated-vm needs Node.js runtime
export const dynamic = "force-dynamic";

export async function POST(request) {
  // ── Layer 3: Rate limiting ─────────────────────────────────────────
  const limitResponse = await applyRateLimit(request);
  if (limitResponse) return limitResponse; // 429

  // ── Parse and validate request body ───────────────────────────────
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON in request body" },
      { status: 400 }
    );
  }

  const { code } = body;

  if (typeof code !== "string") {
    return NextResponse.json(
      { error: "`code` must be a string" },
      { status: 400 }
    );
  }

  if (code.trim().length === 0) {
    return NextResponse.json(
      { error: "No code provided" },
      { status: 400 }
    );
  }

  // Optional: reject obviously huge payloads before they reach the sandbox
  if (code.length > 50_000) {
    return NextResponse.json(
      { error: "Code exceeds maximum allowed length (50 000 characters)" },
      { status: 400 }
    );
  }

  // ── Layer 1 + 2: Sandboxed execution ──────────────────────────────
  let result;
  try {
    result = await executeCode(code);
  } catch (unexpectedError) {
    // This catch is for errors in the executor itself, not user code.
    console.error("[code-lab] Unexpected executor error:", unexpectedError);
    return NextResponse.json(
      {
        status: EXECUTION_STATUS.INTERNAL_ERROR,
        message: EXECUTION_MESSAGES[EXECUTION_STATUS.INTERNAL_ERROR],
        output: "",
        error: "An internal error occurred. Please try again.",
        executionTime: 0,
        memoryUsed: 0,
      },
      { status: 500 }
    );
  }

  // ── Build structured response ──────────────────────────────────────
  const httpStatus =
    result.status === EXECUTION_STATUS.SUCCESS ||
    result.status === EXECUTION_STATUS.RUNTIME_ERROR
      ? 200 // runtime errors are "successful" requests; the error is user-facing
      : result.status === EXECUTION_STATUS.TLE ||
        result.status === EXECUTION_STATUS.MLE
      ? 200 // same — these are execution results, not server errors
      : 500;

  return NextResponse.json(
    {
      status: result.status,
      message: EXECUTION_MESSAGES[result.status] ?? result.status,
      output: result.output ?? "",
      error: result.error ?? null,
      executionTime: result.executionTime,
      memoryUsed: result.memoryUsed,
    },
    { status: httpStatus }
  );
}

// Reject GET/PUT/etc.
export function GET() {
  return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
}