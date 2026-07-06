import { supabase } from "@/lib/supabase";
import { ApiError, AuthError } from "@/lib/apiErrors";
import { CSRF_HEADER_NAME, CSRF_COOKIE_NAME } from "@/lib/csrfConstants";

const STATE_CHANGING_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);
const MAX_AUTH_RETRIES = 2;

class ApiClient {
  constructor() {
    this.csrfToken = null;
    this.csrfTokenPromise = null;
  }

  readCsrfTokenFromCookie() {
    if (typeof document === "undefined") return null;

    const match = document.cookie.match(
      new RegExp(`(?:^|;\\s*)${CSRF_COOKIE_NAME}=([^;]*)`),
    );

    return match ? decodeURIComponent(match[1].trim()) : null;
  }

  async getCsrfToken() {
    const fromCookie = this.readCsrfTokenFromCookie();
    if (fromCookie) {
      this.csrfToken = fromCookie;
      return fromCookie;
    }

    if (this.csrfToken) return this.csrfToken;

    if (!this.csrfTokenPromise) {
      this.csrfTokenPromise = fetch("/api/csrf-token", { method: "GET" })
        .then(async (res) => {
          if (!res.ok) return null;
          const data = await res.json();
          const token = data.csrfToken || this.readCsrfTokenFromCookie();
          this.csrfToken = token;
          return token;
        })
        .catch(() => null)
        .finally(() => {
          this.csrfTokenPromise = null;
        });
    }

    return this.csrfTokenPromise;
  }

  async request(path, options = {}, authRetries = 0) {
    const { method = "GET", body, headers = {} } = options;

    const extraHeaders = { ...headers };
    delete extraHeaders[CSRF_HEADER_NAME];
    delete extraHeaders["X-CSRF-Token"];

    if (STATE_CHANGING_METHODS.has(method)) {
      let token = this.readCsrfTokenFromCookie();

      if (!token) {
        token = await this.getCsrfToken();
      } else {
        this.csrfToken = token;
      }

      if (token) {
        extraHeaders[CSRF_HEADER_NAME] = token;
      }
    }

    const {
      data: { session },
    } = await supabase.auth.getSession();

    const accessToken = session?.access_token;

    const res = await fetch(path, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(accessToken
          ? {
              Authorization: `Bearer ${accessToken}`,
            }
          : {}),
        ...extraHeaders,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (
      res.status === 401 &&
      path !== "/api/auth" &&
      authRetries < MAX_AUTH_RETRIES
    ) {
      try {
        const {
          data: { session: newSession },
        } = await supabase.auth.refreshSession();

        if (newSession) {
          return this.request(path, options, authRetries + 1);
        }
      } catch {
        // refresh failed
      }

      localStorage.removeItem("supabase.auth.token");

      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }

      throw new AuthError("Session expired");
    }

    const data = await res.json();

    if (!res.ok) {
      if (
        res.status === 403 &&
        data.error &&
        data.error.includes("CSRF")
      ) {
        this.csrfToken = null;
        this.csrfTokenPromise = null;

        if (typeof document !== "undefined") {
          document.cookie = `${CSRF_COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        }

        if (!options._csrfRetried) {
          return this.request(
            path,
            {
              ...options,
              _csrfRetried: true,
            },
            authRetries,
          );
        }
      }

      throw new ApiError(
        data.error || data.message || "Request failed",
        data.code || "REQUEST_ERROR",
        res.status,
      );
    }

    return data;
  }
}

export const api = new ApiClient();