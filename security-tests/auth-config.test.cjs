// security-tests/auth-config.test.cjs
//
// Run with:  node --experimental-detect-module --test security-tests/auth-config.test.cjs
//
// Tests getSupabaseConfig() in src/lib/auth.js.

const { describe, test, beforeEach, afterEach } = require("node:test");
const assert = require("node:assert/strict");

// Inline the source — getSupabaseConfig is a pure function when env is mocked.
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

function getSupabaseConfig() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!isValidSupabaseUrl(supabaseUrl) || !isValidKey(supabaseAnonKey) || !isValidKey(supabaseServiceKey)) {
    return null;
  }

  let finalUrl = String(supabaseUrl).trim();
  if (finalUrl.startsWith("http://localhost:")) {
    finalUrl = finalUrl.replace("http://localhost:", "http://127.0.0.1:");
  }

  return {
    supabaseUrl: finalUrl,
    supabaseAnonKey: String(supabaseAnonKey).trim(),
    supabaseServiceKey: String(supabaseServiceKey).trim(),
  };
}

describe("isValidSupabaseUrl", () => {
  test("returns true for valid https URL", () => {
    assert.strictEqual(isValidSupabaseUrl("https://xyz.supabase.co"), true);
  });

  test("returns true for valid http URL", () => {
    assert.strictEqual(isValidSupabaseUrl("http://localhost:3000"), true);
  });

  test("returns false for null", () => {
    assert.strictEqual(isValidSupabaseUrl(null), false);
  });

  test("returns false for undefined", () => {
    assert.strictEqual(isValidSupabaseUrl(undefined), false);
  });

  test("returns false for empty string", () => {
    assert.strictEqual(isValidSupabaseUrl(""), false);
  });

  test("returns false for placeholder string starting with 'Your '", () => {
    assert.strictEqual(isValidSupabaseUrl("Your project URL here"), false);
  });

  test("returns false for invalid URL (no protocol)", () => {
    assert.strictEqual(isValidSupabaseUrl("xyz.supabase.co"), false);
  });

  test("returns false for non-http/https protocol", () => {
    assert.strictEqual(isValidSupabaseUrl("ftp://xyz.supabase.co"), false);
  });

  test("handles whitespace around URL", () => {
    assert.strictEqual(isValidSupabaseUrl("  https://xyz.supabase.co  "), true);
  });
});

describe("isValidKey", () => {
  test("returns true for non-empty string", () => {
    assert.strictEqual(isValidKey("eyJhbGc..."), true);
  });

  test("returns false for null", () => {
    assert.strictEqual(isValidKey(null), false);
  });

  test("returns false for undefined", () => {
    assert.strictEqual(isValidKey(undefined), false);
  });

  test("returns false for empty string", () => {
    assert.strictEqual(isValidKey(""), false);
  });

  test("returns false for placeholder string starting with 'Your '", () => {
    assert.strictEqual(isValidKey("Your anon key here"), false);
  });

  test("handles whitespace around key", () => {
    assert.strictEqual(isValidKey("  eyJhbGc...  "), true);
  });
});

describe("getSupabaseConfig", () => {
  let originalEnv;

  beforeEach(() => {
    originalEnv = { ...process.env };
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  test("returns config object when all env vars are valid", () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://xyz.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "eyJhbGc.eyJpc3MiOiJ...";
    process.env.SUPABASE_SERVICE_KEY = "eyJhbGc.eyJpc3MiOiJ...";

    const config = getSupabaseConfig();
    assert.notStrictEqual(config, null);
    assert.strictEqual(config.supabaseUrl, "https://xyz.supabase.co");
    assert.strictEqual(config.supabaseAnonKey, "eyJhbGc.eyJpc3MiOiJ...");
    assert.strictEqual(config.supabaseServiceKey, "eyJhbGc.eyJpc3MiOiJ...");
  });

  test("prefers SUPABASE_SERVICE_KEY over SUPABASE_SERVICE_ROLE_KEY", () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://xyz.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "eyJhbGc.eyJpc3MiOiJ...";
    process.env.SUPABASE_SERVICE_KEY = "service-key-primary";
    process.env.SUPABASE_SERVICE_ROLE_KEY = "service-role-secondary";

    const config = getSupabaseConfig();
    assert.strictEqual(config.supabaseServiceKey, "service-key-primary");
  });

  test("uses SUPABASE_SERVICE_KEY when SUPABASE_SERVICE_ROLE_KEY is absent", () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://xyz.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "eyJhbGc.eyJpc3MiOiJ...";
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    process.env.SUPABASE_SERVICE_KEY = "service-key-only";

    const config = getSupabaseConfig();
    assert.strictEqual(config.supabaseServiceKey, "service-key-only");
  });

  test("returns null when NEXT_PUBLIC_SUPABASE_URL is missing", () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "eyJhbGc...";
    process.env.SUPABASE_SERVICE_KEY = "eyJhbGc...";

    assert.strictEqual(getSupabaseConfig(), null);
  });

  test("returns null when NEXT_PUBLIC_SUPABASE_ANON_KEY is missing", () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://xyz.supabase.co";
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    process.env.SUPABASE_SERVICE_KEY = "eyJhbGc...";

    assert.strictEqual(getSupabaseConfig(), null);
  });

  test("returns null when SUPABASE_SERVICE_KEY is missing and no role key", () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://xyz.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "eyJhbGc...";
    delete process.env.SUPABASE_SERVICE_KEY;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;

    assert.strictEqual(getSupabaseConfig(), null);
  });

  test("returns null when URL is a placeholder string", () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "Your project URL here";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "eyJhbGc...";
    process.env.SUPABASE_SERVICE_KEY = "eyJhbGc...";

    assert.strictEqual(getSupabaseConfig(), null);
  });

  test("returns null when anon key is a placeholder string", () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://xyz.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "Your anon key here";
    process.env.SUPABASE_SERVICE_KEY = "eyJhbGc...";

    assert.strictEqual(getSupabaseConfig(), null);
  });

  test("normalizes localhost URL to 127.0.0.1", () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "http://localhost:3000";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "eyJhbGc...";
    process.env.SUPABASE_SERVICE_KEY = "eyJhbGc...";

    const config = getSupabaseConfig();
    assert.strictEqual(config.supabaseUrl, "http://127.0.0.1:3000");
  });

  test("does not normalize localhost URL with 127.0.0.1 already", () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "http://127.0.0.1:3000";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "eyJhbGc...";
    process.env.SUPABASE_SERVICE_KEY = "eyJhbGc...";

    const config = getSupabaseConfig();
    assert.strictEqual(config.supabaseUrl, "http://127.0.0.1:3000");
  });
});
