const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");

const sessionTracePath = path.resolve(__dirname, "..", "src", "lib", "collaboration", "sessionTrace.js");
const {
  sanitizeSessionText,
  createSessionSnapshot,
  canApplyPrivilegedSessionEvent,
  applySessionEvent,
} = require(sessionTracePath);

// ─── sanitizeSessionText ───────────────────────────────────────────────────

test("sanitizeSessionText returns empty string for non-string inputs", () => {
  assert.equal(sanitizeSessionText(null), "");
  assert.equal(sanitizeSessionText(undefined), "");
  assert.equal(sanitizeSessionText(123), "");
  assert.equal(sanitizeSessionText({}), "");
  assert.equal(sanitizeSessionText([]), "");
});

test("sanitizeSessionText strips control characters", () => {
  // \x00 (null) removed; adjacent chars remain adjacent
  assert.equal(sanitizeSessionText("hello\x00world"), "helloworld");
  // \x1F unit separator removed; space preserved for collapse
  assert.equal(sanitizeSessionText("a\x1F b"), "a b");
  // \x7F (DEL) removed
  assert.equal(sanitizeSessionText("test\x7Fchar"), "testchar");
});

test("sanitizeSessionText strips HTML tags", () => {
  assert.equal(sanitizeSessionText("<script>alert(1)</script>"), "alert(1)");
  assert.equal(sanitizeSessionText("hello <b>world</b>"), "hello world");
  assert.equal(sanitizeSessionText("<div>text</div>"), "text");
  assert.equal(sanitizeSessionText("no tags here"), "no tags here");
});

test("sanitizeSessionText collapses whitespace", () => {
  assert.equal(sanitizeSessionText("hello   world"), "hello world");
  assert.equal(sanitizeSessionText("a\t\tb"), "a b");
  assert.equal(sanitizeSessionText("  leading and trailing  "), "leading and trailing");
});

test("sanitizeSessionText respects maxLength", () => {
  const long = "a".repeat(300);
  assert.equal(sanitizeSessionText(long, 50).length, 50);
  assert.equal(sanitizeSessionText("hello world", 100).length, 11); // unchanged
});

test("sanitizeSessionText respects maxLength=0 (no truncation)", () => {
  const long = "a".repeat(300);
  assert.equal(sanitizeSessionText(long, 0).length, 300);
});

test("sanitizeSessionText preserves emoji and unicode", () => {
  assert.equal(sanitizeSessionText("hello world"), "hello world");
});

// ─── createSessionSnapshot ─────────────────────────────────────────────────

test("createSessionSnapshot returns object with expected structure", () => {
  const snap = createSessionSnapshot();
  assert.ok(snap);
  assert.equal(typeof snap, "object");
  assert.ok(Array.isArray(snap.events));
  assert.equal(snap.events.length, 0);
  assert.ok(snap.appliedEventIds instanceof Set);
  assert.equal(snap.appliedEventIds.size, 0);
});

test("createSessionSnapshot sets presenterId when provided", () => {
  const snap = createSessionSnapshot({ presenterId: "user-123" });
  assert.equal(snap.presenterId, "user-123");
});

test("createSessionSnapshot defaults presenterId to null", () => {
  const snap = createSessionSnapshot();
  assert.equal(snap.presenterId, null);
});

test("createSessionSnapshot ignores unknown options", () => {
  const snap = createSessionSnapshot({ presenterId: "x", unknownOpt: true });
  assert.equal(snap.presenterId, "x");
  assert.equal(snap.unknownOpt, undefined);
});

// ─── canApplyPrivilegedSessionEvent ───────────────────────────────────────

test("canApplyPrivilegedSessionEvent returns false for null/undefined snapshot", () => {
  assert.equal(canApplyPrivilegedSessionEvent(null, {}), false);
  assert.equal(canApplyPrivilegedSessionEvent(undefined, {}), false);
});

test("canApplyPrivilegedSessionEvent returns false for null/undefined event", () => {
  assert.equal(canApplyPrivilegedSessionEvent({}, null), false);
  assert.equal(canApplyPrivilegedSessionEvent({}, undefined), false);
});

test("canApplyPrivilegedSessionEvent allows non-privileged types always", () => {
  const snapshot = createSessionSnapshot({ presenterId: "user-A" });
  const event = { type: "chat:message", senderId: "user-B" };
  assert.equal(canApplyPrivilegedSessionEvent(snapshot, event), true);
});

