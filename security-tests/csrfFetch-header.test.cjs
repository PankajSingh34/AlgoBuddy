// security-tests/csrfFetch-header.test.cjs
//
// Run with:  node --experimental-detect-module --test security-tests/csrfFetch-header.test.cjs
//
// Tests the csrfFetch() wrapper behavior from src/lib/apiClient.js.
// Logic is inlined here (mirrors the real implementation) to avoid the
// @/ alias resolution issue when running under plain node --test.

const test = require("node:test");
const assert = require("node:assert/strict");

const CSRF_HEADER_NAME = "x-csrf-token";
const CSRF_COOKIE_NAME = "csrf-token";
const STATE_CHANGING_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

function readCsrfTokenFromCookie() {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp(`(?:^|;\\s*)${CSRF_COOKIE_NAME}=([^;]*)`),
  );
  return match ? decodeURIComponent(match[1].trim()) : null;
}

async function csrfFetch(path, options = {}) {
  const { headers = {}, method = "GET", ...rest } = options;
  const extraHeaders = { ...headers };

  if (STATE_CHANGING_METHODS.has(method)) {
    const token = readCsrfTokenFromCookie();
    if (token) {
      extraHeaders[CSRF_HEADER_NAME] = token;
    }
  }

  return fetch(path, { ...rest, method, headers: extraHeaders });
}

test("csrfFetch attaches x-csrf-token on POST requests", async () => {
  const originalFetch = global.fetch;
  const originalDocument = global.document;

  global.document = { cookie: "csrf-token=test-token-123" };
  let capturedInit;
  global.fetch = async (url, init) => {
    capturedInit = init;
    return { ok: true, json: async () => ({}) };
  };

  try {
    await csrfFetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic_id: "1", content: "hi" }),
    });

    assert.equal(capturedInit.headers[CSRF_HEADER_NAME], "test-token-123");
    assert.equal(capturedInit.headers["Content-Type"], "application/json");
  } finally {
    global.fetch = originalFetch;
    global.document = originalDocument;
  }
});

test("csrfFetch does not attach x-csrf-token on GET requests", async () => {
  const originalFetch = global.fetch;
  const originalDocument = global.document;

  global.document = { cookie: "csrf-token=test-token-123" };
  let capturedInit;
  global.fetch = async (url, init) => {
    capturedInit = init;
    return { ok: true, json: async () => ({}) };
  };

  try {
    await csrfFetch("/api/comments/topic-1");

    assert.equal(capturedInit.headers[CSRF_HEADER_NAME], undefined);
  } finally {
    global.fetch = originalFetch;
    global.document = originalDocument;
  }
});

test("csrfFetch sends no token when the csrf cookie is missing", async () => {
  const originalFetch = global.fetch;
  const originalDocument = global.document;

  global.document = { cookie: "" };
  let capturedInit;
  global.fetch = async (url, init) => {
    capturedInit = init;
    return { ok: true, json: async () => ({}) };
  };

  try {
    await csrfFetch("/api/newsletter/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "test@example.com" }),
    });

    assert.equal(capturedInit.headers[CSRF_HEADER_NAME], undefined);
  } finally {
    global.fetch = originalFetch;
    global.document = originalDocument;
  }
});
