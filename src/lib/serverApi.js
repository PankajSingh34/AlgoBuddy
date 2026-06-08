import { createClient } from "@supabase/supabase-js";
import { ApiError, AuthError, ConfigError } from "@/lib/apiErrors";

let supabaseAdminInstance;

export function getSupabaseAdmin() {
  if (supabaseAdminInstance) return supabaseAdminInstance;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) throw new ConfigError('Supabase not configured');
  supabaseAdminInstance = createClient(url, key);
  return supabaseAdminInstance;
}

export function jsonResponse(data, status = 200, extraHeaders = {}) {
  return Response.json(data, {
    status,
    headers: { 'Content-Type': 'application/json', ...extraHeaders },
  });
}

export function errorResponse(error) {
  const code = error.code || 'INTERNAL_ERROR';
  const status = error.status || 500;
  const message = error.message || 'Internal server error';
  return Response.json(
    { error: message, code },
    { status, headers: { 'Content-Type': 'application/json' } },
  );
}
