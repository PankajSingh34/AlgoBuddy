const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const { pathToFileURL } = require("node:url");

const csrfTokenPath = path.resolve(__dirname, "..", "src", "lib", "csrfToken.js");

test("development fallback CSRF secret stays stable across reloads", async () => {
  const originalEnv = { ...process.env };

  try {
    delete process.env.CSRF_SECRET;
    process.env.NODE_ENV = "development";

    const firstModule = await import(`${pathToFileURL(csrfTokenPath).href}?v=1`);
    const token = await firstModule.generateCsrfToken();

    const reloadedModule = await import(`${pathToFileURL(csrfTokenPath).href}?v=2`);

    assert.equal(
      await reloadedModule.validateCsrfTokenEdge(token),
      true,
      "A token generated before reload should still validate after reload in development",
    );
  } finally {
    process.env = originalEnv;
  }
});
