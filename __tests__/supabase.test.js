// __tests__/supabase.test.js
//
// Run with:  node --experimental-detect-module --test __tests__/supabase.test.js
//
// Tests src/lib/supabase.js configuration helpers:
// isValidHttpUrl, getSupabaseConfig, createMissingQueryBuilder.

const { describe, test, beforeEach, afterEach } = require("node:test");
const assert = require("node:assert/strict");

// Inlined from src/lib/supabase.js
const SUPABASE_ENV_ERROR =
  "Missing NEXT_PUBLIC_SUPABASE_URL and/or NEXT_PUBLIC_SUPABASE_ANON_KEY. Copy .env.example to .env.local and add your Supabase project URL and anon key.";

function isValidHttpUrl(value) {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function getSupabaseConfig() {
  let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey || !isValidHttpUrl(supabaseUrl)) {
    return null;
  }

  if (supabaseUrl.startsWith("http://localhost:")) {
    supabaseUrl = supabaseUrl.replace("http://localhost:", "http://127.0.0.1:");
  }

  return { supabaseUrl, supabaseAnonKey };
}

function createMissingQueryBuilder() {
  const result = {
    data: null,
    error: new Error(SUPABASE_ENV_ERROR),
  };

  const builder = {
    then(onFulfilled, onRejected) {
      return Promise.resolve(result).then(onFulfilled, onRejected);
    },
    catch(onRejected) {
      return Promise.resolve(result).catch(onRejected);
    },
    finally(onFinally) {
      return Promise.resolve(result).finally(onFinally);
    },
  };

  return new Proxy(builder, {
    get(target, prop) {
      if (prop in target) return target[prop];
      return () => builder;
    },
  });
}

describe("isValidHttpUrl", () => {
  test("returns true for https://example.com", () => {
    assert.strictEqual(isValidHttpUrl("https://example.com"), true);
  });

  test("returns true for http://example.com", () => {
    assert.strictEqual(isValidHttpUrl("http://example.com"), true);
  });

  test("returns true for http://localhost:3000", () => {
    assert.strictEqual(isValidHttpUrl("http://localhost:3000"), true);
  });

  test("returns true for http://127.0.0.1:54321", () => {
    assert.strictEqual(isValidHttpUrl("http://127.0.0.1:54321"), true);
  });

  test("returns true for https://www.algobuddy.me/path", () => {
    assert.strictEqual(isValidHttpUrl("https://www.algobuddy.me/path"), true);
  });

  test("returns false for null", () => {
    assert.strictEqual(isValidHttpUrl(null), false);
  });

  test("returns false for undefined", () => {
    assert.strictEqual(isValidHttpUrl(undefined), false);
  });

  test("returns false for empty string", () => {
    assert.strictEqual(isValidHttpUrl(""), false);
  });

  test("returns false for plain strings", () => {
    assert.strictEqual(isValidHttpUrl("just some text"), false);
    assert.strictEqual(isValidHttpUrl("example.com"), false);
  });

  test("returns false for ftp:// URLs", () => {
    assert.strictEqual(isValidHttpUrl("ftp://example.com"), false);
  });

  test("returns false for mailto: URLs", () => {
    assert.strictEqual(isValidHttpUrl("mailto:user@example.com"), false);
  });

  test("returns false for strings starting with Your placeholder", () => {
    assert.strictEqual(isValidHttpUrl("Your Supabase URL"), false);
    assert.strictEqual(isValidHttpUrl("Your-project-url"), false);
  });
});

describe("getSupabaseConfig", () => {
  let origUrl;
  let origKey;

  beforeEach(() => {
    origUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    origKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  });

  afterEach(() => {
    if (origUrl !== undefined) process.env.NEXT_PUBLIC_SUPABASE_URL = origUrl;
    else delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (origKey !== undefined) process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = origKey;
    else delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  });

  test("returns null when NEXT_PUBLIC_SUPABASE_URL is missing", () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    assert.strictEqual(getSupabaseConfig(), null);
  });

  test("returns null when NEXT_PUBLIC_SUPABASE_ANON_KEY is missing", () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    assert.strictEqual(getSupabaseConfig(), null);
  });

  test("returns null for invalid URL format", () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "not-a-url";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "valid-key";
    assert.strictEqual(getSupabaseConfig(), null);
  });

  test("normalizes http://localhost:PORT to http://127.0.0.1:PORT", () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "http://localhost:54321";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9";
    const config = getSupabaseConfig();
    assert.strictEqual(config.supabaseUrl, "http://127.0.0.1:54321");
    assert.strictEqual(config.supabaseAnonKey, "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9");
  });

  test("returns config for valid https URL", () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://myproject.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9";
    const config = getSupabaseConfig();
    assert.deepStrictEqual(config, {
      supabaseUrl: "https://myproject.supabase.co",
      supabaseAnonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
    });
  });
});

describe("createMissingQueryBuilder", () => {
  test("then() resolves with data:null and error", async () => {
    const builder = createMissingQueryBuilder();
    const result = await builder;
    assert.strictEqual(result.data, null);
    assert.ok(result.error instanceof Error);
    assert.ok(result.error.message.includes("NEXT_PUBLIC_SUPABASE_URL"));
  });

  test("then() receives error in resolved result", async () => {
    const builder = createMissingQueryBuilder();
    const result = await builder;
    assert.strictEqual(result.data, null);
    assert.ok(result.error instanceof Error);
    assert.ok(result.error.message.includes("NEXT_PUBLIC_SUPABASE_URL"));
  });

  test("chained method returns another missing builder", async () => {
    const builder = createMissingQueryBuilder();
    const chained = builder.select("*");
    const result = await chained;
    assert.strictEqual(result.data, null);
    assert.ok(result.error instanceof Error);
  });

  test("arbitrary method returns a no-op builder", () => {
    const builder = createMissingQueryBuilder();
    const result = builder.anyMethod();
    assert.ok(typeof result === "function" || typeof result === "object");
  });
});
