const DEFAULT_MAX_LIMIT = 100;

function parsePositiveInt(value, fallback) {
  const parsed = parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed < 1) {
    return fallback;
  }
  return parsed;
}

/**
 * Parse and clamp page/limit query params for Supabase .range() pagination.
 * @param {URLSearchParams} searchParams
 * @param {{ defaultLimit?: number, maxLimit?: number }} [options]
 * @returns {{ page: number, limit: number, skip: number }}
 */
export function parsePaginationParams(searchParams, options = {}) {
  const defaultLimit = options.defaultLimit ?? 20;
  const maxLimit = options.maxLimit ?? DEFAULT_MAX_LIMIT;

  const page = parsePositiveInt(searchParams.get("page"), 1);
  const rawLimit = parseInt(searchParams.get("limit"), 10);
  const limit = Number.isFinite(rawLimit)
    ? Math.min(Math.max(rawLimit, 1), maxLimit)
    : defaultLimit;
  const skip = (page - 1) * limit;

  return { page, limit, skip };
}
