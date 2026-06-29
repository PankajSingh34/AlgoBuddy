import toast from "react-hot-toast";
import { supabase } from "./supabase.js";
import { ApiError, AuthError } from "./apiErrors.js";
import { CSRF_HEADER_NAME, CSRF_COOKIE_NAME } from "./csrf.js";

const STATE_CHANGING_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);
const MAX_AUTH_RETRIES = 2;

class ApiClient {
  constructor() {
    this.csrfToken = null;
  }

  async getCsrfToken() {
    if (this.csrfToken) return this.csrfToken;
    try {
      const res = await fetch("/api/csrf-token", { method: "GET" });
      if (res.ok) {
        const data = await res.json();
        this.csrfToken = data.csrfToken;
        return this.csrfToken;
      }
    } catch {
      // CSRF token fetch failed, proceed without it
    }
    return null;
  }

  async parseResponse(res) {
    const text = await res.text();
    if (!text) return {};

    const contentType = res.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      try {
        return JSON.parse(text);
      } catch {
        return { message: text };
      }
    }

    return { message: text };
  }

  notifyError(error, silent) {
    if (silent || typeof window === "undefined") return;
    const message = error?.message || "Request failed";
    toast.error(message);
  }

  async request(path, options = {}, authRetries = 0) {
    const { method = 'GET', body, headers = {}, baseUrl = "", silent = false } = options;
    const extraHeaders = { ...headers };
    const requestPath = baseUrl ? new URL(path, baseUrl).toString() : path;

    if (STATE_CHANGING_METHODS.has(method)) {
      let token = this.csrfToken;
      if (!token && typeof document !== 'undefined') {
        const match = document.cookie.match(
          new RegExp(`(^| )${CSRF_COOKIE_NAME}=([^;]+)`),
        );
        token = match ? decodeURIComponent(match[2]) : null;
      }
      if (!token) {
        token = await this.getCsrfToken();
      }
      if (token) {
        extraHeaders[CSRF_HEADER_NAME] = token;
      }
    }

    const { data: { session } } = await supabase.auth.getSession();
    const accessToken = session?.access_token;

    let res;
    try {
      res = await fetch(requestPath, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
          ...extraHeaders,
        },
        body: body ? JSON.stringify(body) : undefined,
      });
    } catch (err) {
      this.notifyError(err, silent);
      throw err;
    }

    if (res.status === 401 && authRetries < MAX_AUTH_RETRIES) {
      try {
        const { data: { session: newSession } } = await supabase.auth.refreshSession();
        if (newSession) {
          return this.request(path, options, authRetries + 1);
        }
      } catch {
        // refresh failed, redirect to login below
      }
      this.notifyError(new AuthError('Session expired'), silent);
      if (typeof localStorage !== "undefined") {
        localStorage.removeItem('supabase.auth.token');
      }
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      throw new AuthError('Session expired');
    }

    const data = await this.parseResponse(res);
    if (!res.ok) {
      if (res.status === 403 && data.error && data.error.includes("CSRF")) {
        this.csrfToken = null;
        if (typeof document !== 'undefined') {
          document.cookie = `${CSRF_COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        }
        if (!options._csrfRetried) {
          return this.request(path, { ...options, _csrfRetried: true }, authRetries);
        }
      }
      const error = new ApiError(data.error || data.message || 'Request failed', data.code || 'REQUEST_ERROR', res.status);
      this.notifyError(error, silent);
      throw error;
    }
    return data;
  }
}

export const api = new ApiClient();
