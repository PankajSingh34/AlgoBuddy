const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");

const errorCodesPath = path.resolve(__dirname, "..", "src", "lib", "sandbox", "errorCodes.js");
const { EXECUTION_STATUS, EXECUTION_MESSAGES } = require(errorCodesPath);

test("EXECUTION_STATUS has all expected status codes", () => {
  assert.ok(EXECUTION_STATUS, "EXECUTION_STATUS must be defined");
  assert.equal(typeof EXECUTION_STATUS, "object", "EXECUTION_STATUS must be an object");

  assert.ok(EXECUTION_STATUS.SUCCESS, "SUCCESS must be defined");
  assert.equal(typeof EXECUTION_STATUS.SUCCESS, "string", "SUCCESS must be a string");
  assert.equal(EXECUTION_STATUS.SUCCESS, "SUCCESS", "SUCCESS value must match");

  assert.ok(EXECUTION_STATUS.TLE, "TLE must be defined");
  assert.equal(typeof EXECUTION_STATUS.TLE, "string", "TLE must be a string");
  assert.equal(EXECUTION_STATUS.TLE, "TLE", "TLE value must match");

  assert.ok(EXECUTION_STATUS.MLE, "MLE must be defined");
  assert.equal(typeof EXECUTION_STATUS.MLE, "string", "MLE must be a string");
  assert.equal(EXECUTION_STATUS.MLE, "MLE", "MLE value must match");

  assert.ok(EXECUTION_STATUS.RUNTIME_ERROR, "RUNTIME_ERROR must be defined");
  assert.equal(typeof EXECUTION_STATUS.RUNTIME_ERROR, "string", "RUNTIME_ERROR must be a string");
  assert.equal(EXECUTION_STATUS.RUNTIME_ERROR, "RUNTIME_ERROR", "RUNTIME_ERROR value must match");

  assert.ok(EXECUTION_STATUS.INTERNAL_ERROR, "INTERNAL_ERROR must be defined");
  assert.equal(typeof EXECUTION_STATUS.INTERNAL_ERROR, "string", "INTERNAL_ERROR must be a string");
  assert.equal(EXECUTION_STATUS.INTERNAL_ERROR, "INTERNAL_ERROR", "INTERNAL_ERROR value must match");
});

test("EXECUTION_STATUS values are non-empty strings", () => {
  const values = Object.values(EXECUTION_STATUS);
  for (const val of values) {
    assert.ok(typeof val === "string" && val.length > 0, `"${val}" must be a non-empty string`);
  }
});

test("EXECUTION_STATUS values are all unique", () => {
  const values = Object.values(EXECUTION_STATUS);
  const unique = new Set(values);
  assert.equal(unique.size, values.length, "All EXECUTION_STATUS values must be unique");
});

test("EXECUTION_MESSAGES has a key for each EXECUTION_STATUS value", () => {
  assert.ok(EXECUTION_MESSAGES, "EXECUTION_MESSAGES must be defined");
  assert.equal(typeof EXECUTION_MESSAGES, "object", "EXECUTION_MESSAGES must be an object");

  for (const key of Object.values(EXECUTION_STATUS)) {
    assert.ok(
      Object.prototype.hasOwnProperty.call(EXECUTION_MESSAGES, key),
      `EXECUTION_MESSAGES must have a key for status "${key}"`
    );
    assert.ok(
      typeof EXECUTION_MESSAGES[key] === "string" && EXECUTION_MESSAGES[key].length > 0,
      `EXECUTION_MESSAGES["${key}"] must be a non-empty string`
    );
  }
});

test("EXECUTION_MESSAGES values are non-empty strings", () => {
  const values = Object.values(EXECUTION_MESSAGES);
  for (const val of values) {
    assert.ok(typeof val === "string" && val.length > 0, `Message "${val}" must be a non-empty string`);
  }
});

test("SUCCESS message contains expected keyword", () => {
  const msg = EXECUTION_MESSAGES[EXECUTION_STATUS.SUCCESS];
  assert.ok(msg.includes("success") || msg.includes("successfully"), "SUCCESS message should indicate successful execution");
});

test("TLE message contains time limit reference", () => {
  const msg = EXECUTION_MESSAGES[EXECUTION_STATUS.TLE];
  assert.ok(msg.toLowerCase().includes("time") || msg.toLowerCase().includes("limit"), "TLE message should reference time or limit");
});

test("MLE message contains memory reference", () => {
  const msg = EXECUTION_MESSAGES[EXECUTION_STATUS.MLE];
  assert.ok(msg.toLowerCase().includes("memory") || msg.toLowerCase().includes("mb"), "MLE message should reference memory or MB");
});

test("INTERNAL_ERROR message indicates user should retry", () => {
  const msg = EXECUTION_MESSAGES[EXECUTION_STATUS.INTERNAL_ERROR];
  assert.ok(
    msg.toLowerCase().includes("internal") || msg.toLowerCase().includes("try again"),
    "INTERNAL_ERROR message should indicate an internal error or retry"
  );
});
