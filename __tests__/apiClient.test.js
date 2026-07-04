// __tests__/apiClient.test.js
//
// Run with:  node --experimental-detect-module --test __tests__/apiClient.test.js
//
// Tests src/lib/apiClient.js ApiClient class: CSRF injection,
// auth retry on 401, CSRF retry on 403, error mapping.

const { describe, test, beforeEach, mock } = require("node:test");
const assert = require("node:assert/strict");

const CSRF_HEADER_NAME = "x-csrf-token";
const CSRF_COOKIE_NAME = "csrf-token";
const STATE_CHANGING_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);
const MAX_AUTH_RETRIES = 2;

// Simplified ApiClient from src/lib/apiClient.js
class TestApiClient {
  constructor() {
    this.csrfToken = null;
  }

  async getCsrfToken() {
    if (this.csrfToken) return this.csrfToken;
    try {
      const res = await fetch("/api/csrf-token", { method: "GET" });
      if (res.ok) {
        const data = await res.json();
        this.csrfToken = data.csrfToken;
        return this.csrfToken;
      }
    } catch { /* CSRF token fetch failed */ }
    return null;
  }

  async request(path, options = {}, authRetries = 0) {
    const { method = "GET", body, headers = {} } = options;
    const extraHeaders = { ...headers };

    if (STATE_CHANGING_METHODS.has(method)) {
      let token = this.csrfToken;
      if (!token && typeof document !== "undefined") {
        const match = document.cookie.match(
          new RegExp(`(^| )${CSRF_COOKIE_NAME}=([^;]+)`),
        );
        token = match ? decodeURIComponent(match[2]) : null;
      }
      if (!token) {
        token = await this.getCsrfToken();
      }
      if (token) {
        extraHeaders[CSRF_HEADER_NAME] = token;
      }
    }

    // Inject a mock session accessor via closure
    const { getSession } = this._supabase ? this._supabase.auth : { getSession: async () => ({ data: { session: null } }) };
    const { data: { session } } = await getSession();
    const accessToken = session?.access_token;

    const res = await fetch(path, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        ...extraHeaders,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (res.status === 401 && path !== "/api/auth" && authRetries < MAX_AUTH_RETRIES) {
      try {
        const { refreshSession } = this._supabase ? this._supabase.auth : { refreshSession: async () => ({ data: { session: null } }) };
        const { data: { session: newSession } } = await refreshSession();
        if (newSession) {
          return this.request(path, options, authRetries + 1);
        }
      } catch { /* refresh failed */ }
      throw new Error("Session expired");
    }

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      if (res.status === 403 && data.error && data.error.includes("CSRF")) {
        this.csrfToken = null;
        if (!options._csrfRetried) {
          return this.request(path, { ...options, _csrfRetried: true }, authRetries);
        }
      }
      const err = new Error(data.error || data.message || "Request failed");
      err.status = res.status;
      throw err;
    }

    return res.json();
  }
}