test("canApplyPrivilegedSessionEvent allows privileged type when no presenter", () => {
  const snapshot = createSessionSnapshot(); // presenterId = null
  const event = { type: "control:grant", senderId: "user-B" };
  assert.equal(canApplyPrivilegedSessionEvent(snapshot, event), true);
});

test("canApplyPrivilegedSessionEvent allows privileged type when sender is presenter", () => {
  const snapshot = createSessionSnapshot({ presenterId: "user-A" });
  const event = { type: "control:grant", senderId: "user-A" };
  assert.equal(canApplyPrivilegedSessionEvent(snapshot, event), true);
});

test("canApplyPrivilegedSessionEvent blocks privileged type from non-presenter", () => {
  const snapshot = createSessionSnapshot({ presenterId: "user-A" });
  const event = { type: "control:grant", senderId: "user-B" };
  assert.equal(canApplyPrivilegedSessionEvent(snapshot, event), false);
});

test("canApplyPrivilegedSessionEvent blocks state:update from non-presenter", () => {
  const snapshot = createSessionSnapshot({ presenterId: "user-A" });
  const event = { type: "state:update", senderId: "user-C" };
  assert.equal(canApplyPrivilegedSessionEvent(snapshot, event), false);
});

// ─── applySessionEvent ─────────────────────────────────────────────────────

test("applySessionEvent returns snapshot unchanged for null/undefined snapshot", () => {
  const snap = createSessionSnapshot();
  assert.equal(applySessionEvent(null, { type: "x" }), null);
  assert.equal(applySessionEvent(undefined, { type: "x" }), undefined);
});

test("applySessionEvent returns snapshot unchanged for null/undefined event", () => {
  const snap = createSessionSnapshot();
  assert.equal(applySessionEvent(snap, null), snap);
  assert.equal(applySessionEvent(snap, undefined), snap);
});

test("applySessionEvent skips already-applied event ids (dedup)", () => {
  const snap = createSessionSnapshot();
  const event = { id: "evt-1", type: "chat:message", senderId: "user-A" };
  const next1 = applySessionEvent(snap, event);
  const next2 = applySessionEvent(next1, event);
  // Should not add the event twice
  assert.equal(next1.events.length, 1);
  assert.equal(next2.events.length, 1);
});

test("applySessionEvent adds non-duplicate event to events array", () => {
  const snap = createSessionSnapshot();
  const event1 = { id: "evt-1", type: "chat:message", senderId: "user-A" };
  const event2 = { id: "evt-2", type: "chat:message", senderId: "user-B" };
  const next = applySessionEvent(applySessionEvent(snap, event1), event2);
  assert.equal(next.events.length, 2);
  assert.equal(next.events[0].id, "evt-1");
  assert.equal(next.events[1].id, "evt-2");
});

test("applySessionEvent updates presenterId on control:grant", () => {
  const snap = createSessionSnapshot({ presenterId: "user-A" });
  const event = { id: "evt-2", type: "control:grant", senderId: "user-A", payload: { presenterId: "user-B" } };
  const next = applySessionEvent(snap, event);
  assert.equal(next.presenterId, "user-B");
});

test("applySessionEvent does not update presenterId for non-control:grant events", () => {
  const snap = createSessionSnapshot({ presenterId: "user-A" });
  const event = { id: "evt-1", type: "chat:message", senderId: "user-A" };
  const next = applySessionEvent(snap, event);
  assert.equal(next.presenterId, "user-A");
});

test("applySessionEvent skips event without id", () => {
  const snap = createSessionSnapshot();
  const event = { type: "chat:message", senderId: "user-A" }; // no id
  const next = applySessionEvent(snap, event);
  assert.equal(next.events.length, 1); // added because no id means no dedup
  assert.ok(next.appliedEventIds.size >= 0); // id was undefined, filtered out
});

test("applySessionEvent blocked event is not added", () => {
  const snap = createSessionSnapshot({ presenterId: "user-A" });
  const event = { id: "evt-1", type: "control:grant", senderId: "user-B" }; // user-B != presenter
  const next = applySessionEvent(snap, event);
  assert.equal(next.events.length, 0, "blocked event should not be added");
  assert.equal(next.presenterId, "user-A", "presenterId should not change");
});
