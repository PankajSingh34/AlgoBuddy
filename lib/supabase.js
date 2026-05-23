import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseConfig } from "@/lib/supabaseConfig";

const { supabaseUrl, supabaseAnonKey, publicConfigured, publicMessage } =
  getSupabaseConfig();

function createUnavailableSupabaseClient(message) {
  const noopQuery = new Proxy(
    {},
    {
      get(_target, property) {
        if (property === "then") {
          return (onFulfilled, onRejected) =>
            Promise.resolve({ data: [], error: null }).then(
              onFulfilled,
              onRejected,
            );
        }

        if (property === "catch") {
          return (...args) => Promise.resolve({ data: [], error: null }).catch(...args);
        }

        if (property === "finally") {
          return (...args) => Promise.resolve({ data: [], error: null }).finally(...args);
        }

        return () => noopQuery;
      },
    },
  );

  return {
    auth: {
      async getUser() {
        return { data: { user: null }, error: null };
      },
      async getSession() {
        return { data: { session: null }, error: null };
      },
      onAuthStateChange() {
        return {
          data: {
            subscription: {
              unsubscribe() {},
            },
          },
        };
      },
      async signInWithOAuth() {
        return { data: null, error: new Error(message) };
      },
      async signInWithPassword() {
        return { data: null, error: new Error(message) };
      },
      async signOut() {
        return { data: null, error: new Error(message) };
      },
    },
    from() {
      return noopQuery;
    },
    rpc() {
      return Promise.resolve({ data: null, error: null });
    },
  };
}

// Singleton browser client — stores the session in cookies (shared with the
// server-side createServerClient) instead of localStorage.
const globalForSupabase = globalThis;

export const supabase =
  globalForSupabase.__algobuddySupabase ||
  (publicConfigured
    ? createBrowserClient(supabaseUrl, supabaseAnonKey)
    : createUnavailableSupabaseClient(publicMessage));

if (process.env.NODE_ENV !== "production") {
  globalForSupabase.__algobuddySupabase = supabase;
}
