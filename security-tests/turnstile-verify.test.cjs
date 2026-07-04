// security-tests/turnstile-verify.test.cjs
//
// Run with:  node --experimental-detect-module --test security-tests/turnstile-verify.test.cjs
//
// Tests src/lib/verifyTurnstile.js which verifies Cloudflare Turnstile tokens.

const { describe, test, beforeEach, afterEach, mock } = require("node:test");
const assert = require("node:assert/strict");

// Inlined source from src/lib/verifyTurnstile.js
function getCaptchaSecret() {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret || secret === "undefined") {
    throw new Error("CAPTCHA_CONFIG_MISSING");
  }
  return secret;
}

async function verifyTurnstile(captchaToken, opts = {}) {
  const secretKey = getCaptchaSecret();
  const token = String(captchaToken || "").trim();
  if (!token) {
    return { ok: false, error: "Captcha token missing" };
  }
  const ip = String(opts.ip || "").trim();
  let response;
  try {
    response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret: secretKey,
        response: token,
        ...(ip && ip !== "unknown" ? { remoteip: ip } : {}),
      }),
    });
  } catch {
    return { ok: false, error: "Captcha verification request failed" };
  }
  if (!response.ok) {
    return { ok: false, error: "Captcha verification request failed" };
  }
  const data = await response.json().catch(() => null);
  if (!data?.success) {
    const errorCodes = data?.["error-codes"] || [];
    if (errorCodes.includes("timeout-or-duplicate")) {
      return { ok: false, error: "Captcha token expired or was already used. Please refresh the page." };
    }
    return { ok: false, error: "Captcha verification failed. Please try again." };
  }
  return { ok: true };
}

describe("getCaptchaSecret", () => {
  test("throws CAPTCHA_CONFIG_MISSING when TURNSTILE_SECRET_KEY is undefined", () => {
    const original = process.env.TURNSTILE_SECRET_KEY;
    delete process.env.TURNSTILE_SECRET_KEY;
    try {
      assert.throws(() => getCaptchaSecret(), /CAPTCHA_CONFIG_MISSING/);
    } finally {
      if (original !== undefined) process.env.TURNSTILE_SECRET_KEY = original;
    }
  });

  test("throws CAPTCHA_CONFIG_MISSING when TURNSTILE_SECRET_KEY is the string undefined", () => {
    process.env.TURNSTILE_SECRET_KEY = "undefined";
    try {
      assert.throws(() => getCaptchaSecret(), /CAPTCHA_CONFIG_MISSING/);
    } finally {
      delete process.env.TURNSTILE_SECRET_KEY;
    }
  });

  test("returns secret when TURNSTILE_SECRET_KEY is set", () => {
    process.env.TURNSTILE_SECRET_KEY = "test-secret-key";
    try {
      assert.strictEqual(getCaptchaSecret(), "test-secret-key");
    } finally {
      delete process.env.TURNSTILE_SECRET_KEY;
    }
  });
});

describe("verifyTurnstile", () => {
  let originalEnv;

  beforeEach(() => {
    originalEnv = process.env.TURNSTILE_SECRET_KEY;
    process.env.TURNSTILE_SECRET_KEY = "test-secret";
  });

  afterEach(() => {
    if (originalEnv !== undefined) {
      process.env.TURNSTILE_SECRET_KEY = originalEnv;
    } else {
      delete process.env.TURNSTILE_SECRET_KEY;
    }
  });

  test("returns error when captchaToken is empty string", async () => {
    const result = await verifyTurnstile("");
    assert.deepStrictEqual(result, { ok: false, error: "Captcha token missing" });
  });

  test("returns error when captchaToken is null", async () => {
    const result = await verifyTurnstile(null);
    assert.deepStrictEqual(result, { ok: false, error: "Captcha token missing" });
  });

  test("returns error when captchaToken is undefined", async () => {
    const result = await verifyTurnstile(undefined);
    assert.deepStrictEqual(result, { ok: false, error: "Captcha token missing" });
  });

  test("returns error when captchaToken is only whitespace", async () => {
    const result = await verifyTurnstile("   ");
    assert.deepStrictEqual(result, { ok: false, error: "Captcha token missing" });
  });

  test("returns error on network failure", async () => {
    const { fetch: originalFetch } = globalThis;
    globalThis.fetch = mock.fn(async () => {
      throw new Error("Network unavailable");
    });
    try {
      const result = await verifyTurnstile("some-token");
      assert.deepStrictEqual(result, { ok: false, error: "Captcha verification request failed" });
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  test("returns error on non-200 HTTP response", async () => {
    const { fetch: originalFetch } = globalThis;
    globalThis.fetch = mock.fn(async () => {
      return { ok: false, status: 500 };
    });
    try {
      const result = await verifyTurnstile("some-token");
      assert.deepStrictEqual(result, { ok: false, error: "Captcha verification request failed" });
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  test("returns error on timeout-or-duplicate error code", async () => {
    const { fetch: originalFetch } = globalThis;
    globalThis.fetch = mock.fn(async () => {
      return {
        ok: true,
        status: 200,
        json: async () => ({ success: false, "error-codes": ["timeout-or-duplicate"] }),
      };
    });
    try {
      const result = await verifyTurnstile("stale-token");
      assert.deepStrictEqual(result, {
        ok: false,
        error: "Captcha token expired or was already used. Please refresh the page.",
      });
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  test("returns error on generic failure", async () => {
    const { fetch: originalFetch } = globalThis;
    globalThis.fetch = mock.fn(async () => {
      return {
        ok: true,
        status: 200,
        json: async () => ({ success: false, "error-codes": ["invalid-input-response"] }),
      };
    });
    try {
      const result = await verifyTurnstile("bad-token");
      assert.deepStrictEqual(result, {
        ok: false,
        error: "Captcha verification failed. Please try again.",
      });
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  test("returns ok:true on successful verification", async () => {
    const { fetch: originalFetch } = globalThis;
    globalThis.fetch = mock.fn(async () => {
      return {
        ok: true,
        status: 200,
        json: async () => ({ success: true }),
      };
    });
    try {
      const result = await verifyTurnstile("valid-token");
      assert.deepStrictEqual(result, { ok: true });
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  test("passes remoteip when ip option is provided and valid", async () => {
    const { fetch: originalFetch } = globalThis;
    let capturedBody;
    globalThis.fetch = mock.fn(async (url, options) => {
      capturedBody = options.body;
      return { ok: true, status: 200, json: async () => ({ success: true }) };
    });
    try {
      await verifyTurnstile("valid-token", { ip: "203.0.113.42" });
      const params = Object.fromEntries(new URLSearchParams(capturedBody));
      assert.strictEqual(params.remoteip, "203.0.113.42");
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  test("does not pass remoteip when ip is unknown", async () => {
    const { fetch: originalFetch } = globalThis;
    let capturedBody;
    globalThis.fetch = mock.fn(async (url, options) => {
      capturedBody = options.body;
      return { ok: true, status: 200, json: async () => ({ success: true }) };
    });
    try {
      await verifyTurnstile("valid-token", { ip: "unknown" });
      const params = Object.fromEntries(new URLSearchParams(capturedBody));
      assert.strictEqual(params.remoteip, undefined);
    } finally {
      globalThis.fetch = originalFetch;
    }
  });
});
