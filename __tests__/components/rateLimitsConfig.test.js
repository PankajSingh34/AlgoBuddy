// __tests__/components/rateLimitsConfig.test.js
//
// Run with:  ./node_modules/.bin/jest __tests__/components/rateLimitsConfig.test.js --colors=false

describe('RATE_LIMITS', () => {
  const originalEnv = process.env;

  afterEach(() => {
    jest.resetModules();
    process.env = originalEnv;
  });

  const loadRateLimits = () => import('@/config/rateLimits').then((m) => m.RATE_LIMITS);

  test('exports RATE_LIMITS as an object', async () => {
    delete process.env.SMTP_DAILY_QUOTA;
    const RL = await loadRateLimits();
    expect(RL).toBeDefined();
    expect(typeof RL).toBe('object');
  });

  test('CONTACT_API has a positive integer LIMIT', async () => {
    delete process.env.SMTP_DAILY_QUOTA;
    const RL = await loadRateLimits();
    expect(RL.CONTACT_API).toBeDefined();
    expect(typeof RL.CONTACT_API.LIMIT).toBe('number');
    expect(RL.CONTACT_API.LIMIT).toBeGreaterThan(0);
    expect(Number.isInteger(RL.CONTACT_API.LIMIT)).toBe(true);
  });

  test('CONTACT_API.LIMIT equals 5', async () => {
    delete process.env.SMTP_DAILY_QUOTA;
    const RL = await loadRateLimits();
    expect(RL.CONTACT_API.LIMIT).toBe(5);
  });

  test('SMTP has a DAILY_QUOTA property', async () => {
    delete process.env.SMTP_DAILY_QUOTA;
    const RL = await loadRateLimits();
    expect(RL.SMTP).toBeDefined();
    expect(typeof RL.SMTP.DAILY_QUOTA).toBe('number');
  });

  test('SMTP.DAILY_QUOTA defaults to 400 when SMTP_DAILY_QUOTA is unset', async () => {
    delete process.env.SMTP_DAILY_QUOTA;
    const RL = await loadRateLimits();
    expect(RL.SMTP.DAILY_QUOTA).toBe(400);
  });

  test('SMTP.DAILY_QUOTA is a positive integer', async () => {
    process.env.SMTP_DAILY_QUOTA = '1000';
    const RL = await loadRateLimits();
    expect(RL.SMTP.DAILY_QUOTA).toBe(1000);
    expect(Number.isInteger(RL.SMTP.DAILY_QUOTA)).toBe(true);
    expect(RL.SMTP.DAILY_QUOTA).toBeGreaterThan(0);
  });

  test('SMTP.DAILY_QUOTA parses a numeric string', async () => {
    process.env.SMTP_DAILY_QUOTA = '250';
    const RL = await loadRateLimits();
    expect(RL.SMTP.DAILY_QUOTA).toBe(250);
  });
});
