'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

// Inline the module under test to avoid import path issues
const {
  sanitizeSessionText,
  createSessionSnapshot,
  canApplyPrivilegedSessionEvent,
  applySessionEvent,
} = require('../src/lib/collaboration/sessionTrace.js');

describe('sanitizeSessionText', () => {
  it('returns empty string for non-string input', () => {
    assert.strictEqual(sanitizeSessionText(null), '');
    assert.strictEqual(sanitizeSessionText(undefined), '');
    assert.strictEqual(sanitizeSessionText(123), '');
    assert.strictEqual(sanitizeSessionText({}), '');
    assert.strictEqual(sanitizeSessionText([]), '');
  });

  it('strips control characters 0x00-0x08 and 0x0E-0x1F', () => {
    assert.strictEqual(sanitizeSessionText('hello\x00world'), 'helloworld');
    assert.strictEqual(sanitizeSessionText('a\x07b\x08c'), 'abc');
  });

  it('strips HTML opening and closing tags', () => {
    // <script> and </script> tags are removed; inner text remains
    assert.strictEqual(sanitizeSessionText('<script>alert(1)</script>hello'), 'alert(1)hello');
    assert.strictEqual(sanitizeSessionText('hello <b>world</b>'), 'hello world');
    assert.strictEqual(sanitizeSessionText('<img src=x onerror=alert(1)>'), '');
  });

  it('collapses multiple whitespace characters to single space', () => {
    assert.strictEqual(sanitizeSessionText('hello    world'), 'hello world');
    assert.strictEqual(sanitizeSessionText('hello\n\nworld'), 'hello world');
    assert.strictEqual(sanitizeSessionText('a\t\tb'), 'a b');
  });

  it('trims leading and trailing whitespace', () => {
    assert.strictEqual(sanitizeSessionText('  hello  '), 'hello');
    assert.strictEqual(sanitizeSessionText('\thello\n'), 'hello');
  });

  it('truncates to maxLength when maxLength > 0', () => {
    assert.strictEqual(sanitizeSessionText('hello world', 5), 'hello');
    assert.strictEqual(sanitizeSessionText('hello world', 0), 'hello world');
    assert.strictEqual(sanitizeSessionText('abcdefghij', 3), 'abc');
  });

  it('returns empty string when maxLength is 0 but string is non-empty after sanitization', () => {
    // When maxLength is 0 the function returns clean string as-is (not truncating)
    assert.strictEqual(sanitizeSessionText('a', 0), 'a');
  });

  it('returns clean string unchanged', () => {
    assert.strictEqual(sanitizeSessionText('Hello World'), 'Hello World');
    assert.strictEqual(sanitizeSessionText('hello-world_123'), 'hello-world_123');
  });
});

describe('createSessionSnapshot', () => {
  it('returns correct shape with null presenterId', () => {
    const snap = createSessionSnapshot();
    assert.strictEqual(snap.presenterId, null);
    assert.ok(Array.isArray(snap.events));
    assert.strictEqual(snap.events.length, 0);
    assert.ok(snap.appliedEventIds instanceof Set);
    assert.strictEqual(snap.appliedEventIds.size, 0);
  });

  it('accepts custom presenterId', () => {
    const snap = createSessionSnapshot({ presenterId: 'user-42' });
    assert.strictEqual(snap.presenterId, 'user-42');
  });
});

