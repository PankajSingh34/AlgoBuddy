import { cookies } from "next/headers";
import { getSupabaseServerClient, jsonResponse, errorResponse } from "@/lib/serverApi";
import { checkRateLimit } from "@/lib/rateLimit";
import { getClientIp } from "@/lib/getClientIp";
import { parsePagination } from "@/lib/apiPagination";

function escapeIlikeSearch(value) {
  return value
    .replace(/[\\%_]/g, "\\$&")
    .replace(/[(),]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export async function GET(request) {
  try {
    const ip = getClientIp(request.headers);

    const { allowed } = await checkRateLimit(`student-jobs:${ip}`);
    if (!allowed) {
      return jsonResponse({ error: "Too many search requests. Please slow down." }, 429);
    }

    const { searchParams } = new URL(request.url);
    const search = (searchParams.get("search") || "").trim();
    const pagination = parsePagination(searchParams, { defaultLimit: 20, maxLimit: 100 });

    if (pagination.error) {
      return jsonResponse({
        error: pagination.error,
        jobs: [],
        totalPages: 0,
        currentPage: 1,
        totalJobs: 0,
      }, 400);
    }

    const { page, limit, from, to } = pagination;

    if (search && search.length < 2) {
      return jsonResponse({
        error: "Search term must be at least 2 characters.",
        jobs: [], totalPages: 0, currentPage: page, totalJobs: 0,
      }, 400);
    }

    const cookieStore = await cookies();
    const supabase = getSupabaseServerClient(cookieStore);

    let query = supabase
      .from("jobs")
      .select("*", { count: "exact" })
      .eq("status", "approved")
      .order("created_at", { ascending: false })
      .range(from, to);

    if (search) {
      const safeSearch = escapeIlikeSearch(search);
      if (!safeSearch) {
        return jsonResponse({
          error: "Search term must include searchable text.",
          jobs: [],
          totalPages: 0,
          currentPage: page,
          totalJobs: 0,
        }, 400);
      }
      const term = `${safeSearch}%`;
      query = query.or(
        `title.ilike.${term},company.ilike.${term},location.ilike.${term}`
      );
    }

    const { data: jobs, error, count } = await query;

    if (error) {
      console.error("[/api/student-jobs GET] Supabase error:", error.message);
      return jsonResponse({ jobs: [], totalPages: 0, currentPage: page, totalJobs: 0 });
    }

    return jsonResponse({
      jobs: jobs || [],
      totalPages: Math.ceil((count || 0) / limit),
      currentPage: page,
      totalJobs: count || 0,
    });
  } catch (error) {
    return errorResponse(error);
  }
}
