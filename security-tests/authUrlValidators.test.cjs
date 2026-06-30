/**
 * Unit tests for the Supabase URL and key validators used by src/lib/auth.js.
 * The tests keep an inlined copy of the helper logic so they stay focused on
 * the string-validation behavior without pulling in Next.js runtime pieces.
 */

const { test } = require("node:test");
const assert = require("node:assert/strict");

function isValidSupabaseUrl(value) {
  if (!value) return false;
  const trimmed = String(value).trim();
  if (trimmed.startsWith("Your ")) return false;
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function isValidKey(value) {
  if (!value) return false;
  const trimmed = String(value).trim();
  return trimmed && !trimmed.startsWith("Your ");
}

test("isValidSupabaseUrl accepts http, https, and localhost URLs", () => {
  assert.equal(isValidSupabaseUrl("https://example.supabase.co"), true);
  assert.equal(isValidSupabaseUrl("http://127.0.0.1:54321"), true);
  assert.equal(isValidSupabaseUrl("http://localhost:54321"), true);
});

test("isValidSupabaseUrl rejects missing, placeholder, malformed, and unsupported values", () => {
  assert.equal(isValidSupabaseUrl(undefined), false);
  assert.equal(isValidSupabaseUrl(""), false);
  assert.equal(isValidSupabaseUrl("not a url"), false);
  assert.equal(isValidSupabaseUrl("ftp://example.supabase.co"), false);
  assert.equal(isValidSupabaseUrl("Your Supabase URL"), false);
});

test("isValidKey accepts non-empty keys and rejects placeholders or empty values", () => {
  assert.equal(isValidKey("anon-key-value"), true);
  assert.equal(isValidKey(" service-role-key "), true);
  assert.equal(isValidKey("") , false);
  assert.equal(isValidKey(undefined), false);
  assert.equal(isValidKey(null), false);
  assert.equal(isValidKey("Your Supabase anon key"), false);
});