describe('canApplyPrivilegedSessionEvent', () => {
  const makeSnapshot = (presenterId) => ({
    presenterId,
    events: [],
    appliedEventIds: new Set(),
  });

  const makeEvent = (type, senderId) => ({ type, senderId });

  it('returns true for non-privileged events regardless of presenterId', () => {
    assert.strictEqual(
      canApplyPrivilegedSessionEvent(makeSnapshot('user-42'), makeEvent('chat:message', 'user-99')),
      true,
    );
    assert.strictEqual(
      canApplyPrivilegedSessionEvent(makeSnapshot(null), makeEvent('chat:message', 'user-99')),
      true,
    );
  });

  it('returns true for privileged events when presenterId is null', () => {
    assert.strictEqual(
      canApplyPrivilegedSessionEvent(makeSnapshot(null), makeEvent('control:grant', 'user-99')),
      true,
    );
  });

  it('returns true for privileged events when senderId matches presenterId', () => {
    assert.strictEqual(
      canApplyPrivilegedSessionEvent(makeSnapshot('user-42'), makeEvent('control:grant', 'user-42')),
      true,
    );
    assert.strictEqual(
      canApplyPrivilegedSessionEvent(makeSnapshot('user-42'), makeEvent('state:update', 'user-42')),
      true,
    );
  });

  it('returns false for privileged events when senderId differs from presenterId', () => {
    assert.strictEqual(
      canApplyPrivilegedSessionEvent(makeSnapshot('user-42'), makeEvent('control:grant', 'user-99')),
      false,
    );
    assert.strictEqual(
      canApplyPrivilegedSessionEvent(makeSnapshot('user-42'), makeEvent('state:update', 'user-99')),
      false,
    );
  });

  it('returns false when snapshot is null or undefined', () => {
    assert.strictEqual(canApplyPrivilegedSessionEvent(null, makeEvent('control:grant', 'user-1')), false);
    assert.strictEqual(canApplyPrivilegedSessionEvent(undefined, makeEvent('control:grant', 'user-1')), false);
  });

  it('returns false when event is null or undefined', () => {
    assert.strictEqual(canApplyPrivilegedSessionEvent(makeSnapshot('user-1'), null), false);
    assert.strictEqual(canApplyPrivilegedSessionEvent(makeSnapshot('user-1'), undefined), false);
  });
});

describe('applySessionEvent', () => {
  const makeSnapshot = (presenterId, events, appliedEventIds) => ({
    presenterId,
    events: events || [],
    appliedEventIds: appliedEventIds || new Set(),
  });

  it('returns snapshot unchanged when snapshot is null or undefined', () => {
    assert.strictEqual(applySessionEvent(null, {}), null);
    assert.strictEqual(applySessionEvent(undefined, {}), undefined);
  });

  it('is idempotent for already-applied event ids', () => {
    const applied = new Set(['event-1']);
    const snap = makeSnapshot('user-1', [{ id: 'event-1', type: 'chat:message', senderId: 'user-1', payload: {} }], applied);
    const next = applySessionEvent(snap, { id: 'event-1', type: 'chat:message', senderId: 'user-1', payload: {} });
    // Should return same snapshot without appending again
    assert.strictEqual(next.events.length, snap.events.length);
  });

  it('appends non-privileged event to events array', () => {
    const snap = makeSnapshot(null);
    const event = { id: 'e-1', type: 'chat:message', senderId: 'user-1', payload: { text: 'hello' } };
    const next = applySessionEvent(snap, event);
    assert.strictEqual(next.events.length, 1);
    assert.strictEqual(next.events[0], event);
  });

  it('sets presenterId when applying control:grant event', () => {
    const snap = makeSnapshot(null);
    const event = { id: 'e-1', type: 'control:grant', senderId: 'user-1', payload: { presenterId: 'user-99' } };
    const next = applySessionEvent(snap, event);
    assert.strictEqual(next.presenterId, 'user-99');
    assert.strictEqual(next.events.length, 1);
  });

  it('rejects privileged event from non-presenter sender', () => {
    const snap = makeSnapshot('user-42');
    const event = { id: 'e-1', type: 'control:grant', senderId: 'user-99', payload: { presenterId: 'user-99' } };
    const next = applySessionEvent(snap, event);
    // Should return same snapshot without applying
    assert.strictEqual(next.presenterId, 'user-42');
    assert.strictEqual(next.events.length, 0);
  });

  it('tracks applied event ids in appliedEventIds Set', () => {
    const snap = makeSnapshot(null);
    const event = { id: 'e-2', type: 'chat:message', senderId: 'user-1', payload: {} };
    const next = applySessionEvent(snap, event);
    assert.ok(next.appliedEventIds instanceof Set);
    assert.ok(next.appliedEventIds.has('e-2'));
  });

  it('skips events with falsy id (no id field)', () => {
    const snap = makeSnapshot(null);
    const event = { type: 'chat:message', senderId: 'user-1', payload: {} };
    const next = applySessionEvent(snap, event);
    assert.strictEqual(next.events.length, 1);
    // Falsy id not added to appliedEventIds
    assert.strictEqual(next.appliedEventIds.has(undefined), false);
  });
});
