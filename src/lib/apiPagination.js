export function parsePagination(searchParams, options = {}) {
  const defaultPage = options.defaultPage ?? 1;
  const defaultLimit = options.defaultLimit ?? 20;
  const maxLimit = options.maxLimit ?? 100;

  const page = Number(searchParams.get("page") ?? defaultPage);
  const limit = Number(searchParams.get("limit") ?? defaultLimit);

  if (!Number.isInteger(page) || page < 1) {
    return { error: "page must be a positive integer" };
  }

  if (!Number.isInteger(limit) || limit < 1 || limit > maxLimit) {
    return { error: `limit must be an integer between 1 and ${maxLimit}` };
  }

  return {
    page,
    limit,
    from: (page - 1) * limit,
    to: page * limit - 1,
  };
}
