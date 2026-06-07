import { supabase } from "@/lib/supabase";
import { ApiError, AuthError } from "@/lib/apiErrors";

class ApiClient {
  async request(path, options = {}) {
    const { method = 'GET', body, headers = {} } = options;
    const token = localStorage.getItem('supabase.auth.token');

    const res = await fetch(path, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (res.status === 401) {
      try {
        const { data: { session } } = await supabase.auth.refreshSession();
        if (session) {
          localStorage.setItem('supabase.auth.token', session.access_token);
          return this.request(path, options);
        }
      } catch {
        // refresh failed, redirect to login below
      }
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      throw new AuthError('Session expired');
    }

    const data = await res.json();
    if (!res.ok) {
      throw new ApiError(data.error || data.message || 'Request failed', data.code || 'REQUEST_ERROR', res.status);
    }
    return data;
  }
}

export const api = new ApiClient();
