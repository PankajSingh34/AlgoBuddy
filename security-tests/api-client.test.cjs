const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const { pathToFileURL } = require("node:url");

const apiClientUrl = pathToFileURL(
  path.join(__dirname, "..", "src", "lib", "apiClient.js"),
).href;

async function loadClient() {
  return import(apiClientUrl);
}

test("api client returns parsed JSON for successful responses", async () => {
  const originalFetch = global.fetch;
  global.fetch = async () =>
    new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });

  try {
    const { api } = await loadClient();
    const result = await api.request("/api/test");
    assert.deepEqual(result, { ok: true });
  } finally {
    global.fetch = originalFetch;
  }
});

test("api client normalizes empty successful responses", async () => {
  const originalFetch = global.fetch;
  global.fetch = async () =>
    new Response("", {
      status: 200,
      headers: { "content-type": "application/json" },
    });

  try {
    const { api } = await loadClient();
    const result = await api.request("/api/test");
    assert.deepEqual(result, {});
  } finally {
    global.fetch = originalFetch;
  }
});

test("api client throws typed errors for non-ok responses", async () => {
  const originalFetch = global.fetch;
  global.fetch = async () =>
    new Response(JSON.stringify({ error: "boom", code: "UPSTREAM" }), {
      status: 503,
      headers: { "content-type": "application/json" },
    });

  try {
    const { api } = await loadClient();
    await assert.rejects(
      () => api.request("/api/test"),
      (error) => {
        assert.equal(error.name, "ApiError");
        assert.equal(error.message, "boom");
        assert.equal(error.code, "UPSTREAM");
        assert.equal(error.status, 503);
        return true;
      },
    );
  } finally {
    global.fetch = originalFetch;
  }
});

test("api client converts 401 responses into auth errors", async () => {
  const originalFetch = global.fetch;
  global.fetch = async () =>
    new Response(JSON.stringify({ error: "expired" }), {
      status: 401,
      headers: { "content-type": "application/json" },
    });

  try {
    const { api } = await loadClient();
    await assert.rejects(
      () => api.request("/api/test"),
      (error) => {
        assert.equal(error.name, "AuthError");
        assert.equal(error.message, "Session expired");
        assert.equal(error.status, 401);
        return true;
      },
    );
  } finally {
    global.fetch = originalFetch;
  }
});
