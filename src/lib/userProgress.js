import { supabase } from "@/lib/supabase";

const PROGRESS_UNAVAILABLE_MESSAGE =
  "Progress tracking is temporarily unavailable. Please try again later.";

function isUserProgressSchemaMissing(error) {
  if (!error) return false;

  const searchable = [
    error.code,
    error.message,
    error.details,
    error.hint,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return (
    searchable.includes("user_progress") &&
    (searchable.includes("schema cache") ||
      searchable.includes("could not find the table") ||
      searchable.includes("relation") ||
      searchable.includes("42p01") ||
      searchable.includes("pgrst205"))
  );
}

async function getModuleProgress(userId, moduleId) {
  const { data, error } = await supabase
    .from("user_progress")
    .select("is_done")
    .eq("user_id", userId)
    .eq("module_id", moduleId)
    .maybeSingle();

  if (isUserProgressSchemaMissing(error)) {
    return { data: null, error: null, unavailable: true };
  }

  return { data, error, unavailable: false };
}

async function listUserProgress(userId) {
  const { data, error } = await supabase
    .from("user_progress")
    .select("*")
    .eq("user_id", userId);

  if (isUserProgressSchemaMissing(error)) {
    return { data: [], error: null, unavailable: true };
  }

  return { data, error, unavailable: false };
}

async function saveModuleProgress({ userId, moduleId, isDone }) {
  const { error } = await supabase.from("user_progress").upsert(
    {
      user_id: userId,
      module_id: moduleId,
      is_done: isDone,
      updated_at: new Date(),
    },
    { onConflict: "user_id,module_id" },
  );

  if (isUserProgressSchemaMissing(error)) {
    return { error: null, unavailable: true };
  }

  return { error, unavailable: false };
}

export {
  PROGRESS_UNAVAILABLE_MESSAGE,
  getModuleProgress,
  isUserProgressSchemaMissing,
  listUserProgress,
  saveModuleProgress,
};
