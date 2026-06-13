import { supabase } from "@/lib/supabase";
import { ApiError, AuthError } from "@/lib/apiErrors";

class ApiClient {
  async request(path, options = {}) {
    const { method = 'GET', body, headers = {} } = options;

    // Get session from Supabase SSR cookie store instead of localStorage
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;

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
        const { data: { session: newSession } } = await supabase.auth.refreshSession();
        if (newSession) {
          // Supabase SSR handles cookie storage automatically
          return this.request(path, options);
        }
      } catch {
        // refresh failed, redirect to login below
      }
      // Clean up any stale localStorage artifact
      localStorage.removeItem('supabase.auth.token');
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
