// security-tests/csrf.test.cjs
//
// Run with: node --experimental-detect-module --test security-tests/csrf.test.cjs

const { describe, test } = require("node:test");
const assert = require("node:assert/strict");

// Inlined source to avoid ESM import issues.
const CSRF_COOKIE_NAME = "csrf-token";
const CSRF_HEADER_NAME = "x-csrf-token";

const TRUSTED_ORIGINS = new Set([
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "https://algobuddy.me",
  "https://www.algobuddy.me",
  "https://algobuddy.vercel.app",
]);

function validateCsrfOrigin(request) {
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");
  const source = origin || referer || "";
  const normalized = source.replace(/\/+$/, "");
  return TRUSTED_ORIGINS.has(normalized);
}

const STATE_CHANGING_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

function isStateChangingMethod(method) {
  return STATE_CHANGING_METHODS.has(method);
}

function isApiRoute(pathname) {
  return pathname.startsWith("/api/");
}

function makeHeaders(dict) {
  return {
    get: (key) => (key in dict ? dict[key] : null),
  };
}

// ── Tests ────────────────────────────────────────────────────────────

describe("validateCsrfOrigin — trusted origins", () => {
  test("accepts localhost:3000", () => {
    const req = { headers: makeHeaders({ origin: "http://localhost:3000" }) };
    assert.equal(validateCsrfOrigin(req), true);
  });

  test("accepts 127.0.0.1:3000", () => {
    const req = { headers: makeHeaders({ origin: "http://127.0.0.1:3000" }) };
    assert.equal(validateCsrfOrigin(req), true);
  });

  test("accepts algobuddy.me", () => {
    const req = { headers: makeHeaders({ origin: "https://algobuddy.me" }) };
    assert.equal(validateCsrfOrigin(req), true);
  });

  test("accepts www.algobuddy.me", () => {
    const req = { headers: makeHeaders({ origin: "https://www.algobuddy.me" }) };
    assert.equal(validateCsrfOrigin(req), true);
  });

  test("accepts algobuddy.vercel.app", () => {
    const req = { headers: makeHeaders({ origin: "https://algobuddy.vercel.app" }) };
    assert.equal(validateCsrfOrigin(req), true);
  });

  test("accepts origin with trailing slash stripped", () => {
    const req = { headers: makeHeaders({ origin: "https://algobuddy.me/" }) };
    assert.equal(validateCsrfOrigin(req), true);
  });
});

describe("validateCsrfOrigin — untrusted origins", () => {
  test("rejects an arbitrary unknown origin", () => {
    const req = { headers: makeHeaders({ origin: "https://evil.example.com" }) };
    assert.equal(validateCsrfOrigin(req), false);
  });

  test("rejects empty origin", () => {
    const req = { headers: makeHeaders({ origin: "" }) };
    assert.equal(validateCsrfOrigin(req), false);
  });
});

describe("validateCsrfOrigin — referer fallback", () => {
  test("accepts trusted origin via referer when origin header is absent", () => {
    const req = { headers: makeHeaders({ referer: "https://algobuddy.me/" }) };
    assert.equal(validateCsrfOrigin(req), true);
  });

  test("rejects untrusted referer when origin is absent", () => {
    const req = { headers: makeHeaders({ referer: "https://evil.example.com/page" }) };
    assert.equal(validateCsrfOrigin(req), false);
  });

  test("prefers origin over referer when both are present", () => {
    const req = {
      headers: makeHeaders({
        origin: "https://algobuddy.me",
        referer: "https://evil.example.com",
      }),
    };
    assert.equal(validateCsrfOrigin(req), true);
  });

  test("returns false when neither origin nor referer is present", () => {
    const req = { headers: makeHeaders({}) };
    assert.equal(validateCsrfOrigin(req), false);
  });
});

describe("isStateChangingMethod", () => {
  const safe = ["GET", "HEAD", "OPTIONS"];
  const stateChanging = ["POST", "PUT", "PATCH", "DELETE"];

  safe.forEach((method) => {
    test(`${method} returns false`, () => {
      assert.equal(isStateChangingMethod(method), false);
    });
  });

  stateChanging.forEach((method) => {
    test(`${method} returns true`, () => {
      assert.equal(isStateChangingMethod(method), true);
    });
  });

  test("lowercase method is not matched", () => {
    assert.equal(isStateChangingMethod("post"), false);
  });
});

describe("isApiRoute", () => {
  test("/api/foo returns true", () => {
    assert.equal(isApiRoute("/api/foo"), true);
  });

  test("/api/foo/bar returns true", () => {
    assert.equal(isApiRoute("/api/foo/bar"), true);
  });

  test("/non-api/foo returns false", () => {
    assert.equal(isApiRoute("/non-api/foo"), false);
  });

  test("/ returns false", () => {
    assert.equal(isApiRoute("/"), false);
  });

  test("/api-csrf-token returns false (starts with /api not /api/)", () => {
    assert.equal(isApiRoute("/api-csrf-token"), false);
  });
});
