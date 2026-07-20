// Next.js route handlers run on a runtime where the global Response is
// available; jsdom doesn't provide it, so polyfill just what's used here.
if (typeof Response === "undefined" || !Response.json) {
  global.Response = class {
    constructor(body, init = {}) {
      this.body = body;
      this.status = init.status || 200;
    }
    async json() {
      return JSON.parse(this.body);
    }
    static json(data, init = {}) {
      return new Response(JSON.stringify(data), init);
    }
  };
}

jest.mock("next/headers", () => ({
  cookies: jest.fn(),
}));

jest.mock("@/lib/serverApi", () => ({
  getSupabaseServerClient: jest.fn(),
}));

import { cookies } from "next/headers";
import { getSupabaseServerClient } from "@/lib/serverApi";
import { GET } from "@/app/api/comments/[topic_id]/route";

function createSupabaseMock(result) {
  const builder = {
    select: jest.fn(() => builder),
    eq: jest.fn(() => builder),
    order: jest.fn(() => builder),
    range: jest.fn(() => Promise.resolve(result)),
  };

  return {
    builder,
    supabase: {
      from: jest.fn(() => builder),
    },
  };
}

function createGetRequest(url) {
  return { url };
}

describe("comments/[topic_id] GET route", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    cookies.mockResolvedValue({
      getAll: jest.fn(() => []),
      set: jest.fn(),
    });
  });

  it("uses the default page/limit and returns pagination metadata", async () => {
    const rows = Array.from({ length: 20 }, (_, i) => ({ id: `c${i}` }));
    const { builder, supabase } = createSupabaseMock({
      data: rows,
      error: null,
      count: 45,
    });
    getSupabaseServerClient.mockReturnValue(supabase);

    const response = await GET(
      createGetRequest("http://localhost/api/comments/topic-1"),
      { params: Promise.resolve({ topic_id: "topic-1" }) }
    );
    const body = await response.json();

    expect(supabase.from).toHaveBeenCalledWith("topic_comments");
    expect(builder.eq).toHaveBeenCalledWith("topic_id", "topic-1");
    expect(builder.range).toHaveBeenCalledWith(0, 19);
    expect(body.comments).toHaveLength(20);
    expect(body.currentPage).toBe(1);
    expect(body.totalPages).toBe(3);
  });

  it("clamps limit to the configured maximum", async () => {
    const { builder, supabase } = createSupabaseMock({
      data: [],
      error: null,
      count: 0,
    });
    getSupabaseServerClient.mockReturnValue(supabase);

    await GET(
      createGetRequest("http://localhost/api/comments/topic-1?page=2&limit=500"),
      { params: Promise.resolve({ topic_id: "topic-1" }) }
    );

    // page 2 with clamped limit (50) => range(50, 99)
    expect(builder.range).toHaveBeenCalledWith(50, 99);
  });

  it("returns a 500 error response when the Supabase query fails", async () => {
    const { supabase } = createSupabaseMock({
      data: null,
      error: { message: "connection refused" },
      count: null,
    });
    getSupabaseServerClient.mockReturnValue(supabase);

    const response = await GET(
      createGetRequest("http://localhost/api/comments/topic-1"),
      { params: Promise.resolve({ topic_id: "topic-1" }) }
    );
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.error).toBe("connection refused");
  });
});
