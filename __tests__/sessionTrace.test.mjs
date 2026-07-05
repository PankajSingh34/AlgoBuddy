import { sanitizeSessionText, createSessionSnapshot, canApplyPrivilegedSessionEvent, applySessionEvent } from "../src/lib/collaboration/sessionTrace";

describe("sanitizeSessionText", () => {
  test("returns empty string for non-string input", () => {
    expect(sanitizeSessionText(123)).toBe("");
    expect(sanitizeSessionText(null)).toBe("");
    expect(sanitizeSessionText(undefined)).toBe("");
    expect(sanitizeSessionText({})).toBe("");
    expect(sanitizeSessionText([])).toBe("");
  });

  test("strips control characters", () => {
    expect(sanitizeSessionText("hello\x00world")).toBe("helloworld");
    expect(sanitizeSessionText("line1\x1Fline2")).toBe("line1line2");
  });

  test("removes HTML tags", () => {
    expect(sanitizeSessionText("<script>alert('xss')</script>")).toBe("alert('xss')");
    expect(sanitizeSessionText("<b>bold</b>")).toBe("bold");
    expect(sanitizeSessionText("<a href='evil'>click</a>")).toBe("click");
  });

  test("collapses whitespace", () => {
    expect(sanitizeSessionText("  hello   world  ")).toBe("hello world");
    expect(sanitizeSessionText("line1\n\n\nline2")).toBe("line1 line2");
  });

  test("trims leading and trailing whitespace", () => {
    expect(sanitizeSessionText("   hello   ")).toBe("hello");
  });

  test("respects custom maxLength", () => {
    expect(sanitizeSessionText("hello world", 5)).toBe("hello");
  });

  test("maxLength=0 returns full text", () => {
    expect(sanitizeSessionText("hello world", 0)).toBe("hello world");
  });

  test("handles empty string", () => {
    expect(sanitizeSessionText("")).toBe("");
  });
});

describe("createSessionSnapshot", () => {
  test("creates snapshot with default presenterId", () => {
    const snap = createSessionSnapshot();
    expect(snap.presenterId).toBeNull();
    expect(snap.events).toEqual([]);
    expect(snap.appliedEventIds).toBeInstanceOf(Set);
    expect(snap.appliedEventIds.size).toBe(0);
  });

  test("creates snapshot with custom presenterId", () => {
    const snap = createSessionSnapshot({ presenterId: "user-1" });
    expect(snap.presenterId).toBe("user-1");
  });

  test("returns a new object each call", () => {
    const a = createSessionSnapshot();
    const b = createSessionSnapshot();
    expect(a).not.toBe(b);
  });
});

describe("canApplyPrivilegedSessionEvent", () => {
  const snap = createSessionSnapshot({ presenterId: "presenter-1" });

  test("returns false for null/undefined inputs", () => {
    expect(canApplyPrivilegedSessionEvent(null, {})).toBe(false);
    expect(canApplyPrivilegedSessionEvent(snap, null)).toBe(false);
    expect(canApplyPrivilegedSessionEvent(undefined, {})).toBe(false);
    expect(canApplyPrivilegedSessionEvent(snap, undefined)).toBe(false);
  });

  test("allows non-privileged event types", () => {
    const event = { type: "cursor:move", senderId: "user-2" };
    expect(canApplyPrivilegedSessionEvent(snap, event)).toBe(true);
  });

  test("allows control:grant from presenter", () => {
    const event = { type: "control:grant", senderId: "presenter-1" };
    expect(canApplyPrivilegedSessionEvent(snap, event)).toBe(true);
  });

  test("blocks control:grant from non-presenter", () => {
    const event = { type: "control:grant", senderId: "intruder" };
    expect(canApplyPrivilegedSessionEvent(snap, event)).toBe(false);
  });

  test("allows state:update from presenter", () => {
    const event = { type: "state:update", senderId: "presenter-1" };
    expect(canApplyPrivilegedSessionEvent(snap, event)).toBe(true);
  });

  test("blocks state:update from non-presenter", () => {
    const event = { type: "state:update", senderId: "intruder" };
    expect(canApplyPrivilegedSessionEvent(snap, event)).toBe(false);
  });

  test("allows privileged events when presenterId is null", () => {
    const nullSnap = createSessionSnapshot();
    const event = { type: "control:grant", senderId: "anyone" };
    expect(canApplyPrivilegedSessionEvent(nullSnap, event)).toBe(true);
  });
});

describe("applySessionEvent", () => {
  test("returns snapshot for null/undefined inputs", () => {
    const snap = createSessionSnapshot();
    expect(applySessionEvent(null, {})).toBeNull();
    expect(applySessionEvent(undefined, {})).toBeUndefined();
    expect(applySessionEvent(snap, null)).toBe(snap);
    expect(applySessionEvent(snap, undefined)).toBe(snap);
  });

  test("applies event to snapshot", () => {
    const snap = createSessionSnapshot();
    const event = { id: "evt-1", type: "cursor:move", payload: { x: 100 } };
    const next = applySessionEvent(snap, event);
    expect(next.events).toContain(event);
    expect(next.appliedEventIds.has("evt-1")).toBe(true);
  });

  test("does not duplicate already-applied events", () => {
    const snap = createSessionSnapshot();
    const event = { id: "evt-1", type: "cursor:move" };
    const first = applySessionEvent(snap, event);
    const second = applySessionEvent(first, event);
    expect(second.events.length).toBe(1);
  });

  test("creates a new snapshot (immutability)", () => {
    const snap = createSessionSnapshot();
    const event = { id: "evt-1", type: "cursor:move" };
    const next = applySessionEvent(snap, event);
    expect(next).not.toBe(snap);
    expect(snap.events.length).toBe(0);
  });

  test("updates presenterId on control:grant", () => {
    const snap = createSessionSnapshot();
    const event = { id: "evt-1", type: "control:grant", senderId: "presenter-1", payload: { presenterId: "presenter-1" } };
    const next = applySessionEvent(snap, event);
    expect(next.presenterId).toBe("presenter-1");
  });

  test("ignores privileged events from non-presenter", () => {
    const snap = createSessionSnapshot({ presenterId: "presenter-1" });
    const event = { id: "evt-1", type: "control:grant", senderId: "intruder" };
    const next = applySessionEvent(snap, event);
    expect(next.presenterId).toBe("presenter-1");
    expect(next.events.length).toBe(0);
  });

  test("handles events without an id", () => {
    const snap = createSessionSnapshot();
    const event = { type: "cursor:move" };
    const next = applySessionEvent(snap, event);
    expect(next.events).toContain(event);
  });
});