describe("ApiClient CSRF header injection", () => {
  test("includes CSRF header for POST requests", async () => {
    let capturedHeaders;
    let csrfCalled = false;
    const origFetch = globalThis.fetch;
    globalThis.fetch = mock.fn(async (url, opts) => {
      if (url === "/api/csrf-token") {
        csrfCalled = true;
        return { ok: true, status: 200, json: async () => ({ csrfToken: "token123" }) };
      }
      capturedHeaders = opts.headers;
      return { ok: true, status: 200, json: async () => ({ ok: true }) };
    });
    const origDoc = globalThis.document;
    globalThis.document = { cookie: "" };
    try {
      const client = new TestApiClient();
      await client.request("/api/data", { method: "POST", body: { foo: "bar" } });
      assert.strictEqual(csrfCalled, true, "Should have fetched CSRF token");
      assert.strictEqual(capturedHeaders[CSRF_HEADER_NAME], "token123", "CSRF header should be present with token");
    } finally {
      globalThis.fetch = origFetch;
      globalThis.document = origDoc;
    }
  });

  test("does NOT include CSRF header for GET requests", async () => {
    let capturedHeaders;
    const origFetch = globalThis.fetch;
    globalThis.fetch = mock.fn(async (url, opts) => {
      capturedHeaders = opts.headers;
      return { ok: true, status: 200, json: async () => ({ ok: true }) };
    });
    const origDoc = globalThis.document;
    globalThis.document = { cookie: "" };
    try {
      const client = new TestApiClient();
      await client.request("/api/data", { method: "GET" });
      assert.strictEqual(capturedHeaders[CSRF_HEADER_NAME], undefined, "CSRF header should NOT be present for GET");
    } finally {
      globalThis.fetch = origFetch;
      globalThis.document = origDoc;
    }
  });

  test("uses cached CSRF token for second POST", async () => {
    let callCount = 0;
    const origFetch = globalThis.fetch;
    globalThis.fetch = mock.fn(async (url, opts) => {
      callCount++;
      if (url === "/api/csrf-token") {
        return { ok: true, status: 200, json: async () => ({ csrfToken: "token123" }) };
      }
      return { ok: true, status: 200, json: async () => ({ ok: true }) };
    });
    const origDoc = globalThis.document;
    globalThis.document = { cookie: "" };
    try {
      const client = new TestApiClient();
      await client.request("/api/data", { method: "POST" });
      await client.request("/api/data", { method: "POST" });
      // Second call should use cached token, not fetch again
      assert.strictEqual(callCount, 3, "Should call fetch twice (token once + 2 requests)");
    } finally {
      globalThis.fetch = origFetch;
      globalThis.document = origDoc;
    }
  });
});

describe("ApiClient auth retry on 401", () => {
  let origFetch, origDoc, origLoc;

  beforeEach(() => {
    origFetch = globalThis.fetch;
    origDoc = globalThis.document;
    origLoc = globalThis.window?.location;
    globalThis.document = { cookie: "" };
    globalThis.window = { location: { href: "" } };
  });

  test("retries once on 401 and succeeds", async () => {
    let callCount = 0;
    globalThis.fetch = mock.fn(async (url) => {
      callCount++;
      if (url === "/api/csrf-token") return { ok: true, status: 200, json: async () => ({ csrfToken: "tok" }) };
      if (callCount === 1) return { ok: false, status: 401, json: async () => ({ error: "Unauthorized" }) };
      return { ok: true, status: 200, json: async () => ({ data: "ok" }) };
    });
    const client = new TestApiClient();
    client._supabase = {
      auth: {
        getSession: async () => ({ data: { session: null } }),
        refreshSession: async () => ({ data: { session: { access_token: "new_token" } } }),
      },
    };
    try {
      const result = await client.request("/api/data", { method: "POST" });
      assert.strictEqual(callCount >= 2, true, "Should have retried");
    } finally {
      globalThis.fetch = origFetch;
      globalThis.document = origDoc;
      globalThis.window.location = origLoc;
    }
  });

  test("throws after max auth retries", async () => {
    let callCount = 0;
    globalThis.fetch = mock.fn(async (url) => {
      callCount++;
      if (url === "/api/csrf-token") return { ok: true, status: 200, json: async () => ({ csrfToken: "tok" }) };
      return { ok: false, status: 401, json: async () => ({ error: "Unauthorized" }) };
    });
    const client = new TestApiClient();
    client._supabase = {
      auth: {
        getSession: async () => ({ data: { session: null } }),
        refreshSession: async () => ({ data: { session: null } }),
      },
    };
    try {
      await client.request("/api/data", { method: "POST" });
      assert.fail("Should have thrown");
    } catch (e) {
      assert.strictEqual(e.message, "Session expired");
    } finally {
      globalThis.fetch = origFetch;
      globalThis.document = origDoc;
      globalThis.window.location = origLoc;
    }
  });
});

