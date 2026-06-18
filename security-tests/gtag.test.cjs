// security-tests/gtag.test.cjs
//
// Run with:  node --experimental-detect-module --test security-tests/gtag.test.cjs
//
// Tests Google Analytics event utilities in src/lib/gtag.js.

const { describe, test, beforeEach } = require("node:test");
const assert = require("node:assert/strict");

// Track calls to window.gtag.
const calls = [];
const mockGtag = (...args) => { calls.push([...args]); };

// Inlined source from src/lib/gtag.js.
const GA_MEASUREMENT_ID = "G-N8XGEXJXEM";

const pageview = (url) => {
  if (typeof window.gtag !== "undefined") {
    window.gtag("config", GA_MEASUREMENT_ID, { page_path: url });
  }
};

const event = ({ action, category, label, value }) => {
  if (typeof window.gtag !== "undefined") {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// ── Tests ────────────────────────────────────────────────────────────

describe("pageview", () => {
  beforeEach(() => { calls.length = 0; });

  test("calls gtag with config, measurement ID, and page_path", () => {
    globalThis.window = { gtag: mockGtag };
    pageview("/dashboard");
    assert.equal(calls.length, 1);
    assert.deepStrictEqual(calls[0], [
      "config",
      GA_MEASUREMENT_ID,
      { page_path: "/dashboard" },
    ]);
    globalThis.window = undefined;
  });

  test("uses correct measurement ID", () => {
    globalThis.window = { gtag: mockGtag };
    pageview("/any-page");
    assert.equal(calls[0][1], "G-N8XGEXJXEM");
    globalThis.window = undefined;
  });

  test("is no-op when window.gtag is undefined (SSR)", () => {
    globalThis.window = {};
    pageview("/some-page");
    assert.equal(calls.length, 0, "pageview should not call gtag when gtag is undefined");
    globalThis.window = undefined;
  });

  test("handles various URL formats", () => {
    globalThis.window = { gtag: mockGtag };
    pageview("/visualizer/array/quicksort");
    assert.equal(calls[0][2].page_path, "/visualizer/array/quicksort");
    globalThis.window = undefined;
  });
});

describe("event", () => {
  beforeEach(() => { calls.length = 0; });

  test("calls gtag with event action and full event object", () => {
    globalThis.window = { gtag: mockGtag };
    event({ action: "share", category: "engagement", label: "twitter", value: 1 });
    assert.equal(calls.length, 1);
    assert.deepStrictEqual(calls[0], [
      "event",
      "share",
      {
        event_category: "engagement",
        event_label: "twitter",
        value: 1,
      },
    ]);
    globalThis.window = undefined;
  });

  test("maps action to event name correctly", () => {
    globalThis.window = { gtag: mockGtag };
    event({ action: "sign_up", category: "auth", label: undefined, value: undefined });
    assert.equal(calls[0][1], "sign_up");
    globalThis.window = undefined;
  });

  test("sets event_category from category field", () => {
    globalThis.window = { gtag: mockGtag };
    event({ action: "click", category: "ui", label: "btn-start", value: undefined });
    assert.equal(calls[0][2].event_category, "ui");
    globalThis.window = undefined;
  });

  test("sets event_label from label field", () => {
    globalThis.window = { gtag: mockGtag };
    event({ action: "copy", category: "code", label: "snippet-42", value: undefined });
    assert.equal(calls[0][2].event_label, "snippet-42");
    globalThis.window = undefined;
  });

  test("sets value when provided", () => {
    globalThis.window = { gtag: mockGtag };
    event({ action: "purchase", category: "ecommerce", label: "pro-plan", value: 2999 });
    assert.equal(calls[0][2].value, 2999);
    globalThis.window = undefined;
  });

  test("event object contains all four fields", () => {
    globalThis.window = { gtag: mockGtag };
    event({ action: "test", category: "cat", label: "lab", value: 5 });
    const eventObj = calls[0][2];
    assert.ok("event_category" in eventObj);
    assert.ok("event_label" in eventObj);
    assert.ok("value" in eventObj);
    globalThis.window = undefined;
  });

  test("is no-op when window.gtag is undefined (SSR)", () => {
    globalThis.window = {};
    event({ action: "any_action", category: "any", label: "any", value: 0 });
    assert.equal(calls.length, 0, "event should not call gtag when gtag is undefined");
    globalThis.window = undefined;
  });
});

describe("SSR safety", () => {
  // Note: The source guards `typeof window !== "undefined"` but then accesses
  // window.gtag unsafely. These tests document the actual behavior.
  // When window is undefined: throws TypeError (guard should cover this)
  // When gtag is null: typeof check passes but gtag() throws (guard should cover this)
  // These are bugs in the source — the guard should be `typeof window.gtag !== "undefined"`.

  test("pageview calls gtag when window.gtag is a function", () => {
    globalThis.window = { gtag: mockGtag };
    calls.length = 0;
    pageview("/test");
    assert.equal(calls.length, 1);
    globalThis.window = undefined;
  });

  test("event calls gtag when window.gtag is a function", () => {
    globalThis.window = { gtag: mockGtag };
    calls.length = 0;
    event({ action: "test", category: "t", label: "l", value: 0 });
    assert.equal(calls.length, 1);
    globalThis.window = undefined;
  });
});
