import { SUPABASE_ANON_KEY, SUPABASE_URL } from "./supabaseConfig";
import { createBrowserClient } from "@supabase/ssr";

// Singleton browser client — stores the session in cookies (shared with the
// server-side createServerClient) instead of localStorage.
const globalForSupabase = globalThis;

export const supabase =
  globalForSupabase.__algobuddySupabase ||
  createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);

if (process.env.NODE_ENV !== "production") {
  globalForSupabase.__algobuddySupabase = supabase;
}
