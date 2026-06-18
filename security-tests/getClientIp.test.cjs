'use strict';

const { describe, it, mock } = require('node:test');
const assert = require('node:assert/strict');

const PRIVATE_IP_RE =
  /^(127\.|10\.|172\.(1[6-9]|2\d|3[01])\.|192\.168\.|::1$|fc[0-9a-f]{2}:|fd[0-9a-f]{2}:)/i;

function getClientIp(headers) {
  const realIp = headers.get("x-real-ip");
  if (realIp) return realIp.trim();

  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor) {
    const hops = forwardedFor
      .split(",")
      .map((h) => h.trim())
      .filter(Boolean);
    for (let i = hops.length - 1; i >= 0; i--) {
      if (!PRIVATE_IP_RE.test(hops[i])) return hops[i];
    }
  }

  return "unknown";
}

function makeHeaders(entries = {}) {
  const m = new Map(Object.entries(entries));
  return {
    get: (k) => m.get(k) || null,
  };
}

describe('getClientIp', () => {
  describe('x-real-ip takes priority', () => {
    it('returns x-real-ip when present', () => {
      const h = makeHeaders({ 'x-real-ip': '8.8.8.8' });
      assert.equal(getClientIp(h), '8.8.8.8');
    });

    it('returns x-real-ip even when x-forwarded-for also present', () => {
      const h = makeHeaders({
        'x-real-ip': '1.2.3.4',
        'x-forwarded-for': '10.0.0.1, 192.168.1.1',
      });
      assert.equal(getClientIp(h), '1.2.3.4');
    });
  });

  describe('x-forwarded-for right-to-left walk', () => {
    it('returns last non-private hop', () => {
      const h = makeHeaders({ 'x-forwarded-for': '10.0.0.1, 192.168.1.1, 203.0.113.5' });
      assert.equal(getClientIp(h), '203.0.113.5');
    });

    it('skips private IPs and returns public one', () => {
      const h = makeHeaders({ 'x-forwarded-for': '10.0.0.5, 172.31.255.1, 198.51.100.9' });
      assert.equal(getClientIp(h), '198.51.100.9');
    });

    it('returns unknown when all hops are private', () => {
      const h = makeHeaders({ 'x-forwarded-for': '10.0.0.1, 127.0.0.1, 192.168.0.50' });
      assert.equal(getClientIp(h), 'unknown');
    });

    it('handles single public hop', () => {
      const h = makeHeaders({ 'x-forwarded-for': '203.0.113.1' });
      assert.equal(getClientIp(h), '203.0.113.1');
    });

    it('walks right-to-left correctly with mixed private/public', () => {
      const h = makeHeaders({ 'x-forwarded-for': '8.8.4.4, 10.0.0.5, 203.0.113.99' });
      assert.equal(getClientIp(h), '203.0.113.99');
    });
  });

  describe('RFC-1918 private IP filtering', () => {
    it('skips 10.x.x.x range', () => {
      const h = makeHeaders({ 'x-forwarded-for': '10.255.255.255' });
      assert.equal(getClientIp(h), 'unknown');
    });

    it('skips 172.16-31.x.x range', () => {
      const h = makeHeaders({ 'x-forwarded-for': '172.31.0.1' });
      assert.equal(getClientIp(h), 'unknown');
    });

    it('skips 192.168.x.x range', () => {
      const h = makeHeaders({ 'x-forwarded-for': '192.168.255.255' });
      assert.equal(getClientIp(h), 'unknown');
    });

    it('skips 127.x.x.x (loopback)', () => {
      const h = makeHeaders({ 'x-forwarded-for': '127.0.0.1' });
      assert.equal(getClientIp(h), 'unknown');
    });
  });

  describe('IPv6 private ranges', () => {
    it('skips ::1 (IPv6 loopback)', () => {
      const h = makeHeaders({ 'x-forwarded-for': '::1' });
      assert.equal(getClientIp(h), 'unknown');
    });

    it('skips fc00::/7 ULA range', () => {
      const h = makeHeaders({ 'x-forwarded-for': 'fc00::1' });
      assert.equal(getClientIp(h), 'unknown');
    });

    it('skips fd00::/8 ULA range', () => {
      const h = makeHeaders({ 'x-forwarded-for': 'fd12:3456:789a::1' });
      assert.equal(getClientIp(h), 'unknown');
    });
  });

  describe('fallback and edge cases', () => {
    it('returns unknown when no headers present', () => {
      const h = makeHeaders({});
      assert.equal(getClientIp(h), 'unknown');
    });

    it('handles whitespace in x-forwarded-for', () => {
      const h = makeHeaders({ 'x-forwarded-for': '  203.0.113.5  ,  10.0.0.1  ' });
      assert.equal(getClientIp(h), '203.0.113.5');
    });

    it('ignores empty string hops', () => {
      const h = makeHeaders({ 'x-forwarded-for': ',,,10.0.0.1,,,203.0.113.7' });
      assert.equal(getClientIp(h), '203.0.113.7');
    });

    it('returns unknown when all hops are private', () => {
      const h = makeHeaders({ 'x-forwarded-for': '10.0.0.1, 192.168.1.1, 172.20.0.5' });
      assert.equal(getClientIp(h), 'unknown');
    });

    it('trims whitespace from returned IP', () => {
      const h = makeHeaders({ 'x-forwarded-for': '  203.0.113.5  ' });
      assert.equal(getClientIp(h), '203.0.113.5');
    });
  });
});
