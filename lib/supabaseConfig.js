function readTrimmedEnv(value) {
  return typeof value === "string" ? value.trim() : "";
}

function isHttpUrl(value) {
  if (!value) return false;

  try {
    const parsedUrl = new URL(value);
    return parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:";
  } catch {
    return false;
  }
}

function buildMissingMessage(missingVariables, scope) {
  const joinedVariables = missingVariables.join(", ");
  const action =
    scope === "service"
      ? "Create .env.local from EnvExample.txt and add your Supabase URL plus service role key."
      : "Create .env.local from EnvExample.txt and add your Supabase URL and anon key.";

  return `Supabase is not configured for ${scope}. Missing or invalid environment variables: ${joinedVariables}. ${action}`;
}

export function getSupabaseConfig() {
  const supabaseUrl = readTrimmedEnv(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const supabaseAnonKey = readTrimmedEnv(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  const supabaseServiceKey = readTrimmedEnv(process.env.SUPABASE_SERVICE_KEY);

  const missingPublicVariables = [];
  if (!isHttpUrl(supabaseUrl)) {
    missingPublicVariables.push("NEXT_PUBLIC_SUPABASE_URL");
  }
  if (!supabaseAnonKey) {
    missingPublicVariables.push("NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }

  const missingServiceVariables = [...missingPublicVariables];
  if (!supabaseServiceKey) {
    missingServiceVariables.push("SUPABASE_SERVICE_KEY");
  }

  return {
    supabaseUrl,
    supabaseAnonKey,
    supabaseServiceKey,
    publicConfigured: missingPublicVariables.length === 0,
    serviceConfigured: missingServiceVariables.length === 0,
    missingPublicVariables,
    missingServiceVariables,
    publicMessage:
      missingPublicVariables.length === 0
        ? ""
        : buildMissingMessage(missingPublicVariables, "client"),
    serviceMessage:
      missingServiceVariables.length === 0
        ? ""
        : buildMissingMessage(missingServiceVariables, "service"),
  };
}
