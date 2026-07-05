// __tests__/components/email.test.js
//
// Run with:  ./node_modules/.bin/jest __tests__/components/email.test.js --colors=false

describe('sendEmail', () => {
  afterEach(() => {
    jest.resetModules();
  });

  test('returns skipped:true when RESEND_API_KEY is not configured', async () => {
    delete process.env.RESEND_API_KEY;
    const { sendEmail } = await import('@/lib/email');
    const result = await sendEmail({ to: 'a@b.com', subject: 'Hi', html: '<p>Hi</p>' });
    expect(result).toEqual({ success: false, skipped: true });
  });

  test('returns skipped:true when RESEND_API_KEY is empty string', async () => {
    process.env.RESEND_API_KEY = '';
    const { sendEmail } = await import('@/lib/email');
    const result = await sendEmail({ to: 'a@b.com', subject: 'Hi', html: '<p>Hi</p>' });
    expect(result).toEqual({ success: false, skipped: true });
  });

  test('returns skipped:true when RESEND_API_KEY is the string undefined', async () => {
    process.env.RESEND_API_KEY = 'undefined';
    const { sendEmail } = await import('@/lib/email');
    const result = await sendEmail({ to: 'a@b.com', subject: 'Hi', html: '<p>Hi</p>' });
    expect(result).toEqual({ success: false, skipped: true });
  });

  test('calls fetch and returns success:true on ok response', async () => {
    process.env.RESEND_API_KEY = 're_validkey';
    // Install a mock fetch before importing the module
    const mockFetch = jest.fn().mockResolvedValue({ ok: true });
    const originalFetch = globalThis.fetch;
    globalThis.fetch = mockFetch;
    try {
      const { sendEmail } = await import('@/lib/email');
      const result = await sendEmail({
        to: 'user@example.com',
        subject: 'Test',
        html: '<p>Test</p>',
      });
      expect(result).toEqual({ success: true });
      expect(mockFetch).toHaveBeenCalledTimes(1);
      const [url, init] = mockFetch.mock.calls[0];
      expect(url).toBe('https://api.resend.com/emails');
      expect(init.headers.Authorization).toBe('Bearer re_validkey');
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  test('returns error on non-ok HTTP response', async () => {
    process.env.RESEND_API_KEY = 're_validkey';
    const mockFetch = jest.fn().mockResolvedValue({
      ok: false,
      text: async () => 'Invalid email address',
    });
    const originalFetch = globalThis.fetch;
    globalThis.fetch = mockFetch;
    try {
      const { sendEmail } = await import('@/lib/email');
      const result = await sendEmail({
        to: 'bad@example.com',
        subject: 'Hi',
        html: '<p>Hi</p>',
      });
      expect(result).toEqual({ success: false, error: 'Invalid email address' });
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  test('returns error on network failure', async () => {
    process.env.RESEND_API_KEY = 're_validkey';
    const mockFetch = jest.fn().mockRejectedValue(new Error('ENOTFOUND'));
    const originalFetch = globalThis.fetch;
    globalThis.fetch = mockFetch;
    try {
      const { sendEmail } = await import('@/lib/email');
      const result = await sendEmail({
        to: 'a@b.com',
        subject: 'Hi',
        html: '<p>Hi</p>',
      });
      expect(result).toEqual({ success: false, error: 'ENOTFOUND' });
    } finally {
      globalThis.fetch = originalFetch;
    }
  });
});
