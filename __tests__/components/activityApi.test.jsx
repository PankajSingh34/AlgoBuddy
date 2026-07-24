import { jest } from '@jest/globals';

jest.mock('@/lib/serverApi', () => ({
  getSupabaseServerClient: jest.fn(() => ({
    from: jest.fn(() => ({
      upsert: jest.fn().mockResolvedValue({ data: null, error: { message: 'new row violates row-level security policy', details: 'RLS policy', hint: 'policy', code: '42501' } }),
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      gte: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue({ data: [], error: null }),
      maybeSingle: jest.fn().mockResolvedValue({ data: null, error: null }),
    })),
  })),
  jsonResponse: jest.fn((data, status = 200) => ({ data, status })),
  errorResponse: jest.fn((error) => ({ error, status: 500 })),
}));

jest.mock('@/lib/auth', () => ({
  getAuthenticatedUser: jest.fn().mockResolvedValue({ success: true, user: { id: 'user-1' } }),
}));

jest.mock('next/headers', () => ({
  cookies: jest.fn().mockResolvedValue({ getAll: jest.fn(() => []), set: jest.fn() }),
}));

const { POST, GET } = require('@/app/api/activity/route');

describe('activity API route', () => {
  it('returns 403 when the server client hits an RLS error instead of falling back to admin', async () => {
    const response = await POST({ json: async () => ({ type: 'site_visit', localDate: '2026-07-09' }) });
    expect(response.status).toBe(403);
  });

  it('returns activity rows via the server client', async () => {
    const response = await GET({ url: 'http://localhost/api/activity?days=30' });
    expect(response.status).toBe(200);
  });
});
