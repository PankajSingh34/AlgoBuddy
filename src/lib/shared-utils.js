function isValidHttpUrl(value) {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function getSupabaseConfig() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) return null;
  if (!isValidHttpUrl(supabaseUrl)) return null;

  let finalUrl = String(supabaseUrl).trim();
  if (finalUrl.startsWith("http://localhost:")) {
    finalUrl = finalUrl.replace("http://localhost:", "http://127.0.0.1:");
  }

  const config = {
    supabaseUrl: finalUrl,
    supabaseAnonKey: String(supabaseAnonKey).trim(),
  };

  const serviceKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (serviceKey) {
    config.supabaseServiceKey = String(serviceKey).trim();
  }

  return config;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

// Prefixes that spreadsheet software interprets as formulas. Left unescaped, a
// CSV field beginning with one of these can execute code when opened in Excel,
// LibreOffice, or Google Sheets (formula injection).
const CSV_FORMULA_PREFIXES = ["=", "+", "-", "@", "\t", "\r"];

function sanitizeCSVField(value) {
  if (value == null) return "";
  const str = String(value);
  if (CSV_FORMULA_PREFIXES.some((prefix) => str.startsWith(prefix))) {
    // Prefix with a single quote so the value is treated as text.
    return `'${str}`;
  }
  return str;
}

function escapeCSV(value) {
  const str = sanitizeCSVField(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export { isValidHttpUrl, getSupabaseConfig, escapeHtml, escapeCSV, sanitizeCSVField };
