/**
 * Unit tests for sessionTrace collaboration helpers.
 * Covers: sanitizeSessionText, createSessionSnapshot, canApplyPrivilegedSessionEvent, applySessionEvent
 * Uses Node's built-in node:test runner.
 */

const { test } = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const { pathToFileURL } = require("node:url");

const sessionTraceUrl = pathToFileURL(
  path.join(__dirname, "..", "src", "lib", "collaboration", "sessionTrace.js"),
).href;

let sanitizeSessionText;
let createSessionSnapshot;
let canApplyPrivilegedSessionEvent;
let applySessionEvent;

test("sessionTrace module loads and exports all functions", async () => {
  const mod = await import(sessionTraceUrl);
  sanitizeSessionText = mod.sanitizeSessionText;
  createSessionSnapshot = mod.createSessionSnapshot;
  canApplyPrivilegedSessionEvent = mod.canApplyPrivilegedSessionEvent;
  applySessionEvent = mod.applySessionEvent;
  assert.ok(typeof sanitizeSessionText === "function");
  assert.ok(typeof createSessionSnapshot === "function");
  assert.ok(typeof canApplyPrivilegedSessionEvent === "function");
  assert.ok(typeof applySessionEvent === "function");
});

// --- sanitizeSessionText tests ---

test("sanitizeSessionText returns empty string for null input", () => {
  assert.strictEqual(sanitizeSessionText(null), "");
});

test("sanitizeSessionText returns empty string for undefined input", () => {
  assert.strictEqual(sanitizeSessionText(undefined), "");
});

test("sanitizeSessionText returns empty string for non-string input", () => {
  assert.strictEqual(sanitizeSessionText(12345), "");
  assert.strictEqual(sanitizeSessionText({}), "");
  assert.strictEqual(sanitizeSessionText([]), "");
});

test("sanitizeSessionText removes HTML tags", () => {
  assert.strictEqual(sanitizeSessionText("<script>alert('xss')</script>"), "alert('xss')");
  assert.strictEqual(sanitizeSessionText("<b>bold</b>"), "bold");
  assert.strictEqual(sanitizeSessionText("hello <span>world</span>"), "hello world");
});

test("sanitizeSessionText collapses whitespace", () => {
  assert.strictEqual(sanitizeSessionText("hello    world"), "hello world");
  assert.strictEqual(sanitizeSessionText("  hello  world  "), "hello world");
});

test("sanitizeSessionText trims output", () => {
  assert.strictEqual(sanitizeSessionText("  hello  "), "hello");
});

test("sanitizeSessionText respects maxLength", () => {
  const result = sanitizeSessionText("hello world", 5);
  assert.strictEqual(result, "hello");
});

test("sanitizeSessionText returns full string when under maxLength", () => {
  const result = sanitizeSessionText("hi", 5);
  assert.strictEqual(result, "hi");
});

test("sanitizeSessionText removes control characters", () => {
  // \x00-\x08 are control chars, \x09 is tab (kept as whitespace)
  const result = sanitizeSessionText("hel\x00lo");
  assert.strictEqual(result, "hello");
});

test("sanitizeSessionText handles empty string", () => {
  assert.strictEqual(sanitizeSessionText(""), "");
});

test("sanitizeSessionText maxLength 0 does not truncate (maxLength <= 0 is no-op)", () => {
  assert.strictEqual(sanitizeSessionText("hello", 0), "hello");
});

test("sanitizeSessionText removes HTML tags including those with event handlers", () => {
  // The img tag is stripped entirely including onerror=alert(1)
  const result = sanitizeSessionText("<img src=x onerror=alert(1)>");
  assert.ok(!result.includes("<"), "No HTML tags should remain");
  assert.ok(!result.includes("onerror"), "Event handler attributes should be stripped with the tag");
});

// --- createSessionSnapshot tests ---

test("createSessionSnapshot returns snapshot with empty events and no presenterId", () => {
  const snapshot = createSessionSnapshot();
  assert.ok(Array.isArray(snapshot.events));
  assert.strictEqual(snapshot.events.length, 0);
  assert.strictEqual(snapshot.presenterId, null);
  assert.ok(snapshot.appliedEventIds instanceof Set);
  assert.strictEqual(snapshot.appliedEventIds.size, 0);
});

test("createSessionSnapshot accepts presenterId", () => {
  const snapshot = createSessionSnapshot({ presenterId: "user-123" });
  assert.strictEqual(snapshot.presenterId, "user-123");
});

// --- canApplyPrivilegedSessionEvent tests ---

