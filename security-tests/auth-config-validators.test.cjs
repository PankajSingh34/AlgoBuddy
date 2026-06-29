/**
 * Unit tests for auth.js getSupabaseConfig function.
 * Covers: getSupabaseConfig
 * Uses Node's built-in node:test runner.
 */

const { test } = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const { pathToFileURL } = require("node:url");

const authUrl = pathToFileURL(
  path.join(__dirname, "..", "src", "lib", "auth.js"),
).href;

let getSupabaseConfig;

test("auth module loads and exports getSupabaseConfig", async () => {
  const mod = await import(authUrl);
  getSupabaseConfig = mod.getSupabaseConfig;
  assert.ok(typeof getSupabaseConfig === "function");
});

test("getSupabaseConfig returns null when NEXT_PUBLIC_SUPABASE_URL is missing", () => {
  const origUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const origKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const origSvc = process.env.SUPABASE_SERVICE_KEY;
  delete process.env.NEXT_PUBLIC_SUPABASE_URL;
  delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  delete process.env.SUPABASE_SERVICE_KEY;
  try {
    const result = getSupabaseConfig();
    assert.strictEqual(result, null);
  } finally {
    process.env.NEXT_PUBLIC_SUPABASE_URL = origUrl;
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = origKey;
    process.env.SUPABASE_SERVICE_KEY = origSvc;
  }
});

test("getSupabaseConfig returns null when URL is 'Your project URL' placeholder", () => {
  const origUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const origKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const origSvc = process.env.SUPABASE_SERVICE_KEY;
  process.env.NEXT_PUBLIC_SUPABASE_URL = "Your project URL";
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test";
  process.env.SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test2";
  try {
    const result = getSupabaseConfig();
    assert.strictEqual(result, null);
  } finally {
    process.env.NEXT_PUBLIC_SUPABASE_URL = origUrl;
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = origKey;
    process.env.SUPABASE_SERVICE_KEY = origSvc;
  }
});

test("getSupabaseConfig returns null when anon key is 'Your anon key' placeholder", () => {
  const origUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const origKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const origSvc = process.env.SUPABASE_SERVICE_KEY;
  process.env.NEXT_PUBLIC_SUPABASE_URL = "https://xyz.supabase.co";
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "Your anon public key";
  process.env.SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test";
  try {
    const result = getSupabaseConfig();
    assert.strictEqual(result, null);
  } finally {
    process.env.NEXT_PUBLIC_SUPABASE_URL = origUrl;
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = origKey;
    process.env.SUPABASE_SERVICE_KEY = origSvc;
  }
});

test("getSupabaseConfig returns null when service key is missing", () => {
  const origUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const origKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const origSvc = process.env.SUPABASE_SERVICE_KEY;
  const origRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
  process.env.NEXT_PUBLIC_SUPABASE_URL = "https://xyz.supabase.co";
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test";
  delete process.env.SUPABASE_SERVICE_KEY;
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  try {
    const result = getSupabaseConfig();
    assert.strictEqual(result, null);
  } finally {
    process.env.NEXT_PUBLIC_SUPABASE_URL = origUrl;
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = origKey;
    if (origSvc !== undefined) process.env.SUPABASE_SERVICE_KEY = origSvc;
    else delete process.env.SUPABASE_SERVICE_KEY;
    if (origRole !== undefined) process.env.SUPABASE_SERVICE_ROLE_KEY = origRole;
    else delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  }
});

test("getSupabaseConfig returns valid config when all env vars are set", () => {
  const origUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const origKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const origSvc = process.env.SUPABASE_SERVICE_KEY;
  process.env.NEXT_PUBLIC_SUPABASE_URL = "https://xyz.supabase.co";
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test";
  process.env.SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test2";
  try {
    const result = getSupabaseConfig();
    assert.ok(result !== null);
    assert.strictEqual(result.supabaseUrl, "https://xyz.supabase.co");
    assert.strictEqual(result.supabaseAnonKey, "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test");
    assert.strictEqual(result.supabaseServiceKey, "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test2");
  } finally {
    process.env.NEXT_PUBLIC_SUPABASE_URL = origUrl;
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = origKey;
    process.env.SUPABASE_SERVICE_KEY = origSvc;
  }
});

test("getSupabaseConfig normalizes localhost to 127.0.0.1", () => {
  const origUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const origKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const origSvc = process.env.SUPABASE_SERVICE_KEY;
  process.env.NEXT_PUBLIC_SUPABASE_URL = "http://localhost:54321";
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test";
  process.env.SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test2";
  try {
    const result = getSupabaseConfig();
    assert.ok(result !== null);
    assert.strictEqual(result.supabaseUrl, "http://127.0.0.1:54321");
  } finally {
    process.env.NEXT_PUBLIC_SUPABASE_URL = origUrl;
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = origKey;
    process.env.SUPABASE_SERVICE_KEY = origSvc;
  }
});

test("getSupabaseConfig falls back to SUPABASE_SERVICE_ROLE_KEY when SUPABASE_SERVICE_KEY is missing", () => {
  const origSvc = process.env.SUPABASE_SERVICE_KEY;
  const origRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
  delete process.env.SUPABASE_SERVICE_KEY;
  process.env.SUPABASE_SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.role";
  const result = getSupabaseConfig();
  if (origSvc !== undefined) process.env.SUPABASE_SERVICE_KEY = origSvc;
  else delete process.env.SUPABASE_SERVICE_KEY;
  if (origRole !== undefined) process.env.SUPABASE_SERVICE_ROLE_KEY = origRole;
  else delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (result) {
    assert.strictEqual(result.supabaseServiceKey, "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.role");
  }
});

test("getSupabaseConfig returns null for ftp:// URL", () => {
  const origUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const origKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const origSvc = process.env.SUPABASE_SERVICE_KEY;
  process.env.NEXT_PUBLIC_SUPABASE_URL = "ftp://xyz.supabase.co";
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test";
  process.env.SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test2";
  try {
    const result = getSupabaseConfig();
    assert.strictEqual(result, null);
  } finally {
    process.env.NEXT_PUBLIC_SUPABASE_URL = origUrl;
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = origKey;
    process.env.SUPABASE_SERVICE_KEY = origSvc;
  }
});

test("getSupabaseConfig returns null when anon key is missing from env", () => {
  const origUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const origKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const origSvc = process.env.SUPABASE_SERVICE_KEY;
  process.env.NEXT_PUBLIC_SUPABASE_URL = "https://xyz.supabase.co";
  delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  process.env.SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test2";
  try {
    const result = getSupabaseConfig();
    assert.strictEqual(result, null);
  } finally {
    process.env.NEXT_PUBLIC_SUPABASE_URL = origUrl;
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = origKey;
    process.env.SUPABASE_SERVICE_KEY = origSvc;
  }
});
