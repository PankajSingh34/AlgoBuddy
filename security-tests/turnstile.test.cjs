const { describe, it, beforeEach, afterEach } = require("node:test");
const assert = require("node:assert/strict");

// -------------------------------------------------------------------
// Source functions from src/lib/verifyTurnstile.js (inline for isolation)
// -------------------------------------------------------------------

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

// -------------------------------------------------------------------
// Helpers
// -------------------------------------------------------------------

function withEnv(key, value, fn) {
  const original = process.env[key];
  process.env[key] = value;
  try {
    return fn();
  } finally {
    process.env[key] = original;
  }
}

// -------------------------------------------------------------------
// getCaptchaSecret tests
// -------------------------------------------------------------------

describe("getCaptchaSecret", () => {
  it("throws CAPTCHA_CONFIG_MISSING when TURNSTILE_SECRET_KEY is undefined", () => {
    withEnv("TURNSTILE_SECRET_KEY", undefined, () => {
      assert.throws(
        () => getCaptchaSecret(),
        /CAPTCHA_CONFIG_MISSING/
      );
    });
  });

  it("throws CAPTCHA_CONFIG_MISSING when TURNSTILE_SECRET_KEY is the string 'undefined'", () => {
    withEnv("TURNSTILE_SECRET_KEY", "undefined", () => {
      assert.throws(
        () => getCaptchaSecret(),
        /CAPTCHA_CONFIG_MISSING/
      );
    });
  });

  it("throws CAPTCHA_CONFIG_MISSING when TURNSTILE_SECRET_KEY is empty string", () => {
    withEnv("TURNSTILE_SECRET_KEY", "", () => {
      assert.throws(
        () => getCaptchaSecret(),
        /CAPTCHA_CONFIG_MISSING/
      );
    });
  });

  it("returns the secret when TURNSTILE_SECRET_KEY is set", () => {
    withEnv("TURNSTILE_SECRET_KEY", "test-secret-xyz", () => {
      assert.strictEqual(getCaptchaSecret(), "test-secret-xyz");
    });
  });
});

// -------------------------------------------------------------------
// verifyTurnstile tests (mocked fetch)
// -------------------------------------------------------------------

describe("verifyTurnstile", () => {
  const ORIGINAL_ENV = process.env.TURNSTILE_SECRET_KEY;

  beforeEach(() => {
    process.env.TURNSTILE_SECRET_KEY = "test-secret-key";
  });

  afterEach(() => {
    process.env.TURNSTILE_SECRET_KEY = ORIGINAL_ENV;
    // Reset global fetch if it was mocked
    if (global.__mockFetch) {
      global.fetch = global.__mockFetch;
      delete global.__mockFetch;
    }
  });

  function mockFetch(mockFn) {
    global.__mockFetch = global.fetch;
    global.fetch = mockFn;
  }

  it("returns error when token is empty string", async () => {
    const result = await verifyTurnstile("");
    assert.deepStrictEqual(result, { ok: false, error: "Captcha token missing" });
  });

  it("returns error when token is only whitespace", async () => {
    const result = await verifyTurnstile("   \n\t");
    assert.deepStrictEqual(result, { ok: false, error: "Captcha token missing" });
  });

  it("returns error when token is undefined", async () => {
    const result = await verifyTurnstile(undefined);
    assert.deepStrictEqual(result, { ok: false, error: "Captcha token missing" });
  });

  it("returns error when token is null", async () => {
    const result = await verifyTurnstile(null);
    assert.deepStrictEqual(result, { ok: false, error: "Captcha token missing" });
  });

  it("returns error when fetch throws (network failure)", async () => {
    mockFetch(() => {
      throw new Error("Connection refused");
    });

    const result = await verifyTurnstile("valid-token");
    assert.deepStrictEqual(result, {
      ok: false,
      error: "Captcha verification request failed",
    });
  });

  it("returns error when HTTP response is not ok", async () => {
    mockFetch(() =>
      Promise.resolve({
        ok: false,
        status: 500,
        json: () => Promise.resolve({}),
      })
    );

    const result = await verifyTurnstile("valid-token");
    assert.deepStrictEqual(result, {
      ok: false,
      error: "Captcha verification request failed",
    });
  });

  it("returns specific message for timeout-or-duplicate error code", async () => {
    mockFetch(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            success: false,
            "error-codes": ["timeout-or-duplicate"],
          }),
      })
    );

    const result = await verifyTurnstile("expired-token");
    assert.deepStrictEqual(result, {
      ok: false,
      error: "Captcha token expired or was already used. Please refresh the page.",
    });
  });

  it("returns generic message for other error codes", async () => {
    mockFetch(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            success: false,
            "error-codes": ["invalid-input-response"],
          }),
      })
    );

    const result = await verifyTurnstile("bad-token");
    assert.deepStrictEqual(result, {
      ok: false,
      error: "Captcha verification failed. Please try again.",
    });
  });

  it("returns generic message when error-codes is absent", async () => {
    mockFetch(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: false }),
      })
    );

    const result = await verifyTurnstile("bad-token");
    assert.deepStrictEqual(result, {
      ok: false,
      error: "Captcha verification failed. Please try again.",
    });
  });

  it("returns ok: true when verification succeeds", async () => {
    mockFetch(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      })
    );

    const result = await verifyTurnstile("valid-token");
    assert.deepStrictEqual(result, { ok: true });
  });

  it("passes remoteip to fetch when valid ip is provided", async () => {
    let capturedBodyStr;
    mockFetch((url, options) => {
      capturedBodyStr = options.body.toString();
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      });
    });

    await verifyTurnstile("valid-token", { ip: "192.168.1.1" });
    assert.ok(capturedBodyStr.includes("remoteip=192.168.1.1"));
  });

  it("omits remoteip when ip is 'unknown'", async () => {
    let capturedBodyStr;
    mockFetch((url, options) => {
      capturedBodyStr = options.body.toString();
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      });
    });

    await verifyTurnstile("valid-token", { ip: "unknown" });
    assert.ok(!capturedBodyStr.includes("remoteip"));
  });

  it("omits remoteip when ip is empty string", async () => {
    let capturedBodyStr;
    mockFetch((url, options) => {
      capturedBodyStr = options.body.toString();
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      });
    });

    await verifyTurnstile("valid-token", { ip: "" });
    assert.ok(!capturedBodyStr.includes("remoteip"));
  });
});