test("canApplyPrivilegedSessionEvent allows non-privileged events always", () => {
  const snapshot = createSessionSnapshot({ presenterId: "user-123" });
  const event = { type: "chat:message", senderId: "other-user" };
  assert.strictEqual(canApplyPrivilegedSessionEvent(snapshot, event), true);
});

test("canApplyPrivilegedSessionEvent blocks privileged event from non-presenter", () => {
  const snapshot = createSessionSnapshot({ presenterId: "user-123" });
  const event = { type: "control:grant", senderId: "other-user" };
  assert.strictEqual(canApplyPrivilegedSessionEvent(snapshot, event), false);
});

test("canApplyPrivilegedSessionEvent allows privileged event from presenter", () => {
  const snapshot = createSessionSnapshot({ presenterId: "user-123" });
  const event = { type: "control:grant", senderId: "user-123" };
  assert.strictEqual(canApplyPrivilegedSessionEvent(snapshot, event), true);
});

test("canApplyPrivilegedSessionEvent allows privileged event when no presenter is set", () => {
  const snapshot = createSessionSnapshot();
  const event = { type: "control:grant", senderId: "any-user" };
  assert.strictEqual(canApplyPrivilegedSessionEvent(snapshot, event), true);
});

test("canApplyPrivilegedSessionEvent returns false when snapshot is null", () => {
  const event = { type: "control:grant", senderId: "user-123" };
  assert.strictEqual(canApplyPrivilegedSessionEvent(null, event), false);
});

test("canApplyPrivilegedSessionEvent returns false when event is null", () => {
  const snapshot = createSessionSnapshot({ presenterId: "user-123" });
  assert.strictEqual(canApplyPrivilegedSessionEvent(snapshot, null), false);
});

test("canApplyPrivilegedSessionEvent handles state:update privileged type", () => {
  const snapshot = createSessionSnapshot({ presenterId: "user-123" });
  const blocked = { type: "state:update", senderId: "other-user" };
  const allowed = { type: "state:update", senderId: "user-123" };
  assert.strictEqual(canApplyPrivilegedSessionEvent(snapshot, blocked), false);
  assert.strictEqual(canApplyPrivilegedSessionEvent(snapshot, allowed), true);
});

// --- applySessionEvent tests ---

test("applySessionEvent returns original snapshot when snapshot is null", () => {
  const result = applySessionEvent(null, { id: "e1", type: "chat:message" });
  assert.strictEqual(result, null);
});

test("applySessionEvent returns original snapshot when event is null", () => {
  const snapshot = createSessionSnapshot();
  const result = applySessionEvent(snapshot, null);
  assert.strictEqual(result, snapshot);
});

test("applySessionEvent appends event to events array", () => {
  const snapshot = createSessionSnapshot();
  const event = { id: "e1", type: "chat:message", senderId: "user-1" };
  const next = applySessionEvent(snapshot, event);
  assert.strictEqual(next.events.length, 1);
  assert.strictEqual(next.events[0], event);
});

test("applySessionEvent skips duplicate event IDs", () => {
  let snapshot = createSessionSnapshot();
  const event = { id: "e1", type: "chat:message", senderId: "user-1" };
  snapshot = applySessionEvent(snapshot, event);
  snapshot = applySessionEvent(snapshot, event);
  assert.strictEqual(snapshot.events.length, 1);
});

test("applySessionEvent skips event without ID on second application", () => {
  let snapshot = createSessionSnapshot();
  const event = { type: "chat:message", senderId: "user-1" };
  snapshot = applySessionEvent(snapshot, event);
  snapshot = applySessionEvent(snapshot, event);
  assert.strictEqual(snapshot.events.length, 2);
});

test("applySessionEvent updates presenterId on control:grant", () => {
  let snapshot = createSessionSnapshot();
  const event = {
    id: "e1",
    type: "control:grant",
    senderId: "user-1",
    payload: { presenterId: "new-presenter" },
  };
  snapshot = applySessionEvent(snapshot, event);
  assert.strictEqual(snapshot.presenterId, "new-presenter");
});

test("applySessionEvent tracks appliedEventIds", () => {
  let snapshot = createSessionSnapshot();
  const event = { id: "e1", type: "chat:message", senderId: "user-1" };
  snapshot = applySessionEvent(snapshot, event);
  assert.ok(snapshot.appliedEventIds.has("e1"));
});

test("applySessionEvent does not add event when canApplyPrivilegedSessionEvent returns false", () => {
  let snapshot = createSessionSnapshot({ presenterId: "user-123" });
  const blockedEvent = { id: "e1", type: "control:grant", senderId: "other-user" };
  snapshot = applySessionEvent(snapshot, blockedEvent);
  assert.strictEqual(snapshot.events.length, 0);
});