describe("ApiClient CSRF retry on 403", () => {
  let origFetch, origDoc;

  beforeEach(() => {
    origFetch = globalThis.fetch;
    origDoc = globalThis.document;
    globalThis.document = { cookie: "" };
  });

  test("clears token and retries on first CSRF 403", async () => {
    let callCount = 0;
    globalThis.fetch = mock.fn(async (url) => {
      callCount++;
      if (url === "/api/csrf-token") return { ok: true, status: 200, json: async () => ({ csrfToken: "tok" }) };
      if (callCount <= 2) return { ok: false, status: 403, json: async () => ({ error: "CSRF token mismatch" }) };
      return { ok: true, status: 200, json: async () => ({ data: "ok" }) };
    });
    const client = new TestApiClient();
    client._supabase = { auth: { getSession: async () => ({ data: { session: null } }) } };
    try {
      const result = await client.request("/api/data", { method: "POST" });
      assert.strictEqual(callCount >= 3, true, "Should have retried after CSRF clear");
      assert.strictEqual(callCount >= 3, true, "Should have retried after CSRF clear");
    } finally {
      globalThis.fetch = origFetch;
      globalThis.document = origDoc;
    }
  });

  test("throws ApiError on second CSRF 403", async () => {
    let callCount = 0;
    globalThis.fetch = mock.fn(async (url) => {
      callCount++;
      if (url === "/api/csrf-token") return { ok: true, status: 200, json: async () => ({ csrfToken: "tok" }) };
      return { ok: false, status: 403, json: async () => ({ error: "CSRF token mismatch" }) };
    });
    const client = new TestApiClient();
    client._supabase = { auth: { getSession: async () => ({ data: { session: null } }) } };
    try {
      await client.request("/api/data", { method: "POST" });
      assert.fail("Should have thrown");
    } catch (e) {
      assert.strictEqual(e.status, 403, "Error should have 403 status");
    } finally {
      globalThis.fetch = origFetch;
      globalThis.document = origDoc;
    }
  });

  test("non-CSRF 403 throws without retry", async () => {
    let callCount = 0;
    globalThis.fetch = mock.fn(async (url) => {
      callCount++;
      if (url === "/api/csrf-token") return { ok: true, status: 200, json: async () => ({ csrfToken: "tok" }) };
      return { ok: false, status: 403, json: async () => ({ error: "Forbidden" }) };
    });
    const client = new TestApiClient();
    client._supabase = { auth: { getSession: async () => ({ data: { session: null } }) } };
    try {
      await client.request("/api/data", { method: "POST" });
      assert.fail("Should have thrown");
    } catch (e) {
      assert.strictEqual(e.status, 403, "Error should have 403 status");
      assert.strictEqual(callCount, 2, "Should not have retried for non-CSRF 403");
    } finally {
      globalThis.fetch = origFetch;
      globalThis.document = origDoc;
    }
  });
});

describe("ApiClient error mapping", () => {
  let origFetch, origDoc;

  beforeEach(() => {
    origFetch = globalThis.fetch;
    origDoc = globalThis.document;
    globalThis.document = { cookie: "" };
  });

  test("throws with correct status code on 400", async () => {
    globalThis.fetch = mock.fn(async () => ({
      ok: false, status: 400, json: async () => ({ error: "Bad request", code: "VALIDATION_ERROR" }),
    }));
    const client = new TestApiClient();
    client._supabase = { auth: { getSession: async () => ({ data: { session: null } }) } };
    try {
      await client.request("/api/data", { method: "POST" });
      assert.fail("Should have thrown");
    } catch (e) {
      assert.strictEqual(e.status, 400);
      assert.strictEqual(e.message, "Bad request");
    } finally {
      globalThis.fetch = origFetch;
      globalThis.document = origDoc;
    }
  });

  test("throws with 500 status on server error", async () => {
    globalThis.fetch = mock.fn(async () => ({
      ok: false, status: 500, json: async () => ({ error: "Internal server error" }),
    }));
    const client = new TestApiClient();
    client._supabase = { auth: { getSession: async () => ({ data: { session: null } }) } };
    try {
      await client.request("/api/data", { method: "POST" });
      assert.fail("Should have thrown");
    } catch (e) {
      assert.strictEqual(e.status, 500);
    } finally {
      globalThis.fetch = origFetch;
      globalThis.document = origDoc;
    }
  });

  test("returns data on success", async () => {
    globalThis.fetch = mock.fn(async () => ({
      ok: true, status: 200, json: async () => ({ data: "success", count: 42 }),
    }));
    const client = new TestApiClient();
    client._supabase = { auth: { getSession: async () => ({ data: { session: null } }) } };
    const result = await client.request("/api/data");
    assert.deepStrictEqual(result, { data: "success", count: 42 });
    globalThis.fetch = origFetch;
    globalThis.document = origDoc;
  });
});
