// __tests__/components/verifyTurnstile.test.js
//
// Run with:  ./node_modules/.bin/jest __tests__/components/verifyTurnstile.test.js --colors=false

describe('verifyTurnstile', () => {
  const originalEnv = process.env;

  afterEach(() => {
    jest.resetModules();
    process.env = originalEnv;
  });

  // Helper: install a mock fetch, import the module, and run testFn
  const withMockFetch = (mockFn, testFn) => {
    const originalFetch = globalThis.fetch;
    globalThis.fetch = mockFn;
    return import('@/lib/verifyTurnstile')
      .then(({ verifyTurnstile }) => testFn(verifyTurnstile))
      .finally(() => {
        globalThis.fetch = originalFetch;
      });
  };

  test('returns error when captcha token is missing', async () => {
    process.env.TURNSTILE_SECRET_KEY = '0xsecret';
    await withMockFetch(jest.fn(), async (verify) => {
      const result = await verify('');
      expect(result).toEqual({ ok: false, error: 'Captcha token missing' });
    });
  });

  test('returns error when captcha token is null', async () => {
    process.env.TURNSTILE_SECRET_KEY = '0xsecret';
    await withMockFetch(jest.fn(), async (verify) => {
      const result = await verify(null);
      expect(result).toEqual({ ok: false, error: 'Captcha token missing' });
    });
  });

  test('returns error when captcha token is undefined', async () => {
    process.env.TURNSTILE_SECRET_KEY = '0xsecret';
    await withMockFetch(jest.fn(), async (verify) => {
      const result = await verify(undefined);
      expect(result).toEqual({ ok: false, error: 'Captcha token missing' });
    });
  });

  test('calls fetch with correct Turnstile siteverify URL', async () => {
    process.env.TURNSTILE_SECRET_KEY = '0xmysecret';
    const mockFetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    });
    await withMockFetch(mockFetch, async (verify) => {
      await verify('test-token', { ip: '1.2.3.4' });
      expect(mockFetch).toHaveBeenCalledTimes(1);
      const [url, init] = mockFetch.mock.calls[0];
      expect(url).toBe('https://challenges.cloudflare.com/turnstile/v0/siteverify');
      expect(init.method).toBe('POST');
      expect(init.headers['Content-Type']).toBe('application/x-www-form-urlencoded');
      const body = Object.fromEntries(new URLSearchParams(init.body));
      expect(body.secret).toBe('0xmysecret');
      expect(body.response).toBe('test-token');
      expect(body.remoteip).toBe('1.2.3.4');
    });
  });

  test('omits remoteip when ip is unknown', async () => {
    process.env.TURNSTILE_SECRET_KEY = '0xsecret';
    const mockFetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    });
    await withMockFetch(mockFetch, async (verify) => {
      await verify('token', { ip: 'unknown' });
      const body = Object.fromEntries(new URLSearchParams(mockFetch.mock.calls[0][1].body));
      expect(body.remoteip).toBeUndefined();
    });
  });

  test('omits remoteip when ip is not provided', async () => {
    process.env.TURNSTILE_SECRET_KEY = '0xsecret';
    const mockFetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    });
    await withMockFetch(mockFetch, async (verify) => {
      await verify('token');
      const body = Object.fromEntries(new URLSearchParams(mockFetch.mock.calls[0][1].body));
      expect(body.remoteip).toBeUndefined();
    });
  });

  test('returns ok:true on successful verification', async () => {
    process.env.TURNSTILE_SECRET_KEY = '0xsecret';
    const mockFetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    });
    await withMockFetch(mockFetch, async (verify) => {
      const result = await verify('valid-token');
      expect(result).toEqual({ ok: true });
    });
  });

  test('returns error on non-ok HTTP response', async () => {
    process.env.TURNSTILE_SECRET_KEY = '0xsecret';
    const mockFetch = jest.fn().mockResolvedValue({ ok: false, status: 500 });
    await withMockFetch(mockFetch, async (verify) => {
      const result = await verify('token');
      expect(result).toEqual({ ok: false, error: 'Captcha verification request failed' });
    });
  });

  test('returns error on network failure', async () => {
    process.env.TURNSTILE_SECRET_KEY = '0xsecret';
    const mockFetch = jest.fn().mockRejectedValue(new Error('ECONNREFUSED'));
    await withMockFetch(mockFetch, async (verify) => {
      const result = await verify('token');
      expect(result).toEqual({ ok: false, error: 'Captcha verification request failed' });
    });
  });

  test('returns error when json parsing fails', async () => {
    process.env.TURNSTILE_SECRET_KEY = '0xsecret';
    const mockFetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => { throw new Error('parse error'); },
    });
    await withMockFetch(mockFetch, async (verify) => {
      const result = await verify('token');
      // json() failure sets data=null, triggering the generic 'verification failed' path
      expect(result).toEqual({ ok: false, error: 'Captcha verification failed. Please try again.' });
    });
  });

  test('returns expired error on timeout-or-duplicate code', async () => {
    process.env.TURNSTILE_SECRET_KEY = '0xsecret';
    const mockFetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: false, 'error-codes': ['timeout-or-duplicate'] }),
    });
    await withMockFetch(mockFetch, async (verify) => {
      const result = await verify('token');
      expect(result).toEqual({
        ok: false,
        error: 'Captcha token expired or was already used. Please refresh the page.',
      });
    });
  });

  test('returns generic error on other failure codes', async () => {
    process.env.TURNSTILE_SECRET_KEY = '0xsecret';
    const mockFetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: false, 'error-codes': ['invalid-input-response'] }),
    });
    await withMockFetch(mockFetch, async (verify) => {
      const result = await verify('token');
      expect(result).toEqual({ ok: false, error: 'Captcha verification failed. Please try again.' });
    });
  });
});
