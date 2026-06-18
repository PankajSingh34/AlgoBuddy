/**
 * Regression tests for shared pagination param parsing.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const { pathToFileURL } = require("node:url");

const paginationUrl = pathToFileURL(
  path.join(__dirname, "..", "src", "lib", "pagination.js")
).href;

async function load() {
  return import(paginationUrl);
}

test("parsePaginationParams uses defaults for missing values", async () => {
  const { parsePaginationParams } = await load();
  const params = new URLSearchParams();
  const result = parsePaginationParams(params);
  assert.deepEqual(result, { page: 1, limit: 20, skip: 0 });
});

test("parsePaginationParams clamps oversized limit values", async () => {
  const { parsePaginationParams } = await load();
  const params = new URLSearchParams({ limit: "999999999", page: "2" });
  const result = parsePaginationParams(params);
  assert.equal(result.limit, 100);
  assert.equal(result.page, 2);
  assert.equal(result.skip, 100);
});

test("parsePaginationParams rejects negative page values", async () => {
  const { parsePaginationParams } = await load();
  const params = new URLSearchParams({ page: "-3", limit: "0" });
  const result = parsePaginationParams(params);
  assert.equal(result.page, 1);
  assert.equal(result.limit, 1);
  assert.equal(result.skip, 0);
});

test("parsePaginationParams honors route-specific defaultLimit", async () => {
  const { parsePaginationParams } = await load();
  const params = new URLSearchParams();
  const result = parsePaginationParams(params, { defaultLimit: 50 });
  assert.equal(result.limit, 50);
});
