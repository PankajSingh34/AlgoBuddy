const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

// Inline sessionTrace helpers

const MAX_ANNOTATION_LENGTH = 240;

function sanitizeSessionText(value, maxLength = MAX_ANNOTATION_LENGTH) {
  return String(value || "")
    .replace(/<[^>]*>/g, "")
    .replace(/[\u0000-\u001f\u007f]/g, "")
    .trim()
    .slice(0, maxLength);
}

function createSessionEvent({
  type,
  payload = {},
  senderId = "unknown",
  senderName = "Anonymous",
  sequence = 0,
  timestamp = Date.now(),
}) {
  return {
    id: `${senderId}:${sequence}:${timestamp}`,
    type,
    payload,
    senderId,
    senderName,
    sequence,
    timestamp,
  };
}

function createSessionSnapshot(initial = {}) {
  return {
    source: "",
    language: "JavaScript",
    step: 0,
    playing: false,
    speed: 900,
    presenterId: null,
    followPresenter: true,
    annotations: [],
    currentFrameId: null,
    ...initial,
  };
}

// ---- Tests ----

describe('sanitizeSessionText', () => {
  describe('HTML tag stripping', () => {
    it('strips script tags', () => {
      assert.equal(sanitizeSessionText('<script>alert(1)</script>'), 'alert(1)');
    });

    it('strips img onerror tags', () => {
      const input = '<img src=x onerror="alert(1)">';
      const result = sanitizeSessionText(input);
      assert.ok(!result.includes('onerror'));
      assert.ok(!result.includes('alert'));
    });

    it('strips iframe tags', () => {
      assert.equal(sanitizeSessionText('<iframe src="evil.com"></iframe>'), '');
    });

    it('strips nested tags', () => {
      const input = '<div><p><strong>hello</strong></p></div>';
      assert.equal(sanitizeSessionText(input), 'hello');
    });

    it('strips self-closing tags', () => {
      assert.equal(sanitizeSessionText('<br/><hr/>'), '');
    });

    it('strips anything matching tag pattern, including comparison operators', () => {
      // The regex <[^>]*> strips any <...> sequence, which includes comparison operators
      // This is expected behavior - sanitizer is conservative
      const result = sanitizeSessionText('a < b && c > d');
      assert.equal(result.includes('<'), false);
      assert.equal(result.includes('>'), false);
    });

    it('strips href javascript: links', () => {
      const input = '<a href="javascript:alert(1)">click</a>';
      assert.ok(!sanitizeSessionText(input).includes('javascript:'));
    });
  });

  describe('control character removal', () => {
    it('removes ASCII control characters 0x00-0x1F', () => {
      const input = 'hello\x00\x01\x02world';
      assert.equal(sanitizeSessionText(input), 'helloworld');
    });

    it('removes DEL character 0x7F', () => {
      assert.equal(sanitizeSessionText('hello\x7fworld'), 'helloworld');
    });

    it('preserves normal printable characters', () => {
      assert.equal(sanitizeSessionText('Hello World! 123'), 'Hello World! 123');
    });

    it('preserves unicode characters above 0x7F', () => {
      assert.equal(sanitizeSessionText('cafe with accent: cafe'), 'cafe with accent: cafe');
    });
  });

  describe('maxLength truncation', () => {
    it('truncates to default MAX_ANNOTATION_LENGTH (240)', () => {
      const long = 'x'.repeat(300);
      assert.equal(sanitizeSessionText(long).length, MAX_ANNOTATION_LENGTH);
    });

    it('respects custom maxLength', () => {
      const input = 'hello world';
      assert.equal(sanitizeSessionText(input, 5).length, 5);
      assert.equal(sanitizeSessionText(input, 5), 'hello');
    });

    it('returns empty string for empty input', () => {
      assert.equal(sanitizeSessionText(''), '');
    });
  });

  describe('null/undefined/edge inputs', () => {
    it('handles null', () => {
      assert.equal(sanitizeSessionText(null), '');
    });

    it('handles undefined', () => {
      assert.equal(sanitizeSessionText(undefined), '');
    });

    it('handles number input', () => {
      assert.equal(sanitizeSessionText(12345), '12345');
    });

    it('trims whitespace', () => {
      assert.equal(sanitizeSessionText('  hello  '), 'hello');
    });
  });
});

describe('createSessionEvent', () => {
  it('returns correct shape with all fields', () => {
    const now = Date.now();
    const event = createSessionEvent({
      type: 'code_change',
      payload: { code: 'console.log(1)' },
      senderId: 'user123',
      senderName: 'Alice',
      sequence: 5,
      timestamp: now,
    });
    assert.equal(event.id, 'user123:5:' + now);
    assert.equal(event.type, 'code_change');
    assert.deepEqual(event.payload, { code: 'console.log(1)' });
    assert.equal(event.senderId, 'user123');
    assert.equal(event.senderName, 'Alice');
    assert.equal(event.sequence, 5);
    assert.equal(event.timestamp, now);
  });

  it('uses defaults for optional fields', () => {
    const event = createSessionEvent({ type: 'cursor_move' });
    assert.equal(event.senderId, 'unknown');
    assert.equal(event.senderName, 'Anonymous');
    assert.equal(event.sequence, 0);
    assert.equal(event.type, 'cursor_move');
    assert.deepEqual(event.payload, {});
  });

  it('generates unique id per event', () => {
    const event1 = createSessionEvent({ type: 'a', sequence: 1 });
    const event2 = createSessionEvent({ type: 'b', sequence: 2 });
    assert.notEqual(event1.id, event2.id);
  });

  it('id format includes senderId and sequence', () => {
    const event = createSessionEvent({ senderId: 'alice', sequence: 42 });
    assert.ok(event.id.startsWith('alice:42:'));
  });
});

describe('createSessionSnapshot', () => {
  it('returns correct shape with expected keys', () => {
    const snap = createSessionSnapshot();
    assert.ok('source' in snap);
    assert.ok('language' in snap);
    assert.ok('step' in snap);
    assert.ok('playing' in snap);
    assert.ok('speed' in snap);
    assert.ok('presenterId' in snap);
    assert.ok('followPresenter' in snap);
    assert.ok('annotations' in snap);
    assert.ok('currentFrameId' in snap);
  });

  it('default values are correct', () => {
    const snap = createSessionSnapshot();
    assert.equal(snap.source, '');
    assert.equal(snap.language, 'JavaScript');
    assert.equal(snap.step, 0);
    assert.equal(snap.playing, false);
    assert.equal(snap.speed, 900);
    assert.equal(snap.presenterId, null);
    assert.equal(snap.followPresenter, true);
    assert.deepEqual(snap.annotations, []);
    assert.equal(snap.currentFrameId, null);
  });

  it('accepts initial overrides', () => {
    const snap = createSessionSnapshot({ source: 'const x=1', step: 5, playing: true });
    assert.equal(snap.source, 'const x=1');
    assert.equal(snap.step, 5);
    assert.equal(snap.playing, true);
    assert.equal(snap.language, 'JavaScript');
  });
});
