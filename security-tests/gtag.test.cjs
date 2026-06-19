// security-tests/gtag.test.cjs
//
// Run with:  node --experimental-detect-module --test security-tests/gtag.test.cjs
//
// Tests gtag analytics helpers in src/lib/gtag.js.

const { test, describe, beforeEach } = require('node:test');
const assert = require('node:assert/strict');

// Track calls made to the fake gtag
let gtagCalls;
let gtagAvailable = false;

// Stub global.window before requiring gtag.js
function setupWindow(hasGtag) {
  // Clear require cache so re-require picks up fresh window state
  delete require.cache[require.resolve('../src/lib/gtag.js')];
  gtagCalls = [];
  gtagAvailable = hasGtag;

  if (hasGtag) {
    global.window = {
      gtag: function (...args) {
        gtagCalls.push(args);
      },
    };
  } else {
    global.window = undefined;
  }
}

// Require fresh each test by controlling window before import
describe('gtag utilities', () => {

  test('GA_MEASUREMENT_ID is the expected string value', () => {
    setupWindow(true);
    const { GA_MEASUREMENT_ID } = require('../src/lib/gtag.js');
    assert.strictEqual(GA_MEASUREMENT_ID, 'G-N8XGEXJXEM');
  });

  test('pageview calls gtag with config when window.gtag is defined', () => {
    setupWindow(true);
    const { pageview } = require('../src/lib/gtag.js');
    pageview('/dashboard');
    assert.strictEqual(gtagCalls.length, 1);
    assert.deepStrictEqual(gtagCalls[0], [
      'config',
      'G-N8XGEXJXEM',
      { page_path: '/dashboard' },
    ]);
  });

  test('pageview does not throw when window.gtag is undefined', () => {
    setupWindow(false);
    const { pageview } = require('../src/lib/gtag.js');
    assert.doesNotThrow(() => {
      pageview('/any-page');
    });
  });

  test('event calls gtag with correct event args when window.gtag is defined', () => {
    setupWindow(true);
    const { event } = require('../src/lib/gtag.js');
    event({ action: 'click', category: 'button', label: 'submit', value: 1 });
    assert.strictEqual(gtagCalls.length, 1);
    assert.deepStrictEqual(gtagCalls[0], [
      'event',
      'click',
      { event_category: 'button', event_label: 'submit', value: 1 },
    ]);
  });

  test('event does not throw when window.gtag is undefined', () => {
    setupWindow(false);
    const { event } = require('../src/lib/gtag.js');
    assert.doesNotThrow(() => {
      event({ action: 'test' });
    });
  });

  test('pageview guards against missing page_path', () => {
    setupWindow(true);
    const { pageview } = require('../src/lib/gtag.js');
    pageview(null);
    assert.strictEqual(gtagCalls.length, 1);
    assert.strictEqual(gtagCalls[0][2].page_path, null); // null is passed through directly
  });

  test('event handles missing optional fields without crashing', () => {
    setupWindow(true);
    const { event } = require('../src/lib/gtag.js');
    event({ action: 'minimal' });
    assert.strictEqual(gtagCalls.length, 1);
    assert.strictEqual(gtagCalls[0][1], 'minimal');
  });

  test('multiple pageview calls accumulate correctly', () => {
    setupWindow(true);
    const { pageview } = require('../src/lib/gtag.js');
    pageview('/page-a');
    pageview('/page-b');
    assert.strictEqual(gtagCalls.length, 2);
    assert.strictEqual(gtagCalls[0][2].page_path, '/page-a');
    assert.strictEqual(gtagCalls[1][2].page_path, '/page-b');
  });

  test('event with numeric value preserves the number', () => {
    setupWindow(true);
    const { event } = require('../src/lib/gtag.js');
    event({ action: 'scroll', category: 'engagement', label: 'depth', value: 75 });
    assert.strictEqual(gtagCalls[0][2].value, 75);
  });
});