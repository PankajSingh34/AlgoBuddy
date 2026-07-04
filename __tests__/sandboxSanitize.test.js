// __tests__/sandboxSanitize.test.js
//
// Run with:  node --experimental-detect-module --test __tests__/sandboxSanitize.test.js
//
// Tests the sanitizeError helper in src/lib/sandbox/executor.js
// which strips file paths and internal V8/isolated-vm details
// from user-facing sandbox error messages.

const { describe, test } = require("node:test");
const assert = require("node:assert/strict");

// Inlined from src/lib/sandbox/executor.js (must stay in sync with the source)
function sanitizeError(err) {
  let message = err.message ?? String(err);

  // Remove Windows absolute paths (e.g. C:\Users\...) up to the line-number colon
  message = message.replace(/[a-zA-Z]:\\[^:]*/g, "[path]");

  // Remove Unix absolute paths using known directory prefixes
  message = message.replace(
    /\/(home|usr|var|tmp|root|run|opt|boot|sys|proc|dev|app|sbin|bin|lib|etc|mnt|media|srv)[\/\w.-]*/gi,
    "[path]",
  );

  // Remove internal implementation details
  message = message.replace(/vm:\d+:\d+/g, "[internal]");
  message = message.replace(/internal\/[^)]*/g, "[internal]");
  message = message.replace(/node:[^)]*/g, "[internal]");
  message = message.replace(/isolated-vm:[^)]*/g, "[internal]");

  return message;
}

describe("sanitizeError", () => {
  test("strips Unix absolute paths and preserves line number suffix", () => {
    const err = new Error("/home/user/project/sandbox/file.js:10:5");
    assert.strictEqual(sanitizeError(err), "[path]:10:5");
  });

  test("strips /usr/ absolute paths", () => {
    const err = new Error("Cannot find module '/usr/local/lib/node_modules/foo'");
    assert.strictEqual(sanitizeError(err), "Cannot find module '[path]'");
  });

  test("strips /home/ absolute paths", () => {
    const err = new Error("ENOENT: /home/appuser/.cache/puppeteer");
    assert.strictEqual(sanitizeError(err), "ENOENT: [path]");
  });

  test("strips Windows absolute paths (uppercase drive) preserving line numbers", () => {
    const err = new Error("C:\\Users\\developer\\app\\index.js:12:3");
    assert.strictEqual(sanitizeError(err), "[path]:12:3");
  });

  test("strips Windows absolute paths (lowercase drive) including spaces", () => {
    const err = new Error("c:\\program files\\nodejs\\node.exe");
    assert.strictEqual(sanitizeError(err), "[path]");
  });

  test("strips vm: line:col references", () => {
    const err = new Error("ReferenceError: x is not defined at vm:1:15");
    assert.strictEqual(sanitizeError(err), "ReferenceError: x is not defined at [internal]");
  });

  test("strips node: module references including trailing quote", () => {
    const err = new Error("Module not found: 'node:crypto'");
    assert.strictEqual(sanitizeError(err), "Module not found: '[internal]");
  });

  test("strips isolated-vm: internal references", () => {
    const err = new Error("Evaluation failed: isolated-vm: external memory limit exceeded");
    assert.strictEqual(sanitizeError(err), "Evaluation failed: [internal]");
  });

  test("strips internal/ paths but leaves other content", () => {
    const err = new Error("Error at internal/bootstrap/node.js:42:10");
    assert.strictEqual(sanitizeError(err), "Error at internal[path]:42:10");
  });

  test("preserves core error message text", () => {
    const err = new Error("SyntaxError: unexpected token");
    assert.strictEqual(sanitizeError(err), "SyntaxError: unexpected token");
  });

  test("handles mixed path types in one message", () => {
    const err = new Error(
      "Error: /home/app/file.js:5 at node:fs at internal/index.js at C:\\Users\\dev\\main.js",
    );
    const result = sanitizeError(err);
    assert.strictEqual(result.includes("/home/app"), false);
    assert.strictEqual(result.includes("node:fs"), false);
    assert.strictEqual(result.includes("C:\\Users"), false);
  });

  test("accepts plain string as input", () => {
    assert.strictEqual(sanitizeError("just a plain string"), "just a plain string");
  });

  test("converts null message to string representation", () => {
    assert.strictEqual(sanitizeError({ message: null }), "[object Object]");
  });
});
