import { jest } from '@jest/globals';

jest.mock('@/lib/serverApi', () => ({
  getSupabaseAdmin: jest.fn(() => ({
    from: jest.fn(() => ({
      upsert: jest.fn().mockResolvedValue({ data: [{}], error: null }),
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      gte: jest.fn().mockReturnThis(),
      order: jest.fn().mockResolvedValue({ data: [], error: null }),
    })),
  })),
  getSupabaseServerClient: jest.fn(() => ({
    from: jest.fn(() => ({
      upsert: jest.fn().mockResolvedValue({ data: null, error: { message: 'permission denied for table user_activity', details: 'RLS policy', hint: 'policy' } }),
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      gte: jest.fn().mockReturnThis(),
      order: jest.fn().mockResolvedValue({ data: [], error: null }),
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
  it('falls back to admin client when the server client hits an RLS error', async () => {
    const response = await POST({ json: async () => ({ type: 'site_visit', localDate: '2026-07-09' }) });
    expect(response.status).toBe(200);
  });

  it('returns activity rows when the admin client succeeds', async () => {
    const response = await GET({ url: 'http://localhost/api/activity?days=30' });
    expect(response.status).toBe(200);
  });
});
