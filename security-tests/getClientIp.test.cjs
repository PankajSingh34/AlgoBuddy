// security-tests/getClientIp.test.cjs
//
// Run with:  node --experimental-detect-module --test security-tests/getClientIp.test.cjs
//
// Tests for src/lib/getClientIp.js

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

// Inlined function from src/lib/getClientIp.js
const PRIVATE_IP_RE =
  /^(127\.|10\.|172\.(1[6-9]|2\d|3[01])\.|192\.168\.|::1$|fc[0-9a-f]{2}:|fd[0-9a-f]{2}:)/i;

function getClientIp(headers) {
  const realIp = headers.get('x-real-ip');
  if (realIp) return realIp.trim();

  const forwardedFor = headers.get('x-forwarded-for');
  if (forwardedFor) {
    const hops = forwardedFor
      .split(',')
      .map((h) => h.trim())
      .filter(Boolean);
    for (let i = hops.length - 1; i >= 0; i--) {
      if (!PRIVATE_IP_RE.test(hops[i])) return hops[i];
    }
  }

  return 'unknown';
}

// Minimal Headers mock
function makeHeaders(map) {
  return {
    get: (k) => (map[k] !== undefined ? map[k] : null),
  };
}

describe('getClientIp', () => {
  describe('x-real-ip priority', () => {
    it('returns x-real-ip when present', () => {
      const headers = makeHeaders({ 'x-real-ip': '203.0.113.50' });
      assert.strictEqual(getClientIp(headers), '203.0.113.50');
    });

    it('returns x-real-ip even when x-forwarded-for is also present', () => {
      const headers = makeHeaders({
        'x-real-ip': '203.0.113.50',
        'x-forwarded-for': '198.51.100.1, 192.0.2.1',
      });
      assert.strictEqual(getClientIp(headers), '203.0.113.50');
    });

    it('trims whitespace from x-real-ip', () => {
      const headers = makeHeaders({ 'x-real-ip': '  203.0.113.50  ' });
      assert.strictEqual(getClientIp(headers), '203.0.113.50');
    });
  });

  describe('x-forwarded-for rightmost non-private hop', () => {
    it('returns rightmost public IP from 3-hop chain', () => {
      const headers = makeHeaders({
        'x-forwarded-for': '198.51.100.1, 192.0.2.1, 203.0.113.50',
      });
      // Rightmost = 203.0.113.50 (assuming none are private)
      assert.strictEqual(getClientIp(headers), '203.0.113.50');
    });

    it('skips private IPs and returns first public from right', () => {
      const headers = makeHeaders({
        'x-forwarded-for': '10.0.0.1, 192.168.1.1, 203.0.113.50',
      });
      // Rightmost is 203.0.113.50 (public), should be returned
      assert.strictEqual(getClientIp(headers), '203.0.113.50');
    });

    it('skips only-rightmost private and returns next public', () => {
      const headers = makeHeaders({
        'x-forwarded-for': '198.51.100.1, 10.0.0.5, 192.168.1.100',
      });
      // Rightmost 192.168.1.100 is private, skip it
      // Next 10.0.0.5 is private, skip it
      // 198.51.100.1 is public, return it
      assert.strictEqual(getClientIp(headers), '198.51.100.1');
    });

    it('skips all private IPs and returns unknown', () => {
      const headers = makeHeaders({
        'x-forwarded-for': '10.0.0.1, 192.168.1.1, 172.16.0.5',
      });
      // All are private, should return 'unknown'
      assert.strictEqual(getClientIp(headers), 'unknown');
    });

    it('handles single IP in x-forwarded-for', () => {
      const headers = makeHeaders({ 'x-forwarded-for': '203.0.113.50' });
      assert.strictEqual(getClientIp(headers), '203.0.113.50');
    });

    it('ignores leading whitespace in x-forwarded-for IPs', () => {
      const headers = makeHeaders({ 'x-forwarded-for': ' 203.0.113.50,  198.51.100.1 ' });
      // Rightmost non-private = 198.51.100.1
      assert.strictEqual(getClientIp(headers), '198.51.100.1');
    });
  });

  describe('private IP filtering', () => {
    // 127.x (loopback)
    it('filters 127.0.0.0/8 loopback range (loopback rightmost)', () => {
      const headers = makeHeaders({ 'x-forwarded-for': '203.0.113.50, 127.0.0.1' });
      // 127.0.0.1 is filtered (loopback), so 203.0.113.50 is returned
      assert.strictEqual(getClientIp(headers), '203.0.113.50');
    });

    it('filters 127.0.0.3 (middle of chain)', () => {
      const headers = makeHeaders({ 'x-forwarded-for': '203.0.113.50, 127.0.0.3' });
      // 127.0.0.3 is filtered, 203.0.113.50 is public, returned
      assert.strictEqual(getClientIp(headers), '203.0.113.50');
    });

    // 10.x
    it('filters 10.0.0.0/8 private range', () => {
      const headers = makeHeaders({ 'x-forwarded-for': '203.0.113.50, 10.255.255.255' });
      assert.strictEqual(getClientIp(headers), '203.0.113.50');
    });

    it('filters 10.0.0.0', () => {
      const headers = makeHeaders({ 'x-forwarded-for': '203.0.113.50, 10.0.0.0' });
      assert.strictEqual(getClientIp(headers), '203.0.113.50');
    });

    // 172.16-31.x
    it('filters 172.16.0.0/12 private range', () => {
      const headers = makeHeaders({ 'x-forwarded-for': '203.0.113.50, 172.16.0.1' });
      assert.strictEqual(getClientIp(headers), '203.0.113.50');
    });

    it('filters 172.31.255.255', () => {
      const headers = makeHeaders({ 'x-forwarded-for': '203.0.113.50, 172.31.255.255' });
      assert.strictEqual(getClientIp(headers), '203.0.113.50');
    });

    it('does NOT filter 172.32.0.0 (outside range)', () => {
      const headers = makeHeaders({ 'x-forwarded-for': '10.0.0.1, 172.32.0.1' });
      // 172.32 is NOT in 172.16-31, should be returned
      assert.strictEqual(getClientIp(headers), '172.32.0.1');
    });

    // 192.168.x
    it('filters 192.168.0.0/16 private range', () => {
      const headers = makeHeaders({ 'x-forwarded-for': '203.0.113.50, 192.168.0.1' });
      assert.strictEqual(getClientIp(headers), '203.0.113.50');
    });

    it('filters 192.168.255.255', () => {
      const headers = makeHeaders({ 'x-forwarded-for': '203.0.113.50, 192.168.255.255' });
      assert.strictEqual(getClientIp(headers), '203.0.113.50');
    });

    it('does NOT filter 192.0.2.0 (TEST-NET-1)', () => {
      const headers = makeHeaders({ 'x-forwarded-for': '10.0.0.1, 192.0.2.1' });
      // 192.0.2.x is NOT 192.168.x, should be returned
      assert.strictEqual(getClientIp(headers), '192.0.2.1');
    });
  });

  describe('IPv6 private ranges', () => {
    it('filters fc00::/7 range (fc)', () => {
      const headers = makeHeaders({ 'x-forwarded-for': '203.0.113.50, fc00::1' });
      assert.strictEqual(getClientIp(headers), '203.0.113.50');
    });

    it('filters fd00::/8 range', () => {
      const headers = makeHeaders({ 'x-forwarded-for': '203.0.113.50, fd00::1' });
      assert.strictEqual(getClientIp(headers), '203.0.113.50');
    });

    it('does NOT filter public IPv6 addresses', () => {
      const headers = makeHeaders({ 'x-forwarded-for': '10.0.0.1, 2001:db8::1' });
      // 2001:db8:: is documentation range but not filtered by this regex
      assert.strictEqual(getClientIp(headers), '2001:db8::1');
    });
  });

  describe('unknown fallback', () => {
    it('returns unknown when no IP headers exist', () => {
      const headers = makeHeaders({});
      assert.strictEqual(getClientIp(headers), 'unknown');
    });

    it('returns unknown when x-real-ip is empty', () => {
      const headers = makeHeaders({ 'x-real-ip': '' });
      assert.strictEqual(getClientIp(headers), 'unknown');
    });

    it('returns unknown when x-forwarded-for is empty', () => {
      const headers = makeHeaders({ 'x-forwarded-for': '' });
      assert.strictEqual(getClientIp(headers), 'unknown');
    });

    it('returns unknown when x-forwarded-for has only whitespace', () => {
      const headers = makeHeaders({ 'x-forwarded-for': '   ' });
      assert.strictEqual(getClientIp(headers), 'unknown');
    });
  });
});
